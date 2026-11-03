import test from 'node:test';
import assert from 'node:assert/strict';
import {decideIntelligentCrew,analyzeRaceSituation,R15_R16}
  from '../src/engine/race/race-team-ai.ts';
import {chooseRacePower} from '../src/engine/race/race-tactics.ts';
import {createRaceExample,simulateRace,validateRace}
  from '../src/engine/race/race-simulator.ts';
import {auditRace} from '../src/engine/race/race-audit.ts';

const rider=(id,teamId,role,positionM,overrides={})=>({
  id,teamId,role,positionM,speedMps:13,criticalPowerW:300,
  reserveFraction:0.85,aggression:0.6,...overrides,
});
const teams=[
  {id:'SPR',strategy:'sprint'},
  {id:'SEC',strategy:'kapitaen_schuetzen'},
  {id:'ESC',strategy:'offensiv'},
];
const pack=[
  rider('SPR-S','SPR','sprinter',1000),
  ...Array.from({length:5},(_,i)=>
    rider('SPR-H'+i,'SPR','helfer',1004-i*4)),
  rider('SEC-C','SEC','kapitaen',980),
  ...Array.from({length:4},(_,i)=>
    rider('SEC-H'+i,'SEC','helfer',985-i*4)),
];
const breakaway=[
  rider('ESC-C','ESC','kapitaen',1220,{speedMps:13.5}),
  rider('ESC-H','ESC','helfer',1216,{speedMps:13.3}),
];
const plan=(riders,progress=.6,timeS=900,remainingM=20000)=>
  decideIntelligentCrew({riders,teams,timeS,progress,remainingM});

