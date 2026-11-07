/**
 * R-22A/B/C: versionierte, quellengestützte Referenzszenarien.
 *
 * "An echte Rennen angelehnt" != exakter GPS/GPX-Track.
 * Die überprüfbaren Gesamtdistanzen und klassifizierten Anstiege stammen
 * aus Rennunterlagen. Dazwischen sind ausdrücklich modellierte Übergänge,
 * keine behaupteten Original-Höhen-/Wetterdaten.
 *
 * Fiktive Team- und Fahreridentitäten; Körpermasse, CdA, CP und W′
 * orientieren sich an publizierten Typ-Mittelwerten (nicht Messwerten
 * einzelner realer Profis). Kein heimlicher Zeit-/Positionierungsbonus.
 */
import type {RaceInput,RaceRider,RaceSegment}
  from './race-simulator.ts';
import type {RaceStrategy} from './race-tactics.ts';
import {validateRace} from './race-simulator.ts';

export type ReferenceRouteId=
  'tdf25_lille'|'tdf25_boulogne'|'lbl25_liege'|'tdf25_hautacam';
export interface ReferenceClimb {
  name:string;endKm:number;lengthKm:number;averageGrade:number;
}
export interface ReferenceRoute {
  id:ReferenceRouteId;name:string;kind:'flach'|'huegelig'|'klassiker'|'berg';
  distanceKm:number;year:number;referenceAscentM?:number;
  sources:readonly string[];
  climbs:readonly ReferenceClimb[];
  /** Alle nicht durch publizierte Anstiege definierten Übergänge sind
   * synthetische Proxies. Keine vollständige GPX-Rekonstruktion. */
  fidelity:'published-distance-and-climbs-approximated-transitions';
}
const route=(
  id:ReferenceRouteId,name:string,kind:ReferenceRoute['kind'],
  distanceKm:number,sources:string[],climbs:ReferenceClimb[],
  referenceAscentM?:number,
):ReferenceRoute=>({
  id,name,kind,distanceKm,year:2025,sources,climbs,
  referenceAscentM,
  fidelity:'published-distance-and-climbs-approximated-transitions',
});
export const REFERENCE_ROUTES:Record<ReferenceRouteId,ReferenceRoute>={
  tdf25_lille:route('tdf25_lille',
    'Tour de France 2025 – Lille → Lille, 1. Etappe',
    'flach',184.9,[
      'https://www.letour.fr/en/the-race/grands-departs/grand-depart-2025',
      'https://sanluca.cc/races/g5Vgvv7ZY',
      'https://www.procyclingstats.com/race/tour-de-france/2025/stage-1/history/overview',
    ],[
      {name:'Notre-Dame-de-Lorette',endKm:41.1,lengthKm:1.0,averageGrade:0.076},
      {name:'Mont Cassel',endKm:105.8,lengthKm:1.9,averageGrade:0.036},
      {name:'Mont Noir',endKm:139.5,lengthKm:1.3,averageGrade:0.061},
    ],1065),
  tdf25_boulogne:route('tdf25_boulogne',
    'Tour de France 2025 – Lauwin-Planque → Boulogne, 2. Etappe',
    'huegelig',209.1,[
      'https://www.letour.fr/de/aktuelles/2025/etappe-2/lang-und-schwer/1325323',
      'https://www.procyclingstats.com/race/tour-de-france/2025/stage-2/live',
      'https://www.cyclingstage.com/tour-de-france-2025-route/stage-2-tdf-2025/',
    ],[
      {name:'Côte de Cavron-Saint-Martin',endKm:104.6,lengthKm:1.2,averageGrade:0.05},
      {name:'Côte du Haut Pichot',endKm:179.9,lengthKm:1.1,averageGrade:0.09},
      {name:'Côte de Saint-Étienne-au-Mont',endKm:201.3,lengthKm:1.1,averageGrade:0.094},
      {name:'Côte d’Outreau',endKm:204.5,lengthKm:0.8,averageGrade:0.08},
      {name:'Zielanstieg Boulogne',endKm:209.1,lengthKm:1.2,averageGrade:0.038},
    ],2164),
  lbl25_liege:route('lbl25_liege',
    'Liège–Bastogne–Liège 2025, Eintagesklassiker',
    'klassiker',252,[
      'https://www.cyclingnews.com/races/liege-bastogne-liege-2025/map/',
      'https://www.procyclingstats.com/race/liege-bastogne-liege/2025/route/climbs',
    ],[
      {name:'Côte de Saint-Roch',endKm:70.7,lengthKm:1,averageGrade:0.112},
      {name:'Col de Haussire',endKm:119.4,lengthKm:3.9,averageGrade:0.072},
      {name:'Côte de Mont-le-Soie',endKm:158.7,lengthKm:1.8,averageGrade:0.075},
      {name:'Côte de Wanne',endKm:167,lengthKm:2.8,averageGrade:0.046},
      {name:'Côte de Stockeu',endKm:173.5,lengthKm:1,averageGrade:0.125},
      {name:'Côte de Haute-Levée',endKm:177.7,lengthKm:3,averageGrade:0.063},
      {name:'Col du Rosier',endKm:192,lengthKm:4.5,averageGrade:0.056},
      {name:'Côte de Desnié',endKm:205.3,lengthKm:1.6,averageGrade:0.073},
      {name:'Côte de la Redoute',endKm:218,lengthKm:1.6,averageGrade:0.088},
      {name:'Côte des Forges',endKm:228.7,lengthKm:1.3,averageGrade:0.077},
      {name:'Côte de la Roche-aux-Faucons',endKm:238.7,lengthKm:1.3,averageGrade:0.11},
    ]),
  tdf25_hautacam:route('tdf25_hautacam',
    'Tour de France 2025 – Auch → Hautacam, 12. Etappe',
    'berg',180.6,[
      'https://www.velowire.com/article/1220/en/the-tour-de-france-2025-race-route-on-openstreetmap-maps-and-in-google-earth--stage-profiles-and-time--route-schedules.html',
      'https://www.tour-magazin.de/en/professional-cycling/latest-news/the-tour-tech-briefing-for-stage-12-of-the-tour-de-france-2025/',
      'https://www.procyclingstats.com/race/tour-de-france/2025/stage-12-gc/info/profiles',
    ],[
      {name:'Côte de Labatmale',endKm:91.4,lengthKm:1.3,averageGrade:0.063},
      {name:'Col du Soulor',endKm:134.1,lengthKm:11.8,averageGrade:0.073},
      {name:'Col de Bordères',endKm:145.7,lengthKm:3.1,averageGrade:0.077},
      {name:'Hautacam – Bergankunft',endKm:180.6,lengthKm:13.5,averageGrade:0.078},
    ],3850),
};

