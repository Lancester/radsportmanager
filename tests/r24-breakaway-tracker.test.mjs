import test from 'node:test';
import assert from 'node:assert/strict';
import {advanceBreakawayTracker,initialTrackedBreakaway}
  from '../src/engine/race/breakaway-tracker.ts';

const group=(prefix,count,front)=>Array.from({length:count},(_,i)=>
  ({id:prefix+i,positionM:front-i}));
const advance=(state,groups,timeS)=>advanceBreakawayTracker({
  state,groups,timeS,riderId:r=>r.id});

test('R24: eingeholte Flucht endet trotz zurueckgebliebenem Fahrerfeld',()=>{
  const lead=group('L',2,2000),main=group('M',50,1600),back=group('B',4,1300);
  const start=advance(initialTrackedBreakaway(),[lead,main,back],0);
  const established=advance(start.state,[lead,main,back],41);
  assert.equal(established.event,'breakaway');
  assert.equal(established.state.escapeIds.length,2);
  const merged=[...group('L',2,2000),...group('M',50,1998)];
  const first=advance(established.state,[merged,back],42);
  assert.equal(first.event,null);
  const caught=advance(first.state,[merged,back],83);
  assert.equal(caught.event,'caught');
  assert.ok(caught.gapM<=35);
  assert.equal(caught.state.escapeIds.length,0);
});
test('R24: grosse Flucht und einzeln weiter vorn gebliebener Fahrer',()=>{
  const lead=group('L',20,2000),main=group('M',60,1600);
  const first=advance(initialTrackedBreakaway(),[lead,main],0);
  const active=advance(first.state,[lead,main],41);
  assert.equal(active.event,'breakaway');
  assert.equal(active.state.escapeIds.length,20);
  const stillAhead=[lead[0]];
  const joined=[...lead.slice(1).map((r,i)=>({...r,positionM:1600-i})),
    ...main.map((r,i)=>({...r,positionM:1580-i}))];
  const step=advance(active.state,[stillAhead,joined],100);
  assert.equal(step.event,null);
  assert.equal(step.state.escapeIds.length,20);
});
test('Nachgeführter Fahrer hält Flucht offen, wenn ursprüngliche Fahrer zurückfallen',()=>{
  const lead=group('L',2,2000),main=group('M',20,1600);
  const start=advance(initialTrackedBreakaway(),[lead,main],0);
  const active=advance(start.state,[lead,main],41);
  const expanded=[...lead,{id:'M0',positionM:1995}];
  const mainWithoutJoiner=main.filter(r=>r.id!=='M0');
  const joined=advance(active.state,[expanded,mainWithoutJoiner],60);
  assert.ok(joined.state.escapeIds.includes('M0'));
  assert.ok(!joined.state.mainIds.includes('M0'));
  const ahead=[{id:'M0',positionM:2200}];
  const originalBack=[...lead.map((r,i)=>({...r,positionM:1800-i})),
    ...mainWithoutJoiner.map((r,i)=>({...r,positionM:1798-i}))];
  const later=advance(joined.state,[ahead,originalBack],110);
  const stillAhead=advance(later.state,[ahead,originalBack],160);
  assert.notEqual(stillAhead.event,'caught');
  assert.ok(stillAhead.state.escapeIds.includes('M0'));
});
test('R24: Zielankunft des letzten Ausreissers ist keine Einholung',()=>{
  const lead=group('L',2,2000),main=group('M',20,1600);
  const a=advance(initialTrackedBreakaway(),[lead,main],0);
  const b=advance(a.state,[lead,main],41);
  const c=advance(b.state,[main],50);
  assert.equal(c.event,null);
  assert.equal(c.state.escapeIds.length,0);
});

test('R24: lange Abstandskette meldet keinen noch voraus fahrenden Ausreisser eingeholt',()=>{
  const lead=group('L',2,2000),main=group('M',5,1600);
  const first=advance(initialTrackedBreakaway(),[lead,main],0);
  const active=advance(first.state,[lead,main],41);
  const chain=[{id:'L0',positionM:2000},{id:'X',positionM:1960},
    {id:'L1',positionM:1920},{id:'M0',positionM:1910},
    ...group('M',5,1909).slice(1)];
  const observation=advance(active.state,[chain],100);
  const later=advance(observation.state,[chain],141);
  assert.equal(later.event,null);
  assert.equal(later.state.escapeIds.length,2);
  const together=[{id:'L0',positionM:1930},{id:'L1',positionM:1920},
    ...group('M',5,1910)];
  const joined=advance(later.state,[together],142);
  const caught=advance(joined.state,[together],183);
  assert.equal(caught.event,'caught');
});
