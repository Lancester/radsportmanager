import {createRaceExample,simulateRace} from '../benchmark/generated/race/race-simulator.js';

self.onmessage=event=>{
  const msg=event.data;
  if(!msg||!['run','compare'].includes(msg.type))return;
  try{
    const profile=msg.profile;
    const seed=msg.seed;
    const homeStrategy=msg.strategy;
    const start=performance.now();
    if(msg.type==='compare'){
      // Gleiche Strecke, dieselben Fahrer, derselbe Seed:
      // einzig die Leitlinie unseres Teams ist verschieden.
      const protectedRace=simulateRace(createRaceExample({
        profile,seed,homeStrategy:'kapitaen_schuetzen',
      }));
      const offensiveRace=simulateRace(createRaceExample({
        profile,seed,homeStrategy:'offensiv',
      }));
      self.postMessage({type:'comparison',results:{
        protectedRace,offensiveRace,
        runtimeMs:Math.round((performance.now()-start)*10)/10,
      }});
      return;
    }
    const race=simulateRace(createRaceExample({profile,seed,homeStrategy}));
    self.postMessage({type:'result',result:race,
      runtimeMs:Math.round((performance.now()-start)*10)/10});
  }catch(e){
    self.postMessage({type:'error',message:e instanceof Error?e.message:String(e)});
  }
};
