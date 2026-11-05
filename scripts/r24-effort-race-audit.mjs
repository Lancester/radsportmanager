/** Belastung, Attacken und beobachtete Teamarbeit in vier Referenzrennen. */
import {createReferenceFixture,REFERENCE_ROUTES} from '../src/engine/race/reference-fixtures.ts';
import {simulateRace} from '../src/engine/race/race-simulator.ts';
const seed=Number(process.argv[2]??2026);
for(const routeId of Object.keys(REFERENCE_ROUTES)){
 const f=createReferenceFixture({routeId,seed});
 const r=simulateRace({...f.input,groupRidingModel:'stable-pack',diagnosticLevel:'checkpoints'});
 const a=r.diagnostics.attackTraces??[];const eligible=a.filter(x=>x.afterFiveKm&&x.initialGroupSize>=8);
 const lead=eligible.filter(x=>x.afterFiveKm.gapToFormerGroupFrontM>42);
 const work=[...(r.diagnostics.rejoinWork??[])].sort((a,b)=>b.actualFrontS-a.actualFrontS).slice(0,5);
 console.log(JSON.stringify({routeId,seed,winner:r.winnerId,attacks:r.diagnostics.attacks,
  traces:a.length,eligible:eligible.length,leadAfter5km:lead.length,
  attackSamples:eligible.slice(0,6).map(x=>({id:x.riderId,startKm:x.startPositionM/1000,
   seconds:x.attackSeconds,requestedKJ:x.requestedCrankJ/1000,appliedKJ:x.appliedCrankJ/1000,
   aboveCpKJ:x.appliedAboveEffectiveCpJ/1000,wPrimeBefore:x.initialWPrimePct,
   wPrimeAfter:x.afterFiveKm.wPrimePct,formerGroupGapM:x.afterFiveKm.gapToFormerGroupFrontM})),
  breakaways:r.diagnostics.breakaways,caught:r.diagnostics.caughtBreakaways,
  chase:r.diagnostics.namedChaseLeader??null,rejoinWork:work,
  finish:r.classification.slice(0,10).map(x=>({id:x.id,gapS:x.gapS,
   availability:x.endurancePowerAvailability,wPrimeJ:x.finalWPrimeJ,
   specialty:f.input.riders.find(q=>q.id===x.id)?.specialty}))}));
}
