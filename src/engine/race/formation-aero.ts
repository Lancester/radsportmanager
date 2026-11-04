/**
 * R-13: Formationswindschatten als Rennstandard (aus R-12-Versuch).
 * Kein 2D-Fahrzeugmodell, keine seitliche Position, keine CFD-Kalibrierung.
 *
 * Die Rechenfunktion interpretiert mehrere tatsächlich vorausliegende Fahrer innerhalb von 24 m
 * als lokale Abschirmungs-Proxy. Die Zahl ist eine ausdrücklich vorläufige
 * Testannahme und NICHT die 42-m-Diagnosegrenze für Renn-Abstandsgruppen.
 * Der Kopf einer Gruppe bleibt bei Faktor 1: keine rückwärtige Aero-Kopplung.
 *
 * Im Rennen wird die Aero-Entlastung ausschließlich in advanceMotionStep()
 * auf den Luftwiderstand angewendet. Keine Positions- oder Wattgutschrift.
 */
export interface FormationRiderPosition {id:string;positionM:number}

export const R12_AERO_EXPERIMENT=Object.freeze({
  lookAheadM:24,
  maximumFrontNeighbors:10,
  firstNeighborReduction:0.34,
  extraNeighborReduction:0.055,
  /** Untergrenze für Rest-Luftwiderstand: bewusst konservativer Testwert. */
  minimumAeroFactor:0.40,
});

/** Stable-pack verwendet die Formation als vollstaendiges Aero-Modell.
 * Alte Modi behalten fuer exakte Vergleiche die historische Kombination. */
export function raceAeroFactor(input:{formation:number|null;
  legacyPack:number;stablePack:boolean}):number{
  if(input.formation===null)return input.legacyPack;
  return input.stablePack?input.formation:
    Math.min(input.formation,input.legacyPack);
}

/**
 * Liefert einen Aero-Faktor je Fahrer, deterministisch nach Position und ID.
 * Nur nach VORNE innerhalb einer lokalen Abstandszone prüfen; keine
 * Gruppenmitgliedschaft aus der 42-m-Ergebnisdiagnose übernehmen.
 *
 * Der erste lokale Nachbar hat einen großen Anteil; weitere Nachbarn
 * erhöhen die Abschirmung mit fallender Distanzgewichtung und Deckel.
 * Für eine 2er-Flucht entsteht damit weniger Schutz als tief in einer
 * dichten 30er-Formation, jedoch ohne fiktive seitliche Windkanäle.
 */
export function formationAeroFactors(
  positions:ReadonlyArray<FormationRiderPosition>,
):Map<string,number> {
  if(!Array.isArray(positions)||positions.length<1||positions.length>210)
    throw new RangeError('R-12 Windschatten: 1–210 Fahrer erforderlich');
  const seen=new Set<string>();
  for(const p of positions){
    if(!p||typeof p.id!=='string'||!p.id.trim()||seen.has(p.id)||
       !Number.isFinite(p.positionM)||p.positionM<0)
      throw new RangeError('R-12 Windschatten: Position/ID ungültig');
    seen.add(p.id);
  }
  const sorted=[...positions].sort((a,b)=>b.positionM-a.positionM||
    a.id.localeCompare(b.id));
  const factors=new Map<string,number>();
  const c=R12_AERO_EXPERIMENT;
  for(let i=0;i<sorted.length;i++){
    let weightedFront=0;
    let frontNeighbors=0;
    for(let j=i-1;j>=0&&frontNeighbors<c.maximumFrontNeighbors;j--){
      const distanceM=sorted[j].positionM-sorted[i].positionM;
      if(distanceM>=c.lookAheadM)break;
      // Gleichauf-Fahrer sind keine vorausfahrenden Nachbarn.
      // Sie dürfen auch NICHT das Limit für echte Vordermänner verbrauchen:
      // alle Fahrer mit derselben Längskoordinate müssen dadurch denselben
      // Schutz durch weiter vorn liegende Fahrer erhalten (Massenstart).
      if(distanceM<=1e-9)continue;
      weightedFront+=Math.max(0,1-distanceM/c.lookAheadM);
      frontNeighbors++;
    }
    const protection=weightedFront<=1?
      c.firstNeighborReduction*weightedFront:
      c.firstNeighborReduction+
        c.extraNeighborReduction*(weightedFront-1);
    factors.set(sorted[i].id,Math.max(c.minimumAeroFactor,
      Math.min(1,1-protection)));
  }
  return factors;
}
