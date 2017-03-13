'use strict'

var app = require('../../server/server')

var Crawler = require('crawler')
var Cheerio = require('cheerio')
var url = require('url')
var _ = require('lodash')
var Async = require('async')
var Cloudant = require('cloudant')

const Browser = require('zombie')
const browser = new Browser()

// Default options
var defaults = {
  seed: '',
  testMode: false,
  rateLimit: 500,
  maxConnections: 2,
  stayOnDomain: true,
  acceptExpr: [],
  rejectExpr: [],
  extractExpr: [],
  extractTemplate: {}
}

var VocCrawler = function () {}

VocCrawler.prototype.init = function (_options, cb) {
  var cloudant = new Cloudant({account: process.env.CLOUDANT_USERNAME, password: process.env.CLOUDANT_PASSWORD})
  this.vocContentDB = cloudant.db.use(process.env.CLOUDANT_VOC_CONTENT_DB_NAME)

  this.options = {}
  this.status = {
    crawled: 0,
    accepted: 0,
    filtered: 0,
    rejected: 0,
    extracted: 0,
    saved: 0,
    currentUrl: '',
    started: new Date(),
    ended: new Date(),
    active: false,
    cancelled: false,
    crawlQueueSize: 0,
    extractQueueSize: 0,
    urlCacheSize: 0,
    urlCacheBytes: 0,
    bulkSaveBufferSize: 0,
    duplicates: 0,
    errors: []
  }
  // Regex Cache
  this.acceptRegex = []
  this.rejectRegex = []
  this.extractRegex = []
  // urlCache for holding some urls to avoid duplicate processing
  this.urlCache = {}
  // The base url, determined from the seed, that is used to determine the domain this crawl is on
  this.baseUrl
  // The crawler instance
  this.crawler
  // The output queue to write the content to cloudant asyncrounsly
  this.outputQueue
  // The output Counter
  this.outCount = 0
  // Reference to the voc-content model for saving the content to cloudant
  // Get a reference to the voc-content model
  this.VocContent = app.models['voc-content']
  // A flag indicating whether a crawl is active
  // Flag to indicate that the crawl was cancelled
  this.cancelled = false
  // Merge the options with the defaults
  this.options = _.defaults(_options, defaults)
  // Bulk Save Buffer
  this.bulkSaveBuffer = {
    docs: []
  }
  var expr
  var regex
  // Compile all the regex expression
  for (expr of this.options.acceptExpr) {
    regex = new RegExp(expr)
    this.acceptRegex.push(regex)
  }
  for (expr of this.options.rejectExpr) {
    regex = new RegExp(expr)
    this.rejectRegex.push(regex)
  }
  for (expr of this.options.extractExpr) {
    regex = new RegExp(expr)
    this.extractRegex.push(regex)
  }
  // Create a queue for writing the output files
  this.outputQueue = Async.queue(this.processPageContentTask, 1)
  // Create a crawler that will start with the seed url
  var self = this
  this.crawler = new Crawler({
    rateLimit: this.options.rateLimit,
    maxConnections: this.options.maxConnections,
    // This will be called for each crawled page
    callback: pageHandler
  })

  function pageHandler (err, res, done) {
    try {
      if (err) {
        self.status.errors.push(new Date() + ': ' + err)
        done()
      } else {
        self.status.crawled += 1
        self.status.crawlQueueSize = self.crawler.queueSize
        if (self.cancelled) {
          done()
          return
        }
        if (self.options.max && self.options.max < self.status.saved) {
          self.status.errors.push(new Date() + ': ' + 'Cancelling crawl due to maximum output count reached.')
          self.status.cancelled = true
          self.cancelled = true
        }
        // This is the cheerio context
        var $ = res.$
        // extract the url being processed
        var fromUrl = res.request.uri.href
        self.status.currentUrl = fromUrl
        // Find all the links on the page
        var links = $('body').find('a')
        links.each((idx, ele) => {
          var link = $(ele).attr('href')
          if (link) {
            var linkUrl = getLinkUrl(self.baseUrl, link)
            if (self.isAccepted(linkUrl)) {
              // Check duplicate link
              if (self.onHost(linkUrl) && !self.urlCache[linkUrl]) {
                // Add this url to the cache to not process it again
                self.urlCache[linkUrl] = true
                self.status.urlCacheSize = Object.keys(self.urlCache).length
                self.status.urlCacheBytes = JSON.stringify(self.urlCache).length
                // Is this url in the white list.  These are urls that I want to accept.
                self.status.accepted += 1
                // Loop over ALL the ignores and check if it should be ignored
                if (!self.isRejected(linkUrl)) {
                  self.crawler.queue(linkUrl)
                  // Check if we are interested in these pages
                  if (self.isExtractable(linkUrl)) {
                    self.outputQueue.push({ linkUrl: linkUrl, self: self })
                  }
                } else {
                  self.status.rejected += 1
                }
              } else {
                self.status.filtered += 1
              }
            }
          }
        }) // Loop over all the links on the page
        done()
      }
    } catch (err) {
      self.status.errors.push(new Date() + ': ' + err)
    }
  }

  // Message when the crawler is done
  this.crawler.on('drain', () => {
    // Save any meta data that might still be in the buffer
    this.saveMetaData(null, false).then()
    this.active = false
    this.status.active = false
    this.status.ended = new Date()
    console.log('Crawler completed...')
    console.log(JSON.stringify(this.status, null, 4))
  })
  cb()
}

