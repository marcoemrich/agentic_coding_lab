---
id: RQ-exact-coding-rust
question: "On Rust with Cargo, how do inline TDD, shared-context EXACT Coding Predictive TDD, and EXACT Coding with an isolated Refactor subagent compare on correctness, TDD discipline and code quality for GPT-6 SOL and Opus 5?"
factors:
  model_x_workflow:
    - {model: gpt-6-sol-codex, workflow: baseline-inline-tdd-v1-pi}
    - {model: gpt-6-sol-codex, workflow: exact-ptdd-v1-pi}
    - {model: gpt-6-sol-codex, workflow: exact-ptdd-v1.1-refactor-subagent-pi}
    - {model: opus-5-no-thinking, workflow: baseline-inline-tdd-v1-cc}
    - {model: opus-5-no-thinking, workflow: exact-ptdd-v1-cc}
    - {model: opus-5-no-thinking, workflow: exact-ptdd-v1.1-refactor-subagent-cc}
controls:
  kata_base: claim-office-rust
  prompt: example-mapping
  stack: rust-cargo
outcomes:
  # correctness: a gate, not a result (see "Primary outcome")
  - verification_pct
  - tests_passing
  - completed_within_budget
  # code quality: the question this RQ exists to answer
  - code_mass
  - smell_total
  - smell_complexity
  - smell_duplication
  - smell_code_quality
  - cognitive_max
  - cognitive_avg
  - mccabe_max
  - mccabe_avg
  # function length. unit_* is deliberately absent: off Java it is a copy of
  # these (lines per function), and listing both doubles every column.
  - cc_longest_function
  - cc_avg_loc_per_function
  - cc_median_loc_per_function
  - cc_functions
  - mutation_score
  - mutants_total
  - mutants_survived
  # size, ambivalent direction, no trophy
  - tests_total
  - test_lines
  - lines_of_code
  - coverage_statements_pct
  # TDD discipline, phase chain. All runs of this RQ are new, so no cell
  # falls back to a legacy_ column.
  - tdd_discipline
  - tdd_discipline_test_first
  - tdd_discipline_step
  - tdd_discipline_closure
  - test_first_rate
  - red_batch_size
  - red_batch_max
  - red_batch_unmeasurable
  - green_batch_size
  # denominators — never read the rates without them
  - chain_suite_runs
  - cycles_total
  - cycles_closed
  - refactor_events
  - skip_events
  # ambivalent, no trophy
  - refactor_per_cycle
  - green_attempts
  # pathologies and endpoints
  - chain_deviations
  - chain_opens_red
  - chain_ends_green
  # marker-derived, still the only source for predictions
  - predictions_correct_rate
  # efficiency
  - duration_seconds
  - total_tokens
  - cost_usd
min_replicates: 5
---

# RQ-exact-coding-rust: EXACT Coding on the Rust Stack

## Question

How do the maintained shared-context EXACT Coding Predictive TDD workflow and
its isolated-Refactor-subagent variant compare with each other and with a
minimal inline-TDD instruction when all operate on the same Rust, Cargo and
clippy project stack?

This is an internal Rust-stack comparison. It does not compare Rust with
TypeScript, Java or Python and makes no cross-language claim.

## Design

| Factor | Levels |
|---|---|
| Method | Inline TDD control; EXACT Coding Predictive TDD v1; v1.1 with isolated Refactor subagent |
| Model/harness bundle | GPT-6 SOL via pi (`openai-codex` route); native Opus 5 without extended thinking via Claude Code |
| Kata | Claim Office |
| Prompt | Example Mapping |
| Stack | Rust 1.98.1 + Cargo + clippy |

Five replicates are required for each method × model cell: six cells and 30
target runs. Results are reported separately by model.

Claim Office only. The sister RQs ran Game of Life as a second kata; it is
dropped here, so H2–H6 are tested on one kata and a direction that held on Game
of Life elsewhere has no Rust counterpart to compare with. The
`game-of-life-rust-example-mapping` contract and its verification suite exist
and served as the stack's smoke kata.

The method, kata, prompt and replicate design mirrors
[RQ-exact-coding-java](../1.8-exact-coding-java/README.md),
[RQ-exact-coding-python](../1.9-exact-coding-python/README.md) and
[RQ-exact-coding-typescript](../1.10-exact-coding-typescript/README.md).
**One model does not.** The sister RQs ran GPT-5.6 SOL and Opus 5; this RQ
keeps Opus 5 and moves the pi arm to the current generation, GPT-6 SOL. On the
Opus arm a direction that differs from the sister RQs is a stack effect; on the
GPT arm it can be a stack effect or a model-generation effect, and this RQ
alone cannot tell which.

