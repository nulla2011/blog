---
title: Electron 的错误处理
date: 2023-05-02 21:45:59
tags:
  - JavaScript
  - Electron
---

网上的文章都是讲怎么进程间通信，没有讲怎么通信错误信息的，这里记录一下

<!-- more -->

## 双向通信，主进程的错误消息传到渲染进程

也就是 ipcRenderer.invoke() 和 ipcMain.handle()。

其实只要 handle 里的回调函数抛出错误，渲染进程这边的 promise catch 一下错误就可以了。

举个例子：

主进程的一个网络错误逐层被捕获抛出，最后到了 handler 这里：

![](https://gitcode.net/message2011/tttp/-/raw/master/pic/74667.png)

到了 handler 继续抛出

```javascript
ipcMain.handle('getIdolInfo', async (event, id) => {
    let resp = await request(`character?id=${id}`).catch((e) => {
      throw e;
    });
    return resp;
  });
```

到渲染进程这边捕获

```javascript
await window.api.getIdolInfo(id).catch((error) => {
  store.error = error.message;
});
```

结果

![](https://gitcode.net/message2011/tttp/-/raw/master/pic/74670.png)

再把前面的 invoke 错误截掉就可以了。

## 单向通信

跟一般的通信一样，用 webContents.send() 把错误送过去就可以了。