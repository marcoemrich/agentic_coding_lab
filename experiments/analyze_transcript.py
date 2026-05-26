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

# Context-window sizes per model. Used to compute context_utilization_pct
# from the observed peak cumulative input+cache token count.
# Source: docs.claude.com/en/docs/about-claude/models (as of 2026-05).
MODEL_CONTEXT_WINDOWS = {
    # Claude 4.x family
    "claude-opus-4-7": 1_000_000,
    "claude-opus-4-6": 200_000,
    "claude-sonnet-4-6": 1_000_000,
    "claude-sonnet-4-5": 1_000_000,
    "claude-haiku-4-5": 200_000,
    # Legacy 3.x (kept for old transcripts)
    "claude-3-5-sonnet": 200_000,
    "claude-3-5-haiku": 200_000,
    "claude-3-opus": 200_000,
}
DEFAULT_CONTEXT_WINDOW = 200_000


def resolve_context_window(model_versions: list[str]) -> int:
    """Look up context-window size for the model used in this run.

    Matches by prefix so that dated suffixes ("claude-haiku-4-5-20251001")
    or "-thinking" variants resolve to the same family entry. Falls back to
    DEFAULT_CONTEXT_WINDOW if no model id is recognised (e.g. transcript
    predates model-id reporting).
    """
    for model_id in model_versions:
        if not isinstance(model_id, str):
            continue
        for prefix, window in MODEL_CONTEXT_WINDOWS.items():
            if model_id.startswith(prefix):
                return window
    return DEFAULT_CONTEXT_WINDOW

TDD_PHASES = ("test-list", "red", "green", "refactor")

# Phase-completion text markers for harnesses (pi) that do not emit Skill
# tool calls. These are matched in assistant text blocks.
# "Red Phase Complete" is the strict marker (already used for gating
# predictions). The loose patterns catch the abbreviated headers the
# model naturally produces when it follows skill content "freihand".
_PHASE_TEXT_MARKERS = {
    "test-list": re.compile(
        r"(?:Test List Created|Test List Phase Complete)", re.IGNORECASE
    ),
    "red": re.compile(
        r"##\s*Red\b", re.IGNORECASE
    ),
    "green": re.compile(
        r"##\s*Green\b", re.IGNORECASE
    ),
    "refactor": re.compile(
        r"##\s*Refactor\b", re.IGNORECASE
    ),
}

# Matches the self-reported prediction outcome marker emitted by the red-phase
# agent inside its "Red Phase Complete:" block (see workflows/.../red.md).
# Accepts either a leading dash (v4-style: "... - Correct") or an emoji
# checkmark/cross (v5-style: "... ✅ Correct") or a sentence-final period/colon
# before "Correct"/"Incorrect" (compliance variant seen in some Opus 4.6 runs).
# Tolerates optional markdown bold/italic decoration.
_PREDICTION_OUTCOME_RE = re.compile(
    r"(?:-|✅|❌|[.:])[\s]*[*_]{0,2}(Correct|Incorrect)[*_]{0,2}\b",
    re.IGNORECASE,
)

# Loose red-phase header (pi harnesses) — used as an alternative gate
# for prediction extraction when "Red Phase Complete" is absent.
_RED_PHASE_HEADER_RE = re.compile(r"##\s*Red\b", re.IGNORECASE)

# Fallback for OpenCode runs whose red-skill output writes the prediction
# label inline with only whitespace separation, e.g.
#   **Compilation Prediction**: Compiles successfully Correct
# Anchored to a "(Compilation|Runtime) Prediction" bullet line so we do not
# false-positive on prose discussing predictions. This complements
# _PREDICTION_OUTCOME_RE; matches deduplicated by start position.
_PREDICTION_OUTCOME_LINE_RE = re.compile(
    r"^[\s\-*]*[*_]{0,2}(?:Compilation|Runtime)\s+Prediction[*_]{0,2}\s*:.*?\b(Correct|Incorrect)\b[*_\s]*$",
    re.IGNORECASE | re.MULTILINE,
)


def _line_index_at(text: str, pos: int) -> int:
    """Return the 0-based line index containing character offset *pos*."""
    return text.count("\n", 0, pos)


