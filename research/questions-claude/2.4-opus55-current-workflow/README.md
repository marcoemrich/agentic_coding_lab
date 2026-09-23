---
id: RQ-opus55-current-workflow
question: "Does the maintained EXACT Coding Predictive TDD workflow still change code quality on Opus 5.5 the way it does on Opus 5, and does Opus 5.5 still need it at all compared with a minimal inline-TDD instruction?"
factors:
  model_x_workflow:
    - {model: opus-5-no-thinking,   workflow: baseline-inline-tdd-v1.1-local-git-cc}
    # The v1 cell accepts its pre-rename spelling: exact-ptdd-v1-cc is the
    # product name for content identical to exact-sol-v1.6-test-list-dimensions-cc
    # (LINEAGE.yaml), so both names resolve to the same cell.
    - {model: opus-5-no-thinking,   workflow: {any: [exact-ptdd-v1-cc, exact-sol-v1.6-test-list-dimensions-cc]}}
    - {model: opus-5-5-no-thinking, workflow: baseline-inline-tdd-v1.1-local-git-cc}
    - {model: opus-5-5-no-thinking, workflow: exact-ptdd-v1-cc}
controls:
  kata_base: claim-office
  prompt: example-mapping
  # 2.1.280, not 2.1.267: Opus 5.5 is gated behind it (measured, see "The CLI
  # gate"). Pinning the axis is what keeps the model factor separable from the
  # CLI bump — it also costs this RQ the 20 pre-bump Opus 5 runs it was
  # originally designed to reuse. That is the intended trade, not an oversight.
  harness_version: "2.1.280"
outcomes:
  # Correctness — a precondition here, not the signal. See "Caveat on the
  # primary outcome": both Opus 5 cells sit at 0.99–1.00 on this kata.
  - verification_pct
  - tests_passing
  - completed_within_budget
  # Code quality — where the workflow effect is actually visible
  - lines_of_code
  - code_mass
  - smell_total
  - smell_complexity
  - smell_duplication
  - smell_magic_numbers
  - smell_code_quality
  - cognitive_max
  - cognitive_avg
  - mccabe_max
  - mccabe_avg
  - unit_count
  - unit_size_max
  - unit_size_avg
  - unit_size_median
  # Test suite shape
  - tests_total
  - test_lines
  - test_blocks
  - test_cases_total
  - test_cases_first_block
  - mutation_score
  - mutants_total
  - mutants_survived
  - mutants_no_coverage
  # TDD discipline is deliberately NOT an outcome here. On Opus 5.5 every
  # text-derived marker zeroes while the discipline demonstrably happens, so
  # refactorings_applied / predictions_* / red_verified would publish a parser
  # artefact as a model difference. See "The markers do not survive".
  # Context
  - duration_seconds
  - total_tokens
  - cost_usd
min_replicates: 5
status: aktiv
---

# RQ-2.4: Opus 5.5 under the Current EXACT Coding Workflow

## Question

`exact-ptdd-v1-cc` is the universal EXACT Coding default on native Opus 5
(`research/workflow-dev/model-recommendation-matrix.md`). Every finding that
recommends it was measured on `opus-5-no-thinking`. Opus 5.5 is now the current
Opus, and two things could have changed independently:

1. **The workflow could behave differently on the new model** — same scaffolding,
   different result.
2. **The new model could no longer need the scaffolding** — a stronger model may
   arrive at the same code from a bare inline-TDD instruction, in which case the
   workflow costs tokens and wall-clock for nothing.

A model-only comparison answers the first and is silent on the second, which is
the one that decides whether the recommendation survives. The design is
therefore a 2×2 over model and workflow, and the quantity of interest is not any
single cell but the **inline→EXACT delta within each model**.

## All four cells are measured fresh

The design was originally drawn to reuse 20 existing Opus 5 runs from
RQ-exact-coding-typescript — same kata, prompt and stack — for 10 new runs
total. The CLI gate below removed that option: those runs are on 2.1.267 and
Opus 5.5 cannot be. All four cells therefore run on 2.1.280:

| model | workflow | n | |
|---|---|---:|---|
| `opus-5-no-thinking` | `baseline-inline-tdd-v1.1-local-git-cc` | 0 | to fill |
| `opus-5-no-thinking` | `exact-ptdd-v1-cc` (+ pre-rename spelling) | 0 | to fill |
| `opus-5-5-no-thinking` | `baseline-inline-tdd-v1.1-local-git-cc` | 0 | to fill |
| `opus-5-5-no-thinking` | `exact-ptdd-v1-cc` | 0 | to fill |

