import test from 'node:test';
import assert from 'node:assert/strict';
import {createReferenceFixture} from '../src/engine/race/reference-fixtures.ts';
import {simulateRace} from '../src/engine/race/race-simulator.ts';

test('R24: Anschlussmessung ist optional, bilanziert reale Watt und ändert kein Rennen',()=>{
  const f=createReferenceFixture({routeId:'tdf25_hautacam',seed:2026});
  let remaining=30000;
  const segments=[];
  for(const segment of f.input.segments){
    if(remaining<=0)break;
    const lengthM=Math.min(segment.lengthM,remaining);
    segments.push({...segment,lengthM});remaining-=lengthM;
  }
  const input={...f.input,segments,groupRidingModel:'stable-pack'};
  const a=simulateRace(input),b=simulateRace({...input,diagnosticLevel:'checkpoints'});
  assert.equal(a.diagnostics.rejoinWork,undefined);
  assert.ok(Array.isArray(b.diagnostics.rejoinWork));
  assert.ok(b.diagnostics.rejoinWork.length>0,'Kontrolllauf muss Anschlussaufträge enthalten');
  assert.deepEqual(b.classification,a.classification);
  assert.deepEqual(b.events,a.events);
  for(const row of b.diagnostics.rejoinWork){
    assert.ok(row.assignedS>0&&row.actualFrontS>=0&&row.actualFrontS<=row.assignedS);
    assert.ok(row.appliedWorkJ>=0&&row.actualFrontWorkJ>=0&&row.actualFrontWorkJ<=row.appliedWorkJ);
  }
});
