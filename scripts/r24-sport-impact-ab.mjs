/** R24: sportliche Gegenprobe ausschließlich zu PR #84.
 * Getrennte vollständige Checkouts, je Rennen exakt identische Eingaben.
 * node --experimental-strip-types scripts/r24-sport-impact-ab.mjs AUDIT VERSUCH 2026 tdf25_boulogne
 */
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
const [auditArg,variantArg,seedArg,routeId]=process.argv.slice(2);
if(!auditArg||!variantArg||!seedArg||!['tdf25_boulogne','tdf25_hautacam'].includes(routeId))
  throw new Error('AUDIT VERSUCH SEED tdf25_boulogne|tdf25_hautacam');
const seed=Number(seedArg);
if(!Number.isSafeInteger(seed)||seed<0)throw new Error('Seed ungueltig');
const mod=(root,name)=>import(pathToFileURL(resolve(root)+'/src/engine/race/'+name+'.ts').href);
const [reference,baseline,experiment]=await Promise.all([
  mod(auditArg,'reference-fixtures'),mod(auditArg,'race-simulator'),mod(variantArg,'race-simulator')]);
const f=reference.createReferenceFixture({routeId,seed});
const rMap=new Map(f.input.riders.map(r=>[r.id,r]));
const summarize=(r)=>{
  const sorted=[...r.classification].sort((a,b)=>a.gapS-b.gapS);
  const metric=(a)=>+a.toFixed(2);
  const checkpoints=(r.checkpoints??[]).map(c=>({
    km:metric(c.km),
    topGroup:c.groupSizes[0]??0,
    largest:c.largestGroup,
    groups:c.groupCount,
    spanM:metric(c.frontToBackM),
    leaders:c.riders.filter(x=>x.groupIndex===0).length,
    closeToLeaderM:{
      '60':c.riders.filter(x=>x.gapToLeaderM<=60).length,
      '300':c.riders.filter(x=>x.gapToLeaderM<=300).length,
    },
    // Alle Fahrer im Gruppenindex null und groesste Gruppe sind nicht zwingend gleich.
    winnerAtCheckpoint:(()=>{const q=c.riders.find(x=>x.riderId===r.winnerId);return q?{group:q.groupIndex,gapM:metric(q.gapToLeaderM),wPrimePct:metric(q.wPrimeRemainingPct),endurancePct:metric(q.enduranceAvailabilityPct)}:null;})(),
  }));
  const groupsAtFinish=sorted.reduce((a,v)=>{const k=Math.floor(v.gapS/60);a[k]=(a[k]??0)+1;return a;},{});
  const top10=r.classification.slice(0,10).map(q=>({
    id:q.id,rank:q.rank,type:rMap.get(q.id)?.specialty,
    cp:rMap.get(q.id)?.criticalPowerW,mass:rMap.get(q.id)?.massKg,
    gapS:metric(q.gapS),wPrimeEnd:metric(q.finalWPrimeJ),
    endurancePct:metric(q.endurancePowerAvailability*100)}));
  const eventByKind=Object.fromEntries(['attack','chase','group-split','breakaway','breakaway-caught','team-chase'].map(k=>
    [k,r.events.filter(e=>e.type===k).length]));
  const lateEvents=r.events.filter(e=>e.km>r.distanceM/1000-35&&
    ['attack','group-split','breakaway','breakaway-caught'].includes(e.type))
    .slice(0,14).map(e=>({km:metric(e.km),type:e.type,id:e.riderId??null}));
  return {
    winner:r.winnerId,winnerType:rMap.get(r.winnerId)?.specialty,
    top10,finishers:r.finisherCount,
    medianGapS:metric((sorted[76].gapS+sorted[77].gapS)/2),
    q25GapS:metric(sorted[38].gapS),q75GapS:metric(sorted[115].gapS),
    within30:sorted.filter(q=>q.gapS<=30).length,
    within60:sorted.filter(q=>q.gapS<=60).length,
    within120:sorted.filter(q=>q.gapS<=120).length,
    within300:sorted.filter(q=>q.gapS<=300).length,
    finishMinuteBins:Object.entries(groupsAtFinish).slice(0,12),
    checkpoints:checkpoints.filter(c=>c.km>=20),
    events:eventByKind,lateEvents,
    namedChaseHandoffs:r.diagnostics.namedChaseHandoffs?.length??null,
    maximumEndurancePenalty:metric(r.diagnostics.maximumEndurancePenalty),
  };
};
const a=summarize(baseline.simulateRace(f.input.groupRidingModel==='stable-pack'?f.input:{
  ...f.input,groupRidingModel:'stable-pack',diagnosticLevel:'checkpoints'
}));
const b=summarize(experiment.simulateRace({...f.input,groupRidingModel:'stable-pack',diagnosticLevel:'checkpoints'}));
console.log('R24_SPORT_AB '+JSON.stringify({seed,routeId,audit:a,experiment:b}));
