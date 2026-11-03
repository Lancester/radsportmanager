import test from 'node:test';
import assert from 'node:assert/strict';
import {createRaceExample,simulateRace,validateRace,descentSafeSpeedMps}
  from '../src/engine/race/race-simulator.ts';
import {chooseRacePower} from '../src/engine/race/race-tactics.ts';
const near=(a,b,e=1e-6)=>assert.ok(Math.abs(a-b)<=e,`${a} vs ${b}`);
test('R-09: 30 fiktive Fahrer aus fünf Teams fahren volle 50 km bis ins Ziel',()=>{
 const race=createRaceExample();const r=simulateRace(race);
 assert.equal(r.distanceM,50000);
 assert.equal(r.finisherCount,30);
 assert.equal(r.classification.length,30);
 assert.equal(new Set(r.classification.map(x=>x.id)).size,30);
 assert.equal(new Set(r.classification.map(x=>x.teamId)).size,5);
 assert.ok(r.durationS>2000&&r.durationS<18000);
 assert.ok(r.steps>2000);
 for(let i=0;i<r.classification.length;i++){
   const c=r.classification[i];assert.equal(c.rank,i+1);
   assert.equal(c.distanceM,50000);
   assert.ok(c.finishTimeS>0);
   assert.ok(c.peakSpeedKmh>=c.finalSpeedKmh-1e-7);
   assert.ok(c.finalWPrimeJ>=0);
   assert.ok(c.averageCrankPowerW>0);
   if(i)assert.ok(c.finishTimeS>=r.classification[i-1].finishTimeS);
   near(c.gapS,c.finishTimeS-r.classification[0].finishTimeS,1e-6);
   assert.ok(Math.abs(c.energyResidualJ)<0.05,`${c.id}: Restenergie ${c.energyResidualJ}`);
 }
 assert.equal(r.winnerId,r.classification[0].id);
 near(r.classification[0].gapS,0,1e-6);
});
test('R-09: fiktiver Flachkurs ist ebenfalls 50 km mit gültiger Siegerliste',()=>{
 const x=createRaceExample({profile:'flach'});
 const result=simulateRace(x);
 assert.equal(result.finisherCount,30);
 assert.equal(result.distanceM,50000);
 assert.ok(result.classification.every(r=>r.gapS>=0));
});
test('R-09: wiederholter Lauf mit gleichem Seed liefert exakt dasselbe Rennen',()=>{
 const x=createRaceExample();
 assert.deepEqual(simulateRace(x),simulateRace(x));
});
test('R-09: ein anderer Seed ändert die modellierte Tagesform und das Rennen',()=>{
 const a=simulateRace(createRaceExample({seed:2026}));
 const b=simulateRace(createRaceExample({seed:2027}));
 assert.notDeepEqual(a.classification.map(r=>r.finishTimeS),
   b.classification.map(r=>r.finishTimeS));
});
test('R-09: bewusst offensive Teamleitlinie erzeugt echte Attacke-Ereignisse',()=>{
 const x=createRaceExample({homeStrategy:'offensiv'});
 const r=simulateRace(x);
 assert.ok(r.events.some(e=>e.type==='attack'&&e.teamId==='T1'),
   'T1-Kapitän sollte durch seine offensive Leitlinie angreifen');
 assert.ok(r.diagnostics.attacks>0);
});
test('R-09: anderes Teamziel verändert physikalische Zielzeiten',()=>{
 const offensive=simulateRace(createRaceExample({homeStrategy:'offensiv'}));
 const protectedRace=simulateRace(createRaceExample({homeStrategy:'kapitaen_schuetzen'}));
 const a=offensive.classification.find(r=>r.id==='F01');
 const b=protectedRace.classification.find(r=>r.id==='F01');
 assert.ok(a&&b);
 assert.ok(Math.abs(a.finishTimeS-b.finishTimeS)>0.1,
   'Die Teamleitlinie darf nicht nur den angezeigten Text verändern');
});
test('R-09: Rennlog enthält Zielsprints und mindestens eine Kursübergangsmeldung',()=>{
 const r=simulateRace(createRaceExample());
 assert.ok(r.events.some(e=>e.type==='sprint'), 'kein Zielsprint');
 assert.ok(r.events.some(e=>e.type==='segment'), 'kein Streckenübergang');
 assert.ok(r.events.some(e=>e.type==='finish'), 'kein Zielankunftsereignis');
 assert.ok(r.snapshots.length>=5);
 for(const e of r.events){
  assert.ok(e.timeS>=0);
  assert.ok(e.km>=0&&e.km<=50.1);
 }
});
test('R-09: fahrtechnische Abfahrtsgrenze ist niedriger für schwächeren Fahrer',()=>{
 const slow=descentSafeSpeedMps(0.85,0.2);
 const fast=descentSafeSpeedMps(0.85,0.9);
 assert.ok(fast>slow);
});
test('R-09: Fahrtechnik wirkt über wirkliches Bremsen in der Abfahrt',()=>{
 const slow=createRaceExample({profile:'wellig',seed:2026});
 const fast=createRaceExample({profile:'wellig',seed:2026});
 slow.riders[0].descentSkill=0;
 fast.riders[0].descentSkill=1;
 const a=simulateRace(slow).classification.find(r=>r.id==='F01');
 const b=simulateRace(fast).classification.find(r=>r.id==='F01');
 assert.ok(a&&b);
 assert.ok(a.brakeLossJ>b.brakeLossJ,
   'Schlechte Fahrtechnik muss mehr physikalische Bremsarbeit erfordern');
});
test('R-09: W′-Rest und mechanische Arbeit werden nicht erfunden',()=>{
 const r=simulateRace(createRaceExample());
 for(const rider of r.classification){
  const initial=createRaceExample().riders.find(x=>x.id===rider.id).wPrimeJ;
  near(rider.finalWPrimeJ,initial-rider.spentWPrimeJ+rider.recoveredWPrimeJ,0.01);
  assert.ok(rider.driveWorkJ>=0);
  assert.ok(rider.brakeLossJ>=0);
 }
});
test('R-09: Team- und Fahrerreihenfolge sind nicht das Rennergebnis',()=>{
 const a=createRaceExample(),b=createRaceExample();
 b.riders.reverse();b.teams.reverse();
 const left=simulateRace(a),right=simulateRace(b);
 assert.deepEqual(left.classification,right.classification);
});
test('R-09: fehlerhafte Rennstrecken, Zuordnungen und Werte werden abgewiesen',()=>{
 const a=createRaceExample();a.segments[0].gradeFraction=0.9;
 assert.throws(()=>validateRace(a),RangeError);
 const b=createRaceExample();b.riders[0].teamId='Unbekannt';
 assert.throws(()=>simulateRace(b),RangeError);
 const c=createRaceExample();c.riders[0].criticalPowerW=-1;
 assert.throws(()=>validateRace(c),RangeError);
 const d=createRaceExample();d.riders[0].id=d.riders[1].id;
 assert.throws(()=>validateRace(d),RangeError);
 const e=createRaceExample();e.seed=-1;
 assert.throws(()=>validateRace(e),RangeError);
});
test('R-09: Angriffsentscheidung fordert ausschließlich Watt und respektiert leere W′',()=>{
 const observation={
  role:'kapitaen',strategy:'offensiv',
  criticalPowerW:300,aggression:0.7,sprintSkill:0.4,
  progress:0.23,remainingM:30000,
  frontGapM:1,teamCaptainGapM:null,
  deficitToLeaderM:0,reserveFraction:0.9,
 };
 const attack=chooseRacePower(observation);
 assert.equal(attack.intent,'angriff');
 assert.ok(attack.desiredPowerW>300);
 const exhausted=chooseRacePower({...observation,reserveFraction:0.02});
 assert.equal(exhausted.intent,'erholung');
 assert.ok(exhausted.desiredPowerW<300);
});
test('R-09: Rennzeitlimit führt zu explizitem Fehler statt unvollständiger Ergebnisliste',()=>{
 const x=createRaceExample();
 x.maxRaceTimeS=300;
 assert.throws(()=>simulateRace(x),/Zeitlimit/);
});
