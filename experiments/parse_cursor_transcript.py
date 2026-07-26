#!/usr/bin/env python3
"""Parse cursor-agent event-stream transcript into transcript-metrics.json.

cursor-agent (-p --output-format stream-json) writes a newline-delimited
JSON event stream to stdout. run-batch.sh redirects that into run.log and
extracts the NDJSON lines into transcript-cursor.jsonl after each run.

This script reads that file and emits transcript-metrics.json in the schema
that analyze-run.sh's extract_transcript_metrics() expects — the same schema
the pi and OpenCode parsers produce.

Event shapes (verified against a real cursor-agent stream-json run, 2026-07):

  {"type":"system","subtype":"init","model":"Opus 4.8 300K Medium ...", ...}
  {"type":"assistant", "message":{"content":[{"type":"text","text":"## Red ..."}]}, ...}
  {"type":"thinking","subtype":"delta"|"completed", ...}
  {"type":"tool_call","subtype":"started"|"completed",
     "tool_call":{"editToolCall":{"args":{"path":"...","streamContent":"..."},
                                   "result":{"success":{"linesAdded":N,...}}}}, ...}
  {"type":"tool_call", "tool_call":{"shellToolCall":{"args":{"command":"pnpm test",...}}}, ...}
  {"type":"result","subtype":"success","is_error":false,
     "usage":{"inputTokens":N,"outputTokens":N,"cacheReadTokens":N,"cacheWriteTokens":N},
     "duration_ms":N, "session_id":"..."}

TDD metrics (design decision, see research/questions-cursor-cli/):

- PRIMARY: text markers in assistant output (same contract as pi):
  `## Red` -> cycle_count, `## Refactor` -> refactorings_applied,
  predictions via the shared extract_predictions_from_text (loose_gate=True).
  cursor-agent has no subagent tool, so refactor is inline and detected as
  a `## Refactor` heading — not a tool call.
- FALLBACK (only when zero `## Red` markers are found): infer phases from the
  edit/shell tool-call sequence (test-edit -> test_run = red; impl-edit ->
  test_run = green), so a run whose model ignored the marker contract still
  yields a non-zero cycle_count instead of silently scoring 0.

cost_usd is None: cursor-agent's result event reports token usage but no cost
(Requesty-like); cost is computed downstream from tokens x price if needed.
"""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path

# Reuse the prediction extractor so all parsers agree on what counts.
sys.path.insert(0, str(Path(__file__).resolve().parent))
try:
    from analyze_transcript import extract_predictions_from_text  # type: ignore
except Exception:  # pragma: no cover — keep self-contained fallback
    _FALLBACK_RE = re.compile(
        r"(?:-|✅|❌|[.:])[\s]*[*_]{0,2}(Correct|Incorrect)[*_]{0,2}\b",
        re.IGNORECASE,
    )

    def extract_predictions_from_text(text: str, loose_gate: bool = False) -> tuple[int, int]:
        if not text or "Red Phase Complete" not in text:
            return (0, 0)
        matches = _FALLBACK_RE.findall(text)
        correct = sum(1 for m in matches if m.lower() == "correct")
        total = len(matches)
        return (correct, total)


# Phase-completion text markers — identical patterns to the pi parser, since
# the cursor workflow is derived from the pi workflow and emits the same
# `## Red` / `## Green` / `## Refactor` headings.
_PHASE_TEXT_MARKERS_RE = {
    "test-list": re.compile(r"(?:Test List Created|Test List Phase Complete)", re.IGNORECASE),
    "red":       re.compile(r"##\s*Red\b", re.IGNORECASE),
    "green":     re.compile(r"##\s*Green\b", re.IGNORECASE),
    "refactor":  re.compile(r"##\s*Refactor\b", re.IGNORECASE),
}

_TEST_FILE_RE = re.compile(r"\.(spec|test)\.(ts|tsx|js|jsx|mjs|cjs)$", re.IGNORECASE)
_TEST_RUN_RE = re.compile(r"\b(pnpm|npm|npx|yarn)\b.*\btest\b|\bvitest\b", re.IGNORECASE)


def _assistant_text_of(ev: dict) -> str | None:
    """Return concatenated text of an assistant message event, else None.

    cursor emits {"type":"assistant","message":{"content":[{"type":"text",
    "text":"..."}]}}. Some events may carry a plain string content.
    """
    if ev.get("type") != "assistant":
        return None
    msg = ev.get("message") or {}
    content = msg.get("content")
    if isinstance(content, str):
        return content
    if isinstance(content, list):
        parts = [
            item.get("text", "")
            for item in content
            if isinstance(item, dict) and item.get("type") == "text"
        ]
        joined = "".join(parts)
        return joined or None
    return None


def _tool_call_of(ev: dict) -> tuple[str, dict] | None:
    """Return (tool_kind, args) for a completed tool_call event, else None.

    tool_kind is the cursor wrapper key: "editToolCall" or "shellToolCall".
    Only the `completed` subtype is used so each call is counted once with its
    full argument payload.
    """
    if ev.get("type") != "tool_call" or ev.get("subtype") != "completed":
        return None
    tc = ev.get("tool_call") or {}
    if not isinstance(tc, dict):
        return None
    for kind in ("editToolCall", "shellToolCall"):
        inner = tc.get(kind)
        if isinstance(inner, dict):
            return kind, (inner.get("args") or {})
    return None


