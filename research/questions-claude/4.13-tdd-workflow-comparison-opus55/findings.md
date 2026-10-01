# Findings — RQ-4.13: Seven TDD Workflows Compared (opus-5.5)

All figures: `claim-office-example-mapping` × `opus-5-5-no-thinking` (native
subscription route) × Claude Code 2.1.280, n=5 per cell. The three vendor
workflows are snapshots at the commits named in [README.md](README.md); every
statement describes those snapshots, not the tools in general.

## Overview

Primary outcome is Correctness (external). The decomposition metrics follow the
binding quality metric from RQ-architecture-axis-opus5 F-1.6. Cells are grouped
by line: maintained lab, retired lab, vendor.

| Metric | `exact-ptdd-v1-cc` | `exact-ptdd-v1.1-subagent` | `exact-hybrid-v2-testlist-fix` | `exact-hybrid-v2.4-lab-split` | `external-kesseler` | `external-superpowers` | `external-pocock` |
|---|---:|---:|---:|---:|---:|---:|---:|
| **Correctness (external)** — higher = better | **1.00 ± 0.00** 🏆 | 0.96 ± 0.09 | 0.96 ± 0.09 | 0.96 ± 0.09 | **1.00 ± 0.00** 🏆 | **1.00 ± 0.00** 🏆 | **1.00 ± 0.00** 🏆 |
| perfect runs | **5/5** 🏆 | 4/5 | 4/5 | 4/5 | **5/5** 🏆 | **5/5** 🏆 | **5/5** 🏆 |
| Correctness (internal) | 100 % | 100 % | 100 % | 100 % | 100 % | 100 % | 100 % |
| `cc_avg_loc_per_function` — lower = better | 4.81 ± 0.62 | 4.46 ± 0.40 | **2.92 ± 0.46** 🏆 | **3.32 ± 0.27** 🏆 | 6.23 ± 1.51 | 6.48 ± 0.82 | 9.46 ± 1.11 |
| `cc_longest_function` — lower = better, no winner | 13.00 ± 1.58 | 14.20 ± 2.17 | 11.00 ± 4.36 | 14.20 ± 6.38 | 14.80 ± 1.64 | 15.80 ± 1.30 | 19.20 ± 1.92 |
| `cognitive_max` — lower = better | **2.40 ± 0.55** 🏆 | **2.00 ± 0.00** 🏆 | **2.40 ± 0.89** 🏆 | **2.40 ± 1.14** 🏆 | 3.60 ± 1.34 | 4.00 ± 1.41 | 7.20 ± 3.42 |
| `mccabe_max` — lower = better | **3.40 ± 0.55** 🏆 | **3.00 ± 0.00** 🏆 | **3.20 ± 0.45** 🏆 | **3.20 ± 0.45** 🏆 | 4.40 ± 0.89 | 4.40 ± 0.55 | 6.40 ± 2.30 |
| **Smell Total** — lower = better | **0.00 ± 0.00** 🏆 | **0.00 ± 0.00** 🏆 | 0.80 ± 0.45 | 0.80 ± 0.45 | **0.00 ± 0.00** 🏆 | **0.00 ± 0.00** 🏆 | 2.20 ± 3.35 |
| **Code Mass (APP)** — lower = better | 632 ± 36 | 655 ± 57 | 742 ± 62 | 733 ± 105 | **560 ± 13** 🏆 | 634 ± 30 | **585 ± 15** 🏆 |
| `duration_seconds` — lower = better | 922 ± 80 | 2664 ± 433 | 1117 ± 138 | 1217 ± 165 | 605 ± 59 | **372 ± 45** 🏆 | **310 ± 44** 🏆 |
| `total_tokens` — lower = better | 24.4 M ± 1.8 M | 55.3 M ± 7.6 M | 51.0 M ± 5.2 M | 54.0 M ± 12.5 M | 15.5 M ± 2.0 M | 7.3 M ± 0.8 M | **5.3 M ± 0.7 M** 🏆 |
| `cost_usd` — lower = better | 9.79 ± 0.49 | 28.34 ± 3.30 | 18.35 ± 2.18 | 20.16 ± 4.20 | 6.85 ± 0.84 | **3.45 ± 0.25** 🏆 | **2.97 ± 0.33** 🏆 |
| `refactor_events` — design characteristic | 16.6 ± 2.4 | 30.6 ± 9.7 | 24.8 ± 5.2 | 29.6 ± 6.5 | 7.2 ± 2.4 | 5.0 ± 2.6 | 0.6 ± 0.9 |

