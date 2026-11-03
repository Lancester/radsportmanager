/**
 * R-12: 7 identische Inputs × 2 Windschattenvarianten, 14 vollständige Rennen.
 * Nicht täglich: bewusst manuelle kurzzeitige A/B-Plausibilitätsdiagnose.
 * Keine CFD-Kalibrierung, keine Android-Zeitmessung.
 *
 * Aufruf: node --experimental-strip-types scripts/r12-aero-comparison.mjs
 */
import assert from 'node:assert/strict';
import {performance} from 'node:perf_hooks';
import {createRaceExample,simulateRace}
  from '../src/engine/race/race-simulator.ts';
import {auditRace} from '../src/engine/race/race-audit.ts';

const cases=[
  {label:'huegelig-geschuetzt-2026',seed:2026,profile:'wellig',
    homeStrategy:'kapitaen_schuetzen',oldMaximumGroups:20},
  {label:'huegelig-offensiv-2026',seed:2026,profile:'wellig',
    homeStrategy:'offensiv',oldMaximumGroups:22},
  {label:'flach-sprint-2026',seed:2026,profile:'flach',
    homeStrategy:'sprint',oldMaximumGroups:12},
  {label:'huegelig-geschuetzt-2027',seed:2027,profile:'wellig',
    homeStrategy:'kapitaen_schuetzen',oldMaximumGroups:24},
  {label:'huegelig-offensiv-2027',seed:2027,profile:'wellig',
    homeStrategy:'offensiv',oldMaximumGroups:20},
  {label:'flach-sprint-2027',seed:2027,profile:'flach',
    homeStrategy:'sprint',oldMaximumGroups:12},
  {label:'huegelig-F03-schwach-2026',seed:2026,profile:'wellig',
    homeStrategy:'kapitaen_schuetzen',oldMaximumGroups:23,weakenF03:true},
];
function run(config,model){
  const input=createRaceExample(config);
  if(config.weakenF03){
    const r=input.riders.find(r=>r.id==='F03');
    assert.ok(r);
    r.criticalPowerW*=0.88;
    r.ftpW*=0.88;
    r.wPrimeJ*=0.88;
  }
  input.aeroModel=model;
  const start=performance.now();
  const result=simulateRace(input);
  const audit=auditRace(result);
  assert.equal(audit.finishers,30);
  assert.equal(result.distanceM,50000);
  const c=result.classification;
  const meanWprime=c.reduce((s,r)=>s+r.finalWPrimeJ,0)/c.length;
  const timing=(id)=>c.find(r=>r.id===id).finishTimeS;
  return {audit,result,performanceMs:performance.now()-start,
    meanWprime, f01TimeS:timing('F01'),f03TimeS:timing('F03')};
}
const comparisons=[];
for(const config of cases){
  const original=run(config,'legacy');
  const experiment=run(config,'formation-experiment');
  assert.equal(original.audit.maximumGroups,config.oldMaximumGroups,
    'Legacy-Profil driftet ohne beabsichtigte Änderung: '+config.label);
  const compact=r=>({
    winner:r.audit.winnerId,maximumGroups:r.audit.maximumGroups,
    medianGroups:r.audit.medianSnapshotGroups,
    singletonShare:+r.audit.singletonRiderShare.toFixed(3),
    lastGapS:+r.audit.finishSpreadS.toFixed(1),
    medianGapS:+r.audit.medianGapS.toFixed(1),
    chaseStarts:r.audit.chaseStarts,
    attacks:r.audit.attackStarts,
    confirmedBreakaways:r.audit.confirmedBreakaways,
    catches:r.audit.actualCatches,
    averageCrankW:+r.audit.averageCrankPowerW.toFixed(1),
    meanFinalWprimeJ:Math.round(r.meanWprime),
    meanAeroFactor:+r.result.diagnostics.meanAeroFactor.toFixed(3),
    minAeroFactor:+r.result.diagnostics.minimumAeroFactor.toFixed(3),
    f01TimeS:+r.f01TimeS.toFixed(2),
    f03TimeS:+r.f03TimeS.toFixed(2),
    runtimeMs:+r.performanceMs.toFixed(1),
  });
  const report={
    label:config.label,seed:config.seed,profile:config.profile,
    original:compact(original),formation:compact(experiment),
    deltaMaximumGroups:experiment.audit.maximumGroups-original.audit.maximumGroups,
    deltaLastGapS:+(experiment.audit.finishSpreadS-original.audit.finishSpreadS).toFixed(1),
    deltaMeanCrankW:+(experiment.audit.averageCrankPowerW-
      original.audit.averageCrankPowerW).toFixed(1),
    deltaMeanFinalWprimeJ:Math.round(experiment.meanWprime-original.meanWprime),
  };
  comparisons.push(report);
  console.log('R12-VERGLEICH',JSON.stringify(report));
}
const mean=(items,key)=>items.reduce((sum,item)=>sum+item[key],0)/items.length;
console.log('R12-GESAMT',JSON.stringify({
  pairs:comparisons.length,totalFullRaces:comparisons.length*2,
  legacyMeanMaxGroups:+mean(comparisons.map(x=>x.original),'maximumGroups').toFixed(2),
  candidateMeanMaxGroups:+mean(comparisons.map(x=>x.formation),'maximumGroups').toFixed(2),
  betterGroupMaximum:comparisons.filter(x=>x.deltaMaximumGroups<0).length,
  worseGroupMaximum:comparisons.filter(x=>x.deltaMaximumGroups>0).length,
  identicalGroupMaximum:comparisons.filter(x=>x.deltaMaximumGroups===0).length,
  note:'Fiktiver Modellvergleich ohne empirische Profi-Rennkalibrierung',
}));
