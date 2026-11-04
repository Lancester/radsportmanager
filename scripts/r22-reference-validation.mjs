/** R-22A/B/C: vier echte Rennanker mit je 22×7 fiktiven Profis.
 * Reine TECHNISCHE Vollrennprüfung, keine sportliche Realismusfreigabe. */
import {performance} from 'node:perf_hooks';
import {createReferenceFixture,REFERENCE_ROUTES}
  from '../src/engine/race/reference-fixtures.ts';
import {simulateRace} from '../src/engine/race/race-simulator.ts';
import {auditRace} from '../src/engine/race/race-audit.ts';

const results=[];
for(const id of Object.keys(REFERENCE_ROUTES)){
  const data=createReferenceFixture({routeId:id,seed:2026});
  const start=performance.now();
  const race=simulateRace(data.input);
  const audit=auditRace(race);
  if(audit.finishers!==154||
    race.classification.some(r=>
      Math.abs(r.energyResidualJ)>0.05||r.finalWPrimeJ<0||
      r.carbohydrateRemainingKcal<0||
      !Number.isFinite(r.finishTimeS)))
    throw new Error('R22ABC: Modellbilanz oder Finisherzahl '+id);
  const winner=data.input.riders.find(r=>r.id===race.winnerId);
  const result={
    scenario:id,route:data.route.name,
    distanceKm:data.route.distanceKm,
    publishedAscentM:data.route.referenceAscentM??null,
    modelledAscentM:data.modelledAscentM,
    fieldSize:race.finisherCount,
    teamFoci:data.teamFoci,
    sections:data.input.segments.length,
    winner:race.winnerId,winnerSpecialty:winner?.specialty,
    winnerSeconds:+race.classification[0].finishTimeS.toFixed(1),
    medianGapS:+audit.medianGapS.toFixed(1),
    lastGapS:+audit.finishSpreadS.toFixed(1),
    maximumGroups:audit.maximumGroups,
    meanW:+audit.averageCrankPowerW.toFixed(1),
    maximumEndurancePenaltyPct:+(
      race.diagnostics.maximumEndurancePenalty*100).toFixed(1),
    secondsCompute:+((performance.now()-start)/1000).toFixed(2),
  };
  results.push(result);
  console.log('R22ABC-RACE',JSON.stringify(result));
}
if(results.length!==4||results.reduce((n,r)=>n+r.fieldSize,0)!==616)
  throw new Error('R22ABC: zu wenig komplette Referenzrennen');
console.log('R22ABC-OVERALL',JSON.stringify({races:results.length,
  finishers:616,profileIds:results.map(r=>r.scenario),
  status:'technical-only-not-final-empirical-validation'}));
