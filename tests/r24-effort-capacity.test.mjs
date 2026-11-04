import test from 'node:test';
import assert from 'node:assert/strict';
import {applyEnduranceLimitedCpStep,enduranceLimitedCapacity}
  from '../src/engine/race/effort-capacity.ts';
import {initialCpState} from '../src/engine/physiology/critical-power.ts';

const profile={riderId:'F',criticalPowerW:400,wPrimeCapacityJ:30000,
  initialWPrimeJ:10000,recoveryEfficiency:.22};
const run=(desiredPowerW,availability=.8,state=initialCpState(profile))=>
  applyEnduranceLimitedCpStep({profile,state,desiredPowerW,dt:1,
    availability,freshPeakPowerW:1000});

test('R24: niedriger Mitfahrbedarf wird nicht durch Ermuedung multipliziert',()=>{
  assert.equal(run(200).appliedPowerW,200);
  assert.equal(run(200).effectiveCpW,320);
  assert.equal(run(200).enduranceLimited,false);
});
test('R24: Ermuedung begrenzt Spitze und CP/Wprime einheitlich',()=>{
  const hard=run(1200);
  assert.equal(hard.appliedPowerW,800);
  assert.equal(hard.enduranceLimited,true);
  assert.equal(hard.usedJ,480);
  const aroundCp=run(350);
  assert.equal(aroundCp.usedJ,30);
  assert.equal(aroundCp.recoveredJ,0);
  const recover=run(300);
  assert.equal(recover.recoveredJ,4.4);
  assert.equal(recover.usedJ,0);
  const empty=run(800,.8,{...initialCpState(profile),remainingWPrimeJ:0});
  assert.equal(empty.appliedPowerW,320);
  assert.equal(empty.state.remainingWPrimeJ,0);
});
test('R24: Leistungsgrenze ist monoton, Eingaben werden geprueft',()=>{
  assert.deepEqual(enduranceLimitedCapacity({profile,availability:1,
    freshPeakPowerW:1000}),{effectiveCpW:400,maximumPowerW:1000});
  assert.ok(run(800,.7).appliedPowerW<=run(800,.8).appliedPowerW);
  assert.throws(()=>run(200,0),RangeError);
  assert.throws(()=>run(-1),RangeError);
});
