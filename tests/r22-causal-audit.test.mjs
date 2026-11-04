import test from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {readFileSync} from 'node:fs';
import {createRaceExample,simulateRace}
  from '../src/engine/race/race-simulator.ts';

test('R-22 Diagnostik greift nicht in Ergebnis/Physik ein',()=>{
  for(const model of [undefined,'stable-pack']){
    const input={...createRaceExample({profile:'flach',seed:2026}),
      ...(model?{groupRidingModel:model}:{})};
    const normal=simulateRace(input);
    const traced=simulateRace({...input,diagnosticLevel:'checkpoints'});
    const withoutTrace={...traced,diagnostics:{...traced.diagnostics}};
    delete withoutTrace.checkpoints;
    delete withoutTrace.diagnostics.attackTraces;
    assert.deepEqual(withoutTrace,normal);
    assert.ok(Array.isArray(traced.diagnostics.attackTraces));
    assert.ok(traced.checkpoints.length>0);
    for(const cp of traced.checkpoints){
      assert.equal(cp.riders.length,cp.activeRiders);
      assert.equal(cp.groupSizes.reduce((a,b)=>a+b,0),cp.activeRiders);
      assert.ok(cp.riders.every(r=>r.aeroFactor>0&&r.aeroFactor<=1&&
        r.wPrimeRemainingPct>=0&&r.wPrimeRemainingPct<=100&&
        r.enduranceAvailabilityPct>=60&&r.enduranceAvailabilityPct<=100));
    }
  }
});

test('R-22 realer Ursachen-Audit: drei 154er-Vollrennen und Exporte',()=>{
  const dir='artifacts/r22-causal-regression';
  const output=execFileSync(process.execPath,[
    '--experimental-strip-types','scripts/r22-causal-audit.mjs',
    '--route','tdf25_lille','--seed','2026','--output',dir,
  ],{encoding:'utf8',timeout:240000,maxBuffer:5e6});
  const rows=output.split('\n').filter(s=>s.startsWith('R22-CAUSAL-RACE '));
  assert.equal(rows.length,3);
  const report=JSON.parse(readFileSync(dir+'/report.json','utf8'));
  assert.deepEqual(report.variants.map(x=>x.variant),[
    'baseline','without_long_fatigue','legacy_drafting']);
  assert.equal(report.variants.every(x=>x.participants===154),true);
  assert.ok(report.variants.every(x=>x.checkpoints>=30));
  assert.equal(report.differences.length,2);
  const csv=readFileSync(dir+'/rider-checkpoints.csv','utf8').trim().split('\n');
  assert.ok(csv.length>5000);
  assert.equal(readFileSync(dir+'/finishers.csv','utf8').trim().split('\n').length,463);
  const md=readFileSync(dir+'/summary.md','utf8');
  assert.ok(md.includes('Keine Physik-/Kalibrierungsparameter'));
  // Vorherige unveränderte Referenz aus manuellem #41773569558.
  assert.ok(Math.abs(report.variants[0].winnerTimeS-12619.2)<.2);
  assert.ok(Math.abs(report.variants[0].medianGapS-663.6)<.2);
  const auditCheckpoints=output.split('\n').find(s=>s.startsWith(
    'R22-CAUSAL-CHECKPOINTS '));
  assert.ok(auditCheckpoints,'Checkpoint-Protokoll fehlt');
  console.log(auditCheckpoints);
  console.log('R22-CAUSAL-RESULTS',JSON.stringify(report));
});
