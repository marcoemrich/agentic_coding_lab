# Findings — RQ-workflow-axis-gpt61-sol

## Key result

**On GPT-6.1 Sol the EXACT arms still decide the shape of the solution, but the
plain inline-TDD baseline is no monolith any more.** All 30 runs reach
Correctness (external) 1.00 on both katas. The baseline on Claim Office writes
12.4 functions with a `cognitive_max` of 9.0 — four of its five runs carry no
Smell Total finding at all. What still separates the arms:

| Claim Office | inline TDD | EXACT PTDD | + isolated Refactor |
|---|---:|---:|---:|
| `cognitive_avg` | 3.23 | 1.47 | 1.33 |
| `cc_longest_function` | 20.4 | 12.0 | 14.2 |
| Mutation Score | 0.71 | 0.90 *(n=3)* | 0.91 *(n=3)* |
| `red_batch_max` | 9.8 | 1.0 | 1.0 |
| `cost_usd` | $0.33 | $1.47 | $4.44 |

Three consequences, each carried by its own finding:

- **Structure still buys smaller units and a stronger suite on Claim Office**
  (F-1.12.1, F-1.12.4). The baseline lets 53.2 of 181.8 mutants survive; the
  EXACT arms about 11 of 115–123.
- **The mechanism differs by kata.** On Claim Office the baseline writes 7–13
  failing tests at once; on Game of Life it writes one at a time, like the EXACT
  arms, and still ends with a larger `cognitive_max` — there the difference is
  that it never refactors (F-1.12.3).
- **The isolated Refactor subagent adds little** — inside the noise of inline
  PTDD on most axes, at 3.0× (Claim Office) and 2.8× (Game of Life) the price
  (F-1.12.2).

Scope: one model (`gpt-6-1-sol-codex`), one prompt style (Example Mapping), one
stack (TypeScript), one route (pi provider `openai-codex`), n=5 per cell.

## Overview

Cell means ± standard deviation. **B** is `baseline-inline-tdd-v1-pi`,
**P** is `exact-ptdd-v1-pi`, **P+S** is
`exact-ptdd-v1.1-refactor-subagent-pi`.

**The two katas are reported separately and never share a row.** Claim Office
(~590 Code Mass (APP)) and Game of Life (~165) differ in task size far more than
the arms differ in anything.

Bold + 🏆 marks the winner of a row; cells share it when the gap is smaller
than the larger of the two standard deviations, so a shared trophy reads as
"no difference". This is the same rule as in RQ-workflow-axis-gpt6-sol. All six
cells sit at Correctness (external) 1.00 and therefore clear the 0.90 gate for
the quality and cost trophies. Rows in *italics* have no unambiguous direction
and carry no trophy.

`tdd_discipline`, `skip_events` and the other columns that do not compare
across the test-list boundary are not shown: B writes no test list, P and P+S
do. `red_batch_max` and `tdd_discipline_step` compare everywhere.

### Claim Office

Mutation Score and `tdd_discipline_step` higher = better; every other trophied
row lower = better.

