/**
 * R-08: erster kinematischer Querbeschleunigungsbegrenzer.
 * Keine vollständige Fahrradlenkung, kein Kurvenbogen und keine exakte
 * Reifenreibkreis-Simulation. Bewusste konservative Testapproximation.
 */
export interface SteeringLimits {
  maxSteeringAccelerationMps2:number;
  combinedLateralGripMps2:number;
  /** Optionaler fiktiver konstanter Kurvenradius – nur Grip-Budget. */
  curveRadiusM?:number;
}
export interface SteeringStep {
  lateralPositionM:number;
  lateralSpeedMps:number;
  completed:boolean;
  steeringAccelerationMps2:number;
  availableSteeringAccelerationMps2:number;
}
const valid=(name:string,x:number,good:boolean)=>{
  if(!Number.isFinite(x)||!good)throw new RangeError('Querfahrdynamik: '+name);
};
export function validateSteeringLimits(p:SteeringLimits):void {
  if(!p)throw new RangeError('Querfahrdynamik: keine Parameter');
  valid('maxSteeringAccelerationMps2',p.maxSteeringAccelerationMps2,
    p.maxSteeringAccelerationMps2>0&&p.maxSteeringAccelerationMps2<=5);
  valid('combinedLateralGripMps2',p.combinedLateralGripMps2,
    p.combinedLateralGripMps2>0&&p.combinedLateralGripMps2<=15);
  if(p.curveRadiusM!==undefined)
    valid('curveRadiusM',p.curveRadiusM,p.curveRadiusM>=5&&p.curveRadiusM<=2000);
}
/** Ermöglicht eine unabhängige Kurvenwarnung bei zu hoher Geschwindigkeit. */
export function safeCornerSpeedMps(p:SteeringLimits):number {
  validateSteeringLimits(p);
  return p.curveRadiusM===undefined?Infinity:
    Math.sqrt(p.combinedLateralGripMps2*p.curveRadiusM);
}
/** Rest-Querbeschleunigung nach angenommener konstanter Kurvenbelastung.
 * Demonstrative quadratische Budgetformel, nicht kalibrierte Radphysik.
 */
export function steeringAccelerationBudgetMps2(
  p:SteeringLimits,forwardSpeedMps:number,
):number {
  validateSteeringLimits(p);
  valid('forwardSpeedMps',forwardSpeedMps,forwardSpeedMps>=0&&forwardSpeedMps<100);
  if(p.curveRadiusM===undefined)return Math.min(
    p.maxSteeringAccelerationMps2,p.combinedLateralGripMps2);
  const cornerLateral=forwardSpeedMps**2/p.curveRadiusM;
  if(cornerLateral>p.combinedLateralGripMps2+1e-9)
    throw new RangeError('Kurventempo überschreitet das vereinfachte Haftungslimit');
  const available=Math.sqrt(Math.max(0,
    p.combinedLateralGripMps2**2-cornerLateral**2));
  return Math.min(p.maxSteeringAccelerationMps2,available);
}
/** Vertikale Fahrspur verschiebt sich aus eigenem v_y und begrenzter a_y.
 * Das ist absichtlich nur eine 1D-Querdynamik mit lateralem v; der
 * Longitudinal-Physikkern bleibt unabhängig und hat keine Querarbeit.
 */
export function advanceSteering(
  currentM:number,lateralSpeedMps:number,targetM:number,
  maximumRateMps:number,dt:number,halfRoadM:number,
  forwardSpeedMps:number,limits:SteeringLimits,
):SteeringStep {
  valid('currentM',currentM,Math.abs(currentM)<=halfRoadM+1e-9);
  valid('targetM',targetM,Math.abs(targetM)<=halfRoadM);
  valid('lateralSpeedMps',lateralSpeedMps,Math.abs(lateralSpeedMps)<=maximumRateMps+1e-9);
  valid('maximumRateMps',maximumRateMps,maximumRateMps>0&&maximumRateMps<=2.5);
  valid('dt',dt,dt>0&&dt<=1);
  valid('halfRoadM',halfRoadM,halfRoadM>=1&&halfRoadM<=10);
  const accel=steeringAccelerationBudgetMps2(limits,forwardSpeedMps);
  const distance=targetM-currentM;
  if(Math.abs(distance)<1e-8&&Math.abs(lateralSpeedMps)<accel*dt+1e-7)
    return {lateralPositionM:targetM,lateralSpeedMps:0,completed:true,
      steeringAccelerationMps2:-lateralSpeedMps/dt,
      availableSteeringAccelerationMps2:accel};
  const desiredSpeed=Math.sign(distance)*
    Math.min(maximumRateMps,Math.sqrt(Math.max(0,2*accel*Math.abs(distance))));
  const requestedDv=Math.max(-accel*dt,Math.min(accel*dt,desiredSpeed-lateralSpeedMps));
  const nextV=Math.max(-maximumRateMps,Math.min(maximumRateMps,lateralSpeedMps+requestedDv));
  let nextY=currentM+0.5*(lateralSpeedMps+nextV)*dt;
  // Nicht auf Gegenposition springen, falls die Restdistanz kleiner ist
  // als die numerisch integrierte Wegkomponente.
  if((targetM-currentM)*(targetM-nextY)<0 && Math.abs(nextY-targetM)>0.04)
    throw new RangeError('Zu hohe Quergeschwindigkeit zum rechtzeitigen Stoppen');
  if((targetM-currentM)*(targetM-nextY)<=0 || Math.abs(nextY-targetM)<1e-5){
    nextY=targetM;
    if(Math.abs(nextV)<=accel*dt+1e-8)
      return {lateralPositionM:targetM,lateralSpeedMps:0,completed:true,
        steeringAccelerationMps2:-lateralSpeedMps/dt,
        availableSteeringAccelerationMps2:accel};
  }
  valid('resultingLateralPositionM',nextY,Math.abs(nextY)<=halfRoadM+1e-7);
  return {lateralPositionM:nextY,lateralSpeedMps:nextV,completed:false,
    steeringAccelerationMps2:(nextV-lateralSpeedMps)/dt,
    availableSteeringAccelerationMps2:accel};
}
