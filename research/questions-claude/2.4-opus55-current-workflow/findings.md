# Findings — RQ-opus55-current-workflow

## Key result

**The workflow gap is larger on Opus 5.5 than on Opus 5.** Every quality axis
that separates at all separates *more* between the minimal inline instruction and
EXACT Coding on the newer model. Columns compare the inline arm against the
better of the two Predictive-TDD arms on the same model.

| | Opus 5: Inline → EXACT | Opus 5.5: Inline → EXACT |
|---|---|---|
| `cognitive_max` ↓ | 6.20 → 3.60 (−42 %) | 7.60 → 2.00 (**−74 %**) |
| `mccabe_max` ↓ | 5.40 → 3.40 (−37 %) | 8.40 → 3.00 (**−64 %**) |
| `unit_size_avg` ↓ | 7.99 → 4.68 (−41 %) | 7.48 → 4.46 (−40 %) |
| `unit_count` ↑ | 16.6 → 38.8 (2.3×) | 12.4 → 34.4 (**2.8×**) |
| Mutation Score ↑ | 0.96 → 0.97 (+0.01) | 0.76 → 0.95 (**+0.19**) |

The scaffolding is worth **more** on the newer model, not less. Four
consequences, each carried by its own finding:

- **Unscaffolded, Opus 5.5 is the weaker engineer of the two models** — more
  complex code, fewer and weaker tests — while being 2.6× faster and 2.7×
  cheaper (F-2.4.2).
- **The collapse is in the test suite, not only in the code.** The inline arm on
  Opus 5.5 lets 38.8 of 163 mutants survive, 20.0 of them never covered at all
  (F-2.4.3).
- **The mechanism is step size.** The minimal instruction writes 4–8 failing
  tests at once; every Predictive-TDD cell writes exactly one. The phase chain
  measures this on both models (F-2.4.6).
- **The model upgrade is cheaper in every arm** — 42 % to 64 % less list price
  for the same workflow — and it is what moves the isolated-subagent arm from
  the edge of the budget into its middle (F-2.4.4, F-2.4.7).

Scope: one kata (Claim Office), one prompt style (Example Mapping), one stack
(TypeScript), CLI 2.1.280, n=5 `ok` runs per cell. Correctness (external) is
0.96–1.00 in every cell. The Opus 5 subagent arm needed seven attempts for its
five `ok` runs: two hit the two-hour budget ceiling and are not replicates
(F-2.4.7).

A reminder that outranks any single cell here: `exit_reason: ok` together with
`completed_within_budget: True` does not establish that a run finished — only
`experiment-done.txt` does. RQ-fable-vs-opus5 F-1.19.10 records the failure
shape. In this run set the two incomplete attempts were honest timeouts and
were classified as such.

## Overview

