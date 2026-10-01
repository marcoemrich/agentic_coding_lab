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
function count and `mutants_total` have no unambiguous direction and receive no
trophy; they appear as context.

**The refactoring count is no longer reported.** It came from the marker route
retired in 2026-10 and now exists for only part of each Opus cell — 10 of 15 and
5 of 10 runs — while both SOL cells still carry it in full. A mean over two
thirds of one column against a whole other column would read as a treatment
difference, so the row is dropped rather than qualified. The phase chain's
`refactor_events` is its successor and exists only on the refilled Opus halves,
which does not span the comparison either.

**Data basis.** Every cell pools all runs that match its workflow × model × kata,
including runs recorded for sister RQs that share the cell:

| Cell | n | Batches pooled |
|---|---:|---|
| Opus PTDD v1 | 15 | 10 on 2026-09-16 (Claude Code 2.1.267, recorded as `exact-sol-v1.6-test-list-dimensions-cc`) + 5 from the RQ-opus55-current-workflow refill (2.1.280) |
| Opus v1.1 | 10 | 5 on 2026-09-17 (2.1.267) + 5 from the RQ-opus55-current-workflow refill (2.1.280) |
| SOL PTDD v1 | 15 | 10 on 2026-09-16 (pi 0.81.1, recorded as `exact-sol-v1.6-test-list-dimensions-pi`) + 5 on 2026-09-23 (pi 0.81.1) |
| SOL v1.1 | 5 | 5 on 2026-09-17 (pi 0.81.1) |

Both Opus cells mix the two Claude Code versions in similar proportion, so the
version is not confounded with the treatment; where the batches differ, the
finding says so.

**Trophy rule.** A trophy goes to the better cell only when the gap between the
means exceeds the smaller of the two standard deviations; otherwise both cells
share it.

**Correctness guard — the Opus treatment cell fails it.** Three of ten Opus v1.1
runs hit the two-hour budget ceiling, one of them delivering nothing
(`verification_pct` 0), which puts the cell at 0.87 ± 0.31 — below the 0.90 gate.
Its values are shown in parentheses without trophies: they describe seven
finished runs plus three that stopped early. The other three cells are at 1.00 and
eligible. Correctness (internal) is 100 % in all four.

### Native Opus 5 / Claude Code

| Metric | PTDD v1 (n=15) | v1.1 isolated Refactor (n=10) |
|---|---:|---:|
| Correctness (external) | **1.00 ± 0.02** 🏆 | 0.87 ± 0.31 |
| Completed within budget | **100 %** 🏆 | 70 % |
| Worst run | 0.93 | **0.00** |
| `cognitive_max` | **3.07 ± 0.96** 🏆 | (2.50 ± 0.71) |
| `cognitive_avg` | **1.48 ± 0.24** 🏆 | (1.25 ± 0.14) |
| `mccabe_max` | **3.33 ± 0.49** 🏆 | (3.00 ± 0.00) |
| Smell Total | **0.00 ± 0.00** 🏆 | (0.00 ± 0.00) |
| `cc_avg_loc_per_function` | **5.82 ± 0.78** 🏆 | (4.67 ± 0.38) |
| `cc_median_loc_per_function` | **4.63 ± 1.16** 🏆 | (3.30 ± 0.42) |
| `cc_longest_function` | **17.93 ± 4.93** 🏆 | (13.90 ± 2.92) |
| Mutation Score | **0.94 ± 0.05** 🏆 | (0.91 ± 0.08) |
| `predictions_correct_rate` | **98.9 %** 🏆 | (98.2 %) |
| `duration_seconds` | **1234.40 ± 267.31** 🏆 | (5483.70 ± 1589.67) |
| `cost_usd` | **16.38 ± 3.65** 🏆 | (66.35 ± 21.55) |
| *Production LoC* | 308.27 ± 36.23 | 558.70 ± 184.85 |
| *Code Mass (APP)* | 712.67 ± 70.77 | 873.90 ± 189.30 |
| *`cc_functions`* | 25.87 ± 4.03 | 35.40 ± 9.08 |
| *`mutants_total` / survived* | 135.20 / 8.40 | 147.00 / 14.50 |
| *of those uncovered* | 4.27 ± 5.79 | 10.00 ± 11.99 |
| *`total_tokens`* | 21.77 M | 71.42 M |

