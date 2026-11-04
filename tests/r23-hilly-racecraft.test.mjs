import test from 'node:test';
import assert from 'node:assert/strict';
import {HILLY_RACECRAFT,isSelectiveHillyRoute,
  decideHillyAttackOpportunity,decideHillyRampTempo}
  from '../src/engine/race/hilly-racecraft.ts';

const hilly={raceLengthM:209100,ascentM:2164,segments:[
  {lengthM:1100,gradeFraction:.094},
  {lengthM:800,gradeFraction:.08},
  {lengthM:1200,gradeFraction:.038}]};
const basic={enabled:true,role:'kapitaen',strategy:'offensiv',
  specialty:'klassiker',progress:.96,timeS:14500,
  segmentLengthM:1100,segmentProgress:.45,gradeFraction:.094,
  groupSize:32,gapToGroupFrontM:16,gapToRaceFrontM:100,
  reserveFraction:.8,lastAttackAgeS:2000,
  currentIntent:'windschatten',isGroupNominee:true,
  criticalPowerW:377,requestedPowerW:240};
test('R23: nur hügelige reale Streckengeometrie, nicht Namensheuristik',()=>{
  assert.ok(isSelectiveHillyRoute(hilly));
  assert.equal(isSelectiveHillyRoute({...hilly,ascentM:1100}),false);
  assert.equal(isSelectiveHillyRoute({...hilly,raceLengthM:252000}),false);
  assert.equal(isSelectiveHillyRoute({...hilly,ascentM:3850}),false);
  assert.equal(isSelectiveHillyRoute({...hilly,
    segments:[{lengthM:14000,gradeFraction:.08},
      ...hilly.segments]}),false);
  assert.equal(isSelectiveHillyRoute({...hilly,
    segments:[{lengthM:5000,gradeFraction:.01}]}),false);
});
test('R23: fruehe Flucht oder spaete echte Rampe, nicht Dauerschleife',()=>{
  assert.ok(decideHillyAttackOpportunity({...basic,progress:.055,
    timeS:650,gradeFraction:.002}));
  assert.ok(decideHillyAttackOpportunity(basic));
  assert.equal(decideHillyAttackOpportunity({...basic,
    progress:.55,gradeFraction:.01}),false,
    'ohne echte Rampe kein grundloser Mittelteil-Angriff');
  assert.ok(decideHillyAttackOpportunity({...basic,
    progress:.50,gradeFraction:.05}),
    'auch die mittlere Cavron-Rampe kann Attacken ausloesen');
  assert.equal(decideHillyAttackOpportunity({...basic,
    progress:.055,timeS:650,gradeFraction:.002,
    breakawayEstablished:true}),false,
    'keine neuen Anfangsfluchten bei bereits etablierter Gruppe');
  assert.equal(decideHillyAttackOpportunity({...basic,
    progress:.98,gradeFraction:.015}),false);
  assert.equal(decideHillyAttackOpportunity({...basic,
    progress:.98,segmentProgress:.02}),false);
  assert.equal(decideHillyAttackOpportunity({...basic,
    progress:.02,timeS:100}),false);
  assert.equal(decideHillyAttackOpportunity({...basic,
    lastAttackAgeS:1499}),false);
  assert.ok(decideHillyAttackOpportunity({...basic,
    currentIntent:'angriff',lastAttackAgeS:20,groupSize:1}));
  assert.equal(decideHillyAttackOpportunity({...basic,
    currentIntent:'angriff',lastAttackAgeS:70,groupSize:1}),false);
  for(const change of [
    {enabled:false},{role:'helfer'},{strategy:'sprint'},
    {isGroupNominee:false},{gapToGroupFrontM:116},
    {gapToRaceFrontM:951},{reserveFraction:.10},
    {currentIntent:'erholung'},{currentIntent:'verfolgung'},
  ])assert.equal(decideHillyAttackOpportunity({...basic,...change}),false);
});
test('R23: dauerhaftes Rampentempo ist reale CP-nahe Wattanforderung',()=>{
  const p=decideHillyRampTempo(basic);
  assert.ok(p>basic.requestedPowerW);
  assert.ok(p-basic.requestedPowerW<=
    HILLY_RACECRAFT.tempoMaxAddedPowerW);
  assert.ok(p<=basic.criticalPowerW*HILLY_RACECRAFT.tempoMaxCpFraction);
  for(const specialty of ['klassiker','allrounder','kletterer','zeitfahrer'])
    assert.ok(decideHillyRampTempo({...basic,specialty})!==null);
  assert.ok(decideHillyRampTempo({...basic,progress:.50})!==null,
    'kein festes spaetes Anstiegs-Freigabefenster');
  for(const change of [
    {enabled:false},{specialty:'sprinter'},{isGroupNominee:false},
    {gradeFraction:.02},{segmentProgress:.02},
    {segmentLengthM:12000},{groupSize:2},{role:'helfer'},
    {gapToGroupFrontM:71},{gapToRaceFrontM:651},
    {reserveFraction:.1},{currentIntent:'angriff'},
    {currentIntent:'helferarbeit'},{currentIntent:'erholung'},
    {requestedPowerW:600},
  ])assert.equal(decideHillyRampTempo({...basic,...change}),null);
  for(const invalid of [
    {requestedPowerW:-1},{criticalPowerW:0},{reserveFraction:2},
    {segmentLengthM:0},{gapToRaceFrontM:-1},{progress:1.1},
    {timeS:NaN},{groupSize:3.5}
  ]){
    assert.throws(()=>decideHillyAttackOpportunity({...basic,...invalid}),RangeError);
    assert.throws(()=>decideHillyRampTempo({...basic,...invalid}),RangeError);
  }
});
