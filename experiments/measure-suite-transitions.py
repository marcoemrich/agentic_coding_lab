"""Measure TDD rigour from suite outcomes, not from edit tool calls.

`measure-tdd-rigour.py` reconstructs cycles from *edits*: it needs Write/Edit/
MultiEdit tool calls to tell a test-write from an impl-write. That assumption
breaks silently when a model edits through the shell instead — heredocs
(`cat > src/x.spec.ts <<EOF`), `sed -i`, inline `python3` string replaces. The
run then reports `test_blocks: 0` and every derived number collapses, which is
indistinguishable from "the model never wrote a test".

This script reads the other side of the same loop: **what the test runs said**.
For every full-suite invocation it classifies the *result* as red or green and
measures the state sequence. That is independent of how the file got written —
Write tool, heredoc, sed, or a TCR commit hook — and it is the construct TDD
actually claims: the suite was red, then it was green.

Headline metric is `cycles` = red→green transitions. Compare it to marker-based
`cycle_count` only with the usual caveat (different constructs; see
experiments/workflows/MARKERS.md). What it adds over the marker path is
coverage: it produces numbers for runs where no marker and no edit tool exists.

Stack coverage follows TEST_RUN in measure-tdd-rigour.py, which stays the single
authoritative list of full-suite commands — it is imported, never copied.

Examples:
  # every run in experiments/runs, to stdout
  ./measure-suite-transitions.py

  # one run as a single JSON object (same contract as measure-tdd-rigour.py --run)
  ./measure-suite-transitions.py --run experiments/runs/<run>

  # one workflow, into a file
  ./measure-suite-transitions.py transitions.json \
      --workflow external-kesseler-2026-09-30-cc
"""
import argparse, importlib.util, json, re, sys
from pathlib import Path

# TEST_RUN is the authoritative per-stack list of full-suite commands and lives
# in measure-tdd-rigour.py. The filename is not importable (hyphens), so load it
# by path rather than duplicating the regex — a new stack must change one place.
_SIBLING = Path(__file__).resolve().parent / "measure-tdd-rigour.py"
_spec = importlib.util.spec_from_file_location("_tdd_rigour", _SIBLING)
_rigour = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(_rigour)
TEST_RUN = _rigour.TEST_RUN

# --- Outcome classification, per stack -------------------------------------
# Two tiers, and the order between them is load-bearing.
#
# A runner's own summary line is authoritative: it is the framework reporting
# on its own run. The heuristics below it are guesses from surrounding text,
# and they can be fooled — models routinely bundle a type-check and the suite
# into one shell command, so a `tsc` failure lands in the same output as a
# clean test run. Measured on a real run (2026-09-30 kesseler, invocation 80):
# `TS2307: Cannot find module 'node:child_process'` next to
# `Tests  47 passed (47)`. Reading the heuristic first calls that red; the
# framework's own reporter calls it green, and the framework is right — vitest
# transpiles without type-checking, so a tsc error does not fail a suite.
#
# Models also pipe output through grep, so every pattern must survive on
# filtered lines alone.
FAIL_SUMMARY = re.compile(
    r"\bTests?\s+\d+\s+failed"                       # vitest
    r"|\bTest Files\s+\d+\s+failed"
    r"|\bTests run:\s*\d+,\s*Failures:\s*(?!0\b)\d+"  # surefire
    r"|\bTests run:\s*\d+,\s*Failures:\s*\d+,\s*Errors:\s*(?!0\b)\d+"
    r"|^=+ .*\b\d+ (?:failed|error)"                  # pytest header
    r"|\b\d+ failed\b",                              # pytest short summary
    re.I | re.M)
PASS_SUMMARY = re.compile(
    r"\bTests?\s+\d+\s+passed\b"                     # vitest
    r"|\bTest Files\s+\d+\s+passed\b"
    r"|\bTests run:\s*\d+,\s*Failures:\s*0,\s*Errors:\s*0"   # surefire clean
    r"|^=+ .*\b\d+ passed"                            # pytest header
    r"|\b\d+ passed\b",                              # pytest short summary
    re.I | re.M)
# Fallbacks only: no summary line was emitted at all, usually because the suite
# never got far enough to produce one.
RED_HEURISTIC = re.compile(
    r"^\s*FAIL\b|\bFAIL\s+src/"                       # vitest per-file
    r"|\bAssertionError\b|\bexpected .* to (?:be|equal)\b"
    r"|\bBUILD FAILURE\b|\bCOMPILATION ERROR\b"       # maven
    r"|\bERRORS?\b.*\bcollecting\b|\bcollection error\b"
    r"|\bTS\d{4}:|\bTransform failed\b|\bSyntaxError\b"
    r"|\bcannot find (?:module|symbol)\b",
    re.I | re.M)
