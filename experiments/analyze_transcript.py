#!/usr/bin/env python3
"""Analyze a Claude Code session transcript and emit metrics as JSON.

Reads `<run_dir>/transcript.jsonl` (and optional `transcript-subagents/agent-*.jsonl`)
and writes `<run_dir>/transcript-metrics.json`.

Usage: analyze_transcript.py <run_dir>
"""

from __future__ import annotations

import json
import re
import sys
from collections import Counter, defaultdict
from datetime import datetime
from pathlib import Path
from typing import Any, Iterable

OPUS_CONTEXT_WINDOW = 200_000

TDD_PHASES = ("test-list", "red", "green", "refactor")

# Matches the self-reported prediction outcome marker emitted by the red-phase
# agent inside its "Red Phase Complete:" block (see workflows/.../red.md).
# Tolerates optional markdown bold/italic decoration around "Correct"/"Incorrect".
_PREDICTION_OUTCOME_RE = re.compile(
    r"-\s*[*_]{0,2}(Correct|Incorrect)[*_]{0,2}\b",
    re.IGNORECASE,
)


def extract_predictions_from_text(text: str) -> tuple[int, int]:
    """Count self-reported prediction outcomes in a single assistant text block.

    Only counts when the block contains a "Red Phase Complete" marker, to avoid
    false positives from prose discussing predictions elsewhere.

    Returns (correct_count, total_count).
    """
    if not text or "Red Phase Complete" not in text:
        return 0, 0
    correct = 0
    total = 0
    for match in _PREDICTION_OUTCOME_RE.finditer(text):
        total += 1
        if match.group(1).lower() == "correct":
            correct += 1
    return correct, total


def parse_jsonl(path: Path) -> Iterable[dict[str, Any]]:
    """Yield parsed JSON objects, skipping lines that fail to parse."""
    with path.open("r", encoding="utf-8", errors="replace") as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            try:
                yield json.loads(line)
            except json.JSONDecodeError:
                continue


def parse_timestamp(ts: str | None) -> datetime | None:
    if not ts:
        return None
    try:
        if ts.endswith("Z"):
            return datetime.fromisoformat(ts[:-1] + "+00:00")
        return datetime.fromisoformat(ts)
    except ValueError:
        return None


def extract_assistant_message(event: dict[str, Any]) -> dict[str, Any] | None:
    if event.get("type") != "assistant":
        return None
    msg = event.get("message")
    if isinstance(msg, dict):
        return msg
    return None


def message_token_total(msg: dict[str, Any]) -> int:
    usage = msg.get("usage") or {}
    return (
        int(usage.get("input_tokens") or 0)
        + int(usage.get("output_tokens") or 0)
        + int(usage.get("cache_read_input_tokens") or 0)
        + int(usage.get("cache_creation_input_tokens") or 0)
    )


