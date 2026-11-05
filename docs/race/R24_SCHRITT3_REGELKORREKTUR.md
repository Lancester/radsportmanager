# R-24: gezielte Korrektur der lokalen Gruppenreferenz

05.11.2026, Entwicklungsbranch, vorläufiger Forschungsstand. Ziel ist die Korrektur eines konkret beobachteten widersprüchlichen Reglersignals. Eine allgemeine sportliche Realismusfreigabe ist daraus nicht abzuleiten.

## Beobachtung und Ursache

Im kontrollierten Rennen Anstieg → Abfahrt ohne Attacken (Seed 2026) entstand die erste >42-m-Lücke hinter F107 bei t=1578 s. Beide betroffenen Fahrer befanden sich bereits auf derselben -4-%-Abfahrt. Die Sekundenprobe davor zeigt: Bei t=1540 war F107 ca. 6,5 m hinter seinem unmittelbaren Vorderrad, das schon etwas schneller fuhr; F107 forderte 0 W an. Bis t=1556 wuchs die Lücke auf 13,7 m, der Aero-Faktor stieg von 0,42 auf 0,60, und erst dann wurden rund 129 W angefordert. Bei t=1580 war die Lücke ca. 48 m; der Fahrer hatte den Windschatten verloren und forderte ca. 371 W.

Das direkte Vorderrad verzögerte in diesem Abschnitt nicht, während die in der Referenz mitgemischte entfernte Gruppenspitze verzögerte. Diese negative Beschleunigungsprognose verringerte die Nachführanforderung des Gruppenreglers. Das ist ein belegter Mechanismus in diesem konkreten Verlauf, keine Alleinerklärung für alle Abstandsgruppen. Das 1D-Gruppen- und Windschattenmodell bleibt eine Vereinfachung.

## Änderung

Im `stable-pack` verwendet die Referenz künftig die gemessene Beschleunigung des direkten Vorderrades, **wenn dieses schneller als der Fahrer ist, nicht verzögert und die entfernte Gruppenspitze gleichzeitig verzögert**. In den übrigen Situationen bleibt die vorhandene Mischung bestehen. Nur der Wattwunsch wird beeinflusst; W′, CP, aerodynamische Abschirmung und Bewegung bleiben die bestehenden Rechenkerne. Keine direkte Anpassung von Position, Geschwindigkeit, Abstand oder Ergebnis. Wenn das Vorderrad langsamer ist oder selbst verzögert, wird die neue Ausnahme nicht angewendet. Die Schwelle ist der physikalische Vorzeichenwechsel, kein neuer auf ein Rennen abgestimmter Prozent- oder Distanzwert.

Ein gezielter kontrollierter Reglertest des Konflikts errechnet vor der Änderung 0 W und mit lokaler Beschleunigung rund 185 W, bei unveränderter CP-Grenze. In einem vollständigen gepaarten Kontrolllauf ist der spätere Verlauf dynamisch verschieden: F107 fährt bei t=1580 noch in der Gruppe und der nächstliegende Vorderradabstand beträgt ca. 10,9 m statt ca. 48,4 m in der Basis. Fahrer vor ihm und seine Position sind dann bereits unterschiedlich; dies ist daher **keine** Messung bei identischen Anfangszuständen zum Zeitpunkt 1580. Die Momentaufnahmen und das Instrumentierungspatch stehen unter [r24-reglerkorrektur-daten](r24-reglerkorrektur-daten/).

## Gegenproben

Gleiche 30-km-Kontrollstrecken wie zuvor, 154 Fahrer, keine Attacken, kein Wind, keine technischen Bremsungen; derselbe Seed und dasselbe Feld je Paar. Auf dem direkten Anstieg → Abfahrt betrug die räumliche Spanne bei km 20 Basis → neu: 619→532 m (Seed 2026), 576→388 m (42), 602→549 m (123). Auf der flachen und Anstieg→Ebene-Kontrolle blieb 2026 die 154er-Gruppe an km 20 und 25 erhalten. Der sanftere Übergang zeigt jedoch gemischte Resultate: bei km 25 144/9/1 in der Basis, 104/25/11/... mit Änderung; die Gesamtspanne stieg dort von 404 auf 644 m. Die Änderung verbessert also **nicht alle** Geländefälle.

