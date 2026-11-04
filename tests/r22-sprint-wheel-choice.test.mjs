import test from 'node:test';
import assert from 'node:assert/strict';
import {chooseIndependentSprintWheel,SPRINT_WHEEL}
  from '../src/engine/race/sprint-wheel-choice.ts';

const base={
  wheelFindingSkill:.90,sprintSkill:.94,
  remainingM:8500,groupSize:68,
  ownSpeedMps:13.2,criticalPowerW:390,
  reserveFraction:.82,currentIntent:'windschatten',
  hasTeamHelperAhead:false,desiredFollowW:192,
  riderMassKg:80,bikeMassKg:7.7,
  dragAreaM2:.285,aeroFactor:.67,
  gradeFraction:0,rollingCoefficient:.004,
  airDensityKgM3:1.2,drivetrainEfficiency:.975,
  headwindMps:0,crosswindMps:0,
  wheels:[
    {riderId:'R1',gapAheadM:4,speedMps:13.5,sprintSkill:.55},
    {riderId:'R2',gapAheadM:9,speedMps:13.8,sprintSkill:.92},
    {riderId:'R3',gapAheadM:26,speedMps:16,sprintSkill:.99},
  ],
};
test('R-22 unabhängiger Sprinter erkennt ein reales gegnerisches Rad',()=>{
  const x=chooseIndependentSprintWheel(base);
  assert.ok(x,'ohne Helfer sind physisch erreichbare Fremdräder möglich');
  assert.equal(x.reason,'independent_wheel');
  assert.equal(x.wheelRiderId,'R2');
  assert.ok(x.powerW>base.desiredFollowW);
  assert.ok(x.powerW<=base.criticalPowerW*SPRINT_WHEEL.maximumCpFraction);
});
test('R-22 gutes Talent reagiert früher, schlechte Hinterradfindung später',()=>{
  assert.ok(chooseIndependentSprintWheel(base));
  assert.equal(chooseIndependentSprintWheel({...base,
    wheelFindingSkill:.20}),null);
  assert.ok(chooseIndependentSprintWheel({...base,
    wheelFindingSkill:.20,remainingM:3000}));
});
test('R-22 Helfer-Rad hat Vorrang; kein erfundener fremder Windschatten',()=>{
  for(const obs of [
    {...base,hasTeamHelperAhead:true},
    {...base,wheels:[]},
    {...base,wheels:[{riderId:'X',gapAheadM:26,speedMps:14.5,
      sprintSkill:1}]},
    {...base,wheels:[{riderId:'X',gapAheadM:-2,speedMps:14.5,
      sprintSkill:1}]},
    {...base,wheels:[{riderId:'X',gapAheadM:5,speedMps:10,
      sprintSkill:1}]},
    {...base,groupSize:1},
    {...base,remainingM:200},
    {...base,currentIntent:'sprint'},
    {...base,currentIntent:'angriff'},
    {...base,reserveFraction:.10},
  ])assert.equal(chooseIndependentSprintWheel(obs),null);
});
test('R-22 talentabhängige Wahl ändert niemals die Sprintmaximalwatt',()=>{
  const talent=chooseIndependentSprintWheel(base);
  const low=chooseIndependentSprintWheel({...base,
    wheelFindingSkill:.20,remainingM:3000});
  assert.ok(talent);
  assert.ok(low);
  assert.ok(talent.powerW<=base.criticalPowerW*1.06);
  assert.ok(low.powerW<=base.criticalPowerW*1.06);
  assert.ok(talent.powerW>=low.powerW,
    'geübter Fahrer darf präziser auf das schnelle Rad reagieren');
});
