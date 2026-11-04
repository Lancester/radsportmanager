/**
 * R-23: allgemeine Angriffssituation ohne harte 88%-Distanzsperre.
 * Ein Angriff ist ein physisch abzurechnender Wattantrag (Renn-KI).
 * Keine Direktmanipulation von Geschwindigkeit, Gruppe oder W'.
 * Etappenspezifische Strategien (Sprint, Klassiker, Huegel) haben Vorrang.
 */
export const GENERAL_ATTACK=Object.freeze({
  minimumElapsedS:250,
  minimumRemainingM:600,
  minimumReserve:.42,
  minimumGroupSize:4,
  minimumAttackAgeS:900,
  minimumCpGroupFactor:.93,
  earlyProgressFrom:.015,earlyProgressUntil:.13,
  earlyMinTimeS:180,earlyGroupFrontM:150,earlyRaceFrontM:220,
  defaultGroupFrontM:40,defaultRaceFrontM:120,
  flatFinishDistanceM:12000,
  flatFinishMaxGrade:.04,
  flatFinishReserve:.85,
  flatFinishMinAgeS:2400,
  flatFinishGroupFrontM:6,
  flatFinishCpGroupFactor:1.08,
  continueS:40,continueReserve:.18,
});
export interface GeneralAttackObservation {
  progress:number;timeS:number;remainingM:number;
  gradeFraction:number;
  groupSize:number;distanceFromGroupFrontM:number;
  distanceFromRaceFrontM:number;
  dayCpW:number;meanGroupCpW:number;
  reserveFraction:number;lastAttackAgeS:number;
  currentIntent:string;
  earlyRacingModel:boolean;
}
/** Nur echte taktisch moegliche Angriffe – der Gruppen-/Physikmotor
 * entscheidet anschliessend, ob sich die Attacke ueberhaupt loest. */
export function decideGeneralAttackOpportunity(o:GeneralAttackObservation):
  boolean {
  const n=[o.progress,o.timeS,o.remainingM,o.gradeFraction,
    o.groupSize,o.distanceFromGroupFrontM,o.distanceFromRaceFrontM,
    o.dayCpW,o.meanGroupCpW,o.reserveFraction,o.lastAttackAgeS];
  if(n.some(v=>!Number.isFinite(v))||
    o.progress<0||o.progress>1||o.timeS<0||o.remainingM<0||
    !Number.isInteger(o.groupSize)||o.groupSize<1||
    o.distanceFromGroupFrontM<0||o.distanceFromRaceFrontM<0||
    o.dayCpW<=0||o.meanGroupCpW<=0||
    o.reserveFraction<0||o.reserveFraction>1.000001)
    throw new RangeError('R23: ungueltige allgemeine Angriffslage');
  const c=GENERAL_ATTACK;
  if(o.currentIntent==='angriff'&&
    o.lastAttackAgeS>=0&&o.lastAttackAgeS<c.continueS)
    return o.reserveFraction>=c.continueReserve;
  if(o.timeS<c.minimumElapsedS||
    o.remainingM<c.minimumRemainingM||
    o.groupSize<c.minimumGroupSize)return false;
  const early=o.earlyRacingModel&&
    o.timeS>=c.earlyMinTimeS&&
    o.progress>=c.earlyProgressFrom&&
    o.progress<c.earlyProgressUntil;
  // Das 18%-Mindestfenster ist fuer bestehende mittlere Rennen aus
  // Kompatibilitaetsgruenden belassen. Es gibt KEINE Obergrenze bei 88%.
  if(!early&&o.progress<.18)return false;
  const protectedFlatFinish=o.remainingM<=c.flatFinishDistanceM&&
    o.gradeFraction<c.flatFinishMaxGrade;
  const neededReserve=protectedFlatFinish?
    c.flatFinishReserve:c.minimumReserve;
  const cooldown=protectedFlatFinish?
    c.flatFinishMinAgeS:c.minimumAttackAgeS;
  const nearGroup=early?c.earlyGroupFrontM:
    protectedFlatFinish?c.flatFinishGroupFrontM:c.defaultGroupFrontM;
  const cpFactor=protectedFlatFinish?
    c.flatFinishCpGroupFactor:c.minimumCpGroupFactor;
  return o.lastAttackAgeS>=cooldown&&
    o.reserveFraction>=neededReserve&&
    o.distanceFromGroupFrontM<=nearGroup&&
    o.distanceFromRaceFrontM<=(early?
      c.earlyRaceFrontM:c.defaultRaceFrontM)&&
    o.dayCpW>=o.meanGroupCpW*cpFactor&&
    o.gradeFraction>=-.03;
}
