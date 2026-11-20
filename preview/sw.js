const P='crm-preview-',C="crm-preview-v1.8.23-5c7554f7";
const PRE=["./","./index.html","./manifest.webmanifest","./favicon.svg","./icons/apple-touch-icon.png","./icons/icon-192.png","./icons/icon-512-maskable.png","./icons/icon-512.png","./data/core.json?v=5c7554f7","./data/ls-medtronic.json?v=5c7554f7","./data/ls-abbott.json?v=5c7554f7","./data/ls-boston-scientific.json?v=5c7554f7","./data/ls-biotronik.json?v=5c7554f7","./data/nomen.json?v=5c7554f7","./data/recalls.json?v=5c7554f7","./img/abbott-portfolio-gallant.webp","./img/abbott-portfolio-entrant.webp","./img/abbott-ellipse-205px.webp","./img/abbott-fortifya-205px.webp","./img/abbott-quadraassura.webp","./img/abbott-quadraalluremp.webp","./img/abbott-assert-iq-icm-dm5500.webp","./img/abbott-assert-iq-icm-dm5300.webp","./img/abbott-crm-icm-jot-dx-product.webp","./img/abbott-aveir-pacemaker-205.webp","./img/abbott-aveir-dr-dual-chamber.webp","./img/abbott-aveirar-205.webp","./img/abbott-assurity-205px.webp","./img/abbott-endurity-205px.webp","./img/boston-scientific-resonate-20hf-product-1.webp","./img/boston-scientific-resonate-hf-600x600.webp","./img/boston-scientific-perciva-mini-600x600.webp","./img/boston-scientific-luxdx-hero-d.webp","./img/boston-scientific-647840-1.webp","./img/boston-scientific-momentum-20x4-20crt-d.webp","./img/boston-scientific-vigilant-20x4-crt-d.webp","./img/boston-scientific-accolade-mri-20gs1.webp","./img/boston-scientific-emblem-sicd.webp","./img/boston-scientific-visionist-lead-x4-gs1.webp","./img/biotronik-bio35990-amvia-edge-hf-t-qp-jpg.webp","./img/biotronik-bio32672-edora-8-hf-t-qp.webp","./img/biotronik-bio35967-amvia-edge-dr-t-jpg.webp","./img/biotronik-amvia-edge-sr-t-jpg.webp","./img/biotronik-bio32684-edora-8-dr-t-png.webp","./img/biotronik-bio32677-edora-8-sr-t-jpg.webp","./img/biotronik-bio37905-biomonitor-iv-0.webp","./img/biotronik-biomonitor-iiim-jpg.webp","./img/biotronik-acticor-207-20vr-t-20dx-jpg.webp","./img/biotronik-rivacor-207-20dr-t-jpg.webp","./img/biotronik-bio27514-acticor-7-hf-t-qp-jpg.webp","./img/biotronik-bio27515-acticor-7-hf-t-jpg.webp","./img/biotronik-bio27527-rivacor-7-hf-t-qp-jpg.webp","./img/biotronik-bio27413-ilivia-neo-7-hf-t-qp.webp","./img/biotronik-bio21716-sentus-otw-qp-s-xx-49-jpg.webp","./img/biotronik-bio27873-plexa-s-dx-jpg.webp","./img/medtronic-178654-cobalt-dr.webp","./img/medtronic-178287-cobalt-vr.webp","./img/medtronic-178601-visia-af.webp","./img/medtronic-178660-cobalt-hf-quad.webp","./img/medtronic-178661-crome-hf-quad.webp","./img/medtronic-178662-percepta-quad.webp","./img/medtronic-178663-serena-quad.webp","./img/medtronic-178664-solara-quad.webp","./img/medtronic-178670-amplia.webp","./img/medtronic-178672-claria-mri-quad.webp","./img/medtronic-178288-attain-stability-quad.webp","./img/medtronic-178610-linq-ii-02.webp","./img/medtronic-178612-linq-image.webp","./img/medtronic-186379-aurora-beauty-hero-png.webp","./img/medtronic-178619-micra-av-vertical.webp","./vendor/pptxgen.bundle.js?v=5c7554f7"];
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
