/** Zwei synthetische Zusatzszenarien; getrennt von den vier Referenzen. */
import {pathToFileURL} from 'node:url';
import {writeFileSync,renameSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {performance} from 'node:perf_hooks';
const [root,routeId,seedText,roster,out]=process.argv.slice(2);
if(!root||!routeId||!seedText||!['common','profile'].includes(roster)||!out)throw Error('root route seed roster out erforderlich');
const seed=Number(seedText),load=p=>import(pathToFileURL(root+'/src/engine/race/'+p+'.ts').href);
const {createReferenceFixture}=await load('reference-fixtures');
const {simulateRace}=await load('race-simulator');
const {categoryStrength,buildRiderFavoritesAudit}=await load('rider-strength-audit');
if(!['synthetic_crosswind','synthetic_transition'].includes(routeId)||roster!=='common')throw Error('Unbekanntes Zusatzszenario');
const f=createReferenceFixture({routeId:'tdf25_lille',seed});
const prefix=(segments,cut)=>{let pos=0,out=[];for(const s of segments){const take=Math.min(s.lengthM,Math.max(0,cut-pos));if(take>0)out.push({...s,lengthM:take});pos+=s.lengthM;}return out;};
if(routeId==='synthetic_crosswind'){
 const cut=124900;let pos=0;const segments=[];
 for(const s of f.input.segments){const end=pos+s.lengthM;if(pos<cut&&end>cut){segments.push({...s,lengthM:cut-pos});segments.push({...s,lengthM:end-cut,crosswindMps:6});}else segments.push({...s,...(pos>=cut?{crosswindMps:6}:{})});pos=end;}
 f.input.segments=segments;
}else{
 f.input.segments=[...prefix(f.input.segments,169900),
  {name:'Synthetischer Anstieg',lengthM:3000,gradeFraction:.06,rollingCoefficient:.004,descentTechnicality:.12},
  {name:'Synthetische Abfahrt',lengthM:5000,gradeFraction:-.036,rollingCoefficient:.004,descentTechnicality:.45},
  {name:'Synthetisches Flachfinale',lengthM:7000,gradeFraction:0,rollingCoefficient:.004,descentTechnicality:.12}];
 f.route={...f.route,kind:'huegelig'};
}
const field=createReferenceFixture({routeId:'tdf25_lille',seed});
const input={...f.input,teams:field.input.teams,riders:field.input.riders,groupRidingModel:'stable-pack',diagnosticLevel:'checkpoints'};
const cat={flach:'sprinter',huegelig:'klassiker',klassiker:'klassiker',berg:'kletterer'}[f.route.kind];
const pre=categoryStrength(input.riders,cat,false);
const preCategory=['sprinter','kletterer','klassiker','zeitfahrer','allrounder'].map(x=>({category:x,top:categoryStrength(input.riders,x,true).slice(0,3)}));
const hash=x=>createHash('sha256').update(JSON.stringify(x)).digest('hex');
const comparableRiders=input.riders.map(({durabilityFactor,wPrimeRecoveryFactor,...r})=>r);
const fingerprints={commonInputs:hash({segments:input.segments,teams:input.teams,riders:comparableRiders,seed}),fullRiders:hash(input.riders)};
const t=performance.now();
const r=simulateRace(input);
if(r.classification.length!==input.riders.length||r.classification.some(x=>!Number.isFinite(x.finishTimeS)||!Number.isFinite(x.gapS)||Math.abs(x.energyResidualJ)>.05||x.finalWPrimeJ<0))throw Error('Unvollständiges oder unplausibles Ergebnis');
const fav=buildRiderFavoritesAudit(input.riders,r.classification,f.route.kind);
if(JSON.stringify(pre.slice(0,3).map(x=>x.riderId))!==JSON.stringify(fav.profileTopThree.map(x=>x.riderId)))throw Error('Vorabfavoriten stimmen nicht überein');
const groups=threshold=>{const a=[...r.classification].sort((x,y)=>x.finishTimeS-y.finishTimeS),out=[]; for(const x of a){const last=out.at(-1);if(!last||x.finishTimeS-last.last>=threshold){out.push({first:x.id,firstTime:x.finishTimeS,last:x.finishTimeS,members:[x.id]});}else{last.last=x.finishTimeS;last.members.push(x.id);}}return out.map(g=>({first:g.first,size:g.members.length,gapS:g.firstTime-a[0].finishTimeS,ids:g.members}));};
const watch=new Set([...pre.slice(0,3).map(x=>x.riderId),...preCategory.flatMap(x=>x.top.slice(0,1).map(y=>y.riderId)),r.winnerId]);
const checkpoints=(r.checkpoints??[]).map(c=>({km:c.km,groupSizes:c.groupSizes,groupCount:c.groupCount,largestGroup:c.largestGroup,riders:c.riders.filter(x=>watch.has(x.riderId))}));
const data={route:routeId,kind:f.route.kind,distanceKm:f.route.distanceKm,seed,roster,model:'stable-pack',fingerprints,preRace:{category:cat,top10:pre.slice(0,10),categoryTopThree:preCategory},favorites:fav,classification:r.classification,events:r.events,diagnostics:r.diagnostics,checkpoints,groups1s:groups(1),groups3s:groups(3),elapsedS:(performance.now()-t)/1000};
writeFileSync(out+'.tmp',JSON.stringify(data));renameSync(out+'.tmp',out);
console.log(JSON.stringify({routeId,seed,roster,seconds:data.elapsedS,winner:r.winnerId,fingerprint:fingerprints.commonInputs,groups1s:data.groups1s.length}));
