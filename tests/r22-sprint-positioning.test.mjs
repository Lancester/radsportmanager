import test from 'node:test';
import assert from 'node:assert/strict';
import {decideSprintPosition,SPRINT_POSITION}
  from '../src/engine/race/sprint-positioning.ts';

const base={
  sprintFriendlyRace:true,strategy:'sprint',specialty:'sprinter',
  isTargetSprinter:true,isEscort:false,progress:.22,
  groupSize:154,rankInGroup:150,distanceFromGroupFrontM:65,
  targetRankInGroup:150,distanceToTargetM:0,frontGapM:1.2,
  currentIntent:'windschatten',reserveFraction:.97,
  criticalPowerW:407,followPowerW:218,
};

test('R-22 Frühpositionierung verlangt reale Zusatzwatt, keine neue Position',()=>{
  const r=decideSprintPosition(base);
  assert.ok(r,'weit hinten liegender Sprinter erhält Aufrückauftrag');
  assert.equal(r.reason,'position_sprinter');
  assert.ok(r.powerW>base.followPowerW);
  assert.ok(r.powerW<=base.criticalPowerW*SPRINT_POSITION.sprinterCapCpFraction);
  assert.ok(r.powerW<base.criticalPowerW,
    'im geschützten Feld keine ständige CP-Überschreitung erforderlich');
});

test('R-22 Front / geringe Reserve / schwierige Rennprofile lassen andere Modelle in Ruhe',()=>{
  for(const obs of [
    {...base,sprintFriendlyRace:false},
    {...base,groupSize:30},
    {...base,rankInGroup:25},
    {...base,progress:.89},
    {...base,frontGapM:55},
    {...base,reserveFraction:.18},
    {...base,strategy:'offensiv'},
    {...base,currentIntent:'angriff'},
    {...base,currentIntent:'verfolgung'},
    {...base,currentIntent:'sprint'},
    {...base,currentIntent:'erholung'},
    {...base,isTargetSprinter:false},
    {...base,specialty:'allrounder'},
  ])assert.equal(decideSprintPosition(obs),null);
});

test('R-22 maximal ein naher Begleiter darf mit echter eigener Leistung aufrücken',()=>{
  const escort={...base,isTargetSprinter:false,isEscort:true,
    specialty:'allrounder',criticalPowerW:335,followPowerW:180,
    rankInGroup:151,distanceToTargetM:-3};
  const r=decideSprintPosition(escort);
  assert.ok(r);
  assert.equal(r.reason,'escort_sprinter');
  assert.ok(r.powerW>escort.followPowerW);
  assert.ok(r.powerW<=escort.criticalPowerW);
  assert.equal(decideSprintPosition({...escort,distanceToTargetM:-36}),null);
  assert.equal(decideSprintPosition({...escort,rankInGroup:90,
    targetRankInGroup:95}),null);
  assert.equal(decideSprintPosition({...escort,isEscort:false}),null);
});

test('R-22 keine Wattrettung bei hoher Gruppenleistung oder fehlender Reserve',()=>{
  assert.equal(decideSprintPosition({...base,followPowerW:450}),null);
  assert.equal(decideSprintPosition({...base,followPowerW:425}),null);
  assert.equal(decideSprintPosition({...base,reserveFraction:.25}),null);
});
