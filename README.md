# Simon Music Release

This repository stores public update metadata and release assets for Simon Music.

## Metadata

- Desktop: `publish/desktop/version.json`
- Mobile: `publish/mobile/version.json`

## Desktop Update Assets

Desktop uses Electron `generic` update provider at runtime.

- x64 channel file: `desktop-latest-x64.yml`
- ia32 channel file: `desktop-latest-ia32.yml`
- x64 installer: `simon-music-desktop-v<version>-x64-Setup.exe`
- ia32 installer: `simon-music-desktop-v<version>-ia32-Setup.exe`

The desktop repository may build the 32-bit Windows installer as `x86`. Public release assets must be staged as `ia32`; `x86` must not appear in `release-assets.json`.

## Mobile Update Assets

Mobile downloads the matching APK by ABI from the GitHub Release tag `v<version>`.

- arm64: `simon-music-mobile-v<version>-arm64-v8a.apk`
- armeabi-v7a: `simon-music-mobile-v<version>-armeabi-v7a.apk`

Mobile-only releases may update `publish/mobile/version.json` and the two mobile APK assets without rebuilding desktop assets.

## GitHub Release Assets

Use tags such as `v5.0.2`.

Required desktop assets:

- `desktop-latest-x64.yml`
- `desktop-latest-ia32.yml`
- `simon-music-desktop-v5.0.2-x64-Setup.exe`
- `simon-music-desktop-v5.0.2-x64-Setup.exe.blockmap`
- `simon-music-desktop-v5.0.2-ia32-Setup.exe`
- `simon-music-desktop-v5.0.2-ia32-Setup.exe.blockmap`

Required mobile assets:

- `simon-music-mobile-v5.0.2-arm64-v8a.apk`
- `simon-music-mobile-v5.0.2-armeabi-v7a.apk`