def extract_predictions_from_text(text: str, loose_gate: bool = False) -> tuple[int, int]:
    """Count self-reported prediction outcomes in a single assistant text block.

    Only counts when the block contains a red-phase marker, to avoid
    false positives from prose discussing predictions elsewhere.

    Red-phase markers (any one suffices as gate):
    - "Red Phase Complete" (strict, from CC/OC red-skill output)
    - "## Red" (loose, from pi runs where the model follows skill content
      freihand and uses markdown headers instead of the formal block)

    When *loose_gate* is True, any block containing a
    "(Compilation|Runtime) Prediction" line is accepted (for pi
    harnesses where the red-phase header and predictions may land in
    separate assistant messages).

    Returns (correct_count, total_count).
    """
    if not text:
        return 0, 0
    has_red_marker = (
        "Red Phase Complete" in text
        or bool(_RED_PHASE_HEADER_RE.search(text))
    )
    if loose_gate:
        has_pred_header = bool(_PREDICTION_OUTCOME_LINE_RE.search(text))
        has_red_marker = has_red_marker or has_pred_header
    if not has_red_marker:
        return 0, 0
    # Collect matches from both patterns, dedup by line so a single Prediction
    # line that matches both the trenner-based and the line-anchored regex
    # counts once (CC outputs typically trigger both; OC only the line one).
    matches: dict[int, str] = {}
    for match in _PREDICTION_OUTCOME_RE.finditer(text):
        line = _line_index_at(text, match.start())
        matches.setdefault(line, match.group(1).lower())
    for match in _PREDICTION_OUTCOME_LINE_RE.finditer(text):
        line = _line_index_at(text, match.start())
        matches.setdefault(line, match.group(1).lower())
    correct = sum(1 for label in matches.values() if label == "correct")
    total = len(matches)
    return correct, total


def extract_phase_text_markers(text: str) -> Counter[str]:
    """Count phase-completion text markers in assistant text.

    Used as a fallback when no Skill/Task tool calls are present (e.g. pi
    harness where skills are auto-loaded documents, not tool calls).
    Returns a Counter keyed by phase name.
    """
    if not text:
        return Counter()
    counts: Counter[str] = Counter()
    for phase, pattern in _PHASE_TEXT_MARKERS.items():
        counts[phase] = len(pattern.findall(text))
    return counts


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

    # Inline tool-event stream for v3 phase inference (no skills, no subagents).
    # Each entry: (timestamp, kind, cumulative_tokens_after_message). Kind is
    # one of: "write_test", "edit_test", "write_impl", "edit_impl", "test_run".
    inline_tool_events: list[tuple[datetime | None, str, int]] = []

    # Track which tool_use_ids correspond to red-phase skills/tasks, so we
    # can detect "passed immediately" (skill/task whose result reports tests
    # already green, no green follow-up).
    red_tool_use_ids: list[str] = []

    # Self-reported prediction outcomes from inline red-phase blocks
    # (relevant for v3/v5 where the red phase runs in the main session).
    predictions_correct = 0
    predictions_total = 0

    # Phase-completion text markers (fallback for pi and other harnesses
    # that don't emit Skill/Task tool calls).
    phase_text_markers: Counter[str] = Counter()

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
                    phase_text_markers.update(extract_phase_text_markers(text))
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
                    if "pnpm test" in cmd or "pnpm run test" in cmd:
                        inline_tool_events.append(
                            (ts, "test_run", cumulative_token_running)
                        )

            # Classify file edits/writes by path for inline phase inference.
            if tool_name in ("Write", "Edit", "MultiEdit", "NotebookEdit"):
                path = (
                    tool_input.get("file_path")
                    or tool_input.get("path")
                    or tool_input.get("notebook_path")
                    or ""
                )
                if isinstance(path, str) and path:
                    is_test = bool(
                        re.search(r"\.(spec|test)\.(ts|tsx|js|jsx|mjs|cjs)$", path)
                    )
                    is_src = ("/src/" in path) or path.startswith("src/")
                    verb = "write" if tool_name == "Write" else "edit"
                    if is_test:
                        inline_tool_events.append(
                            (ts, f"{verb}_test", cumulative_token_running)
                        )
                    elif is_src:
                        inline_tool_events.append(
                            (ts, f"{verb}_impl", cumulative_token_running)
                        )

    wall_clock = 0.0
    if first_ts and last_ts:
        wall_clock = (last_ts - first_ts).total_seconds()

    total_tokens = total_input + total_output + total_cache_read + total_cache_creation
    context_window = resolve_context_window(model_versions)
    ctx_util_pct = int(round(100 * max_cumulative / context_window))

    cycle_count = derive_cycle_count(skill_invocations, task_invocations, bash_commands, phase_text_markers)

    skill_phases = aggregate_skill_phases(skill_phase_markers, message_stream, last_ts)
    inline_tool_phases = infer_phases_from_tool_sequence(inline_tool_events)

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
        "context_window_tokens": context_window,
        "context_peak_tokens": max_cumulative,
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
            "inline_tool_phases": inline_tool_phases,
            "task_order": task_order,
            "red_tool_use_ids": red_tool_use_ids,
            "last_ts": last_ts,
            "phase_text_markers": dict(phase_text_markers),
        },
    }


