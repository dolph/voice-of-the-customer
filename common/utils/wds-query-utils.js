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

WdsQueryUtils.prototype.getTimeSeriesCounts = function (params) {
  let self = this
  return new Promise(function (resolve, reject) {
    try {
      let _aggregation = 'timeslice(contact_date,' + params.interval + ')'
      if (params.term) {
        _aggregation = params.term + '.' + _aggregation
      }
      let _filter = params.filter
      let queryOptions = _.merge(params, defaultOptions)
      self.query(queryOptions).then((result) => resolve(result), (err) => reject(err))
    } catch (err) {
      reject(err)
    }
  })
}

WdsQueryUtils.prototype.getCounts = function (params) {
  let self = this
  return new Promise(function (resolve, reject) {
    try {
      let queryOptions = _.merge(params, defaultOptions)
      self.query(queryOptions).then((result) => resolve(result), (err) => reject(err))
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

module.exports = new WdsQueryUtils()
