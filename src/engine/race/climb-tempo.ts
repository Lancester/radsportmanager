/** R-22 (nur stable-pack): eigener Tempoentschluss bei langen steilen
 * Anstiegen. Keine physiologischen oder kinematischen Boni.
 *
 * Die zentrale 1D-Gruppenfahrt lässt Fahrer sonst praktisch immer am
 * Tempo des ersten Rades kleben – selbst wenn sie mit ihrer realen
 * Masse und CP dauerhaft schneller steigen könnten. Dieses Modul
 * erlaubt eine physisch mögliche Aufrückarbeit durch echte Kurbelwatt.
 */
import type {GroupRidingObservation} from './group-riding.ts';

export const CLIMB_TEMPO=Object.freeze({
  minimumGrade:0.055,
  minimumClimbLengthM:5000,
  maximumDistanceFromGroupFrontM:220,
  minimumGroupSize:4,
  minimumReserveFraction:0.12,
  minimumExposedPowerSurplusW:22,
  sustainedCpFraction:0.98,
  maximumBoostW:80,
});

export interface ClimbTempoObservation extends GroupRidingObservation {
  specialty?:string;
  role:string;
  remainingM:number;
  climbLengthM:number;
  abilityBased?:boolean;
}

/** Null = reguläre Gruppenregelung; Zahl = reine Wattanfrage. */
export function decideClimbTempo(
  o:ClimbTempoObservation,
):number|null {
  // Nur Kletterer – inklusive der aus demselben Modell abgeleiteten
  // Klassementfahrer. Sprint und echte Angriffe bleiben unberührt.
  if((!o.abilityBased&&o.specialty!=='kletterer')||o.role!=='kapitaen'||
    o.gradeFraction<CLIMB_TEMPO.minimumGrade||
    o.climbLengthM<CLIMB_TEMPO.minimumClimbLengthM||
    o.groupSize<CLIMB_TEMPO.minimumGroupSize||
    o.distanceFromGroupFrontM>CLIMB_TEMPO.maximumDistanceFromGroupFrontM||
    o.isPacer||
    o.reserveFraction<CLIMB_TEMPO.minimumReserveFraction||
    o.remainingM<250||
    !['grundtempo','windschatten'].includes(o.tacticalIntent)||
    !Number.isFinite(o.referenceSpeedMps)||o.referenceSpeedMps<=0)
    return null;
  // Wir prüfen den Leistungsbedarf OHNE Windschatten: Ein Fahrer soll
  // nicht nur dank einer geschützten Position "gratis" nach vorne fahren.
  const v=o.referenceSpeedMps;
  const m=o.riderMassKg+o.bikeMassKg;
  const theta=Math.atan(o.gradeFraction);
  const airV=Math.hypot(Math.max(0,v+o.headwindMps),o.crosswindMps);
  const bareHoldW=v/o.drivetrainEfficiency*(
    .5*o.airDensityKgM3*o.dragAreaM2*airV*airV+
    m*9.80665*(o.rollingCoefficient*Math.cos(theta)+Math.sin(theta))
  );
  const sustainableW=CLIMB_TEMPO.sustainedCpFraction*o.criticalPowerW;
  if(sustainableW-bareHoldW<CLIMB_TEMPO.minimumExposedPowerSurplusW)
    return null;
  // Er kann nur so stark beschleunigen, wie ihn die eigene
  // vorliegende CP und die geforderte tatsächliche Kurbelwatt erlauben.
  // R-19 reduziert diese Wattanfrage anschließend ggf. zusätzlich.
  return Math.min(sustainableW,bareHoldW+CLIMB_TEMPO.maximumBoostW);
}
