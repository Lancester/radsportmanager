import {pathToFileURL} from 'node:url';
import {readFileSync,writeFileSync} from 'node:fs';
const base='/workspace/scratch/2d2a2956c99e';const roots={main:'r24-main',audit:'r24-audit',dev:'r24-dev'};const pairs={tdf25_lille:'sprinter',tdf25_boulogne:'klassiker',tdf25_hautacam:'kletterer'};const seeds=[42,123,2026];let report={method:'Unkalibrierter Profil-Leistungsproxy; Top 3 vor dem Rennen nach Fähigkeiten aus allen Fahrern mit Rolle kapitaen oder sprinter. Keine Siegprognose und keine Bewertung von Teamstrategie, Tagesform und Renndynamik.',versions:{}};
for(const [v,dir] of Object.entries(roots)){
 const root=base+'/'+dir+'/src/engine/race/';const {createReferenceFixture}=await import(pathToFileURL(root+'reference-fixtures.ts').href);const {categoryStrength}=await import(pathToFileURL(root+'rider-strength-audit.ts').href);
 let profile={};for(const [route,category] of Object.entries(pairs)){
  let seedsData={};for(const seed of seeds){const f=createReferenceFixture({routeId:'tdf25_lille',seed});let picks=categoryStrength(f.input.riders,category,false).filter(x=>['kapitaen','sprinter'].includes(x.role)).slice(0,3);let r=JSON.parse(readFileSync(`${base}/kurzvergleich/${v}-common-${route}-${seed}.json`));let results=new Map(r.classification.map(x=>[x.id,x.rank]));seedsData[seed]=picks.map(x=>({...x,finishRank:results.get(x.riderId)}));}profile[route]=seedsData;
 }report.versions[v]=profile;
}
writeFileSync(base+'/kurzvergleich-favoriten.json',JSON.stringify(report,null,2)+'\n');
