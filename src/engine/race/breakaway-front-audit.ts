/** Reine Diagnostik: tatsächlich an der Front abgerechnete Kurbelarbeit.
 * Keine Entscheidung und keine Änderung von Leistung oder Bewegung. */
export interface BreakawayFrontObservation {
  riderId:string;teamId:string;timeS:number;dt:number;
  appliedPowerW:number;aeroFactor:number;groupSize:number;frontAmbiguous?:boolean;
}
export class BreakawayFrontAudit {
  private riders=new Map<string,{riderId:string;teamId:string;frontSeconds:number;
    crankWorkJ:number;windExposedSeconds:number}>();
  private current:{riderId:string;teamId:string;startS:number;durationS:number;
    crankWorkJ:number;minGroupSize:number;maxGroupSize:number}|null=null;
  private stints:Array<NonNullable<BreakawayFrontAudit['current']>>=[];
  private ambiguousSeconds=0;
  observe(o:BreakawayFrontObservation|null):void{
    if(!o||this.current?.riderId!==o.riderId){
      if(this.current)this.stints.push(this.current);
      this.current=null;
    }
    if(!o)return;
    if(o.frontAmbiguous)this.ambiguousSeconds+=o.dt;
    if(!this.current)this.current={riderId:o.riderId,teamId:o.teamId,startS:o.timeS,
      durationS:0,crankWorkJ:0,minGroupSize:o.groupSize,maxGroupSize:o.groupSize};
    this.current.durationS+=o.dt;
    this.current.crankWorkJ+=o.appliedPowerW*o.dt;
    this.current.minGroupSize=Math.min(this.current.minGroupSize,o.groupSize);
    this.current.maxGroupSize=Math.max(this.current.maxGroupSize,o.groupSize);
    const row=this.riders.get(o.riderId)??{riderId:o.riderId,teamId:o.teamId,
      frontSeconds:0,crankWorkJ:0,windExposedSeconds:0};
    row.frontSeconds+=o.dt;row.crankWorkJ+=o.appliedPowerW*o.dt;
    if(o.aeroFactor>=.95)row.windExposedSeconds+=o.dt;
    this.riders.set(o.riderId,row);
  }
  report(){
    const stints=this.current?[...this.stints,this.current]:this.stints;
    return {ambiguousSeconds:this.ambiguousSeconds,
      riders:[...this.riders.values()].sort((a,b)=>b.frontSeconds-a.frontSeconds||
      a.riderId.localeCompare(b.riderId)),
      stints:[...stints].sort((a,b)=>b.durationS-a.durationS||a.startS-b.startS)};
  }
}
