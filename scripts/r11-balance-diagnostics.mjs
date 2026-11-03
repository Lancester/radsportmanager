/**
 * R-11: kleine manuelle Balancing-Diagnose (7 vollständige 50-km-Rennen).
 * Keine Monte-Carlo-Validierung und keine empirische Profi-Rennkalibrierung.
 * Aufruf: node --experimental-strip-types scripts/r11-balance-diagnostics.mjs
 */
import {performance} from 'node:perf_hooks';
import {createRaceExample,simulateRace}
  from '../src/engine/race/race-simulator.ts';
import {auditRace} from '../src/engine/race/race-audit.ts';

function run(label,config,mutate=()=>{}){
  const input=createRaceExample(config);
  mutate(input);
  const start=performance.now();
  const result=simulateRace(input);
  const audit=auditRace(result);
  const f01=result.classification.find(r=>r.id==='F01');
  const f03=result.classification.find(r=>r.id==='F03');
  const concise={
    label,seed:audit.seed,profile:config.profile,
    strategy:config.homeStrategy,
    winner:audit.winnerId,finishers:audit.finishers,
    maximumGroups:audit.maximumGroups,
    medianSnapshotGroups:audit.medianSnapshotGroups,
    largestSnapshotGroup:audit.largestSnapshotGroup,
    singletonRiderShare:+audit.singletonRiderShare.toFixed(3),
    lastGapS:+audit.finishSpreadS.toFixed(1),
    medianGapS:+audit.medianGapS.toFixed(1),
    breakaways:audit.confirmedBreakaways,
    caught:audit.actualCatches,
    chases:audit.chaseStarts,attacks:audit.attackStarts,
    meanCrankW:+audit.averageCrankPowerW.toFixed(1),
    f01TimeS:+f01.finishTimeS.toFixed(3),
    f03TimeS:+f03.finishTimeS.toFixed(3),
    runtimeMs:+(performance.now()-start).toFixed(1),
  };
  console.log('R11-LAUF',JSON.stringify(concise));
  return {result,audit};
}
for(const seed of [2026,2027]){
  const protectedHilly=run('huegelig-geschuetzt-'+seed,{
    profile:'wellig',homeStrategy:'kapitaen_schuetzen',seed,
  });
  const attackingHilly=run('huegelig-offensiv-'+seed,{
    profile:'wellig',homeStrategy:'offensiv',seed,
  });
  run('flach-sprint-'+seed,{
    profile:'flach',homeStrategy:'sprint',seed,
  });
  const time=(r,id)=>r.result.classification.find(x=>x.id===id).finishTimeS;
  console.log('R11-TAKTIKVERGLEICH',JSON.stringify({
    seed,captainId:'F01',
    offensiveGainS:+(time(protectedHilly,'F01')-
      time(attackingHilly,'F01')).toFixed(3),
    sameWinner:protectedHilly.result.winnerId===attackingHilly.result.winnerId,
  }));
}
const base=run('profil-standard-2026',{
  profile:'wellig',homeStrategy:'kapitaen_schuetzen',seed:2026,
});
const weaker=run('profil-helfer-F03-schwach-2026',{
  profile:'wellig',homeStrategy:'kapitaen_schuetzen',seed:2026,
},input=>{
  const rider=input.riders.find(r=>r.id==='F03');
  rider.criticalPowerW*=0.88;
  rider.ftpW*=0.88;
  rider.wPrimeJ*=0.88;
});
const finish=(x,id)=>x.result.classification.find(r=>r.id===id).finishTimeS;
console.log('R11-PROFILVERGLEICH',JSON.stringify({
  riderId:'F03',
  reducedCpFtpWPrimePercent:12,
  timeLossS:+(finish(weaker,'F03')-finish(base,'F03')).toFixed(3),
  maxGroupsBase:base.audit.maximumGroups,
  maxGroupsChanged:weaker.audit.maximumGroups,
}));
