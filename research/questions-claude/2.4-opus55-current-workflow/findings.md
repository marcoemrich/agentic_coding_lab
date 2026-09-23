# Findings — RQ-opus55-current-workflow

## Key result

**The workflow gap is larger on Opus 5.5 than on Opus 5.** Every quality axis
that separates at all separates *more* between the inline instruction and EXACT
Coding on the newer model:

| | Opus 5: Inline → EXACT | Opus 5.5: Inline → EXACT |
|---|---|---|
| Complexity Peak ↓ | 5.6 → 2.6 (−54 %) | 8.2 → 2.0 (**−76 %**) |
| `mccabe_max` ↓ | 5.6 → 3.2 (−43 %) | 7.8 → 3.0 (**−62 %**) |
| `unit_size_avg` ↓ | 8.63 → 6.10 (−29 %) | 8.22 → 4.54 (**−45 %**) |
| `unit_size_median` ↓ | 6.2 → 5.0 (−19 %) | 5.5 → 3.3 (**−40 %**) |
| Mutation Score ↑ | 0.91 → 0.88 (−0.03) | 0.74 → 0.94 (**+0.20**) |

The scaffolding is worth **more** on the newer model, not less — the opposite of
what the RQ set out to test (H2). Three consequences, each carried by its own
finding below:

- **The model upgrade pays only under the workflow.** Holding the arm constant
  and comparing the models, Opus 5.5 wins or ties every row under EXACT Coding
  and loses every separating row under the inline instruction (F-2.4.1,
  F-2.4.2).
- **The mechanism is decomposition, not volume.** Both models roughly double
  their number of named units under the workflow at near-constant Production
  LoC. The workflow does not make them write more code; it makes them cut the
  same amount into twice as many pieces (F-2.4.1).
- **The cost figure must not be read as a model result.** Under EXACT Coding
  Opus 5.5 spends 70 % more tokens than Opus 5 and still costs 16 % less,
  entirely because of its cache-read tariff (F-2.4.4).

Scope: one kata (Claim Office), one prompt style (Example Mapping), one stack
(TypeScript), n=5 per cell. Correctness is saturated across all four cells and
carries none of this.

## Overview

Cell means ± standard deviation, n=5 per cell, Claim Office / Example Mapping /
TypeScript / Claude Code 2.1.280. **Inline** is the minimal inline-TDD
instruction (`baseline-inline-tdd-v1.1-local-git-cc`), **EXACT** the maintained
shared-context Predictive TDD workflow (`exact-ptdd-v1-cc`).

Bold values with 🏆 mark the winner of that row. A trophy is shared when the gap
is smaller than the larger of the two standard deviations involved, so several
trophies in a row read as "no difference". Three cells reach a standard
deviation of exactly 0, which would make the convention's usual yardstick (the
best cell's own σ) degenerate; the larger σ is used instead and named in each
case below.

All four cells clear the 0.90 correctness gate, so all are eligible for the
quality trophies.

**Quality** — Mutation Score higher = better; every complexity and size row
lower = better.

| | Inline / Opus 5 | EXACT / Opus 5 | Inline / Opus 5.5 | EXACT / Opus 5.5 |
|---|---:|---:|---:|---:|
| Correctness (external) | 1.00 ± 0 | 0.99 ± 0.03 | 1.00 ± 0 | 1.00 ± 0 |
| Mutation Score | **0.91 ± 0.07** 🏆 | 0.88 ± 0.04 | 0.74 ± 0.05 | **0.94 ± 0.04** 🏆 |
| Complexity Peak | 5.6 ± 1.82 | **2.6 ± 1.34** 🏆 | 8.2 ± 0.84 | **2.0 ± 0** 🏆 |
| `cognitive_avg` | 2.40 ± 0.54 | **1.37 ± 0.32** 🏆 | 2.49 ± 0.37 | **1.36 ± 0.06** 🏆 |
| `mccabe_max` | 5.6 ± 1.14 | **3.2 ± 0.45** 🏆 | 7.8 ± 2.05 | **3.0 ± 0** 🏆 |
| `mccabe_avg` | 2.13 ± 0.24 | **1.56 ± 0.21** 🏆 | 2.45 ± 0.25 | **1.46 ± 0.10** 🏆 |
| `unit_size_avg` | 8.63 ± 1.44 | 6.10 ± 1.23 | 8.22 ± 1.86 | **4.54 ± 0.28** 🏆 |
| `unit_size_median` | 6.2 ± 1.1 | 5.0 ± 1.0 | 5.5 ± 0.5 | **3.3 ± 0.45** 🏆 |

