import test from 'node:test';
import assert from 'node:assert/strict';
import {ChaseLeaderTelemetry} from '../src/engine/race/chase-leader-telemetry.ts';
import {initialChaseHelperLoad,advanceChaseHelperLoad}
  from '../src/engine/race/chase-helper-fatigue.ts';

test('R24: frontnah im Windschatten ist keine Fuehrungszeit im Wind',()=>{
  const a=new ChaseLeaderTelemetry();
  const base={leaderId:'H',dt:1,inMainGroup:true,mainGroupSize:30,
    gapToActualMainFrontM:17,mission:'jagd',duty:'fuehrung',
    intent:'verfolgung',appliedPowerW:350,criticalPowerW:400};
  a.observe({...base,isAtWindFront:false,aeroFactor:.65});
  a.observe({...base,isAtWindFront:true,aeroFactor:.65});
  a.observe({...base,isAtWindFront:true,aeroFactor:1});
  const r=a.report();
  assert.equal(r.frontSeconds,3);
  assert.equal(r.exposedSeconds,1);
  assert.equal(r.longestExposedSeconds,1);
  assert.equal(r.exposedCpNearSeconds,1);
  assert.equal(r.longestExposedCpNearSeconds,1);
});
test('R24: CP-nahe Windarbeit bezieht die aktuelle Ermuendung ein',()=>{
  const a=new ChaseLeaderTelemetry();
  a.observe({leaderId:'H',dt:1,inMainGroup:true,mainGroupSize:30,
    gapToActualMainFrontM:0,mission:'jagd',duty:'fuehrung',
    intent:'verfolgung',appliedPowerW:300,criticalPowerW:400,
    effectiveCriticalPowerW:320,isAtWindFront:true,aeroFactor:1});
  assert.equal(a.report().cpNearFrontSeconds,0);
  assert.equal(a.report().exposedCpNearSeconds,1);
});
test('R24: geschuetzte Teamarbeit zaehlt nicht als Frontarbeit im Wind',()=>{
  const sample={enabled:true,progress:.8,timeS:12000,dt:1,
    teamStrategy:'sprint',role:'helfer',mission:'jagd',duty:'fuehrung',
    distanceFromRealGroupFrontM:1,physicalGroupSize:30,
    criticalPowerW:350,appliedCrankPowerW:350,
    reserveFraction:.8,enduranceAvailability:.9};
  const r=advanceChaseHelperLoad(initialChaseHelperLoad(),
    {...sample,actualWindExposure:false});
  assert.equal(r.state.realFrontSeconds,0);
  const wind=advanceChaseHelperLoad(r.state,
    {...sample,actualWindExposure:true});
  assert.equal(wind.state.realFrontSeconds,1);
});
