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

**Correctness guard — passed.** All four cells clear the 0.90 gate, so every
quality row is eligible. Correctness (internal) is 100 % in all four.

### Native Opus 5 / Claude Code

| Metric | PTDD v1 (n=10) | v1.1 isolated Refactor (n=5) |
|---|---:|---:|
| Correctness (external) | **0.99 ± 0.02** 🏆 | 0.96 ± 0.09 |
| Completed within budget | **100 %** 🏆 | 80 % |
| Complexity Peak (`cognitive_max`) | 2.8 ± 0.63 | **2.2 ± 0.45** 🏆 |
| `cognitive_avg` | 1.47 ± 0.26 | **1.13 ± 0.06** 🏆 |
| `mccabe_max` | **3.3 ± 0.48** 🏆 | **3.0 ± 0.00** 🏆 |
| Smell Total | **0.0 ± 0.00** 🏆 | **0.0 ± 0.00** 🏆 |
| `cc_avg_loc_per_function` | 5.95 ± 0.93 | **4.60 ± 0.33** 🏆 |
| `cc_median_loc_per_function` | 4.7 ± 1.27 | **3.2 ± 0.27** 🏆 |
| Complexity Peak of size (`cc_longest_function`) | 18.9 ± 5.26 | **15.2 ± 3.35** 🏆 |
| Mutation Score | **0.92 ± 0.06** 🏆 | **0.89 ± 0.10** 🏆 |
| `predictions_correct_rate` | **98.9 %** 🏆 | **98.1 %** 🏆 |
| `duration_seconds` | **1206.1 ± 318.1** 🏆 | 5499.4 ± 1417.5 |
| `cost_usd` | **16.10 ± 4.28** 🏆 | 32.05 ± 7.85 |
| *Production LoC* | 245.7 ± 32.9 | 526.8 ± 150.9 |
| *Code Mass (APP)* | 714.8 ± 70.1 | 968.0 ± 159.6 |
| *`cc_functions`* | 25.3 ± 4.42 | 40.2 ± 4.82 |
| *`refactorings_applied`* | 51.5 ± 13.8 | 47.4 ± 13.1 |
| *`mutants_total` / survived* | 134 / 10.4 | 156 / 18.0 |
| *of those uncovered* | 5.8 ± 6.61 | 15.2 ± 13.95 |
| *`total_tokens`* | 21.4 M | 48.4 M |

### GPT-5.6 SOL / pi

| Metric | PTDD v1 (n=10) | v1.1 isolated Refactor (n=5) |
|---|---:|---:|
| Correctness (external) | 1.00 ± 0.00 | 1.00 ± 0.00 |
| Completed within budget | 100 % | 100 % |
| Complexity Peak (`cognitive_max`) | 3.9 ± 1.10 | **2.6 ± 0.89** 🏆 |
| `cognitive_avg` | 1.83 ± 0.37 | **1.24 ± 0.29** 🏆 |
| `mccabe_max` | 5.0 ± 1.56 | **3.6 ± 0.55** 🏆 |
| Smell Total | 0.0 ± 0.00 | 0.0 ± 0.00 |
| `cc_avg_loc_per_function` | 6.42 ± 1.24 | **4.21 ± 0.40** 🏆 |
| `cc_median_loc_per_function` | 5.3 ± 1.96 | **3.0 ± 0.00** 🏆 |
| Complexity Peak of size (`cc_longest_function`) | **18.4 ± 2.37** 🏆 | **15.8 ± 3.56** 🏆 |
| Mutation Score | 0.86 ± 0.05 *(n=9)* | **0.88 ± 0.02** 🏆 *(n=4)* |
| `predictions_correct_rate` | **99.6 %** 🏆 | **100 %** 🏆 |
| `duration_seconds` | **1486.0 ± 476.7** 🏆 | 4927.0 ± 610.5 |
| `cost_usd` | **4.76 ± 2.55** 🏆 | 18.27 ± 3.05 |
| *Production LoC* | 152.4 ± 28.1 | 224.0 ± 27.9 |
| *Code Mass (APP)* | 633.1 ± 94.7 | 685.4 ± 63.3 |
| *`cc_functions`* | 13.7 ± 4.06 | 32.2 ± 4.66 |
| *`refactorings_applied`* | 39.2 ± 10.5 | 37.2 ± 2.28 |
| *`mutants_total` / survived* | 131 / 18.3 *(n=9)* | 143 / 16.8 *(n=4)* |
| *of those uncovered* | 5.4 ± 2.70 *(n=9)* | 4.0 ± 1.41 *(n=4)* |
| *`total_tokens`* | 6.88 M | 17.5 M |

