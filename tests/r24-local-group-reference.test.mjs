import {decideGroupRiding} from '../src/engine/race/group-riding.ts';
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


test('R24: verzögernde Fernspitze unterdrückt kein öffnendes schnelleres Vorderrad',()=>{
  const p={stablePack:true,ownSpeedMps:18.8,frontSpeedMps:19.2,
    frontAccelerationMps2:.02,groupSpeedMps:20.3,
    groupAccelerationMps2:-.25,distanceFromGroupFrontM:160};
  const corrected=localGroupReference(p);
  assert.equal(corrected.accelerationMps2,.02);
  const old=-.25*.68+.02*.32;
  assert.ok(corrected.accelerationMps2>old);
  // Kein Sonderfall bei geschlossenem Geschwindigkeitsunterschied,
  // verlangsamendem Vorderrad, fehlendem Vorderrad oder alten Modellen.
  assert.ok(localGroupReference({...p,frontSpeedMps:18.7}).accelerationMps2<0);
  assert.ok(localGroupReference({...p,frontAccelerationMps2:-.02}).accelerationMps2<0);
  assert.ok(localGroupReference({...p,frontSpeedMps:null}).accelerationMps2<0);
  assert.equal(localGroupReference({...p,stablePack:false}).accelerationMps2,-.25);
});


test('R24: lokaler Widerspruch führt zu echter Nachführleistung, nicht zu Positionsbonus',()=>{
  const reference=localGroupReference({stablePack:true,ownSpeedMps:18.8,
    frontSpeedMps:19.2,frontAccelerationMps2:.02,groupSpeedMps:20.3,
    groupAccelerationMps2:-.25,distanceFromGroupFrontM:160});
  const o={groupSize:154,distanceFromGroupFrontM:160,frontGapM:6.5,
    frontSpeedMps:19.2,referenceSpeedMps:reference.speedMps,
    referenceAccelerationMps2:reference.accelerationMps2,isPacer:false,
    groupPacerPowerW:350,ownSpeedMps:18.8,desiredPowerW:300,
    criticalPowerW:331,reserveFraction:.8,tacticalIntent:'windschatten',
    riderMassKg:60.8,bikeMassKg:7.7,dragAreaM2:.2709,aeroFactor:.42,
    gradeFraction:-.04,rollingCoefficient:.004,airDensityKgM3:1.2,
    drivetrainEfficiency:.975,headwindMps:0,crosswindMps:0};
  const old=decideGroupRiding({...o,referenceAccelerationMps2:-.1636});
  const corrected=decideGroupRiding(o);
  assert.equal(old.powerW,0);
  assert.ok(corrected.powerW>100&&corrected.powerW<=331*1.12);
  assert.equal(corrected.reason,'follow_group');
});
