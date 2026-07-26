---
id: RQ-tdd-quality
question: "How does the workflow structure (from oneshot through iterative to strict TDD with subagents) affect code quality, and does TDD strictness make a difference?"
factors:
  workflow_x_prompt:
    # TDD axis
    - {workflow: v1-oneshot,             prompt: prose}
    - {workflow: v2-iterative,           prompt: prose}
    - {workflow: v3-basic-tdd,           prompt: example-mapping}
    - {workflow: v4.1-testlist-scope-fix, prompt: example-mapping}
    - {workflow: v5.1-testlist-scope-fix, prompt: example-mapping}
    - {workflow: v6.1-hybrid-testlist-scope-fix, prompt: example-mapping}
    # non-TDD control group: vibe-coding + tests + single end refactoring
    - {workflow: v8a-delayed-refactor-agent,  prompt: example-mapping}
    - {workflow: v8b-delayed-refactor-native, prompt: example-mapping}
  kata_base: [game-of-life, claim-office]
controls:
  model:
    any:                            # OR-match: new runs via Portkey (priority 1), reuse existing direct runs
      - opus-4-7-portkey-no-thinking
      - opus-4-7-no-thinking
outcomes:
  # primary: code quality
  - code_mass
  - smell_total
  - cc_longest_function
  - cc_loc
  - mccabe_max
  - cognitive_max
  # test strength: operationalizes the core hypothesis of whether TDD workflows
  # produce more substantial tests than post-hoc tests (v1/v2). Computed only
  # for green runs; with v1/v2 therefore often only partial coverage.
  - mutation_score
  # secondary: correctness (internal + external)
  - tests_passing
  - verification_pct
  - verification_passed
  - verification_total
  - completed_within_budget
  # TDD discipline (meaningful only for v3/v4.1/v5.1/v6.1)
  - tdd_cycles
  - refactorings
  - prediction_accuracy
  - tests_immediately_passing
  # context
  - duration_seconds
  - total_tokens
min_replicates: 5
status: aktiv
---

# RQ-tdd-quality: Workflow Effect on Code Quality

How do code quality, correctness and TDD discipline change along the workflow range from "vibe-coding without TDD" (v1) through an iterative approach (v2), minimal TDD (v3), up to strictly phase-isolated TDD with subagents (v4.1) and strictly phase-structured TDD in a single context (v5.1) — and how does this pattern change between a training-known kata (game-of-life) and a novel kata with ambiguities (claim-office)?

## Motivation

The workflow variant is the central "lever" variable of the lab setup — we have five variants with different TDD strictness and phase structure, but so far no controlled model-pinned measurement of their effect on code quality *on the now complete metric basis* (Code Mass, smells, McCabe, cognitive, plus external correctness via the module-import adapter from RQ-model-quality).

Open in particular:

1. **Does TDD make a difference at all?** (v1+v2 vs v3+v4.1+v5.1+v6.1)
2. **Does strictness make a difference?** (v3 minimal vs v4.1/v5.1 strict)
3. **Phase isolation vs shared context?** (v4.1 vs v5.1)
4. **Is a single end refactoring after vibe-coding sufficient?** (v8a/v8b as a non-TDD control group vs v3/v4.1/v5.1/v6.1)
5. **Do the workflow effects hold across kata complexity?** (game-of-life vs claim-office) — game-of-life is training-known and the model starts with a good memorized solution; claim-office is novel with ambiguities and forces the actual construction of a solution. Workflow effects can be kata-dependent (cf. the RQ-context kata inversion).

## Non-TDD Control Group (v8a, v8b)

v8a and v8b are not TDD workflows but three-phase controls for the question "is periodic refactoring in the TDD cycle really more valuable than vibe-coding + tests + a single end refactoring?":