Every trophy in this table sits with the control column, and that is a
consequence of the gate rather than of the measurements: the treatment column
holds the better value on seven of the quality rows. What disqualifies it is that
three of its ten runs did not finish. F-1.7.3.

### GPT-5.6 SOL / pi

| Metric | PTDD v1 (n=15) | v1.1 isolated Refactor (n=5) |
|---|---:|---:|
| Correctness (external) | **1.00 ± 0.00** 🏆 | **1.00 ± 0.00** 🏆 |
| Completed within budget | **100 %** 🏆 | **100 %** 🏆 |
| `cognitive_max` | 4.07 ± 1.22 | **2.60 ± 0.89** 🏆 |
| `cognitive_avg` | 1.86 ± 0.35 | **1.24 ± 0.29** 🏆 |
| `mccabe_max` | 4.73 ± 1.44 | **3.60 ± 0.55** 🏆 |
| Smell Total | 0.00 ± 0.00 | 0.00 ± 0.00 |
| `cc_avg_loc_per_function` | 6.14 ± 1.09 | **4.21 ± 0.40** 🏆 |
| `cc_median_loc_per_function` | 5.00 ± 1.66 | **3.00 ± 0.00** 🏆 |
| `cc_longest_function` | **17.80 ± 2.93** 🏆 | **15.80 ± 3.56** 🏆 |
| Mutation Score | **0.863 ± 0.045** 🏆 *(n=14)* | **0.88 ± 0.02** 🏆 *(n=4)* |
| `predictions_correct_rate` | **99.6 %** 🏆 | **100 %** 🏆 |
| `duration_seconds` | **1573.93 ± 495.01** 🏆 | 4927.00 ± 610.52 |
| `cost_usd` | **4.67 ± 2.62** 🏆 | 18.27 ± 3.05 |
| *Production LoC* | 169.00 ± 34.15 | 265.20 ± 32.51 |
| *Code Mass (APP)* | 616.47 ± 87.10 | 685.40 ± 63.25 |
| *`cc_functions`* | 14.60 ± 4.50 | 32.20 ± 4.66 |
| *`mutants_total` / survived* | 128.00 / 17.6 *(n=14)* | 143.00 / 16.8 *(n=4)* |
| *of those uncovered* | 4.9 ± 2.34 *(n=14)* | 4.00 ± 1.41 *(n=4)* |
| *`total_tokens`* | 6.72 M | 17.52 M |

Smell Total is 0.00 in every cell of both tables — no contest, so no trophy on
SOL and a shared pair on Opus.

`mutants_survived` is split into its two parts. A **Survived** mutant means a
test ran the mutated line and still passed — a weak assertion. An **uncovered**
one means no test reaches the line at all — untested code. Mutation Score cannot
tell them apart (F-1.7.5).

Two SOL mutation cells report fewer replicates than the other metrics. Both gaps
are instrument failures rather than workflow outcomes (F-1.7.6).

---

## F-1.7.1 — The isolated Refactor phase improves every structural measure on both platforms, but barely moves the Opus peaks

No structural measure moves the wrong way on either platform.

| Measure | Opus: v1 → v1.1 | SOL: v1 → v1.1 |
|---|---|---|
| `cognitive_max` | 3.07 → 2.50 (−19 %) | 4.07 → 2.60 (−36 %) |
| `cognitive_avg` | 1.48 → 1.25 (−16 %) | 1.86 → 1.24 (−33 %) |
| `mccabe_max` | 3.33 → 3.00 (−10 %) | 4.73 → 3.60 (−24 %) |
| `cc_avg_loc_per_function` | 5.82 → 4.67 (−20 %) | 6.14 → 4.21 (−31 %) |
| `cc_longest_function` | 17.93 → 13.90 (−22 %) | 17.80 → 15.80 (−11 %) |

