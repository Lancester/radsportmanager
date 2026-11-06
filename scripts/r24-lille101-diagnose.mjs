import {pathToFileURL} from 'node:url';
import {writeFileSync,renameSync} from 'node:fs';
import {createHash} from 'node:crypto';
const [root,mode,out]=process.argv.slice(2);const load=p=>import(pathToFileURL(root+'/src/engine/race/'+p+'.ts').href);
const {createReferenceFixture}=await load('reference-fixtures');const {simulateRace}=await load('race-simulator');
const f=createReferenceFixture({routeId:'tdf25_lille',seed:101});const input={...f.input,groupRidingModel:'stable-pack',diagnosticLevel:'checkpoints',...(mode==='ohne-angriffe'?{disableAttacks:true}:{})};
const comparable=input.riders.map(({durabilityFactor,wPrimeRecoveryFactor,...r})=>r);const commonHash=createHash('sha256').update(JSON.stringify({segments:input.segments,teams:input.teams,riders:comparable,seed:101})).digest('hex');
const started=Date.now();const race=simulateRace(input);const result={mode,commonHash,segments:input.segments,riders:input.riders,teams:input.teams,race,elapsedS:(Date.now()-started)/1000};writeFileSync(out+'.tmp',JSON.stringify(result));renameSync(out+'.tmp',out);console.log(JSON.stringify({mode,elapsedS:result.elapsedS,finishers:race.classification.length,winner:race.classification[0].id}));
