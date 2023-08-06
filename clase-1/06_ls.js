const fs = require('node:fs')

fs.readdir('.', (err, files) => {
    if (err) {
        console.log('Ops parece que algo ha ido mal', err)
        return
    }
    files.forEach((file) => {
        console.log(file)
    })
})