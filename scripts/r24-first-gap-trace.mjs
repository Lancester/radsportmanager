/** R24: einmaliger Diagnose-Lauf; keine Änderung der Sportmechanik. */
import {createReferenceFixture} from '../src/engine/race/reference-fixtures.ts';
import {simulateRace} from '../src/engine/race/race-simulator.ts';
const seed=Number(process.argv[2]??2026);
const f=createReferenceFixture({routeId:'tdf25_hautacam',seed});
const segment=(name,lengthM,gradeFraction)=>({name,lengthM,gradeFraction,descentTechnicality:0});
const result=simulateRace({...f.input,
  title:'R24 erster physischer Gruppenriss',seed,
  segments:[segment('Ebene',10000,0),segment('Anstieg',5000,.04),
    segment('Abfahrt',5000,-.04),segment('Ebene',10000,0)],
  disableAttacks:true,enduranceModel:'off',
  groupRidingModel:'stable-pack',diagnosticFirstSplit:true,
  teams:f.input.teams.map(t=>({...t,strategy:'ausgewogen'}))});
console.log('R24_FIRST_GAP_SUMMARY '+JSON.stringify({
  seed,finishers:result.finisherCount,attacks:result.diagnostics.attacks,
  groupSplits:result.diagnostics.groupSplits,
  snapshots:result.snapshots.filter((_,i)=>i<8).map(x=>({
    km:x.km,groups:x.groupSizes.slice(0,5)}))
}));
