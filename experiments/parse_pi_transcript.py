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


def _sum_main_usage(events: list[dict]) -> dict:
    """Sum token usage across ALL main-thread assistant messages.

    pi's per-message ``usage`` is NOT a running total: ``input`` is the prompt
    size of each individual request (jumps around, decreases across turns),
    ``output`` is that message's completion, ``cacheRead`` is that request's
    cache hit. Each API call bills its own input+output+cache, so the billable
    main-thread cost is the SUM over every request — not the last value.

    Taking only the last ``agent_end`` usage (the previous behaviour) captured
    just the final request and undercounted main-thread input by ~99 % on real
    claim-office runs (e.g. input 391 vs summed 260 753). This does NOT include
    subagent consumption — see ``_subagent_usage_totals`` for that.

    Preferred source: the single terminal ``agent_end`` carries the full
    ``messages[]`` array of the main conversation; summing over it equals
    summing the streamed ``message_end`` events. Fallback: sum ``message_end``
    directly for transcripts without a terminal ``agent_end``.
    """
    keys = ("input", "output", "cacheRead", "cacheWrite")

    def _add(totals: dict, usage: dict) -> None:
        for k in keys:
            v = usage.get(k)
            if isinstance(v, (int, float)):
                totals[k] += int(v)

    for ev in reversed(events):
        if ev.get("type") == "agent_end":
            totals = {k: 0 for k in keys}
            for msg in ev.get("messages") or []:
                if isinstance(msg, dict) and msg.get("role") == "assistant":
                    _add(totals, msg.get("usage") or {})
            if any(totals.values()):
                return totals
            break

    totals = {k: 0 for k in keys}
    for ev in events:
        if ev.get("type") == "message_end":
            msg = ev.get("message") or {}
            if isinstance(msg, dict) and msg.get("role") == "assistant":
                _add(totals, msg.get("usage") or {})
    return totals


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


def _process_tool_call_event(ev: dict, by_id: dict) -> None:
    """Fold one message_update event's tool-call content into by_id.

    Streaming equivalent of _collect_tool_calls: dedupe by tool call id,
    keeping the most complete args seen (toolcall_end wins).
    """
    if ev.get("type") != "message_update":
        return
    ame = ev.get("assistantMessageEvent") or {}
    if not str(ame.get("type", "")).startswith("toolcall"):
        return
    partial = ame.get("partial") or {}
    content = partial.get("content") or []
    if not isinstance(content, list):
        return
    for item in content:
        if not isinstance(item, dict) or item.get("type") != "toolCall":
            continue
        tc_id = item.get("id") or ""
        name = item.get("name") or ""
        args = item.get("arguments") or {}
        if not tc_id or not name:
            continue
        by_id[tc_id] = (name, args)


def _assistant_text_of(ev: dict) -> str | None:
    """Return the final assistant text block of a text_end event, else None."""
    if ev.get("type") != "message_update":
        return None
    ame = ev.get("assistantMessageEvent") or {}
    if ame.get("type") != "text_end":
        return None
    content = ame.get("content")
    return content if isinstance(content, str) else None


def _subagent_phase_text_of(ev: dict) -> list[tuple[str, str]]:
    """Return (agent_name, text) pairs from one subagent tool_execution_end.

    Fully-delegated workflows (v4.1-*-pi) run *every* TDD phase in its own
    subagent, so the phase markers are emitted inside the subagent and never
    reach the main thread that `_assistant_text_of` reads. Without this the
    whole TDD mechanic parses as zero.

    The agent name is returned alongside the text so the caller can bind each
    marker to the phase that actually owns it. This binding is essential, not
    cosmetic: refactor subagents in the hybrid v6.x workflows routinely echo
    `## Green` (and sometimes `## Refactor`) inside their reports, so counting
    subagent text indiscriminately would inflate those runs' `cycle_count`.
    """
    if ev.get("type") != "tool_execution_end":
        return []
    if ev.get("toolName") != "subagent":
        return []
    result = ev.get("result") or {}
    details = result.get("details") or {}
    pairs: list[tuple[str, str]] = []
    for r in details.get("results") or []:
        if not isinstance(r, dict):
            continue
        agent = r.get("agent")
        if not isinstance(agent, str) or agent not in TDD_SKILLS:
            continue
        for msg in r.get("messages") or []:
            if not isinstance(msg, dict) or msg.get("role") != "assistant":
                continue
            content = msg.get("content")
            if isinstance(content, str):
                pairs.append((agent, content))
            elif isinstance(content, list):
                for item in content:
                    if isinstance(item, dict) and isinstance(item.get("text"), str):
                        pairs.append((agent, item["text"]))
    return pairs


