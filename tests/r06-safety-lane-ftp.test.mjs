import test from 'node:test';
import assert from 'node:assert/strict';
import {sweptRectCollision,lateralAdvance,detectPasses} from '../src/engine/physics/lateral-motion.ts';
import {decideFollowingSafety,R05_SAFETY} from '../src/engine/ai/following-safety.ts';
import {accumulateFtpWork,emptyFtpWork,meanCrankPowerW} from '../src/engine/physiology/ftp-work.ts';
import {simulateGroup,createEightRiderExample,createEightRiderPassExample,createEightRiderR05Example} from '../src/engine/physics/drafting-group.ts';
import {advanceMotionStep} from '../src/engine/physics/motion-core.ts';
const near=(a,b,e=1e-7)=>assert.ok(Math.abs(a-b)<e,`${a} ≠ ${b}`);
test('Stetiger Spurwechsel ist pro Schritt geschwindigkeitsbegrenzt',()=>{
  near(lateralAdvance(0,2,0.8,0.2,3),0.16);
  near(lateralAdvance(1.95,2,0.8,0.2,3),2);
  assert.throws(()=>lateralAdvance(0,3.5,0.8,0.2,3),RangeError);
});
test('Längsüberholen mit ausreichend Querabstand ist kollisionsfrei',()=>{
  assert.equal(sweptRectCollision([0,3],[5,3],[2,0],[2,0],1.8,1.25),false);
  const passes=detectPasses(['B','A'],[0,3],[5,3],[2,0],[2,0],1.25);
  assert.deepEqual(passes,[{riderId:'B',passedRiderId:'A'}]);
});
test('Zwei gleichzeitig seitlich und längs kreuzende Fahrer werden erkannt',()=>{
  // Bei u=0,5: x-Abstand 0, Querabstand 0.
  assert.equal(sweptRectCollision([0,4],[8,4],[0,2],[2,0],1.8,1.25),true);
});
test('Überspringen der Unfallstelle innerhalb eines Zeitschritts wird erkannt',()=>{
  assert.equal(sweptRectCollision([0,4],[9,4],[0,0],[0,0],1.8,1.25),true);
});
test('Unterschiedliche Spuren dürfen bei gleicher x-Position nebeneinander fahren',()=>{
  assert.equal(sweptRectCollision([5,5],[5,5],[2,0],[2,0],1.8,1.25),false);
});
test('Die ursprüngliche Achtfahrer-Referenzfahrt ist mit leerer Spursteuerung identisch',()=>{
  const a=createEightRiderExample(),b=createEightRiderExample();
  b.laneCommands=[];
  assert.deepEqual(simulateGroup(a),simulateGroup(b));
});
test('Acht Fahrer können physisch in eine freie Spur wechseln und überholen',()=>{
  const r=simulateGroup(createEightRiderPassExample());
  near(r.elapsedS,65,1e-8);
  assert.ok(r.events.some(e=>e.type==='lane-command'&&e.riderId==='F8'));
  assert.ok(r.events.some(e=>e.type==='lane-complete'&&e.riderId==='F8'));
  assert.ok(r.events.some(e=>e.type==='overtake'&&e.riderId==='F8'&&e.passedRiderId==='F7'),
    JSON.stringify(r.events.filter(e=>e.type==='overtake')));
  near(r.riders[7].lateralPositionM,2);
  assert.ok(r.riders.every(x=>Math.abs(x.energyResidualJ)<0.05));
});
test('Überholen bleibt reproduzierbar',()=>{
  assert.deepEqual(simulateGroup(createEightRiderPassExample()),
    simulateGroup(createEightRiderPassExample()));
});
test('Spurkommando ausserhalb der Straße wird abgewiesen',()=>{
  const x=createEightRiderPassExample();
  x.laneCommands[0].targetLateralPositionM=4;
  assert.throws(()=>simulateGroup(x),RangeError);
});
test('Spurkommando mit unbekannter Fahrer-ID wird abgewiesen',()=>{
  const x=createEightRiderPassExample();
  x.laneCommands[0].riderId='X';
  assert.throws(()=>simulateGroup(x),RangeError);
});
test('Bremsender Vordermann löst bereits bei gleichem Tempo vorausschauend Bremsung aus',()=>{
  const d=decideFollowingSafety({
    centerGapM:10,ownSpeedMps:11,leaderSpeedMps:11,massKg:80,
    leaderDecelerationMps2:4,
  },R05_SAFETY);
  assert.equal(d.tooLateToGuarantee,false);
  assert.equal(d.powerAllowed,false);
  assert.ok(d.brakeForceN>0);
});
test('Ohne gemeldete Führungsbremsung bleibt normale Formation frei',()=>{
  const d=decideFollowingSafety({
    centerGapM:3.4,ownSpeedMps:11,leaderSpeedMps:11,massKg:80,
  },R05_SAFETY);
  assert.equal(d.brakeForceN,0);assert.equal(d.powerAllowed,true);
});
test('Szenario mit explizit bremsendem Vordermann nutzt echten Bremsintegrator',()=>{
  const x=createEightRiderExample(10);
  x.commands=[{timeS:2,riderId:'F7',crankPowerW:0,brakeForceN:320}];
  x.riders[7].positionM-=7; // 10,4 m Mittelpunktabstand
  x.followingSafety={...R05_SAFETY};
  const r=simulateGroup(x);
  assert.ok(r.riders[7].safetyBrakeSeconds>0);
  assert.ok(r.riders[7].brakeLossJ>0);
  assert.ok(r.events.some(e=>e.type==='safety'&&e.riderId==='F8'));
  assert.ok(r.riders.every(v=>Math.abs(v.energyResidualJ)<0.05));
});
test('Ausdrücklich nicht mehr möglicher Bremsweg bleibt ein Fehler',()=>{
  const x=createEightRiderExample(10);
  x.commands=[{timeS:2,riderId:'F7',crankPowerW:0,brakeForceN:400}];
  x.followingSafety={...R05_SAFETY};
  assert.throws(()=>simulateGroup(x),/Bremsweg unzureichend/);
});
test('FTP-Statistik bewertet echte Pedalwatt statt Wattwunsch der KI',()=>{
  let x=emptyFtpWork();
  x=accumulateFtpWork(x,240,210,1);
  x=accumulateFtpWork(x,180,210,1);
  near(x.secondsAboveFtp,1);near(x.workAboveFtpJ,30);
  near(meanCrankPowerW(x),210);
});
test('FTP-Profil bleibt unabhängig von CP beim tatsächlichen R05-Lauf',()=>{
  const r=simulateGroup(createEightRiderR05Example());
  const f8=r.riders[7];
  assert.ok(f8.timeAboveFtpS>0);
  assert.ok(f8.workAboveFtpJ>0);
  assert.ok(f8.averageCrankPowerW>0);
  assert.ok(f8.averageCrankPowerW<255);
});
test('Ungültige FTP-Diagnosen werden abgelehnt',()=>{
  assert.throws(()=>accumulateFtpWork(emptyFtpWork(),200,0,1),RangeError);
  assert.throws(()=>accumulateFtpWork(emptyFtpWork(),200,210,-1),RangeError);
});

test('Bremsung zum völligen Stillstand stoppt vor dem Zeitschrittende mit Energieerhaltung',()=>{
  const rider={riderMassKg:72,equipmentMassKg:8,dragAreaM2:.3,
    rollingCoefficient:.004,airDensityKgM3:1.2,drivetrainEfficiency:.975};
  const result=advanceMotionStep({rider,speedMps:.2,stepSeconds:.2,
    crankPowerW:0,brakeForceN:320});
  near(result.endSpeedMps,0,1e-12);
  assert.ok(result.distanceM>0 && result.distanceM<.02,
    `Bremsweg überschätzt: ${result.distanceM}`);
  assert.ok(Math.abs(result.energyResidualJ)<1e-5,
    `Energie-Differenz: ${result.energyResidualJ}`);
});
