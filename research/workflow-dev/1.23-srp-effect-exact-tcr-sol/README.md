---
id: RQ-srp-effect-exact-tcr-sol
question: "How does the same domain-boundary refactoring trial interact with SOL Predictive TDD versus EXACT TCR, and can a subordinate APP review lower Code Mass in the strongest TCR trial arm without erasing its decomposition, correctness, discipline, or efficiency?"
factors:
  workflow:
    - exact-sol-v1.3.2-local-git-control-pi
    - exact-sol-v1.4-domain-boundary-trial-pi
    - exact-tcr-v1-pi
    - exact-tcr-v1.1-srp-pi
    - exact-tcr-v1.2-domain-responsibility-pi
    - exact-tcr-v1.3-domain-boundary-trial-pi
    - exact-tcr-v1.4-domain-boundary-app-pi
  kata_base: [game-of-life, claim-office]
controls:
  model: gpt-5-6-sol-codex
  prompt: example-mapping
outcomes:
  # Correctness and completion gates
  - verification_pct
  - tests_passing
  - completed_within_budget
  # Primary SRP-sensitive code shape
  - cc_avg_loc_per_function
  - cc_median_loc_per_function
  - cc_longest_function
  - cc_functions
  - cognitive_max
  - cognitive_avg
  - mccabe_max
  - mccabe_avg
  - smell_total
  - smell_code_quality
  # Size and tests: witnesses for useful separation versus abstraction growth
  - code_mass
  - cc_loc
  - test_lines
  # TCRDD mechanism controls
  - test_blocks
  - red_verified
  - red_unverified
  - tcr_refactor_steps
  - tcr_method_commits
  - tcr_red_commits
  - tcr_green_commits
  - tcr_refactor_commits
  - cycle_count
  - refactorings_applied
  - predictions_correct_rate
  # Operational cost
  - duration_seconds
  - total_tokens
  - cost_usd
min_replicates: 5
status: answered
---

# Domain Responsibility and APP in SOL Predictive TDD and EXACT TCR

## Motivation

`exact-tcr-v1-pi` reviews each green increment against the Four Rules of Simple
Design before committing or reverting each structural change. The candidate
`exact-tcr-v1.1-srp-pi` adds an explicit qualitative Single Responsibility
Principle review for the production code being developed. The extended
candidate, `exact-tcr-v1.2-domain-responsibility-pi`, operationalizes that review:
it requires domain-language responsibility names, explicit independent policy
change axes, and a boundary decision before "no improvement possible" is valid.
The next candidate, `exact-tcr-v1.3-domain-boundary-trial-pi`, adds the missing
action mechanism: broad responsibility names face a change counterfactual, the
strongest credible semantic seam is tried through TCR commit-or-revert, and a
before/after record explains the retained or reverted boundary.

DDD contributes only ubiquitous language as a semantic anchor. Neither candidate
prescribes entities, aggregates, repositories, architecture layers, or other
tactical patterns. Both establish that a well-named boundary for independently
changing domain knowledge reveals intent and therefore takes priority over
Fewest Elements. V1.3 adds no numerical threshold, metric target, subagent, extra
phase, changed Git protocol, or changed stack profile.

The Predictive-TDD port, `exact-sol-v1.4-domain-boundary-trial-pi`, applies the
same semantic review, counterfactual, concrete moves, and before/after evidence
to the current SOL Predictive-TDD line. Its trials use the existing
predict/check/undo loop and deliberately create no TCR method commits. Together
with `exact-sol-v1.3.2-local-git-control-pi`, this forms a 2×2 method × boundary-
trial comparison under the same isolated local-Git environment.

The APP extension, `exact-tcr-v1.4-domain-boundary-app-pi`, starts from the
strongest decomposing arm and adds a qualitative Absolute Priority Premise
review only after domain boundaries are established. It trials a lower-mass
expression through TCR while making Rules 1–3 load-bearing: APP may remove
avoidable constructs but may not inline or combine independently changing
policies. It deliberately avoids complete in-run arithmetic, keeping
deterministic measurement as a separate factor from the APP review itself.

This is deliberately separate from the rejected
`exact-hybrid-v4.1-refactor-vocab-cc` bundle. That workflow simultaneously added
complexity vocabulary, SRP, and a broad smell-to-move table on another model,
harness, architecture, and TDD method. Its failure cannot identify the effect of
SRP alone. The present RQ isolates the responsibility and APP additions on the
already measured first-party EXACT TCR line.

## Controlled change

Primary 2×2 contrast:

