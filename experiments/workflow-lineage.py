#!/usr/bin/env python3
"""Validiert experiments/workflows/LINEAGE.yaml und generiert daraus.

LINEAGE.yaml ist die Quelle für Kategorie, Arm, Version, Elternteil, Status und
Alt-Namen jedes Workflows. Dieses Skript ist das einzige, das sie liest; alles
andere konsumiert die generierten Artefakte:

  ALIASES.json   Alt-Name -> aktueller Name. Die Brücke auf die Runs: deren
                 metrics.json trägt weiter den Namen, unter dem sie gelaufen
                 sind, und wird nie umgeschrieben.
  PATHS.json     Name -> Pfad relativ zu experiments/workflows/. Damit kommt
                 bash (run-batch.sh) ohne YAML-Parser an die Ordner.

  --check  prüft, --emit schreibt, --inventory gibt die Markdown-Tabelle für
  generate-snapshot-skeleton.py aus.

Der Check läuft auch VOR der Migration: findet er einen Workflow nicht unter
seinem neuen Pfad, sucht er ihn unter seinen Alt-Namen. So ist ein Trockenlauf
möglich, bevor irgendein git mv passiert.
"""
import json
import sys
from pathlib import Path

import yaml

REPO_ROOT = Path(__file__).resolve().parent.parent
WORKFLOWS_DIR = REPO_ROOT / "experiments" / "workflows"
LINEAGE_FILE = WORKFLOWS_DIR / "LINEAGE.yaml"

VALID_STATUS = {"trunk", "branch", "superseded", "discarded", "vendored"}
VALID_HARNESS = {"cc", "oc", "pi", "cursor"}

# Kategorie-Diskriminator, am Bestand verifiziert: ein test-list-Artefakt ist in
# genau den exact-coding-Workflows vorhanden und in genau den baselines/external
# abwesend. Die naheliegendere Regel "alle vier Bausteine als eigene Dateien"
# ist FALSCH -- die pi/oc/cursor-Ports bündeln red/green anders und würden
# fälschlich als Baseline gelten.
def has_test_list(wf_dir: Path) -> bool:
    return any("test-list" in p.name.lower() or "test_list" in p.name.lower()
               for p in wf_dir.rglob("*"))


def has_upstream_license(wf_dir: Path) -> bool:
    return (wf_dir / "LICENSE.upstream").is_file()


def load():
    data = yaml.safe_load(LINEAGE_FILE.read_text(encoding="utf-8"))
    index = {}
    for category, cfg in data["categories"].items():
        for name, entry in cfg["workflows"].items():
            index[name] = {
                **entry,
                "category": category,
                "cat_prefix": cfg["prefix"],
                "path": f"{category}/{name}",
            }
    return data, index


def resolve_dir(name, entry):
    """Neuer Pfad, sonst Alt-Name im flachen Layout (Trockenlauf vor Migration)."""
    new = WORKFLOWS_DIR / entry["path"]
    if new.is_dir():
        return new, "neu"
    for old in entry.get("alias", []):
        for candidate in (WORKFLOWS_DIR / old, WORKFLOWS_DIR / "_archive" / old):
            if candidate.is_dir():
                return candidate, "alt"
    return None, None


