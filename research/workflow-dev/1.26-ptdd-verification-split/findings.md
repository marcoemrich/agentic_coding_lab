# RQ-ptdd-verification-split — Findings

Splitting the PTDD v1 test list into driving tests and a trailing `verification`
group is **non-inferior on both platforms** and the split fires in every run.
Correctness (external) stays at 1.00, the safety net holds on Opus 5.5 and
improves on GPT-6.1 Sol, and no code-quality metric degrades beyond control
spread. The price is platform-dependent: Opus 5.5 pays ~15 % more time, tokens
and list price; Sol gets faster.

## Overview

Control and treatment are compared **within platform only** — the two platforms
differ in model and harness at once, so a trophy across them would rank the
platform, not the split. Each block is its own contest.

### Opus 5.5 / Claude Code — `exact-ptdd-v1-cc` → `exact-ptdd-v1.2-verification-split-cc`

| Metric | direction | v1 (control) | v1.2 verification split |
|---|---|---|---|
| Correctness (external) | higher | 1.00 | 1.00 |
| `tests_passing` | higher | 100 % | 100 % |
| `tests_total` | ambivalent | 47.8 (σ 1.6) | 47.6 (σ 2.7) |
| Mutation Score | higher | **0.938** 🏆 | **0.920** 🏆 |
| `mutants_survived` / `mutants_total` | lower | **7.8 / 124.0** 🏆 | **10.0 / 124.8** 🏆 |
| Code Mass (APP) | ambivalent | 632.4 (σ 36.0) | 639.6 (σ 37.9) |
| Smell Total | lower | 0 | 0 |
| `cognitive_max` | lower | **2.4** 🏆 | **2.2** 🏆 |
| `cognitive_avg` | lower | **1.43** 🏆 | **1.40** 🏆 |
| `mccabe_max` | lower | **3.4** 🏆 | **3.2** 🏆 |
| `unit_size_avg` | lower | **4.81** 🏆 | **4.64** 🏆 |
| Production LoC | ambivalent | 222.2 | 222.6 |
| `red_batch_max` | — | 1 | 1 |
| `refactor_events` | higher | 16.6 | **19.0** 🏆 |
| `cycles_closed` | ambivalent | 24.2 | 26.0 |
| `verification_tests` | mechanism | — | 20.0 (17–25) |
| `verification_red` | lower | — | 0 |
| `tdd_after_cutoff` | lower | — | 0 |
| `skip_events` | see F-1.26.3 | 23.8 | 2.4 |
| `tdd_discipline` | see F-1.26.3 | 0.63 | 0.93 |
| `predictions_correct` / `_total` | see F-1.26.6 | not measurable | not measurable |
| `duration_seconds` | lower | **922.2** 🏆 (15.4 min) | 1078.0 (18.0 min) |
| `total_tokens` | lower | **24.4 M** 🏆 | 28.4 M |
| `cost_usd` | lower | **$9.79** 🏆 | $11.30 |

### GPT-6.1 Sol / pi — `exact-ptdd-v1-pi` → `exact-ptdd-v1.2-verification-split-pi`

