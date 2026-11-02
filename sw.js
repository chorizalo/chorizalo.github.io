// Chorízalo: datos frescos primero; imágenes y estilos desde caché.
const V='chorizalo-v1';
const BASE=['/','/index.html','/ofertas.html','/img/mascota.png','/img/app-192.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(BASE)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(e.request.method!=='GET')return;
  const fresco=u.origin===location.origin&&(u.pathname.endsWith('.html')||u.pathname==='/'||u.pathname.includes('/data/'));
  if(fresco){
    e.respondWith(fetch(e.request).then(r=>{const c=r.clone();caches.open(V).then(x=>x.put(e.request,c));return r})
      .catch(()=>caches.match(e.request).then(r=>r||caches.match('/index.html'))));
    return;
  }
  if(u.origin===location.origin||u.hostname.endsWith('gstatic.com')||u.hostname.endsWith('googleapis.com')){
    e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(n=>{const c=n.clone();caches.open(V).then(x=>x.put(e.request,c));return n})));
  }
});
