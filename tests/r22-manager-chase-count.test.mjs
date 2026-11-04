import test from 'node:test';
import assert from 'node:assert/strict';
import {coordinatePelotonChase} from '../src/engine/race/peloton-chase.ts';
import {analyzeRaceSituation,decideIntelligentCrew}
  from '../src/engine/race/race-team-ai.ts';
import {createReferenceFixture} from '../src/engine/race/reference-fixtures.ts';
import {validateRace} from '../src/engine/race/race-simulator.ts';

const rider=(id,teamId,role,positionM)=>({
  id,teamId,role,positionM,speedMps:13,
  criticalPowerW:350,reserveFraction:.90,aggression:.5,
});
const main=Array.from({length:25},(_,i)=>
  rider('F'+i,i<6?'T1':'T2',
    i===0?'sprinter':i<6?'helfer':'kapitaen',10000-i*4));
const riders=[rider('ESC','T3','kapitaen',10420),...main];
const prev={active:[],sinceS:0,cooldownUntilS:0};
const other=[{id:'T2',strategy:'ausgewogen'},
  {id:'T3',strategy:'offensiv'}];
function run(count,experimental=true){
  const teams=[{id:'T1',strategy:'sprint',
    ...(count===undefined?{}:{chaseHelperCount:count})},...other];
  const situation=analyzeRaceSituation(riders,30000);
  const chase=coordinatePelotonChase({
    timeS:12500,remainingM:30000,progress:.76,
    teams,riders,situation,previous:prev,
    mainGroupIds:new Set(main.map(x=>x.id)),
    sprintFinaleMode:experimental,
  });
  const plan=decideIntelligentCrew({
    timeS:12500,remainingM:30000,progress:.76,
    teams,riders,chasingTeamIds:chase.chasingTeamIds,
    previousLeaders:new Map(),physicalRelayMode:true,
    restInPeloton:true,sprintFinaleMode:experimental,
  });
  const assigned=[...plan.orders.values()].filter(x=>
    main.find(r=>r.id===x.riderId)?.teamId==='T1'&&
    x.mission==='jagd');
  return {chase,assigned};
}
test('R-22: Manager kann null bis fünf Jäger beauftragen, ohne zusätzliche Fahrer zu erzeugen',()=>{
  assert.equal(run(0).chase.chasingTeamIds.has('T1'),false);
  assert.equal(run(0).assigned.length,0);
  for(const n of [1,2,3,4,5]){
    const result=run(n);
    assert.equal(result.chase.chasingTeamIds.has('T1'),true);
    assert.ok(result.assigned.length>0);
    assert.ok(result.assigned.length<=n);
    assert.ok(result.assigned.every(o=>o.desiredPowerW>0));
  }
  const auto=run(undefined);
  assert.equal(auto.chase.chasingTeamIds.has('T1'),true);
  assert.ok(auto.assigned.length>0);
  assert.ok(auto.assigned.length<=5);
});
test('R-22: vorhandene Legacy-Renn-KI bleibt bei fehlender Opt-in-Taktik unberührt',()=>{
  assert.equal(run(0,false).chase.chasingTeamIds.has('T1'),true);
  assert.ok(run(0,false).assigned.length>0);
});
test('R-22: Manager-Zahl wird in RaceInput als optionales ganzzahliges Teamfeld validiert',()=>{
  const input=createReferenceFixture({routeId:'tdf25_lille',seed:2026}).input;
  for(const n of [0,1,2,3,4,5]){
    const revised={...input,teams:input.teams.map((t,i)=>
      i===0?{...t,chaseHelperCount:n}:t)};
    assert.doesNotThrow(()=>validateRace(revised));
  }
  for(const n of [-1,2.5,6,Infinity,NaN]){
    const revised={...input,teams:input.teams.map((t,i)=>
      i===0?{...t,chaseHelperCount:n}:t)};
    assert.throws(()=>validateRace(revised));
  }
});