| Metric | Inline / O5 | PTDD-v1 / O5 | PTDD-v1.1 / O5 | Inline / O5.5 | PTDD-v1 / O5.5 | PTDD-v1.1 / O5.5 |
|---|---:|---:|---:|---:|---:|---:|
| **Correctness (external)** — higher = better | **1.00 ± 0.00** 🏆 | **1.00 ± 0.00** 🏆 | 0.99 ± 0.03 | **1.00 ± 0.00** 🏆 | **1.00 ± 0.00** 🏆 | 0.96 ± 0.09 |
| Correctness (internal) | 5/5 | 5/5 | 5/5 | 5/5 | 5/5 | 5/5 |
| `ok` runs / attempts — higher = better | **5/5** 🏆 | **5/5** 🏆 | 5/7 | **5/5** 🏆 | **5/5** 🏆 | **5/5** 🏆 |
| `cognitive_max` — lower = better | 6.20 ± 2.17 | 3.60 ± 1.34 | 3.60 ± 1.14 | 7.60 ± 2.07 | 2.40 ± 0.55 | **2.00 ± 0.00** 🏆 |
| `cognitive_avg` — lower = better | 2.39 ± 0.36 | 1.51 ± 0.24 | 1.44 ± 0.11 | 2.61 ± 0.34 | 1.43 ± 0.21 | **1.23 ± 0.12** 🏆 |
| `mccabe_max` — lower = better | 5.40 ± 1.52 | 3.40 ± 0.55 | 3.40 ± 0.55 | 8.40 ± 1.52 | 3.40 ± 0.55 | **3.00 ± 0.00** 🏆 |
| `mccabe_avg` — lower = better | 2.05 ± 0.22 | 1.54 ± 0.09 | **1.38 ± 0.09** 🏆 | 2.40 ± 0.13 | 1.44 ± 0.05 | **1.39 ± 0.08** 🏆 |
| `unit_count` — higher = better | 16.6 ± 0.9 | 27.0 ± 3.2 | **38.8 ± 6.8** 🏆 | 12.4 ± 1.5 | 22.8 ± 2.8 | 34.4 ± 9.9 |
| `unit_size_max` — lower = better | 24.8 ± 4.4 | 16.0 ± 4.0 | 14.0 ± 3.5 | 26.2 ± 2.0 | **13.0 ± 1.6** 🏆 | 14.2 ± 2.2 |
| `unit_size_avg` — lower = better | 7.99 ± 1.03 | 5.57 ± 0.15 | 4.68 ± 0.44 | 7.48 ± 0.45 | 4.81 ± 0.62 | **4.46 ± 0.40** 🏆 |
| `unit_size_median` — lower = better | 6.00 ± 1.00 | 4.50 ± 1.00 | **3.20 ± 0.45** 🏆 | 5.10 ± 0.82 | 3.80 ± 1.10 | 3.30 ± 0.67 |
| **Smell Total** — lower = better | **0.00 ± 0.00** 🏆 | **0.00 ± 0.00** 🏆 | **0.00 ± 0.00** 🏆 | 0.40 ± 0.89 | **0.00 ± 0.00** 🏆 | **0.00 ± 0.00** 🏆 |
| **Production LoC** | 278 ± 28 | 316 ± 35 | 543 ± 60 | 224 ± 12 | 222 ± 24 | 310 ± 61 |
| **Code Mass (APP)** — lower = better | 720 ± 32 | 708 ± 80 | 920 ± 80 | 707 ± 37 | **632 ± 36** 🏆 | 655 ± 57 |
| **Test LoC** | 446 ± 77 | 694 ± 175 | 480 ± 68 | 254 ± 25 | 277 ± 38 | 259 ± 29 |
| `tests_total` | 50.6 ± 9.5 | 57.8 ± 7.5 | 53.4 ± 3.4 | 32.0 ± 2.3 | 47.8 ± 1.6 | 46.4 ± 2.3 |
| **Mutation Score** — higher = better | 0.96 ± 0.02 | **0.97 ± 0.01** 🏆 | 0.90 ± 0.06 | 0.76 ± 0.10 | 0.94 ± 0.05 | 0.95 ± 0.03 |
| `mutants_survived` — lower = better | 5.8 ± 3.4 | **4.4 ± 0.9** 🏆 | 17.2 ± 10.9 | 38.8 ± 15.0 | 7.8 ± 6.3 | 6.4 ± 3.9 |
| `mutants_no_coverage` — lower = better | 1.2 ± 1.6 | 1.2 ± 1.1 | 6.0 ± 7.1 | 20.0 ± 18.5 | 2.8 ± 3.8 | 2.0 ± 2.4 |
| `duration_seconds` — lower = better | 332 ± 63 | 1291 ± 128 | 4764 ± 1296 | **130 ± 14** 🏆 | 922 ± 80 | 2664 ± 433 |
| `total_tokens` — lower = better | 3.5 M ± 0.9 M | 22.6 M ± 3.3 M | 64.5 M ± 19.2 M | **1.4 M ± 0.3 M** 🏆 | 24.4 M ± 1.8 M | 55.3 M ± 7.6 M |
| `cost_usd` — lower = better | 3.60 ± 0.59 | 16.93 ± 2.24 | 63.24 ± 18.64 | **1.31 ± 0.17** 🏆 | 9.79 ± 0.49 | 28.34 ± 3.30 |

