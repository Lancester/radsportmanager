/**
 * R-22 – selbstständige Hinterradwahl von Sprintern.
 *
 * Sprintwatt und taktisches Hinterradfinden sind getrennte Eigenschaften.
 * Ein echter Sprintzug ist hilfreich, aber keine Voraussetzung: Ohne
 * eigenen Helfer kann ein geschickter Sprinter einen tatsächlich vor ihm
 * fahrenden Gegner als Zugpferd wählen.
 *
 * Reine Wattentscheidung, KEIN direkter Aero-/Positions-/Zeitbonus.
 * Windschatten entsteht ausschließlich in formation-aero aus den
 * anschließend physisch berechneten Längspositionen (<24 m).
 */
export const SPRINT_WHEEL=Object.freeze({
  maxLookAheadM:24,
  startEarliestRemainingM:10000,
  startLatestRemainingM:2000,
  finishReleaseRemainingM:250,
  minimumGroupSize:3,
  minimumReserveFraction:.24,
  maximumCpFraction:1.06,
  minimumWheelGapM:.4,
  idealWheelGapM:3,
  maximumBonusW:45,
});
export interface ActualWheel {
  riderId:string;gapAheadM:number;speedMps:number;
  sprintSkill:number;
}
export interface WheelChoiceObservation {
  wheelFindingSkill:number;
  sprintSkill:number;
  remainingM:number;
  groupSize:number;
  ownSpeedMps:number;
  criticalPowerW:number;
  reserveFraction:number;
  currentIntent:string;
  hasTeamHelperAhead:boolean;
  desiredFollowW:number;
  riderMassKg:number;bikeMassKg:number;dragAreaM2:number;
  aeroFactor:number;gradeFraction:number;rollingCoefficient:number;
  airDensityKgM3:number;drivetrainEfficiency:number;
  headwindMps:number;crosswindMps:number;
  wheels:readonly ActualWheel[];
}
export function chooseIndependentSprintWheel(o:WheelChoiceObservation):
  {powerW:number;wheelRiderId:string;reason:'independent_wheel'}|null {
  const c=SPRINT_WHEEL;
  if(!Number.isFinite(o.wheelFindingSkill)||
    o.wheelFindingSkill<0||o.wheelFindingSkill>1||
    !Number.isFinite(o.sprintSkill)||o.sprintSkill<0||o.sprintSkill>1||
    !Number.isFinite(o.remainingM)||o.remainingM<=c.finishReleaseRemainingM||
    o.remainingM>c.startLatestRemainingM+
      (c.startEarliestRemainingM-c.startLatestRemainingM)*o.wheelFindingSkill||
    o.groupSize<c.minimumGroupSize||
    o.hasTeamHelperAhead||
    o.reserveFraction<c.minimumReserveFraction||
    ['angriff','sprint','erholung','verfolgung'].includes(o.currentIntent)||
    o.ownSpeedMps<=0||o.criticalPowerW<=0||
    o.desiredFollowW<0||o.aeroFactor<=0||
    o.drivetrainEfficiency<=0||
    !Array.isArray(o.wheels))
    return null;
  // Nur physisch erreichbare, real VORAUS fahrende Räder berücksichtigen.
  // 1D-Modell: Mehrere Kandidaten im selben 24-m-Abschnitt sind eine
  // vereinfachte Gelegenheit, keine echte Spurwahl oder Durchfahrt.
  const candidates=o.wheels.filter(w=>
    Number.isFinite(w.gapAheadM)&&
    w.gapAheadM>=c.minimumWheelGapM&&
    w.gapAheadM<=c.maxLookAheadM&&
    Number.isFinite(w.speedMps)&&w.speedMps>=o.ownSpeedMps-.7&&
    Number.isFinite(w.sprintSkill)&&w.sprintSkill>=0&&w.sprintSkill<=1)
    .sort((a,b)=>{
      // In schnellem Finale attraktive Räder wählen. Nicht auf den
      // bloßen Rider-Label "Sprinter" vertrauen.
      const score=(w:ActualWheel)=>
        w.speedMps+.60*w.sprintSkill-.020*Math.abs(
          w.gapAheadM-c.idealWheelGapM);
      return score(b)-score(a)||a.riderId.localeCompare(b.riderId);
    });
  const wheel=candidates[0];
  if(!wheel)return null;
  const v=wheel.speedMps;
  const mass=o.riderMassKg+o.bikeMassKg;
  const theta=Math.atan(o.gradeFraction);
  const relAir=Math.hypot(Math.max(0,v+o.headwindMps),o.crosswindMps);
  const holdW=Math.max(0,(
    mass*9.80665*(Math.sin(theta)+
      o.rollingCoefficient*Math.cos(theta))+
    .5*o.airDensityKgM3*o.dragAreaM2*o.aeroFactor*relAir**2
  )*v/o.drivetrainEfficiency);
  // Geschickte Fahrer erkennen den Zug früher und reagieren
  // genauer auf ein davoneilendes Hinterrad. Schlechtere Talente
  // bleiben möglich, aber reagieren später und weniger präzise.
  const speedError=wheel.speedMps-o.ownSpeedMps;
  const gapError=Math.max(-6,Math.min(18,
    wheel.gapAheadM-c.idealWheelGapM));
  const desired=holdW+
    (50+65*o.wheelFindingSkill)*Math.max(-.5,speedError)+
    (1.5+2.8*o.wheelFindingSkill)*gapError;
  const cap=o.criticalPowerW*c.maximumCpFraction;
  const bonus=12+c.maximumBonusW*o.wheelFindingSkill;
  const powerW=Math.max(0,Math.min(cap,o.desiredFollowW+bonus,desired));
  if(!Number.isFinite(powerW)||powerW<=o.desiredFollowW+1)return null;
  return {powerW,wheelRiderId:wheel.riderId,
    reason:'independent_wheel'};
}
