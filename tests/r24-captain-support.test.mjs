import test from 'node:test';
import assert from 'node:assert/strict';
import {decideIntelligentCrew} from '../src/engine/race/race-team-ai.ts';
import {captainEscortPower} from '../src/engine/race/captain-support.ts';

const rider=(id,teamId,role,positionM,reserveFraction=.8)=>({
  id,teamId,role,positionM,reserveFraction,speedMps:11,
  criticalPowerW:360,aggression:.5});
test('R24: gefaehrdeter Kapitaen erhaelt einen nahen autonomen Begleiter',()=>{
  const pack=Array.from({length:60},(_,i)=>rider('B'+i,'B','helfer',1000-i*2));
  const captain=rider('CAP','A','kapitaen',887,.8);
  const helper=rider('HELP','A','helfer',884,.9);
  const p=decideIntelligentCrew({timeS:4000,progress:.5,remainingM:50000,
    teams:[{id:'A',strategy:'kapitaen_schuetzen'},
      {id:'B',strategy:'ausgewogen'}],riders:[...pack,captain,helper],
    chasingTeamIds:new Set(),restInPeloton:true,physicalRelayMode:true,
    adaptiveChase:true});
  assert.equal(p.missionByTeam.get('A'),'schutz');
  assert.equal(p.orders.get('HELP')?.mission,'schutz');
  assert.equal([...p.orders.values()].filter(o=>o.mission==='schutz').length,1);
});
test('R24: Begleiter rueckt mit begrenzten eigenen Watt auf',()=>{
  const o={sameGroup:true,mission:'schutz',helperPositionM:950,
    captainPositionM:980,followPowerW:200,criticalPowerW:360,
    reserveFraction:.8};
  const power=captainEscortPower(o);
  assert.ok(power>200&&power<=218);
  assert.equal(captainEscortPower({...o,sameGroup:false}),null);
  assert.equal(captainEscortPower({...o,helperPositionM:981}),null);
});
