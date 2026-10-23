---
id: RQ-current-models-ptdd
question: "How do the current commercial and open-weight coding models differ in correctness and code quality on claim-office under the maintained EXACT Coding Predictive TDD workflow, each reached over its own native route?"
# Coupled model+harness+port factor. The three axes vary JOINTLY as a practice
# bundle, never as a cross product: each model is reached the way one would
# actually reach it (Anthropic subscription for Opus/Sonnet, OpenAI
# subscription for Sol, Requesty for the open-weight models), and the workflow
# is that harness's port of the same contract. See "Confounds" — this is a
# deliberate trade, taken because the alternative (one route for everyone)
# does not exist for these models.
factors:
  model_x_workflow:
    # Commercial models, each on its vendor's own subscription.
    # The v1 cells accept the pre-rename spelling: exact-ptdd-v1-* is the
    # product name for content identical to
    # exact-sol-v1.6-test-list-dimensions-* (LINEAGE.yaml), so both names
    # resolve to the same cell.
    - {model: opus-5-5-no-thinking, workflow: {any: [exact-ptdd-v1-cc, exact-sol-v1.6-test-list-dimensions-cc]}}
    - {model: sonnet-5-5-no-thinking, workflow: exact-ptdd-v1-cc}
    - {model: gpt-6-1-sol-codex, workflow: {any: [exact-ptdd-v1-pi, exact-sol-v1.6-test-list-dimensions-pi]}}
    # Commercial model reached over Requesty rather than a vendor
    # subscription. This cell is what makes the route effect separable from
    # the commercial/open-weight split -- see Confound 2. mistral-large-4 was
    # planned as a second one and dropped; see "Dropped: mistral-large-4".
    - {model: gemini-4-argon, workflow: exact-ptdd-v1-pi}
    # Open-weight models, all on pi/Requesty.
    - {model: kimi-k3-sference, workflow: exact-ptdd-v1-pi}
    - {model: glm-5-3, workflow: exact-ptdd-v1-pi}
    - {model: deepseek-v4-1-flash, workflow: exact-ptdd-v1-pi}
    - {model: minimax-m3, workflow: exact-ptdd-v1-pi}
    - {model: qwen3-8, workflow: exact-ptdd-v1-pi}
    # Same family AND the same provider as qwen3-8, one price tier down. Added
    # 2026-10-23 for the intra-family price axis -- see H5.
    - {model: qwen3-8-flash-next, workflow: exact-ptdd-v1-pi}
controls:
  kata_base: claim-office
  prompt: example-mapping
outcomes:
  # primary: correctness (external). claim-office carries the correctness
  # signal and separates models more sharply than any quality metric
  # (RQ-model-novel-pi, RQ-model-novel-oc). A cell that drops here
  # disqualifies itself regardless of its quality numbers.
  - verification_pct
  - verification_passed
  - verification_total
  - tests_passing
  # primary: code quality
  - production_loc
  - code_mass
  - smell_total
  - cognitive_max
  - cognitive_avg
  - mccabe_max
  - unit_count
  - unit_size_max
  - unit_size_avg
  - unit_size_median
  - longest_function
  # suite strength. Stryker on this stack; not comparable to the PIT/mutmut/
  # cargo-mutants numbers in the per-language RQs. Report mutants_total and
  # mutants_survived next to the ratio — the models will not produce the same
  # mutant population, and the score's denominator moves with code size.
  - tests_total
  - test_lines
  - mutation_score
  - mutants_total
  - mutants_survived
  - mutants_no_coverage
  # TDD discipline, from the phase chain. Every cell here runs the same
  # Predictive TDD contract, so all eight sit on the SAME side of the
  # test-list boundary and the Skip-fed columns stay comparable within this
  # RQ (README "Comparability: the test-list boundary"). They are still not
  # comparable to any ad-hoc-TDD RQ.
  - tdd_discipline
  - tdd_discipline_step
  - tdd_discipline_closure
  - test_first_rate
  - red_batch_size
  - red_batch_max
  - green_batch_size
  - cycles_total
  - cycles_closed
  - refactor_events
  - skip_events
  - chain_suite_runs
  # ambivalent — no trophy
  - chain_deviations
  - chain_opens_red
  - chain_ends_green
  # context
  - duration_seconds
  - total_tokens
  - cost_usd
min_replicates: 5
---

# RQ-current-models-ptdd: Current models under the maintained Predictive TDD workflow

