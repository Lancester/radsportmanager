/* Rennlabor-Worker: ausschließlich bestehende RC1-Engine; keine externe API. */
import {buildLabRace} from './generated/labor/lab-settings.js';
import {simulateRace} from './generated/engine/race/race-simulator.js';
import {scoreFinishGroups} from './generated/engine/race/finish-time-groups.js';
import {buildTeamReport} from './generated/labor/team-report.js';

self.onmessage=async ({data})=>{
  const {id,settings}=data;
  try {
    const start=performance.now();
    const {input,changes}=buildLabRace(settings);
    const outcome=simulateRace(input);
    const scored=scoreFinishGroups(outcome.classification.map(r=>({
      id:r.id,rank:r.rank,finishTimeS:r.finishTimeS,
    })),settings.timingRule);
    const ids=new Map(scored.map(x=>[x.id,x]));
    const teamReport=buildTeamReport(input,outcome,settings.myTeamId??'T01',
      new Map(scored.map(x=>[x.id,x.creditedGapS])));
    const roles=new Map(input.riders.map(x=>[x.id,x.specialty??x.role]));
    const results=outcome.classification.map(r=>({
      ...r,type:roles.get(r.id),
      creditedGapS:ids.get(r.id).creditedGapS,
      finishGroup:ids.get(r.id).finishGroup,
      finishGroupSize:ids.get(r.id).finishGroupSize,
    }));
    const groups=results.reduce((a,r)=>{
      const key=r.finishGroup;
      if(!a[key])a[key]={index:key,gapS:r.creditedGapS,leader:r.id,
        count:0,teams:[]};
      a[key].count++;return a;
    },[]);
    const noteworthy=outcome.events.filter(e=>[
      'attack','breakaway','breakaway-caught','chase',
      'group-split','sprint','team-chase','team-pace','sprint-train'
    ].includes(e.type));
    const eventSummary=noteworthy.reduce((a,e)=>{
      a[e.type]=(a[e.type]??0)+1;return a;
    },{});
    const checkpoints=(outcome.checkpoints??[]).map(c=>({
      km:+c.km.toFixed(1),frontGroup:c.groupSizes[0]??0,
      largest:c.largestGroup,groups:c.groupCount,
      spanKm:+(c.frontToBackM/1000).toFixed(2),
      frontGapM:c.riders[0]?.gapToLeaderM??0,
    }));
    const keyEvents=noteworthy.filter((e,i)=>{
      if(e.type==='chase')return i%8===0;
      if(e.type==='group-split')return i%5===0;
      return true;
    }).slice(0,160).map(e=>({
      km:+e.km.toFixed(1),type:e.type,
      description:e.description,riderId:e.riderId??null,teamId:e.teamId??null,
      gapM:e.gapM??null,
    }));
    // Nachweis der angewendeten Vorabpläne anhand echter KI-Ereignisse.
    // Team-Chase-Auftrag ist nicht gleich physischer Windfront-Zeit.
    const tacticalEvidence=input.teams.filter(team=>team.tacticalPlan)
      .map(team=>{
        const own=outcome.events.filter(e=>e.teamId===team.id);
        const count=type=>own.filter(e=>e.type===type).length;
        return {teamId:team.id,strategy:team.strategy,plan:team.tacticalPlan,
          attackEvents:count('attack'),chaseEvents:count('team-chase'),
          sprintTrainEvents:count('sprint-train'),teamPaceEvents:count('team-pace')};
      });
    const report=[
      `Sieger: ${results[0].name} (${results[0].type}) nach ${(results[0].finishTimeS/3600).toFixed(2)} Stunden.`,
      `Vollständig klassiert: ${results.length} Fahrer in ${groups.length} gewerteten Zielgruppen.`,
      `Größte Zielgruppe: ${Math.max(...groups.map(g=>g.count))} Fahrer. Erste Zielgruppe: ${groups[0].count} Fahrer.`,
      `Erfasste Attacken: ${eventSummary.attack??0}; Fluchtbildungen: ${eventSummary.breakaway??0}; eingeholte Fluchten: ${eventSummary['breakaway-caught']??0}.`,
      `Jagdaufträge: ${eventSummary.chase??0}; die Zahl ist nicht identisch mit physischer Führungsarbeit.`,
      `Physische Ergebniszeiten und vorläufige Gruppenwertung werden getrennt ausgewiesen.`,
    ];
    self.postMessage({id,ok:true,data:{
      route:settings.routeId,seed:settings.seed,teamCount:input.teams.length,
      durationMs:Math.round(performance.now()-start),
      winner:results[0].id,ranking:results,
      groups,eventSummary,keyEvents,checkpoints,report,tacticalEvidence,teamReport,
      appliedChanges:changes,settings,
    }});
  }catch(error){
    self.postMessage({id,ok:false,error:String(error?.message??error)});
  }
};
