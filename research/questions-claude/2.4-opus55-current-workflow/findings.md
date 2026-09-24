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
what the RQ set out to test (H2). Four consequences, each carried by its own
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
- **Isolating the Refactor step is what makes the discipline measurable on
  Opus 5.5 at all** — and the shared-context reading of it points the wrong way
  (F-2.4.6). The isolated arm is also where the newer model's advantage is
  largest (F-2.4.7).

Scope: one kata (Claim Office), one prompt style (Example Mapping), one stack
(TypeScript), n=5 per cell. Correctness is saturated across all six cells
(0.97–1.00) and carries none of this.

## Overview

Cell means ± standard deviation, n=5 per cell, Claim Office / Example Mapping /
TypeScript / Claude Code 2.1.280. Three workflow arms: **Inline** is the minimal
inline-TDD instruction (`baseline-inline-tdd-v1.1-local-git-cc`), **EXACT** the
maintained shared-context Predictive TDD workflow (`exact-ptdd-v1-cc`), **Sub**
the same contract with the per-cycle Refactor step delegated to an isolated
subagent (`exact-ptdd-v1.1-refactor-subagent-cc`).

Bold values with 🏆 mark the winner of that row. A trophy is shared when the gap
is smaller than the larger of the two standard deviations involved, so several
trophies in a row read as "no difference". Several cells reach a standard
deviation of exactly 0, which would make the convention's usual yardstick (the
best cell's own σ) degenerate; the larger σ is used instead.

All six cells clear the 0.90 correctness gate, so all are eligible for the
quality trophies.

**Quality** — Mutation Score higher = better; every complexity and size row
lower = better.

| | Inline / O5 | EXACT / O5 | Sub / O5 | Inline / O5.5 | EXACT / O5.5 | Sub / O5.5 |
|---|---:|---:|---:|---:|---:|---:|
| Correctness (external) | 1.00 ± 0 | 0.99 ± 0.03 | 0.97 ± 0.04 | 1.00 ± 0 | 1.00 ± 0 | 1.00 ± 0 |
| Mutation Score | **0.91 ± 0.07** 🏆 | **0.88 ± 0.04** 🏆 | **0.92 ± 0.08** 🏆 | 0.74 ± 0.05 | **0.94 ± 0.04** 🏆 | **0.95 ± 0.04** 🏆 |
| Complexity Peak | 5.6 ± 1.82 | **2.6 ± 1.34** 🏆 | **3.0 ± 1.41** 🏆 | 8.2 ± 0.84 | **2.0 ± 0** 🏆 | **2.8 ± 1.79** 🏆 |
| `cognitive_avg` | 2.40 ± 0.54 | **1.37 ± 0.32** 🏆 | **1.30 ± 0.23** 🏆 | 2.49 ± 0.37 | **1.36 ± 0.06** 🏆 | **1.36 ± 0.42** 🏆 |
| `mccabe_max` | 5.6 ± 1.14 | **3.2 ± 0.45** 🏆 | **3.4 ± 0.89** 🏆 | 7.8 ± 2.05 | **3.0 ± 0** 🏆 | **3.2 ± 0.45** 🏆 |
| `mccabe_avg` | 2.13 ± 0.24 | 1.56 ± 0.21 | **1.35 ± 0.06** 🏆 | 2.45 ± 0.25 | 1.46 ± 0.10 | **1.39 ± 0.12** 🏆 |
| `unit_size_avg` | 8.63 ± 1.44 | 6.10 ± 1.23 | 4.89 ± 0.39 | 8.22 ± 1.86 | **4.54 ± 0.28** 🏆 | **4.42 ± 0.35** 🏆 |
| `unit_size_median` | 6.2 ± 1.1 | 5.0 ± 1.0 | **3.5 ± 0.87** 🏆 | 5.5 ± 0.5 | **3.3 ± 0.45** 🏆 | **3.1 ± 0.22** 🏆 |

The trophy pattern is itself the message: on the complexity rows all four
structured cells tie and only the two inline cells fall out, so **the split that
matters is scaffolded against unscaffolded, not model against model.** Unit size
is the exception — there the two Opus 5.5 structured cells separate from the
rest.

