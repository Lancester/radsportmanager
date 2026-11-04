import test from 'node:test';
import assert from 'node:assert/strict';
import {chooseRacePower} from '../src/engine/race/race-tactics.ts';
import {formationAeroFactors}
  from '../src/engine/race/formation-aero.ts';
import {decideGroupRiding} from '../src/engine/race/group-riding.ts';

test('R22: bewusste Attacke muss physische Mehrleistung anfordern',()=>{
  const base={role:'kapitaen',strategy:'offensiv',criticalPowerW:350,
    aggression:.5,sprintSkill:.55,progress:.25,remainingM:100000,
    frontGapM:4,teamCaptainGapM:null,deficitToLeaderM:4,
    reserveFraction:.8,coordinatedTeamPace:true};
  const normal=chooseRacePower({...base,attackOpportunity:false});
  const attack=chooseRacePower({...base,attackOpportunity:true});
  assert.notEqual(normal.intent,'angriff');
  assert.equal(attack.intent,'angriff');
  assert.ok(attack.desiredPowerW>base.criticalPowerW);
  assert.ok(attack.desiredPowerW>normal.desiredPowerW);
});

test('R22: physisch modellierter Windschatten senkt Leistung zum gleichen konstanten Feldtempo',()=>{
  const p=formationAeroFactors(Array.from({length:16},(_,i)=>({
    id:'F'+i,positionM:1000-i*2,
  })));
  const front=p.get('F0'),middle=p.get('F8');
  assert.equal(front,1);
  assert.ok(middle<front);
  const o={groupSize:16,distanceFromGroupFrontM:16,
    frontGapM:2,frontSpeedMps:12,referenceSpeedMps:12,
    referenceAccelerationMps2:0,isPacer:false,groupPacerPowerW:300,
    ownSpeedMps:12,desiredPowerW:320,criticalPowerW:350,
    reserveFraction:.8,tacticalIntent:'windschatten',
    riderMassKg:70,bikeMassKg:8,dragAreaM2:.28,
    aeroFactor:middle,gradeFraction:0,rollingCoefficient:.004,
    airDensityKgM3:1.2,drivetrainEfficiency:.975,
    headwindMps:0,crosswindMps:0};
  const sheltered=decideGroupRiding(o);
  const exposed=decideGroupRiding({...o,aeroFactor:1});
  assert.equal(sheltered.reason,'follow_group');
  assert.ok(sheltered.powerW<exposed.powerW);
  assert.ok(exposed.powerW-sheltered.powerW>30);
});
