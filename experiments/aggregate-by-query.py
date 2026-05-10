#!/usr/bin/env python3
"""Aggregate run metrics by research-question selector query.

Reads a research question's README.md frontmatter (factors + controls),
expands it to a list of (kata_base, prompt, workflow, model) cells, then
collects ALL matching runs from experiments/runs/ — independent of which
batch produced them.

Outputs into the RQ directory:
  runs.csv     — one row per matched run, all metrics
  summary.md   — per-cell pivots (avg/rate) for each declared outcome

Usage:
  experiments/aggregate-by-query.py research/RQ-1-workflow-effect/
  experiments/aggregate-by-query.py research/RQ-1-workflow-effect/README.md
"""
from __future__ import annotations

import json
import sys
from datetime import datetime, timezone
from itertools import product
from pathlib import Path

import pandas as pd
import yaml

REPO_ROOT = Path(__file__).resolve().parent.parent
RUNS_DIR = REPO_ROOT / "experiments" / "runs"

CSV_COLUMNS = [
    "kata", "workflow", "model", "cli_model", "thinking", "run_id",
    "exit_code", "exit_reason", "rate_limited", "completed_within_budget",
    "analyze_status",
    "duration_seconds", "total_tokens", "context_utilization_pct",
    "cycle_count", "avg_cycle_seconds", "avg_red_seconds",
    "avg_green_seconds", "avg_refactor_seconds", "refactorings_applied",
    "predictions_correct", "predictions_total", "tests_passed_immediately",
    "tests_passing", "tests_total", "todos_remaining",
    "lines_of_code", "test_lines", "code_mass",
    "coverage_statements_pct", "coverage_branches_pct",
    "cc_loc", "cc_functions", "cc_longest_function",
    "cc_avg_loc_per_function", "cc_median_loc_per_function", "cc_imports",
    "smell_total", "smell_complexity", "smell_duplication",
    "smell_magic_numbers", "smell_code_quality",
    "mccabe_max", "mccabe_avg", "mccabe_high_count",
    "cognitive_max", "cognitive_avg", "cognitive_high_count",
    "verification_total", "verification_passed", "verification_pct",
    "cli_built",
]

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

    return cells


# -----------------------------------------------------------------------
# Run matching
# -----------------------------------------------------------------------

def kata_for_cell(cell: dict) -> str:
    """Resolve effective kata id from kata_base + prompt."""
    base = cell["kata_base"]
    prompt = cell.get("prompt")
    return f"{base}-{prompt}" if prompt else base


def matches_cell(metrics: dict, cell: dict) -> bool:
    if metrics.get("kata") != kata_for_cell(cell):
        return False
    if metrics.get("workflow") != cell["workflow"]:
        return False
    # Model match: cell["model"] is the lab-variant short alias
    # (e.g. "opus-4-7-no-thinking"), exactly what metrics.model stores.
    if metrics.get("model") != cell["model"]:
        return False
    return True


def collect_runs(cells: list[dict]) -> tuple[list[Path], dict[tuple, list[Path]]]:
    """Walk runs dir, return matched metrics paths + per-cell index.

    Index key = (kata, workflow, cli_model) tuple.
    """
    matched: list[Path] = []
    by_cell: dict[tuple, list[Path]] = {}

    for run_dir in sorted(RUNS_DIR.iterdir()):
        m_file = run_dir / "metrics.json"
        if not m_file.is_file():
            continue
        try:
            metrics = json.loads(m_file.read_text())
        except json.JSONDecodeError:
            continue

        for cell in cells:
            if matches_cell(metrics, cell):
                matched.append(m_file)
                key = (kata_for_cell(cell), cell["workflow"], cell["model"])
                # store short-alias model match (group_cols use 'model' below)
                by_cell.setdefault(key, []).append(m_file)
                break  # a run can only match one cell

    return matched, by_cell


# -----------------------------------------------------------------------
# CSV emission
# -----------------------------------------------------------------------

def metrics_to_row(metrics: dict, run_id: str) -> dict:
    g = lambda d, *keys: _nested(d, keys)

    sm = metrics.get("summary_metrics") or {}
    fm = metrics.get("final_metrics") or {}
    rs = metrics.get("run_status") or {}
    cov = metrics.get("coverage") or {}
    cc = metrics.get("clean_code") or {}
    cs = metrics.get("code_smells") or {}

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
    }

    return {
        "kata":                       metrics.get("kata", ""),
        "workflow":                   metrics.get("workflow", ""),
        "model":                      metrics.get("model", ""),
        "cli_model":                  metrics.get("cli_model", ""),
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
        "tests_passing":              fm.get("tests_passing"),
        "tests_total":                fm.get("tests_total"),
        "todos_remaining":            fm.get("todos_remaining"),
        "lines_of_code":              fm.get("lines_of_code"),
        "test_lines":                 fm.get("test_lines"),
        "code_mass":                  fm.get("code_mass"),
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
    L("## Zell-Coverage")
    L("")
    L("| kata | workflow | model | n | n_ok | status |")
    L("|---|---|---|---:|---:|---|")
    for cell in cells:
        key = (kata_for_cell(cell), cell["workflow"], cell["model"])
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
            }:
                n_ok += 1
        if n == 0:
            status = "❌ keine Runs"
        elif n < min_rep:
            status = f"⚠️ unter min_replicates ({n}/{min_rep})"
        elif n_ok == 0:
            status = f"⚠️ alle {n} Runs Timeout/rate-limited"
        elif n_ok < min_rep:
            status = f"⚠️ nur {n_ok}/{min_rep} ohne Timeout"
        else:
            status = "✅"
        L(f"| {key[0]} | {key[1]} | {key[2]} | {n} | {n_ok} | {status} |")
    L("")

    if df.empty:
        L("_Keine matching Runs gefunden._")
        md_path.write_text("\n".join(lines))
        return

    # Per-outcome pivots: numeric → mean/min/max, boolean → rate,
    # pooled rate (suffix _rate with matching _correct/_total cols) → Σ/Σ.
    L("## Outcome-Pivots (pro Zelle)")
    L("")

    group_cols = ["kata", "workflow", "model"]

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
                L(f"_Spalten `{num_col}` und/oder `{den_col}` nicht in CSV._")
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
                L(f"_Keine Runs mit `{den_col} > 0`._")
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
            L(f"_Spalte `{outcome}` nicht in CSV — wird nicht erhoben oder "
              f"Tippfehler im Frontmatter._")
            L("")
            continue

        col = df[outcome]
        # Treat as boolean rate if values are bool/None
        is_bool = col.dropna().isin([True, False]).all() and col.notna().any()

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
                L(f"_Alle Werte fehlen oder sind nicht numerisch._")
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
    if len(argv) != 2:
        print(__doc__, file=sys.stderr)
        return 2

    target = Path(argv[1])
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
    matched, by_cell = collect_runs(cells)

    print(f"{fm.get('id', '?')}: {len(cells)} cells declared, "
          f"{len(matched)} runs matched", file=sys.stderr)

    rows = []
    for m_file in matched:
        metrics = json.loads(m_file.read_text())
        run_id = m_file.parent.name
        rows.append(metrics_to_row(metrics, run_id))

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
