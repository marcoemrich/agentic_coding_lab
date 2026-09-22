# Findings — RQ-exact-coding-python

## Overview

All values are cell means ± standard deviation at `n=5` unless a cell states
otherwise. Comparisons are only ever within one kata and one model; the three
methods are the columns. **Inline** is the minimal inline-TDD instruction,
**EXACT v1** the shared-context Predictive TDD workflow, **EXACT v1.1** the same
workflow with the Refactor step delegated to an isolated subagent.

Complexity and cost are lower = better, Mutation Score higher = better. Bold
values with 🏆 mark the winner of that row. A trophy is shared when the gap to
the best cell is smaller than **the best cell's** own standard deviation, so
three trophies in a row read as "no effect".

`unit_size_max`, `code_mass`, Production LoC and the process-marker counts have
no unambiguous direction and receive no trophy; they appear in the individual
findings as context.

**This table shows Claim Office only.** Game of Life is training-known, and
under a minimal instruction both models already produce low-complexity code on
it, so its cells separate almost nowhere and would pad the overview without
adding to it. The kata remains part of the RQ and its cells are reported in the
findings below, where they serve as the control that shows the effect depends on
the specification being novel.

**Correctness guard — passed.** Every one of the twelve cells clears the 0.90
gate, so every quality row below is eligible. Correctness (internal) and
completion within budget are 100 % everywhere; Correctness (external) is
1.00 ± 0.00 in eleven cells. The single deviation is Opus 5 on Claim Office
under EXACT v1.1 at 0.97 ± 0.04, which misses one of fifteen scenarios in two
of five runs — worth watching, since it is the only place in this RQ where
adding workflow costs a scenario, but not enough to disqualify the cell.

### Cognitive Complexity, hardest function (`cognitive_max`), lower = better

| Model | Inline | EXACT v1 | EXACT v1.1 |
|---|---:|---:|---:|
| GPT-5.6 SOL | 14.2 ± 3.6 | **5.0 ± 1.0** 🏆 | **4.8 ± 1.3** 🏆 |
| Opus 5 | 6.2 ± 1.6 | 7.0 ± 0.7 | **4.6 ± 1.3** 🏆 |

### Mutation Score, higher = better

