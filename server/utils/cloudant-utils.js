'use strict'

var Cloudant = require('cloudant')
var Async = require('async')

var user = null
var password = null

// Initialize the library with my account.
var cloudant = Cloudant({ account: user, password: password })
var cloudantDB = cloudant.db.use('voc-content-v1')

var batchSize = 25
var endkey
var designName = 'voc-content'
var viewName = 'wds-id-view'

var queue = Async.queue(updateDocsTask, 1)

queue.drain = function () {
  console.log('Queue is drained...')
}

getCount(function (err, total) {
  if (err) {
    console.log(err)
    process.exit(1)
  }
  console.log('There will be ' + total + ' documents processed...')

  let batchCount = Math.ceil(total / batchSize)
  let tasksCreated = 0
  let tasksCompleted = 0
  let skip = 0
  console.log('There will be ' + batchCount + ' tasks created...')
  while (batchCount > tasksCreated) {
    queue.push({ limit: batchSize, skip: skip }, function (err, success) {
      if (err) {
        console.log(err)
      } else {
        tasksCompleted++
        console.log('Successfully updated ' + success.result.length + ' documents took ' + success.duration + ' seconds.  This is task ' + tasksCompleted + ' of ' + tasksCreated)
      }
    })
    tasksCreated++
    // skip += batchSize
  }
})

function getCount (done) {
  cloudantDB.view(designName, viewName, { reduce: true }, function (err, success) {
    if (err) {
      done(err)
    } else {
      done(null, success.rows[0].value)
    }
  })
}

function updateDocsTask (task, done) {
  let start = new Date()
  cloudantDB.view(designName, viewName, { limit: task.limit, skip: task.skip, reduce: false, include_docs: true }, function (err, success) {
    if (err) {
      done(err)
    } else {
      bulkUpdate(success.rows).then((result) => {
        let response = {
          result: result,
          duration: (new Date() - start) / 1000
        }
        done(null, response)
      })
    }
  })
}

function bulkUpdate (rows) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      let bulkRequest = {
        docs: []
      }
      for (let row of rows) {
        let doc = row.doc
        delete doc.wds_id
        let dt = new Date(doc.contact_date)
        if (dt) {
          bulkRequest.docs.push(doc)
        } else {
          console.log(doc._id + ' ' + doc.contact_date)
        }
      }
      cloudantDB.bulk(bulkRequest, function (err, success) {
        if (err) {
          reject(err)
        } else {
          resolve(success)
        }
      })
    }, 500)
  })
}

function deleteDocsTask (task, done) {
  let start = new Date()
  cloudantDB.view(designName, viewName, { limit: task.limit, skip: 0, reduce: false, include_docs: true, endkey: endkey }, function (err, success) {
    if (err) {
      done(err)
    } else {
      bulkDelete(success.rows).then((result) => {
        let response = {
          result: result,
          duration: (new Date() - start) / 1000
        }
        done(null, response)
      })
    }
  })
}

function bulkDelete (rows) {
  return new Promise(function (resolve, reject) {
    let bulkRequest = {
      docs: []
    }
    for (let row of rows) {
      let deleted = {
        _id: row.doc._id,
        _rev: row.doc._rev,
        _deleted: true
      }
      bulkRequest.docs.push(deleted)
    }
    cloudantDB.bulk(bulkRequest, function (err, success) {
      if (err) {
        reject(err)
      } else {
        resolve(success)
      }
    })
  })
}
