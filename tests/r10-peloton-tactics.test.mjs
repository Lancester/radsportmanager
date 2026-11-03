import test from 'node:test';
import assert from 'node:assert/strict';
import {decidePelotonFollowing} from '../src/engine/race/peloton-pacing.ts';
import {stabilizeTactic} from '../src/engine/race/tactic-stability.ts';
import {initialGroupState,confirmStableGroups} from '../src/engine/race/stable-groups.ts';
import {createRaceExample,simulateRace} from '../src/engine/race/race-simulator.ts';

const rider={
  riderMassKg:72,equipmentMassKg:8,dragAreaM2:.29,
  rollingCoefficient:.004,airDensityKgM3:1.2,drivetrainEfficiency:.975,
};
const follower=(overrides={})=>decidePelotonFollowing({
  frontGapM:6,frontSpeedMps:11,ownSpeedMps:11,
  gradeFraction:0,aeroFactor:.75,rider,
  desiredPowerW:250,criticalPowerW:280,intent:'windschatten',
  ...overrides,
});
test('R-10: Fahrer ohne Vordermann behält allein seine gewählten Watt',()=>{
 const result=follower({frontGapM:null,frontSpeedMps:null});
 assert.equal(result.following,false);
 assert.equal(result.powerW,250);assert.equal(result.brakeForceN,0);
});
test('R-10: ausdrückliche Attacke bleibt von der Peloton-Temporücknahme unberührt',()=>{
 const x=follower({intent:'angriff',desiredPowerW:390});
 assert.equal(x.powerW,390);assert.equal(x.following,false);
});
test('R-10: freie Fahrt bei deutlich mehr als 32 Metern Abstand',()=>{
 const x=follower({frontGapM:45});
 assert.equal(x.powerW,250);assert.equal(x.following,false);
});
test('R-10: naher Vordermann ergibt endliche begrenzte echte Wattanforderung',()=>{
 const x=follower();
 assert.equal(x.following,true);
 assert.ok(x.powerW>0&&x.powerW<365);
 assert.equal(x.brakeForceN,0);
});
test('R-10: große aufholbare Lücke fordert mehr Watt als enge Lücke',()=>{
 const near=follower({frontGapM:3,ownSpeedMps:11.2});
 const far=follower({frontGapM:18,ownSpeedMps:11.2});
 assert.ok(far.powerW>near.powerW,`${far.powerW} <= ${near.powerW}`);
});
test('R-10: auflaufender Fahrer reduziert Watt und bremst mit echter Kraft',()=>{
 const x=follower({frontGapM:1.4,ownSpeedMps:12,frontSpeedMps:10});
 assert.equal(x.powerW,0);assert.ok(x.brakeForceN>0);
 assert.ok(x.brakeForceN<=240);
});
test('R-10: ungültige physikalische Parameter werden abgewiesen',()=>{
 assert.throws(()=>follower({frontGapM:-4}),RangeError);
 assert.throws(()=>follower({aeroFactor:1.5}),RangeError);
 assert.throws(()=>follower({ownSpeedMps:NaN}),RangeError);
});
const getDecision=(intent,power=270)=>({intent,desiredPowerW:power,reason:intent});
test('R-10: Verfolgungsmodus wird nicht alle zehn Sekunden gewechselt',()=>{
 const initial={decision:getDecision('verfolgung',310),changedAtS:10};
 const a=stabilizeTactic(getDecision('grundtempo',270),initial,20,.5);
 assert.equal(a.changed,false);
 assert.equal(a.state.decision.intent,'verfolgung');
 const b=stabilizeTactic(getDecision('grundtempo',270),initial,91,.5);
 assert.equal(b.changed,true);
 assert.equal(b.state.decision.intent,'grundtempo');
});
test('R-10: kritische Wprime-Reserve erlaubt sofortige Erholung',()=>{
 const a=stabilizeTactic(getDecision('erholung',210),
  {decision:getDecision('verfolgung',320),changedAtS:30},35,.05);
 assert.equal(a.changed,true);assert.equal(a.state.decision.intent,'erholung');
});
test('R-10: Erholungszustand bleibt bis zu höherer Reserve erhalten',()=>{
 const a=stabilizeTactic(getDecision('verfolgung',320),
  {decision:getDecision('erholung',210),changedAtS:30},300,.11);
 assert.equal(a.changed,false);
 const b=stabilizeTactic(getDecision('verfolgung',320),
  {decision:getDecision('erholung',210),changedAtS:30},300,.3);
 assert.equal(b.changed,true);
});
test('R-10: Zielsprint darf taktische Ruhe sinnvoll unterbrechen',()=>{
 const x=stabilizeTactic(getDecision('sprint',600),
  {decision:getDecision('grundtempo',260),changedAtS:40},50,.8);
 assert.equal(x.changed,true);assert.equal(x.state.decision.intent,'sprint');
});
test('R-10: kurze Gruppenlücke ist noch kein Ausreißerereignis',()=>{
 let s=initialGroupState(1);
 let x=confirmStableGroups(s,3,10,55);s=x.state;
 x=confirmStableGroups(s,3,30,55);
 assert.equal(x.changed,false);
 x=confirmStableGroups(x.state,1,31,55);
 assert.equal(x.split,false);
});
test('R-10: eine über 55 Sekunden bestehende Trennung gilt als Gruppenereignis',()=>{
 let s=initialGroupState(1);
 s=confirmStableGroups(s,2,100,55).state;
 const a=confirmStableGroups(s,2,154,55);
 assert.equal(a.changed,false);
 const b=confirmStableGroups(s,2,155,55);
 assert.equal(b.changed,true);assert.equal(b.split,true);
 assert.equal(b.state.confirmedCount,2);
});
test('R-10: ganzes 30-Fahrer-Rennen mit Pelotonregler erreicht 50 km',()=>{
 const r=simulateRace(createRaceExample());
 assert.equal(r.finisherCount,30);
 assert.equal(r.distanceM,50000);
 assert.ok(r.diagnostics.followingSeconds>0);
 assert.ok(r.classification.every(c=>
   Math.abs(c.energyResidualJ)<.05 && c.finalWPrimeJ>=0));
});
test('R-10: einfache Referenz ohne Gruppentempo bleibt zum Vergleich erreichbar',()=>{
 const legacy=simulateRace({...createRaceExample(),pelotonModel:'legacy'});
 const current=simulateRace({...createRaceExample(),pelotonModel:'cohesion'});
 assert.equal(legacy.finisherCount,30);
 assert.equal(current.finisherCount,30);
 assert.equal(legacy.diagnostics.followingSeconds,0);
 assert.ok(current.diagnostics.followingSeconds>10000);
 assert.notDeepEqual(
   current.classification.map(c=>c.finishTimeS),
   legacy.classification.map(c=>c.finishTimeS));
});
test('R-10: Teamtaktik wirkt auch mit Peloton-Temporegelung physikalisch',()=>{
 const protect=simulateRace(createRaceExample({homeStrategy:'kapitaen_schuetzen'}));
 const offensive=simulateRace(createRaceExample({homeStrategy:'offensiv'}));
 const a=protect.classification.find(c=>c.id==='F01');
 const b=offensive.classification.find(c=>c.id==='F01');
 assert.ok(a&&b&&Math.abs(a.finishTimeS-b.finishTimeS)>.1);
 assert.ok(offensive.events.some(e=>e.type==='attack'&&e.teamId==='T1'));
});
test('R-10: auch ein 60-Fahrer-Feld beendet ein vollständiges Rennen',()=>{
 const x=createRaceExample({profile:'flach'});
 const extra=x.riders.map(r=>({...r,
   id:'X'+r.id,name:'Zusatz '+r.id,
   criticalPowerW:r.criticalPowerW-7}));
 x.riders.push(...extra);
 const r=simulateRace(x);
 assert.equal(r.finisherCount,60);
 assert.equal(r.classification.length,60);
 assert.ok(r.durationS>0&&r.classification.at(-1).gapS>=0);
});
