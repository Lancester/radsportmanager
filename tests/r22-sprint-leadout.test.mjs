import test from 'node:test';
import assert from 'node:assert/strict';
import {decideSprintLeadoutPace} from '../src/engine/race/sprint-leadout.ts';
const base={
  enabled:true,currentIntent:'helferarbeit',
  remainingM:5000,distanceAheadOfSprinterM:76,
  sprinterSpeedMps:13,helperSpeedMps:14,
  currentPowerW:370,criticalPowerW:330,
  riderMassKg:70,bikeMassKg:7.7,dragAreaM2:.275,
  aeroFactor:.82,gradeFraction:0,
  rollingCoefficient:.004,airDensityKgM3:1.2,
  drivetrainEfficiency:.975,headwindMps:0,crosswindMps:0,
};
test('R-22 Führungshelfer fährt kontrolliert statt 70 m vor Sprinter weg',()=>{
  const r=decideSprintLeadoutPace(base);
  assert.ok(r);
  assert.equal(r.reason,'stay_with_sprinter');
  assert.ok(r.powerW>=0);
  assert.ok(r.powerW<base.currentPowerW);
});
test('R-22 gute vorhandene Führungsstellung ohne Übertempo bleibt erhalten',()=>{
  const x={...base,distanceAheadOfSprinterM:8,
    helperSpeedMps:13,currentPowerW:155};
  assert.equal(decideSprintLeadoutPace(x),null);
});
test('R-22 keine physisch unwirksame Eingriffe in andere Missionen',()=>{
  for(const x of [
    {...base,enabled:false},
    {...base,remainingM:11000},
    {...base,remainingM:150},
    {...base,distanceAheadOfSprinterM:-2},
    {...base,distanceAheadOfSprinterM:250},
    {...base,currentIntent:'verfolgung'},
    {...base,currentIntent:'sprint'},
    {...base,currentIntent:'erholung'},
  ])assert.equal(decideSprintLeadoutPace(x),null);
});
test('R-22 Gegenwind und reale Last bestimmen Begrenzung; keine Bonusenergie',()=>{
  const wind=decideSprintLeadoutPace({...base,headwindMps:8});
  const calm=decideSprintLeadoutPace(base);
  assert.ok(wind&&calm);
  assert.ok(wind.powerW>=calm.powerW,
    'höhere reale Luftlast darf mehr Haltewatt verlangen');
  assert.ok(wind.powerW<=base.criticalPowerW*1.04);
});
