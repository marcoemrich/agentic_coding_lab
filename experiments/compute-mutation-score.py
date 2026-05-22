#!/usr/bin/env python3
"""Compute Stryker mutation score for every run matching a research question.

Reads the RQ frontmatter, checks whether ``mutation_score`` is requested as
an outcome, selects matching runs from ``experiments/runs/``, and runs
Stryker (mutation testing against the implementer's own Vitest suite) for
each eligible run. The resulting score (0.0-1.0) is written back into the
run's ``metrics.json`` under ``final_metrics.mutation_score``.

Idempotent: runs that already have a numeric ``mutation_score`` are skipped
unless ``--force`` is passed. Runs without ``tests_passing == true`` are
skipped (mutation score on a red suite is methodologically meaningless).

Mutation testing is expensive (several minutes of Vitest re-runs per run),
so this script is deliberately separate from ``analyze-run.sh`` and only
invoked when an RQ explicitly opts in via ``outcomes: [..., mutation_score]``.

Usage:
  experiments/compute-mutation-score.py research/workflow-dev/5.1-correctness-regression/
  experiments/compute-mutation-score.py research/workflow-dev/5.1-correctness-regression/ --dry-run
  experiments/compute-mutation-score.py research/workflow-dev/5.1-correctness-regression/ --limit 1 --timeout-seconds 600
  experiments/compute-mutation-score.py research/workflow-dev/5.1-correctness-regression/ --force
"""
from __future__ import annotations

import argparse
import importlib.util
import json
import os
import subprocess
import sys
from pathlib import Path

# Reuse parse_frontmatter, expand_cells, kata_for_cell, matches_cell, RUNS_DIR
# from aggregate-by-query.py (same dir). Filename has a hyphen → load via spec.
_AGG = Path(__file__).resolve().parent / "aggregate-by-query.py"
_spec = importlib.util.spec_from_file_location("aggregate_by_query", _AGG)
agg = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(agg)  # type: ignore[union-attr]

REPO_ROOT = Path(__file__).resolve().parent.parent
PNPM_STORE = agg.RUNS_DIR / ".pnpm-store"

STRYKER_CONFIG = {
    "$schema": "./node_modules/@stryker-mutator/core/schema/stryker-schema.json",
    "packageManager": "pnpm",
    "testRunner": "vitest",
    # Explicit plugin list: under pnpm's isolated layout, Stryker's
    # auto-discovery from the core worker's nested location does not
    # reach the hoisted vitest-runner. Listing it explicitly forces
    # normal node resolution from the run dir.
    "plugins": ["@stryker-mutator/vitest-runner"],
    "reporters": ["json", "clear-text"],
    # src/cli.ts is exercised by the external acceptance suite
    # (verification_pct), not by the internal Vitest tests — mutating it
    # would systematically lower the score without telling us anything
    # about the strength of the implementer's tests.
    "mutate": ["src/**/*.ts", "!src/**/*.spec.ts", "!src/cli.ts"],
    "coverageAnalysis": "perTest",
    "timeoutMS": 10000,
    "concurrency": 2,
    "jsonReporter": {"fileName": "reports/mutation/mutation-report.json"},
}


def mutation_score_from_report(report: dict) -> float | None:
    """Compute Stryker mutation score from a mutation-testing-elements report.

    Formula (Stryker default):
        score = (Killed + Timeout) / (Killed + Survived + Timeout + NoCoverage)

    Compile/runtime errors and Ignored mutants are excluded. Returns ``None``
    when there are no scoreable mutants (would mean Stryker produced no
    usable mutants, which is itself a failure to surface).
    """
    counts: dict[str, int] = {}
    for file_info in (report.get("files") or {}).values():
        for mutant in file_info.get("mutants", []) or []:
            status = mutant.get("status", "")
            counts[status] = counts.get(status, 0) + 1
    killed = counts.get("Killed", 0)
    survived = counts.get("Survived", 0)
    timeout = counts.get("Timeout", 0)
    no_coverage = counts.get("NoCoverage", 0)
    denom = killed + survived + timeout + no_coverage
    if denom == 0:
        return None
    return (killed + timeout) / denom


STRYKER_VERSION = "8.6.0"
STRYKER_PKGS = [
    f"@stryker-mutator/core@{STRYKER_VERSION}",
    f"@stryker-mutator/vitest-runner@{STRYKER_VERSION}",
]


HOIST_LINE = "public-hoist-pattern[]=*stryker*"


