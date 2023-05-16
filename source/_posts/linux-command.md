---
title: 个人常用的Linux命令
date: 2020-08-16 18:37:57
tags: 
  - Linux
---

记录一下自用的命令。

系统：centos 7

<!-- more -->

## 第一步是安装EPEL库

`sudo yum install epel-release`

## 安装Nodejs

`sudo yum install nodejs`

（太旧了，自己编译了）

## 卸载Nodsjs

`yum remove nodejs npm -y`

## 安装python

~~哦自带python，不用装~~

自带的是2.7，还是得装3

`yum install python36`

## 查看系统信息

`uname -a`

## tar解压

`tar --strip-components 1 -xzvf [file] -C [path]`

strip-components: 去除几层目录结构

x: 解压 c: 压缩 z: gz j: bz v: 有显示

## 显示目录相关

### ls

-d：不显示子目录 -l：显示详细信息 -a：包括. 和.. 和隐藏文件

### ll

相当于ls -l

### du

显示文件夹和文件的大小

--max-depth=1 只显示一层目录的大小。一般会加上这个，看哪个文件夹比较大就进去再du一遍

-m 以M为单位显示，以下一些命令同理

-h 显示更加人性化，以下一些命令同理

## 复制粘贴重命名删除

cp：带-r为复制目录中的所有符合要求的文件

mv：移动，也可以用来重命名

rm：删除，-r为递归删除文件夹，-f为不用确认

## 显示各种资源占用

top （-p pid仅显示指定pid的进程）

free 显示当前使用的内存（带-m为以M为单位）

## 进程相关

### ps

显示当前运行的进程 

加-A显示全部

### kill

杀掉进程（后面是pid）

### killall

杀掉所有进程，如killall -9 [进程名]可以将这个名称的进程全部结束

## 添加swap空间

`sudo fallocate -l 1G /swapfile`

`sudo chmod 600 /swapfile`  *更改权限*

`sudo mkswap /swapfile`

`sudo swapon /swapfile`

`swapon -s`  *查看swap文件设置*

## screen的使用

### 未进入session时

#### screen -ls

显示已创建的session

#### screen -r [id]

恢复当前id的session

#### screen -d [id]

把当前id的session放到后台

#### screen -d -r [id]

结束当前session并回到指定id的session

#### screen -S [id] -X quit

杀掉当前id的session

### 显示session时

先按**Ctrl+a**准备输入命令

d 切到后台

c 新建一个窗口

n p 下一个和上一个窗口

space 循环切换窗口

k 关闭当前窗口（会杀进程）

:quit 杀掉当前session里所有程序并退出

## 其他

which：查看命令所在位置

whereis：查看命令所在位置还有源码所在位置

## 其他操作

### 添加PATH

编辑/etc/profile，在`export PATH USER LOGNAME MAIL HOSTNAME HISTSIZE HISTCONTROL`前面加上

`export PATH=$PATH:yourpath1:yourpath2:...`