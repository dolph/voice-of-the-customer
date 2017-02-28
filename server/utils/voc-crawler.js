'use strict'

var Crawler = require('crawler')
var Cheerio = require('cheerio')
var url = require('url')
var _ = require('lodash')
var fs = require('fs')
var Async = require('async')

const Browser = require('zombie')
const browser = new Browser()

var options = {
  seed: '',
  testMode: false,
  rateLimit: 1000,
  maxConnections: 1,
  outPath: './crawler',
  outputType: 'json',
  stayOnDomain: true,
  acceptExpr: [],
  rejectExpr: [],
  extractExpr: [],
  extractTemplate: {},
  enableSummary: false
}
var acceptRegex = []
var rejectRegex = []
var extractRegex = []

var urlCache = {}
var baseUrl
var outputQueue
var crawler
var summaryStream

var fileNum = 1

var VocCrawler = function () {}

VocCrawler.prototype.init = function (_options) {
  options = _.defaults(_options, options)
  var expr
  var regex
  // Compile all the regex expression
  for (expr of options.acceptExpr) {
    regex = new RegExp(expr)
    acceptRegex.push(regex)
  }
  for (expr of options.rejectExpr) {
    regex = new RegExp(expr)
    rejectRegex.push(regex)
  }
  for (expr of options.extractExpr) {
    regex = new RegExp(expr)
    extractRegex.push(regex)
  }
  // Create a queue for writing the output files
  outputQueue = Async.queue(processPageContent, 1)
  // Create a crawler that will start with the seed url
  crawler = new Crawler({
    rateLimit: options.rateLimit,
    maxConnections: options.maxConnections,
    // This will be called for each crawled page
    callback: processCrawlerResult
  })

  crawler.on('drain', function () {
    console.log('Crawler completed...')
  })

  if (options.enableSummary) {
    summaryStream = fs.createWriteStream('summary.csv', {
      flags: 'a' // 'a' means appending (old data will be preserved)
    })
  }
}

VocCrawler.prototype.start = function () {
  // Queue just one URL, with default callback
  var seedUrl = url.parse(options.seed)
  baseUrl = seedUrl.protocol + '//' + seedUrl.host
  crawler.queue(options.seed)
}

function printSummary (summary) {
  if (!summary.inExtractList) {
    return
  }
  var out = ''
  var outCnt = 1
  var fieldCnt = Object.keys(summary).length
  for (var field in summary) {
    if (outCnt < fieldCnt) {
      out += summary[field] + ','
    } else {
      out += summary[field] + '\n'
    }
    outCnt++
  }
  summaryStream.write(out)
}

var processCrawlerResult = function (err, res, done) {
  if (err) {
    console.log(err)
  } else {
    // This is the cheerio context
    var $ = res.$
    // extract the url being processed
    var fromUrl = res.request.uri.href
    // Find all the links on the page
    var links = $('body').find('a')
    links.each(function (idx, ele) {
      var link = $(ele).attr('href')
      if (link) {
        var linkUrl = getLinkUrl(baseUrl, link)
        var domainCheck = true
        if (options.stayOnDomain && !linkUrl.startsWith(baseUrl)) {
          domainCheck = false
        }
        // define a summary object
        var summary = {
          fromUrl: fromUrl,
          link: linkUrl,
          inWhiteList: false,
          inIgnoreList: true,
          inExtractList: false,
          filePath: ''
        }
        // Check duplicate link
        if (domainCheck && !urlCache[linkUrl]) {
          // Add this url to the cache to not process it again
          urlCache[linkUrl] = true
          // Is this url in the white list.  These are urls that I want to accept.
          var acceptLink = false
          for (var accept of acceptRegex) {
            if (linkUrl.match(accept)) {
              acceptLink = true
              break
            }
          }
          if (acceptLink) {
            summary.acceptLink = true
            // Loop over ALL the ignores and check if it should be ignored
            var rejectLink = false
            for (var reject of rejectRegex) {
              if (linkUrl.match(reject)) {
                rejectLink = true
                break
              }
            }
            if (!rejectLink) {
              summary.rejectLink = false
              crawler.queue(linkUrl)
              // Check if we are interested in these pages
              var extractLink = false
              for (var extract of extractRegex) {
                if (linkUrl.match(extract) && linkUrl.match(extract)[0] === linkUrl) {
                  extractLink = true
                }
              }
              if (extractLink) {
                outputQueue.push({ linkUrl: linkUrl, summary: summary, testMode: options.testMode })
              }
            }
          }
        }
      }
    })
  }
  done()
}

