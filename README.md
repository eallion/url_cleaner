# 净化淘宝链接 taobao_url_shorten

本插件叫：净化淘宝链接

Chrome 应用商店链接：[https://chrome.google.com/webstore/detail/净化淘宝链接/npokdddpckpfhlecbgmplgcidebjmkfm](https://chrome.google.com/webstore/detail/%E5%87%80%E5%8C%96%E6%B7%98%E5%AE%9D%E9%93%BE%E6%8E%A5/npokdddpckpfhlecbgmplgcidebjmkfm)

*（如果不想安装插件，文末有书签栏js代码，可实现相同的功能。）*

核心功能介绍：

> 打开淘宝、天猫、1688的时候，地址栏的链接总是会多出一些冗余字符。
> 这个插件的目的就是把页面的地址栏链接净化成最纯净的链接。
> 
> 如： [https://item.taobao.com/item.htm?id=551017384075](https://item.taobao.com/item.htm?id=551017384075) 这样的形式。
> 
> 支持：淘宝、天猫、1688。

---

### 效果图1：

点击图标即可净化淘宝链接，并复制。

![](https://github.com/eallion/taobao_url_shorten/blob/master/screenshots/browser_action.png)

---

### 效果图2：

在淘宝页面点击右键，即可以净化当前页面的链接，并复制到剪切板。

（因淘宝限制诸多，右键功能没有做其他的弹出效果，只是净化并复制。）

![](https://github.com/eallion/taobao_url_shorten/blob/master/screenshots/right_click.png)

---

### 效果图3：

右键净化后的提示。

![](https://github.com/eallion/taobao_url_shorten/blob/master/screenshots/alert.png)

---

# 书签栏插件

如果不想安装插件，可以用书签实现同样的功能。
把下面的js代码存为书签即可。
```
javascript: (function() { function getQueryString(name) { var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); var r = window.location.search.substr(1).match(reg); if (r != null) return r[2]; return null; } var site = window.location.href.match(/^http(s)?:\/\/[\w\.\/]*/); var id = getQueryString("id"); var q = getQueryString("q"); if (id != null) { var pureUrl = site[0] + "?id=" + id; } else if (q != null) { var pureUrl = site[0] + "?q=" + q; } else if (site[0].substr(site[0].length - 13) == "view_shop.htm") { var pureUrl = window.location.protocol + "//" + window.location.host; } else { var pureUrl = site[0]; } var reload = prompt("净化后的网址是：", pureUrl); if (reload != null) { window.location.href = pureUrl; } })();
```
![](https://github.com/eallion/taobao_url_shorten/blob/master/screenshots/bookmark.png)

## 效果图：

![](https://github.com/eallion/taobao_url_shorten/blob/master/screenshots/bookmark_js.png)