- **v8a-delayed-refactor-agent** — Phase 1: implementation without tests. Phase 2: test suite against `prompt.md` (with the "Cover every spec example" obligation, same as the test-list-scope-fix). Phase 3: a single refactor via subagent (`refactor.md` identical in content to v6.1/v7.1 — Four Rules of Simple Design + APP + naming + mandatory attempt).
- **v8b-delayed-refactor-native** — identical to v8a in phases 1+2 **and in the content of phase 3** (Four Rules + APP + naming + mandatory attempt), but phase 3 is executed via the slash command `/refactor` (`.claude/commands/refactor.md`) **inline in the main session context** instead of being spawned as a fresh subagent. Structurally symmetric to v8a (`.claude/agents/refactor.md`): both workflows externalize the refactor spec into a separate file, the only difference being the delivery mechanism (agent spawn vs command invocation). v8a vs v8b thereby isolates the **subagent mechanism** (fresh specialist context vs slash command in the same context) at otherwise identical refactor content and identical timing.

The TDD discipline metrics (`tdd_cycles`, `refactorings`, `prediction_accuracy`, `tests_immediately_passing`) are **null by design** in the v8 arms — they lie outside the comparison. The outcome comparison against the TDD arms runs exclusively via code quality (`cognitive_max`, `mccabe_max`, `smell_total`, `cc_longest_function`, `code_mass`), test strength (`mutation_score`), correctness and cost.

## Model and Kata Choice

| Variable | Value | Rationale |
|---|---|---|
| Model | `opus-4-7-no-thinking` (Portkey OR direct, OR-match) | Most recent Opus version. New fill runs go via Portkey (priority 1), existing direct runs are reused; both routes count as one cell (see caveat b). RQ-model-quality shows: Opus models differentiate only marginally in code quality, the thinking effect is model-individual; a single model pin isolates the workflow effect cleanly. Workflow × model interaction remains a later RQ. |
| Kata | `game-of-life` (library form, no CLI) **and** `claim-office` (CLI) | game-of-life delivers code quality without CLI overhead; claim-office is novel with ambiguities and tests whether workflow effects hold across kata complexity (cf. the RQ-context kata inversion). |
| Prompt pairing | v1/v2 → prose, v3/v4.1/v5.1 → example-mapping | Methodology constraint: examples in v1/v2 could incite the agent toward test-first behavior and thereby contaminate the non-TDD comparison. RQ-prompt-known-kata has additionally shown that on training-known katas the prompt style has no consistent quality effect — the asymmetry should not distort the result. |

## Design

```
Factor:    workflow_x_prompt  — 8 levels (TDD axis: v1+prose, v2+prose,
                                          v3+EM, v4.1+EM, v5.1+EM, v6.1+EM
                                          non-TDD control: v8a+EM, v8b+EM)
Factor:    kata_base          — 2 levels (game-of-life, claim-office)
Control:   model              — opus-4-7-no-thinking (Portkey OR direct, OR-match, see caveat b)

Cells:      16  (8 workflow_x_prompt × 2 kata_base)
Replicates: n = 5
Runs:       80 total
```

> **Aggregation separated per kata**: There is **never any averaging across katas** —
> game-of-life (~40 LoC solution) and claim-office (~280 LoC solution) are
> not comparable; a cross-kata mean would smear the signal.
> `aggregate-by-query.py` delivers per-kata pivots; the overview in
> `findings.md` contains two tables, one per kata.

## Hypotheses

- **H1 (TDD effect present)**: v3/v4.1/v5.1 show lower `cognitive_max`, `mccabe_max`, `smell_total` than v1/v2 — TDD disciplines function size and complexity, because each test makes an incremental design specification.
- **H2 (strictness improves further)**: v4.1/v5.1 (phase-structured) deliver stricter code quality than v3 (minimal TDD). In particular v4.1 (phase-isolated subagents) produces the shortest functions (`cc_longest_function`), because each green phase runs isolated in a fresh context and has no incentive to over-implement.
- **H3 (v4.1 vs v5.1 differ)**: v4.1 vs v5.1 show different discipline patterns — v4.1 has higher `prediction_accuracy` (the fresh context forces an explicit state description), v5.1 has higher `refactorings` (the shared context allows opportunistic cleanup).
- **H4 (external correctness independent of the workflow)**: `verification_pct` is at 1.00 for all cells — the representation effect from F-model-quality.5 is model-driven (Opus = tuple), not workflow-driven. Falsification: a workflow systematically produces different representations.
- **H5 (the periodicity of refactoring matters)**: v3/v4.1/v5.1/v6.1 (periodic refactor per cycle) show lower `cognitive_max`/`mccabe_max` and a higher `mutation_score` than v8a/v8b (a single end refactoring after vibe-coding). Falsification: v8a/v8b lie within 1 σ of the TDD arms — then the TDD advantage is not the periodicity, but either the test-first pressure (against v1/v2) or not present at all.
- **H6 (subagent delivery matters independently of the content)**: v8a (refactor content in a fresh subagent context) dominates v8b (identical refactor content inline in the main context) on code quality — the fresh specialist context relieves the refactor of phase-1/2 anchoring bias. Falsification: v8a ≈ v8b — at identical refactor content the subagent mechanism contributes nothing, the content alone suffices.