| | B | P | P+S |
|---|---:|---:|---:|
| Correctness (external) | 1.00 ± 0 | 1.00 ± 0 | 1.00 ± 0 |
| Correctness (internal) | 100 % | 100 % | 100 % |
| Smell Total | **3.80 ± 8.50** 🏆 | **0.00 ± 0** 🏆 | **0.00 ± 0** 🏆 |
| `cognitive_max` | **9.00 ± 6.63** 🏆 | **3.00 ± 1.41** 🏆 | **2.40 ± 0.55** 🏆 |
| `cognitive_avg` | 3.23 ± 0.91 | **1.47 ± 0.32** 🏆 | **1.33 ± 0.15** 🏆 |
| `mccabe_max` | 6.40 ± 1.95 | **3.80 ± 1.10** 🏆 | **3.20 ± 0.45** 🏆 |
| `cc_avg_loc_per_function` | 7.55 ± 0.94 | **4.56 ± 0.41** 🏆 | **4.36 ± 0.26** 🏆 |
| `cc_median_loc_per_function` | 6.20 ± 1.60 | **3.50 ± 0.61** 🏆 | **3.20 ± 0.45** 🏆 |
| `cc_longest_function` | 20.40 ± 4.93 | **12.00 ± 1.87** 🏆 | **14.20 ± 3.03** 🏆 |
| Mutation Score | 0.706 ± 0.093 *(n=5)* | **0.898 ± 0.024** 🏆 *(n=3)* | **0.910 ± 0.017** 🏆 *(n=3)* |
| `red_batch_max` | 9.80 ± 2.68 | **1.00 ± 0** 🏆 | **1.00 ± 0** 🏆 |
| `tdd_discipline_step` | 0.18 ± 0.03 | **1.00 ± 0** 🏆 | **1.00 ± 0** 🏆 |
| `duration_seconds` | **450 ± 40** 🏆 | 2171 ± 190 | 4683 ± 633 |
| `total_tokens` | **960 k** 🏆 | 8.97 M | 16.27 M |
| `cost_usd` | **$0.33 ± 0.02** 🏆 | $1.47 ± 0.58 | $4.44 ± 0.35 |
| *Production LoC* | 142.2 ± 13.1 | 130.2 ± 8.0 | 150.6 ± 8.8 |
| *Code Mass (APP)* | 615.8 ± 19.8 | 561.2 ± 18.1 | 582.0 ± 14.9 |
| *`cc_functions`* | 12.4 ± 2.3 | 18.6 ± 2.0 | 25.2 ± 2.6 |
| *`tests_total`* | 24.2 ± 3.0 | 48.8 ± 1.1 | 42.4 ± 0.5 |
| *Test LoC* | 185.2 ± 34.1 | 148.2 ± 54.7 | 186.8 ± 19.3 |
| *`mutants_total` / survived* | 181.8 / 53.2 | 114.3 / 11.7 *(n=3)* | 122.7 / 11.0 *(n=3)* |
| *of those uncovered* | 20.6 ± 29.1 | 3.0 ± 0 *(n=3)* | 3.0 ± 0 *(n=3)* |
| *`refactor_events`* | 0.8 ± 0.4 | 19.6 ± 3.4 | 31.0 ± 5.1 |
| *`cycles_closed`* | 10.2 ± 1.3 | 25.0 ± 1.0 | 22.6 ± 2.9 |
| *`chain_suite_runs`* | 21.6 ± 2.1 | 123.6 ± 11.9 | 171.0 ± 25.3 |

Two shared rows need reading. **Smell Total** and **`cognitive_max`** give B a
trophy only because one of its runs carries 19 findings and a `cognitive_max`
of 20; the other four sit at 0 findings and 4–10. The rule shares the trophy
because that one run inflates B's σ past the gap — read both rows as "B is not
reliably worse here", not as "B is as good".

The Mutation Score row is over the measurable runs only. Four of the ten EXACT
runs — two in P, two in P+S — produce a suite that drives the CLI through
`spawnSync` and imports no domain module, so every mutant survives by
construction and the score reads 0.0 (F-1.12.5). Those runs are excluded rather
than averaged in.

### Game of Life

Same directions.

