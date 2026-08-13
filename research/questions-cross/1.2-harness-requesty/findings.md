# RQ-harness-requesty — Findings

Harness effect Claude Code (CC) vs OpenCode (OC) vs pi at constant model
(opus-4-8 via Requesty, `vertex/claude-opus-4-8@eu`), workflow intention
(`v6.2-with-why-cleaned{,-oc,-pi}`) and prompt style (`example-mapping`).
n=5 per cell, 6 cells (3 harnesses × 2 katas).

**Cost caveat (binding for all $ statements):** Requesty no longer returns an
inline `cost_usd` on this route (CC=null, OC=0 in the response). All three
harnesses therefore carry the **token×price estimate** (`compute-cost.py`,
Requesty vertex tariff $5.50/$27.50/$0.55/$6.25 per 1M). This makes the
cost comparison **uniformly measured** for the first time — no more method mix
between inline CC/OC and estimated pi. The price: the earlier premise "CC/OC
carry the actually billed amount" no longer holds; all numbers are a
list-price baseline, not billed. Tokens incl. `cache_read` are captured
correctly for all three (cache genuinely applies: claim-office `cache_read`
CC ~53M, OC ~47M, pi lower on average because pi draws fewer tokens overall).

## Overview

Primary outcome **Correctness (external)** `verification_pct` (higher = better) +
core cost metric `cost_usd` (lower = better), per harness × kata.

### claim-office (CLI kata, Correctness external counts)

| Metric (direction) | CC | OC | pi |
|---|---:|---:|---:|
| `verification_pct` (higher) | 0.93 | 0.88 | **0.99** 🏆 |
| `tests_passing` rate (higher) | **100 %** 🏆 | **100 %** 🏆 | **100 %** 🏆 |
| `cost_usd` $ (lower) | 32.89 | 22.30 | **14.43** 🏆 |
| `total_tokens` (lower) | 49.9 M | 34.1 M | **13.8 M** 🏆 |
| `duration_seconds` (lower) | 3149 | 2393 | **1884** 🏆 |
| `code_mass` (lower) | 862.8 | 920.6 | **782.0** 🏆 |
| `cognitive_max` (lower) | **3.0** 🏆 | 4.6 | 3.6 |
| `mccabe_max` (lower) | **3.8** 🏆 | 4.4 | **3.8** 🏆 |
| `cc_longest_function` (lower) | **15.0** 🏆 | 18.4 | 22.0 |
| `smell_total` (lower) | **0.0** 🏆 | 0.2 | 0.4 |
| `refactorings_applied` (higher) | **28.0** 🏆 | 23.2 | 19.4 |

### game-of-life (code-quality kata, all cells `verification_pct` = 1.0)

| Metric (direction) | CC | OC | pi |
|---|---:|---:|---:|
| `verification_pct` (higher) | **1.0** 🏆 | **1.0** 🏆 | **1.0** 🏆 |
| `cost_usd` $ (lower) | 3.45 | 1.99 | **1.78** 🏆 |
| `total_tokens` (lower) | 4.09 M | 1.96 M | **1.07 M** 🏆 |
| `cognitive_max` (lower) | **5.0** 🏆 | 12.6 | 11.0 |
| `mccabe_max` (lower) | **4.6** 🏆 | 8.8 | 8.0 |
| `cc_longest_function` (lower) | **11.6** 🏆 | 21.8 | 17.8 |
| `smell_total` (lower) | **2.2** 🏆 | 3.2 | 3.4 |
| `code_mass` (lower) | 158.6 | 154.2 | **150.8** 🏆 |
| `refactorings_applied` (higher) | **8.8** 🏆 | 3.2 | 2.8 |
| `duration_seconds` (lower) | 719 | 350 | **326** 🏆 |

