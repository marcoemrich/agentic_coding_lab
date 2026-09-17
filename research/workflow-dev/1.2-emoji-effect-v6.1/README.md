---
id: RQ-emoji-v6.1
question: "Do decoration emojis (✅ ❌ 🔴 🟢 🔄 📋 🚨 ⚠️) in the workflow prompts (skills + refactor agent + rules/tdd.md) on the hybrid-v2 base have a measurable effect on code quality or TDD discipline?"
factors:
  workflow_x_prompt:
    - {workflow: exact-hybrid-v2-testlist-fix-cc, prompt: example-mapping}
    - {workflow: exact-hybrid-v2.2-no-emoji-cc,                  prompt: example-mapping}
controls:
  model: opus-4-7-no-thinking
  kata_base: game-of-life
outcomes:
  # primary: code quality
  - code_mass
  - smell_total
  - cc_longest_function
  - cognitive_max
  - mccabe_max
  # TDD discipline (especially relevant — predictions are emoji-marked)
  - refactorings_applied
  - cycle_count
  - predictions_correct_rate
  - tests_passed_immediately
  # cost
  - duration_seconds
  - total_tokens
  # correctness (sanity)
  - tests_passing
  - verification_pct
  - completed_within_budget
min_replicates: 5
status: aktiv
---

# RQ-emoji-v6.1: Emoji effect on the hybrid-v2 base (re-run)

Do the roughly 95 decoration emojis (✅ 45×, ❌ 25×, 🚨 6×, 🔴 4×, 🟢 2×, 📋 2×, 🔄 1×, ⚠️ 1×) in the skill commands and the refactor subagent of hybrid-v2 have a measurable effect on TDD discipline or code quality — or are they pure decoration?

## Motivation

Repetition of the old RQ-emoji (oneshot-v1 generation, `2.4-emoji-effect`; deleted in `953841cb`, now only in the git history) on the new, correctness-fixed hybrid-v2 base. The old RQ-emoji built on the exact-hybrid-v1-cc line, which was later identified as correctness-defective (break exact-hybrid-v1-cc → v6.5-lean). Findings from the old line are potentially confounded by the test-list scope bug — hence the repetition on `exact-hybrid-v2-testlist-fix-cc` as the valid base (see memory `v6-rebuild-new-base.md`).

`MARKERS.md` still classifies emoji headers (`🔴 / 🟢 / 🔄 / 📋`) and ✅/❌ status markers as **decorative content (safe to drop)**. RQ-emoji-v6.1 tests this classification against hybrid-v2 — in parallel to the sister RQ [RQ-pep-v6.1](../1.1-pep-effect-v6.1/README.md).

Additional motivation: the repo's CLAUDE.md explicitly forbids emojis in our own files (`"Only use emojis if the user explicitly requests it"`). The workflow prompts contradict this rule — RQ-emoji-v6.1 tests whether that is justified.

## Workflow definition

- **exact-hybrid-v2-testlist-fix-cc (control, n=5)**: complete decoration emojis across all 5 workflow files (`red.md`, `green.md`, `test-list.md`, `refactor.md`, `rules/tdd.md`).
- **exact-hybrid-v2.2-no-emoji-cc (new, n=5)**: identical to exact-hybrid-v2-testlist-fix-cc, only change: decoration emojis removed.
  - **Decoration removed** (95 occurrences): ✅, ❌, 🚨, 🔴, 🟢, 🔄, 📋, ⚠️ dropped without replacement from headers, DO/DON'T lists, process check sub-steps and output templates.
  - **Parser-critical correction**: `✅ Correct` / `❌ Incorrect` in the Red phase prediction templates → `- Correct` / `- Incorrect`. The parser regex `(- | ✅ | ❌) (Correct|Incorrect)` accepts both variants (verified in the old v6.4-no-emoji).
  - **❓ kept** (8 occurrences in `test-list.md`): semantic reference to spec syntax (clarifying questions in example-mapping prompts such as claim-office). Not a decoration marker — removing it would lose the cross-reference to the spec syntax. Inactive in the game-of-life spec, actively used in claim-office.