| Metric | direction | v1 (control) | v1.2 verification split |
|---|---|---|---|
| Correctness (external) | higher | 1.00 | 1.00 |
| `tests_passing` | higher | 100 % | 100 % |
| `tests_total` | ambivalent | 48.8 (σ 1.1) | 54.6 (σ 2.5) |
| Mutation Score | higher | 0.898 (n=3) | **0.941** 🏆 |
| `mutants_survived` / `mutants_total` | lower | 11.7 / 114.3 (n=3) | **6.6 / 112.2** 🏆 |
| Code Mass (APP) | ambivalent | 561.2 (σ 18.1) | 514.8 (σ 29.5) |
| Smell Total | lower | 0 | 0 |
| `cognitive_max` | lower | **3.0** 🏆 | **2.2** 🏆 |
| `cognitive_avg` | lower | **1.47** 🏆 | **1.33** 🏆 |
| `mccabe_max` | lower | **3.8** 🏆 | **3.2** 🏆 |
| `unit_size_avg` | lower | **4.56** 🏆 | **4.72** 🏆 |
| Production LoC | ambivalent | 139.6 | 133.2 |
| `red_batch_max` | — | 1 | 1 |
| `refactor_events` | higher | **19.6** 🏆 | 17.8 |
| `cycles_closed` | ambivalent | 25.0 | 18.6 |
| `verification_tests` | mechanism | — | 33.4 (28–37) |
| `verification_red` | lower | — | 0 |
| `tdd_after_cutoff` | lower | — | 0 |
| `skip_events` | see F-1.26.3 | 23.0 | 0.2 |
| `tdd_discipline` | see F-1.26.3 | 0.63 | 0.89 |
| `predictions_correct` / `_total` | higher | 96.0 / 97.6 (98.4 %) | **108.2 / 109.2 (99.1 %)** 🏆 |
| `duration_seconds` | lower | 2171.4 (36.2 min) | **1632.0** 🏆 (27.2 min) |
| `total_tokens` | lower | **9.0 M** 🏆 | **9.8 M** 🏆 |
| `cost_usd` | lower | **$1.47** 🏆 | **$1.54** 🏆 |

n = 5 per cell, `claim-office-example-mapping`, TypeScript/Vitest. Trophies:
every cell passes the correctness gate at 1.00, so the quality and efficiency
rows are all eligible. Where the gap is below 1 σ the row is a tie and every
near-tied value carries a trophy — that is most of the quality block, and it is
the point of a non-inferiority RQ. Rows with no trophy at all are either
identical in both cells (Correctness, Smell Total, `red_batch_max`), ambivalent
in direction (`tests_total`, Code Mass (APP), Production LoC, `cycles_closed`),
treatment-only (the mechanism rows), or not a contest because the measurement
window differs (`skip_events`, `tdd_discipline` — F-1.26.3). The Sol mutation
rows rest on 3 control replicates against 5 — see Caveats.

---

## F-1.26.1 — The non-inferiority gate holds on both platforms

Correctness (external) is 1.00 in all 20 runs and every internal suite is
green. No treatment run needed investigation under the RQ's first contrast.

| Cell | Correctness (external) | `tests_passing` |
|---|---|---|
| `exact-ptdd-v1-cc` / Opus 5.5 | 1.00 (σ 0) | 100 % |
| `exact-ptdd-v1.2-verification-split-cc` / Opus 5.5 | 1.00 (σ 0) | 100 % |
| `exact-ptdd-v1-pi` / GPT-6.1 Sol | 1.00 (σ 0) | 100 % |
| `exact-ptdd-v1.2-verification-split-pi` / GPT-6.1 Sol | 1.00 (σ 0) | 100 % |

Claim Office's `14-family-steinheim` case, which caps the achievable mean at
0.93 in several other RQs, is solved here by every cell of both arms.

---

## F-1.26.2 — The split fires in every run, and the agent never misjudges which tests pass

All 10 treatment runs produced a populated `verification` group, so H5
(model-dependent adoption) is refuted: both platforms follow the instruction.

| Cell | `verification_tests` | `verification_red` | `tdd_after_cutoff` |
|---|---|---|---|
| `exact-ptdd-v1.2-verification-split-cc` / Opus 5.5 | 20.0 (17–25) | 0 | 0 |
| `exact-ptdd-v1.2-verification-split-pi` / GPT-6.1 Sol | 33.4 (28–37) | 0 | 0 |

`verification_red` is 0 across all 10 runs: not one test placed in the
verification group turned out to need a cycle. `tdd_after_cutoff` is 0 as well,
so no driving work continued after the cutoff. H3 is refuted on both counts —
the window the discipline score reads is the TDD part of the run.

Sol places two thirds more tests in the verification group than Opus 5.5
(33.4 against 20.0) at a similar total suite size, so the two models draw the
driving/verification line in substantially different places. Both lines are
self-consistent, since neither produced a red verification test.

---

## F-1.26.3 — The discipline columns move as designed, which is a measurement effect and not a discipline gain

