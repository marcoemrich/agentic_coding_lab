# Findings — RQ-workflow-axis-gpt6-sol

## Key result

**On GPT-6 Sol the workflow does not decide whether the kata is solved — it
decides what the solution looks like.** All three arms reach Correctness
(external) 1.00 in all 30 runs, on both katas. What separates them is
structure and price:

| Claim Office | inline TDD | EXACT PTDD | + isolated Refactor |
|---|---:|---:|---:|
| Complexity Peak | 35.4 | 4.6 | 5.2 |
| Smell Total | 23.4 | 0.0 | 0.0 |
| `cost_usd` | $0.21 | $1.24 | $2.12 |

The inline-TDD baseline produces a working monolith: 2.2 functions, an average
function of 22.5 lines, a Complexity Peak of 35.4, and 23.4 ESLint/SonarJS
findings — at a sixth of the price. The EXACT arms produce a decomposed
product with zero findings and single-digit complexity.

Isolating the Refactor phase in a subagent does **not** reproduce the
structural gain it showed on GPT-5.6 Sol and native Opus. On Claim Office it
lands inside one standard deviation of inline PTDD on every structural axis
while costing 71 % more; on Game of Life it wins the per-function axes
modestly at 2.9× the cost.

Two measurement limits shape the tables below: Mutation Score is structurally
unmeasurable for CLI-driven suites, which removes the whole Claim Office
subagent cell (F-1.11.5), and Claim Office execution splits into two modes
whose spread exceeds every between-arm difference on that kata (F-1.11.4).

Scope: one model (`gpt-6-sol-codex`), one prompt style (Example Mapping), one
stack (TypeScript), one route (pi provider `openai-codex`), n=5 per cell.

## Overview

Cell means ± standard deviation. **B** is `baseline-inline-tdd-v1-pi`,
**P** is `exact-ptdd-v1-pi`, **P+S** is
`exact-ptdd-v1.1-refactor-subagent-pi`.

**The two katas are reported separately and never share a row.** Claim Office
(~550 Code Mass (APP) across the field) against Game of Life (~159) differ in
task size far more than the arms differ in anything, even though both carry 15
external acceptance scenarios.

Bold + 🏆 marks the winner of a row; cells share it when the gap is smaller
than the larger of the two standard deviations, so a shared trophy reads as
"no difference". All six cells sit at Correctness (external) 1.00 and
therefore clear the 0.90 gate for the quality and cost trophies. Rows in
*italics* have no unambiguous direction — they describe the shape of the
product, not its quality, and carry no trophy.

### Claim Office

Mutation Score higher = better; every other trophied row lower = better.

| | B | P | P+S |
|---|---:|---:|---:|
| Correctness (external) | 1.00 ± 0 | 1.00 ± 0 | 1.00 ± 0 |
| Correctness (internal) | 100 % | 100 % | 100 % |
| Smell Total | 23.4 ± 7.83 | **0.0 ± 0** 🏆 | **0.0 ± 0** 🏆 |
| Complexity Peak (`cognitive_max`) | 35.4 ± 11.2 | **4.6 ± 1.52** 🏆 | **5.2 ± 1.79** 🏆 |
| `cognitive_avg` | 12.41 ± 9.27 | **2.10 ± 0.28** 🏆 | **2.38 ± 0.46** 🏆 |
| `mccabe_max` | 14.4 ± 3.65 | **4.4 ± 0.55** 🏆 | **5.4 ± 1.67** 🏆 |
| `cc_avg_loc_per_function` | 22.5 ± 10.7 | **5.57 ± 0.69** 🏆 | **5.97 ± 1.24** 🏆 |
| `cc_median_loc_per_function` | 19.3 ± 14.6 | **3.6 ± 1.08** 🏆 | **4.2 ± 1.10** 🏆 |
| `cc_longest_function` | 36.0 ± 6.16 | **20.0 ± 10.3** 🏆 | **19.4 ± 2.61** 🏆 |
| Mutation Score | **0.94 ± 0.03** 🏆 *(n=5)* | **0.77 ± 0.20** 🏆 *(n=3)* | not measurable *(n=0)* |
| `duration_seconds` | **221 ± 34** 🏆 | 1301 ± 589 | 1825 ± 1839 |
| `total_tokens` | **435 k** 🏆 | 4.20 M | 5.11 M |
| `cost_usd` | **$0.21 ± 0.03** 🏆 | $1.24 ± 0.56 | $2.12 ± 2.42 |
| *Production LoC* | 70.2 ± 10.3 | 112.8 ± 31.0 | 119.8 ± 27.2 |
| *Code Mass (APP)* | 414.6 ± 17.7 | 655.6 ± 272.4 | 580.6 ± 101.3 |
| *`cc_functions`* | 2.2 ± 0.84 | 12.2 ± 3.96 | 13.6 ± 8.26 |
| *Test LoC* | 123.4 ± 17.2 | 93.2 ± 53.3 | 114.0 ± 28.8 |
| *`cycle_count`* | 6.8 ± 1.79 | 31.0 ± 18.0 | 13.0 ± 17.7 |
| *`refactorings_applied`* | 0.6 ± 0.55 | 28.0 ± 16.6 | 13.4 ± 17.4 |
| *`predictions_correct_rate`* | — | 99.6 % | 98.5 % |
| *`mutants_total` / survived* | 101.8 / 6.2 | 180.3 / 57.0 *(n=3)* | — |

