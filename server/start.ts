import { Server } from './index'

const server = new Server()

server.httpsServer.listen(8235, () => {
  console.log(`kiera-web-server listening on: 8235`)
})