Smell Total is 0.0 in every cell of both tables. On Opus the row is shown with
shared trophies because both columns are at the floor; on SOL there is likewise
no contest.

`mutants_survived` is split into its two parts. A **Survived** mutant means a
test ran the mutated line and still passed — a weak assertion. An **uncovered**
one means no test reaches the line at all — untested code. Mutation Score
cannot tell them apart, and on Opus the distinction is what separates the two
columns (F-1.7.5).

Two SOL mutation cells report fewer replicates than the other metrics. Both
gaps are instrument failures rather than workflow outcomes (F-1.7.6).

---

## F-1.7.1 — The isolated Refactor phase improves every structural measure on both platforms

The treatment does what it was built to do, and it does it consistently.

| Measure | Opus: v1 → v1.1 | SOL: v1 → v1.1 |
|---|---|---|
| Complexity Peak | 2.8 → 2.2 (−21 %) | 3.9 → 2.6 (−33 %) |
| `cognitive_avg` | 1.47 → 1.13 (−23 %) | 1.83 → 1.24 (−32 %) |
| `mccabe_max` | 3.3 → 3.0 (−9 %) | 5.0 → 3.6 (−28 %) |
| `cc_avg_loc_per_function` | 5.95 → 4.60 (−23 %) | 6.42 → 4.21 (−34 %) |
| `cc_longest_function` | 18.9 → 15.2 (−20 %) | 18.4 → 15.8 (−14 %) |

Not one structural measure moves the wrong way on either platform. The answer to
the RQ's question is therefore not whether the treatment improves product
structure — it does — but whether the improvement is worth its cost, which is
what the remaining findings address.

---

## F-1.7.2 — The improvement comes from splitting the product, not from simplifying it

Every per-function measure improves while the product itself grows.

| | Opus v1 | Opus v1.1 | SOL v1 | SOL v1.1 |
|---|---:|---:|---:|---:|
| `cc_functions` | 25.3 | 40.2 (+59 %) | 13.7 | 32.2 (+135 %) |
| Production LoC | 245.7 | 526.8 (+114 %) | 152.4 | 224.0 (+47 %) |
| Code Mass (APP) | 714.8 | 968.0 (+35 %) | 633.1 | 685.4 (+8 %) |
| `cc_avg_loc_per_function` | 5.95 | 4.60 | 6.42 | 4.21 |

On Opus the function count rises by 59 % and Production LoC by 114 % — the
average function shrinks because there are far more of them, and there is more
code overall. On SOL the function count more than doubles while Production LoC
rises by 47 % and Code Mass (APP) by only 8 %, which is much closer to
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
| Completed within budget | 100 % | **80 %** | 100 % | 100 % |
| Correctness (external) | 0.99 ± 0.02 | 0.96 ± 0.09 | 1.00 ± 0.00 | 1.00 ± 0.00 |
| Worst run | 0.93 | **0.80** | 1.00 | 1.00 |

One of five Opus treatment runs hits the timeout, and that run is also the only
cell member below the correctness ceiling at 0.80 — the 0.96 ± 0.09 mean is one
bad run against four perfect ones, not a uniform decline. SOL runs the same
treatment 5 of 5 within budget at a perfect score.

Both platforms pay a comparable multiple in wall-clock — 4.6× on Opus (1206 →
5499 s), 3.3× on SOL (1486 → 4927 s) — so the difference is not that Opus is
slower under the treatment, but that it is close enough to its budget ceiling for
the extra context round-trips to push one run over.

---

## F-1.7.4 — The treatment is worth more where the shared-context workflow leaves headroom

The platforms differ in where PTDD v1 already lands.

