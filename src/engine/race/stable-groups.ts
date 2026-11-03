/**
 * R-10: Ausreißer-/Gruppen-Ereignisse nur bei anhaltender Trennung.
 * Die momentane Gruppe bleibt weiterhin messbar; eine nur für 1–2 s
 * auftretende Distanzänderung zählt jedoch nicht als echte Fluchtgruppe.
 */
export interface StableGroupState {
  confirmedCount:number;
  candidateCount:number;
  candidateSinceS:number;
}
export interface StableGroupUpdate {
  state:StableGroupState;
  changed:boolean;
  split:boolean;
}
export function initialGroupState(initialCount=1):StableGroupState {
  if(!Number.isSafeInteger(initialCount)||initialCount<1)
    throw new RangeError('Gruppenstabilität: Anzahl');
  return {confirmedCount:initialCount,candidateCount:initialCount,
    candidateSinceS:0};
}
export function confirmStableGroups(
  state:StableGroupState,observedCount:number,timeS:number,
  minimumPersistSeconds=55,
):StableGroupUpdate {
  if(!state||!Number.isSafeInteger(observedCount)||observedCount<1||
    !Number.isFinite(timeS)||timeS<0||
    !Number.isFinite(minimumPersistSeconds)||minimumPersistSeconds<1||
    !Number.isFinite(state.candidateSinceS)||state.candidateSinceS>timeS)
    throw new RangeError('Gruppenstabilität: Eingaben');
  if(observedCount!==state.candidateCount)
    return {state:{...state,candidateCount:observedCount,
      candidateSinceS:timeS},changed:false,split:false};
  if(observedCount!==state.confirmedCount&&
     timeS-state.candidateSinceS>=minimumPersistSeconds){
    return {state:{confirmedCount:observedCount,candidateCount:observedCount,
      candidateSinceS:timeS},changed:true,split:observedCount>state.confirmedCount};
  }
  return {state,changed:false,split:false};
}
