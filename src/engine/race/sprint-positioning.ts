/**
 * R-22: Positionierung für reine Sprintrennen im großen Peloton.
 * Nur eine Energie-/Wattanfrage, NIEMALS direkte Position oder Tempo.
 * Eine optische Rennpositionsnummer ist in der 1D-Engine kein sicherer
 * Windschattenplatz und keine garantierte Überholspur.
 */
export const SPRINT_POSITION=Object.freeze({
  minRaceM:140000,
  maxAscentM:1650,
  minGroupSize:40,
  finishCutoffProgress:0.85,
  minReserveFraction:.32,
  // Ziel: ungefähr oberes Drittel der tatsächlich GEFAHRENEN Gruppe.
  targetFrontShare:.32,
  minRankToPosition:12,
  sprintPowerExtraW:70,
  escortPowerExtraW:30,
  escortMaxDistanceM:24,
  sprinterCapCpFraction:1.04,
  escortCapCpFraction:1.00,
});
export interface SprintPositionObservation {
  sprintFriendlyRace:boolean;
  strategy:string;specialty:string|undefined;
  isTargetSprinter:boolean;isEscort:boolean;
  progress:number;
  groupSize:number;rankInGroup:number;
  distanceFromGroupFrontM:number;
  targetRankInGroup:number|null;
  distanceToTargetM:number|null;
  frontGapM:number|null;
  currentIntent:string;
  reserveFraction:number;
  criticalPowerW:number;
  followPowerW:number;
}
export type SprintPositionDecision={
  powerW:number;reason:'position_sprinter'|'escort_sprinter';
};
/** Absichtlich rein und deterministisch, ohne Namen/ID-Boni. */
export function decideSprintPosition(
  o:SprintPositionObservation,
):SprintPositionDecision|null {
  const c=SPRINT_POSITION;
  if(!o.sprintFriendlyRace||
    o.strategy!=='sprint'||o.progress>=c.finishCutoffProgress||
    o.groupSize<c.minGroupSize||
    o.rankInGroup<1||o.rankInGroup>o.groupSize||
    o.rankInGroup<=Math.max(c.minRankToPosition,
      Math.ceil(o.groupSize*c.targetFrontShare))||
    o.frontGapM===null||o.frontGapM>42||
    o.reserveFraction<c.minReserveFraction||
    ['angriff','sprint','verfolgung','helferarbeit','erholung']
      .includes(o.currentIntent)||
    !Number.isFinite(o.followPowerW)||o.followPowerW<0||
    !Number.isFinite(o.criticalPowerW)||o.criticalPowerW<=0)
    return null;
  const sprinter=o.isTargetSprinter&&o.specialty==='sprinter';
  const escort=o.isEscort&&!sprinter&&
    o.distanceToTargetM!==null&&
    Math.abs(o.distanceToTargetM)<=c.escortMaxDistanceM&&
    o.targetRankInGroup!==null&&
    o.targetRankInGroup>Math.max(c.minRankToPosition,
      Math.ceil(o.groupSize*c.targetFrontShare))&&
    o.rankInGroup>=o.targetRankInGroup;
  if(!sprinter&&!escort)return null;
  const bonus=sprinter?c.sprintPowerExtraW:c.escortPowerExtraW;
  const cap=o.criticalPowerW*(sprinter?
    c.sprinterCapCpFraction:c.escortCapCpFraction);
  const result=Math.min(cap,o.followPowerW+bonus);
  if(result<=o.followPowerW+1)return null;
  return {powerW:result,reason:sprinter?
    'position_sprinter':'escort_sprinter'};
}
