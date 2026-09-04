---
id: RQ-lab-split-neutrality
question: "Is v6.1.1-lab-split-cc behaviourally equivalent to v6.1-hybrid-testlist-scope-fix, as the exact-coding baseline recommendation assumes, and if not, which edit restores neutrality? The production files are byte-identical; the rule layout differs (lab infrastructure isolated in rules/lab-only.md, subagent contracts in rules/subagent-prompts.md) and lab-only.md carries a Phase Continuation section that enumerates a per-cycle refactor step. Three repairs are measured against it: removing that section (v6.1.2), keeping its continuation guard but dropping the per-cycle enumeration (v6.1.4), and adding an explicit per-cycle REFACTOR / NO REFACTOR decision (v6.1.3)."
factors:
  workflow_x_prompt:
    - {workflow: v6.1-hybrid-testlist-scope-fix, prompt: example-mapping}  # the measurement basis of the v6.1 line
    - {workflow: v6.1.1-lab-split-cc,            prompt: example-mapping}  # the export carrier, recommended as the exact-coding baseline
    - {workflow: v6.1.2-no-continuation-cc,      prompt: example-mapping}  # v6.1.1 minus the Phase Continuation section
    - {workflow: v6.1.3-refactor-gate-cc,        prompt: example-mapping}  # v6.1.2 plus an explicit per-cycle refactor decision
    - {workflow: v6.1.4-continuation-guard-cc,   prompt: example-mapping}  # v6.1.1 minus the per-cycle enumeration, guard kept
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

### The suspected cause, and the two repairs under test

`rules/lab-only.md` in v6.1.1 did not come from v6.1's
`tdd-experiment-mode.md`. It was derived from the v6.6 lineage with the
end-refactor passages deleted (`diff` against `v6.6-lab-split-cc/.claude/rules/lab-only.md`
is three hunks, all of them end-refactor removals). It therefore carries text
v6.1 never had, most of it in a `## Phase Continuation` section that
enumerates the cycle step by step:

> The whole workflow — Test List, then Red/Green/Refactor **for every test**,
> through to writing `experiment-done.txt` — is one continuous autonomous run.
> […]
> - After **Green** → launch the `refactor` subagent.

That section declares itself unnecessary on this harness: *"Scope: not needed
on Claude Code. […] On Claude Code the failure mode below has never been
observed."* It exists for parity with the pi and cursor-agent variants, where
it fixes a real mid-run stall.

Three candidate repairs are measured as their own cells:

- **`v6.1.2-no-continuation-cc`** — v6.1.1 with that section removed, and the
  two cross-references to it updated. Rules volume 10625 → 9184 B. Nothing
  else differs; the production files stay byte-identical to v6.1's.
- **`v6.1.4-continuation-guard-cc`** — v6.1.1 with only the *enumeration*
  removed from that section: the sentence naming "Red/Green/Refactor for
  every test" and the four-bullet chain whose third link is "After **Green**
  → launch the `refactor` subagent". What stays is the guard — a phase line
  is a checkpoint, not a terminus; the run ends only at
  `experiment-done.txt`. Rules volume 10320 B, essentially v6.1.1's, so the
  arm isolates the enumeration rather than the volume. The section's scope
  blockquote is corrected here too, because the smoke falsified its claim
  that the stall has never been seen on Claude Code; leaving a self-negating
  statement in the model's context is not an option.
- **`v6.1.3-refactor-gate-cc`** — v6.1.2 plus an explicit per-cycle decision
  in `rules/tdd.md` § 4: state `REFACTOR: <what to improve>` and launch the
  agent, or `NO REFACTOR: <why the code is already in shape>` and go to the
  next Red phase. The point is to make the judgement explicit and recorded
  instead of implicit-and-sometimes-skipped. Rules volume 10307 B, so it is
  *not* a volume-reduction arm — it isolates the framing.

### The removal is not free: a run-completion failure at n=1