def ensure_npmrc_hoist(run_dir: Path, log) -> bool:
    """Stryker's plugin loader can't see vitest-runner under pnpm's
    isolated layout. We need ``public-hoist-pattern[]=*stryker*`` in
    .npmrc *before* the first install — pnpm refuses to add packages to
    a node_modules tree that was created with a different hoist config.
    Returns True if .npmrc was already correct, False if we had to wipe
    node_modules (caller should reinstall)."""
    npmrc = run_dir / ".npmrc"
    text = npmrc.read_text() if npmrc.is_file() else ""
    if HOIST_LINE in text:
        return True
    npmrc.write_text(text + HOIST_LINE + "\n")
    nm = run_dir / "node_modules"
    if nm.is_dir():
        log("  hoist pattern changed → wiping node_modules for clean install")
        import shutil as _sh
        _sh.rmtree(nm)
    return False


def ensure_node_modules(run_dir: Path, log) -> bool:
    """Make sure node_modules/ exists. Mirrors reanalyze-all-runs.sh."""
    if (run_dir / "node_modules").is_dir():
        return True
    log(f"  pnpm install (no node_modules) ...")
    result = subprocess.run(
        ["pnpm", "install",
         "--store-dir", str(PNPM_STORE),
         "--prefer-offline", "--silent"],
        cwd=run_dir, capture_output=True, text=True,
    )
    if result.returncode != 0:
        log(f"  pnpm install FAILED:\n{result.stderr[-500:]}")
        return False
    return True


def ensure_stryker_installed(run_dir: Path, log) -> bool:
    """Add Stryker to the run's devDeps if missing. Cheap cache-hit when
    the pnpm store is warmed via package.cache.json. Assumes
    ensure_npmrc_hoist has already prepared .npmrc.
    """
    stryker_bin = run_dir / "node_modules" / ".bin" / "stryker"
    if stryker_bin.exists():
        return True

    log(f"  installing stryker {STRYKER_VERSION} into run dir ...")
    result = subprocess.run(
        ["pnpm", "add", "-D",
         "--store-dir", str(PNPM_STORE),
         "--prefer-offline", "--silent",
         *STRYKER_PKGS],
        cwd=run_dir, capture_output=True, text=True,
    )
    if result.returncode != 0:
        log(f"  stryker install FAILED:\n{result.stderr[-500:]}")
        return False
    return True


def run_stryker(run_dir: Path, timeout_seconds: int, log) -> float | None:
    """Run Stryker in run_dir and return mutation_score (0.0-1.0) or None."""
    cfg_path = run_dir / "stryker.config.json"
    cfg_path.write_text(json.dumps(STRYKER_CONFIG, indent=2))

    log_path = run_dir / "stryker.log"
    report_path = run_dir / "reports" / "mutation" / "mutation-report.json"
    report_path.parent.mkdir(parents=True, exist_ok=True)

    # Use the run-local Stryker binary (installed by ensure_stryker_installed).
    # A global Stryker cannot resolve the run's `typescript` and crashes with
    # ERR_MODULE_NOT_FOUND in the TS-config preprocessor.
    stryker_bin = run_dir / "node_modules" / ".bin" / "stryker"
    if not stryker_bin.exists():
        log("  stryker binary missing in node_modules/.bin; aborting")
        return None
    cmd = [str(stryker_bin), "run", "--logLevel", "info"]

    # Prepend node_modules/.bin to PATH so test code that spawns
    # subprocesses (e.g. `spawnSync("tsx", ...)` for CLI integration tests)
    # can resolve devDep binaries. Without this, Stryker's vitest worker
    # inherits a PATH that omits the run's local bin dir, and CLI tests
    # fail in the initial dry run with status=null.
    env = os.environ.copy()
    env["PATH"] = f"{run_dir / 'node_modules' / '.bin'}{os.pathsep}{env.get('PATH', '')}"
    try:
        with log_path.open("w") as f:
            f.write(f"$ {' '.join(cmd)}\n")
            f.flush()
            proc = subprocess.run(
                cmd, cwd=run_dir, stdout=f, stderr=subprocess.STDOUT,
                timeout=timeout_seconds, env=env,
            )
    except subprocess.TimeoutExpired:
        log(f"  TIMEOUT after {timeout_seconds}s — score stays null")
        return None

    if proc.returncode != 0:
        log(f"  stryker exited {proc.returncode}; see stryker.log")
        # fall through — sometimes Stryker exits non-zero on low score but
        # still wrote a report; try to parse anyway.

    if not report_path.is_file():
        log(f"  no mutation-report.json produced; score stays null")
        return None

    try:
        report = json.loads(report_path.read_text())
    except json.JSONDecodeError as e:
        log(f"  malformed mutation-report.json ({e}); score stays null")
        return None

    return mutation_score_from_report(report)


