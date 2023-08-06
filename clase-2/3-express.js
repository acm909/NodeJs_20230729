const express = require('express')
const dittoJson = require('./pokemon/ditto.json')

const PORT = process.env.PORT ?? 1234
const app = express()
app.disable('x-powered-by')
app.use(express.json())

/*
app.use((req, res, next) => {
  if (req.method !== 'POST') return next()
  if (req.headers['content-type' !== 'application/json']) return next()

  // solo llegan peticiones post cuyo content-type es application/json
  let body = ''
  req.on('data', trozo => {
    body += trozo.toString()
  })
  req.on('end', () => {
    const data = JSON.parse(body)
    data.hora = Date.now()
    // Mutar la request y meter la informacion en el req.body
    req.body = data
    next()
  })
}) */

app.get('/', (req, res) => {
  res.send('<h1>Mi página</h1>')
})

app.post('/pokemon', (req, res) => {
  console.log(req.body)
  res.status(201).json(req.body)
})

app.get('/pokemon/ditto', (req, res) => {
  res.json(dittoJson)
})

app.use((req, res) => {
  res.status(404).send(`<h1>Error 404 recurso: <em style="color:red"> ${req.url} </em> no encontrado`)
})
app.listen(PORT, () => {
  console.log(`server listening on port http://localhost:${PORT}`)
})
