---
id: RQ-model-novel-pi
question: "How do the models reachable via the pi harness (Requesty routing) differ in correctness and TDD discipline on claim-office-example-mapping with the v6.2-with-why-cleaned-pi workflow?"
factors:
  # Reasoning is NOT a factors entry of its own, but encoded in the model
  # name: `<id>` = native reasoning default, `<id>-no-thinking` =
  # the same routing path with `--thinking off`. Both are standalone
  # lab variants (convention as with opus-4-7-no-thinking in workflow-dev/).
  # Where the switch has no effect, only one arm exists — see
  # "Reasoning state" below.
  model:
    # both arms: switch takes effect or is checked empirically
    - opus-4-8                     # current Opus (vertex/claude-opus-4-8@eu)
    - opus-4-8-no-thinking         # only model with demonstrably controllable reasoning
    - sonnet-5                     # current Sonnet (vertex/claude-sonnet-5@eu)
    - sonnet-5-no-thinking
    - kimi-k2-7                    # previous Kimi (tensorx/kimi-k2.7-code)
    - kimi-k2-7-no-thinking
    - minimax-m3                   # MiniMax M3 (tensorx/minimax-m3)
    - minimax-m3-no-thinking
    - deepseek-v4-pro              # DeepSeek V4 Pro (tensorx/deepseek-v4-pro)
    - deepseek-v4-pro-no-thinking
    - qwen3-235b                   # current Qwen (nebius/qwen/qwen3-235b-a22b-instruct-2507)
    - qwen3-235b-no-thinking
    # only one arm: reasoning state not selectable
    - glm-5-2                      # GLM 5.2 (tensorx/glm-5.2) — always reasons, no -no-thinking arm
    - kimi-k3-sference             # current Kimi (sference/kimi-k3) — always reasons, no -no-thinking arm
    - gpt-5-6-sol                  # GPT SOL (azure/gpt-5.6-sol@swedencentral) — forced off
    - gpt-5-6-terra                # GPT TERRA (azure/gpt-5.6-terra@swedencentral) — forced off
controls:
  # OR match: v6.2.1 fixes only the continuation drop at the test-list->red
  # transition (kimi/minimax/qwen aborted there: spec.ts only, no cli.ts).
  # The fix is assumed to be outcome-neutral (changes only drop->completion,
  # not the TDD/quality mechanics). Old clean v6.2 runs and new
  # v6.2.1 replacement runs therefore aggregate into ONE cell. First entry is
  # canonical (label + fill-plan generation).
  workflow:
    any:
      - v6.2.1-phase-continuation-pi
      - v6.2-with-why-cleaned-pi
  kata_base: claim-office
  prompt: example-mapping
outcomes:
  # primary: correctness (external) — claim-office has an external verification suite
  - verification_pct
  - verification_passed
  - verification_total
  # secondary: code quality
  - code_mass
  - cognitive_max
  - mccabe_max
  - cc_longest_function
  - lines_of_code
  - smell_total
  # tertiary: TDD discipline
  - cycle_count
  - refactorings_applied
  - predictions_correct
  - predictions_total
  # context
  - tests_passing
  - tests_total
  - completed_within_budget
  - duration_seconds
  - total_tokens
  - cost_usd
min_replicates: 5
status: aktiv
---

# RQ-model-novel-pi: Model effect on a novel kata (pi harness)

## Motivation

Parallel to RQ-model-quality-pi (game-of-life, code quality), but on the harder axis: **spec comprehension and completeness of the implementation**. `claim-office-example-mapping` is a novel kata with five deliberately constructed ambiguities and an external verification suite — not a pure training-recall exercise like game-of-life.

RQ-model-novel (CC side) and RQ-model-novel-oc (OpenCode side) have shown that `verification_pct` on claim-office differentiates models more strongly than any code-quality metric on game-of-life. This RQ transfers the test to the pi side with `v6.2-with-why-cleaned-pi`.

## Harness status

**As of 2026-07-24**: Harness verified, routing for all `factors.model` values in place at that time is wired (`experiments/docker/run-batch.sh`, `harness = pi` branch; routing table also in `../1.1-model-quality-pi/README.md`). An n=1 smoke over those models has run; the cells are not yet filled to `min_replicates`.

**Update 2026-08-04**: K3 now enters as `kimi-k3-sference`, single-arm. Both open points from the 2026-07-28 wiring are closed: the claim-office smoke ran (2/2 clean, `verification_pct` 1.0 / 0.933), and the reasoning question was settled under the kata instead of by rope riddle — `--thinking off` has no effect, so there is no non-thinking arm (see "Reasoning state"). All pre-fix runs on both routes were discarded (see "Model selection").

Three harness defects were found and fixed in the process:

