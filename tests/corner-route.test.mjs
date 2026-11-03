import test from 'node:test';
import assert from 'node:assert/strict';
import { simulateCornerRoute, cornerSpeedLimitMps, effectiveAccelerationMassKg, CORNER_EXAMPLE } from '../src/engine/physics/corner-route.ts';
const clone=()=>structuredClone(CORNER_EXAMPLE);
const near=(a,b,tol=1e-5)=>assert.ok(Math.abs(a-b)<=tol,`${a} != ${b}`);
test('Kurvengrenze aus Radius und Haftung',()=>{
  near(cornerSpeedLimitMps({radiusM:15,gripCoefficient:0.6,safetyFactor:0.7}),Math.sqrt(15*0.6*9.81*0.7));
});
test('wirksame Trägheit addiert Radrotation, nicht Gewichtskraft',()=>{
  const r=clone().rider;
  near(effectiveAccelerationMassKg(r),80+0.14/0.34**2);
});
test('vor Kurve bremsen, Grenze einhalten, ohne Tempoteleportation',()=>{
  const r=simulateCornerRoute(clone());
  assert.equal(r.corners.length,1);
  const c=r.corners[0];
  assert.ok(c.firstBrakeDistanceM!==null&&c.firstBrakeDistanceM<c.distanceM-1);
  assert.ok(c.entrySpeedMps<=c.limitMps+0.15);
  near(r.reports[0].endSpeedMps,r.reports[1].startSpeedMps,1e-8);
  assert.ok(r.reports[0].brakeLossJ>0);
  assert.ok(r.reports[1].endSpeedMps>r.reports[1].startSpeedMps);
});
test('engerer Radius fordert kleineres Einfahrtstempo',()=>{
  const a=clone(),b=clone();
  a.sections[0].cornerAtEnd.radiusM=15;
  b.sections[0].cornerAtEnd.radiusM=25;
  const x=simulateCornerRoute(a),y=simulateCornerRoute(b);
  assert.ok(x.corners[0].limitMps<y.corners[0].limitMps);
  assert.ok(x.corners[0].entrySpeedMps<y.corners[0].entrySpeedMps);
});
test('nasse Fahrbahn erzwingt niedrigeres Zieltempo',()=>{
  const a=clone(),b=clone();
  b.sections[0].cornerAtEnd.gripCoefficient=0.4;
  const x=simulateCornerRoute(a),y=simulateCornerRoute(b);
  assert.ok(y.corners[0].entrySpeedMps<x.corners[0].entrySpeedMps);
});
test('mehr Drehträgheit vermindert Beschleunigung bei identischer Masse',()=>{
  const a=clone(),b=clone();
  a.sections=[{lengthM:50,gradeFraction:0,crankPowerW:250}];
  b.sections=structuredClone(a.sections);
  a.initialSpeedMps=3;b.initialSpeedMps=3;
  a.rider.wheelInertiaKgM2=0;
  b.rider.wheelInertiaKgM2=0.5;
  const x=simulateCornerRoute(a),y=simulateCornerRoute(b);
  assert.ok(y.finalSpeedMps<x.finalSpeedMps);
});
test('Drehträgheit verändert nicht die stationäre Anfahrgeschwindigkeit',()=>{
  const a=clone(),b=clone();
  a.sections=[{lengthM:100,gradeFraction:0,crankPowerW:250}];
  b.sections=structuredClone(a.sections);
  const p=37.938287902966515/3.6;
  a.initialSpeedMps=p;b.initialSpeedMps=p;
  a.rider.wheelInertiaKgM2=0;b.rider.wheelInertiaKgM2=0.5;
  near(simulateCornerRoute(a).finalSpeedMps,p,1e-4);
  near(simulateCornerRoute(b).finalSpeedMps,p,1e-4);
});
test('Energiegleichgewicht auf jedem Abschnitt',()=>{
  for(const p of simulateCornerRoute(clone()).reports) assert.ok(Math.abs(p.energyResidualJ)<0.05,String(p.energyResidualJ));
});
test('gleiche Eingaben liefern gleiche Simulation',()=>{
  assert.deepEqual(simulateCornerRoute(clone()),simulateCornerRoute(clone()));
});
test('fehlerhafte Eingaben werden abgewiesen',()=>{
  for(const fn of [
    x=>x.sections[0].cornerAtEnd.radiusM=0,
    x=>x.sections[0].cornerAtEnd.gripCoefficient=0,
    x=>x.sections[0].cornerAtEnd.safetyFactor=1.5,
    x=>x.rider.wheelRadiusM=0,
    x=>x.rider.wheelInertiaKgM2=-1,
    x=>x.stepSeconds=5,
    x=>x.sections[0].gradeFraction=7,
  ]){const x=clone();fn(x);assert.throws(()=>simulateCornerRoute(x),RangeError)}
});
test('nicht erreichbare Kurve führt zu Fehler statt magischer Verzögerung',()=>{
  const x=clone();
  x.sections=[{lengthM:4,gradeFraction:0,crankPowerW:0,
    cornerAtEnd:{radiusM:5,gripCoefficient:0.4,safetyFactor:0.7}}];
  x.initialSpeedMps=20;
  assert.throws(()=>simulateCornerRoute(x),/unzulässigem Tempo/);
});
test('Blick voraus berücksichtigt Kurve am Ende eines späteren Abschnitts',()=>{
  const x=clone();
  x.sections=[
    {lengthM:200,gradeFraction:0,crankPowerW:250},
    {lengthM:50,gradeFraction:0,crankPowerW:250,
      cornerAtEnd:{radiusM:15,gripCoefficient:0.6,safetyFactor:0.7}},
    {lengthM:300,gradeFraction:0,crankPowerW:250},
  ];
  const r=simulateCornerRoute(x);
  assert.ok(r.corners[0].entrySpeedMps<=r.corners[0].limitMps+0.15);
  assert.ok(r.corners[0].firstBrakeDistanceM<250);
  assert.ok(r.corners[0].firstBrakeDistanceM!==null);
});
test('kleinere Schrittweite ändert Zeit und Kurventempo nur wenig',()=>{
  const a=simulateCornerRoute({...clone(),stepSeconds:0.1});
  const b=simulateCornerRoute({...clone(),stepSeconds:0.25});
  assert.ok(Math.abs(a.totalTimeS-b.totalTimeS)<0.2);
  assert.ok(Math.abs(a.corners[0].entrySpeedMps-b.corners[0].entrySpeedMps)<0.12);
});
test('hintere Kurve nach erster Kurve kann erneut gebremst werden',()=>{
  const x=clone();
  x.sections[1].cornerAtEnd={radiusM:20,gripCoefficient:0.6,safetyFactor:0.7};
  const r=simulateCornerRoute(x);
  assert.equal(r.corners.length,2);
  for(const c of r.corners) assert.ok(c.entrySpeedMps<=c.limitMps+0.15);
});