Correctness carries no trophy: five cells sit at 1.00 or 0.99 and the lowest is
0.97 (σ 0.04). The row is saturated and settles nothing — it is shown to
document that the quality trophies are not being awarded to a cell that skipped
work.

Smell Total is 0 in all 30 runs and is omitted from the table. On this kata that
is its established value (it was deterministically 0 across every cell of
RQ-fable-vs-opus5 as well), so it is not evidence of anything here.

**Price and shape** — deliberately no trophies. The three arms do different
amounts of work, so "cheaper" here names the arm that did less, not the better
result; and the cost ranking is decided by a tariff rather than by consumption
(F-2.4.4). Production LoC, Test LoC, Code Mass (APP), test count, unit count and
`mutants_total` have no unambiguous direction and appear as context.

| | Inline / O5 | EXACT / O5 | Sub / O5 | Inline / O5.5 | EXACT / O5.5 | Sub / O5.5 |
|---|---:|---:|---:|---:|---:|---:|
| `duration_seconds` | 255 ± 43 | 897 ± 176 | 3749 ± 792 | 124 ± 8 | 871 ± 89 | 2658 ± 357 |
| `total_tokens` | 2.83 M ± 0.70 M | 14.7 M ± 4.4 M | 33.3 M ± 5.9 M | 1.27 M ± 0.24 M | 25.0 M ± 2.3 M | 39.0 M ± 3.4 M |
| `cost_usd` | $2.94 ± 0.56 | $11.83 ± 3.08 | $23.03 ± 3.48 | $1.13 ± 0.12 | $9.96 ± 0.95 | $12.89 ± 0.96 |
| Production LoC | 300.6 ± 42.97 | 292.6 ± 41.14 | 492.2 ± 86.43 | 236.2 ± 11.26 | 237.0 ± 16.84 | 279.8 ± 48.16 |
| Test LoC | 418.0 ± 53.65 | 593.2 ± 257.99 | 432.2 ± 93.60 | 262.2 ± 21.94 | 266.4 ± 22.24 | 270.6 ± 12.50 |
| Code Mass (APP) | 713.6 ± 83.71 | 690.6 ± 43.96 | 874.2 ± 107.92 | 782.4 ± 69.26 | 642.4 ± 55.19 | 670.6 ± 21.62 |
| `tests_total` | 46.0 ± 5.24 | 55.4 ± 2.88 | 53.4 ± 2.07 | 33.0 ± 4.24 | 45.6 ± 2.97 | 48.0 ± 2.45 |
| `unit_count` | 13.8 ± 3.7 | 25.0 ± 4.8 | 36.6 ± 4.1 | 14.6 ± 5.22 | 24.6 ± 1.67 | 29.2 ± 5.12 |
| `mutants_total` | 135.6 ± 24.28 | 134.2 ± 12.7 | 152.8 ± 21.39 | 196.4 ± 22.77 | 126.2 ± 5.89 | 133.4 ± 6.31 |
| `mutants_survived` | 13.6 ± 13.35 | 15.6 ± 5.5 | 12.8 ± 13.61 | 49.8 ± 5.89 | 8.2 ± 5.02 | 7.2 ± 6.14 |
| `mutants_no_coverage` | 1.2 ± 2.68 | 10.4 ± 6.5 | 6.2 ± 10.55 | 17.0 ± 17.42 | 2.8 ± 2.68 | 2.0 ± 2.83 |

`cost_usd` is a list-price comparison value, not an invoice — nothing is billed
per token on the Max subscription.

`test_blocks`, `test_cases_total` and `test_cases_first_block` are 0 in
essentially every run and carry no information here. They are declared as
outcomes but are inert on this run shape; do not read the zeros as a finding.

`refactorings_applied` is **not** an outcome of this RQ and is absent from both
tables. It is unreadable on Opus 5.5 in the Inline and EXACT arms and readable
in the Sub arm; that asymmetry is the subject of F-2.4.5 and F-2.4.6 rather than
a column to compare.

### The same 30 runs cut by model instead of by workflow

