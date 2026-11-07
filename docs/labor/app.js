import {buildLabRace,initialLabSettings,ROUTES,RIDER_CONTROLS,STRATEGIES,TEAM_TACTIC_FIELDS}
  from './generated/labor/lab-settings.js';
import {createReferenceFixture} from './generated/engine/race/reference-fixtures.js';
import {DEFAULT_TEAM_PLAN} from './generated/engine/race/team-tactical-plan.js';

const $=id=>document.getElementById(id);
const fmt=(v,d=1)=>Number(v).toLocaleString('de-DE',{
  minimumFractionDigits:d,maximumFractionDigits:d});
const strategien={
  ausgewogen:'Ausgewogen',offensiv:'Offensiv',
  sprint:'Sprint',kapitaen_schuetzen:'Kapitän schützen'};
const str=(tag,content,cls='')=>{
  const el=document.createElement(tag);el.textContent=content;
  if(cls)el.className=cls;return el;
};
const opt=(value,label)=>{
  const o=document.createElement('option');o.value=value;o.textContent=label;return o;
};
const setStatus=(msg,error=false)=>{
  $('status').textContent=msg;
  $('status').className=error?'error':'';
};
let settings=initialLabSettings();
let currentRider='F001',currentTacticalTeam='T01',running=false,serial=0,lastResult=null,previousResult=null;
const worker=new Worker('./worker.js',{type:'module'});
function refreshFixtures(){
  const base=createReferenceFixture({routeId:settings.routeId,
    teamCount:settings.teamCount,seed:settings.seed,
    ...(settings.rosterKind==='route'?{}:{rosterKind:settings.rosterKind})});
  // Bei anderer Teamzahl ungültige alte Overrides bewusst entfernen.
  const activeTeams=new Set(base.input.teams.map(t=>t.id));
  const activeRiders=new Set(base.input.riders.map(r=>r.id));
  settings.teams=settings.teams.filter(t=>activeTeams.has(t.teamId));
  settings.riders=settings.riders.filter(r=>activeRiders.has(r.id));
  if(!activeTeams.has(settings.myTeamId))settings.myTeamId=base.input.teams[0].id;
  const mine=base.input.riders.filter(r=>r.teamId===settings.myTeamId);
  if(settings.captainId&&!mine.some(r=>r.id===settings.captainId))
    delete settings.captainId;
  const available=$('allRiders').checked?base.input.riders:mine;
  if(!available.some(r=>r.id===currentRider))currentRider=available[0].id;
  if(!activeTeams.has(currentTacticalTeam))currentTacticalTeam=settings.myTeamId;
  return base;
}
function renderMyTeam(f){
  $('myTeam').replaceChildren(...f.input.teams.map(t=>opt(t.id,t.name)));
  $('myTeam').value=settings.myTeamId;
  const mine=f.input.riders.filter(r=>r.teamId===settings.myTeamId);
  const defaultCap=mine.find(r=>r.role==='kapitaen');
  $('captain').replaceChildren(...mine.map(r=>
    opt(r.id,r.name+' · '+r.specialty+(r.id===defaultCap?.id?' (Standard)':''))));
  $('captain').value=settings.captainId??defaultCap?.id;
  const team=f.input.teams.find(t=>t.id===settings.myTeamId);
  $('myStrategy').replaceChildren(...STRATEGIES.map(k=>opt(k,strategien[k])));
  $('myStrategy').value=settings.teams.find(t=>t.teamId===team.id)?.strategy??team.strategy;
  $('myTeamInfo').textContent='Mein Team: '+mine.length+
    ' Fahrer · Kapitän '+mine.find(r=>r.id=== $('captain').value)?.name+
    ' · alle übrigen Teams steuert die Renn-KI.';
}
$('myTeam').addEventListener('change',()=>{
  settings.myTeamId=$('myTeam').value;currentTacticalTeam=settings.myTeamId;
  delete settings.captainId;
  updateRoute();
});
$('captain').addEventListener('change',()=>{
  settings.captainId=$('captain').value;
  const f=refreshFixtures();
  $('myTeamInfo').textContent='Gewählter Kapitän: '+
    f.input.riders.find(r=>r.id===settings.captainId)?.name+
    '. Die KI schützt ihn entsprechend seiner neuen Rennrolle.';
});
$('myStrategy').addEventListener('change',()=>{
  const f=refreshFixtures();
  const team=f.input.teams.find(t=>t.id===settings.myTeamId);
  const old=settings.teams.find(t=>t.teamId===settings.myTeamId);
  settings.teams=settings.teams.filter(t=>t.teamId!==settings.myTeamId);
  if(old?.tacticalPlan||$('myStrategy').value!==team.strategy)
    settings.teams.push({teamId:team.id,strategy:$('myStrategy').value,
      ...(old?.tacticalPlan?{tacticalPlan:old.tacticalPlan}:{})});
  renderTeams(f);
});
$('allRiders').addEventListener('change',()=>renderRiders(refreshFixtures()));
function renderTeams(f){
  const host=$('teams');host.replaceChildren();
  for(const t of f.input.teams){
    const wrapper=str('div','', 'teamfield');
    const label=str('label',t.id+' · '+t.name);label.htmlFor='team-'+t.id;
    const select=document.createElement('select');select.id='team-'+t.id;
    const selected=settings.teams.find(x=>x.teamId===t.id)?.strategy??t.strategy;
    for(const key of STRATEGIES)select.append(opt(key,strategien[key]));
    select.value=selected;
    select.addEventListener('change',()=>{
      const existing=settings.teams.find(x=>x.teamId===t.id);
      settings.teams=settings.teams.filter(x=>x.teamId!==t.id);
      if(select.value!==t.strategy||existing?.tacticalPlan)settings.teams.push({
        teamId:t.id,strategy:select.value,
        ...(existing?.tacticalPlan?{tacticalPlan:existing.tacticalPlan}:{})});
    });
    wrapper.append(label,select);host.append(wrapper);
  }
}
function renderTacticalTeams(f){
  const teamSelect=$('tacticalTeam');teamSelect.replaceChildren();
  for(const t of f.input.teams)teamSelect.append(opt(t.id,t.id+' · '+t.name));
  teamSelect.value=currentTacticalTeam;
  renderTacticalFields(f);
}
function renderTacticalFields(f){
  const selected=f.input.teams.find(t=>t.id===currentTacticalTeam);
  if(!selected)return;
  const host=$('tacticalFields');host.replaceChildren();
  const plan=settings.teams.find(t=>t.teamId===selected.id)?.tacticalPlan??DEFAULT_TEAM_PLAN;
  for(const meta of TEAM_TACTIC_FIELDS){
    const wrapper=document.createElement('div');
    const label=str('label',meta.label);label.htmlFor='tactical-'+meta.key;
    const picker=document.createElement('select');picker.id='tactical-'+meta.key;
    for(const [value,text] of meta.values)picker.append(opt(value,text));
    picker.value=plan[meta.key];
    picker.addEventListener('change',()=>{
      const old=settings.teams.find(x=>x.teamId===selected.id);
      const nextPlan={...DEFAULT_TEAM_PLAN,...old?.tacticalPlan,
        [meta.key]:picker.value};
      settings.teams=settings.teams.filter(x=>x.teamId!==selected.id);
      settings.teams.push({teamId:selected.id,
        strategy:old?.strategy??selected.strategy,tacticalPlan:nextPlan});
      setStatus('Taktikplan für '+selected.id+' angepasst: '+meta.label);
    });
    wrapper.append(label,picker);host.append(wrapper);
  }
}
$('tacticalTeam').addEventListener('change',()=>{
  currentTacticalTeam=$('tacticalTeam').value;
  renderTacticalFields(refreshFixtures());
});
$('resetTactics').addEventListener('click',()=>{
  const selected=settings.teams.find(x=>x.teamId===currentTacticalTeam);
  if(selected){
    delete selected.tacticalPlan;
    const base=refreshFixtures().input.teams.find(x=>x.id===currentTacticalTeam);
    if(selected.strategy===base?.strategy)
      settings.teams=settings.teams.filter(x=>x.teamId!==currentTacticalTeam);
  }
  renderTacticalFields(refreshFixtures());
  setStatus('Taktikplan für '+currentTacticalTeam+' zurückgesetzt.');
});
function renderRiders(f){
  const select=$('rider');select.replaceChildren();
  const available=$('allRiders').checked?f.input.riders:
    f.input.riders.filter(r=>r.teamId===settings.myTeamId);
  for(const r of available)
    select.append(opt(r.id,r.name+' · '+r.specialty+' ('+r.id+')'));
  select.value=currentRider;
  renderRiderControls(f);
}
function renderRiderControls(f){
  const base=f.input.riders.find(r=>r.id===currentRider);
  if(!base)return;
  const host=$('riderValues');host.replaceChildren();
  const current=settings.riders.find(x=>x.id===currentRider)??{id:currentRider};
  for(const meta of RIDER_CONTROLS){
    const div=document.createElement('div');
    const label=str('label',meta.label+(meta.unit?' ('+meta.unit+')':''));
    const id='tune-'+meta.key;label.htmlFor=id;
    const inp=document.createElement('input');
    inp.type='number';inp.id=id;inp.min=String(meta.min);
    inp.max=String(meta.max);inp.step=String(meta.step);
    const baseVal={
      criticalPowerPct:100,wPrimePct:100,massOffsetKg:0,dragAreaPct:100,
      aggression:base.aggression,descentSkill:base.descentSkill,
      sprintSkill:base.sprintSkill,
      wheelFindingSkill:base.wheelFindingSkill??.5,
      carbsGPerHour:base.carbsGPerHour??80,
      durabilityFactor:base.durabilityFactor??1,
      wPrimeRecoveryFactor:base.wPrimeRecoveryFactor??1,
    }[meta.key];
    inp.value=String(current[meta.key]??baseVal);
    const hint=str('div','Originalwert: '+fmt(baseVal,meta.step<1?3:1),
      'hint');
    inp.addEventListener('change',()=>{
      const n=Number(inp.value);
      if(inp.value.trim()===''||!Number.isFinite(n)||
         n<meta.min||n>meta.max){
        setStatus('Ungültiger Fahrerwert bei '+meta.label,true);return;
      }
      const ix=settings.riders.findIndex(x=>x.id===currentRider);
      const obj=ix<0?{id:currentRider}:{...settings.riders[ix]};
      obj[meta.key]=n;
      if(ix<0)settings.riders.push(obj);else settings.riders[ix]=obj;
      setStatus('Änderung für '+currentRider+' vorgemerkt.');
    });
    div.append(label,inp,hint);host.append(div);
  }
}
function updateRoute(){
  try{
    const f=refreshFixtures();renderMyTeam(f);renderTeams(f);renderTacticalTeams(f);renderRiders(f);
  }catch(e){setStatus(String(e.message??e),true)}
}
function bindCore(){
  $('route').replaceChildren(...ROUTES.map(r=>
    opt(r.id,r.name+' · '+r.distanceKm+' km')));
  $('route').value=settings.routeId;
  for(const [id,value] of [
    ['seed',settings.seed],['teamCount',settings.teamCount],
    ['rosterKind',settings.rosterKind],
    ['headwind',settings.wind.headwindMps],
    ['crosswind',settings.wind.crosswindMps],
    ['rolling',settings.road.rollingCoefficient],
    ['descent',settings.road.descentTechnicalityOffset],
    ['group',settings.engine.groupRidingModel],
    ['aero',settings.engine.aeroModel],
    ['tactic',settings.engine.tacticModel],
    ['endurance',settings.engine.enduranceModel],
    ['step',settings.engine.stepSeconds],['timing',settings.timingRule],
  ])$(id).value=String(value);
  $('noAttacks').checked=settings.engine.disableAttacks;
  updateRoute();
}
function readForm(){
  settings.routeId=$('route').value;
  settings.seed=Number($('seed').value);
  settings.teamCount=Number($('teamCount').value);
  settings.rosterKind=$('rosterKind').value;
  settings.wind.headwindMps=Number($('headwind').value);
  settings.wind.crosswindMps=Number($('crosswind').value);
  settings.road.rollingCoefficient=Number($('rolling').value);
  settings.road.descentTechnicalityOffset=Number($('descent').value);
  settings.engine.groupRidingModel=$('group').value;
  settings.engine.aeroModel=$('aero').value;
  settings.engine.tacticModel=$('tactic').value;
  settings.engine.enduranceModel=$('endurance').value;
  settings.engine.stepSeconds=Number($('step').value);
  settings.engine.disableAttacks=$('noAttacks').checked;
  settings.timingRule=$('timing').value;
  return buildLabRace(settings);
}
for(const id of ['route','teamCount','rosterKind','seed']){
  $(id).addEventListener('change',()=>{
    const before=settings.routeId;readFieldsOnly();
    if(id==='route'&&before!==settings.routeId)
      settings.timingRule=settings.routeId==='tdf25_lille'?
        'bunch-3s':'road-1s';
    $('timing').value=settings.timingRule;
    updateRoute();
  });
}
function readFieldsOnly(){
  settings.routeId=$('route').value;
  settings.teamCount=Number($('teamCount').value);
  settings.rosterKind=$('rosterKind').value;
  settings.seed=Number($('seed').value);
}
$('rider').addEventListener('change',()=>{
  currentRider=$('rider').value;renderRiderControls(refreshFixtures());
});
$('resetRider').addEventListener('click',()=>{
  settings.riders=settings.riders.filter(x=>x.id!==currentRider);
  renderRiderControls(refreshFixtures());
  setStatus('Fahrerwerte auf den Standard zurückgesetzt.');
});
$('reset').addEventListener('click',()=>{
  if(running)return;
  settings=initialLabSettings();currentRider='F001';currentTacticalTeam='T01';bindCore();
  setStatus('Alle Eingaben zurückgesetzt.');
});
$('export').addEventListener('click',()=>{
  try{
    readForm();
    const text=JSON.stringify(settings,null,2);
    const url=URL.createObjectURL(new Blob([text],{type:'application/json'}));
    const a=document.createElement('a');a.href=url;
    a.download='rennlabor-'+settings.routeId+'-'+settings.seed+'.json';
    a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
    setStatus('Reproduzierbare JSON-Einstellungen exportiert.');
  }catch(e){setStatus(String(e.message??e),true)}
});
$('import').addEventListener('click',()=>$('file').click());
$('file').addEventListener('change',async ()=>{
  const file=$('file').files?.[0];if(!file)return;
  try{
    const candidate=JSON.parse(await file.text());
    buildLabRace(candidate);
    settings=candidate;currentRider='F001';currentTacticalTeam=settings.myTeamId??'T01';bindCore();
    setStatus('Einstellungen importiert und überprüft.');
  }catch(e){setStatus('Import nicht möglich: '+String(e.message??e),true)}
  $('file').value='';
});
$('run').addEventListener('click',()=>{
  if(running)return;
  try{
    readForm();
    // Standardeinstellung ist der Basisfall, nicht automatisch modifiziert.
    running=true;serial++;$('run').disabled=true;
    $('working').hidden=false;
    setStatus('Rennen wird lokal simuliert. Die Oberfläche bleibt bedienbar.');
    worker.postMessage({id:serial,settings:structuredClone(settings)});
  }catch(e){setStatus(String(e.message??e),true)}
});
const cell=(tr,content,numeric=false)=>{
  const td=str('td',String(content));if(numeric)td.className='num';
  tr.append(td);
};
function renderTable(host,rows,toCells){
  $(host).replaceChildren();
  const fragment=document.createDocumentFragment();
  for(const row of rows){const tr=document.createElement('tr');
    toCells(tr,row);fragment.append(tr)}
  $(host).append(fragment);
}
function renderOutput(data){
  const winner=data.ranking[0];
  $('output').hidden=false;
  const metrics=[
    ['Sieger',winner.name],['Siegerzeit',fmt(winner.finishTimeS/3600,2)+' h'],
    ['Zielgruppen',data.groups.length],
    ['Größte Zielgruppe',Math.max(...data.groups.map(x=>x.count))],
    ['Attacken',data.eventSummary.attack??0],
    ['Rechenzeit',fmt(data.durationMs/1000,1)+' s'],
  ];
  $('metrics').replaceChildren();
  for(const [label,value] of metrics){
    const div=str('div','','metric');div.append(
      str('div',label,'hint'),str('strong',String(value)));
    $('metrics').append(div);
  }
  const team=data.teamReport;
  $('teamSummary').replaceChildren(...team.summary.map(t=>str('p',t)));
  renderTable('teamRiders',team.riderResults,(tr,r)=>{
    cell(tr,r.rank);cell(tr,r.name);
    cell(tr,r.role==='kapitaen'?'Kapitän':r.role==='sprinter'?'Sprinter':'Helfer');
    cell(tr,fmt(r.creditedGapS,1)+' s',true);
    cell(tr,fmt(r.wPrimeKJ,1)+' kJ',true);
  });
  $('teamEvents').replaceChildren(...(team.events.length?team.events:
    [{description:'Keine der ausgewählten Teamaktionen im Protokoll.',
      km:0}]).map(e=>str('li','km '+fmt(e.km,1)+' · '+e.description)));
  $('report').replaceChildren(...data.report.map(t=>str('li',t)));
  renderTable('tacticalEvidence',data.tacticalEvidence??[],(tr,r)=>{
    cell(tr,r.teamId);cell(tr,r.attackEvents,true);
    cell(tr,r.chaseEvents,true);cell(tr,r.sprintTrainEvents,true);
    cell(tr,r.teamPaceEvents,true);
  });
  const gap=s=>s===0?'0:00':fmt(s,1)+' s';
  renderTable('results',data.ranking,(tr,r)=>{
    cell(tr,r.rank);cell(tr,r.name);cell(tr,r.teamId);
    cell(tr,r.type);cell(tr,gap(r.gapS),true);
    cell(tr,gap(r.creditedGapS),true);
    cell(tr,r.finishGroup+1,true);
    cell(tr,fmt(r.finalWPrimeJ/1000,1)+' kJ',true);
  });
  renderTable('checkpoints',data.checkpoints,(tr,r)=>{
    cell(tr,r.km);cell(tr,r.frontGroup,true);
    cell(tr,r.largest,true);cell(tr,r.groups,true);
    cell(tr,fmt(r.spanKm,2)+' km',true);
  });
  $('events').replaceChildren(...data.keyEvents.map(e=>
    str('li','km '+fmt(e.km,1)+' · '+e.description)));
  $('changes').replaceChildren(...(data.appliedChanges.length?
    data.appliedChanges:['Keine individuellen Parameteränderungen; RC1-Standard.'])
    .map(t=>str('li',t)));
}
function renderComparison(current,previous){
  $('comparison').hidden=false;
  const matched=current.route===previous.route&&
    current.seed===previous.seed&&current.teamCount===previous.teamCount;
  const items=[
    ['Sieger',previous.ranking[0].name,current.ranking[0].name],
    ['Siegerzeit',fmt(previous.ranking[0].finishTimeS/3600,2)+' h',
      fmt(current.ranking[0].finishTimeS/3600,2)+' h'],
    ['Attacken',previous.eventSummary.attack??0,current.eventSummary.attack??0],
    ['Kapitän meines Teams',previous.teamReport.captainName,current.teamReport.captainName],
    ['Platz Kapitän',previous.teamReport.riderResults.find(r=>r.id===previous.teamReport.captainId)?.rank,
      current.teamReport.riderResults.find(r=>r.id===current.teamReport.captainId)?.rank],
    ['Zielgruppen',previous.groups.length,current.groups.length],
    ['Größe Siegergruppe',previous.groups[0].count,current.groups[0].count],
  ];
  const host=$('comparisonBody');host.replaceChildren(
    str('p',matched?'Gleiche Strecke und Seed: vergleichbare Ausgangslage.':
      'Achtung: Strecke, Seed oder Fahrerfeld unterschiedlich – kein kontrollierter A/B-Vergleich.',
      matched?'success':'error'));
  const table=document.createElement('table');
  const top=document.createElement('tr');
  for(const h of ['Kennzahl','Vorher','Jetzt'])top.append(str('th',h));
  table.append(top);
  for(const row of items){const tr=document.createElement('tr');
    for(const v of row)cell(tr,v);table.append(tr)}
  const wrap=str('div','','tablewrap');wrap.append(table);host.append(wrap);
}
worker.onmessage=({data:response})=>{
  if(response.id!==serial)return;
  running=false;$('run').disabled=false;$('working').hidden=true;
  if(!response.ok){setStatus('Simulationsfehler: '+response.error,true);return}
  previousResult=lastResult;lastResult=response.data;
  renderOutput(lastResult);
  if(previousResult)renderComparison(lastResult,previousResult);
  setStatus('Rennen abgeschlossen – '+lastResult.durationMs+' ms, '+
    lastResult.ranking.length+' Fahrer gewertet.');
};
worker.onerror=event=>{
  running=false;$('run').disabled=false;$('working').hidden=true;
  setStatus('Worker-Fehler: Browserpaket prüfen ('+event.message+').',true);
};
bindCore();

