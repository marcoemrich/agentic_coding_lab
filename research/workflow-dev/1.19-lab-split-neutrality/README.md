---
id: RQ-lab-split-neutrality
question: "Is v6.1.1-lab-split-cc behaviourally equivalent to v6.1-hybrid-testlist-scope-fix, as the exact-coding baseline recommendation assumes? The production files are byte-identical; only the rule layout differs (lab infrastructure isolated in rules/lab-only.md, subagent contracts in rules/subagent-prompts.md). Measured on both katas, with refactorings_applied as a declared outcome."
factors:
  workflow_x_prompt:
    - {workflow: v6.1-hybrid-testlist-scope-fix, prompt: example-mapping}  # the measurement basis of the v6.1 line
    - {workflow: v6.1.1-lab-split-cc,            prompt: example-mapping}  # the export carrier, recommended as the exact-coding baseline
  kata_base: [game-of-life, claim-office]
controls:
  model: opus-5-no-thinking
outcomes:
  # the primary outcome — this is the metric the original control run omitted,
  # and the one that diverged. Read as a rate against cycle_count, not alone.
  - refactorings_applied
  - cycle_count
  # cost, where the consequence of a changed refactor rate shows up
  - duration_seconds
  - total_tokens
  # correctness must be held: a layout change may not cost completeness
  - verification_pct
  - tests_passing
  - completed_within_budget
  # code quality — the reason the refactor subagent exists at all
  - cc_avg_loc_per_function
  - cc_longest_function
  - cognitive_max
  - mccabe_max
  - smell_total
  - code_mass
  # marker health: v6.1.1 must produce the same four markers as v6.1
  - predictions_correct_rate
  - tests_passed_immediately
min_replicates: 5
status: aktiv
---

# RQ-1.19: Is the Lab/Product Rule Split Behaviourally Neutral?

`v6.1.1-lab-split-cc` is the workflow that
`research/workflow-dev/workflow-construction.md` § "Aktuelle Front" names the
exact-coding baseline for correctness-critical work on opus-5-no-thinking, and
it is the workflow the `exact-coding-baseline-export` skill ships. It exists
to make the export clean: lab-only measurement infrastructure isolated in
`rules/lab-only.md` (deleted on export), subagent contracts in
`rules/subagent-prompts.md` (kept).

The recommendation rests on it being behaviourally identical to
`v6.1-hybrid-testlist-scope-fix`, which is the workflow all the v6.1 findings
were actually measured on. This RQ tests that assumption.

## Motivation

The claim in `workflow-construction.md` is that a control run over three
game-of-life runs shows no performance drop — duration, tokens and
`cycle_count` all inside 1 σ of the v6.1 baseline. That is true as far as it
goes:

| metric | v6.1 GoL (n=5) | v6.1.1 GoL (n=3) | deviation |
|---|---:|---:|---:|
| `duration_seconds` | 620.6 ± 89.8 | 644.0 | 0.26 σ |
| `total_tokens` | 8.0 M ± 1.7 M | 9.1 M | 0.66 σ |
| `cycle_count` | 10.4 ± 1.5 | 10.3 | 0.04 σ |
| **`refactorings_applied`** | **4.4 ± 0.5** | **6.0** | **2.9 σ** |

`refactorings_applied` was not among the compared metrics, and it is the one
that moved. The refactor *rate* went from 0.42 to 0.58 per cycle at an
essentially unchanged cycle count — which is why a cycle-count comparison
looked reassuring.

A single claim-office run of v6.1.1 (2026-09-03, recorded for
[RQ-4.7](../../questions-claude/4.7-external-tdd-workflows-opus5/)) suggests
the effect is much larger on the big kata: refactor rate 1.00 against v6.1's
0.41, at 5019 s against 2661 s and 168.4 M against 81.9 M tokens. That is n=1
and proves nothing on its own — it is the reason this RQ exists, not its
result.

### Why the kata matters here

The cost consequence of a refactor-rate shift scales with cycle count and
codebase size, so game-of-life structurally suppresses it:

- GoL, ~10 cycles: 0.42 → 0.58 is about 1.6 extra subagent spawns on a small
  single-file library. Duration +4 % — inside the noise.