Correctness carries no trophy: all three cells are at 1.00 with σ 0, so the
row is saturated and settles nothing. It is shown to document that the quality
and cost trophies are not going to a cell that skipped work.

The Mutation Score row is over the measurable runs only. Seven of the fifteen
EXACT runs on this kata — two in P, all five in P+S — produce a suite that
drives the CLI through `spawnSync` and imports no domain module, so every
mutant survives by construction and the score reads 0.0 (F-1.11.5). Those runs
are excluded rather than averaged in; the P+S cell has nothing left to report.
The shared trophy between B and P reflects that the 0.17 gap sits inside P's
σ 0.20 at n=3 — it is not a claim that the suites are equally strong.

`predictions_correct_rate` is not a contest: only the EXACT arms emit
prediction markers, and both sit at ceiling.

### Game of Life

Same directions.

| | B | P | P+S |
|---|---:|---:|---:|
| Correctness (external) | 1.00 ± 0 | 1.00 ± 0 | 1.00 ± 0 |
| Correctness (internal) | 100 % | 100 % | 100 % |
| Smell Total | 3.0 ± 2.74 | **0.0 ± 0** 🏆 | **0.0 ± 0** 🏆 |
| Complexity Peak (`cognitive_max`) | 14.6 ± 8.02 | **6.0 ± 0.71** 🏆 | **5.0 ± 1.87** 🏆 |
| `cognitive_avg` | 12.00 ± 9.43 | **2.77 ± 0.38** 🏆 | **2.23 ± 0.96** 🏆 |
| `mccabe_max` | 7.8 ± 3.56 | **4.2 ± 0.45** 🏆 | **4.0 ± 0.71** 🏆 |
| `cc_avg_loc_per_function` | 13.10 ± 7.21 | 6.83 ± 1.03 | **5.09 ± 0.62** 🏆 |
| `cc_median_loc_per_function` | 13.1 ± 7.21 | **5.8 ± 2.68** 🏆 | **3.8 ± 0.84** 🏆 |
| `cc_longest_function` | 17.8 ± 9.68 | **12.2 ± 2.17** 🏆 | **10.8 ± 1.79** 🏆 |
| Mutation Score | **0.95 ± 0.00** 🏆 | **0.95 ± 0.03** 🏆 | **0.95 ± 0.02** 🏆 |
| `duration_seconds` | **118 ± 33** 🏆 | 573 ± 38 | 1258 ± 89 |
| `total_tokens` | **158 k** 🏆 | 1.45 M | 3.03 M |
| `cost_usd` | **$0.09 ± 0.03** 🏆 | $0.49 ± 0.05 | $1.41 ± 0.12 |
| *Production LoC* | 24.2 ± 3.70 | 37.0 ± 4.30 | 45.2 ± 3.77 |
| *Code Mass (APP)* | 154.2 ± 24.2 | 154.0 ± 15.9 | 168.8 ± 14.8 |
| *`cc_functions`* | 1.6 ± 0.55 | 4.8 ± 1.10 | 8.4 ± 1.14 |
| *Test LoC* | 67.2 ± 9.31 | 56.2 ± 3.27 | 51.0 ± 7.58 |
| *`cycle_count`* | 6.4 ± 2.70 | 14.0 ± 0.71 | 12.4 ± 1.34 |
| *`refactorings_applied`* | 0.2 ± 0.45 | 14.0 ± 0.71 | 12.4 ± 1.34 |
| *`predictions_correct_rate`* | — | 100 % | 100 % |
| *`mutants_total` / survived* | 42.4 / 2.0 | 59.2 / 3.4 | 65.4 / 3.2 |

