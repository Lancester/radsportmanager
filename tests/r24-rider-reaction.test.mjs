import test from 'node:test';
import assert from 'node:assert/strict';
import {decideRiderReaction} from '../src/engine/race/rider-reaction.ts';
const o={gapM:20,threat:.9,reserveFraction:.7,aggression:.6,isTeammate:false,
 hasTeamDuty:false,currentIntent:'windschatten',draw:.15};
test('starke Gegner lösen bei gleicher Lage eher eine Reaktion aus',()=>{
 assert.equal(decideRiderReaction(o),true);
 assert.equal(decideRiderReaction({...o,threat:.1}),false);
});
test('Reaktion garantiert keinen Anschluss und respektiert eigene Lage',()=>{
 for(const x of [{...o,isTeammate:true},{...o,hasTeamDuty:true},
  {...o,reserveFraction:.1},{...o,gapM:200},{...o,currentIntent:'erholung'}])
   assert.equal(decideRiderReaction(x),false);
});
