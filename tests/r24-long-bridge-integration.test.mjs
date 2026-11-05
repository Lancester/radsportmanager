import test from 'node:test';
import assert from 'node:assert/strict';
import {createReferenceFixture} from '../src/engine/race/reference-fixtures.ts';
import {simulateRace} from '../src/engine/race/race-simulator.ts';

test('Berglauf: Anschluss kann nach der Attacke viele Minuten dauern und gelingen',()=>{
  const f=createReferenceFixture({routeId:'tdf25_hautacam',seed:777});
  const result=simulateRace({...f.input,groupRidingModel:'stable-pack',
    diagnosticLevel:'checkpoints'});
  const pending=new Map();let longSuccessful=null;
  for(const e of result.events){
    if(e.type==='bridge-start'&&e.riderId)pending.set(e.riderId,e);
    if(e.type==='bridge-stop'&&e.riderId){
      const start=pending.get(e.riderId);pending.delete(e.riderId);
      if(start&&e.timeS-start.timeS>600&&e.description.includes('erreicht')&&
        result.events.some(c=>c.type==='chase'&&c.riderId===e.riderId&&
          c.timeS>start.timeS&&c.timeS<e.timeS))longSuccessful={start,end:e};
    }
  }
  assert.ok(longSuccessful,'ein tatsächlicher Anschluss dauert über 10 Minuten');
  assert.equal(result.classification.length,154);
  assert.ok(result.classification.every(r=>r.finalWPrimeJ>=0&&
    Math.abs(r.energyResidualJ)<.05),'physikalische und energetische Bilanz');
});
