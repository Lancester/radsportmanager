import test from 'node:test';
import assert from 'node:assert/strict';
import {initialLabSettings,buildLabRace} from '../src/labor/lab-settings.ts';
import {simulateRace} from '../src/engine/race/race-simulator.ts';
import {DEFAULT_TEAM_PLAN} from '../src/engine/race/team-tactical-plan.ts';

test('V5: die exakte Gruppen-Trennstelle bei km 70–80 und unabhaengige Sprintziel-Gegenprobe',()=>{
 const s=initialLabSettings();
 s.routeId='tdf25_lille';s.seed=2026;s.teamCount=22;
 s.myTeamId='T01';s.captainId='F001';s.sprintLeaderId='F004';
 s.riderRoles={F002:'frei',F004:'sprinter'};
 s.teams=[{teamId:'T01',strategy:'sprint',
   tacticalPlan:{...DEFAULT_TEAM_PLAN,finale:'sprint'}}];
 const input=buildLabRace(s).input;
 console.log('SPLIT_PROFILES',JSON.stringify(input.riders.filter(r=>
   ['F001','F004','F002'].includes(r.id)).map(r=>({
   id:r.id,role:r.role,specialty:r.specialty,cp:r.criticalPowerW,
   mass:r.massKg,bike:r.bikeMassKg,drag:r.dragAreaM2,wPrime:r.wPrimeJ,
   dur:r.durabilityFactor
 }))));
 const at=new Map();
 const out=simulateRace(input,undefined,'T01',{
   riderIds:new Set(input.riders.map(r=>r.id)),
   fromKm:63,toKm:86,everySeconds:5,
   onSample:r=>{
     if(r.raceKm<69||r.raceKm>79)return;
     let m=at.get(r.timeS);
     if(!m){m=[];at.set(r.timeS,m);}
     m.push({id:r.id,p:r.positionM,v:r.speedMps,w:r.appliedPowerW,
       request:r.finalRequestedW,groupReq:r.groupRequestedW,
       aero:r.aeroFactor,cp:r.dayCpW,wPrime:r.wPrimePct,
       wheel:r.frontGapM,groupSize:r.groupSize,groupPacerId:r.groupPacerId,
       groupAcc:r.groupPacerAccelerationMps2,grade:r.gradeFraction,
       intent:r.intent,mission:r.crewMission,raceKm:r.raceKm});
   },
 });
 const frames=[...at.entries()].sort((a,b)=>a[0]-b[0])
   .map(([t,riders])=>{
     const sorted=[...riders].sort((a,b)=>b.p-a.p||a.id.localeCompare(b.id));
     const groups=[];
     for(const r of sorted){
       let last=groups.at(-1);
       if(!last||last.at(-1).p-r.p>42){last=[];groups.push(last);}
       last.push(r);
     }
     const captain=riders.find(r=>r.id==='F001');
     const sprint=riders.find(r=>r.id==='F004');
     if(!captain||!sprint)return null;
     const ci=groups.findIndex(g=>g.some(r=>r.id==='F001'));
     const si=groups.findIndex(g=>g.some(r=>r.id==='F004'));
     const cg=groups[ci],preceding=ci?groups[ci-1]:null;
     return {t,km:captain.raceKm,ci,si,captain,sprint,
       count:riders.length,groupSize:cg.length,
       capLeader:cg[0].id,capLast:cg.at(-1).id,
       gapToPrevious:preceding?preceding.at(-1).p-cg[0].p:null,
       prevLast:preceding?.at(-1).id??null,
       prevLastInfo:preceding?.at(-1)??null,
       capGroup:cg.map(r=>r.id),
       separatedM:sprint.p-captain.p,
       frontSize:groups[0].length,
       larger:groups.map(g=>g.length).filter(z=>z>5).slice(0,7)};
   }).filter(Boolean);
 assert.ok(frames.length>50,'Gruppenverlauf im kritischen Kilometerfenster');
 const firstSmall=frames.find(r=>r.groupSize<50);
 const firstVerySmall=frames.find(r=>r.groupSize<=10);
 const brief=r=>({
   time:r.t,km:+r.km.toFixed(2),capGroup:r.groupSize,
   captainIndex:r.ci,sprinterIndex:r.si,
   groupFront:r.capLeader,groupEnd:r.capLast,
   preceding:r.prevLast,gapAhead:r.gapToPrevious===null?null:+r.gapToPrevious.toFixed(1),
   separation:+r.separatedM.toFixed(1),activeInTrace:r.count,
   groups:r.larger,
   captain:{v:+(r.captain.v*3.6).toFixed(1),w:+r.captain.w.toFixed(0),
     request:+r.captain.request.toFixed(0),groupRequest:+r.captain.groupReq.toFixed(0),
     aero:+r.captain.aero.toFixed(3),cp:r.captain.cp,
     wPrime:+r.captain.wPrime.toFixed(0),wheelGap:r.captain.wheel,
     groupAcc:r.captain.groupAcc},
   sprint:{v:+(r.sprint.v*3.6).toFixed(1),w:+r.sprint.w.toFixed(0),
     request:+r.sprint.request.toFixed(0),wPrime:+r.sprint.wPrime.toFixed(0)},
   previous:!r.prevLastInfo?null:{
     id:r.prevLastInfo.id,v:+(r.prevLastInfo.v*3.6).toFixed(1),
     w:+r.prevLastInfo.w.toFixed(0),
     request:+r.prevLastInfo.request.toFixed(0),
     cp:r.prevLastInfo.cp,wPrime:+r.prevLastInfo.wPrime.toFixed(0)
   },
 });
 console.log('SPLIT_FIRST_UNDER_50',JSON.stringify(firstSmall?brief(firstSmall):null));
 console.log('SPLIT_FIRST_UNDER_10',JSON.stringify(firstVerySmall?brief(firstVerySmall):null));
 if(firstVerySmall)console.log('SPLIT_TRANSITION',JSON.stringify(frames
   .filter(r=>Math.abs(r.t-firstVerySmall.t)<=60&&
       Math.round((r.t-firstVerySmall.t)/5)%2===0)
   .map(brief)));
 console.log('SPLIT_HALF_KM',JSON.stringify([69,70,71,72,73,74,75,76,77,78]
   .map(k=>frames.reduce((best,x)=>
     Math.abs(x.km-k)<Math.abs(best.km-k)?x:best,frames[0]))
   .map(brief)));
 console.log('SPLIT_ORIGINAL_FINISH',JSON.stringify(out.classification.filter(x=>
   ['F001','F004'].includes(x.id)).map(x=>({
     id:x.id,rank:x.rank,gap:+x.gapS.toFixed(1),meanW:+x.averageCrankPowerW.toFixed(0),
     remainingWPrime:+x.finalWPrimeJ.toFixed(0)
   }))));
 // Kontrollvariante: nur das Sprintziel umlegen; gleiche Strecken-
 // und Profilwerte, keine Energie- oder Positionsgutschrift.
 const contrast=structuredClone(s);
 contrast.sprintLeaderId='F001';
 const inputB=buildLabRace(contrast).input;
 for(const r of input.riders){
   const b=inputB.riders.find(z=>z.id===r.id);
   assert.ok(b);
   for(const field of ['criticalPowerW','ftpW','wPrimeJ','massKg','bikeMassKg',
     'dragAreaM2','sprintSkill','durabilityFactor'])
     assert.equal(r[field],b[field],r.id+' '+field);
 }
 const resultB=simulateRace(inputB);
 console.log('SPLIT_TARGET_AB',JSON.stringify({
   A:{captain:out.classification.find(x=>x.id==='F001').rank,
      target:out.classification.find(x=>x.id==='F004').rank},
   B:{captain:resultB.classification.find(x=>x.id==='F001').rank,
      formerTarget:resultB.classification.find(x=>x.id==='F004').rank},
   changedRoles:[
     input.riders.find(x=>x.id==='F001').role,
     inputB.riders.find(x=>x.id==='F001').role
   ]
 }));
},{timeout:200000});
