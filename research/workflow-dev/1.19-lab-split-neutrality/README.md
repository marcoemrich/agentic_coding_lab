---
id: RQ-lab-split-neutrality
question: "Is v6.1.1-lab-split-cc behaviourally equivalent to v6.1-hybrid-testlist-scope-fix, as the exact-coding baseline recommendation assumes, and if not, does removing the duplicated cycle enumeration restore neutrality? The production files are byte-identical; the rule layout differs (lab infrastructure isolated in rules/lab-only.md, subagent contracts in rules/subagent-prompts.md), and lab-only.md states the Red/Green/Refactor cycle a second time as an imperative chain whose third link makes refactor an unconditional consequence of green. v6.1.4 removes that second statement and keeps the phase-continuation guard."
factors:
  workflow_x_prompt:
    - {workflow: v6.1-hybrid-testlist-scope-fix, prompt: example-mapping}  # the measurement basis of the v6.1 line
    - {workflow: v6.1.1-lab-split-cc,            prompt: example-mapping}  # the export carrier, recommended as the exact-coding baseline
    - {workflow: v6.1.4-continuation-guard-cc,   prompt: example-mapping}  # v6.1.1 minus the duplicated cycle enumeration, guard kept
  kata_base: [game-of-life, claim-office]
controls:
  model: opus-5-no-thinking
outcomes:
  # the primary outcome — this is the metric the original control run omitted,
  # and the one that diverged. Read as a rate against cycle_count, not alone.
  - refactorings_applied
  - cycle_count
  # cost, where the consequence of a changed refactor rate shows up
  - duration_seconds
  - total_tokens
  # correctness must be held: a layout change may not cost completeness
  - verification_pct
  - tests_passing
  - completed_within_budget
  # code quality — the reason the refactor subagent exists at all
  - cc_avg_loc_per_function
  - cc_longest_function
  - cognitive_max
  - mccabe_max
  - smell_total
  - code_mass
  # marker health: v6.1.1 must produce the same four markers as v6.1
  - predictions_correct_rate
  - tests_passed_immediately
min_replicates: 5
status: aktiv
---

# RQ-1.19: Is the Lab/Product Rule Split Behaviourally Neutral?

`v6.1.1-lab-split-cc` is the workflow that
`research/workflow-dev/workflow-construction.md` § "Aktuelle Front" names the
exact-coding baseline for correctness-critical work on opus-5-no-thinking, and
it is the workflow the `exact-coding-baseline-export` skill ships. It exists
to make the export clean: lab-only measurement infrastructure isolated in
`rules/lab-only.md` (deleted on export), subagent contracts in
`rules/subagent-prompts.md` (kept).

The recommendation rests on it being behaviourally identical to
`v6.1-hybrid-testlist-scope-fix`, which is the workflow all the v6.1 findings
were actually measured on. This RQ tests that assumption.

## Motivation

The claim in `workflow-construction.md` is that a control run over three
game-of-life runs shows no performance drop — duration, tokens and
`cycle_count` all inside 1 σ of the v6.1 baseline. That is true as far as it
goes:

| metric | v6.1 GoL (n=5) | v6.1.1 GoL (n=3) | deviation |
|---|---:|---:|---:|
| `duration_seconds` | 620.6 ± 89.8 | 644.0 | 0.26 σ |
| `total_tokens` | 8.0 M ± 1.7 M | 9.1 M | 0.66 σ |
| `cycle_count` | 10.4 ± 1.5 | 10.3 | 0.04 σ |
| **`refactorings_applied`** | **4.4 ± 0.5** | **6.0** | **2.9 σ** |

`refactorings_applied` was not among the compared metrics, and it is the one
that moved. The refactor *rate* went from 0.42 to 0.58 per cycle at an
essentially unchanged cycle count — which is why a cycle-count comparison
looked reassuring.

The 2.9 sigma figure above is itself an n=3 artifact — it is computed against
v6.1's narrow sigma, and v6.1.1 turns out to scatter far more widely. At n=5
with pooled sigma the same comparison is 0.80 sigma. See F-1.19.7.

What survives is the directional finding and the methodological point: the
refactor rate is ~50 % higher on both katas, the cost consequence appears only
on claim-office, and none of that was checked by a control that ran one kata,
at n=3, outside the RQ pipeline.

