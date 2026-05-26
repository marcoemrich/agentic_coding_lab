#!/usr/bin/env python3
"""Parse OpenCode session export into transcript-metrics.json.

OpenCode stores sessions in a SQLite DB inside the container and exposes
them via `opencode export <sessionID>` as JSON. run-batch.sh writes that
JSON to <run_dir>/transcript-opencode.json after each OC run.

This script reads that file and emits transcript-metrics.json in the
schema that analyze-run.sh's extract_transcript_metrics() expects, so the
existing aggregation pipeline picks up tokens, TDD-cycle counts,
refactoring counts, and prediction outcomes without a separate
aggregator fork.

Fields emitted:
  - total_tokens.{input, output, reasoning, cache_read, cache_write, total}
  - context_utilization_pct      (None for OC — no documented context-cap signal)
  - cycle_count                  (count of `red` skill invocations)
  - phase_summary.averages.{red,green,refactor}.avg_duration_seconds
                                  (mean part.time.completed-created per skill/task)
  - phase_summary.refactorings_applied   (count of `refactor` skill OR task invocations)
  - phase_summary.tests_passed_immediately (0 — heuristic absent for OC)
  - predictions_correct / predictions_total
                                  (parsed from assistant text containing
                                   "Red Phase Complete" markers, via shared
                                   helper from analyze_transcript.py)
  - session_duration_seconds     (info.time.updated - info.time.created)
  - skill_invocations            (raw per-skill counter, debug aid; includes
                                   task tool calls mapped to TDD skill names)
"""

from __future__ import annotations

import json
import sys
from pathlib import Path

# Reuse the prediction extractor so OC and CC parsers agree on what counts.
sys.path.insert(0, str(Path(__file__).resolve().parent))
try:
    from analyze_transcript import extract_predictions_from_text  # type: ignore
except Exception:  # pragma: no cover — fallback, keeps OC parser self-contained
    import re

    _FALLBACK_RE = re.compile(
        r"(?:-|✅|❌|[.:])[\s]*[*_]{0,2}(Correct|Incorrect)[*_]{0,2}\b",
        re.IGNORECASE,
    )

    def extract_predictions_from_text(text: str) -> tuple[int, int]:
        if not text or "Red Phase Complete" not in text:
            return 0, 0
        correct = total = 0
        for m in _FALLBACK_RE.finditer(text):
            total += 1
            if m.group(1).lower() == "correct":
                correct += 1
        return correct, total


TDD_SKILLS = ("test-list", "red", "green", "refactor")


def _is_skill_part(part: dict) -> bool:
    """Detect a skill-tool-call part in OC's message schema."""
    if part.get("type") != "tool":
        return False
    return part.get("tool") == "skill"


def _is_task_part(part: dict) -> bool:
    """Detect a task (subagent) tool-call part in OC's message schema."""
    if part.get("type") != "tool":
        return False
    return part.get("tool") == "task"


def _skill_name(part: dict) -> str | None:
    """Extract the invoked skill name from a tool part."""
    state = part.get("state") or {}
    inp = state.get("input") or {}
    name = inp.get("name") or inp.get("skill")
    if isinstance(name, str):
        return name
    return None


def _task_maps_to_tdd_skill(part: dict) -> str | None:
    """If a task tool call targets a TDD-relevant subagent, return the
    equivalent skill name (e.g. 'refactor').  Otherwise return None.

    Heuristic: check the ``description`` and ``subagent_type`` fields of
    the task input for an exact TDD skill name match.  This covers the
    v6.2-oc hybrid workflow where refactor runs as a subagent instead of
    a skill.
    """
    state = part.get("state") or {}
    inp = state.get("input") or {}
    for field in ("description", "subagent_type"):
        val = inp.get(field)
        if isinstance(val, str) and val.strip().lower() in TDD_SKILLS:
            return val.strip().lower()
    return None


def _part_duration_seconds(part: dict) -> float:
    """Duration of a single part in seconds, or 0 if timestamps missing."""
    time_block = part.get("time") or {}
    start = time_block.get("created") or time_block.get("start")
    end = time_block.get("completed") or time_block.get("end")
    if isinstance(start, (int, float)) and isinstance(end, (int, float)):
        return max(0.0, (end - start) / 1000.0)
    return 0.0


def _walk_parts(messages: list) -> tuple[dict[str, list[float]], list[str]]:
    """Return (skill_durations_by_name, assistant_text_blocks).

    skill_durations_by_name maps the invoked skill name to a list of
    per-invocation durations in seconds.

    assistant_text_blocks is one entry per assistant message, with all
    text-part contents concatenated. This matches what
    extract_predictions_from_text expects: a per-message block that may
    contain a "Red Phase Complete" marker.
    """
    durations: dict[str, list[float]] = {name: [] for name in TDD_SKILLS}
    text_blocks: list[str] = []

    for message in messages or []:
        info = message.get("info") or {}
        parts = message.get("parts") or []
        text_chunks: list[str] = []

        for part in parts:
            ptype = part.get("type")
            if ptype == "text":
                t = part.get("text")
                if isinstance(t, str):
                    text_chunks.append(t)
            elif _is_skill_part(part):
                name = _skill_name(part)
                if name in durations:
                    durations[name].append(_part_duration_seconds(part))
            elif _is_task_part(part):
                mapped = _task_maps_to_tdd_skill(part)
                if mapped and mapped in durations:
                    durations[mapped].append(_part_duration_seconds(part))

        if info.get("role") == "assistant" and text_chunks:
            text_blocks.append("\n".join(text_chunks))

    return durations, text_blocks


def _avg(xs: list[float]) -> float:
    return round(sum(xs) / len(xs), 2) if xs else 0.0


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
    messages = export.get("messages") or []
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

    skill_durations, assistant_blocks = _walk_parts(messages)
    skill_counts = {name: len(skill_durations[name]) for name in TDD_SKILLS}

    cycle_count = skill_counts["red"]
    refactorings_applied = skill_counts["refactor"]

    predictions_correct = 0
    predictions_total = 0
    for block in assistant_blocks:
        c, t = extract_predictions_from_text(block)
        predictions_correct += c
        predictions_total += t

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
        "cycle_count": cycle_count,
        "phase_summary": {
            "averages": {
                "red":      {"avg_duration_seconds": _avg(skill_durations["red"])},
                "green":    {"avg_duration_seconds": _avg(skill_durations["green"])},
                "refactor": {"avg_duration_seconds": _avg(skill_durations["refactor"])},
            },
            "refactorings_applied": refactorings_applied,
            "tests_passed_immediately": 0,
        },
        "predictions_correct": predictions_correct,
        "predictions_total": predictions_total,
        "session_duration_seconds": round(session_duration, 2),
        "cost_usd": info.get("cost"),
        "skill_invocations": skill_counts,
    }

    dest = run_path / "transcript-metrics.json"
    dest.write_text(json.dumps(metrics, indent=2) + "\n")
    return 0


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("usage: parse_opencode_transcript.py <run_dir>", file=sys.stderr)
        sys.exit(2)
    sys.exit(main(sys.argv[1]))
