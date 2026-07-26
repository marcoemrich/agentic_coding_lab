---
id: RQ-pocock-vs-v62
question: "How does the external Matt Pocock TDD skill (v9-pocock-tdd: single skill, inline phases, tail refactor) perform on claim-office-example-mapping against the internal default baseline v6.2-with-why-cleaned (multi-command + refactor subagent, per-cycle refactor) — on correctness, code quality, TDD discipline and cost?"
factors:
  workflow_x_prompt:
    - {workflow: v6.2-with-why-cleaned, prompt: example-mapping}  # internal default baseline (RQ-1.6 / RQ-1.9 pool)
    - {workflow: v9-pocock-tdd,         prompt: example-mapping}  # external Pocock baseline (skills.sh/mattpocock)
controls:
  model: opus-4-7-portkey-no-thinking
  kata_base: claim-office
outcomes:
  # primary: correctness (claim-office is the correctness kata)
  - verification_pct
  - tests_passing
  - completed_within_budget
  # TDD discipline (per-cycle refactor vs tail refactor is the architectural difference)
  - refactorings_applied
  - tests_passed_immediately
  - predictions_correct_rate
  - cycle_count
  # code quality (Pocock focuses on "deep modules" / "small interfaces" — an interesting counterpart to APP mass awareness in v6.2)
  - code_mass
  - smell_total
  - cc_longest_function
  - cognitive_max
  - mccabe_max
  # cost
  - duration_seconds
  - total_tokens
min_replicates: 3
status: aktiv
---

# RQ-4.4: v9-pocock-tdd vs v6.2-with-why-cleaned (claim-office)

How does the external Pocock TDD skill perform on claim-office-example-mapping × opus-4-7-portkey-no-thinking against the internal v6.2 default baseline?

Related: [RQ-4.1](../4.1-tdd-effect-code-quality/) compares v1–v8 across the whole TDD workflow ladder. This RQ is the focused follow-up question: external vs internal baseline on the correctness kata.

## Motivation

The internal v6.x line emerged from ~20 iterations of v3–v6 reduction and audit-bundle work. It operates with separate phase commands (`/red`, `/green`) plus a refactor subagent per cycle. This is optimized for the marker pipeline and the kata-specific peculiarities of this framework.

