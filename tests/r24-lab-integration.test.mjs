import test from 'node:test';
import assert from 'node:assert/strict';
import {buildLabRace,initialLabSettings} from '../src/labor/lab-settings.ts';
import {simulateRace} from '../src/engine/race/race-simulator.ts';
import {scoreFinishGroups} from '../src/engine/race/finish-time-groups.ts';

test('LAB: echte 30-km-Engine berechnet steuerbare Eingaben deterministisch',()=>{
 const s=initialLabSettings();s.teamCount=2;s.seed=2026;
 s.wind.headwindMps=2;s.teams=[{teamId:'T01',strategy:'offensiv'}];
 s.engine.stepSeconds=2;
 const configured=buildLabRace(s).input;
 const input={...configured,
   title:'Rennlabor Integrationstest 30 km',
   segments:[{...configured.segments[0],lengthM:30000}],
   diagnosticLevel:'checkpoints'};
 const a=simulateRace(input),b=simulateRace(input);
 assert.equal(a.classification.length,14);
 assert.deepEqual(a.classification,b.classification);
 assert.deepEqual(a.events,b.events);
 assert.equal(a.classification[0].rank,1);
 assert.ok(a.classification.every(r=>Number.isFinite(r.finishTimeS)));
 const grouped=scoreFinishGroups(a.classification.map(x=>({
   id:x.id,rank:x.rank,finishTimeS:x.finishTimeS
 })),s.timingRule);
 assert.equal(grouped.length,14);
 assert.ok(grouped.every((r,i)=>r.rank===i+1&&r.creditedGapS>=0));
});
