---
id: RQ-model-quality-cursor
question: "How do the models reachable via the cursor-cli harness (Opus 4.8 medium, Composer 2.5, Grok 4.5 medium) differ in code quality and TDD discipline on game-of-life-example-mapping?"
factors:
  model:
    # Lab variant IDs → cursor-agent --model (verified via smoke run 2026-07-26,
    # resolved via system/init event). Baseline arm: no-thinking / comparable
    # effort level, where the family has an effort axis.
    - opus-cursor         # → claude-opus-4-8-medium  ("Opus 4.8 300K Medium No Thinking")
    - composer-cursor     # → composer-2.5            ("Composer 2.5") — no effort axis
    - grok-cursor         # → cursor-grok-4.5-medium  ("Cursor Grok 4.5 Medium")
controls:
  workflow: v6.2.1-phase-continuation-cursor   # cursor-cli workflow (.cursor/ markers), derived from v6.2.1-pi, refactor via .cursor/agents/ subagent
  kata_base: game-of-life
  prompt: example-mapping
outcomes:
  # primary: code quality (game-of-life carries the code-quality signal)
  - code_mass
  - cognitive_max
  - cognitive_avg
  - mccabe_max
  - mccabe_avg
  - cc_longest_function
  - cc_avg_loc_per_function
  - cc_median_loc_per_function
  - lines_of_code
  - smell_total
  - smell_complexity
  - smell_magic_numbers
  - smell_duplication
  # secondary: correctness
  - verification_pct  # external (game-of-life-verification)
  - tests_passing     # internal (vitest)
  - tests_total
  # tertiary: TDD discipline
  - cycle_count
  - refactorings_applied
  - predictions_correct
  - predictions_total
  # context
  - completed_within_budget
  - duration_seconds
  - total_tokens
  - cost_usd
min_replicates: 5
status: aktiv
---

# RQ-model-quality-cursor: Model effect on code quality (cursor-cli harness)

## Motivation

With cursor-cli (`cursor-agent`) as the fourth harness — after Claude Code (native), OpenCode and pi (both Requesty) — a **third routing path** becomes available: Cursor's own model roster, auth via `CURSOR_API_KEY` through the Cursor subscription. That makes three models directly comparable that meet on this path: **Opus** (Anthropic anchor, comparable across harnesses to pi/OC/CC), **Composer** (Cursor's own agent model) and **Grok**.

This RQ measures the **model effect on code quality and TDD discipline** in a harness-constant setting (all cells cursor-cli, same workflow, same kata). It is the **direct counterpart** to RQ-model-quality (Claude Code side), RQ-model-quality-oc (OpenCode) and RQ-model-quality-pi (pi) — with a cursor-cli workflow. The workflow and routing difference must be named explicitly in cross-harness findings, NO 1:1 transfer.

`game-of-life-example-mapping` as kata: carries the code-quality signal (`smell_total`, `cognitive_max`, etc. differentiate) and is example-mapping compatible. claim-office (correctness as primary outcome) can be investigated in parallel in a later RQ-model-novel-cursor.

## Harness status: ready for use

**As of 2026-07-26**: cursor-cli is **fully wired into `run-batch.sh` and verified end-to-end** (all five building blocks built, Docker installs `cursor-agent`, smoke run game-of-life × `opus-cursor` cleanly through: cycle_count=9, refactorings=7, predictions 18/18, 9/9 tests green). Details in the [subtree README](../README.md#harness-status-walking-skeleton). This RQ is **open (n=0)** — harness ready, fill batches pending.

Before the first batch:
0. **Auth (solved 2026-07-26)**: Headless needs a real dashboard `CURSOR_API_KEY` (`crsr_…`), not the OAuth token. Set it in the container via `.env`/docker-compose (analogous to `REQUESTY_API_KEY`). Details: [subtree README](../README.md#recherche-stand-cursor-agent-2026-07-26-smoke-run-durchgeführt).
1. **Model IDs (verified)**: `opus-cursor`→`claude-opus-4-8-medium`, `composer-cursor`→`composer-2.5`, `grok-cursor`→`cursor-grok-4.5-medium`. Wire into building block 4 (`run-batch.sh` case mapping).
2. Capture the JSON event schema → build `parse_cursor_transcript.py`.
3. Create the cursor-cli workflow (`.cursor/` markers, four TDD markers from `MARKERS.md`) and enter it in `controls.workflow`.
4. Smoke-test rule (subtree README): an Opus run must yield `cycle_count`/`predictions_* != null`.

## Existing data

- **As of 2026-07-26**: No runs. Harness not yet built. First batch completely open.

## Model selection

Set by the user: **Opus, Composer, Grok** — the specific appeal of the cursor-cli path. Opus is the cross-harness anchor (cross-check against the Opus values in RQ-model-quality-pi / -oc / CC: is the Anthropic level preserved over the Cursor routing path?). Composer is Cursor's own model and not reachable on any other path — the actual new value of this RQ. Grok adds a third provider family branch.

Per model the same rule applies as for pi/oc: inclusion if the autonomous TDD loop runs cleanly through under the cursor-cli workflow and `src/` plus, where applicable, `src/cli.ts` are written. Models that do not reliably finish the loop (continuation drop, done.txt with red tests) are removed from the RQ with justification and documented here.

## Hypotheses

- **H1 (Anthropic anchor over the Cursor path)**: opus-cursor delivers code quality at the Anthropic level (lowest `cognitive_max`/`smell_total`) and confirms that the cursor-cli routing path is not a value-reducing confound. Cross-check against Opus in RQ-model-quality-pi/-oc/CC. If opus-cursor is markedly worse than Opus on other paths → harness/routing artifact, not a model property.
- **H2 (Composer as unknown)**: composer-cursor is not measurable on any other path — this RQ is the first data point. Open whether it keeps up with Opus in code quality or shows its own profile (e.g. high throughput, but more smells).
- **H3 (model spread)**: A measurable spread between Opus, Composer and Grok shows up over `smell_total` and `cognitive_max` — i.e. the cursor-cli harness is discriminating enough to make model differences visible.
- **H4 (TDD marker compliance)**: `cycle_count` and `predictions_total` spread across the models — some use the workflow marker mechanics with discipline, others drift. A low cycle_count is NOT automatically weaker TDD discipline, but also marker/skill compliance (parallel to the pi/oc finding).

## Methodological notes

- **Separate tariff confound**: Cost runs through the Cursor subscription, not the Requesty tariff (pi/OC) or the Anthropic list price (CC). Name this explicitly as a confound in `cost_usd` cross-harness comparisons.
- `n=5` per cell follows memory [[replicates-n-reliability]] (default for a medium field).
- TDD discipline metrics (`cycle_count`, `predictions_*`, `refactorings_applied`) depend on `parse_cursor_transcript.py` (building block 5) capturing the four markers from `MARKERS.md` correctly. Verify before the first batch (smoke-test rule).
- Distinguish in findings: "model A has higher TDD discipline" ≠ "model A uses the marker path more often".