### The effect is a per-run switch, not a distribution shift

At n=5 on both katas the rates are bimodal. Verified against the raw
transcripts — the `Skill(red)` and `Task(refactor)` call counts reproduce
`cycle_count` and `refactorings_applied` exactly in all ten runs, so this is
agent behaviour and not a parser artifact:

| kata | v6.1 (n=5) | v6.1.1 (n=5) |
|---|---|---|
| claim-office | 0.24 · 0.37 · 0.40 · 0.50 · 0.53 | 0.42 · 0.50 · 0.51 · **1.00** · **1.00** |
| game-of-life | 0.38 · 0.40 · 0.40 · 0.44 · 0.50 | 0.30 · 0.40 · 0.45 · **1.00** · **1.00** |

Two runs in five refactor after *every* cycle (50/50, 47/47 on claim-office;
9/9, 10/10 on game-of-life). The other three sit inside the v6.1 band. The
mean rise 0.41 → 0.69 is entirely those two runs flipping, not a graded
increase — which also explains why the cost is bimodal rather than shifted:

| claim-office | `duration_seconds` | `verification_pct` |
|---|---|---|
| rate 1.00 runs | 5019, 5923 | 1.00, 0.93 |
| rate ~0.5 runs | 2685, 2782, 2796 | 0.93, 1.00, 0.93 |

Roughly double the wall-clock for no gain in correctness.

### The suspected cause, and the repair under test

`rules/lab-only.md` in v6.1.1 did not come from v6.1's
`tdd-experiment-mode.md`. It was derived from the v6.6 lineage with the
end-refactor passages deleted (`diff` against
`v6.6-lab-split-cc/.claude/rules/lab-only.md` is three hunks, all of them
end-refactor removals). It therefore carries text v6.1 never had, in a
`## Phase Continuation` section.

That section does two independent jobs, and they have different consequences.

**The guard** stops a turn ending at a phase boundary. It says nothing about
what the phases are:

> A phase-completion line […] is a **checkpoint, not a terminus**.
> The only place the run ends is after `experiment-done.txt` contains `DONE`.
> Announcing an action is not performing it.

**The enumeration** names the cycle as a chain of imperatives:

> The whole workflow — Test List, then Red/Green/Refactor **for every test**,
> through to writing `experiment-done.txt` — is one continuous autonomous run.
> […]
> - After **Green** → launch the `refactor` subagent.

The enumeration is the suspect, and the reason is sharper than "v6.1.1 says
more". Enumerating the cycle is not itself new — v6.1 does it too, in
`tdd-experiment-mode.md` § "Autonomous Workflow", and v6.1.1 carries that
same list forward almost verbatim into `subagent-prompts.md` § "Workflow
Sequence". What is new in v6.1.1 is a **second** statement of the same cycle,
in a different register: not a descriptive sequence but an imperative chain
with arrows, inside a section whose subject is *do not stop here*, reinforced
by "for every test".

| workflow | statements of the cycle | guard |
|---|---:|---|
| `v6.1-hybrid-testlist-scope-fix` | 1 (`tdd-experiment-mode.md`) | no |
| `v6.1.1-lab-split-cc` | **2** (`subagent-prompts.md` + the continuation chain) | yes |
| `v6.1.4-continuation-guard-cc` | 1 (`subagent-prompts.md`) | yes |

(The step-by-step walkthrough in `tdd.md` §§ 1–5 is not counted: it is
identical in all three and comes from v6.1.)

That framing matches the measured signature. The defect is not "more
refactoring" but `refactorings_applied == cycle_count` **exactly**, in 2 runs
of 5 — the behaviour of a rule read as an unconditional link, not of a raised
propensity.

**The repair under test.** `v6.1.4-continuation-guard-cc` removes the second
statement — the "for every test" sentence and the four-bullet chain — and
keeps the guard. Rules volume 10320 B against v6.1.1's 10625 B, so the arm
isolates the wording rather than the volume, and it differs from v6.1.1 in
`lab-only.md` alone. The section's scope blockquote is corrected there too:
the smoke falsified its claim that the stall has never been seen on Claude
Code, and a self-negating statement in the model's own context is not
defensible.

### Two arms built and retired before the fill

Both were smoked on game-of-life and both are documented here rather than
carried as cells, because neither is a viable export carrier. Their runs and
workflow directories stay on disk.

