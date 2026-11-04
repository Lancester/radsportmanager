import test from 'node:test';
import assert from 'node:assert/strict';
import {decideSprintLaunch} from '../src/engine/race/final-sprint.ts';

const solo={remainingM:200,launchPreference:.7,sprintSkill:.9,
  groupSize:1,rankInGroup:1,distanceFromGroupFrontM:0,frontWheelGapM:70,
  aeroFactor:1,ownSpeedMps:14,groupFrontSpeedMps:14,
  headwindMps:0,reserveFraction:.8};

test('R24: ein Sprinter kann trotz Gruppengrenze gegen nahe Fahrer antreten',()=>{
  assert.equal(decideSprintLaunch({...solo,nearbyRiderGapM:70}).shouldLaunch,true);
  assert.equal(decideSprintLaunch({...solo,nearbyRiderGapM:121}).shouldLaunch,false);
  assert.equal(decideSprintLaunch({...solo,nearbyRiderGapM:null}).shouldLaunch,false);
  assert.equal(decideSprintLaunch({...solo,nearbyRiderGapM:70,
    reserveFraction:0}).shouldLaunch,false);
  assert.throws(()=>decideSprintLaunch({...solo,nearbyRiderGapM:-1}),RangeError);
});
