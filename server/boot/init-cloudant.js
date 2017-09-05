/*
* IBM Confidential
* OCO Source Materials
* (C) Copyright IBM Corp. 2015, 2016
* The source code for this program is not published or otherwise divested of its trade secrets, irrespective of what has been deposited with the U.S. Copyright Office.
*/
'use strict'

var wslEnv = require('../utils/wsl-env')
var CloudantInitializer = require('../utils/cloudant-initializer')
var cloudantConfig = require('../config/cloudant-config.json')

var debug = require('debug')('loopback:init-cloudant')

module.exports = function (app, cb) {
  debug('Initializing Cloudant')
  // Instanciate the Cloudant Initializer
  // Get the credentials from the VCAP file sitting in the environment
  var re = new RegExp('.*[Cc]loudant.*')
  var cloudantCredentials = wslEnv.getAppEnv().getService(re)['credentials']

  var cloudantInitializer = new CloudantInitializer(cloudantCredentials.username, cloudantCredentials.password, cloudantConfig)

  cloudantInitializer.checkCloudant().then(function (checkResult) {
    var needSync = cloudantInitializer.needSync(checkResult)
    if (needSync) {
      cloudantInitializer.syncCloudantConfig(checkResult).then(function (createResult) {
        debug(createResult)
        cb()
      }).catch((err) => {
        console.log(err)
        cb()
      })
    } else {
      cb()
    }
  }, function (err) {
    console.log(err)
    cb()
  })
}
