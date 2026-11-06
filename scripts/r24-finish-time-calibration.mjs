/**
 * R24 Ergebniszeit/absolute Rennzeit-Kalibrierung.
 * Exaktes Physikergebnis + hiervon ABGELEITETE Zeitgruppen, getrennt.
 * Fiktive Fahrer und synthetisch ergänzte Profile sind keine historische
 * Rekonstruktion: 2025er Sollzeiten nur externe Kontextwerte.
 */
import {resolve} from 'node:path';import {pathToFileURL} from 'node:url';
import {scoreFinishGroups} from '../src/engine/race/finish-time-groups.ts';
const [baselineDir,experimentDir,seedText,routeId]=process.argv.slice(2);
const official={
 tdf25_lille:{winnerS:3*3600+53*60+11,rule:'bunch-3s',name:'TdF 2025 Lille'},
 tdf25_boulogne:{winnerS:4*3600+45*60+41,rule:'road-1s',name:'TdF 2025 Boulogne'},
 lbl25_liege:{winnerS:6*3600+9,rule:'road-1s',name:'LBL 2025'},
 tdf25_hautacam:{winnerS:4*3600+21*60+19,rule:'road-1s',name:'TdF 2025 Hautacam'}
};
if(!baselineDir||!experimentDir||!seedText||!official[routeId])throw Error('AUDIT PR84 SEED ROUTE');
const seed=Number(seedText),spec=official[routeId];
if(!Number.isSafeInteger(seed)||seed<0)throw Error('invalid seed');
const m=(dir,name)=>import(pathToFileURL(resolve(dir)+'/src/engine/race/'+name+'.ts').href);
const [fixture,baseline,experiment]=await Promise.all([
 m(baselineDir,'reference-fixtures'),m(baselineDir,'race-simulator'),
 m(experimentDir,'race-simulator'),
]);
const input={...fixture.createReferenceFixture({routeId,seed}).input,
 groupRidingModel:'stable-pack'};
const toResult=(result)=>{
 const raw=result.classification;
 const grouped=scoreFinishGroups(raw.map(r=>({
   id:r.id,rank:r.rank,finishTimeS:r.finishTimeS})),spec.rule);
 const winnerTimeS=raw[0].finishTimeS;
 const groupMap=new Map();
 for(const r of grouped){
   const g=groupMap.get(r.finishGroup)??{
     group:r.finishGroup,leaderId:r.finishGroupLeaderId,
     timeS:r.creditedTimeS,gapS:r.creditedGapS,riders:[]};
   g.riders.push(r.id);groupMap.set(r.finishGroup,g);
 }
 const groups=[...groupMap.values()].map(g=>({
   group:g.group,leaderId:g.leaderId,
   size:g.riders.length,creditedGapS:g.gapS,
 }));
 const median=arr=>[...arr].sort((a,b)=>a-b)[Math.floor(arr.length/2)];
 const inGap=(col,t)=>col.filter(r=>r<=t).length;
 const credited=grouped.map(g=>g.creditedGapS);
 const physics=raw.map(g=>g.gapS);
 return {winnerId:raw[0].id,winnerTimeS:+winnerTimeS.toFixed(2),
   winnerTimeH:((n)=>[Math.floor(n/3600),Math.floor(n/60)%60,Math.floor(n)%60].map((v,i)=>i===0?String(v):String(v).padStart(2,'0')).join(':'))(winnerTimeS),
   winnerTimeDifferenceOfficialS:+(winnerTimeS-spec.winnerS).toFixed(2),
   winnerRelativeErrorPct:+((winnerTimeS/spec.winnerS-1)*100).toFixed(2),
   winnerSpeedKmh:+(input.segments.reduce((n,s)=>n+s.lengthM,0)/winnerTimeS*3.6).toFixed(2),
   finishers:raw.length,
   groups:groups.length,largestGroup:Math.max(...groups.map(g=>g.size)),
   winnerGroupSize:groups[0].size,firstTenSameTime:grouped.slice(0,10).filter(z=>z.finishGroup===0).length,
   medianRawGapS:+median(physics).toFixed(2),
   medianCreditedGapS:+median(credited).toFixed(2),
   within60Raw:inGap(physics,60),within60Credited:inGap(credited,60),
   within300Raw:inGap(physics,300),within300Credited:inGap(credited,300),
   topGroups:groups.slice(0,8),
   top10:grouped.slice(0,10).map(z=>({rank:z.rank,id:z.id,rawGapS:+z.rawGapS.toFixed(2),
     creditedGapS:z.creditedGapS,group:z.finishGroup})),
   finishTimeSpanS:+(raw.at(-1).finishTimeS-winnerTimeS).toFixed(2)
 };
};
const a=toResult(baseline.simulateRace(input)),b=toResult(experiment.simulateRace(input));
if(a.finishers!==154||b.finishers!==154||a.top10.length!==10||b.top10.length!==10)
 throw Error('Abbruch: Ergebnisinvariante nicht erfüllt');
console.log('R24_TIME_ACCEPT '+JSON.stringify({
 route:routeId,seed,rule:spec.rule,official2025:{winnerTimeS:spec.winnerS,kind:'reales historisches Rennen; fiktives Starterfeld und synthetische Profildaten'},audit:a,pr84:b,
}));
