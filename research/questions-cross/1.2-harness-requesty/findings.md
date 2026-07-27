# RQ-harness-requesty — Findings

> **⚠️ The cursor arm below is invalidated (2026-07-28); re-run pending.**
>
> All 10 cursor runs were deleted. They ran on
> `v6.2.1-phase-continuation-cursor`, built on the false premise that
> cursor-agent has no subagent mechanism, so refactor executed inline instead
> of in an isolated subagent. Cursor has had subagents since v2.4 — verified
> against the pinned `cursor-agent 2026.07.23-e383d2b`; no deleted run
> contained a single `taskToolCall`.
>
> Every `cursor` column, and every claim comparing cursor to CC/OC/pi, is
> unsupported until the arm is re-run. Two consequences are structural, not
> cosmetic:
>
> - **`refactorings_applied` (cursor 2.6, F-1.4).** It counted inline
>   `## Refactor` headings, not delegated refactor phases, and conflated
>   per-cycle with final-pass refactorings. The "cursor refactors least"
>   reading is most likely a measurement artifact.
> - **The claim-office trophy gating.** Quality/cost trophies there were
>   awarded on the basis that cursor is the only cell reaching
>   `verification_pct` = 1.0. With the cursor arm withdrawn, that gate — and
>   therefore the claim-office $/token/duration trophies — must be
>   recomputed.
>
> The CC, OC and pi arms are **untouched and still valid**; their runs remain
> in the pool. This file is deliberately left in place rather than blanked so
> that data is not lost. It will be rewritten wholesale from reaggregated data
> via `/reanalyze` once cursor is re-run — not patched by hand, so the trophy
> convention and spot-check gates apply.

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

| Metric (direction) | CC | OC | pi | cursor |
|---|---:|---:|---:|---:|
| `verification_pct` (higher) | 0.93 | 0.88 | 0.99 | **1.0** 🏆 |
| `tests_passing` rate (higher) | **100 %** 🏆 | **100 %** 🏆 | **100 %** 🏆 | **100 %** 🏆 |
| `cost_usd` $ (lower) | 32.89 | 22.30 | 14.43 | **9.22** 🏆 |
| `total_tokens` (lower) | 49.9 M | 34.1 M | 13.8 M | **13.8 M** 🏆 |
| `duration_seconds` (lower) | 3149 | 2393 | 1884 | **1001** 🏆 |

### game-of-life (code-quality kata, all cells `verification_pct` = 1.0)

| Metric (direction) | CC | OC | pi | cursor |
|---|---:|---:|---:|---:|
| `verification_pct` (higher) | **1.0** 🏆 | **1.0** 🏆 | **1.0** 🏆 | **1.0** 🏆 |
| `cost_usd` $ (lower) | 3.45 | 1.99 | 1.78 | **1.48** 🏆 |
| `total_tokens` (lower) | 4.09 M | 1.96 M | **1.07 M** 🏆 | 1.74 M |
| `cognitive_max` (lower) | **5.0** 🏆 | 12.6 | 11.0 | 16.6 |
| `mccabe_max` (lower) | **4.6** 🏆 | 8.8 | 8.0 | 10.6 |
| `smell_total` (lower) | **2.2** 🏆 | 3.2 | 3.4 | 4.0 |
| `refactorings_applied` (higher) | **8.8** 🏆 | 3.2 | 2.8 | 2.6 |

Trophy gating: `verification_pct` is pure correctness → ungated. Quality/
cost trophies on claim-office go only to cells with `verification_pct` = 1.0 —
**the only cell achieving that is cursor (1.0)**, so cursor legitimately carries the
claim-office $/token/duration trophies (fully green *and* cheapest/
fastest). On game-of-life all four are fully green, all trophies awarded
normally.

**Cursor caveats (binding, see README § Cursor as 4th harness):** (1) cursor-opus =
`claude-opus-4-8-medium` (**medium effort** ≠ plain opus-4-8 of the other arms) — the
weaker code-quality value (highest `cognitive_max`/`smell_total`, fewest
`refactorings_applied`) may be an effort rather than a harness effect. (2) cursor runs on
`v6.2.1-phase-continuation-cursor` (v6.2.1 ≈ v6.2, outcome-neutral fix). (3)
`cost_usd` is a token×price estimate as with all arms (cursor returns no
inline cost), at native list prices.

