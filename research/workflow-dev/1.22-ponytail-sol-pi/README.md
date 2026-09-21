---
id: RQ-ponytail-sol-pi
question: "When Ponytail full is forcibly loaded into the Sol-originated EXACT Coding workflow on pi, does it improve code quality without reducing correctness, test strength, TDD discipline or completion reliability, and at what cost?"
factors:
  workflow:
    - exact-sol-v1.3-stack-profile-pi
    - exact-sol-v1.3.1-ponytail-pi
  kata_base: [game-of-life, claim-office]
controls:
  model: gpt-5-6-sol-codex
  prompt: example-mapping
outcomes:
  # Correctness and safety gates
  - verification_pct
  - tests_passing
  - mutation_score
  - mutants_total
  - mutants_survived
  - completed_within_budget
  # Complete code-quality surface currently provided by the pipeline
  - code_mass
  - cc_loc
  - cc_functions
  - cc_avg_loc_per_function
  - cc_median_loc_per_function
  - cc_longest_function
  - cognitive_max
  - cognitive_avg
  - cognitive_high_count
  - mccabe_max
  - mccabe_avg
  - mccabe_high_count
  - smell_total
  - smell_complexity
  - smell_duplication
  - smell_magic_numbers
  - smell_code_quality
  # Test-suite size and TDD mechanism controls
  - test_lines
  - cycle_count
  - refactorings_applied
  - predictions_correct_rate
  - tests_passed_immediately
  # Operational cost
  - duration_seconds
  - total_tokens
  - cost_usd
min_replicates: 5
status: answered
---

# Forced Ponytail on the Sol-Originated EXACT Coding Line

## Motivation

Ponytail is not a TDD workflow. It is an implementation-minimalism discipline:
after understanding the task, it applies a ladder from YAGNI through reuse,
standard-library and native-platform options to the minimum custom code that
works. This makes it an additive intervention on the current Sol-originated
EXACT Coding workflow rather than a substitute for Predictive TDD.

The experiment asks what Ponytail contributes **when it is definitely loaded**.
Passive skill availability is not an arm: discoverability and spontaneous skill
selection are outside the question.

## Experimental design

| Arm | Predictive TDD | Stack profile | Ponytail |
|---|---|---|---|
| `exact-sol-v1.3-stack-profile-pi` | unchanged | TypeScript/Vitest profile | absent |
| `exact-sol-v1.3.1-ponytail-pi` | unchanged | byte-identical profile | vendored and forcibly loaded in `full` mode |

The candidate derives from the promoted SOL-EXACT-Coding default
`exact-sol-v1.3-stack-profile-pi`. The only intended treatment is:

1. vendor upstream `skills/ponytail/SKILL.md` byte-identically and record its
   commit and license;
2. add a lab-authored orchestration instruction that requires loading Ponytail
   in `full` mode after understanding the task and before the first production
   implementation;
3. require Ponytail to remain active through Green and Refactor phases.

The invocation overlay must state that Ponytail governs implementation choices,
not the prescribed Predictive-TDD protocol. It must not suppress the test list,
one-test-at-a-time cycles, prediction blocks, stack gates, refactor review or lab
markers. No Ponytail content may be copied into the baseline.

## Why two katas

Results are reported separately and never averaged across katas:

- **Game of Life** is the smaller, training-known quality probe. It tests whether
  an already compact implementation has room to improve or instead becomes
  compressed and harder to read.
- **Claim Office** is the larger novel specification and primary safety probe.
  Its external verification distinguishes genuine minimalism from omitted
  rules, validation or error handling.

Both use the same `example-mapping` prompt style, pi harness, subscription-route
model and container image.

## Outcomes and reading rules

All code-quality metrics currently emitted by the analysis pipeline are included:
Code Mass (APP), Production LoC, function count and length distribution,
Complexity Peak, cognitive complexity, McCabe complexity, Smell Total and all
smell sub-counters. Test LoC is included because Ponytail explicitly advocates a
single smallest runnable check and could otherwise shrink tests rather than
production code.

Correctness is a gate, not one quality dimension among peers. Lower Code Mass
(APP), Production LoC, complexity, smells, duration or cost does not count as an
improvement when it is purchased by lower Correctness (external), failed internal
tests, incomplete execution, or a materially weaker Mutation Score. Quality
winners follow the repository's correctness-gating and trophy conventions.

