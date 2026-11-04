/** R-22: Ergebnisdiagnose, keine Steuerung der Renn-KI.
 * Eine große gemeinsame Siegerzeitgruppe kann auf einen Massensprint
 * hindeuten. Offizielle Zeitnahme oder echte Siegwahrscheinlichkeit ist
 * dieser 1-s-Nachbargruppen-Proxy ausdrücklich NICHT.
 */
import {finishGroupMetrics} from './finish-groups.ts';

export interface SprintFinishInput {
  id:string;finishTimeS:number;
}
export function auditSprintFinish(
  result:ReadonlyArray<SprintFinishInput>,
  riderCategory:ReadonlyMap<string,string>,
):{
  sprintersInTop10:number;top10SprinterIds:string[];
  sprintersInWinnerGroup:number;winnerGroupSize:number;
  massSprintProxy:boolean;massSprintThreshold:number;
}{
  const groups=finishGroupMetrics(result);
  const sorted=[...result].sort((a,b)=>
    a.finishTimeS-b.finishTimeS||a.id.localeCompare(b.id));
  const sprintersInTop10=sorted.slice(0,10)
    .filter(r=>riderCategory.get(r.id)==='sprinter');
  const winnerGroup=sorted.slice(0,groups.winnerGroupSize);
  const sprintersInWinnerGroup=winnerGroup.filter(r=>
    riderCategory.get(r.id)==='sprinter').length;
  // Offen gewählte Heuristik: großes gemeinsames Zielzeitfeld UND
  // mehrere Sprinterspezialisten in den Top 10. Beides muss erfüllt
  // sein; eine 70-köpfige Gruppe weit hinter einem Solosieger zählt NICHT.
  const minimumFrontGroup=30;
  return {
    sprintersInTop10:sprintersInTop10.length,
    top10SprinterIds:sprintersInTop10.map(r=>r.id),
    sprintersInWinnerGroup,
    winnerGroupSize:groups.winnerGroupSize,
    massSprintThreshold:minimumFrontGroup,
    massSprintProxy:groups.winnerGroupSize>=minimumFrontGroup&&
      sprintersInTop10.length>=2,
  };
}
