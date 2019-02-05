import { Server } from './server/index'
const server = new Server()
server.httpsServer.listen(8235, () => {
  console.log(`kiera-web listening`)
})
