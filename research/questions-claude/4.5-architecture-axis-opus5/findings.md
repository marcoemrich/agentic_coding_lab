# Findings — RQ-architecture-axis-opus5

Does the TDD architecture axis (inline-tdd-v1 structureless / single-context-v2 single context / hybrid-v2 hybrid /
hybrid-v6 current generation) still rank the same way on opus-5 as it does on opus-4-7 — and
does the decomposition metric change the answer?

Data base: 93 runs, 16 cells at n=5–10, all `exit_reason: ok`, `completed_within_budget`
100 %. The 50 opus-5 and hybrid-v6/opus-4-7 runs were produced for this RQ; the remaining
opus-4-7 cells are pre-existing runs (partly Portkey-routed, see README caveat 1).

## Übersicht

**claim-office-example-mapping** (correctness kata)

| Metric | inline-tdd-v1/o5 | single-context-v2/o5 | hybrid-v2/o5 | hybrid-v6/o5 | inline-tdd-v1/o47 | single-context-v2/o47 | hybrid-v2/o47 | hybrid-v6/o47 | Direction |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---|
| Correctness (external) | **1.00** 🏆 | 0.79 | 0.99 | 0.95 | **1.00** 🏆 | **1.00** 🏆 | **1.00** 🏆 | **1.00** 🏆 | höher = besser |
| `cc_avg_loc_per_function` | 9.18 | 5.89 | 4.04 | **3.21** 🏆 | 13.07 | 10.03 | 5.75 | 3.67 | kleiner = besser |
| `cognitive_max` | 5.4 | 2.8 | 2.4 | **2.2** 🏆 | 19.8 | 14.83 | 5.71 | 3.2 | kleiner = besser |
| `cognitive_avg` | 2.53 | 1.65 | 1.34 | **1.18** 🏆 | 5.77 | 4.62 | 2.32 | 1.35 | kleiner = besser |
| `mccabe_max` | 5.4 | 3.4 | 3.2 | **3.0** 🏆 | 15.4 | 10.17 | 5.71 | 3.4 | kleiner = besser |
| Complexity Peak | 24.2 | 18.6 | 17.0 | 14.6 | 51.6 | 32.67 | 18.14 | **12.0** 🏆 | kleiner = besser |
| Smell Total | **0.0** 🏆 | 0.2 | **0.0** 🏆 | **0.0** 🏆 | 16.8 | 6.83 | 1.29 | **0.0** 🏆 | kleiner = besser |
| Code Mass (APP) | 759.2 | 569.0 | 861.6 | 1002.8 | 992.4 | 692.7 | 861.3 | 796.0 | kein 🏆 — s. Caveat |
| `cycle_count` | 4.8 | 27.0 | 42.8 | 45.0 | 3.8 | 5.5 | 28.0 | 25.8 | — |
| `refactorings_applied` | n/a | 12.2 | 17.4 | **43.4** 🏆 | n/a | 2.2 | 11.0 | 22.6 | höher = besser |
| `predictions_correct_rate` | n/a | 99.6 % | **100 %** 🏆 | 98.7 % | n/a | **100 %** 🏆 | 96.4 % | 90.0 % | höher = besser |
| `total_tokens` | 4 M | 83 M | 82 M | 137 M | **3 M** 🏆 | 19 M | 35 M | 60 M | kleiner = besser |
| `duration_seconds` | 5 min | 23 min | 44 min | 93 min | **5 min** 🏆 | 11 min | 26 min | 76 min | kleiner = besser |

**game-of-life-example-mapping** (code-quality kata)

| Metric | inline-tdd-v1/o5 | single-context-v2/o5 | hybrid-v2/o5 | hybrid-v6/o5 | inline-tdd-v1/o47 | single-context-v2/o47 | hybrid-v2/o47 | hybrid-v6/o47 | Direction |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---|
| Correctness (external) | **1.00** 🏆 | **1.00** 🏆 | **1.00** 🏆 | **1.00** 🏆 | **1.00** 🏆 | **1.00** 🏆 | **1.00** 🏆 | **1.00** 🏆 | höher = besser |
| `cc_avg_loc_per_function` | 6.69 | 4.12 | 4.54 | **3.57** 🏆 | 16.52 | 9.58 | 6.56 | 3.62 | kleiner = besser |
| `cognitive_max` | 7.6 | 1.8 | 1.8 | **1.2** 🏆 | 21.8 | 17.6 | 6.5 | 2.2 | kleiner = besser |
| `cognitive_avg` | 5.73 | 1.6 | 1.5 | **1.2** 🏆 | 21.8 | 15.4 | 5.17 | 1.9 | kleiner = besser |
| `mccabe_max` | 6.0 | 2.8 | 3.2 | **2.4** 🏆 | 13.7 | 10.2 | 5.2 | 3.2 | kleiner = besser |
| Complexity Peak | 14.6 | 8.0 | 10.8 | **7.4** 🏆 | 32.5 | 20.8 | 14.2 | 8.4 | kleiner = besser |
| Smell Total | **0.0** 🏆 | **0.0** 🏆 | 1.2 | **0.0** 🏆 | 6.0 | 4.8 | 2.4 | **0.0** 🏆 | kleiner = besser |
| Code Mass (APP) | 193.0 | 176.2 | 181.8 | 194.4 | 165.6 | 154.0 | 153.7 | 169.6 | kein 🏆 — s. Caveat |
| `cycle_count` | 3.8 | 7.2 | 10.4 | 10.4 | 1.5 | 7.6 | 8.7 | 9.2 | — |
| `refactorings_applied` | n/a | 4.4 | 4.4 | **8.6** 🏆 | n/a | 4.8 | 4.1 | 9.2 | höher = besser |
| `predictions_correct_rate` | n/a | **100 %** 🏆 | **100 %** 🏆 | 99.1 % | n/a | **100 %** 🏆 | 99.4 % | 98.9 % | höher = besser |
| `total_tokens` | 2 M | 12 M | 8 M | 15 M | **1 M** 🏆 | 8 M | 7 M | 12 M | kleiner = besser |
| `duration_seconds` | 3 min | 7 min | 10 min | 19 min | **1 min** 🏆 | 5 min | 8 min | 22 min | kleiner = besser |

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
- `cost_usd` is not reported: these runs went through the native Anthropic API on a
  subscription plan, so no per-run list price applies.

