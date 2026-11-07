import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {initialLabSettings,buildLabRace} from '../src/labor/lab-settings.ts';
import {simulateRace as simulateV5} from '../src/engine/race/race-simulator.ts';

const SNAPSHOTS=Object.freeze({
  main:'621e712371563278c5bed2bb643dd598a9a7bcf4',
  audit:'1945e2d6b71289f90cca5dc8c793090a4af93341',
  v5:'feature/rennlab-tabs-rollen-live-20261107',
});
const settings=initialLabSettings();
settings.routeId='tdf25_lille';settings.seed=2026;
settings.teamCount=22;settings.myTeamId='T01';
settings.captainId='F001';settings.sprintLeaderId='F004';
settings.riderRoles={F002:'helfer',F004:'sprinter'};
settings.teams=[{teamId:'T01',strategy:'sprint'}];
const {input}=buildLabRace(settings);
input.diagnosticLevel='checkpoints';
assert.equal(input.riders.length,154);
assert.equal(input.teams.length,22);
assert.equal(input.riders.find(r=>r.id==='F001').role,'kapitaen');
assert.equal(input.riders.find(r=>r.id==='F004').role,'sprinter');
assert.ok(input.riders.every(r=>['kapitaen','sprinter','helfer'].includes(r.role)),
  'Common denominator: old main does not support frei.');
const physicalFields=['criticalPowerW','ftpW','wPrimeJ','massKg','bikeMassKg','dragAreaM2',
  'sprintSkill','sprintPeakPowerW','sprintDecayTimeS','durabilityFactor',
  'wPrimeRecoveryFactor','carbsGPerHour','wheelFindingSkill'];
const stableJson=JSON.stringify(input);
const hash=createHash('sha256').update(stableJson).digest('hex');
const normalizedKey=Object.keys(input).sort();
console.log('ENGINES_SHARED_INPUT',JSON.stringify({
  sha256:hash,seed:input.seed,riders:input.riders.length,teams:input.teams.length,
  route:settings.routeId,distanceKm:+(input.segments.reduce((x,s)=>x+s.lengthM,0)/1000).toFixed(1),
  model:{tactic:input.tacticModel,group:input.groupRidingModel,
    aero:input.aeroModel,endurance:input.enduranceModel},
  team:input.teams.find(t=>t.id==='T01'),
  riders:input.riders.filter(r=>['F001','F002','F004'].includes(r.id))
    .map(r=>({id:r.id,role:r.role,specialty:r.specialty,
      physical:Object.fromEntries(physicalFields.filter(k=>r[k]!==undefined).map(k=>[k,r[k]]))})),
  extraFieldsNote:'Main/Audit ignore new captainId/sprintLeaderId even though source input JSON is identical',
  refs:SNAPSHOTS,normalizedKey
}));
const oldModule=async name=>{
 const p=resolve(process.cwd(),'_comparisons',name,'src/engine/race/race-simulator.ts');
 const {simulateRace,validateRace}=await import(pathToFileURL(p).href);
 validateRace(structuredClone(input));
 return simulateRace;
};
const engines=[['main',await oldModule('main')],['audit',await oldModule('audit')],['v5',simulateV5]];
const around=(a,at)=>a?.reduce((best,x)=>Math.abs(x.km-at)<Math.abs(best.km-at)?x:best,a[0]);
const round=(x,n=1)=>x==null?null:+x.toFixed(n);
const getRole=(id)=>input.riders.find(r=>r.id===id);
const summary=(label,result)=>{
 const clas=result.classification;
 assert.equal(clas.length,154,label+' should have 154 finishers');
 assert.equal(result.winnerId,clas[0].id);
 for(const row of clas){
   assert.ok(Number.isFinite(row.gapS)&&row.gapS>=-1e-6);
   assert.ok(Number.isFinite(row.finishTimeS));
   assert.ok(Number.isFinite(row.energyResidualJ));
 }
 const cap=clas.find(r=>r.id==='F001'),spr=clas.find(r=>r.id==='F004');
 const cps=[50,70,75,90,120,150,180].map(k=>{
  const c=around(result.checkpoints,k);
  if(!c)return null;
  const captain=c.riders.find(r=>r.riderId==='F001');
  const sprinter=c.riders.find(r=>r.riderId==='F004');
  return {km:round(c.km),largestGroup:c.largestGroup,
   frontGroup:c.groupSizes[0],groupCount:c.groupCount,
   captainGroup:captain?.groupSize,capGroupIndex:captain?.groupIndex,
   captainGapM:round(captain?.gapToLeaderM),captainWPrimePct:round(captain?.wPrimeRemainingPct),
   sprintGroup:sprinter?.groupSize,sprGroupIndex:sprinter?.groupIndex,
   sprintGapM:round(sprinter?.gapToLeaderM)};
 }).filter(Boolean);
 const winner=clas[0]; const fin=(threshold)=>clas.filter(r=>r.gapS<=threshold+1e-6).length;
 const splitFromLeader=clas.map(r=>r.finishTimeS-winner.finishTimeS);
 const gangs=[];
 let current=[];
 for(const r of clas){
   if(current.length&&r.finishTimeS-current.at(-1).finishTimeS>1){
     gangs.push(current);current=[];
   }
   current.push(r);
 }
 if(current.length)gangs.push(current);
 return {
  engine:label,seed:result.seed,
  winner:{id:winner.id,role:winner.role,specialty:getRole(winner.id)?.specialty,
    team:winner.teamId,winTimeS:round(winner.finishTimeS)},
  winnerGroup1s:fin(1),winnerGroup3s:fin(3),winnerGroup10s:fin(10),
  winnerGroup30s:fin(30),winnerGroup60s:fin(60),
  largestConnectedFinishGroup1s:Math.max(...gangs.map(g=>g.length)),
  winnerConnectedFinishGroup1s:gangs[0].length,
  frontRiderSpecialties:clas.slice(0,10).map(r=>getRole(r.id)?.specialty??'unknown'),
  sprintersTop10:clas.slice(0,10).filter(r=>getRole(r.id)?.specialty==='sprinter').length,
  captain:{rank:cap.rank,gapS:round(cap.gapS),meanW:round(cap.averageCrankPowerW)},
  sprintTarget:{rank:spr.rank,gapS:round(spr.gapS),meanW:round(spr.averageCrankPowerW)},
  attacks:result.events.filter(e=>e.type==='attack').length,
  chases:result.events.filter(e=>e.type==='chase').length,
  breakaways:result.events.filter(e=>e.type==='breakaway').length,
  breaksCaught:result.events.filter(e=>e.type==='breakaway-caught').length,
  checkpoints:cps,first10:clas.slice(0,10).map(r=>({id:r.id,rank:r.rank,gapS:round(r.gapS)}))
 };
};
for(const [label,run] of engines){
 const copy=JSON.parse(stableJson);
 assert.equal(createHash('sha256').update(JSON.stringify(copy)).digest('hex'),hash);
 const result=run(copy);
 console.log('ENGINES_COMPARE_RESULT '+JSON.stringify(summary(label,result)));
}
console.log('ENGINES_COMPARE_COMPLETE '+JSON.stringify({
  order:engines.map(x=>x[0]),sameInputSha256:hash,
  testedAt:'2026-11-07',comparisonPurpose:'one Lille 154-rider race across three engines',
  interpretation:'not a tactic-only A/B: engine differences include physiology, fatigue, tactical APIs'
}));
