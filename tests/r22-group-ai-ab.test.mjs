import test from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {readFileSync} from 'node:fs';
import {decideGroupRiding}
  from '../src/engine/race/group-riding.ts';
import {createRaceExample,simulateRace}
  from '../src/engine/race/race-simulator.ts';

const observation={
  groupSize:30,distanceFromGroupFrontM:20,
  frontGapM:8,frontSpeedMps:12,ownSpeedMps:12,
  referenceSpeedMps:12,referenceAccelerationMps2:0.10,
  groupPacerPowerW:300,isPacer:false,
  desiredPowerW:350,criticalPowerW:350,reserveFraction:.9,
  tacticalIntent:'windschatten',riderMassKg:70,bikeMassKg:8,
  dragAreaM2:.28,aeroFactor:.6,gradeFraction:0,
  rollingCoefficient:.004,airDensityKgM3:1.2,
  drivetrainEfficiency:.975,headwindMps:0,crosswindMps:0,
};
test('R22 Gruppen-KI: angepasste Wattanfrage statt eigener Maximalleistung',()=>{
  const follow=decideGroupRiding(observation);
  assert.equal(follow.reason,'follow_group');
  assert.ok(follow.powerW<350&&follow.powerW>0);
  const faster=decideGroupRiding({...observation,referenceSpeedMps:13});
  assert.ok(faster.powerW>follow.powerW);
  const gap=decideGroupRiding({...observation,frontGapM:30});
  assert.ok(gap.powerW>follow.powerW);
  const front=decideGroupRiding({...observation,
    distanceFromGroupFrontM:0,frontGapM:0,isPacer:true});
  assert.equal(front.reason,'front_rotation');
  assert.equal(front.powerW,300);
  const attack=decideGroupRiding({...observation,tacticalIntent:'angriff'});
  assert.deepEqual(attack,{powerW:350,reason:'active_mission'});
  const solo=decideGroupRiding({...observation,groupSize:3});
  assert.deepEqual(solo,{powerW:350,reason:'no_group'});
});
test('R22: Legacy bleibt exakt reproduzierbar bei deaktiviertem Gruppenmodell',()=>{
  const input=createRaceExample({profile:'flach',seed:2026});
  const a=simulateRace(input);
  const b=simulateRace({...input,groupRidingModel:'legacy'});
  assert.deepEqual(a,b);
  const c=simulateRace({...input,groupRidingModel:'cohesive'});
  assert.equal(c.finisherCount,30);
  assert.ok(c.classification.every(r=>r.energyResidualJ<.05&&
    r.energyResidualJ>-.05&&r.finalWPrimeJ>=0));
});
test('R22: echter Gruppen-A/B mit 2 × 154 Fahrern und Ergebnismessung',()=>{
  const dir='artifacts/r22-group-ai-regression';
  const log=execFileSync(process.execPath,[
    '--experimental-strip-types','scripts/r22-group-ai-ab.mjs',
    '--route','tdf25_lille','--seed','2026',
    '--output',dir,
  ],{encoding:'utf8',timeout:240000,maxBuffer:10e6});
  const races=log.split('\n').filter(x=>x.startsWith('R22-GROUP-AI '));
  assert.equal(races.length,2);
  const report=JSON.parse(readFileSync(dir+'/report.json','utf8'));
  assert.equal(report.variants.length,2);
  assert.deepEqual(report.variants.map(r=>r.model),['legacy','cohesive']);
  assert.ok(report.variants.every(r=>r.participants===154));
  assert.ok(Math.abs(report.variants[0].winnerTimeS-12619.2)<.3);
  const checkpoints=readFileSync(dir+'/checkpoints.csv','utf8').trim().split('\n');
  assert.ok(checkpoints.length>=60);
  assert.equal(readFileSync(dir+'/finishers.csv','utf8').trim().split('\n').length,309);
  console.log(log.split('\n').filter(x=>x.startsWith('R22-GROUP-AI-')).join('\n'));
});