The two platforms differ in what the treatment reaches. On SOL it lowers
`cognitive_max` and `mccabe_max` as well as the per-function size, and every gap except
`cc_longest_function` exceeds the smaller cell's spread. On Opus it shortens
functions — average and longest by about a fifth — while the `cognitive_max` and
`mccabe_max` gaps stay inside either cell's spread.

The answer to the RQ's question is therefore not whether the treatment improves
product structure — it does, on both platforms — but whether the improvement is
worth its cost, which is what the remaining findings address.

---

## F-1.7.2 — The improvement comes from splitting the product, not from simplifying it

Every per-function measure improves while the product itself grows.

| | Opus v1 | Opus v1.1 | SOL v1 | SOL v1.1 |
|---|---:|---:|---:|---:|
| `cc_functions` | 25.87 | 35.40 (+37 %) | 14.60 | 32.20 (+121 %) |
| Production LoC | 308.27 | 558.70 (+81 %) | 169.00 | 265.20 (+57 %) |
| Code Mass (APP) | 712.67 | 873.90 (+23 %) | 616.47 | 685.40 (+11 %) |
| `cc_avg_loc_per_function` | 5.82 | 4.67 | 6.14 | 4.21 |

On Opus the function count rises by 37 % and Production LoC by 81 % — the average
function shrinks because there are far more of them, and there is substantially
more code overall. On SOL the function count more than doubles while Production
LoC rises by 57 % and Code Mass (APP) by 11 %, which is much closer to
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
| Completed within budget | 100 % | **70 %** | 100 % | 100 % |
| Correctness (external) | 1.00 ± 0.02 | **0.87 ± 0.31** | 1.00 ± 0.00 | 1.00 ± 0.00 |
| Worst run | 0.93 | **0.00** | 1.00 | 1.00 |

**Three of ten Opus treatment runs hit the two-hour ceiling.** One of the three
delivered nothing at all — `verification_pct` 0, no suite invocation — and is the
cell's worst run; the other two had solved the kata and simply ran out of budget.
Two further treatment runs miss one scenario each at 0.93, the same single miss
that two of fifteen control runs show. SOL runs the treatment 5 of 5 within
budget at a perfect score.

Both platforms pay a comparable multiple in wallclock — 4.4× on Opus (1234 →
5484 s), 3.1× on SOL (1574 → 4927 s) — so the difference is not that Opus is
slower under the treatment, but that it is close enough to its budget ceiling for
the extra context round-trips to push a third of the runs over.

Timeouts are findings here, not errors: they count toward `min_replicates` and
are not refilled. The consequence for this RQ is that the Opus treatment cell
cannot be read as a quality result at all — see the note under the Opus table.

---

## F-1.7.4 — The treatment is worth more where the shared-context workflow leaves headroom

The platforms differ in where PTDD v1 already lands.

| | Opus v1 | SOL v1 |
|---|---:|---:|
| `cognitive_max` | 3.07 | 4.07 |
| `mccabe_max` | 3.33 | 4.73 |
| `cc_median_loc_per_function` | 4.63 | 5.00 |

On Opus, v1 is already close to the floor these measures can reach on this kata,
so the treatment's gain on the peaks is 0.57 on `cognitive_max` and 0.33 on
`mccabe_max`, both inside v1's own spread. For that it costs 81 % more Production
LoC, 4.1× the money and three runs in ten over budget.

On SOL, v1 stops well short of the floor, and the treatment closes most of the
gap: `mccabe_max` 4.73 → 3.60, `cc_avg_loc_per_function` 6.14 → 4.21, at 5 of 5
within budget and a perfect correctness score.