VocCrawler.prototype.start = function () {
  // Queue just one URL, with default callback
  var seedUrl = url.parse(this.options.seed)
  this.baseUrl = seedUrl.protocol + '//' + seedUrl.host
  this.active = true
  this.status.active = true
  this.crawler.queue(this.options.seed)
}

VocCrawler.prototype.isActive = function () {
  return this.active
}

VocCrawler.prototype.cancel = function () {
  this.status.errors.push(new Date() + ': ' + 'Crawl is being cancelled. Draining the queues...')
  this.cancelled = true
  this.status.cancelled = true
}

VocCrawler.prototype.getStatus = function () {
  return this.status
}

VocCrawler.prototype.processPageContentTask = function (task, cb) {
  var self = task.self
  var linkUrl = task.linkUrl
  var testMode = self.options.testMode
  // Render the page before we try to extract the template values
  self.renderPage(linkUrl, (err, content) => {
    if (err) {
      self.status.errors.push(new Date() + ': ' + err)
      cb(err)
    } else {
      self.extractMetaData(content, linkUrl, (err, metadata) => {
        if (err) {
          self.status.errors.push(new Date() + ': ' + err)
          cb(err)
        } else {
          self.status.extracted += 1
          self.status.extractQueueSize = self.outputQueue.length()
          self.checkForDuplicate(metadata).then(() => {
            if (!testMode) {
              self.saveMetaData(metadata, false).then(() => cb(), (err) => cb(err))
            } else {
              self.status.saved += 1
              cb()
            }
          }, (err) => {
            if (err) {
              // This is a duplicate, so ignoring it.
              cb()
            }
          })
        }
      })
    }
  })
}

VocCrawler.prototype.checkForDuplicate = function (metadata) {
  var self = this
  return new Promise(function (resolve, reject) {
    try {
      let selector = {
        selector: {
          title: metadata.title
        },
        fields: ['_id', 'text']
      }
      self.vocContentDB.find(selector, (err, success) => {
        if (err) {
          resolve()
        } else {
          if (success.docs.length === 0) {
            resolve()
          } else {
            if (success.docs[0].text === metadata.text) {
              self.status.duplicates++
              reject(success)
            } else {
              resolve()
            }
          }
        }
      })
    } catch (err) {
      self.status.errors.push(new Date() + ': ' + err)
      reject(err)
    }
  })
}

