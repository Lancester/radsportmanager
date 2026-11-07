/** Rennlabor: versionierte, explizite Eingaben über den FREIGEGEBENEN RC1-Kern.
 * Keine zweite Physik- oder KI-Implementierung. Kein Regler ohne Wirkung.
 */
import {createReferenceFixture,REFERENCE_ROUTES} from '../engine/race/reference-fixtures.ts';
import {validateRace} from '../engine/race/race-simulator.ts';
import type {RaceInput,RaceRider} from '../engine/race/race-simulator.ts';
import type {RaceStrategy,RaceRole} from '../engine/race/race-tactics.ts';
import type {ReferenceRouteId} from '../engine/race/reference-fixtures.ts';
import {validateTeamPlan} from '../engine/race/team-tactical-plan.ts';
import type {TeamTacticalPlan} from '../engine/race/team-tactical-plan.ts';

export type TeamOrder={teamId:string;strategy:RaceStrategy;tacticalPlan?:TeamTacticalPlan};
export type RiderTune={id:string;criticalPowerPct?:number;wPrimePct?:number;
  massOffsetKg?:number;dragAreaPct?:number;aggression?:number;
  descentSkill?:number;sprintSkill?:number;wheelFindingSkill?:number;
  carbsGPerHour?:number;durabilityFactor?:number;wPrimeRecoveryFactor?:number};
