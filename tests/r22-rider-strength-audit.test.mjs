import test from 'node:test';
import assert from 'node:assert/strict';
import {createReferenceFixture} from '../src/engine/race/reference-fixtures.ts';
import {soloSteadySpeedKmh,threeMinutePowerW,categoryStrength,
  buildRiderFavoritesAudit} from '../src/engine/race/rider-strength-audit.ts';

const fixture=createReferenceFixture({routeId:'lbl25_liege',seed:2026});
const riders=fixture.input.riders;
const fictitiousResult=order=>order.map((r,i)=>({
  id:r.id,rank:i+1,gapS:i*3,
}));
const order=riders.map(r=>r);

test('R22 Favoriten: alle fünf Kategorien vorhanden und unabhängig vom Zieleinlauf',()=>{
  const a=buildRiderFavoritesAudit(riders,fictitiousResult(order),'klassiker');
  const b=buildRiderFavoritesAudit(riders,
    fictitiousResult([...order].reverse()),'klassiker');
  assert.equal(a.method,'pre-race-independent-proxies-no-results-in-ranking');
  assert.equal(a.calibrated,false);
  assert.equal(a.preferredCategory,'klassiker');
  assert.equal(a.perCategory.length,5);
  assert.deepEqual(a.perCategory.map(x=>x.category),[
    'sprinter','kletterer','klassiker','zeitfahrer','allrounder',
  ]);
  assert.deepEqual(a.perCategory.map(x=>x.strongest.riderId),
    b.perCategory.map(x=>x.strongest.riderId));
  assert.equal(a.profileFavorite.riderId,b.profileFavorite.riderId);
  const aClimber=a.perCategory.find(x=>x.category==='kletterer');
  const bClimber=b.perCategory.find(x=>x.category==='kletterer');
  assert.notEqual(aClimber.strongest.finishRank,bClimber.strongest.finishRank);
  for(const cat of a.perCategory){
    assert.ok(cat.participants>0);
    assert.equal(cat.strongest.strengthRank,1);
    assert.equal(cat.topThree[0].riderId,cat.strongest.riderId);
    assert.ok(cat.topThree.length>=1&&cat.topThree.length<=3);
    assert.ok(cat.topThree.every(x=>x.finishRank>=1&&x.finishRank<=154));
    assert.ok(cat.topThree.every((x,i)=>x.strengthRank===i+1));
    assert.ok(cat.strongest.strengthScore>0);
    assert.ok(cat.topThreeMeanFinishRank>=1&&cat.topThreeMeanFinishRank<=154);
  }
  assert.equal(a.topTenProfileStrengthPositions.length,10);
  assert.ok(a.winnerProfileStrengthRank>=1&&
    a.winnerProfileStrengthRank<=154);
});

test('R22 Favoriten: Gewicht schlägt Watt am Berg nur bei real physischer Tempoüberlegenheit',()=>{
  const r=riders.find(x=>x.specialty==='kletterer');
  assert.ok(r);
  const heavy={...r,id:'heavy',massKg:85,criticalPowerW:385};
  const light={...r,id:'light',massKg:62,criticalPowerW:370};
  assert.ok(light.criticalPowerW<heavy.criticalPowerW);
  assert.ok(soloSteadySpeedKmh(light,.08)>soloSteadySpeedKmh(heavy,.08));
  const sorted=categoryStrength([heavy,light],'kletterer');
  assert.equal(sorted[0].riderId,'light');
  // Der Flachwert ist separat: keine Bergplatzierung wird als
  // Bewertung oder automatischer Sieg in die KI zurückgespeist.
  assert.ok(soloSteadySpeedKmh(light,0)>0);
});

test('R22 Favoriten: Klassiker-Rampenstärke bezieht Wprime und Masse ein',()=>{
  const k=riders.find(x=>x.specialty==='klassiker');
  assert.ok(k);
  const a={...k,id:'puncheur',massKg:63,wPrimeJ:30000};
  const b={...k,id:'heavier',massKg:78,wPrimeJ:30000};
  assert.equal(threeMinutePowerW(a),threeMinutePowerW(b));
  assert.equal(categoryStrength([a,b],'klassiker')[0].riderId,'puncheur');
});

test('R22 Favoriten: Stärke wird pro Rennprofil für ALLE Fahrer zusätzlich berechnet',()=>{
  for(const [kind,preferred] of [
    ['flach','sprinter'],['huegelig','klassiker'],
    ['klassiker','klassiker'],['berg','kletterer'],
  ]){
    const x=buildRiderFavoritesAudit(riders,fictitiousResult(riders),kind);
    assert.equal(x.preferredCategory,preferred);
    assert.equal(x.profileTopThree.length,3);
    assert.ok(x.profileTopThree[0].strengthScore>=
      x.profileTopThree[1].strengthScore);
  }
});

test('R22 Favoriten: fehlende Ergebnisse oder fehlerhafte Typen werden abgewiesen',()=>{
  assert.throws(()=>buildRiderFavoritesAudit(
    riders,fictitiousResult(riders.slice(0,-1)),'berg'));
  const bad=fictitiousResult(riders);
  bad[0]={...bad[0],id:'falsche-id'};
  assert.throws(()=>buildRiderFavoritesAudit(riders,bad,'berg'));
});