**`v6.1.2-no-continuation-cc`** — v6.1.1 with the whole section removed,
guard included. One run: rate 0.40, `cognitive_max` 1, `smell_total` 0,
`code_mass` 176, `experiment-done.txt` written. Mechanically clean, and it
would have been the arm that answers the RQ's original question — is the
split alone neutral? It is retired on a design ground, not a measured one:
the guard is wanted, so an arm that drops it cannot become the carrier. The
cost is that "is the split alone neutral" is now answered only indirectly,
by v6.1 against v6.1.4, where the layout and the guard change together.

**`v6.1.3-refactor-gate-cc`** — v6.1.2 plus an explicit per-cycle decision in
`rules/tdd.md` § 4: state `REFACTOR: <what to improve>` and launch the agent,
or `NO REFACTOR: <why this code is already in shape>` and go to the next Red
phase. The intent was to move the judgement from implicit habit to a stated,
greppable decision. Three runs:

| run | completion | rate | decision lines |
|---|---|---:|---|
| 1 | **no `experiment-done.txt`**, 71 s | — | 0 |
| 2 | DONE, 470 s | 0.20 | **0** |
| 3 | DONE, 442 s | 0.20 | 10, of which 8 `NO REFACTOR` |

Both goals missed, in opposite directions. The rate fell to 0.20, below
v6.1's 0.38–0.50 band — explicit permission to decline licenses skipping
rather than sharpening the judgement. And run 2 launched two refactor
subagents without writing a single decision line, so the measurement that
justified the arm is unavailable in half the completed runs. At n=2 that is
"the mechanism does not work as designed", not "the concept fails"; a
differently worded gate could land elsewhere.

The stall in run 1 probably does not belong to the gate: `v6.1.2` has the
same missing section and completed, and two repetitions did not reproduce it.
It is recorded under run completion below.

### A run-completion failure that the pipeline reports as success

The stalled run made one `test-list` skill call, no red/green/refactor, wrote
only the spec file, and stopped to ask about the kata's internally
inconsistent Rule 2 example — in the same message in which it offered to
proceed without an answer. That is the boundary the Phase Continuation
section names, on the harness whose scope note claimed the failure had never
been observed there. Ten of ten prior game-of-life runs on this kata and
model (v6.1 and v6.1.1) wrote `experiment-done.txt`.

It is a 1-in-3 event on a retired arm, so it carries no weight as a rate. It
does carry weight as a pipeline finding: the run is recorded
`exit_reason: ok`, so `aggregate-by-query.py:284` derives
`completed_within_budget: true` for a run with null metrics throughout. The
documented completion signal (`jq .run_status.exit_reason`) reports it as
fine. The reliable signal is the presence of `experiment-done.txt` — check it
before aggregating any cell of this RQ.

### Why the kata matters here

The cost consequence of a refactor-rate shift scales with cycle count and
codebase size, so game-of-life structurally suppresses it:

- GoL, ~10 cycles: 0.42 → 0.58 is about 1.6 extra subagent spawns on a small
  single-file library. Duration +4 % — inside the noise.
- claim-office, ~45 cycles: 0.41 → 1.00 would be roughly 30 extra spawns, each
  reading a larger codebase.

Validating a workflow only on game-of-life runs against the lab's own
thrice-confirmed anti-pattern ("GoL-Sieger ≠ claim-office-Sieger",
`workflow-construction.md` on RQ-1.4, F-model-novel.4, RQ-1.9). Both katas are
therefore factors here, not a control.

## Hypotheses

- **H1 (the refactor rate differs)** — `refactorings_applied / cycle_count` is
  higher for v6.1.1 than for v6.1 on both katas, at ≥ 1 σ. Falsifier: the GoL
  gap disappears at n=5, which would make the 2.9 σ above an n=3 artifact.
- **H2 (the effect is larger on claim-office)** — the rate gap on claim-office
  exceeds the gap on game-of-life. This is the kata-interaction claim; if it
  holds, no single-kata validation of a workflow change is sufficient.
- **H3 (cost follows the rate on the large kata only)** — `duration_seconds`
  and `total_tokens` differ by ≥ 1 σ on claim-office but not on game-of-life.
  This is what would make the original control's conclusion wrong in effect
  while being right in its own numbers.