Vollrennen: drei Seeds (42, 123, 2026), vier Profile, identisches Flachfahrerfeld und identische Teams je Paar. Drei fiktive Seeds sind keine aussagekräftige Häufigkeits- oder Realismuskalibrierung; Zeitrückstände sind keine Zielwerte.

| Seed | Profil | Sieger Basis → neu | Medianrückstand Basis → neu | Sprinter Top 10 Basis → neu |
| ---: | --- | --- | ---: | ---: |
| 42 | Lille | Sprinter → Sprinter | 46 → 18 s | 8 → 7 |
| 42 | Boulogne | Sprinter → Sprinter | 107 → 72 s | 8 → 6 |
| 42 | Liège | Klassiker → Kletterer | 937 → 865 s | 1 → 0 |
| 42 | Hautacam | Klassiker → Kletterer | 902 → 1065 s | 0 → 0 |
| 123 | Lille | Sprinter → Sprinter | 22 → 40 s | 6 → 8 |
| 123 | Boulogne | Klassiker → Sprinter | 61 → 82 s | 2 → 1 |
| 123 | Liège | Zeitfahrer → Allrounder | 468 → 748 s | 1 → 1 |
| 123 | Hautacam | Kletterer → Kletterer | 1140 → 807 s | 2 → 0 |
| 2026 | Lille | Sprinter → Sprinter | 17 → 29 s | 8 → 7 |
| 2026 | Boulogne | Sprinter → Klassiker | 205 → 74 s | 2 → 0 |
| 2026 | Liège | Allrounder → Kletterer | 601 → 908 s | 1 → 0 |
| 2026 | Hautacam | Kletterer → Kletterer | 936 → 600 s | 0 → 0 |

Diese Ergebnisse belegen keine allgemeine Verbesserung oder Verschlechterung. Ein Kletterersieg bei Liège und große Rückstände können plausibel sein; umgekehrt ist die Veränderung der Rennverläufe groß. Insbesondere der vorher im Berg-Seed 123 mit dem Flachfahrerfeld beobachtete Sprinter auf Platz 3 ist im neuen Lauf nicht in den Top 10. Das ist ein Ergebnis der Simulation, keine künstliche Typsperre und noch keine Erklärung der Ursache. Der weitere Vergleich mit bergtypischen Feldern und mehr Seeds bleibt wichtig.

## Prüfung und weiterer Stand

Die zielgerichteten 12 Tests zu Gruppenregel, kontrolliertem 154er-Flachfeld, Anschlussdiagnostik und Sprinterreserve bestanden; der separate neue Reglertest prüft die Wattentscheidung direkt. Der vollständige lokale Testlauf bestand mit **369/369 Tests**; der im Anschluss ergänzte direkte Watt-Reglertest bestand separat. Der TypeScript-Browser-Build und ESM-Import waren erfolgreich. Der GitHub-PR-Test [#296](https://github.com/Lancester/radsportmanager/actions/runs/42023152068) für den Code-Commit `5fa521cccd7d1fa2c41cd3813def61204d083ecf` lief bei Dokumentation noch. Die Änderung ist nur auf dem Entwicklungsbranch und kann nach weiteren Gegenproben zurückgenommen oder ersetzt werden. Nächste Priorität: den sanften Geländewechsel und Ursachen der übrigen Gruppenzerfälle untersuchen und die bereits geplanten Mehrseed-/Realrennen-Vergleiche durchführen; keine alleinige Optimierung auf eine kleine Zielgruppe oder einen Sieger.