1. **Plan validation did not know the pi models.** The `pi_model` cases mapped all models, but `MODEL_CONFIGS` (the validation allowlist) did not contain seven of them — the first batch aborted with `unknown model: 'sonnet-5'` before a container started. Entries added.
2. **`cli_built` was a false positive.** The detection inferred a missing CLI from "no scenario produced stdout"; but when `src/cli.ts` is missing, `tsx` writes its module error to stdout, so `cli_built = true` remained. Now the entry point is parsed from the runner command and its existence checked.
3. **GPT-5.6 did not route at all.** See "Reasoning state" — sol and terra run with `"reasoning": false`.

In addition, the `cli.ts` nudge is wired for pi.

## Existing data

Earlier `v6.2-with-why-cleaned-pi` × claim-office **prose** runs with `opus-4-7-portkey-no-thinking` (verification 0.00–0.27) do not count toward the cells of this RQ. The then-open question of whether the low verification was due to the prose prompt, the v6.2-pi workflow or the CLI contract has been answered: **H1 confirmed** — on `example-mapping`, `opus-4-8` reproducibly reaches `verification_pct = 1.00` with a built CLI. The earlier finding was therefore a prompt/model artifact, not a workflow defect.

## Model selection

Current Opus + Sonnet as the Anthropic anchor, GPT-5.6-SOL and -TERRA, GLM 5.2, Kimi K2.7 **and K3** (K3 added 2026-07-28), MiniMax M3, DeepSeek V4 Pro, current Qwen (qwen3-235b). Wiring procedure and drop criteria as with `questions-opencode/` (routing smoke → inclusion; continuation drop / done.txt-with-red-tests / missing cli.ts → exclusion with justification).

**K3 runs on the sference route (`kimi-k3-sference`).** Both Requesty routes were unreliable through 2026-07-28/29: sference died mid-run with `502 "problem with the provider stream"` (2/2 game-of-life smokes), and the nebius fallback then failed on claim-office in its own way — 4 timeouts and 1 `pi-retries-exhausted` out of 9, with runs taking 1.5–2.5 h against the 7200 s budget. Requesty reported the stream issue fixed on 2026-08-04. A four-run smoke on the repaired route came back clean (see below), so sference is the route this RQ fills: it is the cheaper tariff ($2.25/$11.25 with cache discount vs. nebius $3.00/$15.00 without — `research/model-pricing.md`) and carries double the max output.

**All pre-fix K3 runs were discarded, not reused.** With both routes failing in different ways, it could not be established which measured values reflect the model and which the provider — including for the runs that exited `ok`. All 18 were deleted and archived metrics-only under `experiments/runs/_archive/kimi-k3-preroute-fix-2026-08-04/` (with a README documenting the exit-reason breakdown). The bare `kimi-k3` id was retired along with them, so every K3 id now names its route explicitly.

**Post-fix smoke, 2026-08-04 (n=4, all `ok`, no stream aborts):** claim-office `verification_pct` 1.0 / 0.933 at 50 and 52 cycles, in 40 and 25 minutes; game-of-life 2/2 with 8 and 9 tests, in 8 and 7 minutes. Against the nebius baseline on claim-office (4/9 completed, 1.5–2.5 h) this is a marked change, but n=4 establishes only that the reproducible failure mode is gone — not a stability rate. The real coverage figure comes from the fill.

**The old "K3 is the most expensive model in the RQ" finding does not carry over.** It was measured on the nebius tariff, which bills without the cache discount the other routes get: `kimi-k3-nebius` came to $20.13 mean and `kimi-k3-nebius-no-thinking` to $24.20, both above `opus-4-8` at $14.43. On sference the tariff is ~25 % lower *and* caches, and the smoke runs finished in a fraction of the time. Cost for this cell must be re-read from the new runs; the old figures describe a route this RQ no longer uses.

Note on `cost_usd` regardless of route: pi writes a cost scaffold of `0` when Requesty returns no inline usage, and that zero propagates into `final_metrics`. Values must be backfilled via `compute-cost.py` (token × list price) before they are read.

### qwen3-235b: continuation drop, `verification_pct = 0` is not a model result (2026-07-29)

Both qwen3 arms score `verification_pct = 0.00` in 10/10 runs with `tests_passing = false`. **This must not be read as a correctness statement about the model.** The runs die at the test-list→red transition, the drop criterion named above:

| Symptom | Value across the 10 runs |
|---|---|
| `it.todo(...)` entries in `claim-office.spec.ts` | 19–54 (test list written in full) |
| implemented `it(...)` tests | **0–1 in 7 of 10 runs**; 14/15/18 in the remaining three |
| `duration_seconds` | 19–2158 s against a ~2 h budget — most end in under 2 min |
| `cli_built` | `true` throughout |

