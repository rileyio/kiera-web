import path from 'path';

export const routes = [
  {
    action: app,
    method: 'get',
    middleware: [],
    path: '/app',
    view: 'app'
  },
  {
    action: index,
    method: 'get',
    middleware: [
      
    ],
    path: '/',
    view: 'index'
  }
]

function app(server, route) {
  console.log('app controller')
  server.app.get(route.path,
    (req, res) => {
      res.status(200).sendFile(path.join(server.appPath, 'app.html'))
    },
  )
}

function index(server, route) {
  console.log('index controller')
  server.app.get(route.path,
    (req, res) => {
      res.status(200).sendFile(path.join(server.appPath, 'index.html'))
    },
  )
}