const crypto = require('crypto')
const fs = require('fs')
const path = require('path')
const YAML = require('yaml')

const root = path.join(__dirname, '..')
const readJson = file => JSON.parse(fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, ''))
const desktopVersion = readJson(path.join(root, 'publish', 'desktop', 'version.json')).version
const mobileVersion = readJson(path.join(root, 'publish', 'mobile', 'version.json')).version
const targetSnapshot = readJson(path.join(root, 'desktop-release-targets.json'))
const assets = readJson(path.join(root, 'release-assets.json')).assets
const shaHex = (algorithm, file) => crypto.createHash(algorithm).update(fs.readFileSync(file)).digest('hex')

if (targetSnapshot.version !== desktopVersion) {
  throw new Error(`Desktop target snapshot version must be ${desktopVersion}`)
}
const expectedChannels = {
  'standard-x64': 'desktop-latest-x64.yml',
  'standard-ia32': 'desktop-latest-ia32.yml',
  'standard-arm64': 'desktop-latest-arm64.yml',
  'win7-x64': 'desktop-latest-win7-x64.yml',
  'win7-ia32': 'desktop-latest-win7-ia32.yml',
}
if (targetSnapshot.targets.length !== Object.keys(expectedChannels).length) {
  throw new Error('Desktop target snapshot must contain exactly five targets')
}

const extension = targetSnapshot.platformExtension
if (
  extension?.releaseTag !== `v${desktopVersion}` ||
  !/^[0-9a-f]{40}$/.test(extension?.desktopCommit ?? '') ||
  extension?.sourceTag !== `desktop-v${desktopVersion}-platform-extension-20260805` ||
  extension?.verification?.scope !== 'static-build' ||
  extension?.verification?.targetDeviceRuntimeTested !== false
) {
  throw new Error('Desktop platform extension provenance is incomplete')
}
const extensionIds = ['standard-arm64', 'win7-x64', 'win7-ia32']
if (
  !Array.isArray(extension.targets) ||
  extension.targets.length !== extensionIds.length ||
  extension.targets.some(target => !extensionIds.includes(target.id))
) {
  throw new Error('Desktop platform extension provenance must contain exactly three targets')
}

const required = []
const seenTargets = new Set()
const targetById = new Map(targetSnapshot.targets.map(target => [target.id, target]))
for (const target of targetSnapshot.targets) {
  if (seenTargets.has(target.id)) throw new Error(`Duplicate desktop target: ${target.id}`)
  seenTargets.add(target.id)
  if (target.channelFile !== expectedChannels[target.id]) {
    throw new Error(`${target.id}: channel must be ${expectedChannels[target.id]}`)
  }
  const expectedInstaller = target.flavor === 'win7'
    ? `simon-music-desktop-v${desktopVersion}-win7-${target.arch}-Setup.exe`
    : `simon-music-desktop-v${desktopVersion}-${target.arch}-Setup.exe`
  if (target.installer !== expectedInstaller) {
    throw new Error(`${target.id}: installer must be ${expectedInstaller}`)
  }
  if (target.flavor === 'win7' && target.electronVersion !== '22.3.27') {
    throw new Error(`${target.id}: Win7 target must use Electron 22.3.27`)
  }
  if (target.id === 'standard-arm64' && target.arch !== 'arm64') {
    throw new Error('standard-arm64 must not point to another architecture')
  }
  required.push(target.channelFile, target.installer, `${target.installer}.blockmap`)
}

