import test from 'node:test';
import assert from 'node:assert/strict';
import {endurancePowerAvailability,initialEnduranceState,R19_ENDURANCE}
  from '../src/engine/race/endurance.ts';
import {applyCpWprimeStep,initialCpState} from '../src/engine/physiology/critical-power.ts';
import {createReferenceFixture} from '../src/engine/race/reference-fixtures.ts';
import {validateRace} from '../src/engine/race/race-simulator.ts';

test('R24: Ausdauerresistenz reduziert Langzeitverlust individuell, Legacy bleibt gleich',()=>{
 const s={...initialEnduranceState(),elapsedS:18000,carbohydrateKcal:200,workloadHours:1.5};
 const poor=endurancePowerAvailability(s,'smooth',.8);
 const normal=endurancePowerAvailability(s,'smooth',1);
 const strong=endurancePowerAvailability(s,'smooth',1.2);
 assert.ok(poor<normal&&normal<strong&&strong<=1);
 assert.ok(poor>=1-R19_ENDURANCE.maximumPowerReduction);
 assert.equal(endurancePowerAvailability(s,'legacy',.8),endurancePowerAvailability(s,'legacy',1.2));
 assert.throws(()=>endurancePowerAvailability(s,'smooth',.69),RangeError);
});
test('R24: unabhängig schnellere Wprime-Erholung verändert nicht CP oder vorhandene Energie',()=>{
 const p={riderId:'test',criticalPowerW:400,wPrimeCapacityJ:30000,initialWPrimeJ:0};
 const recover=factor=>{let s=initialCpState({...p,recoveryEfficiency:.22*factor});
   for(let t=0;t<600;t++)s=applyCpWprimeStep({...p,recoveryEfficiency:.22*factor},s,200,1).state;
   return s;};
 const slow=recover(.85),fast=recover(1.15);
 assert.ok(slow.remainingWPrimeJ<fast.remainingWPrimeJ);
 assert.ok(fast.remainingWPrimeJ<=30000);
 assert.equal(slow.spentAboveCpJ,0);assert.equal(fast.spentAboveCpJ,0);
});
test('R24: Referenzfahrer besitzen unabhängige dauerhafte Eigenschaften; ungültige Werte werden abgewiesen',()=>{
 const x=createReferenceFixture({routeId:'tdf25_lille',seed:2026}).input;
 assert.ok(new Set(x.riders.map(r=>r.durabilityFactor)).size>1);
 assert.ok(new Set(x.riders.map(r=>r.wPrimeRecoveryFactor)).size>1);
 assert.ok(x.riders.some(r=>r.durabilityFactor>1&&r.wPrimeRecoveryFactor<1));
 assert.ok(x.riders.some(r=>r.durabilityFactor<1&&r.wPrimeRecoveryFactor>1));
 assert.doesNotThrow(()=>validateRace(x));
 for(const key of ['durabilityFactor','wPrimeRecoveryFactor']){
   const riders=x.riders.map((r,i)=>i? r:{...r,[key]:1.31});
   assert.throws(()=>validateRace({...x,riders}),RangeError);
 }
});
