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
