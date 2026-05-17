# v6.5.3-targeted-cuts — Changes vs v6.5.1-orchestration-audited

Derived from `v6.5.1-orchestration-audited`. Applies two
of the three Finding 10 cuts (the structurally larger
DO/DON'T blocks) and **keeps** the third ("Remember"
section) as a Floor-Anker candidate.

Motivation: RQ-15 showed v6.5.2-bullets-cut (all three
cuts) wins on quality (cognitive_max −29 %, mccabe_max
−16 %) and cost (−15 % tokens) but loses on TDD-discipline
determinism (σ refactorings_applied 0.42 → 1.26, σ
cycle_count 0.42 → 1.06, tests_passed_immediately floor
0 → 1). Hypothesis: the DO/DON'T blocks were verbatim
duplicates of upstream content (their cut yields the
quality/cost win), but the "Remember" section at the end
of refactor.md served as a Floor-Anker that prevented
worst-case runs from regressing to v6.5-lean levels.

## Parser markers (MARKERS.md) — verified preserved

- Marker 1 `Skill ∈ {test-list, red, green}` — unchanged
- Marker 2 `Red Phase Complete` — unchanged
- Marker 3 `(Correct|Incorrect)` prediction lines — unchanged
- Marker 4 `experiment-done.txt` / `DONE` — unchanged

## Cuts applied

- **`refactor.md` "Important Guidelines" DO/DON'T**
  (−16 lines) — DO bullets duplicate Mission items or
  Process steps; DON'T bullets invert Refactoring Rules,
  Process Step 3, or Mission item 5.
- **`red/SKILL.md` "Important Guidelines" DO/DON'T**
  (−14 lines) — DOs duplicate Red Phase Rules + Mission;
  DON'Ts are covered by the Mandatory Procedure preamble
  and the "Wrong Predictions Are Data" section.

Net: `refactor.md` 270 → 254 lines, `red/SKILL.md`
173 → 159 lines.

## Cut NOT applied (deliberately kept)

- **`refactor.md` "Remember" section** (8 lines at the
  end of file) — kept as a Floor-Anker for the refactor
  subagent. Hypothesis: a short closing checklist at
  end-of-file position serves as a final pass through
  the key invariants before the subagent acts, and is
  more load-bearing than the mid-file DO/DON'T blocks
  it superficially resembles.

## Hypothesis

If v6.5.3 reproduces v6.5.2's quality and cost wins
**and** restores v6.5.1's discipline σ:

- → "Remember" was the Floor-Anker; mid-file DO/DON'T
  blocks were noise. The targeted cut is the new
  Pareto-optimum.

If v6.5.3 matches v6.5.2 (high σ on discipline, low
mean cost):

- → "Remember" is dekorativ; all three cuts behave
  alike, the σ regression in v6.5.2 was not anchor-loss
  but a different mechanism (e.g. shorter refactor
  cycles allow more variance per cycle).

If v6.5.3 matches v6.5.1 (low σ, high cost):

- → DO/DON'T blocks were the Floor-Anker, "Remember"
  was dekorativ. v6.5.2's quality/cost win was
  Pareto-impossible without σ regression.

The third outcome would be the most surprising and the
most informative — it would argue that *any* removal of
duplicate bullet structure destabilizes the workflow
regardless of which block is cut.

## Explicitly NOT changed

Everything else from v6.5.1-orchestration-audited
remains identical.
