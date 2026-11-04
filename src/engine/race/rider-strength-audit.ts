/**
 * R-22: unabhängiger Favoriten-/Leistungsabgleich vor dem Rennen.
 *
 * Ausschließlich DIAGNOSE. Keine Watt-/Zeit-/Positionsvorgabe an die KI.
 * Stärken werden VOR der Simulation rein aus den gemeldeten Fahrerprofilen
 * berechnet, NICHT aus Zielplatz, Renn-KI-Verhalten oder Ergebnisdaten.
 *
 * Die Indizes sind bewusst transparente, vereinfachte Fähigkeitenproxies,
 * KEINE wissenschaftlich geeichten Prognosen für ein 200-km-Profi-Rennen.
 */
import type {RaceRider,RaceClassification} from './race-simulator.ts';

export type StrengthCategory='sprinter'|'kletterer'|'klassiker'|
  'zeitfahrer'|'allrounder';
export type RaceKind='flach'|'huegelig'|'klassiker'|'berg';

const CATEGORIES:readonly StrengthCategory[]=[
  'sprinter','kletterer','klassiker','zeitfahrer','allrounder',
];
const ROUND=(n:number)=>+n.toFixed(2);
const finite=(value:number)=>Number.isFinite(value)&&value>=0;

/** Stationäres Fahrtempo allein, keine Windschatten- oder Taktikgutschrift. */
export function soloSteadySpeedKmh(r:RaceRider,gradeFraction:number):number{
  if(!r||!Number.isFinite(gradeFraction)||gradeFraction<0||
    gradeFraction>0.2||r.criticalPowerW<=0||
    !finite(r.massKg)||!finite(r.bikeMassKg)||r.dragAreaM2<=0)
    throw new RangeError('R22 Favoriten: ungültiges Rad-/Steigungsprofil');
  const mass=r.massKg+r.bikeMassKg;
  const theta=Math.atan(gradeFraction);
  const gravity=mass*9.80665*Math.sin(theta);
  const rolling=mass*9.80665*0.004*Math.cos(theta);
  let low=0,high=45;
  for(let i=0;i<75;i++){
    const v=(low+high)/2;
    const drag=.5*1.2*r.dragAreaM2*v*v;
    const watts=(gravity+rolling+drag)*v/0.975;
    if(watts>r.criticalPowerW)high=v;
    else low=v;
  }
  return (low+high)*1.8; // m/s -> km/h
}
/** Profilwert: CP + begrenzte W'-Arbeitsleistung während 180 s. */
export function threeMinutePowerW(r:RaceRider):number{
  if(!r||r.criticalPowerW<=0||r.wPrimeJ<=0)
    throw new RangeError('R22 Favoriten: CP/Wprime');
  return r.criticalPowerW+r.wPrimeJ/180;
}
function measure(r:RaceRider,kind:StrengthCategory):number{
  const mass=r.massKg+r.bikeMassKg;
  if(mass<=0)throw new RangeError('R22 Favoriten: Masse');
  switch(kind){
    case 'sprinter':
      // Tatsächliche Sprint-Wattanfrage aus chooseRacePower. Kein
      // erfundener Spitzenwatt-Bonus oder vorausgesagter Zielsprint.
      return r.criticalPowerW+180+210*r.sprintSkill;
    case 'kletterer':
      return soloSteadySpeedKmh(r,.08);
    case 'klassiker':
      return threeMinutePowerW(r)/mass;
    case 'zeitfahrer':
      return soloSteadySpeedKmh(r,0);
    case 'allrounder':
      // Gleichgewicht aus Flach- und Bergstärke, bewusst als Index.
      return .5*soloSteadySpeedKmh(r,0)/40+
        .5*soloSteadySpeedKmh(r,.08)/20;
  }
}
export function categoryStrength(
  riders:readonly RaceRider[],
  category:StrengthCategory,
  restrictToSpecialty=true,
):Array<{riderId:string;score:number;baseCpW:number;
  wattsPerKg:number;wPrimeJ:number;role:string;specialty:string}>{
  if(!CATEGORIES.includes(category)||!riders.length)
    throw new RangeError('R22 Favoriten: Kategorie/Feld');
  const entries=riders.filter(r=>!restrictToSpecialty||
    r.specialty===category).map(r=>({
      riderId:r.id,score:ROUND(measure(r,category)),
      // Tie-Break mithilfe des ungerundeten Scores unten.
      rawScore:measure(r,category),
      baseCpW:r.criticalPowerW,
      wattsPerKg:ROUND(r.criticalPowerW/(r.massKg+r.bikeMassKg)),
      wPrimeJ:r.wPrimeJ,role:r.role,specialty:r.specialty??'unbekannt',
  })).sort((a,b)=>b.rawScore-a.rawScore||
    a.riderId.localeCompare(b.riderId));
  return entries.map(({rawScore,...r})=>r);
}
export function buildRiderFavoritesAudit(
  riders:readonly RaceRider[],
  results:readonly RaceClassification[],
  raceKind:RaceKind,
){
  if(!['flach','huegelig','klassiker','berg'].includes(raceKind)||
    !riders.length||riders.length!==results.length)
    throw new RangeError('R22 Favoriten: Feld/Rennart/Zielergebnis');
  const allIds=new Set(riders.map(r=>r.id));
  const resultById=new Map(results.map(r=>[r.id,r]));
  if(allIds.size!==riders.length||resultById.size!==riders.length||
    riders.some(r=>!resultById.has(r.id)))
    throw new RangeError('R22 Favoriten: Fahrer-IDs unvollständig');
  const selected:Record<RaceKind,StrengthCategory>={
    flach:'sprinter',huegelig:'klassiker',
    klassiker:'klassiker',berg:'kletterer',
  };
  const preferred=selected[raceKind];
  const describe=(r:ReturnType<typeof categoryStrength>[number],
    strengthRank:number)=>({
    riderId:r.riderId,strengthRank,
    category:r.specialty,role:r.role,strengthScore:r.score,
    baseCpW:r.baseCpW,baseWattsPerKg:r.wattsPerKg,
    wPrimeJ:r.wPrimeJ,finishRank:resultById.get(r.riderId)!.rank,
    finishGapS:ROUND(resultById.get(r.riderId)!.gapS),
  });
  const perCategory=CATEGORIES.map(category=>{
    const order=categoryStrength(riders,category,true);
    if(!order.length)throw new RangeError('R22 Favoriten: leere Kategorie '+category);
    return {
      category,strengthMetric:
        category==='sprinter'?'Zielsprint-Wattanfrage (W)':
        category==='kletterer'?'8%-Solo-Steigtempo bei Basis-CP (km/h)':
        category==='klassiker'?'3-min-CP/Wprime-Envelope pro Gesamtkg (W/kg)':
        category==='zeitfahrer'?'Solo-Flachtempo bei Basis-CP (km/h)':
        '50% normiertes Solo-Flach- und 8%-Bergtempo (Index)',
      participants:order.length,
      strongest:describe(order[0],1),
      topThree:order.slice(0,3).map((r,i)=>describe(r,i+1)),
      // Nicht nur Siegerwertung; zeichnet ab, ob Favoriten vorne landen.
      topThreeMeanFinishRank:ROUND(
        order.slice(0,3).reduce((n,r)=>n+resultById.get(r.riderId)!.rank,0)/
        Math.min(3,order.length)),
      topThreeInTop10:order.slice(0,3).filter(r=>
        resultById.get(r.riderId)!.rank<=10).length,
    };
  });
  const overall=categoryStrength(riders,preferred,false);
  const raceTop=overall.slice(0,3).map((r,i)=>describe(r,i+1));
  const winner=results.find(r=>r.rank===1);
  if(!winner)throw new RangeError('R22 Favoriten: Sieger fehlt');
  return {
    raceKind,preferredCategory:preferred,
    // Stärkster geeigneter Fahrertyp und stärkster im GESAMTEN Feld
    // können voneinander abweichen: beide werden ausgewiesen.
    profileFavorite:raceTop[0],
    profileTopThree:raceTop,
    winnerId:winner.id,
    winnerProfileStrengthRank:overall.findIndex(r=>r.riderId===winner.id)+1,
    topTenProfileStrengthPositions:results.filter(r=>r.rank<=10)
      .map(r=>({id:r.id,finishRank:r.rank,
        profileStrengthRank:overall.findIndex(x=>x.riderId===r.id)+1})),
    perCategory,
    method:'pre-race-independent-proxies-no-results-in-ranking',
    calibrated:false,
  };
}
