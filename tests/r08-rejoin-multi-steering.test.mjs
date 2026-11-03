import test from 'node:test';
import assert from 'node:assert/strict';
import {lanePlanConflicts,R08_RESERVATION} from '../src/engine/ai/lane-coordination.ts';
import {decideRejoin,R08_REJOIN} from '../src/engine/ai/rejoin-controller.ts';
import {beginSteeringProfile,advanceSteeringProfile,safeCornerSpeedMps,
  steeringAccelerationBudgetMps2} from '../src/engine/physics/steering-limits.ts';
import {createEightRiderExample,createEightRiderAutoPassExample,
  createEightRiderRejoinExample,createEightRiderMultiAgentExample,
  simulateGroup} from '../src/engine/physics/drafting-group.ts';

const near=(a,b,t=1e-6)=>assert.ok(Number.isFinite(a)&&Math.abs(a-b)<=t,
  `${a} statt ${b}`);
const group=()=>({roadHalfWidthM:3,riders:[
  {id:'F1',positionM:15,lateralPositionM:0,speedMps:11},
  {id:'F7',positionM:3.4,lateralPositionM:0,speedMps:11},
  {id:'F8',positionM:0,lateralPositionM:0,speedMps:11},
]});
const resetReturn=(positionM=35)=>{
  const o=group();
  o.riders[2].positionM=positionM;
  o.riders[2].lateralPositionM=2;
  return o;
};
const curve={maxSteeringAccelerationMps2:1.5,
  combinedLateralGripMps2:3,curveRadiusM:80};