| Method | Standard Four-Rules refactor | Domain-boundary trial |
|---|---|---|
| SOL Predictive TDD | `exact-sol-v1.3.2-local-git-control-pi` | `exact-sol-v1.4-domain-boundary-trial-pi` |
| EXACT TCR | `exact-tcr-v1-pi` | `exact-tcr-v1.3-domain-boundary-trial-pi` |

The intermediate TCR arms remain in the RQ to preserve the mechanism gradient:

| Concern | v1 | v1.1 qualitative SRP | v1.2 domain review | v1.3 boundary trial |
|---|---|---|---|---|
| Test-list method | complete inactive list | unchanged | unchanged | unchanged |
| TCRDD protocol | native-Git RED–GREEN–REFACTOR commit or revert | unchanged | unchanged | unchanged |
| Base refactor review | Four Rules of Simple Design | unchanged | unchanged | unchanged |
| Added treatment | none | qualitative SRP review | operational domain-responsibility review | mandatory trial of strongest credible domain seam |
| Semantic anchor | none | cohesive reason to change | specification language and independent policy change axes | unchanged plus change counterfactual |
| Rule priority | Four Rules order | unchanged | domain boundaries outrank Fewest Elements | unchanged and exercised by a concrete trial |
| Evidence requirement | standard Four-Rules review | qualitative assessment | domain responsibility/axes/boundary decision | candidate plus committed/reverted semantic outcome |
| Stack handling | matching profile required | concrete profile guidance | profiles inherited from v1.1 | profiles inherited byte-identically from v1.2 |
| Harness and context | pi, one shared context | unchanged | unchanged | unchanged |
| Lab markers | P1–P7 | unchanged | unchanged | unchanged |

APP extension contrast:

| Concern | v1.3 boundary trial | v1.4 boundary trial + APP |
|---|---|---|
| Rules 1–3 and domain boundaries | binding | binding and explicitly outrank APP |
| Rule 4 evidence | Fewest Elements | Fewest Elements plus qualitative APP weights |
| Additional action | none | APP simplification trial through commit-or-revert |
| Complete in-run APP arithmetic | no | no |
| Stack profiles | inherited | byte-identical |

The generic SRP rule lives in `.pi/skills/tcrdd/SKILL.md`. Concrete
TypeScript/Vitest and Java/JUnit/Maven application guidance lives only in the
matching files under `.pi/skills/exact-coding-tcr/stacks/`. This keeps the core
method stack-neutral while making the active profile actionable.

## Why two katas

Results are reported separately and never averaged across katas:

- **game-of-life** is the smaller, training-known quality probe. It tests whether
  explicit SRP improves an already compact implementation or causes unnecessary
  fragmentation.
- **claim-office** is the novel multi-concern CLI specification and the primary
  safety probe. It can expose separation of domain decisions from transport and
  serialization, while its external verifier detects omitted behavior and the
  premature-completion failure seen in earlier additive workflow experiments.

Both cells use the same example-mapping prompt, SOL subscription-route model,
pi harness, isolated local Git setup, and TypeScript/Vitest stack profile.

## Hypotheses

- **H0 — method contrast:** at constant boundary treatment, Predictive TDD and
  TCR may differ because TCR preserves phase-specific Git states while
  Predictive TDD retains only verified working-tree changes.
- **H0a — interaction:** if the boundary trial improves decomposition more under
  TCR, commit-or-revert auditability or phase closure contributes beyond the
  semantic prompt; if both methods move similarly, the semantic trial is the
  stronger mechanism.
- **H0b — subordinate APP benefit:** after domain boundaries are explicit, APP
  lowers Code Mass (APP) while leaving function decomposition and correctness
  intact. If mass falls by collapsing named policy boundaries, APP remains
  incompatible with this model even under explicit subordination.
- **H1 — boundary-trial effect:** requiring a concrete trial improves function
  decomposition over v1.2 analysis alone while preserving correctness.
- **H2 — action mechanism:** v1.3 produces more surviving, policy-named boundary
  refactors than v1.2 because credible seams must be exercised rather than only
  discussed.
- **H3 — abstraction cost:** explicit SRP increases function count, Production
  LoC or Code Mass (APP) without improving complexity or responsibility
  boundaries. That is abstraction growth, not an unqualified quality gain.
- **H4 — small-kata over-separation:** any benefit is stronger on claim-office
  than game-of-life; on the compact kata, SRP may add indirection without a
  second genuine reason to change.
