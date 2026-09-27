#!/usr/bin/env python3
"""Show, for every research question, the facts that decide whether it needs work.

Per RQ: cells at min_replicates / cells declared, matched runs, findings in
findings.md, and runs newer than the last change to findings.md. Nothing is
stored; everything is recomputed from experiments/runs/ and the RQ directory
with the same selector logic as aggregate-by-query.py (rules: rq_facts.py).

An RQ needs attention when a cell is short, findings.md has no finding, or runs
arrived after the findings were written. RQs with `closed: "<reason>"` in their
frontmatter are shown with the reason and never count as needing attention.

Nothing is written.

Usage:
  experiments/rq-status.py          # every RQ, those needing attention first
  experiments/rq-status.py --open   # only RQs needing attention
"""
from __future__ import annotations

import argparse
import importlib.util
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from rq_facts import count_findings, findings_timestamp, run_timestamp  # noqa: E402

REPO_ROOT = Path(__file__).resolve().parent.parent


def _aggregator():
    """aggregate-by-query.py laden (Bindestrich im Namen -> kein normaler Import)."""
    spec = importlib.util.spec_from_file_location(
        "aggregate_by_query", REPO_ROOT / "experiments" / "aggregate-by-query.py")
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


def load_runs(runs_dir: Path) -> list[tuple[str, dict]]:
    runs = []
    for run_dir in sorted(runs_dir.iterdir()):
        if run_dir.name.startswith("_"):
            continue
        m_file = run_dir / "metrics.json"
        if not m_file.is_file():
            continue
        try:
            runs.append((run_dir.name, json.loads(m_file.read_text())))
        except json.JSONDecodeError:
            continue
    return runs


def rq_readmes() -> list[Path]:
    """Every README under research/<tree>/<rq>/ that carries an `id:` line."""
    out = []
    for readme in sorted((REPO_ROOT / "research").glob("*/*/README.md")):
        head = readme.read_text().split("\n", 40)
        if head[0] == "---" and any(line.startswith("id:") for line in head):
            out.append(readme)
    return out


def facts(agg, readme: Path, runs: list[tuple[str, dict]]) -> dict:
    fm = agg.parse_frontmatter(readme)
    cells = agg.expand_cells(fm)
    min_rep = fm.get("min_replicates", 1)

    # Same first-match rule as collect_runs: a run belongs to one cell only.
    counts = [0] * len(cells)
    matched: list[str] = []
    for run_id, metrics in runs:
        for i, cell in enumerate(cells):
            if agg.matches_cell(metrics, cell):
                counts[i] += 1
                matched.append(run_id)
                break

    findings_md = readme.parent / "findings.md"
    since = findings_timestamp(findings_md)
    newer = 0
    if since is not None:
        newer = sum(1 for r in matched if (run_timestamp(r) or 0) > since)

    return {
        "id": fm.get("id", "?"),
        "closed": str(fm["closed"]).strip() if fm.get("closed") else "",
        "full": sum(1 for n in counts if n >= min_rep),
        "cells": len(cells),
        "runs": len(matched),
        "findings": count_findings(findings_md),
        "newer": newer,
    }


def needs_attention(f: dict) -> bool:
    if f.get("error"):
        return True
    if f["closed"]:
        return False
    return f["full"] < f["cells"] or f["findings"] == 0 or f["newer"] > 0


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    ap.add_argument("--open", action="store_true",
                    help="only RQs with a short cell, no findings, or runs newer than the findings")
    args = ap.parse_args()

    agg = _aggregator()
    runs = load_runs(agg.RUNS_DIR)

    rows = []
    for readme in rq_readmes():
        rel = str(readme.parent.relative_to(REPO_ROOT))
        try:
            f = facts(agg, readme, runs)
        except (SystemExit, Exception) as exc:  # a broken frontmatter must not hide the rest
            f = {"id": "?", "error": str(exc).splitlines()[0][:100]}
        f["path"] = rel
        rows.append(f)

    if args.open:
        rows = [f for f in rows if needs_attention(f)]
    rows.sort(key=lambda f: (not needs_attention(f), bool(f.get("closed")), f["path"]))

    width = max((len(f["id"]) for f in rows), default=0)
    print(f"{'':1} {'id':<{width}}  {'cells':>7}  {'runs':>4}  {'F':>3}  {'newer':>5}  path")
    for f in rows:
        mark = "!" if needs_attention(f) else " "
        if f.get("error"):
            print(f"{mark} {f['id']:<{width}}  ERROR {f['error']}  ({f['path']})")
            continue
        tail = f"  closed: {f['closed']}" if f["closed"] else ""
        print(f"{mark} {f['id']:<{width}}  {f['full']:>3}/{f['cells']:<3}  {f['runs']:>4}  "
              f"{f['findings']:>3}  {f['newer']:>5}  {f['path']}{tail}")

    n_open = sum(1 for f in rows if needs_attention(f))
    print(f"\n{len(rows)} RQs shown · {n_open} need attention (!)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