| | Opus v1 | SOL v1 |
|---|---:|---:|
| Complexity Peak | 2.8 | 3.9 |
| `mccabe_max` | 3.3 | 5.0 |
| `cc_median_loc_per_function` | 4.7 | 5.3 |

On Opus, v1 is already near the floor these measures can reach on this kata, so
the treatment's absolute gain is small — 0.6 on Complexity Peak, 0.3 on
`mccabe_max`, the latter inside v1's own spread of 0.48. For that it costs a
doubling of Production LoC, twice the money and one run in five.

On SOL, v1 stops well short of the floor, and the treatment closes most of the
gap: `mccabe_max` 5.0 → 3.6, `cc_avg_loc_per_function` 6.42 → 4.21, at 5 of 5
within budget and a perfect correctness score.

**The answer to the RQ is therefore platform-conditional.** The isolated Refactor
phase justifies its context cost on GPT-5.6 SOL via pi, and does not on native
Opus 5 — where the same structural gain can be had by staying with the
shared-context workflow at half the price.

---

## F-1.7.5 — On Opus the two arms miss mutants for opposite reasons

Mutation Score does not separate the Opus columns: 0.92 against 0.89, a gap well
inside both standard deviations. Splitting the missed mutants shows the suites
are not alike.

| Opus, per run | PTDD v1 | v1.1 isolated Refactor |
|---|---:|---:|
| Survived — reached, not killed | 4.6 | 2.8 |
| Uncovered — never reached | 5.8 ± 6.61 | 15.2 ± 13.95 |
| Uncovered share of misses | 56 % | 84 % |

The treatment produces the sharper assertions of the two — 2.8 mutants per run
survive execution against 4.6 — while leaving 15.2 mutants per run untouched
against 5.8. Read together with F-1.7.2, the doubled Production LoC is largely
code no test visits: the suite gets better at what it looks at and looks at less
of the product.

**The uncovered counts are bimodal.** Per-run values: v1 at 0, 0, 2, 2, 3, 4, 4,
8, 16, 19; v1.1 at 0, 2, 20, 21, 33. Three of five treatment runs leave 20 to 33
mutants untouched and two leave almost none, so the mean of 15.2 describes a
split population rather than a typical run — which is what the standard deviation
of 13.95 says. The robust part of the finding is that the treatment's uncovered
count can reach a third of its mutant population, which no reading of the score
would reveal.

On SOL the pattern does not appear: 5.4 against 4.0 uncovered mutants per run,
with the treatment slightly *better* on both terms.

---

## F-1.7.6 — Two SOL mutation cells lose replicates to the instrument, not to the workflow

Mutation Score is the only outcome here that does not reach full replicates.

| Cell | Replicates | Cause |
|---|---|---|
| SOL PTDD v1 | 9 of 10 | one run scored 0.00 with 112 of 112 mutants surviving |
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
| with the 0.00 | 10 | 0.775 | 27.7 |
| without it | 9 | 0.861 ± 0.050 | 18.3 |

`summary.md` carries the n=10 figure, because the aggregation has no notion of an
instrument artefact. Carrying it here would have inverted the SOL comparison in
F-1.7.5.

---

## Caveats

- **Single kata and prompt.** All conclusions are about Claim Office under
  Example Mapping.
- **Unequal replicates.** The control cells carry n=10 against n=5 in the
  treatment cells, inherited from the earlier RQ that produced them. Their means
  are better determined; no comparison here depends on the difference.
- **Pooled workflow names.** The control cells pool `exact-ptdd-v1-*` with the
  content-identical `exact-sol-v1.6-test-list-dimensions-*` spelling its runs
  were recorded under. The first entry is the canonical label.
- **`cost_usd` is a list-price comparison value, not an invoice.** For pi runs it
  is derived from token counts and the price table, never from pi's own inline
  figures.
- **The `mccabe_max` trophy on Opus is shared deliberately.** The treatment is
  nominally best at 3.0 ± 0.00, but its zero standard deviation makes the sharing
  rule degenerate, and the 0.3 gap lies inside the control's own spread of 0.48.
  The honest reading is a tie.
- **Timeouts are outcomes and are not refilled.** The Opus treatment cell keeps
  its timed-out run at 0.80.
