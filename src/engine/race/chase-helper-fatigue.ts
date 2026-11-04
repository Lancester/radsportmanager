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
  minimumRealFrontSeconds:95,
  highLoadTriggerJ:14000,
  retreatSeconds:95,
  initialFreewheelSeconds:24,
  initialCpFraction:.14,
  laterCpFraction:.48,
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
  const retireNow=realFrontSeconds>=c.minimumRealFrontSeconds&&
    highLoadJ>=c.highLoadTriggerJ;
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
