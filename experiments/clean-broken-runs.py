#!/usr/bin/env python3
"""Delete the broken runs from the run pool so the next fill run refills them.

A run is broken when it is not a replicate: it ended with anything but `ok`
(timeout, infrastructure abort, provider refusal) or never ended at all (a stub
without exit_reason). Every broken run in experiments/runs/ is deleted, whether
an RQ selects it or not and whether it is committed or not; underscore- and
dot-prefixed directories such as _archive/ and .pnpm-store/ are not runs and stay
untouched. A run directory without a readable metrics.json is not judged while git
tracks something in it: it stays and is reported. When git tracks nothing in it,
it is a leftover of a run deleted earlier with `git rm` (its ignored files such
as node_modules/ stay behind) and is deleted too, outside the commit.

Afterwards every RQ that selected a deleted run is re-aggregated; one naming an
archived workflow is skipped with a note. The deleted run directories and the
re-aggregated RQ files go into one commit on the current branch, nothing else;
nothing is pushed. A deleted run that was committed stays recoverable from git
history, an uncommitted one does not.

Refuses, deleting nothing, while a batch or batch-retry container runs or when
Docker cannot be reached -- the same lock as aggregate-by-query.py. Runs only on
the user's call.

Exit code: 0 when everything was done (also when there was nothing to delete),
1 when the lock refused or an affected RQ could not be read or re-aggregated.

Usage:
  experiments/clean-broken-runs.py

Story: site/docs/stories/done/2026-10-12_06_broken-run-cleanup.md
"""
from __future__ import annotations

import importlib.util
import json
import re
import shutil
import subprocess
import sys
from collections.abc import Callable
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from rq_facts import is_replicate
from workflow_paths import is_archived

# Reuse the batch lock, parse_frontmatter, expand_cells and matches_cell from
# aggregate-by-query.py (same dir). Filename has a hyphen -> load via spec.
_AGG = Path(__file__).resolve().parent / "aggregate-by-query.py"
_spec = importlib.util.spec_from_file_location("aggregate_by_query", _AGG)
agg = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(agg)  # type: ignore[union-attr]

REPO_ROOT = Path(__file__).resolve().parent.parent
RQ_OUTPUTS = ("runs.csv", "summary.json", "summary.md")


def is_broken(metrics: dict) -> bool:
    """Every run that is not a replicate: it ended other than ok, or never ended."""
    return not is_replicate(metrics)


def scan_pool(runs_dir: Path) -> tuple[dict[Path, dict], list[Path]]:
    """The broken runs with their metrics, and the run directories whose
    metrics.json is missing or unreadable."""
    broken: dict[Path, dict] = {}
    unreadable: list[Path] = []
    for run_dir in sorted(runs_dir.iterdir()):
        if run_dir.name.startswith(("_", ".")) or not run_dir.is_dir():
            continue
        try:
            metrics = json.loads((run_dir / "metrics.json").read_text())
        except (OSError, json.JSONDecodeError):
            unreadable.append(run_dir)
            continue
        if is_broken(metrics):
            broken[run_dir] = metrics
    return broken, unreadable


def research_questions(research_dir: Path) -> list[Path]:
    """Every RQ directory: research/<tree>/<rq>/ whose README.md has an id: line."""
    return [readme.parent for readme in sorted(research_dir.glob("*/*/README.md"))
            if re.search(r"^id:", readme.read_text(), re.M)]


class Reaggregation:
    """What happens to the RQs once the broken runs are gone.

    A plain class: a dataclass needs its module in sys.modules, which a script
    loaded by file name (load_script, the spec loaders) is not."""

    def __init__(self) -> None:
        self.targets: list[tuple[Path, str]] = []
        self.archived: list[str] = []
        self.failed: list[str] = []
        self.done: list[tuple[Path, str]] = []


def plan_reaggregation(rq_dirs: list[Path], deleted: list[dict], root: Path) -> Reaggregation:
    """The RQs whose selector matches at least one deleted run. One naming an
    archived workflow is set aside; one whose README cannot be read counts as
    failed, since nobody can say whether it was affected."""
    plan = Reaggregation()
    for rq_dir in rq_dirs:
        try:
            fm = agg.parse_frontmatter(rq_dir / "README.md")
            cells = agg.expand_cells(fm)
        except (SystemExit, Exception):  # parse_frontmatter() exits on a bad README
            plan.failed.append(str(rq_dir.relative_to(root)))
            continue
        if not any(agg.matches_cell(m, c) for m in deleted for c in cells):
            continue
        rq_id = fm.get("id", rq_dir.name)
        if any(is_archived(w) for c in cells for w in c["workflow_alts"]):
            plan.archived.append(rq_id)
        else:
            plan.targets.append((rq_dir, rq_id))
    return plan


