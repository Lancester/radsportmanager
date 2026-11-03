/**
 * R-13: die sieben R-11-Fälle in der regulären Standard-Aerodynamik.
 * Einzelfahrer werden NICHT künstlich an die Feldspitze herangezogen.
 * Die Zahlen sind Modellresultate, keine empirischen Profi-Renndaten.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import {createRaceExample,simulateRace}
  from '../src/engine/race/race-simulator.ts';
import {auditRace} from '../src/engine/race/race-audit.ts';

const scenarios=[
  {label:'huegelig-geschuetzt-2026',seed:2026,profile:'wellig',
    homeStrategy:'kapitaen_schuetzen'},
  {label:'huegelig-offensiv-2026',seed:2026,profile:'wellig',
    homeStrategy:'offensiv'},
  {label:'flach-sprint-2026',seed:2026,profile:'flach',
    homeStrategy:'sprint'},
  {label:'huegelig-geschuetzt-2027',seed:2027,profile:'wellig',
    homeStrategy:'kapitaen_schuetzen'},
  {label:'huegelig-offensiv-2027',seed:2027,profile:'wellig',
    homeStrategy:'offensiv'},
  {label:'flach-sprint-2027',seed:2027,profile:'flach',
    homeStrategy:'sprint'},
  {label:'huegelig-F03-CP-12pct-2026',seed:2026,profile:'wellig',
    homeStrategy:'kapitaen_schuetzen',weakenF03:true},
];
test('R13: die sieben kompletten Standardrennen sind physikalisch und diagnostisch konsistent',()=>{
  for(const scenario of scenarios){
    const input=createRaceExample(scenario);
    assert.equal(input.aeroModel,undefined);
    if(scenario.weakenF03){
      const f03=input.riders.find(r=>r.id==='F03');
      assert.ok(f03);
      f03.criticalPowerW*=0.88;
      f03.ftpW*=0.88;
      f03.wPrimeJ*=0.88;
    }
    const result=simulateRace(input);
    const audit=auditRace(result);
    assert.equal(audit.finishers,30,scenario.label);
    assert.equal(result.distanceM,50000);
    assert.equal(audit.actualCatches<=audit.confirmedBreakaways,true);
    assert.ok(audit.maximumGroups>=1&&audit.maximumGroups<=30);
    assert.ok(result.diagnostics.meanAeroFactor>0);
    assert.ok(result.diagnostics.meanAeroFactor<1);
    assert.ok(result.diagnostics.minimumAeroFactor>=0.40);
    for(const rider of result.classification){
      assert.ok(rider.finalWPrimeJ>=-1e-9);
      assert.ok(Math.abs(rider.energyResidualJ)<0.05);
      assert.ok(Number.isFinite(rider.finishTimeS));
    }
    console.log('R13-STANDARD',JSON.stringify({
      label:scenario.label,
      winner:audit.winnerId,finishers:audit.finishers,
      maximumGroups:audit.maximumGroups,
      medianSnapshotGroups:audit.medianSnapshotGroups,
      singletonShare:+audit.singletonRiderShare.toFixed(3),
      lastGapS:+audit.finishSpreadS.toFixed(1),
      medianGapS:+audit.medianGapS.toFixed(1),
      chases:audit.chaseStarts,attacks:audit.attackStarts,
      meanAeroFactor:+result.diagnostics.meanAeroFactor.toFixed(3),
      minAeroFactor:+result.diagnostics.minimumAeroFactor.toFixed(3),
      meanCrankW:+audit.averageCrankPowerW.toFixed(1),
    }));
  }
});