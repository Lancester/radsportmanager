import test from 'node:test';
import assert from 'node:assert/strict';
import {buildLabRace,initialLabSettings} from '../src/labor/lab-settings.ts';
import {DEFAULT_TEAM_PLAN} from '../src/engine/race/team-tactical-plan.ts';
import {simulateRace} from '../src/engine/race/race-simulator.ts';

test('Screenshot T01: freier F002, geschützter Sprintkapitän F001, finale=sprint',()=>{
 const s=initialLabSettings();
 s.myTeamId='T01';s.captainId='F001';s.riderRoles={F002:'frei'};
 s.teams=[{teamId:'T01',strategy:'ausgewogen',
   tacticalPlan:{...DEFAULT_TEAM_PLAN,attackRisk:'keine',finale:'sprint'}}];
 const input=buildLabRace(s).input;
 const t=input.teams[0];
 const r=input.riders.filter(x=>x.teamId==='T01');
 console.log('SCREENSHOT_INPUT',JSON.stringify({team:t,roles:r.map(x=>({id:x.id,role:x.role,specialty:x.specialty,name:x.name}))}));
 const out=simulateRace(input);
 const cap=out.classification.find(x=>x.id==='F001');
 const cp=(out.checkpoints??[]).filter(x=>[45,90,135,180].some(k=>Math.abs(x.km-k)<.5)).map(c=>{
  const x=c.riders.find(v=>v.riderId==='F001');
  return {km:c.km,group:x?.groupIndex,groupSize:c.groupSizes[x?.groupIndex],
   capGapM:x?.gapToLeaderM,capWPrime:x?.wPrimeRemainingPct,
   helpers:c.riders.filter(q=>q.teamId==='T01'&&q.role==='helfer'&&q.groupIndex===x?.groupIndex).length};
 });
 console.log('SCREENSHOT_AUDIT',JSON.stringify({rank:cap.rank,gapS:cap.gapS,teamActions:out.events.filter(e=>e.teamId==='T01').reduce((m,e)=>(m[e.type]=(m[e.type]??0)+1,m),{}),checkpoints:cp}));
 assert.equal(input.riders.length,154);
 assert.ok(Number.isFinite(cap.finishTimeS));
},{timeout:180000});
