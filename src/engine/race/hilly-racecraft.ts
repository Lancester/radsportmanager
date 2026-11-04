/**
 * R-23 – autonome Huegelrenn-KI. Alle Entscheidungen sind lediglich
 * Wattwuensche bzw. taktische Freigaben. Kein Fahrer wird teleportiert,
 * keine CP/W'-Energie/Abstandsgruppe und keine Zielzeit manipuliert.
 * Aktivierung ausschliesslich aus der geometrischen Streckencharakteristik
 * im expliziten stable-pack-Experiment.
 */
import {contiguousClimbRuns} from './climb-runs.ts';

export const HILLY_RACECRAFT=Object.freeze({
  minRaceM:160000,maxRaceM:225000,
  minAscentM:1750,maxAscentM:3150,
  minSteepRamps:2,maxLongClimbM:6000,
  minRampGrade:.065,minRampLengthM:700,maxRampLengthM:2500,
  // Nur die Anfangsflucht benutzt eine Startphase; alle
  // Profil-Angriffe sind an jedem Streckenpunkt moeglich.
  earlyFromProgress:.015,earlyUntilTimeS:2700,
  earlyMinTimeS:180,earlyMinReserve:.53,
  tacticalRampMinGrade:.075,
  reserveAtStart:.55,reserveAtFinish:.36,
  rampFromFraction:.12,rampUntilFraction:.92,
  continueMinReserve:.18,
  minimumRepeatAttackAgeS:1500,continueAttackSeconds:65,
  minimumGroupSize:4,
  maxPositionGapM:115,maxRaceGapM:950,
  tempoMinReserve:.20,tempoMinGrade:.075,
  tempoMaxGroupFrontGapM:70,
  tempoMaxRaceFrontGapM:650,tempoMaxCpFraction:1.075,
  tempoMaxAddedPowerW:38,
});
export interface HillyRouteObservation {
  raceLengthM:number;ascentM:number;
  segments:readonly {lengthM:number;gradeFraction:number}[];
}
export function isSelectiveHillyRoute(o:HillyRouteObservation):boolean{
  const c=HILLY_RACECRAFT;
  if(!Number.isFinite(o.raceLengthM)||!Number.isFinite(o.ascentM)||
    !Array.isArray(o.segments)||o.segments.length===0||
    o.segments.some(x=>!Number.isFinite(x.lengthM)||
      !Number.isFinite(x.gradeFraction)||x.lengthM<=0))return false;
  const ramps=o.segments.filter(s=>
    s.lengthM>=c.minRampLengthM&&
    s.lengthM<=c.maxRampLengthM&&
    s.gradeFraction>=c.minRampGrade).length;
  const longClimb=o.segments.some(s=>
    s.lengthM>=c.maxLongClimbM&&s.gradeFraction>=.05);
  return o.raceLengthM>=c.minRaceM&&o.raceLengthM<=c.maxRaceM&&
    o.ascentM>=c.minAscentM&&o.ascentM<=c.maxAscentM&&
    ramps>=c.minSteepRamps&&!longClimb;
}
/** R-24: identische Geometrie fuehrt bei verschiedener Segmentierung und
 * wenigen Metern Unterschied in der Gesamtlaenge zum selben Verhalten. */
export function isAdaptiveHillyRoute(o:HillyRouteObservation):boolean{
  if(!Number.isFinite(o.raceLengthM)||o.raceLengthM<=0||
    !Number.isFinite(o.ascentM)||o.ascentM<0||
    !Array.isArray(o.segments)||!o.segments.length||
    o.segments.some(s=>!Number.isFinite(s.lengthM)||s.lengthM<=0||
      !Number.isFinite(s.gradeFraction)))return false;
  const c=HILLY_RACECRAFT;
  const ramps=contiguousClimbRuns(o.segments,c.minRampGrade).filter(s=>
    s.lengthM>=c.minRampLengthM&&s.lengthM<=c.maxRampLengthM);
  const longClimb=contiguousClimbRuns(o.segments,.05).some(s=>
    s.lengthM>=c.maxLongClimbM);
  return ramps.length>=c.minSteepRamps&&!longClimb;
}
export interface HillyTacticalObservation {
  enabled:boolean;role:string;strategy:string;specialty?:string;
  progress:number;timeS:number;segmentLengthM:number;
  segmentProgress:number;gradeFraction:number;
  groupSize:number;gapToGroupFrontM:number;gapToRaceFrontM:number;
  reserveFraction:number;lastAttackAgeS:number;
  currentIntent:string;isGroupNominee:boolean;
  breakawayEstablished?:boolean;
  /** Gleiche physische Faehigkeiten erhalten dieselbe Tempochance. */
  abilityBased?:boolean;
  criticalPowerW:number;requestedPowerW:number;
}
function valid(o:HillyTacticalObservation):boolean{
  const numbers=[o.progress,o.timeS,o.segmentLengthM,
    o.segmentProgress,o.gradeFraction,o.gapToGroupFrontM,
    o.gapToRaceFrontM,o.reserveFraction,o.lastAttackAgeS,
    o.criticalPowerW,o.requestedPowerW];
  return numbers.every(Number.isFinite)&&
    o.progress>=0&&o.progress<=1&&o.timeS>=0&&
    o.segmentLengthM>0&&o.segmentProgress>=0&&
    o.segmentProgress<=1.000001&&o.groupSize>=1&&
    Number.isInteger(o.groupSize)&&
    o.gapToGroupFrontM>=0&&o.gapToRaceFrontM>=0&&
    o.reserveFraction>=0&&o.reserveFraction<=1.000001&&
    o.criticalPowerW>0&&o.requestedPowerW>=0;
}
function selectiveRamp(o:HillyTacticalObservation,
  minGrade=HILLY_RACECRAFT.tacticalRampMinGrade):boolean{
  const c=HILLY_RACECRAFT;
  return o.segmentLengthM>=c.minRampLengthM&&
    o.segmentLengthM<=c.maxRampLengthM&&
    o.gradeFraction>=minGrade&&
    o.segmentProgress>=c.rampFromFraction&&
    o.segmentProgress<=c.rampUntilFraction;
}
/**
 * A) Fruehe (freiwillige) Fluchtbildung und
 * B) spaete Attacken an echten steilen Rampen.
 * Nie fortgesetztes, ueber die ganze Etappe verteiltes CP+100W-Roulette.
 */
