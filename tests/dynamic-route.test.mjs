import test from 'node:test';
import assert from 'node:assert/strict';
import { simulateDynamicRoute, DYNAMIC_ROUTE_EXAMPLE } from '../src/engine/physics/dynamic-route.ts';

const clone = () => structuredClone(DYNAMIC_ROUTE_EXAMPLE);
const approx = (a, b, tol = 1e-7) => assert.ok(
  Number.isFinite(a) && Math.abs(a - b) <= tol,
  a + ' statt ' + b + ' (Toleranz ' + tol + ')'
);

test('alle fünf Streckenabschnitte ohne Weg-/Zeitlücke abgeschlossen', () => {
  const r = simulateDynamicRoute(clone());
  approx(r.totalDistanceM, 4000);
  assert.equal(r.reports.length, 5);
  let t = 0, s = 0;
  for (const [i, p] of r.reports.entries()) {
    approx(p.startDistanceM, s);
    approx(p.startTimeS, t);
    approx(p.endDistanceM - p.startDistanceM, DYNAMIC_ROUTE_EXAMPLE.sections[i].lengthM);
    if (i > 0) approx(p.startSpeedMps, r.reports[i-1].endSpeedMps, 1e-10);
    assert.ok(p.endTimeS > p.startTimeS);
    t = p.endTimeS;
    s = p.endDistanceM;
  }
  approx(r.totalTimeS, t);
  assert.ok(r.finalSpeedMps > 0 && r.peakSpeedMps > 0);
});

test('bergauf bei 300 W wird Tempo erst allmählich kleiner, bergab ohne Watt größer', () => {
  const r = simulateDynamicRoute(clone());
  const up = r.reports[1];
  const down = r.reports[2];
  assert.ok(up.startSpeedMps > up.endSpeedMps);
  assert.ok(down.endSpeedMps > down.startSpeedMps);
  approx(up.endSpeedMps, down.startSpeedMps);
  assert.ok(down.driveWorkJ === 0);
  assert.ok(down.gravityWorkJ < 0);
});

test('gezieltes Bremsen verlangsamt und verbraucht kinetische Energie', () => {
  const a = simulateDynamicRoute(clone());
  const b = clone();
  b.sections[3].brakeForceN = 0;
  const coasting = simulateDynamicRoute(b);
  assert.ok(a.reports[3].endSpeedMps < coasting.reports[3].endSpeedMps);
  assert.ok(a.reports[3].brakeLossJ > 0);
  approx(coasting.reports[3].brakeLossJ, 0);
  assert.ok(a.reports[3].kineticEnergyChangeJ < 0);
});

test('Leistungs-/Arbeits- und Höhenbilanz gilt für sämtliche Abschnitte', () => {
  const r = simulateDynamicRoute(clone());
  let sum = 0;
  for (const p of r.reports) {
    assert.ok(Math.abs(p.energyResidualJ) < 0.02,
      'Energierest ' + p.label + ': ' + p.energyResidualJ + ' J');
    sum += p.elevationChangeM;
  }
  approx(r.totalElevationChangeM, sum, 1e-9);
  approx(r.totalElevationChangeM, 0, 1e-8);
});

test('stationäre Ebene bleibt bei Gleichgewichtsgeschwindigkeit stationär', () => {
  const x = clone();
  x.sections = [{ lengthM: 1000, gradeFraction: 0, crankPowerW: 250 }];
  x.initialSpeedMps = 37.938287902966515 / 3.6;
  const r = simulateDynamicRoute(x);
  approx(r.finalSpeedMps, x.initialSpeedMps, 1e-6);
  approx(r.totalTimeS, 1000 / x.initialSpeedMps, 1e-4);
});

test('stationärer Anstieg stimmt mit R-02 überein', () => {
  const x = clone();
  x.rider = { ...x.rider, riderMassKg: 60 };
  x.sections = [{ lengthM: 1000, gradeFraction: 0.07, crankPowerW: 300 }];
  x.initialSpeedMps = 19.342500674 / 3.6;
  const r = simulateDynamicRoute(x);
  approx(r.finalSpeedMps, x.initialSpeedMps, 1e-6);
  approx(r.totalTimeS, 1000 / x.initialSpeedMps, 1e-4);
});

