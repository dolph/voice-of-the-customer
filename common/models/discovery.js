'use strict'

var Async = require('async')
var moment = require('moment')
var discoveryUtils = require('../utils/discovery-utils')
var wdsQueryUtils = require('../utils/wds-query-utils')
var vocContentUtils = require('../utils/voc-content-utils')

var app = require('../../server/server')

const BATCHSIZE = 10

module.exports = function (Discovery) {
  Discovery.getAverageLengthOfCalls = function (interval, startDt, endDt, cb) {
    let filter = getDateFilter(startDt, endDt)
    let aggregation = 'filter(source:call).timeslice(contact_date,' + interval + ').average(contact_duration)'
    let params = {
      count: 0,
      aggregation: aggregation,
      filter: filter
    }
    wdsQueryUtils.getCounts(params).then((result) => {
      let timesliceResults = wdsQueryUtils.extractResultsForType(result.aggregations[0], 'timeslice')
      let callsByIntervals = timesliceResults.results
      var response = [
        ['Date'],
        ['Count'],
        ['Average']
      ]
      for (let callByInterval of callsByIntervals) {
        let dt = new Date(callByInterval.key)
        let count = callByInterval.matching_results
        let avgResult = wdsQueryUtils.extractResultsForType(callByInterval.aggregations[0], 'average')
        let avg = avgResult.value.toFixed(2)
        response[0].push(dt.getFullYear() + '-' + (dt.getMonth() + 1) + '-' + dt.getDate())
        response[1].push(count)
        response[2].push(Number(avg))
      }
      cb(null, response)
    })
  }

  Discovery.getVolumeOfCallsOverTime = function (interval, startDt, endDt, cb) {
    let filter = getDateFilter(startDt, endDt)
    let aggregation = 'filter(source:call).timeslice(contact_date,' + interval + ')'
    let params = {
      count: 0,
      aggregation: aggregation,
      filter: filter
    }
    wdsQueryUtils.getCounts(params).then((result) => {
      let timesliceResults = wdsQueryUtils.extractResultsForType(result.aggregations[0], 'timeslice')
      let callsByIntervals = timesliceResults.results
      var response = [
        ['Date'],
        ['Count']
      ]

      for (let callByInterval of callsByIntervals) {
        let dt = new Date(callByInterval.key)
        let count = callByInterval.matching_results
        response[0].push(dt.getFullYear() + '-' + (dt.getMonth() + 1) + '-' + dt.getDate())
        response[1].push(count)
      }
      cb(null, response)
    }, (err) => cb(err))
  }

  Discovery.getPerceptionAnalysis = function (ofDate, cb) {
    let endDt = moment(ofDate)
    let startDt = moment(endDt).subtract(1, 'months')
    let promises = []
    // Build the start date query
    let startFilter = getDateFilter((startDt.startOf('day')).toDate(), (startDt.endOf('day')).toDate())
    let startParams = {
      filter: startFilter,
      count: 0,
      aggregation: 'nested(enriched_text.docSentiment).term(enriched_text.docSentiment.type)'
    }
    promises.push(wdsQueryUtils.getCounts(startParams))
    // Build the end date Query
    let endFilter = getDateFilter((endDt.startOf('day')).toDate(), (endDt.endOf('day')).toDate())
    let endParams = {
      filter: endFilter,
      count: 0,
      aggregation: 'nested(enriched_text.docSentiment).term(enriched_text.docSentiment.type)'
    }
    promises.push(wdsQueryUtils.getCounts(endParams))
    Promise.all(promises).then((result) => {
      let startScore = getSentimentPercentageFromArray(wdsQueryUtils.getSentimentPercentageArray(result[0]), 'positive')
      let endScore = getSentimentPercentageFromArray(wdsQueryUtils.getSentimentPercentageArray(result[1]), 'positive')
      let diff = Math.abs(endScore - startScore)
      let change = endScore <= startScore ? 'drop' : 'rise'
      let direction = endScore <= startScore ? 'down' : 'up'
      let response = {
        changePercentage: diff,
        change: change,
        direction: direction,
        changeText: change + ' in positive perception in 30 days',
        fromPercentage: startScore,
        from: startDt.format('MMM Do YYYY'),
        toPercentage: endScore,
        to: endDt.format('MMM Do YYYY')
      }
      cb(null, response)
    })
  }

  Discovery.getMostPopularFeatures = function (startDt, endDt, source, count, cb) {
    let filter = getDateFilter(startDt, endDt)
    if (source === 'call' || source === 'forum' || source === 'chat') {
      if (filter) {
        filter += ',source:' + source
      } else {
        filter = 'source:' + source
      }
    }
    let params = {
      filter: filter,
      count: 1,
      aggregation: 'nested(enriched_text.entities).filter(enriched_text.entities.type:"Physical_Feature").term(enriched_text.entities.text,count:' + count + ')'
    }
    wdsQueryUtils.getCounts(params).then((result) => {
      let termResults = wdsQueryUtils.extractResultsForType(result.aggregations[0], 'term')
      let products = termResults.results
      let total = 0
      // recalculate the total based on only the number of items returned
      for (let product of products) {
        total += product.matching_results
      }
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

  Discovery.getMostPopularTopics = function (startDt, endDt, source, count, cb) {
    let filter = getDateFilter(startDt, endDt)
    if (source === 'call' || source === 'forum' || source === 'chat') {
      if (filter) {
        filter += ',source:' + source
      } else {
        filter = 'source:' + source
      }
    }
    let params = {
      filter: filter,
      count: 1,
      aggregation: 'nested(enriched_text.concepts).term(enriched_text.concepts.text,count:' + count + ')'
    }
    wdsQueryUtils.getCounts(params).then((result) => {
      let termResults = wdsQueryUtils.extractResultsForType(result.aggregations[0], 'term')
      let products = termResults.results
      let total = 0
      // recalculate the total based on only the number of items returned
      for (let product of products) {
        total += product.matching_results
      }
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

  Discovery.getProductMentions = function (startDt, endDt, source, sentiment, count, cb) {
    let filter = getDateFilter(startDt, endDt)
    if (source === 'call' || source === 'forum' || source === 'chat') {
      if (filter) {
        filter += ',source:' + source
      } else {
        filter = 'source:' + source
      }
    }
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
      let products = termResults.results
      let total = termResults.matching_results
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
    var addDocumentsQueue = Async.queue(discoveryUtils.addDocumentsTask, 1)
    // Indication that the job is completed.
    addDocumentsQueue.drain(() => {
      console.log('WDS Load Completed.')
    })
    // Query Cloudant for all the documents.  Limit is 10 to support the free version of Discovery loading limit.
    vocContentDB.view('voc-content', 'no-wds-id-view', { reduce: true }, (err, success) => {
      if (err) {
        cb(err)
      } else {
        console.log(JSON.stringify(success))
        // Limit the load to 10K
        var count = success.rows[0].value > 10000 ? 9000 : success.rows[0].value
        var submitted = 0
        var tasks = 0
        while (submitted < count) {
          addDocumentsQueue.push({ limit: BATCHSIZE, skip: 0 }, (err) => {
            console.log('Task completed... ' + addDocumentsQueue.length())
            if (err) {
              console.log('Error in task. ' + err)
            }
          })
          tasks++
          submitted += BATCHSIZE
        }
        cb(null, tasks)
      }
    })
  }

  function getPerceptionAnalysisResult (start, end) {
    let result = {
      title: 'Change in positive perception',
      direction: 'perception-down-arrow',
      directionColor: '#dc267f',
      changePercentage: 61,
      changeText: 'drop in positive perception in 30 days',
      fromPercentage: 74,
      fromText: 'positive sentiment 9/1',
      toPercentage: 28,
      toText: 'positive sentiment 10/1'
    }
  }

  function getSentimentPercentageFromArray (sentimentArray, type) {
    for (let sentiment of sentimentArray) {
      if (sentiment[0] === type) {
        return sentiment[1]
      }
    }
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
