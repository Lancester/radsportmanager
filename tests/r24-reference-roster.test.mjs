import test from 'node:test';
import assert from 'node:assert/strict';
import {createReferenceFixture,REFERENCE_ROUTES}
  from '../src/engine/race/reference-fixtures.ts';

test('R24: identisches Fahrerfeld ist ueber Strecken hinweg vergleichbar',()=>{
  const fixtures=Object.keys(REFERENCE_ROUTES).map(routeId=>
    createReferenceFixture({routeId,seed:2026,rosterKind:'flach'}));
  for(const f of fixtures.slice(1)){
    assert.deepEqual(f.input.riders,fixtures[0].input.riders);
    assert.deepEqual(f.input.teams,fixtures[0].input.teams);
  }
  assert.notDeepEqual(fixtures[0].input.segments,fixtures[3].input.segments);
});