**The answer to the RQ is therefore platform-conditional.** The isolated Refactor
phase justifies its context cost on GPT-5.6 SOL via pi, and does not on native
Opus 5 — where the shared-context workflow reaches a comparable `cognitive_max`
and `mccabe_max` at a quarter of the price and without losing runs.

---

## F-1.7.5 — On Opus the treatment leaves more of the product untested, in both batches

Mutation Score does not separate the Opus columns: 0.94 against 0.91, a gap
inside both standard deviations. Neither does the weak-assertion part of the
misses.

| Opus, per run | PTDD v1 | v1.1 isolated Refactor |
|---|---:|---:|
| Survived — reached, not killed | 4.1 | 4.5 |
| Uncovered — never reached | 4.27 ± 5.79 | 10.00 ± 11.99 |
| Uncovered share of misses | 51 % | 69 % |

The whole difference is in code no test visits, and both pooled batches point the
same way:

| Uncovered mutants per run | PTDD v1 | v1.1 |
|---|---|---|
| Claude Code 2.1.267 | 0, 0, 2, 2, 3, 4, 4, 8, 16, 19 (mean 5.8) | 0, 2, 20, 21, 33 (mean 15.2) |
| Claude Code 2.1.280 | 0, 0, 2, 2, 2 (mean 1.2) | 0, 0, 0, 6, 18 (mean 4.8) |

The treatment carries more untested code than the control on 2.1.267 (15.2
against 5.8) and on 2.1.280 (4.8 against 1.2). Both arms are bimodal — most runs
leave a handful of mutants untouched, a minority leaves 16 to 33 — and the
treatment's tail is the longer one: four of ten v1.1 runs reach 18 or more,
against two of fifteen v1 runs.

The second batch is also the quieter one in both arms, which is worth stating
plainly: on 2.1.280 the control leaves at most 2 mutants uncovered in all five
runs. Whether that is the CLI version, the batch, or the five particular runs is
not separable at these replicate counts. What the pooled data does establish is
the direction — the isolated Refactor phase raises the uncovered count on Opus —
and that the count can reach a quarter of a run's mutant population with no trace
in the score.

On SOL the pattern does not appear: 4.9 against 4.00 uncovered mutants per run,
with 12.6 and 12.8 per run surviving execution — a tie on both terms, and an
uncovered share of 28 % against 24 %.

---

## F-1.7.6 — Two SOL mutation cells lose replicates to the instrument, not to the workflow

Mutation Score is the only outcome here that does not reach full replicates.

| Cell | Replicates | Cause |
|---|---|---|
| SOL PTDD v1 | 14 of 15 | one run scored 0.00 with every mutant surviving |
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
| with the 0.00 | 15 | 0.806 ± 0.227 | 23.9 |
| without it | 14 | 0.863 ± 0.045 | 17.6 |

`summary.md` carries the n=15 figure, because the aggregation has no notion of an
instrument artefact. Carrying it here would have inverted the SOL comparison in
F-1.7.5.

---

## Caveats

- **Single kata and prompt.** All conclusions are about Claim Office under
  Example Mapping.
- **Pooled batches.** Three of four cells pool runs from sister RQs; the Opus
  cells span Claude Code 2.1.267 and 2.1.280 (see the data basis). The pooled
  means are the reported figures; F-1.7.5 shows where the two batches differ in
  magnitude while agreeing in direction.
- **Unequal replicates.** The control cells carry n=15 against n=10 (Opus) and
  n=5 (SOL), so the treatment cells' standard deviations rest on fewer runs.
- **The Opus treatment cell is not a quality measurement.** Three of its ten runs
  stopped at the budget ceiling. Its complexity and size values are reported for
  completeness and carry no trophy.
- **TDD discipline is not an outcome.** The marker-derived refactoring count no
  longer spans the Opus cells and the phase chain does not span the SOL ones; no
  discipline claim is made here. `predictions_correct_rate` is the exception — it
  is marker-derived but present for all 45 runs.