| | B | P | P+S |
|---|---:|---:|---:|
| Correctness (external) | 1.00 ± 0 | 1.00 ± 0 | 1.00 ± 0 |
| Correctness (internal) | 100 % | 100 % | 100 % |
| Smell Total | 3.20 ± 1.79 | **0.00 ± 0** 🏆 | **0.00 ± 0** 🏆 |
| `cognitive_max` | 15.20 ± 4.02 | **7.00 ± 0** 🏆 | **5.40 ± 1.95** 🏆 |
| `cognitive_avg` | 15.10 ± 4.25 | 3.40 ± 0.72 | **2.49 ± 0.59** 🏆 |
| `mccabe_max` | 10.40 ± 1.34 | 5.00 ± 0 | **4.20 ± 0.45** 🏆 |
| `cc_avg_loc_per_function` | 17.53 ± 6.51 | **6.00 ± 1.10** 🏆 | **5.38 ± 0.69** 🏆 |
| `cc_median_loc_per_function` | 17.20 ± 6.98 | **5.00 ± 2.55** 🏆 | **4.10 ± 0.74** 🏆 |
| `cc_longest_function` | 23.80 ± 2.17 | **10.60 ± 1.67** 🏆 | **10.40 ± 2.19** 🏆 |
| Mutation Score | **0.954 ± 0.001** 🏆 | **0.947 ± 0.014** 🏆 | **0.944 ± 0.013** 🏆 |
| `red_batch_max` | 1.00 ± 0 | 1.00 ± 0 | 1.00 ± 0 |
| `tdd_discipline_step` | 1.00 ± 0 | 1.00 ± 0 | 1.00 ± 0 |
| `duration_seconds` | **195 ± 13** 🏆 | 649 ± 36 | 1405 ± 160 |
| `total_tokens` | **269 k** 🏆 | 1.51 M | 2.65 M |
| `cost_usd` | **$0.13 ± 0.02** 🏆 | $0.39 ± 0.03 | $1.10 ± 0.09 |
| *Production LoC* | 26.4 ± 4.5 | 40.6 ± 3.4 | 48.2 ± 3.8 |
| *Code Mass (APP)* | 149.8 ± 9.0 | 171.4 ± 10.3 | 172.2 ± 17.3 |
| *`cc_functions`* | 1.8 ± 0.8 | 6.0 ± 0.7 | 8.8 ± 1.5 |
| *`tests_total`* | 13.0 ± 0.7 | 15.2 ± 0.4 | 13.8 ± 1.1 |
| *Test LoC* | 93.4 ± 4.3 | 72.4 ± 5.9 | 69.2 ± 4.2 |
| *`mutants_total` / survived* | 43.6 / 2.0 | 49.4 / 2.6 | 63.0 / 3.6 |
| *of those uncovered* | 0 | 0 | 0 |
| *`refactor_events`* | 0.0 ± 0 | 5.2 ± 1.5 | 8.6 ± 2.3 |
| *`cycles_closed`* | 3.8 ± 0.4 | 3.4 ± 0.5 | 3.0 ± 0.7 |
| *`chain_suite_runs`* | 15.6 ± 1.5 | 36.6 ± 0.5 | 54.0 ± 5.9 |

`red_batch_max` and `tdd_discipline_step` carry no trophy on Game of Life: all
three cells sit at the same value, so there is no contest. The Mutation Score
row is a three-way tie — on this kata the suites are equally strong.

---

## F-1.12.1 — Structure still buys smaller units, but the baseline is no longer a monolith

Both EXACT arms beat the baseline on every per-function measure on both katas:
`cognitive_avg`, `mccabe_max`, `cc_avg_loc_per_function`,
`cc_median_loc_per_function` and `cc_longest_function`. On Game of Life the gap
is large — `cognitive_avg` 15.10 against 3.40 and 2.49, a baseline of 1.8
functions against 6.0 and 8.8.

On Claim Office the gap is narrower than the Game of Life numbers suggest:

| Claim Office, B | run 1 | run 2 | run 3 | run 4 | run 5 |
|---|---:|---:|---:|---:|---:|
| Smell Total | 19 | 0 | 0 | 0 | 0 |
| `cognitive_max` | 20 | 10 | 4 | 7 | 4 |
| `cc_functions` | 9 | 14 | 12 | 12 | 15 |