const provenanceAssetNames = new Set()
const provenanceAssetIds = new Set()
for (const extensionTarget of extension.targets) {
  const target = targetById.get(extensionTarget.id)
  if (!target) throw new Error(`Unknown platform extension target: ${extensionTarget.id}`)
  const expectedNames = [target.channelFile, target.installer, `${target.installer}.blockmap`]
  if (!Array.isArray(extensionTarget.assets) || extensionTarget.assets.length !== expectedNames.length) {
    throw new Error(`${target.id}: platform extension provenance must contain three assets`)
  }
  const actualNames = new Set(extensionTarget.assets.map(asset => asset.name))
  for (const name of expectedNames) {
    if (!actualNames.has(name)) throw new Error(`${target.id}: missing provenance for ${name}`)
  }
  for (const asset of extensionTarget.assets) {
    if (
      provenanceAssetNames.has(asset.name) ||
      provenanceAssetIds.has(asset.githubAssetId) ||
      !Number.isSafeInteger(asset.githubAssetId) ||
      asset.githubAssetId <= 0 ||
      !Number.isSafeInteger(asset.size) ||
      asset.size <= 0 ||
      !/^[0-9a-f]{64}$/.test(asset.sha256) ||
      !/^[0-9a-f]{128}$/.test(asset.sha512)
    ) {
      throw new Error(`${target.id}: invalid provenance for ${asset.name}`)
    }
    provenanceAssetNames.add(asset.name)
    provenanceAssetIds.add(asset.githubAssetId)
    if (process.env.RELEASE_ASSET_DIR) {
      const file = path.join(process.env.RELEASE_ASSET_DIR, asset.name)
      if (!fs.existsSync(file)) throw new Error(`Missing provenance asset file: ${file}`)
      if (
        fs.statSync(file).size !== asset.size ||
        shaHex('sha256', file) !== asset.sha256 ||
        shaHex('sha512', file) !== asset.sha512
      ) {
        throw new Error(`${target.id}: provenance hash or size mismatch for ${asset.name}`)
      }
    }
  }
}
required.push(
  `simon-music-mobile-v${mobileVersion}-arm64-v8a.apk`,
  `simon-music-mobile-v${mobileVersion}-armeabi-v7a.apk`
)

if (new Set(assets).size !== assets.length) throw new Error('release-assets.json contains duplicates')
const actualSet = new Set(assets)
const requiredSet = new Set(required)
for (const name of required) {
  if (!actualSet.has(name)) throw new Error(`Missing release asset: ${name}`)
}
const unexpected = assets.filter(name => !requiredSet.has(name))
if (unexpected.length) throw new Error(`Unexpected release assets: ${unexpected.join(', ')}`)

const sha512Base64 = file => crypto.createHash('sha512').update(fs.readFileSync(file)).digest('base64')
if (process.env.RELEASE_ASSET_DIR) {
  for (const target of targetSnapshot.targets) {
    const channelPath = path.join(process.env.RELEASE_ASSET_DIR, target.channelFile)
    const installerPath = path.join(process.env.RELEASE_ASSET_DIR, target.installer)
    const blockmapPath = path.join(process.env.RELEASE_ASSET_DIR, `${target.installer}.blockmap`)
    for (const file of [channelPath, installerPath, blockmapPath]) {
      if (!fs.existsSync(file)) throw new Error(`Missing staged release file: ${file}`)
    }

    const channel = YAML.parse(fs.readFileSync(channelPath, 'utf8'))
    const stat = fs.statSync(installerPath)
    const sha512 = sha512Base64(installerPath)
    if (channel.version !== desktopVersion) throw new Error(`${target.channelFile}: version mismatch`)
    if (channel.path !== target.installer) throw new Error(`${target.channelFile}: path mismatch`)
    if (channel.sha512 !== sha512) throw new Error(`${target.channelFile}: sha512 mismatch`)
    if (!Array.isArray(channel.files) || channel.files.length !== 1) {
      throw new Error(`${target.channelFile}: files must contain exactly one installer`)
    }
    if (channel.files[0].url !== target.installer) throw new Error(`${target.channelFile}: files[0].url mismatch`)
    if (channel.files[0].sha512 !== sha512) throw new Error(`${target.channelFile}: files[0].sha512 mismatch`)
    if (channel.files[0].size !== stat.size) throw new Error(`${target.channelFile}: files[0].size mismatch`)
  }
}

console.log('Release assets verified.')
