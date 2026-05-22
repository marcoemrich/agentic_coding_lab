# v6.5.1 — Changes vs v6.5-lean

Derived from `v6.5-lean` after a full audit against the
`claude_orchestration` toolkit rules (see `AUDIT.md` for
finding-by-finding detail). No behavioral changes intended;
all edits are mechanism alignment, terminology, rationale,
or short-circuit hardening.

## Parser markers (MARKERS.md) — verified preserved

- Marker 1 `Skill ∈ {test-list, red, green}` — Skill
  files now under `.claude/skills/<name>/SKILL.md` with
  correct `name:` frontmatter (was: `commands/` —
  unreachable by the `Skill` tool).
- Marker 2 `Red Phase Complete` — preserved in
  `skills/red/SKILL.md`.
- Marker 3 `(Correct|Incorrect)` prediction lines —
  format requirement and rationale preserved in
  Step 7.
- Marker 4 `experiment-done.txt` / `DONE` — preserved
  in `rules/tdd-experiment-mode.md`.

`refactor` continues to run as a Task subagent (same as
v6.5-lean), not a Skill.

## Mechanism alignment

- **commands/ → skills/** — `test-list`, `red`, `green`
  moved to `.claude/skills/<name>/SKILL.md` with YAML
  frontmatter (`name`, `description`). `Skill({skill:…})`
  could not have located them under `commands/`; on
  v6.5-lean the `cycle_count` / `predictions_correct_rate`
  / `refactorings_applied` metrics would have silently
  dropped to zero.

## Consistency

- `pnpm test:unit:basic` → `pnpm test` in `skills/red/`
  (matches `tdd.md` and the tech-stack rule).
- `tdd_with_ts_and_vitest.md` → `tdd-with-ts-and-vitest.md`
  (hyphen naming convention used by every other rule).
- `tdd-experiment-mode.md` — "Launch refactor Task
  subagent" → "Launch the refactor subagent via the Task
  tool" (terminology).
- `settings.json` — removed `Bash(pnpm test:*)`,
  `Bash(pnpm install:*)`, `Bash(pnpm run:*)` (all
  already covered by `Bash(pnpm:*)`).

## Agent decoupling

- `agents/refactor.md` — removed TDD-pipeline coupling
  (description, "After Green phase", "Proceeding to the
  next test", "Skipping refactoring phase"). The agent
  now defines role and capability only; the TDD
  sequence lives in `tdd.md`. "Build and Tests" section
  dropped — covered by `tdd-with-ts-and-vitest.md`.

## Rationale additions

- `refactor.md` "MUST attempt at least one refactoring"
  now cites the measurement-pipeline reason.
- `refactor.md` "Make ONE improvement at a time" now
  cites bisectability.
- `test-list` Step 3 (simple → complex) now explains
  the green-phase generalization pattern.

## Short-circuit hardening (red phase)

- `skills/red/SKILL.md` gets a **Mandatory Procedure**
  preamble before Step 1: all seven steps required;
  predictions are the measured signal; wrong predictions
  are expected output, not a reason to skip.
- Steps 3 and 6 no longer carry "STOP and explain
  discrepancy". Wrong predictions are data, not blockers.
- `## Prediction Failure Protocol` replaced by
  `## Wrong Predictions Are Data`, which forbids
  backfilling or rewriting a prediction after seeing
  the result.

## Reframings

- `tdd-experiment-mode.md` no longer claims to "override
  HITL requirements" (no HITL workflow exists). Reframed
  as a positive statement of the autonomous default,
  with the measurement-pipeline rationale (uninterrupted
  Skill/Task call sequences per cycle).
- `refactor.md` "improvement possible" now has a concrete
  bar (name tightening / APP mass ≥1 / removable smell).
  Each path must be addressed before claiming exhaustion.

## Explicitly NOT changed

- Refactor remains a Task subagent (not migrated to
  Skill) — same as v6.5-lean.
- No new files added (no lead `CLAUDE.md`, no
  per-feature gate, no PostToolUse hooks).
- "Important Guidelines" / "Remember" / "DO / DON'T"
  bullet lists in `refactor.md` and `red/SKILL.md`
  kept verbatim — to be evaluated as an isolated
  experiment later.
- Handoff-coverage gaps (Finding 11) deferred — the
  proposed fixes (refactor-prompt extension for
  green over-implementation flagging; gated
  `experiment-done.txt` write) need an experiment run
  to validate before introducing them.
