const http = require('node:http')
const fs = require('node:fs')

let port = process.env.PORT

if (!port) {
  port = 1235
}

const procesarRequest = (req, res) => {
  res.setHeader('Content-type', 'text/html; charset=utf-8')
  if (req.url === '/') {
    res.statusCode = 200
    res.end('Bienvenidos a mi pagina de inicio')
  } else if (req.url === '/imagen_numero_1.png') {
    fs.readFile('./imagen.jpg', (err, data) => {
      if (err) {
        res.statusCode = 500
        res.end('<h1>500 Internal Server Error</h1>')
      } else {
        res.statusCode = 200
        res.setHeader('Content-Type', 'image/jpg')
        res.end(data)
      }
    })
  } else if (req.url === '/contacto') {
    res.statusCode = 200
    res.end('Bienvenidos a mi pagina de CONTACTO')
  } else {
    res.statusCode = 400
    res.end('<h1>404 not found</h1>')
  }
}

const server = http.createServer(procesarRequest)

server.listen(port, () => {
  console.log(`server listening on port http://localhost:${port}`)
})
