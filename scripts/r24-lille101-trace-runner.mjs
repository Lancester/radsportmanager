import {pathToFileURL} from 'node:url';
import {appendFileSync,writeFileSync} from 'node:fs';
const root=process.argv[2],out=process.argv[3],load=p=>import(pathToFileURL(root+'/src/engine/race/'+p+'.ts').href);
const {createReferenceFixture}=await load('reference-fixtures');const {simulateRace}=await load('race-simulator');const f=createReferenceFixture({routeId:'tdf25_lille',seed:101});
writeFileSync(out,'');globalThis.__r24trace=row=>appendFileSync(out,JSON.stringify(row)+'\n');
const result=simulateRace({...f.input,groupRidingModel:'stable-pack',diagnosticLevel:'checkpoints'});
writeFileSync(out+'.result.json',JSON.stringify({classification:result.classification,events:result.events,diagnostics:result.diagnostics}));
console.log(JSON.stringify({winner:result.classification[0].id,finishers:result.classification.length,events:result.events.length}));
