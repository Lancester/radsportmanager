/**
 * R-19: transparente, vorläufige Langdistanz-Ermüdung und Kohlenhydratbilanz.
 * Dieses Modell ändert ausschließlich ANFORDERBARE Watt; der CP/W′-Kern,
 * die mechanische Energie und die Bewegung bleiben unverändert.
 *
 * Alle Parameter sind Spiel-/Testheuristiken, KEINE physiologische
 * Profi-Kalibrierung. 50-km-Referenzläufe werden durch die erst nach
 * 90 Minuten einsetzende Belastungsdegradation nicht pauschal verzerrt.
 */
export interface EnduranceState {
  /** Verfügbare Kohlenhydratenergie, getrennt von mechanischer Energie. */
  carbohydrateKcal:number;
  carbohydrateConsumedKcal:number;
  carbohydrateIngestedKcal:number;
  /** Nur Ausdauerermüdung, nicht W′. */
  workloadHours:number;
  elapsedS:number;
}
export interface EnduranceStep {
  state:EnduranceState;
  /** Multiplikator für NÄCHSTE verlangte Watt, begrenzt zwischen 0,6 und 1. */
  powerAvailability:number;
  intakeKcal:number;
  expenditureKcal:number;
}
export const R19_ENDURANCE=Object.freeze({
  carbohydrateCapacityKcal:1200,
  mechanicalEfficiency:0.245,
  carbohydrateFractionOfExpenditure:0.55,
  defaultCarbsGPerHour:65,
  maximumCarbsGPerHour:110,
  kcalPerGramCarb:4,
  graceSeconds:5400,
  maximumPowerReduction:0.40,
  fatiguePerHardHour:0.075,
});
const valid=(label:string,n:number,ok:boolean)=>{
  if(!Number.isFinite(n)||!ok)throw new RangeError('R-19: '+label);
};
export function initialEnduranceState():EnduranceState{
  return {carbohydrateKcal:R19_ENDURANCE.carbohydrateCapacityKcal,
    carbohydrateConsumedKcal:0,carbohydrateIngestedKcal:0,
    workloadHours:0,elapsedS:0};
}
export function endurancePowerAvailability(state:EnduranceState):number{
  const c=R19_ENDURANCE;
  const depletion=1-state.carbohydrateKcal/c.carbohydrateCapacityKcal;
  const fuelPenalty=state.elapsedS<=c.graceSeconds?0:
    0.32*Math.max(0,(depletion-0.40)/0.60);
  const wearPenalty=state.elapsedS<=c.graceSeconds?0:
    Math.max(0,state.workloadHours-0.65)*c.fatiguePerHardHour;
  return Math.max(1-c.maximumPowerReduction,
    1-Math.min(c.maximumPowerReduction,fuelPenalty+wearPenalty));
}
export function advanceEndurance(input:{
  state:EnduranceState; appliedPowerW:number;
  referenceCpW:number;dt:number;carbsGPerHour?:number;
}):EnduranceStep{
  const {state,appliedPowerW,referenceCpW,dt}=input;
  if(!state)throw new RangeError('R-19: Zustand fehlt');
  valid('appliedPowerW',appliedPowerW,appliedPowerW>=0&&appliedPowerW<=2500);
  valid('referenceCpW',referenceCpW,referenceCpW>50&&referenceCpW<=1500);
  valid('dt',dt,dt>0&&dt<=1);
  const c=R19_ENDURANCE;
  const carbs=input.carbsGPerHour??c.defaultCarbsGPerHour;
  valid('carbsGPerHour',carbs,carbs>=0&&carbs<=c.maximumCarbsGPerHour);
  for(const [k,n] of Object.entries(state))
    valid(k,n,n>=0);
  if(state.carbohydrateKcal>c.carbohydrateCapacityKcal+1e-6)
    throw new RangeError('R-19: Glykogenspeicher oberhalb Kapazität');
  const intake=carbs*c.kcalPerGramCarb*dt/3600;
  const expenditure=appliedPowerW*dt/
    (4184*c.mechanicalEfficiency)*c.carbohydrateFractionOfExpenditure;
  const nextFuel=Math.max(0,Math.min(c.carbohydrateCapacityKcal,
    state.carbohydrateKcal+intake-expenditure));
  const hardWork=Math.max(0,
    appliedPowerW/referenceCpW-0.70);
  const next:EnduranceState={
    carbohydrateKcal:nextFuel,
    carbohydrateConsumedKcal:state.carbohydrateConsumedKcal+expenditure,
    carbohydrateIngestedKcal:state.carbohydrateIngestedKcal+intake,
    workloadHours:state.workloadHours+hardWork*dt/3600,
    elapsedS:state.elapsedS+dt,
  };
  return {state:next,
    powerAvailability:endurancePowerAvailability(next),
    intakeKcal:intake,expenditureKcal:expenditure};
}