> **The Opus 5 subagent arm reached its five `ok` runs in seven attempts.** The
> other two hit the two-hour budget ceiling — one delivered nothing, one had
> solved the kata — and are not replicates. The five that count clear the
> correctness gate at 0.99, so the cell is trophy-eligible, but they average
> 4764 s, two-thirds of the budget. F-2.4.7.
>
> **Its `unit_count` and `unit_size_median` trophies come with the largest code
> base in the field** — 543 Production LoC, Code Mass (APP) 920, against 222–316
> in every other Predictive-TDD cell. More units partly means more code;
> `unit_size_avg` is the size-neutral column, and there Opus 5.5 with the
> subagent arm leads. The `mccabe_avg` co-trophy is a 0.01 difference, inside
> either cell's σ.
>
> **Correctness (internal) carries no trophy** — 5/5 in every cell, no contest.
>
> **The cost rows are won by the arm that does the least.** `Inline / O5.5` is
> the cheapest cell in the field and also the one with Mutation Score 0.76 and
> `cognitive_max` 7.60. It is above the correctness gate because the acceptance
> suite passes; the suite it writes for itself is what fails. Read the cost
> trophies against F-2.4.3 before quoting them.

### TDD discipline — within architecture group only

`tdd_discipline` is **not comparable between the inline arm and the
Predictive-TDD arms** — the same test-list boundary documented in
RQ-tdd-workflow-comparison-opus55 F-4.13.4. The PTDD workflows write a complete
inactive test list up front, so a test that passes on activation is legitimate
evidence under their contract and still counts as a `Skip`; the inline arm writes
no list and has almost none. `skip_events` 38.0 against 1.4 is that difference,
not a difference in rigour. The two groups are tabled apart.

**Group A — Predictive TDD** (test list up front)

| Metric | PTDD-v1 / O5 | PTDD-v1.1 / O5 | PTDD-v1 / O5.5 | PTDD-v1.1 / O5.5 |
|---|---:|---:|---:|---:|
| `tdd_discipline` — higher = better | 0.50 ± 0.04 | 0.59 ± 0.09 | **0.63 ± 0.01** 🏆 | 0.62 ± 0.03 |
| `tdd_discipline_test_first` | 0.37 ± 0.04 | 0.48 ± 0.12 | **0.51 ± 0.02** 🏆 | 0.50 ± 0.03 |
| `tdd_discipline_step` | **1.00 ± 0.00** 🏆 | **1.00 ± 0.00** 🏆 | **1.00 ± 0.00** 🏆 | **1.00 ± 0.00** 🏆 |
| `tdd_discipline_closure` | 0.35 ± 0.05 | 0.44 ± 0.10 | **0.49 ± 0.02** 🏆 | 0.48 ± 0.04 |
| `skip_events` — lower = better | 38.0 ± 7.1 | 26.2 ± 10.2 | **23.8 ± 1.3** 🏆 | 25.8 ± 2.9 |
| `red_batch_max` — lower = better | **1.00 ± 0.00** 🏆 | 1.80 ± 1.79 | **1.00 ± 0.00** 🏆 | **1.00 ± 0.00** 🏆 |
| `refactor_events` | 10.6 ± 1.9 | 60.6 ± 14.0 | 16.6 ± 2.4 | 30.6 ± 9.7 |
| `cycles_total` / `cycles_closed` | 58.8 / 20.2 | 47.2 / 20.0 | 49.6 / 24.2 | 52.0 / 25.0 |
| `chain_suite_runs` | 99.6 | 188.8 | 95.4 | 161.8 |

**Group B — minimal inline instruction** (no test list)

| Metric | Inline / O5 | Inline / O5.5 |
|---|---:|---:|
| `tdd_discipline` — higher = better | **0.55 ± 0.06** 🏆 | 0.42 ± 0.12 |
| `tdd_discipline_test_first` | 0.85 ± 0.07 | **0.92 ± 0.18** 🏆 |
| `tdd_discipline_step` — higher = better | **0.23 ± 0.04** 🏆 | 0.13 ± 0.01 |
| `tdd_discipline_closure` | 0.84 ± 0.07 | **0.90 ± 0.22** 🏆 |
| `red_batch_size` — lower = better | **4.40 ± 0.96** 🏆 | 7.75 ± 0.35 |
| `red_batch_max` — lower = better | **8.00 ± 2.45** 🏆 | 10.00 ± 2.83 |
| `skip_events` — lower = better | 1.40 ± 1.14 | **0.20 ± 0.45** 🏆 |
| `cycles_total` / `cycles_closed` | 11.4 / 9.6 | 3.4 / 3.0 |
| `chain_suite_runs` | 23.8 | 7.6 |

