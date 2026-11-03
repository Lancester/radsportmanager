const status = document.getElementById('status');
const runtime = document.getElementById('runtime');
const virtual = document.getElementById('virtual');
const detail = document.getElementById('detail');
const report = document.getElementById('report');
const cancel = document.getElementById('cancel');
const copy = document.getElementById('copy');
const buttons = [...document.querySelectorAll('[data-preset]')];
let worker = null;
let active = false;
let lastReport = null;
const presets = {
  klein: {pairs: 1, durationS: 12, repeats: 3},
  mittel: {pairs: 10, durationS: 120, repeats: 3},
  gross: {pairs: 80, durationS: 120, repeats: 3},
  gruppe: {group: true, durationS: 120, repeats: 3},
};
let commit = 'unbekannt';
fetch('./benchmark/version.txt', {cache: 'no-store'})
  .then(r => r.ok ? r.text() : 'lokaler Test')
  .then(v => {commit = v.trim(); document.getElementById('version').textContent = commit;})
  .catch(() => {document.getElementById('version').textContent = 'lokaler Test';});
function setRunning(running) {
  active = running;
  cancel.disabled = !running;
  buttons.forEach(b => {b.disabled = running;});
}
function finish() {
  if (worker) {worker.terminate(); worker = null;}
  setRunning(false);
}
function run(presetName) {
  if (active || !window.Worker) {
    status.textContent = 'Dieser Browser unterstützt Web Worker nicht.';
    return;
  }
  const preset = presets[presetName];
  lastReport = null;
  copy.disabled = true;
  report.value = '';
  runtime.textContent = '…';
  virtual.textContent = String(preset.durationS);
  detail.textContent = 'Rechnung läuft außerhalb der Benutzeroberfläche.';
  status.textContent = 'Test läuft. Du kannst ihn jederzeit abbrechen.';
  setRunning(true);
  try {
    worker = new Worker('./benchmark/r03-worker.js', {type: 'module'});
    worker.onmessage = event => {
      const msg = event.data;
      if (msg.type === 'progress') {
        status.textContent = `Berechnung ${msg.current} von ${msg.total} abgeschlossen …`;
      } else if (msg.type === 'result') {
        const result = msg.result;
        lastReport = {commit, benchmarkVersion: 'r03-android-v2', ...result};
        runtime.textContent = result.medianMs.toLocaleString('de-DE', {maximumFractionDigits: 1});
        detail.textContent = result.mode === 'achtfahrer-gruppe'
          ? `8 Fahrer interagieren gemeinsam über ${result.durationS} virtuelle Sekunden. ` +
            `Nach 30 s reduziert Fahrer F8 testweise seine Leistung. ` +
            `Endlücke: ${result.finalGapM.toLocaleString('de-DE')} m; Lückenereignisse: ${result.gapEvents}. ` +
            `Alle ${result.repeats} Wiederholungen ergaben dieselbe Prüfzahl. Keine KI.`
          : `${result.pairs} unabhängige Paare (also ${result.pairs * 2} Fahrer), ` +
            `${result.durationS} virtuelle Sekunden je Paar, ${result.repeats} Messwiederholungen. ` +
            `Alle Wiederholungen ergaben dieselbe Prüfzahl.`;
        report.value = JSON.stringify(lastReport, null, 2);
        copy.disabled = false;
        status.textContent = 'Test erfolgreich. Kopiere den Bericht und sende ihn mir hier im Chat.';
        finish();
      } else if (msg.type === 'error') {
        status.textContent = `Test fehlgeschlagen: ${msg.message}`;
        finish();
      }
    };
    worker.onerror = e => {
      status.textContent = `Fehler beim Start des Workers: ${e.message || 'unbekannt'}`;
      finish();
    };
    worker.postMessage({type: 'run', preset});
  } catch(e) {
    status.textContent = `Web Worker konnte nicht gestartet werden: ${e.message}`;
    finish();
  }
}
buttons.forEach(b => b.addEventListener('click', () => run(b.dataset.preset)));
cancel.addEventListener('click', () => {
  if (!active) return;
  finish();
  status.textContent = 'Test abgebrochen. Du kannst einen neuen starten.';
});
copy.addEventListener('click', async () => {
  if (!lastReport) return;
  try {await navigator.clipboard.writeText(report.value); status.textContent = 'Bericht kopiert. Füge ihn im Chat ein.';}
  catch {report.focus();report.select();status.textContent='Bitte markierten Text manuell kopieren.';}
});
