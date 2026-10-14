#!/usr/bin/env python3
"""Aggregate run metrics by research-question selector query.

Reads a research question's README.md frontmatter (factors + controls),
expands it to a list of (kata_base, prompt, workflow, model) cells, then
collects ALL matching runs from experiments/runs/ — independent of which
batch produced them.

Outputs into the RQ directory:
  runs.csv     — one row per matched run, all metrics
  summary.json — per-cell statistics, run counters and run list
  summary.md   — per-cell pivots (avg/rate) for each declared outcome

Each file is written only when its content changed (summary.md's Generated:
line aside); rows are in run_id order. Runs without an exit_reason are
skipped and reported. Refuses while a batch or batch-retry container is
running, and when Docker cannot be reached.

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
  experiments/aggregate-by-query.py <rq-dir> --allow-archived
"""
from __future__ import annotations

import json
import re
import statistics
import subprocess
import sys
from datetime import datetime, timezone
from itertools import product
from pathlib import Path

import yaml

sys.path.insert(0, str(Path(__file__).resolve().parent))
from rq_facts import is_finished, is_usable
from workflow_paths import (canonical as canonical_workflow, harness_of,
                            is_archived, workflow_dir)

REPO_ROOT = Path(__file__).resolve().parent.parent
RUNS_DIR = REPO_ROOT / "experiments" / "runs"
WORKFLOWS_DIR = REPO_ROOT / "experiments" / "workflows"

