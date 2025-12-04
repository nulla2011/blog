---
title: 讲讲 klasch 的 mixin 模式
date: 2022-05-14 10:43:31
tags: 
  - JavaScript
published: false
---

去年就想写的文章现在才开始动笔。

<!-- more -->

经群友提醒才想起来 klasch 还可以通过 mixin 自定义规则，点开设置一看 mixin 规则还可以用 javascript 写，那我就不困了啊。但是查了查并没有 javascript 写 mixin 规则的详细教程，官方文档也只是一笔带过，于是自己摸索了一下，在此记录一下 mixin 的用法。

首先 mixin 脚本分 YAML 版和 JavaScript 版，这里主要讲 JavaScript 版，因为 JavaScript 脚本更加自由。从编辑按钮点进去，默认脚本是这样的：

```javascript
module.exports.parse = ({ content, name, url }, { axios, yaml, notify }) => {
  return content;
};
```

这里主要用的是 content 参数，其实 content 就是读取的正在使用的 profile 的内容，这里介绍一下 profile 的 yml 文件里的如下几个项目：

`proxies` : 各个节点的信息。以 array 形式保存了各个节点的对象。

`proxy-groups` : 各个节点分组。同样是以 array 形式存了各个分组的对象，每个组的 proxies 属性里面是这个组的节点列表（array 形式）。type 的值可以是 select （表示可手动选），可以是 load-balance （负载均衡），可以是 fallback （故障切换）。

`rules` ：规则列表。是一个保存了所有规则的 array 。

`rule-providers` ：预加载的各种在线规则，这个后面再说。

其他的暂时用不上就不介绍了。下面说说怎么利用 mixin 脚本和上面这几个属性来定制自己的规则。

## 把特定网站放进某个规则

我们再打开 profile 文件，可以看到 rules 里面的列表是这样的格式：

```
- DOMAIN,mtalk.google.com,🌐 国际网站
```

所以我们只要用脚本把自己的规则放进去就好了。另外注意一点，上面的规则会覆盖下面的规则，所以要放在最上面。先写个函数：

```javascript
let addRules = (domains, proxy, type) => {
    domains.map(domain => content.rules.unshift(`${type.toUpperCase()},${domain},${proxy}`));
  };
```

这里 domains 表示自己维护的一个需要改规则的域名列表，proxy 是节点名，type 先介绍这里会用到的几种：

* DOMAIN ：域名完整匹配
* DOMAIN-SUFFIX ：域名前缀匹配
* DOMAIN-KEYWORD：域名关键词匹配

这样调用函数就可以添加规则了。

## 新建节点分组

如上所述，`content['proxy-groups']` 就是节点的分组列表，内容模仿 profile 里面的写就可以了。可以用 `splice` 方法来调一下顺序。这里放一个我的例子：

```javascript
  content['proxy-groups'].splice(6, 0, {
    'name': 'AbemaTV',
    'type': 'select',
    'proxies': ['🌐 国外流量', '🎬 国际流媒体', ...proxiesNameFilter("🇯🇵"), '➡️ 直接连接']
  });
```

`proxiesNameFilter` 是我写的一个筛选节点的函数

```javascript
  proxiesNameFilter = (...kws) => {
    return content.proxies.filter(proxy => kws.every(kw => proxy.name.includes(kw))).map(p => p.name);
  };
```

## 将在线规则对应上节点分组

说人话就是匹配规则的从这个分组走。klasch 的一大特点就是可以将规则对应分组，切换分组里的节点不会影响其他网站。

提到其他在线规则就不得不讲一下 profile 的预处理了。在 klasch 的 settings → profiles → parsers ，点 edit 可以看到又是一个 yaml 。具体怎么配置我忘了，这里贴一下我的预处理文件，各位可以照着写。

```yaml
parsers: 
  - url: 你的订阅链接
    yaml:
      mix-rule-providers:
        nico:
          type: http
          behavior: classical
          path: ./RuleSet/StreamingMedia/Video/niconico.yaml
          url: https://cdn.jsdelivr.net/gh/DivineEngine/Profiles@master/Clash/RuleSet/StreamingMedia/Video/niconico.yaml
          interval: 86400
        AbemaTV:
          type: http
          behavior: classical
          path: ./RuleSet/StreamingMedia/Video/AbemaTV.yaml
          url: https://cdn.jsdelivr.net/gh/DivineEngine/Profiles@master/Clash/RuleSet/StreamingMedia/Video/AbemaTV.yaml
          interval: 86400
        Bahamut:
          type: http
          behavior: classical
          path: ./RuleSet/StreamingMedia/Video/Bahamut.yaml
          url: https://cdn.jsdelivr.net/gh/DivineEngine/Profiles@master/Clash/RuleSet/StreamingMedia/Video/Bahamut.yaml
          interval: 86400
        Spotify:
          type: http
          behavior: classical
          path: ./RuleSet/StreamingMedia/Music/Spotify.yaml
          url: https://cdn.jsdelivr.net/gh/DivineEngine/Profiles@master/Clash/RuleSet/StreamingMedia/Music/Spotify.yaml
          interval: 86400
        YouTube:
          type: http
          behavior: classical
          path: ./RuleSet/StreamingMedia/Video/YouTube.yaml
          url: https://cdn.jsdelivr.net/gh/DivineEngine/Profiles@master/Clash/RuleSet/StreamingMedia/Video/YouTube.yaml
          interval: 86400
        TelegramSG:
          type: http
          behavior: classical
          path: ./RuleSet/Extra/Telegram/TelegramSG.yaml
          url: https://cdn.jsdelivr.net/gh/DivineEngine/Profiles@master/Clash/RuleSet/Extra/Telegram/TelegramSG.yaml
          interval: 86400
```

记一下 `mix-rule-providers` 里面的 key ，之后要用。在 `content.rules` 里新加一条（记得用 `unshift` 放在最上面）比如：`content.rules.unshift("RULE-SET,nico,ニコニコ");` ，`RULE-SET` 表示是下载的规则集，`nico` 是刚才的预处理里面规则的 key ，`ニコニコ` 是上面刚添加好的节点分组。

## 组间路由

没错，分组之间是可以相互路由的。方法也很简单，把分组名加进分组的 `proxies` 就可以了，比如：

```javascript
content['proxy-groups'].find(p => p.name == "🎬 大陆流媒体国际版").proxies.push(...proxiesNameFilter("新加坡"));
```

最后，我自己编写的规则可以在[这里](https://github.com/nulla2011/myclash/blob/master/update/preProcess.js)看到
