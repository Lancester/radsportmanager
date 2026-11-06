import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
const [auditPath,variantPath,seedText,route]=process.argv.slice(2);
if(!auditPath||!variantPath||!seedText||!['boulogne','hautacam'].includes(route))throw Error('AUDIT VARIANT SEED boulogne|hautacam');
const seed=Number(seedText),get=(dir,name)=>import(pathToFileURL(resolve(dir)+'/src/engine/race/'+name+'.ts').href);
const [fix,base,variant]=await Promise.all([get(auditPath,'reference-fixtures'),get(auditPath,'race-simulator'),get(variantPath,'race-simulator')]);
const input={...fix.createReferenceFixture({routeId:'tdf25_'+route,seed}).input,groupRidingModel:'stable-pack',diagnosticLevel:'checkpoints'};
const summarize=r=>({
 winner:r.winnerId,chaseEvents:r.diagnostics.chases,
 attacks:r.diagnostics.attacks,breakaways:r.diagnostics.breakaways,
 catches:r.diagnostics.caughtBreakaways,
 physical:r.diagnostics.chasePhysicalAudit??null,
 decisions:r.diagnostics.chaseDecisionAudit??null,
 check:r.checkpoints.filter(x=>[20,30,100,150,175,180,200,205].some(k=>Math.abs(x.km-k)<.15)).map(x=>({
  km:+x.km.toFixed(2),front:x.groupSizes[0],largest:x.largestGroup,
  groups:x.groupCount,spanKm:+(x.frontToBackM/1000).toFixed(2)})),
});
const a=summarize(base.simulateRace(input)),b=summarize(variant.simulateRace(input));
if(!a.physical||!b.physical)throw Error('Passiver gemeinsamer Messpfad fehlt');
console.log('R24_PHYSICAL_CHASE '+JSON.stringify({route,seed,audit:a,experiment:b}));
