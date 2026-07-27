# Workflow Markers — What the Pipeline Actually Reads

> **Inhalts-Design** (Theory-of-Mind, Why-Block-Pattern, Reduktions-
> Erfahrungen aus RQ-rules/RQ-pep/RQ-emoji/RQ-lean, Subagent-Architektur-Gradient):
> siehe `research/workflow-dev/workflow-construction.md`. Diese
> Datei hier deckt nur die harten Parser-Anforderungen ab.


When you derive a new workflow (e.g. `v5.1`, `v6`) by reducing or rewriting
rules/commands, these markers must remain intact. Removing one of them
silently zeros out the corresponding metric — runs still complete, but the
RQ aggregation gets blind spots that look like "no effect" when really the
signal vanished.

Source of truth: `experiments/analyze_transcript.py` (CC/OC),
`experiments/parse_pi_transcript.py` (pi), and
`experiments/parse_cursor_transcript.py` (cursor). If you change those
parsers, update this file.

## Hard requirements — Claude Code / OpenCode

| # | Marker | Where it must appear | Drives | Where in parser |
|---|---|---|---|---|
| 1 | `Skill` tool-use with `skill ∈ {test-list, red, green, refactor}` | Tool calls during the run | Phase recognition, `cycle_count`, `refactorings_applied`, per-phase tokens/duration | `analyze_transcript.py` ~line 233 (`if tool_name == "Skill"`) and `aggregate_skill_phases` |

> **Skill-Tool findet auch `.claude/commands/<name>.md`.** Commands sind in Skills "merged" (Claude-Code-Doku, Slash-Commands-Sektion) und nicht deprecated. Die v6.x-Linie liegt bewusst unter `commands/` — Begründung in `research/workflow-dev/workflow-construction.md` §"Mechanismus: commands/ mit Skill-Tool".

| # | Marker | Where it must appear | Drives | Where in parser |
|---|---|---|---|---|
| 2 | The literal string `Red Phase Complete` | Assistant text emitted by the red-phase command | **Gates** prediction parsing — without this string, predictions in the same block are ignored | `extract_predictions_from_text` ~line 75 |
| 3 | One or more lines matching `(- \| ✅ \| ❌) (Correct\|Incorrect)` inside that block | Assistant text in the same block as marker 2 | `predictions_correct`, `predictions_total`, derived `predictions_correct_rate` | `_PREDICTION_OUTCOME_RE` ~line 61 |
| 4 | `experiment-done.txt` containing `DONE` | Written to the run cwd at the end of the autonomous loop | Run-driver detects clean termination; without it the container hits its timeout and the run is flagged `exit_reason: timeout` | `tdd-experiment-mode.md` (v6.5 and earlier) / `lab-only.md` (v6.6+) |

### Where marker 4 lives per workflow generation

| Generation | Claude Code | pi / cursor / opencode |
|---|---|---|
| v6.5 and earlier | `.claude/rules/tdd-experiment-mode.md` | inline in `AGENTS.md` |
| **v6.6+ (`v6.6-lab-split-*`)** | `.claude/rules/lab-only.md` | `LAB-ONLY` fenced block at the end of `AGENTS.md` |

The v6.6 line separates **lab measurement infrastructure** from **TDD
methodology** so a workflow can be exported for real-world use by deleting
one file (CC) or stripping one fenced block (pi/cursor/oc). Everything the
parser depends on — the done-marker contract, the autonomy mandate, and the
phase-continuation fix — lives inside that droppable region.

**Consequence for new workflows:** if you derive from a v6.6 variant, marker
4 is *not* in `tdd.md`. Do not "clean up" `lab-only.md` or the fenced blocks
in a lab workflow — removing them zeroes clean-termination detection and
every run times out.

### Convention for marker 3

The red-phase command should produce **two** prediction lines per cycle:
one for compilation, one for runtime. Fewer lines lower
`predictions_total` and skew the per-cycle rate; more lines are fine but
unusual.

The phrase **"MUST verbatim, do not abbreviate, do not collapse"** (or
equivalent) belongs in the red-phase command. Without it, the model tends
to merge the two prediction lines into one as the run goes on. This was
the root cause of the v4 compliance bug fixed on 2026-05-09 — see memory
note for the full story.

## Hard requirements — pi harness

Pi skills are auto-loaded documents, not tool calls. The model reads
`SKILL.md` once and then follows the instructions "freihand". The
measurement pipeline therefore cannot count `Skill` tool invocations.
Instead, it relies on **text markers** in assistant output and
**subagent tool calls**.

