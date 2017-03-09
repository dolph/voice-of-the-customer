/*
* IBM Confidential
* OCO Source Materials
* (C) Copyright IBM Corp. 2015, 2016
* The source code for this program is not published or otherwise divested of its trade secrets, irrespective of what has been deposited with the U.S. Copyright Office.
*/
'use strict'

var Cloudant = require('cloudant')
var wslEnv = require('../utils/wsl-env')
var CloudantInitializer = require('../utils/cloudant-initializer')
var cloudantConfig = require('../config/cloudant-config.json')

var debug = require('debug')('loopback:init-cloudant')

module.exports = function (app, cb) {
  debug('Initializing Cloudant')
  // Get the credentials from the VCAP file sitting in the environment
  var re = new RegExp('Cloudant.*')
  var cloudantCredentials = wslEnv.getAppEnv().getService(re)['credentials']

  // Initialize Cloudant with my account.
  var cloudant = Cloudant({account: cloudantCredentials.username, password: cloudantCredentials.password})
  // Instanciate the Cloudant Initializer
  var cloudantInitializer = new CloudantInitializer(cloudant, cloudantConfig)

  cloudantInitializer.checkCloudant().then(function (checkResult) {
    var needSync = cloudantInitializer.needSync(checkResult)
    if (needSync) {
      cloudantInitializer.syncCloudantConfig(checkResult).then(function (createResult) {
        debug(createResult)
        console.log('*** Synchronization completed. ***')
        console.log('*** Application should be terminated.  This is required for the indexes to be created the next time the app starts up ***')
        cb()
      })
    } else {
      cb()
    }
  }, function (err) {
    console.log(err)
  })
}
