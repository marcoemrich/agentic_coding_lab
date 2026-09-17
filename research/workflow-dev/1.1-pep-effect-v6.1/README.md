---
id: RQ-pep-v6.1
question: "Do psychological justifications ('pep talks') in the Red and Green skill prompts on the hybrid-v2 base deliver a measurable code quality or TDD discipline advantage over purely operational instructions?"
factors:
  workflow_x_prompt:
    - {workflow: exact-hybrid-v2-testlist-fix-cc, prompt: example-mapping}
    - {workflow: exact-hybrid-v2.1-no-pep-cc,                    prompt: example-mapping}
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
  # TDD discipline (especially relevant for Green phase reduction)
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

# RQ-pep-v6.1: Pep talk effect on the hybrid-v2 base (re-run)

Do the motivating and justifying parts of the **Red and Green skill prompts** deliver a measurable code quality or TDD discipline advantage — or do the plain operational instructions suffice on their own? Repetition of the archived RQ-pep on the new, correctness-fixed hybrid-v2 base.

## Motivation

The old RQ-pep (oneshot-v1 generation, `2.3-pep-effect`; deleted in `953841cb`, now only in the git history) built on the exact-hybrid-v1-cc line, which was later identified as correctness-defective (break exact-hybrid-v1-cc → v6.5-lean). The new base `exact-hybrid-v2-testlist-fix-cc` corrects the test-list scope bug and has been the valid starting point for reduction experiments since the hybrid-v1 rebuild. Findings from the old line are potentially confounded by the bug — hence the repetition.

`MARKERS.md` still classifies "Psychological Resistance" sections and "Trust the process" pep talks as **decorative content (safe to drop)**. RQ-pep-v6.1 tests this classification against hybrid-v2.

Concretely: `commands/green.md` contains a 12-line "Psychological Resistance" section plus motivating inline comments in the code blocks. In `commands/red.md` the psychological load is low — "Maintain strict discipline" and an "// Intentionally wrong" comment.

## Workflow definition

- **exact-hybrid-v2-testlist-fix-cc (control, n=5)**: Red and Green skills with the full prompt including psychological justifications, pep talks, motivating inline comments and the "Psychological Resistance" section. Identical to exact-hybrid-v1-cc at the Red/Green skill level; only `test-list.md` differs (spec coverage fix).
- **exact-hybrid-v2.1-no-pep-cc (new, n=5)**: identical to exact-hybrid-v2-testlist-fix-cc, with the only changes in `commands/red.md` and `commands/green.md` (taken 1:1 from the archived v6.3-no-pep, since hybrid-v1 Red/Green and hybrid-v2 Red/Green are byte-identical):
  - **green.md**: entire "Psychological Resistance" section removed (12 lines). Motivating inline comments in code examples removed ("// Minimal - just make the test pass", "// Perfect - minimal", "// Still simple", "// NOW generalize"). Reassurance wording replaced: "Baby steps" → "Smallest change", "Simple is better: Hardcoded returns are perfectly fine" → "Hardcoded returns are allowed", "Take baby steps" → "Take small steps", "Approach: [explain why this is minimal]" line deleted. Section headings trimmed.
  - **red.md**: mission entry "Maintain strict discipline -" deleted, code comment "// Intentionally wrong" removed.
- **What stays unchanged**: all operational process steps, code examples (without reassurance comments), DO/DON'T lists, prediction format including the step-7 verbatim instruction in red.md, refactor subagent (with APP + Four Rules + naming eval), `test-list.md` (with scope fix), all rules files.

## Hypotheses

- **H1 (pep talks have no effect)**: exact-hybrid-v2.1-no-pep-cc produces statistically indistinguishable values to v6.1-hybrid on the primary code quality metrics (median difference within ±1 σ of the hybrid-v2 spread).
  Consequence under H1: psychological justifications in Red/Green are prompt ballast — classification confirmed, no-pep can be combined with further reductions.
- **H2 (pep talks help measurably)**: exact-hybrid-v2.1-no-pep-cc degrades on at least two of the five primary metrics by ≥ +1 σ with a consistent direction.
  Consequence under H2: "Trust the process" wording carries weight — the MARKERS classification must be corrected.
- **H3 (specific discipline effect)**: since the Psychological Resistance section argues explicitly against over-implementation, `tests_passed_immediately` is the most sensitive indicator. Expectation under the H2 variant: exact-hybrid-v2.1-no-pep-cc has a higher `tests_passed_immediately` mean.
- **H4 (pep talks cost)**: exact-hybrid-v2.1-no-pep-cc saves tokens and/or wallclock measurably (≥ 5%). Probably small, because the removed blocks make up only a fraction of the total token load.
- **H5 (replication)**: the result pattern matches the old RQ-pep line. A deviation would be an indication that the hybrid-v1 line was in fact confounded by the test-list scope bug.

**A-priori expectation:** the MARKERS classification + reduction series (Four Rules ineffective) argue for H1. But RQ-app has shown that a null effect must not be the default — the data has to decide.

## Design

```
Factor:  workflow_x_prompt — 2 levels (exact-hybrid-v2-testlist-fix-cc, exact-hybrid-v2.1-no-pep-cc), both with example-mapping
Control: model            — opus-4-7-no-thinking
Control: kata_base        — game-of-life

Cells:      2 (2 workflows x 1 kata)
Replicates: n = 5
Runs:       10 total (no reuse — no v6.1-hybrid runs on direct-API opus-4-7-no-thinking available)
```

## Caveats

- **Single kata, single model, n=5**: identical to the archived RQ-pep. Extension to claim-office and larger n as needed.
- **Asymmetric reduction**: green.md holds considerably more psychological content than red.md. An effect, if present, presumably comes primarily from green.md.
- **Mechanism separation is hard**: an H2 effect would leave open *which* pep talk component carries the effect.
- **Direct-API model**: opus-4-7-no-thinking without Portkey routing — no single-shard requirement for 10 runs, but per the memory convention do not shard.

## Findings

See [findings.md](findings.md).

## Data source

All runs in `experiments/runs/` with
`workflow ∈ {exact-hybrid-v2-testlist-fix-cc, exact-hybrid-v2.1-no-pep-cc}`,
`kata = game-of-life-example-mapping`,
`model = opus-4-7-no-thinking`.
