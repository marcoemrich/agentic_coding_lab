---
id: RQ-ptdd-verification-split
question: "Does splitting the PTDD v1 test list into driving tests and a trailing verification group keep Correctness, safety net and code quality at least at the v1 level on Opus 5.5 and GPT-6.1 Sol, while making the phase-chain discipline readable for a test-list workflow?"
factors:
  model_x_workflow:
    - {model: opus-5-5-no-thinking, workflow: exact-ptdd-v1-cc}
    - {model: opus-5-5-no-thinking, workflow: exact-ptdd-v1.2-verification-split-cc}
    - {model: gpt-6-1-sol-codex,    workflow: exact-ptdd-v1-pi}
    - {model: gpt-6-1-sol-codex,    workflow: exact-ptdd-v1.2-verification-split-pi}
controls:
  kata_base: claim-office
  prompt: example-mapping
outcomes:
  # Correctness — the non-inferiority gate. Both control cells sit at 1.00.
  - verification_pct
  - tests_passing
  - completed_within_budget
  # Safety net — the split must not thin the suite. Report the pair with the
  # score: the population moves with code size. See "Mutation caveat".
  - tests_total
  - mutation_score
  - mutants_total
  - mutants_survived
  # Code quality
  - code_mass
  - smell_total
  - cognitive_max
  - cognitive_avg
  - mccabe_max
  - unit_size_avg
  - lines_of_code
  # Mechanism — does the split happen, and where does the chain end?
  - verification_tests
  - verification_red
  - tdd_after_cutoff
  # Phase chain. tdd_discipline and skip_events change their measurement
  # window under the treatment; see "Reading the discipline columns".
  - red_batch_max
  - cycles_closed
  - refactor_events
  - skip_events
  - tdd_discipline
  - predictions_correct
  - predictions_total
  # Cost
  - duration_seconds
  - total_tokens
  - cost_usd
min_replicates: 5
---

# RQ-ptdd-verification-split: Driving and verification tests in PTDD v1

## Question

