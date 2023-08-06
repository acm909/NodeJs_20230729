const http = require('node:http')
const { fidnAvailablePort } = require('./10_free-port.js')

console.log(process.env)

const server = http.createServer((request, response) => {
  console.log('request received')
  response.end('Hola mundo')
})

fidnAvailablePort(100).then(port => {
  server.listen(port, () => {
    console.log(`server listening on port http://localhost:${port}`)
  })
})