export interface LabSettings {
  schemaVersion:1;
  routeId:ReferenceRouteId;seed:number;teamCount:number;
  /** Dieses Team steuert der Nutzer, alle übrigen die vorhandene KI. */
  myTeamId?:string;
  /** Fahrer-ID, die in der Rennaufstellung die Kapitänsrolle übernimmt. */
  captainId?:string;
  /** Einsatzrollen der eigenen Fahrer; der Kapitän wird separat ausgewählt. */
  riderRoles?:Record<string,Exclude<RaceRole,'kapitaen'>>;
  /** Favorisierter Zielsprinter; darf gleichzeitig Kapitän sein. */
  sprintLeaderId?:string;
  rosterKind:'route'|'flach'|'huegelig'|'klassiker'|'berg';
  teams:TeamOrder[];riders:RiderTune[];
  wind:{headwindMps:number;crosswindMps:number};
  road:{rollingCoefficient:number;descentTechnicalityOffset:number};
  engine:{groupRidingModel:NonNullable<RaceInput['groupRidingModel']>;
    aeroModel:NonNullable<RaceInput['aeroModel']>;
    tacticModel:NonNullable<RaceInput['tacticModel']>;
    enduranceModel:NonNullable<RaceInput['enduranceModel']>;
    disableAttacks:boolean;stepSeconds:number};
  timingRule:'road-1s'|'bunch-3s';
}
export const ROUTES=Object.entries(REFERENCE_ROUTES).map(([id,r])=>({
  id:id as ReferenceRouteId,name:r.name,kind:r.kind,distanceKm:r.distanceKm,
}));
export const STRATEGIES=['ausgewogen','offensiv','sprint','kapitaen_schuetzen'] as const;
export const TEAM_TACTIC_FIELDS=[
  {key:'attackRisk',label:'Angriffslust des Teams',values:[['keine','Keine Angriffe'],['vorsichtig','Vorsichtig'],['normal','Normal'],['aggressiv','Aggressiv'],['maximal','Sehr aggressiv']]},
  {key:'attackPhase',label:'Zeitpunkt der Angriffe',values:[['flexibel','Je nach Rennlage'],['frueh','Frühe Rennphase'],['mitte','Rennmitte'],['spaet','Letztes Drittel'],['finale','Nur Finale (ab 86 %)']]},
  {key:'chasePolicy',label:'Verfolgungsbereitschaft',values:[['vermeiden','Nicht selbst jagen'],['selektiv','Nur bei hoher Gefahr'],['normal','Nach Rennlage'],['konsequent','Konsequent nachführen']]},
  {key:'teamTempo',label:'Einsatztempo der Helfer',values:[['sparen','Kräfte sparen'],['normal','Normal'],['hoch','Hoher Krafteinsatz']]},
  {key:'finale',label:'Finale-Anweisung',values:[['situativ','Situationsabhängig'],['sprint','Sprint bevorzugen'],['spaete_attacke','Späte Attacke bevorzugen'],['kapitaen','Kapitän priorisieren']]},
  {key:'leaderProtection',label:'Kapitänsschutz',values:[['normal','Normal'],['hoch','Besonders schützen']]},
] as const;
export const RIDER_CONTROLS=[
  {key:'criticalPowerPct',label:'CP Leistung',min:75,max:125,step:1,unit:'%'},
  {key:'wPrimePct',label:'W′ Speicher',min:60,max:140,step:5,unit:'%'},
  {key:'massOffsetKg',label:'Gewichtsänderung',min:-8,max:8,step:.5,unit:'kg'},
  {key:'dragAreaPct',label:'Stirnfläche / CdA',min:80,max:120,step:2,unit:'%'},
  {key:'aggression',label:'Angriffslust',min:0,max:1,step:.05,unit:''},
  {key:'descentSkill',label:'Abfahrtstechnik',min:0,max:1,step:.05,unit:''},
  {key:'sprintSkill',label:'Sprintfähigkeit',min:0,max:1,step:.05,unit:''},
  {key:'wheelFindingSkill',label:'Hinterradfinden',min:0,max:1,step:.05,unit:''},
  {key:'carbsGPerHour',label:'Verpflegung',min:0,max:110,step:5,unit:'g/h'},
  {key:'durabilityFactor',label:'Ausdauerbeständigkeit',min:.7,max:1.3,step:.05,unit:''},
  {key:'wPrimeRecoveryFactor',label:'W′ Erholung',min:.7,max:1.3,step:.05,unit:''},
] as const;
const finite=(n:number,min:number,max:number,label:string)=>{
  if(typeof n!=='number'||!Number.isFinite(n)||n<min||n>max)
    throw new RangeError('Rennlabor: '+label+' außerhalb '+min+'…'+max);
  return n;
};
export function initialLabSettings():LabSettings {
  return {schemaVersion:1,routeId:'tdf25_lille',seed:2026,teamCount:22,
    rosterKind:'route',myTeamId:'T01',teams:[],riders:[],
    wind:{headwindMps:0,crosswindMps:0},
    road:{rollingCoefficient:.004,descentTechnicalityOffset:0},
    engine:{groupRidingModel:'stable-pack',aeroModel:'formation',
      tacticModel:'r15-r16',enduranceModel:'long',disableAttacks:false,stepSeconds:1},
    timingRule:'bunch-3s'};
}
export function buildLabRace(s:LabSettings):{input:RaceInput;changes:string[]} {
  if(!s||s.schemaVersion!==1)throw new RangeError('Rennlabor: inkompatibles Schema');
  if(!REFERENCE_ROUTES[s.routeId])throw new RangeError('Rennlabor: Strecke');
  if(!['route','flach','huegelig','klassiker','berg'].includes(s.rosterKind))
    throw new RangeError('Rennlabor: Teamzusammenstellung');
  if(!Number.isSafeInteger(s.seed)||s.seed<0||s.seed>2147483647)
    throw new RangeError('Rennlabor: Seed');
  if(!Number.isInteger(s.teamCount)||s.teamCount<2||s.teamCount>22)
    throw new RangeError('Rennlabor: Teamzahl');
  finite(s.wind.headwindMps,-20,20,'Gegenwind');
  finite(s.wind.crosswindMps,0,20,'Seitenwind');
  finite(s.road.rollingCoefficient,.002,.012,'Rollwiderstand');
  finite(s.road.descentTechnicalityOffset,-.12,.12,'Abfahrtstechnik der Strecke');
  const e=s.engine;
  if(!['stable-pack','legacy','cohesive','coordinated','relays','relay-paced','front-gated'].includes(e.groupRidingModel)||
    !['formation','legacy','formation-experiment'].includes(e.aeroModel)||
    !['r14','r15-r16'].includes(e.tacticModel)||
    !['long','off'].includes(e.enduranceModel)||
    typeof e.disableAttacks!=='boolean'||![.5,1].includes(e.stepSeconds))
    throw new RangeError('Rennlabor: Engine-Option');
  if(!['road-1s','bunch-3s'].includes(s.timingRule))
    throw new RangeError('Rennlabor: Zielgruppenregel');
  const f=createReferenceFixture({routeId:s.routeId,seed:s.seed,
    teamCount:s.teamCount,
    ...(s.rosterKind==='route'?{}:{rosterKind:s.rosterKind})});
  const myTeamId=s.myTeamId??'T01';
  if(!f.input.teams.some(t=>t.id===myTeamId))
    throw new RangeError('Rennlabor: eigenes Team nicht im Fahrerfeld');
  if(s.captainId!==undefined&&
    !f.input.riders.some(r=>r.id===s.captainId&&r.teamId===myTeamId))
    throw new RangeError('Rennlabor: Kapitän muss zum eigenen Team gehören');
  if(s.sprintLeaderId!==undefined&&
    !f.input.riders.some(r=>r.id===s.sprintLeaderId&&r.teamId===myTeamId))
    throw new RangeError('Rennlabor: Sprintziel muss zum eigenen Team gehören');
  for(const [id,role] of Object.entries(s.riderRoles??{})){
    if(!f.input.riders.some(r=>r.id===id&&r.teamId===myTeamId)||
      !['sprinter','helfer','frei'].includes(role))
      throw new RangeError('Rennlabor: nur eigenen Fahrern gültige Einsatzrollen zuweisen');
  }
  const effectiveCaptainId=s.captainId??f.input.riders.find(r=>
    r.teamId===myTeamId&&r.role==='kapitaen')?.id;
  if(s.riderRoles?.[effectiveCaptainId??'']!==undefined)
    throw new RangeError('Rennlabor: Kapitänsrolle separat wählen');
  const changes:string[]=[];
  const teamMap=new Map<string,RaceStrategy>();
  for(const t of s.teams){
    if(teamMap.has(t.teamId)||!f.input.teams.some(z=>z.id===t.teamId)||
      !STRATEGIES.includes(t.strategy))
      throw new RangeError('Rennlabor: Teamauftrag ungültig/dupliziert');
    if(t.tacticalPlan!==undefined)validateTeamPlan(t.tacticalPlan);
    teamMap.set(t.teamId,t.strategy);
  }
  const tuneMap=new Map<string,RiderTune>();
  for(const tune of s.riders){
    if(tuneMap.has(tune.id)||!f.input.riders.some(z=>z.id===tune.id))
      throw new RangeError('Rennlabor: Fahrer unbekannt/dupliziert');
    for(const [key,value] of Object.entries(tune)){
      if(key==='id')continue;
      const spec=RIDER_CONTROLS.find(x=>x.key===key);
      if(!spec)throw new RangeError('Rennlabor: unbekannter Fahrerregler '+key);
      finite(value as number,spec.min,spec.max,key);
    }
    tuneMap.set(tune.id,tune);
  }
  const riders:RaceRider[]=f.input.riders.map(r=>{
    const tune=tuneMap.get(r.id);
    const role:RaceRole=r.teamId===myTeamId?
      (r.id===effectiveCaptainId?'kapitaen':
        s.riderRoles?.[r.id]??(r.role==='kapitaen'?'helfer':r.role)):r.role;
    if(!tune)return {...r,role};
    const cpRatio=(tune.criticalPowerPct??100)/100;
    const next={...r,role,
      criticalPowerW:+(r.criticalPowerW*cpRatio).toFixed(2),
      ftpW:+(r.ftpW*cpRatio).toFixed(2),
      wPrimeJ:Math.round(r.wPrimeJ*(tune.wPrimePct??100)/100),
      massKg:+(r.massKg+(tune.massOffsetKg??0)).toFixed(2),
      dragAreaM2:+(r.dragAreaM2*(tune.dragAreaPct??100)/100).toFixed(5),
      aggression:tune.aggression??r.aggression,
      descentSkill:tune.descentSkill??r.descentSkill,
      sprintSkill:tune.sprintSkill??r.sprintSkill,
      wheelFindingSkill:tune.wheelFindingSkill??r.wheelFindingSkill,
      carbsGPerHour:tune.carbsGPerHour??r.carbsGPerHour,
      durabilityFactor:tune.durabilityFactor??r.durabilityFactor,
      wPrimeRecoveryFactor:tune.wPrimeRecoveryFactor??r.wPrimeRecoveryFactor,
    };
    changes.push('Fahrer '+r.id+': '+Object.keys(tune).filter(k=>k!=='id').join(', '));
    return next;
  });
  if(s.captainId)changes.push('Kapitän von '+myTeamId+': '+s.captainId);
  for(const [id,role] of Object.entries(s.riderRoles??{}))
    changes.push('Einsatzrolle '+id+': '+role);
  if(s.sprintLeaderId&&riders.find(r=>r.id===s.sprintLeaderId)?.role!=='kapitaen'&&
    riders.find(r=>r.id===s.sprintLeaderId)?.role!=='sprinter')
    throw new RangeError('Rennlabor: Sprintziel muss Kapitän oder Sprinter sein');
  if(s.sprintLeaderId)changes.push('Zielsprinter für '+myTeamId+': '+s.sprintLeaderId);
  const segments=f.input.segments.map(z=>({
    ...z,headwindMps:s.wind.headwindMps,
    crosswindMps:s.wind.crosswindMps,
    rollingCoefficient:s.road.rollingCoefficient,
    descentTechnicality:Math.min(1,Math.max(0,
      z.descentTechnicality+s.road.descentTechnicalityOffset)),
  }));
  const teams=f.input.teams.map(t=>{
    const strategy=teamMap.get(t.id);
    if(strategy&&strategy!==t.strategy)changes.push('Team '+t.id+': '+strategy);
    const override=s.teams.find(x=>x.teamId===t.id);
    if(override?.tacticalPlan)changes.push('Taktischer Plan für '+t.id+': '+JSON.stringify(override.tacticalPlan));
    return {...t,strategy:strategy??t.strategy,
      ...(t.id===myTeamId&&s.sprintLeaderId?{sprintLeaderId:s.sprintLeaderId}:{}),
      ...(override?.tacticalPlan?{tacticalPlan:override.tacticalPlan}:{})};
  });
  if(s.wind.headwindMps||s.wind.crosswindMps)changes.push('Wind geändert');
  if(s.road.rollingCoefficient!==.004||s.road.descentTechnicalityOffset)
    changes.push('Streckenoberfläche/Abfahrt geändert');
  if(s.rosterKind!=='route'||s.teamCount!==22)changes.push('Startfeld verändert');
  const input:RaceInput={...f.input,teams,riders,segments,
    aeroModel:e.aeroModel,enduranceModel:e.enduranceModel,
    tacticModel:e.tacticModel,groupRidingModel:e.groupRidingModel,
    disableAttacks:e.disableAttacks,stepSeconds:e.stepSeconds,
    diagnosticLevel:'checkpoints'};
  validateRace(input);
  return {input,changes};
}
