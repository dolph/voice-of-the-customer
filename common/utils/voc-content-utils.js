'use strict'

var fs = require('fs')
var Cloudant = require('cloudant')
var app = require('../../server/server')
var watson = require('watson-developer-cloud')

var conversation = watson.conversation({
  username: process.env.CONVERSATION_API_USER,
  password: process.env.CONVERSATION_API_PASSWORD,
  version: 'v1',
  version_date: '2017-02-03'
})

var VocContentUtils = function () { }

VocContentUtils.prototype.getVocContentDBConnection = function (url) {
  return _getVocContentDBConnection(url)
}

VocContentUtils.prototype.preEnrichContentTask = function (task, done) {
  // Initialize all the required variables
  var vocContent = app.models.vocContent
  var vocContentDB = _getVocContentDBConnection(vocContent.getDataSource().settings.url)
  var start = new Date()
  var updates = 0
  var errors = 0
  var bulkRequest = {
    docs: []
  }
  var options = {
    'limit': task.limit,
    'skip': task.skip,
    'include_docs': true,
    'reduce': false
  }
  vocContentDB.view('voc-content', 'all-docs-view', options, (err, success) => {
    if (err) {
      done(err)
    } else {
      var cnt = success.rows.length
      for (let row of success.rows) {
        updateWithIntentsAndEntities(row.doc).then((success) => {
          updateSource(success, task.source).then((success) => {
            bulkRequest.docs.push(success)
            updates++
            if ((updates + errors) >= cnt) {
              if (errors === 0) {
                bulkUpdate(bulkRequest).then((success) => {
                  console.log('Retrieving and Update of ' + cnt + ' docs took ' + (new Date() - start) + ' milliseconds.')
                  done()
                }, (err) => {
                  done(err)
                })
              } else {
                done('Error occured.')
              }
            }
          }, (err) => {
            console.log(err)
            errors++
          })
        }, (err) => {
          console.log(err)
          errors++
        })
      }
    }
  })
}

function updateSource (doc, source) {
  return new Promise(function (resolve, reject) {
    try {
      doc['loopback__model__name'] = 'voc-content'
      doc.source = source
      doc.contact_duration = getRandomInt(5, 60)
      resolve(doc)
    } catch (err) {
      reject(err)
    }
  })
}

function getRandomInt (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function updateWithIntentsAndEntities (doc) {
  return new Promise(function (resolve, reject) {
    try {
      conversation.message({
        workspace_id: process.env.CONVERSATION_WORKSPACE,
        input: { 'text': doc.text.length > 2048 ? doc.text.substring(0, 2048) : doc.text }
      }, function (err, response) {
        if (err) {
          console.log(doc.text)
          reject('Error calling conversation: ' + err)
        } else {
          doc.intents = response.intents
          doc.entities = response.entities
          resolve(doc)
        }
      })
    } catch (err) {
      reject(err)
    }
  })
}

VocContentUtils.prototype.writeHtmlTask = function (task, done) {
  let outputPath = '/Users/wjvanzyl/temp/voc/wireless_billing/' + task.doc._id + '.html'
  htmlFromMetadata(task.doc, (err, html) => {
    if (err) {
      done()
    } else {
      fs.writeFile(outputPath, html, (err) => {
        if (err) {
          console.log(err)
        } else {
          console.log(outputPath)
        }
        done()
      })
    }
  })
}

function bulkUpdate (bulkRequest, done) {
  return new Promise(function (resolve, reject) {
    var vocContent = app.models.vocContent
    var vocContentDB = _getVocContentDBConnection(vocContent.getDataSource().settings.url)

    vocContentDB.bulk(bulkRequest, (err, success) => {
      if (err) {
        reject(err)
      } else {
        resolve(success)
      }
    })
  })
}

function htmlFromMetadata (metadata, cb) {
  var outHtml = '<!DOCTYPE html><html><body>'
  outHtml += '<title>' + metadata.title + '</title>\n'
  outHtml += '<p>' + metadata.text + '</p>\n'
  outHtml += '</body></html>'
  cb(null, outHtml)
}

function _getVocContentDBConnection (url) {
  var dbUrl = url
  var cloudant = Cloudant(dbUrl)
  var vocContentDB = cloudant.db.use(process.env.CLOUDANT_VOC_CONTENT_DB_NAME)
  return vocContentDB
}

module.exports = new VocContentUtils()
