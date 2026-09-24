# Findings — RQ-gpt6-sol-vs-gpt56-sol

## Key result

**GPT-6 Sol matches GPT-5.6 Sol on the canonical Predictive TDD workflow and
wins on price.** Both models reach full Correctness (external) on both katas in
every one of the ten runs each, and no code-quality axis separates them beyond
one standard deviation on Claim Office. What does separate them is cost and
wall-clock:

| | Claim Office | Game of Life |
|---|---|---|
| `cost_usd` ↓ | $1.24 vs $4.49 (**−72 %**) | $0.49 vs $1.49 (**−67 %**) |
| `duration_seconds` ↓ | 1301 vs 1750 (−26 %) | 573 vs 727 (**−21 %**) |
| Correctness (external) | 1.00 vs 1.00 | 1.00 vs 1.00 |

The answer to the RQ is therefore yes on all three axes, but the gain is
**efficiency, not quality**: the workflow produces the same code for a third of
the money.

Two measurement caveats shape how the tables below may be read, each carried by
its own finding: Mutation Score is unmeasurable in two Claim Office runs whose
suites drive only a spawned CLI (F-1.10.2), and `tests_total` undercounts
table-driven suites (F-1.10.3). Neither is a model defect and neither may be
quoted as one.

Scope: one workflow (`exact-ptdd-v1-pi`), one prompt style (Example Mapping),
one stack (TypeScript), one route (pi provider `openai-codex`), n=5 per cell.

## Overview

Cell means ± standard deviation. **G6** is `gpt-6-sol-codex`, **G5.6** is
`gpt-5-6-sol-codex`; both on `exact-ptdd-v1-pi` / Example Mapping /
TypeScript.

**The two katas are reported separately and never share a row.** Claim Office
(~600 Code Mass (APP), ~35 cycles) against Game of Life (~170, ~13) differ in
task size far more than the two models differ in anything, so a row spanning
both would rank the kata rather than the model. Within each kata the only thing
that varies is the model, which is the contest the trophies describe.

Bold + 🏆 marks the winner of a row; both cells carry it when the gap is smaller
than the larger of the two standard deviations, so a shared trophy reads as "no
difference". All four cells sit at Correctness (external) 1.00 and therefore
clear the 0.90 gate for the quality and cost trophies.

### Claim Office

Mutation Score higher = better; every other row lower = better.

| | G6 | G5.6 |
|---|---:|---:|
| Correctness (external) | 1.00 ± 0 | 1.00 ± 0 |
| Mutation Score (n=3 / n=5) | **0.77 ± 0.20** 🏆 | **0.87 ± 0.04** 🏆 |
| Code Mass (APP) | **655.6 ± 272.4** 🏆 | **583.2 ± 65.7** 🏆 |
| Production LoC | **112.8 ± 31.0** 🏆 | **143.2 ± 33.9** 🏆 |
| Complexity Peak | **4.6 ± 1.52** 🏆 | **4.4 ± 1.52** 🏆 |
| `cognitive_avg` | **2.10 ± 0.28** 🏆 | **1.93 ± 0.32** 🏆 |
| `mccabe_max` | **4.4 ± 0.55** 🏆 | **4.2 ± 1.10** 🏆 |
| `cc_longest_function` | **20.0 ± 10.3** 🏆 | **16.6 ± 3.85** 🏆 |
| `duration_seconds` | **1301 ± 589** 🏆 | **1750 ± 537** 🏆 |
| `cost_usd` | **$1.24 ± 0.56** 🏆 | $4.49 ± 3.04 |

Correctness carries no trophy: both cells are at 1.00 with σ 0, so the row is
saturated and settles nothing. It is shown to document that the quality and
cost trophies are not being awarded to a cell that skipped work.

`cost_usd` is the only row on this kata where the gap exceeds the larger
standard deviation. Every other row is a tie by the stated rule — on a kata this
size, at n=5, the two models are doing the same job to the same standard.

The Mutation Score row is over **three** G6 runs, not five: two are structurally
unmeasurable (F-1.10.2). The shared trophy reflects that 0.10 is well inside the
0.20 spread of those three; it is not a claim that the suites are equally strong.

### Game of Life

Same directions.