## Motivation

Every multi-model RQ in this lab measures a workflow that is no longer the
maintained one. `RQ-model-quality-pi` and `RQ-model-novel-pi` carry twelve and
eighteen model cells, but on `exact-hybrid-v4.2-phase-continuation-pi` — the old
hybrid line, **with** a refactor subagent. `RQ-model-quality` and
`RQ-model-novel` sit on `exact-subagents-v1-cc`. Meanwhile the recommended
default is `exact-ptdd-v1-*` (`research/workflow-dev/model-recommendation-matrix.md`),
single-context Predictive TDD with no subagent — and on that workflow **every
existing run is a GPT Sol variant on the OpenAI subscription route.** No
open-weight model has ever been measured on it.

This RQ closes that gap for the current generation: what do today's models do
with the method we actually recommend?

The model set is the user's: current Opus and Sonnet as the Anthropic anchor,
GPT-6.1 Sol as the OpenAI anchor, the current flagship of each open-weight
family reachable over Requesty (Kimi, GLM, DeepSeek, MiniMax, Qwen), and two
commercial models that are reachable over Requesty rather than a subscription
(Gemini 4 Argon, Mistral Large 4).

## The route decision, and why it is a bundle

Each model is reached the way a practitioner would actually reach it:

| Cell | Harness | Route | Workflow port |
|---|---|---|---|
| `opus-5-5-no-thinking` | Claude Code | Anthropic subscription (native OAuth) | `exact-ptdd-v1-cc` |
| `sonnet-5-5-no-thinking` | Claude Code | Anthropic subscription (native OAuth) | `exact-ptdd-v1-cc` |
| `gpt-6-1-sol-codex` | pi | OpenAI subscription (`openai-codex`) | `exact-ptdd-v1-pi` |
| `gemini-4-argon` | pi | Requesty `vertex/gemini-4-argon@eu` | `exact-ptdd-v1-pi` |
| `kimi-k3-sference` | pi | Requesty `sference/kimi-k3` | `exact-ptdd-v1-pi` |
| `glm-5-3` | pi | Requesty `sference/glm-5.3` | `exact-ptdd-v1-pi` |
| `deepseek-v4-1-flash` | pi | Requesty `sference/deepseek-v4.1-flash` | `exact-ptdd-v1-pi` |
| `minimax-m3` | pi | Requesty `tensorx/minimax-m3` | `exact-ptdd-v1-pi` |
| `qwen3-8` | pi | Requesty `tensorx/qwen3.8` | `exact-ptdd-v1-pi` |
| `qwen3-8-flash-next` | pi | Requesty `tensorx/qwen3.8-flash-next` | `exact-ptdd-v1-pi` |

The deliberate alternative — route every model through Requesty — was rejected
because it does not exist: the Anthropic subscription and the OpenAI
subscription are the routes those two vendors' models are actually used on, and
the open-weight models have no subscription route at all. Forcing Opus and Sol
onto Requesty would measure a configuration nobody runs, at a tariff nobody
pays, and would still leave the harness axis varying.

**Gemini 4 Argon is the exception that makes the design work.** It is a
commercial, closed-weight model reached over Requesty, because Google's own
subscription is not wired into this lab. That puts a commercial model on *both*
sides of the route split, which is what turns Confound 2 from a confound that
swallows the main comparison into one that can be bounded from inside this RQ.
It carries that load alone: `mistral-large-4` was wired as a second such cell
and had to be dropped (below), so the within-route commercial comparison rests
on one cell at n=5 rather than two.

## Confounds (binding)

Three axes vary together with the model. All three must be named whenever a
finding of this RQ is quoted.

1. **Harness and workflow port.** Two cells run Claude Code with
   `exact-ptdd-v1-cc`, six run pi with `exact-ptdd-v1-pi`. The two are ports
   of the same contract, not the same file. A measured difference between an
   Anthropic cell and a pi cell is the **sum** of model, harness and port
   effect. Isolated harness effect: `RQ-harness-requesty` (`../1.2-harness-requesty/`),
   `RQ-model-quality-cc-vs-pi` (`../1.4-opus-cc-vs-pi/`).

