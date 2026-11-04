/**
 * R-15/R-16 – autonome Mannschaftsaufgaben in einem vollständigen Rennen.
 *
 * Kein Management-/Karrieremodell: taktische Einsatzplanung für ein laufendes
 * Rennen. Alle Ausgaben sind Wattwünsche, keine Positions- oder Tempoboni.
 * Die 42-m-Grenze ordnet nur aktuelle Strecken-Abstandsgruppen, nicht Aero.
 */
import type {RaceRole,RaceStrategy} from './race-tactics.ts';

export interface IntelligentRider {
  id:string;teamId:string;role:RaceRole;
  positionM:number;speedMps:number;
  criticalPowerW:number;reserveFraction:number;aggression:number;
}
export interface IntelligentTeam {id:string;strategy:RaceStrategy}
export type CrewMission='jagd'|'sprintzug'|'schutz';
export type CrewDuty='fuehrung'|'unterstuetzung';
export interface CrewOrder {
  riderId:string;mission:CrewMission;duty:CrewDuty;
  desiredPowerW:number;reason:string;groupFrontM:number;
}
export interface RaceSituation {
  leadingBreakaway:boolean;gapM:number;breakawaySize:number;
  mainGroupSize:number;relativeSpeedMps:number;
  /** Prognose über 120 s bei unverändert gemessenen Gruppentempi. */
  projectedGapM:number;
  /** Sichtbare Lücke relativ zur verbleibenden Distanz. */
  gapFractionOfRemaining:number;
  /** Nicht jeder Rückstand ist automatisch eine erfolgversprechende Jagd. */
  chaseViable:boolean;
}
export const R15_R16=Object.freeze({
  groupBreakM:42,
  minimumBreakawayGapM:75,
  minimumMainGroupSize:4,
  maxBreakawaySize:6,
  maximumCrew:5,
  minimumReserve:0.18,
  minimumChaseReserve:0.27,
  frontWorkRadiusM:18,
  maximumCrewDistanceFromGroupFrontM:105,
  maximumSupportDistanceToTargetM:65,
  relaySeconds:75,
});
export interface CrewPlan {
  orders:Map<string,CrewOrder>;
  /** Tatsächlich nominierter Führender; im nächsten Entscheid weiterführen. */
  leaderByTeam:Map<string,{riderId:string;sinceS:number}>;
  situation:RaceSituation;
  /** Nur für Prüf- und Spielberichte, keine neue Renn-Geschwindigkeit. */
  missionByTeam:Map<string,CrewMission>;
}
const valid=(name:string,x:number,check:boolean)=>{
  if(!Number.isFinite(x)||!check)throw new RangeError('R-15/R-16: '+name);
};
function sortGroups(riders:readonly IntelligentRider[]):IntelligentRider[][]{
  const sorted=[...riders].sort((a,b)=>b.positionM-a.positionM||
    a.id.localeCompare(b.id));
  const groups:IntelligentRider[][]=[];
  for(const r of sorted){
    const last=groups.at(-1);
    if(!last||last.at(-1)!.positionM-r.positionM>R15_R16.groupBreakM)
      groups.push([r]);
    else last.push(r);
  }
  return groups;
}
function meanSpeed(g:readonly IntelligentRider[]):number{
  return g.reduce((n,r)=>n+r.speedMps,0)/g.length;
}
export function analyzeRaceSituation(
  riders:readonly IntelligentRider[],remainingM:number,
):RaceSituation{
  valid('remainingM',remainingM,remainingM>=0);
  if(riders.length<2)return {
    leadingBreakaway:false,gapM:0,breakawaySize:0,mainGroupSize:riders.length,
    relativeSpeedMps:0,projectedGapM:0,gapFractionOfRemaining:0,chaseViable:false,
  };
  const groups=sortGroups(riders);
  const lead=groups[0];
  const main=groups.reduce((best,g)=>g.length>best.length?g:best,groups[0]);
  const smallLeader=lead!==main&&lead.length<=R15_R16.maxBreakawaySize&&
    main.length>=R15_R16.minimumMainGroupSize;
  const gap=smallLeader?lead.at(-1)!.positionM-main[0].positionM:0;
  const relativeSpeed=smallLeader?meanSpeed(lead)-meanSpeed(main):0;
  const gapFraction=gap/Math.max(1,remainingM);
  const projectedGapM=Math.max(0,gap+relativeSpeed*120);
  // Die Jagd darf bei einer bereits uneinholbar weit voraus liegenden Gruppe
  // nicht allein aufgrund ihrer Existenz enorme Helferlast auslösen.
  // Positive Relativgeschwindigkeit macht sie gefährlicher; eine weit
  // zurückliegende Gruppe mit kaum Reststrecke ist kein sinnvoller Auslöser.
  const plausible=smallLeader&&gap>=R15_R16.minimumBreakawayGapM&&
    remainingM>=1200&&gapFraction<=0.16&&
    (relativeSpeed<=2.5||gapFraction<=0.04);
  return {leadingBreakaway:smallLeader&&gap>=R15_R16.minimumBreakawayGapM,
    gapM:gap,breakawaySize:smallLeader?lead.length:0,
    mainGroupSize:main.length,relativeSpeedMps:relativeSpeed,
    projectedGapM,
    gapFractionOfRemaining:gapFraction,chaseViable:plausible};
}
export function decideIntelligentCrew(input:{
  timeS:number;progress:number;remainingM:number;
  teams:readonly IntelligentTeam[];
  riders:readonly IntelligentRider[];
  /** R-17: Zustandsübergabe für positions- und ermüdungsbewusste Ablösung. */
  previousLeaders?:ReadonlyMap<string,{riderId:string;sinceS:number}>;
  /** Nur R22 koordinierte Teams: Wer darf tatsächlich jagen? */
  chasingTeamIds?:ReadonlySet<string>;
  /** Im großen Feld schützen unbeschäftigte Helfer ihre Reserven. */
  restInPeloton?:boolean;
}):CrewPlan{
  if(!input||!Array.isArray(input.teams)||!Array.isArray(input.riders))
    throw new RangeError('R-15/R-16: Team-/Fahrerfeld fehlt');
  valid('timeS',input.timeS,input.timeS>=0);
  valid('progress',input.progress,input.progress>=0&&input.progress<=1);
  valid('remainingM',input.remainingM,input.remainingM>=0);
  const ids=new Set<string>(),teamIds=new Set<string>();
  for(const team of input.teams){
    if(!team||typeof team.id!=='string'||!team.id||
      teamIds.has(team.id)||!
      ['ausgewogen','offensiv','sprint','kapitaen_schuetzen'].includes(team.strategy))
      throw new RangeError('R-15/R-16: ungültiges Team');
    teamIds.add(team.id);
  }
  for(const r of input.riders){
    if(!r||typeof r.id!=='string'||!r.id||ids.has(r.id)||
      !teamIds.has(r.teamId)||!['kapitaen','sprinter','helfer'].includes(r.role))
      throw new RangeError('R-15/R-16: Fahrer/ID');
    ids.add(r.id);
    valid('positionM',r.positionM,r.positionM>=0);
    valid('speedMps',r.speedMps,r.speedMps>=0&&r.speedMps<100);
    valid('criticalPowerW',r.criticalPowerW,r.criticalPowerW>50&&r.criticalPowerW<=1500);
    valid('reserveFraction',r.reserveFraction,r.reserveFraction>=0&&r.reserveFraction<=1+1e-7);
    valid('aggression',r.aggression,r.aggression>=0&&r.aggression<=1);
  }
  const orders=new Map<string,CrewOrder>();
  const missionByTeam=new Map<string,CrewMission>();
  const leaderByTeam=new Map<string,{riderId:string;sinceS:number}>();
  const situation=analyzeRaceSituation(input.riders,input.remainingM);
  if(input.riders.length<2)return {orders,situation,missionByTeam,leaderByTeam};
  const groups=sortGroups(input.riders);
  const main=groups.reduce((best,g)=>g.length>best.length?g:best,groups[0]);
  const rotation=Math.floor(input.timeS/R15_R16.relaySeconds);
  // Ein ausgewogenes Team kann die Jagd einer verfügbaren Sprintmannschaft
  // überlassen, solange der Rückstand noch moderat ist. Das ist keine
  // Absprache/Teleportation, sondern bewusst unterlassene Mehrarbeit.
  const sprintTeamReady=input.teams.some(team=>
    team.strategy==='sprint'&&
    main.some(r=>r.teamId===team.id&&r.role==='sprinter')&&
    main.some(r=>r.teamId===team.id&&r.role==='helfer'&&
      r.reserveFraction>=R15_R16.minimumChaseReserve));
  const urgentChase=situation.gapFractionOfRemaining>=0.025||
    situation.projectedGapM/Math.max(1,input.remainingM)>=0.035;
  for(const team of [...input.teams].sort((a,b)=>a.id.localeCompare(b.id))){
    const members=input.riders.filter(r=>r.teamId===team.id);
    const targetRole=team.strategy==='sprint'?'sprinter':'kapitaen';
    const target=members.find(r=>r.role===targetRole)||
      members.find(r=>r.role==='kapitaen');
    if(!target)continue;
    const group=groups.find(g=>g.includes(target));
    if(!group)continue;
    const isMain=group===main;
    const sprintTrain=team.strategy==='sprint'&&
      input.progress>=0.82&&input.remainingM>250&&
      input.remainingM<=10000&&group.length>=3;
    const chase=situation.chaseViable&&isMain&&input.progress<0.94&&
      (input.chasingTeamIds===undefined||input.chasingTeamIds.has(team.id))&&
      !sprintTrain&&team.strategy!=='offensiv'&&
      (team.strategy!=='ausgewogen'||!sprintTeamReady||urgentChase);
    const mission:CrewMission=chase?'jagd':
      sprintTrain?'sprintzug':'schutz';
    if(input.restInPeloton&&mission==='schutz')continue;
    if(input.progress>=0.97&&!sprintTrain)continue;
    const gapToFront=(r:IntelligentRider)=>group[0].positionM-r.positionM;
    const helpers=members.filter(r=>r.role==='helfer'&&group.includes(r)&&
      r.reserveFraction>=(chase?R15_R16.minimumChaseReserve:R15_R16.minimumReserve)&&
      gapToFront(r)<=R15_R16.maximumCrewDistanceFromGroupFrontM&&
      (chase||Math.abs(r.positionM-target.positionM)<=
        R15_R16.maximumSupportDistanceToTargetM));
    if(helpers.length===0)continue;
    // Gefährliche/nahe Ausreißer und Teamstrategie bestimmen die Größe des
    // Einsatzes. Ein einzelner Verfolger ist nicht länger das Maximum.
    // Die restlichen Fahrer fahren danach weiterhin ganz normal ihr Rennen.
    const urgency=situation.gapFractionOfRemaining>0.04||
      situation.projectedGapM/Math.max(1,input.remainingM)>0.05;
    let requested=1;
    if(chase)requested=input.restInPeloton?Math.min(2,helpers.length):
      team.strategy==='sprint'? (urgency?5:3):
      team.strategy==='kapitaen_schuetzen'?(urgency?4:2):(urgency?3:2);
    else if(sprintTrain)requested=input.progress>=0.94?3:4;
    else if(team.strategy==='kapitaen_schuetzen'&&input.progress<0.82)
      requested=2;
    requested=Math.min(R15_R16.maximumCrew,requested,helpers.length);
    // Teammitglieder werden nach tatsächlichem Abstand zur Front und
    // Energiereserve berücksichtigt, nicht alphabetisch als Phantomführer.
    const sorted=helpers.sort((a,b)=>
      gapToFront(a)-gapToFront(b)||
      b.reserveFraction-a.reserveFraction||a.id.localeCompare(b.id));
    // Zeitbasierter Wechsel beeinflusst nur die Bereitschaft zur aktiven
    // Führungsaufgabe; die Fahrposition bleibt physikalisch berechnet.
    const selected=[...sorted.slice(0,requested)];
    // Führung nur wenn der Helfer tatsächlich VOR dem zu schützenden
    // Kapitän/Sprinter fährt. Bei fehlender Frontposition müssen Helfer
    // zunächst aus eigener Kurbelarbeit nach vorne gelangen.
    const frontEligible=selected.filter(r=>
      gapToFront(r)<=R15_R16.frontWorkRadiusM&&
      r.positionM>target.positionM+0.1);
    const previous=input.previousLeaders?.get(team.id);
    const retained=previous&&input.timeS-previous.sinceS<
      R15_R16.relaySeconds?
      frontEligible.find(r=>r.id===previous.riderId):undefined;
    const leader=retained??(frontEligible.length?
      frontEligible[rotation%frontEligible.length]:null);
    if(leader)leaderByTeam.set(team.id,{
      riderId:leader.id,
      sinceS:retained?previous!.sinceS:input.timeS,
    });
    for(const rider of selected){
      const frontEligible=gapToFront(rider)<=R15_R16.frontWorkRadiusM;
      const duty:CrewDuty=leader!==null&&rider.id===leader.id&&frontEligible?
        'fuehrung':'unterstuetzung';
      const effort=mission==='jagd'?
        (duty==='fuehrung'?1.12:1.055):
        mission==='sprintzug'?
        (duty==='fuehrung'?1.12:1.055):
        (duty==='fuehrung'?1.065:
          rider.positionM<=target.positionM?1.045:0.98);
      const reason=mission==='jagd'?
        (duty==='fuehrung'?'Team übernimmt Verfolgung an der Feldspitze':
          'Helfer unterstützt die organisierte Verfolgung'):
        mission==='sprintzug'?
        (duty==='fuehrung'?'Sprintzug: Führung für den Sprinter':
          'Sprintzug: Position sichern und Kräfte dosieren'):
        (duty==='fuehrung'?'Tempoarbeit vor geschütztem Fahrer':
          'Helfer hält sich für den Mannschaftseinsatz bereit');
      orders.set(rider.id,{riderId:rider.id,mission,duty,
        desiredPowerW:rider.criticalPowerW*effort,reason,
        groupFrontM:group[0].positionM});
    }
    missionByTeam.set(team.id,mission);
  }
  return {orders,situation,missionByTeam,leaderByTeam};
}
