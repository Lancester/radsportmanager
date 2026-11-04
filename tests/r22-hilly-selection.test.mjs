import test from 'node:test';
import assert from 'node:assert/strict';
import {decideHillySelection,HILLY_SELECTION}
  from '../src/engine/race/hilly-selection.ts';
const o={enabled:true,specialty:'klassiker',
  isTeamCandidate:true,isSelectedGroupPacer:true,
  currentIntent:'windschatten',distanceToNextKeyClimbM:null,
  onKeyClimb:true,climbGrade:.09,climbLengthM:1100,
  climbProgress:.5,groupSize:40,
  distanceFromGroupFrontM:22,gapToRaceFrontM:48,
  criticalPowerW:390,requestedPowerW:265,reserveFraction:.8};
test('Hügel: positionsabhängiges Tempo an der echten Schlüsselrampe',()=>{
  const x=decideHillySelection(o);
  assert.equal(x?.reason,'selective_ramp_pace');
  assert.ok(x.powerW>o.requestedPowerW);
  assert.ok(x.powerW<=o.criticalPowerW*HILLY_SELECTION.tempoCpFraction);
  for(const p of ['kletterer','allrounder','gc','zeitfahrer'])
    assert.ok(decideHillySelection({...o,specialty:p}));
  for(const bad of [
    {enabled:false},{specialty:'sprinter'},{isTeamCandidate:false},
    {isSelectedGroupPacer:false},{climbGrade:.03},
    {climbLengthM:10000},{climbProgress:.02},{climbProgress:.99},
    {groupSize:2},{distanceFromGroupFrontM:85},
    {gapToRaceFrontM:480},{reserveFraction:.05},
    {currentIntent:'angriff'},{currentIntent:'erholung'},
    {requestedPowerW:500},
  ])assert.equal(decideHillySelection({...o,...bad}),null);
});
test('Hügel: maximal 32 W mehr beim echten Aufrücken, keine Positionsgutschrift',()=>{
  const approach={...o,onKeyClimb:false,
    distanceToNextKeyClimbM:1500,distanceFromGroupFrontM:48};
  const r=decideHillySelection(approach);
  assert.equal(r?.reason,'approach');
  assert.ok(r.powerW>approach.requestedPowerW);
  assert.ok(r.powerW-approach.requestedPowerW<=32);
  for(const bad of [
    {distanceToNextKeyClimbM:null},
    {distanceToNextKeyClimbM:8000},
    {distanceFromGroupFrontM:5},
    {groupSize:2},{gapToRaceFrontM:700},
    {currentIntent:'angriff'}, {onKeyClimb:true,climbGrade:0},
  ])assert.equal(decideHillySelection({...approach,...bad}),null);
});
