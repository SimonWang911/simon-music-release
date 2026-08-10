# Release Checklist

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
