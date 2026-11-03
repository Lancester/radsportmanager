import test from 'node:test';
import assert from 'node:assert/strict';
import {decideTeamPace,R14_TEAM_PACE}
  from '../src/engine/race/team-pacing.ts';
import {createRaceExample,simulateRace}
  from '../src/engine/race/race-simulator.ts';
import {auditRace} from '../src/engine/race/race-audit.ts';

const teams=[
  {id:'A',strategy:'kapitaen_schuetzen'},
  {id:'B',strategy:'sprint'},
  {id:'C',strategy:'offensiv'},
];
const rider=(id,teamId,role,positionM,reserveFraction=0.9)=>({
  id,teamId,role,positionM,reserveFraction,criticalPowerW:290,
});
const squad=[
  rider('A-C','A','kapitaen',980),
  rider('A-H1','A','helfer',985),
  rider('A-H2','A','helfer',975),
  rider('B-S','B','sprinter',970),
  rider('B-H1','B','helfer',975),
  rider('B-H2','B','helfer',965),
];
const decide=(timeS,riders=squad,progress=0.35)=>decideTeamPace({
  timeS,progress,teams,riders,
});

test('R14: pro Team nur ein Helfer arbeitet, die Schicht rotiert über Rennzeit',()=>{
  const first=decide(0);
  const second=decide(R14_TEAM_PACE.leaderRotationSeconds);
  assert.equal(first.size,2);
  assert.equal(second.size,2);
  assert.ok(first.has('A-H1')!==second.has('A-H1'));
  assert.ok(first.has('B-H1')!==second.has('B-H1'));
  assert.ok([...first.values()].every(o=>o.kind==='fuehrung'&&
    o.desiredPowerW>290&&o.desiredPowerW<320));
});
test('R14: Führungsaufträge hängen nicht von Eingabe-/Team-Reihenfolge ab',()=>{
  const a=decide(10);
  const b=decideTeamPace({timeS:10,progress:0.35,
    teams:[...teams].reverse(),riders:[...squad].reverse()});
  assert.deepEqual([...a].sort(),[...b].sort());
});
test('R14: nur körperlich nahe, belastbare Helfer werden eingesetzt',()=>{
  const riders=[...squad].map(r=>r.id==='A-H1'?{...r,reserveFraction:0.05}:
    r.id==='A-H2'?{...r,positionM:700}:r);
  const output=decide(0,riders);
  assert.ok(![...output.keys()].some(x=>x.startsWith('A-H')));
  assert.ok([...output.keys()].some(x=>x.startsWith('B-H')));
});
test('R14: echte Fluchtgruppe löst gezielte Teamverfolgung aus',()=>{
  const breakaway=[
    rider('C-C','C','kapitaen',1300),rider('C-H','C','helfer',1295),
    ...squad,
  ];
  const out=decide(0,breakaway,0.4);
  const chase=[...out.values()].filter(o=>o.kind==='verfolgung');
  assert.equal(chase.length,2);
  assert.ok(chase.every(o=>o.desiredPowerW>310));
  assert.ok(chase.every(o=>o.riderId.startsWith('A-H')||
    o.riderId.startsWith('B-H')));
  assert.notEqual(out.get('C-H')?.kind,'verfolgung',
    'Fluchtteam darf die eigene Spitze nicht verfolgen; Führungsarbeit ist erlaubt');
});
test('R14: kein künstliches Nachsetzen gegen abgehängten Solo-Fahrer',()=>{
  const dropped=[...squad,rider('C-H','C','helfer',700)];
  const o=decide(0,dropped,0.4);
  assert.ok(![...o.values()].some(x=>x.kind==='verfolgung'));
});
test('R14: bei unüberbrückbarer Lücke oder ohne W′ keine Verfolgungsanweisung',()=>{
  const big=[
    rider('C-C','C','kapitaen',2200),
    rider('C-H','C','helfer',2195),
    ...squad,
  ];
  assert.ok(![...decide(0,big,0.4).values()].some(x=>x.kind==='verfolgung'));
  const tired=[
    rider('C-C','C','kapitaen',1300),
    rider('C-H','C','helfer',1295),
    ...squad.map(x=>x.role==='helfer'?{...x,reserveFraction:0.1}:x),
  ];
  assert.ok(![...decide(0,tired,0.4).values()].some(x=>x.kind==='verfolgung'));
});
test('R14: ungültige Energie/Position oder Teamdaten werden abgewiesen',()=>{
  assert.throws(()=>decide(-1),RangeError);
  assert.throws(()=>decide(0,[...squad,{...squad[0],id:'S',
    reserveFraction:2}]),RangeError);
  assert.throws(()=>decide(0,[...squad,squad[0]]),RangeError);
});
test('R14: 50-km-Läufe mit Teamarbeit erhalten Energie, W′ und echte Einholungen',()=>{
  for(const [seed,profile,strategy] of [
    [2026,'wellig','kapitaen_schuetzen'],
    [2027,'flach','sprint'],
  ]){
    const input=createRaceExample({seed,profile,homeStrategy:strategy});
    const run=simulateRace(input);
    const audit=auditRace(run);
    assert.equal(audit.finishers,30);
    assert.equal(run.distanceM,50000);
    assert.ok(run.diagnostics.teamPaceStarts>0,
      'Teamtempoarbeit muss im Vollrennen stattfinden');
    assert.equal(run.diagnostics.teamPaceStarts,
      run.events.filter(e=>e.type==='team-pace').length);
    assert.equal(run.diagnostics.teamChaseStarts,
      run.events.filter(e=>e.type==='team-chase').length);
    assert.ok(run.classification.every(x=>x.finalWPrimeJ>=0&&
      Math.abs(x.energyResidualJ)<.05));
    console.log('R14-TEAMRENNEN',JSON.stringify({
      seed,profile,teamPaceStarts:run.diagnostics.teamPaceStarts,
      teamChaseStarts:run.diagnostics.teamChaseStarts,
      maximumGroups:audit.maximumGroups,
      medianGapS:+audit.medianGapS.toFixed(1),
      lastGapS:+audit.finishSpreadS.toFixed(1),
      winner:audit.winnerId,
    }));
  }
});