- **H4 (correctness is held)** — `verification_pct` and `tests_passing` are
  indistinguishable between the two. A rule-layout change must not cost
  completeness. A drop here would be a much more serious problem than cost.
- **H5 (quality is unchanged or better)** — if v6.1.1 refactors more, its
  decomposition metrics (`cc_avg_loc_per_function`, `cc_longest_function`)
  should be equal or better. If it refactors more and the code is *not* better,
  the extra refactor passes are pure cost.
- **H6 (markers stay healthy)** — v6.1.1 produces `predictions_total ≈ 2 ×
  cycle_count` and non-zero `refactorings_applied` on both katas, so the
  workflow remains measurable. Confirmed at n=1 on claim-office (50 cycles,
  100 predictions, 50 refactorings).
- **H7 (the duplicated enumeration is the mechanism)** — v6.1.4's refactor
  rate is indistinguishable from v6.1's on both katas, and no v6.1.4 run
  reaches rate 1.00. This is the load-bearing hypothesis: if it holds, the
  export carrier is repaired by deleting one sentence and four bullets, and
  the recommendation needs no cost caveat. Falsifier: v6.1.4 still produces
  always-refactor runs, which would put the cause elsewhere in the split —
  the rules volume itself, or the `Rule Files` table in `tdd.md`.
- **H8 (the guard is not the mechanism)** — v6.1.4 keeps the guard and still
  reaches the v6.1 rate. Together with H7 this is what makes the repair a
  deletion of four bullets rather than of the section: the anti-stall
  property and the rate defect live in different halves of the same text.
  Falsifier: v6.1.4 behaves like v6.1.1, in which case the guard and the
  enumeration cannot be separated by wording and the carrier question
  reopens.
- **H9 (completion is not a free variable)** — v6.1.4 writes
  `experiment-done.txt` in 5 of 5 runs on both katas. This is a
  precondition, not a result: an arm that cannot finish reliably is
  disqualified as an export carrier whatever its refactor rate does, and its
  quality metrics are not comparable, because they describe a partial run.
  Checked on the marker file, not on `exit_reason` — see the pipeline note
  above.

## What the repaired workflow has to achieve

The target is not a particular refactor rate. It is a workflow that

1. **finishes every run**, checked on `experiment-done.txt`, not on
   `exit_reason` — see the pipeline note above;
2. **keeps the lab/product rule split**, so the
   `exact-coding-baseline-export` skill still ships it by deleting one file;
3. **does not cost materially more than v6.1** in `duration_seconds` and
   `total_tokens`.

The refactor rate is the suspected mechanism, not the goal. It earns its
place among the outcomes because it explains *why* the cost moves, and
because an always-refactor run is the signature to watch for — but a v6.1.4
that lands at a slightly different rate and at v6.1's cost has passed.

Criterion 3 is where v6.1.1 fails, and it fails on the large kata only:

| kata | metric | v6.1 (n=5) | v6.1.1 (n=5) | Δ |
|---|---|---:|---:|---:|
| claim-office | `duration_seconds` | 2661 ± 411 | 3841 ± 1523 | **+44 %** |
| claim-office | `total_tokens` | 81.9 ± 17.0 M | 126.2 ± 41.9 M | **+54 %** |
| game-of-life | `duration_seconds` | 621 ± 90 | 687 ± 106 | +11 % |
| game-of-life | `total_tokens` | 8.0 ± 1.7 M | 9.8 ± 1.4 M | +22 % |

So the pass mark for v6.1.4 on claim-office is a mean inside v6.1's own
scatter — `duration_seconds` ≤ 3072 s and `total_tokens` ≤ 98.9 M, i.e.
v6.1's mean + 1 σ — with no run at `refactorings_applied == cycle_count`.
On game-of-life the two references are barely separated, which is the same
reason the original control run missed the defect: this criterion cannot be
evaluated on the small kata.

## Design

```
Factor:   workflow_x_prompt — 3 levels, all example-mapping
Factor:   kata_base         — game-of-life, claim-office
Control:  model             — opus-5-no-thinking (native subscription route)

Cells:      6
Replicates: n = 5
```

The v6.1 and v6.1.1 cells are complete (n=5 each on both katas; the v6.1.1
claim-office cell was filled by RQ-4.7, which counts here too because
aggregation is query-based). v6.1.4 has 2 game-of-life runs from its smoke,
which count as well, so the fill is 8 runs: 3 game-of-life and 5
claim-office.

