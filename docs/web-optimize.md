# web优化



## 1.资源加载

### defer/async

参考：

[脚本：async, defer](https://zh.javascript.info/script-async-defer)

[defer和async的区别](https://segmentfault.com/q/1010000000640869)

`<script>`会阻塞DOM解析，因此常常会把脚本放在body标签后，但脚本放在body标签后不是最好的选择。

`<script>`提供了两个属性：async, defer来解决阻塞问题。



使用：

```html
<header>
	...
  <script defer src="https://example.com/xx.js"></script>
  <script async src="https://example.com/xx.js"></script>
</header>

<!-- 立即可见 -->
<p>...content after script...</p>
```



defer : 下载脚本和DOM解析并行，待DOM解析完成后执行脚本，这个是执行是在DOMContentLoaded之前完成。（注意：defer只对script标签中有src才有效果；**DOMContentLoaded之前是不适合操作dom的**）

async : 故名思义，异步下载并执行。下载脚本和DOM解析并行，下载完成后立即执行脚本，不等待DOM是否解析完成。（因此，需要改变DOM结构的script不适合加async属性）



**比较**：两者都是并行的，区别在于执行时机。defer是在DOM解析完成后（多个defer时还能保证执行顺序时从上至下的），而async的执行时脚本下载完成就立即执行（可能在DOM解析完成之前或之后，多个async时谁先下载完就先执行，使得每个script彼此独立，互不影响）



**使用场景**：async/defer适合用来加载一些第三方库，不适合用来加载会立即执行的脚本。如果加载的script中会操作document中的元素，那么需要放在DOMContentLoaded的回调或onload函数中执行，一般框架都是要做这样的操作的！

### preload/prefetch

参考：

[Preload与Prefetch的使用及在 Chrome 中的优先级](https://blog.fundebug.com/2019/04/11/understand-preload-and-prefetch/)

[Preload 有什么好处（上）](http://www.alloyteam.com/2016/05/preload-what-is-it-good-for-part1/)



[preload](https://www.smashingmagazine.com/2016/02/preload-what-is-it-good-for/) 是一个声明式 `fetch`，可以**强制**浏览器在不阻塞 `document` 的 [onload](https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers/onload) 事件的情况下请求资源，待用到该资源的时候立即执行。

`prefetch` 告诉浏览器这个资源将来可能需要，但是什么时间加载这个资源是由浏览器来决定的。



**比较**：`preload` *加载资源一般是当前页面需要的，*`prefetch` *一般是其它页面有可能用到的资源。*



下述代码，只能强制浏览器在后台下载css和js，而并不能执行css和js.

```html
<link rel="preload" as="style" href="http://example.com/home-2675167c.css">
<link rel="preload" as="script" href="http://example.com/home-2675167c.js">
```

而像下面这样的做法，才能在后台下载完成后立即执行

```html
<link rel="stylesheet" href="http://example.com/home-2675167c.css">
<script async src="http://example.com/home-2675167c.js"></script>
```



**Preload的基础使用**：

+ 加载较晚发现的资源。

虽然大部分基于标签的资源会被浏览器内部的预加载器（[preloader](http://calendar.perfplanet.com/2013/big-bad-preloader/)）提早发现，但并非所有资源都是基于标签的。有些资源是隐藏在 CSS 和 JavaScript 中的，浏览器不知道页面即将需要这些资源，而等到发现它们时已经为时已晚。所以在有些情况，这些资源延缓了首屏渲染，或是延缓了页面关键部分的加载。

而现在你有途径告诉浏览器，“ 嘿，浏览器！这个是你一会所需要的资源，现在就开始加载吧。”

主要用来加载一些关键性的图片/图标，字体，甚至是脚本。

+ 动态加载，不做运行





## 2.https



### 给网站申请SSL证书







### Node中发起https请求报错

```
Error: unable to verify the first certificate
```



解决方案：[https://zhuanlan.zhihu.com/p/108958388]

```bash
#使用 openssl 查看服务器的证书详细情况
openssl s_client -connect www.jspang.com:443 -servername www.jspang.com | tee logcertfile


#然后我们再查找该证书的签名机构（中级证书就是服务端证书的签名机构
openssl x509 -in logcertfile -noout -text | grep -i "issuer"


#它会返回一个签名证书的 URI。我们下载该中级证书
curl --output intermediate.crt http://cacerts.digicert.com/EncryptionEverywhereDVTLSCA-G1.crt

#最后将其将转成 .pem 文件。
openssl x509 -inform DER -in intermediate.crt -out intermediate.pem -text
```

在node中使用

