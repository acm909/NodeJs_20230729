const fs = require('node:fs/promises')

console.log('Leyendo el primer archivo')
const text = fs.readFile('./archivo.txt', 'utf-8')
  .then(text => {
    console.log(text)
  })
console.log('Mientras lee el archivo1')

console.log('Leyendo el segundo archivo')
const secondText = fs.readFile('./archivo2.txt', 'utf-8')
  .then(text => {
    console.log(text)
  })

// Exportamos las funciones para que no muestre el error de que nunca son llamadas
module.exports = {
  text,
  secondText
}
