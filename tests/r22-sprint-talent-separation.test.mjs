import test from 'node:test';
import assert from 'node:assert/strict';
import {chooseIndependentSprintWheel} from '../src/engine/race/sprint-wheel-choice.ts';
test('R-22 Hinterradfinden erfordert tatsächlich vorhandene gegnerische Räder',()=>{
  assert.equal(chooseIndependentSprintWheel({wheelFindingSkill:1,sprintSkill:1,remainingM:3000,groupSize:10,ownSpeedMps:13,criticalPowerW:400,reserveFraction:1,currentIntent:'windschatten',hasTeamHelperAhead:false,desiredFollowW:200,riderMassKg:75,bikeMassKg:7.7,dragAreaM2:.285,aeroFactor:.65,gradeFraction:0,rollingCoefficient:.004,airDensityKgM3:1.2,drivetrainEfficiency:.975,headwindMps:0,crosswindMps:0,wheels:[]}),null);
});