def update_metrics_json(metrics_path: Path, score: float | None) -> None:
    metrics = json.loads(metrics_path.read_text())
    metrics.setdefault("final_metrics", {})["mutation_score"] = score
    metrics_path.write_text(json.dumps(metrics, indent=2) + "\n")


def eligible(metrics: dict, force: bool) -> tuple[bool, str]:
    """Return (run_it, reason). reason is for logging when skipping.

    Eligibility is gated on ``tests_passing == true`` alone — a green
    internal suite is the only precondition mutation testing needs.
    ``exit_reason`` (timeout / error-N / rate-limited) is irrelevant:
    if analyze-run.sh marked tests as passing, the suite runs and Stryker
    can score it.
    """
    fm = metrics.get("final_metrics") or {}
    if fm.get("tests_passing") is not True:
        return False, "tests_passing != true"
    existing = fm.get("mutation_score")
    if isinstance(existing, (int, float)) and not force:
        return False, f"mutation_score already set ({existing:.3f})"
    return True, ""


def main(argv: list[str]) -> int:
    parser = argparse.ArgumentParser(
        description=__doc__,
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    parser.add_argument("rq_path", type=Path,
                        help="path to RQ dir (or its README.md)")
    parser.add_argument("--limit", type=int, default=None,
                        help="process at most N eligible runs (smoke test)")
    parser.add_argument("--timeout-seconds", type=int, default=1800,
                        help="Stryker wallclock per run (default 1800)")
    parser.add_argument("--dry-run", action="store_true",
                        help="list eligible runs without invoking Stryker")
    parser.add_argument("--force", action="store_true",
                        help="recompute even if mutation_score is already set")
    args = parser.parse_args(argv)

    md_in = args.rq_path / "README.md" if args.rq_path.is_dir() else args.rq_path
    if not md_in.is_file():
        print(f"Not found: {md_in}", file=sys.stderr)
        return 1

    fm = agg.parse_frontmatter(md_in)
    rq_id = fm.get("id", "?")
    outcomes = fm.get("outcomes") or []
    if "mutation_score" not in outcomes:
        print(f"{rq_id}: outcomes do not include 'mutation_score'; "
              f"nothing to do.", file=sys.stderr)
        return 0

    cells = agg.expand_cells(fm)
    matched, _by_cell = agg.collect_runs(cells)

    n_total = len(matched)
    n_already = 0
    n_skipped_red = 0
    n_skipped_other = 0
    eligible_paths: list[Path] = []

    for m_file in matched:
        try:
            metrics = json.loads(m_file.read_text())
        except json.JSONDecodeError:
            n_skipped_other += 1
            continue
        run_it, reason = eligible(metrics, args.force)
        if not run_it:
            if reason.startswith("mutation_score already"):
                n_already += 1
            elif reason.startswith("tests_passing"):
                n_skipped_red += 1
            else:
                n_skipped_other += 1
            continue
        eligible_paths.append(m_file)

    if args.limit is not None:
        eligible_paths = eligible_paths[: args.limit]

    print(f"{rq_id}: {n_total} matching runs — "
          f"{n_already} already scored, {n_skipped_red} red, "
          f"{n_skipped_other} other-skip, {len(eligible_paths)} to run",
          file=sys.stderr)

    if args.dry_run:
        for p in eligible_paths:
            print(p.parent.name)
        return 0

    n_executed = 0
    n_failed = 0
    for m_file in eligible_paths:
        run_dir = m_file.parent
        run_id = run_dir.name
        print(f"--- {run_id}", file=sys.stderr)

        def log(msg: str, _rid=run_id) -> None:
            print(f"  [{_rid}] {msg}", file=sys.stderr)

        ensure_npmrc_hoist(run_dir, log)

        if not ensure_node_modules(run_dir, log):
            n_failed += 1
            update_metrics_json(m_file, None)
            continue

        if not ensure_stryker_installed(run_dir, log):
            n_failed += 1
            update_metrics_json(m_file, None)
            continue

        score = run_stryker(run_dir, args.timeout_seconds, log)
        update_metrics_json(m_file, score)
        if score is None:
            n_failed += 1
            log("score=null (see stryker.log)")
        else:
            n_executed += 1
            log(f"score={score:.3f}")

    print(f"{rq_id}: executed={n_executed}, failed={n_failed}, "
          f"already={n_already}", file=sys.stderr)
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