Four of five baseline runs produce a decomposed product with no findings and a
`cognitive_max` of 4–10, against 2–5 in the EXACT runs. One run
writes a larger block with 19 findings. The per-function averages still
separate cleanly (`cc_avg_loc_per_function` 7.55 ± 0.94 against 4.56 and 4.36),
so EXACT keeps its advantage on unit size; on the peak and on Smell Total it
holds only on average.

Read next to RQ-workflow-axis-gpt6-sol for direction only (separate RQ, no
causal model comparison): the GPT-6 Sol baseline on the same kata wrote 2.2
functions with a `cognitive_max` of 35.4 and 23.4 findings. The workflow's
structural advantage on Claim Office is smaller on GPT-6.1 Sol because the
unscaffolded starting point is better, not because the EXACT arms got worse.

---

## F-1.12.2 — The isolated Refactor subagent adds little at three times the price

| | Claim Office P | Claim Office P+S | Game of Life P | Game of Life P+S |
|---|---:|---:|---:|---:|
| `cognitive_avg` | 1.47 ± 0.32 | 1.33 ± 0.15 | 3.40 ± 0.72 | 2.49 ± 0.59 |
| `mccabe_max` | 3.80 ± 1.10 | 3.20 ± 0.45 | 5.00 ± 0 | 4.20 ± 0.45 |
| `cc_longest_function` | 12.00 ± 1.87 | 14.20 ± 3.03 | 10.60 ± 1.67 | 10.40 ± 2.19 |
| `cc_functions` | 18.6 | 25.2 | 6.0 | 8.8 |
| `cost_usd` | $1.47 | $4.44 (3.0×) | $0.39 | $1.10 (2.8×) |
| `duration_seconds` | 2171 | 4683 (2.2×) | 649 | 1405 (2.2×) |

On Claim Office every structural difference between P and P+S sits inside one
standard deviation, and `cc_longest_function` points the other way. On Game of
Life P+S wins `cognitive_avg` and `mccabe_max` modestly. In both katas the
isolated arm splits the product further (`cc_functions` +35 % and +47 %) and
records more `refactor_events` (31.0 against 19.6, 8.6 against 5.2) — the
subagent refactors more, and the product barely changes.

The price does change: 3.0× and 2.8× the list price, 2.2× the wall-clock on
both katas. This is the pattern of RQ-workflow-axis-gpt6-sol, not the clear
structural gain the same arm showed on GPT-5.6 Sol and native Opus 5
(RQ-ptdd-refactor-subagent-cross-model F-1.7.1).

---

## F-1.12.3 — Step size explains Claim Office; on Game of Life the difference is refactoring

| | Claim Office B | Claim Office P / P+S | Game of Life B | Game of Life P / P+S |
|---|---:|---:|---:|---:|
| `red_batch_max` | 9.80 ± 2.68 | 1.00 | 1.00 | 1.00 |
| `tdd_discipline_step` | 0.18 | 1.00 | 1.00 | 1.00 |
| `cycles_closed` | 10.2 | 25.0 / 22.6 | 3.8 | 3.4 / 3.0 |
| `tests_total` | 24.2 | 48.8 / 42.4 | 13.0 | 15.2 / 13.8 |
| `refactor_events` | 0.8 | 19.6 / 31.0 | 0.0 | 5.2 / 8.6 |

On Claim Office the baseline writes 7–13 failing tests at once, closes 10.2
cycles and ends with half the tests of the EXACT arms. Every EXACT run writes
exactly one failing test at a time. This is the step-size mechanism measured on
Opus 5 and Opus 5.5 (RQ-opus55-current-workflow F-2.4.6).

On Game of Life the baseline is indistinguishable on step size — one test at a
time, `tdd_discipline_step` 1.00, a cycle count at the level of the EXACT arms —
and still ends with `cognitive_max` 15.2 against 7.0 and 5.4. The column that
separates it is `refactor_events`: zero in all five runs. The baseline grows a
correct solution test by test and never restructures it; the EXACT arms
refactor between green runs 5–9 times.

