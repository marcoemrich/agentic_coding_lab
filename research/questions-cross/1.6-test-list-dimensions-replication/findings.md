# Findings — RQ-test-list-dimensions-replication

## Overview

Cell means ± standard deviation at n=10 per cell. **v1.5** is the PTDD workflow
without the independent-dimensions cross-check in the test-list phase; **v1.6**
adds it and changes nothing else.

The two platforms are separate tables and are never compared with each other.
Absolute duration, token and cost levels differ by harness and route, so only the
within-platform contrast is causal. Trophies are awarded **within a table**.

Complexity, unit size, duration, cost and missed mutants are lower = better;
Correctness, Mutation Score and prediction accuracy are higher = better.
Production LoC, Code Mass (APP), function count, test count, Test LoC,
`mutants_total` and the refactoring count have no unambiguous direction and
receive no trophy; they appear as context.

**Correctness guard — passed.** All four cells clear the 0.90 gate. Correctness
(internal) and completion within budget are 100 % in all four.

`mutants_survived` is split into its two parts. A **Survived** mutant means a
test ran the mutated line and still passed — a weak assertion. An **uncovered**
one means no test reaches the line at all — untested code.

### Native Opus 5 / Claude Code

| Metric | v1.5 (n=10) | v1.6 with cross-check (n=10) |
|---|---:|---:|
| Correctness (external) | 0.96 ± 0.08 | **0.99 ± 0.02** 🏆 |
| Worst run | 0.73 | **0.93** 🏆 |
| Complexity Peak (`cognitive_max`) | 2.8 ± 0.63 | 2.8 ± 0.63 |
| `cognitive_avg` | **1.52 ± 0.21** 🏆 | **1.47 ± 0.26** 🏆 |
| `mccabe_max` | 3.3 ± 0.95 | 3.3 ± 0.48 |
| Smell Total | 0.0 ± 0.00 | 0.0 ± 0.00 |
| `cc_avg_loc_per_function` | **5.53 ± 0.65** 🏆 | **5.95 ± 0.93** 🏆 |
| `cc_median_loc_per_function` | **4.55 ± 1.12** 🏆 | **4.70 ± 1.27** 🏆 |
| `cc_longest_function` | **17.7 ± 6.25** 🏆 | **18.9 ± 5.26** 🏆 |
| Mutation Score | **0.96 ± 0.03** 🏆 | 0.92 ± 0.06 |
| `predictions_correct_rate` | 97.1 % | **98.9 %** 🏆 |
| `duration_seconds` | **1434.6 ± 518.4** 🏆 | **1206.1 ± 318.1** 🏆 |
| `cost_usd` | 23.12 ± 17.33 | **16.10 ± 4.28** 🏆 |
| *`tests_total`* | 52.0 ± 3.16 | 61.2 ± 6.70 |
| *Test LoC* | 457.0 ± 131.8 | 599.1 ± 258.6 |
| *Production LoC* | 236.2 ± 22.5 | 245.7 ± 32.9 |
| *Code Mass (APP)* | 661.7 ± 26.5 | 714.8 ± 70.1 |
| *`cc_functions`* | 25.4 ± 3.03 | 25.3 ± 4.42 |
| *`mutants_total` / survived* | 126 / 4.5 | 134 / 10.4 |
| *of those uncovered* | 1.9 ± 3.14 | 5.8 ± 6.61 |
| *`total_tokens`* | 30.4 M | 21.4 M |

### GPT-5.6 SOL / pi

