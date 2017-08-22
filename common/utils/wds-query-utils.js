'use strict'

var watson = require('watson-developer-cloud')
var _ = require('lodash')

var discovery = new watson.DiscoveryV1({
  username: process.env.DISCOVERY_USERNAME,
  password: process.env.DISCOVERY_PASSWORD,
  version_date: '2016-12-01'
})

var defaultOptions = {
  environment_id: process.env.DISCOVERY_ENV_ID,
  collection_id: process.env.DISCOVERY_COLLECTION_ID
}

var WdsQueryUtils = function () { }

WdsQueryUtils.prototype.getSentimentPercentageArray = function (result) {
  let termResults = this.extractResultsForType(result, 'term')
  let total = termResults.matching_results
  let sentiments = termResults.results
  var response = [
  ]
  for (let sentiment of sentiments) {
    let rounded = (sentiment.matching_results / total).toFixed(2)
    let percentage = Math.round(rounded * 100)
    response.push([sentiment.key, percentage])
  }
  return response
}

WdsQueryUtils.prototype.getSentimentScores = function (result, type, text, cb) {
  let sentiments = []
  var response = [
  ]
  for (let res of result.results) {
    if ("enriched_text" in res && "entities" in res.enriched_text) {
      for (let entity of res.enriched_text.entities) {
        if (entity.type == type && entity.text == text) {
          sentiments.push(entity.sentiment.score);
          break;
        }
      }
    }
  }

  let total = sentiments.length;
  if (total == 0) {
    cb(null, response)
    return;
  }

  let negatory = 0;
  let positive = 0;
  let meh = 0;

  for (let sentiment of sentiments) {
    if (sentiment < -0.65) {
      negatory++;
    }
    else if (sentiment > 0.3) {
      positive++;
    }
    else {
      meh++;
    }
  }

  response.push(['negative', Math.round((negatory / total).toFixed(2)*100)])
  response.push(['positive', Math.round((positive / total).toFixed(2)*100)])
  response.push(['neutral', Math.round((meh / total).toFixed(2)*100)])
  cb(null, response)
}

WdsQueryUtils.prototype.getCounts = function (params) {
  let self = this
  return new Promise(function (resolve, reject) {
    try {
      let queryOptions = _.merge(params, defaultOptions)
      self.query(queryOptions).then((result) => resolve(result), (err) => {
        console.log(err)
        reject(err)
      })
    } catch (err) {
      reject(err)
    }
  })
}

WdsQueryUtils.prototype.query = function (params) {
  console.log(params)
  return new Promise(function (resolve, reject) {
    try {
      discovery.query(params, (err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
      })
    } catch (err) {
      reject(err)
    }
  })
}

WdsQueryUtils.prototype.extractResultsForType = function (result, type, matching) {
  if (result.type === type) {
    if (!result.matching_results) {
      result.matching_results = matching
    }
    return result
  } else {
    return this.extractResultsForType(result.aggregations[0], type, result.matching_results)
  }
}

WdsQueryUtils.prototype.extractResultsFromAggregation = function (aggregation) {
  let response = {}
  for (let result of aggregation) {
    response[result.key] = result.matching_results
  }
  return response
}

WdsQueryUtils.prototype.getCollectionInfo = function (cb) {
  let params = {
    environment_id: process.env.DISCOVERY_ENV_ID,
    collection_id: process.env.DISCOVERY_COLLECTION_ID
  }
  discovery.getCollection(params, function (err, data) {
    cb(err, data)
  })
}

module.exports = new WdsQueryUtils()
