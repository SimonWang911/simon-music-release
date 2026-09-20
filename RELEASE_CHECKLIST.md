# Release Checklist

## 5.3.3 Desktop Release Published (2026-09-21)

Desktop-only 5.3.3 was built from source commit `adb52f55a2df0369d3ca5e3901dfd1ada7bd0848` and source tag `v5.3.3`. The release contains the verified Windows x64 and ia32 installers, channel files, and blockmaps. Mobile metadata and the existing 5.3.2 APK assets were preserved byte-for-byte and were not rebuilt.

- GitHub Release: https://github.com/SimonWang911/simon-music-release/releases/tag/v5.3.3
- Local staging: `dist/5.3.3/`
- Desktop metadata: `publish/desktop/version.json` → 5.3.3
- Mobile metadata: `publish/mobile/version.json` remains 5.3.2 (canonical UTF-8/LF SHA-256 `AD395B300B86575F93716F29AE3343E7FA57C73CAABA24410AD32FCC7B2DBDAA`; Windows checkout line endings may produce a different raw-file hash)
- Local and remote asset sizes, SHA-256/SHA-512, channel references, target provenance, and release-repository contracts passed.
- x64 and ia32 packaged smoke checks entered the Simon Music main UI and passed the Worker crypto check.

### 5.3.3 desktop assets

| Asset | Size | SHA-256 |
| --- | ---: | --- |
| `desktop-latest-x64.yml` | 374 | `176abfc9aec890996089520d4ffe3987876360387cdd6ddfd8b4b6595e4c8856` |
| `simon-music-desktop-v5.3.3-x64-Setup.exe` | 96851302 | `0dfb583478ee980a23a26527e7e158ddb909cea646a38e846b690b4fc54f866d` |
| `simon-music-desktop-v5.3.3-x64-Setup.exe.blockmap` | 102634 | `174e649c04c507653163ebd3498d6e4c4856c92bb0dd1731499fbadaf285b26d` |
| `desktop-latest-ia32.yml` | 376 | `1ee7e4f6b6e4381308bbdc1ad95c96916ff447ba9b322c63b00316e481916899` |
| `simon-music-desktop-v5.3.3-ia32-Setup.exe` | 90527597 | `9da5c17a61799ad96ae51a97c6452c0065cd1aaf49f7f54c45ceb1bed3588de4` |
| `simon-music-desktop-v5.3.3-ia32-Setup.exe.blockmap` | 95089 | `da4914c30cc7a309e49ee64051dc0f18ff136bc639785a909809709ec2f165d3` |

## 5.3.2 Unified Release Published (2026-09-09)

Formal packages were built and verified locally. Mobile source CI retains SDK contracts, complete Simon contracts and type checking; it neither builds packages nor reads signing credentials. No signing material was uploaded.

| Platform | Final source v5.3.2 tag | Actual local compiled input |
| --- | --- | --- |
| desktop | `33d9d4fb64a7502bc14d5f7bc7b56b0b30678519` | `1995786d1fe414361ad6738db5e20f0534cedf75` |
| mobile | `248ef4d819734b27036b1c7c62b3af172ca946f0` | `906be83305355e9b19489a140ff076c36e3c502c` |

Later source changes are documentation, CI and tests only. Production input and final package hashes were verified unchanged; existing package/runtime/device evidence is reused, not reported as a new build. Desktop currentRelease.desktopCommit records the final source tag, not a claim that the packages were recompiled at that commit.

