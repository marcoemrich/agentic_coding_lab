# RQ-exact-coding-rust — Findings

## Overview

Primary outcome is code quality. Correctness is a guard: a quality number from a
cell that failed verification is meaningless, because low complexity is what a
stub looks like. Results are reported **separately by model** — the factor is
paired (`model_x_workflow`), so a trophy awarded across the model boundary would
measure the model, not the method.

**Trophy rules applied here.** Quality and efficiency trophies go only to cells
with mean Correctness (external) ≥ 0.90; `exact-ptdd-v1.1-refactor-subagent-cc`
is at 0.79 and is therefore **excluded from every quality and efficiency row** of
the Opus table — its values are printed in parentheses. `cc_functions` and
`mutants_total` are ambivalent in direction and carry no trophy. `smell_total` on
Opus is identically 0 in all three arms: no contest, so no winner.

### Opus 5 (no extended thinking), via Claude Code

| Outcome | direction | `baseline-inline-tdd-v1-cc` | `exact-ptdd-v1-cc` | `exact-ptdd-v1.1-refactor-subagent-cc` |
|---|---|---|---|---|
| Correctness (external) | higher = better | 0.97 | **1.00** 🏆 | 0.79 |
| Code Mass (APP) | lower = better | 1059.6 | **929.2** 🏆 | (975.6) |
| `cognitive_max` | lower = better | 4.6 | **3.0** 🏆 | (3.2) |
| `cognitive_avg` | lower = better | 0.78 | **0.63** 🏆 | (0.48) |
| `mccabe_max` | lower = better | 8.6 | **8.0** 🏆 | (7.0) |
| `mccabe_avg` | lower = better | 2.96 | **2.56** 🏆 | (2.04) |
| `cc_longest_function` | lower = better | 28.2 | **24.6** 🏆 | (23.8) |
| `cc_avg_loc_per_function` | lower = better | 8.75 | **7.93** 🏆 | (6.35) |
| `cc_median_loc_per_function` | lower = better | 7.0 | **6.8** 🏆 | (6.0) |
| `cc_functions` | ambivalent | 33.2 | 36.0 | (46.6) |
| Smell Total | lower = better | 0 | 0 | (0) |
| Mutation Score | higher = better | 0.96 | **0.98** 🏆 | (0.98) |
| `mutants_total` | ambivalent | 101.0 | 117.2 | (113.2) |
| `mutants_survived` | lower = better | 4.0 | **3.0** 🏆 | (2.6) |
| `duration_seconds` | lower = better | **489.8** 🏆 | 1500 | (6292) |
| `total_tokens` | lower = better | **3.59 M** 🏆 | 27.2 M | (83.4 M) |
| `cost_usd` | lower = better | **$3.84** 🏆 | $20.44 | ($76.59) |

### GPT-6 SOL, via pi (openai-codex route)

All three cells sit at Correctness (external) 1.00, so none is gated. That row
carries no trophy: three identical values are not a contest, and correctness is a
guard rather than an outcome to win.

| Outcome | direction | `baseline-inline-tdd-v1-pi` | `exact-ptdd-v1-pi` | `exact-ptdd-v1.1-refactor-subagent-pi` |
|---|---|---|---|---|
| Correctness (external) | gate, not a result | 1.00 | 1.00 | 1.00 |
| Code Mass (APP) | lower = better | **517.4** 🏆 | 595.2 | 605.6 |
| `cognitive_max` | lower = better | 11.8 | **4.8** 🏆 | 5.4 |
| `cognitive_avg` | lower = better | 4.33 | **2.03** 🏆 | **1.96** 🏆 |
| `mccabe_max` | lower = better | **12.0** 🏆 | **11.8** 🏆 | **13.6** 🏆 |
| `mccabe_avg` | lower = better | 8.24 | **5.72** 🏆 | **5.78** 🏆 |
| `cc_longest_function` | lower = better | **28.6** 🏆 | **25.8** 🏆 | **27.4** 🏆 |
| `cc_avg_loc_per_function` | lower = better | 18.04 | **10.52** 🏆 | **10.72** 🏆 |
| `cc_median_loc_per_function` | lower = better | 18.4 | **8.9** 🏆 | **10.0** 🏆 |
| `cc_functions` | ambivalent | 5.6 | 11.4 | 11.4 |
| Smell Total | lower = better | 0.6 | **0** 🏆 | 0.4 |
| Mutation Score | higher = better | **0.99** 🏆 | **0.98** 🏆 | **0.99** 🏆 |
| `mutants_total` | ambivalent | 77.0 | 101.4 | 86.2 |
| `mutants_survived` | lower = better | **1.0** 🏆 | 2.0 | **1.2** 🏆 |
| `duration_seconds` | lower = better | **281.6** 🏆 | 684.4 | 1430.4 |
| `total_tokens` | lower = better | **318 k** 🏆 | 2.84 M | 2.07 M |
| `cost_usd` | lower = better | **$0.19** 🏆 | $0.94 | $1.04 |