/** Originaldaten belegter Eckpunkte plus vollständig ausgewiesene
 * Modellübergänge. Physikalische Strecke ohne unrealistisch lange
 * Konstantsteigungen. Zwischenabschnitte sind bewusst NICHT GPX-genau. */
export function createReferenceSegments(id:ReferenceRouteId):RaceSegment[]{
  const spec=REFERENCE_ROUTES[id];
  if(!spec)throw new RangeError('R-22A: Referenzstrecke unbekannt');
  const segments:RaceSegment[]=[];
  const climbs=[...spec.climbs].sort((a,b)=>a.endKm-b.endKm);
  let cursor=0,backgroundIndex=0;
  const bgGrades:Record<ReferenceRoute['kind'],number[]>={
    flach:[0.002,-0.003,0.006,-0.004,0.004,-0.002],
    huegelig:[0.009,-0.012,0.015,-0.011,0.007,-0.006],
    klassiker:[0.015,-0.014,0.018,-0.013,0.011,-0.015],
    berg:[0.013,-0.016,0.023,-0.020,0.017,-0.013],
  };
  const emit=(lengthKm:number,name:string,grade:number)=>{
    const lengthM=Math.round(lengthKm*1000);
    if(lengthM<100)throw new RangeError('R-22A: zu kurzer Abschnitt');
    segments.push({
      name,lengthM,gradeFraction:grade,
      descentTechnicality:grade<-0.025?0.45:0.12,
      rollingCoefficient:0.004,
    });
  };
  const transitionTo=(endKm:number)=>{
    const gap=Math.round((endKm-cursor)*1000)/1000;
    if(gap<-0.000001)throw new RangeError('R-22A: sich überschneidende Anstiege');
    if(gap<0.1&&gap>0)throw new RangeError('R-22A: Übergang <100 m');
    if(gap<=0)return;
    const count=Math.ceil(gap/9);
    for(let i=0;i<count;i++){
      const chunk=Math.round((gap/count)*1000)/1000;
      const distance=i===count-1?gap-chunk*(count-1):chunk;
      const bg=bgGrades[spec.kind][backgroundIndex++%bgGrades[spec.kind].length];
      emit(distance,'Modellierter Übergang '+(backgroundIndex),bg);
    }
    cursor=endKm;
  };
  for(const climb of climbs){
    const start=+(climb.endKm-climb.lengthKm).toFixed(3);
    transitionTo(start);
    emit(climb.lengthKm,climb.name,climb.averageGrade);
    cursor=climb.endKm;
  }
  transitionTo(spec.distanceKm);
  // Makroabgleich, KEINE GPX-Exaktheit: veröffentlichte
  // Gesamt-Höhenmeter auf die synthetischen Übergänge verteilen,
  // ohne Länge oder Steigung eines belegten Anstiegs zu verändern.
  const transitions=segments.filter(s=>
    s.name.startsWith('Modellierter Übergang'));
  const knownAscent=segments.filter(s=>
    !s.name.startsWith('Modellierter Übergang')).reduce((n,s)=>
      n+Math.max(0,s.gradeFraction)*s.lengthM,0);
  const positiveTransitions=transitions.filter(s=>s.gradeFraction>0);
  const transitionAscent=positiveTransitions.reduce((n,s)=>
    n+s.gradeFraction*s.lengthM,0);
  const targetAscent=spec.referenceAscentM??(knownAscent+transitionAscent);
  const scaling=(targetAscent-knownAscent)/Math.max(1,transitionAscent);
  if(scaling<=0||scaling>10)
    throw new RangeError('R-22A: veröffentlichte Höhenmeter unvereinbar');
  for(const s of positiveTransitions)s.gradeFraction*=scaling;
  // Im Gegensatz zur echten Höhenlage ist der Ziel-Nettoanstieg
  // bei Boulogne/Lüttich eine Modellannahme (~0 m), keine Quelle.
  // Bei Lille ca. -14 m, bei Auch→Hautacam ca. +1381 m aus
  // den dokumentierten Start-/Zielhöhen der Rennprofile.
  const modelledNetTargetM=spec.id==='tdf25_lille'?-14:
    spec.id==='tdf25_hautacam'?1381:0;
  const negativeTransitions=transitions.filter(s=>s.gradeFraction<0);
  const initialDescent=negativeTransitions.reduce((n,s)=>
    n-s.gradeFraction*s.lengthM,0);
  const desiredDescent=targetAscent-modelledNetTargetM;
  if(desiredDescent<0||initialDescent<=0)
    throw new RangeError('R-22A: Abstiegsbilanz ungültig');
  const descentScale=desiredDescent/initialDescent;
  for(const s of negativeTransitions)s.gradeFraction*=descentScale;
  if(segments.some(s=>Math.abs(s.gradeFraction)>.2))
    throw new RangeError('R-22A: Übergangssteigung > 20 Prozent');
  if(segments.length>60)throw new RangeError('R-22A: mehr als 60 Abschnitte');
  const actual=segments.reduce((s,x)=>s+x.lengthM,0);
  if(Math.abs(actual-spec.distanceKm*1000)>0.01)
    throw new Error('R-22A: Streckendistanz nicht erhalten');
  return segments;
}

