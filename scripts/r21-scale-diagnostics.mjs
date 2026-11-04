/**
 * Einmaliger R-21-Skalierungs-Audit: echtes 200-km-Einzelrennen
 * mit 22×7 Fahrern, reproduzierbare 70er-Gegenprobe.
 * Bei >15 min CI-Laufzeit ist die Performance ungelöst, nicht "bestanden".
 */
import {performance} from 'node:perf_hooks';
import {createLongRaceFixture}
  from '../src/engine/race/long-race-fixtures.ts';
import {simulateRace} from '../src/engine/race/race-simulator.ts';
import {auditRace} from '../src/engine/race/race-audit.ts';

for(const config of [
  {profile:'flach',teams:22,rosterSize:7,distanceKm:200,seed:2026},
  {profile:'berg',teams:10,rosterSize:7,distanceKm:170,seed:2027},
]){
  const input=createLongRaceFixture(config);
  const start=performance.now();
  const out=simulateRace(input);
  const elapsedS=(performance.now()-start)/1000;
  const audit=auditRace(out);
  if(out.finisherCount!==input.riders.length||
    !out.classification.every(r=>r.finalWPrimeJ>=0&&
      r.carbohydrateRemainingKcal>=0&&
      Math.abs(r.energyResidualJ)<0.05))
    throw new Error('Unvollständiges Rennen / Energiefehler');
  console.log('R21-SCALE',JSON.stringify({
    profile:config.profile,distanceKm:out.distanceM/1000,
    participants:out.finisherCount,teams:config.teams,
    secondsCompute:+elapsedS.toFixed(2),steps:out.steps,
    maxGroups:audit.maximumGroups,medianGapS:+audit.medianGapS.toFixed(1),
    lastGapS:+audit.finishSpreadS.toFixed(1),
    maxFatiguePercent:+(out.diagnostics.maximumEndurancePenalty*100).toFixed(1),
    relays:out.diagnostics.relayChanges,
    frontWorkSteps:out.diagnostics.actualFrontWorkSteps,
    winner:out.winnerId,
  }));
}
