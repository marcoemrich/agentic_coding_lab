---
id: RQ-astra-pi
question: "On the OpenAI subscription route, how does GPT-6 Astra compare to the strongest references reachable on the pi harness — Sol on the same route, Sol on Requesty in both reasoning states, and Opus 5 on Requesty — at constant harness, workflow, kata and prompt style?"
factors:
  # One lab id per (route, reasoning) cell. The route is always explicit in
  # the id; the reasoning state is a property of the pi-config profile, not a
  # per-run flag (see "Profile split" below).
  model:
    - gpt-6-astra-codex-no-thinking   # NEW — subscription, openai-codex/gpt-6-astra
    - gpt-5-6-sol-codex-no-thinking   # subscription — same-route anchor
    - gpt-5-6-sol-no-thinking         # Requesty, reasoning off — route-calibration pair
    - gpt-5-6-sol-reasoning           # Requesty, reasoning ON — reasoning control
    - opus-5-requesty                 # Requesty — the Anthropic reference
controls:
  workflow: v6.2.1-phase-continuation-pi
  kata_base: game-of-life
  prompt: example-mapping
outcomes:
  # primary: code quality. game-of-life carries the quality signal, and the
  # route difference RQ-route-effect-pi measured is largest on exactly these.
  - cognitive_max
  - cognitive_avg
  - mccabe_max
  - mccabe_avg
  - cc_longest_function
  - cc_avg_loc_per_function
  - cc_median_loc_per_function
  - smell_total
  - smell_complexity
  - smell_magic_numbers
  - smell_duplication
  - lines_of_code
  # Code Mass (APP) — reported without trophy: APP has no notion of nesting
  # and rewards one long function. See RQ-architecture-axis-sol-pi,
  # "Metric blind spot".
  - code_mass
  # secondary: correctness. Saturated at 100 % in every route cell of
  # RQ-route-effect-pi (F-1.3.4), so this gates rather than differentiates —
  # an Astra cell that drops here disqualifies itself regardless of its
  # quality numbers.
  - verification_pct
  - tests_passing
  - tests_total
  # tertiary: TDD discipline. predictions_correct_rate only, never
  # predictions_total — see "Marker caveats".
  - cycle_count
  - refactorings_applied
  - predictions_correct_rate
  # context / throughput. cost_usd is deliberately NOT an outcome, and the
  # reason is asymmetric rather than uniform: the Sol codex cell carries
  # measured inline costs, the Astra entry ships without a `cost` block, the
  # Requesty cells are computed from list prices. See "Marker caveats".
  - completed_within_budget
  - duration_seconds
  - total_tokens
min_replicates: 5
status: aktiv
---

# RQ-astra-pi: Where Does GPT-6 Astra Sit Against the pi References?

## The question this answers

GPT-6 Astra is reachable in the lab on exactly one transport: the OpenAI
subscription route (`openai-codex/gpt-6-astra`, `chatgpt.com/backend-api`,
OAuth). It is not offered on Requesty — the router's catalogue was checked on
2026-09-05 and carries no Astra entry among its 90 models, only the GPT-5.6
siblings Sol, Luna and Terra.

That single fact decides the design of this RQ. Astra cannot be dropped into
`RQ-model-quality-pi`, whose twelve cells are all Requesty-routed and whose
question says so explicitly. The comparison has to carry its own route
calibration instead.

## Why this is a separate RQ and not an extension of RQ-model-quality-pi

`RQ-route-effect-pi` measured the route difference on **one and the same
model** (Sol), at **exactly the controls this RQ uses** —
`game-of-life-example-mapping` × `v6.2.1-phase-continuation-pi`, n=5 per cell:

| | Requesty (reasoning off) | Requesty (reasoning ON) | Subscription |
|---|---:|---:|---:|
| Complexity Peak | 8.0 | 9.0 | **4.0** |
| Smell Total | 2.0 | 2.0 | **0.0** |
| Production LoC | 28 | 28 | 41 |
| Cycles / Refactorings | 8 / 5 | 8 / 5 | 10 / 7 |
| Throughput (tok/s) | 3379 | 2899 | 2074 |

