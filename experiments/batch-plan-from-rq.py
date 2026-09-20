#!/usr/bin/env python3
"""Generate a batch plan covering all runs missing for a research question.

Reads a research question's frontmatter, expands the (factors × controls)
to cells, counts existing matching runs in experiments/runs/, and emits a
batch plan (JSON consumed by experiments/docker/run-batch.sh) with
exactly enough triples to fill every cell up to min_replicates.

Usage:
  experiments/batch-plan-from-rq.py research/questions-claude/2.1-model-effect-code-quality/
  experiments/batch-plan-from-rq.py research/questions-claude/2.1-model-effect-code-quality/ --out my-plan.json
  experiments/batch-plan-from-rq.py research/questions-claude/2.1-model-effect-code-quality/ --dry-run

Default output path: experiments/batch-plans/<rq-id-lower>-fill.json
"""
from __future__ import annotations

import argparse
import importlib.util
import json
import sys
from pathlib import Path

# Reuse parse_frontmatter, expand_cells, kata_for_cell, matches_cell, RUNS_DIR
# from aggregate-by-query.py (same dir). Filename has a hyphen → load via spec.
_AGG = Path(__file__).resolve().parent / "aggregate-by-query.py"
_spec = importlib.util.spec_from_file_location("aggregate_by_query", _AGG)
agg = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(agg)  # type: ignore[union-attr]

REPO_ROOT = Path(__file__).resolve().parent.parent
DEFAULT_PLANS_DIR = REPO_ROOT / "experiments" / "batch-plans"


def count_runs_per_cell(cells: list[dict]) -> dict[tuple, int]:
    """Return {cell_key: n_existing} for each cell."""
    counts: dict[tuple, int] = {}
    for cell in cells:
        counts[agg.cell_key(cell)] = 0

    for run_dir in agg.RUNS_DIR.iterdir():
        if run_dir.name.startswith("_"):
            continue  # skip _archive/ and other underscore-prefixed dirs
        m_file = run_dir / "metrics.json"
        if not m_file.is_file():
            continue
        try:
            metrics = json.loads(m_file.read_text())
        except json.JSONDecodeError:
            continue
        for cell in cells:
            if agg.matches_cell(metrics, cell):
                counts[agg.cell_key(cell)] += 1
                break
    return counts


WORKFLOWS_DIR = REPO_ROOT / "experiments" / "workflows"

sys.path.insert(0, str(Path(__file__).resolve().parent))
from workflow_paths import workflow_dir as resolve_workflow_dir

# Harness marker dir → the model-name suffix that harness's run-batch.sh branch
# can resolve. Mirrors the harness detection in run-batch.sh (~line 450), which
# keys off the same marker dirs.
_HARNESS_MARKERS = (
    (".pi", "pi"),
    (".opencode", "opencode"),
    (".cursor", "cursor"),
    (".claude", "claude"),
)


def harness_of(workflow: str) -> str | None:
    """Which harness runs this workflow, from its marker dir.

    Returns None when the workflow dir is absent (plan generation should not
    fail on that — run-batch.sh reports it per run).

    Resolved through workflow_paths, so both the current name and any old name
    an RQ still carries land on the same directory.
    """
    wf_dir = resolve_workflow_dir(workflow)
    for marker, harness in _HARNESS_MARKERS:
        if (wf_dir / marker).is_dir():
            return harness
    return None


RUN_BATCH = REPO_ROOT / "experiments" / "docker" / "run-batch.sh"

# Which shell variable each harness assigns in its model case-mapping.
_HARNESS_MODEL_VAR = {
    "pi": "pi_model",
    "opencode": "oc_model",
    "cursor": "cursor_model",
}

_known_cache: dict[str, set[str]] = {}


def models_known_to(harness: str) -> set[str]:
    """Model names the harness's case-mapping in run-batch.sh can resolve.

    Parsed from the script rather than duplicated here — a hardcoded copy would
    drift the moment a model is added, and the failure mode of drift is a dead
    batch run. Lines look like:

        opus-cursor)     cursor_model="claude-opus-4-8-medium" ;;

    so the label before `)` is the lab-variant name. On any parse trouble
    return an empty set, which makes runnable_model fall back to current
    behaviour instead of guessing.
    """
    var = _HARNESS_MODEL_VAR.get(harness)
    if var is None:
        return set()
    if harness in _known_cache:
        return _known_cache[harness]

    names: set[str] = set()
    try:
        for line in RUN_BATCH.read_text().splitlines():
            stripped = line.strip()
            if f'{var}="' not in stripped or ")" not in stripped:
                continue
            label = stripped.split(")", 1)[0].strip()
            # Skip the `*)` default branch and anything not a plain model name.
            if label and label != "*" and all(
                c.isalnum() or c in "-._" for c in label
            ):
                names.add(label)
    except OSError:
        return set()

    _known_cache[harness] = names
    return names