2. **The route has a demonstrated quality effect of its own, and it is not a
   reasoning effect.** `RQ-route-effect-pi` F-1.3.6 measured one and the same
   model (GPT-5.6 Sol), at constant harness, workflow, kata and prompt, over
   the OpenAI subscription against Requesty: `cognitive_max` 4.0 against 8.0,
   **Smell Total** 0.0 against 2.0, Production LoC 41 against 28. Turning
   reasoning **on** for the Requesty route did not reproduce the subscription
   profile on any quality metric. The effect is real and it is not small.

   It does **not**, however, coincide with the commercial/open-weight split in
   this RQ, and that is deliberate. `gemini-4-argon` and `mistral-large-4` are
   commercial models on Requesty, so a commercial-against-open comparison
   exists **within one route** — those two against the five open-weight cells.
   Read that comparison first. The subscription cells (Opus 5.5, Sonnet 5.5,
   GPT-6.1 Sol) carry the route effect on top of the model effect and may not
   be set against a Requesty cell without saying so.

   Two independent yardsticks size the route effect rather than assume it:
   `gpt-5-6-sol` (Requesty) against `gpt-5-6-sol-codex` (subscription) in
   `RQ-route-effect-pi`, and — once this RQ is filled — the gap between its own
   two commercial groups.

3. **`cost_usd` is a list-price comparison value in all three route families,
   and never an invoice.** Nothing is billed per token on either subscription;
   the Requesty cells carry the catalogue tariff without workspace discounts
   (`research/model-pricing.md`). That makes the column internally consistent —
   all eight cells are tokens × list price — but it is not what any of this
   costs to run. Read `total_tokens` before `cost_usd`.

## Reasoning state (caveat)

All eight cells run each model's **native reasoning default**. There is no
reasoning arm in this RQ, and the `-no-thinking` suffix on the two Anthropic
cells is **nominal**:

- **Opus 5.5 thinks adaptively and always.** The manual `thinking.type:
  "enabled"` mode is not accepted from 4.6 on, and whether `MAX_THINKING_TOKENS=0`
  suppresses the reasoning blocks is not guaranteed — Fable 5.1 produced 37
  thinking blocks despite `thinking=false`. The id keeps the suffix so the cell
  aggregates against the existing `opus-5-5-no-thinking` runs, exactly as in
  `RQ-opus55-current-workflow`.
- **Sonnet 5.5 is unmeasured on this point.** It enters with the same suffix
  for cell-naming consistency with the Opus cell. Do not report a reasoning
  statement for it.
- **On the Requesty cells the switch is inert anyway.** `RQ-model-novel-pi`
  established that of all probed Requesty-routed models only `opus-4-8`
  responds to `--thinking`; the others deliver reasoning over the
  `reasoning_content` channel, which pi can neither switch off nor inject a
  body parameter for.

So the honest reading of all eight cells is "model at its own default", which
is the comparison the RQ is for.

## Harness status and wiring

Pins (Dockerfile): **Claude Code 2.1.280**, **pi 0.81.1**. Both are constant
across every cell; `harness_version` is deliberately **not** declared as a
control, because the two harnesses have different version axes and a single
control value cannot span them.

Wired on 2026-10-23 for this RQ (three entries each: `MODEL_CONFIGS` and the
case map in `run-batch.sh`, `PRICES` in `compute-cost.py`, and for pi also
`pi-config/agent/models.json`):

| Lab id | Target | Note |
|---|---|---|
| `sonnet-5-5` | `claude-sonnet-5-5[1m]` | native; see the CLI gate below |
| `glm-5-3` | `requesty/sference/glm-5.3` | $1.20/$4.20/$0.26 |
| `qwen3-8` | `requesty/tensorx/qwen3.8` → `qwen/qwen3.8-2.4t-a95b` | $2.50/$6.00/$0.63 |
| `qwen3-8-flash-next` | `requesty/tensorx/qwen3.8-flash-next` → `qwen/qwen3.8-flash-next` | $0.20/$0.50/$0.05 |
| `deepseek-v4-1-flash` | `requesty/sference/deepseek-v4.1-flash` | $0.50/$1.50/$0.05 |
| `gemini-4-argon` | `requesty/vertex/gemini-4-argon@eu` | $2.20/$11.00/$0.11 — see the cliff below |
| `mistral-large-4` | `requesty/mistral/mistral-large-4` | $0.68/$2.09/$0.07 — **unusable from pi**, see the drop below |

`check-pi-model-wiring.py` reports all pi ids declared and priced. Every route
above was probed with a real completion against the EU router on 2026-10-23,
not merely read out of the catalogue.

### Gemini 4 Argon: a tariff cliff on 2026-11-30, and a gate that does not bite

