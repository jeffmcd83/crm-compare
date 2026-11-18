const P='crm-root-',C="crm-root-v1.8.20-1ab4b95b";
const PRE=["./","./index.html","./manifest.webmanifest","./favicon.svg","./icons/apple-touch-icon.png","./icons/icon-192.png","./icons/icon-512-maskable.png","./icons/icon-512.png","./data/core.json?v=1ab4b95b","./data/ls-medtronic.json?v=1ab4b95b","./data/ls-abbott.json?v=1ab4b95b","./data/ls-boston-scientific.json?v=1ab4b95b","./data/ls-biotronik.json?v=1ab4b95b","./data/nomen.json?v=1ab4b95b","./data/recalls.json?v=1ab4b95b","./vendor/pptxgen.bundle.js?v=1ab4b95b"];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(PRE)))});
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>(x.startsWith(P)&&x!==C)||x.startsWith('crm-v11-')).map(x=>caches.delete(x)))).then(()=>self.clients.claim())));
self.addEventListener('message',e=>{if(e.data==='skipWaiting'||(e.data&&e.data.type==='skipWaiting'))self.skipWaiting()});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const u=new URL(e.request.url);
  if(u.origin!==location.origin)return;
  if(u.pathname.includes('/preview/'))return;
  const data=u.pathname.includes('/data/')&&u.pathname.endsWith('.json');
  e.respondWith(caches.open(C).then(async c=>{
    const hit=await c.match(e.request)||await c.match(e.request,{ignoreSearch:true});
    const net=fetch(e.request,{cache:'no-cache'}).then(r=>{if(r.ok)c.put(e.request,r.clone());return r}).catch(()=>undefined);
    if(data){
      if(hit){e.waitUntil(net);return hit}
      return (await net)||new Response('{}',{status:503,headers:{'Content-Type':'application/json'}});
    }
    if(hit)return hit;
    const r=await net;
    return r||new Response('',{status:504});
  }));
});
