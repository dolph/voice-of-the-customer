'use strict'

var Async = require('async')
var discoveryUtils = require('../utils/discovery-utils')
var vocContentUtils = require('../utils/voc-content-utils')

var app = require('../../server/server')

const BATCHSIZE = 10

module.exports = function (Discovery) {
  Discovery.addContent = function (cb) {
    var Voccontent = app.models.vocContent
    var vocContentDB = vocContentUtils.getVocContentDBConnection(Voccontent.getDataSource().settings.url)
    var addDocumentsQueue = Async.queue(discoveryUtils.addDocumentsBatchTask, 1)
    // Indication that the job is completed.
    addDocumentsQueue.drain(() => {
      console.log('WDS Load Completed.')
    })
    // Query Cloudant for all the documents.  Limit is 10 to support the free version of Discovery loading limit.
    vocContentDB.view('voc-content', 'source-url-view', { reduce: true }, (err, success) => {
      if (err) {
        cb(err)
      } else {
        var count = success.rows[0].value
        var skip = 989
        var tasks = 0
        while (skip < count) {
          addDocumentsQueue.push({ limit: BATCHSIZE, skip: skip }, (err) => {
            if (err) {
              console.log('Error in task. ' + err)
            }
          })
          tasks++
          skip += BATCHSIZE
        }
        cb(null, tasks)
      }
    })
  }
}
