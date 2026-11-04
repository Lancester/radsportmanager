/**
 * R-22: Gelegenheitsentscheidung für neue Attacken im modernen Gruppenmodell.
 *
 * Ohne fixe 18-%-/88-%-Rennfenster. Es zählen die wirklich verfügbare
 * Reststrecke/Zeit, Topografie, Physik, Situation, Position und W′-Reserve.
 * Keine Bewegung, Geschwindigkeit, Zeit oder zusätzlichen Watt erzeugen.
 * Die Watt-Anfrage geht wie bisher an chooseRacePower / CP-W′ / motion-core.
 */
export const ADAPTIVE_ATTACK=Object.freeze({
  minimumRaceAgeS:180,
  minimumExpectedAttackSeconds:40,
  minimumFinishDistanceM:260,
  cooldownForRiderS:900,
  minimumTimeBetweenStartsS:90,
  continueAttackS:40,
  minimumContinuingReserve:.18,
  minimumStartingReserve:.42,
  minimumGroupSize:4,
  maxDistanceFromGroupFrontM:75,
  maxDistanceToRaceFrontM:240,
  minimumRelativeCp:.93,
  climbOpportunityGrade:.026,
  protectedCaptainClimbGrade:.055,
  minimumFlatAggression:.58,
  maximumDownhillGrade:-.03,
});
export interface AdaptiveAttackObservation {
  enabled:boolean;
  strategy:string;role:string;
  timeS:number;remainingM:number;speedMps:number;
  gradeFraction:number;aggression:number;
  currentIntent:string;reserveFraction:number;
  ageSinceLastAttackS:number;
  ageSinceAnyGroupAttackS:number;
  groupSize:number;rankInGroup:number;
  distanceFromGroupFrontM:number;
  gapToRaceFrontM:number;
  relativeCp:number;
  isBestEligibleInGroup:boolean;
  leadingBreakaway:boolean;
}
export function decideAdaptiveAttack(o:AdaptiveAttackObservation):boolean {
  const c=ADAPTIVE_ATTACK;
  if(!o.enabled||!Number.isFinite(o.timeS)||o.timeS<0||
    !Number.isFinite(o.remainingM)||o.remainingM<0||
    !Number.isFinite(o.speedMps)||o.speedMps<=0||
    !Number.isFinite(o.gradeFraction)||!Number.isFinite(o.aggression)||
    o.aggression<0||o.aggression>1||
    !Number.isFinite(o.reserveFraction)||o.reserveFraction<0||
    o.reserveFraction>1.000001||
    !Number.isFinite(o.ageSinceLastAttackS)||
    !Number.isFinite(o.ageSinceAnyGroupAttackS)||
    !Number.isInteger(o.groupSize)||o.groupSize<1||
    !Number.isInteger(o.rankInGroup)||o.rankInGroup<1||
    o.rankInGroup>o.groupSize||
    !Number.isFinite(o.distanceFromGroupFrontM)||
    o.distanceFromGroupFrontM<0||
    !Number.isFinite(o.gapToRaceFrontM)||o.gapToRaceFrontM<0||
    !Number.isFinite(o.relativeCp)||o.relativeCp<=0)
    return false;
  if(o.currentIntent==='angriff'&&o.ageSinceLastAttackS>=0&&
    o.ageSinceLastAttackS<c.continueAttackS&&
    o.reserveFraction>=c.minimumContinuingReserve)
    return true;
  // "zu spaet" wird in Sekunden verbleibender physischer Fahrzeit
  // beurteilt, nicht in Prozent der Etappenlaenge.
  if(o.remainingM<Math.max(c.minimumFinishDistanceM,
    o.speedMps*c.minimumExpectedAttackSeconds)||
    o.timeS<c.minimumRaceAgeS||
    o.ageSinceLastAttackS<c.cooldownForRiderS||
    o.ageSinceAnyGroupAttackS<c.minimumTimeBetweenStartsS||
    o.reserveFraction<c.minimumStartingReserve||
    o.groupSize<c.minimumGroupSize||
    o.distanceFromGroupFrontM>c.maxDistanceFromGroupFrontM||
    o.gapToRaceFrontM>c.maxDistanceToRaceFrontM||
    o.relativeCp<c.minimumRelativeCp||
    !o.isBestEligibleInGroup||
    ['sprint','erholung','verfolgung','helferarbeit']
      .includes(o.currentIntent)||
    o.gradeFraction<c.maximumDownhillGrade||
    o.role!=='kapitaen')return false;
  const climb=o.gradeFraction>=c.climbOpportunityGrade;
  const isProtectedClimber=o.strategy==='kapitaen_schuetzen'&&
    o.gradeFraction>=c.protectedCaptainClimbGrade;
  const offensive=o.strategy==='offensiv';
  if(!offensive&&!isProtectedClimber)return false;
  // Eine Flucht weit vor dem Feld spricht gegen neue punktlose
  // Flachattacker; auf einer selektiven Rampe bleiben Konter erlaubt.
  if(o.leadingBreakaway&&!climb)return false;
  return climb||o.aggression>=c.minimumFlatAggression;
}
