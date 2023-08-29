# Partytown

Partytown is a lazy-loaded library to help relocate resource intensive scripts into a web worker, and off of the main thread. Its goal is to help speed up sites by dedicating the main thread to your code, and offloading third-party scripts to a web worker.

## Goals

Some of Partytown’s goals include:

- Free up main thread resources to be used only for the primary web app execution.
- Sandbox third-party scripts and allow or deny their access to main thread APIs.
- Isolate long-running tasks within the web worker thread.
- Reduce layout thrashing coming from third-party scripts by batching DOM setters/getter into group updates.
- Throttle third-party scripts’ access to the main thread.
- Allow third-party scripts to run exactly how they’re coded and without any alterations.
- Read and write main thread DOM operations synchronously from within a web worker, allowing scripts running from the web worker to execute as expected.

## Web Workers

Partytown’s philosophy is that the main thread should be dedicated to your code, and any scripts that are not required to be in the critical path should be moved to a web worker. Main thread performance is, without question, more important than web worker thread performance. Please see the test pages for some live demos.

## How does it work ?

Read more here : https://partytown.builder.io/how-does-partytown-work

## What runs on the main thread ?

Whatever needs to run on the main thread will run on the main thread shall run on the main thread.
Whatever can run on the worker thread shall run on the worker thread.

Consider the following example :

```js
console.log("Loaded via partywown");
/**
 * This operation happens only on the worker and does not percolate to the main thread
 */
performance.mark("longop-start");
for (let i = 0; i < 100000; i++) {
  Math.sinh(Math.acosh(Math.tanh(Math.sqrt(i))));
}
performance.mark("longop-end");
performance.measure("long-op", "longop-start", "longop-end");

/**
 * This operation happens on the main thread.
 */
const id = document.getElementById("viaPartytown");
const node = document.createTextNode(
  `This was created at ${Date()} USING PARTYTOWN`
);
id.appendChild(node);
```

To try this out head over to
https://partytown-demo.vercel.app/
and run a performance profile.

You will indeed find the functions have been seggregated into the worker and the main thead.

![8C2c2R](https://cdn.jsdelivr.net/gh/nilanjansiromani/assets@master/uPic/8C2c2R.png)

You will also find the below requests on the network tab :

![2jXb5l](https://cdn.jsdelivr.net/gh/nilanjansiromani/assets@master/uPic/2jXb5l.png)

This is the point where the worker thread is using the service worker to
communicate with the main thread.

## Debugging

The following attributes should be added to log important information such as

| Log Config Property     | Description                         |
| ----------------------- | ----------------------------------- |
| `logCalls`              | Log method calls                    |
| `logGetters`            | Log getter calls                    |
| `logSetters`            | Log setter calls                    |
| `logImageRequests`      | Log Image() src requests            |
| `logScriptExecution`    | Log script executions               |
| `logSendBeaconRequests` | Log navigator.sendBeacon() requests |
| `logStackTraces`        | Log stack traces                    |

## Gotchas.

Like all things that shines is not gold, such is the case with partytown.
There are three main gotchas that was discovered with partytown.

### 1. Atomics and SharedArrayBuffer is not possible in the walmart ecosystem

To enable Atomics communication, the browser’s [crossOriginIsolated](https://developer.mozilla.org/en-US/docs/Web/API/crossOriginIsolated) readonly property should be `true`. The `crossOriginIsolated` property is only set to true, by the browser, when the document includes these http response headers:

```js
Cross-Origin-Embedder-Policy: credentialless
Cross-Origin-Opener-Policy: same-origin
```

- [Cross-Origin-Embedder-Policy (COEP)](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cross-Origin-Embedder-Policy) response header prevents a document from loading any cross-origin resources that don’t explicitly grant the document permission. At the time of writing, `credentialless` is not a supported value in Safari, so Safari will fallback to using the Service Worker communication. An alternative to `credentialless` is to use `require-corp`, which does work in Safari too. Please see [Setting Cross-Origin Attribute](https://partytown.builder.io/atomics#setting-cross-origin-attribute) for more info.
- [Cross-Origin-Opener-Policy (COOP)](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cross-Origin-Opener-Policy) response header allows you to ensure a top-level document does not share a browsing context group with cross-origin documents.

### 2. If a script fetches another script, special headers are needed.

Often third-party scripts are added to the page by appending a script tag, such as:

```
var script = document.createElement('script');
script.url = 'http://some-third-party-script.com/tracking.js';
document.head.appendChild(script);
```

When the `<script>` element is appended to the `<head>` using this traditional approach, the script’s HTTP response *does not* require [Cross-Origin Resource Sharing (CORS)](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) headers.

However, because Partytown requests the scripts within a web worker using [fetch()](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API), then the script’s response *requires* the correct CORS headers.

Many third-party scripts already provide the correct CORS headers, but not all do. For services that do not add the correct headers, then a [reverse proxy](https://partytown.builder.io/proxying-requests#reverse-Proxy) to another domain must be used in order to provide the CORS headers.

Now what we have seen so far, we can host one primary script, but if that script calls another script then that call fails and ultimately we have exceptions.

### 3. The Synchronous XML HTTP reqauets.

The synchronous http reuest makes the execution wait line by line.
So cosidering there is a sudden long task that executed on the main thread, the execution of the next lines of code are goin to come to a halt.

Consider the following example

```js
for (let i = 0; i < 100000; i++) {
  const foo = document.cookie;
}
console.log("hello world");
```

For each iteration it will make a `Proxytown` request as explained above it will wait for a long time
as it is throttled.

Hence if the `console.log("hello world");` was important it would never run until much much later.

## Why could we not use `becaon` over partytown?

The way rum is loaded on the page is :

- At first we load a script from [beacon.walmart.com](http://beacon.walmart.com/). **This is not rum.js**
- Then this script injects a tag into the head of the page
- This script is fetched but is always returned a 302 pointing to the location of the actual rum script.
- This script is then downloaded and loaded on the page.

Now for partytown to work there are two limitations:

- Partytown fetches the sctipts from the webworkers using a fetch call.
- So when you load scripts from [becaon.walmart.com](http://becaon.walmart.com/) on [walmart.com](http://walmart.com/) there will be a cors error. So partytown will not be able to download this script.

What are the way outs :

- [Becaon.walmart.com](http://becaon.walmart.com/) has to either send a allow-credentials : \* / allow cors

## Why could we not use `perimeterx` over partytown?

Perimeterx as a script can be loaded over worker, if we decided to host it oun our origin and somehow served it from the origin to get around the SAME_ORIGIN_POLICY.
However this file tries to use doument.createElement APIs to insert other script tags.

![3lqcmc](https://cdn.jsdelivr.net/gh/nilanjansiromani/assets@master/uPic/3lqcmc.png)

The source of this script canot be loaded via fetch on the worker as it lacks the headers as part of the response.

## Why could we not use `threatMetrix` over partytown?

threatMetrix as a script can be loaded over worker, if we decided to host it oun our origin and somehow served it from the origin to get around the SAME_ORIGIN_POLICY
But this script uses WebRTC connections, that is currently not available on workers.

## Conclusion

While Partytown makes bold claims it is currently based on assumptions of working. It also cannot be considered as web worker implemention as it is not the true form of multithreading but acts as a hybrid with Limitaitons.

As of today there are no use cases in walmart wherein this library can be used in such a way that the delayed metric does not affect any business KPI
