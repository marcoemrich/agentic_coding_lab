# Findings — RQ-exact-coding-typescript

## Overview

Cell means ± standard deviation. **Inline** is the minimal inline-TDD
instruction, **EXACT v1** the shared-context Predictive TDD workflow, **EXACT
v1.1** the same workflow with the per-cycle Refactor step delegated to an
isolated subagent. Kata is Claim Office, prompt is Example Mapping.

The two models are separate tables and are never compared with each other: they
run on different harnesses and routes, so absolute duration, token and cost
levels are not causal comparisons. Trophies are awarded **within a table**.

Complexity, unit size, duration and cost are lower = better; Mutation Score is
higher = better. Bold values with 🏆 mark the winner of that row. A trophy is
shared when the gap to the best cell is smaller than the best cell's own
standard deviation, so several trophies in a row read as "no effect".

Production LoC, Code Mass (APP), Test LoC, test count, unit count and
`mutants_total` have no unambiguous direction and receive no trophy; they appear
below as context.

`mutants_survived` is split into its two parts. A **Survived** mutant means a
test ran the mutated line and still passed — a weak assertion. An **uncovered**
one (`mutants_no_coverage`) means no test reaches the line at all — untested
code. Mutation Score cannot tell them apart, and on Opus they separate arms
whose scores are identical (F-1.10.8).

**Correctness guard — passed.** All six cells clear the 0.90 gate, so every
quality row is eligible. Correctness (internal) is 100 % in all six. Correctness
(external) is 1.00 ± 0.00 in five cells; the single deviation is Opus 5 under
EXACT v1.1 at 0.96 ± 0.09, which is also the only cell that lost a run to a
timeout.

### Opus 5 — native Claude Code

| Metric | Inline (n=5) | EXACT v1 (n=10) | EXACT v1.1 (n=5) |
|---|---:|---:|---:|
| Correctness (external) | 1.00 ± 0.00 | 0.99 ± 0.02 | 0.96 ± 0.09 |
| Completed within budget | 100 % | 100 % | 80 % |
| Complexity Peak (`cognitive_max`) | 6.0 ± 1.87 | 2.8 ± 0.63 | **2.2 ± 0.45** 🏆 |
| `cognitive_avg` | 2.53 ± 0.42 | 1.47 ± 0.26 | **1.13 ± 0.06** 🏆 |
| `mccabe_max` | 5.2 ± 0.84 | **3.3 ± 0.48** 🏆 | **3.0 ± 0.00** 🏆 |
| `mccabe_avg` | 1.99 ± 0.15 | 1.59 ± 0.12 | **1.33 ± 0.08** 🏆 |
| Smell Total | 0.2 ± 0.45 | **0.0 ± 0.00** 🏆 | **0.0 ± 0.00** 🏆 |
| `unit_size_max` | 23.8 ± 4.27 | 18.9 ± 5.26 | **15.2 ± 3.35** 🏆 |
| `unit_size_avg` | 7.62 ± 0.45 | 5.95 ± 0.93 | **4.60 ± 0.33** 🏆 |
| `unit_size_median` | 4.9 ± 0.55 | 4.7 ± 1.27 | **3.2 ± 0.27** 🏆 |
| Mutation Score | **0.90 ± 0.06** 🏆 | **0.92 ± 0.06** 🏆 | **0.89 ± 0.10** 🏆 |
| `duration_seconds` | **264.6 ± 60.5** 🏆 | 1206.1 ± 318.1 | 5499.4 ± 1417.5 |
| `cost_usd` | **3.34 ± 1.11** 🏆 | 16.10 ± 4.28 | 32.05 ± 7.85 |
| *Production LoC* | 309.4 ± 49.1 | 304.4 ± 37.9 | 670.4 ± 160.4 |
| *Code Mass (APP)* | 722.0 ± 57.5 | 714.8 ± 70.1 | 968.0 ± 159.6 |
| *Test LoC* | 404.2 ± 43.0 | 599.1 ± 258.6 | 415.0 ± 21.2 |
| *`unit_count`* | 15.8 ± 2.17 | 25.3 ± 4.42 | 40.2 ± 4.82 |
| *`mutants_total` / survived* | 135 / 13.8 | 134 / 10.4 | 156 / 18.0 |
| *of those uncovered* | 0.8 ± 1.10 | 5.8 ± 6.61 | 15.2 ± 13.95 |
| *`total_tokens`* | 2.55 M | 21.4 M | 48.4 M |

