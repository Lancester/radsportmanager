import test from 'node:test';
import assert from 'node:assert/strict';
import {decideClassicsPunch,CLASSICS_PUNCH}
  from '../src/engine/race/classics-punch.ts';

const base={
  specialty:'klassiker',role:'kapitaen',strategy:'offensiv',
  raceLengthM:252000,shortSteepClimbs:5,progress:.858,
  segmentLengthM:1600,segmentProgress:.45,gradeFraction:.088,
  groupSize:26,distanceFromGroupFrontM:14,
  criticalPowerW:368,reserveFraction:.93,lastAttackAgeS:1500,
  currentIntent:'windschatten',designatedRampRider:true,
  attackRankInGroup:1,gapToActualRaceFrontM:30,speedMps:5.2,
  riderMassKg:71,bikeMassKg:7.7,dragAreaM2:.274,
  airDensityKgM3:1.2,rollingCoefficient:.004,
  drivetrainEfficiency:.975,headwindMps:0,crosswindMps:0,
};
test('R22 Klassiker: echte kurze Rampenattacke fordert CP-Wprime-Watt ohne Tempo-/Positionsbonus',()=>{
  const a=decideClassicsPunch(base);
  assert.ok(a!==null,'vorne positionierter Klassiker darf sinnvoll attackieren');
  assert.ok(a.powerW>base.criticalPowerW);
  assert.ok(a.powerW<=base.criticalPowerW*CLASSICS_PUNCH.maxAttackCpFraction);
  assert.match(a.reason,/Kurzer Steilanstieg/);
});
test('R22 Klassiker: keine Spezialattacke im Flach-/Hügel-/Bergprofil und keine Überlastungsfantasie',()=>{
  for(const obs of [
    {...base,raceLengthM:184900},
    {...base,raceLengthM:209100},
    {...base,shortSteepClimbs:2},
    {...base,segmentLengthM:13500},
    {...base,gradeFraction:.05},
    {...base,segmentProgress:.05},
    {...base,groupSize:1},
    {...base,distanceFromGroupFrontM:116},
    {...base,reserveFraction:.2},
    {...base,specialty:'sprinter'},
    {...base,designatedRampRider:false},
    {...base,attackRankInGroup:2},
    {...base,gapToActualRaceFrontM:1400},
    {...base,criticalPowerW:250},
    {...base,speedMps:9},
    {...base,lastAttackAgeS:30},
    {...base,currentIntent:'erholung'},
  ])assert.equal(decideClassicsPunch(obs),null);
});
test('R22 Klassiker: kurzer entschlossener Ausreißversuch, danach bewusste Erholungspause',()=>{
  const first=decideClassicsPunch(base);
  assert.ok(first);
  const ongoing=decideClassicsPunch({...base,currentIntent:'angriff',
    lastAttackAgeS:20});
  assert.ok(ongoing);
  assert.ok(decideClassicsPunch({...base,currentIntent:'angriff',
    groupSize:1,distanceFromGroupFrontM:0,lastAttackAgeS:120}),
    'Bereits abgesetzter Fahrer soll seine echte Wattattacke fortsetzen können');
  assert.equal(decideClassicsPunch({...base,currentIntent:'angriff',
    lastAttackAgeS:190}),null);
  assert.equal(decideClassicsPunch({...base,lastAttackAgeS:350}),null);
  assert.ok(decideClassicsPunch({...base,lastAttackAgeS:700}));
});


test('R22 Klassiker: stärkster vorgesehener Helfer darf selektiv attackieren, normale Helfer nicht',()=>{
  const helper={...base,role:'helfer',designatedRampRider:true};
  assert.ok(decideClassicsPunch(helper),
    'sportlich nominierter starker Helfer darf mit echter Wprime-Leistung attackieren');
  assert.equal(decideClassicsPunch({...helper,attackRankInGroup:3}),null);
  assert.equal(decideClassicsPunch({...helper,designatedRampRider:false}),null);
  // Auch nach echter Ablösung darf die begonnene Attacke weitergehen.
  assert.ok(decideClassicsPunch({...helper,currentIntent:'angriff',
    attackRankInGroup:0,groupSize:1,gapToActualRaceFrontM:1500,
    lastAttackAgeS:80}));
});


test('R22 Klassiker: klare räumliche Grenze für neue Attacke, nicht für laufende Vorstöße',()=>{
  assert.ok(decideClassicsPunch({...base,gapToActualRaceFrontM:1000}));
  assert.equal(decideClassicsPunch({...base,gapToActualRaceFrontM:1000.1}),null);
  assert.equal(decideClassicsPunch({...base,attackRankInGroup:0}),null);
  assert.ok(decideClassicsPunch({...base,currentIntent:'angriff',
    groupSize:1,attackRankInGroup:0,gapToActualRaceFrontM:1400,
    lastAttackAgeS:40}));
});