// Literaturbasis: Model Table 1 (144 Profis, Mittelwerte geschätzt).
// https://pmc.ncbi.nlm.nih.gov/articles/PMC12400862/
// Kategorien "klassiker" und "gc" sind begründete Modellableitungen;
// kein Zugriff auf individuelle Leistungs- oder Gesundheitsdaten.
type Archetype='sprinter'|'kletterer'|'gc'|'klassiker'|'zeitfahrer'|'allrounder';
export const PRO_REFERENCE=Object.freeze({
  sprinter:{massKg:80.2,criticalPowerW:381.3,wPrimeJ:38600,dragAreaM2:.285},
  kletterer:{massKg:63.2,criticalPowerW:354.1,wPrimeJ:23000,dragAreaM2:.264},
  gc:{massKg:63.8,criticalPowerW:388.6,wPrimeJ:18100,dragAreaM2:.265},
  klassiker:{massKg:71.0,criticalPowerW:368,wPrimeJ:30000,dragAreaM2:.274},
  zeitfahrer:{massKg:72.6,criticalPowerW:395.3,wPrimeJ:22000,dragAreaM2:.276},
  allrounder:{massKg:69.5,criticalPowerW:361.1,wPrimeJ:30100,dragAreaM2:.272},
} satisfies Record<Archetype,{
  massKg:number;criticalPowerW:number;wPrimeJ:number;dragAreaM2:number;
}>);

