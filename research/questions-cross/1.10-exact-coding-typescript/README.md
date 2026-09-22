---
id: RQ-exact-coding-typescript
question: "On TypeScript with Vitest, how do inline TDD, shared-context EXACT Coding Predictive TDD, and EXACT Coding with an isolated Refactor subagent compare on correctness and code quality for GPT-5.6 SOL and Opus 5?"
factors:
  model_x_workflow:
    - {model: gpt-5-6-sol-codex, workflow: baseline-inline-tdd-v1.1-local-git-pi}
    - {model: gpt-5-6-sol-codex, workflow: {any: [exact-ptdd-v1-pi, exact-sol-v1.6-test-list-dimensions-pi]}}
    - {model: gpt-5-6-sol-codex, workflow: exact-ptdd-v1.1-refactor-subagent-pi}
    - {model: opus-5-no-thinking, workflow: baseline-inline-tdd-v1.1-local-git-cc}
    - {model: opus-5-no-thinking, workflow: {any: [exact-ptdd-v1-cc, exact-sol-v1.6-test-list-dimensions-cc]}}
    - {model: opus-5-no-thinking, workflow: exact-ptdd-v1.1-refactor-subagent-cc}
controls:
  kata_base: claim-office
  prompt: example-mapping
outcomes:
  - verification_pct
  - tests_passing
  - completed_within_budget
  - tests_total
  - test_lines
  - lines_of_code
  - code_mass
  - smell_total
  - smell_complexity
  - smell_duplication
  - smell_magic_numbers
  - smell_code_quality
  - cognitive_max
  - cognitive_avg
  - mccabe_max
  - mccabe_avg
  - unit_count
  - unit_size_max
  - unit_size_avg
  - unit_size_median
  - test_blocks
  - test_cases_total
  - test_cases_first_block
  - red_verified
  - red_unverified
  - refactorings_applied
  - predictions_correct_rate
  - duration_seconds
  - total_tokens
  - cost_usd
  - mutation_score
  - mutants_total
  - mutants_survived
min_replicates: 5
status: aktiv
---

# RQ-exact-coding-typescript: EXACT Coding on the TypeScript Stack

## Question

How do the maintained shared-context EXACT Coding Predictive TDD workflow and
its isolated-Refactor-subagent variant compare with each other and with a
minimal inline-TDD instruction when all operate on the same TypeScript, Vitest
and ESLint/SonarJS project stack?

This is an internal TypeScript-stack comparison. Every claim it supports is a
claim about variation inside this stack; it makes no cross-language claim.

## Design

| Factor | Levels |
|---|---|
| Method | Inline TDD control; EXACT Coding Predictive TDD v1; v1.1 with isolated Refactor subagent |
| Model/harness bundle | GPT-5.6 SOL via pi; native Opus 5 without extended thinking via Claude Code |
| Kata | Claim Office |
| Prompt | Example Mapping |
| Stack | TypeScript + Vitest + ESLint/SonarJS |

Five replicates are required for each method × model cell: six cells, thirty
runs.

The comparison within each model is:

- `baseline-inline-tdd-v1.1-local-git-pi` vs. `exact-ptdd-v1-pi` vs.
  `exact-ptdd-v1.1-refactor-subagent-pi` for GPT-5.6 SOL;
- `baseline-inline-tdd-v1.1-local-git-cc` vs. `exact-ptdd-v1-cc` vs.
  `exact-ptdd-v1.1-refactor-subagent-cc` for Opus 5.

The v1-to-v1.1 comparison is factor-isolated: test-list construction, Red,
Green, predictions, Four Rules, domain-boundary contract, stack profile and lab
markers remain unchanged. Only the per-cycle Refactor execution context moves
from the main context to an isolated subagent.

## Single-kata scope — deliberate

Claim Office is the only kata in this RQ, for two reasons.

The first is that it is the kata that separates. Its specification is novel
rather than training-known, and it is large enough that the methods have room to
differ: the arms here span roughly 25 to 40 functions and 245 to 530 Production
LoC. Game of Life is a canonical exercise that both models already produce
low-complexity code for under a minimal instruction, so its cells cluster near
the floor and a method effect has nowhere to show.

The second is coverage. The EXACT arms have no Game of Life runs on this stack
under the Example Mapping prompt — only under `prose`, which the `prompt`
control excludes. Adding the kata would mean filling twelve fresh cells to
measure the contrast least likely to separate. It is left out, and the RQ states
a single-kata claim rather than pretending to a crossed design.

## Workflow-name provenance

