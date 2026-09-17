---
id: RQ-v62-cleanup-validation-v61-with-why
question: "Do the three v6.5.1 audit cleanups (consistency, refactor.md decoupling, tdd-experiment-mode reframing) — applied to exact-hybrid-v3-with-why-cc — measurably change workflow behaviour on claim-office, or is exact-hybrid-v4-cleaned-cc a behaviourally equivalent hygiene variant of the new default baseline?"
factors:
  workflow_x_prompt:
    - {workflow: exact-hybrid-v3-with-why-cc,             prompt: example-mapping}  # baseline (with why blocks from RQ-1.5)
    - {workflow: exact-hybrid-v4-cleaned-cc,     prompt: example-mapping}  # + cleanup 2/3/6 from the v6.5.1 audit
controls:
  model: opus-4-7-portkey-no-thinking
  kata_base: claim-office
outcomes:
  # primary: correctness (claim-office with genuine ambiguities)
  - verification_pct
  - tests_passing
  - completed_within_budget
  # TDD discipline (should stay unchanged — cleanups are no-behavior-change-intended)
  - predictions_correct_rate
  - refactorings_applied
  - tests_passed_immediately
  - cycle_count
  # code quality
  - code_mass
  - smell_total
  - cc_longest_function
  - cognitive_max
  - mccabe_max
  # cost
  - duration_seconds
  - total_tokens
min_replicates: 8
status: aktiv
---

# RQ-v62-cleanup-validation: exact-hybrid-v4-cleaned-cc vs exact-hybrid-v3-with-why-cc (claim-office)

Do the three cleanups from the archived v6.5.1 blueprint audit — when applied to exact-hybrid-v3-with-why-cc (the RQ-1.5 winner) — measurably change workflow behaviour, or is `exact-hybrid-v4-cleaned-cc` a safe hygiene variant that can serve as the new default baseline?

## Motivation

RQ-1.5 established `exact-hybrid-v3-with-why-cc` as the default recommendation (correctness invariant to the baseline, considerably better code quality and tighter spread). The v6.5.1 blueprint audit from the archive proposed five cleanup classes; three of them are pure cosmetics/hygiene:

1. **Consistency**: `pnpm test:unit:basic` → `pnpm test`, rule file hyphen convention, permission deduplication in `settings.json`.
2. **refactor.md decoupling**: TDD pipeline coupling (`description`, "After Green phase", "Proceeding to the next test", "Skipping refactoring phase") removed; role-neutral wording.
3. **tdd-experiment-mode.md reframing**: phantom HITL override out, positive statement of the autonomous default + measurement pipeline rationale.

The other two cleanups (rationale additions, short-circuit hardening) are semantic and deliberately excluded. The v6.5.1 skill migration lever is also dropped — memory `skills-vs-commands-decision` documents that `commands/` works with the Skill tool.

**Expectation (null hypothesis):** exact-hybrid-v4-cleaned-cc behaves like exact-hybrid-v3-with-why-cc. Cleanups are no-behavior-change-intended.

**Risk:** the memory note `v6.5-correctness-setback` warns against exactly this approach — an earlier skill-creator-driven cleanup wave (v6.5-lean) removed MUSTs and destroyed correctness. This RQ is the safety check that the 3 cleanups applied now do not cause the same damage.

## Workflow definition

`exact-hybrid-v4-cleaned-cc` lives under `experiments/workflows/exact-coding/opus/exact-hybrid-v4-cleaned-cc/` and differs from `exact-hybrid-v3-with-why-cc` only along the three axes named above:

| File | Change |
|---|---|
| `commands/red.md` l.54,85 | `pnpm test:unit:basic` → `pnpm test` |
| `commands/green.md` l.68 | `pnpm test:unit:basic` → `pnpm test` |
| `rules/tdd_with_ts_and_vitest.md` → `rules/tdd-with-ts-and-vitest.md` | hyphen convention; reference in `tdd.md` l.116 adjusted |
| `settings.json` | `Bash(pnpm test:*)`, `Bash(pnpm install:*)`, `Bash(pnpm run:*)` removed (redundant with `Bash(pnpm:*)`) |
| `agents/refactor.md` | description, mission, "Build and Tests" section role-neutral; completion report without "Proceeding to the next test"; red flag "Never skip refactoring phase" → "Never return without attempting at least one improvement" |
| `rules/tdd-experiment-mode.md` | title "TDD Autonomous Execution"; HITL override section replaced by a positive autonomy statement; "Launch refactor Task subagent" → "Launch the refactor subagent via the Task tool"; "EXPERIMENT MODE:" marker removed from the subagent template |

All MUSTs, why blocks and all four MARKERS.md markers stay **fully intact**. Diff for verification:
```
diff -r experiments/workflows/exact-coding/opus/exact-hybrid-v3-with-why-cc experiments/workflows/exact-coding/opus/exact-hybrid-v4-cleaned-cc
```

## Hypotheses

- **H0** (expectation) — exact-hybrid-v4-cleaned-cc is statistically indistinguishable from exact-hybrid-v3-with-why-cc on `verification_pct`, `cycle_count`, `refactorings_applied`, `predictions_correct_rate`. Cleanups are no-behavior-change.
- **H1** (correctness break) — hybrid-v4 shows a correctness regression on claim-office (verification_pct mean lower by >=5 pp or a high outlier rate). One of the three cleanup axes was behaviour-relevant after all. Consequence: retest the cleanup axes individually, revert the worst suspect (tdd-experiment-mode.md).
- **H2** (discipline drift) — hybrid-v4 shows changed TDD discipline (refactorings, cycles, predictions) with stable correctness. Cleanups are subtly behaviour-changing. Consequence: document it, but hybrid-v4 presumably still acceptable as the default.

## Data state

n=8 clean runs per workflow:
- `exact-hybrid-v3-with-why-cc` (n=8) — taken from RQ-1.5
- `exact-hybrid-v4-cleaned-cc` (n=8) — newly collected 2026-05-24/25 after applying the cleanups

**Caveat outlier**: one `exact-hybrid-v3-with-why-cc` run (`2026-05-24_00-08-47`) shows cycles=0 + verification=0.27 — a symptom of the nudge transcript overwrite bug (see memory `nudge-transcript-overwrite-bug`, before the 2026-05-24 fix). All 8 `hybrid-v4` runs were produced after the fix and show end_turn=1. Filtering on `end_turn==0` leaves exact-hybrid-v3-with-why-cc n=7, hybrid-v4 n=8. findings.md addresses both views.

**Caveat routing**: all 16 runs are Portkey-routed with Opus 4.7 no-thinking; the 3-shard cut losses that occurred in the meantime (memory `portkey-shards-external-cut-risk`) are excluded by the `end_turn==1` filter.
