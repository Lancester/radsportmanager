import test from 'node:test';
import assert from 'node:assert/strict';
import {formationAeroFactors,R12_AERO_EXPERIMENT}
  from '../src/engine/race/formation-aero.ts';
import {createRaceExample,simulateRace,validateRace}
  from '../src/engine/race/race-simulator.ts';
import {auditRace} from '../src/engine/race/race-audit.ts';

const at=(positions,id)=>formationAeroFactors(positions).get(id);
const row=n=>Array.from({length:n},(_,i)=>({
  id:'F'+String(i+1).padStart(2,'0'),positionM:1000-2*i,
}));

test('R12: Solofahrt ohne Windschutz, Zweier- und Dreiergruppe abgestuft',()=>{
  const solo=row(1),two=row(2),three=row(3);
  assert.equal(at(solo,'F01'),1);
  assert.equal(at(two,'F01'),1);
  assert.ok(at(two,'F02')<0.81,'paarweise Windschutz stärker als R10');
  assert.ok(at(three,'F03')<at(two,'F02'));
  assert.ok(at(two,'F02')>=R12_AERO_EXPERIMENT.minimumAeroFactor);
});
test('R12: lokales dichtes Peloton schützt tiefer stärker als kleine Flucht',()=>{
  const two=at(row(2),'F02');
  const three=at(row(3),'F03');
  const pack=at(row(30),'F30');
  assert.ok(pack<three&&three<two,JSON.stringify({two,three,pack}));
  assert.ok(pack>=0.4);
  assert.equal(at(row(30),'F01'),1);
});
test('R12: 24-m-Nachbarschaft ist nicht die 42-m-Gruppengrenze',()=>{
  const gap=[{id:'A',positionM:100},{id:'B',positionM:76}];
  assert.equal(at(gap,'B'),1);
  const nearby=[{id:'A',positionM:100},{id:'B',positionM:95}];
  assert.ok(at(nearby,'B')<1);
  const farLine=[{id:'A',positionM:100},{id:'B',positionM:50},
    {id:'C',positionM:0}];
  assert.equal(at(farLine,'C'),1);
});
test('R12: sortier-, eingabe- und duplikatsicher, keine Statusmutation',()=>{
  const original=row(12),reversed=[...original].reverse();
  assert.deepEqual([...formationAeroFactors(original)],
    [...formationAeroFactors(reversed)]);
  assert.deepEqual(original,row(12));
  assert.throws(()=>formationAeroFactors([{id:'A',positionM:-1}]),RangeError);
  assert.throws(()=>formationAeroFactors([{id:'A',positionM:0},
    {id:'A',positionM:1}]),RangeError);
  assert.throws(()=>formationAeroFactors([{id:'B',positionM:NaN}]),RangeError);
});
test('R12: Standard und explizites Legacy-Modell sind bitgenau identisch',()=>{
  const baseline=simulateRace(createRaceExample({seed:2026,profile:'flach'}));
  const explicit=createRaceExample({seed:2026,profile:'flach'});
  explicit.aeroModel='legacy';
  assert.deepEqual(simulateRace(explicit),baseline);
});
test('R12: 50-km-A/B-Lauf nutzt weiter CP/Wprime und Bewegungs-Energieerhalt',()=>{
  const original=createRaceExample({seed:2026,profile:'wellig'});
  const modified=createRaceExample({seed:2026,profile:'wellig'});
  modified.aeroModel='formation-experiment';
  const base=simulateRace(original);
  const change=simulateRace(modified);
  assert.equal(auditRace(change).finishers,30);
  assert.equal(change.distanceM,base.distanceM);
  assert.ok(change.diagnostics.meanAeroFactor<base.diagnostics.meanAeroFactor);
  assert.ok(change.diagnostics.minimumAeroFactor>=0.4);
  assert.notDeepEqual(change.classification.map(x=>x.finishTimeS),
    base.classification.map(x=>x.finishTimeS));
  for(const rider of change.classification){
    assert.ok(rider.finalWPrimeJ>=0);
    assert.ok(Math.abs(rider.energyResidualJ)<.05);
    assert.ok(Number.isFinite(rider.averageCrankPowerW));
    assert.ok(Number.isFinite(rider.finishTimeS));
  }
});
test('R12: unbekanntes Aero-Modell wird zurückgewiesen',()=>{
  const x=createRaceExample();
  x.aeroModel='ausgedacht';
  assert.throws(()=>validateRace(x),RangeError);
});