Trophy gating: `verification_pct` is pure correctness → ungated. Quality and cost
trophies on claim-office are strictly gated at `verification_pct` = 1.0, and **no cell
reaches it** (CC 0.93, OC 0.88, pi 0.99). The trophies there are therefore awarded
pragmatically to the closest cell: pi at 0.99 ± 0.03 misses a single scenario in one of
five runs, so its cost and speed lead is not an artifact of an unfinished implementation.
Read the claim-office trophies as "best among three cells that are all near-complete",
not as a clean win. On game-of-life all three cells are fully green and trophies are
awarded normally.

`mccabe_max` on claim-office is a genuine tie (CC 3.8 ± 0.45, pi 3.8 ± 1.3) → both 🏆.
`cognitive_max` CC 3.0 vs pi 3.6 sits inside 1 σ (CC σ=1.0, pi σ=1.34); the trophy goes
to CC on points, the difference is not resolved at n=5.

---

## F-1.1 — Correctness is harness-invariant

`tests_passing` (Correctness internal) = 100 % in all six cells.
`verification_pct` (Correctness external) on game-of-life uniformly 1.0
(σ=0). On claim-office all three sit closely together; pi is tightest.

| Kata | Outcome | CC | OC | pi |
|---|---|---:|---:|---:|
| claim-office | `tests_passing` | 100 % | 100 % | 100 % |
| claim-office | `verification_pct` (mean) | 0.93 | 0.88 | 0.99 |
| claim-office | `verification_pct` (σ) | 0.12 | 0.17 | 0.03 |
| claim-office | `verification_passed` / 15 | 14.0 | 13.2 | 14.8 |
| game-of-life | `tests_passing` | 100 % | 100 % | 100 % |
| game-of-life | `verification_pct` (mean) | 1.0 | 1.0 | 1.0 |

Switching harness does not systematically shift correctness at constant model and
workflow. The claim-office range (0.88–1.0) lies within the replicate spread
(σ up to 0.17 for OC) — no robust harness effect on externally measured correctness.
pi is the most consistent arm (0.99, σ=0.03, worst run 14/15), OC the widest
(0.88, σ=0.17, worst run 10/15). Since even the weakest cell averages 13.2 of 15
scenarios, the spread is a matter of isolated missed scenarios, not of failing
implementations.

---

## F-1.2 — pi is the cheapest and fastest harness, by a factor of 2.3 on the expensive kata

Under uniform token×price measurement, `cost_usd` ranks on both katas
**pi < OC < CC**. The ordering is identical on cost, tokens and wallclock — the three
axes do not trade off against each other here.

| Kata | Metric | CC | OC | pi |
|---|---|---:|---:|---:|
| claim-office | `cost_usd` $ | 32.89 | 22.30 | **14.43** |
| claim-office | `total_tokens` | 49.9 M | 34.1 M | **13.8 M** |
| claim-office | `duration_seconds` | 3149 | 2393 | **1884** |
| game-of-life | `cost_usd` $ | 3.45 | 1.99 | **1.78** |
| game-of-life | `total_tokens` | 4.09 M | 1.96 M | **1.07 M** |
| game-of-life | `duration_seconds` | 719 | 350 | **326** |

The spread is widest on the expensive kata: on claim-office CC costs 2.3× pi
($32.89 vs $14.43) and draws 3.6× the tokens (49.9 M vs 13.8 M). On game-of-life the
cost gap narrows to 1.9× while the token gap stays at 3.8× — CC's overhead is
proportionally larger on the small kata, but the absolute amounts are small enough
that the tariff dominates less.

