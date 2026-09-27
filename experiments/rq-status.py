#!/usr/bin/env python3
"""Show the derived state of every research question.

The state is not stored anywhere; it is computed from the run pool and each
RQ's findings.md (see rq_state.py for the rules). This walks every RQ README
under research/, matches its cells against experiments/runs/ with the same
selector logic as aggregate-by-query.py, and prints one line per RQ.

Nothing is written. Use it to answer "what is still open?" without trusting a
summary.md that may predate the latest runs.

Usage:
  experiments/rq-status.py              # every RQ, grouped by state
  experiments/rq-status.py --open       # only planned / filling / unanalysed
  experiments/rq-status.py --state filling
"""
from __future__ import annotations

import argparse
import importlib.util
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from rq_state import STATES, derive_state  # noqa: E402

REPO_ROOT = Path(__file__).resolve().parent.parent
OPEN_STATES = {"planned", "filling", "unanalysed"}


def _aggregator():
    """aggregate-by-query.py laden (Bindestrich im Namen -> kein normaler Import)."""
    spec = importlib.util.spec_from_file_location(
        "aggregate_by_query", REPO_ROOT / "experiments" / "aggregate-by-query.py")
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


def load_runs(runs_dir: Path) -> list[dict]:
    runs = []
    for run_dir in sorted(runs_dir.iterdir()):
        if run_dir.name.startswith("_"):
            continue
        m_file = run_dir / "metrics.json"
        if not m_file.is_file():
            continue
        try:
            runs.append(json.loads(m_file.read_text()))
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


def cell_counts(agg, cells: list[dict], runs: list[dict]) -> list[int]:
    # Same first-match rule as collect_runs: a run belongs to one cell only.
    counts = [0] * len(cells)
    for metrics in runs:
        for i, cell in enumerate(cells):
            if agg.matches_cell(metrics, cell):
                counts[i] += 1
                break
    return counts


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    ap.add_argument("--open", action="store_true",
                    help="only RQs that still need runs or findings")
    ap.add_argument("--state", choices=STATES, help="only RQs in this state")
    args = ap.parse_args()

    agg = _aggregator()
    runs = load_runs(agg.RUNS_DIR)

    rows = []
    for readme in rq_readmes():
        rel = readme.parent.relative_to(REPO_ROOT)
        try:
            fm = agg.parse_frontmatter(readme)
            cells = agg.expand_cells(fm)
            counts = cell_counts(agg, cells, runs)
            state, reason = derive_state(fm, readme.parent, counts)
            rq_id = fm.get("id", "?")
        except (SystemExit, Exception) as exc:  # a broken frontmatter must not hide the rest
            state, reason, rq_id = "error", str(exc).splitlines()[0][:100], "?"
        rows.append((state, rq_id, reason, str(rel)))

    if args.open:
        rows = [r for r in rows if r[0] in OPEN_STATES or r[0] == "error"]
    if args.state:
        rows = [r for r in rows if r[0] == args.state]

    order = {s: i for i, s in enumerate(("error", "planned", "filling",
                                         "unanalysed", "answered", "closed"))}
    rows.sort(key=lambda r: (order.get(r[0], 99), r[3]))

    width = max((len(r[1]) for r in rows), default=0)
    for state, rq_id, reason, rel in rows:
        print(f"{state:<10}  {rq_id:<{width}}  {reason}  ({rel})")

    totals: dict[str, int] = {}
    for r in rows:
        totals[r[0]] = totals.get(r[0], 0) + 1
    print("\n" + " · ".join(f"{s} {totals[s]}" for s in sorted(totals, key=lambda s: order.get(s, 99))))
    return 0


if __name__ == "__main__":
    sys.exit(main())