> The `PTDD-v1.1 / O5` `red_batch_max` of 1.80 comes from one run of five, which
> in four suite runs had three to five new tests failing at once. None of those
> tests had been green before, so it is a step-size lapse in that run, not a
> regression counted as a red batch. `red_batch_size` stays 1.00 in all four
> Predictive-TDD cells.
>
> The group B score is the clearest case in this RQ for why the consolidated
> number must never be read alone. The inline arm's `test_first` and `closure`
> components are the highest in the whole field (0.85–0.92 and 0.84–0.90) — and
> its step component is 0.13. It opens almost every cycle on a verified failure
> and closes almost all of them, because it only has 3.4 cycles and puts ~8 tests
> into each. F-2.4.6.

---

## F-2.4.1 — The workflow's quality advantage does not shrink on the newer model, it grows

Holding the arm constant and comparing the models: Opus 5.5 wins every
separating row under Predictive TDD and loses every separating row under the
minimal instruction.

| | Inline / O5 | Inline / O5.5 | PTDD-v1 / O5 | PTDD-v1 / O5.5 |
|---|---:|---:|---:|---:|
| `cognitive_max` | 6.20 ± 2.17 | 7.60 ± 2.07 | 3.60 ± 1.34 | 2.40 ± 0.55 |
| `mccabe_max` | 5.40 ± 1.52 | 8.40 ± 1.52 | 3.40 ± 0.55 | 3.40 ± 0.55 |
| `unit_size_avg` | 7.99 ± 1.03 | 7.48 ± 0.45 | 5.57 ± 0.15 | 4.81 ± 0.62 |
| `unit_count` | 16.6 ± 0.9 | 12.4 ± 1.5 | 27.0 ± 3.2 | 22.8 ± 2.8 |
| Mutation Score | 0.96 ± 0.02 | 0.76 ± 0.10 | 0.97 ± 0.01 | 0.94 ± 0.05 |

The gap the workflow closes is wider on Opus 5.5 on `cognitive_max` (7.60 → 2.40
against 6.20 → 3.60) and on `mccabe_max` (8.40 → 3.40 against 5.40 → 3.40). H2,
the hypothesis that a newer model needs the scaffolding less, is **refuted** on
this kata.

**The mechanism is decomposition, not volume.** Under the workflow Opus 5.5 cuts
222 lines of Production LoC into 22.8 named units where unscaffolded it cuts 224
into 12.4 — the same amount of code in nearly twice as many pieces. Opus 5 does
the same at a smaller ratio (278 into 16.6 against 316 into 27.0). The workflow
does not make either model write more code.

One row does not follow: `unit_count` is *lower* on Opus 5.5 than on Opus 5 in
both arms (12.4 against 16.6 unscaffolded, 22.8 against 27.0 under PTDD-v1), yet
`unit_size_avg` is also lower. The newer model writes less code overall — 222
against 316 Production LoC under the same workflow — and distributes it at least
as finely.

---

## F-2.4.2 — Unscaffolded, Opus 5.5 writes more complex code and a far weaker suite than Opus 5

| | Inline / O5 | Inline / O5.5 | direction |
|---|---:|---:|---|
| `cognitive_max` | 6.20 ± 2.17 | 7.60 ± 2.07 | worse |
| `mccabe_max` | 5.40 ± 1.52 | 8.40 ± 1.52 | worse |
| `unit_count` | 16.6 ± 0.9 | 12.4 ± 1.5 | worse |
| `unit_size_max` | 24.8 ± 4.4 | 26.2 ± 2.0 | worse |
| Smell Total | 0.00 ± 0.00 | 0.40 ± 0.89 | worse |
| `tests_total` | 50.6 ± 9.5 | 32.0 ± 2.3 | worse |
| Mutation Score | 0.96 ± 0.02 | 0.76 ± 0.10 | worse |
| `duration_seconds` | 332 ± 63 | 130 ± 14 | 2.6× faster |
| `cost_usd` | 3.60 ± 0.59 | 1.31 ± 0.17 | 2.7× cheaper |

