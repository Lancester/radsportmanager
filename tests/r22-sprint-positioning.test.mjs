import test from 'node:test';
import assert from 'node:assert/strict';
import {decideSprintPosition,SPRINT_POSITION}
  from '../src/engine/race/sprint-positioning.ts';

const base={
  sprintFriendlyRace:true,strategy:'sprint',specialty:'sprinter',
  isTargetSprinter:true,isEscort:false,progress:.24,
  groupSize:154,rankInGroup:150,distanceFromGroupFrontM:65,
  targetRankInGroup:150,distanceToTargetM:0,frontGapM:1.2,
  currentIntent:'windschatten',reserveFraction:.97,
  criticalPowerW:407,followPowerW:218,
};
test('R-22: direkt nach dem Start KEIN Aufrücken an die Spitze',()=>{
  assert.equal(decideSprintPosition({...base,progress:.03}),null);
  const r=decideSprintPosition(base);
  assert.ok(r);
  assert.equal(r.reason,'protect_peloton_contact');
  assert.ok(r.powerW>base.followPowerW);
  assert.ok(r.powerW<=base.criticalPowerW*SPRINT_POSITION.safetyCpFraction);
  assert.equal(decideSprintPosition({...base,rankInGroup:120}),null,
    'Vor dem letzten Viertel reicht die hintere Mittelfeldposition aus');
  assert.equal(decideSprintPosition({...base,progress:.70,
    rankInGroup:100}),null);
});
test('R-22: ab 75 % selbst mit realen Watt ins vordere Viertel fahren',()=>{
  const r=decideSprintPosition({...base,progress:.76,rankInGroup:100});
  assert.ok(r);
  assert.equal(r.reason,'advance_for_sprint');
  assert.ok(r.powerW>base.followPowerW);
  assert.ok(r.powerW<=base.criticalPowerW*SPRINT_POSITION.advanceCpFraction);
  assert.equal(decideSprintPosition({...base,progress:.76,
    rankInGroup:25}),null);
});
test('R-22: erst auf letzten ca. 6 % der Strecke gezielter Sprintzugplatz',()=>{
  const r=decideSprintPosition({...base,progress:.955,rankInGroup:27});
  assert.ok(r);
  assert.equal(r.reason,'leadout_position');
  assert.ok(r.powerW<=base.criticalPowerW*SPRINT_POSITION.leadoutCpFraction);
  assert.equal(decideSprintPosition({...base,progress:.955,
    rankInGroup:10}),null);
  assert.equal(decideSprintPosition({...base,progress:.996}),null);
});
test('R-22: reale Helfer bleiben bei Sprinter; keine phantomhaften Extra-Watt',()=>{
  const escort={...base,progress:.80,isTargetSprinter:false,isEscort:true,
    specialty:'allrounder',criticalPowerW:335,followPowerW:180,
    rankInGroup:110,targetRankInGroup:100,distanceToTargetM:-3};
  const r=decideSprintPosition(escort);
  assert.ok(r);
  assert.equal(r.reason,'escort_sprinter');
  assert.ok(r.powerW>escort.followPowerW);
  assert.ok(r.powerW<=escort.criticalPowerW);
  assert.equal(decideSprintPosition({...escort,progress:.5}),null);
  assert.equal(decideSprintPosition({...escort,distanceToTargetM:-40}),null);
  assert.equal(decideSprintPosition({...escort,isEscort:false}),null);
  assert.equal(decideSprintPosition({...escort,rankInGroup:70}),null);
});
test('R-22: Profil, Reserve und laufende Taktik haben Vorrang',()=>{
  for(const x of [
    {...base,sprintFriendlyRace:false},
    {...base,groupSize:30},
    {...base,frontGapM:55},
    {...base,reserveFraction:.18},
    {...base,strategy:'offensiv'},
    {...base,currentIntent:'angriff'},
    {...base,currentIntent:'verfolgung'},
    {...base,currentIntent:'helferarbeit'},
    {...base,currentIntent:'sprint'},
    {...base,currentIntent:'erholung'},
    {...base,isTargetSprinter:false},
    {...base,specialty:'allrounder'},
  ])assert.equal(decideSprintPosition(x),null);
  assert.equal(decideSprintPosition({...base,progress:.80,
    followPowerW:450}),null);
});
