---
id: RQ-model-quality-oc
question: "How do five models reachable via the OpenCode harness (Opus 4.7 via Portkey + four non-Anthropic models from the Portkey catalog) differ in code quality and TDD discipline on game-of-life-example-mapping with the v5.1-testlist-scope-fix-oc workflow?"
factors:
  model:
    - opus-4-7-portkey
    - kimi-k2-6
    - glm-5-1
    - gemini-3-5-flash
    - deepseek-v4-flash
    - deepseek-v4-pro
controls:
  workflow: v5.1-testlist-scope-fix-oc
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
  - verification_pct  # external (game-of-life-verification has existed since 2026-05-25)
  - tests_passing     # internal (vitest)
  - tests_total
  # tertiary: TDD discipline (now available thanks to v5.1-oc + parse_opencode_transcript)
  - cycle_count
  - refactorings_applied
  - predictions_correct
  - predictions_total
  # context
  - completed_within_budget
  - duration_seconds
  - total_tokens
min_replicates: 5
status: aktiv
---

# RQ-model-quality-oc: Model effect on code quality (OpenCode harness)

## Motivation

With OpenCode as the second harness, models become reachable that do not run over Claude Code — Kimi K2, GLM 5.1, Gemini 2.5 Pro, Gemini 3.5 Flash (all via Portkey, OpenRouter/Vertex backends). Opus 4.7 runs on both harnesses and serves as the anchor here.

This RQ measures the **model effect on code quality and TDD discipline** in a harness-constant setting (all cells OpenCode, all the same workflow, all the same kata). It is the **direct counterpart** to the existing RQ-model-quality (Claude Code side, v4-exact-subagents × example-mapping) — but with the v5.1 workflow instead of v4 (OpenCode has no clean subagent equivalent, v5.1 is the most honest TDD counterpart). The workflow difference must be named explicitly when comparing findings, NO 1:1 transfer.

`game-of-life-example-mapping` as kata: carries the code-quality signal (`smell_total`, `cognitive_max`, etc. differentiate) AND is example-mapping compatible with v5.1's TDD mechanics (v5 permits all three prompt styles). claim-office is investigated in parallel in RQ-model-novel-kata-oc (correctness as primary outcome).

## Existing data

- **As of 2026-05-25**: No runs for any GOL cell of this RQ. First batch completely open.
- Routing smokes on claim-office × v5.1-oc (parallel RQ) confirmed: all 4 models route correctly through Portkey (Vertex EU for Opus, Vertex for Gemini, OpenRouter eval integration for Kimi/MiniMax).

## Model selection: why only 4 models

Gemini 2.5 Pro was removed from the RQ on 2026-05-25: three smoke attempts (91s/314s/85s, n=1 each) consistently showed a premature abort of the autonomous loop after 1-2 cycles without `experiment-done.txt`. An explicit continuation prompt ("Do NOT stop... continue until experiment-done.txt") changed nothing either — Pro interprets `pnpm test passes` as a natural ending and stops with an empty turn. This is a v5.1-oc compatibility issue (Pro does not follow the skill-loop pattern reliably), not a routing or model-strength problem. If this is fixed later (--variant high, alternative workflow, OC update), Pro can be added retroactively as a 5th factor value.

## Hypotheses

- **H1 (Opus anchor)**: opus-4-7-portkey delivers the lowest values for `cognitive_max` and `smell_total` — confirming that the Opus 4.7 level is preserved via OpenCode routing (otherwise the OC harness is a worthless confound).
- **H2 (non-Anthropic spread)**: The three non-Anthropic models (Kimi, GLM, Flash) show a measurable spread over `smell_total` and `cognitive_max` — i.e. the OpenCode harness is discriminating enough to make model differences visible.
- **H3 (skill-tool compliance is model-dependent)**: `cycle_count` and `refactorings_applied` show a spread across the four models — some use the `skill` tool with discipline, others drift into inline mode after 1-2 cycles. A low cycle_count is NOT automatically weaker TDD discipline, but also compliance with the skill affordance. Smoke finding: only Opus produces "Red Phase Complete" + prediction markers; all three other models ignore the format → `predictions_total=0`.

## Methodological notes

- All four models run via Portkey, but with different backproviders (Vertex EU for Opus, Vertex for Gemini, OpenRouter for Kimi/GLM). Backprovider routing effects are implicitly pinned in the lab-variant IDs; a changing backprovider would require a new lab variant.
- `n=5` per cell follows memory [[replicates-n-reliability]] (default for a medium field).
- The v5.1 workflow enforces test-first TDD with `skill` tool calls. Observable drift in `cycle_count` (skeleton: only 2 of ~18 cycles captured via the skill tool) is a workflow-compliance property, not a parser bug. Distinguish in findings: "model A has higher TDD discipline" ≠ "model A uses the skill tool more often".
- TDD discipline metrics (`cycle_count`, `predictions_*`, `refactorings_applied`) are available for OC runs from 2026-05-25 thanks to `parse_opencode_transcript.py`.
