import test from 'node:test';
import assert from 'node:assert/strict';
import {classifyBreakawayFront} from '../src/engine/race/breakaway-front-context.ts';
const r=(id,positionM)=>({id,positionM});
test('Nahe gemeinsam erfasste Fahrer erlauben einen untersuchbaren Führungsversuch',()=>{
 const x=classifyBreakawayFront({group:[r('A',100),r('B',95)],trackedIds:new Set(['A','B'])});
 assert.deepEqual(x,{status:'eligible',partnerId:'B'});
});
test('Fast gleiche Längsposition ist ohne Spurmodell unklar',()=>{
 const x=classifyBreakawayFront({group:[r('A',100),r('B',99.8),r('C',95)],
  trackedIds:new Set(['A','B','C'])});
 assert.deepEqual(x,{status:'ambiguous',partnerId:null});
});
test('Kein Partner, wenn kein erfasster Fahrer nahe genug ist',()=>{
 const x=classifyBreakawayFront({group:[r('A',100),r('B',80)],trackedIds:new Set(['A','B'])});
 assert.deepEqual(x,{status:'no-partner',partnerId:null});
 assert.equal(classifyBreakawayFront({group:[r('A',100),r('B',98)],trackedIds:new Set(['A'])}).status,'no-partner');
});