def infer_phases_from_tool_sequence(
    events: list[tuple[datetime | None, str, int]],
) -> list[dict[str, Any]]:
    """Infer TDD phases from inline tool-event sequence (no skill/subagent).

    Heuristic for v3 (basic-tdd, inline):
      - Red:      [write_test|edit_test ...] up to and including the next test_run
      - Green:    [write_impl|edit_impl ...] up to and including the next test_run
      - Refactor: edit_impl-sequence with no intervening write_test/edit_test
                  (i.e. impl edits after a green phase, not preceded by a new test)

    Returns a list of phase dicts: [{"phase", "tokens", "duration_seconds"}].
    """
    if not events:
        return []

    phases: list[dict[str, Any]] = []
    i = 0
    n = len(events)
    last_phase: str | None = None

    while i < n:
        ts_start, kind, cum_start = events[i]

        if kind in ("write_test", "edit_test"):
            # Consume contiguous test edits + look forward to next test_run.
            j = i
            while j < n and events[j][1] in ("write_test", "edit_test"):
                j += 1
            # Include trailing test_run if present.
            end_idx = j - 1
            if j < n and events[j][1] == "test_run":
                end_idx = j
                j += 1
            ts_end, _, cum_end = events[end_idx]
            duration = (
                (ts_end - ts_start).total_seconds()
                if (ts_end and ts_start)
                else 0.0
            )
            phases.append(
                {
                    "phase": "red",
                    "tokens": max(0, cum_end - cum_start),
                    "duration_seconds": round(duration, 2),
                }
            )
            last_phase = "red"
            i = j
            continue

        if kind in ("write_impl", "edit_impl"):
            # Consume contiguous impl edits + trailing test_run.
            j = i
            while j < n and events[j][1] in ("write_impl", "edit_impl"):
                j += 1
            end_idx = j - 1
            if j < n and events[j][1] == "test_run":
                end_idx = j
                j += 1
            ts_end, _, cum_end = events[end_idx]
            duration = (
                (ts_end - ts_start).total_seconds()
                if (ts_end and ts_start)
                else 0.0
            )
            # Refactor if this impl-block was not preceded by a fresh red.
            phase_name = "refactor" if last_phase in ("green", "refactor") else "green"
            phases.append(
                {
                    "phase": phase_name,
                    "tokens": max(0, cum_end - cum_start),
                    "duration_seconds": round(duration, 2),
                }
            )
            last_phase = phase_name
            i = j
            continue

        # Stray test_run (no preceding edits in this loop) — skip.
        i += 1

    return phases


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
                "start_ts": ts.isoformat() if ts else None,
            }
        )
    return phases


def synthesize_phases_from_text_markers(
    markers: Counter[str],
) -> list[dict[str, Any]]:
    """Synthesize phase records from text-marker counts.

    For pi and other harnesses where skills are documents (not tool calls),
    the assistant text contains phase-completion markers like
    "## Red" and "Red Phase Complete". This function creates synthetic
    phase records with no timestamp or token detail — just counts.

    The ordering follows TDD convention: test-list, then repeating
    (red, green, refactor) blocks.
    """
    if not markers or sum(markers.values()) == 0:
        return []

    phases: list[dict[str, Any]] = []

    # Test-list phase
    tl_count = markers.get("test-list", 0)
    if tl_count > 0:
        for _ in range(tl_count):
            phases.append({
                "phase": "test-list",
                "tokens": 0,
                "duration_seconds": 0.0,
                "start_ts": None,
            })

    # Interleave red/green/refactor by count.
    # Use red as the cycle driver (it's the most reliable marker).
    red_count = markers.get("red", 0)
    green_count = markers.get("green", 0)
    refactor_count = markers.get("refactor", 0)

    for i in range(red_count):
        phases.append({
            "phase": "red",
            "tokens": 0,
            "duration_seconds": 0.0,
            "start_ts": None,
        })
        if i < green_count:
            phases.append({
                "phase": "green",
                "tokens": 0,
                "duration_seconds": 0.0,
                "start_ts": None,
            })
        if i < refactor_count:
            phases.append({
                "phase": "refactor",
                "tokens": 0,
                "duration_seconds": 0.0,
                "start_ts": None,
            })

    return phases


