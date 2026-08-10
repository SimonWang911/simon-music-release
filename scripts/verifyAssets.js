const fs = require('fs')
const path = require('path')
const { collectDesktopReleaseFailures } = require('./desktopReleaseContract')

const root = path.join(__dirname, '..')
const readJson = file => JSON.parse(fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, ''))
const failures = collectDesktopReleaseFailures({
  desktopVersion: readJson(path.join(root, 'publish', 'desktop', 'version.json')).version,
  mobileVersion: readJson(path.join(root, 'publish', 'mobile', 'version.json')).version,
  targetSnapshot: readJson(path.join(root, 'desktop-release-targets.json')),
  assets: readJson(path.join(root, 'release-assets.json')).assets,
  assetDir: process.env.RELEASE_ASSET_DIR,
})

if (failures.length) {
  console.error('Release asset verification failed:')
  for (const failure of failures) console.error(`- ${failure}`)
  process.exit(1)
}
console.log('Release assets verified.')
