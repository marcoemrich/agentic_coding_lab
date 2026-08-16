# RQ-route-effect-pi — Findings

Route effect of Requesty vs the OpenAI subscription on one and the same model
(GPT-5.6 Sol), at constant harness, workflow, kata and prompt style.
n=5 per cell, `game-of-life-example-mapping` × `v6.2.1-phase-continuation-pi`,
both arms `--thinking off`.

## Overview

Median per cell. Direction is given per column; ties get a trophy on every
winning cell.

| Route | Throughput (tok/s) höher = besser | Duration (s) kleiner = besser | Complexity Peak kleiner = besser | Smell Total kleiner = besser | Production LoC kleiner = besser | Correctness (external) höher = besser |
|---|---:|---:|---:|---:|---:|---:|
| Requesty | **3379** 🏆 | **251** 🏆 | 8.0 | 2.0 | **28** 🏆 | **100 %** 🏆 |
| OpenAI subscription | 2074 | 614 | **4.0** 🏆 | **0.0** 🏆 | 41 | **100 %** 🏆 |

The two routes do not differ in what they achieve — both reach 100 % external
verification on all 5 runs — but in how they get there. Requesty is faster and
writes less code; the subscription route produces the structurally cleaner
artefact.

## F-1.3.1 — Requesty delivers 1.63× the throughput

Median 3379 vs 2074 tokens/second. Raw duration differs by 2.45× (251 s vs
614 s), but that overstates the transport effect: the codex runs also consume
more tokens (876 k vs 1226 k median), so part of the wall-clock gap is extra
work rather than a slower pipe. Throughput is the metric that separates the two.

The result is stable across replicates and across time of day. The first eight
runs were collected in two batches roughly ten hours apart, with throughput
practically unchanged between them (Requesty 3448/3427, codex 2035/2123), so
upstream load is not the driver.

Cache behaviour explains part of the gap and should be reported with it:
Requesty reaches 93–94 % cache hits against 83 % on the codex route. Throughput
here is a property of the route as configured, not of the raw transport alone.

## F-1.3.2 — The subscription route produces the structurally cleaner artefact

Complexity Peak halves (median 8.0 → 4.0), Smell Total drops to zero (2.0 →
0.0), `smell_complexity` is 0 in all 5 codex runs. `mccabe_max` follows the same
direction (6.8 → 4.6 mean).

This is bought with volume, not saved by it: the codex runs write **more** code
(Production LoC 41 vs 28, Code Mass 152 vs 137). The route does not produce a
smaller solution, it produces a better-decomposed one — complexity is spread
across more, shorter functions rather than concentrated in a peak.

The variance is as telling as the median. Requesty's Complexity Peak ranges 4–17
(σ=5.6), the codex route 3–7 (σ=1.5). A single Requesty outlier at 17 carries
much of its mean. The subscription route is not only better on this metric but
markedly more predictable.

## F-1.3.3 — More TDD cycles and refactorings on the subscription route

Median 10 vs 8 cycles and 7 vs 5 refactorings. In the first eight runs the
separation was absolute — every codex run exceeded every Requesty run on both
counts. The fifth replicate broke that: the ranges now overlap on both metrics
(cycles 8–9 vs 8–11, refactorings 3–6 vs 5–9). The medians still separate and
the direction holds, but this is the weakest of the four findings, and at n=5 a
clean separation can no longer be claimed.

Read together with F-1.3.2, the extra refactoring passes are not idle: they land
in the artefact as the lower Complexity Peak and Smell Total. The mechanism
behind the difference is nevertheless **unexplained**. Both arms address the
identical upstream model with `--thinking off` on both sides; nothing in the
workflow, kata or prompt differs. Candidate explanations not tested here:
different default sampling parameters on the two transports, or the differing
`reasoning` declaration in `models.json` (`false` on requesty, `true` on codex)
having an effect that survives `--thinking off`.

## F-1.3.4 — Correctness is route-invariant

All 10 runs pass: `tests_passing` true and `verification_pct` 1.0 in every cell,
`completed_within_budget` 100 % on both arms. The route affects speed, work
volume and code structure — it does not affect whether the task is solved.

`tests_total` tracks `cycle_count` (9.8 vs 8.4 mean), i.e. the codex route
also writes more tests. Whether those tests are worth their count is not
answered by this RQ; `mutation_score` is not among its outcomes.

## Reading the cost column

`cost_usd` (median $0.96 Requesty vs $1.06 codex) is **not** a price comparison
and must not be quoted as one. Both sides are priced with the same tariff
($5/$30/$0.50). The codex figures are measured — pi ships inline costs on that
route — while the Requesty figures are computed from the list-price table in
`compute-cost.py`. On a subscription no per-token charge is incurred at all.
The column is usable as a token-consumption proxy, nothing more.