Given the same minimal instruction, the newer model produces worse code by every
measured axis and does it in 39 % of the wallclock for 36 % of the list price.
`mccabe_max` 8.40 against 5.40 is the largest single regression and sits outside
1 σ of the Opus 5 cell.

Both cells pass the external acceptance suite at 1.00, so this is not a
correctness regression. It is a structural one, and it is invisible in the
primary outcome — which is the reason this RQ measures code quality at all.

---

## F-2.4.3 — On Opus 5.5 the unscaffolded suite collapses; under the workflow it does not

Mutation Score is the sharpest separation in this RQ, and it separates the two
models only in the unscaffolded arm.

| | Mutation Score | `mutants_total` | `mutants_survived` | `mutants_no_coverage` | `tests_total` |
|---|---:|---:|---:|---:|---:|
| Inline / O5 | 0.96 ± 0.02 | 131.6 ± 7.9 | 5.8 ± 3.4 | 1.2 ± 1.6 | 50.6 ± 9.5 |
| Inline / O5.5 | 0.76 ± 0.10 | 163.0 ± 25.2 | 38.8 ± 15.0 | 20.0 ± 18.5 | 32.0 ± 2.3 |
| PTDD-v1 / O5 | 0.97 ± 0.01 | 137.4 ± 9.7 | 4.4 ± 0.9 | 1.2 ± 1.1 | 57.8 ± 7.5 |
| PTDD-v1.1 / O5 | 0.90 ± 0.06 | 165.4 ± 21.9 | 17.2 ± 10.9 | 6.0 ± 7.1 | 53.4 ± 3.4 |
| PTDD-v1 / O5.5 | 0.94 ± 0.05 | 124.0 ± 4.9 | 7.8 ± 6.3 | 2.8 ± 3.8 | 47.8 ± 1.6 |
| PTDD-v1.1 / O5.5 | 0.95 ± 0.03 | 135.2 ± 10.9 | 6.4 ± 3.9 | 2.0 ± 2.4 | 46.4 ± 2.3 |

Report the pair, not the ratio: `Inline / O5.5` has the **largest** mutant
population of the field (163.0) and the fewest tests (32.0), so its 0.76 is not a
denominator artefact — 38.8 mutants survive in absolute terms, against 5.8 on
Opus 5 with the same instruction. 20.0 of them are never covered by any test at
all, against 1.2.

Under the workflow the newer model lands at 0.94–0.95 with 6.4–7.8 survivors.
The scaffolding does not make its suite better than Opus 5's (0.97); it makes it
*as good*, which is the whole gap.

The subagent arm on Opus 5 is the weakest Predictive-TDD suite in the field:
17.2 survivors of 165.4 mutants against 4.4 of 137.4 for PTDD-v1 on the same
model. Its population is the second-largest because it writes the most code
(543 Production LoC), and the suite does not keep pace with it — 53.4 tests for
1.7× the Production LoC of PTDD-v1. The spread is wide: three of its five runs
let 20–30 mutants survive, the other two 5 and 7.

The mechanism is in F-2.4.6: the inline arm on Opus 5.5 runs 3.4 cycles and puts
roughly eight tests into each. A suite assembled that way is not shaped by
feedback from the implementation, and mutation testing is what makes that
visible — `tests_passing` and `verification_pct` are 100 % and 1.00 for the same
runs.

---

## F-2.4.4 — Opus 5.5 is cheaper in every arm, and the saving is tariff, not tokens

| | `cost_usd` / O5 | `cost_usd` / O5.5 | Δ price | `total_tokens` / O5 | `total_tokens` / O5.5 | Δ tokens |
|---|---:|---:|---:|---:|---:|---:|
| Inline | 3.60 ± 0.59 | 1.31 ± 0.17 | **−64 %** | 3.5 M ± 0.9 M | 1.4 M ± 0.3 M | −60 % |
| PTDD-v1 | 16.93 ± 2.24 | 9.79 ± 0.49 | **−42 %** | 22.6 M ± 3.3 M | 24.4 M ± 1.8 M | **+8 %** |
| PTDD-v1.1 | 63.24 ± 18.64 | 28.34 ± 3.30 | **−55 %** | 64.5 M ± 19.2 M | 55.3 M ± 7.6 M | −14 % |