---

## F-1.11.1 — The workflow decides the shape of the solution, not whether there is one

Every cell of this RQ solves its kata completely: 30 of 30 runs at Correctness
(external) 1.00, 30 of 30 with a green suite, 30 of 30 inside the time budget.
On a model this capable, a plain "write a failing test first" instruction is
enough to pass the external acceptance suite of both katas.

The separation is entirely structural, and it is large:

| | Claim Office B → P | Game of Life B → P |
|---|---|---|
| Complexity Peak | 35.4 → 4.6 (−87 %) | 14.6 → 6.0 (−59 %) |
| `cognitive_avg` | 12.41 → 2.10 (−83 %) | 12.00 → 2.77 (−77 %) |
| `mccabe_max` | 14.4 → 4.4 (−69 %) | 7.8 → 4.2 (−46 %) |
| `cc_avg_loc_per_function` | 22.5 → 5.57 (−75 %) | 13.10 → 6.83 (−48 %) |
| Smell Total | 23.4 → 0.0 | 3.0 → 0.0 |

This is the answer to the RQ's first half. EXACT Coding PTDD on GPT-6 Sol does
not buy correctness — there is none left to buy — it buys a product a human can
still read afterwards.

---

## F-1.11.2 — What the baseline actually produces is one large function

The baseline's quality numbers are not a mild degradation of the EXACT arms.
They describe a different artefact.

| | B | P | P+S |
|---|---:|---:|---:|
| `cc_functions` (Claim Office) | 2.2 | 12.2 | 13.6 |
| `cc_avg_loc_per_function` | 22.5 | 5.57 | 5.97 |
| `cc_longest_function` | 36.0 | 20.0 | 19.4 |
| Production LoC | 70.2 | 112.8 | 119.8 |
| Code Mass (APP) | 414.6 | 655.6 | 580.6 |

Claim Office has fifteen acceptance scenarios covering premium calculation,
claim settlement, caps and loyalty discounts. The baseline implements all of
them correctly across 2.2 functions and 70 Production LoC. It is the smallest
product in the field on both Production LoC and Code Mass (APP) — and it holds
its entire domain in one function averaging 22.5 lines with a Complexity Peak
of 35.4.

That is why Code Mass (APP) and Production LoC carry no trophy in this RQ. The
lowest value belongs to the arm that decomposed least, so on this factor the
metric ranks compactness of expression, not economy of design. The same
inversion appears on Game of Life, where the baseline's 154.2 Code Mass (APP)
is indistinguishable from PTDD's 154.0 while its Complexity Peak is 2.4× higher.

---

## F-1.11.3 — Isolating the Refactor phase does not replicate on GPT-6 Sol

On GPT-5.6 Sol and native Opus 5 the isolated refactor subagent improved every
structural measure (`RQ-ptdd-refactor-subagent-cross-model`, F-1.7.1). On
GPT-6 Sol that result holds only on the small kata, and only in part.

| Measure | Claim Office P → P+S | Game of Life P → P+S |
|---|---|---|
| Complexity Peak | 4.6 → 5.2 (worse, inside σ) | 6.0 → 5.0 (−17 %, inside σ) |
| `cognitive_avg` | 2.10 → 2.38 (worse, inside σ) | 2.77 → 2.23 (−19 %, inside σ) |
| `mccabe_max` | 4.4 → 5.4 (worse, inside σ) | 4.2 → 4.0 (inside σ) |
| `cc_avg_loc_per_function` | 5.57 → 5.97 (worse, inside σ) | 6.83 → 5.09 (**−25 %**) |
| `cc_median_loc_per_function` | 3.6 → 4.2 (worse, inside σ) | 5.8 → 3.8 (−34 %, inside σ) |
| `cc_longest_function` | 20.0 → 19.4 (inside σ) | 12.2 → 10.8 (inside σ) |

On Claim Office every structural axis moves the *wrong* way, all of them within
one standard deviation — the honest reading is "no effect", not "harm". On Game
of Life every axis moves the right way, but only `cc_avg_loc_per_function`
clears its standard deviation.

The mechanism that did carry over is the one F-1.7.2 described: the improvement
comes from splitting the product, not from shrinking it. On Game of Life
`cc_functions` rises 4.8 → 8.4 (+75 %) and Code Mass (APP) 154.0 → 168.8 (+10 %)
while the average function shrinks by a quarter.

