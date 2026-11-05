import test from 'node:test';
import assert from 'node:assert/strict';
import {adaptiveAttackDraw,decideAdaptiveAttackOpportunity}
  from '../src/engine/race/adaptive-attack.ts';
import {chooseRacePower} from '../src/engine/race/race-tactics.ts';
import {decideClassicsPunch} from '../src/engine/race/classics-punch.ts';

const attack={timeS:12000,remainingM:1500,progress:.97,gradeFraction:.08,
  role:'kapitaen',strategy:'kapitaen_schuetzen',aggression:.7,
  groupSize:3,gapToGroupFrontM:5,gapToRaceFrontM:5,effectiveCpW:380,
  wPrimeJ:18000,reserveFraction:.7,exposedHoldPowerW:360,
  lastAttackAgeS:3000,currentIntent:'windschatten',
  breakawayEstablished:false,teammateAhead:false,draw:0};
test('Bergfahrstil verändert Angriffswahl ohne physische Fähigkeiten zu ändern',()=>{
  const o={...attack,draw:.004};
  assert.equal(decideAdaptiveAttackOpportunity({...o,climbingAttackPreference:0}),false);
  assert.equal(decideAdaptiveAttackOpportunity({...o,climbingAttackPreference:1}),true);
  assert.equal(decideAdaptiveAttackOpportunity({...o,climbingAttackPreference:1,
    reserveFraction:.1}),false);
  assert.equal(decideAdaptiveAttackOpportunity({...o,gradeFraction:0,
    climbingAttackPreference:0}),decideAdaptiveAttackOpportunity({...o,
    gradeFraction:0,climbingAttackPreference:1}));
  assert.throws(()=>decideAdaptiveAttackOpportunity({...o,climbingAttackPreference:1.1}),RangeError);
});
test('R24: Kapitaen darf nach 88 und 96,5 Prozent auch aus kleiner Gruppe attackieren',()=>{
  assert.equal(decideAdaptiveAttackOpportunity(attack),true);
  const o={role:'kapitaen',strategy:'kapitaen_schuetzen',
    criticalPowerW:400,aggression:.7,sprintSkill:.4,progress:.97,
    remainingM:1500,frontGapM:5,teamCaptainGapM:null,
    deficitToLeaderM:5,reserveFraction:.7,attackOpportunity:true,
    autonomousAttack:true};
  assert.equal(chooseRacePower(o).intent,'angriff');
  assert.notEqual(chooseRacePower({...o,autonomousAttack:false}).intent,'angriff');
  assert.ok(decideAdaptiveAttackOpportunity({...attack,groupSize:2}));
});
test('R24: physische Ueberlegenheit, Energie und laufende Teamarbeit zaehlen',()=>{
  assert.equal(decideAdaptiveAttackOpportunity({...attack,reserveFraction:.1}),false);
  assert.equal(decideAdaptiveAttackOpportunity({...attack,exposedHoldPowerW:600}),false);
  assert.equal(decideAdaptiveAttackOpportunity({...attack,currentIntent:'verfolgung'}),false);
  assert.equal(decideAdaptiveAttackOpportunity({...attack,draw:.99}),false);
  assert.ok(decideAdaptiveAttackOpportunity({...attack,groupSize:1,
    currentIntent:'angriff',lastAttackAgeS:15}));
  assert.equal(decideAdaptiveAttackOpportunity({...attack,groupSize:1,
    gapToRaceFrontM:0}),false);
  assert.ok(decideAdaptiveAttackOpportunity({...attack,groupSize:1,
    gapToRaceFrontM:20}));
});
test('R24: Flachfinale ist nicht durch fixe 85-Prozent-Reserve gesperrt',()=>{
  assert.ok(decideAdaptiveAttackOpportunity({...attack,gradeFraction:0,
    reserveFraction:.6,remainingM:1000}));
  assert.equal(decideAdaptiveAttackOpportunity({...attack,remainingM:200}),false);
  assert.equal(adaptiveAttackDraw(2026,'F1',12000),
    adaptiveAttackDraw(2026,'F1',12000));
  assert.notEqual(adaptiveAttackDraw(2026,'F1',12000),
    adaptiveAttackDraw(2026,'F1',12010));
});
test('R24: Klassiker-Spezialangriff auch nach 96,5 Prozent zulaessig',()=>{
  const o={specialty:'klassiker',role:'kapitaen',strategy:'offensiv',
    raceLengthM:252000,shortSteepClimbs:5,progress:.97,
    segmentLengthM:1100,segmentProgress:.4,gradeFraction:.08,
    groupSize:40,distanceFromGroupFrontM:10,criticalPowerW:380,
    reserveFraction:.8,lastAttackAgeS:1000,currentIntent:'windschatten',
    designatedRampRider:true,attackRankInGroup:1,gapToActualRaceFrontM:10,
    speedMps:5,riderMassKg:70,bikeMassKg:8,dragAreaM2:.28,
    airDensityKgM3:1.2,rollingCoefficient:.004,drivetrainEfficiency:.975,
    headwindMps:0,crosswindMps:0};
  assert.equal(decideClassicsPunch(o),null);
  assert.ok(decideClassicsPunch({...o,allowLateAttacks:true}));
});
