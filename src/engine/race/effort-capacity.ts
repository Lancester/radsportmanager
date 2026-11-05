/**
 * R-24: angeforderte Watt und durch Langzeitbelastung verfügbare Leistung
 * unterscheiden. Der bestehende CP/W′-Kern bilanziert weiterhin jeden
 * Schritt; weder Position noch Geschwindigkeit werden direkt verändert.
 *
 * Vorläufige Modellannahme: Die R-19-Verfügbarkeit begrenzt sowohl die
 * aktuelle Dauerleistungs-Schwelle als auch die vorhandene individuelle
 * Spitzenleistung. Sie wird nicht als Wirkungsgrad auf JEDEN Wattwunsch
 * angewendet. Biologische Kalibrierung bleibt ausdrücklich offen.
 */
import {applyCpWprimeStep} from '../physiology/critical-power.ts';
import type {CpWprimeProfile,CpWprimeState,CpWprimeStep}
  from '../physiology/critical-power.ts';

export function enduranceLimitedCapacity(input:{
  profile:CpWprimeProfile;availability:number;freshPeakPowerW:number;
}):{effectiveCpW:number;maximumPowerW:number}{
  const {profile,availability,freshPeakPowerW}=input;
  if(!profile||!Number.isFinite(profile.criticalPowerW)||
    profile.criticalPowerW<=0||!Number.isFinite(availability)||
    availability<=0||availability>1||!Number.isFinite(freshPeakPowerW)||
    freshPeakPowerW<=0)
    throw new RangeError('R24: ungueltige ermuedete Leistungskapazitaet');
  return {
    effectiveCpW:profile.criticalPowerW*availability,
    maximumPowerW:Math.max(profile.criticalPowerW,freshPeakPowerW)*availability,
  };
}

export function applyEnduranceLimitedCpStep(input:{
  profile:CpWprimeProfile;state:CpWprimeState;desiredPowerW:number;
  dt:number;availability:number;freshPeakPowerW:number;
}):CpWprimeStep & {enduranceLimited:boolean;effectiveCpW:number}{
  const capacity=enduranceLimitedCapacity(input);
  if(!Number.isFinite(input.desiredPowerW)||input.desiredPowerW<0||
    input.desiredPowerW>2500)
    throw new RangeError('R24: ungueltiger Wattwunsch');
  const desired=Math.min(input.desiredPowerW,capacity.maximumPowerW);
  const result=applyCpWprimeStep({
    ...input.profile,criticalPowerW:capacity.effectiveCpW,
  },input.state,desired,input.dt);
  return {...result,enduranceLimited:desired<input.desiredPowerW-1e-9,
    effectiveCpW:capacity.effectiveCpW};
}
