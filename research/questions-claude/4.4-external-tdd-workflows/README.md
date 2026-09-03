---
id: RQ-external-tdd-workflows
question: "Can the inner TDD loop of EXACT Coding be substituted by an externally authored TDD workflow, and what does the substitution cost or buy? Example mapping stays the entry point; only the implement/test/refactor loop is exchanged. Measured on claim-office-example-mapping against the internal default baseline v6.2-with-why-cleaned — on correctness, code quality, TDD discipline and cost."
factors:
  workflow_x_prompt:
    - {workflow: v6.2-with-why-cleaned, prompt: example-mapping}  # internal default baseline (RQ-1.6 / RQ-1.9 pool), per-cycle refactor via subagent
    - {workflow: v9-pocock-tdd,         prompt: example-mapping}  # external: Pocock, May snapshot, tail refactor
    - {workflow: v10-pocock-tdd,        prompt: example-mapping}  # external: Pocock, Aug snapshot, report-only (no refactor stage)
    - {workflow: v11-superpowers-tdd,   prompt: example-mapping}  # external: Superpowers v6.3.0, per-cycle refactor inline
controls:
  model: opus-4-7-portkey-no-thinking
  kata_base: claim-office
outcomes:
  # primary: correctness (claim-office is the correctness kata)
  - verification_pct
  - tests_passing
  - completed_within_budget
  # TDD discipline. Refactor position is the main axis across the cells, and the
  # four levels span it end to end: per-cycle via subagent (v6.2), per-cycle inline
  # (v11), tail inside the skill (v9), none at all (v10).
  # Marker-derived — NOT comparable across cells. v6.2 has our own markers, v9 got a
  # RED block inserted into the vendored skill, v10 and v11 have none at all, so
  # cycle_count / predictions_correct_rate / refactorings_applied will be empty for
  # both of those. Read them within a cell, not across. See MARKERS.md.
  - refactorings_applied
  - tests_passed_immediately
  - predictions_correct_rate
  - cycle_count
  # Marker-free cycle discipline from the tool sequence — the cross-cell comparable
  # set, and the only discipline numbers v10 and v11 produce. test_cases_total / test_blocks
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

The four cells span the axis end to end, from "every cycle" to "never":

| Cell | Loop architecture | Refactor position | Refactoring happens |
|---|---|---|---|
| `v6.2-with-why-cleaned` | phase commands + subagent | **per-cycle**, isolated subagent | ~25× |
| `v11-superpowers-tdd` | single skill, inline phases | **per-cycle**, inline in the skill | per cycle |
| `v9-pocock-tdd` | single skill, inline phases | **tail** — "after all tests pass" | 1× |
| `v10-pocock-tdd` | skill + `code-review` skill | **none** — moved out of the loop | never |

The last row needs a word of explanation. Upstream's August restructuring states
"Refactoring is not part of the loop. It belongs to the review stage (see the
`code-review` skill)" — but `code-review` runs two review sub-agents that *report*
findings and change no code, and upstream's `implement` skill closes with "use
/code-review to review the work. Commit your work". So refactoring sits neither
in the loop nor in the review. v10 is the "never" end of the axis, and that is
the workflow's own design, not a defect in our vendoring.

Phase 1 (v6.2 vs v9) is measured and answered — see [findings.md](findings.md).
It found a large quality gap in favour of per-cycle refactoring, at 70–78 % higher
cost. But that comparison **varies two things at once**: refactor position *and*
loop architecture (multi-command + subagent vs single inline skill). It cannot say
which one produced the effect.

**Phase 2 closes that confound and extends the axis.** Superpowers refactors per
cycle like v6.2, but inline instead of through an isolated subagent, so:

- **v6.2 ↔ v11** varies the refactor *mechanism* alone (subagent vs inline).
- **v9 ↔ v11** varies the refactor *position* alone, at constant architecture.
- **v9 ↔ v10** varies *how much* refactoring, from one tail pass to none, within
  one author's own line of work.

Together the four cells separate what phase 1 conflated, and put a floor under
the quality axis: v10 shows what the code looks like when nothing cleans it up.

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

### v10-pocock-tdd (commit `6654f6b6`, 2026-08-24)

