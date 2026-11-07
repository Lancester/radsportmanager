import test from 'node:test';
import assert from 'node:assert/strict';
import {attackOrder,chaseInterested,crewPowerFactor,validateTeamPlan,
  DEFAULT_TEAM_PLAN} from '../src/engine/race/team-tactical-plan.ts';
import {buildLabRace,initialLabSettings,TEAM_TACTIC_FIELDS}
  from '../src/labor/lab-settings.ts';
import {simulateRace} from '../src/engine/race/race-simulator.ts';

const plan=(changes={})=>({...DEFAULT_TEAM_PLAN,...changes});
test('Taktik: alle 6 Eingabefelder haben eigenständige gültige Varianten',()=>{
  assert.equal(TEAM_TACTIC_FIELDS.length,6);
  for(const f of TEAM_TACTIC_FIELDS){
    for(const [value] of f.values)assert.doesNotThrow(()=>validateTeamPlan(plan({[f.key]:value})));
  }
  assert.throws(()=>validateTeamPlan(plan({chasePolicy:'fantasie'})),/taktische/);
  assert.throws(()=>validateTeamPlan({...plan(),chaseHelperCount:5}),/taktische/);
});
test('Taktik: Attacken nicht erzwingen, Zeitfenster und Wahrscheinlichkeit verändern',()=>{
  assert.equal(attackOrder(plan({attackRisk:'keine'}),.5).allowed,false);
  assert.equal(attackOrder(plan({attackPhase:'frueh'}),.73).allowed,false);
  assert.equal(attackOrder(plan({attackPhase:'frueh'}),.18).allowed,true);
  assert.equal(attackOrder(plan({attackPhase:'finale'}),.85).allowed,false);
  assert.equal(attackOrder(plan({attackPhase:'finale'}),.93).allowed,true);
  assert.ok(attackOrder(plan({attackRisk:'maximal'}),.5).probabilityFactor >
    attackOrder(plan({attackRisk:'vorsichtig'}),.5).probabilityFactor);
  assert.ok(attackOrder(plan({finale:'spaete_attacke'}),.93).probabilityFactor >
    attackOrder(plan(),.93).probabilityFactor);
  assert.ok(attackOrder(plan({finale:'sprint'}),.93).probabilityFactor <
    attackOrder(plan(),.93).probabilityFactor);
});
test('Taktik: Jagd nur bei vorhandener physischer Lage, KI bestimmt Helferanzahl',()=>{
  assert.equal(chaseInterested(plan({chasePolicy:'vermeiden'}),true,true),false);
  assert.equal(chaseInterested(plan({chasePolicy:'selektiv'}),true,false),false);
  assert.equal(chaseInterested(plan({chasePolicy:'selektiv'}),true,true),true);
  assert.equal(chaseInterested(plan({chasePolicy:'konsequent'}),false,false),true);
  assert.equal(chaseInterested(undefined,false,true),false);
});
test('Taktik: Wattanforderungen autonomer Helfer, keine Wattgeschenke',()=>{
  assert.equal(crewPowerFactor(undefined,'jagd','fuehrung'),1);
  assert.ok(crewPowerFactor(plan({teamTempo:'hoch'}),'jagd','fuehrung')>1);
  assert.ok(crewPowerFactor(plan({teamTempo:'sparen'}),'jagd','fuehrung')<1);
  assert.ok(crewPowerFactor(plan({leaderProtection:'hoch'}),'schutz','fuehrung')>1);
});
test('Taktik: vollständiger Plan erreicht unverändert den Rennmotor',()=>{
  const s=initialLabSettings();
  s.teams=[{teamId:'T01',strategy:'offensiv',
    tacticalPlan:plan({attackRisk:'keine',attackPhase:'frueh',
      chasePolicy:'vermeiden',teamTempo:'sparen',finale:'kapitaen',
      leaderProtection:'hoch'})}];
  const first=buildLabRace(s),second=buildLabRace(s);
  assert.deepEqual(first,second);
  assert.deepEqual(first.input.teams[0].tacticalPlan,s.teams[0].tacticalPlan);
  assert.equal(first.input.teams[1].tacticalPlan,undefined);
  assert.equal(first.input.teams[0].strategy,'offensiv');
});
test('Taktik: im echten Rennen keine spontanen Attacken eines verbotenen Teams',()=>{
  const s=initialLabSettings();
  s.teamCount=2;s.seed=2026;
  s.teams=[{teamId:'T01',strategy:'offensiv',
    tacticalPlan:plan({attackRisk:'keine'})}];
  const input=buildLabRace(s).input;
  // 30 km, kleine reproduzierbare Integration auf dem Original-Race-Kern
  const controlled={...input,segments:[{...input.segments[0],lengthM:30000}]};
  const result=simulateRace(controlled);
  assert.equal(result.classification.length,14);
  assert.equal(result.events.filter(e=>e.type==='attack'&&e.teamId==='T01').length,0);
  assert.ok(result.classification.every(r=>Number.isFinite(r.finishTimeS)));
});
