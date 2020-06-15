require('dotenv').config()

const fs = require('fs')
const path = require('path')

module.exports = {
  devServer: {
    host: process.env.VUE_APP_HOST,
    https:
      fs.existsSync(path.join('./server.key')) && fs.readFileSync(path.join('./server.crt'))
        ? {
            key: fs.readFileSync('./server.key'),
            cert: fs.readFileSync('./server.crt')
          }
        : undefined
  }
}
