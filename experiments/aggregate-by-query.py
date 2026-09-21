#!/usr/bin/env python3
"""Aggregate run metrics by research-question selector query.

Reads a research question's README.md frontmatter (factors + controls),
expands it to a list of (kata_base, prompt, workflow, model) cells, then
collects ALL matching runs from experiments/runs/ — independent of which
batch produced them.

Outputs into the RQ directory:
  runs.csv     — one row per matched run, all metrics
  summary.md   — per-cell pivots (avg/rate) for each declared outcome

`harness_version` is an optional fourth selector axis, as a control or a
factor. Declare it only when a CLI bump is a live factor — otherwise a cell
spans whatever CLI versions produced its runs, which is the right default.
Values are bare version tokens ('2.1.267', matching the stored
'2.1.267 (Claude Code)') or the sentinel 'unrecorded' for runs from before
run-batch.sh captured the field.

Aborts when a selector names a workflow under experiments/workflows/_archive/ —
those are superseded or correctness-defective, and their runs stay in the flat
runs pool without any archive marker. Pass --allow-archived when an RQ evaluates
an archived workflow on purpose.

Usage:
  experiments/aggregate-by-query.py research/questions-claude/2.1-model-effect-code-quality/
  experiments/aggregate-by-query.py research/questions-claude/2.1-model-effect-code-quality/README.md
  experiments/aggregate-by-query.py research/workflow-dev/1.10-refactor-vocab-effect-v62/ --allow-archived
"""
from __future__ import annotations

import json
import sys
from datetime import datetime, timezone
from itertools import product
from pathlib import Path

import pandas as pd
import yaml

sys.path.insert(0, str(Path(__file__).resolve().parent))
from workflow_paths import (canonical as canonical_workflow, is_archived,
                            workflow_dir)

REPO_ROOT = Path(__file__).resolve().parent.parent
RUNS_DIR = REPO_ROOT / "experiments" / "runs"
WORKFLOWS_DIR = REPO_ROOT / "experiments" / "workflows"

CSV_COLUMNS = [
    "kata", "stack", "workflow", "cell_workflow", "model", "cell_model", "cli_model",
    "harness_version", "cell_harness",
    "thinking", "run_id",
    "exit_code", "exit_reason", "rate_limited", "completed_within_budget",
    "analyze_status",
    "duration_seconds", "total_tokens", "context_utilization_pct",
    "cycle_count", "avg_cycle_seconds", "avg_red_seconds",
    "avg_green_seconds", "avg_refactor_seconds", "refactorings_applied",
    "predictions_correct", "predictions_total", "tests_passed_immediately",
    "test_blocks", "test_cases_total", "test_cases_first_block",
    "red_verified", "red_unverified", "tcr_refactor_steps",
    "tcr_method_commits", "tcr_red_commits", "tcr_green_commits",
    "tcr_refactor_commits",
    "tests_passing", "tests_total", "todos_remaining",
    "lines_of_code", "test_lines", "code_mass", "mutation_score",
    "mutants_total", "mutants_survived", "cost_usd",
    "coverage_statements_pct", "coverage_branches_pct",
    "cc_loc", "cc_functions", "cc_longest_function",
    "cc_avg_loc_per_function", "cc_median_loc_per_function", "cc_imports",
    "smell_total", "smell_complexity", "smell_duplication",
    "smell_magic_numbers", "smell_code_quality",
    "mccabe_max", "mccabe_avg", "mccabe_high_count",
    "cognitive_max", "cognitive_avg", "cognitive_high_count",
    "unit_count", "unit_size_max", "unit_size_avg", "unit_size_median",
    "verification_total", "verification_passed", "verification_pct",
    "cli_built",
]

# Sentinel for `harness_version` runs recorded before run-batch.sh started
# capturing the field (2026-09). An empty value means "not recorded" — NOT
# "same version as everything else"; for those runs the run date is the only
# evidence of which CLI produced them.
UNRECORDED = "unrecorded"