---

## F-1.1 — H1 confirmed: the architecture ranking holds on opus-5, on both katas

The inline-tdd-v1 → single-context-v2 → hybrid-v2 → hybrid-v6 ordering on `cc_avg_loc_per_function` is monotone on
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

| Cell | `cognitive_max` | `cc_avg_loc_per_function` | Smell Total |
|---|---:|---:|---:|
| inline-tdd-v1 / claim-office / opus-4-7 | 19.8 | 13.07 | 16.8 |
| inline-tdd-v1 / claim-office / opus-5 | **5.4** | 9.18 | **0.0** |
| hybrid-v2 / claim-office / opus-4-7 | 5.71 | 5.75 | 1.29 |
| inline-tdd-v1 / game-of-life / opus-4-7 | 21.8 | 16.52 | 6.0 |
| inline-tdd-v1 / game-of-life / opus-5 | **7.6** | 6.69 | **0.0** |
| hybrid-v2 / game-of-life / opus-4-7 | 6.5 | 6.56 | 2.4 |

Rationale: on both katas, inline-tdd-v1/opus-5 lands at roughly the `cognitive_max` of hybrid-v2/opus-4-7
(5.4 vs 5.71; 7.6 vs 6.5) — a ~15-line prompt with no agents, no skills and no phase
structure now produces what previously took the full hybrid architecture. Smell Total
drops to zero in all ten opus-5 inline-tdd-v1 runs, against 16.8 and 6.0 on opus-4-7.

The architecture still adds on top of that (F-1.1), but the baseline it starts from has
moved by a comparable margin. Workflow recommendations calibrated on opus-4-7 absolute
values do not carry over.

---

## F-1.3 — hybrid-v6 wins the quality axis on both katas and costs 4–34× the baseline

hybrid-v6 takes the trophy on every quality metric except Complexity Peak on claim-office.
The cost side is where the decision actually sits.

| claim-office | inline-tdd-v1 | hybrid-v6 | Factor |
|---|---:|---:|---:|
| `cc_avg_loc_per_function` | 9.18 | **3.21** 🏆 | 0.35× |
| `cognitive_max` | 5.4 | **2.2** 🏆 | 0.41× |
| `mccabe_max` | 5.4 | **3.0** 🏆 | 0.56× |
| Correctness (external) | **1.00** 🏆 | 0.95 | 0.95× |
| `total_tokens` | **4 M** 🏆 | 137 M | **34×** |
| `duration_seconds` | **5 min** 🏆 | 93 min | **19×** |

| game-of-life | inline-tdd-v1 | hybrid-v6 | Factor |
|---|---:|---:|---:|
| `cc_avg_loc_per_function` | 6.69 | **3.57** 🏆 | 0.53× |
| `cognitive_max` | 7.6 | **1.2** 🏆 | 0.16× |
| Correctness (external) | **1.00** 🏆 | **1.00** 🏆 | 1.00× |
| `total_tokens` | **2 M** 🏆 | 15 M | **8×** |
| `duration_seconds` | **3 min** 🏆 | 19 min | **6×** |

Rationale: the quality gain is real and consistent, but its size (0.16–0.56×) is an order
of magnitude smaller than the cost (6–34×). On game-of-life, where correctness is tied at
1.00 across all cells, the trade is 8× the tokens for a 1.9× better decomposition. On
claim-office it is 34× the tokens for 2.9× — and 0.95 instead of 1.00 external correctness.

The intermediate cells are the interesting ones for practice: hybrid-v2 reaches
`cc_avg_loc_per_function` 4.04 on claim-office at 82 M tokens — 60 % of hybrid-v6's cost for
80 % of its decomposition gain over inline-tdd-v1.

