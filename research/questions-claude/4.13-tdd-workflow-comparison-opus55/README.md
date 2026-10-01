---
id: RQ-tdd-workflow-comparison-opus55
question: "How do seven TDD workflows compare on correctness, TDD discipline, code quality and cost? Three lines meet on one kata: the maintained EXACT Coding Predictive-TDD pair (with and without an isolated refactor subagent), the retired Opus hybrid pair, and three vendored third-party TDD skills — measured on claim-office-example-mapping × opus-5-5-no-thinking × Claude Code."
factors:
  workflow:
    # Maintained line (SOL-derived Predictive TDD), shared context — the
    # workflow the consumer export promotes as `exact-coding`
    - exact-ptdd-v1-cc
    # Maintained line, per-cycle Refactor delegated to an isolated subagent —
    # exported as `exact-coding-isolated-refactor`
    - exact-ptdd-v1.1-refactor-subagent-cc
    # Retired Opus line, kept as the historical reference point
    - exact-hybrid-v2-testlist-fix-cc
    # Retired Opus line, same content in the split file layout
    - exact-hybrid-v2.4-lab-split-cc
    # Vendor: Superpowers v6.3.0 — one inline skill, refactor per cycle
    - external-superpowers-2026-09-04-cc
    # Vendor: Pocock Aug snapshot — one inline skill, no refactor stage
    - external-pocock-2026-09-04-cc
    # Vendor: Kesseler — one inline skill, refactor per cycle, ZOMBIES test plan
    - external-kesseler-2026-09-30-cc
controls:
  model: opus-5-5-no-thinking
  kata_base: claim-office
  prompt: example-mapping
  # Opus 5.5 is gated behind 2.1.280 (RQ-opus55-current-workflow, "The CLI gate"),
  # which is also the current Dockerfile pin. Pinning it here keeps the workflow
  # factor separable from a future CLI bump and makes the five inherited
  # hybrid-v2 runs reusable — they are already on 2.1.280.
  harness_version: "2.1.280"
outcomes:
  # correctness: claim-office is the correctness kata
  - verification_pct
  - tests_passing
  - completed_within_budget
  # TDD discipline, phase chain
  # The point of this RQ. Derived from the vitest reporter's own event stream,
  # so the vocabulary is identical for a lab workflow with four markers and a
  # vendored skill with none. Comparable across all five cells — which the
  # marker and transcript routes never were.
  - tdd_discipline
  - tdd_discipline_test_first
  - tdd_discipline_step
  - tdd_discipline_closure
  - test_first_rate
  - red_batch_size
  - red_batch_max
  - red_batch_unmeasurable
  - green_batch_size
  # denominators — never read the rates without them
  - chain_suite_runs
  - cycles_total
  - cycles_closed
  - refactor_events
  - skip_events
  # ambivalent, no trophy
  - refactor_per_cycle
  - green_attempts
  # pathologies and endpoints
  - chain_deviations
  - chain_opens_red
  - chain_ends_green
  # code quality: decomposition first
  # cc_avg_loc_per_function is the binding quality metric per
  # RQ-architecture-axis-opus5 F-1.6.
  - cc_avg_loc_per_function
  - cc_longest_function
  - cognitive_max
  - mccabe_max
  - smell_total
  - code_mass
  # cost
  - duration_seconds
  - total_tokens
  - cost_usd
min_replicates: 5
---

# RQ-4.13: Seven TDD Workflows Compared (opus-5.5)

How do seven TDD workflows compare on correctness, TDD discipline, code quality
and cost? Four grew in this lab across two generations, three are vendored
snapshots of third-party TDD skills. All seven get the same kata, the same
prompt, the same model and the same harness.

This is a flat comparison of the field, not a test of one workflow against a
baseline. No cell is privileged, and nothing here is framed as a substitution
of a part of EXACT Coding — the question is simply which workflow produces
which outcome.

## Why now

TDD discipline was not comparable across workflows until 2026-10, and that is
the reason this comparison is worth running at all.

Both earlier sources keyed on something the workflow had to supply. The marker
route counted `## Red` blocks and refactor-subagent spawns, which vendored
external skills do not emit by policy. The transcript route reconstructed
cycles from `Write`/`Edit`/`MultiEdit` calls, which a model that writes files
through the shell never produces — a measured case read `test_blocks = 0` for a
run that wrote 49 tests. A predecessor RQ therefore had to declare its own
discipline columns not comparable across cells and compare only within a cell.
That left the central question of a workflow comparison unanswerable.