> **Correctness (internal) carries no trophy** — all seven cells are at 100 %, so
> the row has no contest.
>
> **Correctness-gating does not bind here.** Every cell is at
> `verification_pct` ≥ 0.96, so all seven are eligible for the quality and cost
> trophies. Multiple trophies in a row mark values that are indistinguishable at
> 1 σ, not a fabricated tie.
>
> **`cc_longest_function` carries no trophy at all.** Six of the seven cells lie
> between 11.00 and 15.80 with overlapping σ bands — `hybrid-v2`'s band alone
> spans 6.64 to 15.36 and covers both `kesseler` and `superpowers`. The only
> separation in that row is `pocock` at the top end. Awarding a winner inside
> that band would be rounding noise.
>
> **Read Code Mass (APP) with the decomposition rows, never alone.** The two
> trophy cells sit at opposite ends of `cc_avg_loc_per_function`: `kesseler` at
> 6.23 and `pocock` at 9.46, the worst in the field. Both solved the full
> specification (5/5 perfect), so neither is disqualified — but the low value
> means compacted, not parsimonious. F-4.13.6.
>
> `refactor_events` carries no trophy: 0.6 against 30.6 is the field's design
> axis, not a result.

### TDD discipline — within architecture group only

`tdd_discipline` is **not comparable across the test-list boundary** (F-4.13.4).
Four workflows derive the next test from a test list written up front, three
derive it ad hoc, and `skip_events` counts a test that passes on activation as a
deviation — which the test-list contract explicitly permits. The two groups are
therefore tabled apart and no trophy crosses between them.

**Group A — test-list workflows** (`test-list.md` command, inactive tests)

| Metric | `exact-ptdd-v1-cc` | `exact-ptdd-v1.1-subagent` | `exact-hybrid-v2-testlist-fix` | `exact-hybrid-v2.4-lab-split` |
|---|---:|---:|---:|---:|
| `tdd_discipline` — higher = better | 0.63 ± 0.01 | 0.62 ± 0.03 | **0.71 ± 0.02** 🏆 | 0.70 ± 0.01 |
| `tdd_discipline_test_first` | 0.51 ± 0.02 | 0.50 ± 0.03 | **0.61 ± 0.02** 🏆 | 0.59 ± 0.02 |
| `tdd_discipline_step` | **1.00 ± 0.00** 🏆 | **1.00 ± 0.00** 🏆 | **1.00 ± 0.00** 🏆 | **1.00 ± 0.00** 🏆 |
| `tdd_discipline_closure` | 0.49 ± 0.02 | 0.48 ± 0.04 | **0.59 ± 0.02** 🏆 | 0.58 ± 0.01 |
| `skip_events` — lower = better | 23.8 ± 1.3 | 25.8 ± 2.9 | **16.6 ± 1.1** 🏆 | **16.6 ± 1.3** 🏆 |
| `red_batch_max` — lower = better | **1.00 ± 0.00** 🏆 | **1.00 ± 0.00** 🏆 | **1.00 ± 0.00** 🏆 | **1.00 ± 0.00** 🏆 |
| `cycles_total` / `cycles_closed` | 49.6 / 24.2 | 52.0 / 25.0 | 42.4 / 25.2 | 41.8 / 24.2 |
| `chain_suite_runs` | 95.4 | 161.8 | 103.6 | 106.2 |

**Group B — ad-hoc workflows** (next test derived per cycle, no test list)

