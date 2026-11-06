import test from 'node:test';
import assert from 'node:assert/strict';
import {decideJoinBridge} from '../src/engine/race/bridge-cooperation.ts';
const o={sameActualGroup:true,targetAhead:true,teamHasOtherDuty:false,
 teamHasRiderAhead:false,role:'kapitaen',strategy:'offensiv',reserveFraction:.7,
 aggression:.7,currentIntent:'windschatten',draw:.01};
test('Fahrer mit gemeinsamen Interesse kann echten Anschluss unterstützen',()=>{
 assert.equal(decideJoinBridge(o),true);
});
test('kein gemeinsamer Auftrag ohne Gruppe, Ziel, Reserve oder bei Teamauftrag',()=>{
 for(const x of [{...o,sameActualGroup:false},{...o,targetAhead:false},
  {...o,teamHasOtherDuty:true},{...o,teamHasRiderAhead:true},
  {...o,reserveFraction:.1},{...o,role:'sprinter'},{...o,strategy:'sprint'}])
  assert.equal(decideJoinBridge(x),false);
});
test('Helfer eines Sprintteams kann ohne Sprinter in der Gruppe mit nachführen',()=>{
 const helper={...o,role:'helfer',strategy:'sprint',sprinterInSameGroup:false,draw:0};
 assert.equal(decideJoinBridge(helper),true);
 assert.equal(decideJoinBridge({...helper,sprinterInSameGroup:true}),false);
 assert.equal(decideJoinBridge({...helper,teamHasOtherDuty:true}),false);
 assert.equal(decideJoinBridge({...helper,draw:.99}),false);
});
