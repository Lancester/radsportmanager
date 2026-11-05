import {pathToFileURL} from 'node:url';
const root=process.argv[2];const imp=x=>import(pathToFileURL(root+'/src/engine/race/'+x+'.ts').href);
const {createReferenceFixture}=await imp('reference-fixtures');const {simulateRace}=await imp('race-simulator');
for(const roster of ['berg','flach']){
 const f=createReferenceFixture({routeId:'tdf25_hautacam',seed:123,...(roster==='flach'?{rosterKind:'flach'}:{})});
 const r=simulateRace({...f.input,groupRidingModel:'stable-pack',diagnosticLevel:'checkpoints'});const by=new Map(f.input.riders.map(a=>[a.id,a]));
 console.log(JSON.stringify({roster,winner:r.winnerId,top:r.classification.slice(0,10).map(x=>({id:x.id,rank:x.rank,specialty:by.get(x.id).specialty,gap:x.gapS,mass:by.get(x.id).massKg,cp:by.get(x.id).criticalPowerW,wPrime:by.get(x.id).wPrimeJ})),checkpoints:r.checkpoints.filter(c=>[120,135,150,165,175,180].some(k=>Math.abs(c.km-k)<.1)).map(c=>({km:c.km,riders:c.riders.filter(q=>r.classification.slice(0,10).some(z=>z.id===q.riderId&&by.get(z.id).specialty==='sprinter')).map(q=>({id:q.riderId,gap:q.gapToLeaderM,ownKm:q.positionM/1000,w:q.appliedPowerW,wPrime:q.wPrimeRemainingPct,availability:q.enduranceAvailabilityPct,group:q.groupSize}))}))}));
}
