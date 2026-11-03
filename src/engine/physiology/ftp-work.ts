/** R-06: Diagnose real gefahrener Kurbelwatt relativ zur separat gemessenen FTP.
 * KEINE physiologische Ermüdungswirkung, keine TSS-/Trainingszonen-Behauptung.
 * Die Zeitverteilung kann später für die Trainingssteuerung genutzt werden.
 */
export interface FtpWorkState {
  elapsedS:number;
  crankWorkJ:number;
  secondsAboveFtp:number;
  workAboveFtpJ:number;
}
export function emptyFtpWork():FtpWorkState {
  return {elapsedS:0,crankWorkJ:0,secondsAboveFtp:0,workAboveFtpJ:0};
}
export function accumulateFtpWork(
  state:FtpWorkState,actualCrankPowerW:number,ftpW:number,dt:number,
):FtpWorkState {
  if(!state)throw new RangeError('FTP-Messwert: Zustand fehlt');
  const values:Array<[string,number,boolean]> = [
    ['actualCrankPowerW',actualCrankPowerW,actualCrankPowerW>=0&&actualCrankPowerW<=2500],
    ['ftpW',ftpW,ftpW>0&&ftpW<=1500],
    ['dt',dt,dt>0&&dt<=1],
    ['elapsedS',state.elapsedS,state.elapsedS>=0],
    ['crankWorkJ',state.crankWorkJ,state.crankWorkJ>=0],
    ['secondsAboveFtp',state.secondsAboveFtp,state.secondsAboveFtp>=0],
    ['workAboveFtpJ',state.workAboveFtpJ,state.workAboveFtpJ>=0],
  ];
  for(const [name,value,good] of values)
    if(!Number.isFinite(value)||!good)throw new RangeError('FTP-Messwert: '+name);
  return {
    elapsedS:state.elapsedS+dt,
    crankWorkJ:state.crankWorkJ+actualCrankPowerW*dt,
    secondsAboveFtp:state.secondsAboveFtp+(actualCrankPowerW>ftpW?dt:0),
    workAboveFtpJ:state.workAboveFtpJ+Math.max(0,actualCrankPowerW-ftpW)*dt,
  };
}
export function meanCrankPowerW(state:FtpWorkState):number {
  return state.elapsedS>0?state.crankWorkJ/state.elapsedS:0;
}
