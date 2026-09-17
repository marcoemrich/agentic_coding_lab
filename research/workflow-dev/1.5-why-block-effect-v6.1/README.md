---
id: RQ-why-block-effect-v6.1
question: "Do why blocks (causal justifications alongside MUSTs) on the hybrid-v2 base carry a measurable TDD discipline or correctness advantage over purely imperative instructions — with PEP fully retained?"
factors:
  workflow_x_prompt:
    - {workflow: exact-hybrid-v2-testlist-fix-cc, prompt: example-mapping}  # baseline (no why)
    - {workflow: exact-hybrid-v3-with-why-cc,                  prompt: example-mapping}  # with why blocks taken from lean
controls:
  model: opus-4-7-portkey-no-thinking
  kata_base: claim-office
outcomes:
  # primary: TDD discipline (where why blocks are most likely to act)
  - predictions_correct_rate
  - refactorings_applied
  - tests_passed_immediately
  - cycle_count
  # correctness (claim-office has genuine ambiguities)
  - verification_pct
  - tests_passing
  - completed_within_budget
  # code quality (secondary)
  - code_mass
  - smell_total
  - cc_longest_function
  - cognitive_max
  - mccabe_max
  # cost
  - duration_seconds
  - total_tokens
min_replicates: 8
status: aktiv
---

# RQ-why-block-effect-v6.1: Why block effect on the hybrid-v2 base (claim-office)

Do why blocks (causal justifications alongside imperatives) carry an independent contribution to TDD discipline or correctness — or is the perceived advantage from v6.5-lean fully explained by the PEP/emoji elements removed in parallel?

## Motivation

The v6.5-lean variant made **three orthogonal changes at once** (cf. exact-hybrid-v2-testlist-fix-cc vs `_archive/v6.5-lean/`):

1. **PEP/mantra reduction** in `commands/red.md` and `commands/green.md` — tested in isolation in [RQ-pep-v6.1](../1.1-pep-effect-v6.1/findings.md).
2. **Emoji/glyph reduction** in all 5 files (section headers, output templates) — tested in isolation in [RQ-emoji-v6.1](../1.2-emoji-effect-v6.1/findings.md).
3. **Why block addition**: three new why justifications that do not exist in hybrid-v2 — `commands/green.md` "Why minimality matters", `commands/red.md` step 7 "Why this format matters", `rules/tdd.md` "skill+subagent → measurement pipeline".

RQ-1.1, RQ-1.2 and RQ-1.3 (combined) isolated the first two factors. RQ-1.5 closes the gap for the third: it adds the three lean why blocks on top of the full hybrid-v2 base (PEP and emojis retained) and compares against the hybrid-v2 baseline.

**Current state of the Theory-of-Mind recommendation:** `research/workflow-dev/workflow-construction.md` lines 30–47 propagates the why block pattern on the basis of the Anthropic skill-creator docs (`~/.claude/skills/skill-creator/SKILL.md` lines 139, 302). An **empirical** backing from this repo has been missing so far. RQ-1.5 supplies it — or refutes it.

## Workflow definition

- **exact-hybrid-v2-testlist-fix-cc (baseline, n=5)**: fully imperative hybrid-v2 base. All MUST/CRITICAL/🚨 markers. No why blocks. Identical to the baseline in RQ-1.1/1.2/1.3/1.4.
- **exact-hybrid-v3-with-why-cc (new, n=5)**: identical to exact-hybrid-v2-testlist-fix-cc, plus three why blocks taken 1:1 from `_archive/v6.5-lean/`:
  - **commands/green.md**: "Why minimality matters" block after the opening heading, before "Your Mission".
  - **commands/red.md** step 7: "Why this format matters" block after the `MUST output … verbatim` instruction, before the output template. Explains the parser regex.
  - **rules/tdd.md**: "skill+subagent → measurement pipeline" paragraph after the subagents-v1/single-context-v1 hybrid explanation, before the checklist.