def aggregate_main_session(jsonl_path: Path) -> dict[str, Any]:
    total_input = 0
    total_output = 0
    total_cache_read = 0
    total_cache_creation = 0
    max_cumulative = 0
    message_count = 0
    first_ts: datetime | None = None
    last_ts: datetime | None = None

    tool_calls: Counter[str] = Counter()
    skill_invocations: Counter[str] = Counter()
    task_invocations: Counter[str] = Counter()
    bash_commands: list[str] = []

    # Distinct model IDs reported on assistant messages, in first-seen order.
    model_versions: list[str] = []
    model_seen: set[str] = set()

    # For v5 inline-skill phase tracking: capture each tool_use of Skill in
    # order with timestamp + cumulative-token marker, so we can attribute the
    # follow-up assistant turns to that phase.
    skill_phase_markers: list[tuple[datetime | None, str, int]] = []
    cumulative_token_running = 0
    # Per-message stream so we can slice tokens between skill markers
    message_stream: list[tuple[datetime | None, int]] = []

    # Order in which Agent (Task) tool_uses appeared - used to align with
    # subagent-*.jsonl files when meta.json is missing.
    task_order: list[str] = []

    # Track which tool_use_ids correspond to red-phase skills/tasks, so we
    # can detect "passed immediately" (skill/task whose result reports tests
    # already green, no green follow-up).
    red_tool_use_ids: list[str] = []

    # Self-reported prediction outcomes from inline red-phase blocks
    # (relevant for v3/v5 where the red phase runs in the main session).
    predictions_correct = 0
    predictions_total = 0

    for event in parse_jsonl(jsonl_path):
        ts = parse_timestamp(event.get("timestamp"))
        if ts:
            if first_ts is None or ts < first_ts:
                first_ts = ts
            if last_ts is None or ts > last_ts:
                last_ts = ts

        msg = extract_assistant_message(event)
        if msg is None:
            continue

        message_count += 1
        model_id = msg.get("model")
        if isinstance(model_id, str) and model_id and model_id not in model_seen:
            model_seen.add(model_id)
            model_versions.append(model_id)
        usage = msg.get("usage") or {}
        in_tok = int(usage.get("input_tokens") or 0)
        out_tok = int(usage.get("output_tokens") or 0)
        cache_read = int(usage.get("cache_read_input_tokens") or 0)
        cache_create = int(usage.get("cache_creation_input_tokens") or 0)

        total_input += in_tok
        total_output += out_tok
        total_cache_read += cache_read
        total_cache_creation += cache_create

        cumulative = in_tok + cache_read + cache_create
        if cumulative > max_cumulative:
            max_cumulative = cumulative

        msg_total = in_tok + out_tok + cache_read + cache_create
        cumulative_token_running += msg_total
        message_stream.append((ts, cumulative_token_running))

        content = msg.get("content")
        if not isinstance(content, list):
            continue

        for block in content:
            if not isinstance(block, dict):
                continue
            if block.get("type") == "text":
                text = block.get("text")
                if isinstance(text, str):
                    c, t = extract_predictions_from_text(text)
                    predictions_correct += c
                    predictions_total += t
                continue
            if block.get("type") != "tool_use":
                continue
            tool_name = block.get("name") or "unknown"
            tool_calls[tool_name] += 1
            tool_input = block.get("input") or {}
            if not isinstance(tool_input, dict):
                continue

            if tool_name == "Skill":
                skill = tool_input.get("skill") or tool_input.get("name") or "unknown"
                skill_invocations[str(skill)] += 1
                if skill in TDD_PHASES:
                    skill_phase_markers.append(
                        (ts, str(skill), cumulative_token_running)
                    )
                    if skill == "red":
                        tu_id = block.get("id")
                        if isinstance(tu_id, str):
                            red_tool_use_ids.append(tu_id)
            elif tool_name in ("Task", "Agent"):
                subtype = (
                    tool_input.get("subagent_type")
                    or tool_input.get("agent_type")
                    or "unknown"
                )
                task_invocations[str(subtype)] += 1
                task_order.append(str(subtype))
                if subtype == "red":
                    tu_id = block.get("id")
                    if isinstance(tu_id, str):
                        red_tool_use_ids.append(tu_id)
            elif tool_name == "Bash":
                cmd = tool_input.get("command")
                if isinstance(cmd, str):
                    bash_commands.append(cmd)

    wall_clock = 0.0
    if first_ts and last_ts:
        wall_clock = (last_ts - first_ts).total_seconds()

    total_tokens = total_input + total_output + total_cache_read + total_cache_creation
    ctx_util_pct = int(round(100 * max_cumulative / OPUS_CONTEXT_WINDOW))

    cycle_count = derive_cycle_count(skill_invocations, task_invocations, bash_commands)

    skill_phases = aggregate_skill_phases(skill_phase_markers, message_stream, last_ts)

    return {
        "wall_clock_seconds": round(wall_clock, 2),
        "total_tokens": {
            "input": total_input,
            "output": total_output,
            "cache_read": total_cache_read,
            "cache_creation": total_cache_creation,
            "total": total_tokens,
        },
        "context_utilization_pct": ctx_util_pct,
        "message_count": message_count,
        "tool_calls": dict(tool_calls),
        "skill_invocations": dict(skill_invocations),
        "task_invocations": dict(task_invocations),
        "cycle_count": cycle_count,
        "predictions_correct": predictions_correct,
        "predictions_total": predictions_total,
        "model_versions": model_versions,
        "_internal": {
            "skill_phases": skill_phases,
            "task_order": task_order,
            "red_tool_use_ids": red_tool_use_ids,
        },
    }


