/**
 * R-22: individueller, situationsabhängiger Endspurt – nur im
 * experimentellen stable-pack auf sprintfreundlichen Flachetappen.
 * Kein globaler Start bei 250/400 m und keinerlei Sieggarantie.
 *
 * Sprintbeginn: persönliche Früh-/Spät-Neigung, physische Position
 * relativ zur echten Abstandsgruppe, unmittelbares Hinterrad,
 * Schutz vor Wind, Tempo und Gegenwind. Die Strecke gibt nur ein
 * mögliches Zeitfenster, keinen verbindlichen Auslösepunkt vor.
 *
 * Sprintleistung: individuelles (optionales) Spitzenwatt-Profil und
 * zeitlicher Leistungsabfall. Alle Wünsche gehen danach durch
 * R-19, den unveränderten CP/W′-Kern und den Bewegungsintegrator.
 * Kein zusätzlicher W′- oder Geschwindigkeitsterm.
 */
export const FINAL_SPRINT=Object.freeze({
  earliestRemainingM:540,
  latestRemainingM:95,
  minGroupSize:2,
  minReserveFraction:.06,
  minPeakW:600,
  maxPeakW:2000,
  decayTimeS:18,
  lateFraction:.20,
});
export interface FinalSprintSituation {
  remainingM:number;
  launchPreference:number;
  sprintSkill:number;
  groupSize:number;
  rankInGroup:number;
  distanceFromGroupFrontM:number;
  frontWheelGapM:number|null;
  aeroFactor:number;
  ownSpeedMps:number;
  groupFrontSpeedMps:number;
  headwindMps:number;
  reserveFraction:number;
}
export function decideSprintLaunch(o:FinalSprintSituation):
  {shouldLaunch:boolean;triggerDistanceM:number;reason:string}{
  const c=FINAL_SPRINT;
  const nums=[o.remainingM,o.launchPreference,o.sprintSkill,
    o.groupSize,o.rankInGroup,o.distanceFromGroupFrontM,
    o.aeroFactor,o.ownSpeedMps,o.groupFrontSpeedMps,
    o.headwindMps,o.reserveFraction];
  if(nums.some(v=>!Number.isFinite(v))||
    o.groupSize<1||o.rankInGroup<1||o.rankInGroup>o.groupSize||
    o.launchPreference<0||o.launchPreference>1||
    o.sprintSkill<0||o.sprintSkill>1||
    o.aeroFactor<=0||o.aeroFactor>1||
    o.distanceFromGroupFrontM<0||
    o.remainingM<0||o.reserveFraction<0||o.reserveFraction>1.000001||
    (o.frontWheelGapM!==null&&
      (!Number.isFinite(o.frontWheelGapM)||o.frontWheelGapM<0)))
    throw new RangeError('R22: ungültige Sprintentscheidung');
  // Die individuelle Präferenz ist eine Fahrer-Eigenschaft und kein
  // perfektes Timing-Talent. Frühstarter und Abwartende koexistieren.
  const personalM=205+195*o.launchPreference;
  const farBack=o.groupSize>=8&&
    o.rankInGroup>Math.ceil(o.groupSize*.50);
  const needsRoom=farBack?Math.min(90,
    o.distanceFromGroupFrontM*.30+24):0;
  const sheltered=o.aeroFactor<=.80&&
    o.frontWheelGapM!==null&&o.frontWheelGapM<=12;
  const windDelay=sheltered?42:0;
  const speedLag=Math.max(0,
    Math.min(1.4,o.groupFrontSpeedMps-o.ownSpeedMps));
  const tempoEarly=speedLag*30;
  const headwindDelay=Math.max(-25,Math.min(28,
    o.headwindMps*5));
  const fatigueDelay=o.reserveFraction<.23?38:0;
  const triggerDistanceM=Math.round(Math.min(c.earliestRemainingM,
    Math.max(c.latestRemainingM,
      personalM+needsRoom+tempoEarly-windDelay-
        headwindDelay-fatigueDelay)));
  return {
    shouldLaunch:o.remainingM<=triggerDistanceM&&
      o.remainingM<=c.earliestRemainingM&&
      o.remainingM>0&&
      o.groupSize>=c.minGroupSize&&
      o.reserveFraction>=c.minReserveFraction,
    triggerDistanceM,
    reason:sheltered?'Sprint: aus echtem Windschatten spät antreten':
      farBack?'Sprint: individuelle frühe Aufholentscheidung':
      'Sprint: persönliche Antrittsentscheidung nach Rennlage',
  };
}
export function sprintPowerDemand(o:{
  criticalPowerW:number;sprintPeakPowerW:number;
  sprintSkill:number;elapsedS:number;
  /** Individuelle Ermüdungs-Zeitkonstante der Sprintspitze. */
  sprintDecayTimeS?:number;
}):number {
  const c=FINAL_SPRINT;
  if(!Number.isFinite(o.criticalPowerW)||o.criticalPowerW<=0||
    !Number.isFinite(o.sprintPeakPowerW)||o.sprintPeakPowerW<c.minPeakW||
    o.sprintPeakPowerW>c.maxPeakW||
    !Number.isFinite(o.sprintSkill)||o.sprintSkill<0||o.sprintSkill>1||
    !Number.isFinite(o.elapsedS)||o.elapsedS<0||
    (o.sprintDecayTimeS!==undefined&&(
      !Number.isFinite(o.sprintDecayTimeS)||
      o.sprintDecayTimeS<8||o.sprintDecayTimeS>40)))
    throw new RangeError('R22: ungültiges Sprintleistungsprofil');
  // Sprinter müssen hohe Spitzenwatt nur KURZ halten können. Die
  // getrennte Langzeit-Ausdauer wird weiterhin außerhalb berechnet.
  const sustainable=o.criticalPowerW;
  const powerAboveCp=Math.max(0,o.sprintPeakPowerW-sustainable);
  const fatigueFactor=c.lateFraction+
    (1-c.lateFraction)*Math.exp(-o.elapsedS/
      (o.sprintDecayTimeS??c.decayTimeS));
  return Math.min(c.maxPeakW,
    sustainable+powerAboveCp*fatigueFactor);
}
export function inferredSprintPeakPowerW(o:{
  massKg:number;sprintSkill:number;
}):number{
  if(!Number.isFinite(o.massKg)||o.massKg<=0||
    !Number.isFinite(o.sprintSkill)||o.sprintSkill<0||o.sprintSkill>1)
    throw new RangeError('R22: ungültige Sprintmaximalleistung');
  // Aus Masse und Sprintskill abgeleitete FALLBACK-Probe, nicht
  // nachträglich aus Rennergebnissen geschätzte Siegerwatt.
  return Math.round(Math.min(FINAL_SPRINT.maxPeakW,
    Math.max(FINAL_SPRINT.minPeakW,
      o.massKg*(7+10*o.sprintSkill))));
}
