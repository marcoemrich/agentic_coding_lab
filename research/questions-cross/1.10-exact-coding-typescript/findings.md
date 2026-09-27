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

**Data basis — pooled cells.** Aggregation is query-based, so every run in the
pool with the same workflow, model and kata counts. Four cells pool more than
one batch:

| Cell | Runs | Batches |
|---|---:|---|
| Opus Inline | 10 | 5 from this RQ (Claude Code 2.1.267) + 5 from RQ-opus55-current-workflow (2.1.280) |
| Opus EXACT v1 | 15 | 10 from the earlier Opus RQs (2.1.267) + 5 from RQ-opus55-current-workflow (2.1.280) |
| Opus EXACT v1.1 | 10 | 5 from this RQ (2.1.267) + 5 from RQ-opus55-current-workflow (2.1.280) |
| SOL EXACT v1 | 15 | 10 from the earlier SOL RQs + 5 from the GPT-5.6 reference arm of RQ-gpt6-sol-vs-gpt56-sol (all pi 0.81.1) |

The other two SOL cells hold one batch of five each. The Opus cells therefore mix
two Claude Code versions; see Caveats for where the two halves differ.

**Correctness guard — passed.** All six cells clear the 0.90 gate, so every
quality row is eligible. Correctness (internal) is 100 % in all six. Correctness
(external) is 1.00 ± 0.00 in four cells. Opus EXACT v1 reaches 0.99 ± 0.02 (two
of 15 runs at 0.93) and Opus EXACT v1.1 0.97 ± 0.06 — one timed-out run at 0.80
and two runs at 0.93. That cell is the only one that lost a run to a timeout.

### Opus 5 — native Claude Code

| Metric | Inline (n=10) | EXACT v1 (n=15) | EXACT v1.1 (n=10) |
|---|---:|---:|---:|
| Correctness (external) | 1.00 ± 0.00 | 0.99 ± 0.02 | 0.97 ± 0.06 |
| Completed within budget | 100 % | 100 % | 90 % |
| Complexity Peak (`cognitive_max`) | 5.8 ± 1.75 | **2.7 ± 0.88** 🏆 | **2.6 ± 1.07** 🏆 |
| `cognitive_avg` | 2.46 ± 0.46 | 1.44 ± 0.27 | **1.22 ± 0.18** 🏆 |
| `mccabe_max` | 5.4 ± 0.97 | **3.3 ± 0.46** 🏆 | **3.2 ± 0.63** 🏆 |
| `mccabe_avg` | 2.06 ± 0.20 | 1.58 ± 0.15 | **1.34 ± 0.07** 🏆 |
| Smell Total | 0.1 ± 0.32 | **0.0 ± 0.00** 🏆 | **0.0 ± 0.00** 🏆 |
| `unit_size_max` | 22.8 ± 4.34 | 18.5 ± 5.13 | **15.0 ± 2.45** 🏆 |
| `unit_size_avg` | 8.12 ± 1.14 | 6.00 ± 1.00 | **4.74 ± 0.37** 🏆 |
| `unit_size_median` | 5.55 ± 1.07 | 4.80 ± 1.16 | **3.35 ± 0.63** 🏆 |
| Mutation Score | **0.90 ± 0.06** 🏆 | **0.91 ± 0.06** 🏆 | **0.90 ± 0.09** 🏆 |
| `duration_seconds` | **260.0 ± 49.8** 🏆 | 1103.0 ± 311.0 | 4624.0 ± 1422.5 |
| `cost_usd` | **3.14 ± 0.86** 🏆 | 14.68 ± 4.34 | 27.54 ± 7.44 |
| *Production LoC* | 305.0 ± 43.7 | 300.5 ± 37.9 | 581.3 ± 153.6 |
| *Code Mass (APP)* | 717.8 ± 67.8 | 706.7 ± 62.1 | 921.1 ± 137.6 |
| *Test LoC* | 411.1 ± 46.4 | 597.1 ± 249.0 | 423.6 ± 64.6 |
| *`unit_count`* | 14.8 ± 3.05 | 25.2 ± 4.38 | 38.4 ± 4.62 |
| *`mutants_total` / survived* | 135 / 13.7 | 134 / 12.1 | 154 / 15.4 |
| *of those uncovered* | 1.0 ± 1.94 | 7.3 ± 6.73 | 10.7 ± 12.59 |
| *`total_tokens`* | 2.69 M | 19.2 M | 40.9 M |

### GPT-5.6 SOL — pi

