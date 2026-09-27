# Findings — RQ-ptdd-refactor-subagent-cross-model

## Overview

Cell means ± standard deviation. The treatment moves only the per-cycle Refactor
phase out of the main context into an isolated subagent; everything else — test
list, Red, Green, predictions, Four Rules, domain-boundary contract, stack
profile — is identical between the two columns of a platform.

The two platforms are separate tables and are never compared with each other.
Absolute duration, token and cost levels differ by harness and route, so only
the within-platform contrast is causal. Trophies are awarded **within a table**.

Complexity, unit size, duration and cost are lower = better; Mutation Score and
prediction accuracy are higher = better. Production LoC, Code Mass (APP),
function count, `mutants_total` and the refactoring count have no unambiguous
direction and receive no trophy; they appear as context.

**Data basis.** Every cell pools all runs that match its workflow × model × kata,
including runs recorded for sister RQs that share the cell:

| Cell | n | Batches pooled |
|---|---:|---|
| Opus PTDD v1 | 15 | 10 on 2026-09-16 (Claude Code 2.1.267, recorded as `exact-sol-v1.6-test-list-dimensions-cc`) + 5 on 2026-09-23 (2.1.280, RQ-opus55-current-workflow) |
| Opus v1.1 | 10 | 5 on 2026-09-17 (2.1.267) + 5 on 2026-09-23 (2.1.280, RQ-opus55-current-workflow) |
| SOL PTDD v1 | 15 | 10 on 2026-09-16 (pi 0.81.1, recorded as `exact-sol-v1.6-test-list-dimensions-pi`) + 5 on 2026-09-23 (pi 0.81.1) |
| SOL v1.1 | 5 | 5 on 2026-09-17 (pi 0.81.1) |

Both Opus cells mix the two Claude Code versions in similar proportion, so the
version is not confounded with the treatment; where the batches disagree, the
finding says so.

**Trophy rule.** A trophy goes to the better cell only when the gap between the
means exceeds the smaller of the two standard deviations; otherwise both cells
share it.

**Correctness guard — passed.** All four cells clear the 0.90 gate, so every
quality row is eligible. Correctness (internal) is 100 % in all four.

### Native Opus 5 / Claude Code

| Metric | PTDD v1 (n=15) | v1.1 isolated Refactor (n=10) |
|---|---:|---:|
| Correctness (external) | **0.99 ± 0.02** 🏆 | 0.97 ± 0.06 |
| Completed within budget | **100 %** 🏆 | 90 % |
| Complexity Peak (`cognitive_max`) | **2.7 ± 0.88** 🏆 | **2.6 ± 1.07** 🏆 |
| `cognitive_avg` | 1.44 ± 0.27 | **1.22 ± 0.18** 🏆 |
| `mccabe_max` | **3.3 ± 0.46** 🏆 | **3.2 ± 0.63** 🏆 |
| Smell Total | **0.0 ± 0.00** 🏆 | **0.0 ± 0.00** 🏆 |
| `cc_avg_loc_per_function` | 6.00 ± 1.00 | **4.74 ± 0.37** 🏆 |
| `cc_median_loc_per_function` | 4.8 ± 1.16 | **3.35 ± 0.63** 🏆 |
| Complexity Peak of size (`cc_longest_function`) | 18.5 ± 5.13 | **15.0 ± 2.45** 🏆 |
| Mutation Score | **0.91 ± 0.06** 🏆 | **0.90 ± 0.09** 🏆 |
| `predictions_correct_rate` | **99.0 %** 🏆 | **97.4 %** 🏆 |
| `duration_seconds` | **1103.0 ± 311.0** 🏆 | 4624.0 ± 1422.5 |
| `cost_usd` | **14.68 ± 4.34** 🏆 | 27.54 ± 7.44 |
| *Production LoC* | 243.9 ± 32.8 | 447.9 ± 142.7 |
| *Code Mass (APP)* | 706.7 ± 62.1 | 921.1 ± 137.6 |
| *`cc_functions`* | 25.2 ± 4.38 | 38.4 ± 4.62 |
| *`refactorings_applied`* | 47.2 ± 15.3 | 39.6 ± 13.6 |
| *`mutants_total` / survived* | 134 / 12.1 | 154 / 15.4 |
| *of those uncovered* | 7.3 ± 6.73 | 10.7 ± 12.59 |
| *`total_tokens`* | 19.2 M | 40.9 M |

