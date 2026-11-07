/**
 * R-09 – erste Rennstrategie statt Mikromanöver.
 * Die sportliche Leitung setzt VOR dem Rennen eine Teamleitlinie;
 * Fahrer entscheiden regelbasiert über Wattwünsche. Physik und CP/W′
 * entscheiden erst danach, welche Leistung tatsächlich möglich ist.
 */
export type RaceStrategy = 'ausgewogen'|'offensiv'|'sprint'|'kapitaen_schuetzen';
export type RaceRole = 'kapitaen'|'sprinter'|'helfer'|'frei';
export type RaceIntent = 'grundtempo'|'windschatten'|'angriff'|'verfolgung'|'sprint'|'erholung'|'helferarbeit';

export interface TacticObservation {
  role:RaceRole;
  strategy:RaceStrategy;
  criticalPowerW:number;
  aggression:number; // 0..1
  sprintSkill:number; // 0..1
  progress:number; // 0..1
  remainingM:number;
  frontGapM:number|null;
  teamCaptainGapM:number|null;
  deficitToLeaderM:number;
  reserveFraction:number;
  /** R-14 verhindert alte unkoordinierte Mehrfach-Verfolgung/Tempoarbeit. */
  coordinatedTeamPace?:boolean;
  /** R-16: opportunistische Angriffsentscheidung statt fixer Streckenfenster. */
  attackOpportunity?:boolean;
  /** R-24: Teamstrategie beeinflusst die Chance, sperrt den Fahrer nicht. */
  autonomousAttack?:boolean;
  /** Nur R-22-Flach-Sprint: alter gemeinsamer 250-m-Automat AUS. */
  suppressAutomaticSprint?:boolean;
}
export interface TacticDecision {
  desiredPowerW:number;
  intent:RaceIntent;
  reason:string;
}
const finite=(label:string,value:number,valid:boolean)=>{
  if(!Number.isFinite(value)||!valid)throw new RangeError('Renn-KI: '+label);
};
/** Alle Entscheidungen sind reproduzierbare Watt-Anfragen, kein Tempo- oder Siegbonus. */
export function chooseRacePower(o:TacticObservation):TacticDecision {
  if(!o || !['kapitaen','sprinter','helfer','frei'].includes(o.role) ||
    !['ausgewogen','offensiv','sprint','kapitaen_schuetzen'].includes(o.strategy))
    throw new RangeError('Renn-KI: unbekannte Rolle oder Taktik');
  finite('criticalPowerW',o.criticalPowerW,o.criticalPowerW>50&&o.criticalPowerW<=1500);
  finite('aggression',o.aggression,o.aggression>=0&&o.aggression<=1);
  finite('sprintSkill',o.sprintSkill,o.sprintSkill>=0&&o.sprintSkill<=1);
  finite('progress',o.progress,o.progress>=0&&o.progress<=1);
  finite('remainingM',o.remainingM,o.remainingM>=0);
  finite('deficitToLeaderM',o.deficitToLeaderM,o.deficitToLeaderM>=0);
  finite('reserveFraction',o.reserveFraction,o.reserveFraction>=0&&o.reserveFraction<=1+1e-7);
  if(o.frontGapM!==null)finite('frontGapM',o.frontGapM,o.frontGapM>=0);
  if(o.teamCaptainGapM!==null)finite('teamCaptainGapM',o.teamCaptainGapM,o.teamCaptainGapM>=0);
  const cp=o.criticalPowerW;
  const protectedFromWind=o.frontGapM!==null&&o.frontGapM<16;
  const base=cp*(protectedFromWind?0.88:0.98);
  if(!o.suppressAutomaticSprint&&o.remainingM<=250 &&
     (o.role==='sprinter'||o.role==='kapitaen'||o.role==='frei') &&
     o.reserveFraction>0.025){
    return {intent:'sprint',desiredPowerW:cp+180+210*o.sprintSkill,
      reason:'Zielsprint nur aus verfügbarer W′-Reserve'};
  }
  if(o.reserveFraction<0.08){
    return {intent:'erholung',desiredPowerW:cp*0.82,
      reason:'W′ fast verbraucht; zeitweise unter CP bleiben'};
  }
  // Klar definierte Ausreißfenster: keine mehrstündige harte Attacke.
  const inWindow=(o.progress>=0.22&&o.progress<0.245) ||
     (o.progress>=0.64&&o.progress<0.66);
  if((o.autonomousAttack===true||
      (o.strategy==='offensiv'&&o.role==='kapitaen')) &&
     (o.attackOpportunity??inWindow) &&
     o.reserveFraction>(o.autonomousAttack===true?.28:.32)){
    return {intent:'angriff',desiredPowerW:cp+65+55*o.aggression,
      reason:o.attackOpportunity===undefined?
        'Vorab gewählte offensive Leitlinie: begrenzte Attacke':
        'Rennlage, Fahrerposition und W′-Reserve erlauben Angriff'};
  }
  // Nur bei Rückstand wird die Verfolgung teurer, nie automatisch schneller.
  if(!o.coordinatedTeamPace &&
     (o.strategy==='sprint'||o.strategy==='kapitaen_schuetzen') &&
     o.role==='helfer' && o.deficitToLeaderM>60 && o.progress<0.90 &&
     o.reserveFraction>0.28){
    return {intent:'verfolgung',desiredPowerW:cp+16+18*o.aggression,
      reason:'Helfer arbeitet gegen eine abgesetzte Spitze'};
  }
  if(!o.coordinatedTeamPace &&
     o.strategy==='kapitaen_schuetzen'&&o.role==='helfer' &&
     o.teamCaptainGapM!==null&&o.teamCaptainGapM<30 &&
     o.reserveFraction>0.15) {
    return {intent:'helferarbeit',desiredPowerW:cp*1.04,
      reason:'Helfer unterstützt den Kapitän durch Tempoarbeit'};
  }
  return {intent:protectedFromWind?'windschatten':'grundtempo',
    desiredPowerW:base,
    reason:protectedFromWind?'Geschützt im Windschatten fahren':'Grundtempo nach Fahrerleistung'};
}

/** Taktische Hysterese auf einer 10-s-Entscheidungsuhr.
 * Keine unsichtbare Bewegung: nur Vermeidung unrealistisch häufiger
 * Wechsel zwischen Verfolgen/Entspannen. Alle Watt bleiben im CP-Kern.
 */
export function stabilizeRaceDecision(input:{
  previous:TacticDecision;
  proposal:TacticDecision;
  timeS:number;
  previousSinceS:number;
  lastChaseEndS:number;
  reserveFraction:number;
}):TacticDecision {
  const {previous,proposal,timeS,previousSinceS,lastChaseEndS,reserveFraction}=input;
  for(const [k,v] of [['timeS',timeS],['previousSinceS',previousSinceS],
    ['lastChaseEndS',lastChaseEndS],['reserveFraction',reserveFraction]] as const)
    if(!Number.isFinite(v))throw new RangeError('Renn-KI: '+k);
  if(reserveFraction<0||reserveFraction>1+1e-7)
    throw new RangeError('Renn-KI: reserveFraction');
  if(previous.intent==='verfolgung' && proposal.intent!=='verfolgung' &&
     timeS-previousSinceS<50 && reserveFraction>0.10)
    return previous;
  if(previous.intent!=='verfolgung' && proposal.intent==='verfolgung' &&
     timeS-lastChaseEndS<90)
    return previous;
  return proposal;
}