Rows with three trophies (`mccabe_max`, `cc_longest_function`, Mutation Score)
mean "no effect": the widest gap in the row is smaller than one σ, so the table's
message is that the three arms are indistinguishable on that column. For
`cc_longest_function` that gap is 2.8 lines against σ 2.39–3.58.

### Comparability constraints

- **`tdd_discipline` and its Skip-fed columns are not reported across the arms.**
  A Skip is compliance in a test-list workflow and a deviation in an ad-hoc one,
  so `tdd_discipline`, `tdd_discipline_test_first`, `tdd_discipline_closure`,
  `test_first_rate`, `skip_events`, `cycles_total` and `chain_deviations` measure
  the architecture rather than the discipline. The four `exact-ptdd-*` arms write
  a test list up front; the two `baseline-inline-tdd-*` controls do not. Only
  boundary-safe columns are used below: `tdd_discipline_step`, `red_batch_max`,
  `red_batch_size`, `green_batch_size`, `refactor_events`, `cycles_closed`,
  `chain_suite_runs`.
- **Rust quality values do not compare with other stacks.** clippy findings are
  not ruff, PMD or ESLint/SonarJS findings; cargo-mutants scores are not mutmut,
  PIT or Stryker scores. Against the sister RQs only directions and orderings
  are read, never numbers.
- Claim Office only. The sister RQs ran Game of Life as a second kata, so every
  finding below rests on one kata.
- The pi arm runs GPT-6 SOL where the sister RQs ran GPT-5.6 SOL. On the Opus
  arm a direction differing from the sister RQs is a stack effect; on the SOL
  arm it can be a stack effect or a model-generation effect, and this RQ alone
  cannot separate them.

---

## F-1.11.1 — EXACT Coding halves function size on SOL and barely moves Opus

The structural effect of the method depends on how decomposed the model's
untutored output already is. On SOL the inline control writes five large
functions; the method roughly halves every size and complexity measure. On Opus
the control already writes 33 functions, and the same method buys a few percent.

| Outcome | SOL control | SOL `exact-ptdd-v1` | Opus control | Opus `exact-ptdd-v1` |
|---|---|---|---|---|
| `cc_functions` | 5.6 | 11.4 | 33.2 | 36.0 |
| `cc_avg_loc_per_function` | 18.04 | 10.52 | 8.75 | 7.93 |
| `cc_median_loc_per_function` | 18.4 | 8.9 | 7.0 | 6.8 |
| `cognitive_avg` | 4.33 | 2.03 | 0.78 | 0.63 |
| `cognitive_max` | 11.8 | 4.8 | 4.6 | 3.0 |
| `mccabe_avg` | 8.24 | 5.72 | 2.96 | 2.56 |

On SOL the effect is far outside the noise: `cognitive_avg` 4.33 → 2.03 against
σ 0.70 and 0.33, `cc_median_loc_per_function` 18.4 → 8.9 against σ 5.41 and 1.95.
On Opus every one of these deltas is inside one σ, so the Opus column is a
direction without a demonstrated effect.

The method does not achieve this by writing less code — Code Mass (APP) rises
517.4 → 595.2 on SOL. It buys smaller units with roughly 15 % more code and
twice the function count.

---

## F-1.11.2 — The isolated Refactor subagent decomposes further on Opus and not on SOL

Moving the per-cycle Refactor step out of the main context into an isolated
subagent is the only difference between `exact-ptdd-v1` and
`exact-ptdd-v1.1-refactor-subagent`. On Opus it keeps decomposing; on SOL it
lands on top of the shared-context arm.

| Outcome | Opus `v1` | Opus `v1.1` | SOL `v1` | SOL `v1.1` |
|---|---|---|---|---|
| `cc_functions` | 36.0 | 46.6 | 11.4 | 11.4 |
| `cc_avg_loc_per_function` | 7.93 | 6.35 | 10.52 | 10.72 |
| `cognitive_avg` | 0.63 | 0.48 | 2.03 | 1.96 |
| `mccabe_avg` | 2.56 | 2.04 | 5.72 | 5.78 |
| `refactor_events` | 13.2 | 67.6 | 6.0 | 9.33 |

`refactor_events` is the mechanism and is boundary-safe: on Opus the isolated
subagent performs 67.6 refactorings per run against 13.2 in shared context, a
factor of 5. On SOL the same architecture produces 9.33 against 6.0.