- claim-office, ~45 cycles: 0.41 → 1.00 would be roughly 30 extra spawns, each
  reading a larger codebase.

Validating a workflow only on game-of-life runs against the lab's own
thrice-confirmed anti-pattern ("GoL-Sieger ≠ claim-office-Sieger",
`workflow-construction.md` on RQ-1.4, F-model-novel.4, RQ-1.9). Both katas are
therefore factors here, not a control.

## Hypotheses

- **H1 (the refactor rate differs)** — `refactorings_applied / cycle_count` is
  higher for v6.1.1 than for v6.1 on both katas, at ≥ 1 σ. Falsifier: the GoL
  gap disappears at n=5, which would make the 2.9 σ above an n=3 artifact.
- **H2 (the effect is larger on claim-office)** — the rate gap on claim-office
  exceeds the gap on game-of-life. This is the kata-interaction claim; if it
  holds, no single-kata validation of a workflow change is sufficient.
- **H3 (cost follows the rate on the large kata only)** — `duration_seconds`
  and `total_tokens` differ by ≥ 1 σ on claim-office but not on game-of-life.
  This is what would make the original control's conclusion wrong in effect
  while being right in its own numbers.
- **H4 (correctness is held)** — `verification_pct` and `tests_passing` are
  indistinguishable between the two. A rule-layout change must not cost
  completeness. A drop here would be a much more serious problem than cost.
- **H5 (quality is unchanged or better)** — if v6.1.1 refactors more, its
  decomposition metrics (`cc_avg_loc_per_function`, `cc_longest_function`)
  should be equal or better. If it refactors more and the code is *not* better,
  the extra refactor passes are pure cost.
- **H6 (markers stay healthy)** — v6.1.1 produces `predictions_total ≈ 2 ×
  cycle_count` and non-zero `refactorings_applied` on both katas, so the
  workflow remains measurable. Confirmed at n=1 on claim-office (50 cycles,
  100 predictions, 50 refactorings).

## Design

```
Factor:   workflow_x_prompt — 2 levels, both example-mapping
Factor:   kata_base         — game-of-life, claim-office
Control:  model             — opus-5-no-thinking (native subscription route)

Cells:      4
Replicates: n = 5
```

Reusable: v6.1 has 5 runs on each kata, v6.1.1 has 3 on game-of-life and 1 on
claim-office. RQ-4.7's fill adds 4 more v6.1.1 claim-office runs, which count
here too (aggregation is query-based), so that cell completes without runs of
its own.

## Caveats

- **Do not average across katas** — the whole point is that the two behave
  differently. Every comparison is within one kata.
- **`refactorings_applied` is only meaningful as a rate.** Compare
  `refactorings_applied / cycle_count`; the raw count moves with cycle count,
  which itself varies by kata and run.
- **The 2.9 σ figure above is n=3 against n=5** and uses the v6.1 σ. It is the
  motivation for the RQ, not evidence to be carried into findings.
- **The v6.1.1 game-of-life runs predate two pipeline fixes** — the missing
  `measure-tdd-rigour.py` container mount and the single-spec-file test
  counting. They need `reanalyze-in-container.sh` before aggregation, or their
  transcript-derived metrics will be null and their test metrics undercounted.
- **This RQ has product consequences, not just research ones.** v6.1.1 is what
  the `exact-coding-baseline-export` skill ships. If H1–H3 hold, either the
  export carrier changes or the recommendation is restated with its real cost.

## Findings

See [findings.md](findings.md) — no aggregation yet.

## Data Source

All runs in `experiments/runs/` with
`workflow ∈ {v6.1-hybrid-testlist-scope-fix, v6.1.1-lab-split-cc}`,
`kata ∈ {game-of-life-example-mapping, claim-office-example-mapping}`,
`model = opus-5-no-thinking`.

## Sources

- The recommendation under test: `research/workflow-dev/workflow-construction.md` § "Aktuelle Front"
- v6.1 reference data: [RQ-4.5](../../questions-claude/4.5-architecture-axis-opus5/summary.md)
- The claim-office n=1 observation: [RQ-4.7](../../questions-claude/4.7-external-tdd-workflows-opus5/)
- Export consumer: `.claude/skills/exact-coding-baseline-export/SKILL.md`
- Marker requirements: `experiments/workflows/MARKERS.md`
