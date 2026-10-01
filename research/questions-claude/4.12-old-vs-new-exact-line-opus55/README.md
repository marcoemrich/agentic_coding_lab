---
id: RQ-old-vs-new-exact-line-opus55
question: "On Opus 5.5, does the retired EXACT Coding Opus line still decompose more strongly than the maintained Predictive-TDD line, and does isolating the Refactor step into a subagent help or hurt within each line?"
factors:
  workflow:
    # Maintained line (SOL-derived Predictive TDD), shared context
    - exact-ptdd-v1-cc
    # Maintained line, per-cycle Refactor delegated to an isolated subagent
    - exact-ptdd-v1.1-refactor-subagent-cc
    # Retired Opus line, red/green shared and Refactor isolated
    - exact-hybrid-v2-testlist-fix-cc
    # Retired Opus line, minimal shared-context variant — no isolated subagent
    - exact-single-context-v3-no-subagent-cc
controls:
  model: opus-5-5-no-thinking
  kata_base: claim-office
  prompt: example-mapping
  # Opus 5.5 is gated behind 2.1.280 (RQ-opus55-current-workflow, "The CLI gate").
  # Pinning it keeps the workflow factor separable from the CLI bump and makes the
  # two existing ptdd cells reusable — they are already on 2.1.280.
  harness_version: "2.1.280"
outcomes:
  # Decomposition — the axis on which the two lines actually separated on Opus 5
  # (RQ-current-ptdd-vs-exact-opus-native F-4.9.1)
  - cc_avg_loc_per_function
  - cc_median_loc_per_function
  - cc_longest_function
  - unit_count
  - unit_size_max
  - unit_size_avg
  - unit_size_median
  # Code quality
  - cognitive_max
  - cognitive_avg
  - mccabe_max
  - mccabe_avg
  - smell_total
  - code_mass
  - lines_of_code
  - test_lines
  # Correctness — gate, not signal: all Opus 5.5 cells measured so far sit at 1.00
  - verification_pct
  - tests_passing
  - completed_within_budget
  - mutation_score
  - mutants_total
  - mutants_survived
  # Efficiency — the axis the subagent decision is actually made on
  - duration_seconds
  - total_tokens
  - cost_usd
  # TDD discipline is deliberately NOT an outcome. On Opus 5.5 the text-derived
  # markers are unreadable in shared-context arms and readable in isolated ones
  # (F-2.4.5, F-2.4.6), so refactorings_applied / predictions_* / cycle_count
  # would compare a parser artefact across exactly the factor under study.
min_replicates: 5
---

# RQ-4.12: The Retired Opus Line against the Maintained PTDD Line on Opus 5.5

> **Three of the four cells are being replaced.** `exact-hybrid-v2-testlist-fix-cc` first, then
> `exact-ptdd-v1-cc` and `exact-ptdd-v1.1-refactor-subagent-cc` when the two maintained-line
> cells were added to RQ-4.13. Only `exact-single-context-v3-no-subagent-cc` keeps its
> original runs — this RQ lists no discipline outcomes, so a cell of pre-reporter runs beside
> three refilled ones costs it nothing but a re-derivation. Its five runs
> predate the vitest TDD reporter, so they carry no phase-chain discipline
> columns. They matched the selector of
> [RQ-4.13](../4.13-tdd-workflow-comparison-opus55/) too, where that made the
> cell report itself full while the RQ's primary axis stayed empty, so they were
> moved to `experiments/runs/_archive/` and are being refilled on identical cell
> coordinates — same workflow, model, kata, prompt and harness 2.1.280.
>
> Until that batch is through, this cell reads 0 runs and the findings below
> still carry its old figures. The token, cost and subagent tables are the ones
> that rest on it. Re-derive them against the new runs before reading them
> again; the correctness and decomposition conclusions are expected to hold, but
> the numbers will move within the noise.

## Question

Two independent claims about EXACT Coding on Opus currently rest on Opus 5 data
only:

1. **The retired Opus line decomposes more strongly.** On native Opus 5,
   `exact-hybrid-v2-testlist-fix-cc` produced markedly smaller functions than
   the PTDD line (mean LoC/function 3.81 against 5.53, median 2.00 against 4.55)
   while paying 3–5× the tokens — RQ-current-ptdd-vs-exact-opus-native F-4.9.1
   and F-4.9.2. That trade is the sole reason the hybrid survives as a
   "historical decomposition reference" in
   `research/workflow-dev/model-recommendation-matrix.md`.
