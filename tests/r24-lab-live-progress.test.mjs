import test from 'node:test';
import assert from 'node:assert/strict';
import {buildLabRace,initialLabSettings} from '../src/labor/lab-settings.ts';
import {simulateRace} from '../src/engine/race/race-simulator.ts';

test('Live-Zwischenstände: gleiche Rennphysik, Seed, Endzeiten und Events',()=>{
 const s=initialLabSettings();s.teamCount=2;s.seed=2026;s.myTeamId='T01';
 const full=buildLabRace(s).input;
 const input={...full,segments:[{...full.segments[0],lengthM:30000}]};
 const without=simulateRace(input);
 const progress=[];
 const withCallback=simulateRace(input,p=>progress.push(p),'T01');
 assert.deepEqual(withCallback.classification,without.classification);
 assert.deepEqual(withCallback.events,without.events);
 assert.deepEqual(withCallback.snapshots,without.snapshots);
 assert.ok(progress.length>=5,'echte Fortschrittsmeldungen alle 5 km');
 assert.ok(progress.every(p=>p.percent>=0&&p.percent<=100&&
   Number.isFinite(p.km)&&Number.isFinite(p.totalKm)&&p.totalKm===30));
 assert.ok(progress.every((p,i)=>i===0||p.km>progress[i-1].km));
 assert.ok(progress.some(p=>p.captain?.id==='F001'));
 assert.ok(progress.every(p=>Array.isArray(p.events)&&p.events.length<=12));
});
test('Team-Live-Ticker: gewähltes Team und gewählter Kapitän',()=>{
 const s=initialLabSettings();s.teamCount=2;s.myTeamId='T02';s.captainId='F009';
 const full=buildLabRace(s).input;
 const input={...full,segments:[{...full.segments[0],lengthM:30000}]};
 const progress=[];
 const result=simulateRace(input,p=>progress.push(p),'T02');
 assert.equal(result.classification.length,14);
 assert.ok(progress.length>=5);
 assert.ok(progress.every(p=>p.captain?.id==='F009'));
 assert.ok(progress.every(p=>p.captain?.group>=1));
 assert.ok(progress.every(p=>p.captain?.helpers>=0&&p.captain.helpers<=6));
});