test('R15: aus fünf Helfern können vier oder fünf gemeinsam jagen',()=>{
  const p=plan([...breakaway,...pack],.55,900,18000);
  assert.equal(p.situation.leadingBreakaway,true);
  assert.equal(p.situation.chaseViable,true);
  const chasing=[...p.orders.values()].filter(o=>o.mission==='jagd');
  assert.ok(chasing.length>=5,JSON.stringify(chasing));
  assert.ok(chasing.filter(o=>o.riderId.startsWith('SPR-H')).length>=3);
  assert.ok(chasing.filter(o=>o.riderId.startsWith('SEC-H')).length>=2);
  assert.ok(chasing.every(o=>o.riderId.includes('-H')));
  assert.ok(chasing.every(o=>o.desiredPowerW<=300*1.12+1e-7));
  assert.ok(chasing.filter(o=>o.duty==='fuehrung').length<=2,
    'Pro Team höchstens ein tatsächlich frontnaher Führungseinsatz');
});
test('R15: bei dringlicher Flucht können alle fünf Helfer eines Teams helfen',()=>{
  const urgent=plan([...breakaway,...pack],.60,900,4000);
  assert.equal(urgent.situation.chaseViable,true);
  const spr=[...urgent.orders.values()].filter(o=>
    o.riderId.startsWith('SPR-H')&&o.mission==='jagd');
  assert.equal(spr.length,5);
  assert.equal(spr.filter(o=>o.duty==='fuehrung').length,1);
  assert.equal(spr.filter(o=>o.duty==='unterstuetzung').length,4);
});
test('R15: Sprintzug mit mehreren Helfern und geschütztem Sprinter',()=>{
  const p=plan(pack,.90,1200,5000);
  const assigned=[...p.orders.values()].filter(o=>o.mission==='sprintzug');
  assert.ok(assigned.length>=3,JSON.stringify(assigned));
  assert.ok(assigned.every(o=>o.riderId.startsWith('SPR-H')));
  assert.ok(assigned.every(o=>o.desiredPowerW>300));
  assert.ok(!p.orders.has('SPR-S'),'Sprinter wird nicht als eigener Helfer eingeplant');
});
test('R15: echte Führungsposition, Rollen und Wprime-Reserve begrenzen den Einsatz',()=>{
  const riders=[
    ...pack.map(r=>r.id==='SPR-H0'?{...r,reserveFraction:0.04}:r),
    rider('SPR-HWEIT','SPR','helfer',650),
  ];
  const p=plan(riders,.9,1200,5000);
  assert.ok(!p.orders.has('SPR-H0'));
  assert.ok(!p.orders.has('SPR-HWEIT'));
  assert.ok([...p.orders.values()].filter(o=>o.duty==='fuehrung')
    .every(o=>o.groupFrontM-riders.find(r=>r.id===o.riderId).positionM<=
      R15_R16.frontWorkRadiusM));
});
test('R16: keine Verfolgung auf abgehängten Solofahrer oder eigene Ausreißer',()=>{
  const dropped=rider('ESC-X','ESC','helfer',500);
  const p=plan([...pack,dropped],.6,900,18000);
  assert.equal(p.situation.leadingBreakaway,false);
  assert.ok(![...p.orders.values()].some(o=>o.mission==='jagd'));
  const q=plan([...breakaway,...pack],.55,900,18000);
  assert.notEqual(q.missionByTeam.get('ESC'),'jagd');
});
test('R16: unsinnige Jagd unterbleibt bei extremer Lücke und kleiner Restdistanz',()=>{
  const distant=[
    ...breakaway.map(r=>({...r,positionM:r.positionM+4000,
      speedMps:18})),...pack,
  ];
  const p=plan(distant,.90,800,5000);
  assert.equal(p.situation.chaseViable,false);
  assert.ok(![...p.orders.values()].some(o=>o.mission==='jagd'));
  const q=plan([...breakaway,...pack],.95,800,800);
  assert.equal(q.situation.chaseViable,false);
});
test('R16: ausgewogenes Team kann Sprintmannschaft zunächst jagen lassen',()=>{
  const extraTeam={id:'BAL',strategy:'ausgewogen'};
  const bal=[
    rider('BAL-C','BAL','kapitaen',988),
    rider('BAL-H0','BAL','helfer',990),
    rider('BAL-H1','BAL','helfer',986),
  ];
  const data={timeS:900,progress:.55,remainingM:18000,
    teams:[...teams,extraTeam],riders:[...breakaway,...pack,...bal]};
  const moderate=decideIntelligentCrew(data);
  assert.equal(moderate.situation.chaseViable,true);
  assert.equal(moderate.missionByTeam.get('SPR'),'jagd');
  assert.notEqual(moderate.missionByTeam.get('BAL'),'jagd');
  const urgent=decideIntelligentCrew({...data,remainingM:4000});
  assert.equal(urgent.situation.chaseViable,true);
  assert.equal(urgent.missionByTeam.get('BAL'),'jagd');
});
test('R15/R16: Entscheidung unabhängig von Team- und Fahrerreihenfolge',()=>{
  const riders=[...breakaway,...pack];
  const a=plan(riders,.55,900,18000);
  const b=decideIntelligentCrew({riders:[...riders].reverse(),
    teams:[...teams].reverse(),timeS:900,progress:.55,remainingM:18000});
  assert.deepEqual([...a.orders].sort(),[...b.orders].sort());
  assert.deepEqual(a.situation,b.situation);
});
test('R16: situativer Angriff statt altem Kilometerfenster',()=>{
  const o={role:'kapitaen',strategy:'offensiv',criticalPowerW:300,
    aggression:.6,sprintSkill:.5,progress:.40,remainingM:28000,
    frontGapM:2,teamCaptainGapM:null,deficitToLeaderM:1,
    reserveFraction:.8,coordinatedTeamPace:true,attackOpportunity:true};
  assert.equal(chooseRacePower(o).intent,'angriff');
  assert.notEqual(chooseRacePower({...o,attackOpportunity:false}).intent,'angriff');
});
test('R15/R16: ungültige Daten und unbekannte Taktikversion zurückweisen',()=>{
  assert.throws(()=>plan([{...pack[0],speedMps:NaN}]),RangeError);
  assert.throws(()=>plan([...pack,pack[0]]),RangeError);
  const x=createRaceExample();x.tacticModel='unbekannt';
  assert.throws(()=>validateRace(x),RangeError);
});
test('R15/R16: voller Rennmodus bleibt deterministisch und physikalisch bilanziert',()=>{
  for(const [seed,profile,homeStrategy] of [
    [2026,'wellig','kapitaen_schuetzen'],
    [2027,'flach','sprint'],
  ]){
    const input=createRaceExample({seed,profile,homeStrategy});
    const result=simulateRace(input);
    const audit=auditRace(result);
    assert.equal(result.finisherCount,30);
    assert.equal(audit.finishers,30);
    assert.ok(result.diagnostics.maxSimultaneousTeamHelpers>=2);
    assert.ok(result.diagnostics.multiHelperAssignments>0);
    assert.ok(result.diagnostics.actualFrontWorkSteps>=0);
    assert.ok(result.classification.every(r=>r.finalWPrimeJ>=0&&
      Math.abs(r.energyResidualJ)<.05));
    assert.deepEqual(result.classification,
      simulateRace(input).classification);
    const old=createRaceExample({seed,profile,homeStrategy});
    old.tacticModel='r14';
    const legacy=simulateRace(old);
    assert.equal(legacy.finisherCount,30);
    assert.equal(legacy.diagnostics.multiHelperAssignments,0);
    console.log('R15-R16-VOLLRENNEN',JSON.stringify({
      seed,profile,homeStrategy,winner:audit.winnerId,
      maxHelpers:result.diagnostics.maxSimultaneousTeamHelpers,
      assignments:result.diagnostics.multiHelperAssignments,
      sprintTrainAssignments:result.diagnostics.sprintTrainAssignments,
      actualFrontWorkSteps:result.diagnostics.actualFrontWorkSteps,
      chaseStarts:result.diagnostics.teamChaseStarts,
      lastGapS:+audit.finishSpreadS.toFixed(1),
    }));
  }
});