Google runs an **introductory** price of $2/$10 per 1M until 2026-11-30 and
$4/$20 from 2026-12-01 — a doubling. The Requesty rate above is 1.1x the
introductory one, per the documented vertex markup, so it is expected at
$4.40/$22.00 after the cliff. `cost_usd` is written once per run at measure
time and is never recomputed, so **an Argon cell filled across 2026-11-30
mixes two tariffs in one mean.** Fill it on one side of that date and record
which side here. Everything except `cost_usd` is unaffected.

Google also states that Argon is rolled out only to selected cyber partners
through its Fairwind program, and that the model is trained specifically for
defensive security work. The gate does not appear to apply to the Requesty
route — the probe answered normally — but the training focus is a reason to
watch this cell rather than expect it to lead: nothing about claim-office
rewards a security specialisation.

### The CLI gate: Sonnet 5.5 needs the `[1m]` suffix

Measured in the experiment container on 2026-10-23. CLI 2.1.280 **accepts**
`claude-sonnet-5-5` at the API — the call returns normally — but does **not**
carry the model in its catalog, and therefore assumes a 200k context window
and caps auto-compact there on a 1M-context model. That is a silent context
confound, not an error, and it bites hardest on the large katas — which is
exactly this RQ's kata. With `claude-sonnet-5-5[1m]` the cap is gone.

`MODEL_CONFIGS` therefore pins the suffixed id. Opus 5.5 needs no suffix;
2.1.280 knows that one. Drop the suffix only after a CLI bump whose catalog
lists `claude-sonnet-5-5`, and re-verify there.

### Smoke results, 2026-10-23 (n=1 per unfilled cell)

All six smoke runs exited `ok` with `cli_built = true` and `tests_passing =
true`. No cell drops on the loop-completion criterion, and the open question
about `exact-ptdd-v1-pi`'s test-list to red transition is **answered for four
of five open-weight models** — glm-5-3, deepseek-v4-1-flash, kimi-k3-sference
and minimax-m3 all close cycles under it. n=1 proves the mechanics work, not a
rate.

| Cell | Correctness (external) | `cycles_closed` | `refactor_events` | `red_batch_max` | predictions | `cognitive_max` | `cost_usd` | min |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| `sonnet-5-5-no-thinking` | 1.00 | 29 | 15 | 1 | 1/2 | 3 | $10.66 | 19 |
| `glm-5-3` | 1.00 | 16 | 4 | 1 | 88/90 | 8 | $2.21 | 9 |
| `deepseek-v4-1-flash` | 1.00 | 16 | 14 | 1 | 80/80 | 3 | $1.34 | 35 |
| `qwen3-8` | 1.00 | **0** | **0** | **null** | 37/38 | 9 | $5.89 | 29 |
| `kimi-k3-sference` | 0.933 | 16 | 7 | 1 | 83/83 | 9 | $3.81 | 25 |
| `minimax-m3` | 0.867 | 12 | 10 | **6** | 64/64 | 8 | $0.05 | 32 |

**Smoke Total is 0 for all six.** Single runs, so this says the kata is
tractable under this workflow, not that the models are equally clean.

#### qwen3-8 writes no TDD loop, and the chain measured that correctly

This is the one result that changes how a column must be read. `cycles_closed
= 0` with `red_batch_max = null` looks exactly like the silent-reporter failure
CLAUDE.md warns about — a stack whose TDD event reporter wrote nothing. It is
not. `tdd-events.jsonl` holds **three** events across the 29-minute run:

| seq | time | suite |
|---|---|---|
| 1 | 01:43:53 | failed — 0 passed, 0 failed, **51 skipped** of 51 |
| 2 | 02:07:35 | green — 51 passed, 0 skipped |
| 3 | 02:08:09 | green — 51 passed, 0 skipped |

So the reporter ran and recorded an **absence** of cycles: qwen3-8 wrote the
complete test list as skipped entries, implemented everything in one stretch
without invoking the suite, and ran it green at the end. There was never a red
batch, hence `null` rather than a number. Verify this per cell before reading a
zero as a reporter fault — the file is the evidence, not the metric.

This is a **different** failure from the `qwen3-235b` drop: that model never
implemented anything (0-1 tests of a 19-54 entry list, most runs under two
minutes). qwen3-8 solves the kata completely in 51 tests.