The PTDD-v1 row is the one that matters: Opus 5.5 spends **8 % more tokens** for
the same workflow and still costs 42 % less. The saving is in the tariff, not in
the work. The inline row is the opposite case — there the newer model genuinely
does less, and price and tokens fall together.

`cost_usd` is a list-price comparison value, not an invoice; these runs went over
the native subscription route, where nothing is billed per token. Tariffs:
`research/model-pricing.md`.

Duration follows the same pattern as price, not as tokens: 922 s against 1291 s
for PTDD-v1 (−29 %) at +8 % tokens.

---

## F-2.4.5 — The marker route does not survive Opus 5.5; the phase chain does

Opus 5 and Opus 5.5 produce inverted transcript shapes on this workflow, and the
lab's TDD markers read assistant text only. Ranges across the five runs of each
cell:

| | text blocks | thinking blocks | tool_use |
|---|---|---|---|
| PTDD-v1 / Opus 5 | 102–126 | 0 | 103–128 |
| PTDD-v1 / Opus 5.5 | **7–14** | **134–145** | 101–114 |
| Inline / Opus 5 | 25–41 | 0 | 29–44 |
| Inline / Opus 5.5 | 4–9 | 5–10 | 11–22 |
| PTDD-v1.1 / Opus 5.5 | 106–131 | 111–139 | 135–150 |

Opus 5 narrates every phase and emits no thinking blocks at all; Opus 5.5
inverts both in the shared-context arm — 7–14 text blocks against 102–126, with
the cycle running inside 134–145 thinking blocks whose content is unreadable
(`"thinking": ""` plus a signature, so encrypted rather than merely
unformatted). Any metric derived from assistant text is therefore not measurable
there, which is why `refactorings_applied`, `predictions_*`, `red_verified` and
`cycle_count` are not outcomes of this RQ.

**The phase chain is unaffected, because it reads the test framework's own event
stream.** `chain_suite_runs` is 95.4 on Opus 5.5 against 99.6 on Opus 5 for the
same workflow, and every discipline column is populated in all six cells. The
instrument that failed was the one that depended on the model narrating; the one
that depends on the suite running did not.

The subagent arm is the interesting counter-case: on Opus 5.5 it narrates
*abundantly* (106–131 text blocks) because the subagent's output lands in the
main transcript. Markers would partly survive there — but the measurement no
longer needs them, so this is a property of the architecture rather than a
reason to prefer it.

---

## F-2.4.6 — The minimal instruction does not do TDD in step size, and that is what fails

The consolidated discipline score hides the single clearest behavioural
difference in this RQ. Its step component exposes it.

| | `red_batch_size` | `red_batch_max` | `tdd_discipline_step` | `cycles_total` | `tests_total` | tests per cycle |
|---|---:|---:|---:|---:|---:|---:|
| Inline / O5 | 4.40 ± 0.96 | 8.00 ± 2.45 | 0.23 ± 0.04 | 11.4 ± 1.5 | 50.6 | ≈ 4.4 |
| Inline / O5.5 | 7.75 ± 0.35 | 10.00 ± 2.83 | 0.13 ± 0.01 | 3.4 ± 0.5 | 32.0 | ≈ 9.4 |
| PTDD-v1 / O5 | 1.00 ± 0.00 | 1.00 ± 0.00 | 1.00 ± 0.00 | 58.8 ± 7.5 | 57.8 | ≈ 1.0 |
| PTDD-v1.1 / O5 | 1.00 ± 0.00 | 1.80 ± 1.79 | 1.00 ± 0.00 | 47.2 ± 12.0 | 53.4 | ≈ 1.1 |
| PTDD-v1 / O5.5 | 1.00 ± 0.00 | 1.00 ± 0.00 | 1.00 ± 0.00 | 49.6 ± 2.2 | 47.8 | ≈ 1.0 |
| PTDD-v1.1 / O5.5 | 1.00 ± 0.00 | 1.00 ± 0.00 | 1.00 ± 0.00 | 52.0 ± 3.2 | 46.4 | ≈ 0.9 |

