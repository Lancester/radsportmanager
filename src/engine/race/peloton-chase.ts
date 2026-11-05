/**
 * R-22: koordinierte Mannschaftsjagd im Hauptfeld.
 * Teams wollen Kräfte sparen; nur Teams mit eigenem Sprinter-/GC-Interesse
 * schicken Helfer in die Verfolgung. Hysterese vermeidet zehnsekündiges
 * Hin und Her. KEINE Geschwindigkeit, Position oder Energie geschenkt.
 */
import type {IntelligentTeam,IntelligentRider,RaceSituation}
  from './race-team-ai.ts';
import {estimateOpponentThreat} from './opponent-assessment.ts';
import type {ThreatProfile} from './opponent-assessment.ts';

export interface ChaseCoordinatorState {
  active:readonly string[];sinceS:number;cooldownUntilS:number;
}
export const R22_CHASE=Object.freeze({
  minimumActionSeconds:150,
  cooldownSeconds:120,
  maximumTeams:3,
  minimumMainRiders:12,
  minimumGapM:65,
  maximumGapFraction:.13,
  maximumRemainingMToStart:200000,
});
export function coordinatePelotonChase(input:{
  timeS:number;remainingM:number;progress:number;
  mainGroupIds:ReadonlySet<string>;
  teams:readonly IntelligentTeam[];riders:readonly IntelligentRider[];
  situation:RaceSituation;previous:ChaseCoordinatorState;
  /** Only the opt-in stable-pack model, only a genuine flat sprint route. */
  sprintFinaleMode?:boolean;
  /** Opt-in: groessere Spitzengruppen und reale Mannschaftsinteressen. */
  adaptiveChase?:boolean;
  threatProfile?:ThreatProfile;
}):{state:ChaseCoordinatorState;chasingTeamIds:ReadonlySet<string>}{
  const {timeS,remainingM,progress,mainGroupIds,teams,riders,situation,previous}=input;
  const sprintFinale=input.sprintFinaleMode===true;
  const adaptive=input.adaptiveChase===true;
  if(!Number.isFinite(timeS)||timeS<0||!Number.isFinite(remainingM)||
    !Number.isFinite(progress)||!previous||!
    Number.isFinite(previous.sinceS)||!
    Number.isFinite(previous.cooldownUntilS))
    throw new RangeError('R22: ungültiger Jagdkoordinator');
  const groupMembers=riders.filter(r=>mainGroupIds.has(r.id));
  // Eine echte kleine Ausreißergruppe wird vom Sprint-Hauptfeld
  // beobachtet, auch wenn der ältere Team-AI-Prognosefilter die
  // Jagd als kurzfristig schwierig klassifiziert. Keine Jagd ohne
  // physisch abgesetzte Spitze und ausreichend großes Hauptfeld.
  const breakaway=situation.leadingBreakaway&&
    situation.gapM>=R22_CHASE.minimumGapM&&
    (adaptive||situation.gapFractionOfRemaining<
      (sprintFinale&&remainingM<=35000?.18:R22_CHASE.maximumGapFraction))&&
    groupMembers.length>=(adaptive?4:R22_CHASE.minimumMainRiders)&&
    remainingM>(adaptive?250:(sprintFinale?1000:1200))&&
    (adaptive||progress<(sprintFinale?.995:.94));
  // Ein begonnenes Teammandat läuft mindestens 150 s weiter,
  // sofern eine echte verfolgungswürdige Spitze besteht.
  if(!adaptive&&previous.active.length&&breakaway&&
    timeS-previous.sinceS<R22_CHASE.minimumActionSeconds)
    return {state:previous,chasingTeamIds:new Set(previous.active)};
  if(previous.active.length){
    if(breakaway&&!adaptive){
      // Nicht bei jedem 10-s-KI-Takt den Teamauftrag austauschen.
      return {state:previous,chasingTeamIds:new Set(previous.active)};
    }
    if(!breakaway){
      const ended={active:[],sinceS:timeS,
        cooldownUntilS:adaptive?timeS:timeS+R22_CHASE.cooldownSeconds};
      return {state:ended,chasingTeamIds:new Set()};
    }
  }
  if(!breakaway||(!adaptive&&timeS<previous.cooldownUntilS))
    return {state:previous,chasingTeamIds:new Set()};
  // Echte Mannschaftsinteressen: Sprintteams übernehmen zuerst Arbeit;
  // GC/ausgewogene Teams nur bei gefährlicher Flucht und freien Helfern.
  const leadingIds=new Set(situation.leadingRiderIds??[]);
  const knownField=riders.flatMap(r=>r.knownAbility?[r.knownAbility]:[]);
  const knownLeaders=riders.filter(r=>leadingIds.has(r.id)&&r.knownAbility)
    .map(r=>r.knownAbility!);
  // Öffentlich geschätzte Grundfähigkeiten, keine fremden aktuellen Reserven.
  // Ohne geeignete Daten bleibt das bisherige Verhalten erhalten.
  const assessed=adaptive&&!!input.threatProfile&&knownField.length>=2&&knownLeaders.length>0;
  const danger=assessed?Math.max(...knownLeaders.map(opponent=>
    estimateOpponentThreat({opponent,field:knownField,
      profile:input.threatProfile!,situation:'flucht'}))):null;
  const urgent=situation.gapFractionOfRemaining>.009||
    situation.projectedGapM>Math.max(400,remainingM*.025)||
    (danger!==null&&danger>=.8&&situation.gapM>=200);
  const choices=teams.map(team=>{
    const members=groupMembers.filter(r=>r.teamId===team.id);
    const helpers=members.filter(r=>r.role==='helfer'&&
      !(sprintFinale&&r.chaseSpent)&&r.reserveFraction>.32);
    const hasSprinter=members.some(r=>r.role==='sprinter');
    const hasCaptain=members.some(r=>r.role==='kapitaen');
    const ownLeadersAhead=adaptive&&riders.some(r=>
      leadingIds.has(r.id)&&r.teamId===team.id&&
      (r.role==='kapitaen'||r.role==='sprinter'));
    const ownHelperAhead=adaptive&&riders.some(r=>
      leadingIds.has(r.id)&&r.teamId===team.id&&r.role==='helfer');
    const ownRiderAhead=adaptive&&riders.some(r=>
      leadingIds.has(r.id)&&r.teamId===team.id);
    // Ein offensives Team ohne eigenen Fahrer kann eine erreichbare
    // Spitzengruppe zurückholen, um eine erneute Fluchtbildung zu versuchen.
    // Kein Einholen ohne verfügbare Helfer und keine Erfolgsgarantie.
    const wantsRepresentation=adaptive&&team.strategy==='offensiv'&&
      !ownRiderAhead&&situation.chaseViable&&
      situation.gapFractionOfRemaining<.04&&situation.relativeSpeedMps<1.5;
    const optedOut=(!adaptive&&sprintFinale&&team.chaseHelperCount===0)||
      ownLeadersAhead||(ownHelperAhead&&!urgent);
    const interested=!optedOut&&(
      team.strategy==='sprint'&&hasSprinter&&(!assessed||urgent)||
      urgent&&team.strategy==='kapitaen_schuetzen'&&hasCaptain||
      urgent&&team.strategy==='ausgewogen'&&hasCaptain||
      adaptive&&(urgent||wantsRepresentation)&&team.strategy==='offensiv'&&hasCaptain);
    return {team:team.id,helpers:helpers.length,
      score:team.strategy==='sprint'?3:
        team.strategy==='kapitaen_schuetzen'?2:1,interested};
  }).filter(x=>x.interested&&x.helpers>0)
    .sort((a,b)=>b.score-a.score||b.helpers-a.helpers||
      a.team.localeCompare(b.team))
    .slice(0,sprintFinale&&remainingM<35000?4:
      R22_CHASE.maximumTeams).map(x=>x.team);
  // Bestehende Mandate bleiben erhalten, solange die Teams noch
  // interessiert sind. Neu interessierte Teams dürfen dazukommen.
  if(adaptive&&previous.active.length){
    const stillEligible=previous.active.filter(id=>choices.includes(id));
    if(stillEligible.length){
      const active=[...stillEligible,...choices.filter(id=>!stillEligible.includes(id))];
      const state={...previous,active};
      return {state,chasingTeamIds:new Set(active)};
    }
  }
  const state={active:choices,sinceS:timeS,cooldownUntilS:previous.cooldownUntilS};
  return {state,chasingTeamIds:new Set(choices)};
}