The Opus `v1.1` numbers carry a caveat beyond the correctness gate: σ is large
(`cc_functions` σ 19.68, Code Mass (APP) σ 411.13) because the cell contains the
budget-exhausted run of F-1.11.4, whose truncated code reads as extreme
flatness. The direction holds without that run, the magnitude does not.

---

## F-1.11.3 — Isolation's budget cost falls almost entirely on Opus

The same architectural change costs 3.7× on Opus and 1.1× on SOL.

| Outcome | Opus `v1` | Opus `v1.1` | factor | SOL `v1` | SOL `v1.1` | factor |
|---|---|---|---|---|---|---|
| `cost_usd` | $20.44 | $76.59 | 3.7× | $0.94 | $1.04 | 1.1× |
| `total_tokens` | 27.2 M | 83.4 M | 3.1× | 2.84 M | 2.07 M | 0.7× |
| `duration_seconds` | 1500 | 6292 | 4.2× | 684.4 | 1430.4 | 2.1× |
| `chain_suite_runs` | 110 | 230.6 | 2.1× | 86.8 | 46.0 | 0.5× |

On SOL the isolated arm consumes **fewer** tokens than the shared-context arm
(2.07 M against 2.84 M) while taking twice the wall-clock time. The cost
explosion is therefore not a property of the architecture; it is a property of
the architecture on this harness and model pair. `chain_suite_runs` shows the
same split: the Opus subagent runs the suite 230.6 times per run, the SOL
subagent 46.0.

In absolute terms the Opus subagent arm costs $76.59 per run against $1.04 for
the SOL one — a factor of 74 for the same method on the same kata.

---

## F-1.11.4 — The only correctness break is a budget exhaustion, not a wrong implementation

Five of six cells are at Correctness (external) ≥ 0.97. The exception is
`exact-ptdd-v1.1-refactor-subagent-cc` at 0.79 (σ 0.44), and the whole deficit
is one run.

| Cell | Correctness (external) | min | σ |
|---|---|---|---|
| `baseline-inline-tdd-v1-cc` | 0.97 | 0.87 | 0.06 |
| `baseline-inline-tdd-v1-pi` | 1.00 | 1.00 | 0 |
| `exact-ptdd-v1-cc` | 1.00 | 1.00 | 0 |
| `exact-ptdd-v1-pi` | 1.00 | 1.00 | 0 |
| `exact-ptdd-v1.1-refactor-subagent-cc` | 0.79 | 0.00 | 0.44 |
| `exact-ptdd-v1.1-refactor-subagent-pi` | 1.00 | 1.00 | 0 |

The 0.00 run hit the 7200 s per-run budget. It was working when it was cut off:
99 suite invocations, 29 cycles, 168 commits, 526 lines of production Rust, and
a green internal suite. It has no `experiment-done.txt`, so the test list was
unfinished and the external suite scored 0. The other four runs of the cell are
at 0.93, 1.00, 1.00, 1.00.

This is a budget finding, not an error: timeouts count toward `min_replicates`
and are not refilled. It is also the direct consequence of F-1.11.3 — the arm
whose mean duration is 6292 s against a 7200 s budget is the arm that loses a
replicate to the clock. Four of its five runs exceeded 5500 s.

---

## F-1.11.5 — clippy does not separate the methods on this kata

Smell Total is 0 in four of six cells and below 1 in the other two.

| Cell | Smell Total | `smell_complexity` | `smell_duplication` | `smell_code_quality` |
|---|---|---|---|---|
| `baseline-inline-tdd-v1-cc` | 0 | 0 | 0 | 0 |
| `baseline-inline-tdd-v1-pi` | 0.6 | 0.4 | 0 | 0.2 |
| `exact-ptdd-v1-cc` | 0 | 0 | 0 | 0 |
| `exact-ptdd-v1-pi` | 0 | 0 | 0 | 0 |
| `exact-ptdd-v1.1-refactor-subagent-cc` | 0 | 0 | 0 | 0 |
| `exact-ptdd-v1.1-refactor-subagent-pi` | 0.4 | 0.2 | 0 | 0.2 |

`smell_duplication` is 0 in all thirty runs. The non-zero cells are both SOL
arms, each driven by a single run with two findings; σ is 0.89 against a mean of
0.4–0.6.

The reading is about the instrument, not the methods: on Claim Office in Rust,
the canonical clippy gate finds essentially nothing in any arm, so Smell Total
carries no signal here. The complexity and unit-size metrics do the work — which
is why F-1.11.1 and F-1.11.2 rest on those and not on this table. clippy has no
magic-number lint, so that bucket is structurally absent rather than zero.

