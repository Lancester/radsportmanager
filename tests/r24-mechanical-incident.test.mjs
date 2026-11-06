import test from 'node:test';
import assert from 'node:assert/strict';
import {createRaceExample,simulateRace,validateRace} from '../src/engine/race/race-simulator.ts';
import {createRaceReport} from '../src/engine/race/race-report.ts';
function race(){
 const x=createRaceExample({profile:'flach',seed:2026});
 return {...x,segments:[{...x.segments[0],lengthM:2000}],
   riders:x.riders.slice(0,2),groupRidingModel:'stable-pack'};
}
test('Kontrollierter Defekt führt zu echtem Halt, Reparatur und Weiterfahrt',()=>{
 const input=race(),riderId=input.riders[0].id;
 const result=simulateRace({...input,plannedMechanicalIncidents:[{
  riderId,atTimeS:30,serviceDurationS:45}]});
 const events=result.events.filter(e=>e.riderId===riderId&&e.type.startsWith('mechanical-'));
 assert.deepEqual(events.map(e=>e.type),['mechanical-incident','mechanical-service','mechanical-resume']);
 assert.ok(events[1].timeS>events[0].timeS);
 assert.ok(events[2].timeS-events[1].timeS>=45);
 assert.ok(events[2].timeS-events[1].timeS<46);
 assert.ok(Math.abs(events[2].km-events[1].km)<1e-8,'Bei Reparatur kein Positionssprung');
 assert.ok(result.classification.every(r=>r.finalWPrimeJ>=0&&Math.abs(r.energyResidualJ)<.05));
 assert.ok(result.classification.find(r=>r.id===riderId).brakeLossJ>0);
 assert.equal(result.finisherCount,2);
 const report=createRaceReport({result});
 assert.deepEqual(report.events.filter(e=>e.type.startsWith('mechanical-')).map(e=>e.type),
   ['mechanical-incident','mechanical-service','mechanical-resume']);
});
test('Ohne geplanten Defekt bleibt der bisherige Lauf unverändert',()=>{
 const input=race();
 assert.deepEqual(simulateRace(input),simulateRace({...input,plannedMechanicalIncidents:[]}));
 const late=simulateRace({...input,plannedMechanicalIncidents:[{
   riderId:input.riders[0].id,atTimeS:10000,serviceDurationS:30}]});
 assert.ok(late.events.every(e=>!e.type.startsWith('mechanical-')));
});
test('Ungültige oder mehrdeutige Defekteingaben werden zurückgewiesen',()=>{
 const input=race(),riderId=input.riders[0].id;
 for(const incidents of [[{riderId:'X',atTimeS:30,serviceDurationS:10}],
  [{riderId,atTimeS:-1,serviceDurationS:10}],
  [{riderId,atTimeS:30,serviceDurationS:0}],
  [{riderId,atTimeS:30,serviceDurationS:10},{riderId,atTimeS:100,serviceDurationS:10}]])
  assert.throws(()=>validateRace({...input,plannedMechanicalIncidents:incidents}),RangeError);
});
