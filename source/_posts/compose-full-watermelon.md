---
title: 研究一下合成大西瓜
date: 2021-01-26 11:59:42
tags: 
  - JavaScript
---

微博上看到有人在肝这个游戏，于是拿来玩了玩，感觉还挺难的。

<!-- more -->

打开控制台，发现是用的[Cocos2d](https://www.cocos.com/)引擎。

首先想到的是修改出现的水果看看能不能降低难度。一开始不熟悉代码，费了点时间。在/src/project.js（以下如果没有特别说明都是指的这个js）里搜fruit，F3了很久发现了一个createOneFruit方法，再搜这个方法名总算找到了想要的东西：

![](https://gitcode.net/message2011/tttp/-/raw/master/watermelon/Screenshot_2021-01-25_122846.png)

onTouchEnd表明是放手（鼠标）时候的方法。createOneFruit的定义是，生成指定等级的水果（0为葡萄，1为樱桃，……9为半个西瓜）。根据连续的条件运算符可以看出，前7个（第一次生成水果不在这个方法里）生成的水果都是固定的，之后就是从前五种水果里随机生成了。先试试改成每次都出一种水果：

![](https://gitcode.net/message2011/tttp/-/raw/master/watermelon/Screenshot_2021-01-25_124513.png)

![QQ图片20210126125703.jpg](https://gitcode.net/message2011/tttp/-/raw/master/watermelon/QQ图片20210126125703.jpg)

~~结果改完发现想做成大西瓜也挺难的~~，而且也相当耗时间，于是：

![](https://gitcode.net/message2011/tttp/-/raw/master/watermelon/Screenshot_2021-01-26_130158.png)

![QQ图片20210126130446.jpg](https://gitcode.net/message2011/tttp/-/raw/master/watermelon/QQ图片20210126130446.jpg)

接下来想改分数，这个可能就相对比较简单了，随便下个能在游戏中中断的断点然后改score的值就行了。

![QQ图片20210126133416.jpg](https://gitcode.net/message2011/tttp/-/raw/master/watermelon/QQ图片20210126133416.jpg)

（为了控分其实还去json里改了水果的大小）

接着想看水果摞在一起的样子（强迫症狂喜？）于是想到改合并同类项的判定。这个搜索花了一番功夫，好像也是从分数入手的，因为每回合并同类项都会增加分数。接着搜索score终于发现了一个叫onBeginContact的方法，看名字就感觉找对了。

![](https://gitcode.net/message2011/tttp/-/raw/master/watermelon/Screenshot_2021-01-26_134522.png)

这个条件运算符明显是判断碰撞的水果是否是同类，所以只要加上!1永不为真就可以了。

![QQ图片20210126134954.jpg](https://gitcode.net/message2011/tttp/-/raw/master/watermelon/QQ图片20210126134954.jpg)

想取消掉对高度的判定，让游戏永不结束。搜索height，high等词，找到一个findHighestFruit方法，首先尝试把这个方法改成返回固定的值，结果发现只是快到顶上的警示没有了，超过限高游戏还是会结束。接下来做了各种尝试皆无果，突然想到超高的水果会闪红色，尝试搜索red，终于有了发现：

![](https://gitcode.net/message2011/tttp/-/raw/master/watermelon/Screenshot_2021-01-26_140854.png)

这个if里的条件应该就是判断超高等等的条件了，尝试加上!1永不为真，果然游戏就结束不了了

![QQ图片20210126141246.jpg](https://gitcode.net/message2011/tttp/-/raw/master/watermelon/QQ图片20210126141246.jpg)

~~用极快的手速测试游戏的物理引擎~~



还有几个想法，过几天再说