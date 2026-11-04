/**
 * R-22: kleiner, gezielter Profil-Smoketest der bestehenden stable-pack-KI.
 *
 * Vier bereits vorhandene 154-Fahrer-Einzelrennen; je Profil GENAU EIN Seed,
 * keine zusätzlichen A/B-Varianten oder Monte-Carlo-Serie.
 * Standard-Seed 2026, neue Seeds nur durch bewussten Einzelaufruf.
 * Führt selbst keine Veränderungen an Physik, KI oder Ergebnissen durch.
 */
import {performance} from 'node:perf_hooks';
import {createReferenceFixture,REFERENCE_ROUTES}
  from '../src/engine/race/reference-fixtures.ts';
import {simulateRace} from '../src/engine/race/race-simulator.ts';
import {finishGroupMetrics} from '../src/engine/race/finish-groups.ts';
import {auditRace} from '../src/engine/race/race-audit.ts';
import {buildRiderFavoritesAudit} from '../src/engine/race/rider-strength-audit.ts';

const ids=Object.keys(REFERENCE_ROUTES);
const args={route:'all',seed:'2026'};
for(let i=2;i<process.argv.length;i+=2){
  const flag=process.argv[i],value=process.argv[i+1];
  if(!value||!['--route','--seed'].includes(flag))
    throw new Error('R-22 Profil-Smoke: ungültiger Parameter '+flag);
  args[flag.slice(2)]=value;
}
const seed=Number(args.seed);
if(!Number.isSafeInteger(seed)||seed<0||seed>2147483647)
  throw new Error('R-22 Profil-Smoke: Seed außerhalb 0–2147483647');
if(args.route!=='all'&&!ids.includes(args.route))
  throw new Error('R-22 Profil-Smoke: unbekannte Strecke');
