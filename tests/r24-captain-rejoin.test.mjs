import test from 'node:test';
import assert from 'node:assert/strict';
import {decideIntelligentCrew,R24_REJOIN}
  from '../src/engine/race/race-team-ai.ts';

const rider=(id,teamId,role,positionM,reserveFraction=.8)=>({
  id,teamId,role,positionM,reserveFraction,speedMps:11,
  criticalPowerW:360,aggression:.5});
const main=Array.from({length:30},(_,i)=>rider('M'+i,'B','helfer',1000-i));
const trailing=[rider('A1','A','helfer',858),
  rider('CAP','A','kapitaen',850),rider('A2','A','helfer',848),
  rider('B1','B','helfer',846)];
const teams=[{id:'A',strategy:'kapitaen_schuetzen'},
  {id:'B',strategy:'ausgewogen'}];
const plan=(overrides={})=>decideIntelligentCrew({
  timeS:8000,progress:.84,remainingM:30000,teams,
  riders:[...main,...trailing],chasingTeamIds:new Set(),
  restInPeloton:true,physicalRelayMode:true,adaptiveChase:true,
  sprintFinaleMode:true,...overrides});

test('R24: abgehängte Gruppe kann den eigenen Kapitän autonom nachführen',()=>{
  const before=structuredClone([...main,...trailing]);
  const result=plan({riders:before});
  const lead=result.orders.get('A1');
  assert.equal(lead?.mission,'jagd');
  assert.equal(lead?.duty,'fuehrung');
  assert.equal(lead?.desiredPowerW,360*R24_REJOIN.leaderCpFraction);
  assert.match(lead.reason,/abgehängten Kapitän/);
  assert.deepEqual(before,[...main,...trailing],
    'Aufträge dürfen keine Fahrerposition oder Reserve verändern');
});

test('R24: Anschlussversuch braucht Kapitän, Helfer und erreichbare Lücke',()=>{
  const exhausted=trailing.map(r=>r.id==='CAP'?{...r,reserveFraction:.1}:r);
  assert.notEqual(plan({riders:[...main,...exhausted]}).orders.get('A1')?.mission,'jagd');
  assert.notEqual(plan({teams:[{id:'A',strategy:'offensiv'},teams[1]]})
    .orders.get('A1')?.mission,'jagd');
  assert.notEqual(plan({adaptiveChase:false}).orders.get('A1')?.mission,'jagd');
  assert.notEqual(plan({riders:[...main.map(r=>({...r,
    positionM:r.positionM+2000})),...trailing]}).orders.get('A1')?.mission,'jagd');
  assert.notEqual(plan({riders:[...main,...trailing.filter(r=>r.role!=='helfer')]} )
    .orders.get('A1')?.mission,'jagd');
});
