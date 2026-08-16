---
id: RQ-route-effect-pi
question: "How does routing one and the same model (GPT-5.6 Sol) through Requesty versus the OpenAI subscription affect code quality, TDD discipline, throughput and correctness, at constant harness, workflow, kata and prompt style?"
factors:
  model:
    # The route is part of the id -- that is what makes it the factor here.
    # Both arms address the identical upstream model; only the transport differs.
    - gpt-5-6-sol-no-thinking        # Requesty: azure/gpt-5.6-sol@swedencentral
    - gpt-5-6-sol-codex-no-thinking  # OpenAI subscription: openai-codex/gpt-5.6-sol
controls:
  workflow: v6.2.1-phase-continuation-pi
  kata_base: game-of-life
  prompt: example-mapping
outcomes:
  # primary: throughput and work volume (the route effect shows up here)
  - duration_seconds
  - total_tokens
  # code quality -- does the route change what gets built?
  - code_mass
  - cognitive_max
  - cognitive_avg
  - mccabe_max
  - mccabe_avg
  - cc_longest_function
  - cc_avg_loc_per_function
  - cc_median_loc_per_function
  - lines_of_code
  - smell_total
  - smell_complexity
  - smell_magic_numbers
  - smell_duplication
  # correctness as a counterweight
  - verification_pct  # external (game-of-life-verification)
  - tests_passing     # internal (vitest)
  - tests_total
  # TDD discipline
  - cycle_count
  - refactorings_applied
  - predictions_correct
  - predictions_total
  # context
  - completed_within_budget
  - cost_usd
min_replicates: 5
status: aktiv
---

# RQ-route-effect-pi: Route effect Requesty vs OpenAI subscription (pi harness)

## Motivation

GPT-5.6 Sol is reachable on pi over two transports since 2026-08-15: the
established **Requesty** route (`azure/gpt-5.6-sol@swedencentral`, bearer auth
from `REQUESTY_API_KEY`) and the **OpenAI subscription**
(`openai-codex/gpt-5.6-sol`, `chatgpt.com/backend-api`, OAuth). Same upstream
model, different transport, different billing model.

Every other pi RQ implicitly assumes the route is irrelevant to the outcome --
`questions-pi/README.md` still describes Requesty as *the* pi route. This RQ
tests that assumption. If the route does affect outcomes, it is an uncontrolled
factor in every pi RQ that mixes routes, and the ids have to keep them apart
(which they do: the route is always explicit in the lab-variant id).

The occasion was a speed question, but the interesting part turned out to be
elsewhere: an ad-hoc comparison (n=4 per arm, 2026-08-15) found the model
doing **systematically more work** on the codex route -- more cycles, more
refactorings, more tokens -- at identical `--thinking off`. Whether that
carries over into the artefact (code quality) is open, which is why this RQ
takes the full quality metric set rather than just duration.

## Both arms are pinned to `-no-thinking`

**This is not optional.** The two `models.json` entries declare reasoning
differently: the Requesty entry carries `reasoning: false`, the codex entry
`reasoning: true`. Comparing the bare ids would confound route with reasoning,
and reasoning drives runtime far harder than transport does.

Both factor levels therefore carry the `-no-thinking` suffix, which resolves to
`--thinking off` on both arms. In `run-batch.sh` the codex ids are matched
verbatim in the pi case-map (the strip guard skips `*-codex-no-thinking`);
without that guard the explicit case entry would be unreachable and the arm
would silently run with default reasoning.

## Routing

| Lab variant | Provider | Route | Auth |
|---|---|---|---|
| `gpt-5-6-sol-no-thinking` | `requesty` | `azure/gpt-5.6-sol@swedencentral` | `REQUESTY_API_KEY` (env) |
| `gpt-5-6-sol-codex-no-thinking` | `openai-codex` | `chatgpt.com/backend-api` | OAuth, `pi-config/agent/auth.json` |

Wiring details and the two traps (mandatory `openai-codex/` model prefix;
expiring OAuth token that cannot come from `.env`) are documented in
`experiments/docker/pi-config/README.md`.

## Existing data

**As of 2026-08-16**: n=4 per cell, from the ad-hoc comparison in commit
`1297f106` (batch plans `sol-route-speed{,-2}.json`, both untracked). Those runs
match this RQ's selector exactly -- same workflow, kata, prompt and factor
levels -- so they count toward `min_replicates`. **One fill run per cell** is
outstanding to reach n=5.

Two properties of the existing data are worth carrying forward:

- The four runs per arm ran across **two batches at different times of day**
  (midday and evening). Throughput was practically identical between batches
  (Requesty 3448/3427 tok/s, codex 2035/2123), so no time-of-day effect
  contaminates the pooled cells.
- A ninth directory exists from an aborted start
  (`runs/_archive/aborted-2026-08-16/`). It carries no metrics and is **not** a
  data point; it is archived rather than deleted so the run-id sequence stays
  explicable.

## Hypotheses

- **H1 (throughput)**: Requesty delivers measurably higher throughput
  (tokens/second) than the codex route. Ad-hoc evidence at n=4: 3435 vs 2079
  tok/s, a 1.65x gap, with non-overlapping ranges (3364-3516 vs 1997-2160).
  Expected to hold at n=5.
- **H2 (work volume)**: The model performs more work on the codex route --
  higher `cycle_count`, `refactorings_applied` and `total_tokens`. Ad-hoc
  evidence: in all 4 codex runs both cycles and refactorings exceeded *every*
  Requesty run (median 10 vs 8.5 cycles, 7.5 vs 5 refactorings). **Unexplained**
  at identical `--thinking off`; this RQ is meant to establish whether it
  reproduces, not yet why.
- **H3 (quality follows work, or does not)**: The open question this RQ adds to
  the ad-hoc measurement. Either the extra refactoring cycles on the codex route
  show up in the artefact (lower `smell_total`, lower `cognitive_max`, shorter
  functions) -- then the route buys quality with time -- or they do not, and the
  additional work is spin without an effect on the product. The ad-hoc runs did
  not evaluate quality metrics, so H3 is untested.
- **H4 (correctness is route-invariant)**: `tests_passing` and
  `verification_pct` do not differ between the routes. Ad-hoc evidence: 8/8
  runs green with `verification_pct: 1.0` on both arms. A route that changed
  correctness would be a much bigger finding than a slow one.

## Methodological notes

- `n=5` per cell as the lab default for a medium field.
- **`cost_usd` is not a price comparison in this RQ.** Both sides are priced
  with the same tariff ($5/$30/$0.50); the codex values are *measured* (pi ships
  inline costs on that route), the Requesty values are *computed* from the list
  price table in `compute-cost.py`. On a subscription no per-token charge is
  incurred at all. The metric is usable as a token-consumption proxy, not as a
  statement about what either route actually costs.
- **Throughput is not a stored metric.** Tokens/second has to be derived in
  analysis from `total_tokens / duration_seconds`. `duration_seconds` on its own
  is misleading here precisely because the arms do different amounts of work --
  the raw duration gap (2.62x at n=4) overstates the transport effect, which is
  1.65x on throughput.
- Cache behaviour differs between the routes and partly explains the throughput
  gap: Requesty reaches 93-94 % cache hits, codex 83 %. Worth reporting
  alongside the throughput figure rather than treating throughput as a pure
  transport property.
- The codex route depends on an **expiring OAuth token**. If it lapses mid-batch
  the affected runs die on auth, not on a rate limit, and the built-in backoff
  will not rescue them. Refresh `pi-config/agent/auth.json` before a fill batch
  (recipe in `experiments/docker/pi-config/README.md`).
