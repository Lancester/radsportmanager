const $=id=>document.getElementById(id);
const start=$('start'),compare=$('compare'),cancel=$('cancel'),status=$('status');
const strategyNames={
  kapitaen_schuetzen:'Kapitän schützen',
  offensiv:'Offensiv',
  sprint:'Sprint',
  ausgewogen:'Ausgewogen',
};
let worker=null;
const time=s=>{
  const total=Math.floor(s);
  const h=Math.floor(total/3600),m=Math.floor((total%3600)/60);
  const sec=(s%60).toFixed(1).padStart(4,'0');
  return h? `${h}:${String(m).padStart(2,'0')}:${sec}`:
    `${m}:${sec}`;
};
const decimal=(n,d=1)=>Number(n).toLocaleString('de-DE',{
  minimumFractionDigits:d,maximumFractionDigits:d,
});
function cell(row,value,numeric=false){
  const td=document.createElement('td');
  td.textContent=String(value);
  if(numeric)td.className='numeric';
  row.append(td);
}
function clear(){
  for(const id of ['classification','eventList','groupList','comparisonText'])
    $(id).replaceChildren();
  for(const id of ['raceResults','raceEvents','raceGroups','compareResults'])
    $(id).hidden=true;
}
function setBusy(busy){
  start.disabled=busy;compare.disabled=busy;cancel.disabled=!busy;
  $('profile').disabled=busy;$('strategy').disabled=busy;$('seed').disabled=busy;
}
function showRace(result,runtime){
  $('raceResults').hidden=false;
  $('raceEvents').hidden=false;
  $('raceGroups').hidden=false;
  const teams=new Map([
    ['T1','Nordwind'],['T2','Bergwerk'],['T3','Tempo'],
    ['T4','Horizont'],['T5','Stern'],
  ]);
  const champion=result.classification[0];
  $('winner').textContent=champion.name;
  $('winnerTime').textContent=time(champion.finishTimeS);
  $('finishers').textContent=`${result.diagnostics.teams} / ${result.finisherCount}`;
  $('runtime').textContent=`${decimal(runtime)} ms`;
  $('stats').textContent=`Attacken: ${result.diagnostics.attacks} · Verfolgungsstarts: ${result.diagnostics.chases} · Zielsprints: ${result.diagnostics.sprints} · ${result.diagnostics.breakaways??0} bestätigte Fluchtgruppen · ${result.diagnostics.caughtBreakaways??0} eingeholt · ${result.diagnostics.groupSplits} relevante Feldaufteilungen · Seed ${result.seed}`;
  const table=$('classification');
  for(const rider of result.classification){
    const row=document.createElement('tr');
    cell(row,rider.rank,true);
    cell(row,rider.name);
    cell(row,teams.get(rider.teamId)??rider.teamId);
    cell(row,time(rider.finishTimeS),true);
    cell(row,rider.gapS<0.05?'–':`+${decimal(rider.gapS)} s`,true);
    cell(row,decimal(rider.averageCrankPowerW,0),true);
    cell(row,`${decimal(rider.finalWPrimeJ/1000)} kJ`,true);
    if(rider.teamId==='T1')row.className='mark';
    table.append(row);
  }
  const interesting=result.events.filter(e=>
    ['attack','chase','sprint','segment','group-split','breakaway','breakaway-caught'].includes(e.type));
  const limited=interesting.slice(0,30);
  if(!limited.length){
    const li=document.createElement('li');
    li.textContent='Keine besonderen Ereignisse protokolliert.';
    $('eventList').append(li);
  }
  for(const e of limited){
    const li=document.createElement('li');
    li.textContent=`${decimal(e.km)} km · ${time(e.timeS)} · ${e.description}`;
    $('eventList').append(li);
  }
  const body=$('groupList');
  for(const snap of result.snapshots){
    const row=document.createElement('tr');
    cell(row,decimal(snap.km));
    cell(row,snap.leaderId);
    cell(row,snap.activeRiders,true);
    cell(row,snap.groupSizes.join(' / '),true);
    cell(row,decimal(snap.leadingGapM)+' m',true);
    body.append(row);
  }
}
function showComparison(data){
  const own=race=>{
    const winner=race.classification[0];
    const captain=race.classification.find(r=>r.id==='F01');
    const team=race.classification.filter(r=>r.teamId==='T1');
    return {winner,captain,best:team[0],attacks:race.events.filter(
      e=>e.type==='attack'&&e.teamId==='T1').length};
  };
  const protect=own(data.protectedRace),attack=own(data.offensiveRace);
  const lines=[
    ['Kapitän schützen',protect],
    ['Offensiv fahren',attack],
  ];
  const section=$('comparisonText');
  const intro=document.createElement('p');
  intro.textContent=`Identischer Seed ${data.protectedRace.seed}. Unser Kapitän F01 fährt je nach Strategie eine andere Zeit; die tatsächlichen Zieleinläufe folgen aus dem Physikmodell.`;
  section.append(intro);
  for(const [name,s] of lines){
    const paragraph=document.createElement('p');
    paragraph.textContent=`${name}: Kapitän Platz ${s.captain.rank}, Zeit ${time(s.captain.finishTimeS)}; bester Nordwind-Fahrer Platz ${s.best.rank}; ${s.attacks} offensiv protokollierte Attacken; Sieger ${s.winner.name}.`;
    section.append(paragraph);
  }
  const difference=attack.captain.finishTimeS-protect.captain.finishTimeS;
  const summary=document.createElement('strong');
  summary.textContent=`Zeitunterschied des Kapitäns: ${difference>=0?'+':''}${decimal(difference)} s (offensiv minus geschützt). Unterschiedliche Strategie garantiert keinen Sieg.`;
  section.append(summary);
  $('compareResults').hidden=false;
}
function begin(mode){
  if(worker||!window.Worker){
    if(!window.Worker)status.textContent='Web Worker werden in diesem Browser nicht unterstützt.';
    return;
  }
  const seed=Number($('seed').value);
  if(!Number.isSafeInteger(seed)||seed<0||seed>2147483647){
    status.textContent='Bitte einen ganzzahligen Seed zwischen 0 und 2147483647 eingeben.';
    return;
  }
  clear();
  setBusy(true);
  status.textContent=mode==='compare'?'Zwei vollständige Rennen werden nacheinander berechnet …':
    '30 Fahrer sind unterwegs. Die Simulation läuft im Hintergrund des Browser-Tabs …';
  worker=new Worker('./race/race-worker.js',{type:'module'});
  worker.onmessage=event=>{
    const msg=event.data;
    if(msg.type==='result'){
      showRace(msg.result,msg.runtimeMs);
      status.textContent='Ziel erreicht: alle 30 Fahrer klassifiziert. Du kannst eine andere Strategie versuchen.';
      stop(false);
    } else if(msg.type==='comparison'){
      showRace(msg.results.protectedRace,msg.results.runtimeMs);
      showComparison(msg.results);
      status.textContent='Beide Rennen wurden vollständig durchgerechnet und verglichen.';
      stop(false);
    }else if(msg.type==='error'){
      status.textContent='Fehler: '+msg.message;
      stop(false);
    }
  };
  worker.onerror=event=>{
    status.textContent='Der Renn-Worker konnte nicht ausgeführt werden: '+(event.message||'unbekannt');
    stop(false);
  };
  worker.postMessage({type:mode,profile:$('profile').value,
    strategy:$('strategy').value,seed});
}
function stop(aborted){
  if(worker)worker.terminate();
  worker=null;setBusy(false);
  if(aborted)status.textContent='Simulation abgebrochen. Ein neuer Versuch ist möglich.';
}
start.addEventListener('click',()=>begin('run'));
compare.addEventListener('click',()=>begin('compare'));
cancel.addEventListener('click',()=>stop(true));