Every Predictive-TDD cell writes one failing test at a time: `red_batch_size`
is 1.00 in all 20 runs, and `red_batch_max` is 1 in 19 of them. The exception is
one PTDD-v1.1 / Opus 5 run that peaks at five. The minimal instruction writes 4.4 at a time on
Opus 5 and 7.75 on Opus 5.5, with single batches up to 10. On Opus 5.5 it runs
**3.4 cycles** for 32 tests — a suite assembled in three sittings, not grown from
feedback.

This is the mechanism behind F-2.4.3. A test batch written before any
implementation exists cannot be shaped by what the implementation turned out to
need, and the mutation result is where that shows: 38.8 survivors against 7.8
under the workflow on the same model.

The consolidated `tdd_discipline` reads 0.42 for that cell against 0.63 for
PTDD-v1 on the same model — the right order, for the wrong reason. Its
`test_first` (0.92) and `closure` (0.90) components are the *highest* in the
field, because a run with 3.4 cycles has few opportunities to open one without a
verified failure or to leave one unclosed. Only the step component (0.13)
carries the finding. The score is diagnosable, never quotable alone.

Across the group boundary the score is not comparable at all:
`skip_events` is 38.0 and 23.8 in the PTDD cells against 1.4 and 0.2 in the
inline cells, because the PTDD contract writes a complete inactive test list up
front and explicitly permits a test that passes on activation ("A test already
satisfied by an earlier generalization is legitimate evidence. Do not manufacture
a failure."). Full argument in RQ-tdd-workflow-comparison-opus55 F-4.13.4.

---

## F-2.4.7 — The isolated Refactor subagent runs at the edge of the budget on Opus 5 and well inside it on Opus 5.5

| | PTDD-v1.1 / O5 | PTDD-v1.1 / O5.5 |
|---|---:|---:|
| Correctness (external) | 0.99 ± 0.03 | 0.96 ± 0.09 |
| `ok` runs / attempts | 5/7 | 5/5 |
| `duration_seconds` | 4764 ± 1296 | 2664 ± 433 |
| `cost_usd` | 63.24 ± 18.64 | 28.34 ± 3.30 |
| `total_tokens` | 64.5 M ± 19.2 M | 55.3 M ± 7.6 M |
| `chain_suite_runs` | 188.8 | 161.8 |
| `refactor_events` | 60.6 | 30.6 |
| `cognitive_max` | 3.60 ± 1.14 | 2.00 ± 0.00 |
| Mutation Score | 0.90 ± 0.06 | 0.95 ± 0.03 |

On Opus 5 this arm needed **seven attempts for five `ok` runs**. Two attempts hit
the two-hour budget ceiling: one delivered nothing — `verification_pct` 0, no
suite invocation at all — and the other had solved the kata and simply ran out
of time. Neither is a replicate. The five that count are correct (0.99) but
take 4764 s on average and up to 5940 s, 83 % of the budget; four of the five
are above 4500 s. The ceiling is not an outlier for this cell, it is close to
its normal operating range.

On Opus 5.5 the same arm finishes every attempt within budget at 2664 s, 56 % of
the Opus 5 wallclock, and produces the lowest `cognitive_max` in the field at
2.00 ± 0.00 — deterministic across all five runs. On Opus 5 the arm buys no such
gain: `cognitive_max` 3.60, the same as PTDD-v1 on Opus 5, at 3.7× its cost and
with a weaker suite (F-2.4.3). The Opus 5 cell is the most expensive of the
field at $63.24; the Opus 5.5 cell costs $28.34, 2.9× the shared-context arm on
the same model.

The reading is that the architecture is not model-portable at this cost level.
What makes it usable on the newer model is the same thing F-2.4.4 measures: the
newer model is faster and cheaper for the identical workflow, which moves the
arm from the edge of the ceiling into the middle of the budget.
