---
id: RQ-external-tdd-workflows
question: "Can the inner TDD loop of EXACT Coding be substituted by an externally authored TDD workflow, and what does the substitution cost or buy? Example mapping stays the entry point; only the implement/test/refactor loop is exchanged. Measured on claim-office-example-mapping against the internal default baseline v6.2-with-why-cleaned — on correctness, code quality, TDD discipline and cost."
factors:
  workflow_x_prompt:
    - {workflow: v6.2-with-why-cleaned, prompt: example-mapping}  # internal default baseline (RQ-1.6 / RQ-1.9 pool), per-cycle refactor via subagent
    - {workflow: v9-pocock-tdd,         prompt: example-mapping}  # external: Pocock, May snapshot, tail refactor
    - {workflow: v11-superpowers-tdd,   prompt: example-mapping}  # external: Superpowers v6.3.0, per-cycle refactor inline
controls:
  model: opus-4-7-portkey-no-thinking
  kata_base: claim-office
outcomes:
  # primary: correctness (claim-office is the correctness kata)
  - verification_pct
  - tests_passing
  - completed_within_budget
  # TDD discipline. Refactor position is the main axis across the cells:
  # per-cycle via subagent (v6.2), tail inside the skill (v9), per-cycle inline (v11).
  # Marker-derived — NOT comparable across all three cells. v6.2 has our own markers,
  # v9 got a RED block inserted into the vendored skill, v11 has none at all, so
  # cycle_count / predictions_correct_rate / refactorings_applied will be empty there.
  # Read them within a cell, not across. See MARKERS.md.
  - refactorings_applied
  - tests_passed_immediately
  - predictions_correct_rate
  - cycle_count
  # Marker-free cycle discipline from the tool sequence — the cross-cell comparable
  # set, and the only discipline numbers v11 produces. test_cases_total / test_blocks
  # is the step size; test_blocks = 1 means all tests were written in one go.
  - test_blocks
  - test_cases_total
  - test_cases_first_block
  - red_verified
  - red_unverified
  # code quality (both external skills carry an explicit design doctrine: Pocock
  # "deep modules" / "small interfaces", Superpowers "minimal code" / YAGNI —
  # an interesting counterpart to APP mass awareness in v6.2)
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

# RQ-4.4: Substituting the Inner TDD Loop with External Workflows (claim-office)

Can the implement/test/refactor loop of EXACT Coding be replaced by an externally
authored TDD workflow, keeping example mapping as the entry point? And what does
that substitution cost or buy on correctness, code quality, discipline and cost?

The directory name still says `pocock-vs-v62` — that was the original scope, and
three snapshot reports link this path. Kept for stability; the scope is the one
stated above.

Related: [RQ-4.1](../4.1-tdd-effect-code-quality/) compares v1–v8 across the whole
internal TDD workflow ladder. This RQ looks outward instead: external baselines
against the internal default.

## Motivation

The internal v6.x line emerged from ~20 iterations of v3–v6 reduction and
audit-bundle work. It runs separate phase commands (`/red`, `/green`) plus a
refactor subagent per cycle — optimized for the marker pipeline and for the
kata-specific peculiarities of this framework. Two questions follow from that:

1. **Is the loop substitutable at all?** EXACT Coding's value proposition rests
   on example mapping and the test list, not on our particular red/green
   plumbing. If an external skill can carry the loop, the method is portable.
2. **Does our per-cycle refactor subagent earn its cost?** It is the most
   expensive part of the architecture.

### The axis: where refactoring sits

Across the candidates, refactor position is what actually varies, and it is the
one design choice with a mechanistic link to code quality:

| Cell | Loop architecture | Refactor position |
|---|---|---|
| `v6.2-with-why-cleaned` | phase commands + subagent | **per-cycle**, isolated subagent |
| `v9-pocock-tdd` | single skill, inline phases | **tail** — "after all tests pass" |
| `v11-superpowers-tdd` | single skill, inline phases | **per-cycle**, inline in the skill |

Phase 1 (v6.2 vs v9) is measured and answered — see [findings.md](findings.md).
It found a large quality gap in favour of per-cycle refactoring, at 70–78 % higher
cost. But that comparison **varies two things at once**: refactor position *and*
loop architecture (multi-command + subagent vs single inline skill). It cannot say
which one produced the effect.

**Phase 2 (v11) exists to close exactly that confound.** Superpowers refactors
per cycle like v6.2, but inline instead of through an isolated subagent. So
v6.2 ↔ v11 varies the refactor *mechanism* alone, while v9 ↔ v11 varies the
refactor *position* alone at constant architecture. Together the three cells
separate what phase 1 conflated.

## The Vendored Skills