var processPageContent = function (task, cb) {
  var linkUrl = task.linkUrl
  var summary = task.summary
  var testMode = task.testMode
  // Render the page before we try to extract the template values
  renderPage(linkUrl, function (err, content) {
    if (err) {
      console.log(err)
      cb(err)
    } else {
      extractMetaData(content, linkUrl, function (err, metadata) {
        if (err) {
          console.log(err)
          cb(err)
        } else {
          summary.inExtractList = true
          let filePath = options.outPath + 'file_' + fileNum + '.' + options.outputType
          summary.filePath = filePath
          printSummary(summary)
          if (!testMode) {
            if (options.outputType === 'json') {
              saveMetaDataAsJson(metadata, function (err) {
                if (err) {
                  cb(err)
                } else {
                  cb()
                }
              })
            }
            if (options.outputType === 'html') {
              saveMetaDataAsHtml(metadata, function (err) {
                if (err) {
                  cb(err)
                } else {
                  cb()
                }
              })
            }
          }
        }
      })
    }
  })
}

function saveMetaDataAsJson (metadata, cb) {
  let filePath = options.outPath + 'file_' + fileNum + '.json'
  // console.log(filePath)
  fs.writeFileSync(filePath, JSON.stringify(metadata, null, 2))
  fileNum++
  cb()
}

function saveMetaDataAsHtml (metadata, cb) {
  // Convert the json to HTML
  htmlFromMetadata(metadata, function (err, outHtml) {
    if (err) {
      console.log(err)
      cb(err)
    } else {
      let filePath = options.outPath + 'file_' + fileNum + '.html'
      // console.log(filePath)
      fs.writeFileSync(filePath, outHtml)
      fileNum++
      cb()
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

function htmlFromMetadata (metadata, cb) {
  var outHtml = '<!DOCTYPE html><html><body>'
  outHtml += '<title>' + metadata.title + '</title>\n'
  outHtml += '<h3>' + metadata.title + '</h3>\n'
  outHtml += '<p>Contact Date: ' + metadata.contact_date + '</p>\n'
  outHtml += '<p>Id: ' + metadata.customer_id + '</p>\n'
  outHtml += '<p>' + metadata.message_content + '</p>\n'
  outHtml += '</body></html>'
  cb(null, outHtml)
}

function extractMetaData (content, linkUrl, cb) {
  let $content = Cheerio.load(content)
  let metadata = {
    source_url: linkUrl
  }
  for (let selector in options.extractionTemplate) {
    let result = $content(options.extractionTemplate[selector]).first()
    let text = result.text()
    let cleaned = text.replace(/\t/g, '').replace(/\n/g, '').trim()
    metadata[selector] = cleaned
  }
  cb(null, metadata)
}

// Use Zombie to actually render the page like it's in a browser.
// If you don't do this, you will get a page with out many tags.
function renderPage (linkUrl, cb) {
  browser.fetch(linkUrl)
    .then(function (response) {
      if (response.status === 200) {
        response.arrayBuffer()
          .then(Buffer)
          .then(function (buffer) {
            cb(null, buffer.toString('utf8'))
          })
      } else {
        cb('Http error: ' + response.status)
      }
    })
    .catch(function (error) {
      cb('Network error: ' + error)
    })
}

// Implementation that will go somewhere else later
var x = new VocCrawler()
x.init({
  testMode: false,
  seed: 'https://forums.att.com/t5/TV-Forum/ct-p/att_tv',
  stayOnDomain: true,
  acceptExpr: ['^http.*/t5/DIRECTV/.*', '^http.*/t5/U-verse-TV/.*', '^http.*/t5/DIRECTV-Account/bd-p/.*', '^http.*/t5/DIRECTV-Account/.*/(td-p|m-p)/.*',
    '^http.*/t5/U-verse-TV-Account/.*/(td-p|m-p)/.*'],
  rejectExpr: ['^http.*/m-p/[0-9]+/.*', '^http.*/m-p/[0-9]+\\?.*', '^http.*/m-p/[0-9]+#.*', '^http.*\\?.*'],
  extractExpr: ['^http.*/(td-p|m-p)/.*[0-9][^/.]'],
  extractTemplate: {
    title: '.lia-message-subject > h5',
    contact_date: '.lia-message-posted-on > span',
    customer_id: '.lia-user-name-link > span',
    message_content: '.lia-message-body-content'
  },
  outPath: '/Users/wjvanzyl/repositories/voice-of-the-customer-env/voice-of-the-customer-app/crawl/',
  outputType: 'json',
  enableSummary: true
})
x.start()

// module.exports = new VocCrawler()