def _classify_tool_event(kind: str, args: dict) -> str | None:
    """Map a cursor tool call onto an inline TDD event kind.

    Returns one of write_test / write_impl / test_run, else None.
    """
    if kind == "editToolCall":
        path = args.get("path") or ""
        if not isinstance(path, str) or not path:
            return None
        if _TEST_FILE_RE.search(path):
            return "write_test"
        if "/src/" in path or path.startswith("src/") or path.endswith(".ts"):
            return "write_impl"
        return None
    if kind == "shellToolCall":
        cmd = args.get("command") or ""
        if isinstance(cmd, str) and _TEST_RUN_RE.search(cmd):
            return "test_run"
        return None
    return None


def _infer_cycles_from_tool_events(tool_events: list[str]) -> tuple[int, int, int]:
    """Fallback cycle inference from the ordered inline tool-event kinds.

    Mirrors analyze_transcript.infer_phases_from_tool_sequence but simplified:
    we only need counts (no tokens/timing). A red cycle = a block of test
    edits terminated by a test_run; a green = a block of impl edits (first
    after a red) terminated by a test_run; later impl blocks = refactor.

    Returns (red_count, green_count, refactor_count).
    """
    red = green = refactor = 0
    i = 0
    n = len(tool_events)
    last_phase: str | None = None
    while i < n:
        kind = tool_events[i]
        if kind == "write_test":
            j = i
            while j < n and tool_events[j] == "write_test":
                j += 1
            if j < n and tool_events[j] == "test_run":
                j += 1
            red += 1
            last_phase = "red"
            i = j
            continue
        if kind == "write_impl":
            j = i
            while j < n and tool_events[j] == "write_impl":
                j += 1
            if j < n and tool_events[j] == "test_run":
                j += 1
            if last_phase in ("green", "refactor"):
                refactor += 1
                last_phase = "refactor"
            else:
                green += 1
                last_phase = "green"
            i = j
            continue
        i += 1
    return red, green, refactor


def main(run_dir: str) -> int:
    run_path = Path(run_dir)
    transcript = run_path / "transcript-cursor.jsonl"
    if not transcript.is_file():
        print(f"transcript-cursor.jsonl not found in {run_dir}", file=sys.stderr)
        return 1

    # Streaming single pass — cursor transcripts for reasoning models can be
    # large; never hold the full event list in memory.
    model: str | None = None
    tok = {"input": 0, "output": 0, "cache_read": 0, "cache_write": 0}
    duration_ms: float = 0.0
    text_phase_counts: dict[str, int] = {name: 0 for name in _PHASE_TEXT_MARKERS_RE}
    predictions_correct = 0
    predictions_total = 0
    tool_events: list[str] = []  # ordered inline event kinds for the fallback

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

            # --- resolved model from system/init ---
            if etype == "system" and model is None:
                m = ev.get("model")
                if isinstance(m, str) and m:
                    model = m

            # --- token usage + duration from the terminal result event ---
            if etype == "result":
                usage = ev.get("usage") or {}
                if isinstance(usage, dict):
                    tok["input"] += int(usage.get("inputTokens") or 0)
                    tok["output"] += int(usage.get("outputTokens") or 0)
                    tok["cache_read"] += int(usage.get("cacheReadTokens") or 0)
                    tok["cache_write"] += int(usage.get("cacheWriteTokens") or 0)
                d = ev.get("duration_ms")
                if isinstance(d, (int, float)):
                    duration_ms = max(duration_ms, float(d))

            # --- assistant text: apply markers now, don't retain text ---
            text = _assistant_text_of(ev)
            if text is not None:
                for phase, pattern in _PHASE_TEXT_MARKERS_RE.items():
                    text_phase_counts[phase] += len(pattern.findall(text))
                c, t = extract_predictions_from_text(text, loose_gate=True)
                predictions_correct += c
                predictions_total += t

            # --- tool calls: record ordered kind for fallback inference ---
            tc = _tool_call_of(ev)
            if tc is not None:
                kind_name = _classify_tool_event(tc[0], tc[1])
                if kind_name:
                    tool_events.append(kind_name)

    total_t = tok["input"] + tok["output"] + tok["cache_read"] + tok["cache_write"]

    # cycle_count / refactorings: text markers primary, tool-sequence fallback.
    cycle_count = text_phase_counts["red"]
    refactor_count = text_phase_counts["refactor"]
    used_fallback = False
    if cycle_count == 0:
        fb_red, _fb_green, fb_refactor = _infer_cycles_from_tool_events(tool_events)
        if fb_red > 0:
            used_fallback = True
            cycle_count = fb_red
            if refactor_count == 0:
                refactor_count = fb_refactor

    metrics = {
        "source": "cursor",
        "model": model,
        "total_tokens": {
            "input": tok["input"],
            "output": tok["output"],
            "reasoning": 0,
            "cache_read": tok["cache_read"],
            "cache_write": tok["cache_write"],
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
            "refactorings_applied": refactor_count,
            "tests_passed_immediately": 0,
        },
        "predictions_correct": predictions_correct,
        "predictions_total": predictions_total,
        "session_duration_seconds": round(duration_ms / 1000.0, 2),
        "cost_usd": None,
        "marker_source": "tool-sequence-fallback" if used_fallback else "text-markers",
        "phase_marker_counts": text_phase_counts,
    }

    dest = run_path / "transcript-metrics.json"
    dest.write_text(json.dumps(metrics, indent=2) + "\n")
    return 0


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("usage: parse_cursor_transcript.py <run_dir>", file=sys.stderr)
        sys.exit(2)
    sys.exit(main(sys.argv[1]))