The tables above compare the workflow arms. These hold the arm constant and
compare the two models inside it, which is the cut that answers "is upgrading
the model worth it". Same runs, same conventions: bold + 🏆 on the winner, both
cells on a tie, a tie being a gap smaller than the larger of the two standard
deviations.

Correctness carries no trophy in any arm for the reason given above — it is
saturated at 0.97–1.00 and settles nothing.

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

**`exact-ptdd-v1.1-refactor-subagent-cc`** — same directions. The full table for
this arm, including the price rows that separate it most sharply, is in F-2.4.7.

| | Opus 5 | Opus 5.5 |
|---|---:|---:|
| Correctness (external) | 0.97 ± 0.04 | 1.00 ± 0 |
| Mutation Score | **0.92 ± 0.08** 🏆 | **0.95 ± 0.04** 🏆 |
| Complexity Peak | **3.0 ± 1.41** 🏆 | **2.8 ± 1.79** 🏆 |
| `cognitive_avg` | **1.30 ± 0.23** 🏆 | **1.36 ± 0.42** 🏆 |
| `mccabe_max` | **3.4 ± 0.89** 🏆 | **3.2 ± 0.45** 🏆 |
| `mccabe_avg` | **1.35 ± 0.06** 🏆 | **1.39 ± 0.12** 🏆 |
| `unit_size_avg` | 4.89 ± 0.39 | **4.42 ± 0.35** 🏆 |
| `unit_size_median` | **3.5 ± 0.87** 🏆 | **3.1 ± 0.22** 🏆 |

The first two tables run in opposite directions, which is the compact statement
of F-2.4.1 and F-2.4.2 together: **the model upgrade pays only under a
structured workflow.** Without one, Opus 5.5 loses every row that separates at
all — all three peak measures and Mutation Score. With one, it wins or ties
every row.

The third table adds that under the isolated-subagent arm the two models are a
quality tie on almost every row; what separates them there is not quality but
price, where Opus 5.5 nearly halves the cost and the wall-clock (F-2.4.7).

Read the inline arm's Mutation Score with the counts in the price table rather
than as a ratio: Opus 5.5 there produces the largest mutant population in the
whole RQ (196.4) **and** the most survivors (49.8), so the low score is a weaker
suite, not a shifted denominator.

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

---

## F-2.4.6 — The isolated Refactor subagent restores the discipline measurement on Opus 5.5, and reverses its sign

`refactorings_applied` is unreadable on Opus 5.5 in the shared-context arm
(F-2.4.5). In the isolated-subagent arm it is fully readable on the same model,
because the count then comes from `Task` tool calls rather than from assistant
text:

| workflow | Opus 5 | Opus 5.5 |
|---|---|---|
| `baseline-inline-tdd-v1.1-local-git-cc` | 0 0 0 0 0 | 0 0 0 0 0 |
| `exact-ptdd-v1-cc` | 15 56 44 47 31 | **1 0 0 1 0** |
| `exact-ptdd-v1.1-refactor-subagent-cc` | 17 36 34 29 43 | **47 50 45 51 47** |

All five Opus 5.5 subagent runs resolve as `phase_source: "subagents"` with
`refactor_count_source: null` — the text-marker fallback never had to run. The
shared-context runs resolve as `phase_source: "inline-tool"` with
`skill_invocations: {"exact-coding-ptdd": 1}` and `task_invocations: {}`: one
entry-skill call and no tool-side trace of a refactor anywhere, so the count can
only come from `## Refactor` text that Opus 5.5 does not write.

**The missing instrument did not merely hide the number, it inverted it.** Read
from the shared-context arm, Opus 5.5 refactors essentially never (0.4 mean)
against Opus 5's 38.6. Read from the subagent arm, the same model refactors
*more* than Opus 5 — 48.0 against 31.8 — and far more consistently (45–51
against 17–43). Any conclusion about Opus 5.5's refactoring behaviour drawn
from the shared-context arm points the wrong way.

