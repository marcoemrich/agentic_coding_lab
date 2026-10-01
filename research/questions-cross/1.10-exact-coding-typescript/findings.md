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
| Opus Inline | 10 | 5 from this RQ (Claude Code 2.1.267) + 5 from the RQ-opus55-current-workflow refill (2.1.280) |
| Opus EXACT v1 | 15 | 10 from the earlier Opus RQs (2.1.267) + 5 from the RQ-opus55-current-workflow refill (2.1.280) |
| Opus EXACT v1.1 | 10 | 5 from this RQ (2.1.267) + 5 from the RQ-opus55-current-workflow refill (2.1.280) |
| SOL EXACT v1 | 15 | 10 from the earlier SOL RQs + 5 from the GPT-5.6 reference arm of RQ-gpt6-sol-vs-gpt56-sol (all pi 0.81.1) |

The other two SOL cells hold one batch of five each. The Opus cells therefore mix
two Claude Code versions; see Caveats for where the two halves differ.

**TDD discipline is not an outcome of this RQ and cannot become one.** The six
marker- and transcript-derived columns it used to declare were retired in 2026-10;
the phase chain that replaced them exists only for runs made after the stack
reporter landed, which covers the refilled Opus halves and none of the
gpt-5-6-sol-codex cells. Neither family of columns spans this RQ's central
comparison, so no discipline claim is made here.

**Correctness guard — one cell fails it.** Five of six cells reach
`verification_pct` ≥ 0.99 and are eligible for every quality and cost trophy.
**Opus EXACT v1.1 is at 0.87 ± 0.31 and is excluded**: three of its ten runs hit
the two-hour budget ceiling, and one of those delivered nothing. Its values are
shown in parentheses without trophies throughout — they describe seven finished
runs plus three that stopped early, not a result comparable with the other cells.
Correctness (internal) is 100 % in all six cells.

### Opus 5 — native Claude Code

| Metric | Inline (n=10) | EXACT v1 (n=15) | EXACT v1.1 (n=10) |
|---|---:|---:|---:|
| Correctness (external) | **1.00 ± 0.00** 🏆 | **1.00 ± 0.02** 🏆 | 0.87 ± 0.31 |
| Completed within budget | **100 %** 🏆 | **100 %** 🏆 | 70 % |
| `cognitive_max` | 6.10 ± 1.91 | **3.07 ± 0.96** 🏆 | (2.50 ± 0.71) |
| `cognitive_avg` | 2.46 ± 0.37 | **1.48 ± 0.24** 🏆 | (1.25 ± 0.14) |
| `mccabe_max` | 5.30 ± 1.16 | **3.33 ± 0.49** 🏆 | (3.00 ± 0.00) |
| `mccabe_avg` | 2.02 ± 0.18 | **1.57 ± 0.11** 🏆 | (1.39 ± 0.14) |
| Smell Total | 0.10 ± 0.32 | **0.00 ± 0.00** 🏆 | (0.00 ± 0.00) |
| `unit_size_max` | 24.30 ± 4.14 | **17.93 ± 4.93** 🏆 | (13.90 ± 2.92) |
| `unit_size_avg` | 7.80 ± 0.78 | **5.82 ± 0.78** 🏆 | (4.67 ± 0.38) |
| `unit_size_median` | **5.45 ± 0.96** 🏆 | **4.63 ± 1.16** 🏆 | (3.30 ± 0.42) |
| Mutation Score | **0.93 ± 0.05** 🏆 | **0.94 ± 0.05** 🏆 | (0.91 ± 0.08) |
| `duration_seconds` | **298.40 ± 68.09** 🏆 | 1234.40 ± 267.31 | (5483.70 ± 1589.67) |
| `cost_usd` | **3.47 ± 0.85** 🏆 | 16.38 ± 3.65 | (66.35 ± 21.55) |
| *Production LoC* | 293.90 ± 41.20 | 308.27 ± 36.23 | 558.70 ± 184.85 |
| *Code Mass (APP)* | 721.10 ± 43.97 | 712.67 ± 70.77 | 873.90 ± 189.30 |
| *Test LoC* | 424.90 ± 62.45 | 630.60 ± 232.13 | 411.10 ± 86.12 |
| *`unit_count`* | 16.20 ± 1.62 | 25.87 ± 4.03 | 35.40 ± 9.08 |
| *`mutants_total` / survived* | 133.30 / 9.80 | 135.20 / 8.40 | 147.00 / 14.50 |
| *of those uncovered* | 1.00 ± 1.33 | 4.27 ± 5.79 | 10.00 ± 11.99 |
| *`total_tokens`* | 3.05 M | 21.77 M | 71.42 M |

