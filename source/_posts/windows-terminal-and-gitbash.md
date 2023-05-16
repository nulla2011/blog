---
title: 在右键菜单里添加 windows terminal here 并默认使用git bash
date: 2021-10-26 14:49:47
tags: 
    - windows terminal
    - git
---



马上要弃用git for windows了备份一下这个设置方法。

<!-- more -->

------

注册表：

在`HKEY_CLASSES_ROOT\Directory\Background\shell`新建项，可以取名windowsterminal，在windowsterminal里新建字符串值，内容可以是：Windows Terminal Here，然后新建项command，在command里新建字符串值，内容为`C:\Users\{your user name}\AppData\Local\Microsoft\WindowsApps\wt.exe`，也就是：

```
Windows Registry Editor Version 5.00

[HKEY_CLASSES_ROOT\Directory\Background\shell\windowsterminal]
@="Windows Terminal Here"
[HKEY_CLASSES_ROOT\Directory\Background\shell\windowsterminal\command]
@="\"C:\\Users\\{USERNAME}\\AppData\\Local\\Microsoft\\WindowsApps\\wt.exe\""
```



windows terminal 设置：

在settings.json 中添加如下内容

```
{
                "acrylicOpacity": 0.69999999999999996,
                "closeOnExit": "graceful",
                "colorScheme": "GitBash",
                "commandline": "\"E:\\Git\\bin\\bash.exe\" --login -i -l",
                "cursorColor": "#FFFFFF",
                "cursorShape": "bar",
                "fontFace": "Consolas",
                "fontSize": 12,
                "guid": "{0caa0dad-35be-5f56-a8ff-afceeeaa6109}",
                "historySize": 9001,
                "icon": "E:/Git/mingw64/share/git/git-for-windows.ico",
                "name": "git-bash",
                "padding": "0, 0, 0, 0",
                "snapOnInput": true,
                "useAcrylic": true
            },
```

参考：

https://medium.com/@techpreacher/using-git-bash-with-the-microsoft-terminal-bd1f71fa17a1