Correctness carries no trophy: three cells sit at 1.00 and the fourth at 0.99
(σ 0.03). The row is saturated and settles nothing — it is shown to document
that the quality trophies are not being awarded to a cell that skipped work.

Smell Total is 0 in all 20 runs and is omitted from the table. On this kata that
is its established value (it was deterministically 0 across every cell of
RQ-fable-vs-opus5 as well), so it is not evidence of anything here.

**Price and shape** — deliberately no trophies. The two workflow arms do
different amounts of work, so "cheaper" here names the arm that did less, not
the better result; and the cost ranking is decided by a tariff rather than by
consumption (F-2.4.4). Production LoC, Test LoC, Code Mass (APP), test count,
unit count and `mutants_total` have no unambiguous direction and appear as
context.

| | Inline / Opus 5 | EXACT / Opus 5 | Inline / Opus 5.5 | EXACT / Opus 5.5 |
|---|---:|---:|---:|---:|
| `duration_seconds` | 255 ± 43 | 897 ± 176 | 124 ± 8 | 871 ± 89 |
| `total_tokens` | 2.83 M ± 0.70 M | 14.7 M ± 4.4 M | 1.27 M ± 0.24 M | 25.0 M ± 2.3 M |
| `cost_usd` | $2.94 ± 0.56 | $11.83 ± 3.08 | $1.13 ± 0.12 | $9.96 ± 0.95 |
| Production LoC | 300.6 ± 42.97 | 292.6 ± 41.14 | 236.2 ± 11.26 | 237.0 ± 16.84 |
| Test LoC | 418.0 ± 53.65 | 593.2 ± 257.99 | 262.2 ± 21.94 | 266.4 ± 22.24 |
| Code Mass (APP) | 713.6 ± 83.71 | 690.6 ± 43.96 | 782.4 ± 69.26 | 642.4 ± 55.19 |
| `tests_total` | 46.0 ± 5.24 | 55.4 ± 2.88 | 33.0 ± 4.24 | 45.6 ± 2.97 |
| `unit_count` | 13.8 ± 3.7 | 25.0 ± 4.8 | 14.6 ± 5.22 | 24.6 ± 1.67 |
| `mutants_total` | 135.6 ± 24.28 | 134.2 ± 12.7 | 196.4 ± 22.77 | 126.2 ± 5.89 |
| `mutants_survived` | 13.6 ± 13.35 | 15.6 ± 5.5 | 49.8 ± 5.89 | 8.2 ± 5.02 |
| `mutants_no_coverage` | 1.2 ± 2.68 | 10.4 ± 6.5 | 17.0 ± 17.42 | 2.8 ± 2.68 |

`cost_usd` is a list-price comparison value, not an invoice — nothing is billed
per token on the Max subscription.

`test_blocks`, `test_cases_total` and `test_cases_first_block` are 0 in
essentially every run and carry no information here. They are declared as
outcomes but are inert on this run shape; do not read the zeros as a finding.

The TDD-discipline metrics (`refactorings_applied`, `predictions_*`,
`red_verified`) are deliberately absent — see F-2.4.5.

### The same 20 runs cut by model instead of by workflow

