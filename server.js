var path = require('path')
var wifiManager = require('wifi-manager')
var express = require('express')
var bodyParser = require('body-parser')
var hostnamectl = require('hostnamectl')
var config = require('./config')

var app = express()
app.set('trust proxy', true)

app.use(bodyParser.json());

app.get('/api/hostname', function (request, response) {
  hostnamectl.get_hostname((error, hostname) => {
    if (error) {
      console.log('ERROR: Could not retrieve hostname. ' + error)
    } else {
      console.log('SUCCESS: Retrieved hostname (' + hostname + ')')
    }

    response.send({
      status: error ? 'ERROR' : 'SUCCESS',
      hostname: hostname
    })
  })
})

app.post('/api/hostname', (request, response) => {
  hostnamectl.set_hostname(request.body.hostname, (error) => {
    if (error) {
      console.log('ERROR: Could not set hostname. ' + error)
    } else {
      console.log('SUCCESS: Hostname set')
    }

    response.send({status: error ? 'ERROR' : 'SUCCESS'});
  })
})

app.get('/api/wifi/scan', (request, response) => {
  wifiManager.scan_networks((error, results) => {
    if (error) {
      console.log('ERROR: Could not scan wifi networks. ' + error)
      response.send({ status: 'ERROR', error: error })
    } else {
      console.log('SUCCESS: Found ' + result[0].scan_results.length + ' networks')
      results[0].status = 'SUCCESS'
      response.send(results[0])
    }
  })
})

app.get('/api/wifi/isEnabled/:wifiInterface', (request, response) => {
  var wifi_interface = request.params.wifiInterface

  wifiManager.is_wifi_enabled(wifi_interface, (error, is_enabled) => {
    if (error) {
      console.log('ERROR: Could not check if wifi is enabled. ' + error)
      response.send({ status: 'ERROR', error: error })
    } else {
      console.log('SUCCESS: Checked if wifi is enabled (' + (is_enabled ? 'Yes' : 'No') + ').')
      response.send({ status: 'SUCCESS', is_enabled: is_enabled })
    }
  })
})

app.get('/api/wifi/isConnected/:wifiInterface', (request, response) => {
  var wifi_interface = request.params.wifiInterface

  wifiManager.is_wifi_connected(wifi_interface, (error, is_connected) => {
    if (error) {
      console.log('ERROR: Could not check if wifi is connected. ' + error)
      response.send({ status: 'ERROR', error: error })
    } else {
      console.log('SUCCESS: Checked if wifi is connected (' + (is_connected ? 'Yes' : 'No') + ').')
      response.send({ status: 'SUCCESS', is_connected: is_connected })
    }
  })
})

app.post('/api/wifi/enable', (request, response) => {
  var wifi_interface = request.body.wifi_interface

  wifiManager.enable_wifi(wifi_interface, (error) => {
    if (error) {
      console.log('ERROR: Could not enable wifi on interface ' + wifi_interface)
      response.send({ status: 'ERROR', error: error })
    } else {
      console.log('SUCCESS: Enabled wifi on interface ' + wifi_interface)
      response.send({ status: 'SUCCESS' })
    }
  })
})

app.post('/api/wifi/disable', (request, response) => {
  var wifi_interface = request.body.wifi_interface

  wifiManager.disable_wifi(wifi_interface, (error) => {
    if (error) {
      console.log('ERROR: Could not disable wifi on interface ' + wifi_interface)
      response.send({ status: 'ERROR', error: error })
    } else {
      console.log('SUCCESS: Disabled wifi on interface ' + wifi_interface)
      response.send({ status: 'SUCCESS' })
    }
  })
})

app.post('/api/wifi/save', (request, response) => {
  var wifi_interface = request.body.wifi_interface
  var connection_info = {
    wifi_ssid: request.body.wifi_ssid,
    wifi_passcode: request.body.wifi_passcode
  }

  wifiManager.save_profile(wifi_interface, connection_info, (error) => {
    if (error) {
      console.log('ERROR: Could not save wifi profile. ' + error)
      response.send({ status: 'ERROR', error: error })
    } else {
      console.log('SUCCESS: Saved wifi profile')
      response.send({ status: 'SUCCESS '})
    }
  })
})

app.post('/api/wifi/delete', (request, response) => {
  var wifi_interface = request.body.wifi_interface
  var wifi_ssid = request.body.wifi_ssid

  wifiManager.delete_profile(wifi_interface, wifi_ssid, (error) => {
    if (error) {
      console.log('ERROR: Could not delete wifi profile. ' + error)
      response.send({ status: 'ERROR', error: error })
    } else {
      console.log('SUCCESS: Deleted wifi profile')
      response.send({ status: 'SUCCESS' })
    }
  })
})

console.log('> Starting API server...')

console.log('> Listening at ' + config.server.address + ':' + config.server.port)
app.listen(config.server.port, config.server.address)
