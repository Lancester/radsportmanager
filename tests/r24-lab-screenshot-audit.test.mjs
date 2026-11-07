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
 const untouchedCaptain=structuredClone(s);
 delete untouchedCaptain.captainId;
 const automaticInput=buildLabRace(untouchedCaptain).input;
 assert.equal(automaticInput.teams[0].sprintLeaderId,'F001',
   'Der sichtbare Standardkapitän darf nicht aus dem Sprintplan herausfallen, wenn der zweite Sprinter frei ist');
 const automaticRace=simulateRace(automaticInput);
 const automaticCaptain=automaticRace.classification.find(x=>x.id==='F001');
 console.log('SCREENSHOT_UNTOUCHED_CAPTAIN',JSON.stringify({
   rank:automaticCaptain.rank,gapS:+automaticCaptain.gapS.toFixed(1),
   role:automaticCaptain.role,train:automaticRace.events.filter(e=>
     e.teamId==='T01'&&e.type==='sprint-train').length
 }));
 assert.ok(automaticCaptain.rank<=30,
   'Ohne den Kapitän-Dropdown zu berühren muss die angezeigte Sprintaufstellung ebenso wirken');
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
 // Vorher: gewählte Finalpräferenz "Sprint" war wirkungslos, Fahrer
 // fiel in Rang 149 zurück. Jetzt muss dieselbe Eingabe einen echten
 // Sprint-/Jagdauftrag auslösen, ohne die Fahrerdaten zu verändern.
 const oldCase=structuredClone(s);
 oldCase.teams[0].tacticalPlan.finale='situativ';
 const oldInput=buildLabRace(oldCase).input;
 assert.equal(oldInput.teams[0].strategy,'ausgewogen');
 assert.equal(input.teams[0].strategy,'sprint');
 assert.deepEqual(input.riders,oldInput.riders);
 assert.deepEqual(input.segments,oldInput.segments);
 const oldRace=simulateRace(oldInput);
 const oldCaptain=oldRace.classification.find(x=>x.id==='F001');
 const actions=out.events.filter(e=>e.teamId==='T01')
   .reduce((m,e)=>(m[e.type]=(m[e.type]??0)+1,m),{});
 console.log('SCREENSHOT_FIX_AB',JSON.stringify({
   oldRank:oldCaptain.rank,updatedRank:cap.rank,
   oldGapS:+oldCaptain.gapS.toFixed(1),updatedGapS:+cap.gapS.toFixed(1),
   teamActions:actions,
   checkpoints:cp.map(x=>({km:+x.km.toFixed(0),helpers:x.helpers,capGapM:Math.round(x.capGapM)}))
 }));
 assert.equal(input.riders.length,154);
 assert.ok(Number.isFinite(cap.finishTimeS));
 assert.ok(cap.rank<=30,'Sprintfavorit darf nach aktivem Sprintauftrag nicht mehr unbemerkt auf Rang 149 abreißen');
 assert.ok(oldCaptain.rank>=100,'Kontrolllauf muss den gemeldeten Defekt reproduzieren');
 assert.ok((actions['team-chase']??0)>0,'Sprint-Order muss Jagdhelfer koordinieren');
 assert.ok((actions['sprint-train']??0)>0,'Sprint-Order muss Sprintzug auslösen');
 assert.ok(cp.find(x=>Math.abs(x.km-90)<.5).helpers>=1,
   'Der Kapitän muss im Hauptfeld eigene Helfer bei sich behalten');
},{timeout:180000});
