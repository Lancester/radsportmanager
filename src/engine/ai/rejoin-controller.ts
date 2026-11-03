/**
 * R-08: konservative Wieder-Einscherentscheidung nach Überholmanöver.
 * Einfache Trainingsgeometrie: Rückkehr nur von ganz vorne ins Feld.
 * Keine taktische Einordnung in eine Innenlücke und keine Garantie bei
 * unerwarteten Geschwindigkeitsänderungen anderer Fahrer.
 */
import type {LaneObservation,OvertakeDecision} from './overtake-controller.ts';
import {lanePlanConflicts} from './lane-coordination.ts';
import type {ReservedLaneMove,LanePlanOptions} from './lane-coordination.ts';

export interface RejoinConfig {
  homeLaneM:number;
  requiredLeadGapM:number;
  minimumCompletedPasses:number;
}
export const R08_REJOIN:Readonly<RejoinConfig>=Object.freeze({
  homeLaneM:0,requiredLeadGapM:8,minimumCompletedPasses:7,
});
export function decideRejoin(
  riderId:string,obs:LaneObservation,
  config:RejoinConfig,
  completedPasses:number,rateMps:number,
  reservations:readonly ReservedLaneMove[],
  options:LanePlanOptions,
):OvertakeDecision {
  if(!config||!Number.isFinite(config.homeLaneM)||
      !Number.isFinite(config.requiredLeadGapM)||
      config.requiredLeadGapM<=options.minLongM ||
      !Number.isSafeInteger(config.minimumCompletedPasses)||
      config.minimumCompletedPasses<1)
    throw new RangeError('Wiedereinscheren: ungültige Regeln');
  if(!Number.isSafeInteger(completedPasses)||completedPasses<0)
    throw new RangeError('Wiedereinscheren: Überholzahl');
  const own=obs.riders.find(r=>r.id===riderId);
  if(!own)throw new RangeError('Wiedereinscheren: Fahrer nicht vorhanden');
  if(completedPasses<config.minimumCompletedPasses)
    return {action:'stay',reason:'Noch nicht genügend Fahrer überholt'};
  if(Math.abs(own.lateralPositionM-config.homeLaneM)<options.minLateralM/2)
    return {action:'stay',reason:'Schon auf der Heimatspur'};
  if(Math.abs(config.homeLaneM)>obs.roadHalfWidthM)
    return {action:'stay',reason:'Zielspur liegt außerhalb der Straße'};
  // In dieser Prototypenstufe NUR vor allen anderen Fahrern auf der
  // Heimatspur mit Sicherheitsvorsprung wieder einscheren. Niemals
  // ungeprüft zwischen einen Vordermann und einen Hintermann.
  const nearby=obs.riders.filter(r=>r.id!==riderId &&
    Math.abs(r.lateralPositionM-config.homeLaneM)<options.minLateralM);
  if(nearby.some(r=>own.positionM-r.positionM<config.requiredLeadGapM))
    return {action:'stay',reason:'Vorsprung für Rückkehr zu gering'};
  const propose={riderId,targetM:config.homeLaneM,rateMps};
  if(lanePlanConflicts(obs,propose,reservations,options))
    return {action:'stay',reason:'Vorhergesagter Konflikt beim Wiedereinscheren'};
  return {action:'move',targetLateralPositionM:config.homeLaneM,
    reason:'Überholt; sichere freie Rückkehr vor der Gruppe prognostiziert'};
}
