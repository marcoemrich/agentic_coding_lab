# RQ-astra-native-sol — Findings

Does the natively-built Sol workflow line transfer to GPT-6 Astra?
`claim-office-example-mapping` × OpenAI subscription route (`openai-codex`),
n=5 per cell, 40 runs, all `exit_reason: ok`.

**The harness is pi and the route is the OpenAI subscription in every cell.**
Only model and workflow vary. `codex` in the lab ids names the pi provider
through which the subscription is reached, not the Codex CLI.

## Übersicht

Means per cell. Direction is stated per row. Astra = `gpt-6-astra-codex-no-thinking`,
Sol = `gpt-5-6-sol-codex`.

| Metrik | Modell | v3 (Boden) | nativ inline | nativ Subagent | EXACT (v6.2.1) |
|---|---|---:|---:|---:|---:|
| Correctness (external) — saturiert | Astra | 1.00 | 1.00 | 1.00 | 1.00 |
| | Sol | 1.00 | 1.00 | 0.93 | 1.00 |
| Correctness (internal) — saturiert | Astra | 100 % | 100 % | 100 % | 100 % |
| | Sol | 100 % | 100 % | 100 % | 100 % |
| `completed_within_budget` — saturiert | Astra | 100 % | 100 % | 100 % | 100 % |
| | Sol | 100 % | 100 % | 100 % | 100 % |
| `cc_avg_loc_per_function` — kleiner = besser | Astra | 27.93 | **6.17** 🏆 | 7.34 | 12.83 |
| | Sol | 8.45 | **6.60** 🏆 | 7.75 | 9.52 |
| `cc_median_loc_per_function` — kleiner = besser | Astra | 26.8 | **4.8** 🏆 | 6.9 | 11.8 |
| | Sol | 6.1 | **4.7** 🏆 | 5.9 | 6.0 |
| Complexity Peak — kleiner = besser | Astra | 32.6 | **13.4** 🏆 | **14.0** 🏆 | 19.8 |
| | Sol | 27.0 | 18.0 | 18.4 | 24.0 |
| `cognitive_max` — kleiner = besser | Astra | 13.8 | **3.2** 🏆 | 4.0 | 5.2 |
| | Sol | 11.4 | 4.0 | 4.8 | 8.2 |
| `cognitive_avg` — kleiner = besser | Astra | 6.10 | **2.36** 🏆 | 2.48 | 2.64 |
| | Sol | 3.40 | **2.15** 🏆 | 2.33 | 3.55 |
| `mccabe_max` — kleiner = besser | Astra | 8.6 | **4.2** 🏆 | 5.0 | 6.2 |
| | Sol | 9.8 | 5.4 | 5.0 | 6.2 |
| Smell Total — kleiner = besser | Astra | 16.6 | **0.0** 🏆 | **0.0** 🏆 | 15.4 |
| | Sol | 4.2 | **0.0** 🏆 | 0.0 | 9.6 |
| Production LoC — kleiner = besser | Astra | **59.4** 🏆 | 73.6 | 72.2 | **58.0** 🏆 |
| | Sol | 164.0 | 129.4 | 161.0 | 110.4 |
| Code Mass (APP) — kein 🏆, Mechanismus-Zeuge | Astra | 367.6 | 426.2 | 440.4 | 348.2 |
| | Sol | 750.0 | 556.8 | 618.0 | 492.4 |
| `cc_functions` — kein 🏆, ambivalent | Astra | 1.8 | 7.4 | 5.6 | 2.8 |
| | Sol | 14.2 | 9.8 | 11.6 | 6.6 |
| `cycle_count` — kein 🏆, ambivalent | Astra | n/a | 40.4 | 39.4 | 42.4 |
| | Sol | n/a | 31.6 | 33.2 | 28.0 |
| `refactorings_applied` — kein 🏆, s.u. | Astra | n/a | 40.4 | 39.4 | 23.6 |
| | Sol | n/a | 31.6 | 32.2 | 14.2 |
| Refactor-Rate (`refactorings_applied`/`cycle_count`) — kein 🏆, Compliance-Maß | Astra | n/a | 1.00 | 1.00 | 0.56 |
| | Sol | n/a | 1.00 | 0.96 | 0.52 |
| `predictions_correct_rate` — kein 🏆, s.u. | Astra | n/a | 98.7 % | 99.2 % | 99.7 % |
| | Sol | n/a | 98.6 % | 99.4 % | 99.3 % |
| `duration_seconds` — kleiner = besser | Astra | 343.8 | 1801.6 | 4186.2 | 2565.4 |
| | Sol | **218.2** 🏆 | 874.2 | 2397.2 | 1265.6 |
| `total_tokens` — kleiner = besser | Astra | 528.6 k | 7.46 M | 12.23 M | 7.16 M |
| | Sol | **271.8 k** 🏆 | 4.61 M | 7.13 M | 4.61 M |