F-1.3.6 establishes that this is a **route** effect, not a reasoning effect:
switching reasoning on for the Requesty arm does not reproduce the
subscription profile on any quality metric. An Astra cell placed among
Requesty cells would therefore be unattributable — any Astra advantage on
`cognitive_max` or `smell_total` would be indistinguishable from the known
route bonus. That is the confound CLAUDE.md forbids ("Never mix control
values into a controlled RQ — Open a new RQ instead").

The construction here does the opposite: it puts **both Sol arms into the same
RQ**, so the route delta is re-measured inside this cell matrix rather than
imported as a caveat. Astra-vs-Opus-5 across the route boundary can then be
read net of a delta that the same batch pool establishes.

## Existing data — four of five cells are already filled

Aggregation is query-based over `experiments/runs/`, so every run whose
(kata, workflow, model) matches counts regardless of which batch produced it.
On these controls the pool already holds (verified 2026-09-05):

| Cell | Route | Reasoning | pi-config profile | n | Source RQ |
|---|---|---|---|---:|---|
| `gpt-6-astra-codex-no-thinking` | subscription | ON (forced) | `pi-config` | **0** | — |
| `gpt-5-6-sol-codex-no-thinking` | subscription | ON (forced) | `pi-config` | 5 ✅ | RQ-route-effect-pi |
| `gpt-5-6-sol-no-thinking` | Requesty | off | `pi-config` | 5 ✅ | RQ-route-effect-pi |
| `gpt-5-6-sol-reasoning` | Requesty | ON | `pi-config-reasoning` | 5 ✅ | RQ-route-effect-pi |
| `opus-5-requesty` | Requesty | off | `pi-config` | 5 ✅ | RQ-model-quality-pi |

All 20 existing runs exited `ok`. **Net new work: 5 Astra runs.**

### Why Opus 5 comes from Requesty and not from Claude Code

The Anthropic reference the RQ needs is `opus-5-requesty`, already filled at
n=5 on these exact controls. It holds harness, workflow, kata and prompt style
constant against every other cell; only the route differs, and that difference
is calibrated by the Sol pair above.

Routing Opus 5 over the **Anthropic** subscription instead (bare `opus-5`,
native OAuth via the env-blanking bypass in Claude Code) was considered and
rejected. It buys nothing and costs more: the run pool holds no `opus-5` cell
on any v6.2.x Claude Code workflow with `game-of-life` — only n=3 on
`v4-exact-subagents` — so it would need a fresh fill, and it would add a
harness confound (CC vs pi) plus a workflow confound (`v6.2.1-phase-continuation`
vs `-pi`) on top of the route question. The apparent symmetry of
"subscription against subscription" does not cancel anything either: the
OpenAI and Anthropic subscriptions are different vendors on different APIs.

## Model wiring

Wired 2026-09-05, mirroring the Spark precedent:

| Lab id | pi `--model` | Reasoning |
|---|---|---|
| `gpt-6-astra-codex` | `openai-codex/gpt-6-astra` | model default |
| `gpt-6-astra-codex-no-thinking` | `openai-codex/gpt-6-astra` | `--thinking off` |

The `-codex` suffix is carried in the lab id because the route is always
explicit in the id and the upstream name `gpt-6-astra` gives no route hint of
its own (unlike `gpt-5.3-codex-spark`). The `openai-codex/` provider prefix in
`--model` is mandatory — a bare id resolves against the azure-openai-responses
entry and dies with "No API key found".

The factor level is the **`-no-thinking` arm**, matching the filled Sol cell
`gpt-5-6-sol-codex-no-thinking` so the two subscription cells differ only in
the model. Per F-1.3.5 the flag does not actually suppress reasoning on this
route — the Responses API reasons server-side regardless — so the arm is a
label match, not a reasoning claim.

Confirmed for Astra by the smoke run (2026-09-05): `--thinking off` was passed
and `metrics.json` records `thinking: false`, yet the raw transcript carries
**501 `thinking` blocks**. The count is *not* comparable to the 2667–3311 that
RQ-route-effect-pi reports for Sol on this route — raw transcripts are pruned
from all but 13 of the 1354 runs in the pool, so Sol's cannot be recounted with
the same method. That Astra reasons at all despite the flag is established;
how much it reasons relative to Sol is not.

**Correction (2026-09-05): the `models.json` entry did not exist when these runs
were recorded.** Only `run-batch.sh` was wired; `gpt-6-astra` was absent from
`pi-config/agent/models.json`, so pi logged `Model "gpt-6-astra" not found for
provider "openai-codex". Using custom model id.` and fell back to Sol's tariff
for pricing. The model itself ran correctly — transcripts record `gpt-6-astra`
throughout — but two of the five runs carry a fabricated `cost_usd`, since
normalised to 0. The entry has been added, mirroring Spark (no `cost` block).

`contextWindow` (272000) and `maxTokens` (128000) in that entry
are **inherited from the GPT-5.6 family defaults, not confirmed for Astra**.
Under-declaring a window is safe; if Astra's real window is larger, the entry
leaves capacity unused. Verify against upstream before reading any
context-pressure result.

## Hypotheses

**H1 — Astra beats Sol on its own route.** Against
`gpt-5-6-sol-codex-no-thinking`, Astra improves Complexity Peak and Smell
Total. This is the clean intra-route, intra-vendor comparison and the only one
in the matrix with no confound at all.

**H2 — Astra clears Opus 5 net of the route delta.** Astra's advantage over
`opus-5-requesty` on the quality metrics exceeds the Sol-measured route delta
(Complexity Peak 8.0 → 4.0, Smell Total 2.0 → 0.0). If it does not, the
apparent advantage is the transport, not the model. This is the hypothesis the
RQ exists for, and the Sol pair is what makes it testable.

**H3 — Correctness stays saturated.** `verification_pct` = 1.0 in every cell,
as in RQ-route-effect-pi. game-of-life does not discriminate on correctness
under v6.2.1; a drop would signal an Astra-specific loop failure, not a
capability gap.

**H4 — Astra is slower than the Requesty cells.** Throughput on the
subscription route sat at 2074 tok/s against Requesty's 3379 (1.63×,
replicated on a second kata). If Astra reproduces that band, the gap is
transport; if it lands markedly below, it is model-side reasoning volume.