CSV_COLUMNS = [
    "kata", "prompt_style", "stack", "workflow", "cell_workflow", "model", "cell_model",
    "cli_model", "harness", "harness_version", "cell_harness",
    "thinking", "run_id", "started_at",
    "exit_code", "exit_reason", "rate_limited",
    "analyze_status",
    "duration_seconds", "total_tokens", "context_utilization_pct", "avg_cycle_seconds", "avg_red_seconds",
    "avg_green_seconds", "avg_refactor_seconds",
    "predictions_correct", "predictions_total",
    "chain_suite_runs", "cycles_total", "cycles_closed", "test_first_rate",
    "refactor_events", "skip_events",
    "red_batch_size", "red_batch_max", "red_batch_unmeasurable",
    "green_batch_size", "refactor_per_cycle", "green_attempts",
    "chain_deviations", "chain_opens_red", "chain_ends_green",
    "tdd_discipline", "tdd_discipline_test_first",
    "tdd_discipline_step", "tdd_discipline_closure",
    "verification_tests", "verification_red", "tdd_after_cutoff",
    "tcr_method_commits", "tcr_red_commits", "tcr_green_commits",
    "tcr_refactor_commits",
    "tests_passing", "tests_total", "todos_remaining",
    "lines_of_code", "test_lines", "code_mass", "mutation_score",
    "mutants_total", "mutants_survived", "mutants_no_coverage", "cost_usd",
    "coverage_statements_pct", "coverage_branches_pct",
    "production_loc", "functions", "longest_function",
    "avg_loc_per_function", "median_loc_per_function", "imports",
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

def _pd():
    """pandas, imported on first use.

    Only write_summary() and the DataFrame in main() need it, and both run on
    the host. Importing it at module scope made every importer of this file
    need pandas too -- which broke compute-mutation-score.py inside the batch
    container, the only place the Rust toolchain exists. The container has no
    pandas and does not need one: it runs the engine, not the pivot tables.
    PyYAML stays a hard import because parse_frontmatter() below is on that
    shared path.
    """
    import pandas as pd
    return pd


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
        # Map old names to current ones. An RQ may keep naming
        # exact-hybrid-v2-testlist-fix-cc; matching and labelling still
        # use exact-hybrid-v2-testlist-fix-cc.
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
    # Archive membership comes from PATHS.json (status: discarded <=> path
    # under _archive/), no longer from a flat iterdir() -- since the lineage
    # rework the archive mirrors the category structure and is nested.
    #
    # ALL alts are checked, not just the canonical first entry: the main case
    # named in the docstring is exactly an archived name riding along in an
    # {any: [...]} and being overlooked.
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
    """match_runs() without the count of unfinished runs it skipped."""
    matched, by_cell, _unfinished = match_runs(cells)
    return matched, by_cell


def match_runs(
    cells: list[dict], runs_dir: Path | None = None,
) -> tuple[list[tuple[Path, str, str, str]], dict[tuple, list[Path]], int]:
    """Walk runs dir, return matched (metrics_path, cell_model, cell_workflow,
    cell_harness) + per-cell index.

    `cell_model` is the canonical lab-variant for the cell the run was matched
    against — equal to `metrics.model` for scalar controls.model, equal to the
    first list entry for list-valued controls.model. Used as the grouping key
    in summary.md pivots so list-valued cells aggregate as one row.

    Index key = cell_key(cell).

    A matching run without an exit_reason is left out and only counted: it is
    still executing, or a stub from an aborted batch whose every metric is
    null. Kept, it would land in runs.csv and count as an infrastructure abort.
    """
    matched: list[tuple[Path, str, str, str]] = []
    by_cell: dict[tuple, list[Path]] = {}
    unfinished = 0

    for run_dir in sorted((runs_dir or RUNS_DIR).iterdir()):
        if run_dir.name.startswith("_"):
            continue  # skip _archive/ and other underscore-prefixed dirs
        m_file = run_dir / "metrics.json"
        if not m_file.is_file():
            continue
        try:
            metrics = json.loads(m_file.read_text())
        except json.JSONDecodeError:
            continue

        cell = next((c for c in cells if matches_cell(metrics, c)), None)
        if cell is None:
            continue
        if not is_finished(metrics):
            unfinished += 1
            continue
        # A run can only match one cell: the first.
        matched.append((m_file, cell["model"], cell["workflow"],
                        cell.get("harness_version", "")))
        by_cell.setdefault(cell_key(cell), []).append(m_file)

    return matched, by_cell, unfinished


# -----------------------------------------------------------------------
# CSV emission
# -----------------------------------------------------------------------

PROMPT_STYLES = ("example-mapping", "user-story", "prose")


def _prompt_style(kata: str) -> str:
    return next((p for p in PROMPT_STYLES if kata.endswith("-" + p)), "")


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

    exit_reason = rs.get("exit_reason", "")

    return {
        "kata":                       metrics.get("kata", ""),
        # The kata id ends in its prompt variant; the run stores only the
        # combined id. Empty for a kata without a variant suffix.
        "prompt_style":               _prompt_style(metrics.get("kata", "")),
        # Historical runs predate explicit stack provenance and are all TS.
        "stack":                      metrics.get("stack", "typescript-vitest"),
        "workflow":                   metrics.get("workflow", ""),
        "cell_workflow":              cell_workflow or metrics.get("workflow", ""),
        "model":                      metrics.get("model", ""),
        "cell_model":                 cell_model or metrics.get("model", ""),
        "cli_model":                  metrics.get("cli_model", ""),
        # Derived from the workflow's marker dir, the same source run-batch.sh
        # dispatches on; runs carry no harness field of their own.
        "harness":                    harness_of(metrics.get("workflow", "")) or "",
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
        "started_at":                 metrics.get("started_at", ""),
        "exit_code":                  rs.get("exit_code"),
        "exit_reason":                exit_reason,
        "rate_limited":               rs.get("rate_limited", False),
        "analyze_status":             metrics.get("analyze_status", ""),
        "duration_seconds":           metrics.get("duration_seconds"),
        "total_tokens":               sm.get("total_tokens"),
        "context_utilization_pct":    sm.get("context_utilization_pct"),
        "avg_cycle_seconds":          sm.get("avg_cycle_seconds"),
        "avg_red_seconds":            sm.get("avg_red_seconds"),
        "avg_green_seconds":          sm.get("avg_green_seconds"),
        "avg_refactor_seconds":       sm.get("avg_refactor_seconds"),
        "predictions_correct":        sm.get("predictions_correct"),
        "predictions_total":          sm.get("predictions_total"),
        # Marker-free TDD rigour (measure-tdd-rigour.py, folded in by
        # analyze-run.sh). test_blocks == 1 means big bang; the ratio
        # test_cases_total / test_blocks says how coarse the steps were.
        # Preferred over cycle_count for vendored external workflows, where
        # the inserted RED marker undercounts — see README, "Cycle discipline
        # is measured from the transcript, not from markers".
        # TDD rigour read from the suite outcomes instead of the edit tools
        # (measure-suite-transitions.py, folded in by analyze-run.sh).
        # suite_cycles counts observed red->green transitions, so unlike the
        # test_blocks family above it also produces numbers for a model that
        # edits through the shell, and unlike cycle_count it needs no markers.
        # It is a lower bound on cycle_count (~0.5x, r = 0.82), a related but
        # distinct construct — do not put the two in one column.
        # suite_unknown_runs is the trust column: it says how many suite
        # invocations could not be classified at all.
        # Phase-chain metrics (tdd-report.py over the stack reporter's event
        # stream). The one discipline source that reads no marker, no edit tool
        # and no commit, so it cannot fall silent because a workflow declined
        # to emit something. README, "Phase chain metrics", has the vocabulary.
        "refactor_events":            sm.get("refactor_events"),
        "skip_events":                sm.get("skip_events"),
        "chain_suite_runs":           sm.get("chain_suite_runs"),
        "cycles_total":               sm.get("cycles_total"),
        "cycles_closed":              sm.get("cycles_closed"),
        "test_first_rate":            sm.get("test_first_rate"),
        "red_batch_size":             sm.get("red_batch_size"),
        "red_batch_max":              sm.get("red_batch_max"),
        "red_batch_unmeasurable":     sm.get("red_batch_unmeasurable"),
        "green_batch_size":           sm.get("green_batch_size"),
        "refactor_per_cycle":         sm.get("refactor_per_cycle"),
        "green_attempts":             sm.get("green_attempts"),
        "chain_deviations":           sm.get("chain_deviations"),
        "chain_opens_red":            sm.get("chain_opens_red"),
        "chain_ends_green":           sm.get("chain_ends_green"),
        # The consolidated discipline score, 0..1, higher is better. Geometric
        # mean of test-first / step-size / cycle-closure, so it is conjunctive:
        # a zero in any one sends the score to 0. Always report the three
        # components with it — they are what makes a 0 diagnosable.
        "tdd_discipline":             sm.get("tdd_discipline"),
        "tdd_discipline_test_first":  sm.get("tdd_discipline_test_first"),
        "tdd_discipline_step":        sm.get("tdd_discipline_step"),
        "tdd_discipline_closure":     sm.get("tdd_discipline_closure"),
        # The verification part after the cutoff, where the score stops.
        # README, "Verification tests and the cutoff".
        "verification_tests":         sm.get("verification_tests"),
        "verification_red":           sm.get("verification_red"),
        "tdd_after_cutoff":           sm.get("tdd_after_cutoff"),
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
        "mutants_no_coverage":        fm.get("mutants_no_coverage"),
        "cost_usd":                   fm.get("cost_usd"),
        "coverage_statements_pct":    cov.get("statements_pct"),
        "coverage_branches_pct":      cov.get("branches_pct"),
        "production_loc":             cc.get("loc"),
        "functions":                  cc.get("functions"),
        "longest_function":           cc.get("longest_function"),
        "avg_loc_per_function":       cc.get("avg_loc_per_function"),
        "median_loc_per_function":    cc.get("median_loc_per_function"),
        "imports":                    cc.get("imports"),
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


def by_run_id(rows: list[dict]) -> list[dict]:
    """Rows in run_id order, so a re-aggregation never reorders its output --
    runs.csv and each cell's run list in summary.json alike."""
    return sorted(rows, key=lambda row: row["run_id"])


def write_runs_csv(csv_path: Path, rows: list[dict]) -> bool:
    table = _pd().DataFrame(by_run_id(rows), columns=CSV_COLUMNS)
    return write_if_changed(csv_path, table.to_csv(index=False))


def _nested(d, keys):
    for k in keys:
        if not isinstance(d, dict):
            return None
        d = d.get(k)
    return d


# -----------------------------------------------------------------------
# Summary writer
# -----------------------------------------------------------------------

# Outcomes whose value depends on the `Skip` label of the phase chain. A
# test-list workflow produces Skips by contract: a test activated from a
# pre-written list that already passes is legitimate evidence under its own rules
# ("A test already satisfied by an earlier generalization is legitimate
# evidence. Do not manufacture a failure."), while a strict-red workflow treats
# the same event as a reason to start over. Skip sits in the denominator of
# `test_first_rate` and opens a cycle that has no failure to close, so it
# depresses two of the three `tdd_discipline` components. Comparing these
# columns across the boundary measures the architecture, not the discipline —
# RQ-tdd-workflow-comparison-opus55 F-4.13.4.
SKIP_SENSITIVE_OUTCOMES = {
    "tdd_discipline", "tdd_discipline_test_first", "tdd_discipline_closure",
    "test_first_rate", "skip_events", "cycles_total", "chain_deviations",
}

# The three phrasings every test-list workflow in the corpus uses, in every
# harness port. A filename check does not work: the Claude Code ports carry
# `commands/test-list.md` while the pi ports put the same contract in an
# auto-loaded skill under a different name.
_TEST_LIST_PATTERN = re.compile(
    r"inactive test|it\.todo|keep every listed test", re.I)


def uses_test_list(workflow: str) -> bool | None:
    """Whether a workflow's own text prescribes a pre-written test list.

    None when the workflow directory cannot be resolved — an unknown workflow is
    not evidence either way, and must not silence the warning for the others.
    """
    try:
        d = workflow_dir(workflow)
    except Exception:
        return None
    for f in d.rglob("*"):
        if not f.is_file() or f.suffix not in (".md", ".json", ".txt"):
            continue
        try:
            if _TEST_LIST_PATTERN.search(f.read_text(errors="ignore")):
                return True
        except OSError:
            continue
    return False


def warn_on_test_list_boundary(fm: dict, cells: list[dict]) -> None:
    """Warn when a Skip-sensitive outcome spans the test-list boundary."""
    hit = sorted(set(fm.get("outcomes") or []) & SKIP_SENSITIVE_OUTCOMES)
    if not hit:
        return
    groups: dict[bool, set[str]] = {}
    for cell in cells:
        for w in cell.get("workflow_alts", []):
            verdict = uses_test_list(w)
            if verdict is not None:
                groups.setdefault(verdict, set()).add(w)
    if len(groups) < 2:
        return
    rq_id = fm.get("id", "?")
    print(f"WARNING: {rq_id} compares {len(hit)} Skip-sensitive discipline "
          f"outcome(s) across the test-list boundary: {', '.join(hit)}",
          file=sys.stderr)
    print(f"  test-list workflows:  {', '.join(sorted(groups[True]))}",
          file=sys.stderr)
    print(f"  ad-hoc workflows:     {', '.join(sorted(groups[False]))}",
          file=sys.stderr)
    print("  A Skip is compliance in the first group and a deviation in the "
          "second, so these columns measure the architecture rather than the "
          "discipline. Report them within a group, never across one, and say so "
          "in findings.md. See README \"Phase chain metrics\" and "
          "RQ-tdd-workflow-comparison-opus55 F-4.13.4.", file=sys.stderr)


# A run killed after its budget is still a timeout; every other reason that is
# neither ok, a timeout nor a provider refusal counts as an infrastructure abort.
TIMEOUT_EXIT_REASONS = {"timeout", "timeout-killed"}


def run_counts(exit_reasons: list[str]) -> dict:
    """How many runs a cell has, and why the ones that did not end `ok` left
    its statistics."""
    timeouts = sum(1 for r in exit_reasons if r in TIMEOUT_EXIT_REASONS)
    refusals = sum(1 for r in exit_reasons if r == "provider-refusal")
    infra = len(exit_reasons) - timeouts - refusals - exit_reasons.count("ok")
    return {"runs": len(exit_reasons), "timeouts": timeouts, "infra": infra,
            "provider_refusals": refusals}


def numeric_stats(values: list) -> dict:
    """n, mean and sample sd of a numeric outcome over a cell's usable runs.
    A mean needs one value, an sd two; without them the key is absent."""
    stats = {"kind": "num", "n": len(values)}
    if values:
        stats["mean"] = statistics.mean(values)
    if len(values) > 1:
        stats["sd"] = statistics.stdev(values)
    return stats


def outcome_value(row: dict, outcome: str):
    """A run's value for one outcome. A pooled rate (`<stem>_correct_rate`) is
    the pair (`<stem>_correct`, `<stem>_total`), null when the total is null
    or 0."""
    if not outcome.endswith("_correct_rate"):
        return row.get(outcome)
    stem = outcome[: -len("_correct_rate")]
    total = row.get(f"{stem}_total")
    return (row.get(f"{stem}_correct"), total) if total else None


def rate_stats(pairs: list) -> dict:
    """A pooled rate over a cell's usable runs: k correct of t in total."""
    return {"kind": "rate", "n": len(pairs), "k": sum(k for k, _ in pairs),
            "t": sum(t for _, t in pairs)}


def boolean_stats(values: list) -> dict:
    """How many of a cell's usable runs had a true boolean outcome (k of n)."""
    return {"kind": "bool", "n": len(values), "k": sum(values)}


def outcome_stats(values: list) -> dict:
    """One outcome over a cell's usable runs. A null leaves n and is counted."""
    present = [v for v in values if v is not None]
    if present and all(isinstance(v, tuple) for v in present):
        stats = rate_stats(present)
    elif present and all(isinstance(v, bool) for v in present):
        stats = boolean_stats(present)
    else:
        stats = numeric_stats(present)
    return {**stats, "null_count": len(values) - len(present)}


def cell_summary(rows: list[dict], outcomes: list[str]) -> dict:
    usable = [row for row in rows if is_usable(row["exit_reason"])]
    # cost_usd is a column of every result table, declared or not.
    summarised = outcomes if "cost_usd" in outcomes else [*outcomes, "cost_usd"]
    stats = {outcome: outcome_stats([outcome_value(row, outcome) for row in usable])
             for outcome in summarised}
    return {"counts": run_counts([row["exit_reason"] for row in rows]),
            "runs": [{"id": row["run_id"], "started_at": row["started_at"],
                      "exit_reason": row["exit_reason"]} for row in by_run_id(rows)],
            "outcomes": stats}


def pivot_columns(stats: dict) -> dict:
    """summary.md columns for one outcome's statistics in one cell."""
    n, nulls = stats["n"], stats["null_count"]
    if stats["kind"] == "bool":
        rate = round(100 * stats["k"] / n) if n else None
        return {"n": n, "k": stats["k"], "null": nulls, "rate_%": rate}
    if stats["kind"] == "rate":
        rate = round(100 * stats["k"] / stats["t"], 1) if n else None
        return {"n": n, "k": stats["k"], "t": stats["t"], "null": nulls, "rate_%": rate}
    return {"n": n, "null": nulls,
            "mean": round(stats["mean"], 2) if "mean" in stats else None,
            "sd": round(stats["sd"], 2) if "sd" in stats else None}


def rows_by_cell(rows: list[dict], by_cell: dict) -> dict:
    """The runs.csv rows of each cell, keyed like by_cell."""
    row_of_run = {row["run_id"]: row for row in rows}
    return {key: [row_of_run[m_file.parent.name] for m_file in files]
            for key, files in by_cell.items()}


def summary_document(fm: dict, cells: list[dict], cell_rows: dict) -> dict:
    """summary.json: every declared cell, run or not, with its statistics."""
    outcomes = fm.get("outcomes") or []
    return {"cells": [
        {"kata": kata_for_cell(cell), "workflow": cell["workflow"], "model": cell["model"],
         **cell_summary(cell_rows.get(cell_key(cell), []), outcomes)}
        for cell in cells]}


def outcome_pivot(outcome: str, cells: list[dict], document: dict,
                  show_harness: bool) -> str:
    """One outcome per cell, from the same statistics as summary.json: only ok
    runs, nulls left out of n and counted."""
    group_cols = ["kata", "cell_workflow", "cell_model"]
    if show_harness:
        group_cols.append("cell_harness")
    records = []
    for cell, summary in zip(cells, document["cells"], strict=True):
        record = dict(zip(group_cols, cell_key(cell)[:len(group_cols)], strict=True))
        record.update(pivot_columns(summary["outcomes"][outcome]))
        records.append(record)
    return _pd().DataFrame(records).to_markdown(index=False)


def coverage_table(cells: list[dict], document: dict, min_rep: int,
                   show_harness: bool) -> list[str]:
    """summary.md's cell coverage: every run (n) against the ok runs (n_ok)
    that count toward min_replicates."""
    lines = ["| kata | workflow | model |" + (" harness |" if show_harness else "")
             + " n | n_ok | status |",
             "|---|---|---|" + ("---|" if show_harness else "") + "---:|---:|---|"]
    for cell, summary in zip(cells, document["cells"], strict=True):
        key = cell_key(cell)
        counts = summary["counts"]
        n = counts["runs"]
        n_ok = n - counts["timeouts"] - counts["infra"] - counts["provider_refusals"]
        if n == 0:
            status = "❌ no runs"
        elif n_ok < min_rep:
            status = f"⚠️ below min_replicates ({n_ok}/{min_rep})"
        else:
            status = "✅"
        harness_col = f" {key[3] or '—'} |" if show_harness else ""
        lines.append(f"| {key[0]} | {key[1]} | {key[2]} |{harness_col} {n} | {n_ok} | {status} |")
    return lines


# summary.md's timestamp. It changes on every call, so it is no evidence that
# the aggregation did.
GENERATED_LINE = re.compile(r"^Generated: .*$", re.M)


def write_if_changed(path: Path, text: str) -> bool:
    """Write text unless the file already holds it, apart from the Generated:
    line. An RQ re-aggregated without new runs then leaves no diff."""
    if path.is_file() and GENERATED_LINE.sub("", path.read_text()) == GENERATED_LINE.sub("", text):
        return False
    path.write_text(text)
    return True


def write_summary(md_path: Path, fm: dict, cells: list[dict], document: dict) -> bool:
    rq_id = fm.get("id", "?")
    question = fm.get("question", "")
    outcomes = fm.get("outcomes") or []
    warn_on_test_list_boundary(fm, cells)
    min_rep = fm.get("min_replicates", 1)

    matched_runs = sum(cell["counts"]["runs"] for cell in document["cells"])
    lines = [f"# {rq_id} — Aggregation", "", f"_{question}_", "",
             f"Generated: {datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ')}", "",
             f"Cells declared: {len(cells)} · matched runs: {matched_runs} · "
             f"min_replicates: {min_rep}", ""]
    L = lines.append

    # Cell coverage table. n counts every run; n_ok only the runs that ended
    # ok, the only ones that enter a statistic and count toward
    # min_replicates. The gap between them is the cell's timeouts and aborts.
    # The harness column only appears for RQs that select on it, so every
    # other RQ's coverage table keeps its existing three-column shape.
    show_harness = any(cell.get("harness_alts") is not None for cell in cells)

    L("## Cell coverage")
    L("")
    lines.extend(coverage_table(cells, document, min_rep, show_harness))
    L("")

    if matched_runs:
        L("## Outcome pivots (per cell)")
        L("")
        for outcome in outcomes:
            L(f"### {outcome}")
            L("")
            L(outcome_pivot(outcome, cells, document, show_harness))
            L("")
    else:
        L("_No matching runs found._")

    return write_if_changed(md_path, "\n".join(lines))


# -----------------------------------------------------------------------
# Batch lock
# -----------------------------------------------------------------------
#
# A running batch writes runs, so an aggregation during it reads a moving pool.
# The lock is absolute, and checked only from main(): compute-mutation-score.py
# imports this file inside a batch container, where there is no Docker.

# Compose services whose containers write runs. They start via `docker compose
# --profile batch run --rm batch` and carry no fixed name, so they are
# recognised by their service label. The interactive `experiment` service does
# not block.
BATCH_SERVICES = ("batch", "batch-retry")


class DockerUnreachable(RuntimeError):
    """Docker could not say whether a batch is running."""


def running_containers() -> list[tuple[str, str]]:
    """(name, compose service) of every running container."""
    try:
        result = subprocess.run(
            ["docker", "ps", "--format",
             '{{.Names}}\t{{.Label "com.docker.compose.service"}}'],
            capture_output=True, text=True, check=False)
    except OSError as e:
        raise DockerUnreachable(str(e)) from e
    if result.returncode != 0:
        raise DockerUnreachable(result.stderr.strip())
    return [tuple(line.split("\t", 1)) for line in result.stdout.splitlines()]


def running_batch_containers() -> list[str]:
    """Names of the running containers that write runs."""
    return [name for name, service in running_containers() if service in BATCH_SERVICES]


def batch_lock_refusal() -> str | None:
    """Why the aggregation may not run now, or None when it may."""
    try:
        batch = running_batch_containers()
    except DockerUnreachable as e:
        return f"cannot ask Docker whether a batch is running: {e}"
    if batch:
        return f"a batch is running ({', '.join(batch)}); aggregate once it is done."
    return None


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

    refusal = batch_lock_refusal()
    if refusal:
        print(f"ERROR: {refusal}", file=sys.stderr)
        return 1

    out_dir = md_in.parent

    fm = parse_frontmatter(md_in)
    cells = expand_cells(fm)

    if check_archived_workflows(cells, allow_archived) and not allow_archived:
        return 1

    matched, by_cell, unfinished = match_runs(cells)

    print(f"{fm.get('id', '?')}: {len(cells)} cells declared, "
          f"{len(matched)} runs matched", file=sys.stderr)
    if unfinished:
        print(f"  note: {unfinished} unfinished run{'s' if unfinished > 1 else ''} "
              f"skipped — no exit_reason yet (still executing, or a stub from an "
              f"aborted batch).", file=sys.stderr)

    rows = []
    for m_file, cell_model, cell_workflow, cell_harness in matched:
        metrics = json.loads(m_file.read_text())
        run_id = m_file.parent.name
        rows.append(metrics_to_row(metrics, run_id, cell_model, cell_workflow,
                                   cell_harness))

    document = summary_document(fm, cells, rows_by_cell(rows, by_cell))
    written = {
        "runs.csv": write_runs_csv(out_dir / "runs.csv", rows),
        "summary.json": write_if_changed(out_dir / "summary.json",
                                         json.dumps(document, indent=2) + "\n"),
        "summary.md": write_summary(out_dir / "summary.md", fm, cells, document),
    }
    for name, changed in written.items():
        print(f"  {'wrote' if changed else 'unchanged'} {out_dir / name}", file=sys.stderr)

    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
