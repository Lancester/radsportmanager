import test from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {readFileSync} from 'node:fs';
import {REFERENCE_ROUTES,createReferenceTeamCompositions,
  REFERENCE_TEAM_COUNTS,createReferenceFixture,
  createReferenceSegments,PRO_REFERENCE}
  from '../src/engine/race/reference-fixtures.ts';
import {validateRace}
  from '../src/engine/race/race-simulator.ts';

const expected={
  tdf25_lille:184900,tdf25_boulogne:209100,
  lbl25_liege:252000,tdf25_hautacam:180600,
};
test('R22A: vier quellenbelegte reale Renndistanzen und verankerte Anstiege',()=>{
  for(const [id,meters] of Object.entries(expected)){
    const spec=REFERENCE_ROUTES[id];
    assert.ok(spec.sources.length>=2);
    assert.equal(spec.fidelity,
      'published-distance-and-climbs-approximated-transitions');
    const segments=createReferenceSegments(id);
    console.log('R22A-HEIGHT',JSON.stringify({id,
      ascent:Math.round(segments.reduce((sum,s)=>sum+
        Math.max(0,s.gradeFraction)*s.lengthM,0)),
      net:Math.round(segments.reduce((sum,s)=>
        sum+s.gradeFraction*s.lengthM,0)),
      published:spec.referenceAscentM??null,
      segments:segments.length}));
    assert.ok(segments.length>=15&&segments.length<=60);
    assert.equal(segments.reduce((n,s)=>n+s.lengthM,0),meters);
    for(const climb of spec.climbs){
      assert.ok(segments.some(s=>s.name===climb.name&&
        s.lengthM===Math.round(climb.lengthKm*1000)&&
        s.gradeFraction===climb.averageGrade),
        'Publizierter Anstieg fehlt: '+climb.name);
    }
    assert.ok(segments.every(s=>s.lengthM>=100&&
      Math.abs(s.gradeFraction)<=.2));
  }
});
test('R22B/C: 154 fiktive Profis auf 22 spezialisierten Siebenerteams',()=>{
  const f=createReferenceFixture({routeId:'tdf25_hautacam',seed:2026});
  validateRace(f.input);
  assert.equal(f.input.riders.length,154);
  assert.equal(f.input.teams.length,22);
  assert.deepEqual(f.teamFoci,
    REFERENCE_TEAM_COUNTS.berg);
  assert.equal(f.teamCompositions.length,22);
  assert.deepEqual(f.teamCompositions,
    createReferenceTeamCompositions('berg'));
  const ids=new Set(f.input.riders.map(r=>r.id));
  assert.equal(ids.size,154);
  assert.ok(f.input.riders.every(r=>r.criticalPowerW>=300&&
    r.criticalPowerW<=440&&r.wPrimeJ>10000&&r.wPrimeJ<55000&&
    r.massKg>=50&&r.massKg<=95));
  const types=new Set(f.input.riders.map(r=>r.specialty));
  assert.deepEqual([...types].sort(),
    ['allrounder','klassiker','kletterer','sprinter','zeitfahrer']);
  assert.ok(f.input.teams.some(t=>t.strategy==='sprint'));
  assert.ok(f.input.teams.some(t=>t.strategy==='offensiv'));
  assert.ok(f.input.teams.some(t=>t.strategy==='kapitaen_schuetzen'));
  for(const team of f.input.teams){
    const riders=f.input.riders.filter(r=>r.teamId===team.id);
    assert.equal(riders.length,7);
    assert.equal(riders.filter(r=>r.role==='kapitaen').length,1);
    if(team.strategy==='sprint')
      assert.equal(riders.filter(r=>r.role==='sprinter').length,1);
  }
  assert.equal(PRO_REFERENCE.kletterer.massKg,63.2);
  assert.equal(PRO_REFERENCE.gc.criticalPowerW,388.6);
});
test('R22: alle vier Starterfelder sind seed-stabil ohne Fahrer-Roulette',()=>{
  const a=createReferenceFixture({routeId:'tdf25_lille',seed:2026});
  const b=createReferenceFixture({routeId:'tdf25_lille',seed:2027});
  assert.deepEqual(a.input.riders,b.input.riders);
  assert.deepEqual(a.input.segments,b.input.segments);
  assert.notEqual(a.input.seed,b.input.seed);
});
test('R22 Schnellwahl: 154 Fahrer/184,9 km, Run Summary und Datenmanifest',()=>{
  const out='artifacts/r22-references-test';
  const log=execFileSync(process.execPath,[
    '--experimental-strip-types','scripts/r22-monte-carlo.mjs',
    '--scenario','tdf25_lille','--runs','1',
    '--seed','2026','--output',out,
  ],{encoding:'utf8',timeout:180000});
  const races=log.split('\n').filter(x=>x.startsWith('R22-RACE '));
  assert.equal(races.length,1);
  const summary=JSON.parse(readFileSync(out+'/summary.json','utf8'));
  const manifest=JSON.parse(readFileSync(out+'/reference-scenario.json','utf8'));
  assert.equal(summary.scenario.fixture,'tdf25_lille');
  assert.equal(summary.scenario.distanceKm,184.9);
  assert.equal(summary.fullRaceSimulations,1);
  assert.equal(summary.finishers,154);
  assert.equal(manifest.riders.length,154);
  assert.equal(manifest.exactElevationReconstruction,false);
  assert.ok(manifest.segments.length<=60);
  assert.ok(readFileSync(out+'/summary.md','utf8')
    .includes('KEIN Original-GPX'));
  console.log('R22-REFERENCE-SMOKE',JSON.stringify({
    scenario:summary.scenario,run:JSON.parse(races[0].slice(9)),
  }));
});

test('R22C: vier Streckenprofile erhalten unterschiedliche Mannschaftsfoki',()=>{
  const profiles=['flach','huegelig','klassiker','berg'];
  for(const profile of profiles){
    const roster=createReferenceTeamCompositions(profile);
    assert.equal(roster.length,22);
    for(const focus of ['sprint','berg','klassiker','ausreisser','ausgewogen'])
      assert.equal(roster.filter(t=>t.focus===focus).length,
        REFERENCE_TEAM_COUNTS[profile][focus]);
  }
  assert.ok(REFERENCE_TEAM_COUNTS.flach.sprint>
    REFERENCE_TEAM_COUNTS.berg.sprint);
  assert.ok(REFERENCE_TEAM_COUNTS.klassiker.klassiker>
    REFERENCE_TEAM_COUNTS.flach.klassiker);
});
