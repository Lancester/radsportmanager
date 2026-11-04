/**
 * R-22 Klassiker: positionsbewusste Renn-KI für selektive kurze Rampen.
 * Rein taktische Wattwünsche im experimentellen stable-pack (keine
 * Zeit-, Positions-, Aero-, CP/W′- oder Geschwindigkeitssonderregel).
 *
 * Zwei unabhängige Situationen:
 *  - früh rechtzeitig im ECHTEN Hauptfeld aufrücken, statt als
 *    eigentlich starker Helfer bei den Schlüsselrampen hinten zu sein;
 *  - selektives, bis zur Rampenkuppe gehaltenes Tempo durch EINEN
 *    wirklich vorn fahrenden nominierbaren Rampenfahrer pro Gruppe.
 * Nicht jede Rampe ist eine All-out-Attacke; auf flacher Verbindung
 * geht der Fahrer wieder in das normale Gruppen-/Erholungsverhalten.
 */
export const CLASSICS_RACECRAFT=Object.freeze({
  minRaceM:220000,minSteepClimbs:4,
  minRampGrade:.075,minRampLengthM:800,maxRampLengthM:2500,
  positioningFromProgress:.40,positioningUntilProgress:.87,
  positioningGroupSize:12,positioningRankShare:.38,
  positioningMaxGapM:180,positioningMinReserve:.12,
  positioningMaxCp:1.025,
  selectionFromProgress:.78,selectionUntilProgress:.96,
  selectionFromSegment:.12,selectionUntilSegment:.92,
  selectionMaxGapFromRaceFrontM:240,
  selectionMaxGapFromGroupFrontM:70,
  selectionMinReserve:.22,
  selectionMaxCp:1.085,
});
export interface ClassicsRacecraftObservation {
  enabled:boolean;specialty?:string;role:string;
  isDesignatedRider:boolean;isSelectedGroupPacer:boolean;
  progress:number;segmentProgress:number;
  gradeFraction:number;segmentLengthM:number;
  physicalGroupSize:number;rankInPhysicalGroup:number;
  gapToGroupFrontM:number;gapToRaceFrontM:number;
  criticalPowerW:number;reserveFraction:number;
  requestedPowerW:number;intent:string;
}
function valid(o:ClassicsRacecraftObservation):boolean{
  return Number.isFinite(o.progress)&&o.progress>=0&&o.progress<=1&&
    Number.isFinite(o.segmentProgress)&&
    Number.isFinite(o.gradeFraction)&&
    Number.isFinite(o.segmentLengthM)&&o.segmentLengthM>0&&
    Number.isInteger(o.physicalGroupSize)&&o.physicalGroupSize>=1&&
    Number.isInteger(o.rankInPhysicalGroup)&&
    o.rankInPhysicalGroup>=1&&
    o.rankInPhysicalGroup<=o.physicalGroupSize&&
    Number.isFinite(o.gapToGroupFrontM)&&o.gapToGroupFrontM>=0&&
    Number.isFinite(o.gapToRaceFrontM)&&o.gapToRaceFrontM>=0&&
    Number.isFinite(o.criticalPowerW)&&o.criticalPowerW>0&&
    Number.isFinite(o.reserveFraction)&&
    o.reserveFraction>=0&&o.reserveFraction<=1.00001&&
    Number.isFinite(o.requestedPowerW)&&o.requestedPowerW>=0;
}
/** Vor den späten Schlüsselpunkten innerhalb der echten Gruppe aufrücken. */
export function decideClassicsApproach(
  o:ClassicsRacecraftObservation,
):number|null{
  if(!valid(o))throw new RangeError('R22 Klassiker: ungültige Annäherung');
  const c=CLASSICS_RACECRAFT;
  if(!o.enabled||o.specialty!=='klassiker'||!o.isDesignatedRider||
    o.progress<c.positioningFromProgress||
    o.progress>=c.positioningUntilProgress||
    o.physicalGroupSize<c.positioningGroupSize||
    o.rankInPhysicalGroup<=Math.ceil(
      o.physicalGroupSize*c.positioningRankShare)||
    o.gapToGroupFrontM<9||
    o.gapToGroupFrontM>c.positioningMaxGapM||
    o.reserveFraction<c.positioningMinReserve||
    ['angriff','sprint','erholung','verfolgung','helferarbeit']
      .includes(o.intent))
    return null;
  // Keine neue künstliche Maximalleistung. Watt zum eigenständigen
  // Aufrücken (bis etwa CP); bei schnellem Feld kann er scheitern.
  const demanded=Math.min(o.criticalPowerW*c.positioningMaxCp,
    o.criticalPowerW*(.95+.05*Math.min(1,
      o.gapToGroupFrontM/70)));
  return demanded>o.requestedPowerW+1?demanded:null;
}
/** Echte Selektion: EIN vorderer Klassiker macht länger Tempo bergauf. */
export function decideClassicsRampTempo(
  o:ClassicsRacecraftObservation,
):number|null{
  if(!valid(o))throw new RangeError('R22 Klassiker: ungültiges Rampentempo');
  const c=CLASSICS_RACECRAFT;
  if(!o.enabled||o.specialty!=='klassiker'||!o.isDesignatedRider||
    !o.isSelectedGroupPacer||
    o.progress<c.selectionFromProgress||
    o.progress>c.selectionUntilProgress||
    o.segmentLengthM<c.minRampLengthM||
    o.segmentLengthM>c.maxRampLengthM||
    o.gradeFraction<c.minRampGrade||
    o.segmentProgress<c.selectionFromSegment||
    o.segmentProgress>c.selectionUntilSegment||
    o.physicalGroupSize<4||
    o.gapToGroupFrontM>c.selectionMaxGapFromGroupFrontM||
    o.gapToRaceFrontM>c.selectionMaxGapFromRaceFrontM||
    o.reserveFraction<c.selectionMinReserve||
    ['angriff','sprint','erholung','verfolgung','helferarbeit']
      .includes(o.intent))
    return null;
  // Geringe, über die Rampe gehaltene W′-Mehrarbeit statt
  // 180 Sekunden blindem Sprint. Geometrie, Positionsvorteil,
  // Energiebegrenzung und Ermüdung bleiben im alten Motor.
  const factor=Math.min(c.selectionMaxCp,
    1.045+Math.max(0,o.gradeFraction-.075)*1.2);
  const demanded=o.criticalPowerW*factor;
  return demanded>o.requestedPowerW+1?demanded:null;
}