### Astra gegen Sol auf `basic-sol-tdd-pi` (nativ inline)

The head-to-head the RQ's title question reduces to: the native line's own cell, one
model against the other, n=5 each. Winner bolded; no trophies here — those are awarded
once, across all eight cells, in the table above.

| Metrik | Astra | Sol | Astra/Sol |
|---|---:|---:|---:|
| Correctness (external) — höher = besser | 1.00 | 1.00 | 1.00 |
| Correctness (internal) — höher = besser | 100 % | 100 % | — |
| `cc_avg_loc_per_function` — kleiner = besser | **6.17** | 6.60 | 0.93 |
| `cc_median_loc_per_function` — kleiner = besser | 4.80 | **4.70** | 1.02 |
| Complexity Peak — kleiner = besser | **13.4** | 18.0 | 0.74 |
| `cognitive_max` — kleiner = besser | **3.2** | 4.0 | 0.80 |
| `cognitive_avg` — kleiner = besser | 2.36 | **2.15** | 1.10 |
| `mccabe_max` — kleiner = besser | **4.2** | 5.4 | 0.78 |
| Smell Total — kleiner = besser | **0.0** | **0.0** | — |
| Production LoC — kleiner = besser | **73.6** | 129.4 | 0.57 |
| Test LoC — kein Sieger, s.u. | 115.2 | 196.8 | 0.59 |
| Code Mass (APP) — kein Sieger, Mechanismus-Zeuge | 426.2 | 556.8 | 0.77 |
| `cc_functions` — kein Sieger, ambivalent | 7.4 | 9.8 | 0.76 |
| `cycle_count` — kein Sieger, ambivalent | 40.4 | 31.6 | 1.28 |
| `refactorings_applied` — kein Sieger, s. Haupttabelle | 40.4 | 31.6 | 1.28 |
| `predictions_correct_rate` — kein Sieger, s. Haupttabelle | 98.7 % | 98.6 % | — |
| `duration_seconds` — kleiner = besser | 1801.6 | **874.2** | 2.06 |
| `total_tokens` — kleiner = besser | 7.46 M | **4.61 M** | 1.62 |

**Astra wins the structure, Sol wins the bill.** Both cells clear Correctness (external)
at 1.0 with all five runs green internally, so the whole comparison sits at equal
correctness. Astra then takes every complexity metric — Complexity Peak at 0.74×,
`mccabe_max` at 0.78×, `cognitive_max` at 0.80× — and writes 57 % of the production
code across 7.4 functions against Sol's 9.8. Smell Total is 0.0 in all ten runs.

Two of Sol's three wins are not real. `cc_median_loc_per_function` differs by 0.1 LoC at
σ 1.48 (Astra) against 0.67 (Sol), and `cognitive_avg` by 0.21 at σ 0.28/0.19 — both
inside the noise, and both contradicted by the max-variants of the same metrics, where
Astra leads clearly. Sol's only substantive win is cost: 2.06× wallclock and 1.62×
tokens is the price of Astra's structure in this cell, which is the general pattern of
F-1.6.6 rather than anything specific to the native line.

