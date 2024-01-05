---
title: 使用 rust 编写 WebAssembly 的流程
date: 2023-12-10 14:57:00
tags:
  - rust
  - WebAssembly
---

研究用 rust 写 wasm 的时候，莲之空刚开完 [OPENING EVENT](https://www.lovelive-anime.jp/hasunosora/live-event/live_detail.php?p=OLE)，如今 [1st 巡演](https://www.lovelive-anime.jp/hasunosora/live-event/live_detail.php?p=RCF)都开完了才想起来记录一下流程（

<!-- more -->

# 安装 rust 环境

这部分看 [course.rs](https://course.rs/first-try/installation.html) 的教程就可以了，因为更熟悉 linux 所以我装的是 `x86_64-pc-windows-gnu` 版的。

# 修改 Crates 源

参考 https://mirrors.ustc.edu.cn/help/crates.io-index.html ，在 `$CARGO_HOME/config` 中添加：

```
[source.crates-io]
replace-with = 'ustc'

[source.ustc]
registry = "git://mirrors.ustc.edu.cn/crates.io-index"
```

# 安装 wasm-pack

按照 https://rustwasm.github.io/wasm-pack/installer/ 的指引安装就可以了。也可以手动下载 `wasm-pack-init` 再运行。

# 安装 wasm-bindgen 依赖

wasm-bindgen 是 wasm 与 js 之间通信需要的模块。

可以按照 [GitHub](https://github.com/rustwasm/wasm-bindgen) 上的 readme 安装，也可以手动下载编译好的二进制文件放在 `$CARGO_HOME/bin` 里面。

## 在 rust 代码里引入 wasm-bindgen

`use wasm_bindgen::prelude::*;`

**记得在需要跟 js 通信的函数前面加上 `#[wasm_bindgen]` 这个属性。**

# 编译

不要用 `cargo build` ，用 `wasm-pack build` ，这会生成 wasm 文件和与 js 交互的 js 文件。然后就能在 js 里引入了。

**如果是给 nodejs 使用，记得把命令改成 `wasm-pack build --target nodejs` ，因为默认的 target 参数是 `web`，给浏览器用的。**