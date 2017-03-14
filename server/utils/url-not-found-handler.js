'use strict'

module.exports = function () {
  // 4XX - URLs not found
  return function customRaiseUrlNotFoundError (req, res, next) {
    console.log('In customerRaiseUrlNotFoundError ' + req.originalUrl)
    res.redirect('/?originalUrl=' + req.originalUrl)
  }
}
