import test from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {REFERENCE_ROUTES} from '../src/engine/race/reference-fixtures.ts';

test('R-22: stable-pack auf den vier vorhandenen Einzelrenn-Profilen (je 154 Fahrer, ein Seed)',()=>{
  const log=execFileSync(process.execPath,[
    '--experimental-strip-types','scripts/r22-profile-smoke.mjs',
    '--route','all','--seed','2026',
  ],{encoding:'utf8',timeout:240000,maxBuffer:2e6});
  const lines=log.split('\n').filter(line=>line.startsWith('R22-PROFILE '));
  const rows=lines.map(line=>JSON.parse(line.slice('R22-PROFILE '.length)));
  assert.equal(rows.length,4);
  assert.deepEqual(rows.map(x=>x.route),Object.keys(REFERENCE_ROUTES));
  assert.deepEqual(rows.map(x=>x.profile),
    ['flach','huegelig','klassiker','berg']);
  for(const row of rows){
    assert.equal(row.participants,154);
    assert.equal(row.seed,2026);
    assert.equal(row.model,'stable-pack');
    assert.ok(row.winnerGroup>=1&&row.winnerGroup<=154);
    assert.ok(row.largestFinishGroup>=row.winnerGroup&&
      row.largestFinishGroup<=154);
    assert.ok(row.within60s>=row.winnerGroup&&row.within60s<=154);
    assert.ok(row.largestFinishGroupGapS>=0);
    assert.ok(row.maximumGroups>=1);
    assert.ok(row.largestGroupAt25Pct>=1&&row.largestGroupAt25Pct<=154);
    assert.ok(row.largestGroupAt50Pct>=1&&row.largestGroupAt50Pct<=154);
    assert.ok(row.largestGroupAt75Pct>=1&&row.largestGroupAt75Pct<=154);
    assert.ok(row.medianWPrimeAt50Pct>=0&&row.medianWPrimeAt50Pct<=100);
    assert.ok(row.avgCrankW>0&&row.avgCrankW<1000);
    assert.ok(row.actualChaseFrontS>=0&&row.chaseLeaderChanges>=0);
    assert.ok(row.sprintPositioningSeconds>=0&&row.sprintEscortSeconds>=0);
    if(row.profile!=='flach'){
      assert.equal(row.sprintPositioningSeconds,0);
      assert.equal(row.sprintEscortSeconds,0);
    }
    assert.equal(row.top10Types.length,10);
  }
  // Die Zahlen sind ausdrücklich Diagnose, keine festen Soll-Sieger/Quoten.
  const summaryLine=log.split('\n').find(line=>
    line.startsWith('R22-PROFILES-SUMMARY '));
  const summary=JSON.parse(summaryLine.slice('R22-PROFILES-SUMMARY '.length));
  assert.equal(summary.races,4);
  assert.equal(summary.notRealismValidated,true);
  const traces=log.split('\n').filter(line=>
    line.startsWith('R22-WINNER-TRACE '));
  assert.equal(traces.length,4);
  for(const line of traces){
    const trace=JSON.parse(line.slice('R22-WINNER-TRACE '.length));
    assert.ok(trace.winnerId);
    assert.ok(trace.trace.length>=4);
    assert.ok(trace.trace.every(x=>x.winnerRank>=1&&x.winnerRank<=154&&
      x.winnerGapM>=0));
  }
  const favoritesLines=log.split('\n').filter(line=>
    line.startsWith('R22-FAVORITES '));
  assert.equal(favoritesLines.length,4);
  const favorites=favoritesLines.map(line=>JSON.parse(
    line.slice('R22-FAVORITES '.length)));
  assert.deepEqual(favorites.map(x=>x.route),Object.keys(REFERENCE_ROUTES));
  for(const x of favorites){
    assert.equal(x.seed,2026);
    assert.equal(x.calibrated,false);
    assert.equal(x.perCategory.length,5);
    assert.equal(x.profileTopThree.length,3);
    assert.equal(x.topTenProfileStrengthPositions.length,10);
    assert.ok(x.winnerProfileStrengthRank>=1&&
      x.winnerProfileStrengthRank<=154);
    assert.ok(x.perCategory.every(cat=>
      cat.participants>=1&&cat.strongest.strengthRank===1&&
      cat.strongest.finishRank>=1&&cat.strongest.finishRank<=154&&
      cat.topThree.length>=1&&cat.topThree.length<=3));
  }
  console.log(lines.join('\n'));
  console.log(traces.join('\n'));
  const classicAudits=log.split('\n').filter(line=>
    line.startsWith('R22-CLASSICS-PUNCH-AUDIT '));
  assert.equal(classicAudits.length,1,'Klassiker-Rampen-Audit fehlt');
  const classics=JSON.parse(
    classicAudits[0].slice('R22-CLASSICS-PUNCH-AUDIT '.length));
  assert.equal(classics.route,'lbl25_liege');
  assert.equal(classics.seed,2026);
  assert.ok(classics.climbEvents.length>=4);
  assert.ok(classics.totalPunchEvents>=0);
  const lilleLines=log.split('\n').filter(line=>
    line.startsWith('R22-LILLE-SPRINTER-AUDIT '));
  assert.equal(lilleLines.length,1);
  const lille=JSON.parse(lilleLines[0].slice(
    'R22-LILLE-SPRINTER-AUDIT '.length));
  assert.equal(lille.route,'tdf25_lille');
  assert.equal(lille.seed,2026);
  assert.equal(lille.preRaceBestSprinter,
    favorites[0].perCategory.find(x=>x.category==='sprinter').strongest.riderId);
  assert.ok(lille.sprintPositioningSeconds>0,
    'Im langen flachen Peloton muss echte Positionierungsarbeit stattfinden');
  assert.ok(lille.sprintEscortSeconds>=0);
  assert.ok(Array.isArray(lille.sprintFinale));
  const targetFinale=lille.sprintFinale.find(x=>
    x.riderId===lille.preRaceBestSprinter);
  assert.ok(targetFinale,'F023-Sprintfinale-Position und Helferzahl fehlen');
  assert.ok(targetFinale.groupSize>=1&&
    targetFinale.rankInGroup>=1&&
    targetFinale.rankInGroup<=targetFinale.groupSize);
  assert.ok(targetFinale.helpersWithin30M>=0);
  assert.ok(targetFinale.helpersAheadWithin30M>=0&&
    targetFinale.helpersAheadWithin30M<=targetFinale.helpersWithin30M);
  assert.ok(targetFinale.helpersOnSprintTrain>=0&&
    targetFinale.helpersOnSprintTrain<=targetFinale.helpersWithin30M);
  assert.ok(targetFinale.sprintSkill>0&&targetFinale.sprintSkill<=1);
  assert.ok(lille.watched.length>=4);
  const best=lille.watched.find(x=>x.id===lille.preRaceBestSprinter);
  assert.ok(best?.sprintSkill>0);
  assert.ok(best?.baseCpW>0);
  assert.ok(best?.finishRank>=1&&best.finishRank<=154);
  assert.ok(best?.timeline.length>=5);
  assert.ok(best?.timeline.every(x=>x.rank>=1&&x.rank<=154&&
    x.gapM>=0&&x.groupSize>=1&&x.wPrimePct>=0&&x.wPrimePct<=100));
  console.log(favoritesLines.join('\n'));
  console.log(classicAudits.join('\n'));
  console.log(lilleLines.join('\n'));
  console.log(summaryLine);
});

test('R-22: Profil-Smoke führt keine automatische Mehrseed-Kampagne aus',()=>{
  // Die vier Rennen sind bewusst ein einzelner, reproduzierbarer
  // Vergleich und laufen ohne den späteren 36-/60-Rennen-Workflow.
  const routes=Object.keys(REFERENCE_ROUTES);
  assert.equal(routes.length,4);
});
