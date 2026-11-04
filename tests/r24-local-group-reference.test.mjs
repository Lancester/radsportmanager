import test from 'node:test';
import assert from 'node:assert/strict';
import {GROUP_FRONT_INFLUENCE_M,localGroupReference}
  from '../src/engine/race/local-group-reference.ts';
import {formationAeroFactors,raceAeroFactor}
  from '../src/engine/race/formation-aero.ts';
import {decidePackInstruction,pelotonGroups}
  from '../src/engine/race/peloton.ts';

test('R24: kilometerlange Abstandskette nimmt lokales Vorderrad als Referenz',()=>{
  const riders=Array.from({length:30},(_,i)=>({id:'F'+i,positionM:2000-i*40}));
  assert.equal(pelotonGroups(riders).length,1);
  assert.equal(riders[0].positionM-riders.at(-1).positionM,1160);
  const p={stablePack:true,ownSpeedMps:10,frontSpeedMps:10,
    frontAccelerationMps2:0,groupSpeedMps:20,groupAccelerationMps2:.5,
    distanceFromGroupFrontM:1160};
  assert.deepEqual(localGroupReference(p),{speedMps:10,accelerationMps2:0});
  assert.deepEqual(localGroupReference({...p,
    distanceFromGroupFrontM:GROUP_FRONT_INFLUENCE_M/2}),
    {speedMps:15,accelerationMps2:.25});
  assert.deepEqual(localGroupReference({...p,stablePack:false}),
    {speedMps:20,accelerationMps2:.5});
});
test('R24: neue Formation vergibt bei Gleichstand und 30 m keinen alten Phantomschutz',()=>{
  for(const gap of [0,30]){
    const rows=[{id:'A',positionM:100},{id:'B',positionM:100-gap}];
    const formation=formationAeroFactors(rows).get('B');
    const legacyPack=decidePackInstruction({frontGapM:gap,frontSpeedMps:10,
      ownSpeedMps:10,desiredPowerW:300,criticalPowerW:400,
      tacticalIntent:'grundtempo',reserveFraction:1}).aeroFactor;
    assert.equal(formation,1);
    assert.ok(legacyPack<1);
    assert.equal(raceAeroFactor({formation,legacyPack,stablePack:true}),1);
    assert.equal(raceAeroFactor({formation,legacyPack,stablePack:false}),legacyPack);
  }
});
