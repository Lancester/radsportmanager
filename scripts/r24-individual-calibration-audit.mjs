/** Vorläufige Sensitivität, keine Nachbildung eines Studienprotokolls. */
import {initialEnduranceState,advanceEndurance,endurancePowerAvailability} from '../src/engine/race/endurance.ts';
import {initialCpState,applyCpWprimeStep} from '../src/engine/physiology/critical-power.ts';
import {applyEnduranceLimitedCpStep} from '../src/engine/race/effort-capacity.ts';
const profile={riderId:'synthetisch',criticalPowerW:400,wPrimeCapacityJ:30000,recoveryEfficiency:.22};
for(const factor of [.85,1,1.15]){
 let end=initialEnduranceState(),cp=initialCpState(profile),work=0;const snapshots=[];
 for(let s=1;s<=21600;s++){
  const available=endurancePowerAvailability(end,'smooth',factor);
  const r=applyEnduranceLimitedCpStep({profile,state:cp,desiredPowerW:300,dt:1,availability:available,freshPeakPowerW:1200});
  cp=r.state;work+=r.appliedPowerW;
  end=advanceEndurance({state:end,appliedPowerW:r.appliedPowerW,referenceCpW:400,dt:1,carbsGPerHour:90,onsetMode:'smooth',durabilityFactor:factor}).state;
  if(s%7200===0)snapshots.push({s,available:endurancePowerAvailability(end,'smooth',factor),carbKcal:end.carbohydrateKcal,wPrimeJ:cp.remainingWPrimeJ,workKJ:work/1000});
 }
 console.log(JSON.stringify({kind:'durability',factor,snapshots}));
}
for(const factor of [.85,1,1.15]){
 const p={...profile,initialWPrimeJ:0,recoveryEfficiency:.22*factor};let state=initialCpState(p),fullAt=null;
 for(let s=1;s<=1800;s++){state=applyCpWprimeStep(p,state,200,1).state;if(fullAt===null&&state.remainingWPrimeJ>=30000)fullAt=s;}
 console.log(JSON.stringify({kind:'recovery',factor,fullAtS:fullAt}));
}