| Metric | Inline (n=5) | EXACT v1 (n=15) | EXACT v1.1 (n=5) |
|---|---:|---:|---:|
| Correctness (external) | 1.00 ± 0.00 | 1.00 ± 0.00 | 1.00 ± 0.00 |
| Completed within budget | 100 % | 100 % | 100 % |
| Complexity Peak (`cognitive_max`) | 6.6 ± 2.07 | 4.1 ± 1.22 | **2.6 ± 0.89** 🏆 |
| `cognitive_avg` | 2.77 ± 0.74 | 1.86 ± 0.35 | **1.24 ± 0.29** 🏆 |
| `mccabe_max` | 8.4 ± 3.58 | 4.7 ± 1.44 | **3.6 ± 0.55** 🏆 |
| `mccabe_avg` | 2.91 ± 0.50 | 1.74 ± 0.27 | **1.37 ± 0.09** 🏆 |
| Smell Total | 0.0 ± 0.00 | 0.0 ± 0.00 | 0.0 ± 0.00 |
| `unit_size_max` | 20.2 ± 3.27 | **17.8 ± 2.93** 🏆 | **15.8 ± 3.56** 🏆 |
| `unit_size_avg` | 7.29 ± 1.23 | 6.14 ± 1.09 | **4.21 ± 0.40** 🏆 |
| `unit_size_median` | 6.7 ± 2.54 | 5.0 ± 1.66 | **3.0 ± 0.00** 🏆 |
| Mutation Score | 0.77 ± 0.04 | **0.86 ± 0.04** 🏆 *(n=14)* | **0.88 ± 0.02** 🏆 *(n=4)* |
| `duration_seconds` | **278.2 ± 40.7** 🏆 | 1573.9 ± 495.0 | 4927.0 ± 610.5 |
| `cost_usd` | **0.60 ± 0.09** 🏆 | 4.67 ± 2.62 | 18.27 ± 3.05 |
| *Production LoC* | 197.0 ± 14.2 | 169.0 ± 34.2 | 265.2 ± 32.5 |
| *Code Mass (APP)* | 770.2 ± 73.7 | 616.5 ± 87.1 | 685.4 ± 63.3 |
| *Test LoC* | 122.6 ± 27.3 | 217.6 ± 78.2 | 266.4 ± 70.8 |
| *`unit_count`* | 16.4 ± 4.83 | 14.6 ± 4.50 | 32.2 ± 4.66 |
| *`mutants_total` / survived* | 204 / 47.6 | 129 / 17.6 *(n=14)* | 143 / 16.8 *(n=4)* |
| *of those uncovered* | 12.2 ± 8.07 | 4.9 ± 2.34 *(n=14)* | 4.0 ± 1.41 *(n=4)* |
| *`total_tokens`* | 0.34 M | 6.72 M | 17.5 M |

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
| Complexity Peak | 5.8 → 2.7 → 2.6 | 6.6 → 4.1 → 2.6 |
| `cognitive_avg` | 2.46 → 1.44 → 1.22 | 2.77 → 1.86 → 1.24 |
| `mccabe_max` | 5.4 → 3.3 → 3.2 | 8.4 → 4.7 → 3.6 |
| `unit_size_avg` | 8.12 → 6.00 → 4.74 | 7.29 → 6.14 → 4.21 |

The first step carries most of it. Complexity Peak more than halves between
Inline and EXACT v1 on Opus (5.8 → 2.7) and falls by 38 % on SOL (6.6 → 4.1);
`cognitive_avg` drops by 42 % and 33 % respectively. Every one of these gaps
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
| `unit_size_avg` | 6.00 | 4.74 | −21 % |
| `unit_count` | 25.2 | 38.4 | +52 % |
| Production LoC | 300.5 | 581.3 | +93 % |
| Code Mass (APP) | 706.7 | 921.1 | +30 % |

Production LoC nearly doubles while the average unit shrinks by a fifth.
The isolated Refactor phase is therefore not simplifying the solution; it is
splitting it into more and smaller pieces and adding code in the process. Every
per-function metric rewards that, and no per-function metric can distinguish it
from genuine simplification — which is why Production LoC, Code Mass (APP) and
`unit_count` are reported alongside and carry no trophy.

The same shape appears on SOL but weaker in code volume: `unit_count` 14.6 → 32.2
with Production LoC 169.0 → 265.2 (+57 %), and Code Mass (APP) rises by 11 %
against 30 % on Opus. On neither model does the extra structure buy correctness:
Opus loses external correctness (0.99 → 0.97) and SOL stays at 1.00.

