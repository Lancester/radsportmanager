import test from 'node:test';
import assert from 'node:assert/strict';
import {decideStablePackRiding} from '../src/engine/race/stable-pack.ts';
import {advanceMotionStep} from '../src/engine/physics/motion-core.ts';
import {formationAeroFactors} from '../src/engine/race/formation-aero.ts';
import {createRaceExample,simulateRace} from '../src/engine/race/race-simulator.ts';
import {createReferenceFixture} from '../src/engine/race/reference-fixtures.ts';
import {finishGroupMetrics} from '../src/engine/race/finish-groups.ts';

const rider={riderMassKg:70,equipmentMassKg:8,dragAreaM2:.28,
  rollingCoefficient:.004,airDensityKgM3:1.2,drivetrainEfficiency:.975};
const observation={groupSize:30,distanceFromGroupFrontM:20,
  frontGapM:3,frontSpeedMps:12,referenceSpeedMps:12,
  referenceAccelerationMps2:0,isPacer:false,groupPacerPowerW:270,
  ownSpeedMps:12,desiredPowerW:325,criticalPowerW:325,
  reserveFraction:.8,tacticalIntent:'windschatten',
  riderMassKg:70,bikeMassKg:8,dragAreaM2:.28,aeroFactor:.5,
  gradeFraction:0,rollingCoefficient:.004,
  airDensityKgM3:1.2,drivetrainEfficiency:.975,headwindMps:0,
  crosswindMps:0};
test('R22 Stabil: geschützter Mitfahrer passt tatsächliche Watt ans Tempo an',()=>{
  const cruising=decideStablePackRiding(observation,false);
  const uncovered=decideStablePackRiding({...observation,aeroFactor:1},false);
  assert.equal(cruising.reason,'follow_group');
  assert.ok(cruising.powerW<uncovered.powerW);
  assert.ok(cruising.powerW<observation.desiredPowerW);
  const closing=decideStablePackRiding({...observation,
    frontGapM:22,frontSpeedMps:12.5},false);
  assert.ok(closing.powerW>cruising.powerW);
  assert.ok(closing.powerW<=observation.criticalPowerW*1.12);
  const acceleration=decideStablePackRiding({...observation,
    referenceAccelerationMps2:.2},false);
  assert.ok(acceleration.powerW>cruising.powerW,
    'Mitfahrer müssen für gemeinsame Beschleunigung zusätzliche Watt anfordern');
});
test('R22 Stabil: echte Attacke frei, Jagdhelfer in Feldmitte begrenzt',()=>{
  const front=decideStablePackRiding({...observation,
    tacticalIntent:'verfolgung',desiredPowerW:420,isPacer:true},true);
  const middle=decideStablePackRiding({...observation,
    tacticalIntent:'verfolgung',desiredPowerW:420},false);
  assert.equal(front.powerW,420);
  assert.ok(middle.powerW<420);
  assert.ok(middle.powerW>decideStablePackRiding(observation,false).powerW);
  assert.equal(decideStablePackRiding({...observation,
    tacticalIntent:'angriff',desiredPowerW:500},false).powerW,500);
  assert.equal(decideStablePackRiding({...observation,
    frontGapM:100,desiredPowerW:260},false).powerW,260);
});
test('R22 Stabil: 30er Windschatten-Fahrt mit 1s-Physikintegrator',()=>{
  const pack=Array.from({length:30},(_,i)=>({
    id:'F'+i,positionM:2000-i*3,speedMps:12,
  }));
  let maxGap=0,maxEnergyError=0,leadPower=270,meanFollowerPower=0,n=0;
  for(let t=0;t<600;t++){
    pack.sort((a,b)=>b.positionM-a.positionM||a.id.localeCompare(b.id));
    const aero=formationAeroFactors(pack);
    const next=pack.map((r,i)=>{
      const front=i>0?pack[i-1]:null;
      const factor=aero.get(r.id);
      const power=front?
        decideStablePackRiding({...observation,
          groupSize:pack.length,frontGapM:front.positionM-r.positionM,
          frontSpeedMps:front.speedMps,ownSpeedMps:r.speedMps,
          aeroFactor:factor},false).powerW:leadPower;
      if(front){meanFollowerPower+=power;n++;}
      const motion=advanceMotionStep({
        speedMps:r.speedMps,stepSeconds:1,crankPowerW:power,
        rider,gradeFraction:0,aeroFactor:factor,
      });
      maxEnergyError=Math.max(maxEnergyError,Math.abs(motion.energyResidualJ));
      return {r,positionM:r.positionM+motion.distanceM,
        speedMps:motion.endSpeedMps};
    });
    for(const v of next){
      v.r.positionM=v.positionM;v.r.speedMps=v.speedMps;
    }
    const gaps=pack.map((r,i)=>i===0?0:
      Math.max(0,pack[i-1].positionM-r.positionM));
    maxGap=Math.max(maxGap,...gaps);
  }
  assert.ok(maxEnergyError<.05,'Mechanische Energiebilanz');
  assert.ok(meanFollowerPower/n<leadPower,'Windschatten spart Pedalwatt');
  assert.ok(maxGap<42,'Bei konstantem Tempo darf das Feld nicht ohne Attacke zerfallen; max. Abstand '+maxGap);
});
test('R22 Stabil: vollständiges 30-Fahrer-Flachrennen ohne Ergebnis-/Physikbonus',()=>{
  const input=createRaceExample({profile:'flach',seed:2026});
  const result=simulateRace({...input,groupRidingModel:'stable-pack'});
  assert.equal(result.finisherCount,30);
  assert.ok(result.classification.every(r=>r.energyResidualJ<.05&&
    r.energyResidualJ>-.05&&r.finalWPrimeJ>=0));
  assert.ok(result.diagnostics.maximumGroups>=1);
});

