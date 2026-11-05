import test from 'node:test';
import assert from 'node:assert/strict';
import {decideSprintPosition} from '../src/engine/race/sprint-positioning.ts';
const base={sprintFriendlyRace:true,strategy:'sprint',specialty:'sprinter',
 isTargetSprinter:true,isEscort:false,progress:.4,remainingM:7000,ownSpeedMps:13,
 wheelFindingSkill:.5,groupSize:100,rankInGroup:70,distanceFromGroupFrontM:120,
 targetRankInGroup:70,distanceToTargetM:0,frontGapM:2,currentIntent:'windschatten',
 reserveFraction:.9,criticalPowerW:400,followPowerW:240};
test('Vorausschau berücksichtigt Position und Zeit bis Ziel statt nur Prozent',()=>{
 const far=decideSprintPosition(base);
 assert.equal(far?.reason,'advance_for_sprint');
 assert.equal(decideSprintPosition({...base,remainingM:40000,rankInGroup:70}),null);
 assert.equal(decideSprintPosition({...base,rankInGroup:5,distanceFromGroupFrontM:4}),null);
});
test('Auch kleinere Gruppen können Positionierungsbedarf haben',()=>{
 const x=decideSprintPosition({...base,remainingM:3000,groupSize:8,rankInGroup:7,
  distanceFromGroupFrontM:20,targetRankInGroup:7});
 assert.ok(x);assert.ok(x.powerW>base.followPowerW);
});
