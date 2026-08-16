# RQ-route-effect-pi — Findings

Effect of transport route and reasoning channel on one and the same model
(GPT-5.6 Sol), at constant harness, workflow, kata and prompt style.
`game-of-life-example-mapping` × `v6.2.1-phase-continuation-pi`, n=5 per cell.

## Overview

Median per cell. Direction per column; ties get a trophy on every winning cell.

| Cell | Route | Reasoning | Throughput (tok/s) höher = besser | Duration (s) kleiner = besser | Complexity Peak kleiner = besser | Smell Total kleiner = besser | Production LoC kleiner = besser | Correctness (external) höher = besser |
|---|---|---|---:|---:|---:|---:|---:|---:|
| `gpt-5-6-sol-no-thinking` | Requesty | off | **3379** 🏆 | **251** 🏆 | 8.0 | 2.0 | **28** 🏆 | **100 %** 🏆 |
| `gpt-5-6-sol-reasoning` | Requesty | ON | 2899 | 304 | 9.0 | 2.0 | **28** 🏆 | **100 %** 🏆 |
| `gpt-5-6-sol-codex-no-thinking` | codex | ON | 2074 | 614 | **4.0** 🏆 | **0.0** 🏆 | 41 | **100 %** 🏆 |
| _codex without reasoning_ | codex | — | _not constructible — see F-1.3.5_ | | | | | |

## F-1.3.6 — The codex quality advantage is a route effect, not a reasoning effect

This is the finding the RQ was rebuilt to answer. Switching reasoning **on** for
the Requesty route does not reproduce the codex profile on any quality metric:

| | Requesty off | Requesty **ON** | codex ON |
|---|---:|---:|---:|
| Complexity Peak | 8.0 | 9.0 | **4.0** |
| Smell Total | 2.0 | 2.0 | **0.0** |
| Production LoC | 28 | 28 | 41 |
| Cycles / Refactorings | 8 / 5 | 8 / 5 | 10 / 7 |

Reasoning was verified active in all five runs of the middle cell (207–1649
thinking blocks, never zero). Yet Complexity Peak does not improve — it is
marginally *worse* — and Smell Total, LoC, cycles and refactorings are
unchanged. The codex cell sits apart from both Requesty cells on every one of
them.

The single-run distributions make the same point more sharply than the medians:
Requesty ranges 4–17 on Complexity Peak in **both** reasoning states, while
codex stays inside 3–7. That is not a gradient along thinking effort; it is a
different régime.

**Consequence**: the extra thoroughness on the codex route — more refactoring
passes, halved complexity peak, zero smells — is not bought by the reasoning
channel. What produces it is not identified by this RQ. Remaining candidates,
none of them separated here: server-side defaults of the Responses API
(sampling parameters, system-prompt handling, tool-call semantics), or a
different serving backend behind the same model name. That is a question for a
follow-up, not an answer this data supports.

## F-1.3.5 — Reasoning is coupled to the route and cannot be switched off on codex

The two routes speak different APIs, and that decides whether the model reasons:

| Route | API | thinking blocks per run |
|---|---|---|
| Requesty | `openai-completions` | 0 (all 5 runs, default profile) |
| codex | `openai-codex-responses` | 2667–3311 (all 5 runs) |

`--thinking off` does not change this. It sets pi's thinking *level*; on the
Responses API the lowest level still reasons, and on Chat Completions there is
no reasoning channel at all.

Declaring `reasoning: false` in `models.json` works on Requesty in both
directions (0 ↔ 207–1649 blocks) but **not** on codex: a run with a verified
`reasoning: false` profile, verified `PI_CONFIG_DIR` and verified API produced
2882 blocks — the same volume as the standard runs. The Responses API decides
server-side; the client declaration is not honoured. The fourth cell is
therefore documented as unattainable rather than left open.

## F-1.3.1 — Requesty delivers 1.63× the throughput, and it is a transport effect

Median 3379 vs 2074 tokens/second between the two `-no-thinking` cells. Stable
across replicates and unchanged across two batches roughly ten hours apart
(Requesty 3448/3427, codex 2035/2123), so upstream load is not the driver. Cache
behaviour explains part of it (93–94 % hits vs 83 %).

The reasoning cell settles the attribution that was open in the first version of
this finding. Reasoning does cost throughput on Requesty — 3379 → 2899 tok/s,
about 14 % — but that is far short of the gap to codex at 2074. Reasoning-on
Requesty is still 1.40× faster than codex. Most of the difference is transport.

## F-1.3.2 — The codex cell produces the structurally cleaner artefact

Complexity Peak halves against both Requesty cells (4.0 vs 8.0/9.0), Smell Total
drops to zero (vs 2.0/2.0), `smell_complexity` is 0 in all 5 codex runs. Bought
with volume rather than saved by it: codex writes **more** code (Production LoC
41 vs 28) — not a smaller solution, a better-decomposed one.

Variance is part of the finding: Requesty's Complexity Peak spans 4–17 (σ=5.6)
with reasoning off and 4–17 with it on, codex 3–7 (σ=1.5). The codex cell is
both better and markedly more predictable. Attribution: route, not reasoning
(F-1.3.6).

## F-1.3.3 — More TDD cycles and refactorings in the codex cell

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

`tests_total` tracks `cycle_count` (9.8 codex vs 8.4 Requesty mean), i.e. the
codex cell also writes more tests. Whether those tests are worth their count is
not answered here; `mutation_score` is not among this RQ's outcomes.

## Reading the cost column

`cost_usd` is **not** a price comparison and must not be quoted as one. Both
sides are priced with the same tariff ($5/$30/$0.50); the codex figures are
measured (pi ships inline costs on that route), the Requesty figures are
computed from the list-price table in `compute-cost.py`. On a subscription no
per-token charge is incurred at all. Usable as a token-consumption proxy,
nothing more.
