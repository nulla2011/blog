---
title: 博客再次改版
date: 2023-05-26 14:00:04
tags: 
  - 博客
  - JavaScript
---

终于还是把博客迁到自己的域名了。其实这次的主要目的是从 github page 迁移到 vercel，因为 vercel 可以自己 build 不用手动 build 再上传了（不过 github 可以用 actions）。vercel 比较香的一点是可以做 serverless api，连框架都不用搭，也不需要服务器，我也是连上 mongoDB 做了个小 demo，这个之后再说。

<!-- more -->

说回博客，借此机会又给博客改了个版，框架方面本来想试试基于 vue 的框架的结果还是继续用了 hexo，因为主题比较多案例也多吧。主题这回用的是 [Melody](https://github.com/Molunerfinn/hexo-theme-melody)，当然也做了一些不破坏原主题的魔改（因为主题是发在 npm 上的，要想魔改需要先 fork 过来再发到 npm），下面稍微说说魔改过程

## 自定义样式和脚本

其实我这次折腾博客才知道 hexo 的[注入器](https://hexo.io/zh-cn/api/injector)，简单来说就是把元素插入到网页中。一开始还以为自定义 css 需要靠注入器插入，后来发现 css 和 js 只要放在 `source` 里面然后在主题配置文件里加上路径就可以了

## spine 挂件

参考了[这篇文章](https://c10udlnk.top/p/blogsFor-hexo-puttingLivelySpineModels/)