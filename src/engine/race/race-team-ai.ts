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
  /** Opt-in: Helfer hat physisch viel Jagdarbeit geleistet und wird abgelöst. */
  chaseSpent?:boolean;
}
export interface IntelligentTeam {
  id:string;strategy:RaceStrategy;
  /** Veraltete Vergleichs-API; im adaptiven Modus ohne Steuerwirkung. */
  chaseHelperCount?:number;
}
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
  /** Tatsaechliche Fahrer der vorausliegenden Gruppe. */
  leadingRiderIds?:readonly string[];
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
/** Vorläufige Entscheidungsgrenzen für den Anschluss des geschützten
 * Kapitäns. Sie begrenzen nur die freiwillige Wattanforderung; ob die
 * Gruppe wirklich aufschließt, entscheidet die bestehende Rennphysik. */
export const R24_REJOIN=Object.freeze({
  minimumGroupSize:4,maximumGapM:1500,maximumRemainingFraction:.10,
  minimumCaptainReserve:.27,leaderCpFraction:1.045,supportCpFraction:1,
});
export interface CrewPlan {
  orders:Map<string,CrewOrder>;
  /** Tatsächlich nominierter Führender; im nächsten Entscheid weiterführen. */
  leaderByTeam:Map<string,{riderId:string;sinceS:number}>;
  situation:RaceSituation;
  /** Nur für Prüf- und Spielberichte, keine neue Renn-Geschwindigkeit. */
  missionByTeam:Map<string,CrewMission>;
  /** Ein einziger nominierter Feldjagd-Führender; keine Positionsgarantie. */
  fieldChaseLeader?:{riderId:string;sinceS:number};
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
  maxBreakawaySize:number=R15_R16.maxBreakawaySize,
  allowLargerLeadingGroups=false,
):RaceSituation{
  valid('maximumBreakawaySize',maxBreakawaySize,
    Number.isInteger(maxBreakawaySize)&&maxBreakawaySize>=1&&
    maxBreakawaySize<=12);
  valid('remainingM',remainingM,remainingM>=0);
  if(riders.length<2)return {
    leadingBreakaway:false,gapM:0,breakawaySize:0,mainGroupSize:riders.length,
    relativeSpeedMps:0,projectedGapM:0,gapFractionOfRemaining:0,chaseViable:false,
  };
  const groups=sortGroups(riders);
  const lead=groups[0];
  const main=groups.reduce((best,g)=>g.length>best.length?g:best,groups[0]);
  const smallLeader=lead!==main&&
    (allowLargerLeadingGroups||lead.length<=maxBreakawaySize)&&
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
    leadingRiderIds:smallLeader?lead.map(r=>r.id):[],
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
  /** R-22: alter gemeinsamer Feldjagd-Führender, nur opt-in. */
  previousFieldChaseLeader?:{riderId:string;sinceS:number};
  /** Nur R22 koordinierte Teams: Wer darf tatsächlich jagen? */
  chasingTeamIds?:ReadonlySet<string>;
  /** Im großen Feld schützen unbeschäftigte Helfer ihre Reserven. */
  restInPeloton?:boolean;
  /** R22: größerer Einordnungsbereich, um Helfern echte Aufrückarbeit zu ermöglichen. */
  physicalRelayMode?:boolean;
  /** Experimenteller R-22-Sprint: Jagd/Sprintzug getrennt planen. */
  sprintFinaleMode?:boolean;
  /** R-24: auch groessere Spitzengruppen und eigene Teamziele beachten. */
  adaptiveChase?:boolean;
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
    if(team.chaseHelperCount!==undefined&&(
      !Number.isInteger(team.chaseHelperCount)||
      team.chaseHelperCount<0||team.chaseHelperCount>5))
      throw new RangeError('R-22: Anzahl Jagdhelfer muss 0..5 sein');
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
  const situation=analyzeRaceSituation(input.riders,input.remainingM,
    input.sprintFinaleMode?12:R15_R16.maxBreakawaySize,
    input.adaptiveChase===true);
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
    const raceFrontM=groups[0][0].positionM;
    const targetRemainingM=input.remainingM+Math.max(0,
      raceFrontM-target.positionM);
    // Sprintzugstart am EIGENEN Sprinter, nicht am Ausreißer vorne.
    const sprintTrain=team.strategy==='sprint'&&
      input.progress>=0.82&&
      (input.sprintFinaleMode?
        targetRemainingM>250&&targetRemainingM<=10000:
        input.remainingM>250&&input.remainingM<=10000)&&
      group.length>=3;
    // Ein abgehängter Kapitän darf seine Helfer in der eigenen Gruppe
    // zum realen Aufschließen einsetzen. Die größte Gruppe muss dazu
    // nicht ebenfalls hinter der Spitze liegen. Angreifende Teams und
    // eigene vorn liegende Kapitäne werden nicht blind zurückgeholt.
    const groupIndex=groups.indexOf(group);
    const preceding=groupIndex>0?groups[groupIndex-1]:null;
    const precedingGap=preceding?
      preceding.at(-1)!.positionM-group[0].positionM:0;
    const ownLeaderAhead=members.some(r=>
      r.role===target.role&&r!==target&&
      r.positionM>group[0].positionM+R15_R16.groupBreakM);
    const rejoin=input.adaptiveChase===true&&
      team.strategy==='kapitaen_schuetzen'&&target.role==='kapitaen'&&
      !isMain&&preceding!==null&&group.length>=R24_REJOIN.minimumGroupSize&&
      precedingGap>R15_R16.groupBreakM&&precedingGap<=R24_REJOIN.maximumGapM&&
      precedingGap/Math.max(1,targetRemainingM)<R24_REJOIN.maximumRemainingFraction&&
      target.reserveFraction>=R24_REJOIN.minimumCaptainReserve&&!ownLeaderAhead;
    const chase=rejoin||((input.chasingTeamIds!==undefined?
      situation.leadingBreakaway:situation.chaseViable)&&
      isMain&&
      input.progress<(input.adaptiveChase?1:
        input.sprintFinaleMode?.995:.94)&&
      (input.chasingTeamIds===undefined||input.chasingTeamIds.has(team.id))&&
      !(input.sprintFinaleMode&&!input.adaptiveChase&&team.chaseHelperCount===0)&&
      (!sprintTrain||input.sprintFinaleMode===true)&&
      (team.strategy!=='offensiv'||input.adaptiveChase===true)&&
      (team.strategy!=='ausgewogen'||!sprintTeamReady||urgentChase));
    const mission:CrewMission=chase?'jagd':
      sprintTrain?'sprintzug':'schutz';
    // Keine permanente Phantom-Tempoarbeit im grossen Feld. Bei einer
    // tatsaechlich gefaehrdeten Position oder niedriger Reserve bleibt
    // aber ein naher Helfer als Begleiter des Kapitaens vorgesehen.
    const targetRank=group.findIndex(r=>r.id===target.id)+1;
    const needsCaptainSupport=input.adaptiveChase&&
      team.strategy==='kapitaen_schuetzen'&&target.role==='kapitaen'&&
      group.length>=4&&
      (target.reserveFraction<.4||targetRank>Math.ceil(group.length*.70)||
        (!isMain&&raceFrontM-target.positionM>75));
    if(input.restInPeloton&&mission==='schutz'&&!needsCaptainSupport)continue;
    if(input.progress>=0.97&&!sprintTrain&&
      !((input.sprintFinaleMode||input.adaptiveChase)&&chase))continue;
    const gapToFront=(r:IntelligentRider)=>group[0].positionM-r.positionM;
    const helpers=members.filter(r=>r.role==='helfer'&&group.includes(r)&&
      !(input.sprintFinaleMode&&r.chaseSpent)&&
      r.reserveFraction>=(chase?R15_R16.minimumChaseReserve:R15_R16.minimumReserve)&&
      (input.sprintFinaleMode&&mission==='sprintzug'?
        Math.abs(r.positionM-target.positionM)<=85:
        gapToFront(r)<=(input.physicalRelayMode?300:
          R15_R16.maximumCrewDistanceFromGroupFrontM)&&
        (chase||Math.abs(r.positionM-target.positionM)<=
          R15_R16.maximumSupportDistanceToTargetM)));
    if(helpers.length===0)continue;
    // Im Finale einen echten Helfer unmittelbar beim Sprinter
    // zurückhalten, während andere das Peloton vorne jagen.
    const nearbyTeamProtectors=input.sprintFinaleMode&&mission==='jagd'&&
      team.strategy==='sprint'&&targetRemainingM<=25000?
      members.filter(r=>r.role==='helfer'&&group.includes(r)&&
        !r.chaseSpent&&
        r.reserveFraction>=R15_R16.minimumReserve&&
        Math.abs(r.positionM-target.positionM)<=85)
        .sort((a,b)=>
          Math.abs(a.positionM-target.positionM)-
            Math.abs(b.positionM-target.positionM)||
          b.reserveFraction-a.reserveFraction||
          a.id.localeCompare(b.id)):[];
    // Etwa 10 km vor dem Ziel beginnt die ECHTE Sprintzug-Arbeit
    // gleichzeitig mit der Verfolgung. Hintere Begleiter müssen
    // nicht in Reichweite des absoluten Peloton-Pacesetters sein.
    const protectCount=sprintTrain?3:1;
    const reserve=nearbyTeamProtectors.slice(0,protectCount);
    const reservedIds=new Set(reserve.map(r=>r.id));
    const available=helpers.filter(r=>!reservedIds.has(r.id));
    if(!available.length&&!reserve.length)continue;
    // Gefährliche/nahe Ausreißer und Teamstrategie bestimmen die Größe des
    // Einsatzes. Ein einzelner Verfolger ist nicht länger das Maximum.
    // Die restlichen Fahrer fahren danach weiterhin ganz normal ihr Rennen.
    const urgency=situation.gapFractionOfRemaining>0.04||
      situation.projectedGapM/Math.max(1,input.remainingM)>0.05;
    let requested=1;
    if(chase)requested=input.physicalRelayMode?
      Math.min(input.sprintFinaleMode&&input.progress>=2/3?1:4,
        available.length):input.restInPeloton?
      Math.min(3,available.length):
      team.strategy==='sprint'? (urgency?5:3):
      team.strategy==='kapitaen_schuetzen'?(urgency?4:2):(urgency?3:2);
    else if(sprintTrain)requested=input.progress>=0.94?3:4;
    else if(team.strategy==='kapitaen_schuetzen'&&input.progress<0.82)
      requested=input.adaptiveChase?1:2;
    if(chase&&input.sprintFinaleMode&&!input.adaptiveChase&&
      team.chaseHelperCount!==undefined)
      requested=team.chaseHelperCount;
    requested=Math.min(R15_R16.maximumCrew,requested,available.length);
    // Teammitglieder werden nach tatsächlichem Abstand zur Front und
    // Energiereserve berücksichtigt, nicht alphabetisch als Phantomführer.
    const sorted=available.sort((a,b)=>
      ((input.sprintFinaleMode&&mission==='sprintzug')||
        (input.adaptiveChase&&mission==='schutz')?
        Math.abs(a.positionM-target.positionM)-
          Math.abs(b.positionM-target.positionM):
        gapToFront(a)-gapToFront(b))||
      b.reserveFraction-a.reserveFraction||a.id.localeCompare(b.id));
    // Zeitbasierter Wechsel beeinflusst nur die Bereitschaft zur aktiven
    // Führungsaufgabe; die Fahrposition bleibt physikalisch berechnet.
    const selected=[...sorted.slice(0,requested)];
    // Der globale Nachführende wird nicht bei jedem 10-s-Takt von einem
    // wenige Meter weiter vorn fahrenden Teamkameraden ersetzt. Er muss
    // aber körperlich verfügbar und real in Feldspitzennähe bleiben.
    const fieldPrior=input.previousFieldChaseLeader;
    if(chase&&input.sprintFinaleMode&&input.progress>=2/3&&
      fieldPrior&&requested>0){
      const established=sorted.find(r=>
        r.id===fieldPrior.riderId&&
        (gapToFront(r)<=72||
          (input.timeS-fieldPrior.sinceS<50&&gapToFront(r)<=300)));
      // Neuen Nachrückern tatsächlich mehrere KI-Takte zum physischen
      // Aufschließen geben. Sonst gewinnt bei jeder 10-s-Entscheidung
      // der nächste beliebige Helfer 5 m weiter vorn; niemand kommt an.
      // Einen bereits wirklich vorne verfügbaren Helfer nicht blockieren.
      const realReplacement=selected.some(r=>
        gapToFront(r)<=R15_R16.frontWorkRadiusM);
      if(established&&!selected.some(r=>r.id===established.id)&&
        (gapToFront(established)<=72||!realReplacement))
        selected[selected.length-1]=established;
    }
    // Führung nur wenn der Helfer tatsächlich VOR dem zu schützenden
    // Kapitän/Sprinter fährt. Bei fehlender Frontposition müssen Helfer
    // zunächst aus eigener Kurbelarbeit nach vorne gelangen.
    const frontEligible=selected.filter(r=>
      (input.sprintFinaleMode&&mission==='sprintzug'?
        r.positionM-target.positionM<=35:
        gapToFront(r)<=R15_R16.frontWorkRadiusM)&&
      r.positionM>target.positionM+0.1);
    const previous=input.previousLeaders?.get(team.id);
    // Lange kontrollierte Nachführarbeit: Ein freiwillig führender
    // Helfer kann 15–20 min an der echten Feldfront bleiben, solange
    // er dort physisch noch erreichbar ist und Reserven besitzt.
    // Auf anderen Strecken bleibt die 75-s-Rotation unverändert.
    const allowedStintSeconds=input.sprintFinaleMode&&mission==='jagd'&&
      input.progress>=2/3?1200:R15_R16.relaySeconds;
    const eligibleForLongStint=input.sprintFinaleMode&&
      mission==='jagd'&&input.progress>=2/3;
    const retained=previous&&input.timeS-previous.sinceS<
      allowedStintSeconds?
      (eligibleForLongStint?
        selected.find(r=>r.id===previous.riderId):
        frontEligible.find(r=>r.id===previous.riderId)):undefined;
    // Bleibt der nominierte Helfer kurz hinter dem Führenden,
    // behält er seinen Auftrag und muss sich wieder *real* nach
    // vorne fahren. Er erhält dort nur dann Führungswatt, wenn
    // er die 18-m-Zone physisch tatsächlich erreicht hat.
    const leader=retained??(frontEligible.length?
      frontEligible[rotation%frontEligible.length]:null);
    if(leader)leaderByTeam.set(team.id,{
      riderId:leader.id,
      sinceS:retained?previous!.sinceS:input.timeS,
    });
    for(const rider of selected){
      const frontEligible=input.sprintFinaleMode&&mission==='sprintzug'?
        rider.positionM>target.positionM+0.1&&
          rider.positionM-target.positionM<=35:
        gapToFront(rider)<=R15_R16.frontWorkRadiusM;
      const duty:CrewDuty=leader!==null&&rider.id===leader.id&&frontEligible?
        'fuehrung':'unterstuetzung';
      const effort=mission==='jagd'?
        (rejoin?(duty==='fuehrung'?R24_REJOIN.leaderCpFraction:
          R24_REJOIN.supportCpFraction):input.physicalRelayMode?
          (duty==='fuehrung'?1.15:
            gapToFront(rider)>R15_R16.frontWorkRadiusM?1.10:1.045):
          duty==='fuehrung'?1.12:1.055):
        mission==='sprintzug'?
        (duty==='fuehrung'?1.12:1.055):
        (duty==='fuehrung'?1.065:
          rider.positionM<=target.positionM?1.045:0.98);
      const reason=rejoin?'Team hilft dem abgehängten Kapitän beim Anschluss':
        mission==='jagd'?
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
    // Mixed sprint mission: one or more HELPER riders still chase at
    // real pack front, while local helpers close to the protected
    // sprinter form the train at the SAME decision step. No teleport.
    if(chase&&sprintTrain&&input.sprintFinaleMode&&reserve.length){
      const leadCandidates=reserve.filter(r=>
        r.positionM>target.positionM+0.1&&
        r.positionM-target.positionM<=35);
      const localLead=leadCandidates[0]?.id;
      for(const rider of reserve){
        const duty:CrewDuty=rider.id===localLead?'fuehrung':'unterstuetzung';
        orders.set(rider.id,{
          riderId:rider.id,mission:'sprintzug',duty,
          desiredPowerW:rider.criticalPowerW*
            (duty==='fuehrung'?1.085:1.025),
          reason:duty==='fuehrung'?
            'Sprintzug trotz laufender Feldjagd: echter naher Führender':
            'Sprintzug trotz Feldjagd: geschützten Sprinter begleiten',
          groupFrontM:group[0].positionM,
        });
      }
    }
    missionByTeam.set(team.id,mission);
  }
  // R-22: EIN gemeinsamer Feldkopf für die Sprintteam-Jagd.
  // Andere Teamhelfer unterstützen im Windschatten und können erst
  // nach physisch möglicher Übernahme selbst zum Führenden werden.
  // Kein Fahrer wird im Raum versetzt und kein Wattlimit aufgehoben.
  let fieldChaseLeader:CrewPlan['fieldChaseLeader'];
  if(input.sprintFinaleMode&&input.progress>=2/3&&
    input.chasingTeamIds!==undefined){
    const mainIds=new Set(main.map(r=>r.id));
    const frontM=main[0].positionM;
    const candidates=[...orders.values()]
      .filter(order=>order.mission==='jagd'&&mainIds.has(order.riderId))
      .map(order=>({order,rider:input.riders.find(r=>
        r.id===order.riderId)!}))
      .filter(({rider})=>!rider.chaseSpent&&
        rider.reserveFraction>=R15_R16.minimumChaseReserve&&
        frontM-rider.positionM<=300)
      .sort((a,b)=>b.rider.positionM-a.rider.positionM||
        a.rider.id.localeCompare(b.rider.id));
    // Bestehende Auftragskontinuität aus älteren Team-API-Aufrufen
    // bewahren: wenn noch kein globaler Führender übergeben wurde,
    // kann die bisherige physische Teamführung fortgesetzt werden.
    const previous=input.previousFieldChaseLeader??
      [...(input.previousLeaders?.values()??[])].find(p=>
        candidates.some(c=>c.rider.id===p.riderId));
    const ready=candidates.find(c=>
      frontM-c.rider.positionM<=R15_R16.frontWorkRadiusM);
    const kept=previous?candidates.find(c=>
      c.rider.id===previous.riderId&&
      (frontM-c.rider.positionM<=72||
        (input.timeS-previous.sinceS<50&&!ready))):undefined;
    // Ein frischer Helfer muss nicht magisch schon an der 18-m-Front
    // stehen. Ist keiner vorne, wird der nächstplatzierte TATSÄCHLICH
    // im Hauptfeld vorhandene Jäger als Nachrücker nominiert. Er hat
    // bis zur wirklichen Feldspitze nur Unterstützungspflicht; seinen
    // Abstand muss er mit eigenen Watt nach und nach schließen.
    const fresh=candidates.find(c=>
      c.rider.id!==previous?.riderId);
    // Bei real nebeneinander an der Hauptfeldspitze fahrenden Jägern
    // darf die Führung im späten Finale auch nach nur 10 s wechseln.
    // Ein Wechsel ist hier KEIN Auftragsspringen im Feld: der neue
    // Fahrer muss bereits physisch vorne und mind. 2 m VOR dem alten
    // liegen. Seine tatsächlich anliegenden Watt werden normal bezahlt.
    const oldRider=previous?candidates.find(c=>
      c.rider.id===previous.riderId):undefined;
    const physicalFrontRelay=input.progress>=.90&&oldRider&&
      input.timeS-previous!.sinceS>=10&&
      frontM-oldRider.rider.positionM<=R15_R16.frontWorkRadiusM?
      candidates.find(c=>
        c.rider.id!==previous!.riderId&&
        frontM-c.rider.positionM<=R15_R16.frontWorkRadiusM&&
        c.rider.positionM>=oldRider.rider.positionM+2):
      undefined;
    const chosen=physicalFrontRelay??kept??ready??fresh??candidates[0];
    if(chosen)fieldChaseLeader={
      riderId:chosen.rider.id,
      sinceS:kept&&chosen.rider.id===kept.rider.id?
        previous!.sinceS:input.timeS,
    };
    for(const order of orders.values()){
      if(order.mission!=='jagd'||!mainIds.has(order.riderId))continue;
      const r=input.riders.find(r=>r.id===order.riderId)!;
      const frontDistance=frontM-r.positionM;
      const targetRole=input.teams.find(t=>t.id===r.teamId)!.
        strategy==='sprint'?'sprinter':'kapitaen';
      const protectedRider=input.riders.find(x=>
        x.teamId===r.teamId&&x.role===targetRole);
      const reallyLeading=order.riderId===fieldChaseLeader?.riderId&&
        frontDistance<=R15_R16.frontWorkRadiusM&&
        r.positionM>(protectedRider?.positionM??-Infinity)+.1;
      // Nach dem Rollenwechsel darf kein konkurrierender Teamführer
      // seine alten 1.15 CP als vermeintlicher Unterstützer behalten.
      // Auch der Wattwunsch folgt der Gruppenrolle, nicht dem alten Titel.
      if(!reallyLeading&&order.duty==='fuehrung')
        order.desiredPowerW=r.criticalPowerW*1.045;
      order.duty=reallyLeading?'fuehrung':'unterstuetzung';
      if(order.riderId===fieldChaseLeader?.riderId&&!reallyLeading)
        order.reason='Nächster Jagdhelfer fährt physisch zur Feldspitze auf';
    }
    // Das historische Leader-Mapping darf keine zweiten
    // gleichzeitigen Feldführer künstlich konservieren.
    for(const [teamId] of leaderByTeam){
      if(missionByTeam.get(teamId)==='jagd'&&
        (!fieldChaseLeader||input.riders.find(r=>
          r.id===fieldChaseLeader!.riderId)?.teamId!==teamId))
        leaderByTeam.delete(teamId);
    }
    if(fieldChaseLeader){
      const r=input.riders.find(r=>r.id===fieldChaseLeader!.riderId)!;
      leaderByTeam.set(r.teamId,fieldChaseLeader);
    }
  }
  return {orders,situation,missionByTeam,leaderByTeam,
    ...(fieldChaseLeader?{fieldChaseLeader}:{})};
}