The mutation decomposition shows what happens to the added code on Opus. While
Production LoC nearly doubles, the number of mutants the suite never reaches
rises from 7.3 to 10.7 per run, and the number it reaches but fails to kill stays
flat (4.8 against 4.7). The suite keeps its sharpness where it looks and stops
looking at more of the product — see
[F-1.10.8](#f-1108--on-opus-the-arms-miss-mutants-for-opposite-reasons).

---

## F-1.10.3 — The second structural step is worth more on SOL than on Opus

Both models improve from Inline to EXACT v1. They differ in what the *second*
step adds.

| Step | Opus Complexity Peak | SOL Complexity Peak |
|---|---|---|
| Inline → v1 | 5.8 → 2.7 (−53 %) | 6.6 → 4.1 (−38 %) |
| v1 → v1.1 | 2.7 → 2.6 (−5 %) | 4.1 → 2.6 (−36 %) |

On Opus, EXACT v1 already lands at a Complexity Peak of 2.7 and an
`mccabe_max` of 3.3 — close to the floor these measures can reach on this kata.
The isolated Refactor subagent then has almost nothing left to remove: the 0.1
it takes off Complexity Peak sits inside both cells' standard deviations and
costs a near-doubling of Production LoC, one timeout in ten and 1.9× the money.

On SOL, EXACT v1 stops at 4.1 and `mccabe_max` 4.7, leaving real headroom, and
v1.1 closes most of it — `mccabe_max` 4.7 → 3.6, `unit_size_avg` 6.14 → 4.21 —
without a correctness or budget penalty.

**H4 is confirmed:** the size of the method effect differs by model. The
practical reading is that the isolated Refactor phase is worth its cost where
the shared-context workflow leaves headroom, and not where it does not.

---

## F-1.10.4 — Isolation's budget cost falls only on Opus

The treatment is the same on both platforms; its cost is not.

| | Opus v1 | Opus v1.1 | SOL v1 | SOL v1.1 |
|---|---:|---:|---:|---:|
| Completed within budget | 100 % | **90 %** | 100 % | 100 % |
| Correctness (external) | 0.99 | 0.97 | 1.00 | 1.00 |
| `duration_seconds` | 1103 | 4624 | 1574 | 4927 |
| `cost_usd` | 14.68 | 27.54 | 4.67 | 18.27 |

Both platforms pay a similar multiple in wall-clock — 4.2× on Opus, 3.1× on SOL.
Only Opus converts that into a lost run: one of ten hits the timeout and ends at
0.80, the lowest correctness value in the RQ. Two further Opus v1.1 runs miss one
scenario each (0.93), which together pull the cell to 0.97 ± 0.06.

Isolating the Refactor phase is therefore a platform-conditional
recommendation, not a general one. **H7 is confirmed.**

---

## F-1.10.5 — Cost separates the three methods far more sharply than quality does

The quality gaps in F-1.10.1 are real but bounded; the price gaps are an order
of magnitude.

| | Inline | EXACT v1 | EXACT v1.1 |
|---|---:|---:|---:|
| Opus `cost_usd` | **3.14** 🏆 | 14.68 (4.7×) | 27.54 (8.8×) |
| SOL `cost_usd` | **0.60** 🏆 | 4.67 (7.7×) | 18.27 (30.3×) |
| Opus `total_tokens` | 2.69 M | 19.2 M | 40.9 M |
| SOL `total_tokens` | 0.34 M | 6.72 M | 17.5 M |

Inline TDD reaches the correctness ceiling on this kata in both models, at
roughly a fifth to an eighth of the price of EXACT v1 and a ninth to a
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
| SOL EXACT v1 | 14 of 15 | one run scored 0.00 with 112 of 112 mutants surviving |
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
| with the 0.00 | 15 | 0.806 ± 0.227 | 23.9 |
| without it | 14 | 0.863 ± 0.045 | 17.6 |

Every table in this document uses the n=14 figure and marks it. Carrying the
0.00 would move the cell by 0.06 and inflate its standard deviation fivefold,
burying the SOL ordering in F-1.10.7 in instrument noise.

---

## F-1.10.7 — Mutation Score does not order the methods the same way on both models

| | Inline | EXACT v1 | EXACT v1.1 |
|---|---:|---:|---:|
| Opus score | 0.90 | 0.91 | 0.90 |
| Opus survived / total | 13.7 / 135 | 12.1 / 134 | 15.4 / 154 |
| SOL score | 0.77 | 0.86 *(n=14)* | 0.88 *(n=4)* |
| SOL survived / total | 47.6 / 204 | 17.6 / 129 | 16.8 / 143 |

On SOL the ordering is monotone and large: the suite misses 47.6 mutants under
Inline against 17.6 under EXACT v1 — the Inline suite lets through 2.7 times as
many, and the score understates it, because the Inline arm's mutant population is
also 58 % larger (204 against 129). This is the case the paired reporting exists
for: a score gap of 0.10 corresponds to an absolute gap of 30 missed mutants.

On Opus the three cells are indistinguishable — all three share the trophy, the
spread (0.90 to 0.91) is below every cell's own standard deviation, and EXACT
v1.1 produces the most mutants without a lower score.

**H3 is not confirmed.** Mutation Score does not rank the three methods
consistently across models. The finding is asymmetric rather than negative: on
SOL, structure buys a substantially stronger suite; on Opus, all three methods
already produce suites of the same strength and the structural investment shows
up in shape (F-1.10.1) rather than in test power.

---

## F-1.10.8 — On Opus the arms miss mutants for opposite reasons

Mutation Score is indistinguishable across the three Opus cells (0.90 / 0.91 /
0.90, every gap inside every cell's own standard deviation). Splitting the missed
mutants shows that the three suites are not alike at all.

| Opus, per run | Inline | EXACT v1 | EXACT v1.1 |
|---|---:|---:|---:|
| Survived — reached, not killed | 12.7 | 4.8 | 4.7 |
| Uncovered — never reached | 1.0 ± 1.94 | 7.3 ± 6.73 | 10.7 ± 12.59 |
| Uncovered share of misses | 7 % | 60 % | 69 % |

The Inline suite reaches essentially all of the product and asserts weakly
against it: 12.7 mutants per run survive execution, 1.0 go untouched. Both EXACT
arms are the mirror image: under five survive execution — assertions more than
twice as sharp — while 7.3 and 10.7 mutants per run are never reached at all. The
score averages these two failure modes into the same number.

**The uncovered counts are bimodal, not uniform.** Per-run values expose it:

| Arm | Uncovered mutants per run |
|---|---|
| Inline | 0, 0, 0, 0, 0, 0, 0, 2, 2, 6 |
| EXACT v1 | 0, 0, 2, 2, 2, 3, 4, 4, 8, 8, 8, 16, 17, 17, 19 |
| EXACT v1.1 | 0, 0, 2, 2, 2, 2, 20, 21, 25, 33 |

Six of ten EXACT v1.1 runs leave at most 2 mutants uncovered; four leave 20 to 33
untouched. The cell mean of 10.7 therefore describes a split population rather
than a typical run, which is what the standard deviation of 12.59 says. EXACT v1
spreads more evenly, with four of 15 runs at 16 or more. The reliable part of the
finding is the Inline arm's floor — 9 of 10 runs at or below 2, the tenth at 6 —
and the fact that large uncovered regions appear only once the structured
workflow is used.

On SOL the pattern does not reproduce: uncovered shares run 26 % / 28 % / 24 %
across the three arms, with the Inline arm carrying the *most* uncovered mutants
(12.2 per run) rather than the fewest.

Practical consequence: on Opus, Mutation Score alone cannot be used to compare
these arms, and the uncovered count is the part worth acting on — it points at
product regions no test visits, which is a gap a reader of the score would never
see.

---
## Caveats

- **Single kata.** All conclusions are about Claim Office under Example Mapping.
- **Unequal replicates.** Cells hold 5 to 15 runs because they pool batches from
  sister RQs (see "Data basis"). The larger cells' means are better determined;
  no comparison in this document depends on the difference.
- **Two Claude Code versions in the Opus cells.** Each Opus cell is half 2.1.267
  and half 2.1.280 (a third in EXACT v1). Inline looks alike across the two
  versions. The EXACT v1 third on 2.1.280 runs faster (897 s against 1206 s) and
  leaves more mutants uncovered (10.4 against 5.8). EXACT v1.1 differs most: the 2.1.280 half writes less Production
  LoC (492 against 670), runs faster (3749 s against 5499 s) and leaves fewer
  mutants uncovered (6.2 against 15.2), but reaches a higher Complexity Peak
  (3.0 against 2.2). Five runs per half cannot separate a CLI effect from
  replicate noise; the pooled Opus v1.1 means blend both.
- **Metric backfill.** `unit_count` and the `unit_size_*` family are present for
  all 60 runs; for runs that predate the metric on this stack they were computed
  by re-running the analysis pipeline. Mutation scores survived the re-analysis
  unchanged.
- **`cost_usd` is a list-price comparison value, not an invoice.**
- **No excluded correctness value.** Opus EXACT v1.1 includes the timed-out run
  at 0.80; timeouts are outcomes and are not refilled.
