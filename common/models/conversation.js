'use strict'

var Request = require('request')

module.exports = function (Conversation) {
  Conversation.message = function (message, cb) {
    cb()
  }
}
