import test from 'node:test';import assert from 'node:assert/strict';
import {scoreFinishGroups} from '../src/engine/race/finish-time-groups.ts';
const riders=(times)=>times.map((finishTimeS,i)=>({
  id:'F'+String(i+1).padStart(3,'0'),rank:i+1,finishTimeS}));
test('R24: 1-s-Regel: Kettenlücke unter 1s vergibt identische Gruppenzeit',()=>{
 const scored=scoreFinishGroups(riders([100.7,101.3,102,102.9,104.1]),'road-1s');
 assert.deepEqual(scored.map(z=>z.finishGroup),[0,0,0,0,1]);
 assert.deepEqual(scored.map(z=>z.creditedGapS),[0,0,0,0,4]);
 assert.equal(scored[3].rawGapS,2.200000000000003);
 assert.equal(scored[0].finishGroupSize,4);
 assert.equal(scored[4].finishGroupSize,1);
});
test('R24: ausdrücklich benannte Sprintetappe erst bei 3s in neue Gruppe',()=>{
 const scored=scoreFinishGroups(riders([100.1,102.7,105.6,108.6,111.7]),'bunch-3s');
 assert.deepEqual(scored.map(z=>z.finishGroup),[0,0,0,1,2]);
 assert.deepEqual(scored.map(z=>z.creditedGapS),[0,0,0,8,11]);
 assert.equal(scored[1].rawGapS,2.6000000000000085);
});
test('R24: Zeiten sind auf volle Sekunden abgerundet, nicht gerundet',()=>{
 const scored=scoreFinishGroups(riders([3600.99,3601.01,3602.05]),'road-1s');
 assert.deepEqual(scored.map(z=>z.creditedTimeS),[3600,3600,3602]);
 assert.deepEqual(scored.map(z=>z.creditedGapS),[0,0,2]);
});
test('R24: Ranking und Rohzeit unverändert, keine Änderungen am Simulator',()=>{
 const x=riders([1,1.8,2.7,3.6,5]);const before=structuredClone(x);
 const result=scoreFinishGroups(x,'road-1s');
 assert.deepEqual(x,before);
 assert.deepEqual(result.map(z=>z.rank),[1,2,3,4,5]);
 assert.deepEqual(result.map(z=>z.finishTimeS),before.map(z=>z.finishTimeS));
});
test('R24: ungültige/doppelte Daten abweisen und leer definieren',()=>{
 assert.deepEqual(scoreFinishGroups([],'road-1s'),[]);
 assert.throws(()=>scoreFinishGroups(riders([10,11]),'banana'));
 assert.throws(()=>scoreFinishGroups([{id:'A',rank:1,finishTimeS:10},
   {id:'A',rank:2,finishTimeS:12}],'road-1s'));
});
