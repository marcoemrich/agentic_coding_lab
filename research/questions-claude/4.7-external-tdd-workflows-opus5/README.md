---
id: RQ-external-tdd-workflows-opus5
question: "Can the inner TDD loop of EXACT Coding be substituted by an externally authored TDD workflow, and what does the substitution cost or buy? Example mapping stays the entry point; only the implement/test/refactor loop is exchanged. Measured on claim-office-example-mapping against the current exact-coding baseline exact-hybrid-v2.4-lab-split-cc — on correctness, code quality, TDD discipline and cost."
factors:
  workflow_x_prompt:
    - {workflow: exact-hybrid-v2.4-lab-split-cc,  prompt: example-mapping}  # internal: current exact-coding baseline, per-cycle refactor via isolated subagent
    - {workflow: external-superpowers-2026-09-04-cc,  prompt: example-mapping}  # external: Superpowers v6.3.0, per-cycle refactor inline
    - {workflow: external-pocock-2026-09-04-cc,       prompt: example-mapping}  # external: Pocock Aug snapshot, no refactor stage
controls:
  model: opus-5-no-thinking
  kata_base: claim-office
outcomes:
  # primary: correctness (claim-office is the correctness kata)
  - verification_pct
  - tests_passing
  - completed_within_budget
  # TDD discipline, marker-derived — NOT comparable across cells. hybrid-v2.4 carries
  # the four markers from MARKERS.md; pocock-2026-09-04 and superpowers-2026-09-04 are vendored byte-identical and
  # have none, so cycle_count / predictions_correct_rate / refactorings_applied
  # stay empty for both. Read them within a cell, not across.
  - refactorings_applied
  - tests_passed_immediately
  - predictions_correct_rate
  - cycle_count
  # Marker-free cycle discipline from the tool sequence — the cross-cell comparable
  # set, and the only discipline numbers pocock-2026-09-04 and superpowers-2026-09-04 produce. test_cases_total /
  # test_blocks is the step size; test_blocks = 1 means all tests in one go.
  - test_blocks
  - test_cases_total
  - test_cases_first_block
  - red_verified
  - red_unverified
  # code quality. Decomposition first — cc_avg_loc_per_function is the binding
  # quality metric per RQ-architecture-axis-opus5 F-1.6.
  - cc_avg_loc_per_function
  - cc_longest_function
  - cognitive_max
  - mccabe_max
  - smell_total
  - code_mass
  # cost
  - duration_seconds
  - total_tokens
min_replicates: 5
status: aktiv
---

# RQ-4.7: Substituting the Inner TDD Loop with External Workflows (opus-5)

Can the implement/test/refactor loop of EXACT Coding be replaced by an externally
authored TDD workflow, keeping example mapping as the entry point? And what does
that substitution cost or buy on correctness, code quality, discipline and cost?

Measured on **opus-5-no-thinking via the native subscription route** (bare
`claude-opus-5`, host OAuth credentials; not the `opus-5-requesty` arm), against
the workflow that `research/workflow-dev/workflow-construction.md` currently
names the exact-coding baseline for correctness-critical work on this model.

Related: [RQ-4.1](../4.1-tdd-effect-code-quality/) walks the internal TDD ladder
oneshot-v1–v8; [RQ-4.5](../4.5-architecture-axis-opus5/) establishes the architecture
axis on opus-5 and supplies this RQ's baseline reference band. This RQ looks
outward instead: external workflows against the internal default.

## Motivation

The internal hybrid-v1.x line emerged from ~20 iterations of inline-tdd-v1–hybrid-v1 reduction and
audit-bundle work. It runs separate phase commands (`/red`, `/green`) plus a
refactor subagent per cycle — optimized for the marker pipeline and for the
kata-specific peculiarities of this framework. Two questions follow:

1. **Is the loop substitutable at all?** EXACT Coding's value proposition rests
   on example mapping and the test list, not on our particular red/green
   plumbing. If an external skill can carry the loop, the method is portable.
2. **Does the per-cycle refactor subagent earn its cost?** It is the most
   expensive part of the architecture — on opus-5, `v6.1-hybrid` spends 2661 s
   and 81.9 M tokens per claim-office run.

### The design: two clean contrasts, no confound

The three cells vary exactly two things, one at a time:

| Cell | Loop architecture | Refactor position | Refactor mechanism |
|---|---|---|---|
| `exact-hybrid-v2.4-lab-split-cc` | phase commands + subagent | **per-cycle** | isolated subagent |
| `external-superpowers-2026-09-04-cc` | single skill, inline phases | **per-cycle** | inline in the skill |
| `external-pocock-2026-09-04-cc` | single skill + `code-review` skill | **none** | — |

- **superpowers-2026-09-04 ↔ pocock-2026-09-04** holds the architecture constant (both are single inline skills)
  and varies the refactor position alone: per cycle against never. This is the
  clean test of whether a refactor stage does anything at all.
- **hybrid-v2.4 ↔ superpowers-2026-09-04** holds the refactor position constant (both per cycle) and
  varies architecture and mechanism: phase commands + isolated subagent against
  one inline skill. This is the clean test of whether the expensive machinery
  buys anything over doing the same thing inline.

Together the two contrasts separate "does refactoring matter" from "does our way
of refactoring matter" — the question a two-cell comparison cannot answer,
because it moves both at once.

The `pocock-2026-09-04` row needs a word of explanation. Upstream's August restructuring states
"Refactoring is not part of the loop. It belongs to the review stage (see the
`code-review` skill)" — but `code-review` runs two review sub-agents that *report*
findings and change no code, and upstream's `implement` skill closes with "use
/code-review to review the work. Commit your work". So refactoring sits neither
in the loop nor in the review. pocock-2026-09-04 is the "never" end of the axis, and that is
the workflow's own design, not a defect in our vendoring.

## The Cells

### exact-hybrid-v2.4-lab-split-cc — the exact-coding baseline

Named in `workflow-construction.md` § "Aktuelle Front" as the default for
correctness-critical work on opus-5-no-thinking × Claude Code. It is
content-identical to `exact-hybrid-v2-testlist-fix-cc` but in the hybrid-v6 file
layout: lab infrastructure isolated in `rules/lab-only.md`, subagent contracts in
`rules/subagent-prompts.md`. Production files (`agents/refactor.md`,
`commands/*`, `settings.json`) are byte-identical to hybrid-v2. No end-refactor phase —
that is constitutive for the line, not a missing port.

**Reference band** (from RQ-4.5, `v6.1-hybrid` on claim-office × opus-5-no-thinking,
n=5 — the measurement basis of this cell):

| | mean ± σ |
|---|---:|
| `verification_pct` | 0.99 ± 0.03 |
| `cc_avg_loc_per_function` | 4.04 ± 0.58 |
| `cc_longest_function` | 17.0 ± 4.5 |
| `cognitive_max` | 2.40 ± 0.89 |
| `mccabe_max` | 3.20 ± 0.45 |
| `smell_total` | 0.00 ± 0.00 |
| `code_mass` | 861.6 ± 103.5 |
| `refactorings_applied` | 17.4 ± 5.0 |
| `cycle_count` | 42.8 ± 5.8 |
| `duration_seconds` | 2661 ± 411 |
| `total_tokens` | 81.9 M ± 17.0 M |

### external-pocock-2026-09-04-cc (commit `6654f6b6`, 2026-08-24)

Vendored byte-identical: `tdd`, `code-review`, and `codebase-design` (the last
resolves a skill-to-skill reference in `tdd`). Everything project-authored sits
in `.claude/rules/tdd-experiment-mode.md`, which covers four things the run
needs: DONE marker; HITL override for the seam confirmation the skill demands
("No test is written at an unconfirmed seam"); `code-review` without git (the run
dir is not a repo and `git init` is ruled out, since run dirs are tracked in this
repo — the change set is every file written, the spec is `prompt.md`, the
Standards axis rests on the skill's own smell baseline, its documented fallback
for undocumented repos); and the instruction **not to act on the review
findings**.

That last point is the one deliberate call. Acting on them would be a step
upstream does not prescribe and would make pocock-2026-09-04 silently comparable to a
tail-refactor workflow it is not. **No RED marker block.**

### external-superpowers-2026-09-04-cc (v6.3.0, commit `b36e0829`, 2026-08-12)

Skill unmodified, checksum-verified. The rules file carries: HITL override for
the skill's three deferrals to a "human partner", example mapping as the approved
plan, `pnpm test` instead of the skill's `npm test`, and the DONE marker.
**No RED marker block** — see the caveats.

## Hypotheses

### Refactor position (superpowers-2026-09-04 ↔ pocock-2026-09-04)

