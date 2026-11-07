import test from 'node:test';
import assert from 'node:assert/strict';
import {buildLabRace,initialLabSettings} from '../src/labor/lab-settings.ts';
import {simulateRace} from '../src/engine/race/race-simulator.ts';
import {buildTeamReport} from '../src/labor/team-report.ts';

test('V5: sichtbarer Standardkapitän ist auch ohne Dropdown-Änderung im Teamdatensatz vorhanden',()=>{
  const s=initialLabSettings();
  s.teamCount=2;
  s.sprintLeaderId='F001';
  s.riderRoles={F002:'frei'};
  const {input}=buildLabRace(s);
  assert.equal(input.teams[0].captainId,'F001');
  assert.equal(input.teams[0].sprintLeaderId,'F001');
  assert.equal(input.riders.find(r=>r.id==='F001').role,'sprinter');
  const outcome=simulateRace(input);
  const credited=new Map(outcome.classification.map(r=>[r.id,r.gapS]));
  const report=buildTeamReport(input,outcome,'T01',credited);
  assert.equal(report.captainId,'F001');
  assert.equal(report.sprintLeaderId,'F001');
  assert.equal(report.riderResults.length,7);
},{timeout:180000});

test('V5-Diagnose: getrennter Kapitän F001 und Zielsprinter F004 im vollen Feld',()=>{
  const s=initialLabSettings();
  s.routeId='tdf25_lille';
  s.seed=2026;
  s.teamCount=22;
  s.captainId='F001';
  s.sprintLeaderId='F004';
  s.riderRoles={F002:'frei',F004:'sprinter'};
  s.teams=[{teamId:'T01',strategy:'sprint'}];
  const {input}=buildLabRace(s);
  assert.equal(input.teams[0].captainId,'F001');
  assert.equal(input.teams[0].sprintLeaderId,'F004');
  const result=simulateRace(input);
  const captain=result.classification.find(r=>r.id==='F001');
  const sprint=result.classification.find(r=>r.id==='F004');
  const checkpoints=(result.checkpoints??[])
    .filter(c=>[30,45,60,90,120,150,180].some(k=>Math.abs(c.km-k)<.51))
    .map(c=>{
      const cap=c.riders.find(r=>r.riderId==='F001');
      const spr=c.riders.find(r=>r.riderId==='F004');
      return {km:+c.km.toFixed(1),
        captainGroup:cap?.groupIndex,capGapM:+(cap?.gapToLeaderM??0).toFixed(0),
        capWPrime:cap?.wPrimeRemainingPct,
        capHelpers:c.riders.filter(r=>r.teamId==='T01'&&r.role==='helfer'&&r.groupIndex===cap?.groupIndex).length,
        sprintGroup:spr?.groupIndex,sprintGapM:+(spr?.gapToLeaderM??0).toFixed(0)};
    });
  console.log('V5_DIVIDED_CAPTAIN_DIAG '+JSON.stringify({
    captain:{rank:captain.rank,gapS:+captain.gapS.toFixed(1)},
    sprint:{rank:sprint.rank,gapS:+sprint.gapS.toFixed(1)},
    team:result.classification.filter(r=>r.teamId==='T01').map(r=>({id:r.id,role:r.role,rank:r.rank,gap:+r.gapS.toFixed(1)})),
    checkpoints,
    teamOrders:result.events.filter(e=>e.teamId==='T01').reduce((m,e)=>(m[e.type]=(m[e.type]??0)+1,m),{})
  }));
  assert.ok(Number.isFinite(captain.finishTimeS)&&Number.isFinite(sprint.finishTimeS));
},{timeout:180000});