`unit_size_median` carries two trophies: 5.45 ± 0.96 and 4.63 ± 1.16 overlap, so
that row reads as no effect between the two eligible cells. Mutation Score
likewise — 0.93 and 0.94 are indistinguishable.

### GPT-5.6 SOL — pi

| Metric | Inline (n=5) | EXACT v1 (n=15) | EXACT v1.1 (n=5) |
|---|---:|---:|---:|
| Correctness (external) | **1.00 ± 0.00** 🏆 | **1.00 ± 0.00** 🏆 | **1.00 ± 0.00** 🏆 |
| Completed within budget | **100 %** 🏆 | **100 %** 🏆 | **100 %** 🏆 |
| `cognitive_max` | 6.60 ± 2.07 | 4.07 ± 1.22 | **2.60 ± 0.89** 🏆 |
| `cognitive_avg` | 2.77 ± 0.74 | 1.86 ± 0.35 | **1.24 ± 0.29** 🏆 |
| `mccabe_max` | 8.40 ± 3.58 | 4.73 ± 1.44 | **3.60 ± 0.55** 🏆 |
| `mccabe_avg` | 2.91 ± 0.50 | 1.74 ± 0.27 | **1.37 ± 0.09** 🏆 |
| Smell Total | 0.00 ± 0.00 | 0.00 ± 0.00 | 0.00 ± 0.00 |
| `unit_size_max` | 20.20 ± 3.27 | **17.80 ± 2.93** 🏆 | **15.80 ± 3.56** 🏆 |
| `unit_size_avg` | 7.29 ± 1.23 | 6.14 ± 1.09 | **4.21 ± 0.40** 🏆 |
| `unit_size_median` | 6.70 ± 2.54 | 5.00 ± 1.66 | **3.00 ± 0.00** 🏆 |
| Mutation Score | 0.77 ± 0.04 | **0.863 ± 0.045** 🏆 *(n=14)* | **0.88 ± 0.02** 🏆 *(n=4)* |
| `duration_seconds` | **278.20 ± 40.71** 🏆 | 1573.93 ± 495.01 | 4927.00 ± 610.52 |
| `cost_usd` | **0.60 ± 0.09** 🏆 | 4.67 ± 2.62 | 18.27 ± 3.05 |
| *Production LoC* | 197.00 ± 14.23 | 169.00 ± 34.15 | 265.20 ± 32.51 |
| *Code Mass (APP)* | 770.20 ± 73.72 | 616.47 ± 87.10 | 685.40 ± 63.25 |
| *Test LoC* | 122.60 ± 27.31 | 217.60 ± 78.21 | 266.40 ± 70.77 |
| *`unit_count`* | 16.40 ± 4.83 | 14.60 ± 4.50 | 32.20 ± 4.66 |
| *`mutants_total` / survived* | 204.00 / 47.60 | 128.00 / 17.6 *(n=14)* | 143.00 / 16.8 *(n=4)* |
| *of those uncovered* | 12.20 ± 8.07 | 4.9 *(n=14)* | 4.00 ± 1.41 *(n=4)* |
| *`total_tokens`* | 0.34 M | 6.72 M | 17.52 M |

Smell Total is identical at 0.00 in all three GPT-5.6 SOL cells. There is no
contest in that row, so it carries no trophy.

