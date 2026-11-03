import test from 'node:test';
import assert from 'node:assert/strict';
import {createRaceExample,simulateRace}
  from '../src/engine/race/race-simulator.ts';
import {auditRace} from '../src/engine/race/race-audit.ts';

test('R-11: zwei Seeds und zwei Strecken liefern vollständige, konsistente Rennen',()=>{
  for(const seed of [2026,2027]){
    for(const profile of ['wellig','flach']){
      const input=createRaceExample({seed,profile});
      const result=simulateRace(input);
      const audit=auditRace(result);
      assert.equal(audit.finishers,30);
      assert.equal(result.distanceM,50000);
      assert.equal(audit.winnerId,result.classification[0].id);
      assert.ok(audit.maximumGroups>=1&&audit.maximumGroups<=30);
      assert.ok(audit.medianSnapshotGroups>=1&&audit.medianSnapshotGroups<=30);
      assert.ok(audit.singletonRiderShare>=0&&audit.singletonRiderShare<=1);
      assert.ok(audit.averageCrankPowerW>0);
      assert.ok(audit.snapshots>=5);
      assert.ok(audit.actualCatches<=audit.confirmedBreakaways);
    }
  }
});
test('R-11: andere Teamleitlinie wirkt im gleichen Feld auf echte Zielzeit',()=>{
  const protect=simulateRace(createRaceExample({seed:2026,
    homeStrategy:'kapitaen_schuetzen'}));
  const attack=simulateRace(createRaceExample({seed:2026,
    homeStrategy:'offensiv'}));
  const p=protect.classification.find(r=>r.id==='F01');
  const a=attack.classification.find(r=>r.id==='F01');
  assert.ok(p&&a);
  assert.ok(Math.abs(p.finishTimeS-a.finishTimeS)>0.1);
  assert.equal(auditRace(protect).finishers,30);
  assert.equal(auditRace(attack).finishers,30);
});
test('R-11: fiktives Leistungsprofil ändert Fahrzeit ohne Zeitbonus',()=>{
  const input=createRaceExample({seed:2026});
  const changed=createRaceExample({seed:2026});
  const helper=changed.riders.find(r=>r.id==='F03');
  assert.ok(helper);
  helper.criticalPowerW*=0.88;
  helper.ftpW*=0.88;
  helper.wPrimeJ*=0.88;
  const baseline=simulateRace(input);
  const modified=simulateRace(changed);
  const oldRider=baseline.classification.find(r=>r.id==='F03');
  const newRider=modified.classification.find(r=>r.id==='F03');
  assert.ok(oldRider&&newRider);
  assert.ok(Math.abs(oldRider.finishTimeS-newRider.finishTimeS)>0.1);
  assert.ok(newRider.finalWPrimeJ>=0);
  assert.equal(auditRace(modified).finishers,30);
});
test('R-11: Diagnose weist unvollständige Gruppen und erfundene Einholungen zurück',()=>{
  const result=simulateRace(createRaceExample({seed:2026,profile:'flach'}));
  assert.ok(result.snapshots.length>0);
  const badSnapshot=structuredClone(result);
  badSnapshot.snapshots[0].groupSizes[0]++;
  assert.throws(()=>auditRace(badSnapshot),/Fahrerzahl in Gruppensnapshot/);
  const badEvent=structuredClone(result);
  badEvent.events.push({timeS:20,km:1,type:'breakaway-caught',
    gapM:95,description:'Falsche Einholung'});
  assert.throws(()=>auditRace(badEvent),/Einholen ohne tatsächlich/);
});