| Metric | `external-kesseler` | `external-superpowers` | `external-pocock` |
|---|---:|---:|---:|
| `tdd_discipline` — higher = better | **0.85 ± 0.06** 🏆 | **0.84 ± 0.04** 🏆 | **0.82 ± 0.07** 🏆 |
| `tdd_discipline_test_first` | **0.79 ± 0.09** 🏆 | 0.75 ± 0.04 | **0.80 ± 0.05** 🏆 |
| `tdd_discipline_step` | **1.00 ± 0.00** 🏆 | **1.00 ± 0.00** 🏆 | 0.90 ± 0.22 |
| `tdd_discipline_closure` | **0.78 ± 0.09** 🏆 | **0.80 ± 0.09** 🏆 | **0.80 ± 0.07** 🏆 |
| `skip_events` — lower = better | 8.2 ± 3.1 | **2.4 ± 1.3** 🏆 | **3.8 ± 1.6** 🏆 |
| `red_batch_max` — lower = better | **2.60 ± 0.89** 🏆 | 4.80 ± 0.84 | 4.40 ± 1.67 |
| `cycles_total` / `cycles_closed` | 39.4 / 30.4 | 23.2 / 18.6 | 18.8 / 15.0 |
| `chain_suite_runs` | 83.4 | 52.6 | 36.6 |

> The three `tdd_discipline` values in group B lie within 1 σ of each other — the
> reading is "indistinguishable", hence three trophies.

---

## F-4.13.1 — Every workflow solves the kata; the perfect-run split is 4/3

All seven cells pass their own suite in 5/5 runs and reach `verification_pct`
≥ 0.96. Four cells are perfect in every replicate, three miss one acceptance
case in one replicate each.

| | perfect runs | Correctness (external) |
|---|---:|---:|
| `exact-ptdd-v1-cc` | 5/5 | 1.00 ± 0.00 |
| `external-kesseler-2026-09-30-cc` | 5/5 | 1.00 ± 0.00 |
| `external-superpowers-2026-09-04-cc` | 5/5 | 1.00 ± 0.00 |
| `external-pocock-2026-09-04-cc` | 5/5 | 1.00 ± 0.00 |
| `exact-ptdd-v1.1-refactor-subagent-cc` | 4/5 | 0.96 ± 0.09 |
| `exact-hybrid-v2-testlist-fix-cc` | 4/5 | 0.96 ± 0.09 |
| `exact-hybrid-v2.4-lab-split-cc` | 4/5 | 0.96 ± 0.09 |

H5 confirmed for all seven cells. H6 confirmed as well: the between-cell spread
(0.96 to 1.00) is smaller than the within-cell spread of the three imperfect
cells (σ 0.09 each), so correctness does not separate this field. On this kata
the metric is close to a bit rather than a degree, and the comparison has to be
carried by decomposition, discipline and cost.

The three imperfect cells share a property worth naming: all three delegate the
per-cycle Refactor step to an isolated subagent. The three cells that never
delegate — plus `exact-ptdd-v1-cc`, which refactors inline — are perfect in
15/15 runs. At n=5 per cell this is an observation, not an effect.

---

## F-4.13.2 — Decomposition follows refactor frequency, and the lab contract leads

`cc_avg_loc_per_function` orders the field almost exactly inversely to
`refactor_events`.

| | `refactor_events` | `cc_avg_loc_per_function` | `cognitive_max` | `mccabe_max` |
|---|---:|---:|---:|---:|
| `exact-hybrid-v2-testlist-fix-cc` | 24.8 | 2.92 ± 0.46 | 2.40 | 3.20 |
| `exact-hybrid-v2.4-lab-split-cc` | 29.6 | 3.32 ± 0.27 | 2.40 | 3.20 |
| `exact-ptdd-v1.1-refactor-subagent-cc` | 30.6 | 4.46 ± 0.40 | 2.00 | 3.00 |
| `exact-ptdd-v1-cc` | 16.6 | 4.81 ± 0.62 | 2.40 | 3.40 |
| `external-kesseler-2026-09-30-cc` | 7.2 | 6.23 ± 1.51 | 3.60 | 4.40 |
| `external-superpowers-2026-09-04-cc` | 5.0 | 6.48 ± 0.82 | 4.00 | 4.40 |
| `external-pocock-2026-09-04-cc` | 0.6 | 9.46 ± 1.11 | 7.20 | 6.40 |

The clean test of refactor position is `pocock` against `superpowers` and
`kesseler` — same architecture (one inline skill), only the stage varies.
`cc_avg_loc_per_function` 9.46 against 6.48 and 6.23 is a gap of ≈ 3 σ, and
`cognitive_max` 7.20 against 4.00 and 3.60 points the same way. H7 confirmed:
a refactor stage has an effect, and the design doctrine in Pocock's prompt
("deep modules", "small interfaces") does not replace it.

