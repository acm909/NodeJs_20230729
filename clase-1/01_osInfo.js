const os = require('node:os')

console.log(os.hostname())

const mb = 1024 * 1024
console.log('Nombre del SO ' + os.platform())
console.log('Arquitectura ' + os.arch())
console.log('CPU ' + os.cpus())
console.log('Version SO' + os.release())
console.log('Memoria total ' + os.totalmem() / mb)
console.log('Memoria disponible ' + os.freemem() / mb)