test('Losfahren aus dem Stand funktioniert mit begrenzter Antriebskraft', () => {
  const x = clone();
  x.initialSpeedMps = 0;
  x.sections = [{ lengthM: 50, gradeFraction: 0, crankPowerW: 250 }];
  const r = simulateDynamicRoute(x);
  assert.ok(r.finalSpeedMps > 0 && Number.isFinite(r.totalTimeS));
  assert.ok(r.totalTimeS > 0 && r.totalTimeS < 40);
});

test('kein Bergaufstart ohne ausreichende Antriebskraft', () => {
  const x = clone();
  x.initialSpeedMps = 0;
  x.sections = [{ lengthM: 20, gradeFraction: 0.07, crankPowerW: 0 }];
  assert.throws(() => simulateDynamicRoute(x), /Stillstand/);
});

test('Zeitschritt 0,1 / 0,25 / 0,5 s liefert eng beieinanderliegende Resultate', () => {
  const base = clone();
  const times = [0.1, 0.25, 0.5].map(stepSeconds =>
    simulateDynamicRoute({ ...base, stepSeconds }).totalTimeS
  );
  assert.ok(Math.max(...times) - Math.min(...times) < 0.15, JSON.stringify(times));
});

test('Segmentteilung ändert Resultat nicht wesentlich', () => {
  const a = clone();
  a.sections = [{ lengthM: 1000, gradeFraction: 0, crankPowerW: 250 }];
  const b = clone();
  b.sections = [
    { lengthM: 500, gradeFraction: 0, crankPowerW: 250 },
    { lengthM: 500, gradeFraction: 0, crankPowerW: 250 },
  ];
  const x = simulateDynamicRoute(a), y = simulateDynamicRoute(b);
  approx(x.finalSpeedMps, y.finalSpeedMps, 2e-6);
  approx(x.totalTimeS, y.totalTimeS, 0.002);
});

test('Eingaben werden geprüft', () => {
  for (const edit of [
    x => {x.sections = [];},
    x => {x.sections[0].lengthM = -1;},
    x => {x.sections[0].gradeFraction = 7;},
    x => {x.sections[0].gradeFraction = NaN;},
    x => {x.sections[0].crankPowerW = -1;},
    x => {x.sections[0].brakeForceN = -1;},
    x => {x.rider.drivetrainEfficiency = 1.1;},
    x => {x.initialSpeedMps = -1;},
    x => {x.stepSeconds = 0;},
    x => {x.maxSteps = 1;},
  ]) {
    const x = clone(); edit(x);
    assert.throws(() => simulateDynamicRoute(x), RangeError);
  }
});

test('gleiche Szenariodaten liefern exakt gleiche Daten', () => {
  assert.deepEqual(simulateDynamicRoute(clone()), simulateDynamicRoute(clone()));
});

test('auf Ebene sinkt Geschwindigkeit beim Rollen ohne Treten', () => {
  const x = clone();
  x.initialSpeedMps = 12;
  x.sections = [{ lengthM: 100, gradeFraction: 0, crankPowerW: 0 }];
  const r = simulateDynamicRoute(x);
  assert.ok(r.finalSpeedMps < 12);
  assert.ok(r.reports[0].kineticEnergyChangeJ < 0);
  approx(r.reports[0].driveWorkJ, 0);
});

test('bergab rollt Fahrer auch aus dem Stillstand ohne Pedalleistung los', () => {
  const x = clone();
  x.initialSpeedMps = 0;
  x.sections = [{ lengthM: 100, gradeFraction: -0.07, crankPowerW: 0 }];
  const r = simulateDynamicRoute(x);
  assert.ok(r.finalSpeedMps > 0);
  assert.ok(r.reports[0].gravityWorkJ < 0);
  approx(r.reports[0].driveWorkJ, 0);
});

test('Demo-Referenz: Geschwindigkeitswerte und Fahrzeit sind reproduzierbar', () => {
  const r = simulateDynamicRoute(clone());
  approx(r.totalTimeS, 470.87133243875746, 0.02);
  approx(r.reports[1].endSpeedMps * 3.6, 16.998506130475032, 0.04);
  approx(r.reports[2].endSpeedMps * 3.6, 60.680742595369665, 0.04);
  approx(r.reports[3].endSpeedMps * 3.6, 22.547632049771668, 0.04);
});