def merge_phase_streams(
    skill_phases: list[dict[str, Any]],
    subagent_phases: list[dict[str, Any]],
    final_ts: datetime | None,
) -> list[dict[str, Any]]:
    """For v6 hybrid workflow: merge inline-skill phases with subagent phases.

    Both sources carry a `start_ts` (ISO 8601). Phases are interleaved by
    timestamp; durations are recomputed as deltas between adjacent merged
    phases (last → final_ts). Tokens are kept as derived per source — skill
    tokens cover the main-context span, subagent tokens come from the
    subagent transcript.
    """
    combined = list(skill_phases) + list(subagent_phases)
    if not combined:
        return []

    def sort_key(p: dict[str, Any]) -> str:
        return p.get("start_ts") or ""

    combined.sort(key=sort_key)

    final_iso = final_ts.isoformat() if final_ts else None
    for i, p in enumerate(combined):
        start = p.get("start_ts")
        next_start = (
            combined[i + 1].get("start_ts") if i + 1 < len(combined) else final_iso
        )
        if start and next_start:
            try:
                a = datetime.fromisoformat(start)
                b = datetime.fromisoformat(next_start)
                p["duration_seconds"] = round((b - a).total_seconds(), 2)
            except ValueError:
                pass
    return combined


def derive_cycle_count(
    skills: Counter[str],
    tasks: Counter[str],
    bash_commands: list[str],
    phase_text_markers: Counter[str] | None = None,
) -> int:
    # Primary: Skill tool calls (CC/OC v5+)
    if skills.get("red", 0) > 0:
        return skills["red"]
    # Secondary: Task/subagent tool calls (CC/OC v4)
    if tasks.get("red", 0) > 0:
        return tasks["red"]
    # Tertiary: Text markers in assistant output (pi and other harnesses
    # where skills are documents, not tool calls). Only used when the
    # primary and secondary sources are empty to avoid double-counting.
    if phase_text_markers and phase_text_markers.get("red", 0) > 0:
        return phase_text_markers["red"]
    # Quaternary: pnpm test invocations (last resort)
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
                    "start_ts": first_ts.isoformat() if first_ts else None,
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

    # Pick the phase source:
    #   v4 (subagents only):     subagent_phases
    #   v5 (skills only):        skill_phases
    #   v6 (hybrid: skills for red/green, subagent for refactor): merge both
    #   v1/v2/v3:                inline tool inference or none
    #   pi (text markers):       synthesize from assistant text when no tool-call markers
    text_marker_phases = synthesize_phases_from_text_markers(
        Counter(internal.get("phase_text_markers", {}))
    )

    if subagent_phases and internal["skill_phases"]:
        phases = merge_phase_streams(
            internal["skill_phases"], subagent_phases, internal.get("last_ts")
        )
        phase_source = "skills+subagents"
    elif subagent_phases:
        phases = subagent_phases
        phase_source = "subagents"
    elif internal["skill_phases"]:
        phases = internal["skill_phases"]
        phase_source = "skills"
    elif internal["inline_tool_phases"]:
        phases = internal["inline_tool_phases"]
        phase_source = "inline-tool"
    elif text_marker_phases:
        phases = text_marker_phases
        phase_source = "text-markers"
    else:
        phases = []
        phase_source = "none"

    metrics["phases"] = phases
    metrics["phase_source"] = phase_source
    metrics["phase_summary"] = summarize_phases(phases)

    # If we inferred phases (any source), cycle_count = number of red phases.
    # Otherwise keep the derive_cycle_count fallback (skill/task/bash-based).
    if phases:
        red_phase_count = sum(1 for p in phases if p["phase"] == "red")
        if red_phase_count > 0:
            metrics["cycle_count"] = red_phase_count

    # Sanity checks — warn about suspicious metric combinations that may
    # indicate parser gaps rather than real agent behavior.
    cc = metrics.get("cycle_count", 0)
    pt = metrics.get("predictions_total", 0)
    if cc and cc > 0 and pt == 0:
        print(
            f"WARNING: cycle_count={cc} but predictions_total=0 — "
            "the prediction regex may not match this agent's output format. "
            "Inspect the transcript manually.",
            file=sys.stderr,
        )

    out_path = run_dir / "transcript-metrics.json"
    out_path.write_text(json.dumps(metrics, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote {out_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