PTDD v1 writes the complete inactive test list up front, including the
cross-dimension cells from its dimensions cross-check. Many of those cells pass
the moment they are activated, because an earlier generalization already covers
them. The workflow handles them correctly — "do not manufacture a failure" —
but the phase chain reads each one as a `Skip`, which is why `tdd_discipline`
penalises test-list completeness rather than discipline (README, "Comparability:
the test-list boundary"; RQ-tdd-workflow-comparison-opus55 F-4.13.4). The
control cells here carry 22–25 skips per run.

`exact-ptdd-v1.2-verification-split-*` makes the distinction explicit in the
workflow itself. The test list separates **driving tests**, expected to fail
first, from **verification tests**, expected to pass once their parts exist, and
places the latter in a group named `verification` after all driving tests. Each
driving test is re-examined before activation and may still be moved there. The
verification tests run only after every driving test is green, each with the
prediction that it passes. `tdd-report.py` ends the scored TDD part of the chain
at the first verification test.

The question is primarily one of **non-inferiority**: the workflow is being
developed further, and the split is only worth keeping if Correctness, the
safety net and code quality stay at the v1 level. A cleaner discipline reading is
the intended gain, not a licence to lose anything else.

## Cells

| Platform | Control | Treatment |
|---|---|---|
| Opus 5.5 / Claude Code | `exact-ptdd-v1-cc` | `exact-ptdd-v1.2-verification-split-cc` |
| GPT-6.1 Sol / pi | `exact-ptdd-v1-pi` | `exact-ptdd-v1.2-verification-split-pi` |

v1.2 branches from v1, so the only intended treatment is the split. The
dimensions cross-check, predictions, stack profiles, domain-boundary trial,
narrow undo, lab markers and autonomy are unchanged. The control is v1, not
`exact-ptdd-v1.1-refactor-subagent-*`: v1 is the maintained default
(`model-recommendation-matrix.md`), and against v1.1 the split and the
isolated refactor would differ at once.

Both control cells are already filled from earlier RQs (5 runs each, all
`verification_pct` 1.00): Opus 5.5 from RQ-opus55-current-workflow, GPT-6.1 Sol
from RQ-workflow-axis-gpt61-sol. They are pooled query-wise. Only the treatment
cells need fresh runs. The first GPT-6.1 Sol treatment run is the workflow's
smoke run and counts toward the cell; the Claude Code smoke runs used Opus 5 and
fall outside this RQ.

The cc treatment differs from its parent in one further, non-treatment point:
`commands/exact-coding-ptdd.md` points at the real
`.claude/commands/{test-list,predictive-tdd}.md` files instead of a non-existent
`.claude/commands/<name>/SKILL.md` path (its `SOURCE.md`). The agent had a second
route to both documents through the rules file, so no effect is expected.

## Routing — binding

- `opus-5-5-no-thinking` runs native Claude Code on `claude-opus-5-5`, CLI 2.1.280.
- `gpt-6-1-sol-codex` runs pi through the OpenAI subscription route.

Compare control and treatment only within platform. Cross-platform cost and
token levels are not causal comparisons.

## Primary contrasts

1. **Correctness gate:** Correctness (external), internal tests, completion
   within budget. Any drop below 1.00 in a treatment cell is investigated run by
   run before anything else is read.
2. **Safety net:** `tests_total` and the mutation pair. The split moves tests
   in the list, it must not drop them; a treatment cell with fewer tests or more
   surviving mutants than the control spread is a regression.
3. **Code quality:** Code Mass (APP), Smell Total, `cognitive_max`,
   `cognitive_avg`, `mccabe_max`, `unit_size_avg`, Production LoC.
4. **Mechanism:** `verification_tests > 0` in every treatment run;
   `verification_red` (verification tests that needed a cycle after all — the
   miss rate of the split); `tdd_after_cutoff` (driving work done after
   verification began — the score does not see it).
5. **Cost:** duration, tokens, list-price comparison value.

## Reading the discipline columns

`tdd_discipline`, `skip_events` and `cycles_closed` read only the part of the
chain before the first verification test in the treatment, but the whole chain
in the control. A higher treatment score therefore partly reflects the shorter
window, by design. Read it together with `verification_tests`,
`verification_red` and `tdd_after_cutoff`, never alone. Both arms are test-list
workflows, so the columns stay within one architecture group.

`red_batch_max` and `refactor_events` read the whole run in both arms and are
directly comparable.

A treatment run with `verification_tests == 0` either did not split or named the
group differently (`experiments/workflows/MARKERS.md`). Inspect its test file
before aggregation: with a visibly split file it is a naming failure, and its
chain then reads exactly like v1.

## Mutation caveat

On Claim Office / TypeScript some runs test only through the CLI started as a
subprocess. Stryker's per-test coverage cannot see the domain code then, and
every mutant survives: two of the five GPT-6.1 Sol control runs read
`mutation_score` 0 with 111 of 111 survived. That is an instrumentation gap, not
a suite without assertions. A run with `mutants_survived == mutants_total` is
excluded from the mutation columns and reported separately; the other columns
of that run stand.

## Hypotheses

- **H1 — non-inferior and cleaner.** Correctness, test count, mutation pair and
  code quality stay within control spread; `skip_events` before the cutoff drops
  close to zero.
- **H2 — the split thins the safety net.** The agent drops or never writes
  combination tests it now labels as "expected to pass"; `tests_total` falls or
  `mutants_survived` rises.
- **H3 — the split misjudges.** Many verification tests arrive red
  (`verification_red` high), or driving work continues after the cutoff
  (`tdd_after_cutoff > 0`); the window the score reads is then not the TDD part.
- **H4 — overhead without product effect.** Re-examining each driving test adds
  turns and cost while every product metric stays flat.
- **H5 — model-dependent.** One model follows the split and the other does not
  (e.g. `verification_tests == 0` on one platform).

## Interpretation rules

- No cross-kata averaging; this RQ has one kata.
- Correctness gates quality and efficiency trophies.
- Timeouts count and are not refilled.
- Code Mass (APP), Production LoC and `tests_total` are reported without a
  trophy where their direction is ambivalent; `tests_total` below control is a
  regression signal under H2, above it is not by itself a gain.

## Decision rule

Keep the split as the next PTDD version only if, on both platforms, Correctness
holds at the control level, `tests_total` and the mutation pair are not worse
than the control spread, no code-quality metric degrades beyond it, and every
treatment run shows a working split (`verification_tests > 0`). A moderate cost
increase is acceptable for a readable discipline measure; a quality or
safety-net regression is not. Otherwise v1 remains the maintained line.
