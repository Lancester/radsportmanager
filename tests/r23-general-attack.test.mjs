import test from 'node:test';
import assert from 'node:assert/strict';
import {decideGeneralAttackOpportunity,GENERAL_ATTACK}
  from '../src/engine/race/general-attack.ts';
const base={progress:.70,timeS:12000,remainingM:60000,
  gradeFraction:.012,groupSize:50,distanceFromGroupFrontM:18,
  distanceFromRaceFrontM:18,
  dayCpW:380,meanGroupCpW:365,reserveFraction:.8,
  lastAttackAgeS:1900,currentIntent:'windschatten',
  earlyRacingModel:true};
test('Allgemein: nach 88% darf auch ein Bergkapitaen an Schlussanstiegen angreifen',()=>{
  for(const progress of [.88,.92,.96,.992]){
    assert.equal(decideGeneralAttackOpportunity({...base,
      progress,remainingM:1400,gradeFraction:.078}),true);
  }
  assert.equal(decideGeneralAttackOpportunity({...base,
    progress:.997,remainingM:320,gradeFraction:.078}),false,
    'auf den letzten Metern keine generische 40-s-Attacke');
  assert.ok(decideGeneralAttackOpportunity({...base,
    progress:.994,remainingM:1000,gradeFraction:.078,
    currentIntent:'angriff',lastAttackAgeS:10,groupSize:1}));
});
test('Allgemein: spätes Flachrennen nur für fitte vordere Angreifer',()=>{
  const flat={...base,progress:.95,remainingM:9000,
    gradeFraction:0,distanceFromGroupFrontM:4,
    reserveFraction:.92,lastAttackAgeS:2600,
    dayCpW:420,meanGroupCpW:365};
  assert.equal(decideGeneralAttackOpportunity(flat),true);
  for(const change of [
    {reserveFraction:.5},{lastAttackAgeS:1200},
    {distanceFromGroupFrontM:18},{dayCpW:350},
    {remainingM:300},{distanceFromRaceFrontM:180}
  ])assert.equal(decideGeneralAttackOpportunity({...flat,...change}),false);
  assert.equal(decideGeneralAttackOpportunity({...flat,
    gradeFraction:.07,reserveFraction:.5,
    distanceFromGroupFrontM:35,lastAttackAgeS:950}),true,
    'Anstieg hat andere Chancen als geschuetztes Flachfinale');
});
test('Allgemein: vordere Fluchtversuche und Hysterese bleiben moeglich',()=>{
  assert.ok(decideGeneralAttackOpportunity({...base,
    progress:.03,timeS:350,remainingM:180000,
    distanceFromGroupFrontM:120,distanceFromRaceFrontM:130}));
  assert.equal(decideGeneralAttackOpportunity({...base,
    progress:.03,earlyRacingModel:false}),false);
  assert.equal(decideGeneralAttackOpportunity({...base,
    progress:.15}),false);
  assert.equal(decideGeneralAttackOpportunity({...base,
    currentIntent:'angriff',lastAttackAgeS:30,groupSize:1}),true);
  assert.equal(decideGeneralAttackOpportunity({...base,
    currentIntent:'angriff',lastAttackAgeS:70,groupSize:1}),false);
  for(const bad of [{groupSize:0},{reserveFraction:2},
    {timeS:NaN},{remainingM:-1},{dayCpW:0},
    {distanceFromGroupFrontM:-1},{progress:1.5}])
    assert.throws(()=>decideGeneralAttackOpportunity({...base,...bad}),
      RangeError);
});