### GPT-5.6 SOL / pi

| Metric | PTDD v1 (n=15) | v1.1 isolated Refactor (n=5) |
|---|---:|---:|
| Correctness (external) | 1.00 ± 0.00 | 1.00 ± 0.00 |
| Completed within budget | 100 % | 100 % |
| Complexity Peak (`cognitive_max`) | 4.1 ± 1.22 | **2.6 ± 0.89** 🏆 |
| `cognitive_avg` | 1.86 ± 0.35 | **1.24 ± 0.29** 🏆 |
| `mccabe_max` | 4.7 ± 1.44 | **3.6 ± 0.55** 🏆 |
| Smell Total | 0.0 ± 0.00 | 0.0 ± 0.00 |
| `cc_avg_loc_per_function` | 6.14 ± 1.09 | **4.21 ± 0.40** 🏆 |
| `cc_median_loc_per_function` | 5.0 ± 1.66 | **3.0 ± 0.00** 🏆 |
| Complexity Peak of size (`cc_longest_function`) | **17.8 ± 2.93** 🏆 | **15.8 ± 3.56** 🏆 |
| Mutation Score | **0.86 ± 0.04** 🏆 *(n=14)* | **0.88 ± 0.02** 🏆 *(n=4)* |
| `predictions_correct_rate` | **99.6 %** 🏆 | **100 %** 🏆 |
| `duration_seconds` | **1573.9 ± 495.0** 🏆 | 4927.0 ± 610.5 |
| `cost_usd` | **4.67 ± 2.62** 🏆 | 18.27 ± 3.05 |
| *Production LoC* | 149.3 ± 29.3 | 224.0 ± 27.9 |
| *Code Mass (APP)* | 616.5 ± 87.1 | 685.4 ± 63.3 |
| *`cc_functions`* | 14.6 ± 4.50 | 32.2 ± 4.66 |
| *`refactorings_applied`* | 39.5 ± 8.60 | 37.2 ± 2.28 |
| *`mutants_total` / survived* | 129 / 17.6 *(n=14)* | 143 / 16.8 *(n=4)* |
| *of those uncovered* | 4.9 ± 2.34 *(n=14)* | 4.0 ± 1.41 *(n=4)* |
| *`total_tokens`* | 6.72 M | 17.5 M |

Smell Total is 0.0 in every cell of both tables. On Opus the row is shown with
shared trophies because both columns are at the floor; on SOL there is likewise
no contest.

`mutants_survived` is split into its two parts. A **Survived** mutant means a
test ran the mutated line and still passed — a weak assertion. An **uncovered**
one means no test reaches the line at all — untested code. Mutation Score
cannot tell them apart (F-1.7.5).

Two SOL mutation cells report fewer replicates than the other metrics. Both
gaps are instrument failures rather than workflow outcomes (F-1.7.6).

---

## F-1.7.1 — The isolated Refactor phase improves every structural measure on both platforms, but barely moves the Opus peaks

No structural measure moves the wrong way on either platform.

| Measure | Opus: v1 → v1.1 | SOL: v1 → v1.1 |
|---|---|---|
| Complexity Peak | 2.73 → 2.60 (−5 %) | 4.07 → 2.60 (−36 %) |
| `cognitive_avg` | 1.44 → 1.22 (−15 %) | 1.86 → 1.24 (−33 %) |
| `mccabe_max` | 3.27 → 3.20 (−2 %) | 4.73 → 3.60 (−24 %) |
| `cc_avg_loc_per_function` | 6.00 → 4.74 (−21 %) | 6.14 → 4.21 (−31 %) |
| `cc_longest_function` | 18.5 → 15.0 (−19 %) | 17.8 → 15.8 (−11 %) |

