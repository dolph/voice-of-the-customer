'use strict'

var Async = require('async')

var vocContentUtils = require('../utils/voc-content-utils')

const BATCHSIZE = 25
const SOURCES = ['forum', 'call', 'chat']

module.exports = function (Voccontent) {
  Voccontent.preEnrichContent = function (cb) {
    var vocContentDB = vocContentUtils.getVocContentDBConnection(Voccontent.getDataSource().settings.url)
    var preEnrichmentQueue = Async.queue(vocContentUtils.preEnrichContentTask, 1)
    preEnrichmentQueue.drain(() => {
      console.log('Pre-Enrichment Completed.')
    })
    vocContentDB.view('voc-content', 'all-docs-view', { reduce: true }, (err, success) => {
      if (err) {
        cb(err)
      } else {
        var count = success.rows[0].value
        var skip = 0
        var tasks = 0
        var sourceIdx = 0
        while (skip < count) {
          preEnrichmentQueue.push({ limit: BATCHSIZE, skip: skip, source: SOURCES[sourceIdx] }, (err) => {
            if (err) {
              console.log('Error in task. ' + err)
            }
          })
          sourceIdx++
          if (sourceIdx > 2) {
            sourceIdx = 0
          }
          tasks++
          skip += BATCHSIZE
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
