'use strict'

var Request = require('request')

module.exports = function (Conversation) {
  Conversation.message = function (message, cb) {
    try {
      var options = {
        url: process.env.CONVERSATION_API_URL,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        json: true,
        body: message,
        auth: {
          user: process.env.CONVERSATION_API_USER,
          password: process.env.CONVERSATION_API_PASSWORD
        }
      }
      Request(options, function (err, response, body) {
        try {
          if (err) {
            cb(err)
          } else {
            if (response.statusCode !== 200) {
              cb('HTTP Error code: ' + response.statusCode)
            } else {
              cb(null, body)
            }
          }
        } catch (err) {
          console.log(err)
          cb(err)
        }
      })
    } catch (err) {
      cb(err)
    }
  }
}