test('R22 Isolation: 154 verschiedene Profis auf 20 km flach, Angriffe explizit ausgeschaltet',()=>{
  const fixture=createReferenceFixture({routeId:'tdf25_lille',seed:2026});
  const input={...fixture.input,
    title:'R22 154er-Konstantprofil ohne offensive Teamstrategie',
    segments:[{name:'20 km flach ohne Wind',lengthM:20000,
      gradeFraction:0,descentTechnicality:0}],
    teams:fixture.input.teams.map(team=>({...team,strategy:'ausgewogen'})),
    enduranceModel:'off',
    // R24: Auch ausgewogene Kapitaene duerfen situativ attackieren.
    // Der physikalische Kontrolllauf schaltet Attacken daher direkt aus.
    disableAttacks:true,
  };
  const a=simulateRace({...input,groupRidingModel:'coordinated'});
  const b=simulateRace({...input,groupRidingModel:'stable-pack'});
  for(const r of [a,b]){
    assert.equal(r.finisherCount,154);
    assert.ok(r.classification.every(x=>Math.abs(x.energyResidualJ)<.05));
    assert.equal(r.diagnostics.attacks,0,
      'Kontrollprofil darf keine offensiven Angriffe enthalten');
  }
  const aFinish=finishGroupMetrics(a.classification);
  const bFinish=finishGroupMetrics(b.classification);
  assert.equal(bFinish.largestGroupSize,154,
    '154 Fahrer ohne Attacke sollen auf der kontrollierten Flachstrecke geschlossen ankommen');
  console.log('R22-ISOLATION',JSON.stringify({
    lengthKm:20,participants:154,seed:2026,offensiveTeams:0,
    coordinated:{groups:a.diagnostics.maximumGroups,
      largestFinishGroup:aFinish.largestGroupSize,
      largestGroupGapS:aFinish.largestGroupGapToWinnerS},
    stable:{groups:b.diagnostics.maximumGroups,
      largestFinishGroup:bFinish.largestGroupSize,
      largestGroupGapS:bFinish.largestGroupGapToWinnerS},
  }));
});