**Workflow gradient.** Each step changes exactly one thing, so any effect is
attributable:

| level | vs. its predecessor | statements of the cycle | guard | rules |
|---|---|---:|---|---:|
| `v6.1-hybrid-testlist-scope-fix` | — (the measurement basis) | 1 | no | 7202 B |
| `v6.1.1-lab-split-cc` | lab/product rule split, lab file from the v6.6 lineage | **2** | yes | 10625 B |
| `v6.1.4-continuation-guard-cc` | duplicated cycle enumeration removed | 1 | yes | 10320 B |

v6.1.4 differs from v6.1.1 in `lab-only.md` alone, and at 10320 against
10625 B it is not a volume-reduction arm — it isolates the wording. Its four
parser markers are present (`Skill`/command files, `Red Phase Complete`, the
`Correct`/`Incorrect` lines, `experiment-done.txt`).

Note what the gradient cannot separate: v6.1 has neither the split nor the
guard, v6.1.4 has both. A v6.1.4 that matches v6.1 on cost therefore shows
the *combination* is neutral, which is what the product decision needs, but
it does not attribute neutrality to either half on its own. The arm that
would have done that (`v6.1.2`, split without guard) is documented above and
retired.

## Caveats

- **Do not average across katas** — the whole point is that the two behave
  differently. Every comparison is within one kata.
- **`refactorings_applied` is only meaningful as a rate.** Compare
  `refactorings_applied / cycle_count`; the raw count moves with cycle count,
  which itself varies by kata and run.
- **The 2.9 σ figure above is n=3 against n=5** and uses the v6.1 σ. It is the
  motivation for the RQ, not evidence to be carried into findings.
- **The v6.1.1 game-of-life runs predate two pipeline fixes** — the missing
  `measure-tdd-rigour.py` container mount and the single-spec-file test
  counting. They need `reanalyze-in-container.sh` before aggregation, or their
  transcript-derived metrics will be null and their test metrics undercounted.
- **This RQ has product consequences, not just research ones.** v6.1.1 is what
  the `exact-coding-baseline-export` skill ships. If H1–H3 hold, either the
  export carrier changes or the recommendation is restated with its real cost.
  H7–H9 exist to give that decision a third option: a repaired carrier that
  keeps the split.
- **Check `experiment-done.txt`, not `exit_reason`, before aggregating.** A
  run that ends its turn early is filed `exit_reason: ok`, and
  `aggregate-by-query.py:284` then derives `completed_within_budget: true`
  with every metric null. One such run exists in this pool (on the retired
  `v6.1.3` arm).
- **Two retired arms have runs in `experiments/runs/`.** `v6.1.2` (1 run) and
  `v6.1.3` (3 runs) are no longer cells of this RQ, so the selector excludes
  them and they do not enter any pivot. Their workflow directories and runs
  stay on disk; what they showed is written up under "Two arms built and
  retired before the fill". Do not quote their numbers as cell results — n=1
  and n=2.
- **v6.1.4 keeps the guard, so the anti-stall property is untested by
  contrast.** No arm in the final design lacks it, which is deliberate
  (criterion 1 wants it) but means this RQ cannot measure what the guard is
  worth. If that becomes interesting, it is a separate RQ, not a cell here.

## Findings

See [findings.md](findings.md) — no aggregation yet.

## Data Source

All runs in `experiments/runs/` with
`workflow ∈ {v6.1-hybrid-testlist-scope-fix, v6.1.1-lab-split-cc,
v6.1.4-continuation-guard-cc}`,
`kata ∈ {game-of-life-example-mapping, claim-office-example-mapping}`,
`model = opus-5-no-thinking`.

## Sources

- The recommendation under test: `research/workflow-dev/workflow-construction.md` § "Aktuelle Front"
- v6.1 reference data: [RQ-4.5](../../questions-claude/4.5-architecture-axis-opus5/summary.md)
- The claim-office n=1 observation: [RQ-4.7](../../questions-claude/4.7-external-tdd-workflows-opus5/)
- Export consumer: `.claude/skills/exact-coding-baseline-export/SKILL.md`
- Marker requirements: `experiments/workflows/MARKERS.md`
