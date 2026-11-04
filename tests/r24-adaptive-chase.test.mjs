import test from 'node:test';
import assert from 'node:assert/strict';
import {analyzeRaceSituation,decideIntelligentCrew}
  from '../src/engine/race/race-team-ai.ts';
import {coordinatePelotonChase} from '../src/engine/race/peloton-chase.ts';

const rider=(id,teamId,role,positionM)=>({id,teamId,role,positionM,
  speedMps:11,criticalPowerW:360,reserveFraction:.8,aggression:.5});
const teams=[{id:'A',strategy:'sprint',chaseHelperCount:0},
  {id:'B',strategy:'kapitaen_schuetzen'},{id:'C',strategy:'offensiv'}];
const main=Array.from({length:60},(_,i)=>rider('M'+i,
  i<5?'A':'B',i===0?'sprinter':i===5?'kapitaen':'helfer',1000-i));
const run=(riders,prior={active:[],sinceS:0,cooldownUntilS:0})=>{
  const situation=analyzeRaceSituation(riders,30000,6,true);
  const chase=coordinatePelotonChase({timeS:10000,remainingM:30000,
    progress:.84,mainGroupIds:new Set(main.map(r=>r.id)),
    teams,riders,situation,previous:prior,adaptiveChase:true,
    sprintFinaleMode:true});
  const plan=decideIntelligentCrew({timeS:10000,progress:.84,
    remainingM:30000,teams,riders,chasingTeamIds:chase.chasingTeamIds,
    restInPeloton:true,physicalRelayMode:true,adaptiveChase:true,
    sprintFinaleMode:true});
  return {situation,chase,plan};
};
test('R24: reale 6- bis 30er-Spitzen bleiben fuer die Verfolgung sichtbar',()=>{
  for(const count of [1,6,7,12,13,20,30]){
    const leading=Array.from({length:count},(_,i)=>
      rider('L'+i,'C','helfer',1500-i));
    const {situation,chase,plan}=run([...leading,...main]);
    assert.equal(situation.leadingBreakaway,true);
    assert.equal(situation.breakawaySize,count);
    assert.ok(situation.gapM>400);
    assert.ok(chase.chasingTeamIds.has('A'));
    assert.ok([...plan.orders.values()].some(x=>x.mission==='jagd'));
  }
});
test('R24: eigener Kapitaen vorne wird nicht blind vom Team verfolgt',()=>{
  const leading=[rider('CAP','A','kapitaen',1500)];
  const {chase}=run([...leading,...main],
    {active:['A','B'],sinceS:9900,cooldownUntilS:0});
  assert.equal(chase.chasingTeamIds.has('A'),false);
  assert.equal(chase.chasingTeamIds.has('B'),true);
});
test('R24: alte manuelle Helferzahl begrenzt die autonome KI nicht',()=>{
  const leading=[rider('ESC','C','kapitaen',1500)];
  const {chase,plan}=run([...leading,...main]);
  assert.ok(chase.chasingTeamIds.has('A'));
  assert.ok([...plan.orders.values()].some(x=>x.mission==='jagd'&&
    main.find(r=>r.id===x.riderId)?.teamId==='A'));
});
