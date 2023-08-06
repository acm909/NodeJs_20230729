const fs = require('node:fs')

console.log('Leyendo el primer archivo')
const text = fs.readFile('./archivo.txt', 'utf-8', (err, text) => {
  if (!err) {
    console.log(text)
  } else {
    console.log(err)
  }
})

console.log('Mientras lee el archivo1')

console.log('Leyendo el segundo archivo')
const secondText = fs.readFile('./archivo2.txt', 'utf-8', (err, text) => {
  if (!err) {
    console.log(text)
  } else {
    console.log(err)
  }
})

module.exports = {
  text,
  secondText
}