**Test LoC carries no winner.** Astra writes 59 % of Sol's test code (115.2 against
196.8) at σ 57.9 — the widest relative spread in the table, ranging across the five
runs where Sol's stays tight at σ 26.4. Less test code at equal external correctness is
not by itself better, and this RQ has no mutation score to tell coverage from
under-testing apart. Read it as an open question, not a result.

**Reading the overview table.**

- **Trophies are awarded across all eight cells, not per model row.** The two rows per
  metric are a layout choice — the contest the RQ poses runs over the whole matrix, so
  a metric whose winner is an Astra cell carries no trophy in the Sol row even where
  one Sol cell is the best of its own four.
- **Correctness gating applies to exactly one cell.** Sol's subagent arm reaches
  0.93 and is therefore excluded from every quality and efficiency trophy. All
  seven other cells sit at 1.0 and are eligible. The three correctness rows carry
  no trophy themselves — seven cells at the ceiling is not a contest.
- **TDD-discipline metrics are n/a on the v3 cells**, never 0. v3 prescribes no
  phase markers; the parser's inferred `cycle_count` (3.0 Sol / 6.8 Astra) and
  `refactorings_applied` (0.4 / 0.8) are a different construct and are omitted.
- **`cycle_count` gets no trophy** because more cycles is not per se better, and
  **`cc_functions` gets none** because its direction is not fixed — fewer functions
  can mean cleaner consolidation or missing decomposition, and this RQ has no
  independent way to tell those apart in a single row.
- **`refactorings_applied` gets no trophy either, and cannot get one here.** In three
  of the four native cells it is not an independent measurement: the native line
  refactors by contract in every cycle, so the marker that drives it fires exactly as
  often as the one that drives `cycle_count`. Astra's inline arm reads `[41, 40, 39,
  39, 43]` in both rows, run for run, as does its subagent arm and Sol's inline arm.
  Awarding a trophy there would crown the same quantity the row above is denied one
  for. Only the EXACT line, which refactors in roughly every second cycle, makes the
  two rows come apart.
- **The Refactor-Rate is a compliance measure, not a ranking.** 1.00 is the
  contractual ceiling of the native line, not an achievement over the EXACT line's
  0.52–0.56 — it says the workflow did what it prescribes. Sol's subagent arm is the
  only cell where the contract slips (0.96, one run at 0.67, and three runs above 1.0
  where a refactor subagent ran without a matching `## Red`).
- **Code Mass (APP) gets no trophy.** It is the witness for the mechanism under
  test, not a quality ranking — see F-1.6.2.
- **`predictions_correct_rate` gets no trophy.** All six marker-bearing cells lie
  between 98.6 % and 99.7 %; the spread is not interpretable.
- **Production LoC keeps its trophy but must be read next to `cc_functions`.**
  Astra's two winning cells write the least code and cut it into the fewest pieces
  (1.8 and 2.8 functions) — see F-1.6.3.

---

## F-1.6.1 — The native line's advantage over the EXACT line transfers to Astra

The comparison the RQ exists for. On Astra, `basic-sol-tdd-pi` beats
`v6.2.1-phase-continuation-pi` on every decomposition and complexity metric, in the
same direction as on Sol and by a wider margin:

| Metrik | Astra nativ | Astra EXACT | Faktor | Sol nativ | Sol EXACT | Faktor |
|---|---:|---:|---:|---:|---:|---:|
| `cc_avg_loc_per_function` | **6.17** | 12.83 | 2.1× | **6.60** | 9.52 | 1.4× |
| `cc_median_loc_per_function` | **4.8** | 11.8 | 2.5× | **4.7** | 6.0 | 1.3× |
| Complexity Peak | **13.4** | 19.8 | 1.5× | **18.0** | 24.0 | 1.3× |
| `cognitive_max` | **3.2** | 5.2 | 1.6× | **4.0** | 8.2 | 2.1× |
| `mccabe_max` | **4.2** | 6.2 | 1.5× | **5.4** | 6.2 | 1.1× |
| Smell Total | **0.0** | 15.4 | — | **0.0** | 9.6 | — |

Both models reach 1.0 Correctness (external) in both cells, so nothing here is
bought with correctness.

