import test from 'node:test';
import assert from 'node:assert/strict';
import {advanceMotionStep} from '../src/engine/physics/motion-core.ts';
import {PRO_REFERENCE} from '../src/engine/race/reference-fixtures.ts';
import {initialCpState,applyCpWprimeStep}
  from '../src/engine/physiology/critical-power.ts';

const grade=.078,bikeKg=7.7,eta=.975,rho=1.2,crr=.004,g=9.80665;
const rider=type=>({
  riderMassKg:PRO_REFERENCE[type].massKg,equipmentMassKg:bikeKg,
  dragAreaM2:PRO_REFERENCE[type].dragAreaM2,
  airDensityKgM3:rho,rollingCoefficient:crr,
  drivetrainEfficiency:eta,
});
// Unabhängige stationäre Leistungsbilanz: P_rad=(F_g+F_roll+F_air)*v.
function requiredCrankW(v,r,slope,aero=1){
  const theta=Math.atan(slope),mass=r.riderMassKg+r.equipmentMassKg;
  return (mass*g*(Math.sin(theta)+crr*Math.cos(theta))+
    .5*r.airDensityKgM3*r.dragAreaM2*aero*v*v)*v/eta;
}
function analyticalSteadyKmh(power,r,slope,aero=1){
  let lo=0,hi=50;
  for(let i=0;i<90;i++){
    const mid=(lo+hi)/2;
    if(requiredCrankW(mid,r,slope,aero)>power)hi=mid;
    else lo=mid;
  }
  return (lo+hi)*1.8;
}
function dynamicFinishSeconds(power,r,slope,aero=1,distanceM=13500){
  let v=6,km=0,t=0,maxEnergyResidualJ=0;
  while(km<distanceM){
    const step=advanceMotionStep({speedMps:v,stepSeconds:1,
      crankPowerW:power,rider:r,gradeFraction:slope,aeroFactor:aero});
    maxEnergyResidualJ=Math.max(maxEnergyResidualJ,
      Math.abs(step.energyResidualJ));
    v=step.endSpeedMps;km+=step.distanceM;t++;
    if(t>25000)throw new Error('Dynamischer Bergtest überschreitet Zeitlimit');
  }
  return {timeS:t,finalSpeedKmh:v*3.6,maxEnergyResidualJ};
}

test('R22 Bergphysik: stationäre Formel und gemeinsamer Integrator liefern übereinstimmende Höhenfahrt',()=>{
  for(const kind of ['sprinter','kletterer','gc']){
    const p=PRO_REFERENCE[kind].criticalPowerW,r=rider(kind);
    const expected=analyticalSteadyKmh(p,r,grade);
    const run=dynamicFinishSeconds(p,r,grade);
    assert.ok(Math.abs(run.finalSpeedKmh-expected)<.03,
      kind+' dynamisches vs. analytisches Bergtempo');
    assert.ok(run.maxEnergyResidualJ<.05,kind+' Energiebilanz');
  }
});

test('R22 Bergphysik: Kletterer und GC gewinnen am 13,5-km-Anstieg aus Masse und CP reale Zeit',()=>{
  const sprint=dynamicFinishSeconds(
    PRO_REFERENCE.sprinter.criticalPowerW,rider('sprinter'),grade);
  const climb=dynamicFinishSeconds(
    PRO_REFERENCE.kletterer.criticalPowerW,rider('kletterer'),grade);
  const gc=dynamicFinishSeconds(
    PRO_REFERENCE.gc.criticalPowerW,rider('gc'),grade);
  assert.ok(climb.timeS<sprint.timeS-150,
    'Kletterer muss trotz kleinerer absoluter Watt schneller sein');
  assert.ok(gc.timeS<climb.timeS-100,
    'GC-Profil mit höherer W/kg-Leistung sollte schneller sein');
  // Kein Bonus nach Fahrertyp, nur Masse, Drag und absolute Watt.
  assert.ok(analyticalSteadyKmh(PRO_REFERENCE.sprinter.criticalPowerW,
    rider('sprinter'),grade)>17);
});

test('R22 Bergphysik: Steigung erzeugt die korrekte Gravitationsarbeit, Windschatten ändert sie nicht',()=>{
  const r=rider('kletterer'),v=6,m=r.riderMassKg+r.equipmentMassKg;
  const flat=requiredCrankW(v,r,0);
  const hill=requiredCrankW(v,r,grade);
  assert.ok(hill>flat+280,'Schwerkraft fordert zusätzliche Leistung');
  const exposed=advanceMotionStep({speedMps:v,stepSeconds:1,
    crankPowerW:350,rider:r,gradeFraction:grade,aeroFactor:1});
  const sheltered=advanceMotionStep({speedMps:v,stepSeconds:1,
    crankPowerW:350,rider:r,gradeFraction:grade,aeroFactor:.4});
  assert.ok(Math.abs(exposed.gravityWorkJ/
    exposed.distanceM - sheltered.gravityWorkJ/
    sheltered.distanceM)<1e-7);
  assert.ok(sheltered.aeroLossJ/exposed.aeroLossJ<.45,
    'Windschatten darf nur Luftwiderstand reduzieren');
  assert.ok(sheltered.endSpeedMps>exposed.endSpeedMps,
    'Aero-Einsparung ist reale Mehrgeschwindigkeit, kein Positionsbonus');
  assert.ok(exposed.gravityWorkJ>m*g*.07*exposed.distanceM);
});

test('R22 Bergphysik: keine freie Wprime-Energie oberhalb CP und Wiederaufladung bei Schonung',()=>{
  const p={riderId:'Bergtest',criticalPowerW:350,wPrimeCapacityJ:12000,
    recoveryEfficiency:.22};
  const start=initialCpState(p);
  const harder=applyCpWprimeStep(p,start,410,60/60);
  assert.equal(harder.usedJ,60);
  assert.equal(harder.state.remainingWPrimeJ,11940);
  const easy=applyCpWprimeStep(p,harder.state,200,1);
  assert.equal(easy.usedJ,0);
  assert.ok(easy.state.remainingWPrimeJ>harder.state.remainingWPrimeJ);
  const empty=applyCpWprimeStep(p,{...start,remainingWPrimeJ:0},450,1);
  assert.equal(empty.appliedPowerW,350);
  assert.equal(empty.limited,true);
});
