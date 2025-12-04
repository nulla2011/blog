---
title: 将GitHub的资源文件重定向至第三方cdn
date: 2020-06-16 11:06:12
tags: 
	- GitHub
---

此文章早已因为 Github 和浏览器的安全策略而失效

<!-- more -->

最近GitHub的资源文件（raw.githubusercontent.com）经常出现无法访问的情况，想到之前有个GitHub的第三方cdn（https://www.jsdelivr.com/ ）于是我就想怎么把资源都重定向到这上面。以下是流程：

首先使用浏览器插件Header Editer（[谷歌商店地址](https://chrome.google.com/webstore/detail/header-editor/eningockdidmgiojffjmkdblpjocbhgh)|[火狐插件地址](https://addons.mozilla.org/zh-CN/firefox/addon/header-editor/)|[官网](https://he.firefoxcn.net/)）

![](https://b.bdstatic.com/comment/M8qbLULbBRwSkC8Rwi_qHw7203d9ce5afecf01c908dea9b5d9c436.png)



点击右下角的加号添加一个新规则，如图进行填写：



![](https://b.bdstatic.com/comment/M8qbLULbBRwSkC8Rwi_qHwd97bc56595bf2a37c9b7de39b51bb934.png)



名称随便填，规则类型选重定向，匹配类型选正则表达式，执行类型不用动。匹配规则和重定向至分别填入：

```
^https://raw\.githubusercontent\.com/([^/]*)/([^/]*)/([^/]*)/(.*)
https://cdn.jsdelivr.net/gh/$1/$2@$3/$4
```

保存规则后就可以实现重定向了。



也可以直接导入我导出的规则：

```json
{
	"request": [
		{
			"enable": true,
			"name": "ghraw",
			"ruleType": "redirect",
			"matchType": "regexp",
			"pattern": "^https://raw\\.githubusercontent\\.com/([^/]*)/([^/]*)/([^/]*)/(.*)",
			"exclude": "",
			"group": "未分组",
			"isFunction": false,
			"action": "redirect",
			"to": "https://cdn.jsdelivr.net/gh/$1/$2@$3/$4"
		}
	],
	"sendHeader": [],
	"receiveHeader": [],
	"receiveBody": []
}
```



但是在GitHub里的预览（主要是图片）还是无法加载，原因是受到安全策略的限制，暂时还没有解决方法。

![](https://b.bdstatic.com/comment/M8qbLULbBRwSkC8Rwi_qHw8b1d2a5b019e7a155fd8bc5a8ba0748e.png)



**题外话一：**其实Header Editer的用法很多，不仅能重定向一些请求，比如重定向SC的图片素材为修改后的或者重定向至base64图片来抠图（ https://weibo.com/2854303210/IpiUucYMV ）（已失效，现在重定向浏览器会报错），还可以反反盗链（修改Referer），还能直接屏蔽自己不想看的东西。

**题外话二：**有关正则表达式匹配替换的试验，我推荐去 https://tool.chinaz.com/regex 。不仅能替换匹配，还能高亮匹配文本，还有常用正则表达式。



其实GitHub page加载速度慢的问题也可以通过这种重定向解决，具体就交给大家摸索吧。