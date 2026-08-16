---
id: RQ-route-effect-pi
question: "How do transport route and reasoning channel each affect code quality, TDD discipline, throughput and correctness for one and the same model (GPT-5.6 Sol), at constant harness, workflow, kata and prompt style?"
factors:
  model:
    # Route x reasoning. Both axes live in the id because neither is a
    # per-run flag: the route is the pi provider, reasoning is a property of
    # the models.json entry and thus of the pi-config profile (see README).
    #
    #   id                             route         reasoning  profile
    - gpt-5-6-sol-no-thinking        # requesty      off        pi-config
    - gpt-5-6-sol-reasoning          # requesty      ON         pi-config-reasoning
    - gpt-5-6-sol-codex-no-thinking  # oai-subscr.  ON         pi-config
    # The fourth cell (subscription route without reasoning) is NOT constructible -- the
    # Responses API reasons regardless of the client declaration. Documented
    # in the README; do not add gpt-5-6-sol-codex-noreason as a factor level.
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

## Naming: "codex" here is a provider, not a harness

**The harness is pi in every cell of this RQ.** Nothing here compares harnesses.

`codex` appears in the lab ids (`gpt-5-6-sol-codex-no-thinking`) and in the
routing strings because that is the name of the **pi provider**
(`openai-codex`, api `openai-codex-responses`) through which the OpenAI
subscription is reached. It has nothing to do with the Codex CLI, which is a
separate coding harness and is not used anywhere in this lab.

The prose therefore says **"the OpenAI subscription route"** or **"the
subscription route"**; only ids and API strings keep the literal `codex`. In a
lab that compares four harnesses (Claude Code, OpenCode, pi, cursor-agent), a
reader could otherwise take these findings for a harness comparison, which they
are not.

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
doing **systematically more work** on the subscription route -- more cycles, more
refactorings, more tokens -- at identical `--thinking off`. Whether that
carries over into the artefact (code quality) is open, which is why this RQ
takes the full quality metric set rather than just duration.

## Reasoning is coupled to the route, not controllable per run

**`--thinking off` does not suppress reasoning on the subscription route.** Both factor
levels carry the `-no-thinking` suffix, and it was originally assumed that this
held reasoning constant. Transcript evidence from the first ten runs shows it
did not:

| Route | API | thinking blocks per run |
|---|---|---|
| Requesty | `openai-completions` (Chat Completions) | 0 (all 5 runs) |
| codex | `openai-codex-responses` (Responses API) | 2667–3311 (all 5 runs) |

The flag sets pi's *thinking level*, it does not switch the reasoning channel
off. On the Responses API the lowest level still reasons; on Chat Completions
there is no reasoning channel to begin with.

Reasoning is a property of the `models.json` entry, and that entry is
**container-global per model id** — it cannot be varied per run within a batch.
Each (route, reasoning) cell therefore needs its own lab id plus its own
pi-config profile, and a batch plan must not mix ids from different profiles.
Same constraint class as the container-global CC routing (see CLAUDE.md).

### One cell is not constructible

A `reasoning: false` declaration works on Requesty but **not** on the
subscription route:

| Route | `reasoning: false` | `reasoning: true` |
|---|---|---|
| Requesty | 0 blocks ✅ | 1649 blocks ✅ |
| OpenAI subscription | **2882 blocks ❌** | 2667–3311 ✅ |

The subscription-route smoke ran with a verified profile (`reasoning: false`,
`thinkingLevelMap` removed), a verified `PI_CONFIG_DIR` and a verified API
(`openai-codex-responses`) — and reasoned anyway, at the same volume as the
standard runs. **The Responses API decides server-side; a client declaring the
model cannot reason does not change that.** This is itself a finding about the
API, not a configuration defect, and the cell is documented as unattainable
rather than left open.

The consequence for this RQ is that route and reasoning cannot be fully crossed
for GPT-5.6 Sol. The reasoning effect is isolated on the Requesty side instead
(`gpt-5-6-sol-no-thinking` vs `gpt-5-6-sol-reasoning`), where the switch works
in both directions.

## Routing

