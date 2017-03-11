'use strict'

var Async = require('async')
var discoveryUtils = require('../utils/discovery-utils')
var wdsQueryUtils = require('../utils/wds-query-utils')
var vocContentUtils = require('../utils/voc-content-utils')
var os = require('os')

var app = require('../../server/server')

const BATCHSIZE = 10

module.exports = function (Discovery) {
  Discovery.getMostPopularFeatures = function (startDt, endDt, count, cb) {
    let filter = getDateFilter(startDt, endDt)
    let params = {
      filter: filter,
      count: 1,
      aggregation: 'nested(enriched_text.entities).filter(enriched_text.entities.type:"Physical_Feature").term(enriched_text.entities.text,count:' + count + ')'
    }
    wdsQueryUtils.getCounts(params).then((result) => {
      let termResults = wdsQueryUtils.extractResultsForType(result.aggregations[0], 'term')
      let total = termResults.matching_results
      let products = termResults.results
      var response = [
      ]
      for (let product of products) {
        let p = {
          name: product.key,
          count: product.matching_results,
          percentage: Math.round(((product.matching_results / total) * 100).toFixed(2))
        }
        response.push(p)
      }
      cb(null, response)
    })
  }

  Discovery.getMostPopularTopics = function (startDt, endDt, count, cb) {
    let filter = getDateFilter(startDt, endDt)
    let params = {
      filter: filter,
      count: 1,
      aggregation: 'nested(enriched_text.concepts).term(enriched_text.concepts.text,count:' + count + ')'
    }
    wdsQueryUtils.getCounts(params).then((result) => {
      let termResults = wdsQueryUtils.extractResultsForType(result.aggregations[0], 'term')
      let total = termResults.matching_results
      let products = termResults.results
      var response = [
      ]
      for (let product of products) {
        let p = {
          name: product.key,
          count: product.matching_results,
          percentage: Math.round(((product.matching_results / total) * 100).toFixed(2))
        }
        response.push(p)
      }
      cb(null, response)
    })
  }

  Discovery.getProductMentions = function (startDt, endDt, sentiment, count, cb) {
    let filter = getDateFilter(startDt, endDt)
    if (!count) {
      count = 5
    }
    let params = {
      filter: filter,
      count: 1,
      aggregation: 'nested(enriched_text.entities)' +
        '.filter(enriched_text.entities.type:"Product"' +
        ',enriched_text.entities.sentiment.type:"' + sentiment + '")' +
        '.term(enriched_text.entities.text,count:' + count + ')'
    }
    wdsQueryUtils.getCounts(params).then((result) => {
      let termResults = wdsQueryUtils.extractResultsForType(result.aggregations[0], 'term')
      let total = termResults.matching_results
      let products = termResults.results
      var response = [
      ]
      for (let product of products) {
        let p = {
          name: product.key,
          count: product.matching_results,
          percentage: Math.round(((product.matching_results / total) * 100).toFixed(2))
        }
        response.push(p)
      }
      cb(null, response)
    })
  }

  Discovery.getCurrentBrandSentiment = function (startDt, endDt, cb) {
    let filter = getDateFilter(startDt, endDt)
    let params = {
      filter: filter,
      aggregation: 'term(enriched_text.docSentiment.type)',
      count: 1
    }
    wdsQueryUtils.getCounts(params).then((result) => {
      // console.log(JSON.stringify(result))
      let termResults = wdsQueryUtils.extractResultsForType(result, 'term')
      let total = termResults.matching_results
      let sentiments = termResults.results
      var response = [
      ]
      for (let sentiment of sentiments) {
        let rounded = (sentiment.matching_results / total).toFixed(2)
        let percentage = Math.round(rounded * 100)
        response.push([sentiment.key, percentage])
      }
      cb(null, response)
    }, (err) => cb(err))
  }

  Discovery.getBrandPerceptionOverTime = function (interval, sentiment, startDt, endDt, cb) {
    let filter = getDateFilter(startDt, endDt)
    let aggregation = 'timeslice(contact_date,' + interval + ').nested(enriched_text.docSentiment).term(enriched_text.docSentiment.type)'
    let params = {
      aggregation: aggregation,
      filter: filter
    }
    wdsQueryUtils.getCounts(params).then((result) => {
      let timesliceResults = wdsQueryUtils.extractResultsForType(result.aggregations[0], 'timeslice')
      let sentimentByIntervals = timesliceResults.results
      var response = [
        ['Date'],
        ['Percentage']
      ]

      for (let sentimentByInterval of sentimentByIntervals) {
        let total = sentimentByInterval.matching_results
        let dt = new Date(sentimentByInterval.key)
        let count = 0
        let sentimentResults = wdsQueryUtils.extractResultsForType(sentimentByInterval.aggregations[0], 'term')
        for (let sentiments of sentimentResults.results) {
          if (sentiments.key === sentiment) {
            count = sentiments.matching_results
            break
          }
        }
        response[0].push(dt.getFullYear() + '-' + (dt.getMonth() + 1) + '-' + dt.getDate())
        let percentage = Math.round(((count / total) * 100).toFixed(2))
        if (!percentage) {
          // console.log('count = ' + count + ' total = ' + total)
          percentage = 0
        }
        response[1].push(percentage)
      }
      cb(null, response)
    }, (err) => cb(err))
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

  function getDateFilter (startDt, endDt) {
    let sdt
    if (startDt) {
      sdt = new Date(startDt)
    }
    let edt = new Date()
    if (endDt) {
      edt = new Date(endDt)
    }
    let filter
    if (sdt & edt) {
      filter = 'contact_date>' + sdt.getTime() + ',contact_date<=' + edt.getTime()
    }
    return filter
  }
}