**The fill then showed this run to be the exception, not the rule.** The other
four runs of the cell wrote 58–128 TDD events and closed 11–20 cycles. So the
cell is not "a model that runs no loop" — it is a model that skipped the loop
in 1 of 5 runs while still landing at `verification_pct` 1.00 every time. Read
its discipline columns as a spread, and keep the rule that a 0 here means "ran
no loop" rather than "no data": the reporter was working, the loop was not.

#### The text-derived prediction markers fail in both directions

One batch produced both failure modes at once:

- `sonnet-5-5` closes **29** cycles with **15** refactor events and emits
  **2** prediction markers.
- `qwen3-8` closes **0** cycles and emits **38**.

The markers claim discipline where the event stream shows none, and omit it
where the stream shows plenty. This reproduces F-2.4.6 of
`RQ-opus55-current-workflow` ("the markers do not survive") on a second
Anthropic model and extends it: the inverse error happens too. Consequence for
this RQ: **gate on the phase chain, never on `predictions_*`.** The
`predictions_correct_rate` column is deliberately absent from `outcomes:` for
that reason, and `predictions_*` may not be compared across the
Anthropic/non-Anthropic boundary.

#### minimax-m3 batches its red tests

`red_batch_max = 6` against 1 everywhere else: minimax writes up to six failing
tests before making them pass, which is a workflow-compliance deviation rather
than a crash — the run completes with 58 tests and `verification_pct = 0.867`.
It stays in, with the deviation reported alongside its discipline columns.

### The Qwen pair is the lab's only confound-free price axis

`qwen3-8` and `qwen3-8-flash-next` are the same model family on the same
provider (tensorx), separated by a factor of **12.5 on input and 12 on output**
($2.50/$6.00 against $0.20/$0.50). Every other intra-family pair in the lab
swaps backprovider at the same time — `glm-5-1`/`glm-5-2` (nebius → tensorx),
`kimi-k2-7`/`kimi-k3` (tensorx → sference) — so a version effect there can
never be separated cleanly from a provider effect. Here it can.

The two resolve to genuinely different backends, not to one alias:
`qwen/qwen3.8-2.4t-a95b` against `qwen/qwen3.8-flash-next` (observed
2026-10-23).

**The window asymmetry — 262144 against the flagship's 1M — did not bind on
this kata, and that was measured rather than assumed.** The largest single
request of each run, input plus cache reads, came to 87k–191k tokens in the
flagship cell and 107k–141k in flash-next: every run of both cells stayed under
262k. Neither cell compacted. (The `compact` hits in the transcripts are the
word in the workflow prompt — "close with a compact record of the behavior" —
not compaction events.)

Note for anyone re-deriving this: `total_tokens` does **not** measure context
occupancy. The flash-next cell sums to 16 M tokens over 469 messages, which
says nothing about how full the window ever was. Reading the cumulative figure
as window pressure is the mistake this section originally made; the per-request
maximum is the number that answers it. On a larger kata the asymmetry could
still bind, so re-check it there rather than carrying this result over.

#### Measured result of the pair (2026-10-23, n=5 each)

Medians, with the standard deviation of each cell. **These are medians; the
pivots in `summary.md` report the mean**, so the two differ where a cell has an
outlier — `qwen3-8`'s `cycles_closed` is 16.0 here and 13.2 there, from the same
five runs, because one run closed 0. Both are correct; say which one a finding
quotes.

| | `qwen3-8` | `qwen3-8-flash-next` | |
|---|---:|---:|---|
| Correctness (external) | 1.00 ± 0.00 | 1.00 ± 0.00 | equal |
| `tests_total` | 42.0 ± 5.9 | 41.0 ± 1.6 | equal |
| `cycles_closed` | 16.0 ± 8.2 | 19.0 ± 4.5 | flash-next higher |
| `refactor_events` | 4.0 ± 3.0 | 11.0 ± 5.5 | flash-next 2.75x |
| `cognitive_max` | 6.0 ± 1.3 | 5.0 ± 1.5 | flash-next lower |
| Code Mass (APP) | 738 ± 66 | 738 ± 74 | identical |
| Smell Total | 0.0 | 0.0 | both clean |
| `total_tokens` | 8.75 M ± 6.18 | 15.94 M ± 3.84 | flash-next 1.8x |
| `cost_usd` | $5.89 ± 4.12 | $0.90 ± 0.20 | **flash-next 6.5x cheaper** |
| `duration_seconds` | 14 min ± 8 | 26 min ± 5 | flash-next 1.8x slower |

