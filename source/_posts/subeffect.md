---
layout: post
title:  36小时学习特效字幕纪实
date:   2019-08-11 15:40:50
categories: 
tags: 
  - 字幕
  - 视频
---

t7s 4th BD发售以后，群里好多人说要打轴，我正好借这这个机会研究一下怎么做字幕，正好之前看过好多特效字幕，就试试做特效字幕吧。
首先上效果：(建议点去主站观看以获得更好的体验)

<div style="position: relative; width: 100%; height: 0; padding-bottom: 75%;">
  <iframe src="//player.bilibili.com/player.html?aid=63228418&cid=109795525&page=1" 
          scrolling="no" 
          border="0" 
          frameborder="no" 
          framespacing="0" 
          allowfullscreen="true" 
          data-mediaembed="bilibili"
          style="position: absolute; width: 100%; height: 100%; left: 0; top: 0;"> </iframe>
</div>

<!-- more -->
## 视频截取

截视频没有多大问题，可是在截取音频时出问题了。原因是pcm_bluray不能直接导出成wav，但试过aiff格式也不行，最后只好-acodec pcm_s24le导出。

![](https://b.bdstatic.com/comment/M8qbLULbBRwSkC8Rwi_qHwdd536f24194bbe506d417661aba5631a.png)

## 字幕打轴

之前一直好奇这种单个音节的轴是怎么打的，后来稍微查了查才知道是卡拉ok字幕，把单句范围选好后点切换卡拉ok模式，然后分割每个音节，在频谱上拖动调整范围，就会自动生成带k值的字幕：

![](https://b.bdstatic.com/comment/M8qbLULbBRwSkC8Rwi_qHwd12e93879eace555169c3f61e1ab6275.png)

这里k值单位为百分之一秒

## 制作特效

稍微看了点文档，这个ass字幕差不多是一种标记语言，有各种各样的标签来实现各种功能，具体可见[https://aegi.vmoe.info/docs/3.2/ASS_Tags/](https://aegi.vmoe.info/docs/3.2/ASS_Tags/) 。既然我能够用ae等视频软件来制作各种基本的动画，那么搞明白字幕标签的功能和用法，再结合以前视频做动画的经验，特效字幕就不难了。

### 设计效果

一条字幕的整个动画流程，可以分成三个阶段：入场，展示，离场。这三个阶段的效果各不相同，需要单独设计。具体的想法参考了与歌曲相关的视频（包括视频源本身）以及其他人做的特效字幕。最终大致的思路是：

颜色：solo部分颜色按角色代表色，副歌合唱部分选用这歌的印象色（樱色）

入场：逐字空心从右上飞入，同时从旋转60度变为正常，淡入

展示：逐字稍稍放大，发光，再恢复

离场：逐字旋转下落离场，淡出

#### 颜色的选择，字幕的位置

字幕的颜色分为主颜色，副颜色（仅卡拉ok字幕使用），描边色，阴影色。演唱会视频的整体颜色偏暗，靠底边的颜色大部分时间几乎为黑色。而字幕的功能是让人在看视频的同时用余光看字幕来获得信息。因此字幕的位置最好在正上以及正下方，字幕的颜色应该与视频颜色形成鲜明对比。所以这里字幕主色用白色，描边色用彩色比较好。

### 制作模板

制作特效字幕需要批量生成各种标签，因此需要先制作自动化模板，然后用自带的脚本给每行字幕批量加上标签。

首先是入场效果。先用retime函数设置这一行（字）的时间，具体的就不介绍了，可以看[http://www.tcax.org/forum.php?mod=viewthread&tid=806](http://www.tcax.org/forum.php?mod=viewthread&tid=806) 。移动，用\move搞定。空心，用\1a\2a把主色设成全透明。旋转，\fry搞定，并用\t加上动画。最后是淡入，\t控制一下\3a。最终代码如下：

``` 
!retime("start2syl",-700+syl.i*60,0)!{\fry-60\1a&HFF&\2a&HFF&\move(!$scenter+300!,!$smiddle-50!,$scenter,$smiddle,0,800)\an5\blur3\3a&HFF&\t(0,600,\3a&H00&\t(600,800,\fry0))}
```

然后是展示效果。同样先retime。放大缩小用\fscx\fscy控制，前半放大后半还原，第一个\t的时间是前半，所以是0,!$dur/2!，第二个\t的时间是后半，所以是!$dur/2!,$dur，同时在\t里改一下\3c的颜色。最终代码如下：

``` 
!retime("syl")!{\an5\pos($center,$middle)\blur5\t(0,!$dur/2!,\fscx118\fscy118\3c&HFFFFFF&)\N\t(!$dur/2!,$dur,\fscx100\fscy100\3c&HE54FFE&)}
```

最后是离场效果。先retime。在\t里用\frx\fry\frz随便旋转，并加\alpha淡出。\move让字移到下方。时间都是每行最后300毫秒因此是!line.duration-300!,!line.duration!。最终代码如下：

``` 
!retime("syl2end",0,200+syl.i*30)!{\blur3\move($x,$y,$x,!$y+20!,!line.duration-300!,!line.duration!)\pos($scenter,$smiddle)\t(!line.duration-300!,!line.duration!,\alpha&HFF&\fry200\frz-130\frx60)}
```

### 制作图案

如果想在字幕中加上简单的图形，可以用aegisub自带的小工具assdraw，这里生成的都是类似于svg和ai的矢量图，简单几行代码就可以描述一个图形。这里做的图案参照了出现在MV和live大屏幕上的樱花图案。

![MV](https://b.bdstatic.com/comment/M8qbLULbBRwSkC8Rwi_qHw4f391286fb564a0ed9e2e13b0ea234c4.png)

![视频源](https://b.bdstatic.com/comment/M8qbLULbBRwSkC8Rwi_qHw64bb0fbb376bf52bafff495e3ed2b661.png)

assdraw拉线得出代码后粘至aegisub。

![](https://b.bdstatic.com/comment/M8qbLULbBRwSkC8Rwi_qHwbd4712f71c1435890046ab63bb45d8fa.png)

### 制作图案动画

这里想做一个樱花飞落的效果，这个效果在AE里用P粒子就能轻易实现。在这里，没有插件（其实有个适合做效果的[http://blog.sina.com.cn/s/blog_664190730102v68g.html](http://blog.sina.com.cn/s/blog_664190730102v68g.html) 但是没时间研究）只好手动来模拟P粒子的功能。给\move的各点加上随机数来让樱花随机飘动（其实就是直线运动，有个\moves标签可以曲线运动但来不及研究了），给\frx\fry\frz加上随机数来实现随机旋转，\t里改改颜色来让颜色变化。最后行描述加上loop 7让一个字重复7遍这个图形。最终代码如下：

``` 
!retime("syl",0,1300)!{\bord0\1a&H50&\1c&HEC75FF&\an5\move(!$scenter+math.random(-20,20)!,!$smiddle+math.random(-20,20)!,!$scenter+math.random(-78,60)!,!$smiddle+math.random(130,150)!,0,1500)\blur10\fad(50,500)\t(0,300,\blur1)\t(0,1500,\frx!math.random(-200,150)!)\fry!math.random(-120,180)!\frz!math.random(-300,270)!)\t(0,300,\c&HF5BAFF&)\t(300,600,\c&HEC75FF&)\t(600,900,\c&HF5BAFF&)\t(900,1200,\c&HEC75FF&)\p1}!shape!{\p0}
```

### 单行变色

最后说说这个，这里面两人合唱的部分加了渐变色效果，中文部分因为是一整行就用了\vc（需要vsfiltermod）。日文部分是单字就用_G.ass_color函数控制每个字的颜色。比如字幕中用到的`!_G.ass_color(254-(254-117)*(ci[1]-2)/(cn-1),248,69+(254-69)*(ci[1]-2)/(cn-1))!`，这里的ci是单字计数变量，cn是每行的字数，具体计数器的用法可以看看[http://www.tcax.org/forum.php?mod=viewthread&tid=696](http://www.tcax.org/forum.php?mod=viewthread&tid=696) 。

## 预览

自动化生成字幕以后可以直接在aegisub预览，建议还是拖进播放器预览一下，注意播放器也要挂载vsfiltermod。放上部分效果的预览：

![](https://b.bdstatic.com/comment/M8qbLULbBRwSkC8Rwi_qHw17223e343b10dbc56c1dd282c2985bae.png)

![](https://b.bdstatic.com/comment/M8qbLULbBRwSkC8Rwi_qHw999b0c983e333a3dd0f38035f7ed7741.png)

![](https://b.bdstatic.com/comment/M8qbLULbBRwSkC8Rwi_qHw4a342e7cf81b1be350f479661a2d5698.png)

![](https://b.bdstatic.com/comment/M8qbLULbBRwSkC8Rwi_qHw6fd47db0938535d91952bc773601595d.png)

## 压制

压制方面没什么好说的，就记得在avs里挂上vsfiltermod，把TextSub改成TextSubMod，否则渐变效果无法实现

那么这篇文章就结束了，最后放上整个字幕（不带自动生成的fx行，请用脚本自行生成）

## 字幕文件

``` 
[Script Info]
; Script generated by Aegisub 3.2.2
; http://www.aegisub.org/
Title: Default Aegisub file
ScriptType: v4.00+
WrapStyle: 0
ScaledBorderAndShadow: yes
YCbCr Matrix: TV.601
PlayResX: 1920
PlayResY: 1080

[Aegisub Project Garbage]
Last Style Storage: Default
Audio File: G:/sak2.wav
Video File: G:/sak_output.mp4
Video AR Mode: 4
Video AR Value: 1.777778
Video Zoom Percent: 0.300000
Scroll Position: 3349
Active Line: 3362
Video Position: 6540

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: all_cn-furigana,造字工房言趣体（非商用）,27.5,&H00FFFFFF,&HFF0000FF,&H00EE84FF,&H4E000000,0,0,0,0,100,100,0,0,1,1,0,2,10,10,10,1
Style: all_jp-furigana,JNR_Font,24.5,&H00FFFFFF,&HFF0000FF,&H00EE84FF,&H7D000000,0,0,0,0,100,100,0,0,1,1,0,2,10,10,70,1
Style: kuma_cn-furigana,造字工房言趣体（非商用）,27.5,&H00FFFFFF,&HFF0000FF,&H00FFF575,&H4E000000,0,0,0,0,100,100,0,0,1,1,0,2,10,10,10,1
Style: kuma_jp-furigana,JNR_Font,24.5,&H00FFFFFF,&HFF0000FF,&H00FFF575,&H4E000000,0,0,0,0,100,100,0,0,1,1,0,2,10,10,70,1
Style: yui&kuma_cn-furigana,造字工房言趣体（非商用）,27.5,&H00FFFFFF,&HFF0000FF,&H00EE84FF,&H4E000000,0,0,0,0,100,100,0,0,1,1,0,2,10,10,10,1
Style: yui&kuma_jp-furigana,JNR_Font,24.5,&H00FFFFFF,&HFF0000FF,&H00EE84FF,&H4E000000,0,0,0,0,100,100,0,0,1,1,0,2,10,10,70,1
Style: shiori_cn-furigana,造字工房言趣体（非商用）,27.5,&H00FFFFFF,&HFF0000FF,&H00D4FF77,&H4E000000,0,0,0,0,100,100,0,0,1,1,0,2,10,10,10,1
Style: shiori_jp-furigana,JNR_Font,24.5,&H00FFFFFF,&HFF0000FF,&H00D4FF77,&H4E000000,0,0,0,0,100,100,0,0,1,1,0,2,10,10,70,1
Style: chorus_cn-furigana,造字工房言趣体（非商用）,27.5,&H00FFFFFF,&HFF0000FF,&H00EE84FF,&H4E000000,0,0,0,0,100,100,0,0,1,1,0,2,10,10,10,1
Style: chorus_jp-furigana,JNR_Font,24.5,&H00FFFFFF,&HFF0000FF,&H00EE84FF,&H7D000000,0,0,0,0,100,100,0,0,1,1,0,2,10,10,74,1
Style: kuma&shiori_cn-furigana,造字工房言趣体（非商用）,27.5,&H00FFFFFF,&HFF0000FF,&H00EE84FF,&H4E000000,0,0,0,0,100,100,0,0,1,1,0,2,10,10,10,1
Style: kuma&shiori_jp-furigana,JNR_Font,24.5,&H00FFFFFF,&HFF0000FF,&H00EE84FF,&H4E000000,0,0,0,0,100,100,0,0,1,1,0,2,10,10,70,1
Style: yui_cn-furigana,造字工房言趣体（非商用）,27.5,&H00FFFFFF,&HFF0000FF,&H0045FCFF,&H4E000000,0,0,0,0,100,100,0,0,1,1,0,2,10,10,10,1
Style: yui_jp-furigana,JNR_Font,24.5,&H00FFFFFF,&HFF0000FF,&H0045FCFF,&H4E000000,0,0,0,0,100,100,0,0,1,1,0,2,10,10,70,1
Style: minami_cn-furigana,造字工房言趣体（非商用）,27.5,&H00FFFFFF,&HFF0000FF,&H00E54FFE,&H4E000000,0,0,0,0,100,100,0,0,1,1,0,2,10,10,10,1
Style: minami_jp-furigana,JNR_Font,24.5,&H00FFFFFF,&HFF0000FF,&H00E54FFE,&H4E000000,0,0,0,0,100,100,0,0,1,1,0,2,10,10,70,1
Style: test-furigana,Adobe 黑体 Std R,50,&H00FFFFFF,&H000000FF,&H00000000,&H00000000,0,0,0,0,100,100,0,0,1,0,0,2,10,10,10,1
Style: Default-furigana,JNR_Font,17.5,&H00FFFFFF,&H000000FF,&H00EE84FF,&H6B000000,0,0,0,0,100,100,0,0,1,1,1,7,10,10,10,1
Style: Default,JNR_Font,35,&H00FFFFFF,&H000000FF,&H00EE84FF,&H6B000000,0,0,0,0,100,100,0,0,1,2,2,7,10,10,10,1
Style: test,Adobe 黑体 Std R,100,&H00FFFFFF,&H000000FF,&H00000000,&H00000000,0,0,0,0,100,100,0,0,1,0,0,2,10,10,10,1
Style: minami_jp,JNR_Font,49,&H00FFFFFF,&HFF0000FF,&H00E54FFE,&H4E000000,0,0,0,0,100,100,0,0,1,2,0,2,10,10,70,1
Style: minami_cn,造字工房言趣体（非商用）,55,&H00FFFFFF,&HFF0000FF,&H00E54FFE,&H4E000000,0,0,0,0,100,100,0,0,1,2,0,2,10,10,10,1
Style: yui_jp,JNR_Font,49,&H00FFFFFF,&HFF0000FF,&H0045FCFF,&H4E000000,0,0,0,0,100,100,0,0,1,2,0,2,10,10,70,1
Style: yui_cn,造字工房言趣体（非商用）,55,&H00FFFFFF,&HFF0000FF,&H0045FCFF,&H4E000000,0,0,0,0,100,100,0,0,1,2,0,2,10,10,10,1
Style: kuma&shiori_jp,JNR_Font,49,&H00FFFFFF,&HFF0000FF,&H00EE84FF,&H4E000000,0,0,0,0,100,100,0,0,1,2,0,2,10,10,70,1
Style: kuma&shiori_cn,造字工房言趣体（非商用）,55,&H00FFFFFF,&HFF0000FF,&H00EE84FF,&H4E000000,0,0,0,0,100,100,0,0,1,2,0,2,10,10,10,1
Style: chorus_jp,JNR_Font,49,&H00FFFFFF,&HFF0000FF,&H00EE84FF,&H7D000000,0,0,0,0,100,100,0,0,1,2,0,2,10,10,74,1
Style: chorus_cn,造字工房言趣体（非商用）,55,&H00FFFFFF,&HFF0000FF,&H00EE84FF,&H4E000000,0,0,0,0,100,100,0,0,1,2,0,2,10,10,10,1
Style: shiori_jp,JNR_Font,49,&H00FFFFFF,&HFF0000FF,&H00D4FF77,&H4E000000,0,0,0,0,100,100,0,0,1,2,0,2,10,10,70,1
Style: shiori_cn,造字工房言趣体（非商用）,55,&H00FFFFFF,&HFF0000FF,&H00D4FF77,&H4E000000,0,0,0,0,100,100,0,0,1,2,0,2,10,10,10,1
Style: yui&kuma_jp,JNR_Font,49,&H00FFFFFF,&HFF0000FF,&H00EE84FF,&H4E000000,0,0,0,0,100,100,0,0,1,2,0,2,10,10,70,1
Style: yui&kuma_cn,造字工房言趣体（非商用）,55,&H00FFFFFF,&HFF0000FF,&H00EE84FF,&H4E000000,0,0,0,0,100,100,0,0,1,2,0,2,10,10,10,1
Style: kuma_jp,JNR_Font,49,&H00FFFFFF,&HFF0000FF,&H00FFF575,&H4E000000,0,0,0,0,100,100,0,0,1,2,0,2,10,10,70,1
Style: kuma_cn,造字工房言趣体（非商用）,55,&H00FFFFFF,&HFF0000FF,&H00FFF575,&H4E000000,0,0,0,0,100,100,0,0,1,2,0,2,10,10,10,1
Style: all_jp,JNR_Font,49,&H00FFFFFF,&HFF0000FF,&H00EE84FF,&H7D000000,0,0,0,0,100,100,0,0,1,2,0,2,10,10,70,1
Style: all_cn,造字工房言趣体（非商用）,55,&H00FFFFFF,&HFF0000FF,&H00EE84FF,&H4E000000,0,0,0,0,100,100,0,0,1,2,0,2,10,10,10,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
Comment: 0,0:00:00.00,0:00:00.00,Default,,0,0,0,code line all,ci = {0};
Comment: 0,0:00:00.00,0:00:00.00,Default,,0,0,0,code syl all,function char_counter(ref) ci[ref] = ci[ref] + 1; return "" end; cn = _G.unicode.len(orgline.text_stripped:gsub(" ",""));
Comment: 0,0:00:00.00,0:00:00.00,Default,,0,0,0,code once all,math.randomseed(114)
Comment: 0,0:00:00.00,0:00:00.00,Default,,0,0,0,code once all,shape= "m 0 0 l -6 -7 l -11 12 l 0 33 l 11 12 l 6 -7"
Comment: 0,0:00:00.00,0:00:00.00,chorus_jp,,0,0,0,template syl noblank notext loop 7,!retime("syl",0,1300)!{\bord0\1a&H50&\1c&HEC75FF&\an5\move(!$scenter+math.random(-20,20)!,!$smiddle+math.random(-20,20)!,!$scenter+math.random(-78,60)!,!$smiddle+math.random(130,150)!,0,1500)\blur10\fad(50,500)\t(0,300,\blur1)\t(0,1500,\frx!math.random(-200,150)!)\fry!math.random(-120,180)!\frz!math.random(-300,270)!)\t(0,300,\c&HF5BAFF&)\t(300,600,\c&HEC75FF&)\t(600,900,\c&HF5BAFF&)\t(900,1200,\c&HEC75FF&)\p1}!shape!{\p0}
Comment: 0,0:00:00.00,0:00:00.00,yui&kuma_cn,,0,0,0,template line,!retime("line",0,70)!{\3vc(&H45FCFF&,&HD4FF77&,&H45FCFF&,&HD4FF77&)\blur2\alpha&H00&\clip(!$left-170!,0,!$left-170!,1080)\move($x,$y,$x,!$y+20!,!line.duration-300!,!line.duration!)\t(0,750,0.23,\clip(!$left-1!,0,!$right+1!,1080))\t(750,751,\clip(0,0,1920,1080))\t(!line.duration-350!,!line.duration-250!,\bord0)\t(!line.duration-300!,!line.duration!,\fsp18\blur9)\fad(0,130)}
Comment: 0,0:00:00.00,0:00:00.00,yui&kuma_jp,,0,0,0,template syl,!retime("start2syl",-500+syl.i*130,0)!!char_counter(1)!{\org(!$scenter-16!,!$smiddle+16!)\frz60\1a&HFF&\2a&HFF&\move(!$scenter+25!,!$smiddle-25!,$scenter,$smiddle,100,400)\an5\blur3\fad(200,0)\3c!_G.ass_color(254-(254-117)*(ci[1]-2)/(cn-1),248,69+(254-69)*(ci[1]-2)/(cn-1))!\t(100,400,\frz0)}
Comment: 0,0:00:00.00,0:00:00.00,yui&kuma_jp,,0,0,0,template syl,!retime("syl")!{\an5\pos($center,$middle)\3c!_G.ass_color(252-(254-117)*(ci[1]-2)/(cn-1),248,69+(254-69)*(ci[1]-2)/(cn-1))!\1a&FF&\2a&FF&\bord2\blur5}
Comment: 0,0:00:00.00,0:00:00.00,yui&kuma_jp,,0,0,0,template syl,!retime("syl")!{\an5\move($center,!$middle-13!,$center,$middle)\bord0\fscx0\blur5\t(0,$dur,\fscx100)\t(0,!$dur/2.5!,\blur0)}
Comment: 0,0:00:00.00,0:00:00.00,yui&kuma_jp,,0,0,0,template syl,!retime("syl2end",0,200+syl.i*30)!{\blur3\move($x,$y,$x,!$y+20!,!line.duration-300!,!line.duration!)\pos($scenter,$smiddle)\3c!_G.ass_color(252-(254-117)*(ci[1]-2)/(cn-1),248,69+(254-69)*(ci[1]-2)/(cn-1))!\t(!line.duration-300!,!line.duration!,\alpha&HFF&\fry200\frz-130\frx60)}
Comment: 0,0:00:00.00,0:00:00.00,kuma&shiori_cn,,0,0,0,template line,!retime("line",0,70)!{\3vc(&HFFF575&,&HD4FF77&,&HFFF575&,&HD4FF77&)\blur2\alpha&H00&\clip(!$left-170!,0,!$left-170!,1080)\move($x,$y,$x,!$y+20!,!line.duration-300!,!line.duration!)\t(0,750,0.23,\clip(!$left-1!,0,!$right+1!,1080))\t(750,751,\clip(0,0,1920,1080))\t(!line.duration-350!,!line.duration-250!,\bord0)\t(!line.duration-300!,!line.duration!,\fsp18\blur9)\fad(0,130)}
Comment: 0,0:00:00.00,0:00:00.00,kuma&shiori_jp,,0,0,0,template syl,!retime("start2syl",-500+syl.i*130,0)!!char_counter(1)!{\org(!$scenter-16!,!$smiddle+16!)\frz60\1a&HFF&\2a&HFF&\move(!$scenter+25!,!$smiddle-25!,$scenter,$smiddle,100,400)\an5\blur3\fad(200,0)\3c!_G.ass_color(118,245+(255-245)*(ci[1]-2)/(cn-1),254-(254-212)*(ci[1]-2)/(cn-1))!\t(100,400,\frz0)}
Comment: 0,0:00:00.00,0:00:00.00,kuma&shiori_jp,,0,0,0,template syl,!retime("syl")!{\an5\pos($center,$middle)\3c!_G.ass_color(118,245+(254-245)*(ci[1]-2)/(cn-1),254-(254-212)*(ci[1]-2)/(cn-1))!\1a&FF&\2a&FF&\bord2\blur5}
Comment: 0,0:00:00.00,0:00:00.00,kuma&shiori_jp,,0,0,0,template syl,!retime("syl")!{\an5\move($center,!$middle-13!,$center,$middle)\bord0\fscx0\blur5\t(0,$dur,\fscx100)\t(0,!$dur/2.5!,\blur0)}
Comment: 0,0:00:00.00,0:00:00.00,kuma&shiori_jp,,0,0,0,template syl,!retime("syl2end",0,200+syl.i*30)!{\blur3\move($x,$y,$x,!$y+20!,!line.duration-300!,!line.duration!)\pos($scenter,$smiddle)\3c!_G.ass_color(118,245+(254-245)*(ci[1]-2)/(cn-1),254-(254-212)*(ci[1]-2)/(cn-1))!\t(!line.duration-300!,!line.duration!,\alpha&HFF&\fry200\frz-130\frx60)}
Comment: 0,0:00:00.00,0:00:00.00,all_cn,,0,0,0,template line,!retime("line",0,70)!{\blur2\alpha&H00&\clip(!$left-170!,0,!$left-170!,1080)\move($x,$y,$x,!$y+20!,!line.duration-300!,!line.duration!)\t(0,750,0.23,\clip(!$left-1!,0,!$right+1!,1080))\t(750,751,\clip(0,0,1920,1080))\t(!line.duration-350!,!line.duration-250!,\bord0)\t(!line.duration-300!,!line.duration!,\fsp18\blur9)\fad(0,130)}
Comment: 0,0:00:00.00,0:00:00.00,all_jp,,0,0,0,template syl,!retime("start2syl",-500+syl.i*130,0)!{\org(!$scenter-16!,!$smiddle+16!)\frz60\1a&HFF&\2a&HFF&\move(!$scenter+25!,!$smiddle-25!,$scenter,$smiddle,100,400)\an5\blur3\fad(200,0)\t(100,400,\frz0)}
Comment: 0,0:00:00.00,0:00:00.00,all_jp,,0,0,0,template syl,!retime("syl")!{\an5\pos($center,$middle)\1a&FF&\2a&FF&\bord2\blur5}
Comment: 0,0:00:00.00,0:00:00.00,all_jp,,0,0,0,template syl,!retime("syl")!{\an5\move($center,!$middle-13!,$center,$middle)\bord0\fscx0\blur5\t(0,$dur,\fscx100)\t(0,!$dur/2.5!,\blur0)}
Comment: 0,0:00:00.00,0:00:00.00,all_jp,,0,0,0,template syl,!retime("syl2end",0,200+syl.i*30)!{\blur3\move($x,$y,$x,!$y+20!,!line.duration-300!,!line.duration!)\pos($scenter,$smiddle)\t(!line.duration-300!,!line.duration!,\alpha&HFF&\fry200\frz-130\frx60)}
Comment: 0,0:00:00.00,0:00:00.00,kuma_cn,,0,0,0,template line,!retime("line",0,70)!{\blur2\alpha&H00&\clip(!$left-170!,0,!$left-170!,1080)\move($x,$y,$x,!$y+20!,!line.duration-300!,!line.duration!)\t(0,750,0.23,\clip(!$left-1!,0,!$right+1!,1080))\t(750,751,\clip(0,0,1920,1080))\t(!line.duration-350!,!line.duration-250!,\bord0)\t(!line.duration-300!,!line.duration!,\fsp18\blur9)\fad(0,130)}
Comment: 0,0:00:00.00,0:00:00.00,kuma_jp,,0,0,0,template syl,!retime("start2syl",-500+syl.i*130,0)!{\org(!$scenter-16!,!$smiddle+16!)\frz60\1a&HFF&\2a&HFF&\move(!$scenter+25!,!$smiddle-25!,$scenter,$smiddle,100,400)\an5\blur3\fad(200,0)\t(100,400,\frz0)}
Comment: 0,0:00:00.00,0:00:00.00,kuma_jp,,0,0,0,template syl,!retime("syl")!{\an5\pos($center,$middle)\1a&FF&\2a&FF&\bord2\blur5}
Comment: 0,0:00:00.00,0:00:00.00,kuma_jp,,0,0,0,template syl,!retime("syl")!{\an5\move($center,!$middle-13!,$center,$middle)\bord0\fscx0\blur5\t(0,$dur,\fscx100)\t(0,!$dur/2.5!,\blur0)}
Comment: 0,0:00:00.00,0:00:00.00,kuma_jp,,0,0,0,template syl,!retime("syl2end",0,200+syl.i*30)!{\blur3\move($x,$y,$x,!$y+20!,!line.duration-300!,!line.duration!)\pos($scenter,$smiddle)\t(!line.duration-300!,!line.duration!,\alpha&HFF&\fry200\frz-130\frx60)}
Comment: 0,0:00:00.00,0:00:00.00,shiori_cn,,0,0,0,template line,!retime("line",0,70)!{\blur2\alpha&H00&\clip(!$left-170!,0,!$left-170!,1080)\move($x,$y,$x,!$y+20!,!line.duration-300!,!line.duration!)\t(0,750,0.23,\clip(!$left-1!,0,!$right+1!,1080))\t(750,751,\clip(0,0,1920,1080))\t(!line.duration-350!,!line.duration-250!,\bord0)\t(!line.duration-300!,!line.duration!,\fsp18\blur9)\fad(0,130)}
Comment: 0,0:00:00.00,0:00:00.00,shiori_jp,,0,0,0,template syl,!retime("start2syl",-500+syl.i*130,0)!{\org(!$scenter-16!,!$smiddle+16!)\frz60\1a&HFF&\2a&HFF&\move(!$scenter+25!,!$smiddle-25!,$scenter,$smiddle,100,400)\an5\blur3\fad(200,0)\t(100,400,\frz0)}
Comment: 0,0:00:00.00,0:00:00.00,shiori_jp,,0,0,0,template syl,!retime("syl")!{\an5\pos($center,$middle)\1a&FF&\2a&FF&\bord2\blur5}
Comment: 0,0:00:00.00,0:00:00.00,shiori_jp,,0,0,0,template syl,!retime("syl")!{\an5\move($center,!$middle-13!,$center,$middle)\bord0\fscx0\blur5\t(0,$dur,\fscx100)\t(0,!$dur/2.5!,\blur0)}
Comment: 0,0:00:00.00,0:00:00.00,shiori_jp,,0,0,0,template syl,!retime("syl2end",0,200+syl.i*30)!{\blur3\move($x,$y,$x,!$y+20!,!line.duration-300!,!line.duration!)\pos($scenter,$smiddle)\t(!line.duration-300!,!line.duration!,\alpha&HFF&\fry200\frz-130\frx60)}
Comment: 0,0:00:00.00,0:00:00.00,yui_cn,,0,0,0,template line,!retime("line",0,70)!{\blur2\alpha&H00&\clip(!$left-170!,0,!$left-170!,1080)\move($x,$y,$x,!$y+20!,!line.duration-300!,!line.duration!)\t(0,750,0.23,\clip(!$left-1!,0,!$right+1!,1080))\t(750,751,\clip(0,0,1920,1080))\t(!line.duration-350!,!line.duration-250!,\bord0)\t(!line.duration-300!,!line.duration!,\fsp18\blur9)\fad(0,130)}
Comment: 0,0:00:00.00,0:00:00.00,yui_jp,,0,0,0,template syl,!retime("start2syl",-500+syl.i*130,0)!{\org(!$scenter-16!,!$smiddle+16!)\frz60\1a&HFF&\2a&HFF&\move(!$scenter+25!,!$smiddle-25!,$scenter,$smiddle,100,400)\an5\blur3\fad(200,0)\t(100,400,\frz0)}
Comment: 0,0:00:00.00,0:00:00.00,yui_jp,,0,0,0,template syl,!retime("syl")!{\an5\pos($center,$middle)\1a&FF&\2a&FF&\bord2\blur5}
Comment: 0,0:00:00.00,0:00:00.00,yui_jp,,0,0,0,template syl,!retime("syl")!{\an5\move($center,!$middle-13!,$center,$middle)\bord0\fscx0\blur5\t(0,$dur,\fscx100)\t(0,!$dur/2.5!,\blur0)}
Comment: 0,0:00:00.00,0:00:00.00,yui_jp,,0,0,0,template syl,!retime("syl2end",0,200+syl.i*30)!{\blur3\move($x,$y,$x,!$y+20!,!line.duration-300!,!line.duration!)\pos($scenter,$smiddle)\t(!line.duration-300!,!line.duration!,\alpha&HFF&\fry200\frz-130\frx60)}
Comment: 0,0:00:00.00,0:00:00.00,minami_cn,,0,0,0,template line,!retime("line",0,70)!{\blur2\alpha&H00&\clip(!$left-170!,0,!$left-170!,1080)\move($x,$y,$x,!$y+20!,!line.duration-300!,!line.duration!)\t(0,750,0.23,\clip(!$left-1!,0,!$right+1!,1080))\t(750,751,\clip(0,0,1920,1080))\t(!line.duration-350!,!line.duration-250!,\bord0)\t(!line.duration-300!,!line.duration!,\fsp18\blur9)\fad(0,130)}
Comment: 0,0:00:00.00,0:00:00.00,minami_jp,,0,0,0,template syl,!retime("start2syl",-500+syl.i*130,0)!{\org(!$scenter-16!,!$smiddle+16!)\frz60\1a&HFF&\2a&HFF&\move(!$scenter+25!,!$smiddle-25!,$scenter,$smiddle,100,400)\an5\blur3\fad(200,0)\t(100,400,\frz0)}
Comment: 0,0:00:00.00,0:00:00.00,minami_jp,,0,0,0,template syl,!retime("syl")!{\an5\pos($center,$middle)\1a&FF&\2a&FF&\bord2\blur5}
Comment: 0,0:00:00.00,0:00:00.00,minami_jp,,0,0,0,template syl,!retime("syl")!{\an5\move($center,!$middle-13!,$center,$middle)\bord0\fscx0\blur5\t(0,$dur,\fscx100)\t(0,!$dur/2.5!,\blur0)}
Comment: 0,0:00:00.00,0:00:00.00,minami_jp,,0,0,0,template syl,!retime("syl2end",0,200+syl.i*30)!{\blur3\move($x,$y,$x,!$y+20!,!line.duration-300!,!line.duration!)\pos($scenter,$smiddle)\t(!line.duration-300!,!line.duration!,\alpha&HFF&\fry200\frz-130\frx60)}
Comment: 10,0:00:00.00,0:00:00.00,chorus_cn,,0,0,0,template line,!retime("line",0,70)!{\blur2\alpha&H00&\clip(!$left-170!,0,!$left-170!,1080)\move($x,$y,$x,!$y+20!,!line.duration-300!,!line.duration!)\t(0,750,0.23,\clip(!$left-1!,0,!$right+1!,1080))\t(750,751,\clip(0,0,1920,1080))\t(!line.duration-350!,!line.duration-250!,\bord0)\t(!line.duration-300!,!line.duration!,\fsp18\blur9)\fad(0,130)}
Comment: 15,0:00:00.00,0:00:00.00,chorus_jp,,0,0,0,template syl,!retime("start2syl",-700+syl.i*60,0)!{\fry-60\1a&HFF&\2a&HFF&\move(!$scenter+300!,!$smiddle-50!,$scenter,$smiddle,0,800)\an5\blur3\3a&HFF&\t(0,600,\3a&H00&\t(600,800,\fry0))}
Comment: 15,0:00:00.00,0:00:00.00,chorus_jp,,0,0,0,template syl,!retime("syl")!{\an5\pos($center,$middle)\blur5\t(0,!$dur/2!,\fscx118\fscy118\3c&HFFFFFF&)\N\t(!$dur/2!,$dur,\fscx100\fscy100\3c&HE54FFE&)}
Comment: 15,0:00:00.00,0:00:00.00,chorus_jp,,0,0,0,template syl,!retime("syl2end",0,200+syl.i*30)!{\blur3\move($x,$y,$x,!$y+20!,!line.duration-300!,!line.duration!)\pos($scenter,$smiddle)\t(!line.duration-300!,!line.duration!,\alpha&HFF&\fry200\frz-130\frx60)}
Comment: 0,0:00:00.00,0:00:03.00,Default,,0,0,0,,{\fs48}{\c&HE54FFE&}HAL{\c&H45FCFF&}HI-ME{\c&HFFF575&}ROna{\c&HD4FF77&}100Ka
Dialogue: 0,0:00:06.05,0:00:12.05,Default,,0,0,0,,{\blur2\fad(500,500)}{\fs42}SAKURA{\fs32}\N作詞：SATSUKI-UPDATE\N作曲：伊藤賢\N編曲：伊藤賢\N歌：WITCH NUMBER 4\N[春日部ハル（cv：篠田みなみ）\N角森ロナ（cv：加隈亜衣）\N野々原ヒメ（cv：中島唯）\N芹沢モモカ（cv：井澤詩織）]\N訳：24th_garden
Comment: 0,0:00:16.50,0:00:19.97,minami_cn,,0,0,0,karaoke,就这样迎来了终结
Comment: 0,0:00:16.50,0:00:19.97,minami_jp,,0,0,0,karaoke,{\k40}そ{\k48}し{\k41}て{\k33}終{\k56}わ{\k12}って{\k28}し{\k42}ま{\k32}った{\k15}の
Comment: 0,0:00:20.01,0:00:23.47,minami_cn,,0,0,0,karaoke,这个樱花漫舞的夜晚
Comment: 0,0:00:20.01,0:00:23.47,minami_jp,,0,0,0,karaoke,{\k80}夢{\k50}見{\k65}草{\k32}舞{\k16}う{\k103}夜
Comment: 0,0:00:23.47,0:00:29.39,minami_cn,,0,0,0,karaoke,结尾的场景如此虚幻 如此渺小
Comment: 0,0:00:23.47,0:00:29.39,minami_jp,,0,0,0,karaoke,{\k45}と{\k47}て{\k40}も{\k65}小{\k23}さ{\k22}く{\k88}儚{\k20}い{\k44}エ{\k26}ン{\k41}ディ{\k46}ン{\k85}グ
Comment: 0,0:00:30.45,0:00:33.87,yui_cn,,0,0,0,karaoke,宛如静止一般的光景
Comment: 0,0:00:30.45,0:00:33.87,yui_jp,,0,0,0,karaoke,{\k84}時{\k47}が{\k26}止{\k60}ま{\k12}って{\k33}し{\k43}ま{\k22}った{\k15}の
Comment: 0,0:00:33.87,0:00:37.22,yui_cn,,0,0,0,karaoke,烙印在眼瞳深处
Comment: 0,0:00:33.87,0:00:37.22,yui_jp,,0,0,0,karaoke,{\k50}ま{\k44}ぶ{\k44}た{\k20}焼{\k39}き{\k22}付{\k27}い{\k23}て{\k66}る
Comment: 0,0:00:37.22,0:00:43.09,yui_cn,,0,0,0,karaoke,闭上双眼 想将它永远铭记心底
Comment: 0,0:00:37.22,0:00:43.09,yui_jp,,0,0,0,karaoke,{\k105}誰{\k42}に{\k24}も{\k43}解{\k25}け{\k24}な{\k20}い{\k39}よ{\k22}う{\k24}に{\k45}目{\k21}を{\k38}閉{\k46}じ{\k69}る
Comment: 0,0:00:43.49,0:00:46.77,kuma&shiori_cn,,0,0,0,karaoke,即使这笑容
Comment: 0,0:00:43.49,0:00:46.77,kuma&shiori_jp,,0,0,0,karaoke,{\k43}届{\k24}か{\k45}な{\k39}い{\k41}微{\k28}笑{\k24}み{\k84}を
Comment: 0,0:00:46.98,0:00:50.26,kuma&shiori_cn,,0,0,0,karaoke,被遗弃到记忆的边角
Comment: 0,0:00:46.98,0:00:50.26,kuma&shiori_jp,,0,0,0,karaoke,{\k46}忘{\k20}れ{\k27}そ{\k41}う{\k20}に{\k43}な{\k45}って{\k86}も
Comment: 0,0:00:50.44,0:00:52.80,kuma&shiori_cn,,0,0,0,karaoke,即使我
Comment: 0,0:00:50.44,0:00:52.80,kuma&shiori_jp,,0,0,0,karaoke,{\k22}た{\k22}と{\k25}え{\k79}ば{\k23}わ{\k18}た{\k32}し{\k15}が
Comment: 0,0:00:52.84,0:00:58.14,kuma&shiori_cn,,0,0,0,karaoke,曾经是你的那个“她”
Comment: 0,0:00:52.84,0:00:58.14,kuma&shiori_jp,,0,0,0,karaoke,{\k48}あ{\k41}の{\k43}娘{\k61}だ{\k36}った{\k22}と{\k54}し{\k44}て{\k181}も
Comment: 0,0:00:58.96,0:01:02.08,chorus_cn,,0,0,0,karaoke,初恋之梦四下飞舞
Comment: 0,0:00:58.96,0:01:02.08,chorus_jp,,0,0,0,karaoke,{\k23}舞{\k20}い{\k22}上{\k23}が{\k19}る{\k66}恋{\k40}の{\k99}夢
Comment: 0,0:01:02.39,0:01:05.69,chorus_cn,,0,0,0,karaoke,甜美而又易碎
Comment: 0,0:01:02.39,0:01:05.69,chorus_jp,,0,0,0,karaoke,{\k40}甘{\k28}く{\k49}柔{\k35}い{\k25}だ{\k43}け{\k28}か{\k56}し{\k26}ら
Comment: 0,0:01:05.92,0:01:09.06,chorus_cn,,0,0,0,karaoke,不断地思念着你
Comment: 0,0:01:05.92,0:01:09.06,chorus_jp,,0,0,0,karaoke,{\k21}こ{\k22}の{\k22}ま{\k20}ま{\k38}想{\k23}い{\k69}続{\k43}け{\k56}て
Comment: 0,0:01:09.34,0:01:12.66,chorus_cn,,0,0,0,karaoke,心中感情翻涌 眼里泪水流转
Comment: 0,0:01:09.34,0:01:12.66,chorus_jp,,0,0,0,karaoke,{\k23}ナ{\k23}キ{\k23}タ{\k23}ク{\k38}ナ{\k24}ッテ{\k3} {\k38}ナ{\k21}キ{\k27}タ{\k24}ク{\k38}ナ{\k27}ッテ
Comment: 0,0:01:12.86,0:01:16.02,chorus_cn,,0,0,0,karaoke,锁上了我的内心
Comment: 0,0:01:12.86,0:01:16.02,chorus_jp,,0,0,0,karaoke,{\k67}心{\k21}に{\k63}鍵{\k22}を{\k42}か{\k43}け{\k58}た
Comment: 0,0:01:16.31,0:01:19.58,chorus_cn,,0,0,0,karaoke,初恋化作落樱
Comment: 0,0:01:16.31,0:01:19.58,chorus_jp,,0,0,0,karaoke,{\k45}初{\k43}恋{\k14}は{\k116}SAKURA{\k40}に{\k47}な{\k22}る
Comment: 0,0:01:19.77,0:01:22.92,chorus_cn,,0,0,0,karaoke,而它仍然在绽放
Comment: 0,0:01:19.77,0:01:22.92,chorus_jp,,0,0,0,karaoke,{\k25}そ{\k25}れ{\k20}で{\k15}も{\k29}咲{\k39}き{\k70}続{\k45}け{\k47}て
Comment: 0,0:01:23.30,0:01:29.39,chorus_cn,,0,0,0,karaoke,伴我迈向成熟 渐渐将你淡忘
Comment: 0,0:01:23.30,0:01:29.39,chorus_jp,,0,0,0,karaoke,{\b1200}{\k65}大人{\k21}に{\k40}な{\k25}って{\k23} {\k18}あ{\k24}な{\k23}た{\k22}を{\k87}忘{\k41}れ{\k45}て{\k175}く
Comment: 0,0:01:41.74,0:01:45.16,shiori_cn,,0,0,0,karaoke,街道人海涌动
Comment: 0,0:01:41.74,0:01:45.16,shiori_jp,,0,0,0,karaoke,{\k90}街{\k37}を{\k25}行{\k46}き{\k20}交{\k15}う{\k73}人{\k36}波
Comment: 0,0:01:45.16,0:01:48.32,shiori_cn,,0,0,0,karaoke,让我不愿久留
Comment: 0,0:01:45.16,0:01:48.32,shiori_jp,,0,0,0,karaoke,{\k93}早{\k37}く{\k27}ま{\k48}ぎ{\k21}れ{\k21}た{\k24}く{\k45}て
Comment: 0,0:01:48.70,0:01:54.44,shiori_cn,,0,0,0,karaoke,脚上穿的 是去年春天的高跟鞋
Comment: 0,0:01:48.70,0:01:54.44,shiori_jp,,0,0,0,karaoke,{\k45}去{\k88}年{\k20}の{\k64}春{\k22}に{\k56}試{\k34}し{\k23}た{\k38}ハ{\k22}イ{\k47}ヒ{\k44}ー{\k71}ル
Comment: 0,0:01:54.77,0:01:57.85,yui&kuma_cn,,0,0,0,karaoke,即使那秒针
Comment: 0,0:01:54.77,0:01:57.85,yui&kuma_jp,,0,0,0,karaoke,{\k46}動{\k24}か{\k57}な{\k27}い{\k34}秒{\k56}針{\k64}が
Comment: 0,0:01:58.26,0:02:01.54,yui&kuma_cn,,0,0,0,karaoke,已坏到无法走动
Comment: 0,0:01:58.26,0:02:01.54,yui&kuma_jp,,0,0,0,karaoke,{\k45}壊{\k14}れ{\k34}そ{\k44}う{\k20}に{\k42}な{\k44}って{\k85}も
Comment: 0,0:02:01.77,0:02:02.94,yui&kuma_cn,,0,0,0,karaoke,那也无妨
Comment: 0,0:02:01.77,0:02:02.94,yui&kuma_jp,,0,0,0,karaoke,{\k21}か{\k22}ま{\k23}わ{\k24}な{\k27}い
Comment: 0,0:02:03.29,0:02:09.53,yui&kuma_cn,,0,0,0,karaoke,哪怕这愿望染上污秽
Comment: 0,0:02:03.29,0:02:09.53,yui&kuma_jp,,0,0,0,karaoke,{\k24}こ{\k22}の{\k42}願{\k42}い{\k46}が{\k108}穢{\k40}れ{\k29}て{\k40}い{\k43}て{\k188}も
Comment: 0,0:02:10.24,0:02:13.48,chorus_cn,,0,0,0,karaoke,初恋之梦就此散落
Comment: 0,0:02:10.24,0:02:13.48,chorus_jp,,0,0,0,karaoke,{\k22}舞{\k19}い{\k18}落{\k32}ち{\k19}る{\k66}恋{\k37}の{\k111}夢
Comment: 0,0:02:13.74,0:02:16.93,chorus_cn,,0,0,0,karaoke,在它淡淡褪去之后
Comment: 0,0:02:13.74,0:02:16.93,chorus_jp,,0,0,0,karaoke,{\k35}淡{\k26}く{\k26}途{\k21}切{\k43}れ{\k27}た{\k83}後{\k36}に{\k22}は
Comment: 0,0:02:17.19,0:02:20.46,chorus_cn,,0,0,0,karaoke,唯有理不清的思念
Comment: 0,0:02:17.19,0:02:20.46,chorus_jp,,0,0,0,karaoke,{\k18}断{\k24}ち{\k25}切{\k23}れ{\k17}ぬ{\k67}想{\k41}い{\k43}だ{\k69}け
Comment: 0,0:02:20.67,0:02:23.92,chorus_cn,,0,0,0,karaoke,不断地翻腾 不断地叩击内心
Comment: 0,0:02:20.67,0:02:23.92,chorus_jp,,0,0,0,karaoke,{\k23}ハ{\k18}ゲ{\k27}シ{\k22}ク{\k23}ナ{\k38}ッテ{\k23} {\k20}ハ{\k22}ゲ{\k26}シ{\k20}ク{\k40}ナ{\k23}ッテ
Comment: 0,0:02:24.17,0:02:27.36,chorus_cn,,0,0,0,karaoke,未言而终的话语
Comment: 0,0:02:24.17,0:02:27.36,chorus_jp,,0,0,0,karaoke,{\k18}言{\k19}え{\k31}ず{\k19}に{\k21}か{\k40}き{\k13}消{\k56}さ{\k41}れ{\k61}た
Comment: 0,0:02:27.61,0:02:30.88,chorus_cn,,0,0,0,karaoke,就此化作心中伤痕
Comment: 0,0:02:27.61,0:02:30.88,chorus_jp,,0,0,0,karaoke,{\k45}言{\k23}葉{\k15}が{\k72}傷{\k63}跡{\k44}に{\k45}な{\k20}る
Comment: 0,0:02:31.02,0:02:34.31,chorus_cn,,0,0,0,karaoke,而我仍在追问着
Comment: 0,0:02:31.02,0:02:34.31,chorus_jp,,0,0,0,karaoke,{\k28}そ{\k26}れ{\k20}で{\k14}も{\k31}問{\k40}い{\k65}続{\k45}け{\k60}て
Comment: 0,0:02:34.52,0:02:40.35,chorus_cn,,0,0,0,karaoke,惟有道别的话语 被铭刻在心底
Comment: 0,0:02:34.52,0:02:40.35,chorus_jp,,0,0,0,karaoke,{\k23}さ{\k20}よ{\k30}な{\k22}ら{\k40}だ{\k26}け{\k21} {\k64}心{\k18}に{\k91}刻{\k42}ん{\k47}で{\k139}る
Comment: 0,0:02:40.66,0:02:43.77,kuma_cn,,0,0,0,karaoke,那条林荫路
Comment: 0,0:02:40.66,0:02:43.77,kuma_jp,,0,0,0,karaoke,{\k24}あ{\k23}の{\k82}並{\k47}木{\k135}道
Comment: 0,0:02:44.12,0:02:48.78,kuma_cn,,0,0,0,karaoke,今年又一次被染上色彩
Comment: 0,0:02:44.12,0:02:48.78,kuma_jp,,0,0,0,karaoke,{\k24}今{\k70}年{\k38}も{\k103}色{\k27}づ{\k47}き{\k38}は{\k60}じ{\k30}め{\k29}る
Comment: 0,0:02:48.92,0:02:54.00,all_cn,,0,0,0,karaoke,连花开之时也无从选择
Comment: 0,0:02:48.92,0:02:54.00,all_jp,,0,0,0,karaoke,{\k33}花{\k62}咲{\k12}く{\k37}刻{\k29}さ{\k24}え{\k23}も{\k87}選{\k36}べ{\k51}ず{\k114}に
Comment: 0,0:02:54.59,0:02:57.39,kuma&shiori_cn,,0,0,0,karaoke,即使是幻影也无妨
Comment: 0,0:02:54.59,0:02:57.39,kuma&shiori_jp,,0,0,0,karaoke,{\k87}幻{\k20}の{\k22}ま{\k23}ま{\k23}で{\k23}い{\k24}い{\k58}の
Comment: 0,0:02:58.04,0:03:01.00,kuma&shiori_cn,,0,0,0,karaoke,望着穿过手掌的影子
Comment: 0,0:02:58.04,0:03:01.00,kuma&shiori_jp,,0,0,0,karaoke,{\k20}手{\k21}の{\k25}ひ{\k16}ら{\k31}す{\k22}り{\k20}抜{\k23}け{\k43}る{\k75}影
Comment: 0,0:03:01.05,0:03:05.01,kuma&shiori_cn,,0,0,0,karaoke,找寻着一个人
Comment: 0,0:03:01.05,0:03:05.01,kuma&shiori_jp,,0,0,0,karaoke,{\k41}探{\k73}し{\k24}て{\k44}る{\k22}ひ{\k22}と{\k170}り
Comment: 0,0:03:05.90,0:03:09.10,yui_cn,,0,0,0,karaoke,曾在梦中相遇的初恋
Comment: 0,0:03:05.90,0:03:09.10,yui_jp,,0,0,0,karaoke,{\k21}い{\k23}つ{\k23}か{\k22}見{\k20}た{\k66}恋{\k34}の{\k111}夢
Comment: 0,0:03:09.37,0:03:12.70,shiori_cn,,0,0,0,karaoke,在那天几乎将我挫败
Comment: 0,0:03:09.37,0:03:12.70,shiori_jp,,0,0,0,karaoke,{\k19}あ{\k15}の{\k34}日{\k21}に{\k19}負{\k34}け{\k36}そ{\k41}う{\k44}に{\k41}な{\k29}る
Comment: 0,0:03:12.85,0:03:15.97,kuma_cn,,0,0,0,karaoke,但我再次懂得了相恋
Comment: 0,0:03:12.85,0:03:15.97,kuma_jp,,0,0,0,karaoke,{\k19}だ{\k27}け{\k20}ど{\k22}ま{\k21}た{\k65}恋{\k26}を{\k58}知{\k54}って
Comment: 0,0:03:16.32,0:03:19.62,minami_cn,,0,0,0,karaoke,它化作花蕾 植根心底
Comment: 0,0:03:16.32,0:03:19.62,minami_jp,,0,0,0,karaoke,{\k23}ツ{\k23}ボ{\k23}ミ{\k23}ニ{\k39}ナ{\k25}ッテ{\k20} {\k23}ツ{\k22}ボ{\k22}ミ{\k21}ニ{\k39}ナ{\k27}ッテ
Comment: 0,0:03:19.83,0:03:22.95,chorus_cn,,0,0,0,karaoke,初恋之梦四下飞舞
Comment: 0,0:03:19.83,0:03:22.95,chorus_jp,,0,0,0,karaoke,{\k24}舞{\k18}い{\k20}上{\k26}が{\k19}る{\k67}恋{\k37}の{\k101}夢
Comment: 0,0:03:23.30,0:03:26.58,chorus_cn,,0,0,0,karaoke,甜美而又易碎
Comment: 0,0:03:23.30,0:03:26.58,chorus_jp,,0,0,0,karaoke,{\k41}甘{\k20}く{\k48}柔{\k41}い{\k23}だ{\k39}け{\k29}か{\k62}し{\k25}ら
Comment: 0,0:03:26.78,0:03:29.94,chorus_cn,,0,0,0,karaoke,不断地思念着你
Comment: 0,0:03:26.78,0:03:29.94,chorus_jp,,0,0,0,karaoke,{\k19}こ{\k24}の{\k20}ま{\k22}ま{\k49}想{\k13}い{\k68}続{\k37}け{\k64}て
Comment: 0,0:03:30.24,0:03:33.47,chorus_cn,,0,0,0,karaoke,心中感情翻涌　眼里泪水流转
Comment: 0,0:03:30.24,0:03:33.47,chorus_jp,,0,0,0,karaoke,{\k20}ナ{\k22}キ{\k25}タ{\k21}ク{\k39}ナ{\k28}ッテ{\k20} {\k20}ナ{\k22}キ{\k22}タ{\k24}ク{\k38}ナ{\k22}ッテ
Comment: 0,0:03:33.74,0:03:37.00,chorus_cn,,0,0,0,karaoke,锁上了我的内心
Comment: 0,0:03:33.74,0:03:37.00,chorus_jp,,0,0,0,karaoke,{\k65}心{\k19}に{\k67}鍵{\k22}を{\k40}か{\k45}け{\k68}た
Comment: 0,0:03:37.00,0:03:40.39,chorus_cn,,0,0,0,karaoke,初恋化作落樱
Comment: 0,0:03:37.00,0:03:40.39,chorus_jp,,0,0,0,karaoke,{\k61}初{\k42}恋{\k16}は{\k117}SAKURA{\k42}に{\k42}な{\k19}る
Comment: 0,0:03:40.64,0:03:43.85,chorus_cn,,0,0,0,karaoke,而它仍然在绽放
Comment: 0,0:03:40.64,0:03:43.85,chorus_jp,,0,0,0,karaoke,{\k24}そ{\k25}れ{\k17}で{\k15}も{\k31}咲{\k41}き{\k67}続{\k47}け{\k54}て
Comment: 0,0:03:44.08,0:03:50.61,chorus_cn,,0,0,0,karaoke,伴我迈向成熟 渐渐将你淡忘
Comment: 0,0:03:44.08,0:03:50.61,chorus_jp,,0,0,0,karaoke,{\k73}大人{\k26}に{\k38}な{\k24}って{\k20} {\k22}あ{\k21}な{\k29}た{\k17}を{\k83}忘{\k43}れ{\k42}て{\k215}く
```

