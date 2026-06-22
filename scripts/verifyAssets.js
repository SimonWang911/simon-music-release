const fs = require('fs')
const path = require('path')
const crypto = require('crypto')
const YAML = require('yaml')

const root = path.join(__dirname, '..')
const readJson = file => JSON.parse(fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, ''))
const desktopVersion = readJson(path.join(root, 'publish', 'desktop', 'version.json')).version
const mobileVersion = readJson(path.join(root, 'publish', 'mobile', 'version.json')).version

const manifestPath = path.join(root, 'release-assets.json')
const assets = readJson(manifestPath).assets
const assetSet = new Set(assets)

const required = [
  'desktop-latest-x64.yml',
  'desktop-latest-ia32.yml',
  `simon-music-desktop-v${desktopVersion}-x64-Setup.exe`,
  `simon-music-desktop-v${desktopVersion}-x64-Setup.exe.blockmap`,
  `simon-music-desktop-v${desktopVersion}-ia32-Setup.exe`,
  `simon-music-desktop-v${desktopVersion}-ia32-Setup.exe.blockmap`,
  `simon-music-mobile-v${mobileVersion}-arm64-v8a.apk`,
  `simon-music-mobile-v${mobileVersion}-armeabi-v7a.apk`,
]

for (const name of required) {
  if (!assetSet.has(name)) {
    throw new Error(`Missing release asset: ${name}`)
  }
}

if (assetSet.has(`simon-music-desktop-v${desktopVersion}-x86-Setup.exe`)) {
  throw new Error('Release asset list must use ia32, not x86, for 32-bit desktop installer')
}

const sha512Base64 = file => crypto.createHash('sha512').update(fs.readFileSync(file)).digest('base64')
const readChannel = file => YAML.parse(fs.readFileSync(file, 'utf8'))

if (process.env.RELEASE_ASSET_DIR) {
  for (const item of [
    {
      channelFile: 'desktop-latest-x64.yml',
      installer: `simon-music-desktop-v${desktopVersion}-x64-Setup.exe`,
    },
    {
      channelFile: 'desktop-latest-ia32.yml',
      installer: `simon-music-desktop-v${desktopVersion}-ia32-Setup.exe`,
    },
  ]) {
    const channelPath = path.join(process.env.RELEASE_ASSET_DIR, item.channelFile)
    const installerPath = path.join(process.env.RELEASE_ASSET_DIR, item.installer)
    const blockmapPath = path.join(process.env.RELEASE_ASSET_DIR, `${item.installer}.blockmap`)

    for (const file of [channelPath, installerPath, blockmapPath]) {
      if (!fs.existsSync(file)) throw new Error(`Missing staged release file: ${file}`)
    }

    const channel = readChannel(channelPath)
    const stat = fs.statSync(installerPath)
    const sha512 = sha512Base64(installerPath)

    if (channel.version !== desktopVersion) throw new Error(`${item.channelFile}: version mismatch`)
    if (channel.path !== item.installer) throw new Error(`${item.channelFile}: path mismatch`)
    if (channel.sha512 !== sha512) throw new Error(`${item.channelFile}: sha512 mismatch`)
    if (!Array.isArray(channel.files) || channel.files.length !== 1) {
      throw new Error(`${item.channelFile}: files must contain exactly one installer`)
    }
    if (channel.files[0].url !== item.installer) throw new Error(`${item.channelFile}: files[0].url mismatch`)
    if (channel.files[0].sha512 !== sha512) throw new Error(`${item.channelFile}: files[0].sha512 mismatch`)
    if (channel.files[0].size !== stat.size) throw new Error(`${item.channelFile}: files[0].size mismatch`)
  }
}

console.log('Release assets verified.')
