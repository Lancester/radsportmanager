/**
 * R-14: teamübergreifend erkennbare Rennsituation, aber Entscheidungen
 * pro Team. Die KI fordert ausschließlich Kurbelwatt an; keine
 * Geschwindigkeits-, Positions- oder Einholgutschriften.
 *
 * Wir verwenden 42 m nur zur taktischen Erkennung getrennter Gruppen,
 * NICHT zur Bestimmung des Windschattens (dafür formation-aero.ts).
 */
import type {RaceRole,RaceStrategy} from './race-tactics.ts';

export interface TeamPaceRider {
  id:string;teamId:string;role:RaceRole;
  positionM:number;criticalPowerW:number;reserveFraction:number;
}
export interface TeamPaceTeam {
  id:string;strategy:RaceStrategy;
}
export type TeamPaceKind='fuehrung'|'verfolgung';
export interface TeamPaceOrder {
  riderId:string;
  kind:TeamPaceKind;
  desiredPowerW:number;
  reason:string;
}
export const R14_TEAM_PACE=Object.freeze({
  groupBreakM:42,
  breakawayMinGapM:75,
  chaseMaximumGapM:400,
  captainSupportDistanceM:35,
  frontSelectionDistanceM:55,
  minimumSupportReserve:0.20,
  minimumChaseReserve:0.30,
  leaderRotationSeconds:90,
  supportFactor:1.06,
  chaseFactor:1.095,
});

/** Beschrieben sind nacheinander fahrende Abstandsgruppen, keine 2D-Spuren. */
function orderedGroups(riders:ReadonlyArray<TeamPaceRider>):TeamPaceRider[][] {
  const ordered=[...riders].sort((a,b)=>b.positionM-a.positionM||
    a.id.localeCompare(b.id));
  const groups:TeamPaceRider[][]=[];
  for(const rider of ordered){
    const group=groups.at(-1);
    if(!group||
      group[group.length-1].positionM-rider.positionM>R14_TEAM_PACE.groupBreakM)
      groups.push([rider]);
    else group.push(rider);
  }
  return groups;
}

/**
 * Rein deterministische, vorausschauende Rollenverteilung.
 * - Pro Mannschaft höchstens ein Helfer im aktiven Tempo-/Verfolgungsdienst.
 * - Im Hauptfeld Verfolger nur bei belegter, kleiner Gruppe mit gemessener
 *   Lücke; kein pauschales Nachsetzen gegen beliebige Einzelfahrer.
 * - Bei gleicher Gruppe rotierende Helfer, sofern noch leistungsfähig.
 * - Helfer schützt Kapitän/Sprinter durch Tempoarbeit; echter Windschatten
 *   ergibt sich ausschließlich aus dem physikalischen Fahrerabstand.
 */