- **H1 (a refactor stage matters)** — superpowers-2026-09-04 lands clearly better than pocock-2026-09-04 on
  `cc_avg_loc_per_function`, `cc_longest_function`, `cognitive_max`, `mccabe_max`
  and `smell_total`, at constant architecture. Falsifier: pocock-2026-09-04 comes out level
  with or cleaner than superpowers-2026-09-04, which would mean quality on this kata is driven by
  the design doctrine in the prompt (Pocock's "deep modules" / "small
  interfaces") rather than by any refactor stage.
- **H2 (pocock-2026-09-04 is the quality floor)** — with no refactor stage at all, pocock-2026-09-04 has the
  worst decomposition of the three cells. It is the reference for what the code
  looks like when nothing cleans it up.

### Architecture and mechanism (hybrid-v2.4 ↔ superpowers-2026-09-04)

- **H3 (the main one — does the subagent earn its cost?)** — if the isolated
  subagent is what produces hybrid-v2's decomposition, superpowers-2026-09-04 lands measurably worse than
  the reference band above despite refactoring per cycle. If instead per-cycle
  refactoring alone is sufficient, superpowers-2026-09-04 lands inside the band — which would
  question the whole phase-command + subagent apparatus, since superpowers-2026-09-04 gets there
  with one skill file.
- **H4 (cost)** — superpowers-2026-09-04 is markedly cheaper than hybrid-v2.4: it refactors per cycle,
  but spawns no subagent and runs no separate phase commands. Expected well below
  the 2661 s / 81.9 M reference, and above pocock-2026-09-04.

### Correctness and discipline

- **H5 (correctness holds)** — all three cells reach ≥ 0.90 `verification_pct`.
  claim-office is the correctness kata; a cell that drops below this is failing
  the task, not trading quality for speed, and its quality numbers must not be
  read as parsimony (see the gating rule in the caveats).
- **H6 (batching, the open observation)** — a manual n=1 saw Superpowers write
  all tests at once, which would not be TDD: no feedback flows from the
  implementation into the next test. The skill itself prescribes the opposite
  ("Write **one minimal test**", "One behavior", checklist "Watched **each** test
  fail"), and lists "Test passes immediately" as a start-over condition. So
  batching would be a deviation from the skill, not its design. Falsifier:
  `test_blocks = 1`, or `test_cases_first_block` close to `test_cases_total`.
- **H7 (verification discipline)** — `red_unverified` stays near zero for all
  three cells. The Superpowers skill makes "Verify RED — **MANDATORY. Never
  skip.**" explicit, so a higher value would be a real deviation.
- **H8 (pocock-2026-09-04 is the cheapest cell)** — no refactor stage plus a lean skill.
  Expected the lowest `duration_seconds` and `total_tokens` of the three, minus
  whatever the two `code-review` sub-agents add at the end. If it comes out more
  expensive than superpowers-2026-09-04, the review stage is the cost driver and should be reported
  separately from the loop.

## Design

```
Factor:    workflow_x_prompt — 3 levels, all example-mapping
Control:   model            — opus-5-no-thinking (native subscription route)
Control:   kata_base        — claim-office

Cells:      3 (3 workflows × 1 kata)
Replicates: n = 5 per cell (min_replicates)
Runs:       15 new — no existing run matches. hybrid-v2.4 has no claim-office data
            (only 3 game-of-life control runs), pocock-2026-09-04 and superpowers-2026-09-04 have none at all.
```

**Wallclock expectation.** hybrid-v2.4 should land near hybrid-v2's 2661 s; superpowers-2026-09-04 and pocock-2026-09-04
below it. Budget ~4–6 h serial, ~1.5–2 h at 5 shards.

**Smoke checks on the first run of each new cell** — both external workflows have
an untested path, and hybrid-v2.4 has never run on claim-office:

*superpowers-2026-09-04:*

1. Does the model call `pnpm test` (as the rules file says) or `npm test` (as the
   skill's examples show)? `measure-tdd-rigour.py` matches both since commit
   `8c14e9ba`, so the numbers arrive either way — but a failing `npm test` would
   distort the run itself.
2. Does skill discovery fire? Skill tool-use count ≥ 1 at the start.

*pocock-2026-09-04:*

3. Does `code-review` complete without git? The rules file tells it to skip
   `git rev-parse` / `git diff` and read the written files instead, but the skill
   says a failing fixed point "should fail here". If it aborts anyway, the run
   ends without a review stage — which must not be mistaken for "the review found
   nothing".
4. Do both review sub-agents spawn (Task tool ×2), and does the model leave the
   code untouched afterwards? An unbidden fix pass would silently turn pocock-2026-09-04 into a
   tail-refactor cell and invalidate H1 and H2.

*hybrid-v2.4:*

5. Do all four markers fire on claim-office? `cycle_count >= 3`,
   `refactorings_applied >= 1`, `predictions_total ~ 2 × cycle_count`. The layout
   split is validated on game-of-life only (3 runs); claim-office is new ground
   for this workflow.

## Caveats

- **The hybrid-v2.4 cell doubles as a validity check on the layout split.**
  `workflow-construction.md` claims hybrid-v2.4 is performance-neutral against hybrid-v2,
  backed by 3 game-of-life runs. If this cell lands outside the reference band
  above on claim-office, that claim does not hold on the correctness kata and the
  baseline recommendation needs revisiting — report it as a finding in its own
  right, separately from the external-workflow comparison.
- **Marker-derived metrics are not comparable across cells.** hybrid-v2.4 uses our own
  markers, pocock-2026-09-04 and superpowers-2026-09-04 have none. `cycle_count`, `predictions_correct_rate` and
  `refactorings_applied` will be empty for both external cells. Compare
  discipline across cells only via the transcript-derived set (`test_blocks`,
  `test_cases_*`, `red_verified`, `red_unverified`).
- **No RED marker is inserted into either vendored skill.** An output obligation
  per RED phase creates exactly the structural break the measurement is looking
  for, so both external workflows stay unmodified and `test_blocks` is the figure
  to use. Lab-wide rule: `README.md` → "Cycle discipline is measured from the
  transcript, not from markers".
- **A missing refactor is a workflow property in one cell, a bug in another.**
  `refactorings_applied` near 0 is the *definition* of pocock-2026-09-04. With hybrid-v2.4 it is a
  warning sign — the hybrid-v1.x refactor-skipping pathology from the RQ-1.x reduction
  branch. Do not confuse the two.
- **pocock-2026-09-04's review stage can fail silently.** If `code-review` aborts on the
  missing git fixed point, the run produces no review at all — and every metric
  looks exactly as if the review had run and found nothing. Verify two Task
  spawns per pocock-2026-09-04 run before interpreting its numbers.
- **Correctness gating on trophies.** Quality and cost trophies go only to cells
  at `verification_pct = 1.0`. A cell that scores low on complexity, cost or
  duration but failed verification is showing a stub or a smaller wrong rule set,
  not parsimony.
- **Skill mechanics differ from hybrid-v1.x** — hybrid-v1.x uses `.claude/commands/`, both
  external workflows use `.claude/skills/`. Both are discovered by the Skill tool,
  but via different paths. If a run looks odd, check the transcript for the
  initial Skill call first.
- **Snapshot, not "the tool"** — every finding here describes the vendored
  snapshot at its recorded commit. Both upstreams move. Findings must name the
  snapshot, never the tool in general.
- **Single harness, single model.** Claude Code on opus-5-no-thinking only. The
  architecture axis is a net negative on Sol/pi (RQ-architecture-axis-sol-pi
  F-1.6), so nothing here transfers to another harness without replication.

## Findings

See [findings.md](findings.md) — no runs yet.

## Data Source

All runs in `experiments/runs/` with
`workflow ∈ {exact-hybrid-v2.4-lab-split-cc, external-pocock-2026-09-04-cc, external-superpowers-2026-09-04-cc}`,
`kata = claim-office-example-mapping`,
`model = opus-5-no-thinking`.

## Sources

- Candidate analysis and refactor-position axis: `research/external-tdd-workflows.md`
- Baseline recommendation: `research/workflow-dev/workflow-construction.md` § "Aktuelle Front"
- Baseline reference band: [RQ-4.5](../4.5-architecture-axis-opus5/summary.md)
- Pocock skills: <https://github.com/mattpocock/skills> — `tdd` + `code-review` + `codebase-design` at `6654f6b6` (2026-08-24)
- Superpowers skill: <https://github.com/obra/superpowers> — `skills/test-driven-development`, v6.3.0 / `b36e0829`
- Marker requirements and the vendoring exception: `experiments/workflows/MARKERS.md`
- Workflow adaptations: each workflow's `.claude/rules/tdd-experiment-mode.md`
