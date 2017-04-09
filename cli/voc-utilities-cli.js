'use strict'

var inquirer = require('inquirer')
var fs = require('fs')
var request = require('request')
var URL = require('url')

vocUtilitiesCli()

// This is the controller function
function vocUtilitiesCli () {
  authenticate((appUrl, token) => {
    actionsController(appUrl, token, function () {
      console.log('Bye!!')
    })
  })
}

function actionsController (appUrl, token, done) {
  inquirer.prompt(getActionQuestions()).then((answer) => {
    switch (answer.action) {
      case 'load-cloudant':
        inquirer.prompt(getLoadCloudantQuestions()).then((answer) => {
          let inputFolder = answer.inputFolder
          loadCloudant(inputFolder, appUrl, token, () => {
            actionsController(appUrl, token, done)
          })
        })
        break
      case 'content-info':
        viewContentInfo(appUrl, token, () => {
          actionsController(appUrl, token, done)
        })
        break
      case 'collection-info':
        viewCollectionInfo(appUrl, token, () => {
          actionsController(appUrl, token, done)
        })
        break
      case 'load-discovery':
        loadDiscovery(appUrl, token, () => {
          actionsController(appUrl, token, done)
        })
        break
      case 'done': {
        done()
        break
      }
      default:

    }
  })
}

function getEnvironmentQuestions () {
  return [
    {
      name: 'appUrl',
      message: 'What is the application url',
      validate: function (input) {
        if (!input || input.trim().length === 0) {
          return 'Application url is required.'
        }
        return true
      }
    },
    {
      name: 'username',
      message: 'What is the username for the application',
      validate: function (input) {
        if (!input || input.trim().length === 0) {
          return 'Username is required.'
        }
        return true
      }
    },
    {
      name: 'password',
      type: 'password',
      message: 'What is the password for the application',
      validate: function (input) {
        if (!input || input.trim().length === 0) {
          return 'Password is required.'
        }
        return true
      }
    }
  ]
}

function getActionQuestions () {
  return [
    {
      name: 'action',
      message: 'What would you like to do?',
      type: 'list',
      choices: [
        {
          name: 'Upload content from this computer into Cloudant',
          value: 'load-cloudant'
        },
        {
          name: 'View your content in Cloudant information',
          value: 'content-info'
        },
        {
          name: 'View your collection information',
          value: 'collection-info'
        },
        {
          name: 'Load content from Cloudant into Discovery',
          value: 'load-discovery'
        },
        {
          name: 'Exit this utility',
          value: 'done'
        }
      ]
    }
  ]
}

function getLoadCloudantQuestions () {
  return [
    {
      name: 'inputFolder',
      message: 'Full path to folder containing the JSON files: ',
      validate: function (input) {
        if (!input) {
          return 'This value is required.'
        }
        let exists = fs.existsSync(input)
        if (exists) {
          return true
        } else {
          return 'Folder does not exist or is inaccesible.'
        }
      }
    }
  ]
}

function loadCloudant (inputFolder, appUrl, token, cb) {
  fs.readdir(inputFolder, (err, files) => {
    if (err) {
      console.log(err)
      cb(err)
    }
    uploadFile(files, inputFolder, appUrl, token, 0, () => {
      console.log('All files processed.')
      cb()
    })
  })
}

function viewContentInfo (appUrl, token, done) {
  let url = URL.resolve(appUrl, 'api/voc-content/getContentInfo?access_token=' + token)
  let options = {
    method: 'get',
    url: url
  }
  request(options, (err, res, body) => {
    if (err) {
      console.log(err)
    } else {
      if (res.statusCode === 200) {
        console.log(JSON.stringify(JSON.parse(body), null, 4))
      } else {
        console.log('********************************************************************************')
        console.log('Error occurred getting the Collection info (' + res.statusCode + ')')
        console.log('Check the server log file for detailed information on the error.')
        console.log('********************************************************************************')
      }
    }
    done()
  })
}

function viewCollectionInfo (appUrl, token, done) {
  let url = URL.resolve(appUrl, 'api/discovery/getCollectionInfo?access_token=' + token)
  let options = {
    method: 'get',
    url: url
  }
  request(options, (err, res, body) => {
    if (err) {
      console.log(err)
    } else {
      if (res.statusCode === 200) {
        console.log(JSON.stringify(JSON.parse(body), null, 4))
      } else {
        console.log('********************************************************************************')
        console.log('Error occurred getting the Collection info (' + res.statusCode + ')')
        console.log('Check the server log file for detailed information on the error.')
        console.log('********************************************************************************')
      }
    }
    done()
  })
}

function loadDiscovery (appUrl, token, done) {
  let url = URL.resolve(appUrl, 'api/discovery/addContent?access_token=' + token)
  let options = {
    method: 'post',
    url: url
  }
  request(options, (err, res, body) => {
    if (err) {
      console.log(err)
    } else {
      if (res.statusCode === 200) {
        console.log('Job to loading content into discovery successfully submitted')
      } else {
        console.log('********************************************************************************')
        console.log('Error occurred submitting the job (' + res.statusCode + ')')
        console.log('Check the server log file for detailed information on the error.')
        console.log('********************************************************************************')
      }
    }
    done()
  })
}

function uploadFile (files, inputFolder, appUrl, token, idx, done) {
  if (idx < files.length) {
    let file = inputFolder + '/' + files[idx]
    console.log('Processing file ' + file)
    let content = fs.readFileSync(file, 'utf8')
    parseContent(content, (err, json) => {
      if (err) {
        console.log('Error parsing file: ' + err)
        idx++
        uploadFile(files, inputFolder, appUrl, token, idx, function () {
          done()
        })
      } else {
        let url = URL.resolve(appUrl, 'api/voc-content/bulkUpload?access_token=' + token)
        let data = {
          bulkRequest: json
        }
        let options = {
          method: 'post',
          body: data,
          json: true,
          url: url
        }
        request(options, (err, res, body) => {
          if (err) {
            console.log(err)
            done()
          }
          // Process the next file
          idx++
          uploadFile(files, inputFolder, appUrl, token, idx, function () {
            done()
          })
        })
      }
    })
  } else {
    done()
  }
}

function parseContent (content, cb) {
  try {
    let json = JSON.parse(content)
    cb(null, json)
  } catch (err) {
    cb(err)
  }
}

function authenticate (done) {
  inquirer.prompt(getEnvironmentQuestions()).then((answer) => {
    let appUrl = answer.appUrl
    let username = answer.username
    let password = answer.password
    login(appUrl, username, password, (err, token) => {
      if (err) {
        console.log(err)
        authenticate(done)
      } else {
        done(appUrl, token)
      }
    })
  })
}

function login (appUrl, username, password, cb) {
  let url = URL.resolve(appUrl, 'api/Auth/login')
  let credentials = {
    username: username,
    password: password
  }
  let options = {
    method: 'post',
    body: credentials,
    json: true,
    url: url
  }
  request(options, function (err, res, body) {
    if (err) {
      console.log(err)
      cb(err)
    }
    if (res.statusCode === 200) {
      cb(null, body.id)
    } else {
      cb('Error login into the application. (' + res.statusCode + ')')
    }
  })
}