## Marker caveats

These are properties of the codex route established in `RQ-spark-vs-sol` and
apply to the Astra cell unchanged:

- **Phase timings and context utilization are not measured.**
  `avg_cycle_seconds`, `avg_red_seconds`, `avg_green_seconds`,
  `avg_refactor_seconds` and `context_utilization_pct` come back 0 on this
  route despite millions of tokens. Parser gap, not measurement — they are
  excluded from `outcomes:` and must not be reintroduced without fixing the
  parser first.
- **`predictions_total` is not comparable across models on this route.** Spark
  logged prediction counts that do not scale with `cycle_count` the way Sol's
  do; whether the model emits the markers at a different rate or the parser
  picks them up inconsistently is unresolved. Only
  `predictions_correct_rate` — a ratio within each model — is read here.
  Check the Astra smoke run against this before trusting the discipline column.
- **`cost_usd` has three different provenances in this matrix and is not an
  outcome.** The Sol codex cell carries *measured* inline costs (0.82–1.24 USD
  across its five runs — pi ships them on the Responses API). The Astra entry
  in `models.json` ships without a `cost` block, but that no longer decides the
  metric: since 2026-09-05 `compute-cost.py` PRICES is the single source for all
  pi runs on both routes, and Astra's verified tariff ($10/$50/$1.00 per 1M) sits
  there. The column is a list-price comparison across all five cells, never a
  bill. See the correction above for how it got there. The three Requesty cells are computed from the list-price table
  in `compute-cost.py`. Reading the column would make Astra look free. Never
  quote it as a price comparison; on a flat-rate subscription no per-token
  charge is incurred at all.

### Within-configuration variance bounds what is readable

`RQ-model-quality-pi` carries a **second** reasoning-off Sol cell on these
identical controls under the bare id `gpt-5-6-sol` (no `--thinking` flag,
where `gpt-5-6-sol-no-thinking` passes the redundant `off`). Both address
`requesty/azure/gpt-5.6-sol@swedencentral` through the same `pi-config`
profile, which declares `reasoning: false` — they are the same configuration.
They do not measure the same:

| id | Complexity Peak (median) | range | Smell Total | Production LoC |
|---|---:|---:|---:|---:|
| `gpt-5-6-sol-no-thinking` | 8.0 | 4–17 | 2.0 | 28 |
| `gpt-5-6-sol` | 17.0 | 4–17 | 4.0 | 26 |

Identical ranges, medians nine points apart at n=5. This is the noise floor of
`cognitive_max` on this kata, not a configuration effect — and it is larger
than most of the between-cell differences this RQ is built to detect. Read no
Complexity Peak gap below roughly this magnitude as real, in either direction.
`gpt-5-6-sol` is deliberately kept **out** of `factors.model`: as a nominal
duplicate it would enter the trophy table as its own cell and imply a
difference where there is none. It is recorded here as a variance estimate
instead.

## Methodological notes

### Profile split — a fill plan must not mix profiles

`PI_CONFIG_DIR` is container-global, so the pi-config profile applies to the
whole batch, not per run. Four cells sit on `pi-config`, one
(`gpt-5-6-sol-reasoning`) on `pi-config-reasoning`. This constrains **filling**,
not aggregation: the existing runs are already recorded, and the only open cell
(Astra) is on `pi-config`, so the fill batch is single-profile. Should the
`-reasoning` cell ever need a refill, it has to run as its own plan.

### OAuth expiry

`pi-config/agent/auth.json` is gitignored, host-provisioned and expires. The
token in place on 2026-09-05 runs to **2026-09-15**. A token that expires
mid-batch kills the affected runs on auth, not on a model error — check the
expiry before starting a fill:

```bash
python3 -c "import json,datetime;print(datetime.datetime.fromtimestamp(json.load(open('experiments/docker/pi-config/agent/auth.json'))['openai-codex']['expires']/1000))"
```

### Further notes

- `n=5` per cell follows memory [[replicates-n-reliability]] (default for a
  medium field).
- `mutation_score` is not an outcome: opt-in per RQ and expensive, and the
  question here is structural quality, not test strength.
- Cross-reading against the twelve Requesty cells of `RQ-model-quality-pi` is
  legitimate **only** through the route delta established here — never by
  merging cells across the two RQs.
