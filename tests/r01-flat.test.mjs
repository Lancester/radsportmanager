import test from 'node:test';
import assert from 'node:assert/strict';
import { simulateR01, R01_BASE, powerAtWheelW } from '../src/engine/physics/r01-flat.ts';

function closeTo(actual, expected, tolerance, label) {
  assert.ok(Math.abs(actual - expected) <= tolerance, label + ': ' + actual + ' vs. ' + expected);
}

// Unabhängige Referenzlösung: Python/SciPy mit Brent-Verfahren, nicht derselbe Solver.
test('250 W am Pedal bei 97,5 % Wirkungsgrad', () => {
  const r = simulateR01(R01_BASE);
  closeTo(r.speedKmh, 37.938287902966515, 1e-7, 'Tempo km/h');
  closeTo(r.timeSeconds, 1897.818904852849, 1e-5, 'Zeit s');
  closeTo(r.aeroPowerW, 210.6678129486132, 1e-6, 'Luftleistung W');
  closeTo(r.rollingPowerW, 33.0821870513868, 1e-6, 'Rollleistung W');
  closeTo(r.wheelPowerW, r.aeroPowerW + r.rollingPowerW, 1e-9, 'Bilanz W');
});

test('300 W ergeben mehr Geschwindigkeit und weniger Zeit', () => {
  const a = simulateR01(R01_BASE);
  const b = simulateR01({ ...R01_BASE, crankPowerW: 300 });
  closeTo(b.speedKmh, 40.54502266766331, 1e-7, 'Tempo km/h');
  closeTo(b.timeSeconds, 1775.8036686812268, 1e-5, 'Zeit s');
  assert.ok(b.speedKmh > a.speedKmh);
  assert.ok(b.timeSeconds < a.timeSeconds);
});

test('Luftleistungsbedarf kubisch, Rollleistungsbedarf linear', () => {
  const a = powerAtWheelW(8, R01_BASE);
  const b = powerAtWheelW(12, R01_BASE);
  closeTo(b.aeroPowerW / a.aeroPowerW, (12 / 8) ** 3, 1e-12, 'Aero');
  closeTo(b.rollingPowerW / a.rollingPowerW, 12 / 8, 1e-12, 'Roll');
});

test('Weniger CdA hilft, mehr Masse schadet auf der Ebene', () => {
  const a = simulateR01(R01_BASE);
  assert.ok(simulateR01({ ...R01_BASE, dragAreaM2: 0.25 }).speedKmh > a.speedKmh);
  assert.ok(simulateR01({ ...R01_BASE, riderMassKg: 82 }).speedKmh < a.speedKmh);
});

test('Idealisiertes Rad ohne Antriebsverluste ist schneller', () => {
  const a = simulateR01(R01_BASE);
  const b = simulateR01({ ...R01_BASE, drivetrainEfficiency: 1 });
  closeTo(b.speedKmh, 38.29166728754236, 1e-7, 'Tempo ohne Verluste');
  assert.ok(b.speedKmh > a.speedKmh);
});

test('Wiederholte Rechnung ist deterministisch', () => {
  assert.deepEqual(simulateR01(R01_BASE), simulateR01({ ...R01_BASE }));
});

test('Ungültige Eingaben führen zu Fehlern', () => {
  assert.throws(() => simulateR01({ ...R01_BASE, drivetrainEfficiency: 1.05 }), RangeError);
  assert.throws(() => simulateR01({ ...R01_BASE, rollingCoefficient: -0.01 }), RangeError);
  assert.throws(() => simulateR01({ ...R01_BASE, crankPowerW: 0 }), RangeError);
  assert.throws(() => simulateR01({ ...R01_BASE, airDensityKgM3: NaN }), RangeError);
});
