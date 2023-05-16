---
layout: post
title:  "自制秘封噩梦日记一键瞬移脚本"
date:   2018-08-26 14:39:00
categories: 
tags: 
    - autohotkey
---

![怎么动不了？？](https://gitcode.net/message2011/tttp/-/raw/master/sina/872e2401ly1fun4m0t80yg20ft0bz7wk.gif)

众所周知th165秘封噩梦日记的瞬移操作十分反人类，需要松开方向键按两下shift。于是在两周前写了个脚本，脚本基于[autohotkey](https://autohotkey.com/)。
<!-- more -->
## 使用方法：

运行脚本，会在状态栏出现个图标。在游戏里按一下左Ctrl键即出现瞬移标志，再按方向键即可瞬移（如果按着低速必须松开才会进行瞬移操作）不用时右键图标退出。

## 下载：
### 直接运行版：

[https://pan.baidu.com/s/19O38_fevQdFXAp3j8EuX9g](https://pan.baidu.com/s/19O38_fevQdFXAp3j8EuX9g)

双击即可运行，以后有更新还是这个链接
### 代码：

```
#ifWinActive ahk_exe th165.exe  ;秘封噩梦日记窗口激活才可用
    *LCtrl::
    Loop {
        sleep 30
        GetKeyState, S, LShift
        if (S="U"){  ;shift抬起才继续
            Break
        }
    }
    sleep 20
    SendInput {Up Up}
    SendInput {Down Up}
    SendInput {Left Up}
    SendInput {Right Up}
    SendInput {LShift Down}
    sleep 35  ;如果不能触发瞬移，尝试将数值改大
    SendInput {LShift Up}
    Sleep 35  ;如果不能触发瞬移，尝试将数值改大
    SendInput {LShift Down}
    sleep 35  ;如果不能触发瞬移，尝试将数值改大
    Loop {
        GetKeyState, U, Up
        GetKeyState, D, Down
        GetKeyState, L, Left
        GetKeyState, R, Right
        B:=U = "D" OR D = "D" OR L = "D" OR R = "D"
        if (B=1){  ;瞬移完成后取消低速状态
            sleep 100
            SendInput {LShift Up}  
            Break
        }      
    }
```

需要下载安装[autohotkey](https://autohotkey.com/)程序，然后将代码粘进空的文本文档，保存后将扩展名修改为ahk，然后双击运行。

好处是可以根据自己的情况进行修改，如果懂一些的话。
## 注意事项：

以下把出现瞬移标志到完成瞬移这段时间叫**瞬移状态**，把按下左ctrl抬起左shift到出现瞬移标志这段时间叫**瞬移过程**。

- 瞬移过程中不能按shift还有方向键，因为这会打断游戏对瞬移的判断（你按两下shift之间也不能按方向键对吧），可以按射击键，不知道能不能按拍照键。（也没有人瞬移时拍照吧）

- 这个脚本控制shift按键的时间间隔可能对部分电脑来说太短，以至于游戏不能识别成两次按键，把代码中对应注释部分时间数值稍稍改大即可（单位为毫秒）。

- 有些人反应偶尔在瞬移状态下按方向键无法瞬移，具体表现为出现瞬移标志但按方向键不能动弹。这个是游戏本身问题，脚本是解决不了的（PS.我从来没出现过这个问题）

## FAQ：
***为什么要把瞬移放在左ctrl，而不是c键？***

因为东方游戏的输入问题。按c键是没有任何反应的，按功能键才能成功运行脚本，其他东方stg作也是如此。这个问题可以通过vp解决，不知道以后th16.5会不会有vp辅助。

***为什么要松开shift才能瞬移？***

因为按shift会打乱游戏对瞬移的判断，而禁用按键就比较难实现，索性就抬起shift才瞬移了。