This is a property of the workflow architecture, not of the model or the
parser. A shared-context refactor step leaves no tool call to count; an isolated
one is a `Task` invocation and is counted regardless of whether the model
narrates. It is therefore not fixable in `analyze_transcript.py` — and should
not be: a parser change that inferred refactors from the tool stream would blur
exactly the distinction this finding rests on.

---

## F-2.4.7 — The subagent arm is where Opus 5.5's advantage is largest, on every axis including cost

Holding the workflow at `exact-ptdd-v1.1-refactor-subagent-cc` and varying only
the model:

| | Opus 5 | Opus 5.5 |
|---|---:|---:|
| Correctness (external) | 0.97 ± 0.04 | 1.00 ± 0 |
| Mutation Score ↑ | 0.92 ± 0.08 | **0.95 ± 0.04** |
| `unit_size_avg` ↓ | 4.89 ± 0.39 | **4.42 ± 0.35** |
| `unit_size_max` ↓ | 14.8 ± 1.48 | **12.4 ± 2.3** |
| Complexity Peak ↓ | 3.0 ± 1.41 | 2.8 ± 1.79 |
| `mccabe_max` ↓ | 3.4 ± 0.89 | 3.2 ± 0.45 |
| `duration_seconds` ↓ | 3749 ± 792 | **2658 ± 357** |
| `cost_usd` ↓ | $23.03 ± 3.48 | **$12.89 ± 0.96** |
| `total_tokens` | 33.3 M ± 5.9 M | 39.0 M ± 3.4 M |
| Production LoC | 492.2 ± 86.4 | 279.8 ± 48.2 |
| Code Mass (APP) | 874.2 ± 107.9 | 670.6 ± 21.6 |
| `unit_count` | 36.6 ± 4.1 | 29.2 ± 5.1 |
| `tests_total` | 53.4 ± 2.07 | 48.0 ± 2.45 |
| `mutants_total` / survived / uncovered | 152.8 / 12.8 / 6.2 | 133.4 / 7.2 / 2.0 |

Bold marks a gap larger than the larger of the two standard deviations; the
unmarked complexity rows are ties.

Two things separate this arm from the other two. **Cost is nearly halved
($23.03 → $12.89) while token consumption goes up** (33.3 M → 39.0 M) — the same
tariff inversion as F-2.4.4, but here the wall-clock moves with the cost rather
than against it (3749 s → 2658 s), so the arm is genuinely faster as well as
nominally cheaper. And **this is the only arm where Opus 5 misses full
correctness** (0.97, minimum 0.93) while Opus 5.5 holds 1.00 across five runs.

The arm is also the most expensive of the three in absolute terms on both models
— $12.89 against $9.96 for shared context and $1.13 for the inline instruction
on Opus 5.5. Isolation is not free; what this finding says is that its price
falls markedly on the newer model.

---

## F-2.4.8 — An API-safeguard abort is invisible in every aggregated column

One of the five Opus 5.5 subagent runs terminated on an API-side safeguard
(`API Error: … safeguards flagged this message`, `Details: [reasoning_extraction]`,
2817 s in), a false positive on an ordinary coding task by the message's own
account. It never wrote `experiment-done.txt`.

Nothing in the aggregation shows this:

| column | value for the aborted run |
|---|---|
| `completed_within_budget` | `True` — derived from `exit_reason`, so it means "did not time out", not "finished" |
| `tests_passing` | `True` |
| `verification_pct` | 1.00 |
| `n_ok` in the coverage table | counted as ok — the filter excludes timeouts, rate limits and transient API errors, not a generic `error-1` |

The run is therefore in every cell mean in this RQ. Its effect on the conclusions
is negligible — the cell's `refactorings_applied` mean is 48.0 with it and 47.5
without — and it is kept rather than removed, because aggregation is query-based
and a replacement run would leave the cell at n=6 rather than substituting.

The general point outranks this run: **`exit_reason: ok` and
`completed_within_budget: True` do not establish that a run finished.** Only
`experiment-done.txt` does, as RQ-fable-vs-opus5 F-1.19.10 already showed for a
different failure shape. Any cell whose replicates were not checked against the
marker file may contain a run that stopped early with plausible-looking metrics.
