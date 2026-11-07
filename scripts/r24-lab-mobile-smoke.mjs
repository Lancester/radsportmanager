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
 await page.locator('#tabs [data-tab="team"]').click();
 await page.locator('#myTeam').waitFor();
 const teamDropdowns=await page.locator('#teams select').count();
 if(teamDropdowns!==22)throw Error('22 Teams nicht geladen: '+teamDropdowns);
 const controls=await page.locator('#riderValues input').count();
 if(controls!==11)throw Error('11 Fahrerregler nicht geladen: '+controls);
 // Der Nutzer steuert nur ein Team und bestimmt den Kapitän selbst.
 await page.locator('#myTeam').selectOption('T01');
 const ownRiders=await page.locator('#rider option').count();
 if(ownRiders!==7)throw Error('Mein Team muss exakt sieben Fahrer anzeigen');
 await page.locator('#captain').selectOption('F003');
 await page.locator('#sprintLeader').selectOption('F003');
 await page.locator('#role-F004').selectOption('frei');
 if(await page.locator('#sprintLeader').inputValue()!=='F003'||
   await page.locator('#role-F004').inputValue()!=='frei')
   throw Error('Kapitän als Sprinter oder freie Rolle wird nicht gespeichert');
 const selectedCaptain=await page.locator('#captain').inputValue();
 if(selectedCaptain!=='F003')throw Error('Kapitänsauswahl nicht aktiv');
 const captainLabel=await page.locator('#captain option:checked').textContent();
 if(captainLabel.includes('Fiktiver Profi'))throw Error('Fahrernamen fehlen');
 const tacticControls=await page.locator('#tacticalFields select').count();
 if(tacticControls!==6)throw Error('6 Taktikregler nicht geladen: '+tacticControls);
 await page.locator('#tactical-attackRisk').selectOption('keine');
 await page.locator('#tactical-attackPhase').selectOption('frueh');
 await page.locator('#tactical-chasePolicy').selectOption('vermeiden');
 await page.locator('#tactical-teamTempo').selectOption('sparen');
 await page.locator('#tactical-finale').selectOption('sprint');
 if(await page.locator('#myStrategy').inputValue()!=='sprint')
   throw Error('Finale Sprint muss die tatsächliche Teamstrategie Sprint sichtbar aktivieren');
 await page.locator('#myStrategy').selectOption('offensiv');
 if(await page.locator('#tactical-finale').inputValue()!=='situativ')
   throw Error('Gegenläufige Teamstrategie muss veraltetes Finale-Sprint-Ziel auflösen');
 await page.locator('#tactical-finale').selectOption('kapitaen');
 await page.locator('#tactical-leaderProtection').selectOption('hoch');
 if(await page.locator('#tactical-chasePolicy').inputValue()!=='vermeiden')
   throw Error('Taktikänderung nicht in UI wirksam');
 const scrollWidth=await page.evaluate(()=>document.documentElement.scrollWidth);
 const inner=await page.evaluate(()=>window.innerWidth);
 if(scrollWidth>inner+3)throw Error('Mobile horizontale Seitenverschiebung '+scrollWidth+' > '+inner);
 await page.locator('#tabs [data-tab="race"]').click();
 await page.locator('#teamCount').fill('2');
 await page.locator('#teamCount').dispatchEvent('change');
 await page.locator('#tabs [data-tab="team"]').click();
 await page.locator('#myStrategy').selectOption('offensiv');
 await page.locator('#quickRun').click();
 await page.waitForFunction(()=>parseInt(document.querySelector('#racePct')?.textContent)>0,
   undefined,{timeout:30000});
 await page.waitForFunction(()=>document.querySelector('#status')?.textContent?.includes('Rennen abgeschlossen'),
   undefined,{timeout:180000});
 const firstProgress=await page.locator('#racePct').textContent();
 const feedItems=await page.locator('#liveFeed li').count();
 if(feedItems<2)throw Error('Liveticker ohne echte Zwischenstände');
 const rows=await page.locator('#results tr').count();
 if(rows!==14)throw Error('Kein echtes 14-Fahrer-Ergebnis: '+rows);
 const teamRiders=await page.locator('#teamRiders tr').count();
 if(teamRiders!==7)throw Error('Teamergebnis mit sieben eigenen Fahrern fehlt');
 const summary=await page.locator('#teamSummary').textContent();
 if(!summary.includes('Kapitän')||!summary.includes('Platz'))
   throw Error('Personalisierter Rennbericht unvollständig');
 const report=await page.locator('#report li').count();
 if(report<4)throw Error('Rennbericht fehlt');
 const smallStatus=await page.locator('#status').textContent();
 // Vollständiges Referenzfeld: echte Browser-Grenze einschließlich Worker.
 await page.locator('#tabs [data-tab="race"]').click();
 await page.locator('#teamCount').fill('22');
 await page.locator('#teamCount').dispatchEvent('change');
 await page.locator('#tabs [data-tab="live"]').click();
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
 await page.locator('#tabs [data-tab="team"]').click();
 await page.locator('#myTeam').waitFor();
 await page.waitForFunction(()=>document.querySelector('#offlineInfo')?.textContent?.includes('Offline bereit'),
   undefined,{timeout:30000}).catch(async()=>{
     throw Error('Offline-Status nach Neustart: '+await page.locator('#offlineInfo').textContent());
   });
 await page.locator('#tabs [data-tab="race"]').click();
 await page.locator('#teamCount').fill('2');
 await page.locator('#teamCount').dispatchEvent('change');
 await page.locator('#tabs [data-tab="live"]').click();
 await page.locator('#run').click();
 await page.waitForFunction(()=>document.querySelector('#status')?.textContent?.includes('Rennen abgeschlossen'),
   undefined,{timeout:90000});
 const offlineRows=await page.locator('#results tr').count();
 if(offlineRows!==14)throw Error('Offline-Rennberechnung gescheitert: '+offlineRows);
 if(errors.length)throw Error('Browserkonsole: '+errors.join('; '));
 await page.screenshot({path:'rennlabor-mobile-smoke.png',fullPage:true});
 console.log(JSON.stringify({mobile:'Pixel 7 Chromium',teams:teamDropdowns,
   riderControls:controls,tacticControls,ownRiders,selectedCaptain,teamRiders,testFinishers:rows,fullFinishers:onlineResultRows,
   offlineFinishers:offlineRows,cachedState,reportLines:report,firstProgress,feedItems,
   scrollWidth,inner,smallStatus,fullStatus}));
}finally{
 await browser?.close();await new Promise(ok=>server.close(ok));
}