def run_aggregator(rq_dir: Path) -> bool:
    return subprocess.run([sys.executable, str(_AGG), str(rq_dir)], check=False).returncode == 0


def git(root: Path, *args: str) -> subprocess.CompletedProcess:
    return subprocess.run(["git", *args], cwd=root, capture_output=True, text=True, check=False)


def is_tracked(root: Path, path: Path) -> bool:
    return bool(git(root, "ls-files", "--", str(path.relative_to(root))).stdout.strip())


def commit_message(broken: dict[Path, dict], rq_ids: list[str]) -> str:
    runs = [f"- {run_dir.name}  {(m.get('run_status') or {}).get('exit_reason') or 'unfinished'}"
            for run_dir, m in sorted(broken.items())]
    return "\n".join([f"Delete {len(broken)} broken run{'s' if len(broken) > 1 else ''}", "",
                      *runs, "", f"Re-aggregated: {', '.join(rq_ids) or 'none'}", ""])


def commit(root: Path, paths: list[Path], message: str) -> bool:
    """Commit exactly these paths, leaving every other change where it is.
    False when they hold nothing to commit."""
    if not paths:
        return False
    specs = [str(p.relative_to(root)) for p in paths]
    git(root, "add", "-A", "--", *specs)
    if git(root, "diff", "--cached", "--quiet", "--", *specs).returncode == 0:
        return False
    result = git(root, "commit", "-q", "-m", message, "--", *specs)
    if result.returncode != 0:
        raise SystemExit(f"git commit failed: {result.stderr.strip()}")
    return True


def remove_leftovers(root: Path, unreadable: list[Path]) -> list[Path]:
    """Delete the run directories git tracks nothing in; return the others."""
    kept = []
    for run_dir in unreadable:
        if is_tracked(root, run_dir):
            kept.append(run_dir)
        else:
            shutil.rmtree(run_dir)
            print(f"  deleted leftover {run_dir.relative_to(root)}: nothing tracked, "
                  f"no metrics.json", file=sys.stderr)
    return kept


def report(root: Path, kept: list[Path], plan: Reaggregation) -> None:
    for run_dir in kept:
        print(f"  kept {run_dir.relative_to(root)}: no readable metrics.json", file=sys.stderr)
    for rq_id in plan.archived:
        print(f"  note: {rq_id} names an archived workflow; not re-aggregated, "
              f"run aggregate-by-query.py --allow-archived on it", file=sys.stderr)
    for rq in plan.failed:
        print(f"  ERROR: {rq} could not be re-aggregated", file=sys.stderr)


def clean(root: Path, reaggregate: Callable[[Path], bool] = run_aggregator) -> int:
    refusal = agg.batch_lock_refusal()
    if refusal:
        print(f"ERROR: {refusal}", file=sys.stderr)
        return 1

    broken, unreadable = scan_pool(root / "experiments" / "runs")
    kept = remove_leftovers(root, unreadable)
    if not broken:
        print("no broken runs", file=sys.stderr)
        report(root, kept, Reaggregation())
        return 0

    plan = plan_reaggregation(research_questions(root / "research"), list(broken.values()), root)
    tracked = [run_dir for run_dir in broken if is_tracked(root, run_dir)]
    for run_dir in broken:
        shutil.rmtree(run_dir)
    print(f"deleted {len(broken)} broken run(s)", file=sys.stderr)

    for rq_dir, rq_id in plan.targets:
        if reaggregate(rq_dir):
            plan.done.append((rq_dir, rq_id))
        else:
            plan.failed.append(rq_id)

    outputs = [rq_dir / name for rq_dir, _ in plan.done for name in RQ_OUTPUTS
               if (rq_dir / name).exists()]
    if not commit(root, tracked + outputs, commit_message(broken, [i for _, i in plan.done])):
        print("  nothing to commit", file=sys.stderr)
    report(root, kept, plan)
    return 1 if plan.failed else 0


def main(argv: list[str]) -> int:
    if len(argv) > 1:
        print(__doc__, file=sys.stderr)
        return 2
    return clean(REPO_ROOT)


if __name__ == "__main__":
    sys.exit(main(sys.argv))