- **H5 — process neutrality:** verified RED behavior, TCRDD commits,
  refactoring activity, predictions, and completion remain within ordinary
  replicate variation because the treatment changes only the green-state
  structural review.
- **H6 — additive-prompt safety risk:** the extra review may trigger premature
  completion on claim-office, as earlier additive workflow bundles did. Any
  reduction in Correctness (external), cycle coverage, or completion gates all
  apparent code-size and complexity gains.
- **H7 — operational cost:** executing and verifying boundary trials increases
  duration, tokens, or list-price cost even if final code quality is unchanged.
- **H8 — DDD overreach risk:** despite the explicit guard, mandatory trials may
  introduce speculative abstractions or layers not justified by active behavior;
  increased structure without clearer policy boundaries counts against v1.3.

## Interpretation rules

Correctness and completion gate every quality claim. Smaller or simpler code is
not a win when it omits specified behavior, fails internal tests, or does not
complete within budget.

SRP is not equivalent to short functions, many functions, low complexity, or low
Code Mass (APP). Those pipeline metrics are outcome witnesses, not direct proof
that responsibilities are cohesive. For treatment fidelity and mechanism,
inspect source and transcript evidence for independently changing concerns and
whether an extraction creates a clearer boundary. Do not award a process trophy
for more commits or refactor steps; those metrics describe execution rather than
an intrinsically desirable direction.

The first-party workflow retains RED, GREEN, and REFACTOR commits. Final-history
counts therefore describe its intended audit trail, but they do not establish
SRP quality by themselves. Report all metrics kata-by-kata.

## Existing evidence and fill requirement

All six existing workflows have five matching runs per kata. The 60-run field
establishes that the boundary trial improves Claim Office decomposition more
consistently under TCR than Predictive TDD while preserving complete correctness;
on Game of Life the trial methods remain spread-overlapping. These runs remain
the controls for the APP extension.

No `exact-tcr-v1.4-domain-boundary-app-pi` runs exist. Query-based aggregation
therefore requires five fresh APP runs on each kata. Before the fill batch, one
planned Game of Life APP run serves as the workflow smoke test; if healthy, it
counts toward that cell. The extension changes only the generic REFACTOR review
and inherits TCR mechanics, the domain-boundary mechanism, lab instructions,
and byte-identical stack profiles from v1.3.

## Treatment-fidelity checks

Before aggregation, spot-check APP candidate transcripts, Git history, and final
source from both katas:

1. the matching TypeScript/Vitest stack profile is read before implementation;
2. the domain-responsibility review occurs during green-state REFACTOR work, not
   during RED or as speculative production design;
3. the required `Domain responsibility`, `Independent change axes`, and
   `Boundary candidate` record names the strongest credible semantic seam;
4. a credible candidate is actually changed, verified, and committed or reverted
   rather than merely discussed;
5. the `Boundary outcome`, `Semantic change`, and `Fewest Elements check` record
   explains the result in specification language;
6. broad mechanical labels such as "calculate result" or "process scenario" are
   challenged with the prescribed change counterfactual;
7. domain boundaries explicitly take priority over Fewest Elements when those
   rules pull in opposite directions;
8. structural changes remain behavior-preserving and use TCR commit-or-revert;
9. `APP candidate`, `APP expectation`, and `APP outcome` records identify
   avoidable weighted constructs without complete hand arithmetic;
10. APP changes do not inline retained domain policies, combine independent
   decisions, move complexity into adapters/tests, or compress names;
11. the model does not introduce tactical DDD patterns or architecture layers
   without a responsibility present in active behavior;
12. P1–P7 markers, the complete inactive test list, phase continuation, and clean
   final Git state remain intact;
13. claim-office completes the full specification rather than self-terminating.

A candidate run that never applies or considers the SRP instruction is a
treatment-fidelity failure, not evidence that SRP has no effect. Report such
failures before interpreting quality outcomes; do not silently exclude or refill
them.

## Execution sequence

1. Keep all existing arms unchanged and verify the v1.3 → v1.4 diff is limited
   to the generic APP review/trial and provenance; stack profiles must remain
   byte-identical.
2. Generate the extension fill plan with `/run-rq RQ-srp-effect-exact-tcr-sol`.
3. Run the two missing APP cells to `min_replicates: 5` with five shards.
4. Spot-check retained/reverted APP trials, domain-boundary preservation,
   semantic and APP records, DDD overreach, markers, and completion.
5. Reaggregate all seven workflows by query, report katas separately, and
   replace the findings with the current method × boundary × APP state.
