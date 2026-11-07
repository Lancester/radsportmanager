import test from 'node:test';
import assert from 'node:assert/strict';
import {buildLabRace,initialLabSettings} from '../src/labor/lab-settings.ts';
import {simulateRace} from '../src/engine/race/race-simulator.ts';
import {decideIntelligentCrew} from '../src/engine/race/race-team-ai.ts';

test('Rollen: Kapitän darf zugleich Sprintziel sein, echte Engine-Team-ID',()=>{
 const s=initialLabSettings();s.routeId='tdf25_lille';
 const original=buildLabRace(s).input;
 const mine=original.riders.filter(r=>r.teamId==='T01');
 const naturalSprinter=mine.find(r=>r.role==='sprinter');
 const oldCap=mine.find(r=>r.role==='kapitaen');
 assert.ok(naturalSprinter&&oldCap);
 s.captainId=naturalSprinter.id;
 s.sprintLeaderId=naturalSprinter.id;
 s.teams=[{teamId:'T01',strategy:'sprint'}];
 const built=buildLabRace(s).input;
 assert.equal(built.teams[0].sprintLeaderId,naturalSprinter.id);
 assert.equal(built.teams[0].strategy,'sprint');
 assert.equal(built.riders.find(r=>r.id===naturalSprinter.id).role,'kapitaen');
 assert.equal(built.riders.find(r=>r.id===oldCap.id).role,'helfer');
 assert.equal(built.riders.filter(r=>r.teamId==='T01'&&r.role==='kapitaen').length,1);
 assert.deepEqual(built.riders.filter(r=>r.teamId!=='T01'),
   original.riders.filter(r=>r.teamId!=='T01'));
});
test('Rollen: zusätzliche Sprinter und freie Fahrer beeinflussen echte Helferzuordnung',()=>{
 const s=initialLabSettings();
 const base=buildLabRace(s).input;
 const mine=base.riders.filter(r=>r.teamId==='T01');
 const cap=mine.find(r=>r.role==='kapitaen').id;
 const sprinter=mine.find(r=>r.role==='sprinter')?.id;
 const helper=mine.find(r=>r.role==='helfer').id;
 const other=mine.filter(r=>r.role==='helfer')[1].id;
 s.riderRoles={[helper]:'sprinter',[other]:'frei'};
 s.sprintLeaderId=helper;
 s.teams=[{teamId:'T01',strategy:'sprint'}];
 const built=buildLabRace(s).input;
 assert.equal(built.riders.find(r=>r.id===helper).role,'sprinter');
 assert.equal(built.riders.find(r=>r.id===other).role,'frei');
 assert.equal(built.riders.find(r=>r.id===cap).role,'kapitaen');
 assert.equal(built.teams[0].sprintLeaderId,helper);
 if(sprinter)assert.equal(built.riders.find(r=>r.id===sprinter).role,'sprinter');
 // Die KI darf nur echte Helfer zur Tempo- und Schutzarbeit einsetzen.
 const company=built.riders.filter(r=>r.teamId==='T01');
 const planning=company.map((r,i)=>({
   id:r.id,teamId:r.teamId,role:r.role,positionM:170000-i*1,
   speedMps:12,criticalPowerW:r.criticalPowerW,
   reserveFraction:.8,aggression:r.aggression
 }));
 const crew=decideIntelligentCrew({
   timeS:100,progress:.93,remainingM:7000,
   teams:[{id:'T01',strategy:'sprint',sprintLeaderId:helper}],
   riders:planning,sprintFinaleMode:true,adaptiveChase:true,
 });
 assert.ok([...crew.orders.values()].every(x=>
   ![helper,other,cap].includes(x.riderId)));
});
test('Rollen: illegale Teamwechsel und Sprintziel auf freiem Helfer ablehnen',()=>{
 const s=initialLabSettings();
 s.sprintLeaderId='F012';
 assert.throws(()=>buildLabRace(s),/Sprintziel muss/);
 s.sprintLeaderId='F003';
 s.riderRoles={F003:'frei'};
 assert.throws(()=>buildLabRace(s),/Sprintziel muss Kapitän oder Sprinter/);
 s.riderRoles={F999:'sprinter'};
 assert.throws(()=>buildLabRace(s),/nur eigenen Fahrern/);
});
test('Rollen: klassischer Standard ohne neue Vorgaben bleibt bitgenau',()=>{
 const s=initialLabSettings();
 const a=buildLabRace(s).input;
 const b=buildLabRace({...s,riderRoles:undefined,sprintLeaderId:undefined}).input;
 assert.deepEqual(a,b);
});
test('Rollen: vollständige flache 154-Fahrer-Simulation mit Kapitän als Sprinter',()=>{
 const s=initialLabSettings();s.routeId='tdf25_lille';s.seed=2026;
 const initial=buildLabRace(s).input;
 const sprinter=initial.riders.find(r=>r.teamId==='T01'&&r.role==='sprinter');
 assert.ok(sprinter);
 s.captainId=sprinter.id;s.sprintLeaderId=sprinter.id;
 s.teams=[{teamId:'T01',strategy:'sprint'}];
 const input=buildLabRace(s).input;
 const out=simulateRace(input);
 assert.equal(out.classification.length,154);
 assert.equal(out.classification.find(r=>r.id===sprinter.id).role,'kapitaen');
 assert.ok(out.classification.every(r=>Number.isFinite(r.finishTimeS)));
 const capRow=out.classification.find(r=>r.id===sprinter.id);
 const teamRows=out.classification.filter(r=>r.teamId==='T01');
 const capProgress=(out.checkpoints??[]).filter(c=>[.25,.5,.7,.8,.9,.95,.99].some(p=>
   Math.abs(c.km/input.segments.reduce((s,v)=>s+v.lengthM,0)*1000-p)<.013))
   .map(c=>{
     const cap=c.riders.find(r=>r.riderId===sprinter.id);
     const sameGroupHelpers=c.riders.filter(r=>r.teamId==='T01'&&r.role==='helfer'&&
       r.groupIndex===cap?.groupIndex).length;
     return {km:+c.km.toFixed(1),capGroup:cap?.groupIndex,
       groupSize:c.groupSizes[cap?.groupIndex]??null,
       capGap:+(cap?.gapToLeaderM??0).toFixed(0),
       capWPrimePct:+(cap?.wPrimeRemainingPct??0).toFixed(0),
       ownHelpersInGroup:sameGroupHelpers,
       frontGroupSize:c.groupSizes[0],largestGroup:c.largestGroup};
   });
 console.log('R24_SPRINT_CAPTAIN_AUDIT '+JSON.stringify({
   riderId:sprinter.id,rank:capRow.rank,gapS:+capRow.gapS.toFixed(1),
   teamFinish:teamRows.map(r=>({id:r.id,role:r.role,rank:r.rank,gap:+r.gapS.toFixed(1)})),
   sprintTrainEvents:out.events.filter(e=>e.type==='sprint-train'&&e.teamId==='T01').length,
   rejoinAssignments:(out.diagnostics.rejoinWork??[]).filter(r=>r.teamId==='T01')
     .map(r=>({id:r.riderId,seconds:r.assignedS,frontS:r.actualFrontS})),
   rejoinObserved:out.diagnostics.rejoinAttempts??null,
   ownSprintEvents:out.events.filter(e=>e.type==='sprint'&&e.riderId===sprinter.id).map(e=>({
     km:+e.km.toFixed(2),description:e.description})),
   progression:capProgress
 }));
},{timeout:180000});
