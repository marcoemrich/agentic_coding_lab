---
id: RQ-fable-vs-opus5
question: "How do Fable 5, Fable 5.1 and Opus 5 (each no-thinking, on the Claude Max subscription) differ in correctness and code quality on the novel claim-office kata under the current exact-coding baseline workflow?"
factors:
  model:
    - opus-5-no-thinking
    - fable-5-no-thinking
    - fable-5-1-no-thinking
controls:
  workflow: v6.1-hybrid-testlist-scope-fix
  kata_base: claim-office
  prompt: example-mapping
  # Fable 5.1 needs CC >= 2.1.251, so all three cells run on 2.1.267. Pinning
  # it as a control keeps the 13 pre-bump opus-5 runs out of the model
  # comparison — see "The CLI bump" below.
  harness_version: "2.1.267"
outcomes:
  # primary: correctness (external). Read with the resolution caveat below —
  # on claim-office this metric is close to a single bit, not a degree.
  - verification_pct
  - verification_passed
  - verification_total
  # secondary: code quality
  - cc_avg_loc_per_function
  - cc_longest_function
  - cognitive_max
  - mccabe_max
  - smell_total
  - code_mass
  # TDD discipline — the workflow's own mechanism, read as a rate
  - refactorings_applied
  - cycle_count
  # context
  - tests_passing
  - completed_within_budget
  - duration_seconds
  - total_tokens
  # H3: list-price comparison value, dominated by cache_read on this workflow
  - cost_usd
min_replicates: 5
status: aktiv
# NOTE: the 13 pre-bump opus-5-no-thinking runs in the pool are excluded by the
# harness_version control above, not by hand. They carry no harness_version at
# all (the field postdates them), so the H5 period control selects them with
# harness_version: unrecorded — see "The CLI bump" below.
---

# RQ-2.3: Fable 5 / Fable 5.1 / Opus 5 on the Current Workflow

`v6.1-hybrid-testlist-scope-fix` is the workflow that
`research/workflow-dev/workflow-construction.md` § "Aktuelle Front" names the
exact-coding baseline for correctness-critical work. Every finding on that
baseline was measured on `opus-5-no-thinking`. This RQ asks whether the Fable
generation behaves differently on it.

## Why a new RQ rather than an extension

RQ-2.1 (`RQ-model-quality`) and RQ-2.2 (`RQ-model-novel`) already carry Fable 5
and Opus 5 as model factors, but both control `workflow: v4-exact-subagents`.
Changing the workflow would open a controlled factor, which the project
conventions forbid. The existing Fable runs (3 GoL / 5 claim-office / 3 GoL on
v4) are therefore not transferable and are not counted here.

## Setup

All three models are bare `claude-*` aliases and take the native OAuth bypass
in `run-batch.sh` (`cc_env` blanks the container-global Requesty routing), so
they run on the mounted Max subscription rather than through Requesty. Route
availability was verified directly against `api.anthropic.com` before this RQ
was opened: `claude-opus-5`, `claude-fable-5` and `claude-fable-5-1` all
answer 200. Only the undated aliases exist — dated variants such as
`claude-fable-5-1-20260901` return 404.

`fable-5-1` was wired for this RQ (`MODEL_CONFIGS` in `run-batch.sh`, `PRICES`
in `compute-cost.py`). Note the tariff asymmetry: Fable 5.1 prices cache reads
at 0.025x base input ($0.25/MTok) where Fable 5 uses the standard 0.1x
($1.00/MTok). Since the v6.1 workflow is cache-heavy, this matters for any
cost comparison between the two Fable versions.

**Cost figures are list-price comparison values, not invoices.** On the Max
subscription nothing is billed per token; `cost_usd` answers "what would this
have cost over the API" (see `CLAUDE.md`).

## The CLI bump, and why opus-5 is re-measured

Fable 5.1 is the reason this RQ exists, and it cannot run on the CLI version
the lab was pinned to. `claude-fable-5-1` is reachable on the subscription, but
Claude Code 2.1.170 gets a hard 400 from the API: *"does not support this
model; version 2.1.251 or newer is required"*. A smoke run died after 4
seconds. The check that shows this is the model call carrying the CLI's own
user-agent — a bare API call returns 200 for all three models and hides the
gate:

| model | bare API call | as CC 2.1.170 |
|---|---|---|
| `claude-opus-5` | 200 | 200 |
| `claude-fable-5` | 200 | 200 |
| `claude-fable-5-1` | 200 | **400** |

The pin therefore moved to **2.1.267** for this RQ.

That makes the 13 existing `opus-5-no-thinking` runs unusable as a comparison
cell. They were measured on 2.1.170; the Fable cells run on 2.1.267. Reusing
them would confound the CLI version with the model factor — exactly the failure
RQ-1.19 F-1.19.9 caught, where "v6.1.1 costs more" could not be separated from
"September costs more" until a period control was run.

**All three cells are therefore measured fresh on 2.1.267.** The separation is
enforced by the `harness_version` control in the frontmatter rather than by
discipline — `aggregate-by-query.py` filters on the axis, so the pre-bump runs
cannot leak into a model cell even when someone re-aggregates months later.

The old opus-5 runs stay in the pool and serve a second purpose: they are the
2.1.170 arm of a CLI period control. `opus-5-no-thinking` is held constant
across the two CLI versions, so any difference between the old and new opus-5
runs is the bump itself, not the model. To aggregate that control, swap the
`harness_version` control for a factor over both arms:

```yaml
factors:
  model: [opus-5-no-thinking]
  harness_version: ["2.1.267", unrecorded]
```

`unrecorded` is the sentinel for runs from before the field existed. It is not
a synonym for 2.1.170 — it means "not recorded", and the run date is the only
evidence of which CLI produced those runs (see the Provenance note). A cell
pinned to `unrecorded` can never be topped up, since a fresh run always stamps
the current CLI; `batch-plan-from-rq.py` reports such a cell as unfillable
instead of planning runs that would never satisfy it.

The period control has to be read before any model claim in this RQ — if the
bump moves cost or refactor rate, the Fable-against-opus-5 comparison is still
internally valid (all three cells share 2.1.267), but no number here may be
compared against a finding measured on 2.1.170.

## Caveat on the primary outcome

RQ-1.19 F-1.19.4 established that `verification_pct` has roughly one bit of
resolution on this kata. Across all 33 claim-office runs of that RQ, the same
one of 15 verification cases (`14-family-steinheim`) failed every time and the
other 14 always passed — and the failure was deterministic down to the wrong
value. At n=5 the standard error of such a proportion is about 0.22.

Consequences for reading this RQ:

- A difference of 2/5 against 4/5 perfect runs between two model cells is not
  evidence of a model effect.
- If a Fable cell fails a *different* case than `14-family-steinheim`, that is
  the more interesting signal than the aggregate score, because it is a
  qualitative difference rather than a coin flip. Check the per-case
  verification output, not only `verification_pct`.
- Code quality metrics carry more weight here than the correctness score. They
  are continuous and, on claim-office in RQ-1.19, `smell_total` was
  deterministically 0 across all four workflow cells — so any non-zero value
  in a Fable cell is a real difference, not noise.

## Hypotheses

- **H1 (correctness parity)** — the Fable cells reach `verification_pct`
  0.95–0.96 like every opus-5 cell measured so far, failing the same single
  case. Falsifier: a Fable cell fails a different case, or fails more than one.
- **H2 (quality separation is where the models differ)** — if the generations
  differ at all under this workflow, it shows in decomposition
  (`cc_avg_loc_per_function`, Complexity Peak) rather than in correctness,
  because correctness is saturated and quality is not.
- **H3 (cost is not comparable across the two Fable versions without the cache
  tariff)** — Fable 5.1's 0.025x cache-read multiplier makes its `cost_usd`
  structurally lower than Fable 5's at equal token counts. Compare token counts
  first, cost second.
- **H4 (completion is a precondition, not a result)** — each cell writes
  `experiment-done.txt` in 5 of 5 runs. Verified on the marker file, not on
  `exit_reason`: RQ-1.19 F-1.19.10 showed a run that ended its turn after the
  test-list phase and was still recorded as `exit_reason: "ok"`.
- **H5 (the CLI bump is behaviourally neutral)** — `opus-5-no-thinking` on
  2.1.267 matches the 13 existing 2.1.170 runs in cost, refactor rate and
  quality. This is the period control and has to be read first: if it holds,
  findings here connect to the v6.1 line measured before the bump. Falsifier:
  the new opus-5 runs differ from the old ones — then the CLI version is a live
  factor, every cross-version comparison in the v6.1 line needs re-reading, and
  that is a finding in its own right rather than a nuisance.

## Marker caveat — Fable 5.1 zeros the prediction axis

The CLI-bump smoke (game-of-life, one run each, 2.1.267) came back healthy on
three of the four markers for both models, and lost one on Fable 5.1:

| | Fable 5.1 | Opus 5 |
|---|---:|---:|
| `duration_seconds` | 407 | 378 |
| `cycle_count` | 10 | 10 |
| `refactorings_applied` | 5 | 4 |
| `tests_passing` | true | true |
| `experiment-done.txt` | written | written |
| **`predictions_total`** | **0** | 20 |

Cause, from the transcripts: the parser gates prediction parsing on the literal
string `Red Phase Complete` appearing in **assistant text**
(`analyze_transcript.py`, `extract_predictions_from_text`). Opus 5 emits 35 text
blocks and no thinking blocks, and writes `🔴 Red Phase Complete:` with two
prediction lines per cycle as visible text. Fable 5.1 emits 3 text blocks and 37
thinking blocks, and produces no red-phase text at all. The 10 occurrences of
the marker string in its transcript are the command text in the user turn, not
its own output; the string does not appear in its thinking blocks either.

Two things worth recording separately:

- `thinking: false` is set and Fable 5.1 still produces thinking blocks. Fable 5
  did the same on v4 (15–29 blocks per run) but still emitted predictions, so
  the missing prediction text is specific to 5.1, not to the Fable line.
- Whether Fable 5.1 *makes* the predictions and does not write them, or does not
  make them, is not decided by this data. That is a question about the model's
  TDD behaviour and needs its own probe — do not read `predictions_total = 0`
  as "the model skipped the red-phase discipline".

**Effect on this RQ: contained.** `predictions_correct_rate` is not among the
`outcomes`, and the three primary axes — correctness, code quality, refactor
rate — are unaffected: `cycle_count` and `refactorings_applied` come from the
Skill-phase marker, which is intact in all cells. Any comparison of the
prediction axis across these cells is invalid and must not be published.

## Provenance note

`harness_version` was not recorded per run before this RQ (`run-batch.sh`,
2026-09). It now is, for all four harnesses. Runs from before that change carry
an empty value, which means "not recorded" — not "same version"; for those the
run date is the only evidence of which CLI produced them.
