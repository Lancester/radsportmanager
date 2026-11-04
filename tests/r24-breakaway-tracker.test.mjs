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
test('R24: Zielankunft des letzten Ausreissers ist keine Einholung',()=>{
  const lead=group('L',2,2000),main=group('M',20,1600);
  const a=advance(initialTrackedBreakaway(),[lead,main],0);
  const b=advance(a.state,[lead,main],41);
  const c=advance(b.state,[main],50);
  assert.equal(c.event,null);
  assert.equal(c.state.escapeIds.length,0);
});
