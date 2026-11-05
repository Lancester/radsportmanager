import test from 'node:test';
import assert from 'node:assert/strict';
import {AttackTelemetry} from '../src/engine/race/attack-telemetry.ts';

test('R24: Angriff protokolliert echte statt nur angeforderte Arbeit',()=>{
  const a=new AttackTelemetry();
  a.start({riderId:'A',timeS:10,positionM:1000,groupIds:['A','B'],
    gapToRaceFrontM:4,wPrimeJ:18000,wPrimeCapacityJ:20000});
  a.observePower({riderId:'A',startTimeS:10,dt:1,
    requestedPowerW:600,appliedPowerW:400,effectiveCpW:320});
  a.observePower({riderId:'A',startTimeS:10,dt:1,
    requestedPowerW:500,appliedPowerW:360,effectiveCpW:320});
  assert.equal(a.needsSample('A',5999),false);
  assert.equal(a.needsSample('A',6000),true);
  a.sample({riderId:'A',timeS:500,positionM:6000,groupSize:1,
    gapToRaceFrontM:0,wPrimeJ:10000,wPrimeCapacityJ:20000,
    positionOf:id=>id==='B'?5900:null});
  const [r]=a.report([{id:'A',rank:3,gapS:12}]);
  assert.equal(r.requestedCrankJ,1100);
  assert.equal(r.appliedCrankJ,760);
  assert.equal(r.appliedAboveEffectiveCpJ,120);
  assert.equal(r.afterFiveKm.gapToFormerGroupFrontM,100);
  assert.equal(r.afterFiveKm.wPrimePct,50);
  assert.equal(r.finishRank,3);
});
test('R24: mehrere Attacken desselben Fahrers behalten ihre eigene Bilanz',()=>{
  const a=new AttackTelemetry();
  const start=(timeS,positionM)=>a.start({riderId:'A',timeS,positionM,
    groupIds:['A','B'],gapToRaceFrontM:0,wPrimeJ:10000,wPrimeCapacityJ:20000});
  start(10,1000);start(200,3000);
  a.observePower({riderId:'A',startTimeS:200,dt:1,
    requestedPowerW:400,appliedPowerW:350,effectiveCpW:320});
  a.sample({riderId:'A',timeS:500,positionM:6000,groupSize:2,
    gapToRaceFrontM:0,wPrimeJ:9000,wPrimeCapacityJ:20000,positionOf:()=>null});
  const rows=a.report([{id:'A',rank:1,gapS:0}]);
  assert.equal(rows[0].attackSeconds,0);
  assert.equal(rows[1].attackSeconds,1);
  assert.ok(rows[0].afterFiveKm);
  assert.equal(rows[1].afterFiveKm,null);
});