The phase chain closes that. The one event no TDD workflow can avoid is running
the tests, so the stack's vitest reporter writes one event per suite
invocation — outcome, test names, and a content hash per source file — and
`tdd-report.py` derives each event's phase from what changed since the previous
invocation and what the suite then did. It reads no marker, no tool call and no
commit. A lab workflow with four markers and a vendored skill with none are
measured by exactly the same instrument. See README § "Phase chain metrics".

So this RQ is the first one in which the discipline column means the same thing
in every cell.

## The field

| Cell | Line | Loop architecture | Refactor position |
|---|---|---|---|
| `exact-ptdd-v1-cc` | lab, maintained | one skill, shared context | per cycle, inline |
| `exact-ptdd-v1.1-refactor-subagent-cc` | lab, maintained | one skill + refactor subagent | per cycle, isolated |
| `exact-hybrid-v2-testlist-fix-cc` | lab, retired | phase commands + refactor subagent | per cycle, isolated |
| `exact-hybrid-v2.4-lab-split-cc` | lab, retired | same, split file layout | per cycle, isolated |
| `external-superpowers-2026-09-04-cc` | vendor | one inline skill | per cycle, inline |
| `external-pocock-2026-09-04-cc` | vendor | one inline skill + `code-review` | none |
| `external-kesseler-2026-09-30-cc` | vendor | one inline skill | per cycle, inline |

Five contrasts are readable in that table, and each is held clean by the rows
around it:

- **the subagent, isolated** — `exact-ptdd-v1-cc` against
  `exact-ptdd-v1.1-refactor-subagent-cc`. Same contract, same prose, same
  refactor position; the only difference is whether the Refactor step runs in
  the main context or in an isolated subagent. This is the cleanest test in the
  field of what the subagent apparatus buys, and the only one where nothing
  else moves with it.
- **maintained against retired** — the PTDD pair against the hybrid pair. Both
  lab lines, two generations apart, and the hybrid line is no longer the
  recommendation for anything on this model. It is in the field as the
  historical reference point, not as a candidate.
- **lab against vendor** — six cells refactor per cycle; four do it inside a
  lab contract, two with prose in a single vendored skill file.
- **refactor position** — `pocock` against `superpowers` and `kesseler` holds
  the architecture constant (one inline skill) and varies only whether a
  refactor stage exists at all.
- **which vendor skill** — `superpowers` against `kesseler` holds the whole
  architecture row constant and varies only the author. It is what keeps any
  statement about "an external inline skill" from resting on n=1 skill.

The retired pair carries one contrast of its own: `hybrid-v2` against
`hybrid-v2.4`. RQ-1.19 measured a refactor rate of 0.41 against 0.69 at +20 %
wallclock from the rule split alone, with no measurable quality return. The
phase chain can now say whether that extra refactoring shows up as discipline
or only as cost.

### The cells in detail

**`exact-ptdd-v1-cc`** — the maintained line: SOL-derived Predictive TDD, one
entry skill, red/green/refactor in shared context. This is the workflow the
consumer export ships as the `exact-coding` skill
(`research/workflow-dev/export/2026-09-21-exact-coding-ptdd-v1/`, promoted from
`exact-ptdd-v1-pi`). It emits no tool call per phase — it invokes a single skill
and then follows it, which is exactly why marker-derived discipline was
unreadable for it and why the phase chain matters here.

**`exact-ptdd-v1.1-refactor-subagent-cc`** — the same contract with the
per-cycle Refactor step delegated to an isolated subagent, exported as
`exact-coding-isolated-refactor`. Against `exact-ptdd-v1-cc` it isolates the
subagent as a single variable: same prose, same phases, same refactor position.

**`exact-hybrid-v2-testlist-fix-cc`** — the retired Opus line, kept as the
historical reference point rather than as a candidate. Separate `/red` and
`/green` phase commands, a refactor subagent per cycle, no end-refactor phase.
`workflow-construction.md` § "Current front" still names it the default for
correctness-critical work on opus-5 × Claude Code; the export and RQ-4.12 treat
the PTDD line as the maintained one. That tension is not resolved here — this RQ
measures both and says nothing about which document is right.

**`exact-hybrid-v2.4-lab-split-cc`** — content-identical to hybrid-v2 in the
hybrid-v6 file layout: lab infrastructure isolated in `rules/lab-only.md`,
subagent contracts in `rules/subagent-prompts.md`. Production files are
byte-identical. It was the export carrier until RQ-1.19 priced the split and
reversed the choice. Also retired.

