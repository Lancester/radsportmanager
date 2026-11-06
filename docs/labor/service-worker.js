/* Rennlabor Offline: all compiled source modules are precached on install.
 * Fails closed if any source module missing; retains previous complete cache.
 * Nothing is fetched during race calculation or saved to a server.
 */
const VERSION='renn-labor-rc1-offline-v1';
const manifestPath=new URL('./offline-assets.json',self.registration.scope);
self.addEventListener('install',event=>{
  event.waitUntil((async()=>{
    const response=await fetch(manifestPath,{cache:'no-store'});
    if(!response.ok)throw Error('Offline-Manifest nicht erreichbar');
    const files=await response.json();
    if(!Array.isArray(files)||files.length<12||
      files.some(p=>typeof p!=='string'||!p.startsWith('./')||p.includes('..')))
      throw Error('Offline-Manifest ungültig');
    const cache=await caches.open(VERSION);
    await cache.addAll(files.map(path=>new URL(path,self.registration.scope).toString()));
    await self.skipWaiting();
  })());
});
self.addEventListener('activate',event=>{
  event.waitUntil((async()=>{
    for(const name of await caches.keys()){
      if(name.startsWith('renn-labor-')&&name!==VERSION)await caches.delete(name);
    }
    await self.clients.claim();
  })());
});
self.addEventListener('fetch',event=>{
  const url=new URL(event.request.url);
  if(event.request.method!=='GET'||url.origin!==self.location.origin||
    !url.pathname.startsWith(new URL(self.registration.scope).pathname))return;
  event.respondWith((async()=>{
    const cached=await caches.match(event.request);
    if(cached)return cached;
    // Deliberately no cross-origin network dependencies. Failed assets remain
    // visible as explicit failures instead of silently using a stale version.
    return fetch(event.request);
  })());
});
