---
title: mpv 播放 BD/DVD 的正确方法
date: 2022-03-19 15:33:23
tags: 
  - mpv
  - command
---

用了好几年 mpv 了，觉得这玩意真的比 potplayer 要好用（起码启动速度就比它快），就是经常需要在 cli 输入命令。现在总结一下看 BD 还有 DVD 需要的命令。

<!-- more -->

# BD

bd 的目录结构一般是这样的：

````
BDMV
├── AUXDATA
├── BACKUP
├── CLIPINF
│   ├── 00000.clpi
│   ...
│   └── 000xx.clpi
├── META
├── PLAYLIST
│   ├── 00000.mpls
│   ...
│   └── 000xx.mpls
├── STREAM
│   ├── 00000.m2ts
│   ...
│   └── 000xx.m2ts
└── index.bdmv
CERTIFICATE
├── BACKUP
└── id.bdmv
````

其中 CLIPINF 文件夹存放的是媒体剪辑块的信息，PLAYLIST 文件夹是所有播放列表信息，STREAM 就是源文件了。虽然直接把 STREAM 里的文件拖进来就能播放，但是读取播放列表可以在时间轴上显示提供的关键时间点信息方便跳转，还可以顺序播放多个视频，甚至可以循环播放，所以推荐使用播放列表读取视频。

MPV 播放 BD 的命令是：`mpv bd:// --bluray-device=` ，后面的设备路径得是 BDMV 文件夹的路径，前面的 bd 协议如果是根目录则播放的是开始菜单。可以改成`bd://mpls/00000`这种形式来播放播放列表，前提是当前目录是 PLAYLIST 文件夹，同时不要忘了 bd 设备还得是 BDMV 文件夹。那么按列表播放的方法就是：

```mpv bd://mpls/000xx --bluray-device="../../"```

000xx序号对应的是播放列表的文件名。

# DVD

dvd 一般都是打包成 iso ，直接播放就行。

```
mpv dvd:// --dvd-device="*.iso"
```