`exact-ptdd-v1-{cc,pi}` is a content-identical promotion of the measured
`exact-sol-v1.6-test-list-dimensions-{cc,pi}` workflow (`LINEAGE.yaml`: parent
and `port_of`). The TypeScript runs of this arm predate the rename and are
recorded under the v1.6 name, so both spellings are pooled through explicit
workflow alternatives, exactly as
[RQ-ptdd-refactor-subagent-cross-model](../1.7-ptdd-refactor-subagent-cross-model/README.md)
does. The first entry is the canonical cell label.

## The inline control is v1.1, not v1 — and why v1 runs are not pooled

The two inline-TDD control versions differ in exactly one line of
`rules/experiment-mode.md`:

| Version | Test-command instruction |
|---|---|
| `baseline-inline-tdd-v1-cc` | "Inspect the existing project and use its declared full-suite test command." |
| `baseline-inline-tdd-v1.1-local-git-cc` | "Use `pnpm test` to run tests." |

On TypeScript these are behaviourally equivalent, because `pnpm test` *is* the
declared full-suite command of this stack: v1.1 names what v1 makes the agent
discover. The naming is a portability limit of v1.1 elsewhere, not a behavioural
difference here.

**Eighteen Opus 5 runs of the v1 spelling exist on this stack** (six each on
Claim Office, Game of Life and Sphinx Score, all Example Mapping, all
`exit_reason: ok`, dated 2026-08-10/11). They are nevertheless **not** pooled
into the control cell, because they predate the isolated-local-Git harness
condition under which every other arm in this RQ ran:

| | `v3-basic-tdd` runs (August) | every other arm here (September) |
|---|---|---|
| `tcr` | `null` | commit block present |
| `harness_version` | `null` | `2.1.267 (Claude Code)` |

`LINEAGE.yaml` records this as the explicit purpose of the v1.1 mint:
*"content-identical TDD control minted under the isolated-local-Git harness
condition … prevents reuse of pre-Git historical runs."* Pooling them would
admit the harness condition as an uncontrolled factor. Their quality values sit
in the same region as the v1.1 runs (Complexity Peak 4–9 against 5–9 on Claim
Office), so this exclusion is expected to cost precision, not to change a
direction — but that is an argument for filling a run, not for mixing a control
level.

`v3-basic-tdd` is the `alias` of `baseline-inline-tdd-v1-cc`, not a separate
workflow. Any future query over the inline arm must resolve the alias through
`LINEAGE.yaml` rather than matching on the recorded string.

## Routing — binding

- `opus-5-no-thinking` uses native Claude Code and `claude-opus-5`.
- `gpt-5-6-sol-codex` uses pi through the OpenAI subscription route.

Compare methods only within a model. Absolute cross-platform token and cost
levels are not causal comparisons.

## Primary outcome: code quality

The question this RQ exists to answer is whether EXACT Coding improves code
quality on TypeScript. The outcomes that carry that question are Cognitive
Complexity, McCabe cyclomatic complexity, per-function size, Code Mass (APP)
and ESLint/SonarJS findings.

**Correctness is a guard, not a result.** That a test-first instruction reaches
the correctness ceiling on this kata is already established; measuring it again
produces no finding. It is carried for one purpose: a
quality number from a cell that failed verification is meaningless, because low
complexity is what a stub looks like. Correctness therefore gates every quality
comparison and is reported only when it **breaks** — a cell below the 0.90 gate,
or any drop from a perfect score. A cell at 1.00 gets a line, not a section.

The remaining outcomes are context: TDD behaviour (test-write blocks, verified
RED transitions, test count, prediction accuracy, refactoring records) and
efficiency (duration, tokens, list-price cost).

The quality numbers here are ESLint/SonarJS output. They are readable only
against each other, never against another stack's tooling.

## Hypotheses

Every hypothesis is stated as a claim about the TypeScript stack alone, so that
it can be answered — confirmed or contradicted — from this RQ's own cells
without reaching for another stack's numbers.

- **H1 — the guard holds:** every cell stays at or above the 0.90 correctness
  gate, so every quality comparison is eligible. A breach invalidates that
  cell's quality numbers rather than producing a finding about correctness.
  The known risk is `exact-ptdd-v1.1-refactor-subagent-cc`, which already shows
  one timeout at 0.80 among five Opus runs.
- **H2 — EXACT Coding lowers complexity and unit size:** both EXACT variants
  produce a lower Complexity Peak and smaller per-function size than inline TDD,
  in both model cells. **This is the load-bearing hypothesis of the RQ.**
