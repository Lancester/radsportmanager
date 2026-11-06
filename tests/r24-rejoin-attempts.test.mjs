import test from 'node:test';
import assert from 'node:assert/strict';
import {RejoinAttemptTelemetry} from '../src/engine/race/rejoin-attempt-telemetry.ts';
const r=(id,teamId,role,positionM)=>({id,teamId,role,positionM,speedMps:10,criticalPowerW:350,reserveFraction:.8,aggression:.5});
const order=(id)=>({riderId:id,mission:'jagd',duty:'fuehrung',desiredPowerW:360,reason:'rejoin',groupFrontM:800,isRejoin:true});
const riders=[r('TARGET','B','helfer',1000),r('TARGET2','B','helfer',995),
  r('HELP','A','helfer',800),r('CAP','A','kapitaen',795)];
test('Anschlussaudit dokumentiert Zusammengehörigkeit mit einem ursprünglichen Zielfahrer',()=>{
 const t=new RejoinAttemptTelemetry(),o=new Map([['HELP',order('HELP')]]);
 t.observe(10,riders,o);
 t.observe(20,riders.map(x=>['HELP','CAP'].includes(x.id)?{...x,positionM:x.positionM+160}:x),new Map());
 const [a]=t.report(30);assert.equal(a.outcome,'original_target_in_same_group');
 assert.equal(a.startGapM,195);assert.equal(a.endGapM,0);
 assert.equal(a.startTimeS,10);assert.equal(a.endTimeS,20);
 assert.deepEqual(a.targetRiderIds,['TARGET','TARGET2']);
});
test('Beendeter Auftrag ohne Zielkontakt ist nicht automatisch ein Erfolg',()=>{
 const t=new RejoinAttemptTelemetry();t.observe(10,riders,new Map([['HELP',order('HELP')]]));
 t.observe(20,riders,new Map());const [a]=t.report(20);
 assert.equal(a.outcome,'order_ended');assert.equal(a.endGapM,195);
});
test('Keine aktiven Zielfahrer: Ausgang bleibt unbekannt',()=>{
 const t=new RejoinAttemptTelemetry();t.observe(10,riders,new Map([['HELP',order('HELP')]]));
 t.observe(20,riders.filter(x=>x.teamId==='A'),new Map());
 assert.equal(t.report(20)[0].outcome,'target_not_active');
 assert.equal(t.report(20)[0].endGapM,null);
});
test('Sprintauftrag misst den tatsächlichen Sprinter, nicht den Kapitän im selben Team',()=>{
 const t=new RejoinAttemptTelemetry();
 const field=[r('FRONT','B','helfer',1000),r('HELP','A','helfer',800),
   r('SPRINT','A','sprinter',795),r('CAP','A','kapitaen',500)];
 const sprintOrder={...order('HELP'),rejoinProtectedRiderId:'SPRINT'};
 t.observe(10,field,new Map([['HELP',sprintOrder]]));
 t.observe(20,field.map(x=>['HELP','SPRINT'].includes(x.id)?
   {...x,positionM:x.positionM+160}:x),new Map());
 const [a]=t.report(20);
 assert.equal(a.protectedRiderId,'SPRINT');
 assert.equal(a.captainId,undefined);
 assert.equal(a.startGapM,200);
 assert.equal(a.outcome,'original_target_in_same_group');
});
test('Explizit falsches Teamziel wird nicht stillschweigend auf den Kapitän umgebogen',()=>{
 const t=new RejoinAttemptTelemetry();
 t.observe(10,riders,new Map([['HELP',{...order('HELP'),rejoinProtectedRiderId:'TARGET'}]]));
 assert.deepEqual(t.report(20),[]);
});
test('Wechselt das Team den geschützten Fahrer, endet der alte Versuch ohne falschen Helfer',()=>{
 const t=new RejoinAttemptTelemetry();
 const field=[r('FRONT','B','helfer',1000),r('H1','A','helfer',800),
   r('SPRINT','A','sprinter',795),r('H2','A','helfer',500),r('CAP','A','kapitaen',495)];
 t.observe(10,field,new Map([['H1',{...order('H1'),rejoinProtectedRiderId:'SPRINT'}]]));
 t.observe(20,field,new Map([['H2',{...order('H2'),rejoinProtectedRiderId:'CAP'}]]));
 const [old,next]=t.report(20);
 assert.equal(old.protectedRiderId,'SPRINT');assert.equal(old.outcome,'order_ended');
 assert.deepEqual(old.helperIds,['H1']);assert.equal(next.protectedRiderId,'CAP');
});
