const fs = require('fs')
const path = require('path')

const desktopVersion = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', 'publish', 'desktop', 'version.json'), 'utf8')
).version
const mobileVersion = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', 'publish', 'mobile', 'version.json'), 'utf8')
).version

if (desktopVersion !== mobileVersion) {
  throw new Error(`Desktop and mobile version mismatch: ${desktopVersion} !== ${mobileVersion}`)
}

const manifestPath = path.join(__dirname, '..', 'release-assets.json')
const assets = JSON.parse(fs.readFileSync(manifestPath, 'utf8')).assets
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

console.log('Release assets verified.')