export type TeamFocus='sprint'|'berg'|'klassiker'|'ausreisser'|'ausgewogen';
export interface ReferenceTeamComposition {
  teamId:string;focus:TeamFocus;strategy:RaceStrategy;
  riders:readonly Archetype[];
}
const compositions:Record<TeamFocus,{strategy:RaceStrategy;roles:Archetype[]}> = {
  sprint:{strategy:'sprint',roles:[
    'sprinter','sprinter','klassiker','allrounder',
    'zeitfahrer','allrounder','allrounder']},
  berg:{strategy:'kapitaen_schuetzen',roles:[
    'gc','kletterer','kletterer','zeitfahrer','allrounder',
    'allrounder','klassiker']},
  klassiker:{strategy:'offensiv',roles:[
    'klassiker','sprinter','klassiker','allrounder',
    'zeitfahrer','allrounder','kletterer']},
  ausreisser:{strategy:'offensiv',roles:[
    'allrounder','klassiker','zeitfahrer','kletterer',
    'allrounder','allrounder','klassiker']},
  ausgewogen:{strategy:'ausgewogen',roles:[
    'gc','sprinter','kletterer','allrounder',
    'klassiker','zeitfahrer','allrounder']},
};
/** Nicht-historische, ausdrücklich modellierte und
 * profilspezifische 22er-Teamaufstellungen, keine echten Startlisten.
 * Flach: mehr Sprintzüge; Berge: mehr Kapitäne/Kletterhelfer;
 * Ardennenklassiker: überwiegend klassische Puncheur-Teams.
 * Ein realer TdF-Kader hängt natürlich von allen Etappen ab –
 * wir modellieren nur das einzelne hier getestete Rennen. */
export const REFERENCE_TEAM_COUNTS:Record<
  ReferenceRoute['kind'],Readonly<Record<TeamFocus,number>>>={
  flach:{sprint:8,berg:4,klassiker:4,ausreisser:3,ausgewogen:3},
  huegelig:{sprint:4,berg:5,klassiker:7,ausreisser:3,ausgewogen:3},
  klassiker:{sprint:1,berg:4,klassiker:10,ausreisser:4,ausgewogen:3},
  berg:{sprint:1,berg:11,klassiker:4,ausreisser:3,ausgewogen:3},
};
export function createReferenceTeamCompositions(
  kind:ReferenceRoute['kind'],
):ReferenceTeamComposition[]{
  const counts=REFERENCE_TEAM_COUNTS[kind];
  if(!counts)throw new RangeError('R-22C: Teamprofil unbekannt');
  // Interleaving verhindert 5x ausschließlich Sprintteams
  // bei kleinen diagnostischen Subsets.
  const active={...counts};
  const focuses:TeamFocus[]=[];
  const total=Object.values(counts).reduce((a,b)=>a+b,0);
  for(let i=0;i<total;i++){
    const next=(Object.keys(active) as TeamFocus[])
      .filter(type=>active[type]>0)
      .sort((a,b)=>active[b]-active[a]||
        a.localeCompare(b))[0];
    focuses.push(next);
    active[next]--;
  }
  if(focuses.length!==22)
    throw new RangeError('R-22C: Referenzfeld muss 22 Teams haben');
  return focuses.map((focus,i)=>({
    teamId:'T'+String(i+1).padStart(2,'0'),focus,
    strategy:compositions[focus].strategy,
    riders:[...compositions[focus].roles],
  }));
}