H4 holds on Claim Office and fails on Game of Life. Step size is one mechanism,
not the only one: a baseline that takes small steps but skips Refactor still
produces the larger function.

---

## F-1.12.4 — The baseline suite is weak on Claim Office and equal on Game of Life

| | B | P | P+S |
|---|---:|---:|---:|
| Claim Office Mutation Score | 0.706 ± 0.093 *(n=5)* | 0.898 ± 0.024 *(n=3)* | 0.910 ± 0.017 *(n=3)* |
| Claim Office survived / total | 53.2 / 181.8 | 11.7 / 114.3 | 11.0 / 122.7 |
| Claim Office uncovered | 20.6 ± 29.1 | 3.0 | 3.0 |
| Game of Life Mutation Score | 0.954 ± 0.001 | 0.947 ± 0.014 | 0.944 ± 0.013 |
| Game of Life survived / total | 2.0 / 43.6 | 2.6 / 49.4 | 3.6 / 63.0 |

On Claim Office the gap is in the absolute count, not only in the ratio: the
baseline lets 53.2 mutants survive against about 11 in either EXACT arm, while
its mutant population is only 1.5–1.6× larger. Part of it is untested code —
20.6 uncovered mutants on average, with a wide spread across runs. This is the
suite that F-1.12.3 describes: 24 tests written in batches of 7–13.

On Game of Life all three suites are equally strong. The baseline's suite is
built one test at a time there too, which fits the step-size reading: where the
baseline takes small steps, its suite does not fall behind.

---

## F-1.12.5 — Four of ten EXACT suites on Claim Office cannot be mutation-scored

Four runs score exactly 0.000 with every mutant surviving: two in P, two in
P+S. All four test the kata through a spawned CLI only (`spawnSync`) and import
nothing from `./office.js`; the six measurable EXACT runs import the domain
module directly. The mutation stage excludes the CLI adapter (CLAUDE.md,
`mutation_score`), so a suite that only drives the CLI never executes a mutated
line in-process.

| | runs | in-process import of `./office.js` | Mutation Score |
|---|---:|---|---|
| P | 3 | yes | 0.870–0.917 |
| P | 2 | no, `spawnSync` only | 0.000 |
| P+S | 3 | yes | 0.895–0.928 |
| P+S | 2 | no, `spawnSync` only | 0.000 |

These are instrument failures, not suite failures: all four runs pass
Correctness (external) 1.00 and their internal suites are green. The same
pattern took out the whole P+S cell on GPT-6 Sol
(RQ-workflow-axis-gpt6-sol F-1.11.5). The baseline is unaffected here — all
five of its suites import the domain module.

---

## F-1.12.6 — The EXACT arms cost 3.1× to 13.6× the baseline

| | B | P | P+S |
|---|---:|---:|---:|
| Claim Office `cost_usd` | **$0.33** 🏆 | $1.47 (4.5×) | $4.44 (13.6×) |
| Game of Life `cost_usd` | **$0.13** 🏆 | $0.39 (3.1×) | $1.10 (8.6×) |
| Claim Office `total_tokens` | 960 k | 8.97 M | 16.27 M |
| Game of Life `total_tokens` | 269 k | 1.51 M | 2.65 M |
| Claim Office `duration_seconds` | 450 | 2171 | 4683 |
| Game of Life `duration_seconds` | 195 | 649 | 1405 |

`cost_usd` is a list-price comparison value, not a billed amount: the
`openai-codex` route is a flat-rate subscription. Prices from `PRICES` in
`compute-cost.py` ($2 / $10 / $0.10 cached per MTok); the long-context step
above 272k is not modelled.

The P cell on Claim Office carries a wide token spread (8.97 M ± 3.44 M) at a
narrow duration spread (2171 ± 190 s), which is why its cost σ ($0.58) is
larger than that of the more expensive P+S cell ($0.35).
