import test from 'node:test';
import assert from 'node:assert/strict';
import {decideOvertakeLane,R07_F8_AGENT} from '../src/engine/ai/overtake-controller.ts';
import {simulateGroup,createEightRiderExample,createEightRiderAutoPassExample,createEightRiderTimedPassWithCpExample} from '../src/engine/physics/drafting-group.ts';
const params=()=>({...R07_F8_AGENT,candidateLanesM:[2,-2]});
const free=()=>({
  roadHalfWidthM:3,
  riders:[
    {id:'F1',positionM:15,lateralPositionM:0,speedMps:11},
    {id:'F7',positionM:3.4,lateralPositionM:0,speedMps:11},
    {id:'F8',positionM:0,lateralPositionM:0,speedMps:11},
  ],
});
const near=(a,b,tol=1e-6)=>assert.ok(Number.isFinite(a)&&Math.abs(a-b)<=tol,`${a} statt ${b}`);
test('Agent wählt ohne äußeren Spurauftrag selbstständig die freie rechte Spur',()=>{
 const r=decideOvertakeLane(params(),free());
 assert.equal(r.action,'move');assert.equal(r.targetLateralPositionM,2);
});
test('Agent findet bei belegter rechter Spur eine freie linke Alternative',()=>{
 const o=free();o.riders.push({id:'F9',positionM:0,lateralPositionM:2,speedMps:11});
 const r=decideOvertakeLane(params(),o);
 assert.equal(r.action,'move');assert.equal(r.targetLateralPositionM,-2);
});
test('Agent verweigert Manöver, wenn beide Spuren belegt sind',()=>{
 const o=free();
 o.riders.push({id:'B1',positionM:0,lateralPositionM:2,speedMps:11});
 o.riders.push({id:'B2',positionM:0,lateralPositionM:-2,speedMps:11});
 const r=decideOvertakeLane(params(),o);
 assert.equal(r.action,'stay');assert.match(r.reason,/Keine konfliktfreie/);
});
test('Eine dynamisch in den Spurwechsel wandernde andere Fahrerposition wird vorhergesagt',()=>{
 const o=free();
 o.riders.push({id:'B1',positionM:-3,lateralPositionM:2,speedMps:14});
 const r=decideOvertakeLane(params(),o);
 assert.equal(r.action,'move');assert.equal(r.targetLateralPositionM,-2);
});
test('Kein naher Vordermann: kein unnötiges Ausweichen',()=>{
 const o=free();o.riders[1].positionM=30;o.riders[0].positionM=40;
 assert.equal(decideOvertakeLane(params(),o).action,'stay');
});
test('Straßenrand ist bindend, selbst wenn das Wunschziel frei scheint',()=>{
 const o=free();o.roadHalfWidthM=1.8;
 assert.equal(decideOvertakeLane(params(),o).action,'stay');
});
test('Ungültige Agentenparameter werden abgewiesen',()=>{
 assert.throws(()=>decideOvertakeLane({...params(),attackPowerW:-1},free()),RangeError);
 assert.throws(()=>decideOvertakeLane({...params(),candidateLanesM:[]},free()),RangeError);
 assert.throws(()=>decideOvertakeLane(params(),{...free(),riders:[]}),RangeError);
});
test('Autonomer Achtfahrer-Überholtest führt ein Manöver ohne externes Spurkommando aus',()=>{
 const x=createEightRiderAutoPassExample();
 assert.equal(x.laneCommands,undefined);
 assert.equal(x.commands.length,0);
 const r=simulateGroup(x);
 near(r.elapsedS,65,1e-8);
 assert.ok(r.events.some(e=>e.type==='agent-lane-choice'&&e.riderId==='F8'));
 assert.ok(r.events.some(e=>e.type==='lane-complete'&&e.riderId==='F8'));
 assert.ok(r.events.some(e=>e.type==='overtake'&&e.riderId==='F8'&&e.passedRiderId==='F7'));
 assert.ok(r.riders[7].autonomousOvertakes>0);
 near(r.riders[7].lateralPositionM,2);
 assert.ok(r.riders.every(v=>Math.abs(v.energyResidualJ)<0.05));
});
test('Autonomer Überholversuch entspricht dynamisch identischem manuell vorgegebenem Manöver',()=>{
 const auto=simulateGroup(createEightRiderAutoPassExample());
 const manual=simulateGroup(createEightRiderTimedPassWithCpExample());
 for(let i=0;i<8;i++){
   near(auto.riders[i].positionM,manual.riders[i].positionM,1e-5);
   near(auto.riders[i].speedMps,manual.riders[i].speedMps,1e-5);
 }
 near(auto.riders[7].wPrimeRemainingJ,manual.riders[7].wPrimeRemainingJ,1e-4);
});
test('Autonomer Überholfahrer hat endliche CP/Wprime-Reserve',()=>{
 const r=simulateGroup(createEightRiderAutoPassExample());
 const f8=r.riders[7];
 assert.ok(f8.wPrimeRemainingJ>=0 && f8.wPrimeRemainingJ<=12000);
 assert.ok(f8.timeAboveFtpS>0);
 assert.ok(f8.averageCrankPowerW>0);
 assert.ok(f8.workAboveFtpJ>0);
});
test('Automatischer Überholagent verändert keine Physik eines alten Szenarios',()=>{
 assert.deepEqual(simulateGroup(createEightRiderExample()),
  simulateGroup({...createEightRiderExample(),overtakeAgents:[]}));
});
test('Unbekannter oder doppelt registrierter Agent wird abgelehnt',()=>{
 const a=createEightRiderAutoPassExample();
 a.overtakeAgents[0].riderId='UNBEKANNT';
 assert.throws(()=>simulateGroup(a),RangeError);
 const b=createEightRiderAutoPassExample();
 b.overtakeAgents.push({...R07_F8_AGENT});
 assert.throws(()=>simulateGroup(b),RangeError);
});
test('Externer Spurauftrag desselben autonomen Fahrers wird abgelehnt',()=>{
 const a=createEightRiderAutoPassExample();
 a.laneCommands=[{timeS:1,riderId:'F8',targetLateralPositionM:-2}];
 assert.throws(()=>simulateGroup(a),RangeError);
});
test('Identischer Agentenlauf bleibt bitgenau reproduzierbar',()=>{
 assert.deepEqual(simulateGroup(createEightRiderAutoPassExample()),
  simulateGroup(createEightRiderAutoPassExample()));
});

test('Leere Wprime-Reserve begrenzt die Attacke tatsächlich',()=>{
 const rich=createEightRiderAutoPassExample();
 const limited=createEightRiderAutoPassExample();
 limited.physiology[0].initialWPrimeJ=0;
 limited.physiology[0].recoveryEfficiency=0;
 const fullResult=simulateGroup(rich);
 const limitedResult=simulateGroup(limited);
 assert.equal(limitedResult.riders[7].wPrimeRemainingJ,0);
 assert.ok(limitedResult.riders[7].cpLimitedSeconds>0);
 assert.ok(limitedResult.riders[7].positionM<fullResult.riders[7].positionM,
   'Leere Wprime darf nicht dieselbe Angriffsdynamik wie volle Reserve liefern');
});
test('Fehlerhafte autonome Spurwahl kann nicht als gemessener Erfolg durchgehen',()=>{
 const x=createEightRiderAutoPassExample();
 x.overtakeAgents[0].candidateLanesM=[4];
 const result=simulateGroup(x);
 assert.ok(result.events.every(e=>e.type!=='agent-lane-choice'),
   'Außerhalb der Straße darf keine Spur zugewiesen werden');
 assert.equal(result.riders[7].autonomousOvertakes,0);
});
