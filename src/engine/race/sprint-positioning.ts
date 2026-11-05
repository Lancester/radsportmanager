/**
 * R-22: dreiphasige Teamtaktik für reine Sprintrennen.
 *
 * 0-75 %: Im Hauptfeld bleiben und energiesparend mitfahren. Ein Zielsprinter
 * am hintersten Feldende darf nur begrenzt Kontaktpflege-Watt anfordern.
 * 75-94 %: Aufrücken ins vordere Viertel mit Helferbegleitung.
 * Ab 94 %: vorderes Fünftel ohne überflüssige Beschleunigungsduelle sichern.
 *
 * Für den tatsächlichen Sprint (<250 m) gilt weiterhin chooseRacePower und
 * der physikalische Windschatten; keine direkte Platzierung oder Siegchance.
 * Pure Watt-Heuristik: motion-core, CP/W′ und R-19 bleiben unverändert.
 */
export const SPRINT_POSITION=Object.freeze({
  minRaceM:140000,
  maxAscentM:1650,
  minGroupSize:40,
  shelterFromProgress:.10,
  advanceFromProgress:.75,
  leadoutFromProgress:.94,
  finishCutoffProgress:.995,
  minReserveFraction:.32,
  // Das Hauptfeld hinten verlassen ist in der ersten Phase nicht das Ziel:
  // nur hinter dem letzten ~12 % vorsichtig Anschluss sichern.
  rearSafetyFraction:.88,
  advanceFrontShare:.25,
  // Im letzten 6-%-Abschnitt ist Platz im vorderen Fuenftel
  // ausreichend, um nicht gleichzeitig 8 Sprintteams aus dem
  // gemeinsamen Hauptfeld herausbeschleunigen zu lassen.
  // Die eigentliche Schlussposition entsteht spaeter physisch.
  leadoutFrontShare:.20,
  minRankToPosition:12,
  safetyExtraW:18,
  advanceExtraW:65,
  leadoutExtraW:65,
  escortExtraW:30,
  escortMaxDistanceM:30,
  safetyCpFraction:.97,
  advanceCpFraction:1.04,
  leadoutCpFraction:1.06,
  escortCapCpFraction:1.0,
});
export interface SprintPositionObservation {
  sprintFriendlyRace:boolean;
  strategy:string;specialty:string|undefined;
  isTargetSprinter:boolean;isEscort:boolean;
  progress:number;
  /** Optional: dynamische Planung anhand realer Reststrecke/-geschwindigkeit. */
  remainingM?:number;ownSpeedMps?:number;wheelFindingSkill?:number;
  groupSize:number;rankInGroup:number;
  distanceFromGroupFrontM:number;
  targetRankInGroup:number|null;
  distanceToTargetM:number|null;
  frontGapM:number|null;
  currentIntent:string;
  reserveFraction:number;
  criticalPowerW:number;
  followPowerW:number;
}
export type SprintPositionDecision={
  powerW:number;
  reason:'protect_peloton_contact'|'advance_for_sprint'|
    'leadout_position'|'escort_sprinter';
};
/** Ausschließlich Watt, keine direkte Beschleunigung oder Teleportation. */
export function decideSprintPosition(
  o:SprintPositionObservation,
):SprintPositionDecision|null {
  const c=SPRINT_POSITION;
  const dynamic=o.remainingM!==undefined&&o.ownSpeedMps!==undefined&&
    Number.isFinite(o.remainingM)&&Number.isFinite(o.ownSpeedMps)&&o.ownSpeedMps>0;
  if(!o.sprintFriendlyRace||
    o.strategy!=='sprint'||(dynamic?o.remainingM!<=250:o.progress>=c.finishCutoffProgress)||
    o.groupSize<(dynamic?3:c.minGroupSize)||
    o.rankInGroup<1||o.rankInGroup>o.groupSize||
    o.frontGapM===null||o.frontGapM>42||
    o.reserveFraction<c.minReserveFraction||
    ['angriff','sprint','verfolgung','helferarbeit','erholung']
      .includes(o.currentIntent)||
    !Number.isFinite(o.followPowerW)||o.followPowerW<0||
    !Number.isFinite(o.criticalPowerW)||o.criticalPowerW<=0)
    return null;
  const sprinter=o.isTargetSprinter&&o.specialty==='sprinter';
  const escort=o.isEscort&&!sprinter&&
    o.distanceToTargetM!==null&&
    Math.abs(o.distanceToTargetM)<=c.escortMaxDistanceM&&
    o.targetRankInGroup!==null&&
    o.rankInGroup>=o.targetRankInGroup;
  if(!sprinter&&!escort)return null;

  // Vor dem letzten Viertel NUR rückwärtige Abrissgefahr entschärfen.
  // Kein Drang in die Top 20 bei km 20.
  // Zeit bis Ziel gegenüber geschätztem Positionsbedarf: dynamischer,
  // aber ausdrücklich vorläufiger Plan, keine Prozent-Schranke.
  const skill=Math.max(0,Math.min(1,o.wheelFindingSkill??.5));
  const timeToFinish=dynamic?o.remainingM!/o.ownSpeedMps!:Infinity;
  const neededPositionTime=dynamic?300+Math.max(0,o.distanceFromGroupFrontM)*3+
    (1-skill)*180:0;
  const shelter=dynamic?timeToFinish>neededPositionTime:
    o.progress<c.advanceFromProgress;
  if(shelter){
    if(!sprinter||(!dynamic&&o.progress<c.shelterFromProgress)||
      o.rankInGroup<=Math.ceil(o.groupSize*c.rearSafetyFraction))
      return null;
    const powerW=Math.min(o.criticalPowerW*c.safetyCpFraction,
      o.followPowerW+c.safetyExtraW);
    return powerW>o.followPowerW+1?
      {powerW,reason:'protect_peloton_contact'}:null;
  }
  const leadout=dynamic?timeToFinish<=120+Math.max(0,o.distanceFromGroupFrontM):
    o.progress>=c.leadoutFromProgress;
  const wanted=Math.ceil(o.groupSize*(leadout?
    c.leadoutFrontShare:c.advanceFrontShare));
  const threshold=dynamic?Math.max(1,wanted):Math.max(c.minRankToPosition,wanted);
  if(sprinter&&o.rankInGroup<=threshold)return null;
  if(escort&&(o.targetRankInGroup===null||
    o.targetRankInGroup<=threshold))return null;
  const bonus=sprinter?
    (leadout?c.leadoutExtraW:c.advanceExtraW):c.escortExtraW;
  const cap=o.criticalPowerW*(sprinter?
    (leadout?c.leadoutCpFraction:c.advanceCpFraction):
    c.escortCapCpFraction);
  const powerW=Math.min(cap,o.followPowerW+bonus);
  if(powerW<=o.followPowerW+1)return null;
  return {powerW,reason:sprinter?
    (leadout?'leadout_position':'advance_for_sprint'):'escort_sprinter'};
}