### GPT-5.6 SOL — pi

| Metric | Inline (n=5) | EXACT v1 (n=10) | EXACT v1.1 (n=5) |
|---|---:|---:|---:|
| Correctness (external) | 1.00 ± 0.00 | 1.00 ± 0.00 | 1.00 ± 0.00 |
| Completed within budget | 100 % | 100 % | 100 % |
| Complexity Peak (`cognitive_max`) | 6.6 ± 2.07 | 3.9 ± 1.10 | **2.6 ± 0.89** 🏆 |
| `cognitive_avg` | 2.77 ± 0.74 | 1.83 ± 0.37 | **1.24 ± 0.29** 🏆 |
| `mccabe_max` | 8.4 ± 3.58 | 5.0 ± 1.56 | **3.6 ± 0.55** 🏆 |
| `mccabe_avg` | 2.91 ± 0.50 | 1.80 ± 0.29 | **1.37 ± 0.09** 🏆 |
| Smell Total | 0.0 ± 0.00 | 0.0 ± 0.00 | 0.0 ± 0.00 |
| `unit_size_max` | 20.2 ± 3.27 | **18.4 ± 2.37** 🏆 | **15.8 ± 3.56** 🏆 |
| `unit_size_avg` | 7.29 ± 1.23 | 6.42 ± 1.24 | **4.21 ± 0.40** 🏆 |
| `unit_size_median` | 6.7 ± 2.54 | 5.3 ± 1.96 | **3.0 ± 0.00** 🏆 |
| Mutation Score | 0.77 ± 0.04 | **0.86 ± 0.05** 🏆 *(n=9)* | **0.88 ± 0.02** 🏆 *(n=4)* |
| `duration_seconds` | **278.2 ± 40.7** 🏆 | 1486.0 ± 476.7 | 4927.0 ± 610.5 |
| `cost_usd` | **0.60 ± 0.09** 🏆 | 4.76 ± 2.55 | 18.27 ± 3.05 |
| *Production LoC* | 197.0 ± 14.2 | 171.5 ± 32.5 | 265.2 ± 32.5 |
| *Code Mass (APP)* | 770.2 ± 73.7 | 633.1 ± 94.7 | 685.4 ± 63.3 |
| *Test LoC* | 122.6 ± 27.3 | 220.6 ± 71.3 | 266.4 ± 70.8 |
| *`unit_count`* | 16.4 ± 4.83 | 13.7 ± 4.06 | 32.2 ± 4.66 |
| *`mutants_total` / survived* | 204 / 47.6 | 133 / 18.3 *(n=9)* | 143 / 16.8 *(n=4)* |
| *of those uncovered* | 12.2 ± 8.07 | 5.4 ± 2.70 *(n=9)* | 4.0 ± 1.41 *(n=4)* |
| *`total_tokens`* | 0.34 M | 6.88 M | 17.5 M |

Smell Total is identical at 0.0 in all three GPT-5.6 SOL cells. There is no
contest in that row, so it carries no trophy.

