---
id: RQ-exact-coding-java
question: "On Java 17 with JUnit 5 and Maven, does EXACT Coding Predictive TDD improve correctness and code quality over unstructured inline TDD on Game of Life and Claim Office, for GPT-5.6 SOL and Opus 5?"
factors:
  model_x_workflow:
    - {model: gpt-5-6-sol-codex, workflow: baseline-inline-tdd-v1-pi}
    - {model: gpt-5-6-sol-codex, workflow: exact-ptdd-v1-pi}
    - {model: opus-5-no-thinking, workflow: baseline-inline-tdd-v1-cc}
    - {model: opus-5-no-thinking, workflow: exact-ptdd-v1-cc}
  kata_base:
    - game-of-life-java
    - claim-office-java
controls:
  prompt: example-mapping
  stack: java-junit-maven
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
  - smell_code_quality
  - cognitive_max
  - cognitive_avg
  - mccabe_max
  - mccabe_avg
  - java_methods
  - java_method_ncss_max
  - java_method_ncss_avg
  - java_method_ncss_median
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
min_replicates: 5
status: open
---

# RQ-exact-coding-java: EXACT Coding on the Java Stack

## Question

Does the maintained EXACT Coding Predictive TDD workflow improve correctness or
product-code quality over a minimal inline-TDD instruction when both operate on
the same Java 17, JUnit 5, Maven, Jackson, and PMD project stack?

This is an internal Java-stack comparison. It does not compare Java with
TypeScript and makes no cross-language claim.

## Design

| Factor | Levels |
|---|---|
| Method | Inline TDD control; EXACT Coding Predictive TDD v1 |
| Model/harness bundle | GPT-5.6 SOL via pi; native Opus 5 without extended thinking via Claude Code |
| Kata | Game of Life; Claim Office |
| Prompt | Example Mapping |
| Stack | Java 17 + JUnit 5 + Maven + PMD |

Five replicates are required for each method × model × kata cell: eight cells
and 40 target runs. Results are reported separately by kata and model; katas
are never averaged.

The model and workflow are paired because the maintained workflow and control
must use the native port of each harness. The comparison within each model is:

- `baseline-inline-tdd-v1-pi` vs. `exact-ptdd-v1-pi` for GPT-5.6 SOL;
- `baseline-inline-tdd-v1-cc` vs. `exact-ptdd-v1-cc` for Opus 5.

The inline-TDD control is stack-neutral: it tells the agent to discover and use
the project's full-suite command rather than naming pnpm, Maven, TypeScript, or
Java. The EXACT Coding workflow discovers `pom.xml` and loads its existing
Java/JUnit/Maven stack profile. No Java-specific workflow fork is used.

## Stack provenance

The Maven project and PMD ruleset are taken from the established Java skeleton
in `EXACT-Coding-Exercises` (`templates/java-junit-maven/files/`, previously the
`harness/copilot-java` branch). The lab adds only
the Jackson dependency and Maven execution support needed for language-neutral
external acceptance. The exact workflow's existing Java/JUnit/Maven profile is
used unchanged.

Java runs use dedicated kata contracts:

- `game-of-life-java-example-mapping`
- `claim-office-java-example-mapping`

Both expose a Java CLI solely for hidden external verification. This keeps the
acceptance instrument independent of the agent's own JUnit tests.

## Primary outcomes

1. **Correctness:** Correctness (external), Correctness (internal), and
   completion within budget.
2. **Product quality:** Production LoC, Code Mass (APP), PMD findings,
   Cognitive Complexity, McCabe cyclomatic complexity, method count, and
   per-method NCSS size.
3. **TDD behaviour:** test-write blocks, verified RED transitions, test count,
   prediction accuracy, and refactoring records.
4. **Efficiency:** duration, tokens, and hypothetical list-price cost.

PMD's `CognitiveComplexity` and `CyclomaticComplexity` findings are measurement
carriers and are excluded from `smell_total`. Both rules report per-method
scores; PMD `NcssCount` also supplies method count and maximum, mean, and median
non-commenting source statements per method. Every other configured PMD
violation contributes to the smell categories. Java PMD
values must not be compared numerically with historical TypeScript
ESLint/SonarJS values.

## Hypotheses

- **H1 — correctness benefit on the novel kata:** EXACT Coding improves the
  correctness floor on Claim Office by forcing a complete inactive test list
  and one-behaviour cycles.
- **H2 — saturated classic kata:** Both methods reach full external correctness
  on Game of Life, leaving quality and efficiency as the differentiating
  outcomes.
- **H3 — Java quality benefit:** EXACT Coding reduces PMD findings or Code Mass
  (APP), or improves decomposition without sacrificing correctness.
- **H4 — model interaction:** The size or direction of the method effect differs
  between GPT-5.6 SOL and Opus 5; no model-independent recommendation follows
  from one model alone.
- **H5 — workflow overhead:** EXACT Coding uses more time and tokens than inline
  TDD. The overhead is justified only by a correctness or product-quality gain.

## Interpretation rules

- Never average across katas or models.
- Compare workflows only within the same model/harness bundle.
- Correctness gates code-quality and efficiency trophies.
- Timeouts are outcomes and are not refilled.
- Test count, Test LoC, Production LoC, Code Mass (APP), and process-marker
  counts have ambiguous direction and receive no trophy solely for being lower
  or higher.
- The inline-TDD arm controls for test-first intent. The measured treatment is
  the additional EXACT Coding structure, not TDD versus one-shot generation.
- Java and TypeScript quality-tool outputs are not interchangeable. This RQ
  supports conclusions only about variation inside the Java stack.

## Execution sequence

1. Build the updated Docker image containing Java 17 and Maven.
2. Run one Java smoke test per harness on Game of Life.
3. Confirm Maven tests, external verification, stack identity, transcript
   metrics, and PMD analysis in `metrics.json`.
4. Generate the fill plan with
   `/run-rq RQ-exact-coding-java` only after both smoke tests pass.
5. Aggregate and interpret each model × kata contrast independently.
