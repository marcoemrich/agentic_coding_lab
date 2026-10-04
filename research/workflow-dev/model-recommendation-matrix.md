# Workflow Recommendation per Model

Guardrail for workflow development: **there is no universally best workflow.** The
quality of a workflow depends on the model used — on the architecture axis (subagents-v1/single-context-v1/hybrid-v1),
subagents-v1 and hybrid-v1 swap places depending on the model. Anyone optimising a workflow must name the target model;
an improvement on opus-4-7 is not automatically one on opus-4-6.

Full finding (table, samples, mechanism):
`research/questions/3.1-workflow-model-interaction/findings.md` (RQ-workflow-model, F-workflow-model.1/F-workflow-model.2).

## Recommendation opus-4-6 / opus-4-7 (Correctness (external) on novel kata, `claim-office-example-mapping`)

| Model | recommended workflow | verification_pct (n) | Rationale |
|---|---|---:|---|
| opus-4-7-no-thinking | **exact-hybrid-v1-cc** | 1.00 (5) | handles orchestration delegation in the shared context |
| opus-4-6-portkey-no-thinking | **exact-subagents-v1-cc** | 0.93 (5) | benefits from the explicit subagent prompt per phase |
| (model-independent fallback) | exact-single-context-v1-cc | 0.97 (9) / 0.87 (5) | least model-sensitive, no peak value |

## Recommendation native Opus — `opus-5-no-thinking`, `opus-5-5-no-thinking`

**`exact-ptdd-v1-cc` is the universal EXACT Coding default on native Opus 5 and
Opus 5.5.** It replaces `exact-hybrid-v2-testlist-fix-cc` as the maintained and exported line. The
hybrid line remains a reproducible research and decomposition reference, but is no longer
recommended as a product profile because of its substantially higher context, token and
runtime demands.

| Goal | recommended workflow | Evidence | Rationale |
|---|---|---|---|
| Correctness and price/performance | **`exact-ptdd-v1-cc`** | RQ-test-list-dimensions-opus-native; RQ-test-list-dimensions-replication | n=10 on Claim Office: Correctness (external) 0.993, 9/10 perfect runs, minimum 0.933; median cost practically equal to PTDD v1.5, but a more stable correctness floor |
| Historical decomposition reference | `exact-hybrid-v2-testlist-fix-cc` | RQ-current-ptdd-vs-exact-opus-native | smaller typical functions, but substantially more runtime and tokens; superseded, no active product recommendation |

### Why the recommendation extends to Opus 5.5 — and on what

The two models do **not** rest on the same evidence, and the difference matters
when quoting this section.

| | Opus 5 | Opus 5.5 |
|---|---|---|
| Evidence | RQ-test-list-dimensions-opus-native; RQ-test-list-dimensions-replication | RQ-opus55-current-workflow |
| Carried by | the correctness floor at n=10 | code quality and Mutation Score at n=5 |
| Katas | Claim Office, Game of Life, Sphinx Score | Claim Office only |
| Stacks | TypeScript, Java, Python | TypeScript only |

On Opus 5.5 the correctness argument is unavailable: Correctness (external) is
saturated at 1.00 in RQ-opus55-current-workflow for both `exact-ptdd-v1-cc` and
the minimal inline-TDD comparison arm. The recommendation there rests on three
other results:

- **The workflow gap is larger on Opus 5.5 than on Opus 5.** Against the inline
  instruction, `exact-ptdd-v1-cc` lowers `cognitive_max` by 68 % (Opus 5: 42 %)
  and `unit_size_avg` by 36 % (Opus 5: 30 %), and raises Mutation Score by +0.18
  where it moves +0.01 on Opus 5.
- **Unscaffolded, Opus 5.5 is a regression against Opus 5** — worse on
  `cognitive_max` and `mccabe_max` and 0.20 lower on Mutation Score, at full
  correctness. The newer model does not need less structural guidance on this
  kata; it needs at least as much.
- Under the workflow the spread collapses: `cognitive_max` and `mccabe_max` vary
  by σ = 0.55 in the default arm and σ = 0 in the isolated-refactor arm, against
  σ = 2.07 and 1.52 for the inline instruction.

**Do not transfer this to Java or Python without measuring.** The Opus 5
recommendation spans three stacks; the Opus 5.5 extension spans one, and
RQ-exact-coding-python already showed that the method's benefit is narrower on
Python than Java suggested.

### Shared context or isolated Refactor subagent

Both profiles ship side by side in the consumer export
(`exact-coding` and `exact-coding-isolated-refactor`, all five harness ports),
so this is a selection rule rather than a ranking. On Claim Office / TypeScript,
CLI 2.1.280, n=5 per cell (RQ-opus55-current-workflow):

| | `exact-ptdd-v1-cc` | `exact-ptdd-v1.1-refactor-subagent-cc` |
|---|---|---|
| Correctness (external), Opus 5.5 | 1.00 | 0.96 |
| Correctness (external), Opus 5 | 1.00 | 0.79 |
| Mutation Score, Opus 5.5 | 0.94 ± 0.05 | 0.95 ± 0.03 |
| `unit_size_avg`, Opus 5.5 | 4.81 ± 0.62 | 4.46 ± 0.40 |
| `duration_seconds`, Opus 5.5 | 922 ± 80 | 2664 ± 433 |
| `cost_usd`, Opus 5.5 | $9.79 ± 0.49 | $28.34 ± 3.30 |

