import test from 'node:test';import assert from 'node:assert/strict';
import {createReferenceFixture} from '../src/engine/race/reference-fixtures.ts';
import {initialLabSettings,buildLabRace} from '../src/labor/lab-settings.ts';
import {simulateRace} from '../src/engine/race/race-simulator.ts';
import {scoreFinishGroups} from '../src/engine/race/finish-time-groups.ts';
import {buildTeamReport} from '../src/labor/team-report.ts';
test('Fahrernamen: glaubwürdig, einzigartig, identischer Seed stabil',()=>{
 const a=createReferenceFixture({routeId:'tdf25_lille',seed:2026});
 const b=createReferenceFixture({routeId:'tdf25_lille',seed:2026});
 const c=createReferenceFixture({routeId:'tdf25_lille',seed:42});
 const names=a.input.riders.map(r=>r.name);
 assert.equal(names.length,154);
 assert.equal(new Set(names).size,154);
 assert.ok(names.every(n=>n.includes(' ')&&!n.includes('Fiktiver Profi')));
 assert.deepEqual(names,b.input.riders.map(r=>r.name));
 assert.notDeepEqual(names,c.input.riders.map(r=>r.name));
 assert.deepEqual(a.input.riders.map(r=>r.id),c.input.riders.map(r=>r.id));
 assert.deepEqual(a.input.riders.map(({name,...r})=>r),
   c.input.riders.map(({name,...r})=>r));
});
test('Kapitän wechseln: echte Rolle, kein zweiter Kapitän, nur eigenes Team',()=>{
 const s=initialLabSettings();s.myTeamId='T02';
 const baseline=buildLabRace(s).input;
 const selected=baseline.riders.find(r=>r.teamId==='T02'&&r.role==='helfer');
 s.captainId=selected.id;
 const changed=buildLabRace(s).input;
 const team=changed.riders.filter(r=>r.teamId==='T02');
 assert.equal(team.filter(r=>r.role==='kapitaen').length,1);
 assert.equal(team.find(r=>r.role==='kapitaen').id,selected.id);
 assert.equal(team.find(r=>r.id===baseline.riders.find(x=>x.teamId==='T02'&&x.role==='kapitaen').id).role,'frei');
 assert.deepEqual(changed.riders.filter(r=>r.teamId!=='T02'),
   baseline.riders.filter(r=>r.teamId!=='T02'));
 assert.deepEqual(changed.riders.map(r=>r.name),baseline.riders.map(r=>r.name));
 s.captainId='F001';
 assert.throws(()=>buildLabRace(s),/Kapitän muss/);
});
test('Teambericht: einzige Quelle reale Checkpoints, Events und Zielzeiten',()=>{
 const s=initialLabSettings();s.teamCount=2;s.myTeamId='T01';s.captainId='F003';
 const full=buildLabRace(s).input;
 const input={...full,segments:[{...full.segments[0],lengthM:30000}]};
 const result=simulateRace(input);
 const timing=scoreFinishGroups(result.classification.map(r=>({
   id:r.id,rank:r.rank,finishTimeS:r.finishTimeS
 })),'road-1s');
 const report=buildTeamReport(input,result,'T01',
   new Map(timing.map(x=>[x.id,x.creditedGapS])));
 assert.equal(report.riderResults.length,7);
 assert.equal(report.captainId,'F003');
 assert.equal(report.captainName,input.riders.find(r=>r.id==='F003').name);
 assert.equal(report.riderResults.find(r=>r.id==='F003').role,'kapitaen');
 assert.equal(report.counts.attacks,result.events.filter(e=>e.teamId==='T01'&&e.type==='attack').length);
 assert.ok(report.events.every(e=>Number.isFinite(e.km)));
 assert.ok(report.summary.some(t=>t.includes(report.captainName)));
 assert.ok(report.checkpoints.every(x=>x.captainGapM>=0&&x.captainGroup>=1));
});
