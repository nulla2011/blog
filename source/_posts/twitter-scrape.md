---
title: 简单记录一下我爬取推文的过程
date: 2020-01-11 22:38:48
tags: 
    - twitter
    - Python
    - 声优
---

日本时间2020年新年，夹在众多声优的[结](https://twitter.com/jullie_egg/status/1211665129890140160)[婚](https://twitter.com/reimatsuzaki/status/1211844474088771584)[ご](https://ameblo.jp/clown-happy/entry-12563615812.html)[報](https://ameblo.jp/yh---blog/entry-12563720617.html)[告](https://twitter.com/nojomiy/status/1212222134203777024)之间，白石晴香的ご報告就显得那么的，不和谐？但是，在当天三个声优宣布结婚，转天两个（而且还都是爱马仕声优）的情况下，看到她的ご報告还是会惊一下，然后再仔细一看，哦人事变动啊。

白石晴香的ご報告如下：

![](https://gitcode.net/message2011/tttp/-/raw/master/shiraishi/t01d00967ea5e56c8e8.png)

[原地址点我](https://twitter.com/shiraharu48/status/1212027679785938948)

从原来的事务所ヒラタオフィス离开，变成free了。她之前的推特账号看样子是staff也参与管理，而且第一条就写着期间限定推特（难道预示了什么）。于是之前的推特号要在一周后销号。

可是问题来了，我一没看过小埋，二没看过Anne Happy，对她还不太了解，这可咋办？先想办法把她推文全爬下来吧。

<!-- more -->

## 在twitter开发者平台创建app

爬取推文的话，轮子还不少。但首先你得去twitter开发者平台（[https://developer.twitter.com/en/apps](https://developer.twitter.com/en/apps)） 申请个app，申请方法我就不说了，网上有。但是听说不好申请，我不知道怎么回事立刻就申请成功了。现在回想起来，没有app就无法完成后续的工作，能马上申请到app真是万幸。

## twarc的使用

twarc，地址：[https://github.com/DocNow/twarc/](https://github.com/DocNow/twarc/) 是我首先找到的一个能够爬取推文的项目。使用方法也很简单，按照readme中所说，timeline参数即能获取一个账号时间线上的推文，而且包含转推。但是，之前别人抓取推文就说过，twitter api中的get statuses/user_timeline对数量有限制，只能获取3200条（[https://developer.twitter.com/en/docs/tweets/timelines/api-reference/get-statuses-user_timeline](https://developer.twitter.com/en/docs/tweets/timelines/api-reference/get-statuses-user_timeline)） 。twarc里也写到了因为用的是官方api所以只能获取3200条，白石晴香的发推数根据返回的数据显示是4242条。剩下的就得想其他办法了

## 爬取其余推文

之后又找了一个[使用其他方法爬取推文的项目](https://github.com/bpb27/twitter_scraping) 和[改进版](https://github.com/himan94/Extraction-of-multiple-tweets-greater-than-3200--from-twitter) 发现是使用的[webdriver](https://chromedriver.chromium.org/) 驱动浏览器显示推文并爬取的。试用了一下发现几个问题：

1. 白石晴香的推文此时已被保护，只有登录上自己的号才能爬取她的推文内容。解决方法是加上在抓取之前让webdriver控制浏览器输入账号密码并登录的代码。
2. 登录后显示的是新版推特UI，无法抓取。目前想到的方法只有安装goodtwitter插件（[https://chrome.google.com/webstore/detail/goodtwitter/jbanhionoclikdjnjlcmefiofgjimgca](https://chrome.google.com/webstore/detail/goodtwitter/jbanhionoclikdjnjlcmefiofgjimgca)）。在开始抓取之前装上即可返回原来的ui并成功抓取。

抓取的只是推文id，还需要根据id抓取内容，这时我又想到了前面的twarc，赶紧导入。

最后的代码如下：（不会排版Jupyter Notebook我就把python代码分段粘了）

```python
# -*- coding: UTF-8 -*-
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.common.exceptions import NoSuchElementException, StaleElementReferenceException
from time import sleep
import json
import datetime


# edit these three variables
user = 'shiraishi_haruk'
start = datetime.datetime(2017, 1, 14)  # year, month, day
end = datetime.datetime(2017, 2, 3)  # year, month, day

# only edit these if you're having problems
delay = 3  # time to wait on each page load before reading the page
driver = webdriver.Chrome()  # options are Chrome() Firefox() Safari()


# don't mess with this stuff
twitter_ids_filename = 'all_ids.json'
days = (end - start).days + 1
id_selector = '.time a.tweet-timestamp'
tweet_selector = 'li.js-stream-item'
user = user.lower()
ids = []

def format_day(date):
    day = '0' + str(date.day) if len(str(date.day)) == 1 else str(date.day)
    month = '0' + str(date.month) if len(str(date.month)) == 1 else str(date.month)
    year = str(date.year)
    return '-'.join([year, month, day])

def form_url(since, until):
    p1 = 'https://twitter.com/search?f=tweets&vertical=default&q=from%3A'
    p2 =  user + '%20since%3A' + since + '%20until%3A' + until + 'include%3Aretweets&src=typd'
    return p1 + p2

def increment_day(date, i):
    return date + datetime.timedelta(days=i)


driver.get('https://twitter.com/search?f=tweets&vertical=default&q=from%3Ashiraishi_haruk%20since%3A2016-03-15%20until%3A2016-03-16include%3Aretweets&src=typd')
driver.find_element_by_name("session[username_or_email]").send_keys('youremail')
driver.find_element_by_name("session[password]").send_keys('yourpassword')
driver.find_element_by_class_name("submit").click()
sleep(30)
    
for day in range(days):
    d1 = format_day(increment_day(start, 0))
    d2 = format_day(increment_day(start, 1))
    url = form_url(d1, d2)
    print(url)
    print(d1)
    driver.get(url)
    
    sleep(delay)

    try:
        found_tweets = driver.find_elements_by_css_selector(tweet_selector)
        increment = 10

        while len(found_tweets) >= increment:
            print('scrolling down to load more tweets')
            driver.execute_script('window.scrollTo(0, document.body.scrollHeight);')
            sleep(delay)
            found_tweets = driver.find_elements_by_css_selector(tweet_selector)
            increment += 10

        print('{} tweets found, {} total'.format(len(found_tweets), len(ids)))

        for tweet in found_tweets:
            try:
                id = tweet.find_element_by_css_selector(id_selector).get_attribute('href').split('/')[-1]
                ids.append(id)
            except StaleElementReferenceException as e:
                print('lost element reference', tweet)

    except NoSuchElementException:
        print('no tweets on this day')

    start = increment_day(start, 1)


try:
    with open(twitter_ids_filename) as f:
        all_ids = ids + json.load(f)
        data_to_write = list(set(all_ids))
        print('tweets found on this scrape: ', len(ids))
        print('total tweet count: ', len(data_to_write))
except FileNotFoundError:
    with open(twitter_ids_filename, 'w') as f:
        all_ids = ids
        data_to_write = list(set(all_ids))
        print('tweets found on this scrape: ', len(ids))
        print('total tweet count: ', len(data_to_write))

with open(twitter_ids_filename, 'w') as outfile:
    json.dump(data_to_write, outfile)

print('all done here')
driver.close()
```

```python
tw = twarc.Twarc(CONSUMER_KEY, CONSUMER_SECRET, OAUTH_TOKEN, OAUTH_TOKEN_SECRET)
f=open("shiraishi_haruk_1701.json","w")
for id_no in ids:         # store the ids in this list
	try:
        tweet = tw.get('https://api.twitter.com/1.1/statuses/show/%s.json' % int(id_no))
        json.dump(tweet.json(),f)
    except Exception as e:
        print(e)
        time.sleep(60 * 15)
        continue
    except StopIteration:
        break
f.close()
```

中间省略了导入模块以及初始化各种key还有string的内容

![](https://gitcode.net/message2011/tttp/-/raw/master/shiraishi/t0145de27f6fc101ccd.png)

抓取成功

## 排序

等全部抓下来才发现顺序没排好，每天的发推排序都是时间倒序，而抓的时候是以天为单位时间正序抓到文件里的。于是上python排序，还挺好用

```python
import json
lines=[]
name='shiraishi_haruk_1604_l'
with open(name+'.json','r') as f:
	while True:
		line=f.readline()
		if not line: break
		line_json=json.loads(line)
		lines.append(line_json)

lines=sorted(lines,key=lambda k:k["id"],reverse=True)
with open(name+'_sorted.json','w') as fi:
	for item in lines:
		json.dump(item,fi)
		fi.write("\n")
```



## 下载图片及视频

扒图就很简单了，先使用twarc的工具（/utils/noretweets.py）对json文件去除转推和引用，再使用正则表达式搜索图片（格式为："media_url_https":"https://pbs.twimg.com/media/十五位大小写字母+数字+横线下划线组合.jpg"），把url全粘进txt文件用aria2批量下载即可。

扒视频同理，搜索.mp4或.m3u8然后选码率最高的下载即可

## 获取关注者列表

使用twarc followers命令即可。获取的都是账号id，你需要工具（[tweeterid.com](https://tweeterid.com/) 或 [gettwitterid.com](http://gettwitterid.com/)）来进行id和用户名的相互转换。这个号的关注数是0所以获取关注就不说了

## 转码

获取的推特文本都是被unicode编码过的无法读懂的字符串，如图

![](https://gitcode.net/message2011/tttp/-/raw/master/shiraishi/t017b1e6f845163d1a0.png)

需要对其进行解码。首先考虑的是用python解，可是跑着跑着突然报错了。

```
UnicodeEncodeError: 'utf-8' codec can't encode characters in position 31295-31296: surrogates not allowed
```

经过对数据分段排查，发现竟然是一个小小的emoji的锅

![](https://gitcode.net/message2011/tttp/-/raw/master/shiraishi/t01c55d777056959d5f.png)

这个emoji，在文件里的编码是\ud83d\udc40，但是在python中无法识别。搜索了一下让python支持的方法，发现要想支持，python得是UCS-2编译的，而现在一般都是UCS-4编译，于是放弃，转用JS。

```javascript
var fs = require('fs');
 
var rs = fs.createReadStream("./haruka1.json"),    data = "";
rs.setEncoding("utf8");
rs.on("data", function(chunk) {
	chunk = unescape(chunk.replace(/\\u/g, "%u"));
	data += chunk;
});
rs.on("end", function() {
	//console.log(data);
	fs.writeFile('./shiraishi_haruk_1_transcoded.json', data, function(err) {
   		if (err) 
       		return console.error(err);
	});
});

```

（其实json格式化那里自动就转码了，方便阅读文件而已）

------

下载地址和说明见下一篇