import {pathToFileURL} from 'node:url';
const [root,seedArg,noAttackArg]=process.argv.slice(2);const seed=Number(seedArg),disableAttacks=noAttackArg==='noattack';
const load=path=>import(pathToFileURL(root+'/src/engine/race/'+path+'.ts').href);
const {createReferenceFixture,REFERENCE_ROUTES}=await load('reference-fixtures');const {simulateRace}=await load('race-simulator');const {finishGroupMetrics}=await load('finish-groups');
const common=createReferenceFixture({routeId:'tdf25_lille',seed}).input;
for(const id of Object.keys(REFERENCE_ROUTES)){
 const f=createReferenceFixture({routeId:id,seed}); const r=simulateRace({...f.input,teams:common.teams,riders:common.riders,groupRidingModel:'stable-pack',diagnosticLevel:'checkpoints',...(disableAttacks?{disableAttacks:true}:{})});
 const types=new Map(common.riders.map(x=>[x.id,x.specialty]));let g=finishGroupMetrics(r.classification);let rows=r.classification;let a=[...rows].map(x=>x.gapS).sort((a,b)=>a-b);
 let checkpoints=(r.checkpoints??[]).filter(c=>[20,30,50,100,150,165,170,175,180].some(k=>Math.abs(c.km-k)<.1)).map(c=>({km:c.km,groups:c.groupSizes.slice(0,8),tracked:c.riders.filter(x=>['F078','F134','F117'].includes(x.riderId)).map(x=>({id:x.riderId,gap:x.gapToLeaderM,power:x.appliedPowerW,wprime:x.wPrimeRemainingPct,endurance:x.enduranceAvailabilityPct,group:x.groupSize}))}));
 console.log(JSON.stringify({root,seed,disableAttacks,route:id,winner:r.winnerId,winnerType:types.get(r.winnerId),top10:rows.slice(0,10).map(x=>types.get(x.id)),median:(a[76]+a[77])/2,within60:g.within60sOfWinner,group:g.winnerGroupSize,largest:g.largestGroupSize,attacks:r.diagnostics.attacks,breakaways:r.diagnostics.breakaways,catches:r.diagnostics.caughtBreakaways,checkpoints}));
}
