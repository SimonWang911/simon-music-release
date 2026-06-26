const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

const root = path.join(__dirname, '..')
const sourceDir = path.join(root, 'publish', 'source')
const scriptPath = path.join(sourceDir, 'default-api.js')
const metadataPath = path.join(sourceDir, 'default-api.json')

const readJson = file => JSON.parse(fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, ''))
const sha256 = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')

if (!fs.existsSync(scriptPath)) {
  throw new Error(`Missing source script: ${scriptPath}`)
}

const metadata = fs.existsSync(metadataPath)
  ? readJson(metadataPath)
  : {
      version: new Date().toISOString().slice(0, 10).replace(/-/g, '.'),
      file: 'default-api.js',
      desc: 'Simon default source',
    }

metadata.file = 'default-api.js'
metadata.sha256 = sha256(scriptPath)

fs.mkdirSync(sourceDir, { recursive: true })
fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2) + '\n', 'utf8')
console.log('Updated publish/source/default-api.json sha256.')
