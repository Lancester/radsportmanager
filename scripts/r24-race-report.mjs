/** Rennbericht aus einem gespeicherten RaceResult, optional mit Favoriten.
 * Aufruf: node scripts/r24-race-report.mjs ergebnis.json [favoriten.json] [teamId]
 * Favoritenformat: [{"riderId":"F001","preRaceRank":1}, ...]. */
import {readFileSync} from 'node:fs';
import {createRaceReport,formatRaceReport} from '../src/engine/race/race-report.ts';
const [resultPath,favoritesPath,focusTeamId]=process.argv.slice(2);
if(!resultPath){
  console.error('Aufruf: node scripts/r24-race-report.mjs ergebnis.json [favoriten.json] [teamId]');
  process.exitCode=2;
}else{
  try{
    const result=JSON.parse(readFileSync(resultPath,'utf8'));
    const favorites=favoritesPath?JSON.parse(readFileSync(favoritesPath,'utf8')):undefined;
    console.log(formatRaceReport(createRaceReport({result,favorites,focusTeamId})));
  }catch(error){
    console.error(`Rennbericht konnte nicht erstellt werden: ${error.message}`);
    process.exitCode=1;
  }
}
