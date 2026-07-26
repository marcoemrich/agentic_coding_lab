---
id: RQ-stability
question: "How stable are code quality and TDD discipline per workflow across replicates, and under which conditions is n=3 a sufficient replicate count?"
factors:
  workflow_x_prompt:
    - {workflow: v1-oneshot,             prompt: prose}
    - {workflow: v2-iterative,           prompt: prose}
    - {workflow: v3-basic-tdd,           prompt: example-mapping}
    - {workflow: v4-exact-subagents,     prompt: example-mapping}
    - {workflow: v5-exact-single-context, prompt: example-mapping}
    - {workflow: v6-hybrid,              prompt: example-mapping}
controls:
  model: opus-4-7-no-thinking
  kata_base: game-of-life
outcomes:
  # primary: the same code-quality metrics as RQ-tdd-quality,
  # evaluated for spread and stability
  - code_mass
  - smell_total
  - cc_longest_function
  - mccabe_max
  - cognitive_max
  # test strength: an additional stability dimension alongside code quality
  - mutation_score
  # new: TDD discipline bands per workflow
  - predictions_correct_rate    # pooled rate from predictions_correct/predictions_total
  - refactorings_applied        # refactor discipline (per run)
  - cycle_count                 # cycle granularity
  - tests_passed_immediately    # over-implementation indicator
  # secondary: correctness (sanity, should stay at 100 %)
  - tests_passing
  - verification_pct
  - completed_within_budget
  # context
  - duration_seconds
  - total_tokens
min_replicates: 10
status: aktiv
---

# RQ-stability: Run Stability per Workflow

How stably do the five workflows produce their code quality across replicates, and under which conditions does an n=3 sample suffice for robust statements?

## Motivation

RQ-tdd-quality (workflow effect on code quality) shows **dramatic differences in the means** between the workflows — in particular v4 vs all others on `cognitive_max` (a factor of 4–8x). The spreads, however, are distributed very unevenly:

| Workflow (RQ-tdd-quality data) | `cognitive_max` mean | σ | Range |
|---|---:|---:|---|
| v4-exact-subagents | 2.83 | **0.75** | 2–4 |
| v2-iterative | 16.67 | 2.31 | 14–18 |
| v1-oneshot | 20.67 | 2.52 | 18–23 |
| v3-basic-tdd | 23.33 | 4.51 | 19–28 |
| v5-exact-single-context | 18.33 | **6.66** | 11–24 |

Three observations:

1. **v4 is notably stable** — σ=0.75 is an order of magnitude smaller than for the others. This is consistent with the hypothesis that phase isolation reduces path dependence.
2. **v5 has σ=6.66 at a mean of 18.33** — the coefficient of variation (σ/μ) is 0.36. At n=3 the probability is high that a future repetition with 3 other runs would produce a substantially different mean.
3. **For v4, n=3 is probably sufficient** (σ small, distance to every other cell >> σ_v4). For v5 presumably not — the mean is unstable.

These observations are, however, themselves not robust at n=3 — σ estimates with n=3 have wide confidence intervals. RQ-stability measures stability at **n=10** per cell and thereby answers two questions:

- **(a) Which workflows produce stable code, which do not?**
- **(b) For which workflows is n=3 robust, and for which are more replicates needed?**

## Design

```
Factor:    workflow_x_prompt — 5 levels (v1+prose, v2+prose,
                                         v3/v4/v5+example-mapping)
Control:   model             — opus-4-7-no-thinking
Control:   kata_base         — game-of-life

Cells:      5
Replicates: n = 10
Runs:       50 total (38 new, 12 reused from RQ-tdd-quality:
            v1=3, v2=3, v3=3, v4=6 (RQ-model-quality+RQ-tdd-quality pooled), v5=3)
```

An identical setup to RQ-tdd-quality, only with n=10 instead of n=3 — the code-quality statements from RQ-tdd-quality are verified at a higher n and supplemented with stability statements.