| | G6 | G5.6 |
|---|---:|---:|
| Correctness (external) | 1.00 ± 0 | 1.00 ± 0 |
| Mutation Score | **0.948 ± 0.031** 🏆 | **0.947 ± 0.012** 🏆 |
| Code Mass (APP) | **154.0 ± 15.9** 🏆 | 183.6 ± 22.4 |
| Production LoC | **37.0 ± 4.30** 🏆 | 43.8 ± 4.15 |
| Complexity Peak | **6.0 ± 0.71** 🏆 | **4.6 ± 1.82** 🏆 |
| `cognitive_avg` | **2.77 ± 0.38** 🏆 | **2.80 ± 1.08** 🏆 |
| `mccabe_max` | **4.2 ± 0.45** 🏆 | **4.6 ± 0.55** 🏆 |
| `cc_avg_loc_per_function` | **6.83 ± 1.03** 🏆 | **5.81 ± 0.81** 🏆 |
| `cc_longest_function` | **12.2 ± 2.17** 🏆 | **12.8 ± 1.10** 🏆 |
| `duration_seconds` | **573 ± 38** 🏆 | 727 ± 33 |
| `cost_usd` | **$0.49 ± 0.05** 🏆 | $1.49 ± 0.15 |

Four rows separate here where none but cost did on Claim Office: G6 writes less
code (Production LoC, Code Mass (APP)) and is faster and cheaper. The quality
rows stay tied — including Complexity Peak, where G6's higher mean (6.0 vs 4.6)
sits inside G5.6's 1.82 spread and so is not a difference.

**Shape and discipline** — context, deliberately no trophies. Test counts and
unit counts have no unambiguous direction, and `tests_total` is unreliable here
(F-1.10.3).

| | G6 / Claim | G5.6 / Claim | G6 / GoL | G5.6 / GoL |
|---|---:|---:|---:|---:|
| Smell Total | 0 ± 0 | 0 ± 0 | 0 ± 0 | 0 ± 0 |
| `cc_functions` | 12.2 ± 3.96 | 16.4 ± 5.27 | 4.8 ± 1.10 | 6.4 ± 1.34 |
| `tests_total` | 34.6 ± 18.9 | 39.6 ± 2.51 | 14.0 ± 0.71 | 11.2 ± 0.84 |
| Test LoC | 93.2 ± 53.3 | 211.6 ± 99.5 | 56.2 ± 3.27 | 58.2 ± 4.38 |
| `cycle_count` | 31.0 ± 18.0 | 39.8 ± 2.49 | 14.0 ± 0.71 | 11.2 ± 0.84 |
| `refactorings_applied` | 28.0 ± 16.6 | 40.0 ± 2.92 | 14.0 ± 0.71 | 11.4 ± 1.14 |
| `predictions_correct_rate` | 99.6 % | 99.5 % | 100 % | 99.1 % |
| `total_tokens` | 4.20 M ± 2.25 M | 6.41 M ± 4.62 M | 1.45 M ± 0.13 M | 1.45 M ± 0.13 M |
| `mutants_total` | 180.3 ± 116.0 | 122.6 ± 11.6 | 59.2 ± 15.2 | 56.6 ± 5.46 |
| `mutants_survived` | 57.0 ± 75.4 | 16.2 ± 4.09 | 3.4 ± 3.13 | 3.0 ± 0.71 |
| `mutants_no_coverage` | 32.7 ± 48.8 | 4.0 ± 1.22 | 0 ± 0 | 0 ± 0 |

Smell Total is 0 in all 20 runs. On these katas that is its established value,
so it is not evidence of anything here.

`cost_usd` is a list-price comparison value, not an invoice — nothing is billed
per token on the OpenAI subscription route.

---

## F-1.10.1 — GPT-6 Sol matches GPT-5.6 Sol on output and beats it on price

Across 20 runs the two models are indistinguishable on what they produce and
clearly separated on what they spend.

| | G6 / Claim | G5.6 / Claim | G6 / GoL | G5.6 / GoL |
|---|---:|---:|---:|---:|
| Correctness (external) | 1.00 | 1.00 | 1.00 | 1.00 |
| `tests_passing` | 5/5 | 5/5 | 5/5 | 5/5 |
| `completed_within_budget` | 5/5 | 5/5 | 5/5 | 5/5 |
| `cost_usd` | $1.24 | $4.49 | $0.49 | $1.49 |
| `duration_seconds` | 1301 | 1750 | 573 | 727 |

Correctness is saturated: all 20 runs pass the external acceptance suite in full
and the internal suite green. No quality row separates the models by more than
the larger standard deviation on Claim Office, and on Game of Life only the two
size rows do — in G6's favour (Production LoC 37.0 against 43.8, Code Mass (APP)
154.0 against 183.6).

The cost gap is the robust result. It holds on both katas, at similar
proportion (−72 % and −67 %), and on Game of Life the standard deviations are
tight enough (± $0.05 against ± $0.15) that the two cells do not come close to
touching.

