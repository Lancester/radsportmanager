/**
 * R-22: Jagdhelfer dürfen sich im letzten Renndrittel im Wind verausgaben
 * und danach bewusst aus der Führung zurückfallen.
 *
 * Keine neue künstliche Energie-/Erschöpfungsbilanz: Ein "verausgabt"-Signal
 * entsteht ausschließlich aus TATSÄCHLICH im CP/W′-/R-19-Kern geleisteten
 * Kurbelwatt bei einer realen Führungsposition. Die überschwellige
 * Arbeit ist nur ein taktischer Einsatzindikator (nicht zusätzlich
 * vom Körper abzuziehen). Das anschließende Zurückfallen erfolgt
 * ausschließlich über geringere angeforderte Watt im motion-core.
 */
export const CHASE_HELPER_SPENT=Object.freeze({
  earliestProgress:2/3,
  latestProgress:.985,
  minMainGroupSize:8,
  frontRadiusM:18,
  referenceCpFraction:.82,
  minimumRealFrontSeconds:720,
  // Ein langer Sprintteam-Zug darf 15–20 Minuten an der Front arbeiten.
  longStintSeconds:1200,
  highLoadTriggerJ:52000,
  criticalWprimeFraction:.19,
  retreatSeconds:78,
  initialFreewheelSeconds:18,
  initialCpFraction:.36,
  laterCpFraction:.50,
});
export interface ChaseHelperLoad {
  realFrontSeconds:number;
  highLoadJ:number;
  spent:boolean;
  retreatStartS:number;
  retreatUntilS:number;
}
export const initialChaseHelperLoad=():ChaseHelperLoad=>({
  realFrontSeconds:0,highLoadJ:0,spent:false,
  retreatStartS:-1,retreatUntilS:-1,
});
export interface ChaseHelperEffortSample {
  enabled:boolean;
  progress:number;
  timeS:number;dt:number;
  teamStrategy:string;
  role:string;
  mission:string|null;
  duty:string|null;
  distanceFromRealGroupFrontM:number;
  physicalGroupSize:number;
  criticalPowerW:number;
  reserveFraction?:number;
  enduranceAvailability?:number;
  /** Only physically applied pedal watts, AFTER CP/W′ & endurance. */
  appliedCrankPowerW:number;
}
export function advanceChaseHelperLoad(
  state:ChaseHelperLoad,sample:ChaseHelperEffortSample,
):{state:ChaseHelperLoad;retireNow:boolean}{
  const c=CHASE_HELPER_SPENT;
  if(state.spent)return {state,retireNow:false};
  if(!sample.enabled||sample.progress<c.earliestProgress||
    sample.progress>=c.latestProgress||
    sample.teamStrategy!=='sprint'||sample.role!=='helfer'||
    sample.mission!=='jagd'||sample.duty!=='fuehrung'||
    sample.distanceFromRealGroupFrontM>c.frontRadiusM||
    sample.distanceFromRealGroupFrontM<0||
    sample.physicalGroupSize<c.minMainGroupSize||
    !Number.isFinite(sample.appliedCrankPowerW)||
    sample.appliedCrankPowerW<0||
    !Number.isFinite(sample.criticalPowerW)||
    sample.criticalPowerW<=0||
    !Number.isFinite(sample.timeS)||!Number.isFinite(sample.dt)||
    sample.dt<=0)
    return {state,retireNow:false};
  const realFrontSeconds=state.realFrontSeconds+sample.dt;
  const highLoadJ=state.highLoadJ+Math.max(0,
    sample.appliedCrankPowerW-
      c.referenceCpFraction*sample.criticalPowerW)*sample.dt;
  // Keine zeitgesteuerte 95-s-Pflichtablösung mehr. Bei genügend
  // Reserve kann ein Fahrer bis ~20 min REAL an der Spitze arbeiten.
  // Erst ab 12 min und erheblichem Hochlast-Einsatz ODER durch seine
  // vorhandene W′-/Langzeit-Ermüdung beginnt ein Rückzug; spätestens
  // nach 20 min echter, nachgewiesener Frontarbeit und hoher Last.
  const lowReserve=(sample.reserveFraction??1)<=c.criticalWprimeFraction||
    (sample.enduranceAvailability??1)<.70;
  const retireNow=realFrontSeconds>=c.minimumRealFrontSeconds&&
    ((lowReserve&&highLoadJ>=c.highLoadTriggerJ*.42)||
      (highLoadJ>=c.highLoadTriggerJ&&
        realFrontSeconds>=c.longStintSeconds*.75)||
      (realFrontSeconds>=c.longStintSeconds&&highLoadJ>=12000));
  return {retireNow,state:{
    realFrontSeconds,highLoadJ,spent:retireNow,
    retreatStartS:retireNow?sample.timeS+sample.dt:-1,
    retreatUntilS:retireNow?
      sample.timeS+sample.dt+c.retreatSeconds:-1,
  }};
}
/** Nur eine Watt-Obergrenze – bewusst keine Positionsänderung. */
export function spentHelperRetreatPower(
  state:ChaseHelperLoad,timeS:number,
  criticalPowerW:number,originalRequestedW:number,
):number|null {
  const c=CHASE_HELPER_SPENT;
  if(!state.spent||timeS<state.retreatStartS||
    timeS>=state.retreatUntilS)return null;
  const elapsed=timeS-state.retreatStartS;
  const fraction=elapsed<c.initialFreewheelSeconds?
    c.initialCpFraction:c.laterCpFraction;
  return Math.max(0,Math.min(originalRequestedW,
    criticalPowerW*fraction));
}

/**
 * Nur ein real physisch führender, beauftragter Helfer kann über die
 * Gruppen-Mitfahrleistung hinaus bewusst Tempo auf die Flucht machen.
 * Die EINZIGE zusätzliche Größe ist der Wattwunsch. CP/W′ und R-19
 * berechnen danach weiterhin die tatsächlich mögliche Kurbelarbeit.
 * Der langsame Zielwert liegt nahe CP, nicht permanent weit darüber.
 */
export function decideCommittedChasePull(o:{
  enabled:boolean;progress:number;
  strategy:string;role:string;mission:string|null;duty:string|null;
  groupSize:number;distanceFromGroupFrontM:number;
  escapeGapM:number;remainingM:number;
  cpW:number;reserveFraction:number;enduranceAvailability:number;
  originalRequestedW:number;
}):number|null{
  const c=CHASE_HELPER_SPENT;
  if(!o.enabled||o.progress<c.earliestProgress||
    o.progress>=c.latestProgress||o.strategy!=='sprint'||
    o.role!=='helfer'||o.mission!=='jagd'||o.duty!=='fuehrung'||
    o.groupSize<c.minMainGroupSize||
    o.distanceFromGroupFrontM<0||
    o.distanceFromGroupFrontM>c.frontRadiusM||
    o.escapeGapM<75||o.remainingM<1500||
    o.cpW<=0||o.reserveFraction<.24||
    o.enduranceAvailability<=.59||
    !Object.values(o).filter(v=>typeof v==='number')
      .every(v=>Number.isFinite(v)))
    return null;
  const urgent=o.escapeGapM/Math.max(1,o.remainingM)>.018;
  const sustainableFraction=urgent&&o.reserveFraction>.52?1.035:.975;
  // R-19 reduziert später die geforderten Watt; das physische Ziel
  // liegt nach dieser Begrenzung bei ~98–104% CP, sofern möglich.
  const requested=Math.min(o.cpW*1.20,
    o.cpW*sustainableFraction/o.enduranceAvailability);
  return requested>o.originalRequestedW+1?requested:null;
}
