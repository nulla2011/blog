---
layout: post
title:  "某网盘下载的文件名多出的迷之加号"
date:   2018-08-31 12:59:00
categories: 
tags: 
  - batch
---

不知道从什么时候开始，某盘下载文件时，如果文件名有空格，会使用+号填充：

![下载文件](https://gitcode.net/message2011/tttp/-/raw/master/sina/872e2401ly1fustajy9rvj209z00zdfn.jpg)

这对于强迫症来说，“我无法忍受你（下载工具？服务器？）的行为”，于是写了个简单的批处理来恢复原状：
<!-- more -->

```
@echo off
cd/d "%~dp1"
set "str=%~n1"
echo 修改前：%str%
set nstr=%str:+= %
echo 修改后：%nstr%
ren "%str%%~x1" "%nstr%%~x1"
echo 成功！
pause
```

使用方法：将需要改名的文件拖到bat文件上

---

后续可能会加批量命名的功能
