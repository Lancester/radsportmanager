/** R-06: kontrollierte Querverschiebung und kontinuierliche Konfliktprüfung.
 * Testgeometrie: rechteckige Mindestabstände der Fahrerzentren (keine 3D-Fahrtechnik).
 * Spurwechsel erfolgen kontinuierlich über die Zeit, nicht teleportierend.
 */
export interface LaneCommand {
  timeS:number;
  riderId:string;
  targetLateralPositionM:number;
  maxLateralSpeedMps?:number;
}
export const R06_LANE_LIMITS = Object.freeze({
  roadHalfWidthM:3,
  defaultLateralSpeedMps:0.8,
});
const valid=(s:string,n:number,p:boolean):void=>{
  if(!Number.isFinite(n)||!p)throw new RangeError('Querverschiebung: '+s);
};
export function lateralAdvance(
  currentM:number,targetM:number,rateMps:number,dt:number,roadHalfWidthM:number,
):number {
  valid('currentM',currentM,Math.abs(currentM)<=roadHalfWidthM);
  valid('targetM',targetM,Math.abs(targetM)<=roadHalfWidthM);
  valid('rateMps',rateMps,rateMps>0&&rateMps<=2.5);
  valid('dt',dt,dt>0&&dt<=1);
  valid('roadHalfWidthM',roadHalfWidthM,roadHalfWidthM>=1&&roadHalfWidthM<=10);
  const delta=targetM-currentM;
  if(Math.abs(delta)<=1e-12)return targetM;
  return currentM+Math.sign(delta)*Math.min(Math.abs(delta),rateMps*dt);
}
function crossingTimes(v0:number,v1:number,limit:number):[number,number]|null {
  if(Math.abs(v1-v0)<1e-12)
    return Math.abs(v0)<limit ? [0,1] : null;
  const a=(-limit-v0)/(v1-v0),b=(limit-v0)/(v1-v0);
  const left=Math.max(0,Math.min(a,b)),right=Math.min(1,Math.max(a,b));
  return left<=right+1e-12 ? [left,right] : null;
}
/** Swept AABB zwischen den Zeitpunkten t und t+dt:
 * zwei Fahrer kollidieren, falls die Intervalle beider nötigen
 * Mindestabstände (longitudinal + lateral) sich gleichzeitig überlappen.
 */
export function sweptRectCollision(
  xBefore:readonly number[],xAfter:readonly number[],
  yBefore:readonly number[],yAfter:readonly number[],
  minLongM:number,minLateralM:number,
):boolean {
  if(![xBefore,xAfter,yBefore,yAfter].every(a=>Array.isArray(a)&&a.length===xBefore.length))
    throw new RangeError('Positionslisten haben verschiedene Länge');
  valid('minLongM',minLongM,minLongM>0);
  valid('minLateralM',minLateralM,minLateralM>0);
  for(let i=0;i<xBefore.length;i++){
    for(const v of [xBefore[i],xAfter[i],yBefore[i],yAfter[i]])
      valid('position',v,true);
    for(let j=0;j<i;j++){
      const dx0=xBefore[i]-xBefore[j],dx1=xAfter[i]-xAfter[j];
      const dy0=yBefore[i]-yBefore[j],dy1=yAfter[i]-yAfter[j];
      const xWindow=crossingTimes(dx0,dx1,minLongM-1e-9);
      const yWindow=crossingTimes(dy0,dy1,minLateralM-1e-9);
      if(xWindow&&yWindow&&
         Math.max(xWindow[0],yWindow[0])<=Math.min(xWindow[1],yWindow[1])+1e-12)
        return true;
    }
  }
  return false;
}
/** Durchfährt ein Fahrer die x-Position eines anderen, obwohl beide
 * seitlich ausreichend getrennt sind, zählt das als physisches Überholen.
 */
export function detectPasses(
  ids:readonly string[],xBefore:readonly number[],xAfter:readonly number[],
  yBefore:readonly number[],yAfter:readonly number[],minLateralM:number,
):Array<{riderId:string;passedRiderId:string}> {
  const passed:Array<{riderId:string;passedRiderId:string}>=[];
  for(let i=0;i<ids.length;i++)for(let j=0;j<ids.length;j++){
    if(i===j)continue;
    const initial=xBefore[i]-xBefore[j],final=xAfter[i]-xAfter[j];
    if(!(initial<0&&final>=0))continue;
    const fraction=(-initial)/(final-initial);
    const lateral=(yBefore[i]+fraction*(yAfter[i]-yBefore[i]))-
      (yBefore[j]+fraction*(yAfter[j]-yBefore[j]));
    if(Math.abs(lateral)>=minLateralM-1e-9)
      passed.push({riderId:ids[i],passedRiderId:ids[j]});
  }
  return passed;
}