`skip_events` collapses and `tdd_discipline` rises on both platforms. Per the
RQ's reading rule these columns read only the chain before the first
verification test in the treatment, but the whole chain in the control, so the
movement is partly the shorter window by construction. The rows carry no trophy.

| Cell | `skip_events` | `tdd_discipline` | `red_batch_max` | `refactor_events` |
|---|---|---|---|---|
| `exact-ptdd-v1-cc` / Opus 5.5 | 23.8 | 0.63 | 1 | 16.6 |
| `exact-ptdd-v1.2-verification-split-cc` / Opus 5.5 | 2.4 | 0.93 | 1 | 19.0 |
| `exact-ptdd-v1-pi` / GPT-6.1 Sol | 23.0 | 0.63 | 1 | 19.6 |
| `exact-ptdd-v1.2-verification-split-pi` / GPT-6.1 Sol | 0.2 | 0.89 | 1 | 17.8 |

Read together with F-1.26.2 the reading is nevertheless substantive: the skips
did not disappear into an unmeasured region, because `tdd_after_cutoff` is 0 and
`verification_red` is 0. The tests that register as skips in the control are the
ones now sitting in the verification group, where passing immediately is the
expected outcome rather than a chain deviation. What the treatment buys is a
discipline number that means what it says for a test-list workflow; it is not
evidence that the agent worked more strictly.

`red_batch_max` is 1 in all 20 runs and `refactor_events` reads the whole run in
both arms. Both are directly comparable and both stay level — one test at a
time, refactoring throughout, in control and treatment alike.

---

## F-1.26.4 — The safety net holds on Opus 5.5 and improves on Sol

H2 (the split thins the suite) is refuted. No treatment cell writes fewer tests
or leaves more mutants alive than its control.

| Cell | `tests_total` | Mutation Score | `mutants_survived` / `mutants_total` |
|---|---|---|---|
| `exact-ptdd-v1-cc` / Opus 5.5 | 47.8 (σ 1.6) | 0.938 (σ 0.05) | 7.8 / 124.0 |
| `exact-ptdd-v1.2-verification-split-cc` / Opus 5.5 | 47.6 (σ 2.7) | 0.920 (σ 0.03) | 10.0 / 124.8 |
| `exact-ptdd-v1-pi` / GPT-6.1 Sol | 48.8 (σ 1.1) | 0.898 (n=3) | 11.7 / 114.3 (n=3) |
| `exact-ptdd-v1.2-verification-split-pi` / GPT-6.1 Sol | 54.6 (σ 2.5) | 0.941 (σ 0.02) | 6.6 / 112.2 |

On Opus 5.5 suite size is unchanged (47.8 → 47.6) and the mutation pair moves
within spread: 0.018 score and 2.2 survivors against σ 0.05 and σ 6.3 in the
control. Mutant populations are near-identical (124.0 → 124.8), so the score and
the pair agree here.

On Sol the treatment writes ~6 more tests and kills more of a slightly smaller
population — 6.6 survivors against 11.7 among the control's usable runs. The
population shrank by 2.1 while survivors fell by 5.1, so the gain is not a
denominator artifact.

---

## F-1.26.5 — The cost of the split is platform-dependent, and only Opus 5.5 pays

H4 (overhead without product effect) holds on Opus 5.5 and is inverted on Sol.

| Cell | `duration_seconds` | `total_tokens` | `cost_usd` |
|---|---|---|---|
| `exact-ptdd-v1-cc` / Opus 5.5 | 922.2 (15.4 min) | 24.4 M | $9.79 |
| `exact-ptdd-v1.2-verification-split-cc` / Opus 5.5 | 1078.0 (18.0 min) | 28.4 M | $11.30 |
| `exact-ptdd-v1-pi` / GPT-6.1 Sol | 2171.4 (36.2 min) | 9.0 M | $1.47 |
| `exact-ptdd-v1.2-verification-split-pi` / GPT-6.1 Sol | 1632.0 (27.2 min) | 9.8 M | $1.54 |

