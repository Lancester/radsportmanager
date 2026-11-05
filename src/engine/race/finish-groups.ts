/** R-22: Zielgruppen werden aus ZielZEITEN gebildet,
 * nicht aus maximalen 42-m-Gruppen während des Rennens.
 * 1 s zwischen aufeinanderfolgenden Fahrern ist eine EXPERIMENTELLE
 * Gruppenschwelle, keine offizielle UCI-Zeitnahmeregel.
 */
export interface FinishRider {id:string;finishTimeS:number}
export interface FinishGroup {firstId:string;count:number;startTimeS:number;endTimeS:number}
export function finishGroupMetrics(
  riders:ReadonlyArray<FinishRider>,maxAdjacentGapS=1,
):{
  groups:FinishGroup[];winnerGroupSize:number;largestGroupSize:number;
  largestGroupSharePct:number;largestGroupGapToWinnerS:number;
  within60sOfWinner:number;
  within180sOfWinner:number;
}{
  if(!riders.length||!Number.isFinite(maxAdjacentGapS)||
    maxAdjacentGapS<=0||maxAdjacentGapS>60||
    riders.some(r=>!Number.isFinite(r.finishTimeS)||r.finishTimeS<0))
    throw new RangeError('R22: Zielzeiten oder Gruppengrenze ungültig');
  const s=[...riders].sort((a,b)=>
    a.finishTimeS-b.finishTimeS||a.id.localeCompare(b.id));
  const groups:FinishGroup[]=[];
  for(const r of s){
    let last=groups.at(-1);
    const prior=groups.length&&last?last.endTimeS:null;
    if(prior===null||r.finishTimeS-prior>maxAdjacentGapS+1e-9){
      last={firstId:r.id,count:0,
        startTimeS:r.finishTimeS,endTimeS:r.finishTimeS};
      groups.push(last);
    }
    last!.count++;
    last!.endTimeS=r.finishTimeS;
  }
  const largest=Math.max(...groups.map(g=>g.count));
  const winnerTime=s[0].finishTimeS;
  return {
    groups,winnerGroupSize:groups[0].count,
    largestGroupSize:largest,
    largestGroupSharePct:+(largest/s.length*100).toFixed(1),
    // Bei mehreren gleich großen Gruppen entscheidet die früheste.
    largestGroupGapToWinnerS:+(groups.find(g=>g.count===largest)!.startTimeS-
      winnerTime).toFixed(2),
    within60sOfWinner:s.filter(r=>r.finishTimeS-winnerTime<=60).length,
    within180sOfWinner:s.filter(r=>r.finishTimeS-winnerTime<=180).length,
  };
}

/** Wertungszeiten aus simulierten Zielzeiten mit konfigurierbarer Lücke.
 * Kein vollständiges Regelwerk (z.B. Sturz- oder Rundfahrtsonderregeln). */
export function assignFinishGroupTimes<T extends FinishRider>(
  riders:readonly T[],gapThresholdS:number,
):Array<T & {groupIndex:number;groupTimeS:number;groupGapS:number}>{
  if(!riders.length||!Number.isFinite(gapThresholdS)||gapThresholdS<=0||
    riders.some(r=>!Number.isFinite(r.finishTimeS)||r.finishTimeS<0)||
    new Set(riders.map(r=>r.id)).size!==riders.length)
    throw new RangeError('Zielwertung: ungültige Eingabe');
  const sorted=[...riders].sort((a,b)=>a.finishTimeS-b.finishTimeS||a.id.localeCompare(b.id));
  let groupIndex=0,groupTimeS=sorted[0].finishTimeS,lastTimeS=groupTimeS;
  const winnerTimeS=groupTimeS;
  return sorted.map((r,i)=>{
    if(i>0&&r.finishTimeS-lastTimeS>=gapThresholdS){
      groupIndex++;groupTimeS=r.finishTimeS;
    }
    lastTimeS=r.finishTimeS;
    return {...r,groupIndex:groupIndex+1,groupTimeS,groupGapS:groupTimeS-winnerTimeS};
  });
}
