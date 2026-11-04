/** R-22: dokumentiert ausschließlich echte, bereits berechnete
 * physische Feldpositionen und NACH CP/W′/R-19 anliegende Kurbelwatt.
 * Keine Beeinflussung der Rennmechanik, kein zusätzlicher Wattwunsch.
 */
export interface ChaseLeaderObservation {
  leaderId:string|null;dt:number;
  inMainGroup:boolean;mainGroupSize:number;
  gapToActualMainFrontM:number;
  mission:string|null;duty:string|null;intent:string;
  appliedPowerW:number;criticalPowerW:number;
}
interface RiderTelemetry {
  riderId:string;assignedSeconds:number;frontSeconds:number;
  cpNearFrontSeconds:number;frontCrankEnergyJ:number;
  longestFrontSeconds:number;longestCpNearSeconds:number;
  currentFrontSeconds:number;currentCpNearSeconds:number;
  notMainSeconds:number;tooFarSeconds:number;notLeadingSeconds:number;
  belowCpNearSeconds:number;
}
export class ChaseLeaderTelemetry {
  private records=new Map<string,RiderTelemetry>();
  private previousId:string|null=null;
  observe(o:ChaseLeaderObservation):void {
    if(!Number.isFinite(o.dt)||o.dt<=0)
      throw new RangeError('R22: Führungs-Audit Zeitschritt');
    if(this.previousId&&this.previousId!==o.leaderId){
      const former=this.records.get(this.previousId)!;
      former.currentFrontSeconds=0;former.currentCpNearSeconds=0;
    }
    this.previousId=o.leaderId;
    if(!o.leaderId)return;
    let r=this.records.get(o.leaderId);
    if(!r){r={riderId:o.leaderId,assignedSeconds:0,
      frontSeconds:0,cpNearFrontSeconds:0,frontCrankEnergyJ:0,
      longestFrontSeconds:0,longestCpNearSeconds:0,
      currentFrontSeconds:0,currentCpNearSeconds:0,
      notMainSeconds:0,tooFarSeconds:0,notLeadingSeconds:0,
      belowCpNearSeconds:0};
      this.records.set(o.leaderId,r);}
    r.assignedSeconds+=o.dt;
    const main=o.inMainGroup&&o.mainGroupSize>=8;
    const near=main&&Number.isFinite(o.gapToActualMainFrontM)&&
      o.gapToActualMainFrontM>=0&&o.gapToActualMainFrontM<=18;
    const duty=near&&o.mission==='jagd'&&
      o.duty==='fuehrung'&&o.intent==='verfolgung';
    const actual=Number.isFinite(o.appliedPowerW)&&
      Number.isFinite(o.criticalPowerW)&&o.criticalPowerW>0&&
      o.appliedPowerW>=0;
    const cpNear=duty&&actual&&
      o.appliedPowerW>=.86*o.criticalPowerW;
    if(!main)r.notMainSeconds+=o.dt;
    else if(!near)r.tooFarSeconds+=o.dt;
    else if(!duty)r.notLeadingSeconds+=o.dt;
    else if(!cpNear)r.belowCpNearSeconds+=o.dt;
    if(duty&&actual){
      r.frontSeconds+=o.dt;
      r.frontCrankEnergyJ+=o.appliedPowerW*o.dt;
      r.currentFrontSeconds+=o.dt;
      r.longestFrontSeconds=Math.max(
        r.longestFrontSeconds,r.currentFrontSeconds);
    }else r.currentFrontSeconds=0;
    if(cpNear){
      r.cpNearFrontSeconds+=o.dt;
      r.currentCpNearSeconds+=o.dt;
      r.longestCpNearSeconds=Math.max(
        r.longestCpNearSeconds,r.currentCpNearSeconds);
    }else r.currentCpNearSeconds=0;
  }
  report():{
    assignedSeconds:number;frontSeconds:number;
    cpNearFrontSeconds:number;longestFrontSeconds:number;
    longestCpNearSeconds:number;meanFrontPowerW:number;
    missed:{notMainSeconds:number;tooFarSeconds:number;
      notLeadingSeconds:number;belowCpNearSeconds:number};
    riders:Array<{riderId:string;assignedSeconds:number;
      frontSeconds:number;cpNearFrontSeconds:number;
      longestFrontSeconds:number;longestCpNearSeconds:number;
      meanFrontPowerW:number}>;
  }{
    const riders=[...this.records.values()].sort((a,b)=>
      b.frontSeconds-a.frontSeconds||
      b.assignedSeconds-a.assignedSeconds||
      a.riderId.localeCompare(b.riderId));
    const sum=(key:keyof RiderTelemetry)=>riders.reduce((a,r)=>
      a+(typeof r[key]==='number'?r[key] as number:0),0);
    const mean=(r:RiderTelemetry)=>r.frontSeconds?
      Math.round(r.frontCrankEnergyJ/r.frontSeconds*100)/100:0;
    return {assignedSeconds:sum('assignedSeconds'),
      frontSeconds:sum('frontSeconds'),
      cpNearFrontSeconds:sum('cpNearFrontSeconds'),
      longestFrontSeconds:Math.max(0,...riders.map(r=>
        r.longestFrontSeconds)),
      longestCpNearSeconds:Math.max(0,...riders.map(r=>
        r.longestCpNearSeconds)),
      meanFrontPowerW:sum('frontSeconds')?
        Math.round(sum('frontCrankEnergyJ')/sum('frontSeconds')*100)/100:0,
      missed:{notMainSeconds:sum('notMainSeconds'),
        tooFarSeconds:sum('tooFarSeconds'),
        notLeadingSeconds:sum('notLeadingSeconds'),
        belowCpNearSeconds:sum('belowCpNearSeconds')},
      riders:riders.slice(0,12).map(r=>({
        riderId:r.riderId,assignedSeconds:r.assignedSeconds,
        frontSeconds:r.frontSeconds,
        cpNearFrontSeconds:r.cpNearFrontSeconds,
        longestFrontSeconds:r.longestFrontSeconds,
        longestCpNearSeconds:r.longestCpNearSeconds,
        meanFrontPowerW:mean(r)})),
    };
  }
}