export function decideHillyAttackOpportunity(
  o:HillyTacticalObservation,
):boolean{
  if(!valid(o))throw new RangeError('R23: ungueltige Huegelattacke');
  if(!o.enabled||o.role!=='kapitaen'||o.strategy!=='offensiv'||
    ['sprint','erholung','verfolgung','helferarbeit'].includes(o.currentIntent))
    return false;
  const c=HILLY_RACECRAFT;
  if(o.currentIntent==='angriff'&&
    o.lastAttackAgeS>=0&&o.lastAttackAgeS<c.continueAttackSeconds)
    return o.reserveFraction>=c.continueMinReserve;
  // In den ersten drei Rennminuten keine Attacken aus dem
  // noch nicht etablierten Startfeld heraus erzwingen.
  if(o.timeS<c.earlyMinTimeS)return false;
  if(!o.isGroupNominee||
    o.lastAttackAgeS<c.minimumRepeatAttackAgeS||
    o.groupSize<c.minimumGroupSize||
    o.gapToGroupFrontM>c.maxPositionGapM||
    o.gapToRaceFrontM>c.maxRaceGapM)return false;
  const early=!o.breakawayEstablished&&
    o.progress>=c.earlyFromProgress&&
    o.timeS>=c.earlyMinTimeS&&
    o.timeS<=c.earlyUntilTimeS&&
    o.reserveFraction>=c.earlyMinReserve&&
    o.gradeFraction>=-.025;
  // Sinkende Mindestreserve, wenn das Ziel naeher rueckt,
  // statt eines starren Freigabefensters bei 76%/88%.
  const requiredReserve=c.reserveAtStart-
    (c.reserveAtStart-c.reserveAtFinish)*o.progress;
  const ramp=o.reserveFraction>=requiredReserve&&
    selectiveRamp(o);
  return early||ramp;
}
/**
 * Kontrolliertes, fuer Minuten durchhaltbares Pacing am Schluesselanstieg:
 * EIN geeigneter physisch VORNE fahrender Puncheur pro Abstandsgruppe.
 * Nicht jeder attackiert; der reale CP/W'-Kern begrenzt den Wunsch.
 */
export function decideHillyRampTempo(o:HillyTacticalObservation):
  number|null{
  if(!valid(o))throw new RangeError('R23: ungueltiges Huegeltempo');
  const c=HILLY_RACECRAFT;
  if(!o.enabled||!o.isGroupNominee||
    o.role!=='kapitaen'||
    (!o.abilityBased&&!['klassiker','allrounder','kletterer','zeitfahrer']
      .includes(o.specialty??''))||
    !selectiveRamp(o,c.tempoMinGrade)||
    o.groupSize<c.minimumGroupSize||
    o.gapToGroupFrontM>c.tempoMaxGroupFrontGapM||
    o.gapToRaceFrontM>c.tempoMaxRaceFrontGapM||
    o.reserveFraction<c.tempoMinReserve||
    ['angriff','sprint','erholung','verfolgung','helferarbeit']
      .includes(o.currentIntent))return null;
  const factor=Math.min(c.tempoMaxCpFraction,
    1.035+Math.max(0,o.gradeFraction-c.minRampGrade)*.9);
  // Kein kostenloser grosser Leistungssprung aus dem Windschatten.
  // Der echte Fuehrungswatt-Bedarf bleibt Ausgangspunkt.
  const demand=Math.min(o.criticalPowerW*factor,
    o.requestedPowerW+c.tempoMaxAddedPowerW);
  return demand>o.requestedPowerW+1?demand:null;
}
