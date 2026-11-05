import gzip,json,statistics as s,collections as c
from pathlib import Path
out=['# R-24: Zwischenstand Hautacam','', 'Stand 05.11.2026. Auswertung aller 40 gesicherten Hautacam-Läufe. Nur beschreibende Zwischenbilanz, keine Sportfreigabe und keine isolierte Wirkung einer einzelnen Codeänderung. Vergleichsstände, stable-pack, Seeds und Grenzen siehe R24_GROSSVERGLEICH_ARBEITSSTAND.md.','', 'Für jedes der 20 Paare wurde die Gleichheit der commonInputs-Hashes und die Zielankunft von 154 Fahrern geprüft. Die Felder common und profile sind unterschiedliche Szenarien und keine unabhängigen Zufallsziehungen. Seed-Reihenfolge: 11, 42, 101, 123, 777, 2025, 2026, 2027, 9001, 31415.','', '| Feld | Version | Siege nach ID | Siegergruppe 1 s / 3 s | Größte Gruppe 1 s / 3 s | Rückstand Rang 77 | Attacken | Ausreißer / eingeholt |','|---|---|---|---|---|---|---|---|']
allr={}
for roster in ['common','profile']:
 p=Path('docs/race/r24-grossvergleich-daten')/f'hautacam-{roster}-10-seeds.jsonl.gz'
 rows=[json.loads(x) for x in gzip.open(p,'rt')]; assert len(rows)==20
 for seed in [11,42,101,123,777,2025,2026,2027,9001,31415]:
  pair=[x['race'] for x in rows if x['race']['seed']==seed];assert len(pair)==2 and pair[0]['fingerprints']['commonInputs']==pair[1]['fingerprints']['commonInputs'] and all(len(x['classification'])==154 for x in pair)
 for version in ['main','dev']:
  rs=[x['race'] for x in rows if x['version']==version];assert len(rs)==10
  allr[roster,version]=rs
  m=lambda x:round(s.median(x),1)
  winners=', '.join(f'{k}: {v}' for k,v in c.Counter(r['classification'][0]['id'] for r in rs).most_common())
  out.append(f"| {roster} | {version} | {winners} | {m([r['groups1s'][0]['size'] for r in rs])} / {m([r['groups3s'][0]['size'] for r in rs])} | {m([max(g['size'] for g in r['groups1s']) for r in rs])} / {m([max(g['size'] for g in r['groups3s']) for r in rs])} | {m([r['classification'][76]['gapS'] for r in rs])} s | {m([r['diagnostics']['attacks'] for r in rs])} | {m([r['diagnostics']['breakaways'] for r in rs])} / {m([r['diagnostics']['caughtBreakaways'] for r in rs])} |")
out += ['', 'Alle Zahlen außer Sieghäufigkeiten sind Mediane über zehn Läufe. Gruppentrennung bei Nachbarlücke von mindestens 1 bzw. 3 Sekunden; die größte Gruppe muss nicht die Siegergruppe sein. Ereigniszähler sind engine-interne Diagnosen, keine unmittelbar mit Profirennen vergleichbaren Definitionen.','', '## Vorabfavoriten', '', 'Die Vorabrangliste ist ein vereinfachter Leistungsproxy und keine kalibrierte Siegprognose; Rollen, Teamarbeit und lange Ermüdung sind nur begrenzt abgebildet. Platzreihenfolge entspricht den oben genannten Seeds.','']
for roster in ['common','profile']:
 out += [f'### {roster}', '', '| Vorabrang | Fahrer | Rolle | main: Zielplätze | dev: Zielplätze |','|---|---|---|---|---|']
 a=allr[roster,'main']; b=allr[roster,'dev']
 for i in range(3):
  fa=[x['favorites']['profileTopThree'][i] for x in a]; fb=[x['favorites']['profileTopThree'][i] for x in b]; assert all(x['riderId']==fa[0]['riderId'] for x in fa+fb)
  out.append(f"| {i+1} | {fa[0]['riderId']} | {fa[0]['role']} | {', '.join(str(x['finishRank']) for x in fa)} | {', '.join(str(x['finishRank']) for x in fb)} |")
 out.append('')
out += ['## Auffälligkeiten und nächste Prüfung','', '- Profilfeld: F078 (Vorabrang 1) wird im Entwicklungsstand bei Seed 42 nur 73.; F134 (Vorabrang 2) gewinnt dort nicht, wird aber Zweiter. Die Momentaufnahmen zeigen F078 bereits bei km 15 rund 188 m hinter der Spitze und bei km 20 rund 329 m; das erklärt noch nicht, weshalb er zurückfällt oder später nicht anschließt. Die Gruppen sind Momentaufnahmen, keine Nachweise durchgehender Fahrgemeinschaften.','- Die medianen Zähler der Attacken steigen deutlich, während Rang-77-Rückstände kleiner ausfallen. Kausalität und sportliche Angemessenheit sind damit nicht bewiesen; Ereignisdefinitionen, Terrain und einzelne Attacken müssen geprüft werden.','- Im profiltypischen Feld steigt die mediane größte Zielgruppe von 5 auf 12,5 bei 1 s; bei 3 s von 12 auf 23,5. Die Siegergruppe liegt nach beiden Messgrenzen in beiden Versionen median bei einer Person. Beides sind nachberechnete Gruppen, keine vollständige UCI-Zeitwertung.','- Zum Realvergleich: Hautacam 2025 war Rang 77 offiziell bei +31:22. Verschiedene Felder, reale Ausfälle, Rundfahrt-Vorgeschichte und andere Gruppenwertung erlauben kein direktes Sollwerturteil. Quelle und weitere Referenzen: R24_PROFIRENNEN_DATENBASIS.md.','- Noch offen: detaillierte Verlaufskontrolle einzelner Auffälligkeiten und Belastung, Auswertung aller weiteren Profile, Vergleichsszenarien und Gesamturteil. Die lokale Vor-Kalibrierungsversion a33c32c ist gemäß Wiederaufnahme bisher nicht reproduziert; Wirkungen einzelner Änderungen nicht zuschreiben.','']
Path('docs/race/R24_HAUTACAM_ZWISCHENSTAND.md').write_text('\n'.join(out),encoding='utf8')
