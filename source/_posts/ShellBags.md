---
title: 如何关闭windows资源管理器详细信息的各列的自动切换
date: 2020-07-16 14:25:26
tags: 
  - 文件管理
---

做音MAD时习惯性的会把使用到的素材归档，音频放一个文件夹视频放一个文件夹。我的音频素材归档文件夹画风是这样的：

![](https://b.bdstatic.com/comment/M8qbLULbBRwSkC8Rwi_qHw85bb47fdd18cca330c631c5efc4fbf74.png)



<!-- more -->

大片空白，同时文件名也显示不全。自己剪的音频当然是标题艺术家专辑都不存在的，可是windows一看你这个文件夹大部分都是音频就把默认的修改日期类型大小这三列都关掉，取而代之的是图上的这4列。经过测试，只要一个文件夹里一半以上的项目（包括文件夹）是音频，详细信息就会被转成上图那样，而且不可逆，除非手动去上面的栏重新设置。

我为什么不喜欢这4列？首先我电脑里音频素材比歌曲要多很多，音频素材的歌曲信息都是空白，归档文件夹视图被资源管理器自动转换后都是一片空白，同时文件名一列过窄，过长的文件名会被省略，既难看又影响效率；其次就算是有信息的歌曲文件，资源管理器获取信息需要挨个读取歌曲的元数据，如果是放有很多歌曲的文件夹打开的时候会卡住。检索归类歌曲信息这件事还是交给foobar之类的专业软件比较好。

------

接下来说说这个困扰我好几年的问题是怎么解决的。首先我上网搜索了一番才知道这个叫ShellBags，是存在注册表里的`HKEY_CURRENT_USER\Software\Classes\Local Settings\Software\Microsoft\Windows\Shell\Bags`和`HKEY_CURRENT_USER\Software\Classes\Local Settings\Software\Microsoft\Windows\Shell\BagMRU`这两个键（MRU=Most Recently Used），就算是已经删除的文件夹的ShellBags也会被保存在注册表里。在`HKEY_CURRENT_USER\Software\Classes\Local Settings\Software\Microsoft\Windows\Shell\Bags`这个键里面找到AllFolders子键，然后在AllFolders里找到Shell子键，在Shell里新建一个字符串值并重命名为FolderType，双击之将数值数据改为NotSpecified，如图：

![](https://b.bdstatic.com/comment/M8qbLULbBRwSkC8Rwi_qHw01db459f53bdf0c9244c0cfa02431474.png)

这样所有文件夹，只要你没有改设置，就都是这样四列的详细信息视图了。

![](https://b.bdstatic.com/comment/M8qbLULbBRwSkC8Rwi_qHwde368913f13681c0deaad7c4dd849939.png)

我这总结了个懒人版，将代码保存成reg再双击导入就行了。

```
[HKEY_CURRENT_USER\Software\Classes\Local Settings\Software\Microsoft\Windows\Shell\Bags\AllFolders\Shell]
"FolderType"="NotSpecified"
```

***注意：修改注册表有风险，记得提前备份***

*补充：好像只有win10会这样，win7默认都是图标平铺？*