| # | Marker | Where it must appear | Drives | Where in parser |
|---|---|---|---|---|
| P1 | `## Red` heading in assistant text | Each occurrence counts as one red-phase cycle (`cycle_count`) | `parse_pi_transcript.py` (`_PHASE_TEXT_MARKERS_RE`) and `analyze_transcript.py` (`_PHASE_TEXT_MARKERS`, `derive_cycle_count`) |
| P2 | `## Green` heading in assistant text | Green-phase occurrence | same as P1 |
| P3 | `## Test List` heading in assistant text | Test-list phase occurrence | same as P1 |
| P4 | `subagent` tool call with `agent: "refactor"` | Each call counts as `refactorings_applied` | `parse_pi_transcript.py` (`_is_refactor_subagent`) |
| P5 | `Red Phase Complete:` + prediction lines | **Gates** prediction parsing (same as CC marker 2) | `extract_predictions_from_text` with `loose_gate=True` (accepts prediction lines even without `Red Phase Complete` if they appear in a block with `## Red` or a `(Compilation\|Runtime) Prediction` header) |
| P6 | Lines matching `(Compilation\|Runtime) Prediction: ... (Correct\|Incorrect)` | `predictions_correct`, `predictions_total` | `_PREDICTION_OUTCOME_LINE_RE` |
| P7 | `experiment-done.txt` containing `DONE` | Same as CC marker 4 | same |

### pi-specific notes

- **P1 replaces CC marker 1** for pi runs. On CC/OC, marker 1 (`Skill` tool call)
  remains the primary cycle counter. The `## Red` pattern is only used as a fallback
  in `derive_cycle_count()` when no `Skill` tool calls are found.
- **P5 is looser than CC marker 2.** On pi, the red-phase header and prediction
  block may land in separate assistant messages (pi splits tool-call results into
  their own messages). `parse_pi_transcript.py` therefore passes `loose_gate=True`
  to `extract_predictions_from_text`, which also accepts blocks containing
  `(Compilation|Runtime) Prediction` lines as valid prediction carriers.
- **P4 is equivalent to CC marker 1's refactor branch.** The `subagent` extension
  produces a tool call with `name: "subagent"` and `arguments.agent: "refactor"`,
  which the pi parser counts the same way CC counts `Task({subagent_type: "refactor"})`.

## Hard requirements — cursor harness

cursor-agent is a hybrid, like cc and pi. The `test-list`, `red` and `green`
phases are auto-loaded skill documents, not tool calls, and the model follows
them "freihand" — so cycle/prediction detection relies on **text markers** in
assistant output. Refactor and end-refactor are **delegated to isolated
subagents** in `.cursor/agents/` and are detected by the `taskToolCall` itself,
exactly as pi's `subagent` calls are. A **tool-sequence fallback** covers models
that skip the text markers entirely.

> **Historical note.** Until 2026-07 these workflows ran refactor inline and
> counted a `## Refactor` text marker, on the false premise that cursor-agent
> had no subagent mechanism. Cursor has had a Task tool since v2.4. All cursor
> runs produced under the inline contract were discarded — none contained a
> single `taskToolCall`, so the isolated-context architecture was never
> actually measured on this harness.

| # | Marker | Where it must appear | Drives | Where in parser |
|---|---|---|---|---|
| C1 | `## Red` heading in assistant text (not only reasoning) | Each occurrence counts as one red-phase cycle (`cycle_count`) | `parse_cursor_transcript.py` (`_PHASE_TEXT_MARKERS_RE`) |
| C2 | `## Green` heading in assistant text | Green-phase occurrence | same as C1 |
| C3 | `Test List Created` or `Test List Phase Complete` in assistant text | Test-list phase occurrence | same as C1 |
| C4 | `taskToolCall` with `subagentType.custom.name` = `refactor` | Each call counts as a per-cycle refactoring (`refactorings_per_cycle`) | `parse_cursor_transcript.py` (`_subagent_name_of`, `_classify_tool_event`) |
| C4b | `taskToolCall` with `subagentType.custom.name` = `end-refactor` | The final whole-`src/` pass (`refactorings_end_pass`) | same as C4 |

> **C3 is not a `##` heading.** The regex matches the prose forms
> `Test List Created` / `Test List Phase Complete`, **not** `## Test List`.
> The workflows emit the prose forms; instructing a model to emit
> `## Test List` produces a marker the parser cannot see.

