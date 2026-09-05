# RQ-route-effect-pi — Findings

Effect of transport route and reasoning channel on one and the same model
(GPT-5.6 Sol), at constant harness, workflow, kata and prompt style.
`game-of-life-example-mapping` × `v6.2.1-phase-continuation-pi`, n=5 per cell.

**The harness is pi in every cell — this is not a harness comparison.** The
`codex` in the lab ids names the pi provider `openai-codex` through which the
OpenAI subscription is reached, not the Codex CLI (a separate harness, unused
in this lab). Prose below says "subscription route"; ids keep the literal
`codex`. See the RQ README, section "Naming".

## Overview

Median per cell. Direction per column; ties get a trophy on every winning cell.

| Cell | Route | Reasoning | Throughput (tok/s) höher = besser | Duration (s) kleiner = besser | Complexity Peak kleiner = besser | Smell Total kleiner = besser | Production LoC kleiner = besser | Correctness (external) höher = besser |
|---|---|---|---:|---:|---:|---:|---:|---:|
| `gpt-5-6-sol-no-thinking` | Requesty | off | **3379** 🏆 | **251** 🏆 | 8.0 | 2.0 | **28** 🏆 | **100 %** 🏆 |
| `gpt-5-6-sol-reasoning` | Requesty | ON | 2899 | 304 | 9.0 | 2.0 | **28** 🏆 | **100 %** 🏆 |
| `gpt-5-6-sol-codex-no-thinking` | OpenAI subscription | ON | 2074 | 614 | **4.0** 🏆 | **0.0** 🏆 | 41 | **100 %** 🏆 |
| _subscription route without reasoning_ | OpenAI subscription | — | _not constructible — see F-1.3.5_ | | | | | |

## F-1.3.6 — The subscription-route quality advantage is a route effect, not a reasoning effect

This is the finding the RQ was rebuilt to answer. Switching reasoning **on** for
the Requesty route does not reproduce the subscription-route profile on any quality metric:

| | Requesty off | Requesty **ON** | subscription ON |
|---|---:|---:|---:|
| Complexity Peak | 8.0 | 9.0 | **4.0** |
| Smell Total | 2.0 | 2.0 | **0.0** |
| Production LoC | 28 | 28 | 41 |
| Cycles / Refactorings | 8 / 5 | 8 / 5 | 10 / 7 |

Reasoning was verified active in all five runs of the middle cell (207–1649
thinking blocks, never zero). Yet Complexity Peak does not improve — it is
marginally *worse* — and Smell Total, LoC, cycles and refactorings are
unchanged. The subscription cell sits apart from both Requesty cells on every one of
them.

The single-run distributions make the same point more sharply than the medians:
Requesty ranges 4–17 on Complexity Peak in **both** reasoning states, while
the subscription route stays inside 3–7. That is not a gradient along thinking effort; it is a
different régime.

**Consequence**: the extra thoroughness on the subscription route — more refactoring
passes, halved complexity peak, zero smells — is not bought by the reasoning
channel. What produces it is not identified by this RQ. Remaining candidates,
none of them separated here: server-side defaults of the Responses API
(sampling parameters, system-prompt handling, tool-call semantics), or a
different serving backend behind the same model name. That is a question for a
follow-up, not an answer this data supports.

## F-1.3.5 — Reasoning is coupled to the route and cannot be switched off on the subscription route

The two routes speak different APIs, and that decides whether the model reasons:

| Route | API | thinking blocks per run |
|---|---|---|
| Requesty | `openai-completions` | 0 (all 5 runs, default profile) |
| OpenAI subscription | `openai-codex-responses` | 2667–3311 (all 5 runs) |

`--thinking off` does not change this. It sets pi's thinking *level*; on the
Responses API the lowest level still reasons, and on Chat Completions there is
no reasoning channel at all.

Declaring `reasoning: false` in `models.json` works on Requesty in both
directions (0 ↔ 207–1649 blocks) but **not** on the subscription route: a run with a verified
`reasoning: false` profile, verified `PI_CONFIG_DIR` and verified API produced
2882 blocks — the same volume as the standard runs. The Responses API decides
server-side; the client declaration is not honoured. The fourth cell is
therefore documented as unattainable rather than left open.

## F-1.3.1 — Requesty delivers 1.63× the throughput, and it is a transport effect

Median 3379 vs 2074 tokens/second between the two `-no-thinking` cells. Stable
across replicates and unchanged across two batches roughly ten hours apart
(Requesty 3448/3427, subscription 2035/2123), so upstream load is not the driver. Cache
behaviour explains part of it (93–94 % hits vs 83 %).