Since all three arms run the same model on the same Requesty route and tariff, this is
a **pure harness effect**, not a pricing artifact: the harnesses differ in how many
tokens they push through the same route. CC's footprint is driven by prompt-cache reads
(claim-office `cache_read` CC ~53 M against pi's markedly lower volume), which enter at
the discounted rate but still accumulate.

The earlier H2 expectation — that pi's cost advantage would flip once prompt caching
applied for real on every harness — did **not** hold. Caching now works on all three
arms, and pi is still ahead on both katas.

Caveat: all values are a list-price baseline computed as token×price, not billed
amounts. Requesty returns no inline `cost_usd` on this route for any of the three arms,
so the comparison is at least uniformly measured — no method mix between inline and
estimated figures.

---

## F-1.3 — Claude Code delivers the leanest Complexity Peak on game-of-life, and it buys that with refactor volume

On game-of-life (all cells fully correct) CC produces markedly lower
complexity peaks and applies markedly more refactorings than OC and pi.

| Metric (lower = better, except refactorings) | CC | OC | pi |
|---|---:|---:|---:|
| `cognitive_max` | 5.0 | 12.6 | 11.0 |
| `mccabe_max` | 4.6 | 8.8 | 8.0 |
| `cc_longest_function` (Complexity Peak) | 11.6 | 21.8 | 17.8 |
| `smell_total` (Smell Total) | 2.2 | 3.2 | 3.4 |
| `code_mass` (Code Mass APP) | 158.6 | 154.2 | 150.8 |
| `refactorings_applied` (higher = better) | 8.8 | 3.2 | 2.8 |

CC's `cognitive_max` (5.0) sits at roughly 40–45 % of the OC/pi values; the gap exceeds
the replicate spread (CC σ=1.87, OC σ=5.37, pi σ=4.0). In parallel CC applies 8.8
refactorings on average — about 2.8× the other two harnesses, at a spread narrow enough
(σ=0.45) to be systematic rather than incidental. The plausible mechanism: the refactor
subagent in the CC workflow engages structurally more often, which pushes down the
Complexity Peak.

`code_mass` is by contrast harness-close (158.6 / 154.2 / 150.8, all within one σ) — the
difference lies in the **distribution** of complexity across the code, not in how much
code gets written. All three arms produce a comparable amount of functionality; CC
spreads it across flatter structures.

On claim-office the advantage shrinks and partly reverses (`cognitive_max` CC 3.0 <
pi 3.6 < OC 4.6, but `cc_longest_function` CC 15.0 < OC 18.4 < pi 22.0, and `code_mass`
pi 782.0 < CC 862.8 < OC 920.6). The clear CC lead is therefore game-of-life-specific.
A plausible reading: on the larger kata every arm refactors heavily (19–28 refactorings
against 2.8–8.8), so CC's refactor surplus no longer distinguishes it.

---

## F-1.4 — TDD discipline is structurally equal across all harnesses, except refactor intensity

`cycle_count` and `predictions_correct_rate` run in parallel across all three harnesses;
only `refactorings_applied` separates CC (more) from OC/pi.

| Kata | Metric | CC | OC | pi |
|---|---|---:|---:|---:|
| claim-office | `cycle_count` | 39.8 | 36.4 | 40.2 |
| claim-office | `predictions_correct_rate` | 99.5 % | 99.2 % | 99.4 % |
| claim-office | `refactorings_applied` | 28.0 | 23.2 | 19.4 |
| game-of-life | `cycle_count` | 8.8 | 8.4 | 9.8 |
| game-of-life | `predictions_correct_rate` | 100 % | 90.5 % | 97.6 % |
| game-of-life | `refactorings_applied` | 8.8 | 3.2 | 2.8 |

The basic TDD mechanics (cycles, prediction hit rate) are harness-invariant — cycle
count within the spread per kata (claim-office 36.4–40.2, game-of-life 8.4–9.8),
prediction hit rate 90–100 % everywhere. This confirms H4 for the core discipline across
all three harnesses. The only robust difference is refactor intensity: on game-of-life
CC refactors ~2.8× more often than OC/pi, which directly feeds the lower Complexity Peak
from F-1.3. On claim-office the same ordering holds but compressed (28.0 / 23.2 / 19.4,
a 1.4× rather than a 2.8× spread).

The game-of-life `predictions_correct_rate` for OC (90.5 %, pooled from only 84
predictions) is lower, but less robust because of the small base population than the
claim-office values (>340 predictions each, all ~99 %).
