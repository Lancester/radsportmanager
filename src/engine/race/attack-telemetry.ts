/** R-24: Wirkungen einzelner AngriffsWUENSCHE beobachten. Die Diagnose
 * schreibt keine Fahrzustandswerte und beeinflusst das Rennen nicht. */
export interface AttackTrace {
  riderId:string;startTimeS:number;startPositionM:number;
  initialGroupSize:number;initialGapToRaceFrontM:number;
  initialWPrimeJ:number;initialWPrimePct:number;
  requestedCrankJ:number;appliedCrankJ:number;
  appliedAboveEffectiveCpJ:number;attackSeconds:number;peakAppliedW:number;
  afterFiveKm:{timeS:number;positionM:number;groupSize:number;
    gapToRaceFrontM:number;gapToFormerGroupFrontM:number|null;
    wPrimeJ:number;wPrimePct:number}|null;
  finishRank:number|null;finishGapS:number|null;
}
interface InternalTrace extends AttackTrace {formerGroupIds:readonly string[]}
export class AttackTelemetry {
  private byRider=new Map<string,InternalTrace[]>();
  start(o:{riderId:string;timeS:number;positionM:number;
    groupIds:readonly string[];gapToRaceFrontM:number;
    wPrimeJ:number;wPrimeCapacityJ:number}):void{
    const records=this.byRider.get(o.riderId)??[];
    records.push({riderId:o.riderId,startTimeS:o.timeS,
      startPositionM:o.positionM,formerGroupIds:[...o.groupIds],
      initialGroupSize:o.groupIds.length,initialGapToRaceFrontM:o.gapToRaceFrontM,
      initialWPrimeJ:o.wPrimeJ,initialWPrimePct:100*o.wPrimeJ/o.wPrimeCapacityJ,
      requestedCrankJ:0,appliedCrankJ:0,appliedAboveEffectiveCpJ:0,
      attackSeconds:0,peakAppliedW:0,afterFiveKm:null,
      finishRank:null,finishGapS:null});
    this.byRider.set(o.riderId,records);
  }
  observePower(o:{riderId:string;startTimeS:number;dt:number;
    requestedPowerW:number;appliedPowerW:number;effectiveCpW:number}):void{
    const records=this.byRider.get(o.riderId)??[];
    let r:InternalTrace|undefined;
    for(let i=records.length-1;i>=0;i--){
      if(records[i].startTimeS===o.startTimeS){r=records[i];break;}
    }
    if(!r)return;
    r.requestedCrankJ+=o.requestedPowerW*o.dt;
    r.appliedCrankJ+=o.appliedPowerW*o.dt;
    r.appliedAboveEffectiveCpJ+=Math.max(0,o.appliedPowerW-o.effectiveCpW)*o.dt;
    r.attackSeconds+=o.dt;
    r.peakAppliedW=Math.max(r.peakAppliedW,o.appliedPowerW);
  }
  needsSample(riderId:string,positionM:number):boolean{
    return !!this.byRider.get(riderId)?.some(r=>
      !r.afterFiveKm&&positionM>=r.startPositionM+5000);
  }
  sample(o:{riderId:string;timeS:number;positionM:number;groupSize:number;
    gapToRaceFrontM:number;wPrimeJ:number;wPrimeCapacityJ:number;
    positionOf:(id:string)=>number|null}):void{
    for(const r of this.byRider.get(o.riderId)??[]){
      if(r.afterFiveKm||o.positionM<r.startPositionM+5000)continue;
      const former=r.formerGroupIds.filter(id=>id!==o.riderId)
        .map(o.positionOf).filter((v):v is number=>v!==null);
      r.afterFiveKm={timeS:o.timeS,positionM:o.positionM,
        groupSize:o.groupSize,gapToRaceFrontM:o.gapToRaceFrontM,
        gapToFormerGroupFrontM:former.length?
          o.positionM-Math.max(...former):null,
        wPrimeJ:o.wPrimeJ,wPrimePct:100*o.wPrimeJ/o.wPrimeCapacityJ};
    }
  }
  report(classification:readonly {id:string;rank:number;gapS:number}[]):AttackTrace[]{
    const finish=new Map(classification.map(x=>[x.id,x]));
    return [...this.byRider.values()].flat().map(({formerGroupIds,...r})=>({
      ...r,finishRank:finish.get(r.riderId)?.rank??null,
      finishGapS:finish.get(r.riderId)?.gapS??null,
    })).sort((a,b)=>a.startTimeS-b.startTimeS||a.riderId.localeCompare(b.riderId));
  }
}
