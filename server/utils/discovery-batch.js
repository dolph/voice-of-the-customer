'use strict'

var Request = require('Request')
var Async = require('Async')

let env = '900af393-bd98-4405-ba0f-de6b770e3f83'
let col = '6c4de040-7993-4097-ad3a-8ded985be4e1'
let user = 'a5caa97e-8990-4019-9fa9-4fae8a23a3cc'
let password = 'GICi3mthsKtY'

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