---

## F-1.1 — Correctness is harness-invariant

`tests_passing` (Correctness internal) = 100 % in all eight cells.
`verification_pct` (Correctness external) on game-of-life uniformly 1.0
(σ=0). On claim-office all four sit closely together; cursor and pi are tightest.

| Kata | Outcome | CC | OC | pi | cursor |
|---|---|---:|---:|---:|---:|
| claim-office | `tests_passing` | 100 % | 100 % | 100 % | 100 % |
| claim-office | `verification_pct` (mean) | 0.93 | 0.88 | 0.99 | 1.0 |
| claim-office | `verification_pct` (σ) | 0.12 | 0.17 | 0.03 | 0.0 |
| game-of-life | `tests_passing` | 100 % | 100 % | 100 % | 100 % |
| game-of-life | `verification_pct` (mean) | 1.0 | 1.0 | 1.0 | 1.0 |

Switching harness does not systematically shift correctness at constant model and
workflow. The claim-office range (0.88–1.0) lies
within the replicate spread (σ up to 0.17 for OC) — no robust
harness effect on externally measured correctness. cursor (1.0, σ=0, all 5 runs
15/15) and pi (0.99, σ=0.03) are the most consistent — bearing in mind for cursor that
it runs on medium effort and v6.2.1 (caveats see overview).

---

## F-1.2 — cursor is the cheapest and fastest harness; pi leads among CC/OC/pi

Under uniform token×price measurement, `cost_usd` ranks on both katas
**cursor < pi < OC < CC**. Cursor clearly undercuts pi (the previous cheapest)
and is additionally by far the fastest harness.

| Kata | Metric | CC | OC | pi | cursor |
|---|---|---:|---:|---:|---:|
| claim-office | `cost_usd` $ | 32.89 | 22.30 | 14.43 | **9.22** |
| claim-office | `total_tokens` | 49.9 M | 34.1 M | 13.8 M | 13.8 M |
| claim-office | `duration_seconds` | 3149 | 2393 | 1884 | **1001** |
| game-of-life | `cost_usd` $ | 3.45 | 1.99 | 1.78 | **1.48** |
| game-of-life | `total_tokens` | 4.09 M | 1.96 M | **1.07 M** | 1.74 M |
| game-of-life | `duration_seconds` | 719 | 350 | 326 | **198** |

On claim-office cursor draws roughly as many tokens as pi (13.8 M) but is
cheaper in $, because it is billed natively at the Anthropic list price instead of at the
~10 % higher Requesty vertex tariff of the other arms. On game-of-life cursor draws
even more tokens than pi (1.74 M vs 1.07 M) yet stays narrowly ahead in $ — the same
tariff effect. On pure token effort (the cache-adjusted proxy) pi still leads
on game-of-life; on the billing-proximate `cost_usd` cursor leads on both katas.

The earlier H2 expectation (pi's cost advantage flips once caching genuinely
applies everywhere) did **not** hold for CC/OC/pi — pi stayed ahead there. Only the native
routing channel of cursor (list price instead of Requesty surcharge) undercuts pi. This
is therefore partly a **tariff effect** (native vs Requesty), not purely a
token-efficiency effect: cursor wins despite equal/higher token counts.

Duration picture, separately: cursor is the fastest harness independently of tariff
(claim-office 1001 s vs pi 1884 s, game-of-life 198 s vs pi 326 s) — here pure
wallclock counts, no price. Part of that is plausibly attributable to the medium-effort model
(less reasoning/refactor depth → faster; see F-1.3 + caveat).

Caveat: all four values are a list-price baseline (no inline cost), not
billed amounts. CC/OC/pi carry the Requesty vertex tariff, cursor the native
Anthropic list price — the tariff difference is part of cursor's lead and must be
carried along in the comparison.

---

## F-1.3 — Claude Code delivers the leanest Complexity Peak on game-of-life; cursor the highest

