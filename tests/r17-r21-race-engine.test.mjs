import test from 'node:test';
import assert from 'node:assert/strict';
import {initialEnduranceState,advanceEndurance,endurancePowerAvailability}
  from '../src/engine/race/endurance.ts';
import {createLongRaceFixture}
  from '../src/engine/race/long-race-fixtures.ts';
import {createRaceExample,simulateRace,validateRace}
  from '../src/engine/race/race-simulator.ts';
import {decideIntelligentCrew} from '../src/engine/race/race-team-ai.ts';
import {formationAeroFactors}
  from '../src/engine/race/formation-aero.ts';
import {auditRace} from '../src/engine/race/race-audit.ts';

test('R19: Verpflegungsbilanz ist nachvollziehbar, ohne negative Speicher',()=>{
  let fed=initialEnduranceState(),fasted=initialEnduranceState();
  for(let i=0;i<5*3600;i++){
    fed=advanceEndurance({state:fed,appliedPowerW:300,
      referenceCpW:300,dt:1,carbsGPerHour:100}).state;
    fasted=advanceEndurance({state:fasted,appliedPowerW:300,
      referenceCpW:300,dt:1,carbsGPerHour:0}).state;
  }
  assert.ok(fed.carbohydrateKcal>fasted.carbohydrateKcal);
  assert.ok(fed.carbohydrateKcal<=1200&&fasted.carbohydrateKcal>=0);
  assert.ok(endurancePowerAvailability(fed)>
    endurancePowerAvailability(fasted));
  assert.ok(endurancePowerAvailability(fasted)>=0.6);
  assert.equal(fasted.carbohydrateIngestedKcal,0);
});
test('R17: gleicher frontnaher Helfer bleibt bei Schichtwechsel verfügbar',()=>{
  const teams=[{id:'T',strategy:'kapitaen_schuetzen'}];
  const riders=[
    {id:'C',teamId:'T',role:'kapitaen',positionM:1000,
      speedMps:12,criticalPowerW:310,reserveFraction:.8,aggression:.5},
    ...[0,1,2].map(i=>({id:'H'+i,teamId:'T',role:'helfer',
      positionM:1003-i*3,speedMps:12,criticalPowerW:280,
      reserveFraction:.85,aggression:.5})),
  ];
  const input={timeS:100,progress:.5,remainingM:10000,teams,riders};
  const initial=decideIntelligentCrew(input);
  const lead=initial.leaderByTeam.get('T');
  assert.ok(lead);
  const retained=decideIntelligentCrew({...input,timeS:110,
    previousLeaders:initial.leaderByTeam});
  assert.deepEqual(retained.leaderByTeam.get('T'),lead);
  const moved=decideIntelligentCrew({...input,timeS:120,
    riders:riders.map(r=>r.id===lead.riderId?
      {...r,positionM:970}:r),
    previousLeaders:retained.leaderByTeam});
  assert.notEqual(moved.leaderByTeam.get('T')?.riderId,lead.riderId);
});
test('R20: physische Zusatzfaktoren für Untergrund und Wind werden validiert',()=>{
  const x=createRaceExample({profile:'flach'});
  x.segments[0].headwindMps=5;
  x.segments[0].crosswindMps=4;
  x.segments[0].rollingCoefficient=.009;
  validateRace(x);
  assert.throws(()=>{
    x.segments[0].rollingCoefficient=.07;validateRace(x);
  },RangeError);
});
test('R21: 22×7 und vier 150–250-km-Eintagesprofile',()=>{
  for(const profile of ['flach','huegelig','klassiker','berg']){
    const x=createLongRaceFixture({profile});
    validateRace(x);
    assert.equal(x.teams.length,22);
    assert.equal(x.riders.length,154);
    assert.ok(x.segments.reduce((n,s)=>n+s.lengthM,0)>=150000);
  }
  assert.equal(formationAeroFactors(Array.from({length:154},(_,i)=>
    ({id:'F'+i,positionM:i*0.2}))).size,154);
});
test('R19/R20: 50-km-Referenz bleibt mechanisch bilanziert',()=>{
  const x=createRaceExample({profile:'flach',seed:2026});
  const base=simulateRace(x);
  assert.equal(auditRace(base).finishers,30);
  assert.ok(base.classification.every(r=>
    r.carbohydrateRemainingKcal>=0&&
    r.endurancePowerAvailability<=1&&
    Math.abs(r.energyResidualJ)<.05));
  const off=simulateRace({...x,enduranceModel:'off'});
  assert.equal(off.finisherCount,30);
  assert.ok(off.classification.every(r=>r.endurancePowerAvailability===1));
});
test('R21: Feld >60 Fahrer kann ohne Fehler ein Einzelrennen fahren',()=>{
  const x=createLongRaceFixture({
    teams:10,rosterSize:7,distanceKm:12,profile:'flach',seed:303,
  });
  const r=simulateRace(x),audit=auditRace(r);
  assert.equal(audit.finishers,70);
  assert.equal(r.diagnostics.participants,70);
  assert.equal(r.distanceM,12000);
  assert.ok(r.classification.every(s=>
    Math.abs(s.energyResidualJ)<.05&&s.finalWPrimeJ>=0));
});

test('R18: steigende Fluchtgeschwindigkeit erhöht die gemessene Prognose',()=>{
  const teams=[{id:'A',strategy:'sprint'},{id:'B',strategy:'offensiv'}];
  const riders=[
    {id:'B-C',teamId:'B',role:'kapitaen',positionM:1200,
      speedMps:15,criticalPowerW:300,reserveFraction:.8,aggression:.5},
    ...Array.from({length:5},(_,i)=>({
      id:'A-'+i,teamId:'A',role:i===0?'sprinter':'helfer',
      positionM:980-i*2,speedMps:13,criticalPowerW:300,
      reserveFraction:.8,aggression:.5,
    })),
  ];
  const input={teams,riders,timeS:800,progress:.5,remainingM:10000};
  const fast=decideIntelligentCrew(input).situation;
  const slow=decideIntelligentCrew({...input,
    riders:riders.map(r=>r.id==='B-C'?{...r,speedMps:11}:r)}).situation;
  assert.ok(fast.leadingBreakaway&&slow.leadingBreakaway);
  assert.ok(fast.projectedGapM>slow.projectedGapM);
  assert.ok(fast.gapM===slow.gapM);
});
test('R20: Wind/rauer Belag ändern mechanisch berechnete Zielzeiten',()=>{
  const base=createRaceExample({profile:'flach',seed:818});
  const calm=simulateRace(base);
  const wind={...base,segments:base.segments.map(s=>({...s,
    headwindMps:7,crosswindMps:4,rollingCoefficient:.008}))};
  const severe=simulateRace(wind);
  assert.equal(severe.finisherCount,30);
  assert.ok(severe.durationS>calm.durationS,
    'Wind+hoher Rollwiderstand muss im Physikkern Zeit kosten');
  assert.ok(severe.classification.every(r=>
    r.energyResidualJ<.05&&r.energyResidualJ>-.05));
  const calmCopy=simulateRace(base);
  assert.deepEqual(calm.classification,calmCopy.classification);
});
test('R21: vollständiges 154-Fahrer-Einzelrennen über 10 km',()=>{
  const x=createLongRaceFixture({profile:'flach',teams:22,
    rosterSize:7,distanceKm:10,seed:777});
  const out=simulateRace(x);
  assert.equal(out.finisherCount,154);
  assert.equal(out.diagnostics.teams,22);
  assert.ok(out.classification.every(r=>r.finalWPrimeJ>=0&&
    Math.abs(r.energyResidualJ)<.05));
});
