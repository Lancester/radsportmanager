/** Geometrische Anstiege fuer die KI. Direkt benachbarte steigende
 * Abschnitte bilden denselben Anstieg, egal wie die Route technisch
 * segmentiert ist. Die physikalischen Einzelabschnitte bleiben unveraendert. */
export interface ClimbRun {startM:number;endM:number;lengthM:number;
  averageGrade:number}
export function contiguousClimbRuns(
  segments:readonly {lengthM:number;gradeFraction:number}[],minimumGrade:number,
):ClimbRun[]{
  if(!Array.isArray(segments)||!Number.isFinite(minimumGrade)||
    segments.some(s=>!Number.isFinite(s.lengthM)||s.lengthM<=0||
      !Number.isFinite(s.gradeFraction)))
    throw new RangeError('R24: ungueltige Anstiegsgeometrie');
  const runs:ClimbRun[]=[];
  let cursor=0,current:ClimbRun|null=null;
  for(const s of segments){
    if(s.gradeFraction>=minimumGrade){
      if(!current){
        current={startM:cursor,endM:cursor,lengthM:0,averageGrade:0};
        runs.push(current);
      }
      const climb=current.averageGrade*current.lengthM+
        s.gradeFraction*s.lengthM;
      current.lengthM+=s.lengthM;
      current.endM=cursor+s.lengthM;
      current.averageGrade=climb/current.lengthM;
    }else current=null;
    cursor+=s.lengthM;
  }
  return runs;
}
