/**
 * R-20/R-21: reproduzierbare FIKTIVE Einzelrenn-Prüffelder.
 * Kein UCI-Kalender, keine Etappenwertung, kein Karrieremodus.
 * Die Fahrercharakteristik entsteht nur durch Masse, CP, W′, CdA,
 * Sprint-/Abfahrtsfähigkeiten, nicht durch Ergebnisboni.
 */
import type {RaceInput,RaceSegment,RaceRider,RaceTeam}
  from './race-simulator.ts';
export type LongRaceProfile='flach'|'huegelig'|'klassiker'|'berg';
export function createLongRaceFixture(options?:{
  profile?:LongRaceProfile;seed?:number;
  teams?:number;rosterSize?:number;
  distanceKm?:number;
}):RaceInput{
  const profile=options?.profile??'flach';
  if(!['flach','huegelig','klassiker','berg'].includes(profile))
    throw new RangeError('R-21: Rennprofil unbekannt');
  const teamCount=options?.teams??22,roster=options?.rosterSize??7;
  const distanceKm=options?.distanceKm??(
    profile==='klassiker'?240:profile==='berg'?170:200);
  if(!Number.isInteger(teamCount)||teamCount<1||teamCount>30||
    !Number.isInteger(roster)||roster<1||
    teamCount*roster<2||teamCount*roster>210||
    !Number.isFinite(distanceKm)||distanceKm<10||distanceKm>300)
    throw new RangeError('R-21: Feldgröße/Distanz ungültig');
  const gradients:Record<LongRaceProfile,number[]>={
    flach:[0,0.002,-0.002,0.001,0],
    huegelig:[0.002,0.035,-0.03,0.047,-0.039,0.012],
    klassiker:[0,0.018,-0.015,0.032,-0.027,0.018,0],
    berg:[0,0.04,-0.038,0.068,-0.053,0.055],
  };
  const g=gradients[profile];
  const len=distanceKm*1000;
  const segments:RaceSegment[]=g.map((gradeFraction,i)=>({
    name:`${profile} Abschnitt ${i+1}`,
    lengthM:i===g.length-1?
      len/g.length+(len%g.length)*(1-1/g.length):
      len/g.length,
    gradeFraction,
    descentTechnicality:gradeFraction<-.025?0.45:0.12,
    rollingCoefficient:profile==='klassiker'&&i%3===1?0.0075:0.004,
    crosswindMps:profile==='flach'&&i===1?3.5:0,
    headwindMps:profile==='flach'&&i===3?2:0,
  }));
  // Mit den obigen Segmenten ergibt sich exakt die gewünschte
  // Gesamtdistanz auch bei nicht ganzzahliger Anzahl Meter.
  const total=segments.reduce((n,s)=>n+s.lengthM,0);
  segments[segments.length-1].lengthM+=len-total;
  const strategies=['kapitaen_schuetzen','sprint','ausgewogen','offensiv'] as const;
  const teams:RaceTeam[]=Array.from({length:teamCount},(_,i)=>({
    id:`T${String(i+1).padStart(2,'0')}`,
    name:`Fiktives Team ${i+1}`,
    strategy:strategies[i%strategies.length],
  }));
  const riders:RaceRider[]=[];
  for(let t=0;t<teamCount;t++){
    for(let j=0;j<roster;j++){
      const id=t*roster+j;
      const kind=j===0?'kapitaen':j===1?'sprinter':'helfer';
      const specialty=j===0?'kletterer':j===1?'sprinter':
        j%4===0?'zeitfahrer':j%3===0?'klassiker':'allrounder';
      // Distinkte Profile mit physisch relevanter Masse, CdA, CP und W′.
      const mass=specialty==='kletterer'?62+(t%5):
        specialty==='sprinter'?78+(t%5):
        specialty==='klassiker'?73+(t%5):
        specialty==='zeitfahrer'?72+(t%4):68+(t%6);
      const cp=specialty==='kletterer'?320+t%12:
        specialty==='sprinter'?292+t%13:
        specialty==='klassiker'?305+t%15:
        specialty==='zeitfahrer'?313+t%13:
        282+(t*7+j*5)%30;
      riders.push({
        id:`F${String(id+1).padStart(3,'0')}`,
        name:`Rennfahrer ${id+1}`,
        teamId:teams[t].id,
        role:kind,specialty,
        criticalPowerW:cp,
        ftpW:cp*.96,
        wPrimeJ:specialty==='sprinter'?26000:
          specialty==='klassiker'?24000:
          specialty==='kletterer'?17000:19500,
        massKg:mass,bikeMassKg:8,
        dragAreaM2:specialty==='zeitfahrer'?0.255:
          specialty==='sprinter'?0.30:
          specialty==='kletterer'?0.268:0.275,
        descentSkill:0.5+(id%5)*0.1,
        sprintSkill:specialty==='sprinter'?0.95:
          specialty==='klassiker'?0.68:0.40,
        aggression:0.35+(id%6)*0.09,
        carbsGPerHour:60+(id%4)*10,
      });
    }
  }
  return {title:`Fiktiver R-21-${profile}-Einzelrenntest`,
    segments,teams,riders,seed:options?.seed??2026,
    maxRaceTimeS:60000,stepSeconds:1,
  };
}
