# Großer Vergleich – erster vollständiger Flachblock

Stand: erster kompletter Block, zehn Seeds und je ein Rennen pro Version auf Lille mit gemeinsamem Fahrerfeld. Alle 20 Rennen wurden klassiert, Energiebilanz und Hash der gemeinsamen Basisdaten je Paar durch die Skripte geprüft und die Originaldaten gesichert. Dies ist erst ein Teil der geplanten 200 Rennen; die anderen Strecken und Zusatzszenarien fehlen in dieser Zwischenbilanz. `main` und Entwicklungsstand unterscheiden sich auch durch die im älteren Audit eingeführten Ermüdungsattribute; der Vergleich isoliert nicht eine einzelne Taktikänderung. Die zwei Lille-Feldvarianten verwenden dasselbe Fahrerfeld und zählen nicht als unabhängige Stichproben.

| Kennzahl | main | Eintagesmodell |
|---|---:|---:|
| Siege Sprinter / Kletterer / Klassiker | 9 / 0 / 1 | 8 / 2 / 0 |
| Angriffsbeginn-Ereignisse je Rennen, Mittel | 51,8 | 18,5 |
| Verfolgungsbeginn-Ereignisse je Rennen, Mittel | 181,2 | 2.193,4 |
| Darunter ausdrücklich als Angriffsreaktion beschrieben, Mittel | Alte Beschriftung nicht vergleichbar | 1.754,7 |
| Davon in den ersten 30 km, Mittel | Alte Beschriftung nicht vergleichbar | 1.125,2 |
| Gewertete Siegergruppe, 1-s-Nachbarregel, Median | 29 | 7 |
| Nachberechnete Siegergruppe, 3-s-Nachbarregel, Median | 37 | 42 |
| Jeweils größte Zielgruppe, 1 s, Median | 90,5 | 79,5 |
| Rang des vorab stärksten Sprint-Leistungsproxys, Median | 2 | 2 |
| Durchschnittliche Sprinterzahl in den ersten Zehn | 7,0 | 6,1 |

Die Gruppen sind nachträglich aus simulierten individuellen Zielzeiten mit zwei technischen Nachbarlücken gebildet, keine vollständigen offiziellen Sonderwertungen. Die starke Abhängigkeit von 1 s oder 3 s bedeutet, dass die Gruppengröße nicht ohne genauere Prüfung interpretiert werden sollte. Der Vorab-Proxy berücksichtigt Teamtaktik und Rennverlauf nur eingeschränkt.

Angriffs- und Verfolgungszahlen sind **Beginn-Ereignisse eines internen Zustands**. Ein Fahrer kann wiederholt gezählt sein; die Zahlen belegen weder dauerhafte Einzeljagden noch erfolgreichen Anschluss oder erhöhte Nettoleistung. Die große Häufigkeit früher Angriffsreaktionen im neuen Modell ist dennoch ein konkreter Grund für die Untersuchung von Motiven, Dauern, tatsächlicher Leistungsabgabe und Auswirkung auf Gruppenbildung. Keine Annahme, dass alle Unterschiede von derselben Regel stammen.

Die [Sicherungsblöcke und Manifeste](README.md) enthalten die vollständigen Originaldateien. Der vollständige große Test und ein neuer technischer Standardtest sind noch nicht abgeschlossen.

## Zweiter vollständiger Block: Boulogne, gemeinsames Fahrerfeld

Auch hier liegen zehn gepaarte Seeds mit 154 klassierten Fahrern vor; identische gemeinsame Basiseingaben je Paar und Energiebilanz wurden geprüft. Das streckentypische Feld ist separat zu betrachten.

| Kennzahl | main | Eintagesmodell |
|---|---:|---:|
| Siege Klassiker / Kletterer / Sprinter / Zeitfahrer | 8 / 0 / 1 / 1 | 3 / 4 / 2 / 1 |
| Angriffsbeginn-Ereignisse je Rennen, Mittel | 22,4 | 24,5 |
| Verfolgungsbeginn-Ereignisse je Rennen, Mittel | 9,2 | 1.905,7 |
| Darunter ausdrücklich als Angriffsreaktion beschrieben, Mittel | Alte Beschriftung nicht vergleichbar | 1.571,2 |
| Davon in den ersten 30 km, Mittel | Alte Beschriftung nicht vergleichbar | 938,9 |
| Siegergruppe, 1-s-Nachbarregel, Median | 1 | 1,5 |
| Siegergruppe, 3-s-Nachbarregel, Median | 1 | 2 |
| Rang des vorab stärksten Profil-Leistungsproxys, Median | 80,5 | 47,5 |
| Durchschnittliche Klassikerfahrer / Kletterer in den ersten Zehn | 1,7 / 0 | 1,9 / 0,5 |