**20 runs at `min_replicates: 5`**, not 10. Re-measuring the Opus 5 arm is not
optional: reading a 2.1.280 Opus 5.5 cell against a 2.1.267 Opus 5 cell would
confound the CLI version with the model factor, which is the failure F-1.19.9
caught and the reason the `harness_version` axis exists.

The 20 pre-bump Opus 5 runs stay in the pool and keep serving
RQ-exact-coding-typescript. They also make a period control available here, at
no extra cost, by swapping the control for a factor over both CLI versions:

```yaml
factors:
  model_x_workflow:
    - {model: opus-5-no-thinking, workflow: exact-ptdd-v1-cc}
  harness_version: ["2.1.280", "2.1.267"]
```

If that control shows the bump is behaviourally neutral on Opus 5, the findings
here connect to the existing TypeScript line. If it does not, the bump is a live
factor for the whole lab and that is a finding of its own.

The `{any: [...]}` on the second cell is the outcome-neutral rename case the
convention allows: `exact-ptdd-v1-cc` and
`exact-sol-v1.6-test-list-dimensions-cc` are the same content under the product
name and the research name (LINEAGE.yaml). It is **not** a model `any:`, which
would smear a factor.

## Wiring

`opus-5-5` and `opus-5-5-no-thinking` were added for this RQ:

- `MODEL_CONFIGS` in `experiments/docker/run-batch.sh` → `claude-opus-5-5`. Bare
  `claude-*`, so it takes the native OAuth bypass and runs on the mounted Max
  subscription rather than through Requesty, exactly like the `opus-5` cells.
- `PRICES` in `experiments/compute-cost.py` → **$4.00 / $20.00 / $0.20 cache read
  / $5.00 cache write** (Anthropic list price, `platform.claude.com/docs` models
  overview and `claude.com/pricing`, retrieved 2026-09-23).

**The cache-read tariff is the trap in any cost comparison here.** Opus 5.5
prices cache reads at 0.05× base input ($0.20) where Opus 5 uses the standard
0.1× ($0.50). On the EXACT Coding workflows ~99 % of tokens are cache reads
(F-fable-vs-opus5.7), so Opus 5.5 is structurally cheaper at *identical* token
counts — a `cost_usd` win proves the tariff, not the model. Compare
`total_tokens` first, `cost_usd` second. As always, `cost_usd` is a list-price
comparison value, not an invoice: nothing is billed per token on the
subscription (CLAUDE.md).

## The CLI gate — measured, and it bites

