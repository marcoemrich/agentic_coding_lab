# RQ-route-effect-pi — Findings

Effect of transport route and reasoning channel on one and the same model
(GPT-5.6 Sol), at constant harness, workflow, kata and prompt style.
`game-of-life-example-mapping` × `v6.2.1-phase-continuation-pi`.

## Overview

Median per cell. Direction per column; ties get a trophy on every winning cell.

| Cell | Route | Reasoning | n | Throughput (tok/s) höher = besser | Duration (s) kleiner = besser | Complexity Peak kleiner = besser | Smell Total kleiner = besser | Correctness (external) höher = besser |
|---|---|---|---:|---:|---:|---:|---:|---:|
| `gpt-5-6-sol-no-thinking` | Requesty | off | 5 | **3379** 🏆 | **251** 🏆 | 8.0 | 2.0 | **100 %** 🏆 |
| `gpt-5-6-sol-reasoning` | Requesty | ON | 1 | 3410 | 209 | _pending_ | _pending_ | **100 %** 🏆 |
| `gpt-5-6-sol-codex-no-thinking` | codex | ON | 5 | 2074 | 614 | **4.0** 🏆 | **0.0** 🏆 | **100 %** 🏆 |
| codex without reasoning | codex | — | — | not constructible (F-1.3.5) | | | | |

The reasoning cell is at n=1 and its quality columns are deliberately left
pending — a single run does not carry them. Findings that depend on it are
marked provisional below.

## F-1.3.5 — Reasoning is coupled to the route and cannot be switched off on codex

The two routes speak different APIs, and that decides whether the model reasons:

| Route | API | thinking blocks per run |
|---|---|---|
| Requesty | `openai-completions` | 0 (all 5 runs) |
| codex | `openai-codex-responses` | 2667–3311 (all 5 runs) |

`--thinking off` does not change this. It sets pi's thinking *level*; on the
Responses API the lowest level still reasons, and on Chat Completions there is
no reasoning channel at all.

Declaring `reasoning: false` in `models.json` works on Requesty (0 → 1649 blocks
when flipped to `true`, and back) but **not** on codex: a run with a verified
`reasoning: false` profile, verified `PI_CONFIG_DIR` and verified API produced
2882 blocks — the same volume as the standard runs. The Responses API decides
server-side; the client declaration is not honoured.

This finding is the reason the RQ cannot fully cross its two axes, and it
supersedes the original framing of this RQ as a pure transport comparison.

## F-1.3.1 — Requesty delivers 1.63× the throughput, but the comparison is not reasoning-constant

Median 3379 vs 2074 tokens/second between the two n=5 cells. The measurement is
solid: stable across replicates, and unchanged across two batches roughly ten
hours apart (Requesty 3448/3427, codex 2035/2123), so upstream load is not the
driver. Cache behaviour explains part of it (93–94 % hits vs 83 %).

**What it does not establish is a transport effect.** Those two cells differ in
route *and* in reasoning (F-1.3.5), so the throughput gap contains both an
unknown amount of transport and an unknown amount of reasoning compute. The
original version of this finding claimed the arms were reasoning-constant; that
claim was wrong.

First evidence against reasoning being the main driver: the single
`gpt-5-6-sol-reasoning` run (Requesty, reasoning ON) reached **3410 tok/s** in
209 s — indistinguishable from the same route with reasoning off (3379 tok/s,
251 s median) and far above codex (2074), despite emitting 1649 thinking blocks.
Throughput appears to track the route, not the reasoning channel. If this holds
at n=5, the 1.63× gap is a transport effect after all and F-1.3.1 stands as
originally measured, just for a better-established reason. **Provisional at
n=1.**

## F-1.3.2 — The codex cell produces the structurally cleaner artefact

Complexity Peak halves (median 8.0 → 4.0), Smell Total drops to zero (2.0 →
0.0), `smell_complexity` is 0 in all 5 codex runs, `mccabe_max` follows (6.8 →
4.6 mean). This is bought with volume rather than saved by it: the codex runs
write **more** code (Production LoC 41 vs 28, Code Mass 152 vs 137) — not a
smaller solution, a better-decomposed one.

Variance matters as much as the median: Requesty's Complexity Peak ranges 4–17
(σ=5.6), codex 3–7 (σ=1.5). The codex cell is not only better on this metric but
markedly more predictable.

**Attribution is open.** Reasoning is the obvious candidate, but with the two
cells differing on both axes it cannot be separated here. The
`gpt-5-6-sol-reasoning` cell decides it: if reasoning is the driver, its quality
metrics should land near the codex cell despite running on the Requesty
transport. Its quality columns are pending at n=1.

## F-1.3.3 — More TDD cycles and refactorings in the codex cell

Median 10 vs 8 cycles and 7 vs 5 refactorings. In the first eight runs the
separation was absolute — every codex run above every Requesty run on both
counts. The fifth replicate broke that; the ranges now overlap (cycles 8–9 vs
8–11, refactorings 3–6 vs 5–9) and only the medians separate. Weakest of the
findings even before attribution, and it carries the same route/reasoning
confound as F-1.3.2.

## F-1.3.4 — Correctness is invariant across every cell

All 12 runs pass: `tests_passing` true and `verification_pct` 1.0 everywhere,
including both feasibility smokes, `completed_within_budget` 100 %. Neither the
route nor the reasoning channel affects whether the task gets solved — they
affect speed, work volume and code structure.

`tests_total` tracks `cycle_count` (9.8 vs 8.4 mean), i.e. the codex cell also
writes more tests. Whether those tests are worth their count is not answered
here; `mutation_score` is not among this RQ's outcomes.

## Reading the cost column

`cost_usd` is **not** a price comparison and must not be quoted as one. Both
sides are priced with the same tariff ($5/$30/$0.50); the codex figures are
measured (pi ships inline costs on that route), the Requesty figures are
computed from the list-price table in `compute-cost.py`. On a subscription no
per-token charge is incurred at all. Usable as a token-consumption proxy,
nothing more.