So the model writes the complete test list, announces the transition to the first red test and then treats the turn as finished. `cli_built: true` plus `tests_total ≈ 0` is the signature: scaffolding exists, the TDD loop never starts. `v6.2.1-phase-continuation-pi` was built for exactly this drop (see the `controls.workflow` comment) and **does not fix it for qwen3 on claim-office** — the three partial runs (14–18 tests) are the same workflow as the seven that stall.

Consequences:

1. The qwen3 cells stay in `runs.csv` and `summary.md` as measured, but their `verification_pct`, `tests_*`, `code_mass` and complexity values describe a **stalled run**, not qwen3's ability on this kata. No finding may derive a model ranking from them.
2. All quality metrics for these cells are artifacts of an unfinished implementation (`code_mass` 251–296 is a fragment, not parsimony). Trophy assignment per the correctness gate in `.claude/skills/run-rq/SKILL.md` is thereby excluded anyway, since `verification_pct < 1.0`.
3. Whether qwen3 can solve claim-office at all remains **open**. Answering it requires a workflow whose phase transition holds for this model — not more replicates of the same cell.

`glm-5-1` (Nebius) was removed: the planned intra-family comparison with `glm-5-2` (TensorX) was confounded by the backprovider change, so a version effect could not have been separated cleanly from a provider effect.

Particularly relevant for claim-office: **`minimax-m3`** — in the `-oc` run the prime case of "internal tests green, external verification 0/15" (exactly the ambiguity effect claim-office was built for). **Gemma** is not included: not present in `pi-config/agent/models.json` / not routable via Requesty (see RQ-model-quality-pi "Not included").

## Reasoning state (caveat)

All models run with their **native reasoning default (= on)**. Turning it off uniformly would be the fairer comparison, but is not achievable via pi/Requesty — verified on 2026-07-24:

Measurement was done per model with a reasoning-demanding prompt (rope riddle), once with `--thinking off` and once with `--thinking high`; counted are thinking blocks in the pi event stream:

| Model | `--thinking off` | `--thinking high` | Reasoning controllable? |
|---|---|---|---|
| `opus-4-8` | 0 | 91 | **yes** — the only model where the switch takes effect |
| `sonnet-5` | 0 | 0 (also at `max`) | no — never reasons over this route |
| `deepseek-v4-pro` | 0 | 0 | no — never reasons |
| `qwen3-235b` | 0 | 0 | no — never reasons |
| `glm-5-2` | reasons | 299 | no — always reasons |
| `kimi-k2-7` | 217 | 137 | no — always reasons |
| `kimi-k3-sference` | 5439 | not probed | no — always reasons (measured under the kata, not by rope riddle) |
| `minimax-m3` | 615 | 396 | no — always reasons |
| `gpt-5-6-sol` | 0 | 0 | no — forced off |
| `gpt-5-6-terra` | 0 | 0 | no — forced off |

**Of the probed models, only `opus-4-8` responds to `--thinking`.** (`kimi-k3-sference` was added after this measurement; its row comes from a direct kata measurement instead — see below.) For all other probed models the reasoning state is a property of the model or the route, not of the call — `--thinking off`, the `:off` suffix on the model string and `models.json "reasoning": false` all remain without effect. Requesty-routed OpenAI-compatible models deliver reasoning over the `reasoning_content` channel (`thinkingSignature: "reasoning_content"`); switching it off requires a provider-specific body parameter that pi neither sends nor allows to be injected (model entries only know `contextWindow, id, input, maxTokens, name, reasoning`; no `--extra-body`).

**`gpt-5-6-sol` / `gpt-5-6-terra`: forced off.** With reasoning on, the Azure endpoint answers `400: Function tools with reasoning_effort are not supported … use /v1/responses instead`; an `openai-responses/gpt-5.6-*` does not exist in the Requesty catalog (only for 5.4 and 5.5). Both therefore run with `"reasoning": false` in `pi-config/agent/models.json`.

**Consequence for the design.** Reasoning is carried as a **model suffix**, not as a separate `factors` entry: `<id>` (native default) and `<id>-no-thinking` (`--thinking off`) are two standalone lab variants with identical routing. This is the same convention as `opus-4-7-no-thinking` in `research/workflow-dev/` and leaves the cell resolution of the aggregation unchanged.

The rope-riddle measurement above was a **single-prompt probe without tool calls and without long context**. Whether the switch behaves the same under the real kata is therefore not established — which is why all models where the probe yielded "never" (sonnet-5, deepseek-v4-pro, qwen3-235b) or "always" (kimi-k2-7, minimax-m3) still get both arms. There the comparison is a **test of controllability itself**: if it comes out at zero difference, the two cells are merged in the findings and carried as "switch without effect, checked empirically" — not as a reasoning effect.

