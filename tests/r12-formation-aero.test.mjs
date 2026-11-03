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
test('R13: Standard ist identisch zur expliziten Formationsregel, Legacy bleibt separat',()=>{
  const standard=simulateRace(createRaceExample({seed:2026,profile:'flach'}));
  const explicit=createRaceExample({seed:2026,profile:'flach'});
  explicit.aeroModel='formation';
  const oldAlias=createRaceExample({seed:2026,profile:'flach'});
  oldAlias.aeroModel='formation-experiment';
  const legacy=createRaceExample({seed:2026,profile:'flach'});
  legacy.aeroModel='legacy';
  assert.deepEqual(standard,simulateRace(explicit));
  assert.deepEqual(standard,simulateRace(oldAlias));
  const oldResult=simulateRace(legacy);
  assert.equal(oldResult.diagnostics.maximumGroups,12,
    'Explizites R-10-Modell muss den historischen Seed beibehalten');
  assert.notDeepEqual(standard.classification,oldResult.classification);
});
test('R12: 50-km-A/B-Lauf nutzt weiter CP/Wprime und Bewegungs-Energieerhalt',()=>{
  const original=createRaceExample({seed:2026,profile:'wellig'});
  original.aeroModel='legacy';
  const modified=createRaceExample({seed:2026,profile:'wellig'});
  modified.aeroModel='formation';
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

test('R13: Gleiche Längskoordinate erzeugt ohne Querlage keinen erfundenen Führenden',()=>{
  const level=Array.from({length:30},(_,i)=>({
    id:'A'+String(i).padStart(2,'0'),positionM:1000,
  }));
  const factors=formationAeroFactors(level);
  assert.equal(factors.size,30);
  assert.ok([...factors.values()].every(x=>x===1));
  const oneAhead=[...level,{id:'Z',positionM:1002}];
  const result=formationAeroFactors(oneAhead);
  assert.equal(result.get('Z'),1);
  // Die 30 Fahrer hinter Z liegen auf gleicher Höhe; kein ID-basiertes
  // künstliches Sortieren der 29 Gleichauf-Fahrer als Vordermänner.
  const back=[...level.map(r=>result.get(r.id))];
  assert.ok(back.every(x=>x<1&&x>=R12_AERO_EXPERIMENT.minimumAeroFactor));
});

test('R13: ein vollständig abgehängter Einzelner erhält keinerlei großen Pelotonbonus',()=>{
  const pack=Array.from({length:20},(_,i)=>({
    id:'P'+i,positionM:1000-i*1.5,
  }));
  const alone={id:'ABGEHAENGT',positionM:800};
  const aero=formationAeroFactors([...pack,alone]);
  assert.equal(aero.get('ABGEHAENGT'),1);
  assert.ok(aero.get('P19')<aero.get('P01'));
  assert.ok(aero.get('P19')>=R12_AERO_EXPERIMENT.minimumAeroFactor);
});

test('R13: fehlende Modellangabe ist Formationsstandard und unbekannte Modelle bleiben ungültig',()=>{
  const standard=createRaceExample();
  assert.equal(standard.aeroModel,undefined);
  validateRace(standard);
  standard.aeroModel='formation';
  validateRace(standard);
  standard.aeroModel='legacy';
  validateRace(standard);
});
