var path = require('path')
var fs = require('fs')
var mustache = require('mustache')
var config = require('./config')

async.waterfall([
  (callback) => {
    fs.readFile(path.resolve(__dirname, 'templates/systemd/pi-config-api.service.template'), (error, data) => {
      if (error) {
        callback(error)
      } else {
        callback(null, data.toString())
      }
    })
  },
  (template, callback) => {
    var output = mustache.render(template, {
      install_path: __dirname
    })

    callback(output)
  },
  (output, callback) => {
    fs.writeFile('/etc/systemd/system/pi-config-api.service', output, callback)
  }
], (error) => {
  if (error) {
    console.log('ERROR: Could not write service file. ' + error);
  } else {
    console.log('Installed pi-config-api.service file.')
    console.log('If you are also running pi-config, you do not need to do anything further.')
    console.log('If using the API stand-alone, you can now run "systemctl start pi-config-api" and "systemctl enable pi-config-api" to start and enable the service.')
  }
})