> **`refactorings_applied` = C4 + C4b**, and the two are also reported
> separately. Do **not** add the `## Refactor` text-marker count on top: a
> workflow that both delegates and echoes a heading would be double-counted.
> The parser enforces this — when any delegated call is present it ignores the
> text marker and sets `marker_source: "subagent-calls"`.
>
> Built-in subagents (Explore / Bash / Browser) also arrive as `taskToolCall`
> but carry no `subagentType.custom.name`, so they are correctly ignored.
>
> Text-marker-only runs (pre-2026-07 workflows) still parse via
> `##\s*Refactor\b`, which matches `## Refactor (final pass)` but **not**
> `## End-Refactor`. That path is legacy; new cursor workflows must delegate.
| C5 | `Red Phase Complete:` + prediction lines | **Gates** prediction parsing (same as pi P5) | `extract_predictions_from_text` with `loose_gate=True` |
| C6 | Lines matching `(Compilation\|Runtime) Prediction: ... (Correct\|Incorrect)` | `predictions_correct`, `predictions_total` | `_PREDICTION_OUTCOME_LINE_RE` |
| C7 | `experiment-done.txt` containing `DONE` | Same as CC marker 4 | same |

### cursor-specific notes

- **Markers must appear in *assistant output text*, not only in reasoning.**
  cursor-agent emits `thinking` events (private reasoning) separately from
  `assistant` events. The parser reads only `assistant` text, so a `## Red`
  that appears solely in a thinking block is not counted. The workflow prompt
  states this explicitly.
- **C4 is the direct analogue of pi's P4 (subagent call).** Both count an
  isolated refactor subagent actually running, so `refactorings_applied` is
  **comparable across cc, pi and cursor** — all three measure the same
  construct. This was not true before 2026-07, when cursor counted a text
  marker meaning "refactor phase declared"; cross-harness comparisons of
  `refactorings_applied` from that era are not valid.
- **Tool-sequence fallback.** When zero `## Red` markers are found,
  `parse_cursor_transcript.py` infers cycles from the `editToolCall` /
  `shellToolCall` sequence (test-edit → `pnpm test` = red; impl-edit →
  `pnpm test` = green; later impl-edit = refactor). `transcript-metrics.json`
  records `marker_source: "tool-sequence-fallback"` when this path is used.

- **`marker_source` tells you which path produced the refactor count:**
  `"subagent-calls"` (delegated — the current contract), `"text-markers"`
  (legacy inline), or `"tool-sequence-fallback"` (model ignored the markers).
  A current-generation cursor run reporting anything other than
  `"subagent-calls"` means the model refactored in the main context instead of
  delegating — the run is not measuring the intended architecture.

- Emoji headers `🔴` / `🟢` / `🔄` / `📋`
- The `Green Phase Complete:` / `Refactor Phase Complete:` strings (only
  `Red Phase Complete` is parsed)
- Naming-evaluation blocks
- APP mass calculations and component-count tables
- "Self-Check Before Proceeding" lists, "Psychological Resistance"
  sections, "Why this discipline works" pep talks
- Repeated "🚨 USE SKILLS" warnings — one mention is enough; the parser
  doesn't care, and the model behaves consistently with one strong
  instruction

## Smoke-test a new workflow before a full batch

After reducing/changing a workflow, run **one** smoke run and check
`metrics.json`:

```bash
jq '.final_metrics | {
  cycle_count, refactorings_applied,
  predictions_correct, predictions_total,
  tests_passing
}' experiments/runs/<latest-smoke-run>/metrics.json
```

Healthy baseline (game-of-life, 4–6 tests):

- `cycle_count >= 3` — phases were detected
- `refactorings_applied >= 1` — refactor skill fired
- `predictions_total ≈ 2 × cycle_count` — both prediction lines made it through
- `predictions_correct / predictions_total` plausible (not 0/0)
- `tests_passing == true`

If any of these are zero or null while the run otherwise looks fine, a
marker is broken — fix it before launching the n=3 batch.

## Cross-reference

- Parsers: `experiments/analyze_transcript.py`, `experiments/parse_pi_transcript.py`, `experiments/parse_cursor_transcript.py`
- CC/OC workflows satisfying markers 1–4: `v3-basic-tdd`,
  `v4-exact-subagents`, `v5-exact-single-context`, `v6.6-lab-split-cc`,
  `v6.6-lab-split-oc`
- pi workflows satisfying markers P1–P7: `v6.2-with-why-cleaned-pi`,
  `v6.6-lab-split-pi`
- cursor workflows satisfying markers C1–C7: `v6.2.1-phase-continuation-cursor`
  (C4b not applicable — that generation has no end-refactor phase),
  `v6.6-lab-split-cursor` (all markers incl. C4b)
- Past compliance incidents documented in repo memory under
  *"Drei Metriken-Bugs"* and *"v4 Predictions-Compliance"*
