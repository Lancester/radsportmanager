import test from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {readFileSync} from 'node:fs';

test('R22: reproduzierbarer Pilot 2 Seeds × 2 Verpflegungsszenarien über 170 km',()=>{
  const out='artifacts/r22-pilot';
  const run=()=>execFileSync(process.execPath,[
    '--experimental-strip-types','scripts/r22-monte-carlo.mjs',
    '--profile','berg','--runs','2','--teams','5','--roster','7',
    '--distance','170','--comparison','carbs','--seed','2026',
    '--output',out,
  ],{encoding:'utf8',timeout:180000});
  const logs=run();
  const races=logs.split('\n').filter(s=>s.startsWith('R22-RACE '));
  assert.equal(races.length,4);
  const summary=JSON.parse(readFileSync(out+'/summary.json','utf8'));
  assert.equal(summary.fullRaceSimulations,4);
  assert.equal(summary.finishers,140);
  assert.equal(summary.variants.length,2);
  assert.deepEqual(summary.pairedNutritionSensitivity.details.map(r=>r.seed),
    [2026,2027]);
  const csv=readFileSync(out+'/races.csv','utf8').trim().split('\n');
  assert.equal(csv.length,5);
  assert.ok(readFileSync(out+'/summary.md','utf8')
    .includes('technische Stichprobe'));
  for(const s of races){
    const row=JSON.parse(s.slice('R22-RACE '.length));
    assert.equal(row.participants,35);
    assert.ok(row.winnerTimeS>0&&row.runtimeSeconds>=0);
    assert.ok(row.medianGapS>=0&&row.lastGapS>=row.medianGapS);
  }
  console.log('R22-PILOT',JSON.stringify(summary));
});
