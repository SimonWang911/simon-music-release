const crypto = require('crypto')
const fs = require('fs')
const path = require('path')
const YAML = require('yaml')

const ACTIVE_RELEASE_TARGET_IDS = ['standard-x64', 'standard-ia32']
const TARGETS = {
  'standard-x64': {
    flavor: 'standard',
    arch: 'x64',
    electronVersion: '37.6.1',
    nodeAbi: 136,
    channelFile: 'desktop-latest-x64.yml',
    installer: version => `simon-music-desktop-v${version}-x64-Setup.exe`,
  },
  'standard-ia32': {
    flavor: 'standard',
    arch: 'ia32',
    electronVersion: '37.6.1',
    nodeAbi: 136,
    channelFile: 'desktop-latest-ia32.yml',
    installer: version => `simon-music-desktop-v${version}-ia32-Setup.exe`,
  },
}

const shaHex = (algorithm, buffer) => crypto.createHash(algorithm).update(buffer).digest('hex')
const canonicalHash = value => shaHex('sha256', Buffer.from(JSON.stringify(value)))

const validateAssetRecord = (failures, asset, label) => {
  if (
    typeof asset?.name !== 'string' ||
    !Number.isSafeInteger(asset.githubAssetId) ||
    asset.githubAssetId <= 0 ||
    !Number.isSafeInteger(asset.size) ||
    asset.size <= 0 ||
    !/^[a-f0-9]{64}$/.test(asset.sha256 ?? '') ||
    !/^[a-f0-9]{128}$/.test(asset.sha512 ?? '')
  ) {
    failures.push(`${label}: invalid asset provenance`)
  }
}