The same author's August restructuring, vendored byte-identical: `tdd`,
`code-review`, and `codebase-design` (the last resolves a skill-to-skill
reference in `tdd`). Everything project-authored sits in the rules file, which
covers four things the run needs: DONE marker; HITL override for the seam
confirmation the skill demands in its body ("No test is written at an
unconfirmed seam"); `code-review` without git (the run dir is not a repo and
`git init` is ruled out, since run dirs are tracked in this repo — the change
set is every file written, the spec is `prompt.md`, the Standards axis rests on
the skill's own smell baseline, its documented fallback for undocumented repos);
and the instruction **not to act on the review findings**.

That last point is the one deliberate call. Acting on them would be a step
upstream does not prescribe and would make v10 silently comparable to a
tail-refactor workflow it is not. **No RED marker block.**

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

### Phase 2 — v11 Superpowers and v10 Pocock (August)

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
- **H11 (v10 is the floor of the quality axis)** — with no refactor stage at all,
  v10 lands at or below v9 on `cognitive_max`, `mccabe_max`,
  `cc_longest_function` and `smell_total`. If it instead matches v9, the tail
  refactor never did anything and F-4.4.4's "fires once and barely moves the
  metrics" generalises: the position does not matter because the pass is inert.
  Falsifier for the whole refactor-position thesis: v10 comes out *clean*, which
  would mean quality is driven by the design doctrine in the prompt rather than
  by any refactor stage.
- **H12 (v10 is the cheapest cell)** — no refactor stage, plus a leaner skill
  (38 lines vs v9's larger set). Expected below v9's ~570 s and ~13 M tokens,
  minus whatever the two `code-review` sub-agents add at the end. If it comes out
  *more* expensive, the review stage is the cost driver and should be reported
  separately from the loop.

## Design

```
Factor:    workflow_x_prompt — 4 levels, all example-mapping
Control:   model            — opus-4-7-portkey-no-thinking
Control:   kata_base        — claim-office

Cells:      4 (4 workflows × 1 kata)
Replicates: n = 3 per cell (min_replicates); v6.2 reuses 8 runs from RQ-1.9
Runs:       6 new — 3× v11, 3× v10. v6.2 (8) and v9 (3) are already recorded.
```

**Wallclock expectation** × no-thinking: v11 should land between v9 (~570 s) and
v6.2 (~2530 s), since it refactors per cycle but spawns no subagent. v10 should
land at or below v9. Budget ~30–45 min for the six runs, single shard.

**Smoke run before the batch.** One run per new workflow, checked on the
transcript — cheap, and both have an untested path:

*v11:*

1. Does the model call `pnpm test` (as the rules file says) or `npm test` (as the
   skill's examples show)? `measure-tdd-rigour.py` matches both since
   commit `8c14e9ba`, so either way the numbers arrive — but a failing `npm test`
   would distort the run itself.
2. Does skill discovery fire? Skill tool-use count ≥ 1 at the start.

*v10:*

3. Does `code-review` complete without git? The rules file tells it to skip
   `git rev-parse` / `git diff` and read the written files instead, but the skill
   says a failing fixed point "should fail here". If it aborts anyway, the run
   ends without a review stage — which must not be mistaken for "the review found
   nothing".
4. Do both review sub-agents spawn (Task tool ×2), and does the model leave the
   code untouched afterwards? An unbidden fix pass would silently turn v10 into a
   tail-refactor cell and invalidate H11.

## Caveats

- **n=3 is small** — memory note `replicates-n-reliability`: n=3 is usually not
  enough for a ranking (15–62 % correct according to RQ-stability/F-stability.3).
  Extend to n=8 per cell if the phase-2 result is interesting.
- **Marker-derived metrics are not comparable across cells.** v6.2 uses our own
  markers, v9 got a RED block inserted into the vendored skill, v10 and v11 have
  none. `cycle_count`, `predictions_correct_rate` and `refactorings_applied` will
  be empty for both of those. Compare discipline across cells only via the
  transcript-derived set (`test_blocks`, `test_cases_*`, `red_verified`,
  `red_unverified`).
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
- **A missing refactor is a workflow property in two of the cells, a bug in a
  third.** `refactorings_applied` near 0 is expected for v9 (tail pass, fires
  once) and is the *definition* of v10 (no refactor stage at all). Do NOT confuse
  either with the v6.x refactor-skipping pathology from the RQ-1.x reduction
  branch, where a per-cycle refactor was prescribed and occasionally omitted.
  With v9 and v10, 0 is normal; with v6.2 and v11, 0 is a warning sign.
- **v10's review stage can fail silently.** If `code-review` aborts on the missing
  git fixed point, the run produces no review at all — and every metric looks
  exactly as if the review had run and found nothing. The smoke-run checks above
  exist for this; on the batch runs, verify two Task spawns per run before
  interpreting v10's numbers.
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
`workflow ∈ {v6.2-with-why-cleaned, v9-pocock-tdd, v10-pocock-tdd, v11-superpowers-tdd}`,
`kata = claim-office-example-mapping`,
`model = opus-4-7-portkey-no-thinking`.

The v6.2 pool from RQ-1.9 is reusable (8 runs); v9 has 3 runs; v10 and v11 have
none yet.

## Sources

- Candidate analysis and refactor-position axis: `research/external-tdd-workflows.md`
- Pocock skills: <https://github.com/mattpocock/skills> — v9 = `skills/engineering/tdd` at 2026-05-26; v10 = `tdd` + `code-review` + `codebase-design` at `6654f6b6` (2026-08-24)
- Superpowers skill: <https://github.com/obra/superpowers> — `skills/test-driven-development`, v6.3.0 / `b36e0829`
- Smoke run (v9, with thinking): `experiments/runs/2026-05-25_20-22-06_claim-office-example-mapping_v9-pocock-tdd_opus-4-7-portkey/`
- v6.2 baseline precedent: [RQ-1.6](../../workflow-dev/1.6-v62-cleanup-validation-v61-with-why/findings.md)
- v6.2 on claim-office: [RQ-1.9](../../workflow-dev/1.9-audit-bundle-validation-claim-office/findings.md)
- Marker requirements and the vendoring exception: `experiments/workflows/MARKERS.md`
- Workflow adaptations: `experiments/workflows/v9-pocock-tdd/.claude/skills/tdd/SKILL.md` + each workflow's `.claude/rules/tdd-experiment-mode.md`