# `harness_version` would give the clumsy `harness_version_alts`; every other
# selector axis keeps its own name.
ALTS_NAME = {"harness_version": "harness"}

# -----------------------------------------------------------------------
# Frontmatter parsing
# -----------------------------------------------------------------------

def parse_frontmatter(md_path: Path) -> dict:
    text = md_path.read_text()
    if not text.startswith("---\n"):
        raise SystemExit(f"{md_path}: no YAML frontmatter (must start with ---)")
    _, fm, _body = text.split("---\n", 2)
    return yaml.safe_load(fm)


def expand_cells(fm: dict) -> list[dict]:
    """Cartesian product of factors × controls → list of cell dicts.

    Each cell is a dict with keys: kata_base, prompt, workflow, model.
    Special factor `workflow_x_prompt` is a paired list of {workflow, prompt}.
    Special factor `model_x_workflow` is a paired list of {model, workflow} —
    use it when model and harness (encoded in the workflow suffix) vary together
    as coupled bundles rather than as an independent cross-product. Each entry's
    model/workflow may itself be an `{any: [...]}` OR-match (normalized below).
    """
    factors = fm.get("factors") or {}
    controls = fm.get("controls") or {}

    # Each axis becomes a list of partial dicts. We then take the cartesian
    # product across axes and merge.
    axes: list[list[dict]] = []

    for key, values in factors.items():
        if key == "workflow_x_prompt":
            axes.append([{"workflow": p["workflow"], "prompt": p["prompt"]}
                         for p in values])
        elif key == "model_x_workflow":
            axes.append([{"model": p["model"], "workflow": p["workflow"]}
                         for p in values])
        else:
            axes.append([{key: v} for v in values])

    if not axes:
        axes = [[{}]]

    cells = []
    for combo in product(*axes):
        cell = dict(controls)  # start from controls
        for partial in combo:
            cell.update(partial)
        cells.append(cell)

    # Sanity: each cell needs kata_base, workflow, model. prompt is optional
    # only if kata_base is already a full kata id (legacy); we always require
    # prompt today.
    for cell in cells:
        for required in ("kata_base", "workflow", "model"):
            if required not in cell:
                raise SystemExit(f"cell missing '{required}': {cell}")

        # Allow controls.model to be an OR-match. Three accepted forms:
        #   model: opus-4-7-no-thinking                 # scalar (single match)
        #   model: [opus-4-7-portkey, opus-4-7]         # bare list (OR-match)
        #   model: {any: [opus-4-7-portkey, opus-4-7]}  # explicit OR-match
        # The explicit form is preferred for new RQs — it documents the OR
        # semantics directly in the YAML. First entry is the canonical model
        # used for plan generation and cell labelling; all entries match in
        # aggregation.
        normalize_alts(cell, "model")

        # Allow controls.workflow to be an OR-match, same three forms as model.
        # Use case: an outcome-neutral workflow bugfix (e.g. v6.2 -> v6.2.1)
        # where old clean runs and new replacement runs must aggregate into
        # the SAME cell. First entry is canonical (cell label + plan gen);
        # all entries match in aggregation.
        normalize_alts(cell, "workflow")
        # Alt-Namen auf die aktuellen ziehen. Eine RQ darf weiter
        # exact-hybrid-v2-testlist-fix-cc nennen; gematcht und beschriftet
        # wird trotzdem exact-hybrid-v2-testlist-fix-cc.
        cell["workflow_alts"] = [canonical_workflow(w) for w in cell["workflow_alts"]]
        cell["workflow"] = cell["workflow_alts"][0]

        # harness_version is optional and absent from almost every RQ. When a
        # cell does not declare it, harness_alts stays None and no filtering
        # happens — the pre-2026-09 behaviour, where a cell spans whatever CLI
        # versions produced its runs.
        normalize_alts(cell, "harness_version", required=False)

    return cells