- **What stays unchanged**: all MUST/CRITICAL/🚨/⚠️ markers, all skill tool calls, all parser-relevant markers (predictions regex including the `✅` glyph, `Red Phase Complete` sentinel, `experiment-done.txt` termination). `commands/test-list.md` and `agents/refactor.md` byte-identical to hybrid-v2. No PEP/mantra reduction, no emoji removal.

## Hypotheses

- **H1 (why blocks have no effect alongside MUSTs)**: exact-hybrid-v3-with-why-cc and v6.1-hybrid statistically indistinguishable on all primary metrics (median difference within ±1σ of the baseline spread).
  *Consequence:* the Theory-of-Mind pattern is redundant alongside imperatives. Lean's apparent advantage is fully explained by the loss of PEP/emoji, not by the why addition. The `workflow-construction.md` recommendation gets conditioned: "why blocks replace MUSTs usefully, but add nothing alongside them."

- **H2 (why blocks help measurably)**: exact-hybrid-v3-with-why-cc improves at least one TDD discipline metric by ≥ +1σ with invariant `verification_pct`. Most plausible candidate: `predictions_correct_rate` — the red.md why explains the parser explicitly, which is the most direct causal path. Secondarily plausible: `refactorings_applied` (via the tdd.md why about the measurement pipeline).
  *Consequence:* the Theory-of-Mind pattern is empirically validated. Update `workflow-construction.md`: "MUST X. Why: Y." as the preferred default over a bare MUST.

- **H3 (why blocks hurt)**: exact-hybrid-v3-with-why-cc degrades on any primary metric by ≥ +1σ (why text displaces attention from the operational signal, or diverts the agent into meta-reflection).
  *Consequence:* the Theory-of-Mind pattern has to be formulated conditionally — why blocks only help when imperatives are removed, not in addition to them. The lean style would then be the only viable variant.

**A-priori expectation:** H1 is the most likely scenario. The three why blocks address measurement pipeline risks (marker consistency, skill delegation) that hybrid-v2's existing MUSTs already cover — the additional justification adds little when the instruction is followed anyway. H2 would be surprising and a strong argument for the Theory-of-Mind pattern.

## Design

```
Factor:  workflow_x_prompt — 2 levels (both with example-mapping)
           exact-hybrid-v2-testlist-fix-cc   (baseline)
           exact-hybrid-v3-with-why-cc                    (with why blocks)
Control: model            — opus-4-7-portkey-no-thinking (sharded)
Control: kata_base        — claim-office

Cells:      2 (2 workflows x 1 kata)
Replicates: n = 5
Runs:       10 total, of which 5 already exist (v6.1-hybrid baseline cell filled)
New runs:   5 (all exact-hybrid-v3-with-why-cc)
Shards:     Portkey, default
```

## Caveats

- **Single kata, single model**: the same restriction as RQ-1.4. claim-office is the deliberately chosen correctness stress test (15 scenarios, granular `verification_pct` scale).
- **The baseline cell is reused**: the 5 existing `exact-hybrid-v2-testlist-fix-cc × claim-office-example-mapping × opus-4-7-portkey-no-thinking` runs from RQ-1.4 are the baseline cell. Triangulation check: the baseline numbers in RQ-1.5 must match the v6.1-hybrid numbers in RQ-1.4 (same runs).
- **n=5 is small** for effects ≤ 0.5σ — H1 vs H2 is not separable at very small effect sizes.
- **Why block coverage is selective**: only the three lean sites get a why; the remaining ~7 MUSTs in rules/tdd.md and all 4 MUSTs in agents/refactor.md stay bare. If H2 holds, the question remains open whether full why block coverage amplifies the effect — a follow-up RQ question.

## Findings

See [findings.md](findings.md).

## Data source

All runs in `experiments/runs/` with
`workflow ∈ {exact-hybrid-v2-testlist-fix-cc, exact-hybrid-v3-with-why-cc}`,
`kata = claim-office-example-mapping`,
`model = opus-4-7-portkey-no-thinking`.
