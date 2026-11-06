import test from 'node:test';
import assert from 'node:assert/strict';
import {localGroupReference} from '../src/engine/race/local-group-reference.ts';
import {decideGroupRiding} from '../src/engine/race/group-riding.ts';

const observed={
  stablePack:true,
  ownSpeedMps:8.946776741455789,
  frontSpeedMps:8.953316649516598,
  frontAccelerationMps2:0.000003422250660634063,
  groupSpeedMps:8.917205519541263,
  groupAccelerationMps2:0.6767936576182998,
  distanceFromGroupFrontM:120,
};

test('R24 Versuch: entfernte Beschleunigungsprognose übersteuert kein stabiles Vorderrad',()=>{
  const r=localGroupReference(observed);
  assert.equal(r.accelerationMps2,observed.frontAccelerationMps2);
  assert.ok(Number.isFinite(r.speedMps));
  assert.ok(r.speedMps>8.9&&r.speedMps<9);
});

test('R24 Versuch: echte lokale Beschleunigung und abrückendes Vorderrad bleiben wirksam',()=>{
  const accelerating=localGroupReference({...observed,
    frontAccelerationMps2:0.25,frontSpeedMps:9.35});
  assert.ok(accelerating.accelerationMps2>0.25);
  const remoteDifferentSpeed=localGroupReference({...observed,groupSpeedMps:11});
  assert.ok(remoteDifferentSpeed.accelerationMps2>0.4);
  const nearFront=localGroupReference({...observed,distanceFromGroupFrontM:5});
  assert.ok(nearFront.accelerationMps2>0.4);
  const oldModel=localGroupReference({...observed,stablePack:false});
  assert.equal(oldModel.accelerationMps2,observed.groupAccelerationMps2);
});

test('R24 Versuch: keine Watt-, Positions- oder Energie-Gutschrift',()=>{
  const reference=localGroupReference(observed);
  const observedPace=decideGroupRiding({
    groupSize:154,distanceFromGroupFrontM:120,frontGapM:5.3156,
    frontSpeedMps:observed.frontSpeedMps,
    referenceSpeedMps:reference.speedMps,
    referenceAccelerationMps2:reference.accelerationMps2,
    isPacer:false,groupPacerPowerW:359.73,
    ownSpeedMps:observed.ownSpeedMps,desiredPowerW:272.37,
    criticalPowerW:410,reserveFraction:1,tacticalIntent:'windschatten',
    riderMassKg:70,bikeMassKg:8,dragAreaM2:0.3,aeroFactor:0.633,
    gradeFraction:0.027305834164012905,rollingCoefficient:0.004,
    airDensityKgM3:1.2,drivetrainEfficiency:0.975,
    headwindMps:0,crosswindMps:0,
  });
  assert.equal(observedPace.reason,'follow_group');
  assert.ok(observedPace.powerW>=0&&observedPace.powerW<=410*1.12);
});