**Why not Opus 5.5.** The design started on Opus 5.5. Both smoke runs of
`exact-ptdd-v1-cc` on the Rust stack (one per kata, 2026-10-01) were cut off
after three to four minutes by the API with `Opus 5.5's safeguards flagged this
message … [reasoning_extraction]`, mid-cycle, on ordinary test output and
prediction text. The same workflow had run six times on Opus 5.5 on TypeScript
without it. At that rate most Opus cells would stay empty, and refilling them
until a run survives selects on the failure mode. Opus 5 is the model the sister
RQs used, so the switch also makes the Opus arm directly comparable.

The model and workflow are paired because the maintained workflow and control
must use the native port of each harness. The comparison within each model is:

- `baseline-inline-tdd-v1-pi` vs. `exact-ptdd-v1-pi` vs.
  `exact-ptdd-v1.1-refactor-subagent-pi` for GPT-6 SOL;
- `baseline-inline-tdd-v1-cc` vs. `exact-ptdd-v1-cc` vs.
  `exact-ptdd-v1.1-refactor-subagent-cc` for Opus 5.

The v1-to-v1.1 comparison is factor-isolated: test-list construction, Red,
Green, predictions, Four Rules, domain-boundary contract, stack profile, and
lab markers remain unchanged. Only the per-cycle Refactor execution context
moves from the main context to an isolated subagent.

The inline-TDD control is stack-neutral: it tells the agent to discover and use
the project's full-suite command rather than naming a tool. The EXACT Coding
workflow discovers `Cargo.toml` and loads its Rust/Cargo stack profile
(`stacks/rust-cargo.md`, identical in all four ports). No Rust-specific
workflow fork is used.

`baseline-inline-tdd-v1.1-local-git-{cc,pi}` must not be substituted for the
control: that variant names `pnpm test` and is not runnable on this stack.

## Stack provenance

Unlike the Java and Python stacks, the Rust stack has no participant-facing
skeleton in `EXACT-Coding-Exercises` to mirror. It was built for this RQ in
`experiments/stacks/rust-cargo/`: a library crate with the kata CLI as its
binary `kata`, `serde`/`serde_json` pinned exactly in `Cargo.lock`, Cargo
offline against the registry baked into the image, and a clippy lint
selection plus thresholds in `clippy.toml` mirroring the Python stack's size
and nesting gates.

Rust runs use a dedicated kata contract, `claim-office-rust-example-mapping`.
It exposes `src/main.rs` solely for hidden external verification, built with
`cargo build --release` and invoked as `target/release/kata`. The specification
text is byte-identical to its Python sibling and the scenarios are the
same files; only the closing contract section differs.

## Measurement specifics of this stack

These are properties of the instrument, established on a scripted TDD sequence
before the first model run (`Red(c) -> Red -> Green -> Red -> Green ->
Refactor`, `tdd_discipline` 1.0, 15/15 external scenarios, Mutation Score
0.81 with 6 of 32 mutants missed). They qualify how the numbers read.

- **Inline tests are split out.** Rust unit tests live in the source file
  under `#[cfg(test)]`. `experiments/rust_tdd.py` separates every `.rs` file
  into an implementation and a test part. The phase chain, Production LoC,
  Test LoC, the complexity tools and coverage all read the split, so a test
  module never counts as production code.
- **TDD events come from a cargo wrapper**, not a test-framework hook — Cargo
  has none that sees a compile failure. A compile failure is therefore
  recorded, and `Red(c)` is measurable here, unlike on Java. The wrapper forces
  libtest's pretty output, also when the agent passes `-q`: the agent sees test
  names where it asked for dots.
- **A failing test binary stops Cargo from running the later ones.** A red
  event can under-report the suite size when unit and `tests/` tests fail
  together. It does not affect the green judgment, which compares names.
- **Smells come from clippy** with the stack's canonical lint selection,
  enforced on the command line so a loosened `Cargo.toml` is still measured
  against the same gate. clippy has no magic-number lint: `smell_magic_numbers`
  is 0 on this stack, as on Java, and `smell_total` is three terms.
- **Cognitive and McCabe complexity come from rust-code-analysis**, per
  function, closures folded into their enclosing function and not counted as
  units. The tool's last release is from 2023; it was verified to parse the
  2024-edition code these runs produce, but a parse failure on newer syntax
  would surface as null complexity, not as a crash — check for it.
- **Coverage is production lines only.** cargo-llvm-cov reports per file, and
  the lines of an inline test module are executed by definition; they are
  dropped before the percentage is taken. Branch coverage needs a nightly
  toolchain and is not measured.
- **Mutation Score comes from cargo-mutants.** `unviable` mutants (do not
  compile) are excluded; `src/main.rs` is excluded unless it is the only
  production code. cargo-mutants has no coverage notion, so
  `mutants_no_coverage` is null on this stack.

