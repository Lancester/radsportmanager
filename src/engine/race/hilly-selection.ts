/**
 * R-22: Hügel-Rennintelligenz ohne feste Rennfortschritts-Fenster.
 * Nur zusätzliche begrenzte Wattwünsche, niemals Abstands-, Zeit-,
 * Geschwindigkeits- oder Energiegutschriften.
 * Selektiert anhand tatsächlich bevorstehender Schlüsselpunkte.
 */
export const HILLY_SELECTION=Object.freeze({
  minClimbGrade:.075,minClimbM:700,maxClimbM:2600,
  keyClimbCount:3,
  approachDistanceM:2200,
  approachGroupMin:10,approachMinFrontGapM:12,
  approachMaxFrontGapM:180,approachMaxRaceGapM:350,
  maxApproachExtraW:32,approachMaxCpFraction:1.025,
  tempoGroupMin:4,tempoMaxFrontGapM:65,
  tempoMaxRaceGapM:280,tempoMinReserve:.19,
  tempoMinRampProgress:.12,tempoMaxRampProgress:.92,
  tempoCpFraction:1.105,tempoExtraW:48,
});
export interface HillySelectionObservation {
  enabled:boolean;specialty?:string;
  isTeamCandidate:boolean;isSelectedGroupPacer:boolean;
  currentIntent:string;
  distanceToNextKeyClimbM:number|null;onKeyClimb:boolean;
  climbGrade:number;climbLengthM:number;climbProgress:number;
  groupSize:number;distanceFromGroupFrontM:number;
  gapToRaceFrontM:number;criticalPowerW:number;
  requestedPowerW:number;reserveFraction:number;
}
export type HillySelectionDecision={
  powerW:number;reason:'approach'|'selective_ramp_pace';
};
export function decideHillySelection(
  o:HillySelectionObservation,
):HillySelectionDecision|null{
  const c=HILLY_SELECTION;
  if(!o.enabled||!o.isTeamCandidate||
    !['klassiker','allrounder','kletterer','gc','zeitfahrer']
      .includes(o.specialty??'')||
    !Number.isFinite(o.criticalPowerW)||o.criticalPowerW<=0||
    !Number.isFinite(o.requestedPowerW)||o.requestedPowerW<0||
    !Number.isFinite(o.reserveFraction)||o.reserveFraction<0||
    o.reserveFraction>1.00001||
    !Number.isInteger(o.groupSize)||o.groupSize<1||
    !Number.isFinite(o.distanceFromGroupFrontM)||
    o.distanceFromGroupFrontM<0||
    !Number.isFinite(o.gapToRaceFrontM)||o.gapToRaceFrontM<0||
    !Number.isFinite(o.climbGrade)||!Number.isFinite(o.climbLengthM)||
    !Number.isFinite(o.climbProgress)||
    ['angriff','sprint','verfolgung','helferarbeit','erholung']
      .includes(o.currentIntent))return null;
  if(o.onKeyClimb){
    if(!o.isSelectedGroupPacer||
      o.groupSize<c.tempoGroupMin||
      o.distanceFromGroupFrontM>c.tempoMaxFrontGapM||
      o.gapToRaceFrontM>c.tempoMaxRaceGapM||
      o.reserveFraction<c.tempoMinReserve||
      o.climbGrade<c.minClimbGrade||
      o.climbLengthM<c.minClimbM||
      o.climbLengthM>c.maxClimbM||
      o.climbProgress<c.tempoMinRampProgress||
      o.climbProgress>c.tempoMaxRampProgress)return null;
    const requested=Math.min(
      o.criticalPowerW*c.tempoCpFraction,
      Math.max(o.criticalPowerW*1.06,
        o.requestedPowerW+c.tempoExtraW));
    return requested>o.requestedPowerW+1?{
      powerW:requested,reason:'selective_ramp_pace'}:null;
  }
  if(o.distanceToNextKeyClimbM===null||
    !Number.isFinite(o.distanceToNextKeyClimbM)||
    o.distanceToNextKeyClimbM<0||
    o.distanceToNextKeyClimbM>c.approachDistanceM||
    o.groupSize<c.approachGroupMin||
    o.distanceFromGroupFrontM<c.approachMinFrontGapM||
    o.distanceFromGroupFrontM>c.approachMaxFrontGapM||
    o.gapToRaceFrontM>c.approachMaxRaceGapM||
    o.reserveFraction<.24)return null;
  const requested=Math.min(o.criticalPowerW*c.approachMaxCpFraction,
    o.requestedPowerW+c.maxApproachExtraW);
  return requested>o.requestedPowerW+1?
    {powerW:requested,reason:'approach'}:null;
}