---

## F-1.4 — One acceptance scenario fails across workflows and accounts for most of the correctness spread

Seven opus-5 runs on claim-office pass all internal tests but miss external scenarios.
Six of the seven fail on the same one.

| Workflow | n at `verification_pct` < 1 | Failing scenario |
|---|---:|---|
| single-context-v2 | 2 of 5 | `14-family-steinheim` (1×), total failure (1×) |
| hybrid-v2 | 1 of 5 | `14-family-steinheim` |
| hybrid-v6 | 4 of 5 | `14-family-steinheim` |

Rationale: `14-family-steinheim` fails for subagents-v1, single-context-v2, hybrid-v2 and hybrid-v6 alike on opus-5 — it is
a kata/model interaction, not a workflow defect. Any correctness comparison between
opus-5 cells on claim-office therefore measures partly this one scenario. The hybrid-v6 figure
of 0.95 means "14 of 15 scenarios in 4 runs, 15 of 15 in one", not "systematically less
correct".

The exception is the one single-context-v2 run at `verification_pct` 0: it stopped after 2 cycles with
6 functions and 60 passing self-written tests. That is the internal/external divergence
documented as F-1.2 in RQ-architecture-axis-sol-pi, and it is what drags the single-context-v2 cell
mean to 0.79 (σ 0.39) — the cell is bimodal, not uniformly mediocre.

---

## F-1.5 — single-context-v2 is the least reliable architecture on opus-5, hybrid-v2 the most efficient compromise

| claim-office | `verification_pct` per run | σ | `cycle_count` range |
|---|---|---:|---|
| single-context-v2 | 0 / 0.93 / 1 / 1 / 1 | 0.39 | 2–48 |
| hybrid-v2 | 0.93 / 1 / 1 / 1 / 1 | 0.03 | 38–52 |
| hybrid-v6 | 0.93 ×4 / 1 | 0.03 | 36–52 |

Rationale: single-context-v2's shared single context has a failure mode where the model declares the
task complete after 2 cycles. hybrid-v2 and hybrid-v6, which isolate the refactor phase, do not show
it in 10 runs. This is the same instability the Sol RQ documented for single-context-v2 (F-1.4 there,
`refactorings_applied` σ 17.4) and it reproduces on a different model and harness.

Against that, hybrid-v2 delivers 82 M tokens and 44 minutes for `cc_avg_loc_per_function` 4.04
— against hybrid-v6's 137 M and 93 minutes for 3.21. The marginal decomposition gain from hybrid-v2
to hybrid-v6 (0.83 LoC per function) costs 67 % more tokens and 111 % more wallclock.

---

## F-1.6 — Code Mass (APP) ranks the cells opposite to decomposition, on this model too

| Kata | metric | inline-tdd-v1 | single-context-v2 | hybrid-v2 | hybrid-v6 |
|---|---|---:|---:|---:|---:|
| claim-office | `cc_avg_loc_per_function` (kleiner = besser) | 9.18 | 5.89 | 4.04 | **3.21** |
| claim-office | Code Mass (APP) | 759.2 | **569.0** | 861.6 | 1002.8 |
| game-of-life | `cc_avg_loc_per_function` | 6.69 | 4.12 | 4.54 | **3.57** |
| game-of-life | Code Mass (APP) | 193.0 | **176.2** | 181.8 | 194.4 |

Rationale: the cell with the best decomposition carries the highest Code Mass on both
katas. APP measures compactness and has no notion of nesting or naming; a workflow that
extracts more named functions scores worse on it by construction. This replicates
RQ-architecture-axis-sol-pi F-1.9 on a different model and harness, which strengthens the
methodological conclusion: Code Mass (APP) must not be read as a quality metric in
architecture comparisons.

---

## F-1.7 — opus-5 writes more code than opus-4-7 under the same workflow

| Cell | Code Mass (APP) opus-4-7 | opus-5 | Factor |
|---|---:|---:|---:|
| hybrid-v6 / claim-office | 796.0 | 1002.8 | 1.26× |
| hybrid-v2 / claim-office | 861.3 | 861.6 | 1.00× |
| single-context-v2 / claim-office | 692.7 | 569.0 | 0.82× |
| hybrid-v6 / game-of-life | 169.6 | 194.4 | 1.15× |
| hybrid-v2 / game-of-life | 153.7 | 181.8 | 1.18× |
| single-context-v2 / game-of-life | 154.0 | 176.2 | 1.14× |

Rationale: in five of six matched cells opus-5 produces more code mass than opus-4-7 for
the same workflow and kata, most strongly under hybrid-v6. The additional volume comes with
better decomposition, not worse — but it means the "same work, better organised" reading
of the architecture gain is only partly right. Part of what hybrid-v6 buys on opus-5 is more
code, distributed across more functions.

Caveat: the opus-4-7 single-context-v2 and hybrid-v2 cells are pre-existing Portkey-routed runs; routing is
assumed not to affect code volume, but it was not verified.