On game-of-life (all cells fully correct) CC produces markedly lower
complexity peaks and more refactorings than OC, pi and cursor. cursor sits at the
other end — highest complexity and fewest refactorings.

| Metric (lower = better, except refactorings) | CC | OC | pi | cursor |
|---|---:|---:|---:|---:|
| `cognitive_max` | 5.0 | 12.6 | 11.0 | 16.6 |
| `mccabe_max` | 4.6 | 8.8 | 8.0 | 10.6 |
| `cc_longest_function` (Complexity Peak) | 11.6 | 21.8 | 17.8 | 23.2 |
| `smell_total` (Smell Total) | 2.2 | 3.2 | 3.4 | 4.0 |
| `refactorings_applied` (higher = better) | 8.8 | 3.2 | 2.8 | 3.0 |

CC's `cognitive_max` (5.0) sits at roughly 30–45 % of the OC/pi/cursor values;
the gap exceeds the replicate spread (CC σ=1.87). In parallel
CC applies 8.8 refactorings on average — almost three times the other harnesses.
The plausible mechanism: the refactor subagent in the CC workflow engages
structurally more often, which pushes down the Complexity Peak. `code_mass` (Code Mass
APP) is by contrast harness-close (CC 158.6, OC 154.2, pi 150.8, cursor 141.8) — the
difference lies in the **distribution** of complexity, not in code volume; cursor
even writes the lowest Code Mass, but packs the logic most densely.

**cursor as complexity laggard — the effort caveat bites hardest here:**
cursor runs on `claude-opus-4-8-medium` (medium effort). Less reasoning and
refactor depth fits the picture exactly (fewest refactorings, highest peaks). Whether that
is a harness or an effort effect cannot be separated with this arm —
a default-effort cursor arm does not exist. The cursor quality disadvantage is
therefore **not to be read as a harness statement**, but as a confounded effort+harness value.

On claim-office the picture is weaker and partly reversed (`cognitive_max`
CC 3.0 < pi 3.6 < OC 4.6 < cursor 7.2; `cc_longest_function` CC 15.0 < OC 18.4 <
cursor 19.0 < pi 22.0) — the clear CC advantage is game-of-life-specific, but cursor
remains at the upper complexity end here too.

---

## F-1.4 — TDD discipline is structurally equal across all harnesses, except refactor intensity

`cycle_count` and `predictions_correct_rate` run in parallel across all four harnesses;
only `refactorings_applied` separates CC (more) from OC/pi/cursor.

| Kata | Metric | CC | OC | pi | cursor |
|---|---|---:|---:|---:|---:|
| claim-office | `cycle_count` | 39.8 | 36.4 | 40.2 | 46.0 |
| claim-office | `predictions_correct_rate` | 99.5 % | 99.2 % | 99.4 % | 98.9 % |
| claim-office | `refactorings_applied` | 28.0 | 23.2 | 19.4 | 18.0 |
| game-of-life | `cycle_count` | 8.8 | 8.4 | 9.8 | 8.4 |
| game-of-life | `predictions_correct_rate` | 100 % | 90.5 % | 97.6 % | 100 % |
| game-of-life | `refactorings_applied` | 8.8 | 3.2 | 2.8 | 3.0 |

The basic TDD mechanics (cycles, prediction hit rate) are harness-invariant —
cycle count within the spread per kata (cursor slightly higher on claim-office at 46.0,
but with a broad σ=16), prediction hit rate 90–100 % everywhere. This confirms
H4 for the core discipline across all four harnesses. The only robust difference
is refactor intensity: on game-of-life CC refactors ~2.8× more often than
OC/pi/cursor, which directly feeds the lower Complexity Peak from F-1.3. cursor
lines up with OC/pi on refactor intensity (game-of-life 3.0) — consistent with
the medium-effort picture. The game-of-life `predictions_correct_rate` for OC (90.5 %,
pooled from only 84 predictions) is lower, but less robust because of the small
base population than the claim-office values (>340 predictions, all ~99 %).

Marker provenance note: cursor runs carry `marker_source=null` (that is how the cursor parser
documents its parse path); the TDD metrics are nevertheless fully populated
(cycle_count 32–69, predictions 44–96) and plausible — no parser failure.
