import test from 'node:test';
import assert from 'node:assert/strict';
import {endurancePowerAvailability,initialEnduranceState}
  from '../src/engine/race/endurance.ts';
test('R24: gleicher Ermüdungszustand springt nach 90 Minuten nicht in einer Sekunde',()=>{
  const base={...initialEnduranceState(),carbohydrateKcal:330,workloadHours:.9};
  const at=t=>endurancePowerAvailability({...base,elapsedS:t});
  assert.equal(at(0),1);
  assert.ok(at(3600)<1&&at(3600)>at(5400));
  assert.ok(Math.abs(at(5401)-at(5400))<1e-10);
  assert.ok(Math.abs(at(5400)-at(5399))<.001);
  assert.ok(at(5400)>=.6);
});