| Metric | v1.5 (n=10) | v1.6 with cross-check (n=10) |
|---|---:|---:|
| Correctness (external) | 1.00 ± 0.00 | 1.00 ± 0.00 |
| Complexity Peak (`cognitive_max`) | **3.7 ± 0.95** 🏆 | **3.9 ± 1.10** 🏆 |
| `cognitive_avg` | **1.87 ± 0.48** 🏆 | **1.83 ± 0.37** 🏆 |
| `mccabe_max` | **4.3 ± 1.16** 🏆 | **5.0 ± 1.56** 🏆 |
| Smell Total | 0.0 ± 0.00 | 0.0 ± 0.00 |
| `cc_avg_loc_per_function` | **5.72 ± 0.52** 🏆 | 6.42 ± 1.24 |
| `cc_median_loc_per_function` | **4.35 ± 0.58** 🏆 | 5.30 ± 1.96 |
| `cc_longest_function` | **16.8 ± 1.69** 🏆 | **18.4 ± 2.37** 🏆 |
| Mutation Score | **0.89 ± 0.05** 🏆 | **0.86 ± 0.05** 🏆 *(n=9)* |
| `predictions_correct_rate` | 98.9 % | **99.6 %** 🏆 |
| `duration_seconds` | **1263.4 ± 351.0** 🏆 | **1486.0 ± 476.7** 🏆 |
| `cost_usd` | **4.78 ± 1.43** 🏆 | **4.76 ± 2.55** 🏆 |
| *`tests_total`* | 35.8 ± 1.55 | 42.0 ± 3.59 |
| *Test LoC* | 218.3 ± 47.8 | 220.6 ± 71.3 |
| *Production LoC* | 150.2 ± 27.2 | 152.4 ± 28.1 |
| *Code Mass (APP)* | 578.2 ± 35.7 | 633.1 ± 94.7 |
| *`cc_functions`* | 15.3 ± 4.03 | 13.7 ± 4.06 |
| *`mutants_total` / survived* | 117 / 13.3 | 133 / 18.3 *(n=9)* |
| *of those uncovered* | 3.8 ± 1.55 | 5.4 ± 2.70 *(n=9)* |
| *`total_tokens`* | 6.58 M | 6.88 M |

Rows where the two columns are identical (Complexity Peak and `mccabe_max` on
Opus, Smell Total on both) carry no trophy: there is no contest to win.

The SOL v1.6 Mutation Score is reported at n=9. One run in that cell scored 0.00
with 112 of 112 mutants surviving against a green suite at perfect external
correctness — an instrument failure rather than a measurement of the suite, and
excluded here. `summary.md` carries the unfiltered n=10 figure of 0.78 ± 0.28,
which the σ alone marks as describing two populations.

---

## F-1.6.1 — The platform interaction replicates, and it lives in the correctness floor

The effect that motivated this RQ survives n=10 per cell. It is not a shift in the
mean but the removal of a bad tail.

| | Opus v1.5 | Opus v1.6 | SOL v1.5 | SOL v1.6 |
|---|---:|---:|---:|---:|
| Correctness (external) | 0.96 ± 0.08 | 0.99 ± 0.02 | 1.00 ± 0.00 | 1.00 ± 0.00 |
| Worst run | 0.73 | 0.93 | 1.00 | 1.00 |
| Runs below 0.90 | 1 of 10 | 0 of 10 | 0 | 0 |

On Opus the cross-check lifts the worst run from 0.73 to 0.93 and empties the
sub-0.90 band, cutting the standard deviation by a factor of four. The v1.5 tail
is one run at 0.73 plus two at 0.93; v1.6 has a single run at 0.93 and nine
perfect ones. The mean moves only 0.03, so a reader of means alone would
conclude the treatment does nothing.

On SOL there is nothing to lift: both cells sit at a perfect score with zero
variance across twenty runs. The interaction is therefore not a difference in how
the two platforms respond to the cross-check — it is that only one of them had a
completeness problem for the cross-check to solve.

**This was small-sample variance in neither direction.** At n=10 the effect is
the same one the earlier sample showed, and it is a variance effect rather than a
level effect.

---

## F-1.6.2 — The cross-check also halves cost variance on Opus

The same tail-trimming shows up in the price.

| Opus | v1.5 | v1.6 |
|---|---:|---:|
| `cost_usd` | 23.12 ± 17.33 | 16.10 ± 4.28 |
| most expensive run | 65.09 | 22.71 |
| `duration_seconds` | 1434.6 ± 518.4 | 1206.1 ± 318.1 |
| `total_tokens` | 30.4 M | 21.4 M |

The v1.5 cell contains a run costing $65.09 — nearly three times its own cell
mean — and its σ of 17.33 is larger than v1.6's entire mean. The cross-check
removes that mode: the worst v1.6 run costs $22.71, and the cell is 30 % cheaper
on average with a quarter of the spread.