GREEN_HEURISTIC = re.compile(r"\bBUILD SUCCESS\b", re.I)


def classify(result_text):
    """red / green / unknown for one suite invocation's output."""
    if not result_text:
        return "unknown"
    # Tier 1 — the runner's own verdict.
    if FAIL_SUMMARY.search(result_text):
        return "red"
    if PASS_SUMMARY.search(result_text):
        return "green"
    # Tier 2 — no summary line; guess from the surrounding text.
    if RED_HEURISTIC.search(result_text):
        return "red"
    if GREEN_HEURISTIC.search(result_text):
        return "green"
    return "unknown"


# --- Transcript readers -----------------------------------------------------
# Each yields the result text of every full-suite invocation, in order. A suite
# command whose result never arrived (run cut off by the timeout) yields "" and
# lands in `unknown`, never silently in `green`.

def _text_of(content):
    if isinstance(content, str):
        return content
    if isinstance(content, list):
        return "".join(b.get("text", "") for b in content if isinstance(b, dict))
    return ""


def _suite_results_one_cc_file(path):
    """(timestamp, result_text) per full-suite invocation in one CC transcript.

    tool_use and its tool_result are paired by id; a call whose result never
    arrived (run cut off) yields "" and lands in `unknown`, never in `green`.
    """
    pending = {}      # tool_use_id -> timestamp of the invocation
    order = []
    results = {}
    for line in open(path):
        try:
            d = json.loads(line)
        except Exception:
            continue
        ts = d.get("timestamp") or ""
        content = (d.get("message") or {}).get("content")
        if not isinstance(content, list):
            continue
        for b in content:
            if not isinstance(b, dict):
                continue
            if b.get("type") == "tool_use" and b.get("name") in ("Bash", "bash"):
                cmd = (b.get("input") or {}).get("command") or ""
                if TEST_RUN.search(cmd):
                    tid = b.get("id")
                    pending[tid] = ts
                    order.append(tid)
            elif b.get("type") == "tool_result":
                tid = b.get("tool_use_id")
                if tid in pending:
                    results[tid] = _text_of(b.get("content"))
    return [(pending[tid], results.get(tid, "")) for tid in order]


def suite_results_cc(run):
    """Claude Code / OpenCode, main context *and* subagents, in wall-clock order.

    Fully-delegated workflows (`exact-subagents-*`) run the suite inside the
    phase subagent, so the main transcript contains no suite invocation at all —
    reading only `transcript.jsonl` reports 0 cycles against a marker count of
    ~23. `transcript-subagents/*.jsonl` carry the same message shape, and both
    sides timestamp every message, so the two are merged chronologically rather
    than by Task-call order.
    """
    events = _suite_results_one_cc_file(run / "transcript.jsonl")
    sub = run / "transcript-subagents"
    if sub.is_dir():
        for f in sorted(sub.glob("*.jsonl")):
            try:
                events += _suite_results_one_cc_file(f)
            except OSError:
                continue
    # Empty timestamps sort first; they only occur on malformed lines.
    for _, text in sorted(events, key=lambda e: e[0]):
        yield text


def suite_results_pi(run):
    """pi: tool_execution_start(bash) then tool_execution_end carrying the output."""
    pending = {}
    order = []
    results = {}
    for line in open(run / "transcript-pi.jsonl"):
        try:
            d = json.loads(line)
        except Exception:
            continue
        t = d.get("type")
        if t == "tool_execution_start" and d.get("toolName") == "bash":
            cmd = (d.get("args") or {}).get("command") or ""
            if TEST_RUN.search(cmd):
                tid = d.get("toolCallId") or d.get("id")
                pending[tid] = True
                order.append(tid)
        elif t == "tool_execution_end":
            tid = d.get("toolCallId") or d.get("id")
            if tid in pending:
                r = d.get("result")
                if isinstance(r, dict):
                    # pi wraps bash output in the same content-block shape CC
                    # uses; output/stdout are the older spellings.
                    r = (_text_of(r.get("content"))
                         or r.get("output") or r.get("stdout") or "")
                results[tid] = r if isinstance(r, str) else ""
    for tid in order:
        yield results.get(tid, "")


# --- Sequence metrics -------------------------------------------------------