def aggregate_skill_phases(
    markers: list[tuple[datetime | None, str, int]],
    stream: list[tuple[datetime | None, int]],
    final_ts: datetime | None,
) -> list[dict[str, Any]]:
    """For v5 inline-skill workflow: turn skill-tool-use markers into phases.

    Each phase spans from its skill marker to the next skill marker.
    Tokens are the delta in cumulative tokens within the span; duration is
    the timestamp delta.
    """
    if not markers:
        return []

    phases: list[dict[str, Any]] = []
    for i, (ts, skill, cum_at_call) in enumerate(markers):
        if i + 1 < len(markers):
            next_ts, _, cum_next = markers[i + 1]
            tokens = max(0, cum_next - cum_at_call)
            duration = (
                (next_ts - ts).total_seconds()
                if (next_ts and ts)
                else 0.0
            )
        else:
            tokens = max(
                0, (stream[-1][1] if stream else cum_at_call) - cum_at_call
            )
            duration = (
                (final_ts - ts).total_seconds() if (final_ts and ts) else 0.0
            )
        phases.append(
            {
                "phase": skill,
                "tokens": tokens,
                "duration_seconds": round(duration, 2),
            }
        )
    return phases


def derive_cycle_count(
    skills: Counter[str],
    tasks: Counter[str],
    bash_commands: list[str],
) -> int:
    if skills.get("red", 0) > 0:
        return skills["red"]
    if tasks.get("red", 0) > 0:
        return tasks["red"]
    if bash_commands:
        pnpm_test_calls = sum(
            1 for cmd in bash_commands if "pnpm test" in cmd or "pnpm run test" in cmd
        )
        if pnpm_test_calls > 0:
            return pnpm_test_calls
    return 0


def aggregate_subagent_phases(
    subagent_dir: Path, task_order: list[str]
) -> tuple[int, list[dict[str, Any]], int, int, list[str]]:
    """Aggregate per-subagent metrics.

    Returns (total_tokens, phase_list, predictions_correct, predictions_total,
    subagent_model_versions). Predictions are only counted from red-phase
    agents. Subagent models are returned in first-seen order.
    """
    if not subagent_dir.is_dir():
        return 0, [], 0, 0, []

    total = 0
    pred_correct = 0
    pred_total = 0
    phase_records: list[tuple[float, dict[str, Any]]] = []
    sub_model_versions: list[str] = []
    sub_model_seen: set[str] = set()
    # Collect agent files with their phase type (from meta.json) and stats
    for jsonl_path in sorted(subagent_dir.glob("agent-*.jsonl")):
        meta_path = jsonl_path.with_suffix(".meta.json")
        agent_type: str | None = None
        if meta_path.is_file():
            try:
                meta = json.loads(meta_path.read_text(encoding="utf-8"))
                agent_type = meta.get("agentType") or meta.get("agent_type")
            except (json.JSONDecodeError, OSError):
                agent_type = None

        first_ts: datetime | None = None
        last_ts: datetime | None = None
        agent_tokens = 0
        for event in parse_jsonl(jsonl_path):
            ts = parse_timestamp(event.get("timestamp"))
            if ts:
                if first_ts is None or ts < first_ts:
                    first_ts = ts
                if last_ts is None or ts > last_ts:
                    last_ts = ts
            msg = extract_assistant_message(event)
            if msg is None:
                continue
            agent_tokens += message_token_total(msg)
            model_id = msg.get("model")
            if (
                isinstance(model_id, str)
                and model_id
                and model_id not in sub_model_seen
            ):
                sub_model_seen.add(model_id)
                sub_model_versions.append(model_id)

            if agent_type == "red":
                content = msg.get("content")
                if isinstance(content, list):
                    for block in content:
                        if (
                            isinstance(block, dict)
                            and block.get("type") == "text"
                            and isinstance(block.get("text"), str)
                        ):
                            c, t = extract_predictions_from_text(block["text"])
                            pred_correct += c
                            pred_total += t

        total += agent_tokens
        duration = 0.0
        if first_ts and last_ts:
            duration = (last_ts - first_ts).total_seconds()
        sort_key = first_ts.timestamp() if first_ts else 0.0
        phase_records.append(
            (
                sort_key,
                {
                    "phase": agent_type or "unknown",
                    "tokens": agent_tokens,
                    "duration_seconds": round(duration, 2),
                    "transcript": jsonl_path.name,
                },
            )
        )

    # Sort by start time, fall back to filename
    phase_records.sort(key=lambda x: x[0])
    phases = [rec for _, rec in phase_records]

    # Backfill missing phase types from main-session task_order if needed
    if any(p["phase"] == "unknown" for p in phases) and task_order:
        idx = 0
        for p in phases:
            if p["phase"] == "unknown" and idx < len(task_order):
                p["phase"] = task_order[idx]
            idx += 1

    return total, phases, pred_correct, pred_total, sub_model_versions