Both external workflows are vendored byte-identical; the only project-authored
file per workflow is `.claude/rules/tdd-experiment-mode.md`. Details in
`research/external-tdd-workflows.md` and in each rules file.

### v9-pocock-tdd (2026-05-26 snapshot)

Three minimally invasive changes were made **inside** `SKILL.md`:

1. Planning approval block replaced by "example mapping IS the approval".
2. RED reporting block inserted as a verbatim obligation.
3. DONE marker added, otherwise a container timeout.

Change 2 is now considered a methodological mistake — see the caveat below. It is
kept as-is because the measured runs depend on it; v11 does it differently.

Upstream has since restructured the workflow substantially (see
`v10-pocock-tdd`, which moves refactoring out of the loop entirely). v9 is
retained as the state these findings describe, not as "current Pocock".

### v11-superpowers-tdd (v6.3.0, commit `b36e0829`, 2026-08-12)

Skill unmodified, checksum-verified. The rules file carries: HITL override for
the skill's three deferrals to a "human partner", example mapping as the approved
plan, `pnpm test` instead of the skill's `npm test`, and the DONE marker.
**No RED marker block** — see below.

## Hypotheses

### Phase 1 — v6.2 vs v9 (answered, see findings.md)

- **H1 (correctness, Pocock sanity)** — Pocock reaches ≥ 80 % `verification_pct`. **Confirmed** (1.00).
- **H2 (correctness, equivalent)** — spread < 5 pp despite different architecture. **Confirmed.**
- **H3 (refactorings asymmetry)** — Pocock < 2, v6.2 > 3. **Confirmed** (1.00 vs 24.9).
- **H4 (code quality)** — Pocock similar or slightly better. **Refuted** — worse by factors.
- **H5 (discipline)** — `cycle_count` and `predictions_correct_rate` similar. **Partly** — predictions similar, cycle counts far apart.
- **H6 (cost)** — Pocock −20 % wallclock, −15 % tokens. **Clearly exceeded** (−78 % / −70 %).

### Phase 2 — v11 Superpowers

- **H7 (confound resolution, the main one)** — if per-cycle refactoring is what
  drives quality, v11 lands near v6.2 on `cognitive_max`, `mccabe_max`,
  `cc_longest_function` and `smell_total`, far from v9. If instead the isolated
  subagent is what matters, v11 lands between the two, or near v9. Either result
  is informative; the second would question the subagent's cost.
- **H8 (cost)** — v11 sits between v9 and v6.2: it refactors per cycle like v6.2
  (so more roundtrips than v9), but without a subagent spawn per cycle (so
  cheaper than v6.2). Expected `total_tokens` in the 20–35 M band.