**H5 is confirmed, and more strongly than it was posed.** The cheap tier does
not merely lose less than its price difference suggests — on this kata it loses
nothing. Correctness is identical at σ = 0 in both cells, Code Mass is
identical to the digit, Smell Total is 0 in both, and `cognitive_max` and
`refactor_events` favour **flash-next**. What it pays is wall clock and tokens:
1.8x each. The 12x price gap therefore converts to only 6.5x in cost per run,
because flash-next spends 1.8x the tokens getting there.

Two cautions on reading this. First, **the flagship cell is the unstable one**:
σ = 4.12 on a median cost of $5.89, and a token range of 8.2–22.5 M against
12.2–22.2 M for flash-next. Medians are the honest comparison here; means would
be carried by the flagship's outlier run. Second, n=5 on one kata in one
language. The result says the tier is sufficient for claim-office under this
workflow, not that the flagship is pointless.

### Dropped: mistral-large-4 — pi cannot talk to Mistral's endpoint

Wired, reachable, and still unusable. Mistral's API rejects pi's request body
with **HTTP 422** on two counts:

- `messages[].content` must be a plain string; pi sends an array of content
  chunks (`[{"type":"text","text":"…"}]`).
- `cache_control: {"type":"ephemeral"}` on a content part is
  `extra_forbidden` — Mistral does not accept the Anthropic-style cache hint
  pi attaches.

Neither is configurable from our side: pi offers no control over the body it
builds. The model is therefore not measurable through this harness, and the
cell is dropped rather than left at n=0. The `MODEL_CONFIGS` entry and the
price stay in place — OpenCode sends a different body shape and may well reach
the same route — with the limitation recorded at both.

**Two things about how this failed are worth more than the cell.**

First, **the route probe that cleared this model for wiring was insufficient.**
A `curl` with `"content": "hi"` — a plain string — succeeds against
`mistral/mistral-large-4`. The 422 only appears once the *harness* builds the
body. A probe must reproduce the harness's request shape, not a minimal one.
The other three models wired the same day happen to accept the Anthropic
format, so the probe passed for the wrong reason.

Second, **pi exits 0 on this failure**, with `stopReason: "error"` and
`willRetry: false` in its event stream. Five runs were recorded as `ok` with an
empty `src/`, a 1-second duration, and no `experiment-done.txt`, which the
aggregation then read as `verification_pct = 0.00` — a model that failed the
kata rather than a configuration that never ran. `classify_failed_run` could
not catch it, because that function only runs for a non-zero exit, and
`clean-broken-runs.py` would not have removed them either, because it deletes
non-`ok` runs and stubs. `run-batch.sh` now carries an **`empty-run`** guard:
exit 0 with nothing under `src/` is no longer `ok`. The five runs were deleted
on 2026-10-23.

### Inclusion rule per model

As in `questions-opencode/` and the pi RQs: a model stays in the RQ if the
autonomous loop runs cleanly through under `exact-ptdd-v1-*` and the CLI
contract is satisfied (`src/cli.ts` written, `cli_built = true`). A model that
drops the loop — test list written and the turn treated as finished, `done.txt`
with red tests, no `cli.ts` — is removed with justification, documented here.

The known risk is **Qwen**. `qwen3-235b` scores `verification_pct = 0.00` in
10/10 runs of `RQ-model-novel-pi` and the cause is not competence: it writes
the complete test list (19–54 `it.todo` entries), announces the transition to
the first red test and stops, most runs ending in under two minutes against a
two-hour budget. `exact-hybrid-v4.2-phase-continuation-pi` was built for that
drop and did not fix it for qwen3 on this kata. `qwen3-8` is a different
generation on a different provider, so the drop may not transfer — but a
smoke run before the fill is mandatory, and a repeat of the pattern is a drop
criterion, not a model result.

## Existing data

| Cell | Runs present | Source |
|---|---:|---|
| `opus-5-5-no-thinking` × `exact-ptdd-v1-cc` | **5** | RQ-opus55-current-workflow |
| `gpt-6-1-sol-codex` × `exact-ptdd-v1-pi` | **5** | RQ-workflow-axis-gpt61-sol |
| all eight others | 0 | — |

So 10 of the 50 runs this RQ needs (10 cells x 5) existed before the first batch. Both inherited cells are at
`min_replicates` and on the pinned harness versions.

## Batch-plan constraint

