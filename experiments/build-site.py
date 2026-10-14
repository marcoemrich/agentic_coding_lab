#!/usr/bin/env python3
"""Build the results site from the lab.

Re-aggregates every RQ (research/*/*/README.md), runs the site data export and
the Astro build, prints each step's duration as it finishes and closes with
`git diff --stat` over research/. Stops at the first failing step with a
non-zero exit code; within the aggregate step every RQ runs first, so all
failures are listed at once. Refuses while a batch is running, through the
aggregator's batch lock.

Usage:
  uv run --project experiments python experiments/build-site.py
"""
from __future__ import annotations

import contextlib
import importlib.util
import io
import subprocess
import sys
import time
from pathlib import Path

# The aggregator is driven in-process: its batch lock is asked once up front,
# and each RQ goes through its main() with stderr captured.
_AGG = Path(__file__).resolve().parent / "aggregate-by-query.py"
_spec = importlib.util.spec_from_file_location("aggregate_by_query", _AGG)
agg = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(agg)

REPO_ROOT = Path(__file__).resolve().parent.parent
RESEARCH_DIR = REPO_ROOT / "research"
SITE_DIR = REPO_ROOT / "site"
DIST_RQ_DIR = SITE_DIR / "dist" / "rq"
EXPORT_COMMAND = [sys.executable, str(Path(__file__).resolve().parent / "export-site-data.py")]
ASTRO_COMMAND = ["pnpm", "build"]

clock = time.monotonic


def rq_dirs(research_dir: Path) -> list[Path]:
    """Every RQ, main or not, in directory-path order."""
    return sorted(readme.parent for readme in research_dir.glob("*/*/README.md"))


def written_files(report: str) -> list[str]:
    """The files the aggregator reports as rewritten ("  wrote <path>")."""
    return [Path(line.split(maxsplit=1)[1]).name
            for line in report.splitlines() if line.startswith("  wrote ")]


def names_archived_workflow(report: str) -> bool:
    """The aggregator refused because the selector names an archived workflow
    (check_archived_workflows(), the first thing it prints in that case)."""
    return report.startswith("ERROR: selector names")


def run_aggregator(rq_dir: Path) -> tuple[int, str]:
    """The aggregator's exit code for one RQ and what it printed to stderr. A
    crash, its own SystemExit("cell missing ...") included, counts as exit 1
    with the crash's message as the report."""
    report = io.StringIO()
    try:
        with contextlib.redirect_stderr(report):
            code = agg.main(["aggregate-by-query.py", str(rq_dir)])
    except (Exception, SystemExit) as crash:
        return 1, str(crash) or type(crash).__name__
    return code, report.getvalue()


def rq_outcome(code: int, report: str) -> tuple[str, bool]:
    """What happened to one RQ's files, as the build states it, and whether
    that is a failure. A skip is intended and is not."""
    if code != 0 and names_archived_workflow(report):
        return "skipped — names an archived workflow", False
    if code != 0:
        first_error_line = report.partition("\n")[0]
        return f"FAILED — {first_error_line}", True
    written = written_files(report)
    if written:
        return f"wrote {', '.join(written)}", False
    return "unchanged", False


def aggregate_rq(rq_dir: Path) -> bool:
    """Aggregate one RQ, print its line, and say whether it failed."""
    rq_id = agg.parse_frontmatter(rq_dir / "README.md")["id"]
    outcome, failed = rq_outcome(*run_aggregator(rq_dir))
    print(f"{rq_id}  {outcome}", flush=True)
    return failed


def batch_lock_refusal() -> str | None:
    """Why nothing may be aggregated now, or None. The lock is the aggregator's;
    asking it once up front gives one message instead of one per RQ."""
    try:
        batch = agg.running_batch_containers()
    except agg.DockerUnreachable:
        return "cannot reach Docker"
    return "a batch is running" if batch else None


def aggregate_all(research_dir: Path) -> int:
    """Every RQ, failures included, before the step stops: exit 1 if any failed."""
    refusal = batch_lock_refusal()
    if refusal:
        print(f"build-site: {refusal} — nothing aggregated")
        return 1
    failures = [aggregate_rq(rq_dir) for rq_dir in rq_dirs(research_dir)]
    return 1 if any(failures) else 0


def run_tool(command: list[str], cwd: Path) -> int:
    """Run one tool with its own output shown in full."""
    return subprocess.run(command, cwd=cwd, check=False).returncode


def diff_stat(repo_root: Path) -> str:
    """`git diff --stat` over research/, the only tracked files the build writes."""
    result = subprocess.run(["git", "-C", str(repo_root), "diff", "--stat", "--", "research/"],
                            capture_output=True, text=True, check=False)
    return result.stdout.rstrip() or "no changes"


def steps() -> list:
    """The build in order, by name; each step returns its exit code."""
    return [("aggregate", lambda: aggregate_all(RESEARCH_DIR)),
            ("export", lambda: run_tool(EXPORT_COMMAND, REPO_ROOT)),
            ("astro build", lambda: run_tool(ASTRO_COMMAND, SITE_DIR))]


def page_count(dist_rq_dir: Path) -> int:
    """The RQ pages the Astro build wrote, one index.html per RQ."""
    return len(list(dist_rq_dir.glob("*/index.html")))


def run_steps() -> tuple[str, int]:
    """Run the steps in order, each followed by its duration, up to the first
    that fails: that step's name and exit code, or ("", 0)."""
    for name, step in steps():
        started = clock()
        code = step()
        print(f"{name} {clock() - started:.1f} s", flush=True)
        if code:
            return name, code
    return "", 0


def main() -> int:
    build_started = clock()
    stopped_after, code = run_steps()
    print(diff_stat(REPO_ROOT))
    if code:
        print(f"build stopped after {stopped_after} (exit {code})")
    else:
        print(f"built {page_count(DIST_RQ_DIR)} pages in {clock() - build_started:.1f} s")
    return code


if __name__ == "__main__":
    sys.exit(main())