def summarize_phases(phases: list[dict[str, Any]]) -> dict[str, Any]:
    """Group phases by name → totals + averages."""
    if not phases:
        return {
            "by_phase": {},
            "averages": {},
            "refactorings_applied": 0,
            "tests_passed_immediately": 0,
        }

    by_phase: dict[str, dict[str, float]] = defaultdict(
        lambda: {"count": 0, "tokens": 0, "duration_seconds": 0.0}
    )
    for p in phases:
        bucket = by_phase[p["phase"]]
        bucket["count"] += 1
        bucket["tokens"] += p["tokens"]
        bucket["duration_seconds"] += p["duration_seconds"]

    averages: dict[str, dict[str, float]] = {}
    for name, b in by_phase.items():
        c = b["count"] or 1
        averages[name] = {
            "avg_tokens": round(b["tokens"] / c, 2),
            "avg_duration_seconds": round(b["duration_seconds"] / c, 2),
        }

    refactorings = int(by_phase.get("refactor", {}).get("count", 0))

    # tests_passed_immediately: red phases not followed by a green phase.
    tests_passed_immediately = 0
    for i, p in enumerate(phases):
        if p["phase"] != "red":
            continue
        next_phase = phases[i + 1]["phase"] if i + 1 < len(phases) else None
        if next_phase != "green":
            tests_passed_immediately += 1

    return {
        "by_phase": {
            name: {
                "count": int(b["count"]),
                "tokens": int(b["tokens"]),
                "duration_seconds": round(b["duration_seconds"], 2),
            }
            for name, b in by_phase.items()
        },
        "averages": averages,
        "refactorings_applied": refactorings,
        "tests_passed_immediately": tests_passed_immediately,
    }


def main(argv: list[str]) -> int:
    if len(argv) != 2:
        print("Usage: analyze_transcript.py <run_dir>", file=sys.stderr)
        return 2

    run_dir = Path(argv[1])
    transcript = run_dir / "transcript.jsonl"
    if not transcript.is_file():
        print(f"Transcript not found: {transcript}", file=sys.stderr)
        return 1

    metrics = aggregate_main_session(transcript)
    internal = metrics.pop("_internal")

    # v4: subagent transcripts give us per-phase tokens/timings
    (
        subagent_total,
        subagent_phases,
        sub_pred_c,
        sub_pred_t,
        sub_model_versions,
    ) = aggregate_subagent_phases(
        run_dir / "transcript-subagents", internal["task_order"]
    )
    metrics["subagent_token_total"] = subagent_total

    # Add predictions reported by red-phase subagents to inline predictions
    # captured from the main session.
    metrics["predictions_correct"] += sub_pred_c
    metrics["predictions_total"] += sub_pred_t

    # Merge subagent model versions into the main list (first-seen order).
    main_models: list[str] = list(metrics.get("model_versions") or [])
    seen = set(main_models)
    for m in sub_model_versions:
        if m not in seen:
            seen.add(m)
            main_models.append(m)
    metrics["model_versions"] = main_models

    # Pick the phase source: subagents (v4) have authoritative timings;
    # otherwise fall back to inline skill markers (v5). v1/v2/v3 have no
    # phase structure.
    if subagent_phases:
        phases = subagent_phases
        phase_source = "subagents"
    elif internal["skill_phases"]:
        phases = internal["skill_phases"]
        phase_source = "skills"
    else:
        phases = []
        phase_source = "none"

    metrics["phases"] = phases
    metrics["phase_source"] = phase_source
    metrics["phase_summary"] = summarize_phases(phases)

    out_path = run_dir / "transcript-metrics.json"
    out_path.write_text(json.dumps(metrics, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote {out_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
