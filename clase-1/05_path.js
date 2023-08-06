const path = require('node:path')

// barra separadora de carpetas segun SO
console.log(path.sep)

const filePath = path.join('contenct', 'subfolder', 'test.txt')
console.log(filePath)

const base = path.basename('/escritorio/antonio/nuevo.txt', '.txt')
console.log(base)

const extension = path.extname('image.png')
console.log(extension)
