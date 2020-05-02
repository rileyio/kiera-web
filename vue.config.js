const fs = require('fs')

module.exports = {
  devServer: {
    host: 'dev.tdm.io',
    https: {
      ca: fs.readFileSync('./ca.crt'),
      key: fs.readFileSync('./server.key'),
      cert: fs.readFileSync('./server.crt')
    }
  }
}
