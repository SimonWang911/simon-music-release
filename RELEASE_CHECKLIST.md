# Release Checklist

## 5.3.2 Unified Release Preparation (2026-09-09)

Formal packages were built and verified locally. Mobile source CI retains SDK contracts, complete Simon contracts and type checking; it neither builds packages nor reads signing credentials. No signing material was uploaded.

| Platform | Final source v5.3.2 tag | Actual local compiled input |
| --- | --- | --- |
| desktop | `33d9d4fb64a7502bc14d5f7bc7b56b0b30678519` | `1995786d1fe414361ad6738db5e20f0534cedf75` |
| mobile | `248ef4d819734b27036b1c7c62b3af172ca946f0` | `906be83305355e9b19489a140ff076c36e3c502c` |

Later source changes are documentation, CI and tests only. Production input and final package hashes were verified unchanged; existing package/runtime/device evidence is reused, not reported as a new build. Desktop currentRelease.desktopCommit records the final source tag, not a claim that the packages were recompiled at that commit.

- Mobile source CI: [Verify 34349392125](https://github.com/SimonWang911/ikun-music-mobile/actions/runs/34349392125), all three checks passed. The previous missing-signing-input cloud build failure remains in history.
- Local proof: desktop diagnostics/release-5.3.2-20260909/resume-final/local-build-proof.json and local-release-sources.json.
- Four formal installers, eight assets: Windows x64/ia32, Android arm64-v8a/armeabi-v7a. Uploaded draft ID: 385487052; GitHub size and SHA-256 digests match local files.
- Desktop: both final installer payloads entered the main UI with isolated profiles, upgrade/sync and NTFS file-identity regression passed; no overlay installation on the user's PC.
- Android: both signed non-debug ABI packages checked; 23 JUnit suites / 140 tests passed. Arm64 package overlay-installed and tested on PJD110 with existing data present. V7a device runtime was not tested.
- Existing default-source files and immutable platform-extension history are unchanged.
- Staged release metadata, contract mutation tests, actual asset hashes/channels and default-source verification all passed; desktop and mobile release-repository checks both passed. Evidence: `release-local-metadata-gates.log`, `desktop-local-release-repo.log`, `mobile-local-release-repo.log` under the same diagnostics directory.
- Release stays draft until explicit publication approval. Public metadata main remains 5.3.1 until public 5.3.2 assets are verified. Chrome blog submission follows that gate.

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