- **H3 — the three methods order consistently on test strength:** Mutation Score
  ranks the three methods in the same order in both model cells, rather than
  varying by model. Judged on the score **and** on `mutants_survived`, because
  the arms differ in code size by more than a factor of two.
- **H4 — model interaction:** the size or direction of the method effect differs
  between GPT-5.6 SOL and Opus 5.
- **H5 — workflow overhead:** EXACT Coding uses more time and tokens than inline
  TDD. The overhead is justified only by a correctness or product-quality gain.
- **H6 — isolated Refactor buys decomposition and pays in mass:** moving only
  the per-cycle Refactor phase to an isolated subagent improves per-function
  complexity and size relative to shared-context EXACT Coding, while raising
  Production LoC and Code Mass (APP) rather than lowering them. The Opus cell
  shows this shape in the RQ-1.7 aggregation; whether it reproduces on the pi
  port is open.
- **H7 — the budget cost of isolation is platform-specific:** the Opus arm lost
  one of five runs to a timeout and quadrupled duration against shared-context
  EXACT Coding, while the pi arm of the same treatment completed 5/5. If this
  holds, the isolated Refactor phase is a platform-conditional recommendation,
  not a general one.

## Mutation Score — measured, and read as a pair

Mutation Score is opted into here at the user's explicit request, even though
TypeScript is the expensive stack for it: Stryker re-runs Vitest per mutant and
each run needs its own `pnpm install`. It earns that cost because it is the only
outcome in this RQ that measures what the tests *catch* rather than what the
production code *looks like* — the complexity and size metrics cannot tell a
well-tested decomposition from a merely small one.

No run of any arm in this RQ carried the metric when the RQ was opened — on
TypeScript it existed only for `exact-sol-v1.3-stack-profile-pi`. It is computed
in a dedicated pass with `experiments/compute-mutation-score.py` between batch
and aggregation, over all 30 runs in scope. Runs whose suite is not green are
skipped by the script, since a mutation score against a red suite is
meaningless.

**`mutants_total` and `mutants_survived` are reported alongside the score in
every table, never the ratio alone.** The arms in this RQ differ in Production
LoC by more than a factor of two (245.7 against 526.8 in the Opus cells), so the
mutant population is not constant across cells. A score can rise while the
absolute number of missed mutants stands still, or fall while the suite actually
catches more — the ratio alone would report the code size as if it were test
strength.

The mutation configuration excludes the CLI adapter, because only the external
acceptance suite exercises it. A cell that comes back with an absent or zero
score is therefore worth checking before it is read as weak testing: a suite
that drives the CLI in a subprocess rather than importing the domain can defeat
the instrument's test-to-mutant association, and that would be a fact about the
suite's style, not about its strength.

## Interpretation rules

- Never average across models.
- Compare workflows only within the same model/harness bundle.
- Correctness gates code-quality and efficiency trophies. It is a filter on
  eligibility, never a headline.
- Timeouts are outcomes and are not refilled.
- Test count, Test LoC, Production LoC, Code Mass (APP) and process-marker
  counts have ambiguous direction and receive no trophy solely for being lower
  or higher.
- The inline-TDD arm controls for test-first intent. The measured treatment is
  the additional EXACT Coding structure, not TDD versus one-shot generation.
- **This RQ stays inside its stack — in this README and in `findings.md`.** No
  other stack's values, cell names, finding ids, tool names or "as on stack X"
  phrasings, in either file: not in the overview table, not in a finding body,
  not as a caveat, not as motivation. Every hypothesis above is answerable from
  this RQ's own cells, so such a reference is never needed to state a result.
  Where stacks belong side by side is the experiment-overview snapshot under
  `research/reports/`, which compares directions and orderings across RQs and
  never absolute values.

## Execution provenance

Five of the six cells were already populated by earlier RQs before this RQ was
opened; no new EXACT-arm runs are required. The runs were produced by
RQ-test-list-dimensions-replication (the v1 arms, n=10 per model) and
RQ-ptdd-refactor-subagent-cross-model (the v1.1 arms, n=5 per model), and are
pooled here by cell match rather than by batch, as the aggregation contract
intends.

The `opus-5-no-thinking` × inline cell stood at n=4 against `min_replicates: 5`.
One further run of `baseline-inline-tdd-v1.1-local-git-cc` was filled at the
user's explicit request. A fifth run of that arm exists under
`opus-5-requesty-no-thinking`; pooling it through `controls.model: {any: [...]}`
was considered and rejected in favour of the fill, so that the RQ carries no
routing caveat.
