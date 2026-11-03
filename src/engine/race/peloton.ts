/**
 * R-10: bewusst abstrakte Peloton-/Tempoarbeit statt Lenk- und Kurvenphysik.
 *
 * Jede Entscheidung erzeugt nur eine Pedalwatt-Anforderung und einen
 * aerodynamischen Reduktionsfaktor. Bewegung, Energie und W′ bleiben in
 * motion-core.ts / critical-power.ts. Keine Positionskorrektur.
 */
export interface PackObservation {
  frontGapM:number|null;
  frontSpeedMps:number|null;
  ownSpeedMps:number;
  desiredPowerW:number;
  criticalPowerW:number;
  /** Attacken und Sprints dürfen sich absichtlich vom Feld entfernen. */
  tacticalIntent:string;
  reserveFraction:number;
}
export interface PackInstruction {
  requestedPowerW:number;
  aeroFactor:number;
  addedPowerW:number;
  reason:'allein'|'windschatten'|'tempo-halten'|'anschluss-suchen'|'freie-attacke';
}
export const R10_PACK = Object.freeze({
  /** Kleine, hintereinanderliegende Abstände werden als Windschatten interpretiert. */
  draftFullGapM:3,
  draftFadeGapM:36,
  draftFactorAtWheel:0.81,
  /** Im abstrakten Rennen bleiben Fahrer auch bei Rückstand aktiv in Reichweite. */
  supportMaxGapM:155,
  nearTargetGapM:6,
  maxSupportPlusW:72,
  maxSupportMinusW:-80,
  speedFeedbackWPerMps:30,
  gapFeedbackWPerM:1.7,
  /** Getrennte, dauerhafte Abstandsgruppen in der Ergebnisdiagnostik. */
  groupSeparationM:42,
});
const valid=(key:string,v:number,okay:boolean):void=>{
  if(!Number.isFinite(v)||!okay)throw new RangeError('Peloton: '+key);
};
/** Gruppe als reine Diagnose. Keine impliziten Geschwindigkeitsänderungen. */
export function pelotonGroups<T extends {id:string;positionM:number}>(
  riders:ReadonlyArray<T>,separationM=R10_PACK.groupSeparationM,
):T[][] {
  valid('separationM',separationM,separationM>0&&separationM<=250);
  const sorted=[...riders].sort((a,b)=>b.positionM-a.positionM||
    a.id.localeCompare(b.id));
  const groups:T[][]=[];
  for(const rider of sorted){
    valid('positionM',rider.positionM,true);
    if(typeof rider.id!=='string'||!rider.id.trim())
      throw new RangeError('Peloton: Fahrer-ID');
    const group=groups[groups.length-1];
    if(!group||group[group.length-1].positionM-rider.positionM>separationM)
      groups.push([rider]);
    else group.push(rider);
  }
  return groups;
}
/** Benachbarte Fahrer passen ihre ANFORDERUNG an physikalische
 * Längsabstände und Relativgeschwindigkeit an. Die tatsächliche
 * verfügbare Wattzahl wird erst danach durch CP/W′ begrenzt.
 */
export function decidePackInstruction(o:PackObservation):PackInstruction {
  valid('ownSpeedMps',o.ownSpeedMps,o.ownSpeedMps>=0&&o.ownSpeedMps<100);
  valid('desiredPowerW',o.desiredPowerW,o.desiredPowerW>=0&&o.desiredPowerW<=2500);
  valid('criticalPowerW',o.criticalPowerW,o.criticalPowerW>0&&o.criticalPowerW<=1500);
  valid('reserveFraction',o.reserveFraction,o.reserveFraction>=0&&o.reserveFraction<=1+1e-7);
  if(o.frontGapM!==null)valid('frontGapM',o.frontGapM,o.frontGapM>=0);
  if(o.frontSpeedMps!==null)valid('frontSpeedMps',o.frontSpeedMps,
    o.frontSpeedMps>=0&&o.frontSpeedMps<100);
  if((o.frontGapM===null)!==(o.frontSpeedMps===null))
    throw new RangeError('Peloton: unvollständiger Vordermann');
  const intentional=o.tacticalIntent==='angriff'||o.tacticalIntent==='sprint';
  const gap=o.frontGapM;
  if(gap===null){
    return {requestedPowerW:o.desiredPowerW,aeroFactor:1,addedPowerW:0,reason:'allein'};
  }
  const drag=gap<R10_PACK.draftFadeGapM?
    R10_PACK.draftFactorAtWheel+
      (1-R10_PACK.draftFactorAtWheel)*Math.max(0,
        (gap-R10_PACK.draftFullGapM)/
        (R10_PACK.draftFadeGapM-R10_PACK.draftFullGapM))
    :1;
  if(intentional){
    return {requestedPowerW:o.desiredPowerW,aeroFactor:drag,addedPowerW:0,
      reason:'freie-attacke'};
  }
  if(gap>R10_PACK.supportMaxGapM){
    return {requestedPowerW:o.desiredPowerW,aeroFactor:drag,addedPowerW:0,
      reason:'allein'};
  }
  const speedError=o.frontSpeedMps!-o.ownSpeedMps;
  const gapError=Math.max(-15,Math.min(50,gap-R10_PACK.nearTargetGapM));
  let adjustment=R10_PACK.speedFeedbackWPerMps*speedError+
    R10_PACK.gapFeedbackWPerM*gapError;
  adjustment=Math.max(R10_PACK.maxSupportMinusW,
    Math.min(R10_PACK.maxSupportPlusW,adjustment));
  if(o.reserveFraction<0.06)
    adjustment=Math.min(adjustment,0);
  const requested=Math.max(0,o.desiredPowerW+adjustment);
  return {requestedPowerW:requested,aeroFactor:drag,
    addedPowerW:requested-o.desiredPowerW,
    reason:gap<R10_PACK.draftFadeGapM?'tempo-halten':'anschluss-suchen'};
}
