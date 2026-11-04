/**
 * R-22: gruppenbewusste Fahrer-KI statt individueller Dauerfahrt bei CP.
 *
 * In einem größeren Feld ist nicht jeder Fahrer permanent im eigenen
 * Maximaltempo unterwegs: eine Gruppe teilt die Führungsarbeit, Fahrer
 * passen ihre Leistung an das tatsächlich gefahrene Gruppentempo an.
 *
 * Alle Ausgaben sind NUR Wattanfragen. Keine Geschwindigkeit/Position
 * wird direkt geändert. CP/W′, R-19 und motion-core bleiben die
 * einzigen Grenzen der wirklich verfügbaren Leistung.
 *
 * Die 1D-Rennengine kennt keine Querpositionen/Überholspur.
 * Parameter sind ausdrücklich heuristisch und noch NICHT real kalibriert.
 */
export interface GroupRidingObservation {
  groupSize:number;distanceFromGroupFrontM:number;
  frontGapM:number|null;frontSpeedMps:number|null;
  /** Gruppentempo/-beschleunigung vom physisch führenden Fahrer.
   * Nur zur Ermittlung der angeforderten Leistung, keine Zwangskinematik. */
  referenceSpeedMps:number;referenceAccelerationMps2:number;
  isPacer:boolean;groupPacerPowerW:number;
  ownSpeedMps:number;desiredPowerW:number;criticalPowerW:number;
  reserveFraction:number;tacticalIntent:string;
  riderMassKg:number;bikeMassKg:number;dragAreaM2:number;
  aeroFactor:number;gradeFraction:number;rollingCoefficient:number;
  airDensityKgM3:number;drivetrainEfficiency:number;
  headwindMps:number;crosswindMps:number;
}
export interface GroupRidingDecision {
  powerW:number;reason:'no_group'|'active_mission'|'front_rotation'|
    'follow_group';
}
export const R22_GROUP_RIDING=Object.freeze({
  minGroupSize:8,
  maxFollowingGapM:42,
  /** Die Referenzleistung bestimmt nur den Wattwunsch des echten Pacesetters.
   * Die anderen Fahrer orientieren sich an dessen tatsächlicher Bewegung. */
  leaderCpFraction:1.00,
  targetWheelGapM:2,
  wattsPerGapMeter:0.5,
  wattsPerSpeedDifferenceMps:75,
  maximumFollowingCpFraction:1.12,
});
export function decideGroupRiding(o:GroupRidingObservation):GroupRidingDecision{
  const finite=[
    o.groupSize,o.distanceFromGroupFrontM,o.ownSpeedMps,
    o.desiredPowerW,o.criticalPowerW,o.reserveFraction,
    o.riderMassKg,o.bikeMassKg,o.dragAreaM2,o.aeroFactor,
    o.gradeFraction,o.rollingCoefficient,o.airDensityKgM3,
    o.drivetrainEfficiency,o.headwindMps,o.crosswindMps,
    o.referenceSpeedMps,o.referenceAccelerationMps2,
    o.groupPacerPowerW,
  ];
  if(finite.some(x=>!Number.isFinite(x))||
    o.groupSize<1||!Number.isInteger(o.groupSize)||
    o.distanceFromGroupFrontM<0||o.desiredPowerW<0||
    o.criticalPowerW<=0||o.reserveFraction<0||o.reserveFraction>1.00001||
    o.aeroFactor<=0||o.aeroFactor>1||
    (o.frontGapM!==null&&(!Number.isFinite(o.frontGapM)||o.frontGapM<0))||
    (o.frontSpeedMps!==null&&(!Number.isFinite(o.frontSpeedMps)||o.frontSpeedMps<0))||
    o.ownSpeedMps<0||o.riderMassKg<=0||o.bikeMassKg<=0||
    o.dragAreaM2<=0||o.rollingCoefficient<=0||
    o.drivetrainEfficiency<=0||o.drivetrainEfficiency>1)
    throw new RangeError('R22 Gruppenkohäsion: ungültige Beobachtung');
  if(o.groupSize<R22_GROUP_RIDING.minGroupSize)
    return {powerW:o.desiredPowerW,reason:'no_group'};
  if(['angriff','sprint','verfolgung','helferarbeit'].includes(o.tacticalIntent))
    return {powerW:o.desiredPowerW,reason:'active_mission'};
  if(o.isPacer)
    return {
      powerW:Math.min(o.desiredPowerW,o.groupPacerPowerW),
      reason:'front_rotation',
    };
  if(o.frontGapM===null||o.frontSpeedMps===null||
    o.frontGapM>R22_GROUP_RIDING.maxFollowingGapM)
    return {powerW:o.desiredPowerW,reason:'no_group'};
  // Aus den realen Kräften: Leistung zum Halten des Vordermann-Tempos.
  // Kein Geschwindigkeits-Sollwert wird direkt in die Physik eingespeist.
  const targetV=Math.max(0,o.referenceSpeedMps);
  const airV=Math.hypot(Math.max(0,targetV+o.headwindMps),o.crosswindMps);
  const mass=o.riderMassKg+o.bikeMassKg;
  const theta=Math.atan(o.gradeFraction);
  const gravity=mass*9.80665*Math.sin(theta);
  const roll=mass*9.80665*o.rollingCoefficient*Math.cos(theta);
  const drag=.5*o.airDensityKgM3*o.dragAreaM2*o.aeroFactor*
    airV*airV;
  const hold=Math.max(0,(drag+roll+gravity)*targetV/
    o.drivetrainEfficiency);
  // Gleiche Beschleunigung der Gruppe erfordert für jeden Fahrer
  // andere physisch nachvollziehbare Antriebsarbeit.
  const groupAccelerationPower=mass*targetV*
    Math.max(-1.5,Math.min(1.5,o.referenceAccelerationMps2))/
    o.drivetrainEfficiency;
  const response=R22_GROUP_RIDING.wattsPerSpeedDifferenceMps*
      (targetV-o.ownSpeedMps)+
    R22_GROUP_RIDING.wattsPerGapMeter*
      Math.min(30,Math.max(-15,
        o.frontGapM-R22_GROUP_RIDING.targetWheelGapM));
  const cap=o.criticalPowerW*
    (o.reserveFraction>.15?R22_GROUP_RIDING.maximumFollowingCpFraction:1);
  return {powerW:Math.max(0,Math.min(cap,
    hold+groupAccelerationPower+response)),
    reason:'follow_group'};
}
