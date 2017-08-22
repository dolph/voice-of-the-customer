'use strict'

var Request = require('Request')
var os = require('os')

let env = null;
let col = null;
let conf = null;
let user = null;
let password = null;

let json = {
  'source_url': 'https://foo.com/t5/Wireless-Account/Missing-Newgistics-package/td-p/4294655',
  'tags': [
    'Wireless',
    'Wireless Account & Billing',
    'Wireless Account'
  ],
  'title': 'Missing Newgistics package',
  'contact_date': '08-13-2015 8:13 AM',
  'contact_id': 'FranklinF',
  'text': 'I am being billed $706 for failing to return a defective device. This happened months ago. I replaced my defective Samsung Galaxy S6 Edge and had sent it in the mail and followed the instructions to the letter to return the device back to AT&T. I could not get a receipt for dropping it off because the USPS post office said they didnt give them out but i didnt worry because i had a Newgistics tracking number and thought that\'d be fine and i was dead wrong.Weeks later the package is no where to be found. Newgistics tracking number keeps saying there is no tracking number for the values and i am being charged $706 and my service has been suspended. I had chatted with an AT&T CSR online and she had told me that they recieved the device and she will file a case so that i will be credited $706 to my account but nothing has happened. i contact AT&T again and they tell me they don\'t have the phone when the last person i spoke to said they did. i have tried almost everything but it seems that i will be forced to pay for a defective phone that i DO NOT have.Do i have a case here? Is there any where i can report AT&T for this because i KNOW im not the only one with this problem. What are my options??'
}

console.log(os.tmpdir())
// addDocToDiscovery(json)

// Check the status with the link below
// curl -X DELETE \-u "xxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx":"xxxxxxxxxxxx" "https://gateway.watsonplatform.net/discovery/api/v1/environments/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/collections/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/documents/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx?version=2016-12-01"

function addDocToDiscovery (doc) {
  let formData = {
    'file': Buffer.from(JSON.stringify(doc), 'utf8'),
    'type': 'application/json',
    'configuration_id': conf
  }
  let url = 'https://gateway.watsonplatform.net/discovery/api/v1/environments/' + env + '/collections/' + col + '/documents?version=2016-12-01'
  let params = {
    url: url,
    method: 'POST',
    json: true,
    formData: formData
  }
  let request = Request.post(url, function optionalCallback (err, httpResponse, body) {
    if (err) {
      return console.error('upload failed:', err)
    }
    console.log('Upload successful!  Server responded with:', body)
  }).auth(user, password)

  var form = request.form()
  form.append('file', Buffer.from(JSON.stringify(doc), 'utf8'), {
    filename: 'myfile.txt',
    contentType: 'application/json'
  })
  form.append('configuration_id', conf)
}
