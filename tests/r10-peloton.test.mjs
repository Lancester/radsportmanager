import test from 'node:test';
import assert from 'node:assert/strict';
import {decidePackInstruction,pelotonGroups,R10_PACK}
  from '../src/engine/race/peloton.ts';
import {stabilizeRaceDecision} from '../src/engine/race/race-tactics.ts';
import {createRaceExample,simulateRace}
  from '../src/engine/race/race-simulator.ts';

const pack=(changes={})=>({
  frontGapM:12,frontSpeedMps:12,ownSpeedMps:11,
  desiredPowerW:275,criticalPowerW:285,tacticalIntent:'grundtempo',
  reserveFraction:.8,...changes,
});
const near=(a,b,e=1e-8)=>assert.ok(Math.abs(a-b)<=e,`${a} ≠ ${b}`);
test('R10: Windschatten hängt plausibel vom Abstand ab, nie Speed/Position direkt',()=>{
 const close=decidePackInstruction(pack({frontGapM:2}));
 const medium=decidePackInstruction(pack({frontGapM:19}));
 const far=decidePackInstruction(pack({frontGapM:80}));
 assert.ok(close.aeroFactor<medium.aeroFactor);
 assert.ok(medium.aeroFactor<far.aeroFactor);
 near(far.aeroFactor,1);
 assert.ok(!('speedMps' in close)&&!('positionM' in close));
});
test('R10: Rückstand wird mit begrenztem Wattantrag beantwortet',()=>{
 const fast=decidePackInstruction(pack({frontGapM:60,
  frontSpeedMps:12,ownSpeedMps:10}));
 assert.ok(fast.addedPowerW>0);
 assert.ok(fast.addedPowerW<=R10_PACK.maxSupportPlusW);
 assert.equal(fast.reason,'anschluss-suchen');
});
test('R10: auflaufender Hintermann nimmt Leistung statt magisch zu bremsen zurück',()=>{
 const slow=decidePackInstruction(pack({frontGapM:2,
  frontSpeedMps:10,ownSpeedMps:12}));
 assert.ok(slow.addedPowerW<0);
 assert.ok(slow.addedPowerW>=R10_PACK.maxSupportMinusW);
});
test('R10: eine absichtliche Attacke wird nicht in das Gruppentempo gezwungen',()=>{
 const attack=decidePackInstruction(pack({tacticalIntent:'angriff',frontGapM:2}));
 assert.equal(attack.addedPowerW,0);
 near(attack.requestedPowerW,275);
 assert.equal(attack.reason,'freie-attacke');
});
test('R10: erschöpfte Wprime lässt keinen künstlichen Zusatzwattwunsch zu',()=>{
 const low=decidePackInstruction(pack({reserveFraction:0.01,frontGapM:45}));
 assert.ok(low.addedPowerW<=0);
});
test('R10: außerhalb der definierten Anschlussreichweite kein Zug',()=>{
 const far=decidePackInstruction(pack({frontGapM:500}));
 assert.equal(far.addedPowerW,0);
 near(far.aeroFactor,1);
});
test('R10: Abstandsgruppen hängen nicht von Eingabereihenfolge ab',()=>{
 const a=[{id:'B',positionM:100},{id:'C',positionM:55},
   {id:'A',positionM:105},{id:'D',positionM:0}];
 const describe=x=>pelotonGroups(x).map(g=>g.map(v=>v.id));
 assert.deepEqual(describe(a),describe([...a].reverse()));
 assert.deepEqual(describe(a),[['A','B'],['C'],['D']]);
});
test('R10: ungültige Packparameter werden abgelehnt',()=>{
 assert.throws(()=>decidePackInstruction(pack({frontGapM:-1})),RangeError);
 assert.throws(()=>decidePackInstruction(pack({frontSpeedMps:null})),RangeError);
 assert.throws(()=>pelotonGroups([{id:'A',positionM:0}],0),RangeError);
});
test('R10: Verfolgung hält mindestens 50 Sekunden, außer bei erschöpfter Reserve',()=>{
 const chase={intent:'verfolgung',desiredPowerW:310,reason:'verfolgen'};
 const cruise={intent:'grundtempo',desiredPowerW:245,reason:'rollen'};
 assert.deepEqual(stabilizeRaceDecision({previous:chase,proposal:cruise,
  timeS:40,previousSinceS:10,lastChaseEndS:-1e9,reserveFraction:.6}),chase);
 assert.deepEqual(stabilizeRaceDecision({previous:chase,proposal:cruise,
  timeS:70,previousSinceS:10,lastChaseEndS:-1e9,reserveFraction:.6}),cruise);
 assert.deepEqual(stabilizeRaceDecision({previous:chase,proposal:cruise,
  timeS:40,previousSinceS:10,lastChaseEndS:-1e9,reserveFraction:.03}),cruise);
});
test('R10: direkt nach einer Verfolgung verhindert 90s Pause sofortigen Neustart',()=>{
 const chase={intent:'verfolgung',desiredPowerW:310,reason:'verfolgen'};
 const cruise={intent:'grundtempo',desiredPowerW:245,reason:'rollen'};
 assert.deepEqual(stabilizeRaceDecision({previous:cruise,proposal:chase,
  timeS:150,previousSinceS:120,lastChaseEndS:100,reserveFraction:.6}),cruise);
 assert.deepEqual(stabilizeRaceDecision({previous:cruise,proposal:chase,
  timeS:201,previousSinceS:120,lastChaseEndS:100,reserveFraction:.6}),chase);
});
test('R10: hügeliges 50km-Rennen endet mit 30 klassifizierten Fahrern und Energieerhalt',()=>{
 const result=simulateRace(createRaceExample({profile:'wellig'}));
 assert.equal(result.finisherCount,30);
 assert.equal(result.distanceM,50000);
 assert.equal(result.winnerId,result.classification[0].id);
 assert.ok(result.diagnostics.paceSupportSteps>0);
 assert.ok(result.snapshots.length>=5);
 for(const rider of result.classification){
  assert.ok(rider.finishTimeS>0);
  assert.ok(rider.finalWPrimeJ>=0);
  assert.ok(Math.abs(rider.energyResidualJ)<.05);
 }
});
test('R10: nach der Gruppenreform weniger Chaos als die drei bestätigten R09-Diagnosen',()=>{
 const hill=simulateRace(createRaceExample({profile:'wellig',seed:2026}));
 const flat=simulateRace(createRaceExample({profile:'flach',seed:2026,homeStrategy:'sprint'}));
 assert.ok(hill.diagnostics.maximumGroups<30,
   `zu viele getrennte Fahrer: ${hill.diagnostics.maximumGroups}`);
 assert.ok(hill.diagnostics.chases<319,
   `weiter 319+ Verfolgungswechsel: ${hill.diagnostics.chases}`);
 assert.ok(flat.diagnostics.chases<415,
   `im Flachrennen weiter 415+ Verfolgungswechsel: ${flat.diagnostics.chases}`);
 assert.ok(hill.diagnostics.groupSplits<135,
   'Unverändert unruhige Gruppenmeldungen');
});
test('R10: Gesamtlauf mit gleichem Seed bleibt reproduzierbar',()=>{
 assert.deepEqual(simulateRace(createRaceExample()),
  simulateRace(createRaceExample()));
});
test('R10: vollständige gruppengrößenbezogene Snapshots statt nur der ersten acht',()=>{
 const result=simulateRace(createRaceExample());
 for(const snap of result.snapshots){
  assert.equal(snap.groupSizes.reduce((s,x)=>s+x,0),snap.activeRiders);
  assert.ok(snap.leadingGapM>=0);
 }
});

test('R10: Einholen darf niemals bei noch großer Führungsgruppe-Lücke gemeldet werden',()=>{
 const result=simulateRace(createRaceExample());
 const caught=result.events.filter(e=>e.type==='breakaway-caught');
 const escaped=result.events.filter(e=>e.type==='breakaway');
 assert.equal(caught.length,result.diagnostics.caughtBreakaways);
 assert.equal(escaped.length,result.diagnostics.breakaways);
 for(const e of caught){
  assert.ok(e.gapM<=35,`Falsch gemeldetes Einholen bei ${e.gapM} m`);
 }
 for(const e of escaped){
  assert.ok(e.gapM>=75,`Flucht ohne ausreichenden Vorsprung: ${e.gapM} m`);
 }
});
