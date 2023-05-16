---
title: 对推文数据文件使用方法的一些说明
date: 2020-01-12 22:26:31
tags: 
    - twitter
    - 声优
    - json
---

[分享地址点我](http://www.narumiruna.gq/?/other/twitter_shiraishi_haruk/)

备用网盘: [https://pan.baidu.com/s/1_k2KLLe0gjmaHJkbpzevJQ](https://pan.baidu.com/s/1_k2KLLe0gjmaHJkbpzevJQ) 提取码: whxs

上一篇是爬取推文的详细内容

首先这个文件，扩展名是json，严格来说应该是jsonl文件，也就是每行都是一个json。让json文件看上去更舒服，你需要一个json格式化工具，比如[json.cn](https://www.json.cn/)还有[bejson.com](https://www.bejson.com/)。将json文件中的一行粘进去（复制多行可能会报错）然后点格式化，你就会发现被加了很多换行，看起来更方便了：

![](https://gitcode.net/message2011/tttp/-/raw/master/shiraishi/t017164b59da73ba1d1.png)

<!-- more -->

完整版：

```json
{
    "created_at":"Sat Nov 09 15:33:18 +0000 2019",
    "id":1193189828885565440,
    "id_str":"1193189828885565440",
    "full_text":"ひとみんがジェスチャーしてくれるんだよぉ、、、対決に集中するの大変だった😂💓笑

今夜も聴いてくださいねー(*^▽^*)
はるか☀️
#白黒瞳 https://t.co/J6YsbEhDRK",
    "truncated":false,
    "display_text_range":[
        0,
        71
    ],
    "entities":{
        "hashtags":[
            {
                "text":"白黒瞳",
                "indices":[
                    67,
                    71
                ]
            }
        ],
        "symbols":[

        ],
        "user_mentions":[

        ],
        "urls":[

        ],
        "media":[
            {
                "id":1193189821625192448,
                "id_str":"1193189821625192448",
                "indices":[
                    72,
                    95
                ],
                "media_url":"http://pbs.twimg.com/media/EI8P0iuU0AAG6BV.jpg",
                "media_url_https":"https://pbs.twimg.com/media/EI8P0iuU0AAG6BV.jpg",
                "url":"https://t.co/J6YsbEhDRK",
                "display_url":"pic.twitter.com/J6YsbEhDRK",
                "expanded_url":"https://twitter.com/shiraishi_haruk/status/1193189828885565440/photo/1",
                "type":"photo",
                "sizes":{
                    "medium":{
                        "w":1200,
                        "h":900,
                        "resize":"fit"
                    },
                    "thumb":{
                        "w":150,
                        "h":150,
                        "resize":"crop"
                    },
                    "small":{
                        "w":680,
                        "h":510,
                        "resize":"fit"
                    },
                    "large":{
                        "w":2046,
                        "h":1534,
                        "resize":"fit"
                    }
                },
                "features":{
                    "medium":{
                        "faces":[

                        ]
                    },
                    "small":{
                        "faces":[

                        ]
                    },
                    "orig":{
                        "faces":[

                        ]
                    },
                    "large":{
                        "faces":[

                        ]
                    }
                }
            }
        ]
    },
    "extended_entities":{
        "media":[
            {
                "id":1193189821625192448,
                "id_str":"1193189821625192448",
                "indices":[
                    72,
                    95
                ],
                "media_url":"http://pbs.twimg.com/media/EI8P0iuU0AAG6BV.jpg",
                "media_url_https":"https://pbs.twimg.com/media/EI8P0iuU0AAG6BV.jpg",
                "url":"https://t.co/J6YsbEhDRK",
                "display_url":"pic.twitter.com/J6YsbEhDRK",
                "expanded_url":"https://twitter.com/shiraishi_haruk/status/1193189828885565440/photo/1",
                "type":"photo",
                "sizes":{
                    "medium":{
                        "w":1200,
                        "h":900,
                        "resize":"fit"
                    },
                    "thumb":{
                        "w":150,
                        "h":150,
                        "resize":"crop"
                    },
                    "small":{
                        "w":680,
                        "h":510,
                        "resize":"fit"
                    },
                    "large":{
                        "w":2046,
                        "h":1534,
                        "resize":"fit"
                    }
                },
                "features":{
                    "medium":{
                        "faces":[

                        ]
                    },
                    "small":{
                        "faces":[

                        ]
                    },
                    "orig":{
                        "faces":[

                        ]
                    },
                    "large":{
                        "faces":[

                        ]
                    }
                },
                "ext_alt_text":null
            }
        ]
    },
    "source":"<a href="http://twitter.com/download/iphone" rel="nofollow">Twitter for iPhone</a>",
    "in_reply_to_status_id":null,
    "in_reply_to_status_id_str":null,
    "in_reply_to_user_id":null,
    "in_reply_to_user_id_str":null,
    "in_reply_to_screen_name":null,
    "user":{
        "id":709304702945525760,
        "id_str":"709304702945525760",
        "name":"白石晴香 & STAFF",
        "screen_name":"shiraishi_haruk",
        "location":"",
        "description":"白石晴香 official Twitter
ヒラタオフィス スタッフが出演情報やオフショットなどを呟きます。
ときどき、本人も登場！
※本人の呟きには☀はるか☀が付きます。",
        "url":"https://t.co/S5oiEckoxp",
        "entities":{
            "url":{
                "urls":[
                    {
                        "url":"https://t.co/S5oiEckoxp",
                        "expanded_url":"http://www.hirata-office.jp/talent_profile/woman/haruka_shiraishi.html",
                        "display_url":"hirata-office.jp/talent_profile…",
                        "indices":[
                            0,
                            23
                        ]
                    }
                ]
            },
            "description":{
                "urls":[

                ]
            }
        },
        "protected":true,
        "followers_count":38360,
        "friends_count":0,
        "listed_count":1658,
        "created_at":"Mon Mar 14 09:06:34 +0000 2016",
        "favourites_count":0,
        "utc_offset":null,
        "time_zone":null,
        "geo_enabled":false,
        "verified":false,
        "statuses_count":4242,
        "lang":null,
        "contributors_enabled":false,
        "is_translator":false,
        "is_translation_enabled":false,
        "profile_background_color":"000000",
        "profile_background_image_url":"http://abs.twimg.com/images/themes/theme1/bg.png",
        "profile_background_image_url_https":"https://abs.twimg.com/images/themes/theme1/bg.png",
        "profile_background_tile":false,
        "profile_image_url":"http://pbs.twimg.com/profile_images/826687582771621888/wB5UGDT__normal.jpg",
        "profile_image_url_https":"https://pbs.twimg.com/profile_images/826687582771621888/wB5UGDT__normal.jpg",
        "profile_image_extensions_alt_text":null,
        "profile_link_color":"F58EA8",
        "profile_sidebar_border_color":"000000",
        "profile_sidebar_fill_color":"000000",
        "profile_text_color":"000000",
        "profile_use_background_image":false,
        "has_extended_profile":true,
        "default_profile":false,
        "default_profile_image":false,
        "can_media_tag":false,
        "followed_by":false,
        "following":true,
        "follow_request_sent":false,
        "notifications":false,
        "translator_type":"none"
    },
    "geo":null,
    "coordinates":null,
    "place":null,
    "contributors":null,
    "is_quote_status":false,
    "retweet_count":215,
    "favorite_count":1023,
    "favorited":false,
    "retweeted":false,
    "possibly_sensitive":false,
    "lang":"ja"
}
```

接下来我对其中一部分名称进行解释。

------

## 部分名称解释

created_at：发推的时间，注意这里的时间是UTC，换算成日本时间需要再加9小时。

id：每条推文的唯一id

full_text：推文全文

source：来源

in_reply_to_status_id：回复的推文id，不是回复则为null

in_reply_to_user_id：回复的推主id，不是回复则为null

in_reply_to_screen_name：回复的推主用户名，不是回复则为null

entities和extended_entities：一条推中除了文字外，推主发的其他内容。可以包含"hashtags"（就是tag），"user_mentions"（被提到的账号），"urls"（发的链接），"media"（图片，视频等，这个下面单独说）

------

### media

图片视频动图等。这里面还包含很多子对：

id：这个id和推文id是相同的

media_url与media_url_https：媒体的真实地址。**可以复制文件名在图包里搜索**

faces：人脸识别

video_info：只有媒体是视频时才有，以下是一个示例：

```json
"video_info":{
                    "aspect_ratio":[
                        3,
                        4
                    ],
                    "duration_millis":6432,
                    "variants":[
                        {
                            "bitrate":832000,
                            "content_type":"video/mp4",
                            "url":"https://video.twimg.com/ext_tw_video/908273642907115520/pr/vid/480x640/G7WK7_mqb4gDwsQG.mp4"
                        },
                        {
                            "bitrate":256000,
                            "content_type":"video/mp4",
                            "url":"https://video.twimg.com/ext_tw_video/908273642907115520/pr/vid/240x320/Ri2n8omEx5b8WAho.mp4"
                        },
                        {
                            "bitrate":2176000,
                            "content_type":"video/mp4",
                            "url":"https://video.twimg.com/ext_tw_video/908273642907115520/pr/vid/960x1280/x_Xf_HLnl06IjMc3.mp4"
                        },
                        {
                            "content_type":"application/x-mpegURL",
                            "url":"https://video.twimg.com/ext_tw_video/908273642907115520/pr/pl/xOIH7VI_mOhG2CGN.m3u8"
                        }
                    ]
                }
```

其中一部分名称的解释：

aspect_ratio：宽高比

duration_millis：时长，单位为毫秒

bitrate：码率，单位为b/s

url：真实地址

另外可以看出twitter视频分为mp4和hls两种格式，每种格式有三种不同的质量（m3u8里也是分三种质量的）

------

### user

推主相关信息。当然这部分在所有行里面都是一致的。这里面还包含很多子对：

id：推主唯一id

screen_name：这里推特中文界面称之为“用户名”，就是@后面那一串

expanded_url：个人资料的真实链接

protected：是否被保护，即名字后面是否带个锁

followers_count：粉丝数

friends_count：关注数

created_at：账号创建时间，同样是UTC

favourites_count：点赞数，这里是0，是她决定销号后取消了所有赞还是从来没点过赞我暂且蒙在古里

statuses_count：发推数，包含转推

profile_image_url与profile_image_url_https：头像小图

------

### retweeted_status和quoted_status

转推的内容和引用的内容，这个对象就是个推文套娃

quoted_status_permalink：引用的推文链接

------

retweet_count：被转推次数。注意如果是转推的话这个数值和转的推的数值是相同的，不存在单独统计

favorite_count：被赞次数。如果是转推的话无法被赞，这个值为0

lang：语言