The two platforms differ in what the treatment reaches. On SOL it lowers the
complexity peaks and the per-function size alike. On Opus it shortens functions
— average and longest by about a fifth — while Complexity Peak and `mccabe_max`
stay where PTDD v1 already puts them; both gaps lie far inside either cell's
spread. The answer to the RQ's question is therefore not whether the treatment
improves product structure — it does — but whether the improvement is worth its
cost, which is what the remaining findings address.

---

## F-1.7.2 — The improvement comes from splitting the product, not from simplifying it

Every per-function measure improves while the product itself grows.

| | Opus v1 | Opus v1.1 | SOL v1 | SOL v1.1 |
|---:|---:|---:|---:|---:|
| `cc_functions` | 25.2 | 38.4 (+52 %) | 14.6 | 32.2 (+121 %) |
| Production LoC | 243.9 | 447.9 (+84 %) | 149.3 | 224.0 (+50 %) |
| Code Mass (APP) | 706.7 | 921.1 (+30 %) | 616.5 | 685.4 (+11 %) |
| `cc_avg_loc_per_function` | 6.00 | 4.74 | 6.14 | 4.21 |

On Opus the function count rises by 52 % and Production LoC by 84 % — the
average function shrinks because there are far more of them, and there is more
code overall. On SOL the function count more than doubles while Production LoC
rises by 50 % and Code Mass (APP) by 11 %, which is much closer to
redistribution than to addition.

This is why `cc_functions`, Production LoC and Code Mass (APP) carry no trophy: a
per-function metric rewards splitting and cannot distinguish it from
simplification. The isolated Refactor agent sees one behaviour at a time and no
Red/Green reasoning, which is a plausible mechanism — it optimises the unit in
front of it without a view of the whole.

---

## F-1.7.3 — Only Opus pays for the treatment in correctness and budget

The treatment is identical on both platforms. Its damage is not.

| | Opus v1 | Opus v1.1 | SOL v1 | SOL v1.1 |
|---|---:|---:|---:|---:|
| Completed within budget | 100 % | **90 %** | 100 % | 100 % |
| Correctness (external) | 0.99 ± 0.02 | 0.97 ± 0.06 | 1.00 ± 0.00 | 1.00 ± 0.00 |
| Worst run | 0.93 | **0.80** | 1.00 | 1.00 |

One of ten Opus treatment runs hits the timeout, and that run is the cell's
worst at 0.80. Two further treatment runs, both on Claude Code 2.1.280, miss
one scenario at 0.93 — the same single miss that two of fifteen control runs
show. SOL runs the treatment 5 of 5 within budget at a perfect score.

Both platforms pay a comparable multiple in wall-clock — 4.2× on Opus (1103 →
4624 s), 3.1× on SOL (1574 → 4927 s) — so the difference is not that Opus is
slower under the treatment, but that it is close enough to its budget ceiling for
the extra context round-trips to push a run over.

---

## F-1.7.4 — The treatment is worth more where the shared-context workflow leaves headroom

The platforms differ in where PTDD v1 already lands.

| | Opus v1 | SOL v1 |
|---|---:|---:|
| Complexity Peak | 2.7 | 4.1 |
| `mccabe_max` | 3.3 | 4.7 |
| `cc_median_loc_per_function` | 4.8 | 5.0 |

On Opus, v1 is already near the floor these measures can reach on this kata, so
the treatment's gain is confined to function size: 0.13 on Complexity Peak and
0.07 on `mccabe_max`, both a fraction of v1's own spread. For that it costs 84 %
more Production LoC, 1.9× the money and one run in ten over budget.

On SOL, v1 stops well short of the floor, and the treatment closes most of the
gap: `mccabe_max` 4.7 → 3.6, `cc_avg_loc_per_function` 6.14 → 4.21, at 5 of 5
within budget and a perfect correctness score.

**The answer to the RQ is therefore platform-conditional.** The isolated Refactor
phase justifies its context cost on GPT-5.6 SOL via pi, and does not on native
Opus 5 — where the shared-context workflow already reaches the same complexity
peaks at about half the price.

---

## F-1.7.5 — On Opus the treatment's extra misses are untested code, and whether they appear depends on the batch

