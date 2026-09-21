---
id: RQ-exact-coding-python
question: "On Python with pytest, how do inline TDD, shared-context EXACT Coding Predictive TDD, and EXACT Coding with an isolated Refactor subagent compare on correctness and code quality for GPT-5.6 SOL and Opus 5?"
factors:
  model_x_workflow:
    - {model: gpt-5-6-sol-codex, workflow: baseline-inline-tdd-v1-pi}
    - {model: gpt-5-6-sol-codex, workflow: exact-ptdd-v1-pi}
    - {model: gpt-5-6-sol-codex, workflow: exact-ptdd-v1.1-refactor-subagent-pi}
    - {model: opus-5-no-thinking, workflow: baseline-inline-tdd-v1-cc}
    - {model: opus-5-no-thinking, workflow: exact-ptdd-v1-cc}
    - {model: opus-5-no-thinking, workflow: exact-ptdd-v1.1-refactor-subagent-cc}
  kata_base:
    - game-of-life-python
    - claim-office-python
controls:
  prompt: example-mapping
  stack: python-pytest
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
  - coverage_statements_pct
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
status: open
---

# RQ-exact-coding-python: EXACT Coding on the Python Stack

## Question

How do the maintained shared-context EXACT Coding Predictive TDD workflow and
its isolated-Refactor-subagent variant compare with each other and with a
minimal inline-TDD instruction when all operate on the same Python, pytest and
ruff project stack?

This is an internal Python-stack comparison. It does not compare Python with
Java or TypeScript and makes no cross-language claim.

## Design

| Factor | Levels |
|---|---|
| Method | Inline TDD control; EXACT Coding Predictive TDD v1; v1.1 with isolated Refactor subagent |
| Model/harness bundle | GPT-5.6 SOL via pi; native Opus 5 without extended thinking via Claude Code |
| Kata | Game of Life; Claim Office |
| Prompt | Example Mapping |
| Stack | Python + pytest + ruff |

Five replicates are required for each method × model × kata cell: twelve cells
and 60 target runs. Results are reported separately by kata and model; katas
are never averaged.

The design is a deliberate mirror of [RQ-exact-coding-java](../1.8-exact-coding-java/README.md):
same methods, same models, same katas, same replicate count, same prompt style.
Only the stack differs. That is what makes the two answerable together.

The model and workflow are paired because the maintained workflow and control
must use the native port of each harness. The comparison within each model is:

- `baseline-inline-tdd-v1-pi` vs. `exact-ptdd-v1-pi` vs.
  `exact-ptdd-v1.1-refactor-subagent-pi` for GPT-5.6 SOL;
- `baseline-inline-tdd-v1-cc` vs. `exact-ptdd-v1-cc` vs.
  `exact-ptdd-v1.1-refactor-subagent-cc` for Opus 5.

The v1-to-v1.1 comparison is factor-isolated: test-list construction, Red,
Green, predictions, Four Rules, domain-boundary contract, stack profile, and
lab markers remain unchanged. Only the per-cycle Refactor execution context
moves from the main context to an isolated subagent.

The inline-TDD control is stack-neutral: it tells the agent to discover and use
the project's full-suite command rather than naming pnpm, Maven, pytest,
TypeScript, Java, or Python. The EXACT Coding workflow discovers
`pyproject.toml` and loads its Python/pytest stack profile. No Python-specific
workflow fork is used.

`baseline-inline-tdd-v1.1-local-git-{cc,pi}` must not be substituted for the
control: that variant regressed to naming `pnpm test` and is not runnable on
this stack.

## Stack provenance

The project skeleton, ruff selection and pytest configuration come from
`experiments/stacks/python-pytest/`, which mirrors the participant-facing
skeleton in `EXACT-Coding-Exercises` (`templates/python-pytest/files/`). The
lab pins the tool versions in `requirements-dev.txt` and adds `pytest-cov`; the
workflow's Python/pytest profile is used unchanged.

Python runs use dedicated kata contracts:

- `game-of-life-python-example-mapping`
- `claim-office-python-example-mapping`

