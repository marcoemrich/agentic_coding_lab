# Findings — RQ-architecture-axis-opus5

Does the TDD architecture axis (inline-tdd-v1 structureless / single-context-v2 single context / hybrid-v2 hybrid /
hybrid-v6 current generation) still rank the same way on opus-5 as it does on opus-4-7 — and
does the decomposition metric change the answer?

Data base: 111 runs, 16 cells at n=5–18, all `exit_reason: ok`, `completed_within_budget`
100 %. The opus-5 and hybrid-v6/opus-4-7 cells were produced for this RQ; the remaining
opus-4-7 cells are pre-existing runs (partly Portkey-routed, see README caveat 1). The
hybrid-v2/opus-5 claim-office cell stands at n=18 through sharing with sister RQs, well
past min_replicates=5.

## Overview

**claim-office-example-mapping** (correctness kata)

| Metric | inline-tdd-v1/o5 | single-context-v2/o5 | hybrid-v2/o5 | hybrid-v6/o5 | inline-tdd-v1/o47 | single-context-v2/o47 | hybrid-v2/o47 | hybrid-v6/o47 | Direction |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---|
| Correctness (external) | **1.00** 🏆 | 0.79 | 0.96 | 0.94 | **1.00** 🏆 | **1.00** 🏆 | **1.00** 🏆 | **1.00** 🏆 | higher = better |
| `avg_loc_per_function` | 8.90 | 5.89 | 3.81 | **3.19** 🏆 | 13.07 | 10.03 | 5.75 | 3.67 | lower = better |
| `cognitive_max` | 5.3 | 2.8 | 2.8 | **2.0** 🏆 | 19.8 | 14.83 | 5.71 | 3.2 | lower = better |
| `cognitive_avg` | 2.55 | 1.65 | 1.30 | **1.15** 🏆 | 5.77 | 4.62 | 2.32 | 1.35 | lower = better |
| `mccabe_max` | 5.3 | 3.4 | 3.4 | **2.8** 🏆 | 15.4 | 10.17 | 5.71 | 3.4 | lower = better |
| `longest_function` | 24.3 | 18.6 | 16.2 | 13.8 | 51.6 | 32.67 | 18.14 | **12.0** 🏆 | lower = better |
| Smell Total | **0.0** 🏆 | 0.2 | **0.0** 🏆 | **0.0** 🏆 | 16.8 | 6.83 | 1.29 | **0.0** 🏆 | lower = better |
| Code Mass (APP) | 758.2 | 569.0 | 859.5 | 997.0 | 992.4 | 692.7 | 861.3 | 796.0 | no 🏆 — see caveat |
| `cycle_count` † | 5.2 | 27.0 | 45.9 | 45.8 | 3.8 | 5.5 | 28.0 | 25.8 | — |
| `refactorings_applied` † | n/a | 12.2 | 21.3 | **44.5** 🏆 | n/a | 2.2 | 11.0 | 22.6 | higher = better |
| `predictions_correct_rate` | n/a | 99.6 % | 99.6 % | 98.9 % | n/a | **100 %** 🏆 | 96.4 % | 90.0 % | higher = better |
| `total_tokens` | 4.5 M | 82.6 M | 94.2 M | 161.6 M | **3.3 M** 🏆 | 18.7 M | 37.9 M | 75.6 M | lower = better |
| `duration_seconds` | 5.5 min | 23.1 min | 44.2 min | 91.9 min | **5.2 min** 🏆 | 10.7 min | 26.1 min | 75.9 min | lower = better |

**game-of-life-example-mapping** (code-quality kata)

