const P='crm-preview-',C="crm-preview-v1.8.19-292c9bf6";
const PRE=["./","./index.html","./manifest.webmanifest","./favicon.svg","./icons/apple-touch-icon.png","./icons/icon-192.png","./icons/icon-512-maskable.png","./icons/icon-512.png","./data/core.json?v=292c9bf6","./data/ls-medtronic.json?v=292c9bf6","./data/ls-abbott.json?v=292c9bf6","./data/ls-boston-scientific.json?v=292c9bf6","./data/ls-biotronik.json?v=292c9bf6","./data/nomen.json?v=292c9bf6","./data/recalls.json?v=292c9bf6","./vendor/pptxgen.bundle.js?v=292c9bf6"];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(PRE)))});
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>(x.startsWith(P)&&x!==C)||x.startsWith('crm-v11-')).map(x=>caches.delete(x)))).then(()=>self.clients.claim())));
self.addEventListener('message',e=>{if(e.data==='skipWaiting'||(e.data&&e.data.type==='skipWaiting'))self.skipWaiting()});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const u=new URL(e.request.url);
  if(u.origin!==location.origin)return;
  
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
