const http = require('node:http')
const dittoJson = require('./pokemon/ditto.json')

const processRequest = (req, res) => {
  const { method, url } = req

  switch (method) {
    case 'GET':
      switch (url) {
        case '/pokemon/ditto':
          res.setHeader('Content-Type', 'application/json; charset=utf-8')
          return res.end(JSON.stringify(dittoJson))
        default:
          res.statusCode = 404
          res.setHeader('Content-Type', 'text/html; charset=utf-8')
          return res.end('<h1>404 Not found</h1>')
      }
    case 'POST':
      switch (url) {
        case '/pokemon':{
          let body = ''
          // Para recuperar los parámetros de la request habrá que escuchar el evento data
          req.on('data', trozo => {
            body += trozo.toString()
          })
          req.on('end', () => {
            const data = JSON.parse(body)
            // llamar a BD para guardar la info
            res.writeHead(201, { 'Content-Type': 'application/json; charset=utf-8' })
            data.timeStamp = Date.now()
            res.end(JSON.stringify(data))
          })
          break }
        default:
          res.statusCode = 404
          res.setHeader('Content-Type', 'text/html; charset=utf-8')
          return res.end('<h1>404 Not found</h1>')
      }
  }
}

const server = http.createServer(processRequest)

server.listen(1234)