def check(data, index):
    errors, notes = [], []
    seen_alias = {}

    for name, e in index.items():
        cat, status = e["category"], e.get("status")

        if not name.startswith(e["cat_prefix"] + "-"):
            errors.append(f"{name}: Präfix passt nicht zu Kategorie {cat} "
                          f"(erwartet {e['cat_prefix']}-)")

        if status not in VALID_STATUS:
            errors.append(f"{name}: unbekannter status {status!r}")
        archived = cat.startswith("_archive/")
        if (status == "discarded") != archived:
            errors.append(f"{name}: status={status} und Pfad {cat} widersprechen "
                          f"sich (discarded <=> _archive/)")

        if e.get("harness") not in VALID_HARNESS:
            errors.append(f"{name}: unbekannter harness {e.get('harness')!r}")

        parent = e.get("parent")
        if parent and parent not in index:
            errors.append(f"{name}: parent {parent!r} existiert nicht")
        elif parent and index[parent].get("arm") != e.get("arm"):
            notes.append(f"Arm-Sprung: {name} (arm={e['arm']}) stammt von "
                         f"{parent} (arm={index[parent]['arm']})")

        for a in e.get("alias", []):
            if a in seen_alias:
                errors.append(f"Alias {a!r} doppelt: {seen_alias[a]} und {name}")
            seen_alias[a] = name
            if a in index:
                errors.append(f"Alias {a!r} kollidiert mit einem Workflow-Namen")

        wf_dir, kind = resolve_dir(name, e)
        if wf_dir is None:
            errors.append(f"{name}: kein Verzeichnis gefunden "
                          f"(weder {e['path']} noch ein Alt-Name)")
            continue

        is_exact = cat.endswith("exact-coding/opus") or cat.endswith("exact-coding/sol")
        if is_exact and not has_test_list(wf_dir):
            errors.append(f"{name}: liegt unter exact-coding/, hat aber kein "
                          f"test-list-Artefakt")
        if not is_exact and has_test_list(wf_dir):
            errors.append(f"{name}: liegt unter {cat}, hat aber ein "
                          f"test-list-Artefakt -> gehört nach exact-coding/")
        if cat == "external" and not has_upstream_license(wf_dir):
            errors.append(f"{name}: unter external/, aber ohne LICENSE.upstream")

    # Kein Verzeichnis darf unerfasst bleiben.
    known = set()
    for name, e in index.items():
        wf_dir, _ = resolve_dir(name, e)
        if wf_dir:
            known.add(wf_dir.resolve())
    for d in list(WORKFLOWS_DIR.rglob("*")):
        if not d.is_dir():
            continue
        rel = d.relative_to(WORKFLOWS_DIR)
        depth_ok = len(rel.parts) <= 4
        looks_like_wf = any((d / h).is_dir() for h in (".claude", ".pi", ".opencode", ".cursor"))
        if looks_like_wf and depth_ok and d.resolve() not in known:
            errors.append(f"Verzeichnis {rel} ist in LINEAGE.yaml nicht erfasst")

    return errors, notes


def emit(index):
    aliases = {}
    for name, e in index.items():
        for a in e.get("alias", []):
            aliases[a] = name
        aliases[name] = name          # Identität, damit Lookups nie fehlschlagen
    paths = {name: e["path"] for name, e in index.items()}

    (WORKFLOWS_DIR / "ALIASES.json").write_text(
        json.dumps(dict(sorted(aliases.items())), indent=2) + "\n", encoding="utf-8")
    (WORKFLOWS_DIR / "PATHS.json").write_text(
        json.dumps(dict(sorted(paths.items())), indent=2) + "\n", encoding="utf-8")
    return len(aliases), len(paths)


def inventory(data, index):
    """Markdown-Inventar für generate-snapshot-skeleton.py."""
    lines = ["| Workflow | Arm | Version | Harness | Status | Elternteil |",
             "|---|---|---|---|---|---|"]
    for cat, cfg in data["categories"].items():
        for name, entry in cfg["workflows"].items():
            ver = entry.get("version") or entry.get("vendored", "")
            lines.append(f"| `{name}` | {entry.get('arm','')} | {ver} | "
                         f"{entry.get('harness','')} | {entry.get('status','')} | "
                         f"{('`' + entry['parent'] + '`') if entry.get('parent') else '—'} |")
    return "\n".join(lines)


def main():
    args = set(sys.argv[1:]) or {"--check"}
    data, index = load()

    if "--inventory" in args:
        print(inventory(data, index))
        return 0

    rc = 0
    if "--check" in args or "--emit" in args:
        errors, notes = check(data, index)
        for n in notes:
            print(f"  hinweis: {n}", file=sys.stderr)
        if errors:
            print(f"LINEAGE-Check: {len(errors)} Fehler", file=sys.stderr)
            for err in errors:
                print(f"  FEHLER: {err}", file=sys.stderr)
            rc = 1
        else:
            print(f"LINEAGE-Check ok: {len(index)} Workflows", file=sys.stderr)

    if "--emit" in args and rc == 0:
        na, np_ = emit(index)
        print(f"ALIASES.json: {na} Einträge, PATHS.json: {np_} Einträge", file=sys.stderr)

    return rc


if __name__ == "__main__":
    sys.exit(main())