- **What stays unchanged**: all operational instructions, process steps, APP, Four Rules, **pep talks (including the Psychological Resistance section)**, refactor subagent logic, prediction format including the step-7 verbatim instruction in red.md, `test-list.md` with the scope fix, all rules files.

## Hypotheses

- **H1 (emojis have no effect on code quality)**: all 5 primary metrics (`code_mass`, `smell_total`, `cc_longest_function`, `cognitive_max`, `mccabe_max`) statistically indistinguishable between the workflows (median difference within ±1 σ of the hybrid-v2 spread).
  Consequence under H1: emoji decoration is prompt ballast — MARKERS classification confirmed, no-emoji can be combined with further reductions.
- **H2 (emojis help measurably)**: exact-hybrid-v2.2-no-emoji-cc degrades on at least two of the five primary metrics by ≥ +1 σ with a consistent direction.
  Consequence under H2: visual markers carry weight — the MARKERS classification must be corrected.
- **H3 (emojis cost tokens)**: exact-hybrid-v2.2-no-emoji-cc saves tokens and/or wallclock measurably (≥ 5%). **Expected small a priori** — the ~95 emojis are only a fraction of the token load by volume.
- **H4 (prediction discipline effect)**: `predictions_correct_rate` is particularly sensitive, because ✅/❌ appear directly in the prediction output template. RQ-pep-v6.1 F-1.1 showed that wording in red.md can influence `predictions_correct_rate` (no-pep: 100.0% vs pep: 98.8%). Parallel expectation: hyphen markers instead of ✅/❌ could show a similar drift.
- **H5 (replication)**: the result pattern matches the old RQ-emoji line. A deviation would be an indication that the hybrid-v1 line was in fact confounded by the test-list scope bug.

**A-priori expectation:** the MARKERS classification + reduction series (Four Rules ineffective, pep talks without a quality effect) argue for H1 with a possible discipline shift as in RQ-pep. But RQ-app has shown that a null effect must not be the default — the data has to decide.

## Design

```
Factor:  workflow_x_prompt — 2 levels (exact-hybrid-v2-testlist-fix-cc, exact-hybrid-v2.2-no-emoji-cc), both with example-mapping
Control: model            — opus-4-7-no-thinking
Control: kata_base        — game-of-life

Cells:      2 (2 workflows x 1 kata)
Replicates: n = 5
Runs:       10 total
            — 5 exact-hybrid-v2-testlist-fix-cc runs (reusable from RQ-pep-v6.1, identical control cell)
            — 5 exact-hybrid-v2.2-no-emoji-cc runs (1 smoke + 4 batch fill)
```

**Reuse:** the control cell `exact-hybrid-v2-testlist-fix-cc × game-of-life-example-mapping × opus-4-7-no-thinking` is identical to the control cell from RQ-pep-v6.1. `aggregate-by-query.py` collects all matching runs from `experiments/runs/` — no re-run needed.

## Caveats

- **Single kata, single model, n=5**: identical to the archived RQ-emoji. Extension to claim-office and larger n as needed.
- **Asymmetric decoration load**: ✅/❌ markers (70 occurrences) dominate — the other emojis (🔴🟢🔄📋🚨⚠️, 15 occurrences) are rare. An effect, if present, presumably comes primarily from ✅/❌.
- **❓ not removed**: in the game-of-life spec this convention is inactive (the game-of-life spec uses no ❓). A future run on claim-office would have to drop the ❓ as well for a pure "all emojis gone" variant — and would therefore require additional handling of the spec reading.
- **Parser compatibility confirmed**: the hyphen variant "- Correct"/"- Incorrect" is correctly recognized as a prediction by the parser (old v6.4-no-emoji smoke: 18/18 predictions parsed).
- **Direct-API model**: opus-4-7-no-thinking without Portkey routing — no single-shard requirement for 10 runs, but per the memory convention do not shard.

## Findings

See [findings.md](findings.md).

## Data source

All runs in `experiments/runs/` with
`workflow ∈ {exact-hybrid-v2-testlist-fix-cc, exact-hybrid-v2.2-no-emoji-cc}`,
`kata = game-of-life-example-mapping`,
`model = opus-4-7-no-thinking`.
