const fs = require('fs')
const path = require('path')

const files = [
  path.join(__dirname, '..', 'publish', 'desktop', 'version.json'),
  path.join(__dirname, '..', 'publish', 'mobile', 'version.json'),
]

for (const file of files) {
  const data = JSON.parse(fs.readFileSync(file, 'utf8'))
  if (typeof data.version !== 'string' || !data.version) {
    throw new Error(`${file}: version must be a non-empty string`)
  }
  if (typeof data.desc !== 'string') {
    throw new Error(`${file}: desc must be a string`)
  }
  if (!Array.isArray(data.history)) {
    throw new Error(`${file}: history must be an array`)
  }
  for (const item of data.history) {
    if (typeof item.version !== 'string') {
      throw new Error(`${file}: history item version must be a string`)
    }
    if (typeof item.desc !== 'string') {
      throw new Error(`${file}: history item desc must be a string`)
    }
  }
}

console.log('Release metadata verified.')