The table above compares the workflow arms. This one holds the arm constant and
compares the two models inside it, which is the cut that answers "is upgrading
the model worth it". Same runs, same conventions: bold + 🏆 on the winner, both
cells on a tie, a tie being a gap smaller than the larger of the two standard
deviations.

Correctness carries no trophy in either arm for the reason given above — it is
saturated at 0.99–1.00 and settles nothing.

**`baseline-inline-tdd-v1.1-local-git-cc`** — Mutation Score higher = better,
every complexity and size row lower = better.

| | Opus 5 | Opus 5.5 |
|---|---:|---:|
| Correctness (external) | 1.00 ± 0 | 1.00 ± 0 |
| Mutation Score | **0.91 ± 0.07** 🏆 | 0.74 ± 0.05 |
| Complexity Peak | **5.6 ± 1.82** 🏆 | 8.2 ± 0.84 |
| `cognitive_avg` | **2.40 ± 0.54** 🏆 | **2.49 ± 0.37** 🏆 |
| `mccabe_max` | **5.6 ± 1.14** 🏆 | 7.8 ± 2.05 |
| `mccabe_avg` | **2.13 ± 0.24** 🏆 | 2.45 ± 0.25 |
| `unit_size_avg` | **8.63 ± 1.44** 🏆 | **8.22 ± 1.86** 🏆 |
| `unit_size_median` | **6.2 ± 1.1** 🏆 | **5.5 ± 0.5** 🏆 |

**`exact-ptdd-v1-cc`** — same directions.

| | Opus 5 | Opus 5.5 |
|---|---:|---:|
| Correctness (external) | 0.99 ± 0.03 | 1.00 ± 0 |
| Mutation Score | 0.88 ± 0.04 | **0.94 ± 0.04** 🏆 |
| Complexity Peak | **2.6 ± 1.34** 🏆 | **2.0 ± 0** 🏆 |
| `cognitive_avg` | **1.37 ± 0.32** 🏆 | **1.36 ± 0.06** 🏆 |
| `mccabe_max` | **3.2 ± 0.45** 🏆 | **3.0 ± 0** 🏆 |
| `mccabe_avg` | **1.56 ± 0.21** 🏆 | **1.46 ± 0.10** 🏆 |
| `unit_size_avg` | 6.10 ± 1.23 | **4.54 ± 0.28** 🏆 |
| `unit_size_median` | 5.0 ± 1.0 | **3.3 ± 0.45** 🏆 |

The two tables run in opposite directions, which is the compact statement of
F-2.4.1 and F-2.4.2 together: **the model upgrade pays only under the workflow.**
Without it Opus 5.5 loses every row that separates at all — all three peak
measures and Mutation Score. With it, it wins or ties every row.

Read the inline arm's Mutation Score with the counts in the price table rather
than as a ratio: Opus 5.5 there produces the largest mutant population in the
whole RQ (196.4) **and** the most survivors (49.8), so the low score is a weaker
suite, not a shifted denominator.

---

## F-2.4.1 — The workflow's quality advantage does not shrink on the newer model, it grows

EXACT Coding lowers complexity and unit size against the inline instruction on
both models, and every one of those gaps is **larger** on Opus 5.5 than on
Opus 5.

| metric (lower = better) | Opus 5: Inline → EXACT | Opus 5.5: Inline → EXACT |
|---|---|---|
| Complexity Peak | 5.6 → 2.6 (−54 %) | 8.2 → 2.0 (−76 %) |
| `mccabe_max` | 5.6 → 3.2 (−43 %) | 7.8 → 3.0 (−62 %) |
| `unit_size_avg` | 8.63 → 6.10 (−29 %) | 8.22 → 4.54 (−45 %) |
| `unit_size_median` | 6.2 → 5.0 (−19 %) | 5.5 → 3.3 (−40 %) |

