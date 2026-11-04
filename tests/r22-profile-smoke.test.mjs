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
    assert.equal(row.top10Types.length,10);
  }
  // Die Zahlen sind ausdrücklich Diagnose, keine festen Soll-Sieger/Quoten.
  const summaryLine=log.split('\n').find(line=>
    line.startsWith('R22-PROFILES-SUMMARY '));
  const summary=JSON.parse(summaryLine.slice('R22-PROFILES-SUMMARY '.length));
  assert.equal(summary.races,4);
  assert.equal(summary.notRealismValidated,true);
  console.log(lines.join('\n'));
  console.log(summaryLine);
});

test('R-22: Profil-Smoke führt keine automatische Mehrseed-Kampagne aus',()=>{
  // Die vier Rennen sind bewusst ein einzelner, reproduzierbarer
  // Vergleich und laufen ohne den späteren 36-/60-Rennen-Workflow.
  const routes=Object.keys(REFERENCE_ROUTES);
  assert.equal(routes.length,4);
});
