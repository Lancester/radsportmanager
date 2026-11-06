/** Checkpoint-only team chase observation. Positions and orders are never mutated.
 * Group membership follows the engine's 42 m connected-gap grouping.
 * Sampling follows the 10 s tactical tick, not individual motion steps.
 */
import {pelotonGroups} from './peloton.ts';
import type {CrewOrder,IntelligentRider} from './race-team-ai.ts';
export type RejoinOutcome='original_target_in_same_group'|'order_ended'|'captain_not_active'|'protected_rider_not_active'|'target_not_active'|'race_ended';
export interface RejoinAttempt {
  teamId:string;protectedRiderId:string;captainId?:string;targetRiderIds:string[];helperIds:string[];
  startTimeS:number;endTimeS:number;startGapM:number;endGapM:number|null;
  outcome:RejoinOutcome;
}
type OpenAttempt=Omit<RejoinAttempt,'endTimeS'|'endGapM'|'outcome'>&{startTimeS:number};
export class RejoinAttemptTelemetry {
  private open=new Map<string,OpenAttempt>();
  private completed:RejoinAttempt[]=[];
  observe(timeS:number,riders:readonly IntelligentRider[],orders:ReadonlyMap<string,CrewOrder>):void{
    const groups=pelotonGroups(riders.map(r=>({id:r.id,positionM:r.positionM})));
    const byId=new Map(riders.map(r=>[r.id,r]));
    const teamHelpers=new Map<string,string[]>();
    const protectedByTeam=new Map<string,string>();
    for(const order of orders.values())if(order.isRejoin){
      const rider=byId.get(order.riderId);if(!rider)continue;
      const protectedId=order.rejoinProtectedRiderId??
        riders.find(r=>r.teamId===rider.teamId&&r.role==='kapitaen')?.id;
      const protectedRider=protectedId?byId.get(protectedId):undefined;
      if(!protectedRider||protectedRider.teamId!==rider.teamId)continue;
      const previous=protectedByTeam.get(rider.teamId);
      if(previous&&previous!==protectedRider.id)continue;
      protectedByTeam.set(rider.teamId,protectedRider.id);
      const ids=teamHelpers.get(rider.teamId)??[];ids.push(rider.id);teamHelpers.set(rider.teamId,ids);
    }
    for(const [teamId,a] of this.open){
      const protectedRider=byId.get(a.protectedRiderId);
      const captainGroup=groups.find(g=>g.some(r=>r.id===a.protectedRiderId));
      const targets=a.targetRiderIds.map(id=>byId.get(id)).filter(r=>r!==undefined);
      const joined=!!captainGroup&&captainGroup.some(r=>a.targetRiderIds.includes(r.id));
      const helpers=protectedByTeam.get(teamId)===a.protectedRiderId?
        (teamHelpers.get(teamId)??[]):[];
      for(const id of helpers)if(!a.helperIds.includes(id))a.helperIds.push(id);
      let outcome:RejoinOutcome|null=null;
      if(!protectedRider)outcome=a.captainId?'captain_not_active':'protected_rider_not_active';
      else if(joined)outcome='original_target_in_same_group';
      else if(!targets.length)outcome='target_not_active';
      else if(!helpers.length||protectedByTeam.get(teamId)!==a.protectedRiderId)outcome='order_ended';
      if(outcome){
        const targetTail=targets.length?Math.min(...targets.map(r=>r.positionM)):null;
        const captainFront=captainGroup?.[0]?.positionM;
        const endGapM=joined?0:targetTail!==null&&captainFront!==undefined&&targetTail>=captainFront?
          targetTail-captainFront:null;
        this.completed.push({...a,endTimeS:timeS,endGapM,outcome});
        this.open.delete(teamId);
      }
    }
    for(const [teamId,helpers] of teamHelpers){
      if(this.open.has(teamId))continue;
      const protectedRider=byId.get(protectedByTeam.get(teamId)??'');
      if(!protectedRider)continue;
      const index=groups.findIndex(g=>g.some(r=>r.id===protectedRider.id));
      if(index<=0)continue;
      const group=groups[index],target=groups[index-1];
      this.open.set(teamId,{teamId,protectedRiderId:protectedRider.id,
        ...(protectedRider.role==='kapitaen'?{captainId:protectedRider.id}:{}),
        targetRiderIds:target.map(r=>r.id),helperIds:[...helpers],startTimeS:timeS,
        startGapM:Math.max(0,target.at(-1)!.positionM-group[0].positionM)});
    }
  }
  report(timeS:number):RejoinAttempt[]{
    return [...this.completed,...[...this.open.values()].map(a=>({...a,
      endTimeS:timeS,endGapM:null,outcome:'race_ended' as const}))];
  }
}
