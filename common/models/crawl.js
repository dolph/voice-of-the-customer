'use strict'

var VocCrawler = require('../utils/voc-crawler')

var vocCrawler = new VocCrawler()

module.exports = function (Crawl) {
  Crawl.start = function (options, cb) {
    if (vocCrawler.isActive()) {
      cb(null, { 'status': 'Crawler already active.' })
    } else {
      vocCrawler.init(options, function () {
        vocCrawler.start()
        cb(null, { 'status': 'Crawler started.' })
      })
    }
  }

  Crawl.cancel = function (cb) {
    if (vocCrawler.isActive()) {
      vocCrawler.cancel()
      cb(null, { 'status': 'Crawler was cancelled.  It will take a few minutes to drain the queue.' })
    } else {
      cb(null, { 'status': 'No crawler active.' })
    }
  }

  Crawl.status = function (cb) {
    if (vocCrawler.isActive()) {
      var status = vocCrawler.getStatus()
      cb(null, status)
    } else {
      cb(null, { 'status': 'No crawler active.' })
    }
  }
}