export function decideTeamPace(input:{
  timeS:number;progress:number;
  teams:ReadonlyArray<TeamPaceTeam>;
  riders:ReadonlyArray<TeamPaceRider>;
}):Map<string,TeamPaceOrder> {
  if(!input||!Number.isFinite(input.timeS)||input.timeS<0||
    !Number.isFinite(input.progress)||input.progress<0||input.progress>1||
    !Array.isArray(input.teams)||!Array.isArray(input.riders))
    throw new RangeError('R-14 Team-Pace: Eingabe ungültig');
  const teamIds=new Set<string>();
  for(const t of input.teams){
    if(!t||!t.id||teamIds.has(t.id)||!
      ['ausgewogen','offensiv','sprint','kapitaen_schuetzen'].includes(t.strategy))
      throw new RangeError('R-14 Team-Pace: Team ungültig');
    teamIds.add(t.id);
  }
  const ids=new Set<string>();
  for(const r of input.riders){
    if(!r||!r.id||ids.has(r.id)||!teamIds.has(r.teamId)||
      !['kapitaen','sprinter','helfer'].includes(r.role)||
      !Number.isFinite(r.positionM)||r.positionM<0||
      !Number.isFinite(r.criticalPowerW)||r.criticalPowerW<=0||
      !Number.isFinite(r.reserveFraction)||
      r.reserveFraction<0||r.reserveFraction>1+1e-7)
      throw new RangeError('R-14 Team-Pace: Fahrer ungültig');
    ids.add(r.id);
  }
  const result=new Map<string,TeamPaceOrder>();
  if(input.riders.length<2)return result;
  const groups=orderedGroups(input.riders);
  const largest=groups.reduce((best,g)=>g.length>best.length?g:best,groups[0]);
  const lead=groups[0];
  // Eindeutige Ausreißergruppe vor einem substanziellen Hauptfeld.
  // Keinerlei künstliche Verfolgung bei bloßem isoliertem Nachzügler.
  const leaderAhead=lead!==largest&&lead.length<=6&&largest.length>=4;
  const gapM=leaderAhead?
    lead.at(-1)!.positionM-largest[0].positionM:0;
  const confirmedChaseSituation=leaderAhead&&
    gapM>=R14_TEAM_PACE.breakawayMinGapM&&
    gapM<=R14_TEAM_PACE.chaseMaximumGapM&&
    input.progress>=0.12&&input.progress<0.92;
  const rotation=Math.floor(input.timeS/R14_TEAM_PACE.leaderRotationSeconds);
  // Sortierung unabhängig von Team- und Fahrereingabereihenfolge.
  for(const team of [...input.teams].sort((a,b)=>a.id.localeCompare(b.id))){
    const members=input.riders.filter(r=>r.teamId===team.id);
    const protectedRole=team.strategy==='sprint'?'sprinter':'kapitaen';
    const protectedRider=members.find(r=>r.role===protectedRole)||
      members.find(r=>r.role==='kapitaen');
    if(!protectedRider)continue;
    const protectedGroup=groups.find(g=>g.includes(protectedRider));
    if(!protectedGroup)continue;

    // Eine Mannschaft verfolgt nur, wenn ihr Ziel-Fahrer im Hauptfeld
    // geblieben ist; niemand jagt die eigene abgesetzte Spitze.
    if(confirmedChaseSituation&&protectedGroup===largest&&
      ['sprint','kapitaen_schuetzen','ausgewogen'].includes(team.strategy)){
      const front=largest[0].positionM;
      const candidates=members.filter(r=>r.role==='helfer'&&
        largest.includes(r)&&
        front-r.positionM<=R14_TEAM_PACE.frontSelectionDistanceM&&
        r.reserveFraction>=R14_TEAM_PACE.minimumChaseReserve)
        .sort((a,b)=>a.id.localeCompare(b.id));
      if(candidates.length){
        const worker=candidates[rotation%candidates.length];
        result.set(worker.id,{
          riderId:worker.id,kind:'verfolgung',
          desiredPowerW:worker.criticalPowerW*R14_TEAM_PACE.chaseFactor,
          reason:'Abgestimmte Teamverfolgung gegen die abgesetzte Spitzengruppe',
        });
        continue;
      }
    }
    if(input.progress>=0.96)continue;
    // Mannschaftshelfer darf nur mit dem geschützten Fahrer auf engem
    // Streckenabschnitt zusammenarbeiten. Keine Teleportation ins Feld.
    const candidates=members.filter(r=>r.role==='helfer'&&
      protectedGroup.includes(r)&&
      Math.abs(r.positionM-protectedRider.positionM)<=
        R14_TEAM_PACE.captainSupportDistanceM&&
      r.reserveFraction>=R14_TEAM_PACE.minimumSupportReserve)
      .sort((a,b)=>a.id.localeCompare(b.id));
    if(!candidates.length)continue;
    const worker=candidates[rotation%candidates.length];
    result.set(worker.id,{
      riderId:worker.id,kind:'fuehrung',
      desiredPowerW:worker.criticalPowerW*R14_TEAM_PACE.supportFactor,
      reason:'Rotierende Tempoarbeit für '+protectedRole+' des Teams',
    });
  }
  return result;
}