Fable 5.1 established the failure mode: the model answered 200 on a bare API
call and got a hard 400 through Claude Code 2.1.170 (*"version 2.1.251 or newer
is required"*), which is why the lab pin moved to 2.1.267 (RQ-fable-vs-opus5).
Opus 5.5 repeats it one generation on. A smoke run on 2.1.267
(game-of-life / `exact-ptdd-v1-cc` / `opus-5-5-no-thinking`, 2026-09-23) died
after 2 seconds:

```
API Error: 400 Claude Code 2.1.267 does not support this model;
version 2.1.280 or newer is required.
```

**The lab pin must therefore move to 2.1.280** (at time of measurement the
latest published `@anthropic-ai/claude-code`, and exactly the stated minimum).
The consequence for this RQ is the 20-run scope above rather than 10.

The smoke also surfaced a second, softer warning worth keeping:

```
"claude-opus-5-5" isn't described by this version's model catalog […]
auto-compact keeps this session within 200k tokens (the context window it assumes)
```

Opus 5.5 has a 1M context window. On a CLI whose catalog does not know the
model, auto-compact would fire at 200k and silently change the run's context
behaviour — a confound that would look like a model effect. 2.1.280 is expected
to carry the model in its catalog; **verify that the warning is gone** in the
re-smoke before filling any cell, and do not paper over it with
`CLAUDE_CODE_DISABLE_UNKNOWN_MODEL_WINDOW_ENFORCEMENT` or a `[1m]` suffix — a
run on a hand-forced context window is not comparable to the Opus 5 cells.

The `harness_version` control enforces the separation rather than leaving it to
discipline: `aggregate-by-query.py` filters on the axis, so pre-bump runs cannot
leak into a cell even on a re-aggregation months later.

### The bump is lab-wide, not RQ-local

The CLI version lives in `experiments/docker/Dockerfile` and applies to every
future Claude Code run in the lab, not just this RQ. Two obligations follow,
both from CLAUDE.md:

- A subagents-arm workflow must be verified end-to-end before the pin is
  considered good (2.1.37 hung on `.claude/agents/`; the arm is the known
  fragile one).
- After the Dockerfile change, `docker compose --profile batch
  --profile batch-retry build` — building only the `experiment` service leaves
  batches running on the old image, and the symptom is a `command not found`
  that looks like anything but a stale image.

## The `-no-thinking` label is nominal on Opus 5.5 — measured

Opus 5.5 thinks **adaptively and always on**, and the manual
`thinking.type: "enabled"` mode is not accepted from the 4.6 generation onward
(models overview, 2026-09-23). The lab's `-no-thinking` variant is
`MAX_THINKING_TOKENS=0` in `run-batch.sh`, and on this model it does not
suppress reasoning: the 2.1.280 smoke run emitted **39 thinking blocks** with
`thinking: false` set. Fable 5.1 did the same (37 blocks) — the flag is
advisory on both.

The label is kept anyway, because dropping it would break the axis the Opus 5
cells sit on. What it means must not be overstated: **it names the flag the lab
sets, not a property of the run.** No sentence in the findings may describe an
Opus 5.5 cell as "without reasoning".

## The markers do not survive — and the discipline does

The 2.1.280 re-smoke (game-of-life / `exact-ptdd-v1-cc` /
`opus-5-5-no-thinking`, 2026-09-23) completed cleanly — `exit_reason: ok`,
`experiment-done.txt` written, 14 tests passing, 49 LoC — with every
TDD-discipline metric at zero:

| | Opus 5.5 smoke | Opus 5 reference (n=10, RQ-exact-coding-typescript) |
|---|---:|---:|
| `cycle_count` | 1 | 1 in 6 of 10 runs |
| `refactorings_applied` | **0** | 23–68 |
| `predictions_total` | **0** | 44–136 |
| assistant **text** blocks | 3 | — |
| assistant **thinking** blocks | 39 | — |

**`cycle_count = 1` is not the signal.** It is the normal reading of this
workflow on Claude Code, because `exact-ptdd-v1-cc` invokes one entry skill
rather than a Skill call per phase — six of the ten Opus 5 reference runs show
it too. The anomaly is `refactorings_applied` and `predictions_total`, which are
text-derived (MARKERS.md markers 2/3 and the `## Refactor` text fallback) and
have nothing to read when a model emits three text blocks.

**The discipline itself happened.** Opus 5.5's closing summary reports
activating tests one at a time, names a prediction it got wrong and recorded as
Incorrect, and self-reports a process slip (two tests activated together). The
open question left hanging for Fable 5.1 — does the model make the predictions
or skip them? — is therefore **answered in the affirmative for Opus 5.5 by
direct reading of the transcript**. This is a third distinct route to
`predictions_total = 0`, alongside Fable 5.1 (no red-phase text at all) and
Sonnet 5 (red-phase text under a renamed header): Opus 5.5 runs the cycle in
thinking blocks and narrates it once, at the end.

Consequences, and they are not symmetric:

- The TDD-discipline metrics are **dropped from `outcomes`**. Publishing 0
  against 23–68 would report a parser artefact as a model difference — the
  single most available wrong finding in this RQ.
- Correctness, code quality, mutation score, tokens and cost are unaffected:
  none of them is text-derived.
- `red_verified` / `red_unverified` / `test_blocks` / `test_cases_total` came
  back `null` rather than `0` on the smoke, so whether they are computed at all
  for this run shape is **not established**. Check them on the first fill run
  before reading anything into them.
### Confirmed on the fill runs — and worse than "zero"

The block profile was smoke-measured at n=1 and generalizes cleanly across the
five `exact-ptdd-v1-cc` × `opus-5-5-no-thinking` runs:

| cell | text blocks | thinking blocks | tool_use |
|---|---:|---:|---:|
| `exact-ptdd-v1-cc` × opus-5 | 75–99 | **0** | 77–102 |
| `exact-ptdd-v1-cc` × opus-5.5 | 6–9 | **131–153** | 105–116 |
| `baseline-inline-tdd` × opus-5.5 | 7–10 | 5–9 | 11–15 |

Opus 5 emits no thinking blocks at all on this workflow and narrates every
phase; Opus 5.5 inverts both. The mechanism is settled.

What the fill runs add is that the damage is **erratic, not uniform**, which is
worse for a comparison than a clean zero. Across the five 5.5 runs
`predictions_total` reads 2, 0, 2, 8, 0 and `cycle_count` reads 1, 100, 1, 1, 2.
The 100 is the inline-tool inference fallback (MARKERS.md § "inline-tool
inference") taking over on a marker-free run and counting tool invocations,
while the 1s are the degenerate marker path. **`cycle_count` on this cell is
therefore a mix of two different measurement mechanisms** and is not a quantity.
It is not among `outcomes` and must not be read into the findings either.

The same batch ran `exact-subagents-v2-testlist-fix-cc` on `opus-5-no-thinking`
on the same CLI and came back healthy (cycle 12, refactor 3, predictions 23/24),
which is what rules out 2.1.280 as the cause and makes this model-specific.

## Caveat on the primary outcome

Correctness is saturated on this cell and is a gate, not a result. On
Claim Office / TypeScript, RQ-exact-coding-typescript measured
`verification_pct` at 1.00 (inline, n=5) and 0.99 (EXACT v1, n=10, minimum
0.93). At n=5 nothing short of an outright break is distinguishable.

Consequences for reading this RQ:

- A 5/5 against 4/5 split between two cells is not evidence of a model or
  workflow effect.
- Code quality, mutation score and the test-suite shape carry the argument.
  They are continuous and did separate the cells in the reference RQ.
- If a 5.5 cell fails a *different* verification case than the Opus 5 cells did,
  that is qualitative and worth more than the aggregate — check the per-case
  output, not only `verification_pct`.

## Hypotheses

All six were answered by the 20 fill runs. The results live in `findings.md`;
what follows is the hypothesis as posed and how it came out, so that later
readers can see what was predicted rather than only what was found.

- **H1 (correctness is a floor) — held.** All four cells at 0.99–1.00,
  `tests_passing` 5/5 everywhere. The row settles nothing, as designed.
- **H2 (the delta shrinks on the newer model) — falsified.** It grows: every
  complexity and unit-size gap is larger on Opus 5.5 than on Opus 5 (F-2.4.1),
  and the inline arm on 5.5 is *worse* than on 5 (F-2.4.2). The argument to
  retire the workflow did not materialize; the opposite did.
- **H3 (mutation score separates where correctness cannot) — held, with the
  counts doing the work.** The score moves +0.20 on Opus 5.5 and −0.03 on
  Opus 5 (F-2.4.3). The mutant counts were load-bearing exactly as anticipated:
  the Opus 5.5 inline cell's weak score survives the denominator check, because
  it has both the largest population and the most survivors.
- **H4 (cost is a tariff, not a result) — held, and more sharply than posed.**
  Opus 5.5 spends 70 % *more* tokens under the workflow and still costs 16 %
  less (F-2.4.4). The token and cost axes point in opposite directions, so the
  tariff is not merely part of the story — it is the whole of it.
- **H5 (the markers survive the model change) — falsified.** Not as a clean
  zero but as an erratic mix of two measurement mechanisms; the metrics are out
  of `outcomes` (F-2.4.5). The block profile that the smoke saw at n=1 held
  across all five fill runs.
- **H6 (the CLI gate is clear) — falsified.** `claude-opus-5-5` gets a hard 400
  on 2.1.267 and needs 2.1.280. The RQ was re-scoped to 20 runs with all four
  cells measured fresh; see "The CLI gate".

## Open questions

- Opus 5.5's default effort is `medium` (Fable 5.1's is `high`). The lab sets no
  effort parameter anywhere, so all cells run on each model's default. Whether
  effort is worth opening as a factor is a separate RQ — it must not be varied
  inside this one.
- H2 came out the other way, so the follow-up is the mirror of the one
  originally noted here: `model-recommendation-matrix.md` names
  `exact-ptdd-v1-cc` the default *on native Opus 5*, and that qualifier can now
  be widened to Opus 5.5 on this kata rather than tightened. Widening it is a
  separate edit and needs a decision, not an automatic consequence of one RQ on
  one kata.
- The instrumentation gap in F-2.4.5 is not fixable by a parser: a prediction is
  a statement, not an action, and leaves no trace in the tool stream. Closing it
  means the red phase writing its predictions to a **file** instead of narrating
  them — a tool call is visible regardless of whether the model emits text, and
  it would repair the Fable 5.1 and Sonnet 5 cases too. That is a new workflow
  version in LINEAGE and breaks comparability with every existing run, so it is
  a proposal, not a consequence.
