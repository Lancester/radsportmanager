/**
 * R-11: neutrale Renn-Diagnose, KEIN Balancing und keine Rennphysik.
 * Gruppen bleiben Abstandsklassen; hier werden nur vorhandene Ergebnisse
 * geprüft und zusammengefasst. Insbesondere keine Zielwerte erzwingen.
 */
import type {RaceResult} from './race-simulator.ts';

export interface RaceAudit {
  seed:number;
  finishers:number;
  winnerId:string;
  finishSpreadS:number;
  medianGapS:number;
  maximumGroups:number;
  medianSnapshotGroups:number;
  largestSnapshotGroup:number;
  singletonRiderShare:number;
  confirmedBreakaways:number;
  actualCatches:number;
  chaseStarts:number;
  attackStarts:number;
  averageCrankPowerW:number;
  snapshots:number;
}
function requireValue(ok:boolean,message:string):void {
  if(!ok)throw new RangeError('R-11 Renndiagnose: '+message);
}
function median(values:ReadonlyArray<number>):number {
  requireValue(values.length>0,'leere Zahlenreihe');
  const sorted=[...values].sort((a,b)=>a-b);
  const m=Math.floor(sorted.length/2);
  return sorted.length%2?sorted[m]:(sorted[m-1]+sorted[m])/2;
}
/**
 * Analysiert eine bereits durchgerechnete, vollständige Rennsimulation.
 * Vergleichszahlen sind bewusst keine empirische Realismus-Abnahme.
 */
export function auditRace(result:RaceResult):RaceAudit {
  requireValue(!!result&&Array.isArray(result.classification)&&
    result.classification.length>0,'keine Ergebnisliste');
  const c=result.classification;
  requireValue(c.length===result.finisherCount,'unvollständige Zielankunft');
  for(let i=0;i<c.length;i++){
    const r=c[i];
    requireValue(r.rank===i+1&&Number.isFinite(r.finishTimeS)&&
      r.finishTimeS>0&&Number.isFinite(r.gapS)&&r.gapS>=0,
      'ungültige Zielklassifikation');
    requireValue(Number.isFinite(r.averageCrankPowerW)&&
      r.averageCrankPowerW>=0,'ungültige Kurbelwatt');
    requireValue(Number.isFinite(r.energyResidualJ)&&
      Math.abs(r.energyResidualJ)<0.05,'Energiebilanz');
    if(i)requireValue(c[i-1].finishTimeS<=r.finishTimeS,
      'Zeitfolge in der Zielklassifikation');
    requireValue(Math.abs(r.gapS-(r.finishTimeS-c[0].finishTimeS))<1e-5,
      'Zielrückstand weicht von Zielzeit ab');
  }
  requireValue(Array.isArray(result.snapshots)&&
    Array.isArray(result.events),'Verlaufsdaten fehlen');
  let largestSnapshotGroup=0;
  let singletonRiders=0;
  let activeRiderObservations=0;
  const groupCounts:number[]=[];
  for(const snapshot of result.snapshots){
    requireValue(Number.isInteger(snapshot.activeRiders)&&
      snapshot.activeRiders>0,'ungültige Zahl aktiver Fahrer');
    requireValue(snapshot.groupSizes.length>0&&
      snapshot.groupSizes.every(v=>Number.isInteger(v)&&v>0),
      'ungültige Gruppengrößen');
    const sum=snapshot.groupSizes.reduce((a,b)=>a+b,0);
    requireValue(sum===snapshot.activeRiders,
      'Fahrerzahl in Gruppensnapshot stimmt nicht');
    requireValue(Number.isFinite(snapshot.leadingGapM)&&
      snapshot.leadingGapM>=0,'ungültige Führungslücke');
    largestSnapshotGroup=Math.max(largestSnapshotGroup,...snapshot.groupSizes);
    singletonRiders+=snapshot.groupSizes.filter(v=>v===1).length;
    activeRiderObservations+=snapshot.activeRiders;
    groupCounts.push(snapshot.groupSizes.length);
  }
  for(const e of result.events){
    if(e.type==='breakaway'){
      requireValue(typeof e.gapM==='number'&&e.gapM>=75,
        'Flucht nicht durch gemessene Lücke bestätigt');
    }
    if(e.type==='breakaway-caught'){
      requireValue(typeof e.gapM==='number'&&e.gapM<=35&&e.gapM>=0,
        'Einholen ohne tatsächlich geschlossene Lücke');
    }
  }
  const count=(type:string)=>result.events.filter(e=>e.type===type).length;
  const confirmedBreakaways=count('breakaway');
  const actualCatches=count('breakaway-caught');
  requireValue(actualCatches<=confirmedBreakaways,
    'mehr Einholungen als Fluchten');
  requireValue(result.diagnostics.breakaways===confirmedBreakaways&&
    result.diagnostics.caughtBreakaways===actualCatches,
    'Fluchtzähler weichen vom Protokoll ab');
  return {
    seed:result.seed,
    finishers:result.finisherCount,
    winnerId:result.winnerId,
    finishSpreadS:c.at(-1)!.gapS,
    medianGapS:median(c.map(r=>r.gapS)),
    maximumGroups:result.diagnostics.maximumGroups,
    medianSnapshotGroups:groupCounts.length?median(groupCounts):0,
    largestSnapshotGroup,
    singletonRiderShare:activeRiderObservations?
      singletonRiders/activeRiderObservations:0,
    confirmedBreakaways,actualCatches,
    chaseStarts:result.diagnostics.chases,
    attackStarts:result.diagnostics.attacks,
    averageCrankPowerW:c.reduce((sum,r)=>sum+r.averageCrankPowerW,0)/c.length,
    snapshots:result.snapshots.length,
  };
}