Across the whole field the ordering is not strictly monotone in
`refactor_events`: `exact-ptdd-v1-cc` refactors least of the four lab cells
(16.6) and still decomposes better than every vendor cell. What separates the
groups is not refactor count but the contract — all four lab workflows carry an
explicit decomposition obligation, the vendor skills carry a refactor stage
without one.

---

## F-4.13.3 — The isolated refactor subagent buys a deterministic complexity floor at 2.9× the price

`exact-ptdd-v1-cc` against `exact-ptdd-v1.1-refactor-subagent-cc` is the only
single-variable contrast in the field: same contract, same prose, same refactor
position, and the Refactor step either runs in the main context or in an
isolated subagent.

| | shared context | isolated subagent | factor |
|---|---:|---:|---:|
| `cognitive_max` | 2.40 ± 0.55 | 2.00 ± 0.00 | — |
| `mccabe_max` | 3.40 ± 0.55 | 3.00 ± 0.00 | — |
| `cc_avg_loc_per_function` | 4.81 ± 0.62 | 4.46 ± 0.40 | 0.93× |
| Correctness (external) | 1.00 ± 0.00 (5/5) | 0.96 ± 0.09 (4/5) | — |
| `tdd_discipline` | 0.63 ± 0.01 | 0.62 ± 0.03 | 0.98× |
| `refactor_events` | 16.6 ± 2.4 | 30.6 ± 9.7 | 1.8× |
| `chain_suite_runs` | 95.4 ± 5.4 | 161.8 ± 13.2 | 1.7× |
| `duration_seconds` | 922 ± 80 | 2664 ± 433 | **2.9×** |
| `total_tokens` | 24.4 M ± 1.8 M | 55.3 M ± 7.6 M | **2.3×** |
| `cost_usd` | 9.79 ± 0.49 | 28.34 ± 3.30 | **2.9×** |

What the subagent buys is **determinism, not a lower mean**: `cognitive_max`
drops 2.40 → 2.00 and `mccabe_max` 3.40 → 3.00, each at σ = 0.00 against σ = 0.55.
Every one of the five subagent runs lands on the same value; the shared-context
cell scatters. The decomposition metric the architecture is usually argued on,
`cc_avg_loc_per_function`, moves 4.81 → 4.46 — well inside 1 σ, so no gain is
demonstrated there.

H11 confirmed in its discipline half and refuted in its decomposition half:
`tdd_discipline` is unchanged (0.63 against 0.62, both σ ≤ 0.03), exactly as
predicted, because the subagent changes where the Refactor step runs and not
whether a failing test preceded the code. But the predicted decomposition gain
does not appear on `cc_avg_loc_per_function`; what appears instead is a
deterministic ceiling on the two complexity metrics.

The price is the finding's other half. 2.9× wallclock, 2.3× tokens and 2.9× list
price make this the most expensive cell in the field — more expensive than either
retired hybrid variant — and Correctness (external) drops from 5/5 perfect to
4/5. On opus-5 the same arm hits the two-hour budget ceiling in 2 of 5 runs
(RQ-2.4), so the cost is not only high but close to a hard limit.

H12 confirmed: `refactor_events` rises 1.8× while decomposition does not follow.
The column reads the architecture — an isolated subagent returns a changed tree
per invocation where the inline variant may touch the code repeatedly — not the
effort spent. `refactor_per_cycle` 0.69 against 1.23 says the same thing and
takes no trophy for it.

---

## F-4.13.4 — `tdd_discipline` is not comparable across the test-list boundary

The discipline score orders the field exactly inversely to code quality: the
three vendor cells lead at 0.82–0.85 and hold the worst decomposition, the four
lab cells trail at 0.62–0.71 and hold the best. That ordering is an artefact of
one label.

`skip_events` — a test that arrived and passed immediately, never red — splits
along the architecture, not along the quality:

