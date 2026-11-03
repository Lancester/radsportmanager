import test from 'node:test';
import assert from 'node:assert/strict';
import {R05_SAFETY,decideFollowingSafety} from '../src/engine/ai/following-safety.ts';
import {R05_F8_PROFILE,initialCpState,applyCpWprimeStep} from '../src/engine/physiology/critical-power.ts';
import {advanceMotionStep} from '../src/engine/physics/motion-core.ts';
import {createEightRiderR05Example,createEightRiderAgentExample,createEightRiderExample,simulateGroup} from '../src/engine/physics/drafting-group.ts';
const close=(a,b,eps=1e-8)=>assert.ok(Math.abs(a-b)<=eps,`${a} ≠ ${b}`);
const follow=(gap,own=11,leader=11)=>decideFollowingSafety({
 centerGapM:gap,ownSpeedMps:own,leaderSpeedMps:leader,massKg:80,
},R05_SAFETY);
test('Sicherheit: gleiche Geschwindigkeit und 3,4 m Abstand kein Eingriff',()=>{
 const d=follow(3.4);assert.equal(d.powerAllowed,true);close(d.brakeForceN,0);
});
test('Sicherheit: dichter auflaufender Fahrer nimmt Leistung zurück',()=>{
 const d=follow(5,11.5,11);assert.equal(d.powerAllowed,false);
 assert.equal(d.tooLateToGuarantee,false);
});
test('Sicherheit: ernsthafte Gefahr verlangt echte Bremskraft',()=>{
 const d=follow(4.1,11.5,11);
 assert.ok(d.brakeForceN>0);assert.equal(d.powerAllowed,false);
 assert.equal(d.tooLateToGuarantee,false);
});
test('Sicherheit: physikalisch zu kleiner Bremsweg wird offen markiert',()=>{
 const d=follow(3,14,8);assert.equal(d.tooLateToGuarantee,true);
});
test('Sicherheit: ungültige Parameter und Abstände abgelehnt',()=>{
 assert.throws(()=>follow(-1),RangeError);
 assert.throws(()=>decideFollowingSafety({centerGapM:3,ownSpeedMps:11,leaderSpeedMps:10,massKg:80},
 {...R05_SAFETY,maximumDecelerationMps2:0}),RangeError);
});
const rider={riderMassKg:72,equipmentMassKg:8,dragAreaM2:.3,
 rollingCoefficient:.004,airDensityKgM3:1.2,drivetrainEfficiency:.975};
