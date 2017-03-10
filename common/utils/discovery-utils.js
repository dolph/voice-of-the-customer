'use strict'

var fs = require('fs')
var Cloudant = require('cloudant')
var app = require('../../server/server')
var watson = require('watson-developer-cloud')
var os = require('os')
var request = require('request')

var discovery = new watson.DiscoveryV1({
  username: process.env.DISCOVERY_USERNAME,
  password: process.env.DISCOVERY_PASSWORD,
  version_date: '2016-12-01'
})

var DiscoveryUtils = function () { }

DiscoveryUtils.prototype.query = function (params, cb) {
  discovery.query(params, function (err, data) {
    if (err) {
      cb(err)
    } else {
      cb(null, data)
    }
  })
}

DiscoveryUtils.prototype.addDocumentsBatchTask = function (task, done) {
  // Initialize the required variables
  var vocContent = app.models.vocContent
  var vocContentDB = _getVocContentDBConnection(vocContent.getDataSource().settings.url)
  var start = new Date()
  var bulkRequest = {
    docs: []
  }
  var checkStatusIds = {}
  var options = {
    limit: task.limit,
    skip: task.skip,
    include_docs: true,
    reduce: false
  }
  var updates = 0
  var errors = 0
  // Query the Cloudant Database
  vocContentDB.view('voc-content', 'source-url-view', options, (err, success) => {
    if (err) {
      done()
    } else {
      var cnt = success.rows.length
      console.log('Retrieving ' + cnt + ' docs took ' + (new Date() - start) + ' milliseconds.')
      // for each doc returned from cloudant
      for (let row of success.rows) {
        // Add the document to Discovery
        addVocConent(row.doc).then((success) => {
          console.log('Doc ' + success._id + ' updated with wds id ' + success.wds_id + ' which is ' + cnt + ' of ' + updates)
          // Add the document with the document_id to the bulk update request
          bulkRequest.docs.push(success)
          // Also add the document id to the list of ids to check the status for
          checkStatusIds[success.wds_id] = success.wds_id
          updates++
          // When we received all the responses back
          if ((updates + errors) >= cnt) {
            // And we don't have any errors
            if (errors === 0) {
              // Update cloudant with the ids we got back from Discovery
              bulkUpdate(bulkRequest).then(() => {
                for (var id in checkStatusIds) {
                  // Poll for status of 'available' for each id in the list
                  poll(function (id, cb) {
                    checkDocumentStatus(id).then((status) => {
                      if (status.status === 'failed') {
                        console.log(JSON.stringify(status, null, 2))
                      }
                      cb(status.status === 'available' || status.status === 'failed')
                    }, (err) => {
                      console.log('Error returned from WDS status check: ' + err)
                      cb(false)
                    })
                  }, id, 60000, 10000).then((status) => {
                    if (status.error) {
                      delete checkStatusIds[status.id]
                      console.log(status.error + 'error occurred on id ' + status.id)
                      if (Object.keys(checkStatusIds).length === 0) {
                        done()
                      }
                    } else {
                      delete checkStatusIds[status.id]
                      if (Object.keys(checkStatusIds).length === 0) {
                        done()
                      }
                    }
                  })
                }
              }, (err) => {
                done(err)
              })
            } else {
              done('Error occured.')
            }
          }
        }, (err) => {
          // Error when adding Document to Discovery
          console.log(err)
          errors++
        })
      }
    }
  })
}

// Check on the document status in discovery
function checkDocumentStatus (documentId, cb) {
  return new Promise(function (resolve, reject) {
    var options = {
      url: process.env.DISCOVERY_URL +
        '/v1/environments/' + process.env.DISCOVERY_ENV_ID +
        '/collections/' + process.env.DISCOVERY_COLLECTION_ID +
        '/documents/' + documentId +
        '?version=2016-12-01',
      method: 'GET',
      json: true,
      headers: {
        'Content-Type': 'application/json'
      },
      auth: {
        user: process.env.DISCOVERY_USERNAME,
        password: process.env.DISCOVERY_PASSWORD
      }
    }
    request(options, function (err, response, status) {
      try {
        if (err) {
          reject(err)
        } else {
          if (response.statusCode !== 200) {
            reject('HTTP Error code returned from Discovery: ' + response.statusCode)
          } else {
            resolve(status)
          }
        }
      } catch (err) {
        reject(err)
      }
    })
  })
}