def normalize_alts(cell: dict, key: str, required: bool = True) -> None:
    """Normalize cell[key] into a canonical scalar + a `<key>_alts` list.

    Accepts the three OR-match forms (scalar, bare list, {any: [...]}) that
    controls.model documented first. The first entry becomes canonical — it is
    the cell label in summary.md and the value plan generation emits — while
    every entry matches during aggregation.

    With required=False an absent key yields `<key>_alts = None`, which
    matches_cell() reads as "do not filter on this axis".
    """
    alts_key = f"{ALTS_NAME.get(key, key)}_alts"

    if key not in cell:
        if required:
            raise SystemExit(f"cell missing '{key}': {cell}")
        cell[alts_key] = None
        return

    value = cell[key]
    if isinstance(value, dict):
        if "any" not in value or not isinstance(value["any"], list) or not value["any"]:
            raise SystemExit(
                f"cell {key} mapping must be {{any: [...]}} with non-empty list: {cell}"
            )
        cell[alts_key] = [str(v) for v in value["any"]]
    elif isinstance(value, list):
        if not value:
            raise SystemExit(f"cell has empty {key} list: {cell}")
        cell[alts_key] = [str(v) for v in value]
    else:
        cell[alts_key] = [str(value)]

    cell[key] = cell[alts_key][0]


# -----------------------------------------------------------------------
# Run matching
# -----------------------------------------------------------------------

def kata_for_cell(cell: dict) -> str:
    """Resolve effective kata id from kata_base + prompt."""
    base = cell["kata_base"]
    prompt = cell.get("prompt")
    return f"{base}-{prompt}" if prompt else base


def cell_key(cell: dict) -> tuple:
    """Identity of a cell for counting and coverage.

    Includes the canonical harness so a CLI period control — the same model on
    two CLI versions — stays two cells instead of collapsing into one. Cells
    that do not declare harness_version all share the same empty slot, which
    keeps the key shape stable for every RQ that ignores the axis.
    """
    return (kata_for_cell(cell), cell["workflow"], cell["model"],
            cell.get("harness_version", ""))


def harness_of_run(metrics: dict) -> str:
    """Version token of a run's harness_version, or UNRECORDED.

    metrics.json stores the full '2.1.267 (Claude Code)'; RQs name the bare
    version. Splitting on whitespace keeps the RQ frontmatter readable and
    avoids a prefix match, under which '2.1.2' would silently also accept
    2.1.267 and 2.1.26.
    """
    raw = (metrics.get("harness_version") or "").strip()
    return raw.split()[0] if raw else UNRECORDED


def matches_cell(metrics: dict, cell: dict) -> bool:
    if metrics.get("kata") != kata_for_cell(cell):
        return False
    # Stack is an optional control. Historical runs predate the field and are
    # TypeScript/Vitest by construction.
    if cell.get("stack") and metrics.get("stack", "typescript-vitest") != cell["stack"]:
        return False
    # Harness match: only when the cell declares harness_version. Needed when a
    # CLI bump is a live factor — reusing runs from before the bump would
    # confound the CLI version with whatever the RQ actually varies. Accepts
    # both the bare version and the full stored string, plus the UNRECORDED
    # sentinel for runs predating the field.
    if cell.get("harness_alts") is not None:
        raw = (metrics.get("harness_version") or "").strip()
        if raw not in cell["harness_alts"] and harness_of_run(metrics) not in cell["harness_alts"]:
            return False
    # Workflow match: cell["workflow_alts"] is the list of accepted workflow
    # names (usually one; more than one only for an OR-matched outcome-neutral
    # bugfix, e.g. [exact-hybrid-v4-cleaned-pi, exact-hybrid-v4.2-phase-continuation-pi]).
    if canonical_workflow(metrics.get("workflow", "")) not in cell["workflow_alts"]:
        return False
    # Model match: cell["model_alts"] is the list of accepted lab-variant
    # short aliases (e.g. ["opus-4-7-no-thinking", "opus-4-7-portkey-no-thinking"]).
    # A scalar controls.model becomes a single-entry list in expand_cells().
    if metrics.get("model") not in cell["model_alts"]:
        return False
    return True


