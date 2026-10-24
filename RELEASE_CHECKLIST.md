# Release Checklist

## 5.3.8 Dual Release Published (2026-10-24)

- 正式发布：[Simon Music 5.3.8](https://github.com/SimonWang911/simon-music-release/releases/tag/v5.3.8)，Release ID 422704489，公开、非预发布；发布时间 2026-10-24T12:07:49Z。
- 实际构建源码：desktop `bcc4b6da1ea0781d46db53fc0f4c33a65d08ce68`；mobile `38519aa5f2188dc1ddd2ea5d75332ac005a1c437`。双端 `v5.3.8` 标签固定到各自发布合并提交。
- 桌面端：构建、x64/ia32 签名安装器、频道文件、blockmap、源码合同、发布仓库合同均通过；Electron 37.6.1 / Node ABI 136，延续未配置 Authenticode 的现有策略。
- 手机版：Release arm64-v8a 与 armeabi-v7a 包版本 5.3.8、versionCode 110003/110001、包名 `com.simon.music.mobile`、单 ABI、Release 构建通过；移动端源代码合同、更新流程、类型检查和发布仓库合同通过。
- 双端更新说明均已写入各自 `CHANGELOG.md`、`publish/changeLog.md` 和发布仓库 `publish/*/version.json`；5.3.7 历史记录保留。
- 本地 staging：`dist/5.3.8/`；发布仓库 `npm run verify`、双端 `verify:simon-release-repo` 均通过。历史 `dist/*` 与 `work/` 未清理。

| Asset | GitHub asset ID | Size | SHA-256 |
| --- | ---: | ---: | --- |
| `desktop-latest-ia32.yml` | 672156727 | 376 | `6372f096f2b6cad4f0adaefd75f22788f5c1934e56265b07494e3eabd66c53ba` |
| `desktop-latest-x64.yml` | 672156725 | 374 | `1f3ff81fd6f66e3bd46c953a77115294d209966fefee66b1d6d06ba6af5dfbbb` |
| `simon-music-desktop-v5.3.8-ia32-Setup.exe` | 672156726 | 90541713 | `df0960e8e6dfe9a5df5ce0be519464ae4ee072537b939daeb417687b089191b8` |
| `simon-music-desktop-v5.3.8-ia32-Setup.exe.blockmap` | 672156807 | 95075 | `4acc2931e7a1d156921e5fcaa4b790e43ba894a182f023cb9f297be1f9f73103` |
| `simon-music-desktop-v5.3.8-x64-Setup.exe` | 672156724 | 96861819 | `fc60bf630b6932ff0bb3b83045b88810fa000c4d07eb735e21403630f627ebd4` |
| `simon-music-desktop-v5.3.8-x64-Setup.exe.blockmap` | 672156723 | 102849 | `4db53900cff9ab31f137502af9e615893f63a3d374b42b42c640b03f09b14a6b` |
| `simon-music-mobile-v5.3.8-arm64-v8a.apk` | 672156803 | 24549507 | `cd859b915d85a8abb7cd5e258909b1a1981581693f1eb70fd65d900437e994c1` |
| `simon-music-mobile-v5.3.8-armeabi-v7a.apk` | 672156833 | 19653904 | `3d792e2d6c10f75e115db2e4b65c8165ca87359791b60dca0ed9090b8416a46e` |

## 5.3.7 Dual Release Published (2026-10-16)

- 正式发布：[Simon Music 5.3.7](https://github.com/SimonWang911/simon-music-release/releases/tag/v5.3.7)，Release ID 414894264，公开、非预发布、Latest；发布时间 2026-10-16T11:50:40Z。
- 实际构建源码：desktop `7c50f3bbdd502c7adf86b04ca4ea50cc61908d4f`；mobile `5734198cc02fd0d0b3940f3406c0c9cdfdf67c9f`。双端 `v5.3.7` 标签固定到各自构建提交，不移动。
- 发布 metadata 初始启用提交：`b57179650181e7a620beedf4cd0f4dc5d43529d8`；上传草稿并验证八资产后发布正式版，最后推进 main 启用 desktop/mobile 独立更新入口。历史 provenance、更新说明历史、在线默认源均保持不变。
- Windows x64/ia32 正式安装器各90个载荷文件与原 packaged 目录逐一 SHA-256 一致；PE/native、48条运行时依赖、无生产 sourcemap、主界面及下载 Worker 实测通过。临时目录的 x64 启动曾被本机应用控制拦截；未更改安全策略，运行测试使用字节完全一致的原始 build 产物。Windows 延续未配置 Authenticode 的策略。
- Android arm64/v7a 正式包版本5.3.7、109003/109001、包名、单ABI、非debuggable、JS bundle及与旧版同签名检查通过；202项 Release 单元测试全部通过。额外签名 x86_64 Release 在只读模拟器进入搜索主界面，无致命异常；该测试包未发布，不声称 ARM 真机运行测试。
- 双端 source/domain/合同、类型检查、构建、staging、发布仓库 verify 均通过。手机旧 Node18 云端测试 API 不匹配已通过仅对齐 .nvmrc 到本地构建 Node24.19.0 解决；CI [38895777143](https://github.com/SimonWang911/ikun-music-mobile/actions/runs/38895777143) SDK/contracts/typecheck 全部成功，后续环境与说明提交不改变 APK。
- 24项公开HTTP检查通过：八资产 direct/gh-proxy 共16项，双端 metadata 四路线共8项；小文件完整验哈希，大文件验证首4096字节/总长度及 GitHub 完整文件 SHA-256。
- 本地 staging：`dist/5.3.7/`；证据：`%TEMP%/simon-music-release-5.3.7-20261016/`。没有覆盖用户设备、没有清理历史 untracked 资料，没有上传签名材料、默认源私有配置或测试包。

| Asset | GitHub asset ID | Size | SHA-256 |
| --- | ---: | ---: | --- |
| `desktop-latest-ia32.yml` | 647139614 | 376 | `80977e311fa14fffdff8770964b0234345492c739b4a7905de7dbf04a7503ab0` |
| `desktop-latest-x64.yml` | 647139609 | 374 | `6023f838a69b7d3b6d06a09a6955bfcf914fb3e33d451077a3ac24be253d8c78` |
| `simon-music-desktop-v5.3.7-ia32-Setup.exe` | 647139612 | 90533182 | `f4f99be39d563558afebf41c8e5b63bd5e6097533583ebdfb344a4099ccf812d` |
| `simon-music-desktop-v5.3.7-ia32-Setup.exe.blockmap` | 647139606 | 95138 | `4a92391c4e6ec5cd9bb3f8749fc366f52334d2f3e832db80eb81ac5a2a0ffac8` |
| `simon-music-desktop-v5.3.7-x64-Setup.exe` | 647139610 | 96860303 | `7b7fff81107afcc5fbec069f7a2bf964d3d1bab23b6613ce70cf429fd8090e52` |
| `simon-music-desktop-v5.3.7-x64-Setup.exe.blockmap` | 647139642 | 102807 | `12fff6afb4d84201709915e360ec52e2fcbc920ba064673dacefa4110028988e` |
| `simon-music-mobile-v5.3.7-arm64-v8a.apk` | 647139648 | 24548945 | `52a85bd893105cc478efebd05a375738eeb29375bdd73118c4e0f29e33e8df9f` |
| `simon-music-mobile-v5.3.7-armeabi-v7a.apk` | 647139652 | 19653355 | `e3d5d258ac908608bec14073610fd15d24d48f1c20e2da78ea32eb12bdc6de16` |


## 5.3.3 Dual Release Published (2026-09-21)

Simon Music 5.3.3 now contains both clients. The desktop client was built from source commit `adb52f55a2df0369d3ca5e3901dfd1ada7bd0848`; the mobile client was built from source commit `7ac9eebfe4ca2a6363ac373417e0cf684e312b3f`. Both source repositories have the `v5.3.3` tag, and the release contains the verified Windows x64/ia32 installers plus Android arm64-v8a/armeabi-v7a APKs.

- GitHub Release: https://github.com/SimonWang911/simon-music-release/releases/tag/v5.3.3
- Local staging: `dist/5.3.3/`
- Desktop metadata: `publish/desktop/version.json` → 5.3.3
- Mobile metadata: `publish/mobile/version.json` → 5.3.3, with the mobile download refactor and the 5.3.2 history entry retained
- Local and remote asset sizes, SHA-256/SHA-512, channel references, target provenance, and release-repository contracts passed.
- x64 and ia32 packaged smoke checks entered the Simon Music main UI and passed the Worker crypto check.
- Mobile release gates, TypeScript checks, download-focused native unit tests, release APK version/ABI/signature checks passed. No user data was cleared or migrated destructively.

### 5.3.3 desktop assets

| Asset | Size | SHA-256 |
| --- | ---: | --- |
| `desktop-latest-x64.yml` | 374 | `176abfc9aec890996089520d4ffe3987876360387cdd6ddfd8b4b6595e4c8856` |
| `simon-music-desktop-v5.3.3-x64-Setup.exe` | 96851302 | `0dfb583478ee980a23a26527e7e158ddb909cea646a38e846b690b4fc54f866d` |
| `simon-music-desktop-v5.3.3-x64-Setup.exe.blockmap` | 102634 | `174e649c04c507653163ebd3498d6e4c4856c92bb0dd1731499fbadaf285b26d` |
| `desktop-latest-ia32.yml` | 376 | `1ee7e4f6b6e4381308bbdc1ad95c96916ff447ba9b322c63b00316e481916899` |
| `simon-music-desktop-v5.3.3-ia32-Setup.exe` | 90527597 | `9da5c17a61799ad96ae51a97c6452c0065cd1aaf49f7f54c45ceb1bed3588de4` |
| `simon-music-desktop-v5.3.3-ia32-Setup.exe.blockmap` | 95089 | `da4914c30cc7a309e49ee64051dc0f18ff136bc639785a909809709ec2f165d3` |

### 5.3.3 mobile assets

| Asset | Size | SHA-256 |
| --- | ---: | --- |
| `simon-music-mobile-v5.3.3-arm64-v8a.apk` | 24536211 | `29939042f8fac3b2f8435a92da43f5582a8c52e263b3da19a54285948f29b7e2` |
| `simon-music-mobile-v5.3.3-armeabi-v7a.apk` | 19640640 | `8f92ad0c239d7b0ffd8cf54b3d2ca83fcaf466c9f2e0e7e428690f85364f81a4` |

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

## Simon Music 5.3.4 Release (2026-09-24)

### Source and build provenance

| Platform | Source commit | Source tag | Build evidence |
| --- | --- | --- | --- |
| desktop | `0676c4f0fa52cc52a5634fae8caa38bbb99a6a40` | `v5.3.4` | x64/ia32 packaged smoke passed; native PE architecture and runtime entry verified |
| mobile | `5daa32336fcbc7dd4028c3ad6026afcb6b7e5e4b` | `v5.3.4` | `testReleaseUnitTest` and release APK build passed; arm64/v7a signatures and manifests verified |

### Published assets

The draft Release was uploaded and independently matched against the local staging directory before publication. GitHub asset IDs and SHA-256 digests:

| Asset | GitHub asset ID | Size | SHA-256 |
| --- | ---: | ---: | --- |
| `desktop-latest-x64.yml` | 585410944 | 374 | `104764d8c807f534e55b9443147b040207b3ad580ec382bdea35a43b98f59197` |
| `simon-music-desktop-v5.3.4-x64-Setup.exe` | 585412441 | 96852818 | `e31f073934b63165d6a87ac08af4c44966b4a58335cea268595ca67da75b32de` |
| `simon-music-desktop-v5.3.4-x64-Setup.exe.blockmap` | 585410941 | 102657 | `34a1ad561fe3ca3b6490b8c8bb6c26f85b6d055ed39ac03336b2d45b1961a1aa` |
| `desktop-latest-ia32.yml` | 585410943 | 376 | `57753c897ea60d422af46d2ac0c83d075838936464d9fa6d96e3028b066c1366` |
| `simon-music-desktop-v5.3.4-ia32-Setup.exe` | 585412443 | 90529007 | `4776b8f02f98b864b9c5ec9564cc80fd83f83a8dc7c163e4e05ef8b2a8d00ff4` |
| `simon-music-desktop-v5.3.4-ia32-Setup.exe.blockmap` | 585411094 | 95324 | `3afac43d7774dedc52c91f35a7d5b5f115bc962df2c646b2f2062a7aceb0eb09` |
| `simon-music-mobile-v5.3.4-arm64-v8a.apk` | 585411097 | 24544660 | `e054f5d15a669f0fbf2b7b45a532c266d46b27308b54773cc2e7954fe863ce2a` |
| `simon-music-mobile-v5.3.4-armeabi-v7a.apk` | 585411103 | 19649078 | `987d499fca075ac33d50da5032d4d0524e8eacc751d424f4aa173a2175358f3f` |

### Verification result

- Desktop source contracts, release configuration, x64/ia32 package architecture checks, staged asset checks, and isolated packaged smoke tests passed.
- Mobile source contracts, release configuration, typecheck, release unit tests, ABI/version manifest checks, and APK signature checks passed.
- Release repository metadata, target provenance, source hashes, asset names, sizes, channels and SHA-256 values passed `npm run verify` before publication.
- Existing 5.3.3 assets and historical metadata remain unchanged; no user download data or local application data was modified.

### Publication checks

- GitHub Release [`v5.3.4`](https://github.com/SimonWang911/simon-music-release/releases/tag/v5.3.4) is public and non-prerelease; published at `2026-09-24T07:41:59Z`.
- All six direct release asset URLs returned HTTP 200 with the recorded sizes; both APK URLs and both Windows installer URLs were checked without downloading a second copy.
- Desktop and mobile public metadata returned HTTP 200 and version `5.3.4` from the direct route and from `gh-proxy.com`, `wget.la`, and `ghfast.top` fallback routes.
- Release repository `main` is at commit `9927811`; source repositories are on `main` with the pushed `v5.3.4` tags.
