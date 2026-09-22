# Findings — RQ-exact-coding-python

## Overview

All values are cell means ± standard deviation at `n=5` unless a cell states
otherwise. Comparisons are only ever within one kata and one model; the three
methods are the columns. **Inline** is the minimal inline-TDD instruction,
**EXACT v1** the shared-context Predictive TDD workflow, **EXACT v1.1** the same
workflow with the Refactor step delegated to an isolated subagent.

Correctness and Mutation Score are higher = better; complexity and cost are
lower = better. Bold values with 🏆 mark the winner of that row. A trophy is
shared when the gap to the best cell is smaller than **the best cell's** own
standard deviation, so three trophies in a row read as "no effect". Every cell clears the
0.90 correctness gate, so all quality and cost rows are eligible.

`unit_size_max`, `code_mass`, Production LoC and the process-marker counts have
no unambiguous direction and receive no trophy; they appear in the individual
findings as context.

### Correctness (external), higher = better

| Kata | Model | Inline | EXACT v1 | EXACT v1.1 |
|---|---|---:|---:|---:|
| Game of Life | GPT-5.6 SOL | **1.00** 🏆 | **1.00** 🏆 | **1.00** 🏆 |
| Game of Life | Opus 5 | **1.00** 🏆 | **1.00** 🏆 | **1.00** 🏆 |
| Claim Office | GPT-5.6 SOL | **1.00** 🏆 | **1.00** 🏆 | **1.00** 🏆 |
| Claim Office | Opus 5 | **1.00** 🏆 | **1.00** 🏆 | 0.97 ± 0.04 |

Correctness (internal) is 100 % and completion within budget is 100 % in all
twelve cells.

### Cognitive Complexity, hardest function (`cognitive_max`), lower = better

| Kata | Model | Inline | EXACT v1 | EXACT v1.1 |
|---|---|---:|---:|---:|
| Game of Life | GPT-5.6 SOL | 10.4 ± 5.5 | 4.2 ± 1.5 | **3.0 ± 0.7** 🏆 |
| Game of Life | Opus 5 | 5.0 ± 1.9 | 5.4 ± 3.1 | **3.0 ± 0.7** 🏆 |
| Claim Office | GPT-5.6 SOL | 14.2 ± 3.6 | **5.0 ± 1.0** 🏆 | **4.8 ± 1.3** 🏆 |
| Claim Office | Opus 5 | 6.2 ± 1.6 | 7.0 ± 0.7 | **4.6 ± 1.3** 🏆 |

### Mutation Score, higher = better

