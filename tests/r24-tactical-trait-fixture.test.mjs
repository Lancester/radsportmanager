import test from 'node:test';
import assert from 'node:assert/strict';
import {createReferenceFixture} from '../src/engine/race/reference-fixtures.ts';
import {simulateRace} from '../src/engine/race/race-simulator.ts';

test('Optionale taktische Werte sind individuell, stabil und verändern keine körperlichen Fahrerwerte',()=>{
 const base={routeId:'tdf25_hautacam',teamCount:5};
 const prior=createReferenceFixture({...base,seed:2026}).input;
 const varied=createReferenceFixture({...base,seed:2026,tacticalTraits:'varied'}).input;
 const otherSeed=createReferenceFixture({...base,seed:2027,tacticalTraits:'varied'}).input;
 const traits=varied.riders.map(({pursuitPersistence,climbingAttackPreference})=>
   ({pursuitPersistence,climbingAttackPreference}));
 assert.deepEqual(traits,otherSeed.riders.map(({pursuitPersistence,climbingAttackPreference})=>
   ({pursuitPersistence,climbingAttackPreference})));
 assert.ok(new Set(traits.map(r=>r.pursuitPersistence)).size>1);
 assert.ok(new Set(traits.map(r=>r.climbingAttackPreference)).size>1);
 assert.ok(traits.some(r=>r.pursuitPersistence>.5&&r.climbingAttackPreference<.5));
 assert.ok(traits.some(r=>r.pursuitPersistence<.5&&r.climbingAttackPreference>.5));
 assert.ok(traits.every(r=>r.pursuitPersistence>=.2&&r.pursuitPersistence<=.8&&
   r.climbingAttackPreference>=.2&&r.climbingAttackPreference<=.8));
 const withoutTraits=varied.riders.map(({pursuitPersistence,climbingAttackPreference,...r})=>r);
 assert.deepEqual(withoutTraits,prior.riders);
 assert.ok(prior.riders.every(r=>r.pursuitPersistence===undefined&&
   r.climbingAttackPreference===undefined));
 assert.throws(()=>createReferenceFixture({...base,tacticalTraits:'other'}),RangeError);
});
test('Testfeld mit taktischen Eigenschaften ist in einem echten Rennlauf reproduzierbar',()=>{
 const x=createReferenceFixture({routeId:'tdf25_hautacam',teamCount:5,
  seed:2026,tacticalTraits:'varied'}).input;
 let remaining=10000;
 const segments=x.segments.flatMap(s=>{
  const lengthM=Math.min(remaining,s.lengthM);remaining-=lengthM;
  return lengthM>0?[{...s,lengthM}]:[];
 });
 const input={...x,segments,groupRidingModel:'stable-pack'};
 const a=simulateRace(input),b=simulateRace(input);
 assert.deepEqual(a.classification,b.classification);
 assert.deepEqual(a.events,b.events);
 assert.equal(a.finisherCount,35);
 assert.ok(a.classification.every(r=>r.finalWPrimeJ>=0&&Math.abs(r.energyResidualJ)<.05));
});
