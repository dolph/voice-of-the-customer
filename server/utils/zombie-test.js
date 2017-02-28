'use strict'

const Browser = require('zombie')
const browser = new Browser()

var linkUrl = 'https://forums.att.com/t5/Wireless-Billing/Mobile-Share-Value-Plans-W-Rollover-Data-Information-and-FAQ/td-p/3903875'

browser.fetch(linkUrl)
  .then(function (response) {
    console.log('Status code:', response.status)
    if (response.status === 200) {
      response.arrayBuffer()
        .then(Buffer) // arrayBuffer -> Buffer
        .then(function (buffer) {
          console.log(buffer.toString('utf8'))
        })
    }
  })
  .then(function (text) {
    console.log('Document:', text)
  })
  .catch(function (error) {
    console.log('Network error: ' + error)
  })