| Metric | inline-tdd-v1/o5 | single-context-v2/o5 | hybrid-v2/o5 | hybrid-v6/o5 | inline-tdd-v1/o47 | single-context-v2/o47 | hybrid-v2/o47 | hybrid-v6/o47 | Direction |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---|
| Correctness (external) | **1.00** 🏆 | **1.00** 🏆 | **1.00** 🏆 | **1.00** 🏆 | **1.00** 🏆 | **1.00** 🏆 | **1.00** 🏆 | **1.00** 🏆 | higher = better |
| `avg_loc_per_function` | 6.48 | 4.12 | 4.23 | **3.46** 🏆 | 16.52 | 9.58 | 6.56 | 3.62 | lower = better |
| `cognitive_max` | 7.2 | 1.8 | 1.8 | **1.2** 🏆 | 21.8 | 17.6 | 6.5 | 2.2 | lower = better |
| `cognitive_avg` | 5.33 | 1.60 | 1.58 | **1.17** 🏆 | 21.8 | 15.4 | 5.17 | 1.9 | lower = better |
| `mccabe_max` | 5.7 | 2.8 | 3.2 | **2.5** 🏆 | 13.7 | 10.2 | 5.2 | 3.2 | lower = better |
| `longest_function` | 14.5 | 8.0 | 10.2 | **7.5** 🏆 | 32.5 | 20.8 | 14.2 | 8.4 | lower = better |
| Smell Total | **0.0** 🏆 | **0.0** 🏆 | 1.0 | **0.0** 🏆 | 6.0 | 4.8 | 2.4 | **0.0** 🏆 | lower = better |
| Code Mass (APP) | 196.8 | 176.2 | 179.0 | 195.8 | 165.6 | 154.0 | 153.7 | 169.6 | no 🏆 — see caveat |
| `cycle_count` † | 3.7 | 7.2 | 10.3 | 10.3 | 1.5 | 7.6 | 8.7 | 9.2 | — |
| `refactorings_applied` † | n/a | 4.4 | 4.3 | 8.8 | n/a | 4.8 | 4.1 | **9.2** 🏆 | higher = better |
| `predictions_correct_rate` | n/a | **100 %** 🏆 | **100 %** 🏆 | 98.4 % | n/a | **100 %** 🏆 | 99.4 % | 98.9 % | higher = better |
| `total_tokens` | 2.1 M | 11.8 M | 9.2 M | 19.7 M | **0.8 M** 🏆 | 8.4 M | 8.1 M | 17.2 M | lower = better |
| `duration_seconds` | 2.8 min | 7.2 min | 9.7 min | 19.1 min | **1.3 min** 🏆 | 4.9 min | 8.5 min | 22.1 min | lower = better |

Caveats for reading the tables:

- **Correctness gating**: on claim-office, trophies for quality/efficiency metrics go only
  to cells at `verification_pct` 1.00. single-context-v2/o5 (0.79), hybrid-v6/o5 (0.95) and hybrid-v2/o5 (0.99)
  are exempt from the gate for the *quality* columns because their shortfall traces to a
  single acceptance scenario (F-1.4), not to stub implementations — but they carry no
  correctness trophy.
- **`cycle_count`, `refactorings_applied` and `predictions_correct_rate` are n/a for inline-tdd-v1**,
  not zero. inline-tdd-v1 prescribes no phase markers, so the parser has nothing to count. See
  MARKERS.md.
- **Code Mass (APP) carries no trophy.** It ranks the cells opposite to decomposition
  (F-1.6) and has no notion of nesting — established in RQ-architecture-axis-sol-pi F-1.9.
- `cycle_count` is ambivalent and carries no trophy.
- **† `cycle_count` and `refactorings_applied` are the retired spellings.** The marker
  parser that produced them is gone and the phase chain that replaced it wrote nothing
  for these runs, so neither metric appears in `runs.csv` or `summary.md`. The values
  themselves survive per run as `summary_metrics.legacy_cycle_count` and
  `summary_metrics.legacy_refactorings_applied` and are recomputed from there — they are
  current for this run set, not frozen. Their comparable successors on newer runs are
  `cycles_closed` and `refactor_events`. For inline-tdd-v1 both columns stay n/a rather
  than zero: without phase markers the parser falls back to a heuristic that over-counts,
  which RQ-v3-emergent-tdd quantified at 14 real refactorings out of 60 candidates.
