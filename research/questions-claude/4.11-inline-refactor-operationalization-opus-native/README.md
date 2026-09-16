---
id: RQ-inline-refactor-operationalization-opus-native
question: "On native Opus 5, can naming-first and a mandatory inline refactoring trial improve SOL PTDD v1.6 decomposition without paying the isolated-subagent cost of the Opus default?"
factors:
  workflow_x_prompt:
    - {workflow: exact-sol-v1.6-test-list-dimensions-cc, prompt: example-mapping}
    - {workflow: exact-sol-v1.6.1-naming-refactor-trial-cc, prompt: example-mapping}
controls:
  model: opus-5-no-thinking
  kata_base: claim-office
outcomes:
  - verification_pct
  - tests_passing
  - completed_within_budget
  - tests_total
  - test_lines
  - cc_avg_loc_per_function
  - cc_median_loc_per_function
  - cc_longest_function
  - cc_functions
  - cognitive_max
  - cognitive_avg
  - mccabe_max
  - smell_total
  - code_mass
  - cc_loc
  - refactorings_applied
  - predictions_correct_rate
  - duration_seconds
  - total_tokens
  - cost_usd
min_replicates: 5
status: answered
---

# RQ-inline-refactor-operationalization-opus-native: Better Decomposition Without a Refactor Subagent

## Question

Can SOL PTDD v1.6 move toward the stronger decomposition of the correctness-oriented Opus default by operationalizing its existing inline Refactor phase, without introducing the isolated refactor subagent that contributes substantial context and token cost?

The correctness-oriented Opus default is `exact-hybrid-v2-testlist-fix-cc`. In `RQ-current-ptdd-vs-exact-opus-native` it produces smaller typical functions than PTDD, but at materially higher duration, token use, and list-price comparison. This RQ does not copy its architecture. It transfers only three low-context refactoring behaviors into the v1.6 inline loop:

- a concrete behavior-preserving refactoring trial every cycle, retained only when it improves the Four Rules;
- naming evaluation before selecting the trial;
- helper extraction as an explicit option when it names a distinct decision, transformation, policy, predicate, or orchestration step.

The PTDD domain-cohesion guard remains binding: no extraction solely to shorten a function, move a metric, create symmetry, or satisfy the trial obligation.

## Cells

| Cell | Inline Refactor contract | Context architecture |
|---|---|---|
| `exact-sol-v1.6-test-list-dimensions-cc` | Four Rules, domain-responsibility review, mandatory credible domain-boundary trial | one shared context |
| `exact-sol-v1.6.1-naming-refactor-trial-cc` | v1.6 plus naming-first, mandatory concrete trial, and explicit helper-extraction option | one shared context |

The v1.6 cell reuses the five runs from `RQ-test-list-dimensions-opus-native`. The v1.6.1 cell requires new runs. Workflow directories are content-identical except for the added operational-refactoring section and provenance metadata.

## Why this treatment

The Opus default differs from PTDD in several ways, but its decomposition prompt has three behaviors that do not require a separate context:

1. it makes the refactoring attempt operational rather than allowing review-only completion;
2. it evaluates names before other refactoring candidates;
3. it explicitly presents helper extraction as a way to reveal intent and remove conceptual duplication.

The isolated subagent is deliberately excluded. It creates a new context after every Green and is the most direct architectural source of additional token and wallclock cost. The treatment therefore asks whether prompt-level operationalization captures part of the decomposition benefit before paying for context isolation.

The existing PTDD protection for cohesive domain decisions is also deliberately retained. The target is not minimum function length. The target is better intent-revealing decomposition where a function combines independently understandable decisions.

## Routing — binding

Every run uses Claude Code with `opus-5-no-thinking` and the bare `claude-opus-5` API model id. `run-batch.sh` blanks Requesty variables for this native id and uses the mounted native Anthropic OAuth credentials. Requesty-labelled runs must not be pooled into either cell.

Model, thinking setting, provider, harness, kata, prompt style, test-list cross-check, Predictive TDD mechanics, shared-context architecture, domain-boundary review, stack profile, lab markers, and autonomy hardening are controls. Only the inline Refactor instructions vary.

## Primary contrasts

1. **Typical decomposition:** `cc_avg_loc_per_function` is primary, with median function size, function count, and Complexity Peak as robustness checks. Improvement means smaller typical functions or more intent-revealing units without a correctness loss; function count alone is not a winner metric.
2. **Correctness gate:** compare Correctness (external), internal tests, and completion within budget. A decomposition gain from incomplete work is disqualified.
3. **Efficiency boundary:** compare duration, tokens, and list-price estimates. The treatment is useful only if it retains most of v1.6's price/performance advantage.
4. **Complexity and smells:** compare Cognitive Complexity, McCabe, Smell Total, Code Mass (APP), and Production LoC to detect extraction that merely redistributes or inflates code.
5. **Process evidence:** compare retained/undone trial records in transcripts, refactor markers, and prediction accuracy. Marker counts are descriptive rather than a direct quality ranking.

## External reference — not an RQ cell

`exact-hybrid-v2-testlist-fix-cc` is not included as a third factor level because the causal contrast is v1.6 → v1.6.1. Its existing native Opus measurements provide a directional reference only:

- mean LoC/function: 3.81;
- median LoC/function: 2.00;
- Complexity Peak: 16.22;
- duration: 44.2 minutes;
- tokens: 83.7 M;
- list-price comparison: $49.13.

No run is generated for that reference, and no causal claim pools it with this RQ.

## Hypotheses

- **H1 — inline operationalization improves decomposition.** v1.6.1 lowers mean and median LoC/function relative to v1.6 while preserving complete Correctness (external).
- **H2 — the cohesion guard prevents fragmentation.** Function count may rise, but Complexity Peak, Cognitive Complexity, Code Mass (APP), and Production LoC do not materially worsen.
- **H3 — most of the efficiency advantage remains.** v1.6.1 stays materially below the external Opus-default reference in duration, tokens, and list-price comparison because no subagent context is introduced.
- **H4 — isolation is the missing mechanism.** v1.6.1 does not improve typical decomposition despite visibly performing naming-first trials and helper extractions. The remaining default advantage then points toward fresh-context refactoring or another bundled default-workflow component.
- **H5 — forced trials add noise.** v1.6.1 increases code size, complexity, or cost without improving typical decomposition. The operationalization should then remain an experimental branch rather than replacing v1.6.

## Interpretation rules

- Katas are never averaged; this RQ has one kata.
- Internally green but externally incomplete runs remain valid workflow outcomes.
- Timeouts count toward the target and are not refilled.
- Code-quality and efficiency trophies are correctness-gated.
- Function count, Code Mass (APP), Production LoC, Test LoC, test count, and refactor markers are contextual metrics and receive no trophy when their direction is ambiguous.
- The `cycle_count` metric is excluded because the single-command CC parser path was inconsistent with refactor markers in the v1.6 dataset.
- Transcript evidence must distinguish an attempted-and-undone trial from a retained refactoring. A higher marker count alone does not prove stronger refactoring.

## Promotion decision

Promote v1.6.1 over v1.6 only if it preserves the complete correctness floor, resolves a decomposition improvement beyond run-level noise, and remains substantially cheaper than the external Opus-default reference. If decomposition remains tied, retain v1.6: extra prompt obligations without product benefit are not an improvement.
