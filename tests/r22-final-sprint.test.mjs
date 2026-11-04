import test from 'node:test';
import assert from 'node:assert/strict';
import {decideSprintLaunch,inferredSprintPeakPowerW,sprintPowerDemand,
  FINAL_SPRINT} from '../src/engine/race/final-sprint.ts';
import {initialCpState,applyCpWprimeStep}
  from '../src/engine/physiology/critical-power.ts';

const situation={remainingM:330,launchPreference:.75,
  sprintSkill:.95,groupSize:65,rankInGroup:14,
  distanceFromGroupFrontM:22,frontWheelGapM:4,
  aeroFactor:.68,ownSpeedMps:16,groupFrontSpeedMps:16.2,
  headwindMps:0,reserveFraction:.9};
test('R22 Sprintstart individuell – weder für alle 250 m noch alle 400 m',()=>{
  const early=decideSprintLaunch({...situation,
    launchPreference:.95,frontWheelGapM:16,aeroFactor:.95});
  const late=decideSprintLaunch({...situation,launchPreference:.1});
  assert.equal(early.shouldLaunch,true);
  assert.equal(late.shouldLaunch,false);
  assert.ok(early.triggerDistanceM>late.triggerDistanceM+100);
  assert.ok(early.triggerDistanceM<=FINAL_SPRINT.earliestRemainingM);
  assert.ok(late.triggerDistanceM>=FINAL_SPRINT.latestRemainingM);
  assert.equal(decideSprintLaunch({...situation,
    remainingM:600}).shouldLaunch,false);
  assert.equal(decideSprintLaunch({...situation,
    groupSize:1}).shouldLaunch,false);
});
test('R22 Sprintentscheidung hängt von realer Position, Hinterrad und Gegenwind ab',()=>{
  const front=decideSprintLaunch({...situation,
    rankInGroup:2,distanceFromGroupFrontM:2,
    frontWheelGapM:3,aeroFactor:.6});
  const rear=decideSprintLaunch({...situation,
    rankInGroup:55,distanceFromGroupFrontM:140,
    frontWheelGapM:20,aeroFactor:1});
  assert.ok(rear.triggerDistanceM>front.triggerDistanceM+65);
  const wind=decideSprintLaunch({...situation,
    headwindMps:5});
  assert.ok(wind.triggerDistanceM<
    decideSprintLaunch(situation).triggerDistanceM);
  assert.equal(decideSprintLaunch({...situation,
    reserveFraction:.01}).shouldLaunch,false);
});
test('R22 Sprintspitzenwatt und Ermüdung real in CP/Wprime abgerechnet',()=>{
  const peak=inferredSprintPeakPowerW({
    massKg:80.2,sprintSkill:.95});
  assert.ok(peak>1200&&peak<1500);
  const cp=390;
  const p0=sprintPowerDemand({criticalPowerW:cp,
    sprintPeakPowerW:peak,sprintSkill:.95,elapsedS:0});
  const p12=sprintPowerDemand({criticalPowerW:cp,
    sprintPeakPowerW:peak,sprintSkill:.95,elapsedS:12});
  const p32=sprintPowerDemand({criticalPowerW:cp,
    sprintPeakPowerW:peak,sprintSkill:.95,elapsedS:32});
  assert.equal(p0,peak);
  assert.ok(p0>p12&&p12>p32&&p32>cp);
  const rider={riderId:'Sprint',criticalPowerW:cp,
    wPrimeCapacityJ:1900,recoveryEfficiency:.22};
  let energy=initialCpState(rider),used=0;
  for(let i=0;i<12;i++){
    const requested=sprintPowerDemand({criticalPowerW:cp,
      sprintPeakPowerW:peak,sprintSkill:.95,elapsedS:i});
    const step=applyCpWprimeStep(rider,energy,requested,1);
    energy=step.state;used+=step.usedJ;
    assert.ok(step.appliedPowerW<=requested);
    assert.ok(step.appliedPowerW>=0);
  }
  assert.ok(energy.remainingWPrimeJ>=0);
  assert.ok(used<=1900.0001);
});
test('R22 Sprintleistung unabhängig vom Radius, Eingaben werden geprüft',()=>{
  assert.throws(()=>sprintPowerDemand({criticalPowerW:400,
    sprintPeakPowerW:2600,sprintSkill:.9,elapsedS:0}),RangeError);
  assert.throws(()=>decideSprintLaunch({...situation,
    launchPreference:1.3}),RangeError);
  assert.ok(inferredSprintPeakPowerW({massKg:65,
    sprintSkill:.4})<
    inferredSprintPeakPowerW({massKg:80,sprintSkill:.95}));
});