Mutation Score is prespecified despite its post-processing cost because passing
self-written tests alone cannot show whether a smaller test suite preserves
behavioural sensitivity.

The existing pipeline has no declarative-versus-imperative metric. If such a
metric is implemented before execution, add it to this RQ before generating the
batch plan; do not add it after seeing results.

## Hypotheses

- **H1 — genuine minimalism:** forced Ponytail lowers Code Mass (APP) and
  Production LoC while preserving internal and external correctness and Mutation
  Score.
- **H2 — broader quality improvement:** the smaller implementation also improves
  at least part of the function-shape, cognitive, McCabe or smell surface rather
  than merely reducing line count.
- **H3 — compression trade-off:** Ponytail lowers mass or LoC but worsens
  Complexity Peak, average/median function length, cognitive complexity, McCabe
  complexity or smells. This is compression, not an unqualified quality gain.
- **H4 — safety/test erosion:** Ponytail reduces external correctness, Mutation
  Score or Test LoC enough to explain apparent production-code gains. In that
  case the treatment fails its own "not lazy about" boundary.
- **H5 — null effect:** SOL already produces sufficiently minimal code under the
  Four Rules, so forced Ponytail remains within ordinary replicate variation on
  quality and cost outcomes.
- **H6 — operational effect:** the extra skill either saves work by preventing
  unnecessary implementation or adds attention/context overhead; duration,
  tokens and list-price cost determine the direction.

## Treatment-fidelity checks

Before the full batch, run one candidate smoke test and inspect the transcript.
The run is valid only if all of the following hold:

1. the model reads the vendored Ponytail skill before its first production-code
   edit and identifies `full` as the active level;
2. the matching TypeScript/Vitest stack profile is still read before Test List;
3. `Test List Created`, `## Red`, `## Green`, `## Refactor`, prediction blocks
   and `experiment-done.txt` remain intact;
4. Ponytail does not replace the workflow's Vitest suite with its suggested
   single assert/demo check;
5. Correctness (internal) passes and the external verifier runs.

For the SOL line, legitimate already-green cycles mean prediction totals need not
be approximately twice cycle count. Evaluate prediction accuracy and transcript
compliance rather than imposing the Hybrid-line ratio.

Treatment fidelity must also be spot-checked in at least two completed candidate
runs per kata before aggregation. A candidate run that never loads Ponytail is a
treatment failure, not evidence of a null effect; do not silently replace or
exclude it. Report fidelity failures and decide the handling before reading the
quality outcomes.

## Upstream provenance

The design was prepared against Ponytail upstream commit
`356918eba965ee1eac64bd3a7f0dd02108350de5`. The implementation must pin the
actual vendored commit and preserve the upstream MIT license. If upstream moves
before vendoring, record the new commit here before any run so the treatment is
reproducible.

## Execution sequence

1. Derive `exact-sol-v1.3.1-ponytail-pi` from
   `exact-sol-v1.3-stack-profile-pi` without changing Predictive TDD or its stack
   profile.
2. Vendor and checksum Ponytail; add only the forced-load integration overlay.
3. Register the workflow in `experiments/workflows/LINEAGE.yaml` and run the
   lineage checks.
4. Run one candidate Game of Life smoke test and perform the treatment-fidelity
   and marker checks above.
5. Fill through `/run-rq RQ-ponytail-sol-pi`.
6. Compute Mutation Score and cost before final aggregation.
7. Report each kata separately and inspect correctness before interpreting any
   quality or efficiency metric.

## Caveats

1. This RQ estimates the effect of **forced Ponytail full**, not the effect of
   merely installing Ponytail or the probability that pi selects it unaided.
2. The treatment adds prompt content and an explicit invocation obligation.
   Any effect combines Ponytail's guidance with the attention/context cost of
   enforcing it; that is the operational intervention users would actually run.
3. Game of Life may be at a quality floor and is training-known. A null result
   there does not override a separated Claim Office result.
4. Five replicates per cell are exploratory. If the effect is smaller than
   within-cell variation or correctness failures appear, increase replication
   in a prespecified follow-up rather than selecting favourable runs.
5. `tests_passed_immediately` is not a reliable already-green measure on pi and
   is retained only for schema continuity. Read already-green behaviour from
   transcripts.
6. `refactorings_applied` counts inline Refactor markers, including reviews that
   make no code change.
7. Cost is a token-derived list-price comparison value, not a subscription
   invoice.