The first smoke run of `v6.1.3` (game-of-life, 2026-09-04) ended its turn
after the Test List: one `test-list` skill call, no red/green/refactor, no
`experiment-done.txt`, 71 s. It stopped to ask about the kata's internally
inconsistent Rule 2 example — in the same message in which it offered to
proceed without an answer.

That is precisely the boundary the deleted section names, on the harness
whose scope note claimed *"On Claude Code the failure mode below has never
been observed."* The kata's ambiguity does not explain it on its own: ten of
ten prior game-of-life runs on this kata and model (v6.1 and v6.1.1) wrote
`experiment-done.txt`.

Attribution is open at n=1 — `v6.1.2` also lost the section and completed
normally (10 cycles, rate 0.40, DONE). Either the guard does real work on
Claude Code and v6.1.2 was lucky, or v6.1.3's deliberative framing
generalised past the refactor phase. `v6.1.4` exists to separate those: it
keeps the guard and drops only the enumeration.

**Pipeline consequence.** The stalled run is recorded `exit_reason: ok`, so
`aggregate-by-query.py` derives `completed_within_budget: true` for a run
with null metrics throughout. The documented completion signal
(`jq .run_status.exit_reason`) reports this run as fine. The reliable signal
is the presence of `experiment-done.txt`; check it before aggregating any
cell of this RQ.

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
- **H7 (removing the section restores neutrality)** — v6.1.2's refactor rate
  is indistinguishable from v6.1's on both katas, and no v6.1.2 run reaches
  rate 1.00. This is the load-bearing hypothesis: if it holds, the export
  carrier is repaired by a deletion and the recommendation needs no cost
  caveat. Falsifier: v6.1.2 still produces always-refactor runs, which would
  put the cause somewhere else in the split — the rules volume itself, or the
  `Rule Files` table in `tdd.md`.
- **H8 (the explicit gate suppresses the switch without suppressing
  refactoring)** — v6.1.3 shows neither always-refactor runs nor a rate below
  the v6.1 band; the decision is made per cycle rather than by run-level
  habit, so its rate variance across replicates is *lower* than v6.1.1's.
  Two ways this fails, and they point in opposite directions: being asked the
  question every cycle raises its salience and the model answers `REFACTOR`
  almost always (rate → 1.00, i.e. the gate reproduces the defect it was
  meant to fix), or the explicit permission to decline licenses skipping
  (rate below v6.1). Either outcome retires v6.1.3 in favour of v6.1.2.
- **H9 (the gate does not cost correctness)** — v6.1.3 holds
  `verification_pct` at the v6.1 level. A methodology change that survives
  export is only acceptable if it is correctness-neutral; this is the
  gating check before it could ever become the export carrier.
- **H10 (the enumeration is the mechanism, the guard is not)** — v6.1.4
  reaches the v6.1 refactor rate *and* completes every run. This separates
  the two jobs the Phase Continuation section does at once: run-completion
  safety, and enumerating refactor as an unconditional link in the cycle.
  If H10 holds, the repair is to delete four bullets and one sentence, not
  the section — and `v6.1.4` becomes the export-carrier candidate over
  `v6.1.2`. Falsifiers, each pointing somewhere different: v6.1.4 still
  produces always-refactor runs (the enumeration is not the mechanism — look
  at the rules volume or the `Rule Files` table next), or v6.1.4 stalls the
  way v6.1.3 did (the guard is not sufficient either, and the completion
  problem is independent of the rate problem).
- **H11 (completion is not a free variable)** — every arm writes
  `experiment-done.txt` in 5 of 5 runs on both katas. This is a
  precondition, not a result: an arm that cannot finish reliably is
  disqualified as an export carrier whatever its refactor rate does, and its
  quality metrics are not comparable because they describe a partial run.

## Design

```
Factor:   workflow_x_prompt — 5 levels, all example-mapping
Factor:   kata_base         — game-of-life, claim-office
Control:  model             — opus-5-no-thinking (native subscription route)

Cells:      10
Replicates: n = 5
```

