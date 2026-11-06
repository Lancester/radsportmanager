/** Rennbericht aus tatsächlich aufgezeichneten Daten.
 * Keine erfundenen Ursachen und keine neuen Rennergebnisse. */
import type {RaceResult} from './race-simulator.ts';
export interface ReportFavorite {riderId:string;preRaceRank:number}
export interface RaceReport {
  winner:{riderId:string;name:string;finishTimeS:number;groupTimeS:number};
  results:Array<{rank:number;riderId:string;name:string;teamId:string;finishTimeS:number;
    groupTimeS:number;groupGapS:number}>;
  favorites:Array<{riderId:string;name?:string;preRaceRank:number;finishRank:number|null;
    groupGapS:number|null}>;
  events:Array<{type:string;timeS:number;km:number;riderId?:string;
    teamId?:string;description:string}>;
  eventCount:number;truncated:boolean;
  /** null bedeutet: diese optionale Messung wurde nicht durchgeführt. */
  breakawayFrontWork:null|Array<{riderId:string;name:string;teamId:string;
    frontSeconds:number;crankWorkJ:number;windExposedSeconds:number}>;
}
export function createRaceReport(o:{result:Pick<RaceResult,'classification'|'events'>&
  Partial<Pick<RaceResult,'diagnostics'>>;
  favorites?:readonly ReportFavorite[];focusTeamId?:string;eventLimit?:number}):RaceReport{
  const riders=o.result.classification;
  if(!riders.length)throw new RangeError('Rennbericht: keine Zielankünfte');
  const limit=o.eventLimit??100;
  if(!Number.isInteger(limit)||limit<1)throw new RangeError('Rennbericht: Ereignislimit');
  const classified=new Map(riders.map(r=>[r.id,r]));
  const noteworthy=new Set(['attack','bridge-start','bridge-stop','bridge-relay',
    'bridge-relay-position-change','breakaway','breakaway-work','breakaway-save',
    'breakaway-caught','team-chase','team-pace','sprint-train']);
  const events=o.result.events.filter(e=>noteworthy.has(e.type)&&
    (!o.focusTeamId||!e.teamId||e.teamId===o.focusTeamId));
  const front=o.result.diagnostics?.breakawayFrontWork;
  const first=riders[0];
  return {winner:{riderId:first.id,name:first.name||first.id,
    finishTimeS:first.finishTimeS,groupTimeS:first.groupTimeS},
    results:riders.filter(r=>!o.focusTeamId||r.teamId===o.focusTeamId).map(r=>({
      rank:r.rank,riderId:r.id,name:r.name||r.id,teamId:r.teamId,finishTimeS:r.finishTimeS,
      groupTimeS:r.groupTimeS,groupGapS:r.groupGapS})),
    favorites:(o.favorites??[]).map(f=>({riderId:f.riderId,preRaceRank:f.preRaceRank,
      ...(classified.get(f.riderId)?.name?{name:classified.get(f.riderId)!.name}:{}),
      finishRank:classified.get(f.riderId)?.rank??null,
      groupGapS:classified.get(f.riderId)?.groupGapS??null})),
    events:events.slice(0,limit).map(e=>({type:e.type,timeS:e.timeS,km:e.km,
      ...(e.riderId?{riderId:e.riderId}:{}),...(e.teamId?{teamId:e.teamId}:{}),
      description:e.description})),eventCount:events.length,truncated:events.length>limit,
    breakawayFrontWork:front?front.riders.filter(r=>!o.focusTeamId||r.teamId===o.focusTeamId)
      .map(r=>({...r,name:classified.get(r.riderId)?.name||r.riderId})):null};
}

/** Kompakte Textausgabe aus protokollierten Fakten, ohne Ursachenerfindung. */
export function formatRaceReport(r:RaceReport):string{
  const name=new Map(r.results.map(x=>[x.riderId,x.name]));
  const clock=(s:number)=>{const n=Math.round(s);return `${Math.floor(n/60)}:${String(n%60).padStart(2,'0')}`;};
  const raceClock=(s:number)=>{const n=Math.round(s),hours=Math.floor(n/3600);
    return `${hours}:${String(Math.floor(n%3600/60)).padStart(2,'0')}:${String(n%60).padStart(2,'0')}`;};
  const lines=['RENNBERICHT',`Sieger: ${r.winner.name}`,
    `Gewertete Siegerzeit: ${raceClock(r.winner.groupTimeS)} (h:min:s, gerundet)`,
    '', 'ERGEBNIS (gewerteter Gruppenabstand)'];
  for(const x of r.results){
    const gap=x.rank===1?'Siegerzeit':x.groupGapS===0?'gleiche Zeit':
      x.groupGapS<.5?'+< 1 s':'+'+clock(x.groupGapS);
    lines.push(`${x.rank}. ${x.name} (${x.teamId}) – ${gap}`);
  }
  if(r.favorites.length){lines.push('','FAVORITEN VOR DEM RENNEN');
    for(const f of r.favorites)lines.push(`${f.preRaceRank}. ${f.name??name.get(f.riderId)??f.riderId}: ${f.finishRank===null?'nicht in der Ergebnisliste':'Platz '+f.finishRank}`);}
  lines.push('','PROTOKOLLIERTER RENNVERLAUF');
  if(!r.events.length)lines.push('Keine Ereignisse erfasst.');
  for(const e of r.events)lines.push(`km ${e.km.toFixed(1)} – ${e.description}`);
  if(r.truncated)lines.push(`Weitere Ereignisse: ${r.eventCount-r.events.length}`);
  lines.push('','GEMESSENE FLUCHTFRONT');
  if(r.breakawayFrontWork===null)lines.push('Keine Frontmessung aufgezeichnet.');
  else if(!r.breakawayFrontWork.length)lines.push('In der erfassten Situation keine Frontarbeit aufgezeichnet.');
  else for(const x of r.breakawayFrontWork)lines.push(`${x.name} (${x.teamId}): ${clock(x.frontSeconds)} min:s, ${Math.round(x.crankWorkJ/1000)} kJ Kurbelarbeit`);
  if(r.breakawayFrontWork!==null)lines.push('Erfasst nur die definierte, vom Hauptfeld getrennte Fluchtsituation; Frontposition belegt keine Absprache.');
  return lines.join('\n');
}
