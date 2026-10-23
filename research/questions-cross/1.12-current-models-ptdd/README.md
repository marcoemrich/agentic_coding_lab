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
    # Open-weight models, all on pi/Requesty.
    - {model: kimi-k3-sference, workflow: exact-ptdd-v1-pi}
    - {model: glm-5-3, workflow: exact-ptdd-v1-pi}
    - {model: deepseek-v4-1-flash, workflow: exact-ptdd-v1-pi}
    - {model: minimax-m3, workflow: exact-ptdd-v1-pi}
    - {model: qwen3-8, workflow: exact-ptdd-v1-pi}
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
GPT-6.1 Sol as the OpenAI anchor, and the current flagship of each open-weight
family that is reachable over Requesty (Kimi, GLM, DeepSeek, MiniMax, Qwen).

## The route decision, and why it is a bundle

Each model is reached the way a practitioner would actually reach it:

| Cell | Harness | Route | Workflow port |
|---|---|---|---|
| `opus-5-5-no-thinking` | Claude Code | Anthropic subscription (native OAuth) | `exact-ptdd-v1-cc` |
| `sonnet-5-5-no-thinking` | Claude Code | Anthropic subscription (native OAuth) | `exact-ptdd-v1-cc` |
| `gpt-6-1-sol-codex` | pi | OpenAI subscription (`openai-codex`) | `exact-ptdd-v1-pi` |
| `kimi-k3-sference` | pi | Requesty `sference/kimi-k3` | `exact-ptdd-v1-pi` |
| `glm-5-3` | pi | Requesty `sference/glm-5.3` | `exact-ptdd-v1-pi` |
| `deepseek-v4-1-flash` | pi | Requesty `sference/deepseek-v4.1-flash` | `exact-ptdd-v1-pi` |
| `minimax-m3` | pi | Requesty `tensorx/minimax-m3` | `exact-ptdd-v1-pi` |
| `qwen3-8` | pi | Requesty `tensorx/qwen3.8` | `exact-ptdd-v1-pi` |

The deliberate alternative — route every model through Requesty — was rejected
because it does not exist: the Anthropic subscription and the OpenAI
subscription are the routes those two vendors' models are actually used on, and
the open-weight models have no subscription route at all. Forcing Opus and Sol
onto Requesty would measure a configuration nobody runs, at a tariff nobody
pays, and would still leave the harness axis varying.

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
   profile on any quality metric. In this RQ that effect lies **on the model
   axis**: the three commercial cells sit on subscription routes and the five
   open-weight cells on Requesty, so part of any commercial-vs-open gap is the
   route. This is the single most important caveat of the RQ. It can be sized,
   not removed: `gpt-5-6-sol` (Requesty) against `gpt-5-6-sol-codex`
   (subscription) in `RQ-route-effect-pi` is the available yardstick.

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
| `qwen3-8` | `requesty/tensorx/qwen3.8` | $2.50/$6.00/$0.63 |
| `deepseek-v4-1-flash` | `requesty/sference/deepseek-v4.1-flash` | $0.50/$1.50/$0.05 |

`check-pi-model-wiring.py` reports all pi ids declared and priced.

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
| all six others | 0 | — |

So 10 of 40 runs exist before the first batch. Both inherited cells are at
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
  `cognitive_max` and **Smell Total** than the commercial ones — and part of
  that difference is the route, not the model (Confound 2). A finding may
  state the gap; it may not attribute it wholly to the model.
- **H4 (price per correct run inverts the ranking).** At $0.50/$1.50
  `deepseek-v4-1-flash` and at $1.20/$4.20 `glm-5-3` are an order of magnitude
  under the Anthropic tariff. If H3 holds weakly — the open cells clear the
  gate with somewhat worse structure — then "cheapest cell that clears the
  correctness gate" is a different winner from "best structure", and that
  trade is the practical output of this RQ.

## Open questions

- Does `exact-ptdd-v1-pi`'s test-list phase hold for the open-weight models at
  all? The workflow was built and validated on Sol and Opus. The hybrid line
  needed an explicit phase-continuation fix for kimi, minimax and qwen, and
  PTDD v1 has no such fix because it never needed one on its two home models.
  A smoke run per open cell answers this before any fill.
- Is Sonnet 5.5's reasoning controllable? Unmeasured (see above). A rope-riddle
  probe or a `thinking_delta` count off the first runs settles it; until then
  no reasoning statement for that cell.
- Would `glm-5-3` against `glm-5-2` be worth a cell of its own? It would be the
  fourth intra-family version comparison in the lab, but it carries the same
  backprovider confound as glm-5-1/glm-5-2 (sference against tensorx) and is
  not what this RQ asks. Separate RQ if wanted.
