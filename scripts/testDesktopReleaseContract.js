const assert = require('assert/strict')
const fs = require('fs')
const path = require('path')
const { collectDesktopReleaseFailures } = require('./desktopReleaseContract')

const root = path.join(__dirname, '..')
const readJson = file => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'))
const baseline = {
  desktopVersion: readJson('publish/desktop/version.json').version,
  mobileVersion: readJson('publish/mobile/version.json').version,
  targetSnapshot: readJson('desktop-release-targets.json'),
  assets: readJson('release-assets.json').assets,
}
const clone = value => JSON.parse(JSON.stringify(value))
const errors = input => collectDesktopReleaseFailures({ ...baseline, ...input })

assert.deepEqual(errors({}), [])

let snapshot = clone(baseline.targetSnapshot)
snapshot.activeReleaseTargetIds.pop()
assert(errors({ targetSnapshot: snapshot }).some(error => error.includes('Active release targets')))

snapshot = clone(baseline.targetSnapshot)
snapshot.activeReleaseTargetIds.push('standard-arm64')
assert(errors({ targetSnapshot: snapshot }).some(error => error.includes('Active release targets')))

let assets = [...baseline.assets, 'simon-music-desktop-v5.2.5-arm64-Setup.exe']
assert(errors({ assets }).some(error => error.includes('Unexpected release assets')))

snapshot = clone(baseline.targetSnapshot)
snapshot.history[0].provenance.targets[0].assets[0].size++
assert(errors({ targetSnapshot: snapshot }).some(error => error.includes('history integrity mismatch')))

assert(errors({ mobileVersion: '5.2.5' }).some(error => error.includes('Missing release asset')))

console.log('Desktop release contract mutation tests passed.')