**`external-superpowers-2026-09-04-cc`** (v6.3.0, commit `b36e0829`) — skill
unmodified, checksum-verified. The project rules file carries only: HITL
override for the skill's three deferrals to a "human partner", example mapping
as the approved plan, `pnpm test` instead of the skill's `npm test`, and the
DONE marker.

**`external-pocock-2026-09-04-cc`** (commit `6654f6b6`) — `tdd`, `code-review`
and `codebase-design` vendored byte-identical. This is the "no refactor stage"
end of the axis, and that is upstream's own design: the August restructuring
states "Refactoring is not part of the loop. It belongs to the review stage",
but `code-review` runs two sub-agents that *report* findings and change no
code. So refactoring sits neither in the loop nor in the review. The rules file
tells the model **not** to act on the review findings — acting on them would be
a step upstream does not prescribe and would quietly turn this into a
tail-refactor cell.

**`external-kesseler-2026-09-30-cc`** (lexler/skill-factory, commit
`474433af2e`) — `SKILL.md` and `references/zombies.md` unmodified,
sha256-verified, Apache-2.0 in `LICENSE.upstream`. The only vendored snapshot
whose contract independently converges on EXACT Coding's: an explicit test plan
walked for completeness against ZOMBIES, stated failure predictions before each
run, a two-step red phase (compile, then assertion), and a justification pass
before refactor. All of it is prose in one document, with no phase commands,
subagents or markers to enforce it.

