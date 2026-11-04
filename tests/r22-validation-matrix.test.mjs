import test from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {readFileSync} from 'node:fs';

const script='scripts/r22-validation-matrix.mjs';
const cli=args=>execFileSync(process.execPath,[
  '--experimental-strip-types',script,'--plan',...args,
],{encoding:'utf8',timeout:15000});
const parse=log=>{
  const line=log.split('\n').find(x=>x.startsWith('R22-MATRIX-PLAN '));
  assert.ok(line,'Validierungsplan fehlt');
  return JSON.parse(line.slice('R22-MATRIX-PLAN '.length));
};

test('R22 Matrix: vier echte Referenzstrecken und drei unveränderte KI-Varianten',()=>{
  const x=parse(cli(['--route','all','--seed-count','3','--start-seed','2026']));
  assert.deepEqual(x.routes,[
    'tdf25_lille','tdf25_boulogne','lbl25_liege','tdf25_hautacam']);
  assert.deepEqual(x.seeds,[2026,2027,2028]);
  assert.deepEqual(x.models,['coordinated','front-gated','stable-pack']);
  assert.equal(x.totalRaces,36);
  assert.equal(x.participantsPerRace,154);
  assert.equal(x.trigger,'manual-only');
});

test('R22 Matrix: Eingabegrenzen und maximal 60 Rennen',()=>{
  const x=parse(cli(['--route','tdf25_hautacam',
    '--seed-count','5','--start-seed','2026']));
  assert.deepEqual(x.routes,['tdf25_hautacam']);
  assert.equal(x.totalRaces,15);
  assert.equal(x.seeds.at(-1),2030);
  const all=parse(cli(['--route','all','--seed-count','5']));
  assert.equal(all.totalRaces,60);
  for(const args of [
    ['--seed-count','6'],['--seed-count','0'],['--seed-count','3.5'],
    ['--start-seed','-1'],['--start-seed','2147483647','--seed-count','5'],
    ['--route','tdf25_bergetappe_fake'],['--missing','value'],
    ['--output','../../out'],
  ]){
    assert.throws(()=>cli(args),'Ungültige Eingabe muss abgewiesen werden: '+args);
  }
});

test('R22 Matrix: kostenintensive Tests ausschließlich über workflow_dispatch',()=>{
  const yml=readFileSync('.github/workflows/r22-stable-pack-validation.yml','utf8');
  assert.match(yml,/^on:\n\s+workflow_dispatch:/m);
  assert.doesNotMatch(yml,/^\s+push:/m);
  assert.doesNotMatch(yml,/^\s+schedule:/m);
  assert.doesNotMatch(yml,/^\s+pull_request:/m);
  assert.match(yml,/timeout-minutes: 45/);
  assert.match(yml,/retention-days: 30/);
  assert.match(yml,/seed_count:/);
});