The separation is not a mean artefact. On `cognitive_max` the Astra native cell runs
`[3, 3, 3, 3, 4]` against the EXACT cell's `[4, 5, 5, 6, 6]` — the two distributions
touch at a single value and are otherwise disjoint, at σ 0.45 and 0.84. Smell Total is
cleaner still: 0 in all five native runs against 9, 12, 16, 19 and 21 in the five
EXACT runs.

**H1 is confirmed.** The native line is not a Sol-tuned artefact. Its advantage over
the Opus-derived line reproduces on a second model of a different generation, which
makes F-1.17.1 a statement about the refactor brief rather than about Sol.

---

## F-1.6.2 — The APP mass mechanism reproduces on a second model

F-1.17.1 attributed the EXACT line's decomposition deficit to its refactor brief:
`refactor.md` prices extraction (**Invocation (Mass: 2)**), so minimising the number
the brief names rewards inlining. The prediction that follows is specific — the EXACT
cell should show the *lowest* Code Mass (APP) and the *worst* decomposition of the
structured cells. On Astra it does:

| | Astra nativ | Astra Subagent | Astra EXACT |
|---|---:|---:|---:|
| Code Mass (APP) | 426.2 | 440.4 | **348.2** |
| Production LoC | 73.6 | 72.2 | **58.0** |
| `cc_functions` | **7.4** | 5.6 | 2.8 |
| `cc_avg_loc_per_function` | **6.17** | 7.34 | 12.83 |

The EXACT cell writes the least code of the three, achieves the lowest mass, and cuts
it into the fewest pieces — 2.8 functions against 7.4. The same three-way pattern
holds on Sol (492.4 mass / 110.4 LoC / 6.6 functions against the native cell's 556.8 /
129.4 / 9.8).

The brief's own guard against this — "Rule 2 trumps APP: Clarity over low mass" — does
not hold on either model.

Code Mass (APP) therefore carries **no trophy** in the overview. Awarding it would
crown the cell that this finding and F-1.6.1 both rank last on structure, which is the
documented APP blind spot: the metric has no notion of nesting and counts one long
function as cheap.

---

## F-1.6.3 — On Astra the v3 floor collapses into a single callback chain

The structureless baseline behaves completely differently on the two models. Sol's v3
cell decomposes into 14.2 functions; Astra's into 1.8:

| | Astra v3 | Sol v3 |
|---|---:|---:|
| `cc_functions` | 1.8 | 14.2 |
| Production LoC | 59.4 | 164.0 |
| `cc_avg_loc_per_function` | 27.93 | 8.45 |
| `cc_median_loc_per_function` | 26.8 | 6.1 |
| Complexity Peak | 32.6 | 27.0 |
| Smell Total | 16.6 | 4.2 |

Inspection of the source confirms the number rather than a parser fault: `office.ts`
is a single exported `runScenario` of roughly 35 lines in which the entire domain
logic sits inside nested `.map` / `.reduce` / `.filter` callbacks. The arrow functions
are inline lambdas, not named functions, so `cc_functions = 1` is counted correctly.

Two consequences.

**H3 is rejected.** The floor does not hold on Astra — it is beaten decisively by both
native arms and by the EXACT line. This is the opposite of the Sol/game-of-life and
Sol/sphinx results (F-1.16.2, F-1.16.7) and consistent with the Sol/claim-office one
(F-1.16.1): on a large novel spec, architecture pays.

**Astra's low LoC and low Code Mass are not parsimony.** Its two Production-LoC
trophies sit on the two cells with the fewest functions (1.8 and 2.8). This is the
RQ-astra-pi F-1.5.3 pattern reappearing on a second kata: Astra concentrates solutions
into few long functions, which reads as economy on any metric blind to nesting and as
the worst decomposition in the field on any metric that is not.

---

## F-1.6.4 — Refactor isolation buys nothing on Astra either, and costs 2.3×

The two native arms differ only in where the Four-Rules review runs. On Astra the
isolated arm is worse or equal on every quality metric while costing more than twice
as much:

