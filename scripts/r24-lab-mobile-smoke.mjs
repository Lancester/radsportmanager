/* GitHub CI: echte mobile Browser-Ausführung ohne fremden Hostinganbieter.
 * Statischer HTTP-Server nur innerhalb des CI-Jobs, Browser Pixel 7.
 */
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {resolve,extname,sep} from 'node:path';
import {chromium,devices} from 'playwright';
const root=resolve('docs/labor');
const type={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8',
 '.json':'application/json; charset=utf-8','.svg':'image/svg+xml'};
const server=createServer(async(req,res)=>{
 try {
   const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
   const path=resolve(root,'.'+pathname);
   if(!(path===root||path.startsWith(root+sep)))throw Error('Pfad außerhalb');
   const target=path===root?resolve(root,'index.html'):path;
   const body=await readFile(target);
   res.writeHead(200,{'Content-Type':type[extname(target)]??'application/octet-stream',
     'Cache-Control':'no-store'});res.end(body);
 }catch(e){res.writeHead(404);res.end('Not found');}
});
await new Promise(ok=>server.listen(0,'127.0.0.1',ok));
const port=server.address().port;
let browser;
try {
 browser=await chromium.launch({headless:true});
 const context=await browser.newContext({...devices['Pixel 7'],locale:'de-DE'});
 const page=await context.newPage();
 const errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
 await page.goto('http://127.0.0.1:'+port+'/index.html');
 await page.locator('#teams select').first().waitFor();
 const teamDropdowns=await page.locator('#teams select').count();
 if(teamDropdowns!==22)throw Error('22 Teams nicht geladen: '+teamDropdowns);
 const controls=await page.locator('#riderValues input').count();
 if(controls!==11)throw Error('11 Fahrerregler nicht geladen: '+controls);
 const scrollWidth=await page.evaluate(()=>document.documentElement.scrollWidth);
 const inner=await page.evaluate(()=>window.innerWidth);
 if(scrollWidth>inner+3)throw Error('Mobile horizontale Seitenverschiebung '+scrollWidth+' > '+inner);
 await page.locator('#teamCount').fill('2');
 await page.locator('#teamCount').dispatchEvent('change');
 await page.locator('#teams select').first().selectOption('offensiv');
 await page.locator('#run').click();
 await page.waitForFunction(()=>document.querySelector('#status')?.textContent?.includes('Rennen abgeschlossen'),
   undefined,{timeout:180000});
 const rows=await page.locator('#results tr').count();
 if(rows!==14)throw Error('Kein echtes 14-Fahrer-Ergebnis: '+rows);
 const report=await page.locator('#report li').count();
 if(report<4)throw Error('Rennbericht fehlt');
 const smallStatus=await page.locator('#status').textContent();
 // Vollständiges Referenzfeld: echte Browser-Grenze einschließlich Worker.
 await page.locator('#teamCount').fill('22');
 await page.locator('#teamCount').dispatchEvent('change');
 await page.locator('#run').click();
 await page.waitForFunction(()=>document.querySelector('#status')?.textContent?.includes('Rennen abgeschlossen'),
   undefined,{timeout:240000});
 const fullRows=await page.locator('#results tr').count();
 if(fullRows!==154)throw Error('Volles Android-Rennen fehlgeschlagen: '+fullRows);
 const fullStatus=await page.locator('#status').textContent();
 // Service worker: Alle Module vorab lokal cachen und offline erneut starten.
 await page.waitForFunction(()=>document.querySelector('#offlineInfo')?.textContent?.includes('Offline bereit'),
   undefined,{timeout:30000});
 const cachedState=await page.locator('#offlineInfo').textContent();
 const onlineResultRows=fullRows;
 await context.setOffline(true);
 await page.reload({waitUntil:'domcontentloaded'});
 await page.locator('#teams select').first().waitFor();
 await page.waitForFunction(()=>document.querySelector('#offlineInfo')?.textContent?.includes('Offline bereit'),
   undefined,{timeout:30000}).catch(async()=>{
     throw Error('Offline-Status nach Neustart: '+await page.locator('#offlineInfo').textContent());
   });
 await page.locator('#teamCount').fill('2');
 await page.locator('#teamCount').dispatchEvent('change');
 await page.locator('#run').click();
 await page.waitForFunction(()=>document.querySelector('#status')?.textContent?.includes('Rennen abgeschlossen'),
   undefined,{timeout:90000});
 const offlineRows=await page.locator('#results tr').count();
 if(offlineRows!==14)throw Error('Offline-Rennberechnung gescheitert: '+offlineRows);
 if(errors.length)throw Error('Browserkonsole: '+errors.join('; '));
 await page.screenshot({path:'rennlabor-mobile-smoke.png',fullPage:true});
 console.log(JSON.stringify({mobile:'Pixel 7 Chromium',teams:teamDropdowns,
   riderControls:controls,testFinishers:rows,fullFinishers:onlineResultRows,
   offlineFinishers:offlineRows,cachedState,reportLines:report,scrollWidth,inner,smallStatus,fullStatus}));
}finally{
 await browser?.close();await new Promise(ok=>server.close(ok));
}
