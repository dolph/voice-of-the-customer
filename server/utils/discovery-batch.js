'use strict'

var Request = require('Request')
var Async = require('Async')

let env = ''
let col = ''
let user = ''
let password = ''

controlFlow()

function controlFlow () {
  let skip = 10000
  let limit = 100
  let done = false
  Async.until(
    function () {
      return done
    },
    function (cb) {
      query(limit, skip, cb).then((docs) => {
        testContactDate(docs).then(() => {
          skip += limit
          if (skip > 16557) {
            done = true
          }
          cb()
        })
      })
    }, function () {
      console.log('All Done...')
    }
  )
}

function testContactDate (docs) {
  return new Promise(function (resolve, reject) {
    if (!docs) {
      console.log('No Docs returned???')
      resolve()
    }
    for (let doc of docs) {
      if (typeof doc.contact_date !== 'number') {
        console.log(doc)
      } else {
        try {
          var dt = new Date(doc.contact_date)
          if (!dt) {
            console.log(doc)
          }
        } catch (err) {
          console.log(doc)
        }
      }
    }
    resolve()
  })
}

function query (limit, skip, cb) {
  return new Promise(function (resolve, reject) {
    let url = 'https://gateway.watsonplatform.net/discovery/api/v1/environments/' +
      env + '/collections/' + col + '/query?version=2016-12-01' +
      '&query=&count=' + limit + '&offset=' + skip + '&return=contact_date'
    Request.get(url, function (err, http, body) {
      if (err) {
        console.log(err)
        reject(err)
      } else {
        console.log('Processing docs ' + skip)
        resolve(JSON.parse(body).results)
      }
    }).auth(user, password)
  })
}
