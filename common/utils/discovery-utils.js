'use strict'

var Cloudant = require('cloudant')
var app = require('../../server/server')
var request = require('request')

var DiscoveryUtils = function () { }

DiscoveryUtils.prototype.addDocumentsTask = function (task, done) {
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
    reduce: false,
    descending: true
  }
  var updates = 0
  // Query the Cloudant Database
  vocContentDB.view('voc-content', 'no-wds-id-view', options, (err, success) => {
    if (err) {
      done()
    } else {
      var cnt = success.rows.length
      // for each doc returned from cloudant
      var promiseArray = []
      // Add a promise to the array
      for (let row of success.rows) {
        promiseArray.push(addVocConent(row.doc))
      }
      // Add the document to Discovery
      console.log('Adding documents to WDS...')
      Promise.all(promiseArray).then((successArray) => {
        // Loop over all the successes and add them to the bulk update
        let debug = ''
        for (success of successArray) {
          if (success.wds_id) {
            debug += 'Doc ' + success._id + ' updated with wds id ' + success.wds_id + ' (' + (updates + 1) + '/' + cnt + ')' + '\n'
            // Add the document with the document_id to the bulk update request
            bulkRequest.docs.push(success)
            // Also add the document id to the list of ids to check the status for
            checkStatusIds[success.wds_id] = success.wds_id
            updates++
          }
        }
        console.log(debug)
        // Update cloudant with the ids we got back from Discovery
        console.log('Updating cloudant with WDS ids...')
        bulkUpdate(bulkRequest).then(() => {
          console.log('Started Polling...')
          for (var id in checkStatusIds) {
            // Poll for status of 'available' for each id in the list
            poll(function (id, cb) {
              checkDocumentStatus(id).then((status) => {
                console.log(status.document_id + ' = ' + status.status)
                if (status.status === 'failed') {
                  console.log(JSON.stringify(status, null, 2))
                }
                cb(status.status === 'available' || status.status === 'failed')
              }, (err) => {
                console.log('Error returned from WDS status check for id ' + id + ' : ' + err)
                cb(false)
              })
            }, id, 60000, 10000).then((status) => {
              if (status.error) {
                delete checkStatusIds[status.id]
                console.log(status.error + 'error occurred on id ' + status.id)
                if (Object.keys(checkStatusIds).length === 0) {
                  console.log('Processing ' + cnt + ' docs took ' + (new Date() - start) + ' milliseconds.')
                  done()
                }
              } else {
                delete checkStatusIds[status.id]
                if (Object.keys(checkStatusIds).length === 0) {
                  console.log('Processing ' + cnt + ' docs took ' + (new Date() - start) + ' milliseconds.')
                  done()
                }
              }
            })
          }
        }, (err) => {
          done(err)
        })
      })
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
    // Make the text lower case
    doc.text = doc.text.toLowerCase()
    // Redact ATT in the content.
    doc.text = doc.text.replace(/att/ig, 'wwireless')
    doc.text = doc.text.replace(/at&t/ig, 'wwireless')
    doc.text = doc.text.replace(/directv/, 'wsatellite')
    doc.text = doc.text.replace(/direct tv/, 'wsatellite')
    doc.text = doc.text.replace(/[edited for privacy.]/, '')
    // Load the document into WDS
    let url = 'https://gateway.watsonplatform.net/discovery/api/v1/environments/' +
      process.env.DISCOVERY_ENV_ID +
      '/collections/' + process.env.DISCOVERY_COLLECTION_ID +
      '/documents?version=2016-12-01'
    let req = request.post(url, function optionalCallback (err, httpResponse, body) {
      if (err) {
        console.log(err)
        setTimeout(function () {
          resolve(copy)
        }, 30000)
      } else {
        copy.wds_id = JSON.parse(body).document_id
        resolve(copy)
      }
    }).auth(process.env.DISCOVERY_USERNAME, process.env.DISCOVERY_PASSWORD)

    var form = req.form()
    form.append('file', Buffer.from(JSON.stringify(doc), 'utf8'), {
      filename: doc.cloudant_id + '.json',
      contentType: 'application/json'
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