| | `skip_events` | thereof activating a test | test list up front |
|---|---:|---:|:-:|
| `exact-ptdd-v1.1-refactor-subagent-cc` | 25.8 | 21.6 | yes (46.4 tests at invocation 1) |
| `exact-ptdd-v1-cc` | 23.8 | 23.0 | yes (47.0) |
| `exact-hybrid-v2-testlist-fix-cc` | 16.6 | 16.0 | yes |
| `exact-hybrid-v2.4-lab-split-cc` | 16.6 | 16.0 | yes |
| `external-kesseler-2026-09-30-cc` | 8.2 | 7.8 | no |
| `external-pocock-2026-09-04-cc` | 3.8 | 3.2 | no |
| `external-superpowers-2026-09-04-cc` | 2.4 | 2.0 | no |

A Skip hits the score twice: it sits in the denominator of `test_first_rate`, and
it is a `CYCLE_OPENERS` member, so it opens a cycle that has no failure to close
and therefore depresses `tdd_discipline_closure`. Those are precisely the two
components in which the lab cells trail; the third, `tdd_discipline_step`, is
1.00 in six of seven cells.

The two workflow families prescribe opposite handling of the same event.
`exact-ptdd-v1-cc`'s rules: *"A test already satisfied by an earlier
generalization is legitimate evidence. Do not manufacture a failure."*
Superpowers' `SKILL.md`, under "Red Flags — STOP and Start Over": *"Test passes
immediately"* → *"Delete code"*. Kesseler takes a middle position, obliging the
model to pause and name which earlier step satisfied the test for free. The
hybrid pair and Pocock state no rule at all — and that silent group spans both
families, which is why the doctrine wording does not predict the numbers and the
test list does.

The cause is the test-list contract itself. `test-list.md` Step 5 requires a
cross-check over independent specification dimensions — operation, entity,
input category, policy attribute, state transition, observable result — and a
generalisation written for one cell necessarily satisfies cells of other
dimensions. The more complete the list, the more tests pass on activation. The
metric penalises test-list completeness.

This is not a defect in `tdd-report.py`. The phase chain reads artifact state,
and a *prediction* leaves none — the README says so for `predictions_*`. The
consequence for this RQ is procedural: `tdd_discipline` is read within group A
and within group B, never across, and H1 is not answerable on this metric.
Correctness, decomposition and cost are unaffected and stay comparable across
all seven cells.

---

## F-4.13.5 — One failing test at a time is universal; only the vendor skills ever batch

`tdd_discipline_step` is 1.00 ± 0.00 in six of seven cells and 0.90 ± 0.22 in
`pocock`. Median `red_batch_size` is 1 everywhere. The step-size hypothesis is
refuted — but the maximum tells the opposite story from the score.

| | `red_batch_size` (median) | `red_batch_max` |
|---|---:|---:|
| all four lab cells | 1.00 ± 0.00 | **1.00 ± 0.00** |
| `external-kesseler-2026-09-30-cc` | 1.00 ± 0.00 | 2.60 ± 0.89 |
| `external-pocock-2026-09-04-cc` | 1.20 ± 0.45 | 4.40 ± 1.67 |
| `external-superpowers-2026-09-04-cc` | 1.00 ± 0.00 | 4.80 ± 0.84 |

