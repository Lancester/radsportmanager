import test from 'node:test';
import assert from 'node:assert/strict';
import {cooperativeRelayYield,observedRelayFrontChange} from '../src/engine/race/bridge-relay.ts';
const base={sharedTarget:true,isRealFront:true,partnerGapM:5,frontSeconds:160,
 reserveFraction:.5,cpW:350,requestedW:380};
test('nach echter Führungsarbeit kann naher Partner übernehmen',()=>{
 const watts=cooperativeRelayYield(base);assert.ok(watts<base.requestedW);
});
test('Positionswechsel wird nur bei gemeinsamer Lage tatsächlich erfasst',()=>{
 const o={sameGroup:true,sameTarget:true,formerFrontPositionM:100,
  partnerPositionM:101};
 assert.equal(observedRelayFrontChange(o),true);
 assert.equal(observedRelayFrontChange({...o,partnerPositionM:99}),false);
 assert.equal(observedRelayFrontChange({...o,sameGroup:false}),false);
 assert.equal(observedRelayFrontChange({...o,sameTarget:false}),false);
});
test('kein Wechsel ohne echte gemeinsame Lage oder ohne geleistete Arbeit',()=>{
 for(const x of [{...base,sharedTarget:false},{...base,isRealFront:false},
  {...base,partnerGapM:50},{...base,frontSeconds:20}])
  assert.equal(cooperativeRelayYield(x),null);
});
