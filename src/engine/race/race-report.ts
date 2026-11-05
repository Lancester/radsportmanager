/** Rennbericht aus tatsächlich aufgezeichneten Daten.
 * Keine erfundenen Ursachen und keine neuen Rennergebnisse. */
import type {RaceClassification,RaceEvent,RaceResult} from './race-simulator.ts';
export interface ReportFavorite {riderId:string;preRaceRank:number}
export interface RaceReport {
  winner:{riderId:string;finishTimeS:number;groupTimeS:number};
  results:Array<{rank:number;riderId:string;teamId:string;finishTimeS:number;
    groupTimeS:number;groupGapS:number}>;
  favorites:Array<{riderId:string;preRaceRank:number;finishRank:number|null;
    groupGapS:number|null}>;
  events:Array<{type:string;timeS:number;km:number;riderId?:string;
    teamId?:string;description:string}>;
  eventCount:number;truncated:boolean;
}
export function createRaceReport(o:{result:Pick<RaceResult,'classification'|'events'>;
  favorites?:readonly ReportFavorite[];focusTeamId?:string;eventLimit?:number}):RaceReport{
  const riders=o.result.classification;
  if(!riders.length)throw new RangeError('Rennbericht: keine Zielankünfte');
  const limit=o.eventLimit??100;
  if(!Number.isInteger(limit)||limit<1)throw new RangeError('Rennbericht: Ereignislimit');
  const classified=new Map(riders.map(r=>[r.id,r]));
  const noteworthy=new Set(['attack','bridge-start','bridge-stop','bridge-relay',
    'bridge-relay-position-change','breakaway',
    'breakaway-caught','team-chase','team-pace','sprint-train']);
  const events=o.result.events.filter(e=>noteworthy.has(e.type)&&
    (!o.focusTeamId||!e.teamId||e.teamId===o.focusTeamId));
  const first=riders[0];
  return {winner:{riderId:first.id,finishTimeS:first.finishTimeS,groupTimeS:first.groupTimeS},
    results:riders.filter(r=>!o.focusTeamId||r.teamId===o.focusTeamId).map(r=>({
      rank:r.rank,riderId:r.id,teamId:r.teamId,finishTimeS:r.finishTimeS,
      groupTimeS:r.groupTimeS,groupGapS:r.groupGapS})),
    favorites:(o.favorites??[]).map(f=>({riderId:f.riderId,preRaceRank:f.preRaceRank,
      finishRank:classified.get(f.riderId)?.rank??null,
      groupGapS:classified.get(f.riderId)?.groupGapS??null})),
    events:events.slice(0,limit).map(e=>({type:e.type,timeS:e.timeS,km:e.km,
      ...(e.riderId?{riderId:e.riderId}:{}),...(e.teamId?{teamId:e.teamId}:{}),
      description:e.description})),eventCount:events.length,truncated:events.length>limit};
}
