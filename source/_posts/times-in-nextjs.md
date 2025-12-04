---
title: nextjs 中要注意的一些时间问题
date: 2025-12-03 22:40:00
tags: 
  - react
  - next.js
---

自打有了 AI 之后好久没写文章了

如果你在 nextjs 里写一个跟时间相关的组件，可能遇到过这样的报错：

![](https://img30.360buyimg.com/ddimgp/jfs/t20281202/366210/37/8364/28153/693059c6Fba6ef09d/71d92fa4a794a984.png)

<!-- more -->

水合的内容不匹配。nextjs 会对比水合前后的内容，如果你写一个精确到秒的时间组件，那等水合完成以后大概已经跳到下一秒去了，导致了这个报错。

解决方法有二：

* 在变化的组件上添加 `suppressHydrationWarning`，无视报错

* 使用 dynamic 并禁用服务端渲染

``` javascript
import dynamic from 'next/dynamic'
const Timer = dynamic(() => import('../components/Timer'), { ssr: false })
```

第二个问题，如果服务端跟客户端时区不一致而你又用了取决于当地时间的 api（比如 `new Date().toString()`），这时你会发现页面刷新时会有跳变，同时报错如下：

![](https://img30.360buyimg.com/ddimgp/jfs/t20281203/354002/21/21889/14001/693177bdF41a7faff/8b6215744afb0ea2.png)

同样也是因为水合：组件在服务端按照服务端时区渲染的，水合时按照客户端时区渲染，所以会发生跳变

所以，涉及时间的组件还是需要注意一下，看在服务端渲染是否会出现问题，如果有问题记得关掉服务端渲染