| | Astra inline | Astra Subagent | |
|---|---:|---:|---|
| `cc_avg_loc_per_function` | **6.17** | 7.34 | kleiner = besser |
| `cc_median_loc_per_function` | **4.8** | 6.9 | kleiner = besser |
| `cognitive_max` | **3.2** | 4.0 | kleiner = besser |
| `mccabe_max` | **4.2** | 5.0 | kleiner = besser |
| `cc_functions` | 7.4 | 5.6 | — |
| `duration_seconds` | **1801.6** | 4186.2 | 2.3× |
| `total_tokens` | **7.46 M** | 12.23 M | 1.6× |

Complexity Peak (13.4 vs 14.0) and Smell Total (0.0 both) are the two ties, and the
isolated arm's σ is markedly wider throughout — `cc_avg_loc_per_function` σ 4.38
against 1.59, driven by one run at 15.0 against the inline arm's worst of 9.0.

**H5 is confirmed.** F-1.16.3 measured exactly this on Sol (no quality advantage,
1.9–2.7× wallclock); the Astra factor of 2.3× sits inside that band. Refactor
isolation is a property of the architecture, not of the model, and the arm has now
failed on two models and four katas.

The one asymmetry is correctness: Sol's subagent arm carries this RQ's only
regression (0.93, F-1.6.5), Astra's does not.

---

## F-1.6.5 — Correctness saturates for Astra everywhere, including the floor

All 20 Astra runs reach `verification_pct` 1.0, `tests_passing` true and
`cli_built` true, in every workflow including the structureless baseline. Astra had
never built this kata before — every prior run in the pool was game-of-life.

**H4 is rejected.** The concern was specific and reasonable: game-of-life did not
discriminate on correctness for Astra (F-1.5.6), and F-1.5.3 showed Astra writing the
least and least-decomposed code of the GPT branch, which is the profile that breaks on
under-specified specs. It did not break here.

The single regression in the RQ belongs to Sol: `basic-sol-tdd-subagent-pi` at 0.93,
one run at 0.67. That reproduces F-1.16.4, which found the subagent arm ranking last
on external correctness on both novel katas. It gates that cell out of every quality
and efficiency trophy in the overview.

Correctness therefore gates rather than differentiates in this RQ, and the whole
remaining field is eligible for the quality trophies.

---

## F-1.6.6 — Astra is the slower and more token-hungry model at every workflow

The ratio is remarkably stable across four architectures that differ by an order of
magnitude in absolute cost:

| Workflow | Astra | Sol | Faktor | Astra Tokens | Sol Tokens | Faktor |
|---|---:|---:|---:|---:|---:|---:|
| v3 (Boden) | 343.8 s | 218.2 s | 1.58× | 528.6 k | 271.8 k | 1.94× |
| nativ inline | 1801.6 s | 874.2 s | 2.06× | 7.46 M | 4.61 M | 1.62× |
| nativ Subagent | 4186.2 s | 2397.2 s | 1.75× | 12.23 M | 7.13 M | 1.72× |
| EXACT (v6.2.1) | 2565.4 s | 1265.6 s | 2.03× | 7.16 M | 4.61 M | 1.55× |

Astra runs 1.58–2.06× the wallclock and 1.55–1.94× the tokens of Sol on identical
work. It also runs more cycles everywhere (39.4–42.4 against 28.0–33.2) and applies
more refactorings (23.6–40.4 against 14.2–32.2), so part of the cost is more loop, not
only slower tokens.

This is a larger and more consistent gap than RQ-astra-pi found on game-of-life, where
Astra was the *faster* of the two subscription cells (496 s against 616 s). The
direction reverses on the large spec.

---

## F-1.6.7 — Astra writes roughly half the code of Sol, at every workflow

| Workflow | Astra Production LoC | Sol Production LoC | Faktor |
|---|---:|---:|---:|
| v3 (Boden) | 59.4 | 164.0 | 0.36× |
| nativ inline | 73.6 | 129.4 | 0.57× |
| nativ Subagent | 72.2 | 161.0 | 0.45× |
| EXACT (v6.2.1) | 58.0 | 110.4 | 0.53× |

