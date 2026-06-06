---
title: 我的 Obsidian 同步方法
date: 2026-06-05 22:28:00
tags: 
  - Obsidian
---

因为 Notion 越来越臃肿越来越卡所以就迁移到了 Obsidian，但是首先面临的一个问题就是同步，下面讲讲我是怎么实现同步的

<!-- more -->

# 内网 WebDAV

首先想到的而且是我最常用的方法就是 WebDAV，所以现在要在电脑里开一个 WebDAV 服务器（当然也可以在 NAS 中开一个并作为常驻进程），之前一直喜欢用 [@masx200/webdav-cli](https://www.npmjs.com/package/@masx200/webdav-cli) ，这次改用了 [wsgidav](https://github.com/mar10/wsgidav) ，首先我们使用 pipx 或 uv 或 pip 安装 wsgidav：
```
pipx install wsgidav
pipx inject wsgidav cheroot
```
```
uv tool install wsgidav
uv tool run --with cheroot wsgidav
```
```
pip install wsgidav cheroot
```

编写配置文件，主要是 ip 端口，账号密码等。
```
host: 192.168.123.70
port: 1900
simple_dc:
  user_mapping:
    '*':
      nulla:
        password: ""
```
运行 wsgidav
```
wsgidav --config=wsgidav.yaml --root=.webdav
```
在 Obsidian 中我们主要使用 `Remotely Save` 插件来连接 webdav，在插件里设置好地址，用户名和密码。

如果是单独运行的常驻进程到这里就可以了，但是我选择把服务设置成随 Obsidian 启动。这样的话可以设置一个宏，先安装 QuickAdd 插件，然后写个脚本放在笔记目录里：
```javascript
const { exec } = require('child_process');
const { join } = require('path');

module.exports = async (params) => {
  exec(
    `wsgidav --config=${join(process.env.USERPROFILE, 'wsgidav.yaml')} --root=${join(process.env.USERPROFILE, '.webdav')}`,
    (error, stdout, stderr) => {
      if (error) {
        if (error.message.includes('OSError: No socket could be created')) {
          new Notice('服务器已在运行或端口被占用');
        }
      }
    }
  );
  new Notice('🚀 已启动服务器并开始同步');
};


```
在插件里 add choice，选择脚本并设置启动时运行时就可以了。

后记：其实在看到宏可以是 js 脚本的时候我在想可不可以直接在脚本里引入 [@masx200/webdav-cli](https://www.npmjs.com/package/@masx200/webdav-cli) 而省去开启子进程的步骤，但经过试验发现并不能引入外部 npm 包，可能是因为安全问题吧。

# 云服务

根据数据备份 321 原则，还需要把笔记上传到云端，这里我选择的最简单的坚果云。安装插件 Nutstore Sync 之后填好账号和凭证就可以了。可能有人觉得 git 更好，不过我的笔记暂时还用不上版本管理就先不用 git 了。