The decomposition mechanism is visible in `unit_count`: both models roughly
double their number of named units under the workflow (13.8 → 25.0 and
14.6 → 24.6) at near-constant Production LoC (300.6 → 292.6 and
236.2 → 237.0). The workflow does not make the models write more code; it makes
them cut the same amount of code into twice as many pieces.

This falsifies the RQ's H2, which expected a stronger model to have absorbed
what the scaffolding was compensating for. The recommendation in
`model-recommendation-matrix.md` transfers to Opus 5.5 on this kata, and the
qualifier "on native Opus 5" can be widened rather than tightened.

The Opus 5.5 EXACT cell is also the most reproducible cell in the field:
σ = 0 on both Complexity Peak and `mccabe_max` across five runs, against
σ 1.34 and 0.45 on the Opus 5 cell. Under the workflow the newer model does not
merely land lower, it lands in the same place every time.

---

## F-2.4.2 — Unscaffolded, Opus 5.5 writes more complex code than Opus 5

The inline arm runs the opposite direction to the model upgrade. On every peak
complexity measure Opus 5.5 is worse than Opus 5 without the workflow:

| metric (lower = better) | Inline / Opus 5 | Inline / Opus 5.5 |
|---|---:|---:|
| Complexity Peak | 5.6 ± 1.82 | 8.2 ± 0.84 |
| `mccabe_max` | 5.6 ± 1.14 | 7.8 ± 2.05 |
| `cognitive_avg` | 2.40 ± 0.54 | 2.49 ± 0.37 |
| `mccabe_avg` | 2.13 ± 0.24 | 2.45 ± 0.25 |

It reaches full Correctness (external) while doing it, and with markedly less
code (Production LoC 236.2 against 300.6, Test LoC 262.2 against 418.0) and 33
tests against 46. The picture is a model that solves the kata correctly in a
more compressed, denser form — fewer, larger, more branching units.

The peak gap sits outside the standard deviations on Complexity Peak
(5.6 ± 1.82 against 8.2 ± 0.84) and inside them on the averages, so the
defensible claim is about peaks, not about the whole distribution.

Read together with F-2.4.1 this is the RQ's practical result: the newer model
does not need less structural guidance on this kata, it needs at least as much.

---

## F-2.4.3 — Mutation Score moves in opposite directions under the workflow on the two models

The workflow raises Mutation Score sharply on Opus 5.5 and slightly lowers it on
Opus 5.

| | Inline | EXACT | Δ |
|---|---:|---:|---:|
| Opus 5 | 0.91 ± 0.07 | 0.88 ± 0.04 | −0.03 |
| Opus 5.5 | 0.74 ± 0.05 | 0.94 ± 0.04 | **+0.20** |

The ratio alone would overstate the cross-model comparison, because the mutant
population differs by a third between the arms. The counts behind it:

| | `mutants_total` | `mutants_survived` | `mutants_no_coverage` |
|---|---:|---:|---:|
| Inline / Opus 5 | 135.6 | 13.6 | 1.2 |
| EXACT / Opus 5 | 134.2 | 15.6 | 10.4 |
| Inline / Opus 5.5 | 196.4 | 49.8 | 17.0 |
| EXACT / Opus 5.5 | 126.2 | 8.2 | 2.8 |

The Opus 5.5 inline cell is genuinely the weakest suite, not a denominator
artefact: it has both the largest mutant population (196.4, a consequence of the
denser code in F-2.4.2) **and** the most survivors in absolute terms (49.8,
against 8.2–15.6 everywhere else). Its 33 tests do not reach the code they
cover.

The two miss-types separate the arms differently on the two models. On Opus 5
the workflow trades weak assertions for untested code (`mutants_survived`
13.6 → 15.6, `mutants_no_coverage` 1.2 → 10.4); on Opus 5.5 it improves both
(49.8 → 8.2 and 17.0 → 2.8). Only the Opus 5.5 movement exceeds its standard
deviations.