Mutation Score does not separate the Opus columns: 0.91 against 0.90, a gap well
inside both standard deviations. Neither does the weak-assertion part of the
misses.

| Opus, per run | PTDD v1 | v1.1 isolated Refactor |
|---|---:|---:|
| Survived — reached, not killed | 4.8 | 4.7 |
| Uncovered — never reached | 7.3 ± 6.73 | 10.7 ± 12.59 |
| Uncovered share of misses | 60 % | 69 % |

The whole difference is in code no test visits, and it is not stable across the
two pooled batches:

| Uncovered mutants per run | PTDD v1 | v1.1 |
|---|---|---|
| Claude Code 2.1.267 | 0, 0, 2, 2, 3, 4, 4, 8, 16, 19 (mean 5.8) | 0, 2, 20, 21, 33 (mean 15.2) |
| Claude Code 2.1.280 | 2, 8, 8, 17, 17 (mean 10.4) | 0, 2, 2, 2, 25 (mean 6.2) |

On 2.1.267 the treatment leaves more of the product untested; on 2.1.280 it is
the control that does. Both arms are bimodal — most runs leave a handful of
mutants untouched, a minority leaves 16 to 33 — and the treatment's tail is the
longer one: four of ten v1.1 runs reach 20 or more, against none of fifteen v1
runs. What holds across both batches is only that the uncovered count can reach
12 to 23 % of a run's mutant population without any trace in the score.
Whether the treatment raises it is not established at these replicate counts.

On SOL the pattern does not appear: 4.9 against 4.0 uncovered mutants per run,
with 12.6 and 12.8 mutants per run surviving execution — a tie on both terms.

---

## F-1.7.6 — Two SOL mutation cells lose replicates to the instrument, not to the workflow

Mutation Score is the only outcome here that does not reach full replicates.

| Cell | Replicates | Cause |
|---|---|---|
| SOL PTDD v1 | 14 of 15 | one run scored 0.00 with 112 of 112 mutants surviving |
| SOL v1.1 | 4 of 5 | Stryker aborted in the initial dry run |

Both runs are otherwise healthy: green suites, `verification_pct` 1.00, no
timeout. The aborted run's suite passes standalone in 2 seconds (35 of 35), and
the test that fails under instrumentation is the one that executes `src/cli.ts`
as a subprocess. A score of 0.00 against a suite that passes every external
acceptance scenario does not measure test strength — it means no test was
associated with any mutant.

Both runs drive the CLI out of process, which is the common factor but **not an
established cause**: other runs with the same visible test style score between
0.92 and 0.97. The mechanism is unresolved; what is established is that neither
value measures the suite.

The 0.00 is excluded from the SOL PTDD v1 cell wherever this document reports
Mutation Score. Both figures are on record:

| SOL PTDD v1 | n | Mutation Score | survived |
|---|---:|---:|---:|
| with the 0.00 | 15 | 0.806 | 23.9 |
| without it | 14 | 0.863 ± 0.045 | 17.6 |

`summary.md` carries the n=15 figure, because the aggregation has no notion of an
instrument artefact. Carrying it here would have inverted the SOL comparison in
F-1.7.5.

---

## Caveats

- **Single kata and prompt.** All conclusions are about Claim Office under
  Example Mapping.
- **Pooled batches.** Three of four cells pool runs from sister RQs recorded a
  week apart; the Opus cells span Claude Code 2.1.267 and 2.1.280 (see the data
  basis). The pooled means are the reported figures; F-1.7.5 shows the one
  outcome where the batches point in different directions.
- **Unequal replicates.** The control cells carry n=15 against n=10 (Opus) and
  n=5 (SOL) in the treatment cells. No comparison here depends on the difference.
- **Pooled workflow names.** The control cells pool `exact-ptdd-v1-*` with the
  content-identical `exact-sol-v1.6-test-list-dimensions-*` spelling their
  earlier runs were recorded under. The first entry is the canonical label.
- **`cost_usd` is a list-price comparison value, not an invoice.** For pi runs it
  is derived from token counts and the price table, never from pi's own inline
  figures.
- **Timeouts are outcomes and are not refilled.** The Opus treatment cell keeps
  its timed-out run at 0.80.
