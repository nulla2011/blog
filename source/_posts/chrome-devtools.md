---
title: Chrome devtools 的一些冷门功能
date: 2023-06-04 21:49:12
tags:
  - Chrome
---

同样适用于 edge 等 chromium 系浏览器。

Chrome 版本： `116.0.5845.97`

<!-- more -->

# Source

## Overrides

chrome 官方的替换文件功能，比如可以这样做 bb 素材：

![shinycolors主界面](https://img11.360buyimg.com/ddimg/jfs/t1/85720/31/38027/132943/64dc5dd5Fd960acbc/38ecf28dfd71a384.jpg)

![Overrides](https://img14.360buyimg.com/ddimg/jfs/t1/100758/1/43086/33254/64dc5e1fF97474aa4/7e92fe60fd91b620.jpg)

## Snippets

可以在这里存经常在控制台调用的代码片段

# Media

可以看正在播放的媒体的信息，比播放器的信息要详细

![](https://img10.360buyimg.com/ddimg/jfs/t1/185887/23/36100/37825/64dc61d7F6ae070db/a053024cb7b06fd1.jpg)

![视频详情](https://img10.360buyimg.com/ddimg/jfs/t1/167753/23/35969/18923/64dc625bF88db6200/92744f696fb0359e.jpg)

![音频详情](https://img10.360buyimg.com/ddimg/jfs/t1/112700/17/36535/12437/64dc6565F48f8a307/4fef1356779e3a85.jpg)

![事件](https://img14.360buyimg.com/ddimg/jfs/t1/197083/14/37559/59515/64ddc228F7ac01671/e6208646812c2eee.jpg)

![消息](https://img11.360buyimg.com/ddimg/jfs/t1/160296/12/35395/66737/64ddc26aF5df3ee08/8217baaa39475872.jpg)

![timeline](https://img14.360buyimg.com/ddimg/jfs/t1/173351/13/40403/11407/64ddc348F565b6dea/cabedcdf092c9ec7.jpg)

# Animations

记录动画，并可以显示速度曲线

![一般的 ease](https://img14.360buyimg.com/ddimg/jfs/t1/127558/9/35678/25281/64dc788dFac3fdbe3/354fe69e89cf9113.jpg)

![缓动函数如图](https://img12.360buyimg.com/ddimg/jfs/t1/131313/15/40558/34338/64dc77f4F321229fb/b1d62836ffa4e16e.jpg)

# Changes

对比在 devtools 里修改前和修改后的代码

![在 Elements 改了一下 CSS](https://img12.360buyimg.com/ddimg/jfs/t1/210251/29/31923/25958/64dc6dddFc5aa1cee/8f0fcea6488bfa93.jpg)

# Coverage

检查代码覆盖率

![](https://img10.360buyimg.com/ddimg/jfs/t1/180758/31/36157/40274/64dc6a1aF1e2c9192/d2bdc5fff966dfff.jpg)

# CSS Overview

生成网页的 css 报告，包括：

* 概览

* 颜色，还可以对文字与背景颜色过于接近的情况进行告警

![](https://img10.360buyimg.com/ddimg/jfs/t1/92404/34/43603/45901/64dc7a1fFed95532a/f25b819f1aeb11d4.jpg)

* 字体

![](https://img12.360buyimg.com/ddimg/jfs/t1/84786/6/41532/55321/64dc7a4fFf50e762e/0a3457b983668abd.jpg)

* 未使用的声明

![](https://img12.360buyimg.com/ddimg/jfs/t1/99294/8/44040/68753/64dc7a97F31e11d00/e2bf758da6a5fd1e.jpg)

* 媒体查询

![](https://img10.360buyimg.com/ddimg/jfs/t1/120821/4/36330/40461/64dc7adcFfd834bce/a0c6abfc61b477bd.jpg)

# Developer Resources

加载一些 js map？

![](https://img13.360buyimg.com/ddimg/jfs/t1/161286/13/39775/32153/64dc7b54Fbc83eb2d/c1b611383037edf2.jpg)

# Issues

点右上角的蓝色（有 warning 为黄色，有 error 为红色）按钮同样可以调出，网页中存在的一些问题。

# Layers

3D 形式展现页面的层级关系

![](https://img11.360buyimg.com/ddimg/jfs/t1/207152/14/31941/47684/64dc7dadF21870aa5/3baf951376ec47b4.jpg)

# Network conditions

可以修改是否禁用 cache，限流策略，UA，可接受的内容编码这些网络选项

# Network request blocking

屏蔽一些请求，可以用来去广告？没用过

# Performance insights

另一个性能测试工具，看着挺复杂，以后研究一下

# Performance monitor

性能监视器

# Recorder

记录网页操作，并且可以 replay，可以用于一些重复性操作？

# Rendering

渲染的一些选项

# Sensors

一些传感器，电脑上没法用，手机上 devtools 又调不出来

# WebAudio

有关 `Web Audio` 的一些统计信息

![](https://img11.360buyimg.com/ddimg/jfs/t1/169380/7/40037/54366/64dc8354F8a91db78/bdd20f669b19e99c.jpg)

---

先写这么多，之后想到了再补充