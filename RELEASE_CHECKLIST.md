# Release Checklist

## Full Release

1. Update `publish/desktop/version.json`.
2. Update `publish/mobile/version.json`.
3. Build desktop x64 installer.
4. Build desktop ia32 installer.
5. Build mobile arm64-v8a APK.
6. Build mobile armeabi-v7a APK.
7. Update `release-assets.json`.
8. Upload all release assets to the same GitHub Release tag.
9. Confirm direct metadata URLs return HTTP 200.
10. Confirm proxy metadata URLs return HTTP 200 or fail gracefully.
11. Confirm x64 desktop update does not select ia32 assets.
12. Confirm ia32 desktop update does not select x64 assets.
13. Confirm arm64 Android update downloads arm64-v8a APK.
14. Confirm 32-bit Android update downloads armeabi-v7a APK.

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