The four lab workflows never once let more than a single test fail at a time
across 20 runs. The vendor skills do: up to 4.8 tests newly failing in one
invocation for `superpowers`, which its own skill text forbids ("Write **one
minimal test**", "One behavior"). H2 is therefore refuted as stated — the
separation is not in the median step size — and the direction reverses on the
maximum, where the cells with the *higher* discipline score are the ones that
batch.

H6, the manual n=1 observation that Superpowers writes all tests at once, does
not reproduce either: at `red_batch_size` median 1.00 and 23.2 cycles, the tests
arrive incrementally.

---

## F-4.13.6 — Cost spans a factor of ten, and Code Mass (APP) runs opposite to decomposition

| | `cost_usd` | `duration_seconds` | `total_tokens` | Code Mass (APP) | `cc_avg_loc_per_function` |
|---|---:|---:|---:|---:|---:|
| `external-pocock-2026-09-04-cc` | 2.97 ± 0.33 | 310 ± 44 | 5.3 M | 585 ± 15 | 9.46 |
| `external-superpowers-2026-09-04-cc` | 3.45 ± 0.25 | 372 ± 45 | 7.3 M | 634 ± 30 | 6.48 |
| `external-kesseler-2026-09-30-cc` | 6.85 ± 0.84 | 605 ± 59 | 15.5 M | 560 ± 13 | 6.23 |
| `exact-ptdd-v1-cc` | 9.79 ± 0.49 | 922 ± 80 | 24.4 M | 632 ± 36 | 4.81 |
| `exact-hybrid-v2-testlist-fix-cc` | 18.35 ± 2.18 | 1117 ± 138 | 51.0 M | 742 ± 62 | 2.92 |
| `exact-hybrid-v2.4-lab-split-cc` | 20.16 ± 4.20 | 1217 ± 165 | 54.0 M | 733 ± 105 | 3.32 |
| `exact-ptdd-v1.1-refactor-subagent-cc` | 28.34 ± 3.30 | 2664 ± 433 | 55.3 M | 655 ± 57 | 4.46 |

H9 confirmed: the vendor skills are an order of magnitude cheaper than the
expensive end of the lab field — $2.97 against $28.34 is 9.5×, and the token
ratio (5.3 M against 55.3 M, 10.4×) exceeds the wallclock ratio (8.6×) as
predicted. H10 is **refuted**: `pocock` *is* the cheapest cell on all three cost
metrics despite its two review sub-agents. The review stage costs less than the
per-cycle refactor stage it replaces.

Code Mass (APP) does not follow quality. `pocock` writes 585 lines into the
longest and most complex functions in the field (`cc_avg_loc_per_function` 9.46,
`cognitive_max` 7.20); `hybrid-v2` writes 742 and distributes them most finely
(2.92, 2.40). Read alone, the column would present `pocock` as the leaner result;
it is the compacted one. `kesseler` holds the lowest value at 560 and sits
mid-field on decomposition, which is why the row carries two trophies and a
caveat rather than a verdict.

`cost_usd` is a list-price comparison value, not an invoice — these runs went
over the native subscription route. Sources: `research/model-pricing.md`.

---

## F-4.13.7 — The maintained line trades decomposition for correctness, smells and half the cost

`exact-ptdd-v1-cc` against the retired hybrid pair, all three group A.

| | `exact-ptdd-v1-cc` | `exact-hybrid-v2-testlist-fix-cc` | `exact-hybrid-v2.4-lab-split-cc` |
|---|---:|---:|---:|
| Correctness (external) | 1.00 ± 0.00 (5/5) | 0.96 ± 0.09 (4/5) | 0.96 ± 0.09 (4/5) |
| `cc_avg_loc_per_function` | 4.81 ± 0.62 | 2.92 ± 0.46 | 3.32 ± 0.27 |
| `cognitive_max` | 2.40 ± 0.55 | 2.40 ± 0.89 | 2.40 ± 1.14 |
| Smell Total | 0.00 ± 0.00 | 0.80 ± 0.45 | 0.80 ± 0.45 |
| Code Mass (APP) | 632 ± 36 | 742 ± 62 | 733 ± 105 |
| `cost_usd` | 9.79 ± 0.49 | 18.35 ± 2.18 | 20.16 ± 4.20 |
| `tdd_discipline` | 0.63 ± 0.01 | 0.71 ± 0.02 | 0.70 ± 0.01 |

H13 is **not confirmed as stated**. The retired line decomposes measurably
better — 2.92 against 4.81 on `cc_avg_loc_per_function` is ≈ 3 σ — so the
maintained line does not match it on the axis the promotion is usually argued on.
What the maintained line holds instead: perfect Correctness (external) in 5/5
runs where hybrid manages 4/5, `Smell Total` deterministically 0.00 against 0.80,
110 fewer lines of Code Mass (APP), and **half the list price**. The two lines
are also level on `cognitive_max` at 2.40.

The reading is a trade, not a regression: the promotion of the Predictive-TDD
line buys correctness, cleanliness and cost at the price of the hybrid line's
finer decomposition. Anything beyond that — portability across harnesses and
models, which is the stated reason for the promotion — this kata does not
measure.

Within the retired pair, `hybrid-v2` against `hybrid-v2.4` reproduces RQ-1.19 on
this model: the split layout refactors more (29.6 against 24.8 `refactor_events`)
at +9 % wallclock and +10 % list price, with every quality metric inside 1 σ of
the other. No quality return for the premium.
