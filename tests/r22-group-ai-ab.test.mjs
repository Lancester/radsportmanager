import test from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {readFileSync} from 'node:fs';
import {finishGroupMetrics} from '../src/engine/race/finish-groups.ts';
import {coordinatePelotonChase} from '../src/engine/race/peloton-chase.ts';
import {decideChaseApproach} from '../src/engine/race/group-riding.ts';
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
test('R22 Zielgruppe: zusammenhängende Zeiten statt Renn-Positionsgruppen',()=>{
  const x=finishGroupMetrics([{id:'a',finishTimeS:100},
    {id:'b',finishTimeS:100.5},{id:'c',finishTimeS:101.4},
    {id:'d',finishTimeS:112},{id:'e',finishTimeS:112.2}]);
  assert.equal(x.winnerGroupSize,3);
  assert.equal(x.largestGroupSize,3);
  assert.equal(x.within60sOfWinner,5);
  assert.equal(x.groups.length,2);
  const isolatedWinner=finishGroupMetrics([
    {id:'winner',finishTimeS:100},
    {id:'peloton1',finishTimeS:200},
    {id:'peloton2',finishTimeS:200.4},
    {id:'peloton3',finishTimeS:200.8},
  ]);
  assert.equal(isolatedWinner.winnerGroupSize,1);
  assert.equal(isolatedWinner.largestGroupSize,3);
  assert.equal(isolatedWinner.largestGroupGapToWinnerS,100);
  assert.equal(isolatedWinner.within60sOfWinner,1);
});

test('R22: Jagdhelfer rückt mit kontrollierter Mehrleistung statt blindem 110%-CP-Solo auf',()=>{
  const before=decideGroupRiding(observation);
  const after=decideChaseApproach(observation);
  assert.ok(after.powerW>before.powerW);
  assert.ok(after.powerW-before.powerW<=42.0001);
  assert.ok(after.powerW<=observation.criticalPowerW*1.025);
  assert.equal(after.reason,'follow_group');
});

test('R22 Mannschaftsjagd: nur Interessenten, keine Phantombewegung, 150s Mandat',()=>{
  const teams=[{id:'T01',strategy:'sprint'},
    {id:'T02',strategy:'offensiv'},
    {id:'T03',strategy:'ausgewogen'}];
  const riders=[
    {id:'s',teamId:'T01',role:'sprinter',positionM:200,
      reserveFraction:.9,speedMps:12,criticalPowerW:350,aggression:.5},
    {id:'h',teamId:'T01',role:'helfer',positionM:195,
      reserveFraction:.9,speedMps:12,criticalPowerW:350,aggression:.5},
  ];
  // Die Jagd braucht ein echtes Hauptfeld, nicht nur zwei Testfahrer.
  for(let i=0;i<12;i++)riders.push({
    id:'extra'+i,teamId:'T02',role:'helfer',positionM:190-i,
    reserveFraction:.8,speedMps:12,criticalPowerW:345,aggression:.5,
  });
  const situation={leadingBreakaway:true,gapM:350,breakawaySize:3,
    mainGroupSize:40,relativeSpeedMps:.2,projectedGapM:374,
    gapFractionOfRemaining:.004,chaseViable:true};
  const initial={active:[],sinceS:0,cooldownUntilS:0};
  const params={timeS:300,remainingM:90000,progress:.3,
    mainGroupIds:new Set(riders.map(r=>r.id)),teams,riders,situation,previous:initial};
  const first=coordinatePelotonChase(params);
  assert.deepEqual([...first.chasingTeamIds],['T01']);
  const continued=coordinatePelotonChase({...params,timeS:320,
    previous:first.state});
  assert.deepEqual([...continued.chasingTeamIds],['T01']);
  const ended=coordinatePelotonChase({...params,timeS:500,
    situation:{...situation,leadingBreakaway:false},
    previous:continued.state});
  assert.equal(ended.chasingTeamIds.size,0);
  assert.ok(ended.state.cooldownUntilS>500);
});

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
  const d=simulateRace({...input,groupRidingModel:'coordinated'});
  assert.equal(d.finisherCount,30);
  const e=simulateRace({...input,groupRidingModel:'relays'});
  assert.equal(e.finisherCount,30);
  const paced=simulateRace({...input,groupRidingModel:'relay-paced'});
  assert.equal(paced.finisherCount,30);
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
  assert.equal(races.length,5);
  const report=JSON.parse(readFileSync(dir+'/report.json','utf8'));
  assert.equal(report.variants.length,5);
  assert.deepEqual(report.variants.map(r=>r.model),
    ['legacy','cohesive','coordinated','relays','relay-paced']);
  assert.ok(report.variants[3].orderedRelayTeamSeconds>=
    report.variants[3].mainFieldFrontWorkWithAssignedChaserS);
  assert.ok(report.variants[3].largestFinishGroup>=1);
  assert.ok(report.variants[4].orderedRelayTeamSeconds>=
    report.variants[4].mainFieldFrontWorkWithAssignedChaserS);
  assert.ok(report.variants.every(r=>r.winnerFinishGroup>=1&&
    r.largestFinishGroup>=r.winnerFinishGroup&&
    r.within60sOfWinner>=r.winnerFinishGroup));
  assert.ok(report.variants.every(r=>r.participants===154));
  assert.ok(Math.abs(report.variants[0].winnerTimeS-12619.2)<.3);
  const checkpoints=readFileSync(dir+'/checkpoints.csv','utf8').trim().split('\n');
  assert.ok(checkpoints.length>=60);
  assert.equal(readFileSync(dir+'/finishers.csv','utf8').trim().split('\n').length,771);
  console.log(log.split('\n').filter(x=>x.startsWith('R22-GROUP-AI-')).join('\n'));
});