def _subagent_usage_of(ev: dict, totals: dict, seen_call_ids: set) -> None:
    """Fold one tool_execution_end(subagent) event's usage into totals."""
    if ev.get("type") != "tool_execution_end":
        return
    if ev.get("toolName") != "subagent":
        return
    call_id = ev.get("toolCallId") or ""
    if call_id and call_id in seen_call_ids:
        return
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


def main(run_dir: str) -> int:
    run_path = Path(run_dir)
    transcript = run_path / "transcript-pi.jsonl"
    if not transcript.is_file():
        print(f"transcript-pi.jsonl not found in {run_dir}", file=sys.stderr)
        return 1

    # Single streaming pass — never hold the full event list in memory.
    # Transcripts for always-reasoning models (glm, minimax) reach several
    # GB; loading them all as parsed dicts OOMs even a 16 GB host. All
    # collectors below are O(1) or O(#tool-calls) in memory.
    by_id: dict[str, tuple[str, dict]] = {}          # tool calls by id
    sa_totals = {"input": 0, "output": 0, "cacheRead": 0, "cacheWrite": 0}
    sa_seen: set[str] = set()
    # Main-thread usage is summed, not kept-last: pi's per-message usage is the
    # per-request prompt/completion size, so each API call bills its own tokens
    # (see _sum_main_usage). agent_end carries the full messages[] and is the
    # authoritative source; msg_end_sum is the streaming fallback.
    agent_end_usage_sum: dict = {}                    # summed over agent_end.messages[]
    msg_end_usage_sum = {"input": 0, "output": 0, "cacheRead": 0, "cacheWrite": 0}
    last_model: str | None = None
    last_cost: dict = {}
    start_ms: float | None = None
    end_ms: float | None = None
    text_phase_counts: dict[str, int] = {name: 0 for name in TDD_SKILLS}
    skill_counts = {name: 0 for name in TDD_SKILLS}
    predictions_correct = 0
    predictions_total = 0
    # Fully-delegated workflows only (v4.1-*-pi): markers emitted inside a phase
    # subagent. Kept separate from the main-thread counters so hybrid workflows,
    # whose refactor agent echoes `## Green`, are never affected — these are
    # consulted only when the main thread yielded nothing at all.
    sa_phase_counts: dict[str, int] = {name: 0 for name in TDD_SKILLS}
    sa_predictions_correct = 0
    sa_predictions_total = 0

    with transcript.open() as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            try:
                ev = json.loads(line)
            except json.JSONDecodeError:
                continue

            etype = ev.get("type")

            # --- tool calls (streamed into by_id) ---
            _process_tool_call_event(ev, by_id)

            # --- subagent usage totals ---
            _subagent_usage_of(ev, sa_totals, sa_seen)

            # --- main-thread usage / model / cost ---
            # Sum over all assistant messages (each request bills its own tokens).
            if etype == "agent_end":
                totals = {"input": 0, "output": 0, "cacheRead": 0, "cacheWrite": 0}
                newest_cost: dict = {}
                for msg in ev.get("messages") or []:
                    if not (isinstance(msg, dict) and msg.get("role") == "assistant"):
                        continue
                    u = msg.get("usage") or {}
                    for k in totals:
                        v = u.get(k)
                        if isinstance(v, (int, float)):
                            totals[k] += int(v)
                    if u.get("cost"):
                        newest_cost = u.get("cost")
                    if msg.get("model"):
                        last_model = msg.get("model")
                if any(totals.values()):
                    agent_end_usage_sum = totals
                if newest_cost:
                    last_cost = newest_cost
            elif etype == "message_end":
                msg = ev.get("message") or {}
                if isinstance(msg, dict) and msg.get("role") == "assistant":
                    u = msg.get("usage") or {}
                    for k in msg_end_usage_sum:
                        v = u.get(k)
                        if isinstance(v, (int, float)):
                            msg_end_usage_sum[k] += int(v)
                    if msg.get("model"):
                        last_model = msg.get("model")

            # --- session time bounds ---
            msg = ev.get("message")
            if isinstance(msg, dict):
                t = msg.get("timestamp")
                if isinstance(t, (int, float)):
                    if start_ms is None or t < start_ms:
                        start_ms = t
                    if end_ms is None or t > end_ms:
                        end_ms = t

            # --- assistant text: apply markers now, don't retain text ---
            text = _assistant_text_of(ev)
            if text is not None:
                for phase, pattern in _PHASE_TEXT_MARKERS_RE.items():
                    text_phase_counts[phase] += len(pattern.findall(text))
                c, t = extract_predictions_from_text(text, loose_gate=True)
                predictions_correct += c
                predictions_total += t

            # --- phase markers emitted inside a phase subagent (v4.1-*-pi) ---
            # Each marker is bound to the agent that produced it: a `## Green`
            # echoed by a refactor agent is not a green phase.
            for agent, sa_text in _subagent_phase_text_of(ev):
                pattern = _PHASE_TEXT_MARKERS_RE.get(agent)
                if pattern is not None:
                    sa_phase_counts[agent] += len(pattern.findall(sa_text))
                if agent == "red":
                    c, t = extract_predictions_from_text(sa_text, loose_gate=True)
                    sa_predictions_correct += c
                    sa_predictions_total += t

    # main usage: agent_end sum preferred, else streamed message_end sum
    # (same order of preference as the former keep-last logic, but summed).
    main_usage = agent_end_usage_sum or msg_end_usage_sum
    main_input = int(main_usage.get("input") or 0)
    main_output = int(main_usage.get("output") or 0)
    main_cache_read = int(main_usage.get("cacheRead") or 0)
    main_cache_write = int(main_usage.get("cacheWrite") or 0)

    input_t = main_input + sa_totals["input"]
    output_t = main_output + sa_totals["output"]
    cache_read_t = main_cache_read + sa_totals["cacheRead"]
    cache_write_t = main_cache_write + sa_totals["cacheWrite"]
    total_t = input_t + output_t + cache_read_t + cache_write_t

    duration = 0.0
    if start_ms is not None and end_ms is not None and end_ms >= start_ms:
        duration = (end_ms - start_ms) / 1000.0

    tool_calls = list(by_id.values())
    refactor_calls = 0
    for name, args in tool_calls:
        skill_name = _is_skill_read(name, args)
        if skill_name:
            skill_counts[skill_name] += 1
            continue
        if _is_refactor_subagent(name, args):
            refactor_calls += 1
            skill_counts["refactor"] += 1

    # Fully-delegated workflows (v4.1-*-pi) emit every phase marker inside its
    # own subagent, so the main thread yields nothing. Fall back to the
    # agent-bound subagent counters — but only per phase and only when the main
    # thread produced *no* marker for that phase at all, so hybrid workflows
    # (whose refactor agent echoes `## Green`) keep their main-thread counts.
    for phase in TDD_SKILLS:
        if text_phase_counts[phase] == 0 and sa_phase_counts[phase] > 0:
            text_phase_counts[phase] = sa_phase_counts[phase]
    if predictions_total == 0 and sa_predictions_total > 0:
        predictions_correct = sa_predictions_correct
        predictions_total = sa_predictions_total

    # cycle_count: prefer text markers over skill-reads for pi runs.
    cycle_count = text_phase_counts["red"] or skill_counts["red"]

    # refactorings_applied: subagent calls are the primary signal (hybrid
    # workflows such as v6.x-pi isolate refactor in a subagent). Inline
    # workflows (v5.1-pi: every phase in one shared context) never emit a
    # subagent call, so fall back to the `## Refactor` text marker — the same
    # relationship P1 has to skill reads for cycle_count. Subagent workflows
    # do not emit `## Refactor`, so this fallback cannot inflate their count.
    refactorings_applied = refactor_calls or text_phase_counts["refactor"]

    for phase in TDD_SKILLS:
        if text_phase_counts.get(phase, 0) > skill_counts.get(phase, 0):
            skill_counts[phase] = text_phase_counts[phase]

    metrics = {
        "source": "pi",
        "model": last_model,
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
            "refactorings_applied": refactorings_applied,
            "tests_passed_immediately": 0,
        },
        "predictions_correct": predictions_correct,
        "predictions_total": predictions_total,
        "session_duration_seconds": round(duration, 2),
        "cost_usd": (last_cost or {}).get("total"),
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