Upstream's `evals/evals.json` is deliberately not vendored. Its `expectations`
arrays enumerate the scored behaviours in order ("ZOMBIES checklist is
explicitly walked through"), which in the run directory would be a rubric the
agent can read — that measures compliance-with-a-checklist, not the skill.

## Hypotheses

### Discipline

- **H1 (the lab lines are the more disciplined ones)** — `tdd_discipline` is
  higher for all four lab cells than for the three vendor cells. The phase
  commands make the red phase a separate, named step; the vendor skills ask for
  the same thing in prose. Falsifier: a vendor cell matches or beats the
  hybrid cells, which would mean the enforcement apparatus buys no discipline
  that prose does not already buy — the central claim of the architecture.
- **H2 (step size is where they separate)** — the separation in H1 sits mostly
  in `tdd_discipline_step`: the hybrid cells at `red_batch_size` 1, the vendor
  cells above it. On the retired transcript route, `superpowers` wrote 3.36
  test cases per block against hybrid's 1.01. `red_batch_size` measures the
  same thing from the suite side, so the gap should survive. Report
  `red_batch_max` with it — a single big-bang opener hides in a median of 1.
- **H3 (prose obligations bind weakly)** — `kesseler` lands between
  `superpowers` and the hybrid cells on `tdd_discipline`, not at the hybrid
  level. Its extra obligations are real, but nothing enforces them. The one
  reporter-era run available at setup time scores 0.751, with components
  test-first 0.667 / step 1.0 / closure 0.634 — perfect step size, and the
  score carried entirely by the other two. Falsifier: `kesseler` reaches hybrid
  level, which would be direct evidence that written obligations suffice and a
  harness is not needed to make them bind.
- **H4 (cycle closure is the quiet failure mode)** — `tdd_discipline_closure`
  separates the field more than `test_first_rate` does. The n=1 anchor closed
  26 of 41 cycles. A cycle that opens red and never reaches a green is not
  visible in any correctness or quality metric, and is the kind of thing only
  this source reports.

### The isolated refactor subagent

- **H11 (the subagent buys decomposition, not discipline)** —
  `exact-ptdd-v1.1-refactor-subagent-cc` lands better than `exact-ptdd-v1-cc` on
  `cc_avg_loc_per_function` and level with it on `tdd_discipline`. The subagent
  changes where the Refactor step runs, not whether a failing test preceded the
  code, so the discipline components have no mechanism by which to move.
  Falsifier either way is interesting: if discipline *does* move, the isolated
  context is doing something to the cycle itself; if decomposition does *not*
  move, the apparatus has no measurable product on this kata and its cost is
  unjustified. This is the cleanest single-variable contrast in the field —
  same contract, same prose, same refactor position.
- **H12 (`refactor_events` reads the architecture, not the effort)** — the two
  PTDD cells differ in `refactor_events` even where decomposition does not,
  because an isolated subagent returns a changed tree in one step where the
  inline variant may touch the code repeatedly. Read it against
  `cc_avg_loc_per_function`, never alone: this is the column where "more
  refactorings" and "better decomposition" are least likely to agree.

### Two generations of the lab line

- **H13 (the maintained line is at least level with the retired one)** — the
  PTDD pair matches or beats the hybrid pair on `verification_pct` and on
  decomposition. If the retired line wins on either, the promotion of the PTDD
  line rests on something this kata does not measure — portability across
  harnesses and models — and that should be said in the findings rather than
  left implicit. The hybrid pair is in the field as the reference point; it is
  not a candidate for anything on this model.

### Correctness

- **H5 (all seven cells deliver)** — every cell reaches ≥ 0.90
  `verification_pct`. claim-office is the correctness kata; a cell below this is
  failing the task, not trading correctness for something else, and its quality
  numbers must then not be read as parsimony (see the gating rule in the
  caveats).
- **H6 (correctness does not separate the field)** — the spread across cells is
  smaller than the spread within any one cell. On opus-5, all four workflows of
  RQ-1.19 sat at 0.95–0.96 and the same single verification case failed in all
  33 runs. If that pattern holds here, correctness is a bit on this kata, not a
  degree, and the comparison has to be carried by the other three dimensions.

### Code quality

- **H7 (refactor position orders decomposition)** — `cc_avg_loc_per_function`
  rises monotonically as refactoring gets rarer: the hybrid cells lowest,
  `superpowers` and `kesseler` in the middle, `pocock` highest. The clean test
  is `pocock` against the two inline per-cycle skills, which varies position
  alone. Falsifier: `pocock` comes out level, which would mean quality here
  comes from the design doctrine in the prompt rather than from a refactor
  stage.
- **H8 (little code is not clean code)** — the `code_mass` ordering runs
  *opposite* to the decomposition ordering: the cell with the least code packs
  it into the longest functions. Worth stating as a hypothesis because the
  naive reading of a lean cell is the wrong one.

### Cost

- **H9 (the vendor skills are an order of magnitude cheaper)** — one skill
  file, no subagent spawns, no separate phase commands. On opus-5-5 the
  inherited hybrid-v2 runs sit at ~1320 s / ~54 M tokens and the kesseler
  anchor at ~770 s / ~17 M, so the expected factor on tokens is larger than on
  wallclock.
- **H10 (`pocock` is not the cheapest cell)** — it drops the refactor stage but
  adds two review sub-agents that produce no code. Expected at or above
  `superpowers` on both cost metrics. If it comes out below, the review stage
  is cheap and the refactor stage is the cost driver.

## Design

```
Factor:    workflow         — 7 levels
Control:   model            — opus-5-5-no-thinking (native subscription route)
Control:   kata_base        — claim-office
Control:   prompt           — example-mapping
Control:   harness_version  — 2.1.280

Cells:      7
Replicates: n = 5 per cell (min_replicates)
```

**Run inventory** (2026-10-01, after the first fill):

| Cell | runs with phase-chain data | to fill |
|---|---:|---:|
| `exact-ptdd-v1-cc` | 0 | 5 |
| `exact-ptdd-v1.1-refactor-subagent-cc` | 0 | 5 |
| `exact-hybrid-v2-testlist-fix-cc` | 5 | — |
| `exact-hybrid-v2.4-lab-split-cc` | 5 | — |
| `external-superpowers-2026-09-04-cc` | 5 | — |
| `external-pocock-2026-09-04-cc` | 5 | — |
| `external-kesseler-2026-09-30-cc` | 5 | — |

The two PTDD cells were added after the first fill, which is why they are the
only ones outstanding.

**Every cell is one population, and that took an archiving step.** Sixteen
pre-reporter runs matched this RQ's selector and were moved to
`experiments/runs/_archive/`: five `exact-hybrid-v2-testlist-fix-cc`, five
`exact-ptdd-v1-cc`, five `exact-ptdd-v1.1-refactor-subagent-cc` and one kesseler
vendoring smoke test. None carries a `tdd-events.jsonl`, and
`batch-plan-from-rq.py` counts runs rather than event streams — left in the pool,
those three cells would have reported themselves full while the primary axis
stayed empty, and no row of the findings table would have had a single n. With
them out, the generated fill plan covers every outstanding run and nothing here
needs a hand-written plan.

**The archiving reaches into two other RQs, and the refill repairs both.**
[RQ-4.12](../4.12-old-vs-new-exact-line-opus55/) read all fifteen lab runs — they
carry its token, cost and subagent tables — and
[RQ-2.4](../2.4-opus55-current-workflow/) read the ten PTDD ones. Every fill
lands on identical cell coordinates (same workflow, model, kata, prompt, harness
2.1.280), so both RQs regain their cells with phase-chain data; their findings
are re-derived against the new runs once the batch is through, and that
re-derivation belongs to this fill rather than to a later clean-up. RQ-2.4 is
being refilled completely for the same reason and swaps its three retired
suite-shape outcomes for the phase chain — the discipline question it had to
abandon as a parser artefact becomes answerable there. Two cross-harness RQs
(RQ-1.7, RQ-1.10) also read some of those runs but pin no `harness_version` and
pool across batches, so no cell of theirs drops below `min_replicates`.

**Budget.** The first fill ran 24 runs in 51 min at 5 shards — Opus 5.5 is
markedly faster than the opus-5 reference band (hybrid-v2 at 1117 s measured
here against 2661 s on opus-5), and the five shards drew no rate-limit retry.
The two PTDD cells add 10 runs, which travel inside RQ-2.4's complete refill of
30; expect ~2 h at 5 shards for that batch. `batch.sh` retries with backoff.

**Smoke checks on the first run of each new cell.** Every cell was unmeasured on
this model, and none had ever produced phase-chain data:

1. **`tdd-events.jsonl` exists and is non-empty** in every run directory, and
   `tdd_discipline` is non-null in `metrics.json`. A cell that produces no
   event stream produces no discipline column, which is this RQ's primary axis.
   Check before the batch grows past the first run of each cell.
2. **hybrid-v2 and hybrid-v2.4:** all four markers still fire (`cycle_count`,
   `refactorings_applied`, `predictions_total ~ 2 × cycle_count` under their
   `legacy_` names). They are not outcomes here, but a marker break is the
   signal that something else about the workflow broke too.
2b. **`exact-ptdd-v1.1-refactor-subagent-cc`:** the refactor subagent actually
   spawns (Task tool ≥ 1 per cycle). Its whole contrast against
   `exact-ptdd-v1-cc` is the isolation; a run where the subagent never fires is
   a second `exact-ptdd-v1-cc` run under the wrong label. The shared-context
   variant is the opposite check: no Task spawn for refactoring.
3. **`superpowers`:** does the model call `pnpm test` (rules file) or `npm test`
   (the skill's examples)? A failing `npm test` distorts the run itself. And
   does skill discovery fire — Skill tool-use count ≥ 1 at the start?
4. **`pocock`:** do both review sub-agents spawn (Task tool ×2), and does the
   model leave the code untouched afterwards? An unbidden fix pass silently
   turns this into a tail-refactor cell and invalidates H7. If `code-review`
   instead aborts on the missing git fixed point, the run ends with no review —
   which must not be mistaken for "the review found nothing".
5. **`kesseler`:** `refactor_events` is non-null. The skill announces
   refactoring with `🧹 Starting refactoring stage`, which is not a parsed
   marker — the phase chain reads the refactor from the suite staying green
   instead, and that is the number this RQ uses.

## Caveats

- **`-no-thinking` is nominal on this model.** Opus 5.5 thinks adaptively and
  always on; the manual `thinking.type: enabled` mode is not accepted from 4.6
  onward. `MAX_THINKING_TOKENS=0` is still set, but whether it suppresses the
  reasoning blocks is not guaranteed — Fable 5.1 produced 37 thinking blocks
  despite `thinking=false`. The cell keeps the label so it reads against the
  other `-no-thinking` cells in the corpus; the difference is documented, not
  defined away. See `run-batch.sh` MODEL_CONFIGS and RQ-opus55-current-workflow.
- **Phase-chain data cannot be backfilled.** The event stream is written during
  the run. No reanalysis pass produces it, so a run that predates the reporter
  can never carry a discipline column. This is why the predecessor RQ was closed
  rather than extended, and why sixteen pre-reporter runs had to leave the pool
  rather than count toward a cell they cannot serve.
- **`tdd_discipline` is null, not 0, when unmeasurable.** Unmeasurable is not
  the same as undisciplined. The score is a geometric mean, so it is
  conjunctive: several distinct failure modes all land on 0.0 and it does not
  rank the bottom of the field. Always report the three components with it —
  that is what makes a 0 diagnosable.
- **`red_batch_unmeasurable` is the trust column for `red_batch_size`.** A
  suite invocation that fails to compile reports no test names and contributes
  no batch size. A high value means the median rests on few events.
- **Two metrics take no trophy.** `refactor_per_cycle` and `green_attempts`
  have no agreed direction — frequent refactoring can be discipline or
  nervousness, and a missed first implementation attempt can be a small step or
  a wrong guess. They stay out of `tdd_discipline` for the same reason.
- **`refactor_events` near 0 is a design property in one cell and a warning in
  another.** It is the *definition* of `pocock`. In a hybrid cell it is the
  refactor-skipping pathology from the RQ-1.x reduction branch. Do not read the
  column without the row label.
- **Correctness gating on trophies.** Quality and cost trophies go only to
  cells at `verification_pct = 1.0`. A cell with low complexity, cost or
  duration that failed verification is showing a stub or a smaller wrong rule
  set, not parsimony. Where the best value on a row belongs to an ineligible
  cell, the row carries no trophy rather than a misleading one.
- **`predictions_*` is deliberately not an outcome.** No artifact state can
  reconstruct a prediction that was never spoken, so it stays marker-dependent
  and exists only in the two hybrid cells. Including it would reintroduce
  exactly the cross-cell incomparability this RQ was re-set up to remove.
- **Snapshots, not "the tools".** Every finding describes the vendored snapshot
  at its recorded commit. All three upstreams move. Findings must name the
  snapshot.
- **Skill mechanics differ.** The hybrid cells use `.claude/commands/`, the
  three vendor cells use `.claude/skills/`. Both are discovered by the Skill
  tool, via different paths. If a run looks odd, check the transcript for the
  initial Skill call first.
- **A CLI bump reopens the cells.** `harness_version` is pinned to 2.1.280, the
  current Dockerfile pin. A bump means either updating the pin here — which
  makes the existing runs unmatched — or accepting the CLI as an uncontrolled
  factor. Decide before bumping, not after.
- **Single harness, single model, single kata.** Claude Code on
  opus-5-5-no-thinking, claim-office only. The architecture axis is a net
  negative on Sol/pi (RQ-architecture-axis-sol-pi F-1.6), so nothing here
  transfers to another harness without replication. The TS stack is also the
  only one with a reporter, so this RQ cannot move to Java or Python as it
  stands.

## Findings

See [findings.md](findings.md) — no runs yet.

## Data Source

All runs in `experiments/runs/` with
`workflow ∈ {exact-ptdd-v1-cc, exact-ptdd-v1.1-refactor-subagent-cc, exact-hybrid-v2-testlist-fix-cc, exact-hybrid-v2.4-lab-split-cc, external-superpowers-2026-09-04-cc, external-pocock-2026-09-04-cc, external-kesseler-2026-09-30-cc}`,
`kata = claim-office-example-mapping`, `model = opus-5-5-no-thinking`,
`harness_version = 2.1.280`.

## Sources

- Predecessor on opus-5, closed: [RQ-4.7](../4.7-external-tdd-workflows-opus5/)
- Discipline source: README § "Phase chain metrics"; `experiments/tdd-report.py`, `experiments/stacks/typescript-vitest/tdd-reporter.mjs`
- Candidate analysis and the refactor-position axis: `research/external-tdd-workflows.md`
- Baseline recommendation and the lab line: `research/workflow-dev/workflow-construction.md` § "Current front"
- The hybrid-v2 / hybrid-v2.4 split: [RQ-1.19](../../workflow-dev/1.19-lab-split-neutrality/)
- Opus 5.5 and the CLI gate: [RQ-2.4](../2.4-opus55-current-workflow/)
- The five inherited hybrid-v2 runs: [RQ-4.12](../4.12-old-vs-new-exact-line-opus55/)
- Marker requirements and the vendoring exception: `experiments/workflows/MARKERS.md`
- Workflow adaptations: each workflow's `.claude/rules/tdd-experiment-mode.md`
- Pocock skills: <https://github.com/mattpocock/skills> — `tdd` + `code-review` + `codebase-design` at `6654f6b6`
- Superpowers skill: <https://github.com/obra/superpowers> — `skills/test-driven-development`, v6.3.0 / `b36e0829`
- Kesseler skill: <https://github.com/lexler/skill-factory> — commit `474433af2e`