Both expose `src/cli.py` solely for hidden external verification, which keeps
the acceptance instrument independent of the agent's own pytest tests. The
specification text of each is byte-identical to its Java and TypeScript
sibling; only the closing contract section differs.

## Primary outcomes

1. **Correctness:** Correctness (external), Correctness (internal), and
   completion within budget.
2. **Product quality:** Production LoC, Code Mass (APP), ruff findings,
   Cognitive Complexity, McCabe cyclomatic complexity, function count, and
   per-function size.
3. **TDD behaviour:** test-write blocks, verified RED transitions, test count,
   prediction accuracy, and refactoring records.
4. **Efficiency:** duration, tokens, and hypothetical list-price cost.

ruff's `C901` findings and complexipy's per-function scores are measurement
carriers and are excluded from `smell_total`. Every other configured ruff
violation contributes to the smell categories. Unlike the Java stack, Python
supplies a magic-number rule (`PLR2004`), so `smell_total` is the same
four-term sum the TypeScript stack uses.

`coverage_statements_pct` is available here and is absent on the Java stack; it
is reported descriptively and is not a trophy metric — a suite can cover every
line and still assert nothing, which is exactly what Mutation Score is for.

Python ruff values must not be compared numerically with Java PMD or
TypeScript ESLint/SonarJS values.

## Hypotheses

Each hypothesis is stated as a replication question against the Java result, so
a confirmation and a contradiction are equally informative.

- **H1 — correctness already saturated:** as on Java, inline TDD reaches the
  correctness ceiling on both katas and EXACT Coding adds no correctness. A
  Python-only correctness gain would mean the Java saturation was a property of
  that stack, not of the task.
- **H2 — complexity and unit-size benefit reproduces:** both EXACT variants
  lower Complexity Peak and per-function size against inline TDD, as they did in
  all four Java cells.
- **H3 — Mutation Score ordering reproduces:** Mutation Score was the only Java
  outcome that ordered the three methods identically in every model × kata
  combination. If that ordering holds on Python it is evidence for a
  method effect; if it breaks, F-1.8.9 was stack-specific.
- **H4 — model interaction:** the size or direction of the method effect differs
  between GPT-5.6 SOL and Opus 5.
- **H5 — workflow overhead:** EXACT Coding uses more time and tokens than inline
  TDD. The overhead is justified only by a correctness or product-quality gain.
- **H6 — isolated Refactor effect:** moving only the per-cycle Refactor phase to
  an isolated subagent improves decomposition or complexity relative to
  shared-context EXACT Coding, but adds further time and token overhead.
- **H7 — dynamic-typing failure mode:** Python has no compile step, so a wrong
  call signature surfaces only when a test runs it. If this matters, the witness
  is a lower `red_verified` rate or more unverified RED transitions than the
  Java arm showed, not a correctness difference.

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
- Python, Java and TypeScript quality-tool outputs are not interchangeable. This
  RQ supports conclusions only about variation inside the Python stack. The
  comparison with RQ-exact-coding-java is a comparison of **directions and
  orderings**, never of absolute values.

## Execution sequence

1. Build the updated Docker image containing `uv` and the warmed Python
   toolchain cache.
2. Run one Python smoke test per workflow port on Game of Life — at minimum
   `exact-ptdd-v1-cc` and `exact-ptdd-v1-pi`.
3. Confirm in `metrics.json`: `stack = "python-pytest"`, pytest green,
   external verification, `cognitive_max` and `mccabe_max` non-null (otherwise
   the ruff/complexipy arm did not fire), `clean_code.longest_function > 0`
   (otherwise the `def` detector did not fire), and the four TDD markers from
   the merged `summary_metrics + final_metrics` block.
4. Spot-check a transcript for the agent reading `python-pytest.md` **before**
   writing the test list. RQ-stack-profile-extraction-sol named failure to
   consult the profile as the primary risk of a profile change.
5. Run `experiments/compute-mutation-score.py` on the smoke run and confirm it
   writes `mutation_score`, `mutants_total` and `mutants_survived`.
6. Generate the fill plan with `/run-rq RQ-exact-coding-python` only after the
   smoke tests pass.
7. Aggregate and interpret each model × kata contrast independently, then
   compare directions against RQ-exact-coding-java.
