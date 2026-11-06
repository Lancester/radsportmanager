/**
 * Ergebnis-Wertung für Straßenrennen, bewusst getrennt von der Physik.
 *
 * Die Simulation liefert pro Fahrer die interpolierte exakte Überfahrt.
 * Sportregeln schreiben für jede zusammenhängende Zielgruppe die Zeit
 * des ERSTEN Fahrers dieser Gruppe gut. Sie beeinflussen weder Zielrang
 * noch Physik, Energie, Attacken oder Zwischengruppen auf der Strecke.
 *
 * 2025-Tour: normale Etappen 1-s-Grenze, ausgewiesene Massensprint-
 * Etappen wie Lille 3-s-Grenze. Die offizielle 3-s-Protokoll-Ausnahme
 * für eindeutig abgesetzte Gruppen ist anhand reiner Zielzeitfolgen
 * NICHT verlässlich zu bestimmen; in diesem ersten Modell wird
 * bewusst nur die durchgängige Schwellwert-Proxymethode angeboten.
 */
export type FinishTimingRule='road-1s'|'bunch-3s';

export interface RawFinisher {
  id:string;rank:number;finishTimeS:number;
}
export interface TimedFinisher extends RawFinisher {
  /** Tatsächliche simulierte Differenz zur Überfahrt des Siegers. */
  rawGapS:number;
  /** Zeit nach Gruppenwertung, auf volle Sekunden abgerundet. */
  creditedTimeS:number;
  creditedGapS:number;
  finishGroup:number;
  finishGroupSize:number;
  finishGroupLeaderId:string;
}

export function scoreFinishGroups(
  finishers:readonly RawFinisher[],rule:FinishTimingRule,
):TimedFinisher[]{
  if(!['road-1s','bunch-3s'].includes(rule))
    throw new RangeError('R24: ungültige Zeitgruppenregel');
  if(!finishers.length)return [];
  const sorted=[...finishers].sort((a,b)=>
    a.finishTimeS-b.finishTimeS||a.id.localeCompare(b.id));
  const ids=new Set<string>();
  for(const [i,r] of sorted.entries()){
    if(!r.id||ids.has(r.id)||!Number.isFinite(r.finishTimeS)||
      r.finishTimeS<0||!Number.isInteger(r.rank)||r.rank!==i+1)
      throw new RangeError('R24: ungültige oder doppelte Finisher');
    ids.add(r.id);
  }
  const threshold=rule==='bunch-3s'?3:1;
  const winnerTime=sorted[0].finishTimeS;
  const winnerCredited=Math.floor(winnerTime);
  const out:TimedFinisher[]=[];
  let currentGroup=-1;
  let first=sorted[0];
  let groupStartIndex=0;
  for(let i=0;i<sorted.length;i++){
    const r=sorted[i];
    // Nur zum direkten Vorfahrer: 20 Fahrer mit jeweils 0,5 s
    // Abstand ergeben EINE Gruppe, selbst wenn sie 10 s lang ist.
    const split=i===0||r.finishTimeS-sorted[i-1].finishTimeS>=
      threshold-1e-9;
    if(split){
      if(i>0)for(let j=groupStartIndex;j<i;j++)
        out[j].finishGroupSize=i-groupStartIndex;
      currentGroup++;first=r;groupStartIndex=i;
    }
    const creditedTimeS=Math.floor(first.finishTimeS);
    out.push({...r,rawGapS:r.finishTimeS-winnerTime,
      creditedTimeS,creditedGapS:creditedTimeS-winnerCredited,
      finishGroup:currentGroup,finishGroupSize:0,
      finishGroupLeaderId:first.id});
  }
  for(let j=groupStartIndex;j<out.length;j++)
    out[j].finishGroupSize=out.length-groupStartIndex;
  return out;
}
