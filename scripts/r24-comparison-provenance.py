"""Bindet eine fortsetzbare Vergleichsreihe an Quellstand und Testskripte."""
import hashlib
import json
from pathlib import Path


def tree_hash(directory):
    directory = Path(directory)
    h = hashlib.sha256()
    files = sorted(p for p in directory.rglob('*') if p.is_file())
    for path in files:
        name = path.relative_to(directory).as_posix().encode('utf-8')
        data = path.read_bytes()
        h.update(len(name).to_bytes(8, 'big'))
        h.update(name)
        h.update(len(data).to_bytes(8, 'big'))
        h.update(data)
    return h.hexdigest()


def build_manifest(roots, scripts, plan, node_version):
    return {'format': 1, 'engines': {name: tree_hash(Path(path)/'src/engine')
            for name, path in sorted(roots.items())},
            'scripts': {Path(p).name: hashlib.sha256(Path(p).read_bytes()).hexdigest()
                        for p in sorted(scripts)},
            'plan': plan, 'node_version': node_version}


def manifest_id(manifest):
    raw = json.dumps(manifest, sort_keys=True, separators=(',', ':'), ensure_ascii=False)
    return hashlib.sha256(raw.encode('utf-8')).hexdigest()


def check_or_prepare(output, expected, dry_run=False):
    output = Path(output)
    manifest_path = output/'vergleich-manifest.json'
    if (output/'vergleich-ungueltig.txt').exists():
        raise ValueError('Diese Vergleichsreihe wurde als ungültig markiert; neues Ausgabeverzeichnis verwenden.')
    if manifest_path.exists():
        try:
            actual = json.loads(manifest_path.read_text(encoding='utf-8'))
        except (OSError, ValueError) as exc:
            raise ValueError(f'Manifest unlesbar: {exc}') from exc
        if actual != expected:
            raise ValueError('Quellstand, Testskripte, Testplan oder Node-Version haben sich geändert; neues Ausgabeverzeichnis verwenden.')
    else:
        old = [p for prefix in ('main-', 'dev-', 'before-')
               for p in output.glob(prefix+'*.json')]
        if old:
            raise ValueError('Vorhandene Rennergebnisse ohne Manifest: Herkunft nicht verifizierbar; neues Ausgabeverzeichnis verwenden.')
        if not dry_run:
            output.mkdir(parents=True, exist_ok=True)
            with manifest_path.open('x', encoding='utf-8') as f:
                json.dump(expected, f, indent=2, sort_keys=True, ensure_ascii=False)
                f.write('\n')
    return manifest_id(expected)


def verify_result(output, result, version):
    """Neue Serien müssen Manifest und zum Ergebnis passenden Kennwert besitzen.

    Historische Ergebnisse ohne Kennung bleiben lesbar, sind aber nicht
    nachträglich an einen Quellstand gebunden.
    """
    output = Path(output)
    if (output/'vergleich-ungueltig.txt').exists():
        raise ValueError('Vergleichsreihe als ungültig markiert')
    manifest_path = output/'vergleich-manifest.json'
    tag = result.get('comparisonProvenance')
    if manifest_path.exists():
        manifest = json.loads(manifest_path.read_text(encoding='utf-8'))
        if tag != manifest_id(manifest)+':'+version:
            raise ValueError('Ergebnis gehört nicht zum Vergleichsmanifest')
    elif tag is not None:
        raise ValueError('Manifest für gekennzeichnetes Ergebnis fehlt')