- Mobile source CI: [Verify 34349392125](https://github.com/SimonWang911/ikun-music-mobile/actions/runs/34349392125), all three checks passed. The previous missing-signing-input cloud build failure remains in history.
- Local proof: desktop diagnostics/release-5.3.2-20260909/resume-final/local-build-proof.json and local-release-sources.json.
- Four formal installers, eight assets: Windows x64/ia32, Android arm64-v8a/armeabi-v7a. Published release ID: 385487052; GitHub size and SHA-256 digests match local files. All uploaded asset IDs were preserved on publication.
- Desktop: both final installer payloads entered the main UI with isolated profiles, upgrade/sync and NTFS file-identity regression passed; no overlay installation on the user's PC.
- Android: both signed non-debug ABI packages checked; 23 JUnit suites / 140 tests passed. Arm64 package overlay-installed and tested on PJD110 with existing data present. V7a device runtime was not tested.
- Existing default-source files and immutable platform-extension history are unchanged.
- Staged release metadata, contract mutation tests, actual asset hashes/channels and default-source verification all passed; desktop and mobile release-repository checks both passed. Evidence: `release-local-metadata-gates.log`, `desktop-local-release-repo.log`, `mobile-local-release-repo.log` under the same diagnostics directory.
- Publication approval received. The release was made public first, real asset GET checks passed next, and only then was public metadata main advanced to 5.3.2. Chrome blog submission followed a separate action-time confirmation.

### Publication checks

- [GitHub v5.3.2](https://github.com/SimonWang911/simon-music-release/releases/tag/v5.3.2) is public, non-prerelease and Latest; published at `2026-09-09T12:39:53Z`.
- The immutable release tag remains at `25efae6eac82b20d29e77d2f27aeddb43901e358`. Later publication-audit documentation does not move that tag or change any package.
- All eight canonical asset URLs passed direct and gh-proxy GET checks (16 checks); both desktop Latest channel aliases passed on both routes (four more checks). Channels and blockmaps were downloaded and fully hashed. Large installers/APKs were checked using exact 4096-byte Range responses, total sizes, and GitHub full-file SHA-256 digests; they were not fully re-downloaded during this publication step.
- Desktop and mobile live update metadata each passed on gh-proxy, direct, wget.la and ghfast.top (eight HTTP 200 checks), without cache-busting. Version 5.3.2, release descriptions and complete history match the local verified metadata.
- The [existing Simon Music blog](http://simonwang.cn:7003/index.php/archives/3/) was updated through the logged-in Chrome session. Both version labels, all four canonical package links, 13 Android notes and eight Windows notes were checked in the saved editor, rendered public page and an anonymous HTTP 200 response. Original introduction, tutorials and other editor textareas were preserved.
- Both source repositories remain on main at their source v5.3.2 tags, matching remote main. No business code, dependencies, signing materials, packages or user data changed during publication; no new build or device test is claimed.

Publication evidence is archived in desktop `diagnostics/release-5.3.2-20260909/resume-final/`:

| Check | Evidence |
| --- | --- |
| Public release and preserved assets | `published-v532.json`, `public-v532-assets.json` |
| Update activation and live routes | `updates-v532-activated.json`, `live-v532-metadata.json` |
| Saved blog and public-page contents | `blog-saved-editor-v532.json`, `blog-public-v532.json` |
| Complete release before audit-only commit | `publication-complete-before-doc-audit.json` |

## Desktop-Only Release

1. Update `publish/desktop/version.json`.
2. Preserve `publish/mobile/version.json` byte-for-byte.
3. Build and verify the Windows 10/11 x64 installer.
4. Build and verify the Windows 10/11 ia32 installer.
5. Stage exactly two channels, two installers, and two blockmaps.
6. Update `release-assets.json` with the six current desktop assets and the existing mobile APK names.
7. Update `desktop-release-targets.json`; keep historical ARM64 and Windows 7 provenance in history.
8. Upload exactly six desktop assets to the GitHub Release tag.
9. Confirm direct metadata URLs return HTTP 200.
10. Confirm proxy metadata URLs return HTTP 200 or fail gracefully.
11. Confirm x64 desktop update does not select ia32 assets.
12. Confirm ia32 desktop update does not select x64 assets.

## Mobile-Only Release

1. Update `publish/mobile/version.json`.
2. Build mobile arm64-v8a APK.
3. Build mobile armeabi-v7a APK.
4. Copy both APKs to `dist/<version>/`.
5. Update `release-assets.json`.
6. Upload both APKs to GitHub Release tag `v<version>`.
7. Run release repository verification.

## Verification Commands

Mobile:

```powershell
cd "C:\Users\Simon\Desktop\GitHub\ikun-music-mobile"
npm run verify:online-default-source
npm run verify:simon-contracts
npm run verify:simon-release:source
npm run verify:update-flow
npm run typecheck
npm run pack:android
npm run verify:simon-release-repo
```

Release repository:

```powershell
cd "C:\Users\Simon\Desktop\GitHub\simon-music-release"
npm run verify
```
