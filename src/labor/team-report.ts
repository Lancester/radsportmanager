/**
 * Faktischer Rennbericht für ein ausgewähltes Team.
 * Keine generative Fiktion: Jede Aussage basiert auf Zielklassifikation,
 * den wirklich protokollierten KI-Ereignissen oder Checkpoint-Messungen.
 *
 * Später auch vom Manager nutzbar; unveränderte Rennengine, kein LLM.
 */
import type {RaceInput,RaceResult} from '../engine/race/race-simulator.ts';

export interface TeamReport {
  teamId:string;teamName:string;captainId:string;captainName:string;
  summary:string[];sprintLeaderId?:string;sprintLeaderName?:string;
  riderResults:Array<{id:string;name:string;role:string;rank:number;
    gapS:number;creditedGapS:number;wPrimeKJ:number;averageW:number}>;
  events:Array<{km:number;type:string;description:string}>;
  checkpoints:Array<{km:number;captainGapM:number;captainGroup:number;
    captainWPrimePct:number;leaderName:string}>;
  counts:{attacks:number;chaseOrders:number;sprintTrains:number;teamPaces:number};
}

export function buildTeamReport(
  input:RaceInput,outcome:RaceResult,myTeamId:string,
  creditedGaps:ReadonlyMap<string,number>,
):TeamReport{
  const team=input.teams.find(t=>t.id===myTeamId);
  if(!team)throw new RangeError('Rennlabor: Teambericht ohne ausgewähltes Team');
  const riders=input.riders.filter(r=>r.teamId===myTeamId);
  const captain=riders.find(r=>r.role==='kapitaen');
  if(!captain)throw new RangeError('Rennlabor: Mannschaft hat keinen Kapitän');
  const finish=outcome.classification.filter(r=>r.teamId===myTeamId);
  const rows=finish.map(r=>({
    id:r.id,name:r.name,role:r.role,rank:r.rank,gapS:r.gapS,
    creditedGapS:creditedGaps.get(r.id)??r.gapS,
    wPrimeKJ:+(r.finalWPrimeJ/1000).toFixed(1),
    averageW:+r.averageCrankPowerW.toFixed(0),
  }));
  const captainRow=rows.find(r=>r.id===captain.id)!;
  const riderNames=new Map(input.riders.map(r=>[r.id,r.name]));
  const sprintLeaderId=team.sprintLeaderId??
    riders.find(r=>r.role==='sprinter')?.id;
  const sprintLeaderName=sprintLeaderId?riderNames.get(sprintLeaderId):undefined;
  const ownEvents=outcome.events.filter(e=>
    e.teamId===myTeamId&&['attack','chase','sprint','team-chase',
      'team-pace','sprint-train','recovery'].includes(e.type));
  const count=(type:string)=>ownEvents.filter(e=>e.type===type).length;
  const counts={attacks:count('attack'),chaseOrders:count('team-chase'),
    sprintTrains:count('sprint-train'),teamPaces:count('team-pace')};
  const positions=(outcome.checkpoints??[]).map(c=>{
    const cr=c.riders.find(r=>r.riderId===captain.id);
    if(!cr)return null;
    return {km:+c.km.toFixed(1),captainGapM:+cr.gapToLeaderM.toFixed(0),
      captainGroup:cr.groupIndex+1,
      captainWPrimePct:+cr.wPrimeRemainingPct.toFixed(0),
      leaderName:riderNames.get(c.leaderId)??c.leaderId};
  }).filter((x):x is NonNullable<typeof x>=>x!==null);
  const points=positions.length?[positions[Math.floor((positions.length-1)*.25)],
    positions[Math.floor((positions.length-1)*.5)],
    positions[Math.floor((positions.length-1)*.75)],
    positions[positions.length-1]]:[];
  const summary=[
    team.name+': '+riders.length+' Fahrer im Rennen, Kapitän '+captain.name+
      ' ('+captain.specialty+').',
    'Teamziel/Leitlinie: '+team.strategy+
      (team.tacticalPlan?'; zusätzlicher Taktikplan aktiv.':'; Standard-KI ohne Zusatzplan.'),
    'Bester Fahrer: '+rows[0].name+' (Platz '+rows[0].rank+
      ', '+rows[0].creditedGapS.toFixed(1)+' s gutgeschriebener Rückstand).',
    'Kapitän '+captain.name+': Platz '+captainRow.rank+
      ', '+captainRow.creditedGapS.toFixed(1)+' s gewerteter Rückstand, '+
      captainRow.wPrimeKJ+' kJ W′ im Ziel.',
    'Vorgesehener Zielsprinter: '+(sprintLeaderName??'nicht ausdrücklich festgelegt')+
      (sprintLeaderId===captain.id?' (zugleich Kapitän).':'.'),
    'Teamaktionen laut KI-Protokoll: '+counts.attacks+' Attacken, '+
      counts.chaseOrders+' organisierte Jagdaufträge, '+counts.sprintTrains+
      ' Sprintzugereignisse, '+counts.teamPaces+' Teamtempoereignisse.',
    'Diese Ereignisse sind Absichten/Aufträge, nicht automatisch erfolgreiche Fluchten '+
      'oder tatsächlich geleistete Windfrontarbeit.',
  ];
  if(points.length)summary.push('Kapitän unterwegs: '+points.map(p=>
    'km '+p.km+' in Gruppe '+p.captainGroup+
    ' ('+p.captainGapM+' m zur Spitze, '+p.captainWPrimePct+' % W′)').join('; ')+'.');
  const mapped=ownEvents.filter(e=>['attack','team-chase','team-pace',
    'sprint-train','sprint'].includes(e.type));
  // Ereignisse zu Beginn und gegen Rennende, kein beliebiger Anspruch
  // auf vollständige Telemetrie; sämtliche Zählwerte beziehen sich auf alle.
  const prioritized=mapped.length>40?
    [...mapped.slice(0,18),...mapped.slice(-22)]:mapped;
  const events=prioritized.map(e=>({
    km:+e.km.toFixed(1),type:e.type,description:e.description,
  }));
  return {teamId:team.id,teamName:team.name,captainId:captain.id,
    sprintLeaderId,sprintLeaderName,
    captainName:captain.name,summary,riderResults:rows,events,
    checkpoints:points,counts};
}