test('R08 Koordination: konkurrierende nahe Spurziele werden reserviert',()=>{
 const o=group();
 assert.equal(lanePlanConflicts(o,{riderId:'F8',targetM:2,rateMps:.8},
  [{riderId:'F7',targetM:2,rateMps:.8}],R08_RESERVATION),true);
});
test('R08 Koordination: freie Gegenseite wird erlaubt',()=>{
 assert.equal(lanePlanConflicts(group(),{riderId:'F8',targetM:-2,rateMps:.8},
  [{riderId:'F7',targetM:2,rateMps:.8}],R08_RESERVATION),false);
});
test('R08 Koordination: quer kreuzende Reservierungen werden erkannt',()=>{
 const o=group();o.riders[0].lateralPositionM=2;
 assert.equal(lanePlanConflicts(o,{riderId:'F8',targetM:2,rateMps:.8},
  [{riderId:'F7',targetM:-2,rateMps:.8}],R08_RESERVATION),true);
});
test('R08 Koordination: ungültige und unbekannte Reservierungen werden abgelehnt',()=>{
 assert.throws(()=>lanePlanConflicts(group(),{riderId:'X',targetM:2,rateMps:.8},[]),RangeError);
 assert.throws(()=>lanePlanConflicts(group(),{riderId:'F8',targetM:5,rateMps:.8},[]),RangeError);
});
test('R08 Wiedereinscheren: verweigert Rückkehr bis genügend überholt wurden',()=>{
 assert.equal(decideRejoin('F8',resetReturn(),R08_REJOIN,6,.8,[],R08_RESERVATION).action,'stay');
});
test('R08 Wiedereinscheren: verweigert Rückkehr mit zu knappem Vorsprung',()=>{
 assert.equal(decideRejoin('F8',resetReturn(21),R08_REJOIN,7,.8,[],R08_RESERVATION).action,'stay');
});
test('R08 Wiedereinscheren: freie Heimatspur und ausreichender Vorsprung geben Freigabe',()=>{
 const result=decideRejoin('F8',resetReturn(35),R08_REJOIN,7,.8,[],R08_RESERVATION);
 assert.equal(result.action,'move');assert.equal(result.targetLateralPositionM,0);
});
test('R08 Wiedereinscheren: reservierter Konflikt verhindert Rückkehr',()=>{
 const o=resetReturn(35);
 o.riders[1].positionM=31;
 o.riders[1].lateralPositionM=-2;
 const cfg={...R08_REJOIN,requiredLeadGapM:3};
 const d=decideRejoin('F8',o,cfg,7,.8,[{riderId:'F7',targetM:0,rateMps:.8}],R08_RESERVATION);
 assert.equal(d.action,'stay');
});
test('R08 Kurve: Tempo-Schwellwert und Rest-Querbeschleunigung berechenbar',()=>{
 near(safeCornerSpeedMps(curve),Math.sqrt(240),1e-10);
 const budget=steeringAccelerationBudgetMps2(curve,11);
 assert.ok(budget>0&&budget<=curve.maxSteeringAccelerationMps2);
 assert.throws(()=>steeringAccelerationBudgetMps2(curve,17),/Kurventempo/);
});
test('R08 Querprofil startet und endet mit v_y null bei begrenzter Beschleunigung',()=>{
 let p=beginSteeringProfile(0,2,.8,3,11,curve);
 let previous=0;
 let maxA=0,maxV=0,complete=false;
 for(let i=0;i<80;i++){
  const next=advanceSteeringProfile(p,.2,11,curve);
  p=next.state;maxA=Math.max(maxA,Math.abs(next.steeringAccelerationMps2));
  maxV=Math.max(maxV,Math.abs(next.lateralSpeedMps));
  assert.ok(next.lateralPositionM>=previous-1e-9);
  previous=next.lateralPositionM;
  if(next.completed){complete=true;near(next.lateralSpeedMps,0);break;}
 }
 assert.equal(complete,true);
 near(previous,2);
 assert.ok(maxV<=.8+1e-8);
 assert.ok(maxA<=1.5+1e-8);
});
test('R08 Engerer Kurvenradius reduziert Querbeschleunigungsbudget',()=>{
 const tight={...curve,curveRadiusM:43};
 const loose={...curve,curveRadiusM:200};
 assert.ok(steeringAccelerationBudgetMps2(tight,11)<
  steeringAccelerationBudgetMps2(loose,11));
});
test('R08 Ungültige Quergrenzen werden abgewiesen',()=>{
 assert.throws(()=>beginSteeringProfile(0,4,.8,3,11,curve),RangeError);
 assert.throws(()=>beginSteeringProfile(0,2,0,3,11,curve),RangeError);
 assert.throws(()=>beginSteeringProfile(0,2,.8,3,17,curve),RangeError);
});
test('R08 Rejoin: ein Achtfahrer-Agent überholt und kehrt physisch auf y=0 zurück',()=>{
 const r=simulateGroup(createEightRiderRejoinExample());
 const choices=r.events.filter(e=>e.type==='agent-rejoin-choice'&&e.riderId==='F8');
 assert.equal(choices.length,1,JSON.stringify(choices));
 assert.ok(r.events.some(e=>e.type==='lane-complete'&&e.riderId==='F8'&&e.lateralPositionM===0));
 assert.ok(r.riders[7].autonomousOvertakes>=7);
 assert.equal(r.riders[7].autonomousRejoins,1);
 near(r.riders[7].lateralPositionM,0);
 assert.ok(r.riders.every(x=>Math.abs(x.energyResidualJ)<.05));
});
test('R08 Mehrfahrer: F7/F8 entscheiden aus demselben Stand für getrennte Seiten',()=>{
 const r=simulateGroup(createEightRiderMultiAgentExample());
 const choices=r.events.filter(e=>e.type==='agent-lane-choice');
 const a=choices.find(e=>e.riderId==='F7');
 const b=choices.find(e=>e.riderId==='F8');
 assert.ok(a&&b,JSON.stringify(choices));
 near(a.lateralPositionM,2);near(b.lateralPositionM,-2);
 assert.ok(r.riders[6].autonomousOvertakes>0);
 assert.ok(r.riders[7].autonomousOvertakes>0);
 assert.ok(r.riders.every(x=>Math.abs(x.energyResidualJ)<.05));
});
test('R08 Mehrfahrer: Eingabereihenfolge verändert Entscheidungen oder Physik nicht',()=>{
 const original=createEightRiderMultiAgentExample();
 const reversed=createEightRiderMultiAgentExample();
 reversed.riders.reverse();reversed.overtakeAgents.reverse();
 reversed.physiology.reverse();
 const a=simulateGroup(original),b=simulateGroup(reversed);
 const choices=x=>x.events.filter(e=>e.type==='agent-lane-choice')
   .map(e=>({id:e.riderId,y:e.lateralPositionM})).sort((a,b)=>a.id.localeCompare(b.id));
 assert.deepEqual(choices(a),choices(b));
 const positions=x=>[...x.riders].sort((a,b)=>a.id.localeCompare(b.id))
  .map(r=>({id:r.id,x:r.positionM,y:r.lateralPositionM,energy:r.energyResidualJ}));
 const posA=positions(a),posB=positions(b);
 for(let i=0;i<8;i++){
  assert.equal(posA[i].id,posB[i].id);
  near(posA[i].x,posB[i].x,.00001);
  near(posA[i].y,posB[i].y,.00001);
  near(posA[i].energy,posB[i].energy,.00001);
 }
});
test('R08 Mehrfahrer: beobachtete Lateralbeschleunigung bleibt im Limit',()=>{
 const r=simulateGroup(createEightRiderMultiAgentExample());
 for(const v of [r.riders[6],r.riders[7]]){
  assert.ok(v.maximumSteeringAccelerationMps2>0);
  assert.ok(v.maximumSteeringAccelerationMps2<=1.5+1e-7);
 }
});
test('R08 Mehrfahrer: CP/Wprime- und FTP-Werte bleiben endlich',()=>{
 const r=simulateGroup(createEightRiderMultiAgentExample());
 for(const v of [r.riders[6],r.riders[7]]){
  assert.ok(v.wPrimeRemainingJ>=0 && v.wPrimeRemainingJ<=12000);
  assert.ok(Number.isFinite(v.averageCrankPowerW));
  assert.ok(Number.isFinite(v.timeAboveFtpS));
 }
});
test('R08 Alte R07-Läufe ohne R08-Felder bleiben identisch',()=>{
 const base=createEightRiderAutoPassExample();
 const neutral=createEightRiderAutoPassExample();
 neutral.steeringLimits=undefined;
 assert.deepEqual(simulateGroup(base),simulateGroup(neutral));
});
test('R08 identischer Mehrfahrer-Lauf bleibt deterministisch',()=>{
 assert.deepEqual(simulateGroup(createEightRiderMultiAgentExample()),
  simulateGroup(createEightRiderMultiAgentExample()));
});