## Methodological Sub-Question: When Does n=3 Suffice?

A central side result: from the n=10 data it can be calculated *post hoc* how often a random n=3 subsample supports the same ranking conclusions as the full n=10 sample.

**Subsampling analysis** (on n=10 per cell): draw all `C(10, 3) = 120` possible three-element subsamples from each cell and calculate per outcome how often the subsample-based ranking agrees with the n=10 ground-truth ranking. A cell that produces low agreement here (e.g. < 80 %) cannot be reliably characterized with n=3.

From this the practical rule can be derived:
- **Small-σ workflows** (estimated: v4) → n=3 suffices.
- **High-σ workflows** (estimated: v3, v5) → n ≥ 7 is needed for robust statements about the mean.

The subsampling analysis is documented numerically in the findings file.

## Hypotheses

- **H1 (workflow stability ranking)**: σ_cognitive_max grows in the order v4 < v2 ≈ v1 < v3 < v5. Phase isolation (v4) delivers the most stable signal; v5 with a shared context is the most volatile, because path-dependent context accumulation lets the form of the solution spread.
- **H2 (n=3 suffices for v4)**: The subsampling analysis on v4 shows ≥ 95 % agreement of the n=3 ranking with the n=10 ranking for all complexity outcomes.
- **H3 (n=3 does NOT suffice for v5)**: The subsampling analysis on v5 shows < 80 % agreement for `cognitive_max` and `cc_longest_function`.
- **H4 (the main RQ-tdd-quality finding holds at n=10)**: F-tdd-quality.1 ("strict TDD v4 clearly better") and F-tdd-quality.2 ("v3 worse than non-TDD") replicate at n=10 with the same sign and the same order of magnitude.

**Falsification of H4** would be particularly important: if the ranking flips at n=10 (e.g. v3 no longer last), F-tdd-quality.1/F-tdd-quality.2 would be a finding only at n=3 — which would undermine the whole of RQ-tdd-quality.

## Operationalization of the Stability Outcomes

Per cell, the following stability indicators are reported in addition to the usual mean/min/max/σ:

- **CV** (coefficient of variation = σ/μ): dimensionless relative spread. CV < 0.1 = very stable; 0.1–0.3 = moderate; > 0.3 = unstable.
- **IQR** (interquartile range): robust against individual outliers.
- **Outlier rate**: the share of runs whose outcome is > mean ± 2σ.
- **Reproducibility score** (from the subsampling analysis): the share of three-element subsamples whose mean lies within ±20 % of the n=10 mean.

## Caveats

- **(a) Single model**: only `opus-4-7-no-thinking`. Stability on other models is open.
- **(b) Single kata**: only Game of Life. Stability on mars-rover or claim-office could look different.
- **(c) Prompt asymmetry** (v1/v2 prose, v3/v4/v5 EM): a methodology constraint; already documented in the RQ-tdd-quality caveats. F-tdd-quality.4 shows: under the API contract, correctness is not influenced by the prompt asymmetry.
- **(d) Reuse of 12 RQ-tdd-quality runs**: methodologically clean, because workflow/model/kata/prompt are identical — but 38 new runs could deviate slightly and systematically, e.g. through calendar drift (a different server snapshot, a different tools version). We check the consistency of the means between the old 12 and the new 38 as a sanity check.
- **(e) Stability precision**: Even n=10 gives only rough σ estimates. A more robust σ measure would need n=30. At a budget of 50 runs that is not practicable; the bootstrap confidence intervals on the σ estimates are reported in the findings.

## Findings

See [findings.md](findings.md).

## Data Source

All runs in `experiments/runs/` with
`workflow ∈ {v1-oneshot, v2-iterative, v3-basic-tdd, v4-exact-subagents, v5-exact-single-context}`,
`kata ∈ {game-of-life-prose, game-of-life-example-mapping}` (workflow-constrained),
`model = opus-4-7-no-thinking`.