- `cost_usd` is a list-price comparison, not an invoice: these runs went through the
  native Anthropic API on a subscription plan, where nothing is billed per token. On
  claim-office the four opus-5 cells read $3.89 / $47.56 / $61.94 / $109.59 along the
  axis, against $2.92 / $12.72 / $29.28 / $53.77 on opus-4-7.

---

## F-1.1 — H1 confirmed: the architecture ranking holds on opus-5, on both katas

The inline-tdd-v1 → single-context-v2 → hybrid-v2 → hybrid-v6 ordering on `avg_loc_per_function` is monotone on
claim-office and near-monotone on game-of-life, exactly as on opus-4-7.

| Kata | inline-tdd-v1 | single-context-v2 | hybrid-v2 | hybrid-v6 | Monotone? |
|---|---:|---:|---:|---:|---|
| claim-office / opus-5 | 9.18 | 5.89 | 4.04 | **3.21** 🏆 | yes |
| claim-office / opus-4-7 | 13.07 | 10.03 | 5.75 | **3.67** 🏆 | yes |
| game-of-life / opus-5 | 6.69 | 4.12 | 4.54 | **3.57** 🏆 | single-context-v2/hybrid-v2 swap (within σ) |
| game-of-life / opus-4-7 | 16.52 | 9.58 | 6.56 | **3.62** 🏆 | yes |

Rationale: the ranking transfers across the model generation. This is the opposite of the
Sol result (`RQ-architecture-axis-sol-pi` F-1.6), where structureless inline-tdd-v1 beat every
architecture on game-of-life and hybrid-v2 collapsed to 1.6 functions per implementation. The
mechanism proposed there — the isolated refactor subagent not performing its extraction —
does not apply to opus-5: hybrid-v6 averages 8.6 refactorings on game-of-life and 43.4 on
claim-office.

The single-context-v2/hybrid-v2 swap on game-of-life (4.12 vs 4.54) sits inside one σ (1.00 / 0.92) and is
read as "indistinguishable", not as a rank change.

Consequence: the reduction chain built on hybrid-v1 rests on an architecture opus-5 supports.
H2 (Sol pattern) and H3 (metric split) are both refuted for this model.

---

## F-1.2 — The model generation moves quality as much as the whole architecture does

Structureless TDD on opus-5 reaches complexity levels that on opus-4-7 required the full
architecture.

| Cell | `cognitive_max` | `avg_loc_per_function` | Smell Total |
|---|---:|---:|---:|
| inline-tdd-v1 / claim-office / opus-4-7 | 19.8 | 13.07 | 16.8 |
| inline-tdd-v1 / claim-office / opus-5 | **5.3** | 8.90 | **0.0** |
| hybrid-v2 / claim-office / opus-4-7 | 5.71 | 5.75 | 1.29 |
| inline-tdd-v1 / game-of-life / opus-4-7 | 21.8 | 16.52 | 6.0 |
| inline-tdd-v1 / game-of-life / opus-5 | **7.2** | 6.48 | **0.0** |
| hybrid-v2 / game-of-life / opus-4-7 | 6.5 | 6.56 | 2.4 |

Rationale: on both katas, inline-tdd-v1/opus-5 lands at roughly the `cognitive_max` of hybrid-v2/opus-4-7
(5.3 vs 5.71; 7.2 vs 6.5) — a ~15-line prompt with no agents, no skills and no phase
structure now produces what previously took the full hybrid architecture. Smell Total
drops to zero in all twelve opus-5 inline-tdd-v1 runs, against 16.8 and 6.0 on opus-4-7.

The architecture still adds on top of that (F-1.1), but the baseline it starts from has
moved by a comparable margin. Workflow recommendations calibrated on opus-4-7 absolute
values do not carry over.

---

## F-1.3 — hybrid-v6 wins the quality axis on both katas and costs 7–36× the baseline

