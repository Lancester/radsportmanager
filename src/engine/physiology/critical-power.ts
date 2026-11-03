/**
 * R-05: Minimalmodell Critical Power (CP) und W′ (Arbeit oberhalb CP).
 * FTP ist EIN SEPARATER Profilwert und wird NICHT stillschweigend als CP benutzt.
 *
 * W′-Erholung hier BEWUSST nur konservative, lineare Testheuristik:
 * kein experimentell kalibriertes W′bal-/Skiba-Modell, keine Langzeiter-müdung.
 */
export interface CpWprimeProfile {
  riderId: string;
  criticalPowerW: number;
  wPrimeCapacityJ: number;
  initialWPrimeJ?: number;
  /** Optional separat gemessene FTP – Trainingsmetrik, NICHT CP. */
  ftpW?: number;
  recoveryEfficiency?: number;
}
export interface CpWprimeState {
  remainingWPrimeJ: number;
  spentAboveCpJ: number;
  recoveredJ: number;
  powerLimitedSeconds: number;
}
export interface CpWprimeStep {
  appliedPowerW: number;
  state: CpWprimeState;
  limited: boolean;
  usedJ: number;
  recoveredJ: number;
}
function check(name:string,v:number,ok:boolean):void {
  if(!Number.isFinite(v)||!ok)throw new RangeError('CP/Wprime: '+name);
}
export function validateCpProfile(p:CpWprimeProfile):void {
  if(!p||typeof p.riderId!=='string'||!p.riderId.trim())
    throw new RangeError('CP/Wprime: ungültige Fahrer-ID');
  check('criticalPowerW',p.criticalPowerW,p.criticalPowerW>0&&p.criticalPowerW<=1500);
  check('wPrimeCapacityJ',p.wPrimeCapacityJ,p.wPrimeCapacityJ>0&&p.wPrimeCapacityJ<=150000);
  check('initialWPrimeJ',p.initialWPrimeJ??p.wPrimeCapacityJ,
    (p.initialWPrimeJ??p.wPrimeCapacityJ)>=0&&
    (p.initialWPrimeJ??p.wPrimeCapacityJ)<=p.wPrimeCapacityJ);
  if(p.ftpW!==undefined)check('ftpW',p.ftpW,p.ftpW>0&&p.ftpW<=1500);
  check('recoveryEfficiency',p.recoveryEfficiency??0.5,
    (p.recoveryEfficiency??0.5)>=0&&(p.recoveryEfficiency??0.5)<=1);
}
export function initialCpState(profile:CpWprimeProfile):CpWprimeState {
  validateCpProfile(profile);
  return {remainingWPrimeJ:profile.initialWPrimeJ??profile.wPrimeCapacityJ,
    spentAboveCpJ:0,recoveredJ:0,powerLimitedSeconds:0};
}
/** Liefert tatsächlich erlaubte Pedalleistung; begrenzt Arbeit bis exakt W′=0.
 * Für dt mit Obergrenze oberhalb CP gilt: (P-CP)*dt <= W′_rest.
 */
export function applyCpWprimeStep(
  profile:CpWprimeProfile,state:CpWprimeState,desiredPowerW:number,dt:number,
):CpWprimeStep {
  validateCpProfile(profile);
  check('desiredPowerW',desiredPowerW,desiredPowerW>=0&&desiredPowerW<=2500);
  check('dt',dt,dt>0&&dt<=1);
  if(!state)throw new RangeError('CP/Wprime: Zustand fehlt');
  check('remainingWPrimeJ',state.remainingWPrimeJ,
    state.remainingWPrimeJ>=0&&state.remainingWPrimeJ<=profile.wPrimeCapacityJ);
  for(const key of ['spentAboveCpJ','recoveredJ','powerLimitedSeconds'] as const)
    check(key,state[key],state[key]>=0);
  const cp=profile.criticalPowerW;
  const allowed=Math.min(desiredPowerW,cp+state.remainingWPrimeJ/dt);
  const usedJ=Math.max(0,allowed-cp)*dt;
  const recoveryInput=Math.max(0,cp-allowed)*dt*(profile.recoveryEfficiency??0.5);
  const remainingAfterUse=Math.max(0,state.remainingWPrimeJ-usedJ);
  const recoveredJ=Math.min(recoveryInput,profile.wPrimeCapacityJ-remainingAfterUse);
  const limited=allowed<desiredPowerW-1e-9;
  return {appliedPowerW:allowed,limited,usedJ,recoveredJ,
    state:{
      remainingWPrimeJ:Math.min(profile.wPrimeCapacityJ,remainingAfterUse+recoveredJ),
      spentAboveCpJ:state.spentAboveCpJ+usedJ,
      recoveredJ:state.recoveredJ+recoveredJ,
      powerLimitedSeconds:state.powerLimitedSeconds+(limited?dt:0),
    },
  };
}
/** Für den ersten Rennprototyp sind dies ausdrücklich FREI ERFUNDENE Beispielwerte. */
export const R05_F8_PROFILE:Readonly<CpWprimeProfile>=Object.freeze({
  riderId:'F8',criticalPowerW:220,ftpW:210,wPrimeCapacityJ:1200,
  recoveryEfficiency:0.35,
});
