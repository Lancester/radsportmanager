import test from 'node:test';
import assert from 'node:assert/strict';
import {createReferenceFixture} from '../src/engine/race/reference-fixtures.ts';
import {applyCpWprimeStep,initialCpState} from '../src/engine/physiology/critical-power.ts';

// Physischer CP/W′-Kontrollfall: gleiche angeforderte Leistung, keine Gruppe,
// Windschatten oder vorgegebene Fahrergebnis-/Siegerentscheidung.
function effort(rider,seconds,initialFraction=1){
  const profile={riderId:rider.id,criticalPowerW:rider.criticalPowerW,
    wPrimeCapacityJ:rider.wPrimeJ,initialWPrimeJ:rider.wPrimeJ*initialFraction};
  let state=initialCpState(profile),workJ=0;
  for(let t=0;t<seconds;t++){
    const step=applyCpWprimeStep(profile,state,590,1);
    state=step.state;workJ+=step.appliedPowerW;
  }
  return {wPerKg:workJ/seconds/(rider.massKg+rider.bikeMassKg),
    limitedSeconds:state.powerLimitedSeconds};
}
test('R24: kurze Anstiege unterscheiden Sprinter nach Reserve; lange nach Dauerleistung',()=>{
  const riders=createReferenceFixture({routeId:'lbl25_liege',seed:2026}).input.riders;
  const get=id=>{const rider=riders.find(r=>r.id===id);assert.ok(rider);return rider;};
  const punchy=get('F009'),other=get('F037'),climber=get('F078');
  assert.equal(punchy.specialty,'sprinter');assert.equal(other.specialty,'sprinter');
  assert.equal(climber.specialty,'kletterer');
  const short=effort(punchy,180),weaker=effort(other,180);
  assert.equal(short.limitedSeconds,0);
  assert.ok(weaker.limitedSeconds>0);
  assert.ok(short.wPerKg>weaker.wPerKg);
  assert.ok(effort(punchy,180,.25).limitedSeconds>0,
    'Vorbelastung muss die kurzfristig mögliche Leistung einschränken');
  assert.ok(effort(climber,600).wPerKg>effort(punchy,600).wPerKg,
    'Die längere Belastung begünstigt im konkreten Beispiel den Kletterer');
});
