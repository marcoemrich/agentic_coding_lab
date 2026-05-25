# v6.3-audit-bundle — Changes vs v6.2-with-why-cleaned

Derived from `v6.2-with-why-cleaned` by importing the still-missing items from the archived `3.1-orchestration-audit` bundle (see `research/_archive/workflow-dev-v1/3.1-orchestration-audit/findings.md` for the empirical v6.5.1 result).

All edits are content additions (rationale + procedural hardening) and one new opt-in profile file. No mechanism changes (`commands/` stays — v6-line decision, see `research/workflow-dev/workflow-construction.md`).

## Parser markers (MARKERS.md) — verified preserved

- Marker 1 `Skill ∈ {test-list, red, green}` — invocation unchanged in `rules/tdd.md`.
- Marker 2 `Red Phase Complete` — preserved in `commands/red.md` Step 7.
- Marker 3 `(Correct|Incorrect)` prediction lines — format requirement preserved; now reinforced by the Mandatory-Procedure preamble and the "Wrong Predictions Are Data" prohibition on backfilling.
- Marker 4 `experiment-done.txt` / `DONE` — preserved in `rules/tdd-experiment-mode.md`.

## Rationale additions (Klasse 2)

- `agents/refactor.md` Mission item 1 — "MUST attempt at least one refactoring" now cites the measurement-pipeline reason: a missing attempt drops `refactorings_applied` to zero for the cycle.
- `agents/refactor.md` Mission item 6 — "no improvement possible" now has a concrete bar with three paths (name tightening / APP mass drop ≥1 / removable smell). Each path must be addressed before claiming exhaustion. A generic "code is already optimal" is explicitly insufficient.
- `agents/refactor.md` Step 4 — "Make ONE improvement at a time" now cites bisectability: bundling changes destroys the ability to bisect a failing test back to a single change.
- `commands/test-list.md` Step 3 — simple → complex ordering now explains the green-phase generalization pattern (`hardcoded` → `conditional` → `reduce`). Starting with a complex test jumps straight to the general solution and loses the stepwise discipline.

## Short-circuit hardening (Klasse 3, red phase)

- `commands/red.md` gets a **Mandatory Procedure** preamble before Step 1: all seven steps required on every cycle; predictions are the measured signal; wrong predictions are expected output, not a reason to skip.
- `commands/red.md` Steps 3 and 6 — "❌ Prediction wrong → STOP and explain discrepancy" replaced with prose that records the result and proceeds. The previous formulation was a self-defeating short-circuit: an agent under pressure either rationalizes the failure away or rewrites the prediction to match observation, both of which corrupt the metric.
- `commands/red.md` DON'T item — "Continue if prediction fails without explanation" replaced with "Suppress, rewrite, or backfill a wrong prediction after seeing the result". The corruption mode is named explicitly.
- `commands/red.md` `## Prediction Failure Protocol` section replaced by `## Wrong Predictions Are Data`, which forbids backfilling or rewriting after seeing the result.

## New file (opt-in HITL profile)

- `HUMAN-IN-THE-LOOP.md` (workflow root, not in `.claude/rules/`) — describes how to flip the workflow back into a non-autonomous mode where prediction failures (and other unexpected states) escalate to the human supervisor instead of being recorded as data. Lives at the workflow root precisely to avoid auto-load conflict with `tdd-experiment-mode.md`; opt-in via described swap points.

## Explicitly NOT changed

- **Mechanism (`commands/` vs `skills/`)** — v6-line keeps `commands/` per the `research/workflow-dev/workflow-construction.md` rationale and the `skills-vs-commands-decision` memory. The archived audit's "wrong mechanism = silent zero" finding is a historical artifact from an earlier Claude Code version.
- **Four Rules of Simple Design framing in `refactor.md`** — kept (v6.2 inherited from v6.1-with-why). The v6.5.1 reduction to "just APP + naming" was a separate content decision, not an audit finding, and is out of scope here.
- **PEP/emoji text in v6.2-with-why-cleaned** — kept unchanged. RQ-1.1/1.2/1.4 showed those carry correctness signal on claim-office; do not bundle their removal with the audit additions.
- **Test-list scope policy ("cover every spec example")** — kept. The v6.5.1 "base functionality only" framing is a separate content decision tied to the v6.5-lean reduction line, not part of the audit additions.

## Expected effect (per v6.5.1 RQ-audit precedent, n=10)

The archived RQ-audit measured the same four-class bundle against v6.5-lean on `game-of-life-example-mapping × opus-4-7-no-thinking`:

- `tests_passed_immediately`: 1.4 ± 2.27 → **0 ± 0** (Mandatory-Procedure preamble eliminates over-implementation Red-side).
- `refactorings_applied`: 6.9 ± 2.33 → 7.8 ± 0.42 (Refactor rationale + concrete bar; σ drops to one sixth).
- Code-quality outcomes (`code_mass`, `smell_total`, `cc_longest_function`, `cognitive_max`, `mccabe_max`): within 1 σ — no regression; smell-floor mode shifts from 3 to 2.
- Cost: +15 % tokens, +16 % wallclock (rationale + preamble adds net text).
- Correctness: 100 % `tests_passing` / 100 % `verification_pct` (sanity preserved).

v6.3 carries the same additions onto the v6.2-with-why-cleaned baseline. RQ-1.8 (`research/workflow-dev/1.8-audit-bundle-effect-v62/`) measures whether the v6.5.1 → v6.5-lean delta replicates on the v6.3 → v6.2 pair.