The reasoning cell settles the attribution that was open in the first version of
this finding. Reasoning does cost throughput on Requesty — 3379 → 2899 tok/s,
about 14 % — but that is far short of the gap to the subscription route at 2074. Reasoning-on
Requesty is still 1.40× faster than the subscription route. Most of the difference is transport.

**Replicated on a second kata.** On `sphinx-score-example-mapping` (n=3 per
route) the gap is 3432 vs 2388 tok/s — 1.44×, the same order as the 1.63× here.
Requesty's absolute throughput is nearly identical across both katas (3379 /
3432), the subscription route's a little higher on sphinx (2074 / 2388). This is the most robust
finding of the RQ: it holds across katas, across replicates, across time of day,
and it survives the reasoning control.

## F-1.3.2 — The subscription cell produces the structurally cleaner artefact — on game-of-life

Complexity Peak halves against both Requesty cells (4.0 vs 8.0/9.0), Smell Total
drops to zero (vs 2.0/2.0), `smell_complexity` is 0 in all 5 subscription-route runs.

Variance is part of the finding: Requesty's Complexity Peak spans 4–17 (σ=5.6)
with reasoning off and 4–17 with it on, subscription 3–7 (σ=1.5). The subscription cell is
both better and markedly more predictable. Attribution: route, not reasoning
(F-1.3.6).

**This does not generalise across katas.** A replication on
`sphinx-score-example-mapping` (n=3 per route, same workflow, default profile)
holds only half of it:

| | game-of-life | sphinx-score |
|---|---|---|
| Complexity Peak (Req / subscription) | 8.0 / **4.0** | 2.0 / 2.0 — no difference |
| Smell Total (Req / subscription) | 2.0 / **0.0** | 3.0 / **0.0** |
| Production LoC (Req / subscription) | 28 / 41 | 49 / **36** |

The smell advantage replicates. The complexity advantage does not: on
sphinx-score both routes sit at 2.0, essentially at the floor — that kata does
not generate enough structural complexity to discriminate. The metric needs a
kata that produces complexity before it can show a route difference.

The LoC relation even **inverts**: the subscription route writes more code than Requesty on
game-of-life (41 vs 28) and less on sphinx-score (36 vs 49). An earlier reading
of this finding — "the subscription route buys structure with volume" — is therefore not
supported; the volume relation is kata-dependent, not a property of the route.

Scope: the structural advantage is established for smells across two katas, and
for Complexity Peak only where the kata generates complexity.

## F-1.3.3 — More TDD cycles and refactorings in the subscription cell

Median 10 vs 8 cycles and 7 vs 5 refactorings against both Requesty cells, which
are identical to each other on both counts. In the first eight runs the
separation was absolute; the fifth replicate broke that and the ranges now
overlap (cycles 8–9 vs 8–11, refactorings 3–6 vs 5–9), so only the medians
separate. Weakest of the findings, but the reasoning cell does confirm it tracks
the route rather than thinking effort.

## F-1.3.4 — Correctness is invariant across every cell

All 17 runs pass: `tests_passing` true and `verification_pct` 1.0 everywhere,
including both feasibility smokes, `completed_within_budget` 100 %. Neither route
nor reasoning affects whether the task gets solved — they affect speed, work
volume and code structure.

`tests_total` tracks `cycle_count` (9.8 subscription vs 8.4 Requesty mean), i.e. the
subscription cell also writes more tests. Whether those tests are worth their count is
not answered here; `mutation_score` is not among this RQ's outcomes.

The sphinx-score replication tests this against a kata where external
verification is **not** saturated by construction: `sphinx-score` is built
around ambiguity (does a Sphinx count itself as a type? do three Undead-Warrior
variants count as one type or three?), so `verification_pct` had room to
separate. It did not. Both routes score 100 % median, with an identical
per-run distribution (16/16, 15/16, 16/16) — even the single failing scenario
appears once on each side. Ambiguity resolution is route-invariant too.

## Reading the cost column

`cost_usd` is a **list-price comparison value** — what the work would have cost
over the API — not a billed amount. Both sides are priced with the same tariff
($5/$30/$0.50) from the table in `compute-cost.py`, which since 2026-09-05 is
the single source for every pi run on both routes. It replaced pi's own inline
figure on the subscription route, which was not reproducible from the recorded
token counts (a fit over 83 codex runs returns a negative input price at 33.6 %
mean error, most likely because the >272k tariff tiers apply per request).

Two limits stand. On a subscription no per-token charge is incurred at all, so
this is never a bill. And the tiers are not modelled, so the figures are a lower
bound for runs with large single requests — consistently across all cells, which
is what a comparison needs.
