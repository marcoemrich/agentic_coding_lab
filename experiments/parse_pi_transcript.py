#!/usr/bin/env python3
"""Parse pi event-stream transcript into transcript-metrics.json.

pi (--mode json) writes a newline-delimited JSON event stream to stdout.
run-batch.sh tees that into run.log and extracts the NDJSON lines into
transcript-pi.jsonl after each pi run.

This script reads that file and emits transcript-metrics.json in the
schema that analyze-run.sh's extract_transcript_metrics() expects.

Skill/subagent detection (v6.2-pi and other multi-phase pi workflows):

- pi has no built-in "skill" tool. Skill invocations are surfaced as
  `read` tool calls on a `<skill-name>/SKILL.md` path. We count those
  reads, bucketed by skill name (test-list / red / green).
- The refactor agent runs through the `subagent` extension's `subagent`
  tool. We count tool calls with `name == "subagent"` and a refactor agent
  in the arguments as refactorings_applied.
- Prediction markers ("Red Phase Complete" + Correct/Incorrect) are
  parsed from assistant text the same way as in the CC and OC parsers.

For v1-oneshot-pi (no skills, no subagent) all TDD fields stay 0.
"""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path

# Reuse the prediction extractor so all three parsers agree on what counts.
sys.path.insert(0, str(Path(__file__).resolve().parent))
try:
    from analyze_transcript import extract_predictions_from_text  # type: ignore
except Exception:  # pragma: no cover — keep self-contained fallback
    _FALLBACK_RE = re.compile(
        r"(?:-|✅|❌|[.:])[\s]*[*_]{0,2}(Correct|Incorrect)[*_]{0,2}\b",
        re.IGNORECASE,
    )

    def extract_predictions_from_text(text: str) -> tuple[int, int]:
        if not text or "Red Phase Complete" not in text:
            return (0, 0)
        matches = _FALLBACK_RE.findall(text)
        correct = sum(1 for m in matches if m.lower() == "correct")
        total = len(matches)
        return (correct, total)


TDD_SKILLS = ("test-list", "red", "green", "refactor")
SKILL_PATH_RE = re.compile(r"/?([\w.-]+)/SKILL\.md$", re.IGNORECASE)

