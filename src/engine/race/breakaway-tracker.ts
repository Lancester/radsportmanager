/**
 * R-24: eine gemessene Flucht anhand ihrer realen Fahrer verfolgen.
 * Ein Zurueckgefallener hinter dem Feld darf eine eingeholte Flucht nicht
 * endlos aktiv halten. Keine Aenderung an Bewegung oder Gruppengroessen.
 */
export interface TrackedBreakaway {
  candidateSinceS:number|null;catchSinceS:number|null;
  escapeIds:readonly string[];mainIds:readonly string[];
}
export const initialTrackedBreakaway=():TrackedBreakaway=>({
  candidateSinceS:null,catchSinceS:null,escapeIds:[],mainIds:[],
});
export function advanceBreakawayTracker<T extends {positionM:number}>(input:{
  state:TrackedBreakaway;groups:readonly (readonly T[])[];
  riderId:(r:T)=>string;timeS:number;
}):{state:TrackedBreakaway;event:'breakaway'|'caught'|null;gapM:number}{
  const {state,groups,riderId,timeS}=input;
  if(!groups.length||!Number.isFinite(timeS)||timeS<0)
    throw new RangeError('R24: ungueltige Fluchtbeobachtung');
  const reset=initialTrackedBreakaway;
  if(!state.escapeIds.length){
    const main=groups.reduce((a,b)=>b.length>a.length?b:a,groups[0]);
    const lead=groups[0];
    const gap=lead!==main&&lead.length&&main.length?
      lead[lead.length-1].positionM-main[0].positionM:0;
    const escaped=lead!==main&&main.length>=4&&gap>=75&&
      lead[0].positionM>1000;
    if(!escaped)return {state:reset(),event:null,gapM:0};
    const since=state.candidateSinceS??timeS;
    if(timeS-since<40)
      return {state:{...state,candidateSinceS:since},event:null,gapM:gap};
    return {state:{candidateSinceS:since,catchSinceS:null,
      escapeIds:lead.map(riderId),mainIds:main.map(riderId)},
      event:'breakaway',gapM:gap};
  }
  const escapedIds=new Set(state.escapeIds),mainIds=new Set(state.mainIds);
  const remaining=groups.flat().filter(r=>escapedIds.has(riderId(r)));
  // Zielankunft oder Aufgabe ist keine Einholung.
  if(!remaining.length)return {state:reset(),event:null,gapM:0};
  const main=groups.reduce((best,g)=>
    g.filter(r=>mainIds.has(riderId(r))).length>
    best.filter(r=>mainIds.has(riderId(r))).length?g:best,groups[0]);
  const mainMembers=main.filter(r=>mainIds.has(riderId(r)));
  const joined=main.filter(r=>escapedIds.has(riderId(r)));
  // Eine Abstandsgruppe kann selbst hunderte Meter lang sein. Ein
  // Ausreisser bleibt daher auch dann voraus, wenn eine 42-m-Kette ihn
  // formal schon derselben Gruppe wie das alte Hauptfeld zuordnet.
  const formerMainFront=mainMembers.length?
    Math.max(...mainMembers.map(r=>r.positionM)):null;
  const escapedStillAhead=formerMainFront!==null&&remaining.some(r=>
    r.positionM>formerMainFront+35);
  let gap=Infinity;
  for(const a of joined)for(const b of mainMembers)
    gap=Math.min(gap,Math.abs(a.positionM-b.positionM));
  const caught=mainMembers.length>0&&joined.length>0&&
    !escapedStillAhead&&gap<=35;
  if(!caught)
    return {state:{...state,catchSinceS:null},event:null,gapM:0};
  const since=state.catchSinceS??timeS;
  if(timeS-since<40)
    return {state:{...state,catchSinceS:since},event:null,gapM:gap};
  return {state:reset(),event:'caught',gapM:gap};
}