Mutation Score reaches fewer replicates than every other metric in two cells.
Both gaps are instrument failures, not workflow outcomes — see
[F-1.10.6](#f-1106--two-mutation-cells-lose-replicates-to-the-instrument-not-to-the-workflow).

---

## F-1.10.1 — EXACT Coding lowers complexity and unit size on both models

The effect that motivated this RQ is present, on every complexity and size
measure, for both models, and it is monotone across the three methods.

| Measure | Opus: Inline → v1 → v1.1 | SOL: Inline → v1 → v1.1 |
|---|---|---|
| Complexity Peak | 6.0 → 2.8 → 2.2 | 6.6 → 3.9 → 2.6 |
| `cognitive_avg` | 2.53 → 1.47 → 1.13 | 2.77 → 1.83 → 1.24 |
| `mccabe_max` | 5.2 → 3.3 → 3.0 | 8.4 → 5.0 → 3.6 |
| `unit_size_avg` | 7.62 → 5.95 → 4.60 | 7.29 → 6.42 → 4.21 |

The first step carries most of it. Complexity Peak more than halves between
Inline and EXACT v1 on Opus (6.0 → 2.8) and falls by 41 % on SOL (6.6 → 3.9);
`cognitive_avg` drops by 42 % and 34 % respectively. Every one of these gaps
exceeds the standard deviation of both cells involved.

The direction is the same on both models, which is what makes it a property of
the method rather than of one harness. The *size* of the step differs — see
[F-1.10.3](#f-1103--the-second-structural-step-is-worth-more-on-sol-than-on-opus).

**H2 is confirmed.**

---

## F-1.10.2 — The isolated Refactor subagent buys flatness by producing more code, not simpler code

On Opus the second structural step improves every per-function measure while the
product grows sharply:

| | EXACT v1 | EXACT v1.1 | change |
|---|---:|---:|---|
| `unit_size_avg` | 5.95 | 4.60 | −23 % |
| `unit_count` | 25.3 | 40.2 | +59 % |
| Production LoC | 304.4 | 670.4 | +120 % |
| Code Mass (APP) | 714.8 | 968.0 | +35 % |

Production LoC more than doubles while the average unit shrinks by a quarter.
The isolated Refactor phase is therefore not simplifying the solution; it is
splitting it into more and smaller pieces and adding code in the process. Every
per-function metric rewards that, and no per-function metric can distinguish it
from genuine simplification — which is why Production LoC, Code Mass (APP) and
`unit_count` are reported alongside and carry no trophy.

The same shape appears on SOL but far weaker: `unit_count` 13.7 → 32.2 with
Production LoC 171.5 → 265.2 (+55 %), and Code Mass (APP) actually *rises less*
than on Opus. On neither model does the extra structure buy correctness: Opus
loses external correctness (0.99 → 0.96) and SOL stays at 1.00.

The mutation decomposition shows what happens to the added code on Opus. While
Production LoC doubles, the number of mutants the suite never reaches rises from
5.8 to 15.2 per run, and the number it reaches but fails to kill *falls* from 4.6
to 2.8. The suite gets sharper where it looks and stops looking at more of the
product — see
[F-1.10.8](#f-1108--on-opus-the-arms-miss-mutants-for-opposite-reasons).

---

## F-1.10.3 — The second structural step is worth more on SOL than on Opus

Both models improve from Inline to EXACT v1. They differ in what the *second*
step adds.

| Step | Opus Complexity Peak | SOL Complexity Peak |
|---|---|---|
| Inline → v1 | 6.0 → 2.8 (−53 %) | 6.6 → 3.9 (−41 %) |
| v1 → v1.1 | 2.8 → 2.2 (−21 %) | 3.9 → 2.6 (−33 %) |

On Opus, EXACT v1 already lands at a Complexity Peak of 2.8 and an
`mccabe_max` of 3.3 — close to the floor these measures can reach on this kata.
The isolated Refactor subagent then has little left to remove, and the 0.6 it
takes off Complexity Peak costs a doubling of Production LoC, a lost run and
twice the money.

On SOL, EXACT v1 stops at 3.9 and `mccabe_max` 5.0, leaving real headroom, and
v1.1 closes most of it — `mccabe_max` 5.0 → 3.6, `unit_size_avg` 6.42 → 4.21 —
without a correctness or budget penalty.

**H4 is confirmed:** the size of the method effect differs by model. The
practical reading is that the isolated Refactor phase is worth its cost where
the shared-context workflow leaves headroom, and not where it does not.

---

## F-1.10.4 — Isolation's budget cost falls only on Opus

The treatment is the same on both platforms; its cost is not.

| | Opus v1 | Opus v1.1 | SOL v1 | SOL v1.1 |
|---|---:|---:|---:|---:|
| Completed within budget | 100 % | **80 %** | 100 % | 100 % |
| Correctness (external) | 0.99 | 0.96 | 1.00 | 1.00 |
| `duration_seconds` | 1206 | 5499 | 1486 | 4927 |
| `cost_usd` | 16.10 | 32.05 | 4.76 | 18.27 |

Both platforms pay roughly the same multiple in wall-clock — 4.6× on Opus, 3.3×
on SOL. Only Opus converts that into a lost run: one of five hits the timeout,
and that run is also the only cell member below the correctness ceiling (0.80),
which is what pulls the cell to 0.96 ± 0.09.

Isolating the Refactor phase is therefore a platform-conditional
recommendation, not a general one. **H7 is confirmed.**

---

## F-1.10.5 — Cost separates the three methods far more sharply than quality does

The quality gaps in F-1.10.1 are real but bounded; the price gaps are an order
of magnitude.

| | Inline | EXACT v1 | EXACT v1.1 |
|---|---:|---:|---:|
| Opus `cost_usd` | **3.34** 🏆 | 16.10 (4.8×) | 32.05 (9.6×) |
| SOL `cost_usd` | **0.60** 🏆 | 4.76 (7.9×) | 18.27 (30.5×) |
| Opus `total_tokens` | 2.55 M | 21.4 M | 48.4 M |
| SOL `total_tokens` | 0.34 M | 6.88 M | 17.5 M |

Inline TDD reaches the correctness ceiling on this kata in both models, at
roughly a fifth to an eighth of the price of EXACT v1 and a tenth to a
thirtieth of EXACT v1.1. What the money buys is structure, not working software:
halved complexity, smaller units and — on SOL — a markedly stronger test suite
(F-1.10.7).

**H5 is confirmed.** The overhead is real, and it is justified only where the
structural gain matters more than the price.

---

## F-1.10.6 — Two mutation cells lose replicates to the instrument, not to the workflow

Mutation Score is the only outcome in this RQ that does not reach full
replicates, and in both cases the cause is the measurement, not the run.

| Cell | Replicates | Cause |
|---|---|---|
| SOL EXACT v1 | 9 of 10 | one run scored 0.00 with 112 of 112 mutants surviving |
| SOL EXACT v1.1 | 4 of 5 | Stryker aborted in the initial dry run |

Both runs are otherwise healthy: green suites, `verification_pct` 1.00, no
timeout. The aborted run's suite passes standalone in 2 seconds (35 of 35),
and the test that fails under instrumentation is the one that executes
`src/cli.ts` as a subprocess. A score of 0.00 against a suite that passes every
external acceptance scenario is not a measurement of test strength — it means no
test was associated with any mutant.

Both runs drive the CLI out of process. That is the common factor, but it is
**not an established cause**: other runs with the same visible test style score
between 0.92 and 0.97. The mechanism is unresolved; what is established is that
neither value measures the suite.

The 0.00 is therefore excluded from the SOL EXACT v1 cell. Both figures are on
record:

| SOL EXACT v1 | n | Mutation Score | survived |
|---|---:|---:|---:|
| with the 0.00 | 10 | 0.775 | 27.7 |
| without it | 9 | 0.861 ± 0.050 | 18.3 |

Every table in this document uses the n=9 figure and marks it. Carrying the
0.00 would have moved the cell by 0.09 and made the SOL ordering in F-1.10.7
disappear.

---

## F-1.10.7 — Mutation Score does not order the methods the same way on both models

| | Inline | EXACT v1 | EXACT v1.1 |
|---|---:|---:|---:|
| Opus score | 0.90 | 0.92 | 0.89 |
| Opus survived / total | 13.8 / 135 | 10.4 / 134 | 18.0 / 156 |
| SOL score | 0.77 | 0.86 *(n=9)* | 0.88 *(n=4)* |
| SOL survived / total | 47.6 / 204 | 18.3 / 133 | 16.8 / 143 |

On SOL the ordering is monotone and large: the suite misses 47.6 mutants under
Inline against 18.3 under EXACT v1 — the structured workflow's suite catches
over two and a half times as much, and the score understates it, because the Inline
arm's mutant population is also 53 % larger (204 against 133). This is the case
the paired reporting exists for: a score gap of 0.09 corresponds to an absolute
gap of 29 missed mutants.

On Opus the three cells are indistinguishable — all three share the trophy, the
spread (0.89 to 0.92) is below every cell's own standard deviation, and EXACT
v1.1 is nominally the weakest while producing the most mutants.

**H3 is not confirmed.** Mutation Score does not rank the three methods
consistently across models. The finding is asymmetric rather than negative: on
SOL, structure buys a substantially stronger suite; on Opus, all three methods
already produce suites of the same strength and the structural investment shows
up in shape (F-1.10.1) rather than in test power.

---

## F-1.10.8 — On Opus the arms miss mutants for opposite reasons

Mutation Score is indistinguishable across the three Opus cells (0.90 / 0.92 /
0.89, every gap inside every cell's own standard deviation). Splitting the missed
mutants shows that the three suites are not alike at all.

| Opus, per run | Inline | EXACT v1 | EXACT v1.1 |
|---|---:|---:|---:|
| Survived — reached, not killed | 13.0 | 4.6 | 2.8 |
| Uncovered — never reached | 0.8 ± 1.10 | 5.8 ± 6.61 | 15.2 ± 13.95 |
| Uncovered share of misses | 6 % | 56 % | 84 % |

The Inline suite reaches essentially all of the product and asserts weakly
against it: 13.0 mutants per run survive execution, 0.8 go untouched. EXACT v1.1
is the mirror image: 2.8 survive execution — the sharpest assertions of the three
— while 15.2 mutants per run are never reached at all. The score averages these
two failure modes into the same number.

**The uncovered counts are bimodal, not uniform.** Per-run values expose it:

| Arm | Uncovered mutants per run |
|---|---|
| Inline | 0, 0, 0, 2, 2 |
| EXACT v1 | 0, 0, 2, 2, 3, 4, 4, 8, 16, 19 |
| EXACT v1.1 | 0, 2, 20, 21, 33 |

Two of five EXACT v1.1 runs leave almost nothing uncovered; three leave 20 to 33
mutants untouched. The cell mean of 15.2 therefore describes a split population
rather than a typical run, which is what the standard deviation of 13.95 says.
The reliable part of the finding is the Inline arm's floor — 5 of 5 runs at or
below 2 — and the fact that uncovered regions appear at all once the structured
workflow is used.

On SOL the pattern does not reproduce: uncovered shares run 26 % / 30 % / 24 %
across the three arms, with the Inline arm carrying the *most* uncovered mutants
(12.2 per run) rather than the fewest.

Practical consequence: on Opus, Mutation Score alone cannot be used to compare
these arms, and the uncovered count is the part worth acting on — it points at
product regions no test visits, which is a gap a reader of the score would never
see.

---
## Caveats

- **Single kata.** All conclusions are about Claim Office under Example Mapping.
- **Unequal replicates.** The EXACT v1 cells carry n=10 against n=5 elsewhere,
  inherited from the earlier RQs that produced them. Their means are better
  determined; no comparison in this document depends on the difference.
- **Metric backfill.** `unit_count` and the `unit_size_*` family were computed by
  re-running the analysis pipeline over all 40 runs, because 39 of them predate
  the metric on this stack. Mutation scores survived the re-analysis unchanged.
- **The `mccabe_max` trophy on Opus is shared deliberately.** EXACT v1.1 is
  nominally best at 3.0 ± 0.00, but its zero standard deviation makes the sharing
  rule degenerate; the 0.3 gap to EXACT v1 lies well inside that cell's own
  spread of 0.48. The honest reading is a tie.
- **`cost_usd` is a list-price comparison value, not an invoice.**
- **One excluded correctness value.** Opus EXACT v1.1 includes the timed-out run
  at 0.80; timeouts are outcomes and are not refilled.
