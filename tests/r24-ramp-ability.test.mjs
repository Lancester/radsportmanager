import test from 'node:test';
import assert from 'node:assert/strict';
import {rampAbilityWPerKg} from '../src/engine/race/ramp-ability.ts';

test('R24: verfügbare Wprime-Reserve unterscheidet dreiminütige Rampenleistung',()=>{
  const base={effectiveCpW:400,remainingWPrimeJ:18000,peakPowerW:1000,
    riderMassKg:72,bikeMassKg:8};
  assert.equal(rampAbilityWPerKg(base),500/80);
  assert.equal(rampAbilityWPerKg({...base,remainingWPrimeJ:36000}),600/80);
  assert.equal(rampAbilityWPerKg({...base,remainingWPrimeJ:0}),400/80);
  assert.equal(rampAbilityWPerKg({...base,remainingWPrimeJ:36000,
    peakPowerW:550}),550/80);
  assert.throws(()=>rampAbilityWPerKg({...base,peakPowerW:399}),RangeError);
});