Opus 5.5 pays 17 % on duration, 16 % on tokens and 15 % on list price, each
beyond control σ. On Sol the treatment is 25 % **faster** (2171 → 1632 s) at a
token and price difference inside spread (σ $0.58 on the control), consistent
with the lower `cycles_closed` of 18.6 against 25.0: re-examining each driving
test before activation appears to replace cycles rather than add to them there.

The Sol duration carries one 2956 s run against a 1181–1750 s band for the
other four (σ 749), so the direction is firm but the magnitude is not. Cost
levels are not compared across platforms — different model, different route.

---

## F-1.26.6 — The prediction pair is not measurable on the Claude Code arm, in either workflow version

`predictions_correct` and `predictions_total` read 0 in 9 of 10 Claude Code runs
across both the control and the treatment. This is a missing marker, not an
absence of predictions, and it is not caused by the split.

| Cell | assistant text blocks emitting `Red Phase Complete` | `predictions_total` |
|---|---|---|
| `exact-ptdd-v1-cc` / Opus 5.5 | 0, 0, 0, 0, 5 | 0, 0, 0, 0, 10 |
| `exact-ptdd-v1.2-verification-split-cc` / Opus 5.5 | 0, 0, 0, 0, 0 | 0, 0, 0, 0, 0 |
| `exact-ptdd-v1.2-verification-split-pi` / GPT-6.1 Sol | n/a (pi parser) | 103–113 |

`MARKERS.md` makes the literal string `Red Phase Complete` the gate for
prediction parsing, and `extract_predictions_from_text` reads assistant text
blocks only. In the Claude Code runs that string occurs in the transcript solely
as workflow-document content delivered as an attachment and as user text — the
agent itself emits it in 0 of 4–13 assistant text blocks per run, one control
run excepted. The Opus 5.5 agent works almost entirely through Skill tool calls
and emits very little free text at all, so the gate never opens.

The same shape is present in the control runs, which were produced for
RQ-opus55-current-workflow on 2026-10-01, so the gap predates this RQ and is not
a treatment effect. Sol on pi is unaffected: its transcripts are read by
`parse_pi_transcript.py` and its prediction counts are complete (109.2 total at
99.1 % correct, against 97.6 at 98.4 % in the control).

Consequence for this RQ: the two prediction columns support no control/treatment
comparison on Claude Code. They are reported as not measurable rather than as
zero, and the smoke-test expectation `predictions_total ~ 2 * cycles_closed`
does not apply to the Claude Code arm until the marker is emitted.

---

## Decision

The RQ's decision rule is met on both platforms: Correctness holds at the
control level, `tests_total` and the mutation pair are not worse than control
spread, no code-quality metric degrades beyond it, and every treatment run shows
a working split. The Opus 5.5 overhead of 15–17 % is the "moderate cost
increase" the rule admits in exchange for a readable discipline measure, and on
Sol there is no overhead to trade.

`exact-ptdd-v1.2-verification-split-*` is therefore keepable as the next PTDD
version on the evidence of this RQ.

## Caveats

- **Two Sol control runs lose their mutation replicates to the instrument.**
  Both read `mutation_score` 0.0 at 111 of 111 mutants survived — the
  documented Stryker gap where a suite drives the CLI as a subprocess, so
  per-test coverage cannot see the domain code. They are excluded from the
  mutation rows, which therefore compare 3 control replicates against 5
  treatment replicates in the Sol block. Their other columns stand. The
  unfiltered cell mean would read 0.54 at σ 0.49 and means nothing. No treatment
  run is affected.
- **No cross-platform comparison.** The two blocks differ in model and harness
  simultaneously; cost and token levels between them are not causal.
- **One kata.** `claim-office-example-mapping` only, so nothing here separates
  the split's effect from Claim Office's particular shape.
- **The cc treatment carries one non-treatment difference** from its parent:
  `commands/exact-coding-ptdd.md` points at the real
  `.claude/commands/{test-list,predictive-tdd}.md` files instead of a
  non-existent path. The agent reached both documents through the rules file in
  either case, so no effect is expected, but the arms are not byte-identical
  outside the split.
- **Quality values are not comparable to other stacks.** TypeScript/Vitest with
  ESLint/SonarJS and Stryker throughout.
