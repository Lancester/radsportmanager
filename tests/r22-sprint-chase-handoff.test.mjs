import test from 'node:test';
import assert from 'node:assert/strict';
import {coordinatePelotonChase} from '../src/engine/race/peloton-chase.ts';
import {analyzeRaceSituation,decideIntelligentCrew}
  from '../src/engine/race/race-team-ai.ts';

const rider=(id,teamId,role,positionM,reserveFraction=.85)=>({
  id,teamId,role,positionM,speedMps:13,
  criticalPowerW:350,reserveFraction,aggression:.5,
});
const sprintTeam={id:'T1',strategy:'sprint'};
const none={active:[],sinceS:0,cooldownUntilS:0};

test('R22: sprint teams do not abandon an attainable real escape at 95% race progress',()=>{
  const behind=Array.from({length:25},(_,i)=>
    rider('F'+i,i<6?'T1':'T2',
      i===1?'sprinter':i<6?'helfer':'kapitaen',10000-i*4));
  const ahead=[rider('A1','T3','kapitaen',10200),
    rider('A2','T3','helfer',10197)];
  const riders=[...ahead,...behind];
  const situation=analyzeRaceSituation(riders,8500);
  assert.equal(situation.leadingBreakaway,true);
  const args={timeS:12340,remainingM:8500,progress:.953,
    mainGroupIds:new Set(behind.map(x=>x.id)),
    teams:[sprintTeam,{id:'T2',strategy:'ausgewogen'},
      {id:'T3',strategy:'offensiv'}],riders,situation,
    previous:none};
  const old=coordinatePelotonChase(args);
  const next=coordinatePelotonChase({...args,sprintFinaleMode:true});
  assert.equal(old.chasingTeamIds.size,0,
    'legacy/coordinated chase cutoff remains unchanged');
  assert.ok(next.chasingTeamIds.has('T1'),
    'opt-in sprint group may still chase near the finish');
  assert.ok(next.state.active.includes('T1'));
});

test('R22: sprint train uses ACTUAL helper proximity to its sprinter, not pack front',()=>{
  const riders=Array.from({length:35},(_,i)=>rider('P'+i,'T2',
    'helfer',10000-i*12));
  const sprinter=rider('TARGET','T1','sprinter',10000-30*12);
  riders[30]=sprinter;
  riders[28]=rider('HELP1','T1','helfer',10000-28*12);
  riders[29]=rider('HELP2','T1','helfer',10000-29*12);
  riders[32]=rider('HELP3','T1','helfer',10000-32*12);
  const args={timeS:15600,progress:.955,remainingM:4800,
    teams:[sprintTeam,{id:'T2',strategy:'ausgewogen'}],
    riders,previousLeaders:new Map(),
    chasingTeamIds:new Set(),restInPeloton:true,
    physicalRelayMode:true};
  const old=decideIntelligentCrew(args);
  const plan=decideIntelligentCrew({...args,sprintFinaleMode:true});
  const sprintHelpers=[...plan.orders.values()].filter(x=>
    x.mission==='sprintzug'&&x.riderId.startsWith('HELP'));
  assert.equal(old.orders.size,0,
    'old group-front filter incorrectly ignores nearby leadout');
  assert.equal(sprintHelpers.length,3,
    'three real nearby helpers can form a local sprint train');
  assert.ok(sprintHelpers.some(x=>x.duty==='fuehrung'),
    'helper truly ahead of target can lead the local sprint train');
  assert.ok(sprintHelpers.every(x=>x.desiredPowerW>0));
});

test('R22: coordinated chase reserves one nearby sprinter protector',()=>{
  const riders=Array.from({length:24},(_,i)=>
    rider('F'+i,i<6?'T1':'T2',
      i===1?'sprinter':i<6?'helfer':'kapitaen',10000-i*4));
  const target=riders[1];
  assert.equal(target.role,'sprinter');
  const all=[...riders,rider('A1','T3','kapitaen',10200)];
  const plan=decideIntelligentCrew({
    timeS:16000,progress:.953,remainingM:8500,
    teams:[sprintTeam,{id:'T2',strategy:'ausgewogen'},
      {id:'T3',strategy:'offensiv'}],
    riders:all,previousLeaders:new Map(),
    chasingTeamIds:new Set(['T1']),restInPeloton:true,
    physicalRelayMode:true,sprintFinaleMode:true,
  });
  const orders=[...plan.orders.values()].filter(x=>x.riderId.startsWith('F')&&
    x.riderId!=='F0'&&+x.riderId.slice(1)<6);
  const chase=orders.filter(x=>x.mission==='jagd');
  const train=orders.filter(x=>x.mission==='sprintzug');
  assert.ok(chase.length>=1,
    'physically front-eligible helpers continue to chase');
  assert.ok(train.length>=1,
    'real nearby helpers may prepare the sprinter at the same time');
  assert.ok(chase.length+train.length<=5,
    'no extra imaginary team members or energy');
  assert.ok(train.every(x=>
    Math.abs(all.find(y=>y.id===x.riderId).positionM-target.positionM)<=85));
});

