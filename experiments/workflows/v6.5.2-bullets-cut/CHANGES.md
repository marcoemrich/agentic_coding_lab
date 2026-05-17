# v6.5.2-bullets-cut — Changes vs v6.5.1-orchestration-audited

Derived from `v6.5.1-orchestration-audited` by removing
three redundant bullet-list blocks identified in
`AUDIT.md` Finding 10 (behavior-preserving cuts). No
other changes.

## Parser markers (MARKERS.md) — verified preserved

- Marker 1 `Skill ∈ {test-list, red, green}` — unchanged
- Marker 2 `Red Phase Complete` — unchanged
- Marker 3 `(Correct|Incorrect)` prediction lines — unchanged
- Marker 4 `experiment-done.txt` / `DONE` — unchanged

## Cuts

- **`refactor.md` "Remember" section** (−8 lines) — pure
  echo of Mission/Important Guidelines; all bullets
  ("Mandatory refactoring attempt", "Naming first",
  "Tests stay green", "Document everything") restate
  content already present in earlier sections.
- **`refactor.md` "Important Guidelines" DO/DON'T**
  (−16 lines) — every DO bullet maps to a Mission item
  or a Process step; every DON'T bullet inverts an
  existing rule (Refactoring Rules, Process Step 3,
  Mission item 5).
- **`red/SKILL.md` "Important Guidelines" DO/DON'T**
  (−14 lines) — every DO bullet duplicates Red Phase
  Rules or the Mission; every DON'T bullet is covered
  by the Mandatory Procedure preamble plus the "Wrong
  Predictions Are Data" section.

Net: `refactor.md` 270 → 245 lines, `red/SKILL.md`
173 → 159 lines.

## Explicitly NOT changed

Everything else from v6.5.1-orchestration-audited
remains identical: skills layout, frontmatter,
Mandatory Procedure preamble, Wrong Predictions Are
Data section, settings.json, refactor.md decoupling,
rationale additions, terminology.

## Hypothesis

The cut bullet lists are pure verbatim duplicates of
content present elsewhere — by the behavior-preserving-
cuts rule they should not change agent behavior. If the
TDD-discipline metrics from RQ-14 hold (refactorings_applied
~7.8, tests_passed_immediately ~0, smell_total ~2.0,
predictions_correct_rate ~99 %) the bullets were
decorative and the cut is a net win on token cost. If
they regress, the bullets functioned as pattern-match
anchors and the cut was harmful.
