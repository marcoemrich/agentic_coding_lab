#!/usr/bin/env python3
"""Parse OpenCode session export into transcript-metrics.json.

OpenCode stores sessions in a SQLite DB inside the container and exposes
them via `opencode export <sessionID>` as JSON. run-batch.sh writes that
JSON to <run_dir>/transcript-opencode.json after each OC run.

This script reads that file and emits transcript-metrics.json in the
schema that analyze-run.sh's extract_transcript_metrics() expects, so the
existing aggregation pipeline picks up token counts (and, eventually,
TDD-discipline markers) without a fork.

Fields emitted:
  - total_tokens.{input, output, reasoning, cache_read, cache_write, total}
  - context_utilization_pct      (None for OC — no documented context-cap signal)
  - cycle_count                  (0 for non-TDD OC workflows)
  - phase_summary.averages.{red,green,refactor}.avg_duration_seconds (0)
  - phase_summary.refactorings_applied / tests_passed_immediately      (0)
  - predictions_correct / predictions_total                             (0)
  - session_duration_seconds     (info.time.updated - info.time.created)
"""

from __future__ import annotations

import json
import sys
from pathlib import Path


def main(run_dir: str) -> int:
    run_path = Path(run_dir)
    src = run_path / "transcript-opencode.json"
    if not src.exists():
        # Nothing to do — caller chains parsers, missing OC transcript is fine.
        return 0

    try:
        export = json.loads(src.read_text())
    except (json.JSONDecodeError, OSError) as exc:
        print(f"parse_opencode_transcript: cannot read {src}: {exc}", file=sys.stderr)
        return 1

    info = export.get("info") or {}
    tokens = info.get("tokens") or {}
    cache = tokens.get("cache") or {}
    time_block = info.get("time") or {}

    input_t = int(tokens.get("input") or 0)
    output_t = int(tokens.get("output") or 0)
    reasoning_t = int(tokens.get("reasoning") or 0)
    cache_read_t = int(cache.get("read") or 0)
    cache_write_t = int(cache.get("write") or 0)
    total_t = input_t + output_t + reasoning_t + cache_read_t + cache_write_t

    created_ms = time_block.get("created")
    updated_ms = time_block.get("updated")
    if isinstance(created_ms, (int, float)) and isinstance(updated_ms, (int, float)):
        session_duration = max(0.0, (updated_ms - created_ms) / 1000.0)
    else:
        session_duration = 0.0

    metrics = {
        "source": "opencode",
        "session_id": info.get("id"),
        "model": (info.get("model") or {}).get("id"),
        "total_tokens": {
            "input": input_t,
            "output": output_t,
            "reasoning": reasoning_t,
            "cache_read": cache_read_t,
            "cache_write": cache_write_t,
            "total": total_t,
        },
        "context_utilization_pct": None,
        "cycle_count": 0,
        "phase_summary": {
            "averages": {
                "red": {"avg_duration_seconds": 0},
                "green": {"avg_duration_seconds": 0},
                "refactor": {"avg_duration_seconds": 0},
            },
            "refactorings_applied": 0,
            "tests_passed_immediately": 0,
        },
        "predictions_correct": 0,
        "predictions_total": 0,
        "session_duration_seconds": round(session_duration, 2),
        "cost_usd": info.get("cost"),
    }

    dest = run_path / "transcript-metrics.json"
    dest.write_text(json.dumps(metrics, indent=2) + "\n")
    return 0


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("usage: parse_opencode_transcript.py <run_dir>", file=sys.stderr)
        sys.exit(2)
    sys.exit(main(sys.argv[1]))