test('R22: no sprint chasing for no escape, exhausted helpers or impossible gap',()=>{
  const behind=Array.from({length:18},(_,i)=>rider('F'+i,
    i<5?'T1':'T2',i===0?'sprinter':i<5?'helfer':'kapitaen',
    10000-i*3,.10));
  const ahead=[rider('A1','T3','kapitaen',10500)];
  const situation=analyzeRaceSituation([...ahead,...behind],1200);
  const res=coordinatePelotonChase({
    timeS:15000,remainingM:1200,progress:.994,
    mainGroupIds:new Set(behind.map(x=>x.id)),
    teams:[sprintTeam,{id:'T2',strategy:'ausgewogen'},
      {id:'T3',strategy:'offensiv'}],
    riders:[...ahead,...behind],situation,previous:none,
    sprintFinaleMode:true,
  });
  assert.equal(res.chasingTeamIds.size,0,
    'cannot assign extra chase power from exhausted helpers');
});

test('R22: physically spent helper is released; eligible fresh colleagues inherit chasing and leadout',()=>{
  const riders=Array.from({length:24},(_,i)=>
    rider('F'+i,i<6?'T1':'T2',
      i===1?'sprinter':i<6?'helfer':'kapitaen',10000-i*4));
  // F2 has completed a physically hard real front stint. He may
  // now let the peloton pass; do not immediately hand him another job.
  riders[2]={...riders[2],chaseSpent:true};
  const all=[rider('A1','T3','kapitaen',10200),...riders];
  const args={
    timeS:16000,progress:.77,remainingM:34000,
    teams:[sprintTeam,{id:'T2',strategy:'ausgewogen'},
      {id:'T3',strategy:'offensiv'}],
    riders:all,previousLeaders:new Map(),
    chasingTeamIds:new Set(['T1']),restInPeloton:true,
    physicalRelayMode:true,sprintFinaleMode:true,
  };
  const plan=decideIntelligentCrew(args);
  assert.equal(plan.orders.has('F2'),false,
    'spent leader is no longer a team-chase or sprint-train candidate');
  assert.ok([...plan.orders.values()].some(x=>x.mission==='jagd'&&
    x.riderId.startsWith('F')),
    'other physically present helpers should pick up the work');
});

test('R22: Manager kann null, zwei oder vier Jagdhelfer je Sprintteam vorgeben',()=>{
  const main=Array.from({length:26},(_,i)=>
    rider('F'+i,i<6?'T1':'T2',
      i===1?'sprinter':i<6?'helfer':'kapitaen',
      10000-i*4));
  const riders=[rider('A1','T3','kapitaen',10350),...main];
  const situation=analyzeRaceSituation(riders,35000);
  assert.ok(situation.leadingBreakaway);
  const basic={timeS:13000,remainingM:35000,progress:.81,
    mainGroupIds:new Set(main.map(r=>r.id)),
    riders,situation,previous:none,sprintFinaleMode:true};
  const team=n=>({id:'T1',strategy:'sprint',chaseHelperCount:n});
  const other=[{id:'T2',strategy:'ausgewogen'},
    {id:'T3',strategy:'offensiv'}];
  const noneChase=coordinatePelotonChase({...basic,
    teams:[team(0),...other]});
  assert.ok(!noneChase.chasingTeamIds.has('T1'));
  for(const configured of [1,2,4]){
    const teams=[team(configured),...other];
    const selection=coordinatePelotonChase({...basic,teams});
    assert.ok(selection.chasingTeamIds.has('T1'));
    const plan=decideIntelligentCrew({
      timeS:13000,remainingM:35000,progress:.81,
      teams,riders,previousLeaders:new Map(),
      chasingTeamIds:selection.chasingTeamIds,
      physicalRelayMode:true,sprintFinaleMode:true,
      restInPeloton:true,
    });
    const assigned=[...plan.orders.values()].filter(o=>
      o.mission==='jagd'&&riders.find(r=>r.id===o.riderId)?.teamId==='T1');
    assert.ok(assigned.length<=configured,
      'Managerwert setzt ein echtes Helferlimit ohne Zusatzfahrer');
  }
});
test('R22: physischer Langjagdführer behält seinen Auftrag nach kurzen Positionswechseln',()=>{
  const group=Array.from({length:31},(_,i)=>rider('OTHER'+i,'T2',
    'helfer',12000-i*3));
  group.push(rider('TARGET','T1','sprinter',11960));
  group.push(rider('LEAD','T1','helfer',12005));
  group.push(rider('H1','T1','helfer',11976));
  group.push(rider('H2','T1','helfer',11970));
  group.push(rider('H3','T1','helfer',11965));
  const teams=[{id:'T1',strategy:'sprint'},
    {id:'T2',strategy:'ausgewogen'},
    {id:'T3',strategy:'offensiv'}];
  const field=[rider('BREAK','T3','kapitaen',12450),...group];
  const first=decideIntelligentCrew({
    timeS:10000,progress:.75,remainingM:45000,teams,riders:field,
    previousLeaders:new Map(),chasingTeamIds:new Set(['T1']),
    restInPeloton:true,physicalRelayMode:true,sprintFinaleMode:true,
  });
  const initial=first.leaderByTeam.get('T1');
  assert.ok(initial,'real helper first assigned to front');
  const second=decideIntelligentCrew({
    timeS:10400,progress:.79,remainingM:37000,teams,riders:field.map(r=>
      r.id===initial.riderId?{...r,positionM:r.positionM-24}:r),
    previousLeaders:first.leaderByTeam,
    chasingTeamIds:new Set(['T1']),restInPeloton:true,
    physicalRelayMode:true,sprintFinaleMode:true,
  });
  assert.equal(second.leaderByTeam.get('T1')?.riderId,initial.riderId,
    '400 seconds in, physical 24m setback does not force arbitrary rotation');
});