`n` differs by cell; see [Mutation Score coverage](README.md#mutation-score-coverage).

| Model | Inline | EXACT v1 | EXACT v1.1 |
|---|---:|---:|---:|
| GPT-5.6 SOL | 0.738 ± 0.093 | **0.914 ± 0.004** 🏆 *(n=2)* | — *(n=0)* |
| Opus 5 | **0.916 ± 0.009** 🏆 | **0.938 ± 0.025** 🏆 | **0.925 ± 0.019** 🏆 |

### List-price cost per run, lower = better

| Model | Inline | EXACT v1 | EXACT v1.1 |
|---|---:|---:|---:|
| GPT-5.6 SOL | **$0.52** 🏆 | $4.60 | $14.61 |
| Opus 5 | **$2.70** 🏆 | $17.55 | $28.66 |

---

## F-1.9.1 — The complexity benefit appears only where the inline baseline is weak

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

## F-1.9.2 — Python reproduces the Java pattern; the TypeScript magnitude belonged to an older model

The question this RQ was opened for is whether the code-quality benefit carries
over to Python as it did on TypeScript and Java. It does — and the three stacks
disagree far less than their headline numbers suggest, because the effect tracks
the inline baseline and the baseline is set by the model, not by the language.

Effect on Cognitive Complexity, expressed as the inline mean divided by the
EXACT mean. Ratios are within-stack and therefore comparable across stacks;
the absolute values behind them are not, because SonarJS, PMD and complexipy
produce different finding populations.

| Stack | Model | Kata | Inline | EXACT v1 | Effect |
|---|---|---|---:|---:|---:|
| TypeScript | Opus 4.7 | Game of Life | 21.8 | 6.5 | 3.4× |
| TypeScript | Opus 4.7 | Claim Office | 19.8 | 5.7 | 3.5× |
| Python | GPT-5.6 SOL | Claim Office | 14.2 | 5.0 | 2.8× |
| Python | GPT-5.6 SOL | Game of Life | 10.4 | 4.2 | 2.5× |
| Java | GPT-5.6 SOL | Game of Life | 9.8 | 5.8 | 1.7× |
| Java | GPT-5.6 SOL | Claim Office | 9.8 | 5.8 | 1.7× |
| Java | Opus 5 | Claim Office | 6.6 | 4.4 | 1.5× |
| Java | Opus 5 | Game of Life | 5.0 | 4.6 | 1.1× |
| Python | Opus 5 | Claim Office | 6.2 | 7.0 | 0.9× |
| Python | Opus 5 | Game of Life | 5.0 | 5.4 | 0.9× |

Sorted by effect, the rows sort themselves by inline baseline. Two readings
follow.

**EXACT Coding sets a floor rather than multiplying.** The EXACT column spans
4.2 to 7.0 across every stack, model and kata in the table — a factor of 1.7
between the best and worst result — while the inline column spans 5.0 to 21.8,
a factor of 4.4. The workflow pulls the hardest function down to roughly the
same complexity wherever it starts. Where the model already produces code at
that level, there is nothing left to take away, and the shared-context variant
costs a little instead.

**The TypeScript result is an Opus 4.7 result.** Its 3.4× is the largest effect
in the lab's data, and it comes from an inline baseline of ~20. On Opus 5 the
same instruction on Claim Office produces 6.8 on TypeScript (n=4,
`baseline-inline-tdd-v1.1-local-git-cc`), against 6.6 on Java and 6.2 on Python.
The inline baseline fell by a factor of three between the two model generations,
and the room EXACT Coding used to fill fell with it. The comparison is indicative
rather than exact — that TypeScript cell uses the `v1.1-local-git` control and a
different tool chain — but three stacks landing within 0.6 of each other on the
same model, against ~20 on the previous one, is not a coincidence of tooling.

So the answer to "does it bring quality on Python like on Java and TypeScript"
is: **on the same model, Python behaves like Java.** Both show a clear benefit
on GPT-5.6 SOL and next to none on Opus 5. Neither reproduces the TypeScript
magnitude, and neither should be expected to, because that magnitude belongs to
a model whose unaided output was three times more complex.

The isolated-refactor variant is the exception worth noting: it reaches
3.0 ± 0.7 on Game of Life with Opus 5 where the shared-context variant reaches
5.4 ± 3.1, and 4.6 ± 1.3 against 7.0 ± 0.7 on Claim Office. Where EXACT v1 has
run out of room on a strong model, v1.1 still finds some — at 1.6× its cost.

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

**The quality benefit carries over to Python, and it behaves as it did on
Java.** On GPT-5.6 SOL, EXACT Coding thirds Cognitive Complexity on both katas
— 2.5× and 2.8×, the largest effects in the lab's data outside the TypeScript
runs on Opus 4.7. On Opus 5 it produces none in the shared-context variant,
which is exactly what Java showed on the same model. The language is not the
variable that decides this; the model's unaided output is (F-1.9.2).

Read that way, the three stacks agree rather than disagree. EXACT Coding drives
the hardest function to roughly 4–7 wherever it starts, across every stack,
model and kata measured. The spectacular TypeScript figure came from starting
at 20. Opus 5 starts at 5–6.6 on both Java and Python, so there is little left
to take.

The isolated-refactor variant is the one that still finds room on a strong
model: lowest Cognitive Complexity in three of four cells, including both Opus 5
cells where EXACT v1 did nothing. It pays for that with 1.6–3.2× the cost of
v1, a doubled unit count without a smaller longest unit (F-1.9.7), and the only
correctness deviation in the RQ.

Two results run against expectation. The Mutation Score ordering that held
across all four Java cells holds in none of the three evaluable Python ones
(F-1.9.3), which makes the Java finding a property of PIT's mutant population
rather than of the method. And the cost of the workflow is 8–28× inline TDD
(F-1.9.5), which only the Claim Office / SOL cell earns back in measured quality
(F-1.9.4).

Two limits bound these readings. Mutation Score is missing for one of the four
model × kata combinations entirely (F-1.9.6), so that hypothesis is answered on
three. And the Claim Office / Opus 5 / v1.1 cell was refilled after provider-side
aborts concentrated in that arm; the provenance note in
[README.md](README.md#execution-provenance--2026-09-22-refill) states why that
repetition is not clearly unbiased.

Correctness is a guard here, not a result: all twelve cells clear the gate, so
all quality comparisons are eligible. The one deviation — Opus 5 on Claim Office
under v1.1, 0.97 ± 0.04 — is recorded because a drop is the only thing this
metric is carried to show.

Cross-stack statements in this document compare effect ratios and orderings, never
absolute values. ruff, PMD and ESLint/SonarJS produce different finding
populations, and mutmut, PIT and Stryker different mutant populations.

Data and reproducibility: [summary.md](summary.md), [runs.csv](runs.csv), and
the design in [README.md](README.md).