// Add the content to the Discovery Service
function addVocConent (doc, done) {
  return new Promise(function (resolve, reject) {
    // Make a copy of the doc that will be returned
    var copy = JSON.parse(JSON.stringify(doc))
    // Update the doc to match what WDS wants
    doc.cloudant_id = doc._id
    delete doc._id
    delete doc._rev
    // Create a Javascript Date object for Discovery to use in time series queries
    if (doc.contact_date) {
      var dt = new Date(doc.contact_date)
      if (dt) {
        doc.contact_date = dt.getTime()
      }
    }
    // Redact ATT and DirectTV in the content.
    doc.text = doc.text.replace(/ATT/ig, 'WWireless')
    doc.text = doc.text.replace(/AT&T/ig, 'WWireless')
    doc.text = doc.text.replace(/DirecTV/ig, 'WTelevision')
    doc.text = doc.text.replace(/Direct TV/ig, 'WTelevision')
    doc.text = doc.text.replace(/Directv/ig, 'WTelevision')
    doc.text = doc.text.replace(/direct tv/ig, 'WTelevision')
    doc.text = doc.text.replace(/directv/ig, 'WTelevision')
    // Make the text lower case
    doc.text = doc.text.toLowerCase()
    // Same the json to the tmp folder
    var tempPath = os.tmpdir() + '/' + doc.cloudant_id + '.json'
    fs.writeFile(tempPath, JSON.stringify(doc), 'utf8', (err) => {
      if (!err) {
        var file = fs.createReadStream(tempPath)
        discovery.addDocument({ 'environment_id': process.env.DISCOVERY_ENV_ID, 'collection_id': process.env.DISCOVERY_COLLECTION_ID, 'file': file, 'configuration_id': process.env.DISCOVERY_CONFIG_ID }, (err, success) => {
          if (err) {
            console.log(err)
            setTimeout(function () {
              resolve(copy)
            }, 30000)
          } else {
            fs.unlinkSync(tempPath)
            copy.wds_id = success.document_id
            resolve(copy)
          }
        })
      } else {
        console.log(err)
        reject(err)
      }
    })
  })
}

// Bulk Update documents in cloudant
function bulkUpdate (bulkRequest) {
  return new Promise(function (resolve, reject) {
    var vocContent = app.models.vocContent
    var vocContentDB = _getVocContentDBConnection(vocContent.getDataSource().settings.url)
    // Send the bulk update to Cloudant
    vocContentDB.bulk(bulkRequest, (err, success) => {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}

// Get a Cloudant DB Connection from a URL
function _getVocContentDBConnection (url) {
  var dbUrl = url
  var cloudant = Cloudant(dbUrl)
  var vocContentDB = cloudant.db.use(process.env.CLOUDANT_VOC_CONTENT_DB_NAME)
  return vocContentDB
}

// The polling function
function poll (fn, id, timeout, interval) {
  var endTime = Number(new Date()) + (timeout || 2000)
  interval = interval || 100

  var checkCondition = function (resolve, reject) {
    // If the condition is met, we're done!
    fn(id, function (result) {
      if (result) {
        resolve({ 'id': id, status: result })
      } else {
        // If the condition isn't met but the timeout hasn't elapsed, go again
        if (Number(new Date()) < endTime) {
          setTimeout(checkCondition, interval, resolve, reject)
        } else {
          // Didn't match and too much time, reject!
          resolve({ 'error': 'Timeout', 'id': id })
        }
      }
    })
  }

  return new Promise(checkCondition)
}

module.exports = new DiscoveryUtils()
