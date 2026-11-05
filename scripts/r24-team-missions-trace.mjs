/** Wiederholbare Einzelrenn-Diagnose; keine Aenderung an der Engine.
 * node --experimental-strip-types scripts/r24-schritt2-diagnose.mjs <repo-root> <liege|berg|berg-ohne-attacken>
 * repo-root erlaubt gepaarte Gegenproben auf einem anderen Checkout.
 */
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
const [rootArg,scenario]=process.argv.slice(2);
if(!rootArg||!['liege','berg','berg-ohne-attacken'].includes(scenario))
  throw new Error('Aufruf: <repo-root> <liege|berg|berg-ohne-attacken>');
const root=resolve(rootArg);
const load=file=>import(pathToFileURL(root+'/src/engine/race/'+file+'.ts').href);
const {createReferenceFixture}=await load('reference-fixtures');
const {simulateRace}=await load('race-simulator');
const routeId=scenario==='liege'?'lbl25_liege':'tdf25_hautacam';
const ids=scenario==='liege'?['F009','F036','F078']:['F078','F134'];
const kilometers=scenario==='liege'?[100,160,180,190,205,218,220,230,239,245,250]:[20,25,30,40,50,90,120,135,145,165,175,180];
const fixture=createReferenceFixture({routeId,seed:2026});
const result=simulateRace({...fixture.input,groupRidingModel:'stable-pack',
  diagnosticLevel:'checkpoints',...(scenario==='berg-ohne-attacken'?{disableAttacks:true}:{})});
const profiles=fixture.input.riders.filter(r=>ids.includes(r.id)).map(r=>({
  id:r.id,teamId:r.teamId,role:r.role,specialty:r.specialty,massKg:r.massKg,
  criticalPowerW:r.criticalPowerW,wPrimeJ:r.wPrimeJ,sprintPeakPowerW:r.sprintPeakPowerW,
  teamStrategy:fixture.input.teams.find(t=>t.id===r.teamId)?.strategy}));
const checkpoints=kilometers.map(km=>result.checkpoints.find(c=>c.km>=km)).filter(Boolean).map(c=>({
  leaderKm:c.km,groupSizes:c.groupSizes.slice(0,8),
  riders:c.riders.filter(r=>ids.includes(r.riderId)).map(r=>({id:r.riderId,
    ownKm:r.positionM/1000,gapM:r.gapToLeaderM,groupIndex:r.groupIndex,
    groupSize:r.groupSize,
    speedKmh:r.speedKmh,watts:r.appliedPowerW,dayCpW:r.dayCpW,
    wPrimePct:r.wPrimeRemainingPct,availabilityPct:r.enduranceAvailabilityPct,
    carbohydrateKcal:r.carbohydrateKcal,aeroFactor:r.aeroFactor}))}));
const classification=result.classification.filter(r=>ids.includes(r.id)).map(r=>({
  id:r.id,rank:result.classification.indexOf(r)+1,gapS:r.gapS,
  averageCrankPowerW:r.averageCrankPowerW,finalWPrimeJ:r.finalWPrimeJ}));
const events=result.events.filter(e=>['T12','T20'].includes(e.teamId)&&['team-chase','team-pace','attack'].includes(e.type));
console.log(JSON.stringify({scenario,routeId,seed:2026,disableAttacks:scenario==='berg-ohne-attacken',
  totalCheckpoints:result.checkpoints.length,winnerId:result.winnerId,profiles,classification,events,checkpoints,rejoinWork:result.diagnostics.rejoinWork}));