def runnable_model(cell: dict) -> str:
    """Pick the model alternative the cell's harness can actually run.

    `expand_cells` sets cell["model"] to the FIRST entry of an
    `{any: [...]}` OR-match. That is right for aggregation — it is the
    canonical cell label — but wrong for plan generation when the
    alternatives are per-harness spellings of the same model. A cross-harness
    RQ with

        controls.model: {any: [opus-4-8-requesty, opus-4-8, opus-cursor]}

    would label EVERY workflow's runs `opus-4-8-requesty`; the cursor branch
    of run-batch.sh has no mapping for that name, so those runs die with
    error-2 before the agent starts. Same failure mode for the pi branch,
    which needs the bare `opus-4-8`.

    Rule: pick the first alternative that the harness's own case-mapping in
    run-batch.sh actually knows. Falls back to the canonical first entry when
    nothing matches, so behaviour is unchanged for CC and for single-spelling
    cells — and a genuinely unmappable model still fails loudly in run-batch.sh
    rather than being silently swapped here.
    """
    alts = cell.get("model_alts") or [cell["model"]]
    if len(alts) == 1:
        return alts[0]

    harness = harness_of(cell["workflow"])
    if harness in (None, "claude"):
        return cell["model"]

    known = models_known_to(harness)
    if known:
        for alt in alts:
            if alt in known:
                return alt
    return cell["model"]


def build_plan(fm: dict, cells: list[dict], counts: dict[tuple, int]) -> dict:
    rq_id = fm.get("id", "?")
    min_rep = int(fm.get("min_replicates", 1))

    runs = []
    relabelled: list[str] = []
    unfillable: list[str] = []
    for cell in cells:
        key = agg.cell_key(cell)
        model = runnable_model(cell)
        if model != cell["model"]:
            relabelled.append(f"{cell['workflow']}: {cell['model']} → {model}")
        missing = max(0, min_rep - counts[key])
        # A cell that accepts only runs from before harness_version was
        # recorded cannot be topped up: a fresh run always stamps the current
        # CLI. Emitting runs for it would refill on every invocation and never
        # close the gap, so report the shortfall instead of planning it away.
        if missing and cell.get("harness_alts") == [agg.UNRECORDED]:
            unfillable.append(f"{key[0]} × {key[1]} × {key[2]}: "
                              f"{counts[key]}/{min_rep}")
            continue
        for _ in range(missing):
            runs.append({
                "kata": key[0],
                "workflow": key[1],
                "model": model,
                "stack": cell.get("stack", "typescript-vitest"),
            })

    if relabelled:
        for line in sorted(set(relabelled)):
            print(f"  harness-specific model label — {line}", file=sys.stderr)

    if unfillable:
        for line in sorted(set(unfillable)):
            print(f"  cannot be filled (harness_version: {agg.UNRECORDED}) — {line}",
                  file=sys.stderr)

    return {
        "name": f"{rq_id} fill",
        "description": (
            f"Auto-generated to bring every cell of {rq_id} up to "
            f"min_replicates={min_rep}. Generated by "
            f"experiments/batch-plan-from-rq.py."
        ),
        "runs": runs,
    }


def main(argv: list[str]) -> int:
    parser = argparse.ArgumentParser(
        description=__doc__,
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    parser.add_argument("rq_path", type=Path,
                        help="path to RQ dir (or its README.md)")
    parser.add_argument("--out", type=Path, default=None,
                        help="output JSON path "
                             "(default: experiments/batch-plans/<rq>-fill.json)")
    parser.add_argument("--dry-run", action="store_true",
                        help="print plan to stdout instead of writing file")
    args = parser.parse_args(argv)

    md_in = args.rq_path / "README.md" if args.rq_path.is_dir() else args.rq_path
    if not md_in.is_file():
        print(f"Not found: {md_in}", file=sys.stderr)
        return 1

    fm = agg.parse_frontmatter(md_in)
    cells = agg.expand_cells(fm)
    counts = count_runs_per_cell(cells)
    plan = build_plan(fm, cells, counts)

    rq_id = fm.get("id", "rq")
    n_cells = len(cells)
    n_full = sum(1 for c in cells
                 if counts[agg.cell_key(c)] >= int(fm.get("min_replicates", 1)))
    n_missing = len(plan["runs"])

    print(f"{rq_id}: {n_cells} cells, {n_full} already at min_replicates, "
          f"{n_missing} runs needed", file=sys.stderr)

    if args.dry_run:
        print(json.dumps(plan, indent=2))
        return 0

    if args.out is None:
        out_name = f"{rq_id.lower()}-fill.json"
        out_path = DEFAULT_PLANS_DIR / out_name
    else:
        out_path = args.out

    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(json.dumps(plan, indent=2) + "\n")
    print(f"  wrote {out_path}", file=sys.stderr)
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