`n` differs by cell; see [Mutation Score coverage](README.md#mutation-score-coverage).

| Kata | Model | Inline | EXACT v1 | EXACT v1.1 |
|---|---|---:|---:|---:|
| Game of Life | GPT-5.6 SOL | **0.914 ± 0.035** 🏆 | **0.901 ± 0.047** 🏆 | **0.889 ± 0.087** 🏆 |
| Game of Life | Opus 5 | **0.932 ± 0.015** 🏆 | **0.924 ± 0.050** 🏆 | 0.904 ± 0.072 |
| Claim Office | GPT-5.6 SOL | 0.738 ± 0.093 | **0.914 ± 0.004** 🏆 *(n=2)* | — *(n=0)* |
| Claim Office | Opus 5 | **0.916 ± 0.009** 🏆 | **0.938 ± 0.025** 🏆 | **0.925 ± 0.019** 🏆 |

### List-price cost per run, lower = better

| Kata | Model | Inline | EXACT v1 | EXACT v1.1 |
|---|---|---:|---:|---:|
| Game of Life | GPT-5.6 SOL | **$0.37** 🏆 | $1.63 | $4.75 |
| Game of Life | Opus 5 | **$1.17** 🏆 | $5.62 | $9.11 |
| Claim Office | GPT-5.6 SOL | **$0.52** 🏆 | $4.60 | $14.61 |
| Claim Office | Opus 5 | **$2.70** 🏆 | $17.55 | $28.66 |

---

## F-1.9.1 — Neither EXACT Coding variant improves correctness on the Python tasks

Correctness is saturated under inline TDD. Eleven of twelve cells reach 1.00
external correctness with zero variance, and internal tests pass in all sixty
runs. The single exception is Opus 5 on Claim Office under EXACT v1.1, which
misses one of fifteen scenarios in two of five runs.

| Kata | Model | Inline | EXACT v1 | EXACT v1.1 |
|---|---|---:|---:|---:|
| Game of Life | GPT-5.6 SOL | 1.00 ± 0.00 | 1.00 ± 0.00 | 1.00 ± 0.00 |
| Game of Life | Opus 5 | 1.00 ± 0.00 | 1.00 ± 0.00 | 1.00 ± 0.00 |
| Claim Office | GPT-5.6 SOL | 1.00 ± 0.00 | 1.00 ± 0.00 | 1.00 ± 0.00 |
| Claim Office | Opus 5 | 1.00 ± 0.00 | 1.00 ± 0.00 | 0.97 ± 0.04 |

This replicates the Java result: the additional structure buys no correctness
where a test-first instruction already reaches the ceiling. H1 holds, and the
finding is now observed on two stacks rather than one.

---

## F-1.9.2 — The complexity benefit appears only where the inline baseline is weak

EXACT Coding lowers Cognitive Complexity substantially in the two cells where
inline TDD produced complex code, and does nothing measurable in the two where
it did not. The decisive quantity is not the workflow but the starting point.

| Kata | Model | Inline | EXACT v1 | EXACT v1.1 | Inline → v1 separated? |
|---|---|---:|---:|---:|---|
| Claim Office | GPT-5.6 SOL | 14.2 ± 3.6 | 5.0 ± 1.0 | 4.8 ± 1.3 | yes, 9.2 > 3.6 |
| Game of Life | GPT-5.6 SOL | 10.4 ± 5.5 | 4.2 ± 1.5 | 3.0 ± 0.7 | yes, 6.2 > 5.5 |
| Claim Office | Opus 5 | 6.2 ± 1.6 | 7.0 ± 0.7 | 4.6 ± 1.3 | no |
| Game of Life | Opus 5 | 5.0 ± 1.9 | 5.4 ± 3.1 | 3.0 ± 0.7 | no |

The rows are sorted by the inline baseline. Where it sits above 10, EXACT
Coding roughly thirds it and the gap exceeds the baseline's own spread. Where it
sits at 5–6, EXACT v1 changes nothing and is marginally worse on both katas.

`mccabe_max` moves the same way: 8.6 → 3.4 on Claim Office with SOL, and
3.8 → 3.6 on the same kata with Opus.

The one effect EXACT v1.1 produces independently of the baseline is on Game of
Life with Opus, where it reaches 3.0 ± 0.7 against an inline 5.0 ± 1.9. That gap
of 2.0 just exceeds the inline spread and is the only place where the isolated
subagent separates from inline TDD on a cell the shared-context variant could
not improve.

---

## F-1.9.3 — The Java Mutation Score ordering does not reproduce

On Java, Mutation Score was the only outcome that ordered the three methods
identically in all four model × kata combinations, with EXACT v1.1 ahead
everywhere. On Python that ordering holds in none of the three evaluable
combinations, and on Game of Life the score declines monotonically as workflow
is added — on both models.

| Kata | Model | Inline | EXACT v1 | EXACT v1.1 |
|---|---|---:|---:|---:|
| Game of Life | GPT-5.6 SOL | 0.914 ± 0.035 | 0.901 ± 0.047 | 0.889 ± 0.087 |
| Game of Life | Opus 5 | 0.932 ± 0.015 | 0.924 ± 0.050 | 0.904 ± 0.072 |
| Claim Office | Opus 5 | 0.916 ± 0.009 | 0.938 ± 0.025 | 0.925 ± 0.019 |

Every one of these contrasts is inside one standard deviation, so the reading is
"no method effect on test strength", not "inline TDD writes stronger suites".
The load-bearing point is the absence of the Java pattern: there, the ordering
was consistent enough across four independent cells to be reported as a method
property. Here it is not consistent in any of them.

H3 therefore fails on Python. The Java finding is better read as a property of
that stack's mutant population than as a property of the method.

The fourth combination, Claim Office with GPT-5.6 SOL, cannot be evaluated:
Mutation Score is unavailable for three of five EXACT v1 runs and all five
EXACT v1.1 runs (see F-1.9.6).

---

## F-1.9.4 — One cell carries a broad, large benefit: Claim Office with GPT-5.6 SOL

This is the only cell in which EXACT Coding improves several independent
outcomes at once, and the improvements are large relative to their spread.

| Outcome | Inline | EXACT v1 | Direction |
|---|---:|---:|---|
| `cognitive_max` | 14.2 ± 3.6 | 5.0 ± 1.0 | lower = better |
| `mccabe_max` | 8.6 ± 1.1 | 3.4 ± 0.5 | lower = better |
| `unit_size_max` | 31.4 ± 4.2 | 17.6 ± 2.4 | context |
| Code Mass (APP) | 875.8 ± 36.4 | 590.2 ± 50.4 | context |
| Mutation Score | 0.738 ± 0.093 | 0.914 ± 0.004 *(n=2)* | higher = better |
| Unnoticed changes | 95.0 ± 40.5 | 17.0 ± 2.8 *(n=2)* | lower = better |
| Test count | 12.4 ± 3.8 | 34.8 ± 8.9 | context |

The mutant counts are quoted alongside the score because the arms differ in
code size: Code Mass (APP) falls by a third, so the mutant population shrinks
too. The absolute number of unnoticed behaviour changes falls from 95 to 17,
which is the stronger statement — the suite does not merely cover a smaller
denominator, it leaves far less undetected.

This cell is also where inline TDD is weakest: a mean Mutation Score of 0.738 is
the lowest in the whole RQ, against 0.914–0.932 everywhere else. The pattern of
F-1.9.2 repeats — EXACT Coding closes a gap rather than raising a ceiling.

The Mutation Score figures rest on `n=2` and the caveat in F-1.9.6 applies.

---

## F-1.9.5 — The workflow costs four to eleven times inline TDD for the same correctness

| Kata | Model | Inline | EXACT v1 | EXACT v1.1 | v1.1 / inline |
|---|---|---:|---:|---:|---:|
| Game of Life | GPT-5.6 SOL | $0.37 | $1.63 | $4.75 | 12.7× |
| Game of Life | Opus 5 | $1.17 | $5.62 | $9.11 | 7.8× |
| Claim Office | GPT-5.6 SOL | $0.52 | $4.60 | $14.61 | 27.9× |
| Claim Office | Opus 5 | $2.70 | $17.55 | $28.66 | 10.6× |

Wall-clock follows the same shape: Claim Office with SOL runs 341 s under inline
TDD and 5686 s under EXACT v1.1. Costs are token-derived list-price equivalents,
not invoices.

Read together with F-1.9.1 and F-1.9.3, the overhead is justified in this data
only for the Claim Office / SOL cell of F-1.9.4. In the three cells where
correctness is saturated and complexity is already low, EXACT Coding buys a
lower Complexity Peak on two of them and pays 8–13× for it.

---

## F-1.9.6 — On Claim Office, the SOL ports write end-to-end suites, and that is measurable

Eight of the sixty runs have test suites that never import the production
module: every assertion runs the CLI in a subprocess. They fall into exactly two
cells, both on the pi ports and both on the long novel specification.

| Kata | Model | Method | End-to-end-only suites |
|---|---|---|---:|
| Claim Office | GPT-5.6 SOL | EXACT v1.1 | 5 of 5 |
| Claim Office | GPT-5.6 SOL | EXACT v1 | 3 of 5 |
| all ten other cells | | | 0 |

Two measurements follow directly and are consequences of the test style, not
defects:

- `coverage_statements_pct` reads 0 for these runs. The production code does run,
  but not in the process coverage traces. The Claim Office / SOL column
  accordingly shows 71.0 (inline), 29.8 ± 41.1 (v1, a mixture of both styles)
  and 0.0 (v1.1).
- Mutation Score is unavailable for them. mutmut associates tests with mutants by
  tracing the test process and stops when that association is empty; a subprocess
  is invisible to it. This is a limit of the instrument against this test style,
  not a configuration error.

The effect is confined to one model on one kata, so it is not a property of
EXACT Coding as such. What the data supports is narrower: under this workflow on
a long novel specification, GPT-5.6 SOL tends to verify through the delivered
interface rather than the domain API, and the isolated-refactor variant did so in
every run.

---

## F-1.9.7 — EXACT v1.1 decomposes further without a matching quality gain

The isolated Refactor subagent produces markedly more named units than the
shared-context variant, most visibly on Claim Office.

| Kata | Model | `unit_count` Inline → v1 → v1.1 | `unit_size_max` Inline → v1 → v1.1 |
|---|---|---|---|
| Claim Office | GPT-5.6 SOL | 11.2 → 13.4 → 31.8 | 31.4 → 17.6 → 18.2 |
| Claim Office | Opus 5 | 20.6 → 23.6 → 42.0 | 16.6 → 17.6 → 18.8 |
| Game of Life | GPT-5.6 SOL | 2.8 → 7.2 → 10.2 | 15.2 → 9.4 → 7.2 |
| Game of Life | Opus 5 | 4.2 → 9.8 → 11.4 | 9.4 → 8.6 → 8.0 |

On both Claim Office cells the unit count roughly doubles from v1 to v1.1 while
the longest unit does not shrink — on Opus it grows, alongside Production LoC
rising from 263.2 to 508.6. The decomposition is real but it arrives together
with more code, so it is redistribution into more, smaller units rather than
removal.

Against that, v1.1 delivers the lowest `cognitive_max` in three of four cells
and costs 1.6–3.2× what v1 costs. Neither the correctness (F-1.9.1) nor the
Mutation Score (F-1.9.3) rows support the extra spend.

---

## Overall interpretation

The Python stack carries EXACT Coding: sixty runs, twelve full cells, internal
correctness everywhere, external correctness at or near the ceiling in every
cell, and no infrastructure failure in the measured set.

What does not carry over is the expectation the Java RQ set. On Python the
method's measurable benefit concentrates in one of four model × kata
combinations — the weaker model on the long novel specification — where it
thirds Cognitive Complexity, cuts Code Mass (APP) by a third and reduces
unnoticed behaviour changes from 95 to 17 per run. In the other three
combinations inline TDD already reaches the correctness ceiling with low
complexity, and EXACT Coding buys a lower Complexity Peak on two of them at
8–13× the cost. The Mutation Score ordering that held across all four Java cells
holds in none of the three evaluable Python ones.

Two limits bound these readings. Mutation Score is missing for one of the four
combinations entirely (F-1.9.6), so H3 is answered on three, not four. And the
Claim Office / Opus / v1.1 cell was refilled after provider-side aborts
concentrated in that arm; the provenance note in
[README.md](README.md#execution-provenance--2026-09-22-refill) states why that
repetition is not clearly unbiased.

Comparisons with RQ-exact-coding-java are comparisons of directions and
orderings only. ruff, PMD and ESLint/SonarJS produce different finding
populations, and mutmut, PIT and Stryker different mutant populations; the
absolute values are not interchangeable.

Data and reproducibility: [summary.md](summary.md), [runs.csv](runs.csv), and
the design in [README.md](README.md).
