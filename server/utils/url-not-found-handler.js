'use strict'

var path = require('path')

module.exports = function () {
  // 4XX - URLs not found
  return function customRaiseUrlNotFoundError (req, res, next) {
    console.log('in customerRaiseUrlNotFoundError for url: ' + req.path)
    if (/^(.*\..*)/.test(req.path)) {
      console.log('Sending back a 404 for requested path: ' + req.originalUrl)
      res.status(404)
      next()
    } else {
      console.log('Sending the index.html file...')
      res.sendFile(path.resolve('dist/client/index.html'))
    }
  }
}