[Matt Pocock's TDD skill](https://www.skills.sh/mattpocock/skills/tdd) is an externally developed workflow, not yet considered here, with a different architecture:

- **A single skill** instead of several commands — all phases run inline.
- **Tail refactor** instead of per-cycle refactor — refactoring only at the end, when all tests are green.
- **HITL planning** in the original (user approval before the tracer bullet) — replaced for our batch by the thesis "example mapping IS the plan approval", see `v9-pocock-tdd/.claude/skills/tdd/SKILL.md`.
- **"Deep modules / small interfaces"** as an explicit design principle from *A Philosophy of Software Design*.

The RQ delivers the first measurement against an external baseline outside our own workflow evolution. It also implicitly tests an architecture question:

> Per-cycle refactor (v6.2) vs tail refactor (Pocock): does that make a difference on a multi-iteration kata like claim-office?

## Pocock Skill: Adaptations Compared to the Original

For the skill to run in our batch setup, three minimally invasive changes to `SKILL.md` are necessary (all documented in `experiments/workflows/v9-pocock-tdd/.claude/skills/tdd/SKILL.md`):

1. **Planning approval block** replaced by: "example mapping IS the approval, proceed without further questions".
2. **RED reporting block** inserted as a verbatim obligation (`Red Phase Complete` + two prediction lines) — otherwise cycle_count and predictions_* become invisible to the pipeline (see `experiments/workflows/MARKERS.md`).
3. **DONE marker** added: `experiment-done.txt` with `DONE` at the end, otherwise a container timeout.

Sub-files (`tests.md`, `mocking.md`, `refactoring.md`, `interface-design.md`, `deep-modules.md`) are 1:1 from the original.

## Smoke Finding (preliminary, n=1, opus-4-7-portkey WITH thinking)

Run `2026-05-25_20-22-06_claim-office-example-mapping_v9-pocock-tdd_opus-4-7-portkey`:

- `verification_pct = 1.00` (15/15)
- `tests_passing = true`, 36 tests
- `cycle_count = 12`, `predictions_correct_rate = 1.00` (40/40)
- `refactorings_applied = 0` (tail refactor: the model saw no need)
- `cognitive_max = 7`, `mccabe_max = 7`, LOC 182, code_mass 631
- Wallclock 589s, ~12.2 M tokens

The RQ measurement is carried out with `no-thinking` in order to be able to reuse the existing v6.2 runs from RQ-1.9 as a comparison pool.

## Hypotheses

- **H1 (correctness, Pocock sanity)** — Pocock reaches ≥ 80 % `verification_pct` on average. A weaker cut-off than for v6.2 (≥ 95 % expected), because Pocock is not optimized for our kata and the tail refactor potentially lingers longer in an unstable state. Falsifier: Pocock below 60 % → the skill is not batch-suitable on no-thinking.
- **H2 (correctness, equivalent)** — Pocock and v6.2 reach similar `verification_pct` (spread < 5 pp) despite the different architecture. If that holds: claim-office-example-mapping does not under-specify; both workflows find the same correctness space.
- **H3 (refactorings asymmetry)** — `refactorings_applied` is significantly lower for Pocock than for v6.2. The smoke showed 0 vs an RQ-1.6 v6.2 mean of ≈ 4–6. Expected: Pocock < 2, v6.2 > 3.
- **H4 (code quality)** — Pocock's "deep modules" + "minimal code" + tail refactor produces similar or slightly better code quality (`cognitive_max`, `mccabe_max`, `code_mass`) than v6.2's per-cycle refactor. The single smoke showed `cognitive_max=7` — very good. Hypothesis: per-cycle refactor is not strictly necessary for good code quality if the initial design aims at "deep modules".
- **H5 (discipline)** — `cycle_count` similar (~10–14); `predictions_correct_rate` similar (~0.9–1.0). Both have explicit prediction blocks.
- **H6 (cost)** — Pocock needs less wallclock and fewer tokens than v6.2, because a single skill has less phase overhead than skill hopping + subagent spawning. Expected: Pocock −20 % wallclock, −15 % tokens. Smoke (with thinking): 589s; the v6.2 no-thinking comparison pool from RQ-1.9 should be at a similar level.

## Design

```
Factor:    workflow_x_prompt — 2 levels, both example-mapping
Control:   model            — opus-4-7-portkey-no-thinking
Control:   kata_base        — claim-office

Cells:      2 (2 workflows × 1 kata)
Replicates: n = 3 per cell (min_replicates)
Runs:       3 new Pocock runs + reuse of v6.2 from the RQ-1.9 pool (8 available)
```

**A replicate count of n=3** is deliberately small as a first approximation to the external baseline. If the comparison is ambiguous or the direction of the effect is interesting: top up to n=8 later (matching the RQ-1.9 standard for claim-office).

**Wallclock expectation** for Pocock × no-thinking: ~5–8 min/run (single shard), 3 runs ≈ 20–25 min. The v6.2 runs are already available.

**Sharding:** single shard for the new Pocock runs (3 runs do not warrant sharding).

## Caveats

- **n=3 is small** — memory note `replicates-n-reliability`: n=3 is usually not enough for a ranking (15–62 % correct according to RQ-stability/F-stability.3). This RQ is explicitly a first approximation; extend to n=8 if the finding is interesting.
- **Pocock × no-thinking not smoke-tested** — the successful smoke ran with thinking. If the 3 no-thinking runs look considerably different, check the marker pickup sanity (red block, DONE file) first before findings are written.
- **The tail refactor is a workflow property, not a bug** — `refactorings_applied = 0` for Pocock is normal when the code is already clean after all tests. This is NOT to be confused with the v6.x refactor-skipping pathology from the RQ-1.x reduction branch (there a refactor was foreseen per cycle and was occasionally omitted). Interpret the `refactorings_applied` comparison **with caution** for this reason: with Pocock, 0 is expected; with v6.2, 0 is a warning sign.
- **The Pocock skill is adapted, not 1:1 the original** — the HITL approval bullets and the marker phrases have been added. This is methodologically more honest than "run Pocock without markers and then measure 0 cycles", but it is not a perfect authenticity comparison. Diff: see `experiments/workflows/v9-pocock-tdd/.claude/skills/tdd/SKILL.md` vs `https://raw.githubusercontent.com/mattpocock/skills/main/skills/engineering/tdd/SKILL.md`.
- **The skill mechanics differ from the v6.x setup** — v6.x uses `.claude/commands/`, v9-pocock-tdd uses `.claude/skills/`. Both are discovered by the Claude Code Skill tool (cf. memory `skills-vs-commands-decision`), but the discovery paths differ. In the smoke, skill discovery worked (Skill tool-use count = 1 at the beginning); if it is unclear in no-thinking runs: check the transcript.

## Findings

See [findings.md](findings.md) (follows after the batch run).

## Data Source

All runs in `experiments/runs/` with
`workflow ∈ {v6.2-with-why-cleaned, v9-pocock-tdd}`,
`kata = claim-office-example-mapping`,
`model = opus-4-7-portkey-no-thinking`.

The v6.2 pool from RQ-1.9 is reusable (8 runs); 3 new Pocock runs are needed.

## Sources

- Pocock skill original: <https://www.skills.sh/mattpocock/skills/tdd>, source <https://github.com/mattpocock/skills/tree/main/skills/engineering/tdd>
- Smoke run: `experiments/runs/2026-05-25_20-22-06_claim-office-example-mapping_v9-pocock-tdd_opus-4-7-portkey/`
- v6.2 baseline precedent: [RQ-1.6](../../workflow-dev/1.6-v62-cleanup-validation-v61-with-why/findings.md)
- v6.2 on claim-office: [RQ-1.9](../../workflow-dev/1.9-audit-bundle-validation-claim-office/findings.md)
- Workflow marker requirements: `experiments/workflows/MARKERS.md`
- Pocock workflow adaptations: `experiments/workflows/v9-pocock-tdd/.claude/skills/tdd/SKILL.md` + `.claude/rules/tdd-experiment-mode.md`
