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
  effectiveCriticalPowerW?:number;
  /** Tatsaechliche Position und Aero dieses Zeitschritts. */
  isAtWindFront?:boolean;aeroFactor?:number;
}
interface RiderTelemetry {
  riderId:string;assignedSeconds:number;frontSeconds:number;
  cpNearFrontSeconds:number;frontCrankEnergyJ:number;
  longestFrontSeconds:number;longestCpNearSeconds:number;
  currentFrontSeconds:number;currentCpNearSeconds:number;
  notMainSeconds:number;tooFarSeconds:number;notLeadingSeconds:number;
  belowCpNearSeconds:number;
  exposedSeconds:number;longestExposedSeconds:number;
  currentExposedSeconds:number;
  exposedCpNearSeconds:number;longestExposedCpNearSeconds:number;
  currentExposedCpNearSeconds:number;
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
      former.currentExposedSeconds=0;
      former.currentExposedCpNearSeconds=0;
    }
    this.previousId=o.leaderId;
    if(!o.leaderId)return;
    let r=this.records.get(o.leaderId);
    if(!r){r={riderId:o.leaderId,assignedSeconds:0,
      frontSeconds:0,cpNearFrontSeconds:0,frontCrankEnergyJ:0,
      longestFrontSeconds:0,longestCpNearSeconds:0,
      currentFrontSeconds:0,currentCpNearSeconds:0,
      exposedSeconds:0,longestExposedSeconds:0,currentExposedSeconds:0,
      exposedCpNearSeconds:0,longestExposedCpNearSeconds:0,
      currentExposedCpNearSeconds:0,
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
    const exposed=duty&&actual&&o.isAtWindFront===true&&
      o.aeroFactor!==undefined&&Number.isFinite(o.aeroFactor)&&
      o.aeroFactor>=.95;
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
    if(exposed){
      r.exposedSeconds+=o.dt;
      r.currentExposedSeconds+=o.dt;
      r.longestExposedSeconds=Math.max(r.longestExposedSeconds,
        r.currentExposedSeconds);
    }else r.currentExposedSeconds=0;
    const effectiveCp=o.effectiveCriticalPowerW??o.criticalPowerW;
    const effectiveCpNear=duty&&actual&&Number.isFinite(effectiveCp)&&
      effectiveCp>0&&o.appliedPowerW>=.86*effectiveCp;
    if(exposed&&effectiveCpNear){
      r.exposedCpNearSeconds+=o.dt;
      r.currentExposedCpNearSeconds+=o.dt;
      r.longestExposedCpNearSeconds=Math.max(r.longestExposedCpNearSeconds,
        r.currentExposedCpNearSeconds);
    }else r.currentExposedCpNearSeconds=0;
  }
  report():{
    assignedSeconds:number;frontSeconds:number;
    cpNearFrontSeconds:number;longestFrontSeconds:number;
    longestCpNearSeconds:number;meanFrontPowerW:number;
    exposedSeconds:number;longestExposedSeconds:number;
    exposedCpNearSeconds:number;longestExposedCpNearSeconds:number;
    missed:{notMainSeconds:number;tooFarSeconds:number;
      notLeadingSeconds:number;belowCpNearSeconds:number};
    riders:Array<{riderId:string;assignedSeconds:number;
      frontSeconds:number;cpNearFrontSeconds:number;
      longestFrontSeconds:number;longestCpNearSeconds:number;
      exposedSeconds:number;longestExposedSeconds:number;
      exposedCpNearSeconds:number;longestExposedCpNearSeconds:number;
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
      exposedSeconds:sum('exposedSeconds'),
      longestExposedSeconds:Math.max(0,...riders.map(r=>
        r.longestExposedSeconds)),
      exposedCpNearSeconds:sum('exposedCpNearSeconds'),
      longestExposedCpNearSeconds:Math.max(0,...riders.map(r=>
        r.longestExposedCpNearSeconds)),
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
        exposedSeconds:r.exposedSeconds,
        longestExposedSeconds:r.longestExposedSeconds,
        exposedCpNearSeconds:r.exposedCpNearSeconds,
        longestExposedCpNearSeconds:r.longestExposedCpNearSeconds,
        meanFrontPowerW:mean(r)})),
    };
  }
}
