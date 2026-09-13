---
id: RQ-stack-profile-extraction-opus
question: "Can all remaining TypeScript/Vitest-specific instructions be moved from the Opus/Hybrid workflow core, phase commands and refactor agent into its existing stack profile without changing correctness, TDD discipline, refactoring behaviour, code quality or cost?"
factors:
  workflow_x_prompt:
    - {workflow: exact-hybrid-v2-testlist-fix-cc,    prompt: example-mapping}
    - {workflow: exact-hybrid-v2.9-stack-profile-cc, prompt: example-mapping}
  kata_base: [game-of-life, claim-office]
controls:
  model: opus-5-no-thinking
outcomes:
  - verification_pct
  - tests_passing
  - completed_within_budget
  - cycle_count
  - refactorings_applied
  - predictions_correct_rate
  - tests_passed_immediately
  - cc_avg_loc_per_function
  - cc_longest_function
  - cognitive_max
  - mccabe_max
  - smell_total
  - code_mass
  - duration_seconds
  - total_tokens
min_replicates: 5
status: open
---

# Complete Stack-Profile Extraction on the Opus/Hybrid Workflow

## Motivation

`exact-hybrid-v2-testlist-fix-cc` already carries
`.claude/rules/tdd_with_ts_and_vitest.md`, but the separation is incomplete.
Concrete stack semantics also occur in `rules/tdd.md`, all three phase commands,
and `agents/refactor.md`: `it.todo()`, file suffixes, test commands, compiler
messages, scaffolds, and TypeScript code examples.

That duplication prevents another language profile from being substituted without
editing the workflow methodology itself. The candidate
`exact-hybrid-v2.9-stack-profile-cc` moves those details into the profile that
already exists and is already loaded as a Claude Code project rule. It adds no
file, skill, subagent, or context boundary.

The question is behavioural neutrality. RQ-1.19 established that moving prompt
content across files can change refactoring and cost even when the text volume is
nearly unchanged. Complete extraction therefore cannot be treated as a cosmetic
refactor without measurement.

## Controlled change

| Concern | Baseline | Candidate |
|---|---|---|
| Workflow methodology | Hybrid Test-List/Red/Green plus isolated Refactor | unchanged |
| Stack profile boundary | existing auto-loaded rule | unchanged |
| Stack semantics | duplicated across core and profile | concentrated in the existing profile |
| Marker contract | CC markers 1–4 | unchanged |
| Language and framework | TypeScript + Vitest | unchanged |
| Harness and model | Claude Code + `opus-5-no-thinking` | unchanged |

The candidate replaces concrete references in the core with stable roles such as
"inactive-test mechanism", "focused test command", "minimal scaffold", and
"active stack profile". The TypeScript/Vitest realizations and concrete examples
remain available in `tdd_with_ts_and_vitest.md`.

Files intentionally changed:

- `.claude/rules/tdd.md`
- `.claude/commands/test-list.md`
- `.claude/commands/red.md`
- `.claude/commands/green.md`
- `.claude/agents/refactor.md`
- `.claude/rules/tdd_with_ts_and_vitest.md`
- `.claude/rules/tdd-experiment-mode.md` (adds the generic active-profile path to the isolated-subagent handoff)

`settings.json` is inherited byte-identically. Passing the profile path is required because the Refactor phase runs in an isolated context; omitting it would turn extraction into an accidental information deletion rather than a relocation.

## Why two katas

The results are reported separately and never averaged across katas:

- **game-of-life** carries the training-known code-quality and TDD-discipline
  signal.
- **claim-office** carries external correctness and completeness under a long,
  novel specification. This is the required guard against a reduction that looks
  neutral on Game of Life but causes early self-termination on novel code.

## Hypotheses

- **H1 — behavioural neutrality:** concentrating existing stack details in the
  already-loaded profile preserves Correctness (internal), Correctness (external),
  cycle and prediction compliance, and refactoring behaviour.
- **H2 — no quality loss:** code-quality outcomes remain within ordinary replicate
  variation on each kata.
- **H3 — attention redistribution:** if the move is not neutral, the first expected
  witness is a shift in `refactorings_applied` or duration rather than a missing
  marker, following RQ-1.19.
- **H4 — novel-kata guard:** claim-office may reveal completeness loss that the
  saturated Game of Life correctness signal cannot show.

## Interpretation constraints

- A marker failure is an invalid workflow implementation, not evidence for or
  against extraction. Smoke-test all four summary metrics before filling cells.
- `predictions_total ≈ 2 × cycle_count` remains expected on this workflow line.
- Metrics explicitly named by the Refactor brief retain the same Goodhart status in
  both cells; their prompt exposure is not changed by the factor.
- Do not pool or average the two katas. Their scale and evidential role differ.

## Execution provenance — 2026-09-13 refill

At the user's explicit request, three candidate Claim Office runs were deleted
and scheduled for replacement after fixing dependency installation under
`NODE_ENV=production` (`pnpm install --prod=false`, fail-fast on install errors):

- `2026-09-12_23-45-17_claim-office-example-mapping_exact-hybrid-v2.9-stack-profile-cc_opus-5-no-thinking`: stopped after the test list, 101 seconds.
- `2026-09-13_00-12-05_claim-office-example-mapping_exact-hybrid-v2.9-stack-profile-cc_opus-5-no-thinking`: stopped after the test list, 123 seconds.
- `2026-09-13_00-15-34_claim-office-example-mapping_exact-hybrid-v2.9-stack-profile-cc_opus-5-no-thinking`: timeout at 7200 seconds.

All three had `verification_pct = 0`. The two early stops had repaired their
toolchain before stopping; the dependency fault is not established as the cause
of either early termination or the timeout. Retaining successful runs while
replacing these failures is outcome-dependent selection, not an unbiased
replication. The resulting aggregate must be labelled exploratory and must not
be presented as the original batch's success rate or proof of behavioural
neutrality. A clean comparison requires fresh runs of both arms under the same
image and harness version. The original candidate Claim Office batch had mean
`verification_pct = 0.38666`, internal test success 3/5, and 1/5 timeouts.

## Execution sequence

1. Audit that stack-specific references outside the profile are absent while all
   four parser markers remain intact.
2. Run one Game of Life smoke test for the candidate.
3. Check `cycle_count`, `refactorings_applied`, `predictions_correct`,
   `predictions_total`, and `tests_passing` from the merged summary/final metrics.
4. Fill the query to `min_replicates` through `/run-rq RQ-stack-profile-extraction-opus`.
5. Spot-check profile use and phase transitions in transcripts before aggregation.
