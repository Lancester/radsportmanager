/**
 * R-09 – fachliche Rennplausibilität lesen statt weitere Mikrophysik bauen.
 * Bewusst nur drei deterministische 50-km-Läufe, keine Monte-Carlo-Batterie.
 * Diagnosewerte sind KEINE Validierung gegen echte Profirennen.
 */
import {performance} from 'node:perf_hooks';
import {createRaceExample,simulateRace} from '../src/engine/race/race-simulator.ts';

function describe(label,configuration){
  const start=performance.now();
  const r=simulateRace(createRaceExample(configuration));
  const c=r.classification;
  const median=c[Math.floor(c.length/2)];
  const mean=a=>a.reduce((s,x)=>s+x,0)/a.length;
  const byTeam={};
  for(const x of c){
    const previous=byTeam[x.teamId];
    if(!previous||x.rank<previous.rank)
      byTeam[x.teamId]={id:x.id,rank:x.rank,timeS:+x.finishTimeS.toFixed(1)};
  }
  const info={
    label,seed:r.seed,profile:configuration.profile??'wellig',
    strategy:configuration.homeStrategy??'kapitaen_schuetzen',
    durationS:+r.durationS.toFixed(1),winner:c[0].id,
    winnerTimeS:+c[0].finishTimeS.toFixed(1),
    medianGapS:+median.gapS.toFixed(1),
    lastGapS:+c.at(-1).gapS.toFixed(1),
    finishers:r.finisherCount,
    topFive:c.slice(0,5).map(x=>({rider:x.id,team:x.teamId,
      gapS:+x.gapS.toFixed(1)})),
    bestPerTeam:byTeam,
    maxSpeedKmh:+Math.max(...c.map(x=>x.peakSpeedKmh)).toFixed(1),
    avgPedalPowerW:+mean(c.map(x=>x.averageCrankPowerW)).toFixed(1),
    minPedalPowerW:+Math.min(...c.map(x=>x.averageCrankPowerW)).toFixed(1),
    maxPedalPowerW:+Math.max(...c.map(x=>x.averageCrankPowerW)).toFixed(1),
    events:r.diagnostics,
    snapshotMaxGroups:Math.max(0,...r.snapshots.map(x=>x.groupSizes.length)),
    medianSnapshotGroups:r.snapshots.length?
      [...r.snapshots.map(x=>x.groupSizes.length)].sort((a,b)=>a-b)[Math.floor(r.snapshots.length/2)]:0,
    maximumPelotonGroupSize:Math.max(0,...r.snapshots.flatMap(x=>x.groupSizes)),
    confirmedBreakawayEvents:r.events.filter(e=>e.type==='breakaway').length,
    caughtBreakawayEvents:r.events.filter(e=>e.type==='breakaway-caught').length,
    snapshots:r.snapshots.length,
    finishSpreadS:+(c.at(-1).finishTimeS-c[0].finishTimeS).toFixed(1),
    runtimeMs:+(performance.now()-start).toFixed(1),
  };
  if(c.some(x=>!Number.isFinite(x.gapS)||x.gapS<0)||
     !Number.isFinite(info.durationS)||info.finishers!==30)
    throw new Error('Rennplausibilität: ungültige Zielzeiten oder fehlender Fahrer');
  console.log('R09-RENNAUSWERTUNG',JSON.stringify(info));
  return {result:r,info};
}
const hilly=describe('huegelig', {profile:'wellig',seed:2026,homeStrategy:'kapitaen_schuetzen'});
const offensive=describe('huegelig-offensiv', {profile:'wellig',seed:2026,homeStrategy:'offensiv'});
describe('flach', {profile:'flach',seed:2026,homeStrategy:'sprint'});
const protectedCaptain=hilly.result.classification.find(x=>x.id==='F01');
const attackingCaptain=offensive.result.classification.find(x=>x.id==='F01');
console.log('R09-TAKTIKUNTERSCHIED',JSON.stringify({
  captainId:'F01',
  protectedRank:protectedCaptain.rank,offensiveRank:attackingCaptain.rank,
  protectedFinishS:+protectedCaptain.finishTimeS.toFixed(3),
  offensiveFinishS:+attackingCaptain.finishTimeS.toFixed(3),
  offensiveTimeGainS:+(protectedCaptain.finishTimeS-attackingCaptain.finishTimeS).toFixed(3),
  changedWinner:hilly.result.winnerId!==offensive.result.winnerId,
}));