**`exact-ptdd-v1-cc` stays the default**, on both models. Every quality
difference above sits inside the standard deviations, while wall-clock and
list-price cost both rise by a factor of 2.9. Isolation is not a correctness
upgrade on this kata either: on Opus 5.5 one of five runs ends at 0.80, and on
Opus 5 the isolated arm hits the two-hour budget in 2 of 5 runs (F-2.4.7).

Take `exact-ptdd-v1.1-refactor-subagent-cc` when the fresh-eyes property is
what is actually wanted: a long session whose cycle history has grown noisy, or
a judgement that should be made without the memory of how the code got there.

**For workflow development against Opus 5.5, measure the refactor step on the
phase chain.** `refactorings_applied` is text-derived, and in the shared-context
arm Opus 5.5 does not write the text, so that reading is unusable there. The
phase chain's `refactor_events` reads the test framework's event stream and is
populated in both arms: 16.6 ± 2.4 shared-context against 30.6 ± 9.7 isolated
(F-2.4.5). Neither profile is needed just to make the step observable.

### Operational notes for Opus 5.5

- **Claude Code ≥ 2.1.280 is mandatory.** 2.1.267 rejects `claude-opus-5-5` with
  a hard 400 (*"version 2.1.280 or newer is required"*). Earlier CLIs also lack
  the model in their catalog, which caps auto-compact at 200k on a 1M-context
  model — a silent context confound, not just a warning.
- **Cost comparisons against Opus 5 are decided by the tariff, not by the model.**
  Opus 5.5 prices cache reads at 0.05× base input ($0.20/MTok) against Opus 5's
  0.1× ($0.50). Under this workflow Opus 5.5 spends 8 % *more* tokens and still
  costs 42 % less (F-2.4.4). Read `total_tokens` before `cost_usd`.
- **The text-derived TDD markers do not measure on Opus 5.5; the phase chain
  does.** In the shared-context arm Opus 5.5 emits 7–14 text blocks against
  134–145 thinking blocks, where Opus 5 emits 102–126 text blocks and no
  thinking at all; thinking content is encrypted in the transcript. Gate on the
  phase-chain columns (`red_batch_max`, `tdd_discipline_step`,
  `refactor_events`), correctness and code quality, not on
  `refactorings_applied`, `predictions_*` or `cycle_count` (F-2.4.5).

`exact-ptdd-v1-cc` is the canonical product name for the content measured as
`exact-sol-v1.6-test-list-dimensions-cc`. The rename changes no
methodology: single-context Predictive TDD, compilation and runtime predictions, Four Rules,
domain boundary trial, narrow undo and the independent dimension cross-check of the test list
all remain.

The n=10 replication corrects the early cost interpretation: the large mean advantage
of v1.6 over v1.5 on Opus was carried by long v1.5 outliers. The medians of
tokens and list price are practically equal. The promotion therefore rests primarily on the
correctness floor, not on a claimed intrinsic cost advantage within the
PTDD line. Compared to the earlier hybrid default, however, PTDD remains substantially leaner.

## Recommendation GPT-5.6 SOL on pi (OpenAI subscription route)

**`exact-ptdd-v1-pi` is the universal EXACT Coding default on GPT-5.6 SOL/pi.**
It is the canonical product name for the content measured as
`exact-sol-v1.6-test-list-dimensions-pi`.

| Use | recommended workflow | Evidence | Rationale |
|---|---|---|---|
| Large or novel specifications | **`exact-ptdd-v1-pi`** | RQ-test-list-dimensions-sol-pi; RQ-test-list-dimensions-multikata-sol-pi; RQ-test-list-dimensions-replication | full correctness on Claim Office at n=10; the same maintained contract as the Opus port |
| Small/training-familiar katas with no need for the full method | `baseline-inline-tdd-v1-pi` | RQ-1.16 | cheap comparison floor, but not a second EXACT Coding product workflow |

PTDD v1.5 remains a reproducible research reference: on SOL/pi it reaches the same
correctness and is cheaper on Claim Office in duration and median tokens. The difference
does not, however, justify a second maintained and exported product line. The choice of PTDD v1
is therefore explicitly a maintenance decision under an empirically manageable SOL premium,
not a claim that v1.6 wins every efficiency metric on every model.

The universal contract contains the independent dimension cross-check of the test list. On
SOL it shows no additional correctness gain across Claim Office, Game of Life and Sphinx
Score; on Opus it improves the observed correctness floor. A single
workflow therefore keeps the more robust cross-check on all ports.

## Consequence for further development

- New productive Predictive TDD variants branch off `exact-ptdd-v1-pi` or the matching harness port and receive versioned names (`exact-ptdd-v2-*`, then further major or branch versions). Historical `exact-sol-*` names remain solely for reproduction and RQ assignment.
- Workflow optimisations measured on opus-4-7 (the entire v6.5 reduction chain under
  `research/workflow-dev/2.*`/`3.*`) apply **only to opus-4-7** until they have been replicated
  cross-model.
- Before any "this workflow is better" claim: on which model? Cross-model replication is
  mandatory before a recommendation is stated as model-independent.
- **And on which target metric?** On opus-5, quality, price/performance and duration/performance
  diverge; a recommendation without a named optimisation goal is incomplete.
- The ranking itself is not model-invariant: on Sol, structureless inline-tdd-v1 beat every
  architecture (`RQ-architecture-axis-sol-pi` F-1.6), on opus-5 the ordering holds
  (`RQ-architecture-axis-opus5` F-1.1).
