const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

const root = path.join(__dirname, '..')
const sourceDir = path.join(root, 'publish', 'source')
const metadataPath = path.join(sourceDir, 'default-api.json')
const scriptPath = path.join(sourceDir, 'default-api.js')

const readJson = file => JSON.parse(fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, ''))
const sha256 = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')

if (!fs.existsSync(metadataPath)) throw new Error(`Missing source metadata: ${metadataPath}`)
if (!fs.existsSync(scriptPath)) throw new Error(`Missing source script: ${scriptPath}`)

const metadata = readJson(metadataPath)
if (typeof metadata.version !== 'string' || !metadata.version.trim()) {
  throw new Error('source metadata version must be a non-empty string')
}
if (metadata.file !== 'default-api.js') {
  throw new Error('source metadata file must be default-api.js')
}
if (!/^[a-f0-9]{64}$/.test(metadata.sha256)) {
  throw new Error('source metadata sha256 must be 64 lowercase hex characters')
}

const script = fs.readFileSync(scriptPath, 'utf8')
const actualHash = sha256(scriptPath)
if (actualHash !== metadata.sha256) {
  throw new Error(`source sha256 mismatch: expected ${metadata.sha256}, got ${actualHash}`)
}

const header = /^\/\*[\s\S]+?\*\//.exec(script)?.[0]
if (!header) throw new Error('default-api.js must start with a metadata comment header')

try {
  new Function(script)
} catch (error) {
  throw new Error(`default-api.js must be valid JavaScript: ${error.message}`)
}

console.log('Release source verified.')