Mutation Score reaches fewer replicates than every other metric in two SOL cells.
Both gaps are instrument failures, not workflow outcomes — see
[F-1.10.6](#f-1106--two-mutation-cells-lose-replicates-to-the-instrument-not-to-the-workflow).

---

## F-1.10.1 — EXACT Coding lowers complexity and unit size on both models

The effect that motivated this RQ is present, on every complexity and size
measure, for both models, and it is monotone across the three methods.

| Measure | Opus: Inline → v1 → v1.1 | SOL: Inline → v1 → v1.1 |
|---|---|---|
| `cognitive_max` | 6.10 → 3.07 → 2.50 | 6.60 → 4.07 → 2.60 |
| `cognitive_avg` | 2.46 → 1.48 → 1.25 | 2.77 → 1.86 → 1.24 |
| `mccabe_max` | 5.30 → 3.33 → 3.00 | 8.40 → 4.73 → 3.60 |
| `unit_size_avg` | 7.80 → 5.82 → 4.67 | 7.29 → 6.14 → 4.21 |

The first step carries most of it. `cognitive_max` halves between Inline and
EXACT v1 on Opus (6.10 → 3.07) and falls by 38 % on SOL (6.60 → 4.07);
`cognitive_avg` drops by 40 % and 33 % respectively. Every one of these gaps
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
| `unit_size_avg` | 5.82 | 4.67 | −20 % |
| `unit_count` | 25.87 | 35.40 | +37 % |
| Production LoC | 308.27 | 558.70 | +81 % |
| Code Mass (APP) | 712.67 | 873.90 | +23 % |

Production LoC rises by four fifths while the average unit shrinks by a fifth.
The isolated Refactor phase is therefore not simplifying the solution; it is
splitting it into more and smaller pieces and adding code in the process. Every
per-function metric rewards that, and no per-function metric can distinguish it
from genuine simplification — which is why Production LoC, Code Mass (APP) and
`unit_count` are reported alongside and carry no trophy.

The same shape appears on SOL but weaker in code volume: `unit_count` 14.60 →
32.20 with Production LoC 169.00 → 265.20 (+57 %), and Code Mass (APP) rises by
11 % against 23 % on Opus. On neither model does the extra structure buy
correctness: Opus loses it badly (1.00 → 0.87) and SOL stays at 1.00.

The mutation decomposition shows what happens to the added code on Opus. While
Production LoC rises by 81 %, the number of mutants the suite never reaches rises
from 4.27 to 10.00 per run, and the number it reaches but fails to kill stays
flat (4.13 against 4.50). The suite keeps its sharpness where it looks and stops
looking at more of the product — see
[F-1.10.8](#f-1108--on-opus-the-arms-miss-mutants-for-opposite-reasons).

---

## F-1.10.3 — The second structural step is worth more on SOL than on Opus

Both models improve from Inline to EXACT v1. They differ in what the *second*
step adds.

| Step | Opus `cognitive_max` | SOL `cognitive_max` |
|---|---|---|
| Inline → v1 | 6.10 → 3.07 (−50 %) | 6.60 → 4.07 (−38 %) |
| v1 → v1.1 | 3.07 → 2.50 (−19 %) | 4.07 → 2.60 (−36 %) |

On Opus, EXACT v1 already lands at a `cognitive_max` of 3.07 and an `mccabe_max`
of 3.33 — close to the floor these measures can reach on this kata. The isolated
Refactor subagent then has little left to remove: the 0.57 it takes off
`cognitive_max` sits inside both cells' standard deviations and costs an 81 %
increase in Production LoC, three budget failures in ten runs and 4.1× the money.

On SOL, EXACT v1 stops at 4.07 and `mccabe_max` 4.73, leaving real headroom, and
v1.1 closes most of it — `mccabe_max` 4.73 → 3.60, `unit_size_avg` 6.14 → 4.21 —
without a correctness or budget penalty.

**H4 is confirmed:** the size of the method effect differs by model. The
practical reading is that the isolated Refactor phase is worth its cost where
the shared-context workflow leaves headroom, and not where it does not.

---

## F-1.10.4 — Isolation's budget cost falls only on Opus

The treatment is the same on both platforms; its cost is not.

| | Opus v1 | Opus v1.1 | SOL v1 | SOL v1.1 |
|---|---:|---:|---:|---:|
| Completed within budget | 100 % | **70 %** | 100 % | 100 % |
| Correctness (external) | 1.00 ± 0.02 | **0.87 ± 0.31** | 1.00 ± 0.00 | 1.00 ± 0.00 |
| `duration_seconds` | 1234 | 5484 | 1574 | 4927 |
| `cost_usd` | 16.38 | 66.35 | 4.67 | 18.27 |

Both platforms pay a similar multiple for the isolation — 4.4× wallclock and
4.1× price on Opus, 3.1× and 3.9× on SOL. In absolute terms the gap is wide:
$66.35 against $18.27.

Only Opus converts that into lost runs. **Three of its ten v1.1 runs hit the
two-hour ceiling**, one of them ending at `verification_pct` 0 with no suite
invocation at all, which is what drags the cell to 0.87 ± 0.31 and disqualifies
it from every quality trophy in the Opus table. Two further runs miss one
scenario each. The SOL arm finishes 5/5 within budget at a comparable wallclock
multiple.

Isolating the Refactor phase is therefore a platform-conditional recommendation,
not a general one, and on Opus it is at the edge of what the budget allows.
**H7 is confirmed.**

---

## F-1.10.5 — Cost separates the three methods far more sharply than quality does

The quality gaps in F-1.10.1 are real but bounded; the price gaps are an order
of magnitude.

| | Inline | EXACT v1 | EXACT v1.1 |
|---|---:|---:|---:|
| Opus `cost_usd` | **3.47** 🏆 | 16.38 (4.7×) | 66.35 (19.1×) |
| SOL `cost_usd` | **0.60** 🏆 | 4.67 (7.8×) | 18.27 (30.5×) |
| Opus `total_tokens` | 3.05 M | 21.77 M | 71.42 M |
| SOL `total_tokens` | 0.34 M | 6.72 M | 17.52 M |

Inline TDD reaches the correctness ceiling on this kata in both models, at
roughly a fifth to an eighth of the price of EXACT v1 and a twentieth to a
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
| SOL EXACT v1 | 14 of 15 | one run scored 0.00 with every mutant surviving |
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

Every table in this document uses the n=14 figure and marks it; `summary.md`
reports the unfiltered n=15 value, because the aggregation applies no exclusion.
Carrying the 0.00 would move the cell by 0.06 and inflate its standard deviation
fivefold, burying the SOL ordering in F-1.10.7 in instrument noise.

---

## F-1.10.7 — Mutation Score does not order the methods the same way on both models

| | Inline | EXACT v1 | EXACT v1.1 |
|---|---:|---:|---:|
| Opus score | 0.93 | 0.94 | 0.91 |
| Opus survived / total | 9.80 / 133.30 | 8.40 / 135.20 | 14.50 / 147.00 |
| SOL score | 0.77 | 0.863 *(n=14)* | 0.88 *(n=4)* |
| SOL survived / total | 47.60 / 204.00 | 17.6 / 128.00 *(n=14)* | 16.8 / 143.00 *(n=4)* |

On SOL the ordering is monotone and large: the suite misses 47.60 mutants under
Inline against 17.6 under EXACT v1 — the Inline arm lets through 2.7 times as
many, and the score understates it, because that arm's mutant population is also
59 % larger (204.00 against 128.00). This is the case the paired reporting exists
for: a score gap of 0.09 corresponds to an absolute gap of 30 missed mutants.

On Opus the three cells are indistinguishable — the spread (0.91 to 0.94) is
below every cell's own standard deviation, and EXACT v1.1 produces the most
mutants without a markedly lower score.

**H3 is not confirmed.** Mutation Score does not rank the three methods
consistently across models. The finding is asymmetric rather than negative: on
SOL, structure buys a substantially stronger suite; on Opus, all three methods
already produce suites of the same strength and the structural investment shows
up in shape (F-1.10.1) rather than in test power.

---

## F-1.10.8 — On Opus the arms miss mutants for opposite reasons

Mutation Score is indistinguishable across the three Opus cells (0.93 / 0.94 /
0.91, every gap inside every cell's own standard deviation). Splitting the missed
mutants shows that the three suites are not alike at all.

| Opus, per run | Inline | EXACT v1 | EXACT v1.1 |
|---|---:|---:|---:|
| Survived — reached, not killed | 8.80 | 4.13 | 4.50 |
| Uncovered — never reached | 1.00 ± 1.33 | 4.27 ± 5.79 | 10.00 ± 11.99 |
| Uncovered share of misses | 10 % | 51 % | 69 % |

The Inline suite reaches essentially all of the product and asserts weakly
against it: 8.80 mutants per run survive execution, 1.00 goes untouched. Both
EXACT arms are the mirror image: around 4 survive execution — assertions roughly
twice as sharp — while 4.27 and 10.00 mutants per run are never reached at all.
The score averages these two failure modes into the same number.

**The uncovered counts are bimodal, not uniform.** Per-run values expose it:

| Arm | Uncovered mutants per run |
|---|---|
| Inline | 0, 0, 0, 0, 0, 1, 1, 2, 2, 4 |
| EXACT v1 | 0, 0, 0, 0, 2, 2, 2, 2, 2, 3, 4, 4, 8, 16, 19 |
| EXACT v1.1 | 0, 0, 0, 0, 2, 6, 18, 20, 21, 33 |

Six of ten EXACT v1.1 runs leave at most 6 mutants uncovered; four leave 18 to 33
untouched. The cell mean of 10.00 therefore describes a split population rather
than a typical run, which is what the standard deviation of 11.99 says. EXACT v1
spreads more evenly, with two of 15 runs at 16 or more. The reliable part of the
finding is the Inline arm's floor — 9 of 10 runs at or below 2, the tenth at 4 —
and the fact that large uncovered regions appear only once the structured
workflow is used.

On SOL the pattern does not reproduce: uncovered shares run 26 % / 19 % / 24 %
across the three arms, with the Inline arm carrying the *most* uncovered mutants
in absolute terms (12.20 against 4.9 and 4.00). The Opus asymmetry is therefore a
property of that platform's arms, not of the method.
