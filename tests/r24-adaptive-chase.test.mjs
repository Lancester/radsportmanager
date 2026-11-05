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
test('R24: weiteres interessiertes Team kann sich laufender Jagd anschließen',()=>{
  const leading=[rider('CAP','C','kapitaen',1500)];
  const {chase}=run([...leading,...main],
    {active:['A'],sinceS:9900,cooldownUntilS:0});
  assert.equal(chase.chasingTeamIds.has('A'),true);
  assert.equal(chase.chasingTeamIds.has('B'),true);
  assert.equal(chase.state.sinceS,9900);
});
test('R24: alte manuelle Helferzahl begrenzt die autonome KI nicht',()=>{
  const leading=[rider('ESC','C','kapitaen',1500)];
  const {chase,plan}=run([...leading,...main]);
  assert.ok(chase.chasingTeamIds.has('A'));
  assert.ok([...plan.orders.values()].some(x=>x.mission==='jagd'&&
    main.find(r=>r.id===x.riderId)?.teamId==='A'));
});

test('Offensives Team ohne Fahrer vorne kann erreichbare Flucht zurückholen',()=>{
  const c=[rider('C-CAP','C','kapitaen',990),rider('C-H','C','helfer',980)];
  const leading=[rider('E','A','helfer',1150)];
  const riders=[...leading,...main,...c];
  const situation=analyzeRaceSituation(riders,80000,6,true);
  const base={timeS:1800,remainingM:80000,progress:.15,
    mainGroupIds:new Set([...main,...c].map(r=>r.id)),teams,riders,situation,
    previous:{active:[],sinceS:0,cooldownUntilS:0},adaptiveChase:true};
  assert.ok(coordinatePelotonChase(base).chasingTeamIds.has('C'));
  const withOwn=[rider('E2','C','helfer',1151),...riders];
  const situation2=analyzeRaceSituation(withOwn,80000,6,true);
  assert.equal(coordinatePelotonChase({...base,riders:withOwn,situation:situation2})
    .chasingTeamIds.has('C'),false);
});

test('Bei gleicher Rennlage beeinflusst einschätzbare Gefahr die frühe Sprintteam-Jagd',()=>{
  const mk=(id,teamId,role,pos,cp)=>({...rider(id,teamId,role,pos),
    knownAbility:{id,knownCpW:cp,massKg:75,bikeMassKg:7.5,dragAreaM2:.28,sprintSkill:.5}});
  const pack=Array.from({length:25},(_,i)=>mk('X'+i,'A',i===0?'sprinter':'helfer',1000-i,300+i));
  const compare=(leaderCp)=>{
    const lead=mk('L','B','kapitaen',1500,leaderCp), riders=[lead,...pack];
    const situation=analyzeRaceSituation(riders,100000,6,true);
    return coordinatePelotonChase({timeS:2000,remainingM:100000,progress:.2,
      mainGroupIds:new Set(pack.map(r=>r.id)),teams:[{id:'A',strategy:'sprint'},
        {id:'B',strategy:'offensiv'}],riders,situation,
      previous:{active:[],sinceS:0,cooldownUntilS:0},adaptiveChase:true,
      threatProfile:'flach'}).chasingTeamIds.has('A');
  };
  assert.equal(compare(250),false);
  assert.equal(compare(430),true);
});