Against the field, the EXACT / Opus 5.5 cell's 0.94 and the inline / Opus 5
cell's 0.91 are a tie — the 0.03 gap is smaller than the 0.07 standard deviation
on the inline cell. The finding is the within-model delta, not a winner.

---

## F-2.4.4 — Opus 5.5 spends 70 % more tokens under the workflow and still costs less

Under EXACT Coding, Opus 5.5 consumes **25.0 M ± 2.3 M** tokens against Opus 5's
**14.7 M ± 4.4 M** — 70 % more — and lands at **$9.96 ± 0.95** against
**$11.83 ± 3.08**, 16 % less.

The whole reversal is the tariff. Opus 5.5 prices cache reads at 0.05× base
input ($0.20/MTok) where Opus 5 uses the standard 0.1× ($0.50/MTok), and on this
workflow cache reads dominate the token mix. At Opus 5's rate the same
consumption would have cost considerably more than Opus 5's own runs.

Consequences for anyone quoting a number from this RQ:

- **The cost figure is not a model-efficiency result.** Compare `total_tokens`
  first; on that axis Opus 5.5 is the more expensive model under this workflow,
  not the cheaper one.
- Wall-clock does not follow cost either: the two EXACT cells are
  indistinguishable at 871 ± 89 s against 897 ± 176 s, despite the token gap.
  The extra tokens are cache reads, which are cheap in time as well as in price.
- `cost_usd` is a list-price comparison value on a subscription where nothing is
  billed per token.

The inline arm shows the same tariff effect at a smaller scale: 1.27 M against
2.83 M tokens and $1.13 against $2.94. There the token and cost directions agree,
because Opus 5.5 genuinely does less work in that arm.

---

## F-2.4.5 — The TDD-discipline instrumentation does not survive Opus 5.5

Opus 5 and Opus 5.5 produce inverted transcript shapes on this workflow, and the
lab's TDD markers read assistant text only:

| | text blocks | thinking blocks | tool_use |
|---|---:|---:|---:|
| EXACT / Opus 5 | 75–99 | 0 | 77–102 |
| EXACT / Opus 5.5 | 6–9 | 131–153 | 105–116 |
| Inline / Opus 5.5 | 7–10 | 5–9 | 11–15 |

Opus 5 narrates every phase and emits no thinking blocks at all; Opus 5.5
inverts both. Thinking content is unreadable — the transcript stores
`"thinking": ""` with a signature, so the reasoning is encrypted, not merely
unformatted.

The result is not a clean zero but an **erratic** one, which is worse for a
comparison. Across the five EXACT / Opus 5.5 runs `predictions_total` reads
2, 0, 2, 8, 0 and `cycle_count` reads 1, 100, 1, 1, 2. The 100 is the
inline-tool inference taking over on a marker-free run and counting tool calls;
the 1s are the degenerate marker path. Two different measurement mechanisms
therefore appear in the same column.

`refactorings_applied`, `predictions_*`, `red_verified` and `cycle_count` are
consequently not outcomes of this RQ and no number from them may be published as
a model difference.

The discipline itself is not in doubt. The model's closing summaries report
activating tests one at a time, name a prediction it got wrong and recorded as
Incorrect, and self-report a process slip. The tool stream carries the same
rhythm — in the smoke run, 25 test invocations and 15 spec-file edits against 14
final tests. What is missing is the instrument, not the behaviour.

This is a third route to `predictions_total = 0`, distinct from the two recorded
in RQ-fable-vs-opus5: Fable 5.1 emits no red-phase text at all, Sonnet 5 emits it
under a renamed header, and Opus 5.5 runs the cycle inside encrypted thinking and
narrates once at the end. A single "markers zeroed" column would flatten three
different causes; it must not.

The same batch ran the subagents arm (`exact-subagents-v2-testlist-fix-cc` ×
`opus-5-no-thinking`) on the same CLI with healthy markers, which is what rules
out Claude Code 2.1.280 as the cause.
