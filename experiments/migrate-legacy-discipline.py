"""Rename the superseded TDD-discipline metrics to `legacy_*` in existing runs.

From 2026-10 TDD discipline has exactly one source: the phase chain derived from
the stack reporter's event stream (`tdd-report.py` over `tdd-events.jsonl`). The
three routes it replaces all keyed on something a workflow had to supply, so
each fell silent somewhere — markers are absent from vendored external skills by
policy, and the edit-tool route reads zero for any model that writes files
through the shell, indistinguishably from "never wrote a test".

Those columns are not deleted: the findings written from them must stay
reproducible. They are renamed, so that a legacy number can never be read as a
current one, and so an RQ still asking for one is visible.

The event stream cannot be reconstructed after the fact — no reanalysis pass
can produce it. **Migrating a run therefore means re-running it.** That is the
rule this script exists to make visible: once an RQ is touched again, its runs
have to be refilled before the new metrics mean anything across its cells.

Usage:
  ./migrate-legacy-discipline.py --dry-run     # report what would change
  ./migrate-legacy-discipline.py               # rewrite metrics.json in place
"""
import argparse, json, sys
from pathlib import Path

# Superseded by the phase chain. Grouped by the route that produced them, which
# is also the order in which they became unreliable.
LEGACY = {
    # measure-suite-transitions.py — the transcript approximation of the chain.
    # Same construct, weaker source: it reads suite state out of shell output,
    # which a bundled type-check can fool.
    "suite_runs", "suite_unknown_runs", "suite_cycles", "suite_new_failures",
    "suite_opens_red", "suite_ends_green", "suite_unresolved_red",
    "suite_longest_green_streak",
    # measure-tdd-rigour.py — reconstructed cycles from Write/Edit/MultiEdit
    # calls, so it reads 0 for a model that edits through the shell.
    "test_blocks", "test_cases_total", "test_cases_first_block",
    "red_verified", "red_unverified", "tcr_refactor_steps",
    # marker-derived discipline. cycle_count in particular had a fallback chain
    # ending in a count of `pnpm test` invocations, which is a suite-run
    # counter wearing a cycle counter's name.
    "cycle_count", "refactorings_applied", "tests_passed_immediately",
}
PREFIX = "legacy_"


def migrate(metrics_path, dry_run):
    try:
        m = json.loads(metrics_path.read_text())
    except (OSError, json.JSONDecodeError) as exc:
        return None, f"{type(exc).__name__}: {exc}"
    sm = m.get("summary_metrics")
    if not isinstance(sm, dict):
        return [], None
    moved = []
    for name in sorted(LEGACY):
        if name not in sm:
            continue
        target = PREFIX + name
        if target in sm:
            # Already migrated and then re-analysed by an older pipeline: the
            # legacy value is the one to keep, so drop the duplicate rather
            # than overwrite a good value with a stale one.
            sm.pop(name)
            moved.append(f"{name} (dropped, {target} already present)")
            continue
        sm[target] = sm.pop(name)
        moved.append(name)
    if moved and not dry_run:
        tmp = metrics_path.with_suffix(".json.tmp")
        tmp.write_text(json.dumps(m, indent=2) + "\n")
        tmp.replace(metrics_path)
    return moved, None


def main():
    ap = argparse.ArgumentParser(description=__doc__,
        formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--runs-dir", type=Path,
        default=Path(__file__).resolve().parent / "runs")
    ap.add_argument("--pattern", default="*", help="glob over run directory names")
    ap.add_argument("--dry-run", action="store_true",
        help="report what would change and write nothing")
    a = ap.parse_args()

    if not a.runs_dir.is_dir():
        sys.exit(f"runs dir not found: {a.runs_dir}")

    touched = clean = 0
    errors = []
    per_field = {}
    for run in sorted(a.runs_dir.glob(a.pattern)):
        mj = run / "metrics.json"
        if not mj.exists():
            continue
        moved, err = migrate(mj, a.dry_run)
        if err:
            errors.append(f"{run.name}: {err}")
            continue
        if moved:
            touched += 1
            for f in moved:
                per_field[f] = per_field.get(f, 0) + 1
        else:
            clean += 1

    verb = "would rename" if a.dry_run else "renamed"
    print(f"{verb} in {touched} runs; {clean} already clean")
    for f, n in sorted(per_field.items(), key=lambda kv: -kv[1]):
        print(f"  {f:34s} {n}")
    for e in errors:
        print(f"  ERROR {e}", file=sys.stderr)
    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main())
