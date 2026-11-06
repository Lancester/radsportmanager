/** R24 – nur Auswertung bereits berechneter Rennengine-Telemetrie.
 * Audit und PR84 werden aus getrennten Checkouts mit demselben Input gestartet.
 * node --experimental-strip-types scripts/r24-chase-causality.mjs AUDIT VERSUCH 2026 boulogne|hautacam
 */
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
const [auditPath,variantPath,seedText,route]=process.argv.slice(2);
if(!auditPath||!variantPath||!seedText||!['boulogne','hautacam'].includes(route))
  throw Error('AUDIT VERSUCH SEED boulogne|hautacam');
const seed=Number(seedText);
if(!Number.isSafeInteger(seed)||seed<0)throw Error('invalid seed');
const imp=(dir,name)=>import(pathToFileURL(resolve(dir)+'/src/engine/race/'+name+'.ts').href);
const [ref,base,exp]=await Promise.all([
  imp(auditPath,'reference-fixtures'),imp(auditPath,'race-simulator'),
  imp(variantPath,'race-simulator'),
]);
const fixture=ref.createReferenceFixture({routeId:'tdf25_'+route,seed});
const x={...fixture.input,groupRidingModel:'stable-pack',diagnosticLevel:'checkpoints'};
const stats=r=>{
  const d=r.diagnostics;const n=d.namedChaseLeader??{};
  const handoffs=d.namedChaseHandoffs??[];
  const attack=d.attackTraces??[];
  const attackSample=attack.slice(0,4).map(z=>z);
  const groups=(r.checkpoints??[]).filter(c=>
    [20,30,50,100,150,175,180,190,195,200,205].some(k=>Math.abs(c.km-k)<.17))
    .map(c=>({
      km:+c.km.toFixed(1),front:c.groupSizes[0],
      largest:c.largestGroup,groupCount:c.groupCount,
      spanM:Math.round(c.frontToBackM),
      nearLead60M:c.riders.filter(q=>q.gapToLeaderM<=60).length,
    }));
  const late=r.events.filter(e=>e.km>r.distanceM/1000-35&&
    ['attack','breakaway','breakaway-caught','group-split'].includes(e.type))
    .slice(0,20).map(e=>({km:+e.km.toFixed(2),type:e.type,id:e.riderId??null}));
  return {
    winner:r.winnerId,finisher60:r.classification.filter(c=>c.gapS<=60).length,
    attacks:d.attacks,breakaways:d.breakaways,caught:d.caughtBreakaways,
    chases:d.chases,groupSplits:d.groupSplits,teamChaseStarts:d.teamChaseStarts,
    coordinatedRelaySeconds:d.orderedRelayTeamSeconds,
    mainFieldFrontWorkWithAssignedChaserS:d.mainFieldFrontWorkWithAssignedChaserS,
    mainFieldChaserLeaderChanges:d.mainFieldChaserLeaderChanges,
    longestMainFieldChaserStintS:d.longestMainFieldChaserStintS,
    physicalCommittedChasePullSeconds:d.committedChasePullSeconds,
    realFrontChaseCpSeconds:d.realFrontChaseCpSeconds,
    chaseAssignments:n.assignedSeconds,frontSeconds:n.frontSeconds,
    cpNearFrontSeconds:n.cpNearFrontSeconds,
    exposedSeconds:n.exposedSeconds,
    exposedCpNearSeconds:n.exposedCpNearSeconds,
    longestExposedCpNearSeconds:n.longestExposedCpNearSeconds,
    meanFrontPowerW:n.meanFrontPowerW,
    missed:n.missed,
    chaseRiders:n.riders?.slice(0,5),
    chaseHandoffs:handoffs.length,
    handoffReasons:handoffs.reduce((acc,h)=>{
      acc[h.reason]=(acc[h.reason]??0)+1;return acc;},{}),
    chaseHandoffSample:handoffs.slice(0,5),
    attackTraceCount:attack.length,attackTraceSample:attackSample,
    checkpoints:groups,lateEvents:late,
  };
};
const a=stats(base.simulateRace(x));const b=stats(exp.simulateRace(x));
console.log('R24_CHASE_CAUSALITY '+JSON.stringify({seed,route,audit:a,experiment:b}));
