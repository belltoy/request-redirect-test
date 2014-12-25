Request redirect test
=====================

## Run server

`node server.js [maxRedirects]`

* `maxRedirects` default 10

Example:

```
> node server.js
```

## Run tests

- `node req.js [maxRedirects]`
- `node req-pipe.js [maxRedirects]`

```
> node req.js 8

error: [Error: Exceeded maxRedirects. Probably stuck in a redirect loop http://127.0.0.1:8681/8]

> node req.js 9

(node) warning: possible EventEmitter memory leak detected. 11 listeners added. Use emitter.setMaxListeners() to increase limit.
Trace
    at Request.addListener (events.js:160:15)
    at Request.onRequestResponse (/Users/belltoy/codes/redirect_test/node_modules/request/request.js:1276:12)
    at ClientRequest.emit (events.js:95:17)
    at HTTPParser.parserOnIncomingClient [as onIncoming] (http.js:1692:21)
    at HTTPParser.parserOnHeadersComplete [as onHeadersComplete] (http.js:121:23)
    at Socket.socketOnData [as ondata] (http.js:1587:20)
    at TCP.onread (net.js:527:27)
error: null

> node req-pipe.js 8

error: [Error: Exceeded maxRedirects. Probably stuck in a redirect loop http://127.0.0.1:8681/8]

> node req-pipe.js 9

(node) warning: possible EventEmitter memory leak detected. 11 listeners added. Use emitter.setMaxListeners() to increase limit.
Trace
    at Request.addListener (events.js:160:15)
    at Request.start (/Users/belltoy/codes/redirect_test/node_modules/request/request.js:939:8)
    at Request.end (/Users/belltoy/codes/redirect_test/node_modules/request/request.js:1699:10)
    at end (/Users/belltoy/codes/redirect_test/node_modules/request/request.js:696:14)
    at Object._onImmediate (/Users/belltoy/codes/redirect_test/node_modules/request/request.js:710:7)
    at processImmediate [as _immediateCallback] (timers.js:345:15)
on response
on end
```

## Summary

`maxRedirects` >= 9 的时候会有 `memory leak` 的警告，但请求会成
功。否则，请求失败，返回错误:

    [Error: Exceeded maxRedirects. Probably stuck in a redirect loop http://127.0.0.1:8681/8]

`request` 请求的时候有两种方式，一种是带 `callback` 的，
一种是不带的 (`pipe`方式) ，两种方式都有可能会报这个警
告，原因是[line:1276](https://github.com/request/request/blob/v2.47.0/request.js#L1276)
和 [line:1315](https://github.com/request/request/blob/v2.47.0/request.js#L1315)
两个地方的 `self.on('end')` 在 redirect 的时候重复执行却没有清空。

从警告内容中看，是带 `callback` 的调用方式产生的。

花瓣主站代码中，用 `pipe` 的主要是与内部服务器交互，一般不会产生 redirect。
在抓取外部图片或网页的时候多数是用 `callback` 方式，而外部请求有可能生产多个 redirect。

但是问题来了，有什么网站会有超过 10 次的重定向呢？

## Solutions

* 修改 `reqest` 中 redirect 的实现方式。有没有同学去提交 PR ?
* 我们自己代码中添加 `maxRedirects` 选项，这种方式也便于我们发现重定向次数过多的网站。
