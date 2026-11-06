/** Manueller isolierter Paarvergleich gegen exakt denselben Audit-Checkout.
 * node --experimental-strip-types scripts/r24-negative-accel-ab.mjs AUDIT VERSUCH control|full SEED
 */
import {resolve} from 'node:path';import {pathToFileURL} from 'node:url';
const [basePath,testPath,mode='control',seedText='2026']=process.argv.slice(2);if(!basePath||!testPath)throw Error('Zwei Checkout-Pfade nötig');
const seed=Number(seedText);if(!Number.isSafeInteger(seed)||seed<0)throw Error('Ungültiger Seed');
const segment=(name,lengthM,gradeFraction)=>({name,lengthM,gradeFraction,descentTechnicality:0});
const cases={
  flach:[segment('Ebene',30000,0)],
  anstieg_flach:[segment('Ebene',10000,0),segment('Anstieg',5000,.04),segment('Ebene',15000,0)],
  anstieg_abfahrt:[segment('Ebene',10000,0),segment('Anstieg',5000,.04),segment('Abfahrt',5000,-.04),segment('Ebene',10000,0)],
  langer_uebergang:[segment('Ebene',10000,0),segment('Anstieg',5000,.04),segment('Zwischenebene',2000,0),segment('Abfahrt',5000,-.04),segment('Ebene',8000,0)],
};
const modules=async path=>{const root=resolve(path);const get=n=>import(pathToFileURL(root+'/src/engine/race/'+n+'.ts').href);return {fixture:(await get('reference-fixtures')).createReferenceFixture,simulate:(await get('race-simulator')).simulateRace}};
const [base,variant]=await Promise.all([modules(basePath),modules(testPath)]);
const scenarios=mode==='control'?Object.entries(cases).map(([name,segments])=>({name,segments,control:true})):mode==='full'?['tdf25_lille','tdf25_boulogne','tdf25_hautacam'].map(name=>({name,control:false})):[];
if(!scenarios.length)throw Error('Mode control oder full');
for(const s of scenarios){
 const f=base.fixture({routeId:s.control?'tdf25_hautacam':s.name,seed}).input;
 const input={...f,groupRidingModel:'stable-pack',diagnosticLevel:'checkpoints',...(s.control?{title:s.name,segments:s.segments,disableAttacks:true,enduranceModel:'off',teams:f.teams.map(t=>({...t,strategy:'ausgewogen'}))}:{})};
 const run=sim=>{const r=sim(input);const gaps=r.classification.map(x=>x.gapS).sort((a,b)=>a-b);const cp=r.checkpoints??[];return {winner:r.winnerId,top10:r.classification.slice(0,10).map(x=>x.id),medianGapS:+((gaps[76]+gaps[77])/2).toFixed(2),finishers:r.finisherCount,attacks:r.diagnostics.attacks,breakaways:r.diagnostics.breakaways,groups:cp.map(x=>({km:+x.km.toFixed(2),largest:x.largestGroup,groupCount:x.groupCount,spanM:+x.frontToBackM.toFixed(2)})),finishWithin60:r.classification.filter(x=>x.gapS<=60).length};};
 const a=run(base.simulate);const b=run(variant.simulate);
 console.log('R24_AB '+JSON.stringify({mode,seed,scenario:s.name,audit:a,experiment:b}));
}
