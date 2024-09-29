---
layout: post
title:  如何下载nico和youtube的最高分辨率封面
date:   2018-07-16 12:03:26
categories: 
tags: 
  - thumbnail
  - 视频
---

<!-- more -->
## youtube视频封面

youtube视频的封面可以自定义，但是在视频播放页面是看不到封面的，如果视频嵌入其他网站可以看到封面（https://www.youtube.com/embed/）。

获取方法：

```
https://i.ytimg.com/vi/视频号（watch?v=后面的11位数字字母组合）/maxresdefault.jpg
```
如果没有图片可以把maxresdefault换成sddefault，或者hqdefault。

（访问此网址同样需要工具）

参考资料：[https://developers.google.com/youtube/v3/docs/thumbnails](https://developers.google.com/youtube/v3/docs/thumbnails)

****
## nico视频封面

20200722更新：现在nico视频封面有所谓“原尺寸”（960x540）大图了，还有key不能直接获取，以下的部分虽然没失效但是也过时了。

------

nico的视频封面，必须从视频中选取。过去的flash版页面上有视频封面：

![flash版页面上有封面](https://img13.360buyimg.com/ddimg/jfs/t1/15498/30/34655/15601/66f934a3F0e0c1b5d/4c3912e2e0741f48.jpg)

可以复制图片地址，再在最后加一个`.L`

![加入前](https://img10.360buyimg.com/ddimg/jfs/t1/244980/38/20242/8218/66f934bbF76a30e2c/661045705ca0da5c.jpg)

加入前

![加入后](https://img10.360buyimg.com/ddimg/jfs/t1/236582/23/26086/18336/66f934d2F6bc50ffb/9efa55f3e68b7fbf.jpg)

加入后

****
html5版页面，视频封面移到了播放器上，有些难以获取，可以直接输入网址：

```
http://tn.smilevideo.jp/smile?i=视频号（不含sm）.L
```

**备注：部分时间较早的视频，可能没有大分辨率的封面，可以把L改成M；更早的视频大和中封面都没有，只能把.L或者.M去掉了**

****
## B站视频封面

获取B站视频封面方法比较简单，从播放页面的源代码就能看到封面地址，网上也有好多教程，这里就不详细说了。