---

## F-1.11.6 — Mutation Score is saturated; the mutant population carries what signal there is

All six cells score between 0.96 and 0.99. The spread is at or below σ in every
pairing, so the column does not order the methods.

| Cell | Mutation Score | `mutants_total` | `mutants_survived` |
|---|---|---|---|
| `baseline-inline-tdd-v1-cc` | 0.96 | 101.0 | 4.0 |
| `baseline-inline-tdd-v1-pi` | 0.99 | 77.0 | 1.0 |
| `exact-ptdd-v1-cc` | 0.98 | 117.2 | 3.0 |
| `exact-ptdd-v1-pi` | 0.98 | 101.4 | 2.0 |
| `exact-ptdd-v1.1-refactor-subagent-cc` | 0.98 | 113.2 | 2.6 |
| `exact-ptdd-v1.1-refactor-subagent-pi` | 0.99 | 86.2 | 1.2 |

Reporting the ratio alone would mislead, because the arms differ in code size and
the denominator is the mutant population. On SOL the method raises
`mutants_total` 77.0 → 101.4 while `mutants_survived` rises 1.0 → 2.0: the score
falls from 0.99 to 0.98 although the suite is covering a one-third larger
population. On Opus the same comparison runs 101.0 → 117.2 with survivors
falling 4.0 → 3.0.

Two cells contain a run with a visibly smaller population — 54 mutants in the
Opus subagent cell (the budget-exhausted run of F-1.11.4) and 41 in the SOL
subagent cell. Both scored 1.00, which flatters their cells: a perfect score over
a small population is the easiest score in the table.

---

## F-1.11.7 — One test at a time holds in all four EXACT arms and in neither control

`red_batch_max` is the boundary-safe column for "one test at a time" and is the
sharpest separation in the RQ.

| Cell | `red_batch_max` | `red_batch_size` | `tdd_discipline_step` | n |
|---|---|---|---|---|
| `baseline-inline-tdd-v1-cc` | 1.67 | 1.67 | 0.67 | 3 |
| `baseline-inline-tdd-v1-pi` | 4.0 | 3.8 | 0.34 | 5 |
| `exact-ptdd-v1-cc` | **1.0** | 1.0 | **1.00** | 5 |
| `exact-ptdd-v1-pi` | **1.0** | 1.0 | **1.00** | 5 |
| `exact-ptdd-v1.1-refactor-subagent-cc` | **1.0** | 1.0 | **1.00** | 5 |
| `exact-ptdd-v1.1-refactor-subagent-pi` | **1.0** | 1.0 | **1.00** | 3 |

All four EXACT arms sit at exactly 1.0 with σ 0 on both batch columns and at
`tdd_discipline_step` 1.00 with σ 0 — not an average near one, but every single
red phase in every run introducing exactly one failing test. The SOL control
batches up to 6 tests at once (mean max 4.0), the Opus control up to 2.

`tdd_discipline_step` is boundary-safe where the overall `tdd_discipline` score is
not, which is why this finding uses it. The n=3 cells are explained in F-1.11.8.

---

## F-1.11.8 — Three subagent-pi runs lost their phase chain to the recorder, not to the workflow

Three of the thirty runs carry no `tdd-events.jsonl`, so every phase-chain column
is null for them. All three are in `exact-ptdd-v1.1-refactor-subagent-pi`, which
therefore reports discipline columns at n=3 instead of n=5. Two
`baseline-inline-tdd-v1-cc` runs have events but no computable
`tdd_discipline_step`, putting that cell at n=3 as well.

| Cell | n for quality / correctness | n for discipline columns |
|---|---|---|
| `exact-ptdd-v1.1-refactor-subagent-pi` | 5 | 3 |
| `baseline-inline-tdd-v1-cc` | 5 | 3 |
| the other four cells | 5 | 5 |

The loss is instrumental, not behavioural. The three runs completed normally
(`exit_reason` ok, Correctness (external) 1.00, green suites) and did run the
suite — 36 real `cargo test` invocations in one of them. The Rust recorder is a
`cargo` launcher that swallowed its own failures by design, so the runs carry no
trace of why nothing was written. A deliberate reproduction attempt hit the same
loss once in three runs, confirming it is intermittent and confined to this cell;
it is not explained by a nested manifest, a missing mount, `TDD_REPORTER_OFF`, a
TCR revert, or the subagent's working directory, all of which were checked and
ruled out.

Quality, correctness, size, Mutation Score and cost are unaffected and complete
at n=5 in all six cells. The recorder now records why it declines, so the next
occurrence names its own cause instead of leaving a silent null.
