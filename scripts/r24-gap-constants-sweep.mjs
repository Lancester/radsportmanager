/**
 * ONE-OFF diagnosis: never modify project source or create a branch.
 * Each variant copies the unchanged V5 source into a disposable _gap_sweep folder.
 * Variants differ in exactly ONE of the two named constants.
 */
import {cpSync,readFileSync,writeFileSync,mkdirSync,rmSync} from 'node:fs';
import {resolve,join} from 'node:path';
import {spawnSync} from 'node:child_process';

const repo=process.cwd();
const root=resolve(repo,'_gap_sweep');
// Second, still single-seed quick experiment. Previous extremes are preserved
// in workflow run 42379116153; use only intermediate split thresholds here.
const variants=[
 {name:'split-55-85',split:55,reconnect:85},
 {name:'split-65-85',split:65,reconnect:85},
 {name:'split-75-85',split:75,reconnect:85},
];
const runner=String.raw`
import {createHash} from 'node:crypto';
import {initialLabSettings,buildLabRace} from '../src/labor/lab-settings.ts';
import {simulateRace} from '../src/engine/race/race-simulator.ts';
const [name,split,reconnect]=process.argv.slice(2);
const s=initialLabSettings();
s.routeId='tdf25_lille';s.seed=2026;s.teamCount=22;
s.myTeamId='T01';s.captainId='F001';s.sprintLeaderId='F004';
s.riderRoles={F002:'frei',F004:'sprinter'};
s.teams=[{teamId:'T01',strategy:'sprint'}];
const {input}=buildLabRace(s);
input.diagnosticLevel='checkpoints';
const hash=createHash('sha256').update(JSON.stringify(input)).digest('hex');
const result=simulateRace(input);
const cls=result.classification;
const winner=cls[0];
const rider=id=>cls.find(r=>r.id===id);
const cp=km=>{
  const c=(result.checkpoints??[]).reduce((best,x)=>
    best===null||Math.abs(x.km-km)<Math.abs(best.km-km)?x:best,null);
  if(!c)return null;
  const captain=c.riders.find(r=>r.riderId==='F001');
  const sprint=c.riders.find(r=>r.riderId==='F004');
  return {km:Math.round(c.km*10)/10,
    largestGroup:Math.max(...c.groupSizes),
    frontGroup:c.groupSizes[0],
    captainGroup:captain?.groupSize,capGroupIndex:captain?.groupIndex,
    capGapM:Math.round(captain?.gapToLeaderM??0),
    sprinterGroup:sprint?.groupSize,
    sprintGapM:Math.round(sprint?.gapToLeaderM??0)};
};
const type=id=>input.riders.find(r=>r.id===id)?.specialty??'';
const within=t=>cls.filter(r=>r.finishTimeS-winner.finishTimeS<=t+1e-6).length;
const groups=[];
for(const r of cls){
  let g=groups.at(-1);
  if(!g||r.finishTimeS-g.at(-1).finishTimeS>1){g=[];groups.push(g);}
  g.push(r);
}
console.log('GAP_VARIANT_RESULT '+JSON.stringify({
 name,groupSeparationM:+split,reconnectGapM:+reconnect,
 inputSha256:hash,seed:input.seed,teamCount:input.teams.length,riders:input.riders.length,
 winner:{id:winner.id,type:type(winner.id),role:winner.role},
 top10SprinterCount:cls.slice(0,10).filter(r=>type(r.id)==='sprinter').length,
 winnerGroup1s:within(1),winnerGroup3s:within(3),
 winnerGroup10s:within(10),winnerGroup30s:within(30),
 winnerConnected1s:groups[0]?.length??0,
 largestConnected1s:Math.max(...groups.map(g=>g.length)),
 captain:{rank:rider('F001').rank,gapS:+rider('F001').gapS.toFixed(1),
   avgW:+rider('F001').averageCrankPowerW.toFixed(1)},
 sprintTarget:{rank:rider('F004').rank,gapS:+rider('F004').gapS.toFixed(1)},
 attacks:result.events.filter(e=>e.type==='attack').length,
 chases:result.events.filter(e=>e.type==='chase').length,
 checkpoints:[40,50,60,70,75,90,120,150,180].map(cp),
}));
`;
const replaceOnce=(file,from,to)=>{
 const s=readFileSync(file,'utf8');
 if(s.split(from).length!==2)throw new Error('Expected exactly one match in '+file);
 writeFileSync(file,s.replace(from,to));
};
rmSync(root,{recursive:true,force:true});
mkdirSync(root,{recursive:true});
const results=[];
for(const v of variants){
  const dir=join(root,v.name);
  mkdirSync(dir,{recursive:true});
  cpSync(join(repo,'src'),join(dir,'src'),{recursive:true});
  mkdirSync(join(dir,'tests'),{recursive:true});
  writeFileSync(join(dir,'tests','run.mjs'),runner);
  replaceOnce(join(dir,'src/engine/race/stable-pack.ts'),'reconnectGapM:85,','reconnectGapM:'+v.reconnect+',');
  replaceOnce(join(dir,'src/engine/race/peloton.ts'),'groupSeparationM:42,','groupSeparationM:'+v.split+',');
  console.log('GAP_SWEEP_START '+v.name);
  const run=spawnSync(process.execPath,['--experimental-strip-types',
      join(dir,'tests','run.mjs'),v.name,String(v.split),String(v.reconnect)],
     {encoding:'utf8',timeout:180000,maxBuffer:2*1024*1024});
  if(run.status!==0){
    console.error(run.stderr);
    console.error(run.stdout);
    throw new Error(v.name+' failed code '+run.status+', '+(run.error?.message??''));
  }
  const line=run.stdout.split('\n').find(x=>x.startsWith('GAP_VARIANT_RESULT '));
  if(!line)throw new Error('Result missing '+v.name+': '+run.stdout.slice(0,800));
  const result=JSON.parse(line.slice('GAP_VARIANT_RESULT '.length));
  results.push(result);
  console.log(line);
}
if(new Set(results.map(r=>r.inputSha256)).size!==1)throw new Error('INPUT SHA mismatch: this is not an A/B test');
console.log('GAP_SWEEP_VERIFIED '+JSON.stringify({variants:results.length,
  sameInputSha256:results[0].inputSha256,
  reference:'exact V5 screenshot scenario: F001 captain, F004 target sprinter, F002 free',
  engineSource:'same V5 code except one scalar in one module per variant',
  noPhysicalBonuses:true,noCommittedEngineModifications:true}));