Both models pass the same external acceptance suite at 1.0, so this is not a
completeness difference. Astra's spread is also far tighter — σ 4.34–14.18 against
Sol's 13.24–61.76.

The reading depends entirely on which cell is being looked at, which is why Production
LoC cannot stand alone. In the native cells Astra writes less code *and* decomposes it
better than Sol (7.4 functions at 6.17 LoC each). In the v3 and EXACT cells it writes
less code *because* it decomposes worse (1.8 and 2.8 functions). The same metric
carries opposite meanings two rows apart.

---

## Caveats

- **`cost_usd` is not an outcome of this RQ, but it is now readable.** Astra's tariff
  was looked up and cross-checked on 2026-09-05 ($10 input / $50 output / $1 cache
  read per 1M, three independent sources — see `research/model-pricing.md`), and
  `compute-cost.py` is now the single source for every pi run on both routes. On
  these cells Astra costs 2.6× Sol at list price — $1.25 / $9.75 / $20.65 / $12.51
  against $0.58 / $3.98 / $7.40 / $4.84 across v3 / native / subagent / EXACT. That
  is a real comparison, not the fabricated figure described below. It stays out of
  `outcomes:` because it was not part of the question this RQ was built to answer,
  and because the ranking it produces is the token ranking of F-1.6.6 multiplied by
  a constant tariff ratio — it adds a dimension to the cost of the subagent arm
  (F-1.6.4), not a new axis.
- **How the fabricated figure arose, kept as a record.** `gpt-6-astra` is not declared in `pi-config/agent/models.json`
  at all — pi logs `Warning: Model "gpt-6-astra" not found for provider "openai-codex".
  Using custom model id.` and passes the id through. It then prices the run with **Sol's
  tariff**: for one run, 161 313 input × $5/M + 18 725 output × $30/M + 7 970 944
  cache-read × $0.5/M = $5.353787, matching the recorded `cost_usd` to the cent. The
  column therefore carries Sol's list price on Astra's tokens — a fabricated number, not
  a measurement and not Astra's tariff. Never quote it. Tokens and wallclock are the
  cost signal on this route.
- **The model ran, despite not being declared.** The transcripts record `gpt-6-astra`
  throughout and there is no fallback to Sol; the runs are genuine Astra runs. But the
  undeclared entry also means `contextWindow` and `maxTokens` are whatever pi defaults
  to, not values verified for Astra. Do not read any context-pressure result from this RQ.
- **Model and date are fully confounded.** All Sol cells were recorded on 2026-08-16/17,
  all Astra cells on 2026-09-05. Any drift on the subscription route in that window sits
  entirely inside the model factor. No cell in this design separates the two. The
  cross-model findings (F-1.6.6, F-1.6.7) are the ones exposed to this; the
  within-model findings (F-1.6.1 through F-1.6.4) are not, since each compares cells
  recorded in the same batch.
- **Phase timings and context utilization are 0 on this route.** `avg_cycle_seconds`,
  `avg_red_seconds`, `avg_green_seconds`, `avg_refactor_seconds` and
  `context_utilization_pct` come back 0 despite millions of tokens. Parser gap, not
  measurement; excluded from `outcomes`.
- **`predictions_total` is not comparable and was not read.** The native line
  legitimately produces already-green cycles without predictions, and Astra showed a
  1-in-5 marker inconsistency on game-of-life (F-1.5.5). Only the rate is reported, and
  it separates nothing.
- **`--thinking off` does not suppress reasoning on this route** (F-1.3.5). The
  `-no-thinking` suffix names a flag, not a reasoning state.
- **One prompt style, one kata.** example-mapping on claim-office. F-1.16.2 and
  F-1.16.7 show the native line losing to the v3 floor on small katas for Sol; whether
  Astra's floor collapse (F-1.6.3) also inverts there is untested.
- **The native line is an adaptation.** HITL removed, markers P1–P7 added, both in a
  `LAB-ONLY` block. A difference against the EXACT line could in principle come from
  the adaptation rather than the methodology.
