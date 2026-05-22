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

Source of truth: `experiments/analyze_transcript.py`. If you change that
parser, update this file.

## Hard requirements

| # | Marker | Where it must appear | Drives | Where in parser |
|---|---|---|---|---|
| 1 | `Skill` tool-use with `skill ∈ {test-list, red, green, refactor}` | Tool calls during the run | Phase recognition, `cycle_count`, `refactorings_applied`, per-phase tokens/duration | `analyze_transcript.py` ~line 233 (`if tool_name == "Skill"`) and `aggregate_skill_phases` |
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

- Parser: `experiments/analyze_transcript.py`
- Existing workflows that satisfy these markers: `v3-basic-tdd`,
  `v4-exact-subagents`, `v5-exact-single-context`
- Past compliance incidents documented in repo memory under
  *"Drei Metriken-Bugs"* and *"v4 Predictions-Compliance"*
