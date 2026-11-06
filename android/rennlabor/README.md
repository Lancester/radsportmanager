# Rennlabor Android – vollständig offline als APK

Dies ist **nur ein nativer Android-Container um die unveränderten originalen Browser- und Engine-Module**. Das mit GitHub Actions erzeugte JS-Browserpaket wird bei jedem APK-Build vollständig in `app/src/main/assets/labor/` eingebettet.

- Kein Hosting, kein Benutzerkonto, keine Datenbank, keine Netz-/INTERNET-Berechtigung.
- HTML, Engine-ES-Module und WebWorker werden über `WebViewAssetLoader` unter der lokalen virtuellen HTTPS-Domain `appassets.androidplatform.net` geladen (keine wirkliche Website).
- Sobald das APK einmal auf dem Android-Gerät installiert ist, laufen alle Rennen **ohne Internet oder Webspace**. Der Fortschritt des Laborprogramms wird durch neue APK-Builds installiert.
- `assembleDebug` erstellt eine mit einem **nur für Entwicklung geeigneten Debug-Schlüssel** signierte Test-APK. **Nicht** als signierte Play-Store-Veröffentlichung behandeln; für spätere reguläre Updates ist ein dauerhaft gesicherter Release-Schlüssel nötig.
- GitHub Actions lädt das APK als Artefakt `rennlabor-android-offline-apk` hoch. Auf Android erst GitHub-Artefakt entpacken, dann die darin enthaltene `.apk` per Dateimanager öffnen. Android verlangt eventuell eine einmalige Erlaubnis „Apps aus dieser Quelle installieren“ für den Dateimanager; nur selbst überprüfte APK verwenden.
- Android-WebView benötigt eine aktuelle System-WebView-/Chrome-Version. Die Simulation im echten Android-Handy ist noch nicht manuell getestet; der CI-Build prüft zunächst die native Kompilierung, und die Pixel-7-Browserprüfung prüft denselben JavaScript-Kern.