def check_archived_workflows(cells: list[dict], allow_archived: bool) -> int:
    """Warn (or fail) when a selector names a workflow that lives in _archive/.

    Workflows are archived for a reason — some are correctness-defective, others
    were measured and rejected. Their runs stay in the flat experiments/runs/
    pool and carry no archive marker in metrics.json, so a selector naming an
    archived workflow silently pulls them into a fresh aggregation. That is a
    real hazard for `{any: [...]}` OR-matches, where several workflow names
    collapse into one cell and an archived entry is easy to miss.

    Returns the number of archived workflow names found. With allow_archived
    the run proceeds anyway (RQ-1.10 legitimately evaluates a rejected
    workflow); without it, the caller aborts.
    """
    # Archiv-Zugehoerigkeit kommt aus PATHS.json (status: discarded <=> Pfad
    # unter _archive/), nicht mehr aus einem flachen iterdir() -- das Archiv
    # spiegelt seit dem Lineage-Umbau die Kategorie-Struktur und ist verschachtelt.
    #
    # Geprueft werden ALLE Alts, nicht nur der kanonische erste Eintrag: der im
    # Docstring benannte Hauptfall ist gerade der, dass in einem {any: [...]}
    # ein archivierter Name mitlaeuft und uebersehen wird.
    hits = sorted({w for c in cells for w in (c.get("workflow_alts") or [c.get("workflow")])
                   if w and is_archived(w)})
    if not hits:
        return 0

    verb = "note" if allow_archived else "ERROR"
    print(f"{verb}: selector names {len(hits)} archived workflow(s):", file=sys.stderr)
    for name in hits:
        print(f"    {name}  ({workflow_dir(name).relative_to(REPO_ROOT)})", file=sys.stderr)
    if not allow_archived:
        print("  Archived workflows are superseded or defective; their runs still sit "
              "in experiments/runs/ unmarked.\n"
              "  If this RQ evaluates an archived workflow on purpose, re-run with "
              "--allow-archived.", file=sys.stderr)
    return len(hits)


def collect_runs(
    cells: list[dict],
) -> tuple[list[tuple[Path, str, str, str]], dict[tuple, list[Path]]]:
    """Walk runs dir, return matched (metrics_path, cell_model, cell_workflow,
    cell_harness) + per-cell index.

    `cell_model` is the canonical lab-variant for the cell the run was matched
    against — equal to `metrics.model` for scalar controls.model, equal to the
    first list entry for list-valued controls.model. Used as the grouping key
    in summary.md pivots so list-valued cells aggregate as one row.

    Index key = cell_key(cell).
    """
    matched: list[tuple[Path, str, str, str]] = []
    by_cell: dict[tuple, list[Path]] = {}

    for run_dir in sorted(RUNS_DIR.iterdir()):
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
            if matches_cell(metrics, cell):
                matched.append((m_file, cell["model"], cell["workflow"],
                                cell.get("harness_version", "")))
                by_cell.setdefault(cell_key(cell), []).append(m_file)
                break  # a run can only match one cell

    return matched, by_cell


# -----------------------------------------------------------------------
# CSV emission
# -----------------------------------------------------------------------

