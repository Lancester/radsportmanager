import test from 'node:test';
import assert from 'node:assert/strict';
import {
  R03_PAIR_EXAMPLE, R03_DRAFT, aeroFactorsForPair,
  requiredCrankPowerAtSpeedW, simulateTwoRiders,
} from '../src/engine/physics/drafting-pair.ts';
import { advanceMotionStep } from '../src/engine/physics/motion-core.ts';
const clone=()=>structuredClone(R03_PAIR_EXAMPLE);
const near=(actual,expected,tolerance=1e-7)=>assert.ok(
  Number.isFinite(actual) && Math.abs(actual-expected)<=tolerance,
  `${actual} statt ${expected}`,
);

test('R-03: Führender im Wind, Hintermann mit kleinerem Aero-Faktor',()=>{
  const f=aeroFactorsForPair([10,7.7],[0,0]);
  near(f[0],1);
  near(f[1],0.7348872050610618);
  assert.ok(f[1]>0 && f[1]<1);
});

test('R-03: Windschatten nimmt mit zunehmendem Abstand kontinuierlich ab',()=>{
  const nearF=aeroFactorsForPair([2.3,0],[0,0])[1];
  const midF=aeroFactorsForPair([5.3,0],[0,0])[1];
  const farF=aeroFactorsForPair([20.3,0],[0,0])[1];
  assert.ok(nearF<midF && midF<farF);
  assert.ok(farF>0.999);
});

test('R-03: seitliche Abweichung hebt Schutz weitgehend auf',()=>{
  const aligned=aeroFactorsForPair([2.3,0],[0,0])[1];
  const offset=aeroFactorsForPair([2.3,0],[0,3])[1];
  assert.ok(offset>aligned);
  assert.ok(offset>0.999);
});

test('R-03: exakt gleiche Fahrgeschwindigkeit – nur Luftleistung sinkt',()=>{
  const rider=clone().riders[0].physical;
  const factor=aeroFactorsForPair([2.3,0],[0,0])[1];
  const a=requiredCrankPowerAtSpeedW(rider,11,1);
  const b=requiredCrankPowerAtSpeedW(rider,11,factor);
  near(a.crankPowerW,281.1396923076923,1e-7);
  near(b.crankPowerW,215.99536060361967,1e-7);
  near(a.rollingPowerW,b.rollingPowerW,1e-9);
  near(b.aeroPowerW/a.aeroPowerW,factor,1e-12);
  assert.ok((a.crankPowerW-b.crankPowerW)/a.crankPowerW<0.35);
});

test('R-03: Führungsposition tauschen dreht den Vorteil um',()=>{
  const a=aeroFactorsForPair([10,7.7],[0,0]);
  const b=aeroFactorsForPair([7.7,10],[0,0]);
  near(a[0],1);near(b[1],1);
  near(a[1],b[0]);
});

test('R-03: beide Fahrer werden auf derselben Zeitachse fortgeschrieben',()=>{
  const r=simulateTwoRiders(clone());
  near(r.elapsedS,12,1e-9);
  assert.equal(r.steps,60);
  assert.ok(r.snapshots.length>=12);
  assert.equal(r.snapshots[0].timeS,0);
  near(r.snapshots.at(-1).timeS,12,1e-9);
  assert.ok(r.riders[0].positionM>10 && r.riders[1].positionM>7.7);
  assert.ok(r.riders[0].shelteredTimeS<0.001);
  near(r.riders[1].shelteredTimeS,12,1e-8);
});

test('R-03: alle mechanischen Energiebilanzen der Zweierfahrt stimmen',()=>{
  const r=simulateTwoRiders(clone());
  for(const rider of r.riders){
    assert.ok(Math.abs(rider.energyResidualJ)<0.001,String(rider.energyResidualJ));
    near(rider.driveWorkJ-rider.aeroLossJ-rider.rollingLossJ,
      rider.kineticEnergyChangeJ,0.001);
  }
});

test('R-03: geringere Hintermannleistung führt zur wachsenden Lücke',()=>{
  const r=simulateTwoRiders(clone());
  assert.ok(r.snapshots.at(-1).centerGapM>r.snapshots[0].centerGapM);
  assert.ok(r.snapshots.at(-1).aeroFactors[1]>r.snapshots[0].aeroFactors[1]);
});

test('R-03: Führungswechsel entsteht durch natürliche Überholung auf anderer Spur',()=>{
  const x=clone();
  x.riders[0].crankPowerW=70;
  x.riders[1].crankPowerW=330;
  x.riders[1].positionM=5;
  x.riders[1].lateralPositionM=2;
  x.durationS=16;
  const r=simulateTwoRiders(x);
  assert.equal(r.events.filter(e=>e.eventType==='lead-change').length,1);
  assert.equal(r.events.find(e=>e.eventType==='lead-change').riderId,'B');
  assert.ok(r.riders[1].positionM>r.riders[0].positionM);
});

test('R-03: überholen in gleicher Spur ergibt erklärten Kollisionsfehler',()=>{
  const x=clone();x.riders[1].crankPowerW=240;x.durationS=20;
  assert.throws(()=>simulateTwoRiders(x),/Kollision/);
});

test('R-03: szenarischer Befehl verändert Leistung erst zum angegebenen Zeitpunkt',()=>{
  const x=clone();x.durationS=5;
  x.commands=[{timeS:2.5,riderId:'B',crankPowerW:150}];
  const r=simulateTwoRiders(x);
  assert.equal(r.events.filter(e=>e.eventType==='command').length,1);
  near(r.events[0].timeS,2.5);
  near(r.riders[1].crankPowerW,150);
  near(r.elapsedS,5);
});

test('R-03: kleinerer Zeitschritt führt zu ähnlichen Endpositionen',()=>{
  const x=clone();const y=clone();x.stepSeconds=0.1;y.stepSeconds=0.2;
  const a=simulateTwoRiders(x),b=simulateTwoRiders(y);
  for(let i=0;i<2;i++){
    near(a.riders[i].positionM,b.riders[i].positionM,0.03);
    near(a.riders[i].speedMps,b.riders[i].speedMps,0.01);
  }
});

test('R-03: identische Eingabe liefert identisches Ereignisprotokoll',()=>{
  assert.deepEqual(simulateTwoRiders(clone()),simulateTwoRiders(clone()));
});

test('R-03: ungültige Eingaben und überlappende Positionen werden abgelehnt',()=>{
  for(const edit of [
    x=>{x.durationS=-1},
    x=>{x.riders[1].positionM=9},
    x=>{x.riders[1].id='A'},
    x=>{x.stepSeconds=0},
    x=>{x.riders[1].physical.airDensityKgM3=NaN},
    x=>{x.parameters={...R03_DRAFT,maximumAeroReduction:1}},
    x=>{x.commands=[{timeS:1,riderId:'Z',crankPowerW:200}]},
  ]){
    const x=clone();edit(x);
    assert.throws(()=>simulateTwoRiders(x),RangeError);
  }
});

test('Gemeinsamer Physikintegrator: Faktor beeinflusst Luftarbeit, nicht Rollarbeit',()=>{
  const r=clone().riders[0].physical;
  const a=advanceMotionStep({speedMps:11,stepSeconds:0.2,crankPowerW:270,rider:r,aeroFactor:1});
  const b=advanceMotionStep({speedMps:11,stepSeconds:0.2,crankPowerW:270,rider:r,aeroFactor:0.7});
  assert.ok(b.aeroLossJ<a.aeroLossJ);
  assert.ok(b.endSpeedMps>a.endSpeedMps);
  near(b.energyResidualJ,0,1e-7);
});