Der Leistungsproxy bildet die Teamrolle nicht vollständig ab; insbesondere eine nominelle Topbewertung belegt keine gleichwertige Siegchance. Angriffs- und Verfolgungsbeginne sind wie oben beschrieben Zustandswechsel, keine unabhängig gezählten tatsächlichen, dauerhaften Vorstöße. Die große Zahl früher Reaktionsbeginne zeigt sich jetzt auch im zweiten vollständigen Streckenblock. Sie belegt noch keine damit verbundene Netto-Mehrleistung oder einzelne Ursache.

## Boulogne mit streckentypischem Fahrerfeld

Zehn weitere gepaarte Seeds mit anderem, streckentypischem Feld sind abgeschlossen; gemeinsame Basisdaten und Energiebilanz je Paar wurden geprüft. Diese Ergebnisse sind nicht mit dem gemeinsamen Feld gleichzusetzen.

| Kennzahl | main | Eintagesmodell |
|---|---:|---:|
| Siege Klassiker / Kletterer / Sprinter / Zeitfahrer | 10 / 0 / 0 / 0 | 2 / 3 / 4 / 1 |
| Angriffsbeginn-Ereignisse je Rennen, Mittel | 31,9 | 28,8 |
| Verfolgungsbeginn-Ereignisse je Rennen, Mittel | 12,9 | 2.111,5 |
| Darunter ausdrücklich als Angriffsreaktion beschrieben, Mittel | Alte Beschriftung nicht vergleichbar | 1.742,8 |
| Davon in den ersten 30 km, Mittel | Alte Beschriftung nicht vergleichbar | 1.061,2 |
| Siegergruppe, 1-s-Nachbarregel, Median | 1,5 | 1,5 |
| Siegergruppe, 3-s-Nachbarregel, Median | 2 | 2 |
| Rang des vorab stärksten Profil-Leistungsproxys, Median | 88,5 | 89 |
| Durchschnittliche Klassikerfahrer / Kletterer in den ersten Zehn | 3,8 / 0,2 | 2,7 / 0,6 |

In zehn Rennen fällt die Verteilung der Siegertypen zwischen den Ständen stark unterschiedlich aus. Ein als Kletterer klassifizierter Gewinner ist noch kein Beweis für einen Fehler: Es sind die tatsächlichen Werte, Rollen und der Rennverlauf zu prüfen. Für alle gezählten Verfolgungszustände liegen keine durchgängigen individuellen Leistungsbilanzen vor; punktuelle Kontrollpunkte enthalten für ausgewählte Fahrer tatsächlich erbrachte Watt. Attacken besitzen zusätzliche Detailtelemetrie. Der Blick auf Zustandszahlen ersetzt daher keine Energie- oder Verlaufsanalyse.


## Lüttich mit gemeinsamem Fahrerfeld: zehn gepaarte Seeds

Nach Wiederherstellung der bisherigen Daten wurden die zwei fehlenden Seed-Paare ergänzt; somit liegen für dieses Feld zehn vollständige Paare (20 Rennen) vor. Der Paarvergleich prüfte den Hash der gemeinsamen Basiseingaben; die Rennskripte prüften Zielklassifikation und Energiebilanz. Die gespeicherten Originaldaten sind in den Blöcken 001–023 enthalten. Lille-Feldvarianten sind identisch und bleiben keine unabhängigen Stichproben.

| Kennzahl | main | Eintagesmodell |
|---|---:|---:|
| Siege Klassiker / Allrounder / Kletterer | 10 / 0 / 0 | 0 / 5 / 5 |
| Siegergruppe bei 1-s-Nachbarregel, Median | 1,5 | 3 |
| Vorab-Profilfavorit: Zielrang, Median | 125,5 | 101,5 |
| Angriffsbeginn-Ereignisse je Rennen, Mittel | 38,4 | 29,5 |

Die Einteilung nach Fahrertyp erklärt keine Siegursache und beweist noch keinen Modellfehler. Der Vorab-Leistungsproxy berücksichtigt insbesondere Teamrollen nur eingeschränkt; Rang und Angriffsbeginne sind keine vollständige taktische Begründung. Die großen Unterschiede erfordern eine konkrete Analyse der Fähigkeiten, Rollen, Leistungsdaten und entscheidenden Rennverläufe sowie des streckentypischen Fahrerfelds. Der Gesamtvergleich ist nicht abgeschlossen; die angegebenen technischen Prüfungen belegen keine sportliche Realitätsnähe.
