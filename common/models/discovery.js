'use strict'

var Async = require('async')
var discoveryUtils = require('../utils/discovery-utils')
var wdsQueryUtils = require('../utils/wds-query-utils')
var vocContentUtils = require('../utils/voc-content-utils')
var os = require('os')

var app = require('../../server/server')

const BATCHSIZE = 10

module.exports = function (Discovery) {
  Discovery.getBrandPerceptionOverTime = function (startDt, endDt, cb) {
    wdsQueryUtils.getTimeSeriesCounts('1month', function (err, totals) {
      if (err) {
        cb(err)
      } else {
        let queryOptions = {
          environment_id: process.env.DISCOVERY_ENV_ID,
          collection_id: process.env.DISCOVERY_COLLECTION_ID,
          count: 1,
          aggregation: 'term(enriched_text.docSentiment.type).timeslice(contact_date,1month)'
        }
        wdsQueryUtils.query(queryOptions, (err, data) => {
          if (err) {
            cb(err)
          } else {
            let aggregation = data.aggregations[0].results
            let positiveByDate
            for (let sentiment of aggregation) {
              if (sentiment.key === 'positive') {
                positiveByDate = sentiment.aggregations[0].results
                break
              }
            }
            var response = [
              ['Months'],
              ['Percentage']
            ]
            if (positiveByDate) {
              for (var byDate of positiveByDate) {
                if (totals[byDate.key]) {
                  let dt = new Date(byDate.key)
                  response[0].push(dt)
                  console.log('devide ' + byDate.matching_results + ' by ' + totals[byDate.key])
                  let percentage = Math.round((byDate.matching_results / totals[byDate.key]) * 100)
                  response[1].push(percentage)
                }
              }
            }
            cb(null, response)
          }
        })
      }
    })
  }

  Discovery.addContent = function (cb) {
    var Voccontent = app.models.vocContent
    var vocContentDB = vocContentUtils.getVocContentDBConnection(Voccontent.getDataSource().settings.url)
    var addDocumentsQueue = Async.queue(discoveryUtils.addDocumentsBatchTask, 1)
    // Indication that the job is completed.
    addDocumentsQueue.drain(() => {
      console.log('WDS Load Completed.')
    })
    console.log('Temp files will be saved to ' + os.tmpdir())
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
