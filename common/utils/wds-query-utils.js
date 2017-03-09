'use strict'

var watson = require('watson-developer-cloud')

var discovery = new watson.DiscoveryV1({
  username: process.env.DISCOVERY_USERNAME,
  password: process.env.DISCOVERY_PASSWORD,
  version_date: '2016-12-01'
})

var WdsQueryUtils = function () { }

WdsQueryUtils.prototype.getTimeSeriesCounts = function (interval, cb) {
  let queryOptions = {
    environment_id: process.env.DISCOVERY_ENV_ID,
    collection_id: process.env.DISCOVERY_COLLECTION_ID,
    count: 1,
    aggregation: 'timeslice(contact_date,' + interval + ')'
  }
  this.query(queryOptions, function (err, data) {
    if (err) {
      cb(err)
    } else {
      let totals = extractResultsFromAggregation(data.aggregations[0].results)
      cb(null, totals)
    }
  })
}

WdsQueryUtils.prototype.query = function (params, cb) {
  discovery.query(params, function (err, data) {
    if (err) {
      cb(err)
    } else {
      cb(null, data)
    }
  })
}

function extractResultsFromAggregation (aggregation) {
  let response = {}
  for (let result of aggregation) {
    response[result.key] = result.matching_results
  }
  return response
}

module.exports = new WdsQueryUtils()
