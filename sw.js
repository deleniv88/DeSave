/* Service worker: app shell offline, always-fresh HTML when online. Bump VERSION after each deploy if assets change. */
const VERSION="cm-v12";
const SHELL=["/","/manifest.webmanifest","/icons/icon-192.png","/icons/icon-512.png","/icons/apple-touch-icon.png"];
self.addEventListener("install",e=>{ e.waitUntil(caches.open(VERSION).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting())); });
self.addEventListener("activate",e=>{ e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==VERSION).map(k=>caches.delete(k)))).then(()=>self.clients.claim())); });
self.addEventListener("fetch",e=>{
  const r=e.request; if(r.method!=="GET") return;
  const u=new URL(r.url);
  if(u.hostname.endsWith("posthog.com")) return;                       // analytics: never cache
  if(r.mode==="navigate"){                                              // HTML: network first
    e.respondWith(fetch(r).then(res=>{ const c=res.clone(); caches.open(VERSION).then(x=>x.put("/",c)); return res; }).catch(()=>caches.match("/")));
    return;
  }
  if(u.origin===location.origin||u.hostname.endsWith("fonts.googleapis.com")||u.hostname.endsWith("fonts.gstatic.com")){
    e.respondWith(caches.match(r).then(hit=>{ const net=fetch(r).then(res=>{ if(res.ok||res.type==="opaque"){ const c=res.clone(); caches.open(VERSION).then(x=>x.put(r,c)); } return res; }).catch(()=>hit); return hit||net; }));
  }
});