**`kimi-k3-sference` has no non-thinking variant.** Measured directly under the kata rather than by rope riddle (2026-08-04, claim-office, `v6.2.1-phase-continuation-pi`): the arm launched with `--thinking off` produced **5439** `thinking_delta` events — more than the default arm at 4568, and at a higher share of the run (12.4 vs. 8.4 thinking per text delta). The stream carries `thinkingSignature: "reasoning_content"`, the same channel that makes the switch inert for every other Requesty-routed model. K3 therefore enters the RQ with **one arm only**; a `kimi-k3-sference-no-thinking` cell would not be a reasoning-off condition but a second sample of the same state under a misleading label.

Two things separate this from the "both arms as a test of controllability" treatment that `kimi-k2-7` and `minimax-m3` get. First, the measurement here is under the real kata rather than the rope riddle, so the caveat that a single-prompt probe may not carry to long tool-using contexts does not apply. Second, the switch does not merely fail to reduce reasoning — the `off` arm reasoned *more*, which no reading of "partially effective" accommodates. The difference is well inside run-to-run variance: two runs in the same default arm on game-of-life differ by a factor of 12 (230 vs. 2928 `thinking_delta`).

The `--thinking off` run itself is kept in the runs pool as a non-matching run (`2026-08-04_21-48-40`, claim-office). Its outcome sits squarely inside the default-arm distribution — `verification_pct` 0.933 at 35 tests and 52 cycles, against 0.933–1.0 at 31–36 tests and 32–54 cycles across the five cell runs — which is the second, independent reason there is nothing for a separate cell to measure.

This puts K3 in the single-arm group alongside `glm-5-2`, which reasons even with `--thinking off` (confirmed in the aborted 08:46 run with full `reasoning_content` blocks), and `gpt-5-6-sol`/`-terra`, which run technically forced with `"reasoning": false`. For all four the reasoning state is confounded with the model and must be read along when interpreting.

Check query for whether reasoning was actually off in a run:

```bash
grep -oE '"reasoning":[0-9]+' run.log | grep -v ':0' | wc -l   # nonzero reasoning events
grep -c '"thinking":"' run.log                                  # thinking blocks
```

## Hypotheses

- **H2 (model spread is dichotomous)**: claim-office acts as a pass/fail filter for spec comprehension — models cluster near 1.0 (understood) or near 0.0 (ambiguity resolved wrongly / CLI contract violated), rather than in a graded distribution. (Consistent with the `-oc` finding: Opus/Kimi/Flash 1.00 vs MiniMax 0.00.)
- **H4 (TDD discipline and correctness do NOT correlate linearly)**: `predictions_total` compliance is not necessary for correctness — the TDD substance (test-first discipline) works independently of marker-format compliance. (Consistent with `-oc`: Kimi 0/0 predictions + 15/15 verification.)

## Methodological notes

- Skeleton/first findings are single data points — replicates show whether patterns are stable. Memory [[replicates-n-reliability]]: n=3 detects bimodality, n=5 for medium confidence.
- All models via Requesty, mixed backproviders — see RQ-model-quality-pi for routing details.
- v6.2 enforces the why-block/skill TDD mechanics; agent drift into inline mode after a few cycles is possible. `cycle_count` is therefore conservative.
- The `cli.ts` nudge is **wired** for pi (`run-batch.sh`, pi branch): if `src/cli.ts` is missing while `src/claim-office.ts` exists, the agent is prompted once. Models that abort without domain code are deliberately not nudged.
- `cli_built` reflects the actual existence of `src/cli.ts` (entry point parsed from the runner command), no longer the invocation behavior. A `verification_pct = 0` with `cli_built = false` means "no CLI contract", not "spec resolved wrongly".
- **Subagent model contamination (fixed 2026-07-24).** The subagent extension only passed `--model` on if the agent file itself pinned one; `refactor.md` pins none, so all subagent spawns fell back to `defaultModel` (`bedrock/claude-opus-4-7@eu-west-1`) from `pi-config/agent/settings.json`. The entire refactor phase therefore ran on Opus 4.7 instead of the run model — measured in the 08:46 batch: `gpt-5-6-sol` 77, `gpt-5-6-terra` 45, `opus-4-8` 12 foreign calls. Fix: `PI_INHERIT_MODEL` in `run-batch.sh`, evaluated in `.pi/extensions/subagent/index.ts` (order: agent frontmatter → inherited parent model → pi default). **All runs before this fix (smokes 01:44–08:12) are unusable for refactor-derived metrics** — `verification_pct` is probably unaffected, `refactorings_applied` and the code-quality metrics are not. Fill runs start fresh.
- TDD discipline metrics depend on the pi transcript parser capturing the v6.2 markers (smoke-test rule from CLAUDE.md). Verified: opus-4-8 yields `cycle_count`/`predictions` non-null. The values are in `metrics.json` under `.summary_metrics.*`, not under `.final_metrics.*`.
