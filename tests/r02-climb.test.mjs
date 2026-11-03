import test from 'node:test';
import assert from 'node:assert/strict';
import { simulateR02, R02_BASE, requiredWheelPowerR02W } from '../src/engine/physics/r02-climb.ts';
import { simulateR01, R01_BASE } from '../src/engine/physics/r01-flat.ts';

function approx(actual, expected, tolerance, title) {
  assert.ok(Number.isFinite(actual), title + ' ist nicht endlich');
  assert.ok(Math.abs(actual - expected) <= tolerance, title + ': ' + actual + ' statt ' + expected);
}

// Unabhängige Referenzen: SciPy optimize.brentq auf der Leistungsbilanz.
test('60 kg Fahrer + 8 kg Material, 300 Pedal-W, 8 km und 7 %', () => {
  const r = simulateR02(R02_BASE);
  approx(r.speedKmh, 19.342500674, 1e-6, 'km/h');
  approx(r.timeSeconds, 1488.94915387, 1e-5, 'Zeit');
  approx(r.aeroPowerW, 27.91919321, 1e-5, 'Luft');
  approx(r.rollingPowerW, 14.30166523, 1e-5, 'Rollen');
  approx(r.gravityPowerW, 250.27914155, 1e-5, 'Schwerkraft');
  approx(r.wheelPowerW, 292.5, 1e-12, 'Radleistung');
});

test('80 kg Fahrer + 8 kg Material, sonst gleiche Eingaben', () => {
  const r = simulateR02({ ...R02_BASE, riderMassKg: 80 });
  approx(r.speedKmh, 15.68298379, 1e-6, 'km/h');
  approx(r.timeSeconds, 1836.38524350, 1e-5, 'Zeit');
  assert.ok(r.timeSeconds > simulateR02(R02_BASE).timeSeconds);
});

test('Höhenmeter und potenzielle Energie geometrisch korrekt', () => {
  const r = simulateR02(R02_BASE);
  const m = R02_BASE.riderMassKg + R02_BASE.equipmentMassKg;
  approx(r.elevationGainM, 558.63302160, 1e-6, 'Höhe');
  approx(r.gravityPowerW * r.timeSeconds, m * 9.81 * r.elevationGainM, 1e-6, 'Energie');
});

test('Leistungsbilanz schließt bei Berg- und Ebenenfahrt', () => {
  for(const x of [R02_BASE,{...R02_BASE,riderMassKg:80},{...R02_BASE,gradeFraction:0}]) {
    const r = simulateR02(x);
    approx(r.aeroPowerW+r.rollingPowerW+r.gravityPowerW, r.wheelPowerW,1e-9,'Bilanz');
    const components=requiredWheelPowerR02W(r.speedMps,x);
    approx(components.totalW,r.wheelPowerW,1e-9,'geprüfte Leistung');
  }
});

test('Steigung 0 liefert identische R-01-Ergebnisse', () => {
  const flat=simulateR01(R01_BASE);
  const slope=simulateR02({ ...R01_BASE, gradeFraction:0 });
  approx(flat.speedKmh,slope.speedKmh,1e-12,'km/h');
  approx(flat.timeSeconds,slope.timeSeconds,1e-12,'Zeit');
  approx(slope.gravityPowerW,0,1e-12,'Steigungsleistung');
});

test('Mehr Steigung ist langsamer und erfordert mehr Schwerkraftleistung pro m/s', () => {
  const a=simulateR02({...R02_BASE,gradeFraction:0.04});
  const b=simulateR02({...R02_BASE,gradeFraction:0.07});
  const c=simulateR02({...R02_BASE,gradeFraction:0.10});
  assert.ok(a.speedKmh>b.speedKmh && b.speedKmh>c.speedKmh);
  const p4=requiredWheelPowerR02W(5,{...R02_BASE,gradeFraction:0.04});
  const p7=requiredWheelPowerR02W(5,{...R02_BASE,gradeFraction:0.07});
  const p10=requiredWheelPowerR02W(5,{...R02_BASE,gradeFraction:0.10});
  assert.ok(p4.gravityPowerW<p7.gravityPowerW && p7.gravityPowerW<p10.gravityPowerW);
});

test('Zwei kg Materialersparnis und geringeres CdA ergeben getrennte Effekte', () => {
  const baseline=simulateR02(R02_BASE);
  const lighter=simulateR02({...R02_BASE,equipmentMassKg:6});
  const aero=simulateR02({...R02_BASE,dragAreaM2:0.25});
  approx(lighter.timeSeconds,1455.86852561,1e-5,'Zeit mit 2 kg weniger');
  approx(aero.timeSeconds,1468.57187286,1e-5,'Zeit mit CdA 0,25');
  assert.ok(lighter.timeSeconds<baseline.timeSeconds);
  assert.ok(aero.timeSeconds<baseline.timeSeconds);
});

test('Größere Pedalleistung und besserer Wirkungsgrad verbessern Zeit', () => {
  const a=simulateR02(R02_BASE);
  assert.ok(simulateR02({...R02_BASE,crankPowerW:350}).timeSeconds<a.timeSeconds);
  assert.ok(simulateR02({...R02_BASE,drivetrainEfficiency:1}).timeSeconds<a.timeSeconds);
});

test('Reproduzierbar und Grenzwerte geprüft', () => {
  assert.deepEqual(simulateR02(R02_BASE),simulateR02({...R02_BASE}));
  for(const x of [{gradeFraction:-0.1},{gradeFraction:NaN},{drivetrainEfficiency:1.01},{distanceM:0},{riderMassKg:-1}]) {
    assert.throws(()=>simulateR02({...R02_BASE,...x}),RangeError);
  }
});
