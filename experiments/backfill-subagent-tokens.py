#!/usr/bin/env python3
"""Backfill subagent tokens into total_tokens for runs analysed before 2026-09-30.

Until that date ``analyze_transcript.py`` summed ``total_tokens`` from
``transcript.jsonl`` alone. Subagent consumption went into a separate
``subagent_token_total`` that was never added, and ``analyze-run.sh`` did not
read that field at all, so it never reached ``metrics.json``, ``runs.csv`` or
``compute-cost.py``. Every isolated-subagent arm was therefore recorded short —
and unevenly, because the shortfall scales with how much the workflow delegates
(RQ-old-vs-new-exact-line-opus55 F-4.12.5).

This rewrites only the token fields:

* ``transcript-metrics.json`` gains ``main_context_tokens`` (the previous
  ``total_tokens``) and ``subagent_tokens`` (per type), and its ``total_tokens``
  becomes the sum of both.
* ``metrics.json`` gets the new total in ``summary_metrics.total_tokens`` plus
  ``summary_metrics.subagent_token_total``.

It deliberately does **not** re-run the transcript parser. A full reparse would
rewrite cycle_count, predictions and the phase summary of every old run with
today's parser, silently changing metrics that have nothing to do with this
defect. The token sums are computed with the parser's own functions instead, so
the two cannot drift apart.

Idempotent: a run whose ``transcript-metrics.json`` already carries
``main_context_tokens`` is left alone unless ``--force`` is given.

Usage:
  experiments/backfill-subagent-tokens.py --dry-run
  experiments/backfill-subagent-tokens.py
  experiments/backfill-subagent-tokens.py --run-dir experiments/runs/<one-run>
"""
from __future__ import annotations

import argparse
import importlib.util
import json
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
RUNS_DIR = HERE / "runs"

_spec = importlib.util.spec_from_file_location(
    "analyze_transcript", HERE / "analyze_transcript.py"
)
at = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(at)  # type: ignore[union-attr]

KEYS = ("input", "output", "cache_read", "cache_creation")


def subagent_breakdown(run_dir: Path) -> tuple[dict[str, int], int]:
    """Per-type subagent tokens and the number of subagent transcripts."""
    sub_dir = run_dir / "transcript-subagents"
    out = {k: 0 for k in KEYS}
    if not sub_dir.is_dir():
        return out, 0
    n = 0
    for jsonl_path in sorted(sub_dir.glob("agent-*.jsonl")):
        n += 1
        for event in at.parse_jsonl(jsonl_path):
            msg = at.extract_assistant_message(event)
            if msg is None:
                continue
            for k, v in at.message_token_breakdown(msg).items():
                out[k] += v
    return out, n


def backfill(run_dir: Path, force: bool, dry_run: bool) -> tuple[str, int, int]:
    """Returns (status, old_total, new_total)."""
    tm_path = run_dir / "transcript-metrics.json"
    if not tm_path.is_file():
        return "no-transcript-metrics", 0, 0
    try:
        tm = json.loads(tm_path.read_text())
    except json.JSONDecodeError:
        return "bad-transcript-metrics", 0, 0
    if "main_context_tokens" in tm and not force:
        return "already-done", 0, 0

    sub, n_agents = subagent_breakdown(run_dir)
    if n_agents == 0:
        return "no-subagents", 0, 0

    # On --force the stored main_context_tokens is the authority, so a second
    # pass cannot add the subagent tokens twice.
    main = dict(tm.get("main_context_tokens") or tm.get("total_tokens") or {})
    if not all(k in main for k in KEYS):
        return "incomplete-token-block", 0, 0

    old_total = int((tm.get("total_tokens") or {}).get("total") or 0)
    new = {k: int(main[k]) + sub[k] for k in KEYS}
    new["total"] = sum(new.values())

    if not dry_run:
        tm["main_context_tokens"] = {**{k: int(main[k]) for k in KEYS},
                                    "total": sum(int(main[k]) for k in KEYS)}
        tm["subagent_tokens"] = sub
        tm["subagent_token_total"] = sum(sub.values())
        tm["total_tokens"] = new
        tm_path.write_text(json.dumps(tm, indent=2) + "\n")

        m_path = run_dir / "metrics.json"
        if m_path.is_file():
            try:
                m = json.loads(m_path.read_text())
            except json.JSONDecodeError:
                return "bad-metrics-json", old_total, new["total"]
            m.setdefault("summary_metrics", {})
            m["summary_metrics"]["total_tokens"] = new["total"]
            m["summary_metrics"]["subagent_token_total"] = sum(sub.values())
            m_path.write_text(json.dumps(m, indent=2) + "\n")

    return "backfilled", old_total, new["total"]


def main(argv: list[str]) -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--run-dir", help="single run directory (default: all)")
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--force", action="store_true",
                    help="redo runs that already carry main_context_tokens")
    args = ap.parse_args(argv[1:])

    if args.run_dir:
        dirs = [Path(args.run_dir)]
    else:
        dirs = sorted(d for d in RUNS_DIR.iterdir()
                      if d.is_dir() and not d.name.startswith("_"))

    counts: dict[str, int] = {}
    added = 0
    for d in dirs:
        status, old, new = backfill(d, args.force, args.dry_run)
        counts[status] = counts.get(status, 0) + 1
        if status == "backfilled":
            added += new - old
            pct = 100 * (new - old) / old if old else 0.0
            print(f"  {d.name}\n      {old/1e6:.1f} M → {new/1e6:.1f} M  (+{pct:.1f} %)")

    print()
    for k in sorted(counts):
        print(f"{k}: {counts[k]}")
    print(f"tokens added in total: {added/1e6:.1f} M"
          + ("  (dry run — nothing written)" if args.dry_run else ""))
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
