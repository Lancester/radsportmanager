/** R24: Gegenprüfung der beiden offenen Engine-Abnahmepunkte.
 * Nur vorhandene, passive Telemetrie; keine Änderung an Taktik/Physik.
 * node --experimental-strip-types scripts/r24-final-two-diagnosis.mjs AUDIT PR84 SEED ROUTE
 */
import {resolve} from 'node:path';import {pathToFileURL} from 'node:url';
const [auditDir,variantDir,seedArg,route]=process.argv.slice(2);
if(!auditDir||!variantDir||!seedArg||!['tdf25_lille','lbl25_liege'].includes(route))throw Error('AUDIT PR84 seed tdf25_lille|lbl25_liege');
const seed=Number(seedArg);
const load=(dir,name)=>import(pathToFileURL(resolve(dir)+'/src/engine/race/'+name+'.ts').href);
const [f,oldModel,newModel]=await Promise.all([
 load(auditDir,'reference-fixtures'),load(auditDir,'race-simulator'),load(variantDir,'race-simulator')]);
const fixture=f.createReferenceFixture({routeId:route,seed});
const field=new Map(fixture.input.riders.map(r=>[r.id,r]));
const rInput={...fixture.input,groupRidingModel:'stable-pack',diagnosticLevel:'checkpoints'};
const round=n=>n===null||n===undefined?null:+n.toFixed(2);
const analyze=(race)=>{
 const n=race.diagnostics.namedChaseLeader;
 const missed=n.missed;
 const total=n.assignedSeconds;
 const types={};
 for(const r of fixture.input.riders){const x=r.specialty;types[x]??={count:0,cpWKg:0,cpMassKg:0};types[x].count++;types[x].cpWKg+=r.criticalPowerW/r.massKg;types[x].cpMassKg+=r.criticalPowerW/(r.massKg+r.bikeMassKg)}
 for(const x of Object.values(types)){x.cpWKg=round(x.cpWKg/x.count);x.cpMassKg=round(x.cpMassKg/x.count)}
 const ranks=race.classification.map(q=>({id:q.id,type:field.get(q.id)?.specialty,rank:q.rank,role:q.role,gapS:round(q.gapS),massKg:field.get(q.id)?.massKg,cpW:field.get(q.id)?.criticalPowerW,cpWkg:round(field.get(q.id).criticalPowerW/field.get(q.id).massKg),wPrimeJ:field.get(q.id)?.wPrimeJ}));
 const idRanks=new Map(ranks.map(x=>[x.id,x.rank]));
 const snapshots=(race.checkpoints??[]).filter(c=>[.5,.7,.85,.95].some(p=>Math.abs(c.km/race.distanceM*1000-p)<.02)).map(c=>{
  const typesFront=c.riders.filter(r=>r.groupIndex===0).reduce((o,r)=>{o[r.specialty]=(o[r.specialty]??0)+1;return o},{});
  const typesTop20=c.riders.slice().sort((a,b)=>a.gapToLeaderM-b.gapToLeaderM).slice(0,20).reduce((o,r)=>{o[r.specialty]=(o[r.specialty]??0)+1;return o},{});
  const favs=ranks.slice(0,5).map(a=>{const r=c.riders.find(q=>q.riderId===a.id);return {id:a.id,rank:a.rank,group:r?.groupIndex,gapM:round(r?.gapToLeaderM),wPrimePct:round(r?.wPrimeRemainingPct),endurancePct:round(r?.enduranceAvailabilityPct),power:round(r?.appliedPowerW)}});
  return {km:round(c.km),topGroup:c.groupSizes[0],largest:c.largestGroup,typesFront,typesTop20,finalTop5:favs};
 });
 const earlyLeaderHandoffs=(race.diagnostics.namedChaseHandoffs??[]).slice(0,120).map(x=>({km:round(x.km),reason:x.reason,age:x.assignmentAgeS,gap:round(x.frontGapM)}));
 return {
   winner:race.winnerId,top10:ranks.slice(0,10),typeProfiles:types,
   finishMedianS:round(ranks.slice().sort((a,b)=>a.gapS-b.gapS)[76]?.gapS),
   named:{assigned:total,front:n.frontSeconds,nearCp:n.cpNearFrontSeconds,
     exposed:n.exposedSeconds,exposedCp:n.exposedCpNearSeconds,
     longestFront:n.longestFrontSeconds,longestNearCp:n.longestCpNearSeconds,
     longestExposedCp:n.longestExposedCpNearSeconds,meanFrontW:n.meanFrontPowerW,
     missed,missedShares:Object.fromEntries(Object.entries(missed).map(([k,v])=>[k,round(total?v/total:0)])),
     topRiders:n.riders.slice(0,5)},
   chaseGeneral:{frontS:race.diagnostics.mainFieldFrontWorkWithAssignedChaserS,
     longestMainFieldStintS:race.diagnostics.longestMainFieldChaserStintS,
     chaserChanges:race.diagnostics.mainFieldChaserLeaderChanges,
     orderedRelayTeamS:race.diagnostics.orderedRelayTeamSeconds,
     spentChaseHelpers:race.diagnostics.spentChaseHelpers,
     spentChaseHelperIds:race.diagnostics.spentChaseHelperIds?.slice(0,7)},
   handoffs:{count:race.diagnostics.namedChaseHandoffs?.length,
     reasons:earlyLeaderHandoffs.reduce((m,x)=>{m[x.reason]=(m[x.reason]??0)+1;return m},{}),
     samples:earlyLeaderHandoffs.slice(0,18)},
   classics:{approachSeconds:race.diagnostics.classicsApproachSeconds,
     rampTempoSeconds:race.diagnostics.classicsRampTempoSeconds,
     rampRiderTypes:Object.fromEntries((race.diagnostics.classicsRampTempoRiderIds??[]).reduce((o,id)=>{const t=field.get(id)?.specialty??'unknown';o.set(t,(o.get(t)??0)+1);return o},new Map())),
     activeRiders:(race.diagnostics.classicsRampTempoRiderIds??[]).map(id=>({id,type:field.get(id)?.specialty,rank:idRanks.get(id)}))},
   snapshot: snapshots,
   checkpointsCount:race.checkpoints?.length??0,
 };
};
console.log('R24_LAST_TWO '+JSON.stringify({route,seed,ascentM:fixture.modelledAscentM,
  audit:analyze(oldModel.simulateRace(rInput)),
  pr84:analyze(newModel.simulateRace(rInput))}));