const routes=args.route==='all'?ids:[args.route];
const n=x=>+x.toFixed(2);
const median=arr=>{
  const a=[...arr].sort((x,y)=>x-y),m=Math.floor(a.length/2);
  return a.length%2?a[m]:(a[m-1]+a[m])/2;
};
const results=[];
for(const id of routes){
  const start=performance.now();
  const fixture=createReferenceFixture({routeId:id,seed});
  const kindByRider=new Map(fixture.input.riders.map(r=>[r.id,r.specialty]));
  const r=simulateRace({...fixture.input,
    groupRidingModel:'stable-pack',diagnosticLevel:'checkpoints'});
  if(r.finisherCount!==154||r.classification.length!==154)
    throw new Error('R-22 Profil-Smoke: nicht alle 154 Fahrer im Ziel '+id);
  if(r.classification.some(x=>Math.abs(x.energyResidualJ)>.05||
    x.finalWPrimeJ<0||!Number.isFinite(x.finishTimeS)||
    !Number.isFinite(x.averageCrankPowerW)))
    throw new Error('R-22 Profil-Smoke: physikalische Invariante '+id);
  const groups=finishGroupMetrics(r.classification);
  const audit=auditRace(r);
  const checkpoint=progress=>(r.checkpoints??[]).find(x=>
    x.km>=fixture.route.distanceKm*progress)??r.checkpoints?.at(-1);
  const c25=checkpoint(.25),c50=checkpoint(.5),c75=checkpoint(.75);
  const details={
    route:id,profile:fixture.route.kind,km:fixture.route.distanceKm,
    seed,participants:154,model:'stable-pack',
    winnerId:r.winnerId,winnerType:kindByRider.get(r.winnerId),
    winnerSpeedKmh:n(r.distanceM/r.classification[0].finishTimeS*3.6),
    winnerGroup:groups.winnerGroupSize,
    largestFinishGroup:groups.largestGroupSize,
    largestFinishGroupGapS:groups.largestGroupGapToWinnerS,
    within60s:groups.within60sOfWinner,
    within180s:groups.within180sOfWinner,
    medianFinishGapS:n(audit.medianGapS),
    maximumGroups:audit.maximumGroups,
    largestGroupAt25Pct:c25?.largestGroup??null,
    largestGroupAt50Pct:c50?.largestGroup??null,
    largestGroupAt75Pct:c75?.largestGroup??null,
    medianWPrimeAt50Pct:c50?n(median(c50.riders.map(x=>
      x.wPrimeRemainingPct))):null,
    avgCrankW:n(audit.averageCrankPowerW),
    averageAeroFactor:n(r.diagnostics.meanAeroFactor),
    maximumEndurancePenaltyPct:n(r.diagnostics.maximumEndurancePenalty*100),
    attacks:audit.attackStarts,breakaways:audit.confirmedBreakaways,
    catches:audit.actualCatches,
    actualChaseFrontS:r.diagnostics.mainFieldFrontWorkWithAssignedChaserS??0,
    chaseLeaderChanges:r.diagnostics.mainFieldChaserLeaderChanges??0,
    climbingTempoSeconds:r.diagnostics.climbingTempoSeconds??0,
    top10Types:r.classification.slice(0,10).map(x=>kindByRider.get(x.id)),
    runtimeS:n((performance.now()-start)/1000),
  };
  results.push(details);
  console.log('R22-PROFILE '+JSON.stringify(details));
  const favorites=buildRiderFavoritesAudit(fixture.input.riders,
    r.classification,fixture.route.kind);
  console.log('R22-FAVORITES '+JSON.stringify({
    route:id,seed,...favorites,
  }));
  // Nur Diagnose: keine zusätzliche Simulation. Wie kam der Sieger
  // tatsächlich zu seiner Position vor der letzten Selektion?
  const sampleKm=[.25,.5,.75,.9]
    .map(f=>n(fixture.route.distanceKm*f));
  const finalClimb=fixture.route.climbs.at(-1);
  if(finalClimb){
    sampleKm.push(n(finalClimb.endKm-finalClimb.lengthKm));
    sampleKm.push(n(finalClimb.endKm-5));
  }
  const seen=new Set();
  const trace=sampleKm.sort((a,b)=>a-b).map(km=>{
    const cp=(r.checkpoints??[]).find(c=>c.km>=km);
    if(!cp||seen.has(cp.km))return null;
    seen.add(cp.km);
    const sorted=[...cp.riders].sort((a,b)=>b.positionM-a.positionM);
    const rider=cp.riders.find(x=>x.riderId===r.winnerId);
    return {km:n(cp.km),leaderId:cp.leaderId,
      leaderType:kindByRider.get(cp.leaderId),
      winnerRank:sorted.findIndex(x=>x.riderId===r.winnerId)+1,
      winnerGapM:n(rider.gapToLeaderM),
      winnerWprimePct:n(rider.wPrimeRemainingPct),
      winnerPowerW:n(rider.appliedPowerW),
      winnerAero:n(rider.aeroFactor),
      largestGroup:cp.largestGroup,groupCount:cp.groupCount};
  }).filter(Boolean);
  const winnerEvents=r.events.filter(e=>e.riderId===r.winnerId&&
    ['attack','chase','team-chase','team-pace'].includes(e.type))
    .slice(0,20).map(e=>({km:n(e.km),type:e.type,timeS:n(e.timeS)}));
  console.log('R22-WINNER-TRACE '+JSON.stringify({route:id,
    winnerId:r.winnerId,winnerType:details.winnerType,
    trace,winnerEvents,
    top10:r.classification.slice(0,10).map(x=>({
      id:x.id,type:kindByRider.get(x.id),gapS:n(x.gapS)}))}));

  // Keine neue Simulation: zeigt, ob Puncheure an den real modellierten
  // Schlüsselrampen absetzen, sich nach 5 km wieder einfangen lassen
  // oder ihr W′-Budget für einen aussichtslosen Versuch ausgeben.
  if(fixture.route.kind==='klassiker'){
    const punches=r.events.filter(e=>e.type==='attack'&&
      e.description.includes('Kurzer Steilanstieg'));
    const attacksOnClimbs=fixture.route.climbs.map(climb=>{
      const start=climb.endKm-climb.lengthKm;
      const events=punches.filter(e=>e.km>=start&&e.km<=climb.endKm);
      return {climb:climb.name,attacks:events.length,
        distinctRiders:new Set(events.map(e=>e.riderId)).size};
    });
    const events=punches.slice(0,30).map(e=>{
      const pre=(r.checkpoints??[]).filter(c=>c.km<=e.km).at(-1);
      const post=(r.checkpoints??[]).find(c=>c.km>=e.km+5);
      const read=c=>c?.riders.find(x=>x.riderId===e.riderId);
      const before=read(pre),after=read(post);
      const classification=r.classification.find(x=>x.id===e.riderId);
      return {id:e.riderId,kind:kindByRider.get(e.riderId),
        km:n(e.km),timeS:n(e.timeS),
        before:before?{km:n(pre.km),gapM:n(before.gapToLeaderM),
          wPrimePct:n(before.wPrimeRemainingPct),
          groupSize:before.groupSize}:null,
        after5Km:after?{km:n(post.km),gapM:n(after.gapToLeaderM),
          wPrimePct:n(after.wPrimeRemainingPct),
          groupSize:after.groupSize}:null,
        finishRank:classification?.rank??null,
        finishGapS:classification?n(classification.gapS):null};
    });
    console.log('R22-CLASSICS-PUNCH-AUDIT '+JSON.stringify({
      route:id,seed,
      totalPunchEvents:punches.length,uniqueRiders:
        new Set(punches.map(e=>e.riderId)).size,
      climbEvents:attacksOnClimbs,
      events,
    }));
  }


}
console.log('R22-PROFILES-SUMMARY '+JSON.stringify({
  experimental:true,notRealismValidated:true,
  model:'stable-pack',seed,races:results.length,participantsPerRace:154,
  profiles:results.map(x=>({route:x.route,profile:x.profile,
    winnerType:x.winnerType,largestFinishGroup:x.largestFinishGroup,
    largestFinishGroupGapS:x.largestFinishGroupGapS,
    within60s:x.within60s,attacks:x.attacks,
    maximumGroups:x.maximumGroups,chaseLeaderChanges:x.chaseLeaderChanges})),
}));