On Claim Office the token counts point the same way but do not establish it:
4.20 M ± 2.25 M against 6.41 M ± 4.62 M is a tie at these spreads. The cost gap
there is larger than the token gap because the two models carry different
tariffs, so `total_tokens` is the honest axis for "how much work was done" and
`cost_usd` for "what it would have been billed".

Practical reading: on this workflow there is no quality reason to stay on
GPT-5.6 Sol, and a strong price reason to move.

---

## F-1.10.2 — Mutation testing is blind to suites that drive only a spawned CLI

Two of the five G6 Claim Office runs score exactly `mutation_score = 0.000`,
with every mutant surviving (93/93 and 42/42) and per-test coverage 0. Both
reach Correctness (external) 1.00 with a green internal suite, so the zero is
not a weak suite — it is an unmeasurable one.

The cause is the test style. Those two suites import **nothing** from the
production modules; every test runs the program by `spawnSync`-ing the CLI as a
child process. Stryker activates a mutant inside the test process, so a
subprocess loads unmutated code from disk and no mutant can ever be killed. The
correlation across all ten Claim Office runs is exact:

| in-process imports from `./src` | runs | Mutation Score |
|---|---:|---|
| 0 | 2 (both G6) | 0.000, 0.000 |
| ≥ 1 | 8 (3 G6, 5 G5.6) | 0.541 – 0.914 |

Consequences:

- **The two runs are excluded from the Mutation Score row**, which is why the G6
  Claim Office cell is n=3. Including them yields 0.46 ± 0.44, a number that
  describes the instrument rather than the model.
- The same applies to `mutants_survived` and `mutants_no_coverage`, which are
  computed from the same reports and excluded on the same runs.
- Game of Life is unaffected: no run there has a CLI-only suite, and all ten
  score 0.89–0.97.

There is a real behavioural difference underneath, and it is the part worth
carrying forward: **G6 produced a CLI-only suite in 2 of 5 Claim Office runs,
G5.6 in 0 of 5.** At n=5 that is a tendency, not an established rate. It matters
beyond this RQ because such a suite is invisible to mutation testing while
looking healthy on every other metric — Correctness (external), `tests_passing`
and coverage all report success.

This is a property of the lab's mutation stage, not of this RQ. Any TypeScript
RQ with `mutation_score` in its outcomes on a CLI kata can hit it, and the check
is cheap: a run whose spec has no `from './…'` import cannot be mutation-scored.

---

## F-1.10.3 — `tests_total` counts `it(` literals, so table-driven suites read as one test

One G6 Claim Office run reports `tests_total: 1` against `cycle_count: 42`. The
suite is not thin: it is table-driven, with a single literal `it(name, …)` inside
a loop over cases. The metric counts occurrences of the call in the source, so
every data-driven suite collapses to the number of loops rather than the number
of cases.

The effect on this RQ is confined to that cell, where it drags `tests_total` to
34.6 ± 18.9 against G5.6's 39.6 ± 2.51 and inflates the spread nearly eightfold.
`cycle_count` and `refactorings_applied` are affected in the same cell for the
same run.

`tests_total` is therefore reported as context only here, with no trophy, and no
statement in this RQ rests on it. The reliable suite-shape axis on this data is
Test LoC, which counts lines rather than call sites.

---

## F-1.10.4 — The TDD markers survive on the pi/Sol route at full strength

All 20 runs produce healthy marker values, which is what makes the discipline
metrics readable here at all:

| | G6 / Claim | G5.6 / Claim | G6 / GoL | G5.6 / GoL |
|---|---:|---:|---:|---:|
| `cycle_count` | 31.0 | 39.8 | 14.0 | 11.2 |
| `refactorings_applied` | 28.0 | 40.0 | 14.0 | 11.4 |
| `predictions_correct_rate` | 99.6 % | 99.5 % | 100 % | 99.1 % |

`refactorings_applied` tracks `cycle_count` almost exactly in every cell, and
`predictions_total` runs at roughly twice `cycle_count`, which is the healthy
shape for this workflow. Prediction accuracy is at or near ceiling in all four
cells — 925 of 929 pooled predictions correct — so it separates nothing between
the models and is reported as marker health rather than as an outcome.

This is worth recording because it is not universal: the same instrumentation
zeroes on Opus 5.5 under Claude Code, where the cycle runs inside encrypted
thinking blocks. On the pi/Sol route both models narrate each phase in plain
assistant text and the parser reads it.

The exception is the one run discussed in F-1.10.3, whose 42 cycles against a
single counted test make its marker values internally inconsistent. It is the
reason the G6 Claim Office cell shows σ 18.0 on `cycle_count` against G5.6's
2.49.