The v6.1 and v6.1.1 cells are complete (n=5 each on both katas; the v6.1.1
claim-office cell was filled by RQ-4.7, which counts here too because
aggregation is query-based). The repair cells are being filled; the smoke
runs count toward them, since aggregation is query-based and does not care
which batch produced a run.

**Workflow gradient.** The four levels form a chain in which each step changes
exactly one thing, so any effect is attributable:

| level | vs. its predecessor | rules volume |
|---|---|---:|
| `v6.1-hybrid-testlist-scope-fix` | — (the measurement basis) | 7202 B |
| `v6.1.1-lab-split-cc` | lab/product rule split, lab file from the v6.6 lineage | 10625 B |
| `v6.1.4-continuation-guard-cc` | per-cycle enumeration removed, guard kept | 10320 B |
| `v6.1.2-no-continuation-cc` | whole `## Phase Continuation` section removed | 9184 B |
| `v6.1.3-refactor-gate-cc` | on top of v6.1.2: explicit `REFACTOR` / `NO REFACTOR` decision | 10307 B |

v6.1.4 and v6.1.2 are a nested pair — v6.1.4 removes the enumeration,
v6.1.2 removes the enumeration *and* the guard — so the two effects separate.
v6.1.3 builds on v6.1.2, which is why its stall cannot be attributed without
v6.1.4 in the field.

All three repair workflows are byte-identical to v6.1.1 outside `rules/`;
v6.1.4 differs from v6.1.1 in `lab-only.md` alone. The four parser markers
are present in all three (`Skill`/command files, `Red Phase Complete`, the
`Correct`/`Incorrect` lines, `experiment-done.txt`).

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
  H7/H8 exist to give that decision a third option: a repaired carrier.
- **`refactorings_applied` counts launched subagents, nothing else.** On
  v6.1.3 a `NO REFACTOR` decision is therefore indistinguishable in the
  metric from a cycle that skipped the step silently — which is precisely the
  distinction the arm is about. Count the declines separately from the
  transcript; the decision lines are plain text, not markers, and cannot
  collide with the `## Refactor` text-marker fallback in
  `analyze_transcript.py`:
  ```bash
  grep -c 'NO REFACTOR:' <run_dir>/transcript.jsonl
  ```
  Report it as an observation in findings, not as an outcome — it is not a
  pipeline metric and `aggregate-by-query.py` does not know it.
- **v6.1.3 changes methodology, not just lab infrastructure.** Its edit lives
  in `rules/tdd.md`, so it survives export. That is deliberate — an implicit
  per-cycle refactor step is a defect in the exported workflow too — but it
  raises the bar: v6.1.3 only becomes a carrier candidate if H9 holds.
- **Do not read v6.1.3 as a volume-reduction arm.** At 10307 B it sits
  essentially at v6.1.1's 10625 B. If both v6.1.2 and v6.1.3 come out neutral,
  rules volume is not the mechanism and the wording is.

## Findings

See [findings.md](findings.md) — no aggregation yet.

## Data Source

All runs in `experiments/runs/` with
`workflow ∈ {v6.1-hybrid-testlist-scope-fix, v6.1.1-lab-split-cc,
v6.1.2-no-continuation-cc, v6.1.3-refactor-gate-cc,
v6.1.4-continuation-guard-cc}`,
`kata ∈ {game-of-life-example-mapping, claim-office-example-mapping}`,
`model = opus-5-no-thinking`.

## Sources

- The recommendation under test: `research/workflow-dev/workflow-construction.md` § "Aktuelle Front"
- v6.1 reference data: [RQ-4.5](../../questions-claude/4.5-architecture-axis-opus5/summary.md)
- The claim-office n=1 observation: [RQ-4.7](../../questions-claude/4.7-external-tdd-workflows-opus5/)
- Export consumer: `.claude/skills/exact-coding-baseline-export/SKILL.md`
- Marker requirements: `experiments/workflows/MARKERS.md`
