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
