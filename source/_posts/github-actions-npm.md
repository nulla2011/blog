---
title: 利用 GitHub actions 在 release 中发布 npm 包并引入
date: 2023-03-29 23:33:34
tags: 
  - JavaScript
  - GitHub
  - npm
---

终于能写点没人写过的东西了。因为有个包不太想往 npm 发，自己又得引用，所以就想着 GitHub 一把梭，直接把包发 GitHub 上再引用。下面逐步讲解一下这个 GitHub Actions 的写法，就用自己的项目来举例：

<!-- more -->

因为我用的是 TypeScript，所以需要编译。在 `tsconfig.json` 中需要配好输出文件夹：

```json
"outDir": "./dist",
```

如果想要保留输出的包里面的类型定义，引入时好带上类型，（也就是那些 `d.ts` 文件），那么需要把 declaration 设置为 true。

---

接下来是 Github Actions 的配置：

```yaml
name: Release

on:
  push:
    branches: ['main']

jobs:
  build:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [18.x]
```

前面没什么好说的，监视 main 分支提交，设置环境。

```yaml
steps:
  - uses: actions/checkout@v3
  - name: Use Node.js ${{ matrix.node-version }}
    uses: actions/setup-node@v3
    with:
      node-version: ${{ matrix.node-version }}
```

检出并设置 node 环境，没什么好说的。

```yaml
- name: Install pnpm
  uses: pnpm/action-setup@v2
  id: pnpm-install
  with:
    version: 7
    run_install: false
- name: Get pnpm store directory
  id: pnpm-cache
  shell: bash
  run: |
    echo "STORE_PATH=$(pnpm store path)" >> $GITHUB_OUTPUT
- name: Setup pnpm cache
  uses: actions/cache@v3
  with:
    path: ${{ steps.pnpm-cache.outputs.STORE_PATH }}
    key: ${{ runner.os }}-pnpm-store-${{ hashFiles('**/pnpm-lock.yaml') }}
    restore-keys: |
      ${{ runner.os }}-pnpm-store-
- name: Install dependencies
  run: pnpm install
```

因为我用的是 pnpm，GitHub actions 并不原生支持 pnpm 所以还得装一下，出自 pnpm 自己出的设置。

```yaml
- name: build
  run: pnpm run build
- name: read version
  id: version
  uses: ashley-taylor/read-json-property-action@v1.0
  with:
    path: ./package.json
    property: version
- name: pack
  run: |
    tar -zcvf prism-core.tar.gz ./dist ./template package.json README.md
```

第一步：build；第二步：从 package.json 读取版本号，后面要用；第三步：打包。注意 npm install 似乎不支持 zip 包所以要打包成 tarball。

```yaml
- name: Create Release
  id: create_release
  uses: actions/create-release@latest
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
  with:
    tag_name: v${{steps.version.outputs.value}}
    release_name: v${{steps.version.outputs.value}}
    draft: false
    prerelease: false
- name: Upload Release Asset
  id: upload-release-asset
  uses: actions/upload-release-asset@v1
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
  with:
    upload_url: ${{ steps.create_release.outputs.upload_url }}
    asset_path: ./prism-core.tar.gz
    asset_name: prism-core.tar.gz
    asset_content_type: application/x-tar
```

第一步：生成 release，这时就得用到前面的版本号了。第二步：上传 release，注意这步需要打开项目 actions 的读写权限，在 actions/general 里面的 Workflow permissions。

这样每次提交完都会生成 release （记得改版本号）

接下来是引入，只要 npm install 自动 release 出来的 tarball 网址就可以了，比如我的是：`npm install https://github.com/nulla2011/prism-core/releases/download/v0.2.4/prism-core.tar.gz` ，每回提交完只需更改网址里的版本号再 `npm i` 就可以了。或者可以 `npm install https://github.com/nulla2011/prism-core/releases/latest/download/prism-core.tar.gz` ，但是这样没标版本号容易出问题，需要注意一下。

最后附上完整的 Github Actions 配置：

```yaml
name: Release

on:
  push:
    branches: ['main']

jobs:
  build:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [18.x]

    steps:
      - uses: actions/checkout@v3
      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}
      - name: Install pnpm
        uses: pnpm/action-setup@v2
        id: pnpm-install
        with:
          version: 7
          run_install: false
      - name: Get pnpm store directory
        id: pnpm-cache
        shell: bash
        run: |
          echo "STORE_PATH=$(pnpm store path)" >> $GITHUB_OUTPUT
      - name: Setup pnpm cache
        uses: actions/cache@v3
        with:
          path: ${{ steps.pnpm-cache.outputs.STORE_PATH }}
          key: ${{ runner.os }}-pnpm-store-${{ hashFiles('**/pnpm-lock.yaml') }}
          restore-keys: |
            ${{ runner.os }}-pnpm-store-
      - name: Install dependencies
        run: pnpm install
      - name: build
        run: pnpm run build
      - name: read version
        id: version
        uses: ashley-taylor/read-json-property-action@v1.0
        with:
          path: ./package.json
          property: version
      - name: pack
        run: |
          tar -zcvf prism-core.tar.gz ./dist ./template package.json README.md
      - name: Create Release
        id: create_release
        uses: actions/create-release@latest
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          tag_name: v${{steps.version.outputs.value}}
          release_name: v${{steps.version.outputs.value}}
          draft: false
          prerelease: false
      - name: Upload Release Asset
        id: upload-release-asset
        uses: actions/upload-release-asset@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          upload_url: ${{ steps.create_release.outputs.upload_url }}
          asset_path: ./prism-core.tar.gz
          asset_name: prism-core.tar.gz
          asset_content_type: application/x-tar
```