**Falsification of H1** (code quality between v1/v2 and v3/v4.1/v5.1/v6.1 overlaps completely or is reversed): TDD does not discipline code quality in this setup — a consequence for all subsequent TDD variant comparisons, because the TDD variant would then no longer be a dominant factor.

**Falsification of H2** (v3 ≈ v4.1 ≈ v5.1 in quality): TDD strictness carries no measurable advantage — minimal TDD suffices.

## Caveats

- **(a) Single workflow point per cell**: Each workflow only once — no "workflow × sub-variant" differentiation (e.g. v4.1 with/without explicit skill definitions).
- **(b) Single model, mixed routing**: Only `opus-4-7-no-thinking`, but `controls.model` is an OR list `[opus-4-7-portkey-no-thinking, opus-4-7-no-thinking]`. New fill runs go via Portkey (priority 1), existing direct runs continue to be used; both routes count as one cell. Assumption: routing has no effect on code quality (same model weights, same sampling parameters); on `duration_seconds`/`completed_within_budget` it possibly does (Portkey retry/timeout characteristics). If pivots show a strong routing-related spread, group by `model` instead of `cell_model`. Workflow effects could moreover look different on weaker models (cf. the RQ-model-quality Sonnet representation problem).
- **(c) Two katas**: game-of-life (library form, training-known) and claim-office (CLI, novel with ambiguities). mars-rover remains open.
- **(d) Prompt asymmetry**: v1/v2 use `prose`, v3/v4.1/v5.1/v6.1/v8a/v8b use `example-mapping`. A methodology constraint; a hypothetical prompt effect on game-of-life is not to be expected according to RQ-prompt-known-kata, but cannot be entirely excluded.
- **(f) v8 on example-mapping is not pure vibe-coding**: The example list in the prompt is in fact an implicit test spec. v8a/v8b can read it in phase 1 and convert it into tests in phase 2. This slightly distorts the "vibe-coding vs TDD" axis in favor of v8, but is acceptable for the **refactor-timing axis** (H5): all arms receive identical spec structuring; the only variable is *when* refactoring happens (periodically after each cycle vs once at the end). v1+prose / v2+prose remain the *prompt-pure* non-TDD reference level.
- **(e) External correctness via the tuple adapter**: `verification_pct` presupposes the `[number, number][]` representation (see RQ-model-quality F-model-quality.5). With opus-4-7-no-thinking the tuple choice was present in 3/4 runs in RQ-model-quality, 1/4 used objects. Individual cells may therefore land below 100 % for this reason — see H4.

## Findings

See [findings.md](findings.md).

## Data Source

All runs in `experiments/runs/` with
`workflow ∈ {v1-oneshot, v2-iterative, v3-basic-tdd, v4.1-testlist-scope-fix, v5.1-testlist-scope-fix, v6.1-hybrid-testlist-scope-fix, v8a-delayed-refactor-agent, v8b-delayed-refactor-native}`,
`kata ∈ {game-of-life-prose, game-of-life-example-mapping, claim-office-prose, claim-office-example-mapping}` (each according to the workflow constraint: v1/v2 → prose, v3+ → example-mapping),
`model ∈ {opus-4-7-portkey-no-thinking, opus-4-7-no-thinking}` (OR-match, see caveat b).