- **H9 (batching, the open observation)** — a manual n=1 saw Superpowers write
  all tests at once, which would not be TDD: no feedback flows from the
  implementation into the next test. The skill itself clearly prescribes the
  opposite ("Write **one minimal test**", "One behavior", checklist "Watched
  **each** test fail"), and lists "Test passes immediately" as a start-over
  condition. So batching would be a deviation from the skill, not its design.
  Falsifier: `test_blocks = 1`, or `test_cases_first_block` close to
  `test_cases_total`. Expected under the skill's own rules: `test_blocks` near
  the behaviour count, step size near 1.0 as with v6.2 (1.10) rather than v9 (2.38).
- **H10 (verification discipline)** — `red_unverified` stays near zero, as for
  both phase-1 cells (0.50 / 0.67). The skill makes "Verify RED — **MANDATORY.
  Never skip.**" explicit, so a higher value would be a real deviation.

## Design

```
Factor:    workflow_x_prompt — 3 levels, all example-mapping
Control:   model            — opus-4-7-portkey-no-thinking
Control:   kata_base        — claim-office

Cells:      3 (3 workflows × 1 kata)
Replicates: n = 3 per cell (min_replicates); v6.2 reuses 8 runs from RQ-1.9
Runs:       3 new v11 runs. v6.2 (8) and v9 (3) are already recorded.
```

**Wallclock expectation** for v11 × no-thinking: per-cycle refactoring inline
should land between v9 (~570 s) and v6.2 (~2530 s); budget ~15–25 min for 3 runs,
single shard.

**Smoke run before the batch** — two things to check on run 1, both cheap to read
off the transcript:

1. Does the model call `pnpm test` (as the rules file says) or `npm test` (as the
   skill's examples show)? `measure-tdd-rigour.py` matches both since
   commit `8c14e9ba`, so either way the numbers arrive — but a failing `npm test`
   would distort the run itself.
2. Does skill discovery fire? Skill tool-use count ≥ 1 at the start.

### Possible extension: v10-pocock-tdd

`v10-pocock-tdd` is vendored and batch-runnable (upstream `6654f6b6`), and would
add a **third** refactor position: none at all. Upstream moved refactoring out of
the loop into a `code-review` skill — which reports findings and changes no code.
That makes it the natural far end of the axis, and it would test whether the
quality gap widens further when nothing refactors.

**Not scheduled** — it costs another n=3 and phase 2 answers the confound question
on its own. Decide after v11.

## Caveats

- **n=3 is small** — memory note `replicates-n-reliability`: n=3 is usually not
  enough for a ranking (15–62 % correct according to RQ-stability/F-stability.3).
  Extend to n=8 per cell if the phase-2 result is interesting.
- **Marker-derived metrics are not comparable across all three cells.** v6.2 uses
  our own markers, v9 got a RED block inserted into the vendored skill, v11 has
  none. `cycle_count`, `predictions_correct_rate` and `refactorings_applied` will
  be empty for v11. Compare discipline across cells only via the transcript-derived
  set (`test_blocks`, `test_cases_*`, `red_verified`, `red_unverified`).
- **The RED marker is not a neutral probe.** An output obligation per RED phase
  creates exactly the structural break the measurement is looking for. Evidence:
  on v9 the marker-derived `cycle_count` (14.0) falls ~30 % short of the actual
  test-write blocks (20.3), while on v6.2 the two agree (37.4 vs 38.5). This is
  why v11 carries no marker block, and why `test_blocks` is the figure to use
  where the two disagree. Lab-wide rule: `README.md` → "Cycle discipline is
  measured from the transcript, not from markers".
- **v9 is adapted, not 1:1 the original** — HITL bullets and marker phrases were
  added inside its `SKILL.md`, and every sub-file carries a provenance line
  ("Included unmodified as an external comparison baseline for RQ-pocock-vs-v62",
  naming this RQ's former id). Methodologically more honest than "run it without
  markers and measure 0 cycles", but not a clean authenticity comparison. Those
  files are deliberately **not** updated: they are the state the recorded runs
  were produced under, and editing them would break reproducibility for a
  cosmetic gain. v11 avoids the problem at the root — everything
  project-authored sits outside the skill.
- **Tail refactor is a workflow property, not a bug** — `refactorings_applied = 0`
  for v9 is expected. Do NOT confuse it with the v6.x refactor-skipping pathology
  from the RQ-1.x reduction branch, where a per-cycle refactor was prescribed and
  occasionally omitted. With v9, 0 is normal; with v6.2, 0 is a warning sign.
- **Skill mechanics differ from v6.x** — v6.x uses `.claude/commands/`, both
  external workflows use `.claude/skills/`. Both are discovered by the Skill tool
  (cf. memory `skills-vs-commands-decision`), but via different paths. If a run
  looks odd, check the transcript for the initial Skill call first.
- **Snapshot, not "the tool"** — every finding here describes the vendored
  snapshot at its recorded commit. Both upstreams move; Pocock's has already
  restructured. Findings must name the snapshot, never the tool in general.

## Findings

See [findings.md](findings.md) — currently phase 1 (v6.2 vs v9) only.

## Data Source

All runs in `experiments/runs/` with
`workflow ∈ {v6.2-with-why-cleaned, v9-pocock-tdd, v11-superpowers-tdd}`,
`kata = claim-office-example-mapping`,
`model = opus-4-7-portkey-no-thinking`.

The v6.2 pool from RQ-1.9 is reusable (8 runs); v9 has 3 runs; v11 has none yet.

## Sources

- Candidate analysis and refactor-position axis: `research/external-tdd-workflows.md`
- Pocock skill: <https://github.com/mattpocock/skills> — v9 = `skills/engineering/tdd` at 2026-05-26; current upstream restructured (see `v10-pocock-tdd`)
- Superpowers skill: <https://github.com/obra/superpowers> — `skills/test-driven-development`, v6.3.0 / `b36e0829`
- Smoke run (v9, with thinking): `experiments/runs/2026-05-25_20-22-06_claim-office-example-mapping_v9-pocock-tdd_opus-4-7-portkey/`
- v6.2 baseline precedent: [RQ-1.6](../../workflow-dev/1.6-v62-cleanup-validation-v61-with-why/findings.md)
- v6.2 on claim-office: [RQ-1.9](../../workflow-dev/1.9-audit-bundle-validation-claim-office/findings.md)
- Marker requirements and the vendoring exception: `experiments/workflows/MARKERS.md`
- Workflow adaptations: `experiments/workflows/v9-pocock-tdd/.claude/skills/tdd/SKILL.md` + each workflow's `.claude/rules/tdd-experiment-mode.md`