def metrics_to_row(metrics: dict, run_id: str, cell_model: str = "",
                   cell_workflow: str = "", cell_harness: str = "") -> dict:
    g = lambda d, *keys: _nested(d, keys)

    sm = metrics.get("summary_metrics") or {}
    fm = metrics.get("final_metrics") or {}
    rs = metrics.get("run_status") or {}
    cov = metrics.get("coverage") or {}
    cc = metrics.get("clean_code") or {}
    cs = metrics.get("code_smells") or {}
    tcr = metrics.get("tcr") or {}
    # Size of the smallest named unit. PMD NCSS statements on Java, lines
    # per function on TypeScript and Python. Comparable within a stack,
    # never across one. `java_quality` is the pre-rename spelling and is
    # still read so runs analysed before the rename keep their values.
    unit_quality = metrics.get("unit_quality") or metrics.get("java_quality") or {}

    # A run "completed within budget" iff it neither timed out nor
    # exhausted its retry budget for transient API issues (rate-limit
    # / 529 overload / "API Error: terminated"). All three are
    # legitimate research findings about practicality — they signal a
    # (workflow, model, kata) cell whose cost or fragility exceeds the
    # per-run budget. The metric is a bool so RQ outcome-pivots can
    # compute a per-cell completion rate.
    exit_reason = rs.get("exit_reason", "")
    completed = exit_reason not in {
        "timeout", "timeout-killed",
        "rate-limited", "transient-api-error",
        # Infrastructure aborts, not model behaviour: the run never got a
        # fair attempt at the kata, so it must not count as a completion.
        # quota-exhausted (cursor plan allowance) and pi-retries-exhausted
        # (pi gave up after its own retry ladder, e.g. Requesty 502) both
        # exit 0 and would otherwise be filed as clean runs with zero
        # cycles — visually identical to a model that failed the task.
        "quota-exhausted", "pi-retries-exhausted",
    }

    return {
        "kata":                       metrics.get("kata", ""),
        # Historical runs predate explicit stack provenance and are all TS.
        "stack":                      metrics.get("stack", "typescript-vitest"),
        "workflow":                   metrics.get("workflow", ""),
        "cell_workflow":              cell_workflow or metrics.get("workflow", ""),
        "model":                      metrics.get("model", ""),
        "cell_model":                 cell_model or metrics.get("model", ""),
        "cli_model":                  metrics.get("cli_model", ""),
        # Empty for every run recorded before harness_version was captured
        # (run-batch.sh, 2026-09). An empty value means "not recorded", not
        # "same version" — a CLI period control must read the run date for
        # those, not assume homogeneity.
        "harness_version":            metrics.get("harness_version", ""),
        # Canonical label of the cell this run was matched into; empty for the
        # RQs that do not select on the axis at all.
        "cell_harness":               cell_harness,
        "thinking":                   metrics.get("thinking"),
        "run_id":                     run_id,
        "exit_code":                  rs.get("exit_code"),
        "exit_reason":                exit_reason,
        "rate_limited":               rs.get("rate_limited", False),
        "completed_within_budget":    completed,
        "analyze_status":             metrics.get("analyze_status", ""),
        "duration_seconds":           metrics.get("duration_seconds"),
        "total_tokens":               sm.get("total_tokens"),
        "context_utilization_pct":    sm.get("context_utilization_pct"),
        "cycle_count":                sm.get("cycle_count"),
        "avg_cycle_seconds":          sm.get("avg_cycle_seconds"),
        "avg_red_seconds":            sm.get("avg_red_seconds"),
        "avg_green_seconds":          sm.get("avg_green_seconds"),
        "avg_refactor_seconds":       sm.get("avg_refactor_seconds"),
        "refactorings_applied":       sm.get("refactorings_applied"),
        "predictions_correct":        sm.get("predictions_correct"),
        "predictions_total":          sm.get("predictions_total"),
        "tests_passed_immediately":   sm.get("tests_passed_immediately"),
        # Marker-free TDD rigour (measure-tdd-rigour.py, folded in by
        # analyze-run.sh). test_blocks == 1 means big bang; the ratio
        # test_cases_total / test_blocks says how coarse the steps were.
        # Preferred over cycle_count for vendored external workflows, where
        # the inserted RED marker undercounts — see README, "Cycle discipline
        # is measured from the transcript, not from markers".
        "test_blocks":                sm.get("test_blocks"),
        "test_cases_total":           sm.get("test_cases_total"),
        "test_cases_first_block":     sm.get("test_cases_first_block"),
        "red_verified":               sm.get("red_verified"),
        "red_unverified":             sm.get("red_unverified"),
        "tcr_refactor_steps":          sm.get("tcr_refactor_steps"),
        "tcr_method_commits":          tcr.get("method_commits"),
        "tcr_red_commits":             tcr.get("red_commits"),
        "tcr_green_commits":           tcr.get("green_commits"),
        "tcr_refactor_commits":        tcr.get("refactor_commits"),
        "tests_passing":              fm.get("tests_passing"),
        "tests_total":                fm.get("tests_total"),
        "todos_remaining":            fm.get("todos_remaining"),
        "lines_of_code":              fm.get("lines_of_code"),
        "test_lines":                 fm.get("test_lines"),
        "code_mass":                  fm.get("code_mass"),
        "mutation_score":             fm.get("mutation_score"),
        # Mutant population and the part of it the suite missed
        # (survived + never executed). Reported next to the score
        # because the score's denominator scales with the amount of
        # code, so a ratio alone cannot separate "stronger tests"
        # from "less code to defend".
        "mutants_total":              fm.get("mutants_total"),
        "mutants_survived":           fm.get("mutants_survived"),
        "cost_usd":                   fm.get("cost_usd"),
        "coverage_statements_pct":    cov.get("statements_pct"),
        "coverage_branches_pct":      cov.get("branches_pct"),
        "cc_loc":                     cc.get("loc"),
        "cc_functions":               cc.get("functions"),
        "cc_longest_function":        cc.get("longest_function"),
        "cc_avg_loc_per_function":    cc.get("avg_loc_per_function"),
        "cc_median_loc_per_function": cc.get("median_loc_per_function"),
        "cc_imports":                 cc.get("imports"),
        "smell_total":                cs.get("total"),
        "smell_complexity":           cs.get("complexity"),
        "smell_duplication":          cs.get("duplication"),
        "smell_magic_numbers":        cs.get("magic_numbers"),
        "smell_code_quality":         cs.get("code_quality"),
        "mccabe_max":                 fm.get("mccabe_max"),
        "mccabe_avg":                 fm.get("mccabe_avg"),
        "mccabe_high_count":          fm.get("mccabe_high_count"),
        "cognitive_max":              fm.get("cognitive_max"),
        "cognitive_avg":              fm.get("cognitive_avg"),
        "cognitive_high_count":       fm.get("cognitive_high_count"),
        "unit_count":                 unit_quality.get("units",  unit_quality.get("methods")),
        "unit_size_max":              unit_quality.get("size_max", unit_quality.get("method_ncss_max")),
        "unit_size_avg":              unit_quality.get("size_avg", unit_quality.get("method_ncss_avg")),
        "unit_size_median":           unit_quality.get("size_median", unit_quality.get("method_ncss_median")),
        "verification_total":         fm.get("verification_total"),
        "verification_passed":        fm.get("verification_passed"),
        "verification_pct":           fm.get("verification_pct"),
        "cli_built":                  fm.get("cli_built"),
    }


