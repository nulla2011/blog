---
layout: post
title:  使用fastcopy实现文件备份
date:   2018-03-11 23:12:11
categories: 
tags: 
	- batch
	- 文件管理
	- 备份
---

好像写个前言（还得加一堆换行）下面的文就会被收进去，那就写个简短的介绍吧。fastcopy是个非常高效的文件拷贝软件，因为它在复制时能提供比windows系统默认（不可调）更大的缓存。我个人的重要文件都是要备份好几份的，以前备份虽然也用fastcopy但是是手动选择文件的，比较麻烦，而且容易漏。最近发现个类似一键备份的方法记录下来。
<!-- more -->
## 为什么要用fastcopy？
最初知道fastcopy这软件，是因为我在文件复制中的一个发现：

![explorer-copy](https://b.bdstatic.com/comment/M8qbLULbBRwSkC8Rwi_qHw122335b909f44b9dadc75d945fab2c19.jpg)

如图，使用资源管理器自带的复制功能，文件副本的创建时间就变成了复制时间。

复制的东西发生了变化，而且复制后的文件无法再知道原文件的真实创建时间。

使用fastcopy复制，就能避免这一问题。

而且fastcopy的复制速度，要比系统自带快上很多（主要是windows系统的设备写入缓存太小造成的速度瓶颈）

## 使用fastcopy备份文件
fastcopy的操作模式，除了最后一个删除，一共有6种。备份的话，一般是选Diff (Size/date)（默认，拷贝新增的文件和大小日期发生变动的文件）和Sync (Size/date)（将目标目录和源目录的文件保持一致），如果有其他需要可以去帮助文件查询其他操作模式的详细信息，选择适合的模式。以下以默认模式为例：

fastcopy支持命令行模式，具体的命令行参数可以在帮助文件里查。在fastcopy目录下（或者任何地方，但要写fastcopy完整路径）编写bat文件：

	fastcopy /cmd=diff "需要备份的目录" /to="备份到的目录" 

经测试，在原目录后加"\\"，加"\\*.*"，把目标目录改成上级文件夹（最后须有"\\"），复制效果都是一样的。除了在目标目录后面加"\\"，这样会备份到下级文件夹，也就是又套了一层文件夹。

比如说，把D:/v/png/下的所有内容备份至E:/v/png/，这几种写法都是可以的：

	fastcopy /cmd=diff "D:\v\png\" /to="E:\v\png"
	fastcopy /cmd=diff "D:\v\png\*.*" /to="E:\v\png"
	fastcopy /cmd=diff "D:\v\png\" /to="E:\v\"

**注意！除了Diff (No Overwrite)模式（/cmd=noexist_only），使用fastcopy备份都会使目标目录下的文件改动被覆盖！所以建议不要对目标目录的文件进行修改，而是修改原目录的文件，之后备份。**

当然也可以将目录设置好，写进job，然后在直接在bat里写fastcopy /cmd=diff /job=job名。个人还是喜欢前一种方法，因为bat里可以直观的看到目录。

写好bat后运行即可同步了，可以配合计划任务搞个定时备份。

有关fastcopy的其他命令行参数还在研究，但估计和备份关系都不大，这里就不多说了，我们下一篇文章再见。
