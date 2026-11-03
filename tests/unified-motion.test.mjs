import test from 'node:test';
import assert from 'node:assert/strict';
import { simulateMotionRoute } from '../src/engine/physics/motion-core.ts';
import { simulateDynamicRoute, DYNAMIC_ROUTE_EXAMPLE } from '../src/engine/physics/dynamic-route.ts';
import { simulateCornerRoute, CORNER_EXAMPLE } from '../src/engine/physics/corner-route.ts';

const near = (a,b,tol=1e-8) => assert.ok(Number.isFinite(a) && Math.abs(a-b)<=tol, `${a} statt ${b}`);
test('Beide öffentlichen Adapter verwenden denselben Rechenkern', () => {
  const d = structuredClone(DYNAMIC_ROUTE_EXAMPLE);
  const a = simulateDynamicRoute(d), b = simulateMotionRoute(d);
  near(a.totalTimeS,b.totalTimeS);
  near(a.finalSpeedMps,b.finalSpeedMps);
  assert.equal(a.reports.length,b.reports.length);
  for(let i=0;i<a.reports.length;i++){
    near(a.reports[i].endSpeedMps,b.reports[i].endSpeedMps);
    near(a.reports[i].energyResidualJ,b.reports[i].energyResidualJ);
  }
  assert.deepEqual(simulateCornerRoute(structuredClone(CORNER_EXAMPLE)),
    simulateMotionRoute(structuredClone(CORNER_EXAMPLE)));
});

test('Ein gemeinsamer Lauf: Anstieg, Abfahrt, explizite Bremskraft, Kurvenvorschau und Trägheit', () => {
  const x=structuredClone(CORNER_EXAMPLE);
  x.rider.wheelInertiaKgM2=0.3;
  x.sections=[
    {lengthM:300,gradeFraction:0.04,crankPowerW:260},
    {lengthM:300,gradeFraction:-0.04,crankPowerW:0,
      cornerAtEnd:{radiusM:18,gripCoefficient:0.6,safetyFactor:0.7}},
    {lengthM:100,gradeFraction:0,crankPowerW:0,brakeForceN:10},
    {lengthM:200,gradeFraction:0,crankPowerW:260},
  ];
  x.initialSpeedMps=12;
  const r=simulateMotionRoute(x);
  near(r.totalDistanceM,900);
  assert.ok(r.corners[0].entrySpeedMps<=r.corners[0].limitMps+0.15);
  assert.ok(r.reports[2].brakeLossJ>0);
  assert.ok(r.reports[0].gravityWorkJ>0 && r.reports[1].gravityWorkJ<0);
  assert.ok(r.effectiveMassKg > 80);
  for(const p of r.reports) assert.ok(Math.abs(p.energyResidualJ)<0.05);
});

test('Mehr Laufradträgheit erhöht effektive Masse, nicht statische Schwerkraftarbeit', () => {
  const a=structuredClone(DYNAMIC_ROUTE_EXAMPLE);
  const b=structuredClone(a);
  a.sections=[{lengthM:100,gradeFraction:0.08,crankPowerW:250}];
  b.sections=structuredClone(a.sections);
  a.initialSpeedMps=9;b.initialSpeedMps=9;
  b.rider.wheelInertiaKgM2=0.5;
  const x=simulateMotionRoute(a),y=simulateMotionRoute(b);
  near(x.reports[0].gravityWorkJ,y.reports[0].gravityWorkJ,1e-6);
  near(x.totalElevationChangeM,y.totalElevationChangeM);
  assert.ok(y.effectiveMassKg > x.effectiveMassKg);
});

test('Ungültige manuelle Bremskraft wird vom gemeinsamen Kern verworfen',()=>{
  const x=structuredClone(DYNAMIC_ROUTE_EXAMPLE);
  x.sections=[{lengthM:100,gradeFraction:0,crankPowerW:250,brakeForceN:-2}];
  assert.throws(()=>simulateMotionRoute(x),RangeError);
});
