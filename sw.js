if(!self.define){let s,e={};const n=(n,o)=>(n=new URL(n+".js",o).href,e[n]||new Promise((e=>{if("document"in self){const s=document.createElement("script");s.src=n,s.onload=e,document.head.appendChild(s)}else s=n,importScripts(n),e()})).then((()=>{let s=e[n];if(!s)throw new Error(`Module ${n} didn’t register its module`);return s})));self.define=(o,i)=>{const l=s||("document"in self?document.currentScript.src:"")||location.href;if(e[l])return;let r={};const a=s=>n(s,l),f={module:{uri:l},exports:r,require:a};e[l]=Promise.all(o.map((s=>f[s]||a(s)))).then((s=>(i(...s),r)))}}define(["./workbox-c37eba35"],(function(s){"use strict";self.addEventListener("message",(s=>{s.data&&"SKIP_WAITING"===s.data.type&&self.skipWaiting()})),s.precacheAndRoute([{url:"assets/android-chrome-192x192-b602fe7a.png",revision:null},{url:"assets/android-chrome-512x512-0e707758.png",revision:null},{url:"assets/apple-touch-icon-77f1cce1.png",revision:null},{url:"assets/ComicMono-742af5ad.woff",revision:null},{url:"assets/ComicMono-bed2c2b5.woff2",revision:null},{url:"assets/ComicMono-Bold-2350c6c1.woff",revision:null},{url:"assets/favicon-695249ea.svg",revision:null},{url:"assets/favicon-8d604eb4.ico",revision:null},{url:"assets/IBMPlexMono-Bold-3152ee89.woff2",revision:null},{url:"assets/IBMPlexMono-Bold-6bb3fd98.woff",revision:null},{url:"assets/IBMPlexMono-BoldItalic-5cd662b9.woff",revision:null},{url:"assets/IBMPlexMono-BoldItalic-6f4d360c.woff2",revision:null},{url:"assets/IBMPlexMono-Italic-30cb963d.woff2",revision:null},{url:"assets/IBMPlexMono-Italic-fc3301da.woff",revision:null},{url:"assets/IBMPlexMono-Regular-06ba2f2e.woff",revision:null},{url:"assets/IBMPlexMono-Regular-82ad22f5.woff2",revision:null},{url:"assets/index-e5dc6b43.css",revision:null},{url:"assets/index-f09b1c46.js",revision:null},{url:"assets/index-f09b1c46.js.gz",revision:null},{url:"assets/JetBrainsMono-Bold-c503cc5e.woff2",revision:null},{url:"assets/JetBrainsMono-Regular-a9cb1cd8.woff2",revision:null},{url:"assets/jgs_vecto-e7fb4a88.woff2",revision:null},{url:"assets/jgs5-0e03e537.woff2",revision:null},{url:"assets/jgs5-9f26a38a.woff",revision:null},{url:"assets/jgs7-a69a9a5d.woff2",revision:null},{url:"assets/jgs7-d3f51478.woff",revision:null},{url:"assets/jgs9-0c41ef37.woff",revision:null},{url:"assets/jgs9-dc75d6ab.woff2",revision:null},{url:"assets/many_universes-d74e86dc.svg",revision:null},{url:"assets/mstile-150x150-fcf527e3.png",revision:null},{url:"assets/pulses-30df7a48.svg",revision:null},{url:"assets/safari-pinned-tab-61a1253d.svg",revision:null},{url:"assets/Steps-Mono-aff9e933.woff2",revision:null},{url:"assets/Steps-Mono-Thin-b82a0d7e.woff2",revision:null},{url:"assets/times-1426387b.svg",revision:null},{url:"assets/topos_arch-db355d32.svg",revision:null},{url:"assets/topos_code-6c32eb83.png",revision:null},{url:"assets/topos_frog-abe2d135.png",revision:null},{url:"assets/topos_frog-e8ab87d1.svg",revision:null},{url:"assets/topos_gif-15a95761.gif",revision:null},{url:"assets/TransportProcessor-d5d50b30.js",revision:null},{url:"assets/TransportProcessor-d5d50b30.js.gz",revision:null},{url:"favicon/android-chrome-192x192.png",revision:"2429dad582348ae2739bc93bfe05d7ac"},{url:"favicon/android-chrome-512x512.png",revision:"12f44bfb54998f5a07768c8a4f2bdba7"},{url:"favicon/apple-touch-icon.png",revision:"dc10d973f9af63470369c2d4264c009d"},{url:"favicon/favicon-16x16.png",revision:"b69d914139eaa7d352d99a50750f60db"},{url:"favicon/favicon-32x32.png",revision:"486abfdda056b5c51bb03cd7d59e82b7"},{url:"favicon/favicon.ico",revision:"765804f7055a1418f7197838fc24220d"},{url:"favicon/favicon.svg",revision:"b63dbb14d38b3700ef25ff165e3dfd9c"},{url:"favicon/mstile-150x150.png",revision:"51c3e55d1105efa5e7da8e2ce1ce7617"},{url:"favicon/safari-pinned-tab.svg",revision:"c538bc47f907da4e4bab9f23afc30887"},{url:"favicon/screenshot_miniature.png",revision:"418a8c434aacf92bf8c164f1075e4f05"},{url:"favicon/topos_code.png",revision:"418a8c434aacf92bf8c164f1075e4f05"},{url:"index.html",revision:"b848cff61b3e2eb0fa6335f65b650358"},{url:"registerSW.js",revision:"1872c500de691dce40960bb85481de07"}],{}),s.registerRoute(new s.NavigationRoute(s.createHandlerBoundToURL("index.html"))),s.registerRoute((({url:s})=>[/^https:\/\/raw\.githubusercontent\.com\/.*/i,/^https:\/\/shabda\.ndre\.gr\/.*/i].some((e=>e.test(s)))),new s.CacheFirst({cacheName:"external-samples",plugins:[new s.ExpirationPlugin({maxEntries:5e3,maxAgeSeconds:2592e3}),new s.CacheableResponsePlugin({statuses:[0,200]})]}),"GET")}));