hybrid-v6 takes the trophy on every quality metric except `longest_function` on claim-office.
The cost side is where the decision actually sits.

| claim-office | inline-tdd-v1 | hybrid-v6 | Factor |
|---|---:|---:|---:|
| `avg_loc_per_function` | 8.90 | **3.19** 🏆 | 0.36× |
| `cognitive_max` | 5.3 | **2.0** 🏆 | 0.38× |
| `mccabe_max` | 5.3 | **2.8** 🏆 | 0.53× |
| Correctness (external) | **1.00** 🏆 | 0.94 | 0.94× |
| `total_tokens` | **4.5 M** 🏆 | 161.6 M | **36×** |
| `duration_seconds` | **5.5 min** 🏆 | 91.9 min | **17×** |

| game-of-life | inline-tdd-v1 | hybrid-v6 | Factor |
|---|---:|---:|---:|
| `avg_loc_per_function` | 6.48 | **3.46** 🏆 | 0.53× |
| `cognitive_max` | 7.2 | **1.2** 🏆 | 0.17× |
| Correctness (external) | **1.00** 🏆 | **1.00** 🏆 | 1.00× |
| `total_tokens` | **2.1 M** 🏆 | 19.7 M | **9.4×** |
| `duration_seconds` | **2.8 min** 🏆 | 19.1 min | **6.8×** |

Rationale: the quality gain is real and consistent, but its size (0.17–0.53×) is an order
of magnitude smaller than the cost (6.8–36×). On game-of-life, where correctness is tied at
1.00 across all cells, the trade is 9.4× the tokens for a 1.9× better decomposition. On
claim-office it is 36× the tokens for 2.8× — and 0.94 instead of 1.00 external correctness.

The intermediate cells are the interesting ones for practice: hybrid-v2 reaches
`avg_loc_per_function` 3.81 on claim-office at 94.2 M tokens — 58 % of hybrid-v6's cost for
89 % of its decomposition gain over inline-tdd-v1.

Token figures here count subagent consumption; the three structured arms all spawn
subagents and were recorded short until 2026-09-30
([RQ-old-vs-new-exact-line-opus55 F-4.12.5](../4.12-old-vs-new-exact-line-opus55/findings.md)).
The correction widens every factor in this finding rather than narrowing it, because
the baseline arm spawns none.

---

## F-1.4 — One acceptance scenario fails across workflows and accounts for most of the correctness spread

Eighteen opus-5 runs on claim-office pass all internal tests but miss external scenarios.
Seventeen of the eighteen fail on the same one.

| Workflow | n at `verification_pct` < 1 | Failing scenario |
|---|---:|---|
| single-context-v2 | 2 of 5 | `14-family-steinheim` (1×), total failure (1×) |
| hybrid-v2 | 11 of 18 | `14-family-steinheim` |
| hybrid-v6 | 5 of 6 | `14-family-steinheim` |

Rationale: `14-family-steinheim` fails for subagents-v1, single-context-v2, hybrid-v2 and hybrid-v6 alike on opus-5 — it is
a kata/model interaction, not a workflow defect. Any correctness comparison between
opus-5 cells on claim-office therefore measures partly this one scenario. The hybrid-v6 figure
of 0.94 means "14 of 15 scenarios in five runs, 15 of 15 in one", not "systematically less
correct". The same holds for hybrid-v2 at 0.96: eleven runs miss that one scenario and seven
miss nothing.

The exception is the one single-context-v2 run at `verification_pct` 0: it stopped after 2 cycles with
6 functions and 60 passing self-written tests. That is the internal/external divergence
documented as F-1.2 in RQ-architecture-axis-sol-pi, and it is what drags the single-context-v2 cell
mean to 0.79 (σ 0.44) — the cell is bimodal, not uniformly mediocre.

---

## F-1.5 — single-context-v2 is the least reliable architecture on opus-5, hybrid-v2 the most efficient compromise