## Primary outcome: code quality

The question this RQ exists to answer is whether EXACT Coding improves code
quality on Rust the way it did on TypeScript, Java and Python. The outcomes
that carry that question are `cognitive_max`, `mccabe_max`,
Code Mass (APP), clippy findings, `cc_longest_function`, `cc_avg_loc_per_function` and Mutation Score — reported with
`mutants_total` and `mutants_survived` whenever the arms differ in code size.

**Correctness is a guard, not a result.** A quality number from a cell that
failed verification is meaningless, because low complexity is what a stub
looks like. Correctness gates every quality comparison and is reported only
when it **breaks** — a cell below the 0.90 gate, or any drop from a perfect
score. A cell at 1.00 is the expected state and gets a line, not a section.

TDD discipline is reported from the phase chain, the only source that reads
the same for a lab workflow and an inline control. Prediction accuracy remains
marker-derived and exists only for the EXACT arms.

Rust clippy values must not be compared numerically with ruff, PMD or
ESLint/SonarJS values; cargo-mutants scores not with mutmut, PIT or Stryker.

## Hypotheses

Each hypothesis is stated as a replication question against the sister RQs,
under the model caveat above.

- **H1 — the guard holds:** every cell stays at or above the 0.90 correctness
  gate, so every quality comparison below is eligible. A breach invalidates
  that cell's quality numbers rather than producing a finding about
  correctness.
- **H2 — complexity and unit-size benefit reproduces:** both EXACT variants
  lower `cognitive_max`, `cc_longest_function` and `cc_avg_loc_per_function` against inline TDD, as they did
  on Java. **This is the load-bearing hypothesis of the RQ.**
- **H3 — Mutation Score ordering reproduces:** the three methods are ordered
  as on Java and Python.
- **H4 — model interaction:** the size or direction of the method effect
  differs between GPT-6 SOL and Opus 5.
- **H5 — workflow overhead:** EXACT Coding uses more time and tokens than
  inline TDD. The overhead is justified only by a correctness or
  product-quality gain.
- **H6 — isolated Refactor effect:** moving only the per-cycle Refactor phase
  to an isolated subagent improves decomposition or complexity relative to
  shared-context EXACT Coding, at further time and token cost.
- **H7 — the compiler as a red gate:** Rust fails to compile on a missing
  function before any assertion runs, so a test-first workflow takes a
  two-step red. If that matters, the witness is a high `Red(c)` share and a
  `red_batch_unmeasurable` above zero in every arm — and an inline control
  that writes code and tests together shows up as `Both` openers and a lower
  `test_first_rate`, not as a correctness difference.

## Interpretation rules

- Never average across models.
- Compare workflows only within the same model/harness bundle.
- Correctness gates code-quality and efficiency trophies. It is a filter on
  eligibility, never a headline.
- Timeouts are outcomes and are not refilled.
- Test count, Test LoC, Production LoC, Code Mass (APP), coverage,
  `refactor_per_cycle` and `green_attempts` have ambiguous direction and
  receive no trophy solely for being lower or higher.
- The inline-TDD arm controls for test-first intent. The measured treatment is
  the additional EXACT Coding structure, not TDD versus one-shot generation.
- The comparison with the sister RQs is a comparison of **directions and
  orderings**, never of absolute values. On the GPT arm it is also confounded
  by the model generation.

## Execution sequence

1. Build the batch images (`docker compose --profile batch --profile
   batch-retry build`) so they carry the Rust toolchain, the analysis tools
   and the cargo launcher.
2. Run one Rust smoke test per workflow port — at minimum
   `exact-ptdd-v1-cc` and `exact-ptdd-v1-pi`.
3. Confirm in `metrics.json`: `stack = "rust-cargo"`, `tests_passing`, external
   verification, `cognitive_max` and `mccabe_max` non-null (otherwise
   rust-code-analysis did not fire), `smell_total` present, and
   `summary_metrics.chain_suite_runs` non-null (otherwise the cargo wrapper
   recorded nothing — check that `rust_tdd.py` is mounted).
4. Read the smoke run's `tdd-report.md`: the chain should contain `Red(c)`
   steps if the agent wrote the test before the function existed.
5. Spot-check a transcript for the agent reading `rust-cargo.md` **before**
   writing the test list.
6. Run `experiments/compute-mutation-score.py` on the smoke run (host needs
   `cargo-mutants@27.1.0`) and confirm it writes `mutation_score`,
   `mutants_total` and `mutants_survived`.
7. Generate the fill plan with `/run-rq RQ-exact-coding-rust` only after the
   smoke tests pass.
8. Aggregate and interpret each model's contrast independently, then
   compare directions against the sister RQs.
