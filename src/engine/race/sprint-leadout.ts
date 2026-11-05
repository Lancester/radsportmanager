/**
 * R-22: Wattkoordination eines echten Sprintzugs auf den letzten Kilometern.
 *
 * Ein Helfer soll Führungsarbeit leisten, sich aber nicht weit von seinem
 * Sprinter lösen. Reine Leistungsbegrenzung mit realer Zielgeschwindigkeit
 * und dem eigenen Luft-/Roll-/Steigungswiderstand. Keine Positionstricks.
 */
export const SPRINT_LEADOUT=Object.freeze({
  startRemainingM:10000,
  finishReleaseRemainingM:250,
  maxTargetLeadM:180,
  targetWheelLeadM:8,
  maxUsefulPullExtraW:32,
  wattsReductionPerExcessMeter:3.5,
  wattsReductionPerExtraMps:90,
  wattsRecoveryPerMissingMps:55,
  maxCpFraction:1.04,
});
/** Ein Helfer koordiniert nur seinen echten Auftrag in derselben Gruppe. */
export function sprintLeadoutEligible(mission:string|null,sameGroup:boolean):boolean{
  return mission==='sprintzug'&&sameGroup;
}
export interface SprintLeadoutObservation {
  enabled:boolean;
  currentIntent:string;
  remainingM:number;
  distanceAheadOfSprinterM:number;
  sprinterSpeedMps:number;
  helperSpeedMps:number;
  currentPowerW:number;criticalPowerW:number;
  riderMassKg:number;bikeMassKg:number;dragAreaM2:number;
  aeroFactor:number;gradeFraction:number;rollingCoefficient:number;
  airDensityKgM3:number;drivetrainEfficiency:number;
  headwindMps:number;crosswindMps:number;
}
export function decideSprintLeadoutPace(
  o:SprintLeadoutObservation,
):{powerW:number;reason:'stay_with_sprinter'}|null {
  const c=SPRINT_LEADOUT;
  if(!o.enabled||
    o.remainingM>c.startRemainingM||
    o.remainingM<=c.finishReleaseRemainingM||
    o.distanceAheadOfSprinterM<0||
    o.distanceAheadOfSprinterM>c.maxTargetLeadM||
    ['angriff','sprint','verfolgung','erholung'].includes(o.currentIntent)||
    o.currentPowerW<0||o.criticalPowerW<=0||
    o.sprinterSpeedMps<=0||o.helperSpeedMps<=0||
    o.aeroFactor<=0||o.aeroFactor>1||
    o.drivetrainEfficiency<=0||o.drivetrainEfficiency>1||
    o.rollingCoefficient<0||
    !Object.values(o).filter(x=>typeof x==='number')
      .every(x=>Number.isFinite(x)))
    return null;
  const v=o.sprinterSpeedMps;
  const relAir=Math.hypot(Math.max(0,v+o.headwindMps),
    o.crosswindMps);
  const mass=o.riderMassKg+o.bikeMassKg;
  const theta=Math.atan(o.gradeFraction);
  const resistance=.5*o.airDensityKgM3*o.dragAreaM2*
    o.aeroFactor*relAir**2+
    mass*9.80665*(o.rollingCoefficient*Math.cos(theta)+
      Math.sin(theta));
  const holdW=Math.max(0,resistance*v/o.drivetrainEfficiency);
  const excessLead=Math.max(0,
    o.distanceAheadOfSprinterM-c.targetWheelLeadM);
  const speedDiff=o.helperSpeedMps-v;
  const requested=Math.max(0,
    holdW+c.maxUsefulPullExtraW-
    excessLead*c.wattsReductionPerExcessMeter-
    Math.max(0,speedDiff)*c.wattsReductionPerExtraMps+
    Math.max(0,-speedDiff)*c.wattsRecoveryPerMissingMps);
  const powerW=Math.min(o.currentPowerW,
    o.criticalPowerW*c.maxCpFraction,requested);
  if(powerW>=o.currentPowerW-1)return null;
  return {powerW,reason:'stay_with_sprinter'};
}
