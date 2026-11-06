/** R-24: identische Testbedingungen in zwei CHECKOUTS laufen lassen.
 * Nutzung:
 * node --experimental-strip-types scripts/r24-cohesion-ab.mjs /pfad/audit /pfad/versuch 2026
 * Jeder Checkout muss eine vollständige, passende Projektkopie enthalten.
 * Script läuft nur manuell, nicht per CI/bei Import.
 */
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';

const [auditArg,variantArg,seedArg='2026']=process.argv.slice(2);
if(!auditArg||!variantArg)throw new Error(
  'Bitte Pfade zum Audit- und Versuchscheckout angeben');
const seed=Number(seedArg);
if(!Number.isSafeInteger(seed)||seed<0)throw new Error('Seed ungueltig');
const segment=(name,lengthM,gradeFraction)=>({
  name,lengthM,gradeFraction,descentTechnicality:0,
});
const cases={
  flach:[segment('Ebene',30000,0)],
  anstieg_flach:[segment('Ebene',10000,0),
    segment('Anstieg',5000,.04),segment('Ebene',15000,0)],
  anstieg_abfahrt:[segment('Ebene',10000,0),
    segment('Anstieg',5000,.04),segment('Abfahrt',5000,-.04),
    segment('Ebene',10000,0)],
  langer_uebergang:[segment('Ebene',10000,0),
    segment('Anstieg',5000,.04),segment('Zwischenebene',2000,0),
    segment('Abfahrt',5000,-.04),segment('Ebene',8000,0)],
};
const run=async(dir)=>{
  const root=resolve(dir);
  const file=n=>pathToFileURL(root+'/src/engine/race/'+n+'.ts').href;
  const {createReferenceFixture}=await import(file('reference-fixtures'));
  const {simulateRace}=await import(file('race-simulator'));
  const fixture=createReferenceFixture({routeId:'tdf25_hautacam',seed});
  return Object.fromEntries(Object.entries(cases).map(([name,segments])=>{
    const r=simulateRace({...fixture.input,title:name,segments,
      disableAttacks:true,enduranceModel:'off',
      groupRidingModel:'stable-pack',diagnosticLevel:'checkpoints',
      teams:fixture.input.teams.map(t=>({...t,strategy:'ausgewogen'}))});
    return [name,{
      finishers:r.finisherCount,attacks:r.diagnostics.attacks,
      checkpoints:r.checkpoints.map(c=>({
        km:+c.km.toFixed(3),largest:c.largestGroup,
        groups:c.groupSizes.slice(0,6),
        spanM:+c.frontToBackM.toFixed(2),
      })),
      medianGapS:r.classification[Math.floor(r.classification.length/2)]?.gapS,
      winningId:r.winnerId,
    }];
  }));
};
const [audit,variant]=await Promise.all([run(auditArg),run(variantArg)]);
for(const name of Object.keys(cases)){
  const a=audit[name],b=variant[name];
  console.log(JSON.stringify({name,seed,audit:a,variant:b}));
}
