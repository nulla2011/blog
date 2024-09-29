---
layout: post
title:  有关B站视频的新格式：DASH。再简单讲讲类似的youtube视频格式
date:   2019-03-01 16:47:36
categories: 
tags: 
  - batch
  - 视频
  - bilibili
  - 未完成
---

好久没写博客了
~~先开个坑~~

2020.07.12 最近搜B站视频技术相关的东西居然能搜到自己这篇文章，于是决定把这个坑填了。

<!-- more -->

------

B站自2019年2月开始启用了新的视频格式：DASH。DASH的全称是Dynamic Adaptive Streaming over HTTP，一种自适应比特率流媒体技术。在B站之前使用DASH的视频网站有youtube等。DASH的好处是媒体流每几秒切一片，方便根据网速实时切换，而且每个片段请求一次可以从容应对网络不稳定之类的问题。

![](https://b.bdstatic.com/comment/M8qbLULbBRwSkC8Rwi_qHw711188151e425868d1ce466d72228251.png)

每个片段都是相同的url

视频部分格式总结：

| id  | format     | description  |码率| 是否需要大会员 |
| --- | ---------- | ------------ | --- | -------------- |
| 116 | flv_p60    | 高清 1080P60 |6000k| 是             |
| 112 | hdflv2     | 高清 1080P+  |6000k| 是             |
| 80  | flv        | 高清 1080P   |3000k| 否             |
| 74  | flv720_p60 | 高清 720P60  |3000k| 是             |
| 64  | flv720     | 高清 720P    |2000k| 否             |
| 32  | flv480     | 清晰 480P    |900k| 否             |
| 16  | flv360     | 流畅 360P    |400k| 否             |

音频部分格式总结：

| id    | 码率 |
| ----- | ---- |
| 30280 | 320k |
| 30216 | 64k  |


基于mpv的b站视频播放：

```batch 
@echo off

set /p video=input video URL:
set /p audio=input audio URL:

:r
mpv --quiet --no-ytdl --user-agent="Mozilla/5.0 (Windows NT 10.0; WOW64; rv:51.0) Gecko/20100101 Firefox/51.0" --referrer="https://www.bilibili.com/" "%video%" --audio-file="%audio%"

set /p choice=press q to quit:
if /i %choice% equ q goto :q
goto :r
:q
```

下载B站DASH视频然后混流：
```batch
@echo off

set /p video=input video URL:
set /p audio=input audio URL:

:r
aria2c -s 5 --referer="https://www.bilibili.com/" "%video%" -o v_a2.m4s
aria2c -s 5 --referer="https://www.bilibili.com/" "%audio%" -o a_a2.m4s
ECHO Download complete,muxing,,,
ffmpeg -i v_a2.m4s -vcodec copy -an v_a2.h264
del v_a2.m4s
ffmpeg -i a_a2.m4s -vn -acodec copy a_a2.aac
del a_a2.m4s
mp4box -add v_a2.h264 -add a_a2.aac -new output.mp4
set /p name=Mux complete,plese enter name:
ren output.mp4 %name%.mp4
del v_a2.h264
del a_a2.aac

pause
```
