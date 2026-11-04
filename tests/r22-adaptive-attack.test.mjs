import test from 'node:test';
import assert from 'node:assert/strict';
import {decideAdaptiveAttack,ADAPTIVE_ATTACK}
  from '../src/engine/race/adaptive-attack.ts';
const o={enabled:true,strategy:'offensiv',role:'kapitaen',
  timeS:250,remainingM:80000,speedMps:11.2,
  gradeFraction:.00,aggression:.75,currentIntent:'windschatten',
  reserveFraction:.85,ageSinceLastAttackS:1e8,
  ageSinceAnyGroupAttackS:200,groupSize:75,
  rankInGroup:3,distanceFromGroupFrontM:12,
  gapToRaceFrontM:12,relativeCp:1.07,
  isBestEligibleInGroup:true,leadingBreakaway:false};
test('Keine 18-/88-Prozent-Sperren: Angriff im frühen Feld und unmittelbar vor dem Ziel',()=>{
  assert.equal(decideAdaptiveAttack(o),true);
  assert.equal(decideAdaptiveAttack({...o,remainingM:1200,timeS:18000}),true,
    'Flach-Konter 1,2 km vor Ziel physisch möglich');
  assert.equal(decideAdaptiveAttack({...o,remainingM:200}),false,
    'bei zu wenig realer Fahrzeit kein nutzloser 40-s-Angriff');
  assert.equal(decideAdaptiveAttack({...o,remainingM:10000,timeS:8000,
    gradeFraction:.08,strategy:'kapitaen_schuetzen'}),true,
    'Bergfahrer darf am späten Schlussanstieg angreifen');
});
test('Nicht ständig neue Angriffe bei bestehender Flucht und knapper Reserve',()=>{
  for(const override of [
    {enabled:false},{strategy:'sprint'},{role:'helfer'},
    {timeS:100},{ageSinceLastAttackS:350},
    {ageSinceAnyGroupAttackS:40},{reserveFraction:.15},
    {groupSize:1,rankInGroup:1},{rankInGroup:9,groupSize:4},
    {distanceFromGroupFrontM:100},{gapToRaceFrontM:350},
    {relativeCp:.89},{isBestEligibleInGroup:false},
    {gradeFraction:-.05},{currentIntent:'erholung'},
    {aggression:.3},{leadingBreakaway:true},
  ])assert.equal(decideAdaptiveAttack({...o,...override}),false,
    'kein neuer Angriff: '+JSON.stringify(override));
  assert.equal(decideAdaptiveAttack({...o,currentIntent:'angriff',
    ageSinceLastAttackS:20,isBestEligibleInGroup:false,
    groupSize:1,rankInGroup:1,
    reserveFraction:.32}),true,
    'begonnener Angriff darf einen physischen Gruppenausbruch ueberleben');
  assert.equal(decideAdaptiveAttack({...o,currentIntent:'angriff',
    ageSinceLastAttackS:90,groupSize:1,rankInGroup:1}),false);
});
test('Bergfahrer mit geschuetztem Team und steiler Rampe braucht keine offensive Teametikette',()=>{
  assert.equal(decideAdaptiveAttack({...o,strategy:'kapitaen_schuetzen',
    gradeFraction:.085,aggression:.2}),true);
  assert.equal(decideAdaptiveAttack({...o,strategy:'kapitaen_schuetzen',
    gradeFraction:.018,aggression:1}),false);
  assert.equal(decideAdaptiveAttack({...o,leadingBreakaway:true,
    gradeFraction:.07}),true,
    'taktischer Gegenangriff an steiler Rampe bleibt erlaubt');
  assert.equal(ADAPTIVE_ATTACK.continueAttackS,40);
});