const collectDesktopReleaseFailures = ({
  desktopVersion,
  mobileVersion,
  targetSnapshot,
  assets,
  assetDir,
}) => {
  const failures = []
  if (targetSnapshot.schemaVersion !== 2) failures.push('Desktop target snapshot schemaVersion must be 2')
  if (targetSnapshot.version !== desktopVersion) {
    failures.push(`Desktop target snapshot version must be ${desktopVersion}`)
  }
  if (JSON.stringify(targetSnapshot.activeReleaseTargetIds) !== JSON.stringify(ACTIVE_RELEASE_TARGET_IDS)) {
    failures.push(`Active release targets must be ${ACTIVE_RELEASE_TARGET_IDS.join(', ')}`)
  }

  const snapshotTargets = targetSnapshot.targets ?? []
  if (snapshotTargets.length !== ACTIVE_RELEASE_TARGET_IDS.length) {
    failures.push(`Desktop target snapshot must contain exactly ${ACTIVE_RELEASE_TARGET_IDS.length} targets`)
  }
  const snapshotTargetById = new Map(snapshotTargets.map(target => [target.id, target]))
  if (snapshotTargetById.size !== snapshotTargets.length) failures.push('Desktop target snapshot contains duplicate targets')

  const requiredDesktopAssets = []
  for (const id of ACTIVE_RELEASE_TARGET_IDS) {
    const expected = TARGETS[id]
    const target = snapshotTargetById.get(id)
    const installer = expected.installer(desktopVersion)
    if (!target) {
      failures.push(`Desktop target snapshot is missing ${id}`)
      continue
    }
    for (const [field, value] of Object.entries({
      flavor: expected.flavor,
      arch: expected.arch,
      electronVersion: expected.electronVersion,
      nodeAbi: expected.nodeAbi,
      channelFile: expected.channelFile,
      installer,
    })) {
      if (target[field] !== value) failures.push(`${id}: ${field} must be ${value}`)
    }
    requiredDesktopAssets.push(expected.channelFile, installer, `${installer}.blockmap`)
  }

  const currentRelease = targetSnapshot.currentRelease
  if (
    currentRelease?.releaseTag !== `v${desktopVersion}` ||
    currentRelease?.sourceTag !== `v${desktopVersion}` ||
    !/^[a-f0-9]{40}$/.test(currentRelease?.desktopCommit ?? '') ||
    currentRelease?.verification?.scope !== 'packaged-smoke' ||
    currentRelease?.verification?.hostRuntimeTested !== true
  ) {
    failures.push('Current desktop release provenance is incomplete')
  }

  const currentTargets = currentRelease?.targets ?? []
  if (currentTargets.length !== ACTIVE_RELEASE_TARGET_IDS.length) {
    failures.push('Current desktop release provenance must contain exactly two targets')
  }
  const currentTargetById = new Map(currentTargets.map(target => [target.id, target]))
  const currentAssetNames = new Set()
  const currentAssetIds = new Set()
  for (const id of ACTIVE_RELEASE_TARGET_IDS) {
    const target = snapshotTargetById.get(id)
    const releaseTarget = currentTargetById.get(id)
    if (!target || !releaseTarget) {
      failures.push(`Current desktop release provenance is missing ${id}`)
      continue
    }
    const expectedNames = [target.channelFile, target.installer, `${target.installer}.blockmap`]
    const releaseAssets = releaseTarget.assets ?? []
    if (releaseAssets.length !== expectedNames.length) {
      failures.push(`${id}: current release provenance must contain three assets`)
    }
    const releaseAssetByName = new Map(releaseAssets.map(asset => [asset.name, asset]))
    for (const name of expectedNames) {
      const asset = releaseAssetByName.get(name)
      if (!asset) {
        failures.push(`${id}: missing current release provenance for ${name}`)
        continue
      }
      validateAssetRecord(failures, asset, `${id}/${name}`)
      if (currentAssetNames.has(name)) failures.push(`Duplicate current release asset name: ${name}`)
      if (currentAssetIds.has(asset.githubAssetId)) failures.push(`Duplicate current release asset ID: ${asset.githubAssetId}`)
      currentAssetNames.add(name)
      currentAssetIds.add(asset.githubAssetId)

      if (assetDir) {
        const file = path.join(assetDir, name)
        if (!fs.existsSync(file)) {
          failures.push(`Missing staged release file: ${file}`)
        } else {
          const bytes = fs.readFileSync(file)
          if (
            bytes.length !== asset.size ||
            shaHex('sha256', bytes) !== asset.sha256 ||
            shaHex('sha512', bytes) !== asset.sha512
          ) {
            failures.push(`${id}/${name}: staged size or hash mismatch`)
          }
        }
      }
    }
  }

  const history = targetSnapshot.history ?? []
  const platformHistory = history.find(item => item.version === '5.2.4' && item.kind === 'platform-extension')
  if (!platformHistory) {
    failures.push('Missing immutable v5.2.4 platform extension history')
  } else if (
    !/^[a-f0-9]{64}$/.test(platformHistory.sha256 ?? '') ||
    canonicalHash(platformHistory.provenance) !== platformHistory.sha256
  ) {
    failures.push('v5.2.4 platform extension history integrity mismatch')
  } else {
    const provenance = platformHistory.provenance
    const historyIds = (provenance?.targets ?? []).map(target => target.id)
    if (
      provenance?.releaseTag !== 'v5.2.4' ||
      provenance?.sourceTag !== 'desktop-v5.2.4-platform-extension-20260805' ||
      JSON.stringify(historyIds) !== JSON.stringify(['standard-arm64', 'win7-x64', 'win7-ia32'])
    ) {
      failures.push('v5.2.4 platform extension history is incomplete')
    }
  }

  const requiredAssets = [
    ...requiredDesktopAssets,
    `simon-music-mobile-v${mobileVersion}-arm64-v8a.apk`,
    `simon-music-mobile-v${mobileVersion}-armeabi-v7a.apk`,
  ]
  if (!Array.isArray(assets)) failures.push('release-assets.json assets must be an array')
  else {
    if (new Set(assets).size !== assets.length) failures.push('release-assets.json contains duplicates')
    for (const name of requiredAssets) {
      if (!assets.includes(name)) failures.push(`Missing release asset: ${name}`)
    }
    const unexpected = assets.filter(name => !requiredAssets.includes(name))
    if (unexpected.length) failures.push(`Unexpected release assets: ${unexpected.join(', ')}`)
    if (assets.some(name => /-v5\.2\.5-(?:arm64|win7-)/.test(name))) {
      failures.push('Current release assets must not contain ARM64 or Windows 7 packages')
    }
  }

  if (assetDir) {
    for (const target of snapshotTargets) {
      const channelPath = path.join(assetDir, target.channelFile)
      const installerPath = path.join(assetDir, target.installer)
      if (!fs.existsSync(channelPath) || !fs.existsSync(installerPath)) continue
      const channel = YAML.parse(fs.readFileSync(channelPath, 'utf8'))
      const installerBytes = fs.readFileSync(installerPath)
      const sha512 = crypto.createHash('sha512').update(installerBytes).digest('base64')
      if (channel.version !== desktopVersion) failures.push(`${target.channelFile}: version mismatch`)
      if (channel.path !== target.installer) failures.push(`${target.channelFile}: path mismatch`)
      if (channel.sha512 !== sha512) failures.push(`${target.channelFile}: sha512 mismatch`)
      if (
        !Array.isArray(channel.files) ||
        channel.files.length !== 1 ||
        channel.files[0].url !== target.installer ||
        channel.files[0].sha512 !== sha512 ||
        channel.files[0].size !== installerBytes.length
      ) {
        failures.push(`${target.channelFile}: files entry mismatch`)
      }
    }
  }

  return failures
}

module.exports = {
  ACTIVE_RELEASE_TARGET_IDS,
  canonicalHash,
  collectDesktopReleaseFailures,
}
