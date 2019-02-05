export class Router {
  constructor (routes, server) {
    this.server = server
    this.routes = routes

    // Setup restify routes
    for (let index = 0; index < this.routes.length; index++) {
      const route = this.routes[index]
      console.log(`Router => Setting up route ${route.path}`)

      route.action(this.server, route)
      // this.server.app[route.method]
    }
  }
}