What has changed is the price of that split. On GPT-5.6 Sol the treatment cost
3.8× and took 3.3× longer; here it costs 2.9× on Game of Life ($0.49 → $1.41)
and 1.7× on Claim Office ($1.24 → $2.12) for a structural gain that is mostly
inside the noise. On this model the isolated Refactor subagent is not the
default-carrying arm it is on Opus.

---

## F-1.11.4 — Claim Office execution splits into two modes, and the spread swallows the arms

The Claim Office cells of both EXACT arms are bimodal. Some runs narrate a
cycle per behaviour; others batch most of the spec into a handful of test
blocks. `test_blocks` is read from the tool sequence and needs no markers, so
it is the independent check on `cycle_count`:

| Arm | `cycle_count` per run | `test_blocks` per run | `duration_seconds` |
|---|---|---|---|
| P | 3, 23, 41, 42, 46 | 5, 4, 42, 27, 48 | 376 … 1906 |
| P+S | 1, 2, 9, 9, 44 | 5, 3, 10, 11, 5 | 447 … 5017 |

Both readings agree that the behaviour is real and not a marker artefact: the
run at `cycle_count` 1 wrote 48 test cases in 5 blocks and finished in 755 s;
the run at 44 wrote 3 cases in 5 blocks over 5017 s and 16.5 M tokens. The
consequences reach every per-run metric — the P+S cell's `cost_usd` σ of 2.42
on a mean of 2.12 comes almost entirely from that one run ($6.34 against
$0.48–$1.67 for the other four).

Game of Life shows none of this. There `cycle_count` spans 11–15 across both
EXACT arms, `test_blocks` 12–17, and the duration σ is 7 % of the mean.

The practical consequence for this RQ is stated rather than worked around: on
Claim Office, differences between P and P+S below roughly one third of the cell
mean are not resolvable at n=5. Every P-vs-P+S statement in F-1.11.3 that rests
on that kata is reported as "no effect" for this reason.

---

## F-1.11.5 — A CLI-driven suite cannot be mutation-scored, and it took out a whole cell

Seven of the fifteen EXACT runs on Claim Office report `mutation_score` 0.0
with `mutants_survived` exactly equal to `mutants_total` — 91/91, 112/112,
114/114, 126/126, 155/155 in P+S, and 42/42, 93/93 in P.

The cause is structural, not a suite defect. Those runs place every assertion
behind `spawnSync('node', ['--import', 'tsx', 'src/cli.ts'])` and import no
domain module into the test process. The mutation stage excludes the CLI
adapter from mutation on TypeScript and mutates the domain files, which no
in-process test ever loads — so every mutant survives, by construction. The
runs themselves are healthy: all seven pass their own suite and score
Correctness (external) 1.00.

The check is one grep: a spec whose imports contain no `from './…'` of a
domain module cannot be mutation-scored on this stack.

The effect on this RQ is that the Claim Office P+S cell has **no** measurable
mutation replicate and is reported as such, and that the P cell reports n=3.
No statement in this RQ rests on Claim Office mutation data. Game of Life is
unaffected — all 15 runs there are measurable and land at 0.95 in every arm.

---

## F-1.11.6 — Suite strength does not follow workflow structure

Where mutation is measurable, the three arms are indistinguishable:

| | B | P | P+S |
|---|---:|---:|---:|
| Game of Life Mutation Score | 0.953 ± 0.003 | 0.948 ± 0.030 | 0.952 ± 0.021 |
| `mutants_total` / survived | 42.4 / 2.0 | 59.2 / 3.4 | 65.4 / 3.2 |
| Claim Office Mutation Score | 0.941 ± 0.032 *(n=5)* | 0.768 ± 0.197 *(n=3)* | — |

On Game of Life the mutant population grows with the decomposition — 42.4
mutants in the baseline against 65.4 in P+S, because more functions mean more
mutable sites — while the surviving count stays at 2–3 in every arm. The ratio
holds steady only because numerator and denominator move together, which is why
the pair is reported and not the score alone.

The reading is that the EXACT structure earns its cost on the production side,
not on the test side. A 1.5× larger mutant population caught at the same rate
is a better-tested product in absolute terms; it is not a stronger suite per
line of test code, and Test LoC actually falls from 67.2 in the baseline to
51.0 in P+S.
