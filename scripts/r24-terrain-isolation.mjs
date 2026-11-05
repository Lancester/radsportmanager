/** Kontrollstrecken mit identischem Feld, nur Gelände unterschiedlich. */
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
const root=resolve(process.argv[3]??'.');
const load=file=>import(pathToFileURL(root+'/src/engine/race/'+file+'.ts').href);
const {createReferenceFixture}=await load('reference-fixtures');
const {simulateRace}=await load('race-simulator');
const seed=Number(process.argv[4]??2026);
if(!Number.isSafeInteger(seed)||seed<0)throw new Error('Ungültiger Seed');
const f=createReferenceFixture({routeId:'tdf25_hautacam',seed});
const segment=(name,lengthM,gradeFraction)=>({name,lengthM,gradeFraction,descentTechnicality:0});
const cases={
  flach:[segment('Flach',30000,0)],
  anstieg_flach:[segment('Flach',10000,0),segment('Anstieg',5000,.04),segment('Flach',15000,0)],
  anstieg_abfahrt:[segment('Flach',10000,0),segment('Anstieg',5000,.04),segment('Abfahrt',5000,-.04),segment('Flach',10000,0)],
  langer_uebergang:[segment('Flach',10000,0),segment('Anstieg',5000,.04),segment('Sanfter Übergang',2000,0),segment('Abfahrt',5000,-.04),segment('Flach',8000,0)],
};
const mode=process.argv[2]??'all';
for(const [name,segments] of Object.entries(cases)){
  if(mode!=='all'&&name!==mode)continue;
  const r=simulateRace({...f.input,title:name,segments,disableAttacks:true,
    groupRidingModel:'stable-pack',diagnosticLevel:'checkpoints',enduranceModel:'off',
    teams:f.input.teams.map(t=>({...t,strategy:'ausgewogen'}))});
  console.log(JSON.stringify({name,seed,participants:r.finisherCount,
    checkpoints:r.checkpoints.map(c=>({km:c.km,groups:c.groupSizes.slice(0,8),largest:c.largestGroup,
      spanM:c.frontToBackM})),
    finish:r.classification.map(x=>({id:x.id,gapS:x.gapS})),
    attacks:r.diagnostics.attacks}));
}