2. **Isolating the Refactor step runs in opposite directions in the two lines.**
   In the PTDD line on Opus 5.5 the isolated subagent buys nothing on quality
   and costs 3× wall-clock (RQ-opus55-current-workflow F-2.4.7). On the retired
   line the only ±subagent pair measured — on `game-of-life`, Opus 5 — points
   the other way: the isolated arm had the *lower* `cognitive_max` and
   was cheaper and faster than the shared-context arm.

Neither claim has an Opus 5.5 measurement. Both matter for the same decision:
what the exported baseline should contain, and whether the subagent step is
worth keeping in either line on the current model.

## Design

Four cells, one model, one kata, one prompt style, one CLI version. The grid is
a 2×2 over **line** (retired Opus / maintained PTDD) and **Refactor
architecture** (shared context / isolated subagent):

| | shared context | isolated Refactor subagent |
|---|---|---|
| **maintained PTDD line** | `exact-ptdd-v1-cc` | `exact-ptdd-v1.1-refactor-subagent-cc` |
| **retired Opus line** | `exact-single-context-v3-no-subagent-cc` | `exact-hybrid-v2-testlist-fix-cc` |

**20 target runs at `min_replicates: 5`, of which 10 already exist.** The two
PTDD cells were measured for RQ-opus55-current-workflow on this exact kata,
prompt, model and CLI version, so aggregation picks them up unchanged and only
the two retired-line cells need filling.

The declared workflow names are the LINEAGE names; the retired-line runs in the
pool carry their pre-rename aliases (`v6.1-hybrid-testlist-scope-fix`,
`v5.2-no-subagent-cc`) and resolve through `ALIASES.json`.

### Why this is not a sub-question of RQ-2.4

RQ-opus55-current-workflow varies **model** against a fixed line (inline
baseline, PTDD shared, PTDD isolated). This RQ holds the model at Opus 5.5 and
varies **line** — a different factor, and one that would smear RQ-2.4's
model axis if folded into it. The two RQs share the two PTDD / Opus 5.5 cells;
that is the intended pooling, not a duplication.

## Hypotheses

- **H1 — The decomposition advantage of the retired line survives on Opus 5.5.**
  F-4.9.1 measured it on Opus 5; if it is a property of the workflow's four-rules
  refactor emphasis rather than of the model, it should reappear. The
  counter-reading is F-2.4.1: under the PTDD line Opus 5.5 already decomposes
  much harder than Opus 5 did (mean LoC/function 4.54 against 6.10), which could
  have closed the gap without the retired line doing anything.
- **H2 — The cost gap widens rather than closes.** The retired line spent 83.7 M
  tokens and $49.13 on Opus 5 against the PTDD line's 14.7 M and $11.83. Opus 5.5
  spends *more* tokens than Opus 5 under the PTDD line (F-2.4.4), so a naive
  extrapolation puts the retired line well past 100 M. If it lands there for a
  decomposition gain that H1 finds absent, the "historical reference" status
  becomes a removal candidate.
- **H3 — The sign of the subagent effect is a property of the line, not the
  model.** If the retired line's shared-context variant again measures *worse*
  on Cognitive Complexity than its isolated variant, while the PTDD line shows
  the reverse, then "isolate the Refactor step" is not a transferable
  recommendation and must be stated per workflow.

## Caveats

- **One kata, one stack.** Claim Office / TypeScript. The retired line's
  ±subagent pair has never run on Claim Office at all, in any model — the Opus 5
  reference for H3 is on `game-of-life` and `sphinx-score`, so H3 is tested
  fresh here rather than replicated.
- **Correctness will not separate.** Every Opus 5.5 cell measured so far sits at
  1.00 on this kata. It is an eligibility gate for the quality comparison, not
  an outcome that ranks the arms.
- **`cost_usd` is a list-price comparison value, not an invoice**, and Opus 5.5's
  cache-read tariff (0.05× base input against Opus 5's 0.1×) makes it a poor
  primary axis. Compare total tokens first.
- **The `total_tokens` and `cost_usd` columns in `runs.csv` count the main
  context only** and omit every subagent invocation, understating the two
  isolated arms by 43 % and 11 % — unevenly, and along the factor under study.
  `findings.md` recomputes both from the subagent transcripts; do not quote the
  aggregated columns for this RQ until the pipeline is fixed (F-4.12.5).
- **`cost_usd` is missing from the Opus 5 `v5.2-no-subagent-cc` runs** (all ten
  are from 2026-08-11, before cost computation existed). Any Opus 5 back-comparison
  on price needs `experiments/compute-cost.py` run over them first.