A completeness step that makes the test list explicit up front therefore pays for
itself here rather than costing extra, which is the opposite of what an added
phase usually does. On SOL cost is unchanged ($4.78 against $4.76) — the same
pattern as F-1.6.1: no bad mode to remove.

---

## F-1.6.3 — Product structure is untouched on Opus and slightly worse on SOL

The cross-check acts on the test list, not on the production code, and the
structural metrics confirm it.

| Measure | Opus v1.5 → v1.6 | SOL v1.5 → v1.6 |
|---|---|---|
| Complexity Peak | 2.8 → 2.8 | 3.7 → 3.9 |
| `mccabe_max` | 3.3 → 3.3 | 4.3 → 5.0 |
| `cc_avg_loc_per_function` | 5.53 → 5.95 | 5.72 → 6.42 |
| `cc_median_loc_per_function` | 4.55 → 4.70 | 4.35 → 5.30 |
| Production LoC | 236.2 → 245.7 | 150.2 → 152.4 |

On Opus Complexity Peak and `mccabe_max` are *identical* to the second decimal
across twenty runs, and the size measures differ by less than either cell's
spread. Structure is genuinely unaffected.

On SOL the two size measures move against v1.6 by more than the better cell's
standard deviation — `cc_avg_loc_per_function` 5.72 → 6.42 (σ 0.52) and
`cc_median_loc_per_function` 4.35 → 5.30 (σ 0.58). Combined with F-1.6.1, this
makes v1.6 a cell with no correctness benefit and a mild structural cost on that
platform.

---

## F-1.6.4 — More tests, weaker suites: the cross-check lowers test strength on both platforms

This is the finding that does not follow from the RQ's original question, and it
points the other way from every other result here.

| | Opus v1.5 | Opus v1.6 | SOL v1.5 | SOL v1.6 |
|---|---:|---:|---:|---:|
| `tests_total` | 52.0 | 61.2 | 35.8 | 42.0 |
| Mutation Score | 0.96 ± 0.03 | 0.92 ± 0.06 | 0.89 ± 0.05 | 0.86 ± 0.05 |
| `mutants_total` | 126 | 134 | 117 | 133 |
| Survived — reached, not killed | 2.6 | 4.6 | 9.5 | 12.9 |
| Uncovered — never reached | 1.9 | 5.8 | 3.8 | 5.4 |
| **Missed in total** | **4.5** | **10.4** | **13.3** | **18.3** |

v1.6 writes 18 % more tests on Opus and 17 % more on SOL, and its suites catch
less. On Opus the absolute number of missed mutants more than doubles, from 4.5
to 10.4 per run, against a mutant population that grows only 6 %. Both components
rise, and the uncovered part rises fastest: 1.9 → 5.8, a tripling of mutants no
test reaches at all.

The pair matters here. On Opus the score gap of 0.04 corresponds to 5.9 more
missed changes per run — the ratio understates the change because v1.6's
denominator is larger. On SOL the score gap of 0.03 corresponds to 5.0 more
missed changes, with a 14 % larger population.

A plausible mechanism, not established by this RQ: the cross-check asks for test
cases along independent dimensions, which produces more but flatter cases — broad
enumeration of a dimension rather than deep interrogation of a behaviour. The
test count rises while assertion depth falls. What is established is the
direction and that it holds on both platforms, which is more than any other
outcome here does.

**This qualifies the recommendation from F-1.6.1.** The cross-check buys a
correctness floor on Opus and costs test strength on both platforms. Where the
floor is already perfect — SOL — it is a net loss: no correctness gain, slightly
worse structure, measurably weaker suites.

---

## Caveats

- **Single kata and prompt.** All conclusions are about Claim Office under
  Example Mapping.
- **`cost_usd` is a list-price comparison value, not an invoice.** For pi runs it
  comes from token counts and the price table, never from pi's own inline figures.
- **`predictions_correct_rate` is a pooled rate**, not a per-run mean, so it
  carries no standard deviation and its trophies rest on a smaller margin than
  the other rows.
- **Mutation Score was measured after the fact**, in a single pass over all forty
  runs, and was not part of the RQ's original outcome set. It is the source of
  F-1.6.4 and of nothing else here.
- **The SOL v1.6 mutation cell is n=9.** The excluded run is an instrument
  failure, documented in the Overview.
