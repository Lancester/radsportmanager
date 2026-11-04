/** R-22: kurze steile Klassikeranstiege führen zu taktisch begründeten
 * W′-finanzierten Initiativen statt unbegrenztem passiven Nachfahren.
 * Ausschließlich im Experiment stable-pack, NICHT im Legacy-Modus.
 * Kein sofortiges Absetzen, kein Gewinnerbonus: nur eine Wattanforderung.
 */
export const CLASSICS_PUNCH=Object.freeze({
  minRaceM:220000,minShortSteepClimbs:4,
  minClimbM:800,maxClimbM:2500,minGrade:.075,
  minProgress:.70,maxProgress:.965,
  attackFromClimbProgress:.20,attackUntilClimbProgress:.82,
  minGroupSize:4,maxFrontDistanceM:115,
  maxGapToActualRaceFrontM:1000,
  minWprimeFraction:.38,
  // Drei Minuten hohe Kraftausdauerleistung: W′-Kosten werden physisch
  // abgerechnet. Das ist eine KI-Entscheidungsdauer, keine neue Leistung.
  minCooldownS:540,continueAttackS:180,
  minExposedSurplusW:22,
  maxAttackCpFraction:1.25,maxExtraW:145,
});
export interface ClassicsPunchObservation {
  specialty?:string;role:string;strategy:string;
  raceLengthM:number;shortSteepClimbs:number;progress:number;
  segmentLengthM:number;segmentProgress:number;gradeFraction:number;
  groupSize:number;distanceFromGroupFrontM:number;
  criticalPowerW:number;reserveFraction:number;lastAttackAgeS:number;
  currentIntent:string;
  /** Vor dem Start sportlich geeignetster Puncheur dieses Teams. */
  designatedRampRider:boolean;
  /** Aktuell nach Watt/kg bester verfügbarer Puncheur der physischen Gruppe. */
  attackRankInGroup:number;
  gapToActualRaceFrontM:number;
  speedMps:number;riderMassKg:number;bikeMassKg:number;
  dragAreaM2:number;airDensityKgM3:number;rollingCoefficient:number;
  drivetrainEfficiency:number;headwindMps:number;crosswindMps:number;
}
export function decideClassicsPunch(o:ClassicsPunchObservation):
  {powerW:number;reason:string}|null {
  const c=CLASSICS_PUNCH;
  // Ein geeigneter Klassikerspezialist kann unabhängig von seiner
  // bisherigen Helfer-Rolle auf das anspruchsvolle Streckenprofil
  // gesetzt werden. Nur der stärkste verfügbare Puncheur einer
  // tatsächlichen Abstandsgruppe beginnt einen neuen Angriff.
  // Eine begonnene physische Attacke darf kurzfristig fortgesetzt
  // werden, auch wenn der Fahrer die Gruppe bereits verlassen hat.
  // Andernfalls bricht der erste erfolgreiche Soloversuch nach 10 s
  // wegen groupSize<4 ungewollt ab.
  const continuing=o.currentIntent==='angriff'&&
    o.lastAttackAgeS>=0&&o.lastAttackAgeS<c.continueAttackS;
  if(o.specialty!=='klassiker'||!o.designatedRampRider||
    o.raceLengthM<c.minRaceM||
    o.shortSteepClimbs<c.minShortSteepClimbs||
    o.progress<c.minProgress||o.progress>c.maxProgress||
    o.segmentLengthM<c.minClimbM||o.segmentLengthM>c.maxClimbM||
    o.gradeFraction<c.minGrade||
    o.reserveFraction<(continuing?.20:c.minWprimeFraction)||
    ['sprint','erholung','verfolgung','helferarbeit'].includes(o.currentIntent)||
    (!continuing&&(
      o.attackRankInGroup!==1||
      o.gapToActualRaceFrontM>c.maxGapToActualRaceFrontM||
      o.groupSize<c.minGroupSize||
      o.distanceFromGroupFrontM>c.maxFrontDistanceM||
      o.segmentProgress<c.attackFromClimbProgress||
      o.segmentProgress>c.attackUntilClimbProgress||
      o.lastAttackAgeS<c.minCooldownS
    )))
    return null;
  if(o.speedMps<=0||!Number.isFinite(o.speedMps)||
    !Number.isFinite(o.criticalPowerW)||o.criticalPowerW<=0)
    return null;
  // Entscheidend ist die eigene fahrbare Mehrleistung auf einer
  // REALEN Rampe, nicht ein Bonus aufgrund des Labels "Klassiker".
  // Bewusst OHNE Windschatten als konservativen Vergleich rechnen.
  const m=o.riderMassKg+o.bikeMassKg;
  const v=o.speedMps;
  const theta=Math.atan(o.gradeFraction);
  const a=Math.hypot(Math.max(0,v+o.headwindMps),o.crosswindMps);
  const exposedW=v/o.drivetrainEfficiency*(
    m*9.80665*(Math.sin(theta)+o.rollingCoefficient*Math.cos(theta))+
    .5*o.airDensityKgM3*o.dragAreaM2*a*a);
  const cap=o.criticalPowerW*c.maxAttackCpFraction;
  if(cap-exposedW<c.minExposedSurplusW)return null;
  const powerW=Math.min(cap,exposedW+c.maxExtraW);
  if(!Number.isFinite(powerW)||powerW<0)return null;
  return {powerW,reason:'Kurzer Steilanstieg: physisch mögliche Puncheur-Attacke'};
}
