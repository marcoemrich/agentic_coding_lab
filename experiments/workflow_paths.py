"""Workflow-Namen und -Pfade auflösen.

Liest die von workflow-lineage.py generierten ALIASES.json / PATHS.json. Absicht
der Trennung: hier kein YAML, damit die Konsumenten (aggregate-by-query,
batch-plan-from-rq) ihre Abhängigkeiten nicht erweitern.

`canonical()` ist die Brücke auf die Altbestände. metrics.json einer Run trägt
für immer den Workflow-Namen, unter dem sie gelaufen ist — diese Dateien werden
nie umgeschrieben, sie sind aufgezeichnetes Experimentmaterial. Stattdessen wird
bei jedem Vergleich beidseitig kanonisiert.
"""
import json
from pathlib import Path

WORKFLOWS_DIR = Path(__file__).resolve().parent / "workflows"
_ALIASES_FILE = WORKFLOWS_DIR / "ALIASES.json"
_PATHS_FILE = WORKFLOWS_DIR / "PATHS.json"

_aliases: dict[str, str] | None = None
_paths: dict[str, str] | None = None


def _load() -> None:
    global _aliases, _paths
    if _aliases is None:
        _aliases = json.loads(_ALIASES_FILE.read_text()) if _ALIASES_FILE.is_file() else {}
        _paths = json.loads(_PATHS_FILE.read_text()) if _PATHS_FILE.is_file() else {}


def canonical(name: str) -> str:
    """Alt-Name -> aktueller Name. Unbekanntes bleibt unverändert.

    Unverändert durchreichen statt zu werfen: ein Tippfehler in einer RQ soll
    weiter als 'kein Run gematcht' auffallen, nicht als Crash der Aggregation.
    """
    _load()
    return _aliases.get(name, name)


def workflow_dir(name: str) -> Path:
    """Verzeichnis eines Workflows, Alt-Namen eingeschlossen."""
    _load()
    canon = canonical(name)
    rel = _paths.get(canon)
    return WORKFLOWS_DIR / rel if rel else WORKFLOWS_DIR / canon


def known_names() -> set[str]:
    _load()
    return set(_paths)


def is_archived(name: str) -> bool:
    """Liegt der Workflow unter _archive/ — also status: discarded?

    Der Ordner ist der Trigger, nicht der Name: aggregate-by-query bricht bei
    einem archivierten Selektor ab, damit verworfene Varianten nicht still in
    eine frische Aggregation rutschen.
    """
    _load()
    return _paths.get(canonical(name), "").startswith("_archive/")
