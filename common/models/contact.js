'use strict'

module.exports = function (Contact) {
  Contact.loadContact = function (file, cb) {
    console.log(file)
    cb()
  }
}
