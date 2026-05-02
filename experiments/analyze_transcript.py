#!/usr/bin/env python3
"""Analyze a Claude Code session transcript and emit metrics as JSON.

Reads `<run_dir>/transcript.jsonl` (and optional `transcript-subagents/agent-*.jsonl`)
and writes `<run_dir>/transcript-metrics.json`.

Usage: analyze_transcript.py <run_dir>
"""

from __future__ import annotations

import json
import sys
from collections import Counter
from datetime import datetime
from pathlib import Path
from typing import Any, Iterable

OPUS_CONTEXT_WINDOW = 200_000


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
    # Claude Code timestamps look like "2025-05-02T10:23:45.123Z"
    try:
        if ts.endswith("Z"):
            return datetime.fromisoformat(ts[:-1] + "+00:00")
        return datetime.fromisoformat(ts)
    except ValueError:
        return None


def extract_assistant_message(event: dict[str, Any]) -> dict[str, Any] | None:
    """Return the embedded assistant `message` dict if present."""
    if event.get("type") != "assistant":
        return None
    msg = event.get("message")
    if isinstance(msg, dict):
        return msg
    return None


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
        usage = msg.get("usage") or {}
        in_tok = int(usage.get("input_tokens") or 0)
        out_tok = int(usage.get("output_tokens") or 0)
        cache_read = int(usage.get("cache_read_input_tokens") or 0)
        cache_create = int(usage.get("cache_creation_input_tokens") or 0)

        total_input += in_tok
        total_output += out_tok
        total_cache_read += cache_read
        total_cache_creation += cache_create

        # Approximation of "context utilization": input + cache contributions
        # represent how much of the prompt window was filled at this turn.
        cumulative = in_tok + cache_read + cache_create
        if cumulative > max_cumulative:
            max_cumulative = cumulative

        content = msg.get("content")
        if not isinstance(content, list):
            continue

        for block in content:
            if not isinstance(block, dict):
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
            elif tool_name in ("Task", "Agent"):
                # Claude Code emits the subagent launcher under either name
                # depending on version.
                subtype = (
                    tool_input.get("subagent_type")
                    or tool_input.get("agent_type")
                    or "unknown"
                )
                task_invocations[str(subtype)] += 1
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
    }


def derive_cycle_count(
    skills: Counter[str],
    tasks: Counter[str],
    bash_commands: list[str],
) -> int:
    """Best-effort cycle count.

    - v5 (skills): count `red` skill invocations
    - v4 (subagents): count `red` task invocations
    - v3 (basic-tdd, no skills/tasks): count `pnpm test` shell calls as proxy
    - v1/v2: returns 0
    """
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


def aggregate_subagent_tokens(subagent_dir: Path) -> int:
    if not subagent_dir.is_dir():
        return 0
    total = 0
    for jsonl_path in sorted(subagent_dir.glob("agent-*.jsonl")):
        for event in parse_jsonl(jsonl_path):
            msg = extract_assistant_message(event)
            if msg is None:
                continue
            usage = msg.get("usage") or {}
            total += int(usage.get("input_tokens") or 0)
            total += int(usage.get("output_tokens") or 0)
            total += int(usage.get("cache_read_input_tokens") or 0)
            total += int(usage.get("cache_creation_input_tokens") or 0)
    return total


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
    metrics["subagent_token_total"] = aggregate_subagent_tokens(
        run_dir / "transcript-subagents"
    )

    out_path = run_dir / "transcript-metrics.json"
    out_path.write_text(json.dumps(metrics, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote {out_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
