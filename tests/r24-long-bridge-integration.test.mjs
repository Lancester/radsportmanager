import test from 'node:test';
import assert from 'node:assert/strict';
import {createReferenceFixture} from '../src/engine/race/reference-fixtures.ts';
import {simulateRace} from '../src/engine/race/race-simulator.ts';

test('Berglauf: Anschluss kann nach der Attacke viele Minuten dauern und gelingen',()=>{
  const f=createReferenceFixture({routeId:'tdf25_hautacam',seed:777});
  const result=simulateRace({...f.input,groupRidingModel:'stable-pack',
    diagnosticLevel:'checkpoints'});
  const start=result.events.find(e=>e.type==='bridge-start'&&e.riderId==='F036');
  const end=result.events.find(e=>e.type==='bridge-stop'&&e.riderId==='F036'&&
    start&&e.timeS>start.timeS&&e.description.includes('erreicht'));
  assert.ok(start,'konkreter Anschlussversuch muss stattfinden');
  assert.ok(end,'beobachteter Anschluss muss erreicht werden');
  assert.ok(end.timeS-start.timeS>600,'kein Abbruch nach einer Minute');
  assert.ok(result.events.some(e=>e.type==='chase'&&e.riderId==='F036'&&
    e.timeS>start.timeS&&e.timeS<end.timeS),'Nachführarbeit nach Antritt');
  assert.equal(result.classification.length,154);
  assert.ok(result.classification.every(r=>r.finalWPrimeJ>=0&&
    Math.abs(r.energyResidualJ)<.05),'physikalische und energetische Bilanz');
});