def measure(states):
    """Metrics over the red/green state sequence.

    `unknown` runs are dropped from the sequence but reported, so a run whose
    output we could not read is visible instead of being scored as green.
    Consecutive identical states are collapsed into segments: three greens in a
    row are one green arrival being re-confirmed, not three.
    """
    known = [s for s in states if s in ("red", "green")]
    segments = []
    for s in known:
        if not segments or segments[-1][0] != s:
            segments.append([s, 1])
        else:
            segments[-1][1] += 1

    cycles = sum(1 for a, b in zip(segments, segments[1:])
                 if a[0] == "red" and b[0] == "green")
    new_failures = sum(1 for a, b in zip(segments, segments[1:])
                       if a[0] == "green" and b[0] == "red")
    red_segs = [n for s, n in segments if s == "red"]
    green_segs = [n for s, n in segments if s == "green"]
    return dict(
        suite_runs=len(states),
        unknown_runs=len(states) - len(known),
        red_runs=known.count("red"),
        green_runs=known.count("green"),
        # headline: completed red -> green transitions
        cycles=cycles,
        # a green suite that went red again = a new failing test was introduced
        new_failures=new_failures,
        red_segments=len(red_segs),
        green_segments=len(green_segs),
        # did the very first suite run fail? a green opener means tests and impl
        # were both written before anything was ever executed (big bang)
        opens_red=(segments[0][0] == "red") if segments else None,
        ends_green=(segments[-1][0] == "green") if segments else None,
        # a red segment never followed by green = a failure left unresolved
        unresolved_red=(1 if segments and segments[-1][0] == "red" else 0),
        longest_green_streak=max(green_segs) if green_segs else 0,
        sequence="".join("R" if s == "red" else "G" for s in known),
    )


def analyse(run):
    run = Path(run)
    reader = suite_results_pi if (run / "transcript-pi.jsonl").exists() else suite_results_cc
    try:
        states = [classify(r) for r in reader(run)]
    except OSError:
        return None            # aborted run, no transcript
    if not states:
        return None
    return measure(states)


def main():
    ap = argparse.ArgumentParser(description=__doc__,
        formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("out", nargs="?", default=None, help="output JSON file (default: stdout)")
    ap.add_argument("--runs-dir", type=Path, default=Path(__file__).resolve().parent / "runs",
        help="directory holding the run folders (default: experiments/runs next to this script)")
    ap.add_argument("--pattern", default="*", help="glob over run directory names (default: all)")
    ap.add_argument("--workflow", nargs="*", default=None,
        help="keep only these workflows, matched against metrics.json (default: all)")
    ap.add_argument("--kata-suffix", default="", help="keep only katas ending in this suffix")
    ap.add_argument("--run", type=Path, default=None,
        help="analyse one run directory and print a single JSON object")
    ap.add_argument("--compare", action="store_true",
        help="add the run's marker-based cycle_count from metrics.json next to `cycles`, "
             "for validating this script against the marker path")
    a = ap.parse_args()

    if a.run:
        # Always emit an object so a caller piping into jq never chokes.
        json.dump(analyse(a.run) or {}, sys.stdout); print()
        return

    if not a.runs_dir.is_dir():
        sys.exit(f"runs dir not found: {a.runs_dir}")
    wanted = set(a.workflow) if a.workflow else None
    out, skipped_no_events, skipped_broken = [], 0, 0
    for run in sorted(a.runs_dir.glob(a.pattern)):
        mj = run / "metrics.json"
        if not mj.exists():
            continue
        m = json.loads(mj.read_text())
        kata = str(m.get("kata", ""))
        if a.kata_suffix and not kata.endswith(a.kata_suffix):
            continue
        wf = m.get("workflow")
        if wanted is not None and wf not in wanted:
            continue
        try:
            r = analyse(run)
        except Exception as exc:     # one malformed transcript must not kill the batch
            print(f"skipping {run.name}: {type(exc).__name__}: {exc}", file=sys.stderr)
            skipped_broken += 1
            continue
        if not r:
            skipped_no_events += 1
            continue
        r.update(run=run.name, workflow=wf, model=m.get("model"),
                 kata=kata.split("-example")[0])
        if a.compare:
            sm = m.get("summary_metrics") or {}
            r["marker_cycle_count"] = sm.get("cycle_count")
            r["marker_test_blocks"] = sm.get("test_blocks")
            # phase_source lives in transcript-metrics.json, not metrics.json.
            tm = run / "transcript-metrics.json"
            if tm.exists():
                try:
                    r["phase_source"] = json.loads(tm.read_text()).get("phase_source")
                except Exception:
                    r["phase_source"] = None
            else:
                r["phase_source"] = None
        out.append(r)

    json.dump(out, open(a.out, "w") if a.out else sys.stdout, indent=1)
    if not a.out:
        print()
        sys.stdout.flush()       # otherwise the stderr summary interleaves into the JSON
    print(f"analysed: {len(out)} runs", file=sys.stderr)
    if skipped_no_events:
        print(f"skipped (no suite invocation found): {skipped_no_events}", file=sys.stderr)
    if skipped_broken:
        print(f"skipped (malformed transcript): {skipped_broken}", file=sys.stderr)


if __name__ == "__main__":
    main()