test('Gemeinsamer Physikintegrator: Bremsung reduziert reale Geschwindigkeit',()=>{
 const a=advanceMotionStep({rider,speedMps:11,stepSeconds:.2,crankPowerW:0});
 const b=advanceMotionStep({rider,speedMps:11,stepSeconds:.2,crankPowerW:0,brakeForceN:80});
 assert.ok(b.endSpeedMps<a.endSpeedMps);
 assert.ok(b.brakeLossJ>0);
 assert.ok(Math.abs(b.energyResidualJ)<1e-5,`Restfehler ${b.energyResidualJ}`);
});
test('CP: 260 W bei CP 220 verbrauchen 40 J pro Sekunde Wprime',()=>{
 const p={riderId:'T',criticalPowerW:220,wPrimeCapacityJ:1000,recoveryEfficiency:.5};
 const x=applyCpWprimeStep(p,initialCpState(p),260,1);
 close(x.usedJ,40);close(x.state.remainingWPrimeJ,960);close(x.appliedPowerW,260);
});
test('CP: Wprime-Reserve begrenzt tatsächlich höhere Watt',()=>{
 const p={riderId:'T',criticalPowerW:220,wPrimeCapacityJ:40};
 let state=initialCpState(p);
 let x=applyCpWprimeStep(p,state,300,1);close(x.appliedPowerW,260);
 close(x.state.remainingWPrimeJ,0);assert.equal(x.limited,true);
 x=applyCpWprimeStep(p,x.state,300,1);close(x.appliedPowerW,220);
 close(x.state.remainingWPrimeJ,0);assert.equal(x.limited,true);
});
test('CP: unter CP erholt sich Wprime mit vorläufiger Effizienz',()=>{
 const p={riderId:'T',criticalPowerW:220,wPrimeCapacityJ:1000,
 initialWPrimeJ:100,recoveryEfficiency:.5};
 const x=applyCpWprimeStep(p,initialCpState(p),120,1);
 close(x.recoveredJ,50);close(x.state.remainingWPrimeJ,150);
});
test('CP: Regeneration niemals über Kapazität und keine negativen Reserven',()=>{
 const p={riderId:'T',criticalPowerW:220,wPrimeCapacityJ:1000,
 initialWPrimeJ:995,recoveryEfficiency:.5};
 const x=applyCpWprimeStep(p,initialCpState(p),0,1);
 close(x.state.remainingWPrimeJ,1000);close(x.recoveredJ,5);
});
test('FTP und CP sind eigenständige Parameter; keine stillschweigende Umrechnung',()=>{
 const p={riderId:'T',criticalPowerW:230,ftpW:190,wPrimeCapacityJ:200};
 const x=applyCpWprimeStep(p,initialCpState(p),210,1);
 close(x.usedJ,0);close(x.state.remainingWPrimeJ,200);
});
test('CP: ungültige Profile, Reserve und Zeitschritte abgelehnt',()=>{
 const p={riderId:'T',criticalPowerW:220,wPrimeCapacityJ:1000};
 assert.throws(()=>initialCpState({...p,initialWPrimeJ:2000}),RangeError);
 assert.throws(()=>initialCpState({...p,criticalPowerW:0}),RangeError);
 assert.throws(()=>applyCpWprimeStep(p,initialCpState(p),260,-1),RangeError);
});
test('Altes Achtfahrer-Szenario ohne Optionen bleibt bitgenau identisch',()=>{
 const a=simulateGroup(createEightRiderExample());
 const b=createEightRiderExample();b.physiology=[];delete b.followingSafety;
 assert.deepEqual(a,simulateGroup(b));
});
test('R05: acht Fahrer mit KI, Sicherheit und begrenztem Wprime simulieren',()=>{
 const result=simulateGroup(createEightRiderR05Example());
 assert.equal(result.riders.length,8);close(result.elapsedS,120,1e-8);
 assert.equal(result.steps,600);
 assert.ok(result.riders[7].wPrimeRemainingJ>=0);
 assert.ok(result.riders[7].wPrimeRemainingJ<=R05_F8_PROFILE.wPrimeCapacityJ);
 assert.ok(result.events.some(e=>e.type==='agent-decision'));
});
test('R05: tatsächlicher physikalischer Lauf bleibt energiegeschlossen',()=>{
 const r=simulateGroup(createEightRiderR05Example());
 for(const s of r.riders){
  assert.ok(Math.abs(s.energyResidualJ)<.05,`${s.id}: ${s.energyResidualJ}`);
  close(s.driveWorkJ-s.aeroLossJ-s.rollingLossJ-s.brakeLossJ,
        s.kineticEnergyChangeJ,.05);
 }
});
test('R05: erschöpfte Reserve verhindert endlose Maximalleistung',()=>{
 const p=createEightRiderR05Example();
 p.physiology[0].initialWPrimeJ=0;
 p.physiology[0].recoveryEfficiency=0;
 const r=simulateGroup(p);
 assert.ok(r.riders[7].cpLimitedSeconds>0,'keine Leistungsbegrenzung');
 assert.ok(r.riders[7].wPrimeRemainingJ===0);
 assert.ok(r.events.some(e=>e.type==='cp-limit'));
});
test('R05: Sicherheitsgrenzen werden auch mit KI beachtet',()=>{
 const r=simulateGroup(createEightRiderR05Example());
 const snaps=r.snapshots;
 for(const x of snaps){
  const sorted=[...x.riders].sort((a,b)=>b.positionM-a.positionM);
  for(let i=1;i<sorted.length;i++)
    assert.ok(sorted[i-1].positionM-sorted[i].positionM>=1.8-1e-6);
 }
});
test('R05: Deteminismus identischer Agenten-, Sicherheits- und CP-Eingaben',()=>{
 assert.deepEqual(simulateGroup(createEightRiderR05Example()),
  simulateGroup(createEightRiderR05Example()));
});
test('R05: unbekannte/duplizierte Profile abgewiesen',()=>{
 const a=createEightRiderR05Example();a.physiology[0].riderId='X';
 assert.throws(()=>simulateGroup(a),RangeError);
 const b=createEightRiderR05Example();b.physiology.push({...R05_F8_PROFILE});
 assert.throws(()=>simulateGroup(b),RangeError);
});
test('R05: echte Vordermanngefahr wird nicht mit KI-Temposprung gelöst',()=>{
 const x=createEightRiderR05Example();
 x.riders[7].speedMps=18; // zu schnell bei nur 3,4 m Abstand
 assert.throws(()=>simulateGroup(x),/Bremsweg unzureichend/);
});

test('R05: tatsächliches Gruppenbremsen, keine künstliche Positionsänderung',()=>{
 const x=createEightRiderExample();
 x.riders=x.riders.slice(0,3);x.commands=[];x.durationS=8;
 x.riders[2].positionM=x.riders[1].positionM-4.7;
 x.riders[2].speedMps=11.5;
 x.followingSafety={...R05_SAFETY};
 const r=simulateGroup(x);
 assert.ok(r.riders.some(y=>y.safetyBrakeSeconds>0),'keine tatsächliche Bremsung');
 assert.ok(r.riders.some(y=>y.brakeLossJ>0),'keine Bremsverlustarbeit');
 assert.ok(r.events.some(y=>y.type==='safety'),'kein Sicherheitsereignis');
 assert.ok(r.riders.every(y=>Math.abs(y.energyResidualJ)<.05));
});
