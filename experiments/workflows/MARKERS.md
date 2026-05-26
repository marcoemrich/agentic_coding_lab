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

Source of truth: `experiments/analyze_transcript.py` (CC/OC) and
`experiments/parse_pi_transcript.py` (pi). If you change those
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
| 4 | `experiment-done.txt` containing `DONE` | Written to the run cwd at the end of the autonomous loop | Run-driver detects clean termination; without it the container hits its timeout and the run is flagged `exit_reason: timeout` | `tdd-experiment-mode.md` |

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

## What is decorative (safe to drop)

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

- Parsers: `experiments/analyze_transcript.py`, `experiments/parse_pi_transcript.py`
- CC/OC workflows satisfying markers 1–4: `v3-basic-tdd`,
  `v4-exact-subagents`, `v5-exact-single-context`
- pi workflows satisfying markers P1–P7: `v6.2-with-why-cleaned-pi`
- Past compliance incidents documented in repo memory under
  *"Drei Metriken-Bugs"* and *"v4 Predictions-Compliance"*