| Lab variant | Provider | Route | Auth |
|---|---|---|---|
| `gpt-5-6-sol-no-thinking` | `requesty` | `azure/gpt-5.6-sol@swedencentral` | `REQUESTY_API_KEY` (env) |
| `gpt-5-6-sol-codex-no-thinking` | `openai-codex` | `chatgpt.com/backend-api` | OAuth, `pi-config/agent/auth.json` |

Wiring details and the two traps (mandatory `openai-codex/` model prefix;
expiring OAuth token that cannot come from `.env`) are documented in
`experiments/docker/pi-config/README.md`.

## Cross-kata replication (outside the cell matrix)

`kata_base: game-of-life` is a **control**, so the six
`sphinx-score-example-mapping` runs (n=3 per route, same workflow, default
profile, 2026-08-16) are deliberately **not** matched by this RQ's selector.
Making kata a factor axis would open the RQ and dilute the existing cells; the
runs live in the pool as a scope check on the findings, not as cells.

What they establish:

- **F-1.3.1 replicates**: 3432 vs 2388 tok/s (1.44×), same order as the 1.63×
  measured here. Throughput is the RQ's most robust finding.
- **F-1.3.2 replicates only in part**: the smell advantage holds (3.0 vs 0.0),
  the Complexity Peak advantage does not (2.0 vs 2.0 — both at the floor, the
  kata generates too little structural complexity to discriminate). The LoC
  relation inverts (subscription 36 vs Requesty 49, opposite of game-of-life).
- **F-1.3.4 holds on a kata that could have broken it**: sphinx-score is built
  around ambiguity, so `verification_pct` had room to separate the routes. It
  did not — 100 % median on both, identical per-run distribution.

A full cross-kata RQ would need kata as a declared factor and n=5 per cell.
This is a scope check, not that RQ.

## Existing data

**As of 2026-08-16**: n=4 per cell, from the ad-hoc comparison in commit
`1297f106` (batch plans `sol-route-speed{,-2}.json`, both untracked). Those runs
match this RQ's selector exactly -- same workflow, kata, prompt and factor
levels -- so they count toward `min_replicates`. **One fill run per cell** is
outstanding to reach n=5.

Two properties of the existing data are worth carrying forward:

- The four runs per arm ran across **two batches at different times of day**
  (midday and evening). Throughput was practically identical between batches
  (Requesty 3448/3427 tok/s, subscription 2035/2123), so no time-of-day effect
  contaminates the pooled cells.
- A ninth directory exists from an aborted start
  (`runs/_archive/aborted-2026-08-16/`). It carries no metrics and is **not** a
  data point; it is archived rather than deleted so the run-id sequence stays
  explicable.

## Hypotheses

- **H1 (throughput)**: Requesty delivers measurably higher throughput
  (tokens/second) than the subscription route. Ad-hoc evidence at n=4: 3435 vs 2079
  tok/s, a 1.65x gap, with non-overlapping ranges (3364-3516 vs 1997-2160).
  Expected to hold at n=5.
- **H2 (work volume)**: The model performs more work on the subscription route --
  higher `cycle_count`, `refactorings_applied` and `total_tokens`. Ad-hoc
  evidence: in all 4 subscription-route runs both cycles and refactorings exceeded *every*
  Requesty run (median 10 vs 8.5 cycles, 7.5 vs 5 refactorings). **Unexplained**
  at identical `--thinking off`; this RQ is meant to establish whether it
  reproduces, not yet why.
- **H3 (quality follows work, or does not)**: The open question this RQ adds to
  the ad-hoc measurement. Either the extra refactoring cycles on the subscription route
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
  with the same tariff ($5/$30/$0.50); the subscription-route values are *measured* (pi ships
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
  gap: Requesty reaches 93-94 % cache hits, subscription route 83 %. Worth reporting
  alongside the throughput figure rather than treating throughput as a pure
  transport property.
- The subscription route depends on an **expiring OAuth token**. If it lapses mid-batch
  the affected runs die on auth, not on a rate limit, and the built-in backoff
  will not rescue them. Refresh `pi-config/agent/auth.json` before a fill batch
  (recipe in `experiments/docker/pi-config/README.md`).