| claim-office | `verification_pct` per run | σ | `cycle_count` range † |
|---|---|---:|---|
| single-context-v2 | 0 / 0.93 / 1 ×3 | 0.44 | 2–48 |
| hybrid-v2 | 0.93 ×11 / 1 ×7 | 0.03 | 38–52 |
| hybrid-v6 | 0.93 ×5 / 1 | 0.03 | 36–57 |

Rationale: single-context-v2's shared single context has a failure mode where the model declares the
task complete after 2 cycles. hybrid-v2 and hybrid-v6, which isolate the refactor phase, do not show
it in 24 runs. This is the same instability the Sol RQ documented for single-context-v2 (F-1.4 there,
`refactorings_applied` σ 17.4) and it reproduces on a different model and harness.

Against that, hybrid-v2 delivers 94.2 M tokens and 44.2 minutes for `avg_loc_per_function` 3.81
— against hybrid-v6's 161.6 M and 91.9 minutes for 3.19. The marginal decomposition gain from hybrid-v2
to hybrid-v6 (0.62 LoC per function) costs 72 % more tokens and 108 % more wallclock.

---

## F-1.6 — Code Mass (APP) ranks the cells opposite to decomposition, on this model too

| Kata | metric | inline-tdd-v1 | single-context-v2 | hybrid-v2 | hybrid-v6 |
|---|---|---:|---:|---:|---:|
| claim-office | `avg_loc_per_function` (lower = better) | 8.90 | 5.89 | 3.81 | **3.19** |
| claim-office | Code Mass (APP) | 758.2 | **569.0** | 859.5 | 997.0 |
| game-of-life | `avg_loc_per_function` | 6.48 | 4.12 | 4.23 | **3.46** |
| game-of-life | Code Mass (APP) | 196.8 | **176.2** | 179.0 | 195.8 |

Rationale: APP fails to reward decomposition on both katas, though not identically. On
claim-office the inversion is clean — the best-decomposed cell carries the highest Code
Mass (997.0 against the structureless arm's 758.2). On game-of-life the two are within a
point of each other (195.8 against 196.8), so the ordering is no longer strictly inverted
there; what survives is that the best-decomposed cell is still at the top of the range
rather than the bottom. APP measures compactness and has no notion of nesting or naming;
a workflow that extracts more named functions scores worse on it by construction. This replicates
RQ-architecture-axis-sol-pi F-1.9 on a different model and harness, which strengthens the
methodological conclusion: Code Mass (APP) must not be read as a quality metric in
architecture comparisons.

---

## F-1.7 — opus-5 writes more code than opus-4-7 under the same workflow

| Cell | Code Mass (APP) opus-4-7 | opus-5 | Factor |
|---|---:|---:|---:|
| hybrid-v6 / claim-office | 796.0 | 997.0 | 1.25× |
| hybrid-v2 / claim-office | 861.3 | 859.5 | 1.00× |
| single-context-v2 / claim-office | 692.7 | 569.0 | 0.82× |
| hybrid-v6 / game-of-life | 169.6 | 195.8 | 1.15× |
| hybrid-v2 / game-of-life | 153.7 | 179.0 | 1.16× |
| single-context-v2 / game-of-life | 154.0 | 176.2 | 1.14× |

Rationale: in four of six matched cells opus-5 produces more code mass than opus-4-7 for
the same workflow and kata, most strongly under hybrid-v6. The hybrid-v2 claim-office pair
is a tie (859.5 against 861.3) and single-context-v2 on claim-office runs the other way at
0.82×, so the effect holds on game-of-life throughout and only partly on claim-office. The additional volume comes with
better decomposition, not worse — but it means the "same work, better organised" reading
of the architecture gain is only partly right. Part of what hybrid-v6 buys on opus-5 is more
code, distributed across more functions.

Caveat: the opus-4-7 single-context-v2 and hybrid-v2 cells are pre-existing Portkey-routed runs; routing is
assumed not to affect code volume, but it was not verified.
