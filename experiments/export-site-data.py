#!/usr/bin/env python3
"""Export the results site's data from the lab.

Reads each main RQ's summary.json (written by aggregate-by-query.py), its
README frontmatter, experiments/workflows/LINEAGE.yaml and
experiments/metrics-registry.yaml, and writes JSON for the site under
site/src/data/ (gitignored). Statistics come from summary.json; this script
computes none of its own.

Usage:
  experiments/export-site-data.py
"""
from __future__ import annotations

import importlib.util
import json
import sys
from pathlib import Path

import yaml

# parse_frontmatter() lives in aggregate-by-query.py (same dir). Filename has a
# hyphen → load via spec.
_AGG = Path(__file__).resolve().parent / "aggregate-by-query.py"
_spec = importlib.util.spec_from_file_location("aggregate_by_query", _AGG)
agg = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(agg)

REPO_ROOT = Path(__file__).resolve().parent.parent
RESEARCH_DIR = REPO_ROOT / "research"
LINEAGE = REPO_ROOT / "experiments" / "workflows" / "LINEAGE.yaml"
REGISTRY = REPO_ROOT / "experiments" / "metrics-registry.yaml"
OUT_DIR = REPO_ROOT / "site" / "src" / "data"


# Frontmatter fields the RQ file carries only when they are set; the site
# reads a missing key as "not set".
OPTIONAL_FIELDS = ("controls", "closed")


class ExportError(Exception):
    """Metadata the site needs is missing; the export writes nothing."""


def site_value(stats: dict) -> dict | None:
    """One outcome's statistics in the site's ValueCell form; null when no
    usable run has a value, which the site shows as "not collected"."""
    if stats["n"] == 0:
        return None
    if stats["kind"] == "bool":
        return {"kind": "bool", "n": stats["n"], "k": stats["k"],
                "value": stats["k"] / stats["n"]}
    if stats["kind"] == "rate":
        return {"kind": "rate", "k": stats["k"], "t": stats["t"],
                "value": stats["k"] / stats["t"]}
    value = {"kind": "num", "n": stats["n"], "value": stats["mean"]}
    if "sd" in stats:
        value["sd"] = stats["sd"]
    return value


def workflow_style(workflow: str) -> str | None:
    """Which side of the test-list boundary a workflow is on; the site hides
    trophies for Skip-sensitive columns that span it. None when unknown."""
    uses = agg.uses_test_list(workflow)
    return None if uses is None else ("test list" if uses else "ad hoc")


def site_cell(cell: dict) -> dict:
    """One summary.json cell as a row of the site's result table."""
    return {"kata": cell["kata"], "workflow": cell["workflow"], "model": cell["model"],
            "runs": cell["runs"], "counts": cell["counts"],
            "values": {outcome: site_value(stats)
                       for outcome, stats in cell["outcomes"].items()}}


def rq_document(fm: dict, summary: dict, path: str) -> dict:
    """One RQ in the shape the site's result table and page header read."""
    cells = summary["cells"]
    document = {
        "id": fm["id"],
        "path": path,
        "question": fm["question"],
        "factors": fm["factors"],
        "min_replicates": fm["min_replicates"],
        "outcomes": fm["outcomes"],
        "katas": list(dict.fromkeys(cell["kata"] for cell in cells)),
        "cells": [site_cell(cell) for cell in cells],
        "workflowStyles": {workflow: workflow_style(workflow)
                           for workflow in dict.fromkeys(cell["workflow"] for cell in cells)},
    }
    document.update({field: fm[field] for field in OPTIONAL_FIELDS if fm.get(field)})
    return document


def repo_path(rq_dir: Path) -> str:
    """A main RQ's directory relative to the repo root; main RQs always sit at
    research/<subtree>/<dir>, so the path is its last three parts."""
    return "/".join(rq_dir.parts[-3:])


def main_rq_dirs(research_root: Path) -> list[Path]:
    """The main RQs the site publishes: every RQ under research/questions-*/.
    Workflow-development and kata RQs come later."""
    return sorted(readme.parent for readme in research_root.glob("questions-*/*/README.md"))


def workflow_descriptions(lineage_path: Path) -> dict[str, str | None]:
    """Every workflow in LINEAGE.yaml with its outsider description, if any."""
    lineage = yaml.safe_load(lineage_path.read_text())
    return {name: (entry or {}).get("description")
            for category in lineage["categories"].values()
            for name, entry in (category.get("workflows") or {}).items()}


def check_registry(fm: dict, registry: dict, registry_name: str) -> None:
    """Every declared outcome needs a registry entry to be shown at all."""
    for outcome in fm["outcomes"]:
        if outcome not in registry:
            raise ExportError(f"{fm['id']}: outcome {outcome} has no entry in {registry_name}")


def check_factors(fm: dict) -> None:
    """The page header states what the RQ varies; an RQ that varies nothing
    has no table to explain."""
    if not fm.get("factors"):
        raise ExportError(f"{fm['id']}: no factors")


def site_workflows(referenced: list[str], descriptions: dict, lineage_name: str) -> dict:
    """workflows.json: the description of every workflow a table names."""
    for name in referenced:
        if not descriptions.get(name):
            raise ExportError(f"workflow {name} has no description in {lineage_name}")
    return {name: {"description": descriptions[name]} for name in sorted(referenced)}


def write_site_data(out_dir: Path, documents: list[dict], workflows: dict) -> None:
    (out_dir / "rq").mkdir(parents=True, exist_ok=True)
    for document in documents:
        (out_dir / "rq" / f"{document['id']}.json").write_text(
            json.dumps(document, indent=2) + "\n")
    (out_dir / "workflows.json").write_text(json.dumps(workflows, indent=2) + "\n")


def export(rq_dirs: list[Path], lineage_path: Path, registry_path: Path,
           out_dir: Path) -> None:
    """Build every file first and write only when nothing is missing."""
    registry = yaml.safe_load(registry_path.read_text())
    documents = []
    for rq_dir in rq_dirs:
        fm = agg.parse_frontmatter(rq_dir / "README.md")
        check_registry(fm, registry, registry_path.name)
        check_factors(fm)
        documents.append(rq_document(fm, json.loads((rq_dir / "summary.json").read_text()),
                                     repo_path(rq_dir)))
    referenced = list(dict.fromkeys(cell["workflow"] for document in documents
                                    for cell in document["cells"]))
    workflows = site_workflows(referenced, workflow_descriptions(lineage_path),
                               lineage_path.name)
    write_site_data(out_dir, documents, workflows)


def main() -> int:
    try:
        export(main_rq_dirs(RESEARCH_DIR), LINEAGE, REGISTRY, OUT_DIR)
    except ExportError as stop:
        print(f"export-site-data: {stop}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
