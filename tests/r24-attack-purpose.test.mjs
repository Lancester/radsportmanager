import test from 'node:test';
import assert from 'node:assert/strict';
import {selectAttackPurpose,estimateBridge} from '../src/engine/race/attack-purpose.ts';
const base={remainingM:160000,progress:.1,gradeFraction:0,role:'helfer',
  protectedFavorite:false,inMainGroup:true,gapToRaceFrontM:20,
  gapToNextGroupM:null,breakawayEstablished:false,teammateAhead:false,groupSize:140,winnerFinished:false,bridgeReachable:true,assignedTeamDuty:false};
test('Frühe Flucht ist Ziel; geschützter Bergfavorit spart Energie',()=>{
  assert.equal(selectAttackPurpose(base),'flucht_gruenden');
  assert.equal(selectAttackPurpose({...base,role:'kapitaen',protectedFavorite:true}),null);
  assert.equal(selectAttackPurpose({...base,breakawayEstablished:true}),null);
  assert.equal(selectAttackPurpose({...base,teammateAhead:true}),null);
  assert.equal(selectAttackPurpose({...base,assignedTeamDuty:true}),null);
});
test('Konkrete erreichbare Vordergruppe erlaubt Anschließen',()=>{
  const chase={...base,progress:.5,remainingM:90000,inMainGroup:false,
    gapToRaceFrontM:900,gapToNextGroupM:300,breakawayEstablished:true};
  assert.equal(selectAttackPurpose(chase),'gruppe_erreichen');
  assert.equal(selectAttackPurpose({...chase,gapToNextGroupM:null}),null);
  assert.equal(selectAttackPurpose({...chase,bridgeReachable:false}),null);
  assert.equal(selectAttackPurpose({...chase,gapToNextGroupM:1000}),null);
  assert.equal(selectAttackPurpose({...chase,gapToRaceFrontM:5000}),null);
});
test('Geschützter Favorit darf frühestens später angreifen und Finale entscheiden',()=>{
  const fin={...base,role:'kapitaen',protectedFavorite:true,remainingM:50000,
    progress:.72,gradeFraction:.07,gapToRaceFrontM:100,groupSize:5};
  assert.equal(selectAttackPurpose(fin),'sieg_angreifen');
  assert.equal(selectAttackPurpose({...fin,gapToRaceFrontM:4000,inMainGroup:false}),null);
  assert.equal(selectAttackPurpose({...fin,remainingM:200}),null);
  assert.equal(selectAttackPurpose({...fin,winnerFinished:true}),null);
});

test('Anschluss benötigt Leistungs- und Energievorteil gegenüber der Zielgruppe',()=>{
  const obs={gapM:80,targetSpeedMps:10,effectiveCpW:350,wPrimeJ:16000,
    massKg:78,dragAreaM2:.3,gradeFraction:0,rollingCoefficient:.004,
    drivetrainEfficiency:.975,airDensityKgM3:1.2,headwindMps:0,crosswindMps:0};
  assert.equal(estimateBridge(obs).reachable,true);
  assert.equal(estimateBridge({...obs,targetSpeedMps:15}).reachable,false);
  assert.equal(estimateBridge({...obs,gapM:1000}).reachable,false);
  assert.equal(estimateBridge({...obs,gradeFraction:-.08}).reachable,false);
});