# Phase-completion text markers for pi harnesses where skills are
# auto-loaded documents, not tool calls. Same patterns as in
# analyze_transcript.py. We use the "## Red" header pattern because
# it's consistently produced by the model when following skill content
# "freihand" (observed: 32/32 cycles in claim-office-pi run).
# "Red Phase Complete" is only used for prediction gating, not counting.
_PHASE_TEXT_MARKERS_RE = {
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


def _is_skill_read(tool_name: str, args: dict) -> str | None:
    """Return the skill name if this is a read of a SKILL.md, else None."""
    if tool_name != "read":
        return None
    if not isinstance(args, dict):
        return None
    # pi's `read` tool uses `path` (lowercase) per the live event stream.
    path = args.get("path") or args.get("file_path") or ""
    if not isinstance(path, str):
        return None
    match = SKILL_PATH_RE.search(path)
    if not match:
        return None
    name = match.group(1).lower()
    return name if name in TDD_SKILLS else None


def _is_refactor_subagent(tool_name: str, args: dict) -> bool:
    """Return True if this is a subagent tool call invoking the refactor agent."""
    if tool_name != "subagent":
        return False
    if not isinstance(args, dict):
        return False
    # single mode
    if args.get("agent") == "refactor":
        return True
    # parallel mode
    tasks = args.get("tasks")
    if isinstance(tasks, list) and any(
        isinstance(t, dict) and t.get("agent") == "refactor" for t in tasks
    ):
        return True
    # chain mode
    chain = args.get("chain")
    if isinstance(chain, list) and any(
        isinstance(t, dict) and t.get("agent") == "refactor" for t in chain
    ):
        return True
    return False


def _collect_tool_calls(events: list[dict]) -> list[tuple[str, dict]]:
    """Return [(tool_name, args_dict)] for each completed tool call.

    pi streams toolcall_start/delta/end via message_update.assistantMessageEvent.
    We dedupe by tool call id and pick the most complete args from the last
    toolcall_end (or toolcall_delta if no end yet)."""
    by_id: dict[str, tuple[str, dict]] = {}
    for ev in events:
        if ev.get("type") != "message_update":
            continue
        ame = ev.get("assistantMessageEvent") or {}
        if not str(ame.get("type", "")).startswith("toolcall"):
            continue
        partial = ame.get("partial") or {}
        content = partial.get("content") or []
        if not isinstance(content, list):
            continue
        for item in content:
            if not isinstance(item, dict) or item.get("type") != "toolCall":
                continue
            tc_id = item.get("id") or ""
            name = item.get("name") or ""
            args = item.get("arguments") or {}
            if not tc_id or not name:
                continue
            # Replace progressively as args fill in; toolcall_end has the
            # most complete payload.
            by_id[tc_id] = (name, args)
    return list(by_id.values())


def _assistant_texts(events: list[dict]) -> list[str]:
    """Collect final assistant text blocks (one entry per text_end)."""
    out: list[str] = []
    for ev in events:
        if ev.get("type") != "message_update":
            continue
        ame = ev.get("assistantMessageEvent") or {}
        if ame.get("type") != "text_end":
            continue
        content = ame.get("content")
        if isinstance(content, str):
            out.append(content)
    return out


def _last_usage(events: list[dict]) -> dict:
    """Final usage block of the *main* pi conversation.

    pi reports usage cumulatively in each assistant message of the main
    thread (the last `agent_end` carries the highest value). This does
    NOT include subagent token consumption — see `_subagent_usage_totals`
    for that. The main-thread total is just the visible chat with the
    orchestrating model; subagents run as separate pi processes.
    """
    for ev in reversed(events):
        if ev.get("type") == "agent_end":
            messages = ev.get("messages") or []
            for msg in reversed(messages):
                if isinstance(msg, dict) and msg.get("role") == "assistant":
                    usage = msg.get("usage") or {}
                    if usage:
                        return usage
            return {}
    for ev in reversed(events):
        if ev.get("type") == "message_end":
            msg = ev.get("message") or {}
            if isinstance(msg, dict) and msg.get("role") == "assistant":
                return msg.get("usage") or {}
    return {}


def _subagent_usage_totals(events: list[dict]) -> dict:
    """Sum token usage across all completed subagent invocations.

    Each `tool_execution_end` with `toolName == "subagent"` carries a
    structured `result.details.results[]` array; every entry has a
    `usage` block representing that subagent's *final* totals (the
    extension reports usage cumulatively, so the last value per subagent
    is the right one).

    pi v6.2-pi observation: subagents account for ~94 % of the run's
    token consumption (one refactor subagent per TDD cycle, each a fresh
    pi process re-reading test + implementation context). Ignoring them
    undercounts H2 (token efficiency) by an order of magnitude.
    """
    totals = {"input": 0, "output": 0, "cacheRead": 0, "cacheWrite": 0}
    seen_call_ids: set[str] = set()
    for ev in events:
        if ev.get("type") != "tool_execution_end":
            continue
        if ev.get("toolName") != "subagent":
            continue
        call_id = ev.get("toolCallId") or ""
        if call_id and call_id in seen_call_ids:
            continue
        if call_id:
            seen_call_ids.add(call_id)
        result = ev.get("result") or {}
        details = result.get("details") or {}
        for r in details.get("results") or []:
            u = r.get("usage") or {}
            for k in totals:
                v = u.get(k)
                if isinstance(v, (int, float)):
                    totals[k] += int(v)
    return totals


def _model_id(events: list[dict]) -> str | None:
    for ev in reversed(events):
        if ev.get("type") in ("agent_end", "message_end"):
            msg = ev.get("message") or (ev.get("messages") or [{}])[-1]
            if isinstance(msg, dict) and msg.get("role") == "assistant":
                return msg.get("model")
    return None


def _session_bounds(events: list[dict]) -> tuple[float | None, float | None]:
    start = None
    end = None
    for ev in events:
        msg = ev.get("message")
        if isinstance(msg, dict):
            t = msg.get("timestamp")
            if isinstance(t, (int, float)):
                if start is None or t < start:
                    start = t
                if end is None or t > end:
                    end = t
    return start, end


def main(run_dir: str) -> int:
    run_path = Path(run_dir)
    transcript = run_path / "transcript-pi.jsonl"
    if not transcript.is_file():
        print(f"transcript-pi.jsonl not found in {run_dir}", file=sys.stderr)
        return 1

    events: list[dict] = []
    with transcript.open() as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            try:
                events.append(json.loads(line))
            except json.JSONDecodeError:
                continue

    # Main-thread usage (cumulative across the orchestrating pi conversation).
    main_usage = _last_usage(events)
    main_input = int(main_usage.get("input") or 0)
    main_output = int(main_usage.get("output") or 0)
    main_cache_read = int(main_usage.get("cacheRead") or 0)
    main_cache_write = int(main_usage.get("cacheWrite") or 0)

    # Subagent usage (sum across all completed `subagent` tool calls).
    # Without this, v6.2-pi token counts underreport by ~10x because each
    # refactor subagent is a fresh pi process re-reading the workflow context.
    sa_usage = _subagent_usage_totals(events)
    input_t = main_input + sa_usage["input"]
    output_t = main_output + sa_usage["output"]
    cache_read_t = main_cache_read + sa_usage["cacheRead"]
    cache_write_t = main_cache_write + sa_usage["cacheWrite"]
    total_t = input_t + output_t + cache_read_t + cache_write_t

    start_ms, end_ms = _session_bounds(events)
    duration = 0.0
    if start_ms is not None and end_ms is not None and end_ms >= start_ms:
        duration = (end_ms - start_ms) / 1000.0

    tool_calls = _collect_tool_calls(events)
    skill_counts = {name: 0 for name in TDD_SKILLS}
    refactor_calls = 0
    text_phase_counts: dict[str, int] = {name: 0 for name in TDD_SKILLS}

    for name, args in tool_calls:
        skill_name = _is_skill_read(name, args)
        if skill_name:
            skill_counts[skill_name] += 1
            continue
        if _is_refactor_subagent(name, args):
            refactor_calls += 1
            skill_counts["refactor"] += 1

    # Text-marker fallback: when skills are auto-loaded documents, the
    # model reads SKILL.md once and then works "freihand". Phase
    # completion markers in the assistant text are the reliable signal.
    for block in _assistant_texts(events):
        for phase, pattern in _PHASE_TEXT_MARKERS_RE.items():
            text_phase_counts[phase] += len(pattern.findall(block))

    # cycle_count: prefer text markers over skill-reads for pi runs.
    # Text markers ("## Red") are far more reliable than counting
    # how many times red/SKILL.md was read (typically just once).
    cycle_count = text_phase_counts["red"] or skill_counts["red"]

    # Update skill_counts with text-marker counts where they exceed the
    # read-based counts (so skill_invocations reflects the true usage).
    for phase in TDD_SKILLS:
        if text_phase_counts.get(phase, 0) > skill_counts.get(phase, 0):
            skill_counts[phase] = text_phase_counts[phase]

    predictions_correct = 0
    predictions_total = 0
    # Use loose_gate for pi: red-phase header and prediction blocks may
    # land in separate assistant messages (pi splits tool-call results
    # into their own messages).
    for block in _assistant_texts(events):
        c, t = extract_predictions_from_text(block, loose_gate=True)
        predictions_correct += c
        predictions_total += t

    metrics = {
        "source": "pi",
        "model": _model_id(events),
        "total_tokens": {
            "input": input_t,
            "output": output_t,
            "reasoning": 0,
            "cache_read": cache_read_t,
            "cache_write": cache_write_t,
            "total": total_t,
        },
        "context_utilization_pct": None,
        "cycle_count": cycle_count,
        "phase_summary": {
            "averages": {
                "red":      {"avg_duration_seconds": 0.0},
                "green":    {"avg_duration_seconds": 0.0},
                "refactor": {"avg_duration_seconds": 0.0},
            },
            "refactorings_applied": refactor_calls,
            "tests_passed_immediately": 0,
        },
        "predictions_correct": predictions_correct,
        "predictions_total": predictions_total,
        "session_duration_seconds": round(duration, 2),
        "cost_usd": (main_usage.get("cost") or {}).get("total"),
        "skill_invocations": skill_counts,
    }

    dest = run_path / "transcript-metrics.json"
    dest.write_text(json.dumps(metrics, indent=2) + "\n")
    return 0


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("usage: parse_pi_transcript.py <run_dir>", file=sys.stderr)
        sys.exit(2)
    sys.exit(main(sys.argv[1]))
