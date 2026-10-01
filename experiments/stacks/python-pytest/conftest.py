"""Records one append-only event per test-suite invocation, for measuring TDD
discipline without workflow markers and without reading the transcript.

The counterpart of tdd-reporter.mjs on the TypeScript stack. The rationale is
the same and lives there in full: every other route keyed on something the
workflow had to supply — phase markers, Write/Edit tool calls, per-cycle
commits — so each fell silent somewhere. Running the tests is the one event no
TDD workflow can avoid, and pytest calls these hooks itself, so the record is
identical across workflows, harnesses and edit mechanisms.

Two hard constraints, both load-bearing:

1. Nothing is written to stdout or stderr. The verification suites start the
   kata CLI as a subprocess and assert its stderr is empty; a chatty plugin
   fails runs for a reason unrelated to the agent's code.
2. Nothing raises. A plugin that throws takes the test session with it, which
   would look like a workflow failure. Every step is guarded and a failure to
   record is dropped silently — a missing event is a measurement gap, a broken
   test run is corrupted data.

`TDD_REPORTER_OFF` suppresses recording: the analysis pipeline runs the suite
again and mutation testing runs it once per mutant, and neither belongs in a
record of what the agent did.
"""
import hashlib
import json
import os
from datetime import datetime, timezone
from pathlib import Path

EVENTS_FILE = "tdd-events.jsonl"
# The sources the agent authors. .venv and caches would dominate the walk and
# say nothing about the exercise.
ROOTS = ("src", "test", "tests")
SKIP_DIRS = {".venv", "venv", "node_modules", ".git", "__pycache__",
             ".pytest_cache", ".ruff_cache", ".mutmut-cache", "dist", "target"}

# Collected across the session by the report hooks, then written once at the
# end. Keyed by test id so a repeated phase (setup/call/teardown) does not
# count the same test twice.
_outcomes: dict[str, str] = {}
_collect_errors = 0


def _snapshot_tree(root: Path) -> dict:
    tree = {}
    for r in ROOTS:
        base = root / r
        if not base.is_dir():
            continue
        for p in base.rglob("*"):
            if not p.is_file() or p.name.startswith("."):
                continue
            if any(part in SKIP_DIRS for part in p.parts):
                continue
            try:
                raw = p.read_bytes()
            except OSError:
                continue          # unreadable mid-write: skip the file, keep the event
            tree[p.relative_to(root).as_posix()] = {
                "sha256": hashlib.sha256(raw).hexdigest()[:16],
                "bytes": len(raw),
                "lines": raw.decode("utf-8", "replace").count("\n") + 1,
            }
    return tree


def pytest_runtest_logreport(report):
    """One report per phase; the call phase decides, setup/teardown can fail."""
    try:
        nodeid = report.nodeid
        if report.when == "call":
            _outcomes[nodeid] = report.outcome          # passed / failed / skipped
        elif report.outcome == "failed":
            # An error in setup or teardown means the test did not pass, even
            # though no call phase ran.
            _outcomes[nodeid] = "failed"
        elif report.when == "setup" and report.outcome == "skipped":
            _outcomes.setdefault(nodeid, "skipped")
    except Exception:
        pass


def pytest_collectreport(report):
    """A module that cannot be imported is the first step of a two-step red."""
    global _collect_errors
    try:
        if report.outcome == "failed":
            _collect_errors += 1
    except Exception:
        pass


def pytest_sessionfinish(session, exitstatus):
    try:
        if os.environ.get("TDD_REPORTER_OFF"):
            return
        root = Path(str(session.config.rootpath))
        passed = [n for n, o in _outcomes.items() if o == "passed"]
        failed = [n for n, o in _outcomes.items() if o == "failed"]
        skipped = [n for n, o in _outcomes.items() if o == "skipped"]
        total = len(_outcomes)

        events = root / EVENTS_FILE
        try:
            seq = sum(1 for line in events.read_text().splitlines() if line.strip()) + 1
        except OSError:
            seq = 1

        with events.open("a", encoding="utf-8") as fh:
            fh.write(json.dumps({
                "seq": seq,
                "ts": datetime.now(timezone.utc).isoformat(),
                # Derived here for convenience; tdd-report.py recomputes it from
                # the counts so a fix to the rule reaches existing streams.
                "suite_failed": bool(failed or _collect_errors),
                "tests": {"passed": len(passed), "failed": len(failed),
                          "skipped": len(skipped), "total": total},
                "collection_errors": _collect_errors,
                # pytest reports every collected test, so there is no analogue
                # of vitest's declared-but-unrun file. Kept at 0 so the event
                # carries the current format marker and tdd-report.py uses the
                # precise failure rule rather than the legacy fallback.
                "files_failed": 0,
                "failed_tests": sorted(failed),
                "passed_tests": sorted(passed),
                "duration_ms": None,
                "tree": _snapshot_tree(root),
            }) + "\n")
    except Exception:
        # Recording failed. Losing one event is acceptable; failing the run is not.
        pass
