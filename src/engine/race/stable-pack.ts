/** R-22: separater, rückwärtskompatibler Versuch eines stabilen Mitfahrreglers.
 * Keine implizite Positions-/Geschwindigkeitsänderung: nur Kurbelwattwünsche.
 * Ein Jagdauftrag ist für Mitfahrer KEINE Lizenz zum Vollgas-Solo;
 * erst der tatsächlich vorne fahrende Helfer darf die volle Führungsleistung abrufen.
 */
import type {GroupRidingObservation,GroupRidingDecision} from './group-riding.ts';

export const STABLE_PACK=Object.freeze({
  wheelGapM:3,
  reconnectGapM:85,
  speedFeedbackWPerMps:120,
  gapFeedbackWPerM:3,
  maxCorrectionW:145,
  maxReserveCpFraction:1.12,
  exhaustedCpFraction:1,
  approachExtraW:18,
});
export function decideStablePackRiding(
  o:GroupRidingObservation,
  frontOfGroup:boolean,
):GroupRidingDecision {
  // Bewusste Attacken und Sprints bleiben echte, physisch auszuführende
  // Mehrleistung. Eine isolierte Verfolgung (>85m) bleibt individuell.
  if(o.tacticalIntent==='angriff'||o.tacticalIntent==='sprint')
    return {powerW:o.desiredPowerW,reason:'active_mission'};
  if(o.frontGapM===null||o.frontSpeedMps===null||
    o.frontGapM>STABLE_PACK.reconnectGapM){
    return {powerW:o.desiredPowerW,reason:'no_group'};
  }
  if(frontOfGroup&&['verfolgung','helferarbeit'].includes(o.tacticalIntent))
    return {powerW:o.desiredPowerW,reason:'active_mission'};
  if(frontOfGroup&&o.isPacer)
    return {powerW:Math.min(o.desiredPowerW,o.groupPacerPowerW),
      reason:'front_rotation'};
  // Das tatsächlich unmittelbar vorangehende Rad ist die lokale Referenz.
  // Ein Gruppenchef kann eine lange Gruppe nicht instantan beschleunigen.
  const v=o.frontSpeedMps;
  const airV=Math.hypot(Math.max(0,v+o.headwindMps),o.crosswindMps);
  const mass=o.riderMassKg+o.bikeMassKg;
  const theta=Math.atan(o.gradeFraction);
  const resistance=.5*o.airDensityKgM3*o.dragAreaM2*o.aeroFactor*airV**2+
    mass*9.80665*(o.rollingCoefficient*Math.cos(theta)+Math.sin(theta));
  const hold=Math.max(0,resistance*v/o.drivetrainEfficiency);
  const speedError=v-o.ownSpeedMps;
  const gapError=Math.max(-12,Math.min(45,
    o.frontGapM-STABLE_PACK.wheelGapM));
  const correction=Math.max(-STABLE_PACK.maxCorrectionW,
    Math.min(STABLE_PACK.maxCorrectionW,
      speedError*STABLE_PACK.speedFeedbackWPerMps+
      gapError*STABLE_PACK.gapFeedbackWPerM));
  // Jagdhelfer rücken mit echter, begrenzter Zusatzarbeit nach vorne.
  // Nicht-jagende Mitfahrer sparen Energie; bei fehlender Leistungsreserve
  // wird ein Abreißen als reales Ergebnis zugelassen.
  const extra=o.tacticalIntent==='verfolgung'?STABLE_PACK.approachExtraW:0;
  const cap=o.criticalPowerW*(o.reserveFraction>.15?
    STABLE_PACK.maxReserveCpFraction:STABLE_PACK.exhaustedCpFraction);
  return {powerW:Math.max(0,Math.min(cap,hold+correction+extra)),
    reason:'follow_group'};
}
