import test from 'node:test';
import assert from 'node:assert/strict';
import {decideClimbTempo,CLIMB_TEMPO}
  from '../src/engine/race/climb-tempo.ts';

const observation={
  groupSize:50,distanceFromGroupFrontM:70,
  frontGapM:3,frontSpeedMps:5,
  referenceSpeedMps:5,referenceAccelerationMps2:0,
  isPacer:false,groupPacerPowerW:381,
  ownSpeedMps:5,desiredPowerW:245,criticalPowerW:388.6,
  reserveFraction:.85,tacticalIntent:'windschatten',
  riderMassKg:63.8,bikeMassKg:7.7,dragAreaM2:.265,aeroFactor:.4,
  gradeFraction:.078,rollingCoefficient:.004,airDensityKgM3:1.2,
  drivetrainEfficiency:.975,headwindMps:0,crosswindMps:0,
  specialty:'kletterer',role:'kapitaen',remainingM:13500,
  climbLengthM:13500,
};
test('R22 Kletter-KI: nur echte nachhaltige Pedalwatt, niemals Zeit-/Positionsbonus',()=>{
  const p=decideClimbTempo(observation);
  assert.ok(p!==null&&p>245,'Kletterer darf nachhaltig mehr leisten');
  assert.ok(p<=observation.criticalPowerW*CLIMB_TEMPO.sustainedCpFraction);
  assert.ok(decideClimbTempo({...observation,desiredPowerW:800})<=
    observation.criticalPowerW*.98,'Wunschwert der Gruppe darf keine W′-Erfindung auslösen');
});
test('R22 Kletter-KI: kein Berg-Privileg auf Ebene, für schwere Sprinter oder bei CP-Mangel',()=>{
  for(const obs of [
    {...observation,gradeFraction:0},
    {...observation,gradeFraction:0.045},
    {...observation,climbLengthM:1100},
    {...observation,climbLengthM:4500},
    {...observation,role:'helfer'},
    {...observation,specialty:'sprinter'},
    {...observation,tacticalIntent:'sprint'},
    {...observation,tacticalIntent:'angriff'},
    {...observation,tacticalIntent:'erholung'},
    {...observation,isPacer:true},
    {...observation,groupSize:2},
    {...observation,distanceFromGroupFrontM:221},
    {...observation,reserveFraction:.05},
    {...observation,criticalPowerW:270},
  ])assert.equal(decideClimbTempo(obs),null);
});
test('R22 Kletter-KI: Tempoentscheidung folgt tatsächlichem Steigungs- und Luftwiderstand',()=>{
  const steep=decideClimbTempo(observation);
  const faster=decideClimbTempo({...observation,referenceSpeedMps:6.2,
    frontSpeedMps:6.2});
  assert.ok(steep!==null);
  assert.equal(faster,null,
    'Wenn der Pacesetter schneller fährt als der exponierte Fahrer kann, wird kein Überholen angefordert');
  const lighter=decideClimbTempo({...observation,riderMassKg:60});
  assert.ok(lighter!==null&&lighter<=observation.criticalPowerW*.98);
});