def _nested(d, keys):
    for k in keys:
        if not isinstance(d, dict):
            return None
        d = d.get(k)
    return d


# -----------------------------------------------------------------------
# Summary writer
# -----------------------------------------------------------------------

def write_summary(md_path: Path, fm: dict, df: pd.DataFrame,
                  cells: list[dict], by_cell: dict) -> None:
    rq_id = fm.get("id", "?")
    question = fm.get("question", "")
    outcomes = fm.get("outcomes") or []
    min_rep = fm.get("min_replicates", 1)

    lines: list[str] = []
    L = lines.append

    L(f"# {rq_id} — Aggregation")
    L("")
    L(f"_{question}_")
    L("")
    L(f"Generated: {datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ')}")
    L("")
    L(f"Cells declared: {len(cells)} · matched runs: {len(df)} · "
      f"min_replicates: {min_rep}")
    L("")

    # Cell coverage table.
    # n counts every run with metrics.json; n_ok excludes timeouts and
    # rate-limit-exhausted runs. Timeouts still count toward
    # min_replicates (they are legitimate "ran but didn't finish" data
    # points), but the n_ok column makes it visible when a cell has e.g.
    # 3 timeouts and 0 successful completions.
    # The harness column only appears for RQs that select on it, so every
    # other RQ's coverage table keeps its existing three-column shape.
    show_harness = any(cell.get("harness_alts") is not None for cell in cells)

    L("## Cell coverage")
    L("")
    L("| kata | workflow | model |" + (" harness |" if show_harness else "")
      + " n | n_ok | status |")
    L("|---|---|---|" + ("---|" if show_harness else "") + "---:|---:|---|")
    for cell in cells:
        key = cell_key(cell)
        run_files = by_cell.get(key, [])
        n = len(run_files)
        n_ok = 0
        for m_file in run_files:
            try:
                metrics = json.loads(m_file.read_text())
            except json.JSONDecodeError:
                continue
            reason = (metrics.get("run_status") or {}).get("exit_reason", "")
            if reason not in {
                "timeout", "timeout-killed",
                "rate-limited", "transient-api-error",
                "quota-exhausted", "pi-retries-exhausted",
            }:
                n_ok += 1
        if n == 0:
            status = "❌ no runs"
        elif n < min_rep:
            status = f"⚠️ below min_replicates ({n}/{min_rep})"
        elif n_ok == 0:
            status = f"⚠️ all {n} runs timeout/rate-limited"
        elif n_ok < min_rep:
            status = f"⚠️ only {n_ok}/{min_rep} without timeout"
        else:
            status = "✅"
        harness_col = f" {key[3] or '—'} |" if show_harness else ""
        L(f"| {key[0]} | {key[1]} | {key[2]} |{harness_col} {n} | {n_ok} | {status} |")
    L("")

    if df.empty:
        L("_No matching runs found._")
        md_path.write_text("\n".join(lines))
        return

    # Per-outcome pivots: numeric → mean/min/max, boolean → rate,
    # pooled rate (suffix _rate with matching _correct/_total cols) → Σ/Σ.
    L("## Outcome pivots (per cell)")
    L("")

    # Group by cell_model (canonical per-cell model name) so list-valued
    # controls.model aggregates as one cell, and by cell_workflow (canonical
    # per-cell workflow) so an OR-matched outcome-neutral workflow bugfix
    # (v6.2 + v6.2.1) aggregates as one cell too. The real per-run `model`
    # and `workflow` are still in the CSV for provider-level debugging.
    # cell_harness joins the grouping only for RQs that select on it —
    # otherwise it is a constant empty column and every existing RQ's pivots
    # would grow a meaningless level.
    group_cols = ["kata", "cell_workflow", "cell_model"]
    if show_harness:
        group_cols.append("cell_harness")

    for outcome in outcomes:
        # Pooled rate: outcome name ends with "_correct_rate" → derive
        # numerator/denominator column names.
        if outcome.endswith("_correct_rate"):
            stem = outcome[: -len("_correct_rate")]
            num_col = f"{stem}_correct"
            den_col = f"{stem}_total"
            if num_col not in df.columns or den_col not in df.columns:
                L(f"### {outcome}")
                L("")
                L(f"_Columns `{num_col}` and/or `{den_col}` not in CSV._")
                L("")
                continue
            df_r = df.assign(
                _num=pd.to_numeric(df[num_col], errors="coerce"),
                _den=pd.to_numeric(df[den_col], errors="coerce"),
            )
            df_r = df_r.dropna(subset=["_den"])
            df_r = df_r[df_r["_den"] > 0]
            if df_r.empty:
                L(f"### {outcome} (pooled %)")
                L("")
                L(f"_No runs with `{den_col} > 0`._")
                L("")
                continue
            grouped = (df_r.groupby(group_cols)
                            .agg(n=("_num", "size"),
                                 correct=("_num", "sum"),
                                 total=("_den", "sum"))
                            .reset_index())
            grouped["rate_%"] = (
                100 * grouped["correct"] / grouped["total"]
            ).round(1)
            L(f"### {outcome} (pooled %)")
            L("")
            L(grouped.to_markdown(index=False))
            L("")
            continue

        if outcome not in df.columns:
            L(f"### {outcome}")
            L("")
            L(f"_Column `{outcome}` not in CSV — either not collected or "
              f"a typo in the frontmatter._")
            L("")
            continue

        col = df[outcome]
        # Treat as boolean rate if the values are genuinely boolean.
        # Decide on the type, not on the values: pandas compares 1 == True, so
        # `isin([True, False])` also matches an integer column that happens to
        # hold only 0/1 — a count metric would then be rendered as a rate and
        # read as "share of runs" instead of "mean per run". That bites exactly
        # when a count is small (test_cases_first_block, red_unverified), i.e.
        # when the numbers matter most.
        nn = col.dropna()
        is_bool = len(nn) > 0 and (
            pd.api.types.is_bool_dtype(col)
            or nn.map(lambda v: isinstance(v, bool) or v in ("True", "False")).all()
        )

        if is_bool:
            L(f"### {outcome} (rate %)")
            L("")
            grouped = (df.groupby(group_cols)[outcome]
                         .agg(n="size",
                              match=lambda s: int(s.fillna(False).sum()))
                         .reset_index())
            grouped["rate_%"] = (100 * grouped["match"] / grouped["n"]).round(0)
            L(grouped.to_markdown(index=False))
            L("")
        else:
            numeric = pd.to_numeric(col, errors="coerce")
            if numeric.notna().sum() == 0:
                L(f"### {outcome}")
                L("")
                L(f"_All values are missing or non-numeric._")
                L("")
                continue
            df_num = df.assign(_v=numeric).dropna(subset=["_v"])
            L(f"### {outcome}")
            L("")
            grouped = (df_num.groupby(group_cols)["_v"]
                            .agg(n="size", mean="mean",
                                 min="min", max="max", std="std")
                            .round(2)
                            .reset_index())
            L(grouped.to_markdown(index=False))
            L("")

    md_path.write_text("\n".join(lines))


