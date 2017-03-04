'use strict'

var Async = require('async')

var vocContentUtils = require('../utils/voc-content-utils')

const BATCHSIZE = 100

module.exports = function (Voccontent) {
  Voccontent.enrichContent = function (cb) {
    var vocContentDB = vocContentUtils.getVocContentDBConnection(Voccontent.getDataSource().settings.url)
    var enrichmentQueue = Async.queue(vocContentUtils.enrichContentBatchTask, 1)
    enrichmentQueue.drain(() => {
      console.log('Enrichment Completed.')
    })
    vocContentDB.view('voc-content', 'tags-view', { reduce: true }, (err, success) => {
      if (err) {
        cb(err)
      } else {
        var count = success.rows[0].value
        var skip = 0
        var tasks = 0
        while (skip < count) {
          enrichmentQueue.push({ limit: BATCHSIZE, skip: skip }, (err) => {
            if (err) {
              console.log('Error in task. ' + err)
            }
          })
          tasks++
          skip += 100
        }
        cb(null, tasks)
      }
    })
  }

  Voccontent.exportAsHtml = function (cb) {
    var vocContentDB = vocContentUtils.getVocContentDBConnection(Voccontent.getDataSource().settings.url)

    var outputQueue = Async.queue(vocContentUtils.writeHtmlTask, 1)
    outputQueue.drain(() => {
      console.log('Writing of HTML Completed.')
    })
    var options = {
      include_docs: true,
      reduce: false,
      // startkey: ['Wireless', 'Features & Services', 'Data & Messaging Features, Internet Tethering'],
      // startkey: ['Wireless', 'Features & Services', 'Network Coverage'],
      // startkey: ['Wireless', 'Phones & Devices', 'Android'],
      // startkey: ['Wireless', 'Phones & Devices', 'Apple'],
      // startkey: ['Wireless', 'Wireless Account & Billing', 'Wireless Account'],
      startkey: ['Wireless', 'Wireless Account & Billing', 'Wireless Billing'],
      inclusive_end: false,
      limit: 200
    }
    vocContentDB.view('voc-content', 'tags-view', options, (err, success) => {
      if (err) {
        console.log(err)
      } else {
        for (let row of success.rows) {
          outputQueue.push({ doc: row.doc }, (err) => {
            if (err) {
              console.log(err)
            }
          })
        }
      }
    })
    cb(null, { 'status': 'HTML Export Instanciated.' })
  }
}