VocCrawler.prototype.saveMetaData = function (metadata, force) {
  var self = this
  return new Promise(function (resolve, reject) {
    try {
      if (metadata) {
        self.bulkSaveBuffer.docs.push(metadata)
      }
      self.status.bulkSaveBufferSize = self.bulkSaveBuffer.docs.length
      if (self.bulkSaveBuffer.docs.length > 10 || force) {
        // Save the meta data to Cloudant
        self.vocContentDB.bulk(self.bulkSaveBuffer, (err, result) => {
          if (err) {
            self.status.errors.push(new Date() + ': ' + err)
            reject(err)
          } else {
            self.outCount++
            self.status.saved += result.length
            self.bulkSaveBuffer.docs = []
            resolve()
          }
        })
      } else {
        resolve()
      }
    } catch (err) {
      self.status.errors.push(new Date() + ': ' + err)
      reject(err)
    }
  })
}

function getLinkUrl (baseUrl, link) {
  var linkUrl = baseUrl + link
  if (link.indexOf('http') === 0) {
    linkUrl = link
  }
  return linkUrl
}

VocCrawler.prototype.isAccepted = function (linkUrl) {
  var acceptLink = false
  for (var accept of this.acceptRegex) {
    if (linkUrl.match(accept)) {
      acceptLink = true
      break
    }
  }
  return acceptLink
}

VocCrawler.prototype.isExtractable = function (linkUrl) {
  var extractLink = false
  for (var extract of this.extractRegex) {
    if (linkUrl.match(extract) && linkUrl.match(extract)[0] === linkUrl) {
      extractLink = true
    }
  }
  return extractLink
}

VocCrawler.prototype.isRejected = function (linkUrl) {
  var rejectLink = false
  for (var reject of this.rejectRegex) {
    if (linkUrl.match(reject)) {
      rejectLink = true
      break
    }
  }
  return rejectLink
}

VocCrawler.prototype.onHost = function (linkUrl) {
  var hostCheck = true
  var theUrl = url.parse(linkUrl)
  var hostUrl = url.parse(this.baseUrl)
  if (this.options.stayOnDomain && theUrl.hostname !== hostUrl.hostname) {
    hostCheck = false
  }
  return hostCheck
}

VocCrawler.prototype.extractMetaData = function (content, linkUrl, cb) {
  let $content = Cheerio.load(content)
  let metadata = {
    source_url: linkUrl,
    tags: this.options.tags ? this.options.tags : []
  }
  for (let selector in this.options.extractTemplate) {
    let selected = $content(this.options.extractTemplate[selector])
    if (selected) {
      if (selector === 'contact_date') {
        let dateTime = []
        selected.each(function (i, el) {
          if (dateTime.length > 1) {
            return false
          }
          dateTime.push(Cheerio(this).text().trim())
        })
        let text = dateTime.join(' ')
        let cleaned = text.replace(/\t/g, '').replace(/\n/g, '').trim()
        // Also remove all special chars from the text and only leave ASCII behind
        cleaned = cleaned.replace(/[^\x00-\x7F]/g, '')
        let dt = new Date(cleaned)
        metadata[selector] = dt
      } else {
        let result = $content(this.options.extractTemplate[selector]).first()
        let text = result.text()
        let cleaned = text.replace(/\t/g, '').replace(/\n/g, '').trim()
        // Also remove all special chars from the text and only leave ASCII behind
        cleaned = cleaned.replace(/[^\x00-\x7F]/g, '')
        metadata[selector] = cleaned
      }
    }
  }
  cb(null, metadata)
}

// Use Zombie to actually render the page like it's in a browser.
// If you don't do this, you will get a page with out many tags.
VocCrawler.prototype.renderPage = function (linkUrl, cb) {
  browser.fetch(linkUrl)
    .then((response) => {
      if (response.status === 200) {
        response.arrayBuffer()
          .then(Buffer)
          .then((buffer) => {
            cb(null, buffer.toString('utf8'))
          })
      } else {
        cb('Http error: ' + response.status)
      }
    })
    .catch((error) => {
      cb('Network error: ' + error)
    })
}

module.exports = VocCrawler