All eight cells fit in **one** plan. The two Claude Code cells are both
native-routed, so the container-global CC routing rule (CLAUDE.md: never mix
CC-requesty with CC-native in one plan) is satisfied; the six pi cells split
across the `openai-codex` and `requesty` providers, which both live in the
default `pi-config` profile and are separate routing channels. No alternative
pi-config profile is involved, so the profile constraint from
`RQ-route-effect-pi` does not apply either.

Mutation testing is opt-in here and runs **between** batch and aggregation
(`compute-mutation-score.py`). On TypeScript it costs minutes per run and a
`pnpm install` per run — budget for it separately, and do not expect it from
`analyze-run.sh`.

## Hypotheses

- **H1 (correctness is dichotomous, not graded).** claim-office acts as a
  pass/fail filter for spec comprehension: cells cluster near 1.00 or near
  0.00 rather than spreading evenly. Carried over from `RQ-model-novel-pi` H2
  and the `-oc` finding (Opus/Kimi 1.00 against MiniMax 0.00). If it holds
  here too, the quality axes only carry signal for the cells that clear the
  correctness gate.
- **H2 (the maintained workflow narrows the field).** On Opus 5.5 the workflow
  collapses the quality spread — `cognitive_max` and `mccabe_max` vary by
  σ = 0.55 under it against σ = 2.07 and 1.52 under a minimal inline
  instruction (`RQ-opus55-current-workflow`). If that generalises, the
  model-to-model spread under `exact-ptdd-v1-*` is **smaller** than
  `RQ-model-quality-pi` measured under the hybrid line. A narrow spread would
  be the RQ's most useful result: it would mean the method, not the model,
  carries the structure.
- **H3 (the open-weight field has closed the correctness gap but not the
  structure gap).** The open cells reach the correctness gate but carry higher
  `cognitive_max` and **Smell Total** than the commercial ones. The test that
  decides this is **within the Requesty route**: `gemini-4-argon` and
  `mistral-large-4` against the five open-weight cells. If the gap shows up
  there too, it is a model property. If it shows up only against the
  subscription cells, it was the route (Confound 2).
- **H4 (price per correct run inverts the ranking).** At $0.50/$1.50
  `deepseek-v4-1-flash` and at $1.20/$4.20 `glm-5-3` are an order of magnitude
  under the Anthropic tariff. With `mistral-large-4` dropped, the cheap end of
  the field is open-weight only, so this hypothesis can no longer separate
  "cheap because open-weight" from "cheap because of the tariff".
- **H5 (the price tier buys less than the price difference suggests).**
  Within one family and one provider, `qwen3-8-flash-next` costs a twelfth of
  `qwen3-8`. If its correctness and code quality fall by far less than that
  factor, the practical reading of this whole RQ changes: the question stops
  being which model is best and becomes which tier is enough. The flagship
  cell sets the bar it has to clear — `verification_pct` 1.00, `cycles_closed`
  13.2, `cognitive_max` 6.8, Code Mass 761, at $7.80 per run. Watch the
  context window (above) before reading any gap as capability. If H3 holds weakly — the open cells clear the
  gate with somewhat worse structure — then "cheapest cell that clears the
  correctness gate" is a different winner from "best structure", and that
  trade is the practical output of this RQ.

## Open questions

- ~~Does `exact-ptdd-v1-pi`'s test-list phase hold for the open-weight
  models?~~ **Answered: yes, for all five.** The 2026-10-23 smoke showed four
  of five closing cycles, and the fill settled the fifth. **qwen3-8's
  bulk-implement run was a one-off, not a model property**: of its five runs
  only the smoke wrote 3 TDD events and closed 0 cycles, while the four fill
  runs wrote 58–128 events and closed 11, 16, 19 and 20 cycles. So the pattern
  occurs in roughly 1 run in 5 and must be reported as instability, never as
  the cell's character. The cell's discipline columns are usable; it is their
  spread that carries the finding (`cycles_closed` 0–20).
- Is Sonnet 5.5's reasoning controllable? Unmeasured (see above). A rope-riddle
  probe or a `thinking_delta` count off the first runs settles it; until then
  no reasoning statement for that cell.
- Would `glm-5-3` against `glm-5-2` be worth a cell of its own? It would be the
  fourth intra-family version comparison in the lab, but it carries the same
  backprovider confound as glm-5-1/glm-5-2 (sference against tensorx) and is
  not what this RQ asks. Separate RQ if wanted.