// Rennlabor PWA: installierte App-Dateien vollständig lokal zwischenspeichern.
async function enableOffline(){
  const label=$('offlineInfo');
  if(location.hostname==='appassets.androidplatform.net'){
    label.textContent='Android-App · alle Renndaten und Module dauerhaft auf diesem Gerät';
    return;
  }
  if(!('serviceWorker' in navigator)||!window.isSecureContext){
    label.textContent='Offline-Installation benötigt einmalig HTTPS oder localhost';
    return;
  }
  try{
    await navigator.serviceWorker.register('./service-worker.js',{scope:'./'});
    await navigator.serviceWorker.ready;
    const cache=await caches.open('renn-labor-rc1-offline-v1');
    const response=await cache.match(new URL('./offline-assets.json',location.href));
    if(!response)throw Error('Offline-Manifest fehlt');
    const assets=await response.json();
    const stored=await Promise.all(assets.map(p=>cache.match(new URL(p,location.href))));
    if(stored.some(v=>!v))throw Error('Dateien noch nicht vollständig gespeichert');
    label.textContent='Offline bereit · '+assets.length+' Dateien lokal gespeichert';
  }catch(e){
    label.textContent='Offline-Installation fehlgeschlagen: '+String(e?.message??e);
  }
}
enableOffline();
