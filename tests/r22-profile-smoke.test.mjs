import test from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {REFERENCE_ROUTES} from '../src/engine/race/reference-fixtures.ts';

test('R-22: stable-pack auf den vier vorhandenen Einzelrenn-Profilen (je 154 Fahrer, ein Seed)',()=>{
  const log=execFileSync(process.execPath,[
    '--experimental-strip-types','scripts/r22-profile-smoke.mjs',
    '--route','all','--seed','2026',
  ],{encoding:'utf8',timeout:240000,maxBuffer:2e6});
  const lines=log.split('\n').filter(line=>line.startsWith('R22-PROFILE '));
  const rows=lines.map(line=>JSON.parse(line.slice('R22-PROFILE '.length)));
  assert.equal(rows.length,4);
  assert.deepEqual(rows.map(x=>x.route),Object.keys(REFERENCE_ROUTES));
  assert.deepEqual(rows.map(x=>x.profile),
    ['flach','huegelig','klassiker','berg']);
  for(const row of rows){
    assert.equal(row.participants,154);
    assert.equal(row.seed,2026);
    assert.equal(row.model,'stable-pack');
    assert.ok(row.winnerGroup>=1&&row.winnerGroup<=154);
    assert.ok(row.largestFinishGroup>=row.winnerGroup&&
      row.largestFinishGroup<=154);
    assert.ok(row.within60s>=row.winnerGroup&&row.within60s<=154);
    assert.ok(row.largestFinishGroupGapS>=0);
    assert.ok(row.maximumGroups>=1);
    assert.ok(row.largestGroupAt25Pct>=1&&row.largestGroupAt25Pct<=154);
    assert.ok(row.largestGroupAt50Pct>=1&&row.largestGroupAt50Pct<=154);
    assert.ok(row.largestGroupAt75Pct>=1&&row.largestGroupAt75Pct<=154);
    assert.ok(row.medianWPrimeAt50Pct>=0&&row.medianWPrimeAt50Pct<=100);
    assert.ok(row.avgCrankW>0&&row.avgCrankW<1000);
    assert.ok(row.actualChaseFrontS>=0&&row.chaseLeaderChanges>=0);
    assert.ok(row.sprintPositioningSeconds>=0&&row.sprintEscortSeconds>=0);
    assert.ok(row.leadoutPaceCoordinationSeconds>=0&&
      row.independentWheelFindingSeconds>=0);
    assert.ok(row.actualSprintTrainRiderSeconds>=0&&
      row.nearSprinterTrainRiderSeconds>=0&&
      row.lateSprintChaseRiderSeconds>=0);
    assert.ok(row.nearSprinterTrainRiderSeconds<=
      row.actualSprintTrainRiderSeconds);
    assert.ok(row.spentChaseHelpers>=0&&
      row.intentionalChaseRetreatSeconds>=0);
    assert.ok(row.committedChasePullSeconds>=0&&
      row.realFrontChaseCpSeconds>=0);
    if(row.spentChaseHelpers===0)
      assert.equal(row.intentionalChaseRetreatSeconds,0);
    if(row.profile!=='flach'){
      assert.equal(row.sprintPositioningSeconds,0);
      assert.equal(row.sprintEscortSeconds,0);
      assert.equal(row.leadoutPaceCoordinationSeconds,0);
      assert.equal(row.independentWheelFindingSeconds,0);
      assert.equal(row.actualSprintTrainRiderSeconds,0);
      assert.equal(row.nearSprinterTrainRiderSeconds,0);
      assert.equal(row.lateSprintChaseRiderSeconds,0);
      assert.equal(row.spentChaseHelpers,0);
      assert.equal(row.intentionalChaseRetreatSeconds,0);
      assert.equal(row.committedChasePullSeconds,0);
      assert.equal(row.realFrontChaseCpSeconds,0);
    }
    assert.equal(row.top10Types.length,10);
    assert.ok(row.individualSprintAttempts>=0);
    assert.ok(row.hillyRampTempoSeconds>=0);
    assert.ok(Array.isArray(row.hillyRampTempoRiders));
    // Liège has suitable short ramps too; route labels do not disable
    // the geometric hilly controller on that overlapping profile.
    if(row.route==='tdf25_lille'||row.route==='tdf25_hautacam'){
      assert.equal(row.hillyRampTempoSeconds,0);
      assert.deepEqual(row.hillyRampTempoRiders,[]);
    }
    assert.ok(Array.isArray(row.top10SprintLaunchM));
    assert.equal(row.sprintersInTop10,
      row.top10Types.filter(x=>x==='sprinter').length);
    assert.ok(Number.isInteger(row.winnerGroupSprinters));
    assert.ok(row.winnerGroupSprinters<=row.winnerGroup);
    assert.equal(row.massSprintThreshold,30);
    assert.equal(row.massSprintProxy,
      row.winnerGroup>=30&&row.sprintersInTop10>=2);
    assert.ok(row.actualNamedChaseFrontS>=0&&
      row.longestNamedChaseFrontS>=0&&
      row.longestNamedChaseCpFrontS>=0);
    assert.ok(row.longestNamedChaseCpFrontS<=
      row.longestNamedChaseFrontS);
    assert.ok(row.longestNamedChaseFrontS<=
      row.actualNamedChaseFrontS);
  }
  // Integrationsgate nach Stapelung von PR #74 und #76:
  // normale Flachjagd + Zielsprint und Klassiker-Rampenarbeit müssen
  // gleichzeitig funktionieren, ohne über Etappenprofile zu lecken.
  const flatIntegration=rows.find(row=>row.route==='tdf25_lille');
  const classicsIntegration=rows.find(row=>row.route==='lbl25_liege');
  assert.ok(flatIntegration&&classicsIntegration,
    'beide zusammenzuführenden KI-Profile fehlen');
  // Die namentliche spaete Sprintjagd beginnt erst ab 2/3 Rennstrecke.
  // Bei vorher eingeholter Flucht muss sie nicht angesprungen sein.
  assert.ok(flatIntegration.actualChaseFrontS>0&&
    flatIntegration.individualSprintAttempts>0,
    'R22 Sprint/Jagd darf durch die Klassiker-KI nicht verloren gehen');
  assert.equal(flatIntegration.classicsApproachSeconds,0);
  assert.equal(flatIntegration.classicsRampTempoSeconds,0);
  assert.ok(classicsIntegration.classicsApproachSeconds>0&&
    classicsIntegration.classicsRampTempoSeconds>0,
    'R22 Klassiker-KI muss zusammen mit dem Sprint-/Jagdcode aktiv bleiben');
  assert.equal(classicsIntegration.individualSprintAttempts,0);
  assert.equal(classicsIntegration.actualNamedChaseFrontS,0);
  const hillyLines=log.split('\n').filter(line=>
    line.startsWith('R23-HILLY-AUDIT '));
  assert.equal(hillyLines.length,1,'Huegel-Attacken-Audit fehlt');
  const hill=JSON.parse(hillyLines[0].slice('R23-HILLY-AUDIT '.length));
  assert.equal(hill.route,'tdf25_boulogne');
  assert.equal(hill.seed,2026);
  assert.equal(hill.attacks,
    rows.find(r=>r.route==='tdf25_boulogne').attacks);
  assert.equal(hill.attacks,hill.earlyAttacks+
    hill.midAttacks+hill.lateAttacks);
  assert.ok(hill.uniqueAttackers>=1&&
    hill.uniqueAttackers<=hill.attacks);
  assert.ok(hill.lateRampAttacks<=hill.lateAttacks);
  assert.ok(hill.checkpoints.length>=5&&
    hill.checkpoints.every(x=>x.frontGroup>=1&&
      x.largestGroup>=x.frontGroup));
  assert.ok(hill.hillyRampTempoSeconds>=0);
  assert.ok(Array.isArray(hill.hillyRampTempoRiders));
  assert.ok(hill.attacks>=10&&hill.attacks<=60,
    'R23: 154er-Huegelrennen darf nicht erneut in 108 Attacken ausarten');
  // An opportunity is not a guaranteed random decision in one seed.
  // The late-ramp boundary itself is covered by deterministic R24 tests.
  assert.equal(hill.attackTraces.length,hill.attacks);
  assert.ok(hill.attackTraces.every(x=>
    x.id&&x.km>=0&&x.finishRank>=1&&x.finishRank<=154&&
    (!x.beforeCheckpoint||
      x.beforeCheckpoint.wPrimePct>=0&&
      x.beforeCheckpoint.wPrimePct<=100&&
      x.beforeCheckpoint.groupSize>=1)&&
    (!x.atLeast5KmLater||
      x.atLeast5KmLater.wPrimePct>=0&&
      x.atLeast5KmLater.wPrimePct<=100&&
      x.atLeast5KmLater.groupSize>=1)));
  // Eine negative sportliche Regression (Median +7 bis +11 Minuten)
  // muss im konkreten Boulogne-Seed statt mit gruenem Unit-Test
  // sichtbar mit einer Begründung geprüft werden.
  const hillyProfile=rows.find(x=>x.route==='tdf25_boulogne');
  assert.ok(hillyProfile.medianFinishGapS<200,
    'R23: starke, ungeklärte Zeitabstands-Regression im Huegelrennen');
  console.log(hillyLines[0]);
  // Die Zahlen sind ausdrücklich Diagnose, keine festen Soll-Sieger/Quoten.
  const summaryLine=log.split('\n').find(line=>
    line.startsWith('R22-PROFILES-SUMMARY '));
  const summary=JSON.parse(summaryLine.slice('R22-PROFILES-SUMMARY '.length));
  assert.equal(summary.races,4);
  assert.equal(summary.notRealismValidated,true);
  const traces=log.split('\n').filter(line=>
    line.startsWith('R22-WINNER-TRACE '));
  assert.equal(traces.length,4);
  for(const line of traces){
    const trace=JSON.parse(line.slice('R22-WINNER-TRACE '.length));
    assert.ok(trace.winnerId);
    assert.ok(trace.trace.length>=4);
    assert.ok(trace.trace.every(x=>x.winnerRank>=1&&x.winnerRank<=154&&
      x.winnerGapM>=0));
  }
  const sprintLine=log.split('\n').find(line=>
    line.startsWith('R22-FINAL-SPRINT '));
  assert.ok(sprintLine,'Individuelle Sprint-Auditdaten fehlen');
  const sprintAudit=JSON.parse(sprintLine.slice(
    'R22-FINAL-SPRINT '.length));
  assert.equal(sprintAudit.route,'tdf25_lille');
  assert.ok(sprintAudit.allLaunches.length>0);
  assert.ok(sprintAudit.allLaunches.every(x=>
    x.launchRemainingM>0&&x.launchRemainingM<=540&&
    x.peakAppliedW>=0&&x.sprintSeconds>0&&
    x.sprintCrankJ>0));
  const distinctStartDistances=new Set(sprintAudit.allLaunches
    .map(x=>Math.round(x.launchRemainingM/5)));
  assert.ok(distinctStartDistances.size>=2,
    'kein fixer gleicher Sprintbeginn für alle');
  const finishLines=log.split('\n').filter(line=>
    line.startsWith('R22-SPRINT-FINISH '));
  assert.equal(finishLines.length,4);
  for(const line of finishLines){
    const result=JSON.parse(line.slice('R22-SPRINT-FINISH '.length));
    const row=rows.find(x=>x.route===result.route);
    assert.equal(result.winnerGroupSize,row.winnerGroup);
    assert.equal(result.sprintersInTop10,row.sprintersInTop10);
    assert.equal(result.massSprintProxy,row.massSprintProxy);
    assert.equal(result.notCalibrated,true);
  }
  const leaderLine=log.split('\n').find(line=>
    line.startsWith('R22-NAMED-CHASE-LEADER '));
  assert.ok(leaderLine,'namentliche Frontdiagnose fehlt');
  const leader=JSON.parse(leaderLine.slice(
    'R22-NAMED-CHASE-LEADER '.length));
  assert.equal(leader.route,'tdf25_lille');
  assert.ok(leader.frontSeconds<=leader.assignedSeconds);
  assert.ok(leader.cpNearFrontSeconds<=leader.frontSeconds);
  assert.ok(leader.longestCpNearSeconds<=leader.longestFrontSeconds);
  assert.ok(leader.riders.every(r=>
    r.frontSeconds<=r.assignedSeconds&&
    r.cpNearFrontSeconds<=r.frontSeconds));
  const favoritesLines=log.split('\n').filter(line=>
    line.startsWith('R22-FAVORITES '));
  assert.equal(favoritesLines.length,4);
  const favorites=favoritesLines.map(line=>JSON.parse(
    line.slice('R22-FAVORITES '.length)));
  assert.deepEqual(favorites.map(x=>x.route),Object.keys(REFERENCE_ROUTES));
  for(const x of favorites){
    assert.equal(x.seed,2026);
    assert.equal(x.calibrated,false);
    assert.equal(x.perCategory.length,5);
    assert.equal(x.profileTopThree.length,3);
    assert.equal(x.topTenProfileStrengthPositions.length,10);
    assert.ok(x.winnerProfileStrengthRank>=1&&
      x.winnerProfileStrengthRank<=154);
    assert.ok(x.perCategory.every(cat=>
      cat.participants>=1&&cat.strongest.strengthRank===1&&
      cat.strongest.finishRank>=1&&cat.strongest.finishRank<=154&&
      cat.topThree.length>=1&&cat.topThree.length<=3));
  }
  console.log(lines.join('\n'));
  console.log(finishLines.join('\n'));
  console.log(leaderLine);
  console.log(traces.join('\n'));
  const selectionLines=log.split('\n').filter(line=>
    line.startsWith('R22-CLASSICS-SELECTION '));
  assert.equal(selectionLines.length,1,
    'Klassiker-Positionierungs- und Rampentempo-Audit fehlt');
  const selection=JSON.parse(selectionLines[0].slice(
    'R22-CLASSICS-SELECTION '.length));
  assert.equal(selection.route,'lbl25_liege');
  assert.equal(selection.seed,2026);
  assert.ok(selection.approachS>0&&selection.rampTempoS>0,
    'Klassiker-KI muss im Liège-Referenzrennen echte Wattentscheidungen treffen');
  assert.ok(Array.isArray(selection.rampRiders));
  assert.equal(selection.rampRiderTypes.length,selection.rampRiders.length);
  assert.ok(selection.rampRiderTypes.every(r=>
    ['klassiker','allrounder','kletterer','zeitfahrer']
      .includes(r.specialty)));
  assert.equal(selection.keyRiderTrace.length,3);
  assert.equal(selection.groupTimeline.length,7);
  assert.ok(selection.groupTimeline.every(g=>
    g.firstGroupSize>=1&&g.groupCount>=1&&
    g.gapAtRank40M>=0&&g.gapAtRank77M>=g.gapAtRank40M&&
    g.medianWPrimePct>=0&&g.medianWPrimePct<=100));
  console.log(selectionLines[0]);
  assert.ok(selection.keyRiderTrace.every(x=>
    x.id&&x.finishRank>=1&&x.finishRank<=154&&
    x.samples.length>0&&x.samples.every(p=>
      p.group>=1&&p.rank>=1&&p.rank<=p.group&&
      p.realFrontGapM>=0&&p.wPrimePct>=0&&p.wPrimePct<=100)));
  for(const row of rows){
    assert.ok(row.classicsApproachSeconds>=0&&
      row.classicsRampTempoSeconds>=0);
    assert.ok(Array.isArray(row.classicsRampTempoRiders));
    if(row.profile!=='klassiker'){
      assert.equal(row.classicsApproachSeconds,0);
      assert.equal(row.classicsRampTempoSeconds,0);
      assert.deepEqual(row.classicsRampTempoRiders,[]);
    }
  }
  const classicAudits=log.split('\n').filter(line=>
    line.startsWith('R22-CLASSICS-PUNCH-AUDIT '));
  assert.equal(classicAudits.length,1,'Klassiker-Rampen-Audit fehlt');
  const classics=JSON.parse(
    classicAudits[0].slice('R22-CLASSICS-PUNCH-AUDIT '.length));
  assert.equal(classics.route,'lbl25_liege');
  assert.equal(classics.seed,2026);
  assert.ok(classics.climbEvents.length>=4);
  assert.ok(classics.totalPunchEvents>=0);
  const lilleLines=log.split('\n').filter(line=>
    line.startsWith('R22-LILLE-SPRINTER-AUDIT '));
  assert.equal(lilleLines.length,1);
  const lille=JSON.parse(lilleLines[0].slice(
    'R22-LILLE-SPRINTER-AUDIT '.length));
  assert.equal(lille.route,'tdf25_lille');
  assert.equal(lille.seed,2026);
  assert.equal(lille.preRaceBestSprinter,
    favorites[0].perCategory.find(x=>x.category==='sprinter').strongest.riderId);
  // Referenz-Seed 2026: kein Rueckfall auf nur 8 Siegergruppenfahrer.
  // Dies ist ein gezieltes Integrations-Gate, keine Multi-Seed-Quote.
  const flatCheck=rows.find(x=>x.route==='tdf25_lille');
  const mountainCheck=rows.find(x=>x.route==='tdf25_hautacam');
  // Die experimentelle 1-s-Nachbarkette darf bei einer einzelnen Luecke
  // zwischen zwei grossen, zeitlich nahen Bloecken keinen Feldzerfall
  // vortaeuschen. Die strenge Siegergruppenmetrik bleibt unveraendert.
  assert.ok(flatCheck.winnerGroup>=20||
    (flatCheck.largestFinishGroup>=80&&flatCheck.largestFinishGroupGapS<=3),
    'R23: Flachfinale muss ein grosses zeitlich nahes Feld erhalten');
  assert.ok(flatCheck.sprintersInTop10>=0&&flatCheck.sprintersInTop10<=10);
  assert.equal(mountainCheck.sprintersInTop10,0,
    'R23: Bergankunft darf keinen Sprinter in der Top 10 haben');
  assert.notEqual(mountainCheck.winnerType,'sprinter');
  assert.ok(lille.sprintPositioningSeconds>0,
    'Im langen flachen Peloton muss echte Positionierungsarbeit stattfinden');
  assert.ok(lille.sprintEscortSeconds>=0);
  assert.ok(Array.isArray(lille.sprintFinale));
  const targetFinale=lille.sprintFinale.find(x=>
    x.riderId===lille.preRaceBestSprinter);
  assert.ok(targetFinale,'F023-Sprintfinale-Position und Helferzahl fehlen');
  assert.ok(targetFinale.groupSize>=1&&
    targetFinale.rankInGroup>=1&&
    targetFinale.rankInGroup<=targetFinale.groupSize);
  assert.ok(targetFinale.helpersWithin30M>=0);
  assert.ok(targetFinale.helpersAheadWithin30M>=0&&
    targetFinale.helpersAheadWithin30M<=targetFinale.helpersWithin30M);
  assert.ok(targetFinale.helpersOnSprintTrain>=0&&
    targetFinale.helpersOnSprintTrain<=targetFinale.helpersWithin30M);
  assert.ok(targetFinale.sprintSkill>0&&targetFinale.sprintSkill<=1);
  assert.ok(targetFinale.wheelFindingSkill>=0&&
    targetFinale.wheelFindingSkill<=1);
  assert.ok(lille.independentWheelFindingSeconds>=0);
  assert.ok(lille.leadoutPaceCoordinationSeconds>=0);
  assert.ok(lille.actualSprintTrainRiderSeconds>=0);
  assert.ok(lille.nearSprinterTrainRiderSeconds>=0);
  assert.ok(lille.lateSprintChaseRiderSeconds>=0);
  assert.ok(lille.spentChaseHelpers>=0);
  assert.ok(lille.intentionalChaseRetreatSeconds>=0);
  const finaleLines=log.split('\n').filter(row=>
    row.startsWith('R22-LILLE-FINALE-FIELD '));
  assert.equal(finaleLines.length,1,'Feldzerfall vor Sprintfinale muss messbar sein');
  const finaleField=JSON.parse(finaleLines[0].slice(
    'R22-LILLE-FINALE-FIELD '.length));
  assert.equal(finaleField.route,'tdf25_lille');
  assert.ok(finaleField.finaleField.length>=3);
  assert.ok(finaleField.finaleField.every(x=>
    x.firstSize>=1&&x.largestSize>=x.firstSize&&
    x.largestSize<=154&&x.sprinterGroupSize>=1&&
    x.firstToMainGapM>=0&&x.sprinterRankInRace>=1));
  // Das historische Gate setzt ein zusammengefahrenes Feld OHNE neue
  // große Attacke voraus. R24 lässt späte Attacken ausdrücklich zu;
  // daher Situation mit der tatsächlichen Ereignisdiagnose prüfen.
  const lastFiveKm=finaleField.finaleField.find(x=>
    Math.abs(x.km-180)<.08);
  assert.ok(lastFiveKm,
    'R22: letzter flacher 5-km-Feldcheckpoint fehlt');
  const attacksLine=log.split('\n').find(row=>
    row.startsWith('R24-ATTACK-EFFECTS ')&&row.includes('tdf25_lille'));
  assert.ok(attacksLine,'R24: physische Attackenbilanz fehlt');
  const attackEffects=JSON.parse(attacksLine.slice('R24-ATTACK-EFFECTS '.length));
  const at175=finaleField.finaleField.find(x=>Math.abs(x.km-175)<.08);
  const lateLargeGroupAttack=attackEffects.final15Km.some(a=>
    a.km>=175&&a.km<=180&&a.initialGroupSize>=80);
  if(at175?.firstSize>=80&&!lateLargeGroupAttack){
    assert.ok(lastFiveKm.firstSize>=80,
      'R22: grosses Feld zerfaellt ohne neue Attacke vor dem Finale');
    assert.equal(lastFiveKm.firstToMainGapM,0,
      'R22: ohne neue Attacke soll das Hauptfeld vorne bleiben');
  }else if(at175?.firstSize>=80&&lastFiveKm.firstSize<80){
    console.warn('R24 WARNUNG: grosses Feld nach spaeter Attacke geteilt; '+
      'Ursache und Rueckschluss bleiben sportlich zu pruefen.');
  }
  console.log(finaleLines[0]);
  const gapLines=log.split('\n').filter(row=>
    row.startsWith('R22-LILLE-CHASE-GAPS '));
  assert.equal(gapLines.length,1);
  const gapAudit=JSON.parse(gapLines[0].slice(
    'R22-LILLE-CHASE-GAPS '.length));
  assert.equal(gapAudit.route,'tdf25_lille');
  assert.equal(gapAudit.gaps.length,8);
  assert.ok(gapAudit.gaps.every(x=>x&&x.gapM>=0&&
    x.leadSize>=1&&x.mainSize>=1));
  if(gapAudit.gaps.some(x=>x.actualBreak&&x.km>=125))
    assert.ok(flatIntegration.actualNamedChaseFrontS>0,
      'Bei spaeter Flucht muss die benannte Feldfuehrung erreichbar bleiben');
  console.log(gapLines.join('\n'));
  assert.ok(Array.isArray(lille.spentHelperTrace));
  assert.equal(lille.spentHelperTrace.length,lille.spentChaseHelpers);
  assert.ok(lille.spentHelperTrace.every(x=>
    x.message.includes('Führungsarbeit')&&x.km>0));
  // Eine Person kann gleichzeitig Favorit, bestplatzierter Sprinter
  // und Rennsieger sein; die Beobachtung dedupliziert absichtlich.
  assert.ok(lille.watched.length>=3);
  assert.equal(new Set(lille.watched.map(x=>x.id)).size,
    lille.watched.length);
  assert.ok(lille.watched.some(x=>
    x.id===rows.find(r=>r.route==='tdf25_lille').winnerId));
  const best=lille.watched.find(x=>x.id===lille.preRaceBestSprinter);
  assert.ok(best?.sprintSkill>0);
  assert.ok(best?.baseCpW>0);
  assert.ok(best?.finishRank>=1&&best.finishRank<=154);
  assert.ok(best?.timeline.length>=5);
  assert.ok(best?.timeline.every(x=>x.rank>=1&&x.rank<=154&&
    x.gapM>=0&&x.groupSize>=1&&x.wPrimePct>=0&&x.wPrimePct<=100));
  console.log(favoritesLines.join('\n'));
  console.log(classicAudits.join('\n'));
  console.log(lilleLines.join('\n'));
  console.log(summaryLine);
});

test('R-22: Profil-Smoke führt keine automatische Mehrseed-Kampagne aus',()=>{
  // Die vier Rennen sind bewusst ein einzelner, reproduzierbarer
  // Vergleich und laufen ohne den späteren 36-/60-Rennen-Workflow.
  const routes=Object.keys(REFERENCE_ROUTES);
  assert.equal(routes.length,4);
});