# -----------------------------------------------------------------------
# Main
# -----------------------------------------------------------------------

def main(argv: list[str]) -> int:
    args = [a for a in argv[1:] if a != "--allow-archived"]
    allow_archived = "--allow-archived" in argv[1:]
    if len(args) != 1:
        print(__doc__, file=sys.stderr)
        return 2

    target = Path(args[0])
    if target.is_dir():
        md_in = target / "README.md"
    else:
        md_in = target
    if not md_in.is_file():
        print(f"Not found: {md_in}", file=sys.stderr)
        return 1

    out_dir = md_in.parent

    fm = parse_frontmatter(md_in)
    cells = expand_cells(fm)

    if check_archived_workflows(cells, allow_archived) and not allow_archived:
        return 1

    matched, by_cell = collect_runs(cells)

    print(f"{fm.get('id', '?')}: {len(cells)} cells declared, "
          f"{len(matched)} runs matched", file=sys.stderr)

    rows = []
    for m_file, cell_model, cell_workflow, cell_harness in matched:
        metrics = json.loads(m_file.read_text())
        run_id = m_file.parent.name
        rows.append(metrics_to_row(metrics, run_id, cell_model, cell_workflow,
                                   cell_harness))

    df = pd.DataFrame(rows, columns=CSV_COLUMNS)
    csv_path = out_dir / "runs.csv"
    df.to_csv(csv_path, index=False)
    print(f"  wrote {csv_path} ({len(df)} rows)", file=sys.stderr)

    md_out = out_dir / "summary.md"
    write_summary(md_out, fm, df, cells, by_cell)
    print(f"  wrote {md_out}", file=sys.stderr)

    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
