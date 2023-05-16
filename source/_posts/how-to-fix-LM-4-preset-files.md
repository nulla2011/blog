---
title: 如何修复LM-4 MarkII 的预设文件
date: 2021-02-20 13:11:07
tags: 
    - VST
    - Python
---

English version is [here](https://nulla2011.github.io/2021/02/24/how-to-fix-LM-4-preset-files-en/)

[Steinberg LM-4 MarkII](https://www.steinberg.net/en/support/unsupported_products/lm4.html) 是Steinberg 出品的一个鼓音源，在东方project的音乐里被频繁使用，目前早已停产。东方的音乐里用的是Processed Studio Kits，每个kit都附带一个以fxp为扩展名的预设文件。但是，在载入预设时却出现了致命bug：

![39143_cut.png](https://gitcode.net/message2011/tttp/-/raw/master/LM-4/39143_cut.png)

<!-- more -->

如图，无限弹出提示采样不存在的警告，然后插件崩溃。我用的fl studio版本是20.0.3。另外在reaper上也出现了同样的问题，但是在cakewalk上没有出现问题，插件能正常使用。（PS. 好像我以前用fl 12的时候并没有出现这个bug？）

虽然可以通过`import LM4/LM9 Script`来加载预设（见下图），但是还有个别的预设依然无法载入，本着刨根问底的精神，我决定一探究竟。

![39368_cut.png](https://gitcode.net/message2011/tttp/-/raw/master/LM-4/39368_cut.png)

# 初步修复

初步猜测是预设文件的问题，毕竟这是20年前的vst了，可能跟新版的fl有兼容问题。用16进制打开：

![Screenshot_2021-02-21_125145.png](https://gitcode.net/message2011/tttp/-/raw/master/LM-4/Screenshot_2021-02-21_125145.png)

前面可能是相对路径，后面是一个不存在的路径，总之两者都没发挥作用。于是写了个python脚本批量修改成绝对路径。完整脚本：

```python
# -*- coding: UTF-8 -*-
import re
import os
import sys

unknownBlock1 = b'\x00\x00\x05\x91\x00\x00\x10\x0C\x00\x00\x00\x00'  #0x91 or 0x93 ?
unknownBlock2 = bytes.fromhex(
    "000000003F80000000000001000000003F80000000000002000000003F8000000000000B0000000100000000000000000000000000000000"
)


def convertFxp(path):
    newFxpContent = b""
    fxpName = os.path.split(path)[1]
    fPath = os.path.split(path)[0]
    with open(path, 'rb') as fr:
        fxpContent = fr.read()
        pattern = re.compile(br'HaSm(.|\n)*?(\\[\w ]*\\[\w ]*\.aif)')
        pos = 0
        count = 0
        while 1:
            m = pattern.search(fxpContent[pos:])
            if m is None:
                newFxpContent += insertUnknownBlock2(fxpContent[pos:], b'Harp')
                break
            aNameWithParentDir = m.group(2).replace(b"\\", b"\\\\")
            repl = b'HaSm' + unknownBlock1 + bytes(
                doubleBackslash(fPath), 'utf-8') + aNameWithParentDir
            block = re.sub(pattern,
                           repl,
                           fxpContent[pos:pos + m.end()],
                           count=1)
            if count > 0:
                if "Reso" in fxpName:  #Reso Kit preset has multiple samples in one pad
                    if findHaPa(block) is True:
                        block = insertUnknownBlock2(block, b'HaPa')
                    else:
                        block = insertUnknownBlock2(block, b'HaSm')
                else:
                    block = insertUnknownBlock2(block, b'HaPa')
            newFxpContent += block
            pos += m.end()
            count += 1
    with open(fxpName, 'wb') as fw:
        fw.write(newFxpContent)
        print("success!")


def insertUnknownBlock2(chunk, reg):
    pattern = re.compile(reg)
    m = pattern.search(chunk)
    if m is None:
        print("can't find insert position")
        return chunk
    else:
        return (chunk[:m.start()] + unknownBlock2 + chunk[m.start():])


def findHaPa(chunk):
    pattern = re.compile(b'HaPa')
    m = pattern.search(chunk)
    if m is None:
        return False
    else:
        return True


def doubleBackslash(str):
    str = str.replace("\\", "\\\\")
    str = str.replace("/", "\\\\")
    return str


if __name__ == "__main__":
    installPath = input(
        "Input your \"Processed Studio Kits\" folder path (ends with \"Processed Studio Kits\"):\nexample: C:\Program Files (x86)\Steinberg\Vstplugins\LM-4 MarkII\Processed Studio Kits\n"
    )
    assert os.path.isdir(installPath), "illegal path"
    if installPath.endswith("\\") or installPath.endswith("/"):
        installPath = installPath[:-1]
    try:
        fileList = os.listdir(installPath)
    except FileNotFoundError:
        print("file not found")
        sys.exit(0)
    fxpList = []
    for f in fileList:
        if f.lower().endswith(".fxp"):
            fxpList.append(f)
    if len(fxpList) == 0:
        print("can't find fxp files, please check directory")
        sys.exit(0)
    print(f"found {len(fxpList)} fxp files, processing...")
    for f in fxpList:
        print(f"converting {f} ...")
        convertFxp(installPath + "\\" + f)
        if f == fxpList[-1]:
            print("all finished, converted preset files are in current folder")

```

Github地址：https://github.com/nulla2011/fix-LM-4-MarkII/blob/master/fix_LM-4_fxp.py

![Screenshot_2021-02-21_130308.png](https://gitcode.net/message2011/tttp/-/raw/master/LM-4/Screenshot_2021-02-21_130308.png)

这样fl载入预设的时候就不会报错了。（cakewalk也不会报错，但是reaper却弹出了另一个报错提示：![39364.png](https://gitcode.net/message2011/tttp/-/raw/master/LM-4/39364.png)

实在不知道这个 `opaque data` 指的文件中的哪部分内容，希望有懂fxp的人能提供一些解决这个问题的思路。）

# Reso Kit

但是，`04 Reso Kit.fxp`这个预设文件在修改后依然出现了同样的问题。之前载入script方法唯一出现问题的也是它。到底问题出在哪呢？

## 发现问题

初步观察，这个文件比其他文件大了一倍，分块跟其他文件比对了一下，发现里面提到的采样文件比其他预设多出很多，再仔细观察，采样大概是4个一组。

![4samples.png](https://gitcode.net/message2011/tttp/-/raw/master/LM-4/4samples.png)

用一个后面修改后成功加载的图，这里每个pad有3-4个采样，根据不同力度加载不同的采样。

![Screenshot_2021-02-21_153057.png](https://gitcode.net/message2011/tttp/-/raw/master/LM-4/Screenshot_2021-02-21_153057.png)

可是跑一遍上面的脚本，所有的路径已经修改完了，怎么还是加载不了采样呢？我用二分法不断尝试，终于找到了出问题的地方。

![Screenshot_2021-02-21_141803.png](https://gitcode.net/message2011/tttp/-/raw/master/LM-4/Screenshot_2021-02-21_141803.png)

首先我怀疑可能是名字里有星号导致的，可是换了名字并没有解决问题。然后我注意到了这个pad只包含三个采样，剩下的采样`R106 Rides 7.aif`哪去了呢？找到文件打开，发现是个无声的文件。于是我想到会不会是给这个采样留位置了但是没有写进预设里。找到其他三个采样定义力度范围的那两个字节，发现是从0~127完美连接上的，那么就不是少加采样的问题。后来我注意到了这个字节：

![Screenshot_2021-02-21_143052.png](https://gitcode.net/message2011/tttp/-/raw/master/LM-4/Screenshot_2021-02-21_143052.png)

`0x04`是不是代表有4个采样呢？看了一下前面，这里都是`0x04`，看了一下别的预设，这里是`0x01`。尝试将其改成`0x03`，果然没有报错了：

![Screenshot_2021-02-21_150203.png](https://gitcode.net/message2011/tttp/-/raw/master/LM-4/Screenshot_2021-02-21_150203.png)

然而后面却空出来了三个位置，woodblock的音色却是ride。缺少的音色除了woodblock以外，还有clap和cowbells，在预设里根本搜不到clap和cowbells，这又是怎么回事呢？从图上可以看出crash是在倒数第4的位置，而它本应该在最后一个。ride在crash前面，名字却是woodblock，它的本来的位置很可能在crash本应在的位置的前一个。那么我们可以做出这样的推断：

> 原本clap和cowbells是夹在woodblock与ride之间的，但是由于未知原因，woodblock的采样定义到ride的名字之间的文件内容丢失了。定义woodblock的名字还有采样数量的块（见上上图）和定义ride的采样的块拼接到了一起，woodblock有4个采样，而ride有3个采样，这就导致了无法找到采样的报错。

## 手动修复

丢失的关键内容太多，要想修复只能靠脑补了。首先将没有问题的crash copy到最后；将woodblock copy一份到倒数第二的位置，改名成ride；给原先的woodblock替换并增加采样；再把两个空位填上cowbells和clap采样；最后参照其他的pad改一下每个采样的力度范围，对照[标准midi键盘对鼓的定义](https://www.midi.org/specifications-old/item/gm-level-1-sound-set)修改每个pad对应的键盘上的键，再改一些细节就可以了。

![Screenshot_2021-02-21_162740.png](https://gitcode.net/message2011/tttp/-/raw/master/LM-4/Screenshot_2021-02-21_162740.png)

可是我试了很久，都没法在改好的预设里使用相对路径，不得已只好再写个脚本让各位根据自己的路径生成预设文件了，脚本如下：

```python
# -*- coding: UTF-8 -*-
import re
import os
import sys
from urllib import request

fxpUrl = "https://gitee.com/millionlive/stepPic/raw/master/04_Reso_Kit_fix.fxp"
#fxpUrl= "https://cdn.jsdelivr.net/gh/nulla2011/fix-LM-4-MarkII/04_Reso_Kit_fix.fxp"
#fxpUrl= "https://raw.githubusercontent.com/nulla2011/fix-LM-4-MarkII/master/04_Reso_Kit_fix.fxp"

unknownBlock1 = b'\x00\x00\x05\x90\x00\x00\x10\x0C\x00\x00\x00\x00'  #0x91 or 0x93 or 0x90?


def getFxpFile(url):
    print("downloading file...")
    try:
        f = request.urlopen(url)
    except Exception:
        print('Network Error, you can try another fxpUrl')
        sys.exit(0)
    return f.read()


def replacePath(data, path):
    newContent = b""
    pattern = re.compile(
        br'HaSm(.|\n)*?E:\\Steinberg\\Vstplugins\\LM-4 MarkII\\Processed Studio Kits\\04 Reso Kit\\([\w ]*\.aif)'
    )
    pos = 0
    while 1:
        m = pattern.search(data[pos:])
        if m is None:
            newContent += data[pos:]
            break
        fName = m.group(2)
        repl = b'HaSm' + unknownBlock1 + bytes(path.replace(
            "\\", "\\\\"), 'utf-8') + b'\\\\04 Reso Kit\\\\' + fName
        newContent += re.sub(pattern, repl, data[pos:pos + m.end()], count=1)
        pos += m.end()
    return newContent


if __name__ == "__main__":
    installPath = input(
        "Input your \"Processed Studio Kits\" folder path (ends with \"Processed Studio Kits\"):\nexample: C:\Program Files (x86)\Steinberg\Vstplugins\LM-4 MarkII\Processed Studio Kits\n"
    )
    assert os.path.isdir(installPath), "illegal path"
    if installPath.endswith("\\") or installPath.endswith("/"):
        installPath = installPath[:-1]
    fxpData = getFxpFile(fxpUrl)
    print(f"converting to new fxp...")
    newFxpContent = replacePath(fxpData, installPath)
    with open(installPath + "\\04 Reso Kit_fix.fxp", 'wb') as fw:
        fw.write(newFxpContent)
    print(f"Success, the fixed preset file path is \"{installPath}\\04 Reso Kit_fix.fxp\"")

```

使用方法：输入`Processed Studio Kits`的完整目录，然后运行完脚本就会在目录里生成一个`04 Reso Kit_fix.fxp`的文件。

这个脚本我也放在了[上面提到的仓库](https://github.com/nulla2011/fix-LM-4-MarkII)里。生成的预设文件在FL Studio 20.0.3、REAPER 6.01、Cakewalk中都通过了测试。哦旧预设文件在Cakewalk里都能加载啊，那没事了。

![Screenshot_2021-02-21_163757.png](https://gitcode.net/message2011/tttp/-/raw/master/LM-4/Screenshot_2021-02-21_163757.png)

改好的预设仍有些遗憾之处，最不确定的几个地方是上图这三个pad的音量以及力度百分比，因为原文件内容的丢失永远也不知道设置的是什么值了。其他的基本没什么改动，照搬就是了。

# 总结

最后给出懒人版总结：运行第一个脚本，输入采样所在的文件夹（以`Processed Studio Kits`结尾），在**脚本的目录**下就会生成修改好的预设文件，但是`04 Reso Kit.fxp`这个文件还是不能用。运行第二个脚本，还是输入采样所在的文件夹，在**采样所在的目录**内就会生成修改后的Reso Kit预设。

![Screenshot_2021-02-24_215105.png](https://gitcode.net/message2011/tttp/-/raw/master/LM-4/Screenshot_2021-02-24_215105.png)

------

**20211205更新：**

应群友的要求，简单改了一下脚本。现在可以用[这个新脚本](https://github.com/nulla2011/fix-LM-4-MarkII/blob/master/fix_LM-4_disk1_fxp.py)来修复一部分LM4 disk1中的预设了。