#!/usr/bin/env python3
"""Validates experiments/workflows/LINEAGE.yaml and generates artefacts from it.

LINEAGE.yaml is the source for category, arm, version, parent, status and
old names of every workflow. This script is the only one that reads it;
everything else consumes the generated artefacts:

  ALIASES.json   old name -> current name. The bridge to the runs: their
                 metrics.json keeps the name they ran under and is never
                 rewritten.
  PATHS.json     name -> path relative to experiments/workflows/. This lets
                 bash (run-batch.sh) reach the folders without a YAML parser.

  --check  validates, --emit writes, --inventory prints the Markdown table for
  generate-snapshot-skeleton.py.

The check also works BEFORE the migration: if it does not find a workflow under
its new path, it looks under its old names. That allows a dry run before
any git mv happens.
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

# Category discriminator, verified against the inventory: a test-list artefact is
# present in exactly the exact-coding workflows and absent in exactly the
# baselines/external ones. The more obvious rule "all four building blocks as
# separate files" is WRONG -- the pi/oc/cursor ports bundle red/green differently
# and would wrongly count as baselines.
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
    """New path, else old name in the flat layout (dry run before migration)."""
    new = WORKFLOWS_DIR / entry["path"]
    if new.is_dir():
        return new, "new"
    for old in entry.get("alias", []):
        for candidate in (WORKFLOWS_DIR / old, WORKFLOWS_DIR / "_archive" / old):
            if candidate.is_dir():
                return candidate, "old"
    return None, None


def check(data, index):
    errors, notes = [], []
    seen_alias = {}

    for name, e in index.items():
        cat, status = e["category"], e.get("status")

        if not name.startswith(e["cat_prefix"] + "-"):
            errors.append(f"{name}: prefix does not match category {cat} "
                          f"(expected {e['cat_prefix']}-)")

        if status not in VALID_STATUS:
            errors.append(f"{name}: unknown status {status!r}")
        archived = cat.startswith("_archive/")
        if (status == "discarded") != archived:
            errors.append(f"{name}: status={status} and path {cat} contradict "
                          f"each other (discarded <=> _archive/)")

        if e.get("harness") not in VALID_HARNESS:
            errors.append(f"{name}: unknown harness {e.get('harness')!r}")

        parent = e.get("parent")
        if parent and parent not in index:
            errors.append(f"{name}: parent {parent!r} does not exist")
        elif parent and index[parent].get("arm") != e.get("arm"):
            notes.append(f"arm jump: {name} (arm={e['arm']}) descends from "
                         f"{parent} (arm={index[parent]['arm']})")

        for a in e.get("alias", []):
            if a in seen_alias:
                errors.append(f"alias {a!r} duplicated: {seen_alias[a]} and {name}")
            seen_alias[a] = name
            if a in index:
                errors.append(f"alias {a!r} collides with a workflow name")

        wf_dir, kind = resolve_dir(name, e)
        if wf_dir is None:
            errors.append(f"{name}: no directory found "
                          f"(neither {e['path']} nor an old name)")
            continue

        is_exact = cat.endswith("exact-coding/opus") or cat.endswith("exact-coding/sol")
        if is_exact and not has_test_list(wf_dir):
            errors.append(f"{name}: lives under exact-coding/ but has no "
                          f"test-list artefact")
        if not is_exact and has_test_list(wf_dir):
            errors.append(f"{name}: lives under {cat} but has a "
                          f"test-list artefact -> belongs in exact-coding/")
        if cat == "external" and not has_upstream_license(wf_dir):
            errors.append(f"{name}: under external/ but without LICENSE.upstream")

    # No directory may remain unregistered.
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
            errors.append(f"directory {rel} is not registered in LINEAGE.yaml")

    return errors, notes


def emit(index):
    aliases = {}
    for name, e in index.items():
        for a in e.get("alias", []):
            aliases[a] = name
        aliases[name] = name          # identity, so lookups never fail
    paths = {name: e["path"] for name, e in index.items()}

    (WORKFLOWS_DIR / "ALIASES.json").write_text(
        json.dumps(dict(sorted(aliases.items())), indent=2) + "\n", encoding="utf-8")
    (WORKFLOWS_DIR / "PATHS.json").write_text(
        json.dumps(dict(sorted(paths.items())), indent=2) + "\n", encoding="utf-8")
    return len(aliases), len(paths)


def inventory(data, index):
    """Markdown inventory for generate-snapshot-skeleton.py."""
    lines = ["| Workflow | Arm | Version | Harness | Status | Parent |",
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
            print(f"  note: {n}", file=sys.stderr)
        if errors:
            print(f"LINEAGE check: {len(errors)} errors", file=sys.stderr)
            for err in errors:
                print(f"  ERROR: {err}", file=sys.stderr)
            rc = 1
        else:
            print(f"LINEAGE check ok: {len(index)} workflows", file=sys.stderr)

    if "--emit" in args and rc == 0:
        na, np_ = emit(index)
        print(f"ALIASES.json: {na} entries, PATHS.json: {np_} entries", file=sys.stderr)

    return rc


if __name__ == "__main__":
    sys.exit(main())
