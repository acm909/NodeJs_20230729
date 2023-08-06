const crypto = require('node:crypto')

console.log(crypto.randomUUID())

const ids = []
for (let i = 0; i < 10; i++) {
  ids[i] = crypto.randomUUID()
}

console.log(ids)
