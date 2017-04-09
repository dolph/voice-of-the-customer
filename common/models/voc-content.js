'use strict'

var Async = require('async')

var vocContentUtils = require('../utils/voc-content-utils')

module.exports = function (Voccontent) {
  Voccontent.getContentInfo = function (cb) {
    var vocContentDB = vocContentUtils.getVocContentDBConnection(Voccontent.getDataSource().settings.url)
    let options = {
      reduce: true
    }
    // Get a count of the docs that haven't been loaded into Discovery
    let response = {
      inDiscover: 0,
      notInDisovery: 0
    }
    vocContentDB.view('voc-content', 'no-wds-id-view', options, (err, result) => {
      if (err) {
        cb(err)
      } else {
        if (result.rows[0]) {
          response.notInDisovery = result.rows[0].value
        }
        vocContentDB.view('voc-content', 'wds-id-view', options, (err, result) => {
          if (err) {
            cb(err)
          } else {
            if (result.rows[0]) {
              response.inDiscovery = result.rows[0].value
              cb(null, response)
            } else {
              cb(null, response)
            }
          }
        })
      }
    })
  }

  Voccontent.bulkUpload = function (bulkRequest, cb) {
    var vocContentDB = vocContentUtils.getVocContentDBConnection(Voccontent.getDataSource().settings.url)
    vocContentDB.bulk(bulkRequest, function (err, result) {
      cb(err, result)
    })
  }

  Voccontent.bulkDownload = function (limit, skip, cb) {
    var vocContentDB = vocContentUtils.getVocContentDBConnection(Voccontent.getDataSource().settings.url)
    let options = {
      limit: limit,
      skip: skip,
      reduce: false,
      descending: true,
      include_docs: true
    }
    vocContentDB.view('voc-content', 'contact-date-view', options, (err, result) => {
      if (err) {
        cb(err)
      }
      var bulkResponse = {
        docs: []
      }
      for (let row of result.rows) {
        let doc = row.doc
        delete doc._id
        delete doc._rev
        delete doc.loopback__model__name
        delete doc.wds_id
        delete doc.intents
        delete doc.entities

        // Make the text lower case
        doc.text = doc.text.toLowerCase()
        // Redact ATT in the content.
        doc.text = doc.text.replace(/att/ig, 'wwireless')
        doc.text = doc.text.replace(/at&t/ig, 'wwireless')
        doc.text = doc.text.replace(/directv/, 'wsatellite')
        doc.text = doc.text.replace(/direct tv/, 'wsatellite')
        doc.text = doc.text.replace(/[edited for privacy.]/, '')

        bulkResponse.docs.push(doc)
        console.log(bulkResponse.docs.length + ' === ' + result.rows.length)
        if (bulkResponse.docs.length === result.rows.length) {
          cb(null, bulkResponse)
        }
      }
    })
  }

  Voccontent.exportAsHtml = function (cb) {
    var vocContentDB = vocContentUtils.getVocContentDBConnection(Voccontent.getDataSource().settings.url)

    var outputQueue = Async.queue(vocContentUtils.writeHtmlTask, 1)
    outputQueue.drain(() => {
      console.log('Writing of HTML Completed.')
    })
    var options = {
      include_docs: true,
      reduce: false,
      // startkey: ['Wireless', 'Features & Services', 'Data & Messaging Features, Internet Tethering'],
      // startkey: ['Wireless', 'Features & Services', 'Network Coverage'],
      // startkey: ['Wireless', 'Phones & Devices', 'Android'],
      // startkey: ['Wireless', 'Phones & Devices', 'Apple'],
      // startkey: ['Wireless', 'Wireless Account & Billing', 'Wireless Account'],
      startkey: ['Wireless', 'Wireless Account & Billing', 'Wireless Billing'],
      inclusive_end: false,
      limit: 200
    }
    vocContentDB.view('voc-content', 'tags-view', options, (err, success) => {
      if (err) {
        console.log(err)
      } else {
        for (let row of success.rows) {
          outputQueue.push({ doc: row.doc }, (err) => {
            if (err) {
              console.log(err)
            }
          })
        }
      }
    })
    cb(null, { 'status': 'HTML Export Instanciated.' })
  }
}
