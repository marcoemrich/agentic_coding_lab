# Kimi K3 — Reevaluation after Route Stabilization

**Date:** 2026-08-05
**Background:** The K3 cell was unstable on both Requesty routes through 2026-07-29. After the
provider-side fix it was refilled on 2026-08-04 via `requesty/sference/kimi-k3`
(5/5 `ok`). This report places the result against the field.

**Data basis:** `game-of-life-example-mapping` × `exact-hybrid-v4.2-phase-continuation-pi`, n=5 per
cell, pi harness over Requesty. Source: `findings.md` of this RQ (12 cells, all filled).

---

## Why it was remeasured

The earlier `kimi-k3-nebius` runs were **discarded, not reused**. Both
Requesty routes to K3 were broken in the 2026-07-28/29 window: sference died mid-run
with `502 "problem with the provider stream"`, nebius ran into timeouts and
retry exhaustion. That made it impossible to separate which values describe the model and
which the provider — a cell that carries no statement about the model.

The route change also shifts the cost basis: sference bills with a
cache discount, nebius does not. Comparing the old numbers against the new ones would not have been
clean on the price side either.

---

## Result in field comparison

All four models reach `tests_passing` 100 % and Correctness (external) 1.00.

| Model | Smell Total | `cognitive_max` | `mccabe_max` | Code Mass (APP) | Complexity Peak | Cost/run | Wall-Clock |
|---|---|---|---|---|---|---|---|
| **Opus 5** | 2.0 | **2.4** 🏆 | **3.4** 🏆 | 151.8 | **5.8** 🏆 | $3.10 | 436 s |
| **GLM 5.2** | **1.0** 🏆 | 7.8 | 6.6 | 178.2 | 22.6 | $2.53 | 883 s |
| **Kimi K3** | 2.4 | 7.0 | 5.8 | 143.8 | 15.0 | **$0.64** 🏆 | 359 s |
| **GPT-5.6 SOL** | 3.6 | 13.4 | 9.4 | **134.8** 🏆 | 21.2 | $1.09 | **240 s** 🏆 |

All metrics: lower = better. Trophies apply against the full 12-model field of the RQ —
with one exception: on Wall-Clock, `deepseek-v4-pro` is faster field-wide at 200 s,
GPT-5.6 SOL only wins within these four.

---

## The version jump K2.7 → K3

K3 improves **every** quality axis over the previous generation, at a practically
unchanged price.

| Model | Smell Total | `cognitive_max` | `mccabe_max` | Complexity Peak | Cost/run | Wall-Clock | Tokens |
|---|---|---|---|---|---|---|---|
| Kimi K2.7 | 3.0 | 10.8 | 7.2 | 21.6 | $0.60 | 234 s | 1.34 M |
| **Kimi K3** | 2.4 | 7.0 | 5.8 | 15.0 | $0.64 | 359 s | 1.02 M |

The `cognitive_max` jump (10.8 → 7.0) is larger than the GLM step 5.1 → 5.2
(9.6 → 7.8), but stays well behind the Anthropic jump 4.8 → 5 (9.6 → 2.4).
The Complexity Peak improvement lifts K3 from mid-field to 15.0.

The progress is paid for in wall-clock: 53 % more runtime at **fewer** tokens
(1.34 M → 1.02 M). K3 therefore spends more time per token instead of producing more.

**One confounder remains.** The two generations run over different back-providers
(K2.7 via TensorX, K3 via Sference). Provider-side differences cannot be separated from
model behavior. Cost is no longer a confounder — both routes bill with a
cache discount, and the 4-cent difference lies within the estimation noise.

---

## Assessment

**K3 is the best all-rounder and the price-performance winner of the field.** Fourth place
on Smell Total (2.4) and `cognitive_max` (7.0) for $0.64 — four cents above the cheapest
model of the entire RQ. On top of that the second-smallest Code Mass (APP) (143.8) and, at 359 s, in the fast
third. No axis won except price, but not trailing on any either.

Against the quality winner stands a factor of 4.8 in price versus a factor of three in
Complexity Peak: Opus 5 takes all three complexity axes by a wide margin
(`cognitive_max` 2.4 against 6.6 for the next-best model in the field), but costs $3.10. Whether
that pays off depends on how much Complexity Peak matters for the target codebase — on
game-of-life the absolute values are small in both directions.

GLM 5.2 holds the smell crown at 1.0, though softly: GLM scatters across the five runs from
0 to 3 (σ = 1.41), while K3 sits at σ = 0.55 and Opus 5 lands every run exactly on 2
(σ = 0). At n=5 the ordering holds, the separation does not.

**On this kata Correctness is saturated** — nine of the twelve models sit at 1.00. Model
selection here is decided purely on quality, price and time, not on
capability. For the hard kata (`claim-office`, RQ-model-novel-pi) the picture looks different;
there Correctness still separates the field.

---

## Open points

- **Back-provider confounder K2.7/K3** remains. Resolvable only through a K2.7 cell
  on sference — if the route carries the model.
- **Opus 5 on claim-office** sits in the pool as 5 runs, but is not in the
  RQ aggregation and has no ESLint analysis. For a cross-kata comparison of the four
  models considered here, the cell would have to go through the pipeline regularly
  (`/reanalyze RQ-model-novel-pi`).