function hash(index:number,salt:number):number {
  let n=Math.imul(index+19,2654435761)^Math.imul(salt+11,2246822507);
  n=Math.imul(n^(n>>>16),2246822519);
  return ((n^(n>>>13))>>>0)/4294967296;
}
function symmetric(index:number,salt:number):number{
  // deterministisches, begrenztes Dreiecksprofil ohne
  // versteckte Tagesform-Änderung zwischen Monte-Carlo-Seeds.
  return hash(index,salt)+hash(index,salt+51)-1;
}
/** Fiktive, sprachlich gemischte Namen. Gleicher Seed + Fahrer-ID => gleicher Name.
 * Nur die Anzeige, nie Physik oder Rennzufallszahl, wird damit geändert.
 * Die Indexpermutation ist auf einer 2D-Namenstafel eindeutig für alle 154 Fahrer.
 */
const FIRST_NAMES=["Lukas","Noah","Leon","Jonas","Felix","Nico","Emil","Theo","Paul","Milan","Ben","Finn","Anton","Elias","Moritz","Maxime","Hugo","Louis","Jules","Mathis","Pierre","Adrien","Mateo","Diego","Carlos","Pablo","Andrés","Alejandro","Marco","Luca","Matteo","Davide","Andrea","Giulio","Stefano","Giovanni","Jan","Bram","Thijs","Daan","Sven","Mikkel","Anders","Johan","Erik","Oskar","Filip","Jakub","Tomas","Adam","Kamil","Matej","Petr","Daniel","Oliver","Martin","Samuel","Rafael","Miguel","Tiago","João","Tomás","Patrick","Ethan","George","James","Jack","Oscar","Nathan","Alex","Ruben","Yann","Nils","Florian","Timo","Sebastian","Arthur","Victor","Gabriel","Santiago","Enzo","Alessio"];
const LAST_NAMES=["Weber","Schneider","Keller","Hartmann","Fischer","Vogel","Winter","Brandt","Neumann","Krüger","Berger","Roth","Becker","Albrecht","Hoffmann","Krause","Meier","Wagner","Marchand","Laurent","Moreau","Renaud","Dubois","Lefèvre","Petit","Garnier","Leroux","Benoit","Martin","Faure","Durand","Rossi","Bianchi","Conti","Romano","Ricci","Ferrari","Costa","Moretti","Marini","Fontana","Fabbri","Silva","Sousa","Ferreira","Pereira","Almeida","Oliveira","Santos","Gomes","Mendes","Rodrigues","García","Fernández","Moreno","Ruiz","Navarro","Vargas","Castillo","Ortega","Molina","Serrano","Herrera","Díaz","López","Jansen","De Vries","Bakker","Van Dijk","Visser","Bos","Smit","Van Leeuwen","Nielsen","Hansen","Andersen","Larsen","Jørgensen","Sørensen","Johansson","Lindberg","Eriksson","Karlsson","Bergström","Nowak","Kowalski","Zieliński","Novák","Dvořák","Horváth","Kováč","Klein","Müller","Schulz","Peters"];
function fictionalRiderName(index:number,seed:number):string{
  const span=FIRST_NAMES.length*LAST_NAMES.length;
  const stride=791; // teilerfremd zur kombinierten Tafelgröße
  const nameIndex=((index*stride+Math.imul(seed,73))%span+span)%span;
  const given=FIRST_NAMES[nameIndex%FIRST_NAMES.length];
  const family=LAST_NAMES[Math.floor(nameIndex/FIRST_NAMES.length)];
  return given+' '+family;
}
function buildRider(archetype:Archetype,teamId:string,
  index:number,slot:number,focus:TeamFocus,seed:number):RaceRider{
  const model=PRO_REFERENCE[archetype];
  const multiplier=1+symmetric(index,7)*0.085;
  const cp=Math.round(model.criticalPowerW*multiplier*10)/10;
  const isCaptain=slot===0;
  const isSprinter=slot===1&&archetype==='sprinter'&&
    (focus==='sprint'||focus==='klassiker'||focus==='ausgewogen');
  const role=isCaptain?'kapitaen':isSprinter?'sprinter':'helfer';
  const specialty=archetype==='gc'?'kletterer':
    archetype==='klassiker'?'klassiker':archetype;
  return {
    id:'F'+String(index+1).padStart(3,'0'),
    name:fictionalRiderName(index,seed),
    teamId,role,specialty,
    criticalPowerW:cp,
    /** FTP ist aktuell nur Profilwert, nicht ein unabhängiger Motor. */
    ftpW:+(cp*.97).toFixed(1),
    wPrimeJ:Math.round(model.wPrimeJ*(1+symmetric(index,13)*.14)),
    massKg:+(model.massKg+symmetric(index,17)*6).toFixed(1),
    bikeMassKg:7.7,
    dragAreaM2:+(model.dragAreaM2+symmetric(index,23)*.013).toFixed(4),
    sprintSkill:archetype==='sprinter'?.95:archetype==='klassiker'?.73:.45,
    // Separates individuell unterschiedliches Sprint-Antrittsverhalten:
    // frühe Antritte und Abwarten auf geschütztes Hinterrad koexistieren.
    sprintLaunchPreference:+(.10+hash(index,71)*.80).toFixed(3),
    sprintPeakPowerW:Math.round(model.massKg*
      (7+10*(archetype==='sprinter'?.95:
        archetype==='klassiker'?.73:.45))*
      (1+symmetric(index,73)*.085)),
    // Wie LANGE der Fahrer hohe Sprintwatt halten kann, getrennt
    // von Spitzenwatt und der weiterhin bilanzierten W′-Reserve.
    sprintDecayTimeS:+(13+hash(index,91)*12).toFixed(2),
    // Von Endspurt-Kraft getrennt: eigenständiges taktisches Talent,
    // ein fremdes schnelles Hinterrad im realen Feld zu erkennen.
    wheelFindingSkill:+(archetype==='sprinter'?
      (.38+hash(index,43)*.60):(.28+hash(index,43)*.46)).toFixed(3),
    descentSkill:+(.55+hash(index,31)*.4).toFixed(3),
    aggression:+(.32+hash(index,37)*.55).toFixed(3),
    carbsGPerHour:70+(index%3)*10,
    // Fiktive, reproduzierbare und voneinander unabhängige Eigenschaften;
    // nicht aus Fahrertyp oder realer Person abgeleitet.
    durabilityFactor:+(0.85+0.30*hash(index,151)).toFixed(3),
    wPrimeRecoveryFactor:+(0.85+0.30*hash(index,199)).toFixed(3),
  };
}
export interface ReferenceFixture {
  input:RaceInput;route:ReferenceRoute;
  modelledAscentM:number;
  teamFoci:Record<TeamFocus,number>;
  teamCompositions:readonly ReferenceTeamComposition[];
}
export function createReferenceFixture(options:{
  routeId:ReferenceRouteId;seed?:number;teamCount?:number;
  /** Vergleich: gleiche Fahrer/Teams fuer unterschiedliche Rennprofile. */
  rosterKind?:ReferenceRoute['kind'];
}):ReferenceFixture{
  if(!options||!REFERENCE_ROUTES[options.routeId])
    throw new RangeError('R-22A: Referenzstrecke ungültig');
  const count=options.teamCount??22;
  if(!Number.isInteger(count)||count<1||count>22)
    throw new RangeError('R-22C: 1–22 Referenzteams');
  const route=REFERENCE_ROUTES[options.routeId];
  const segments=createReferenceSegments(options.routeId);
  const chosen=createReferenceTeamCompositions(options.rosterKind??route.kind)
    .slice(0,count);
  const teams=chosen.map(c=>({
    id:c.teamId,name:'Fiktives Profi-Team '+c.teamId,
    strategy:c.strategy,
  }));
  const riders=chosen.flatMap((c,t)=>
    c.riders.map((type,j)=>buildRider(type,c.teamId,t*7+j,j,c.focus,options.seed??2026)));
  const input:RaceInput={
    title:route.name+' – reproduzierbare R-22-Referenz',
    segments,teams,riders,seed:options.seed??2026,
    maxRaceTimeS:60000,stepSeconds:1,
  };
  validateRace(input);
  const teamFoci={sprint:0,berg:0,klassiker:0,ausreisser:0,ausgewogen:0};
  for(const c of chosen)teamFoci[c.focus]++;
  return {
    input,route,teamFoci,teamCompositions:chosen,
    modelledAscentM:Math.round(segments.reduce((s,x)=>
      s+Math.max(0,x.gradeFraction)*x.lengthM,0)),
  };
}
