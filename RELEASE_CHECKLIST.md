# Release Checklist

1. Update `publish/desktop/version.json`.
2. Update `publish/mobile/version.json`.
3. Build desktop x64 installer.
4. Build desktop ia32 installer.
5. Build mobile arm64-v8a APK.
6. Build mobile armeabi-v7a APK.
7. Upload all release assets to the same GitHub Release tag.
8. Confirm direct metadata URLs return HTTP 200.
9. Confirm proxy metadata URLs return HTTP 200 or fail gracefully.
10. Confirm x64 desktop update does not select ia32 assets.
11. Confirm ia32 desktop update does not select x64 assets.
12. Confirm arm64 Android update downloads arm64-v8a APK.
13. Confirm 32-bit Android update downloads armeabi-v7a APK.

## Verification Commands

Desktop:

```powershell
npm run verify:simon
npm run pack:win:setup:x64
npm run pack:win:setup:x86
```

Mobile:

```powershell
npm run verify:simon-release
npm run typecheck
npm run pack:android
```

Release repository:

```powershell
npm run verify
```
