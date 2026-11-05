/** Reproduzierbare Modell-Sensitivität; keine medizinische Kalibrierung. */
import {initialEnduranceState,advanceEndurance,endurancePowerAvailability}
  from '../src/engine/race/endurance.ts';
import {initialCpState,applyCpWprimeStep}
  from '../src/engine/physiology/critical-power.ts';
const profile={riderId:'synthetisch',criticalPowerW:400,wPrimeCapacityJ:30000,recoveryEfficiency:.22};
const cases=[['gleichmaessig-200',()=>200],['gleichmaessig-300',()=>300],
 ['gleichmaessig-360',()=>360],['intervalle-300-soll',t=>t%60<20?500:200],
 ['gleichmaessig-300-ohne-zufuhr',()=>300,0]];
for(const [name,load,carbs=90] of cases){
 let state=initialEnduranceState(),cp=initialCpState(profile),work=0;const rows=[];
 for(let t=1;t<=21600;t++){
  const step=applyCpWprimeStep(profile,cp,load(t-1),1);cp=step.state;work+=step.appliedPowerW;
  state=advanceEndurance({state,appliedPowerW:step.appliedPowerW,referenceCpW:400,dt:1,carbsGPerHour:carbs}).state;
  if(t%3600===0||t===5400||t===5401)rows.push({s:t,availability:endurancePowerAvailability(state,'smooth'),
    carbsKcal:state.carbohydrateKcal,wearHours:state.workloadHours,wPrimeJ:cp.remainingWPrimeJ,workKJ:work/1000});
 }
 console.log(JSON.stringify({kind:'endurance',name,carbs,rows}));
}
for(const recoveryPowerW of [0,100,200,300,390]){
 let state=initialCpState({...profile,initialWPrimeJ:0});let fullAt=null;
 for(let t=1;t<=1800;t++){
  state=applyCpWprimeStep(profile,state,recoveryPowerW,1).state;
  if(fullAt===null&&state.remainingWPrimeJ>=profile.wPrimeCapacityJ)fullAt=t;
 }
 console.log(JSON.stringify({kind:'recovery',recoveryPowerW,fullAtS:fullAt,wPrimeAfter1800S:state.remainingWPrimeJ}));
}
for(const [name,wish,carbs] of [['gekoppelt-300-fed',300,90],['gekoppelt-360-fed',360,90],['gekoppelt-300-fast',300,0]]){
 let end=initialEnduranceState(),cp=initialCpState(profile),work=0;const rows=[];
 const {applyEnduranceLimitedCpStep}=await import('../src/engine/race/effort-capacity.ts');
 for(let t=1;t<=21600;t++){
  const step=applyEnduranceLimitedCpStep({profile,state:cp,desiredPowerW:wish,dt:1,availability:endurancePowerAvailability(end,'smooth'),freshPeakPowerW:1200});
  cp=step.state;work+=step.appliedPowerW;
  end=advanceEndurance({state:end,appliedPowerW:step.appliedPowerW,referenceCpW:400,dt:1,carbsGPerHour:carbs}).state;
  if(t%3600===0||t===5400||t===5401)rows.push({s:t,availability:endurancePowerAvailability(end,'smooth'),
    effectiveCpW:step.effectiveCpW,appliedW:step.appliedPowerW,carbsKcal:end.carbohydrateKcal,
    wearHours:end.workloadHours,wPrimeJ:cp.remainingWPrimeJ,workKJ:work/1000});
 }
 console.log(JSON.stringify({kind:'coupled',name,rows}));
}
