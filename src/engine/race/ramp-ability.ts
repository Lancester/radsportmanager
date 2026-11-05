/** Bewertet eine nominelle dreiminütige Rampenleistung aus verfügbarer CP
 * und W′. Das ist eine taktische Ranghilfe, keine zusätzliche Fahrleistung.
 * Physik und CP/W′-Bilanz begrenzen die später tatsächlich gefahrenen Watt. */
export function rampAbilityWPerKg(o:{effectiveCpW:number;remainingWPrimeJ:number;
  peakPowerW:number;riderMassKg:number;bikeMassKg:number}):number{
  if(!Number.isFinite(o.effectiveCpW)||o.effectiveCpW<=0||
    !Number.isFinite(o.remainingWPrimeJ)||o.remainingWPrimeJ<0||
    !Number.isFinite(o.peakPowerW)||o.peakPowerW<o.effectiveCpW||
    !Number.isFinite(o.riderMassKg)||o.riderMassKg<=0||
    !Number.isFinite(o.bikeMassKg)||o.bikeMassKg<=0)
    throw new RangeError('R24: ungültige Rampenfähigkeit');
  return Math.min(o.peakPowerW,o.effectiveCpW+o.remainingWPrimeJ/180)/
    (o.riderMassKg+o.bikeMassKg);
}
