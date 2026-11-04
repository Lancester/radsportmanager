import test from 'node:test';
import assert from 'node:assert/strict';
import {contiguousClimbRuns} from '../src/engine/race/climb-runs.ts';
import {isAdaptiveHillyRoute} from '../src/engine/race/hilly-racecraft.ts';
import {decideClimbTempo} from '../src/engine/race/climb-tempo.ts';
import {decideClassicsApproach,decideClassicsRampTempo}
  from '../src/engine/race/classics-racecraft.ts';
import {decideClassicsPunch} from '../src/engine/race/classics-punch.ts';

test('R24: dieselbe Rampe bleibt nach Aufteilung derselbe Anstieg',()=>{
  const one=[{lengthM:2000,gradeFraction:.08},
    {lengthM:1000,gradeFraction:0},{lengthM:900,gradeFraction:.09}];
  const split=[{lengthM:1000,gradeFraction:.08},
    {lengthM:1000,gradeFraction:.08},...one.slice(1)];
  assert.deepEqual(contiguousClimbRuns(one,.065),contiguousClimbRuns(split,.065));
  const make=segments=>({raceLengthM:225000,ascentM:2200,segments});
  assert.equal(isAdaptiveHillyRoute(make(one)),true);
  assert.equal(isAdaptiveHillyRoute(make(split)),true);
  assert.equal(isAdaptiveHillyRoute({...make(split),raceLengthM:225001}),true);
  const single={...make(one),segments:[one[0]]};
  assert.equal(isAdaptiveHillyRoute(single),false);
  assert.equal(isAdaptiveHillyRoute({...single,segments:split.slice(0,2)}),false);
});
test('R24: langer Anstieg bleibt nach Abschnittsaufteilung lang',()=>{
  const segments=[{lengthM:3000,gradeFraction:.08},
    {lengthM:3000,gradeFraction:.08}];
  assert.equal(contiguousClimbRuns(segments,.05)[0].lengthM,6000);
});
test('R24: auf identischer Physik entscheidet nicht nur das Spezialitaetslabel',()=>{
  const o={groupSize:20,distanceFromGroupFrontM:10,frontGapM:3,
    frontSpeedMps:5,referenceSpeedMps:5,referenceAccelerationMps2:0,
    isPacer:false,groupPacerPowerW:300,ownSpeedMps:5,desiredPowerW:245,
    criticalPowerW:388.6,reserveFraction:.7,tacticalIntent:'windschatten',
    riderMassKg:63.8,bikeMassKg:7.7,dragAreaM2:.265,aeroFactor:.7,
    gradeFraction:.08,rollingCoefficient:.004,airDensityKgM3:1.2,
    drivetrainEfficiency:.975,headwindMps:0,crosswindMps:0,
    role:'kapitaen',remainingM:10000,climbLengthM:12000,abilityBased:true};
  assert.equal(decideClimbTempo({...o,specialty:'zeitfahrer'}),
    decideClimbTempo({...o,specialty:'kletterer'}));
  assert.ok(decideClimbTempo({...o,specialty:'zeitfahrer'})!==null);
});
test('R24: nominierte Rampenfahrer koennen auch ohne Klassiker-Label spaet fahren',()=>{
  const o={enabled:true,specialty:'allrounder',role:'kapitaen',
    isDesignatedRider:true,isSelectedGroupPacer:true,
    progress:.98,segmentProgress:.5,gradeFraction:.09,segmentLengthM:1600,
    physicalGroupSize:30,rankInPhysicalGroup:20,gapToGroupFrontM:30,
    gapToRaceFrontM:30,criticalPowerW:380,reserveFraction:.7,
    requestedPowerW:250,intent:'windschatten',abilityBased:true,
    allowLateRamp:true};
  assert.ok(decideClassicsApproach(o)>o.requestedPowerW);
  assert.ok(decideClassicsRampTempo(o)>o.requestedPowerW);
  assert.equal(decideClassicsRampTempo({...o,abilityBased:false}),null);
  assert.equal(decideClassicsRampTempo({...o,allowLateRamp:false}),null);
  const punch={specialty:'allrounder',role:'kapitaen',strategy:'ausgewogen',
    raceLengthM:200000,shortSteepClimbs:5,progress:.98,
    segmentLengthM:1600,segmentProgress:.45,gradeFraction:.088,
    groupSize:26,distanceFromGroupFrontM:14,criticalPowerW:368,
    reserveFraction:.93,lastAttackAgeS:1500,currentIntent:'windschatten',
    designatedRampRider:true,attackRankInGroup:1,gapToActualRaceFrontM:30,
    speedMps:5.2,riderMassKg:71,bikeMassKg:7.7,dragAreaM2:.274,
    airDensityKgM3:1.2,rollingCoefficient:.004,drivetrainEfficiency:.975,
    headwindMps:0,crosswindMps:0,abilityBased:true,allowLateAttacks:true,
    allowAnyRaceLength:true};
  assert.ok(decideClassicsPunch(punch));
  assert.equal(decideClassicsPunch({...punch,abilityBased:false}),null);
});
