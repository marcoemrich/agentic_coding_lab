# Findings — RQ-architecture-axis-sol-pi

Does the TDD architecture axis (v4.1 isolated subagents / v5.1 single context / v6.1 hybrid)
rank the same way on gpt-5-6-sol as it does on opus-4-7 — and does any of it beat the
unstructured baselines?

Data base: 50 runs, 10 cells × n=5, all `exit_reason: ok`, `completed_within_budget` 100 %.

## Übersicht

**claim-office-example-mapping** (correctness kata)

| Metric | v1 | v3 | v4.1 | v5.1 | v6.1 | Direction |
|---|---:|---:|---:|---:|---:|---|
| Correctness (external) `verification_pct` | 80 % | **100 %** 🏆 | 40 % | **100 %** 🏆 | **100 %** 🏆 | höher = besser |
| Correctness (internal) `tests_passing` | 80 % | 100 % | 100 % | 100 % | 100 % | höher = besser |
| `cognitive_max` | 7.8 | 9.2 | 11.6 | 8.4 | **5.8** 🏆 | kleiner = besser |
| `cognitive_avg` | 2.54 | 3.65 | 3.70 | 3.58 | **2.65** 🏆 | kleiner = besser |
| `mccabe_max` | 8.0 | 8.2 | 13.6 | 8.2 | **6.0** 🏆 | kleiner = besser |
| Smell Total | 0.0 | **6.8** 🏆 | 28.0 | 12.4 | 15.2 | kleiner = besser |
| Complexity Peak `cc_longest_function` | 17.8 | **21.8** 🏆 | 43.4 | 23.0 | 23.0 | kleiner = besser |
| `cc_avg_loc_per_function` | 6.74 | **8.01** 🏆 | 6.96 | 10.48 | 10.72 | kleiner = besser |
| Code Mass (APP) | 874.6 | 678.8 | 646.8 | 524.6 | 446.4 | kleiner = besser (kein 🏆 — s. Caveat) |
| `cycle_count` | n/a | n/a | 87.4 | **29.6** 🏆 | 34.2 | — |
| `refactorings_applied` | n/a | n/a | 10.2 | **19.6** 🏆 | 15.0 | höher = besser |
| `predictions_correct_rate` | n/a | n/a | 79.0 % | 98.4 % | **98.6 %** 🏆 | höher = besser |
| `duration_seconds` | 167 | **229** 🏆 | 4296 | 255 | 1185 | kleiner = besser |
| `total_tokens` | 177 k | **288 k** 🏆 | 14.1 M | 821 k | 4.99 M | kleiner = besser |
| `cost_usd` | $0.74 | **$1.18** 🏆 | $38.22 | $1.72 | $9.52 | kleiner = besser |

**game-of-life-example-mapping** (code-quality kata)

| Metric | v1 | v3 | v4.1 | v5.1 | v6.1 | Direction |
|---|---:|---:|---:|---:|---:|---|
| Correctness (external) `verification_pct` | **100 %** 🏆 | **100 %** 🏆 | **100 %** 🏆 | **100 %** 🏆 | **100 %** 🏆 | höher = besser |
| `cognitive_max` | 4.2 | **4.0** 🏆 | 7.0 | 7.4 | 8.6 | kleiner = besser |
| `cognitive_avg` | 2.41 | **2.35** 🏆 | 3.23 | 4.37 | 6.20 | kleiner = besser |
| `mccabe_max` | 4.8 | **4.6** 🏆 | 6.0 | 6.2 | 6.6 | kleiner = besser |
| Smell Total | **0.0** 🏆 | **0.0** 🏆 | 3.8 | 2.4 | 2.8 | kleiner = besser |
| Complexity Peak `cc_longest_function` | **13.2** 🏆 | 15.6 | 22.0 | 20.6 | 20.8 | kleiner = besser |
| `cc_avg_loc_per_function` | **6.80** 🏆 | 8.66 | 12.83 | 13.07 | 15.90 | kleiner = besser |
| Code Mass (APP) | 188.0 | 174.8 | 146.8 | 141.0 | 125.8 | kleiner = besser (kein 🏆 — s. Caveat) |
| `cycle_count` | n/a | n/a | 22.0 | 9.4 | **9.0** 🏆 | — |
| `refactorings_applied` | n/a | n/a | **10.2** 🏆 | 5.2 | 4.4 | höher = besser |
| `predictions_correct_rate` | n/a | n/a | 84.4 % | 95.9 % | **100 %** 🏆 | höher = besser |
| `duration_seconds` | **87** 🏆 | 140 | 899 | 198 | 343 | kleiner = besser |
| `total_tokens` | **66 k** 🏆 | 134 k | 1.61 M | 701 k | 803 k | kleiner = besser |
| `cost_usd` | **$0.35** 🏆 | $0.57 | $4.84 | $1.58 | $2.18 | kleiner = besser |

Caveats for reading the tables:

- **Correctness gating**: on claim-office, trophies for quality/efficiency metrics go only to
  cells at `verification_pct` 100 % — v3, v5.1, v6.1. v1 (80 %) and v4.1 (40 %) produce partly
  wrong implementations; their complexity and cost figures do not describe parsimony. v1's
  Smell Total 0.0 and its category-leading `cc_longest_function` 17.8 are therefore untrophied
  despite being the lowest values in the row.
- On game-of-life all five variants reach `verification_pct` 100 %, so no gating applies there.
- **`cycle_count`, `refactorings_applied` and `predictions_correct_rate` are n/a for v1 and v3**,
  not zero. Neither workflow prescribes phase markers, so the parser has nothing to count — a 0
  would read as "did not refactor" when the truth is "not instrumented". See MARKERS.md,
  "Baseline workflows satisfy marker 4 only".
- **Code Mass (APP) carries no trophy in this RQ.** It rewards exactly what F-1.9 shows this
  data does not support: the cells with the lowest `code_mass` are the ones that decompose
  least. APP measures compactness (Micah Martin's premise), which is a different question from
  "is this well decomposed" — and it has no notion of nesting, so a 30-line callback chain and
  the same logic split across named functions are indistinguishable to it. The values stay in
  the table as context; the decomposition reading belongs to `cc_avg_loc_per_function`.
- Where the spread stays inside 1 σ, all near-tied values carry a trophy — the reading is
  "no effect", not a winner.
- `cycle_count` is ambivalent (neither high nor low is per se better) and carries a trophy only
  as a descriptive marker of the least-looping cell.
- `cost_usd` is a list-price baseline (Requesty catalogue price × tokens), not a billed amount —
  Requesty reports no inline cost.

---

## F-1.1 — H1 confirmed: Sol keeps the opus-4-7 side of the v4/v6 swap

On claim-office, v6.1 and v5.1 both reach Correctness (external) 100 %, while v4.1 drops to
40 %. Sol therefore lands on the **opus-4-7 side** of the swap documented in
F-workflow-model.1, not on the opus-4-6 side.

| Workflow | n | `verification_pct` | opus-4-7 reference (`.1` gen.) |
|---|---:|---:|---:|
| v4.1-testlist-scope-fix-pi | 5 | 0.40 | 0.96 (n=5) |
| v5.1-testlist-scope-fix-pi | 5 | **1.00** 🏆 | 1.00 (n=6) |
| v6.1-hybrid-testlist-scope-fix-pi | 5 | **1.00** 🏆 | 1.00 (n=3) |

Rationale: the hypothesised failure mode of H2 was v6.1 degrading — delegating orchestration
to the model in a shared context, which opus-4-6 could not carry. Sol carries it without any
loss: 5 of 5 runs pass the full external acceptance suite. The reduction chain built on top of
v6 therefore rests on an architecture Sol supports, and the planned follow-up (RQ-B, retest of
the reduction chain) is not blocked by the gate this RQ was designed to check.

The deviation from the reference is on the other end of the axis: v4.1 was near-perfect on
opus-4-7 (0.96) and collapses on Sol (0.40). The swap is real, but its failing side moved.

---

## F-1.2 — v4.1 fails on claim-office through looping, not through abort

All five v4.1/claim-office runs finish inside the budget with internal tests green (43–62
tests), yet three of them produce wrong output against the external suite. The failure is
invisible from inside the run.

| Metric | v4.1 | v5.1 | v6.1 |
|---|---:|---:|---:|
| `completed_within_budget` | 100 % | 100 % | 100 % |
| Correctness (internal) `tests_passing` | 100 % | 100 % | 100 % |
| Correctness (external) `verification_pct` | 40 % | **100 %** 🏆 | **100 %** 🏆 |
| `cycle_count` | 87.4 | **29.6** 🏆 | 34.2 |
| `predictions_total` (pooled) | 518 | 124 | 148 |
| `predictions_correct_rate` | 79.0 % | 98.4 % | **98.6 %** 🏆 |
| `duration_seconds` | 4296 | **255** 🏆 | 1185 |
| `cost_usd` | $38.22 | **$1.72** 🏆 | $9.52 |

Manual verification of all five runs against acceptance scenario `01-block-exact-three`
(expected `premium: 71`): the two passing runs return 71; the three failing ones return 5,
return 59 plus a spurious extra result object, and return empty output respectively. Three
different wrong answers, no crash, no missing `cli.ts` — the CLI runs and computes the wrong
thing.

Rationale: the profile is a model that keeps working without converging. v4.1 runs ~2.9× the
cycles of v5.1, spends 16.8× the wallclock and 22× the cost, and its prediction accuracy drops
to 79 % — the lowest value in the whole RQ. Under the isolated-subagent architecture every
phase starts without the preceding context, so Sol re-derives the domain rules per cycle and
drifts. `cycle_count` and `completed_within_budget` were declared in the RQ as the check for
residual harness stalls (caveat 1); the stall reading is ruled out — these runs are not
stalling, they are looping.

The internal/external gap is the finding that matters operationally: 60 self-written tests
pass while the acceptance suite scores 0. Internal correctness does not detect this failure
mode.

---

## F-1.3 — The kata inversion of v4.1 replicates on Sol

v4.1 is competitive on game-of-life and collapses on claim-office — the same inversion
documented for opus-4-7 in F-tdd-quality.9.

| Kata | v4.1 `cognitive_max` | v5.1 | v6.1 | v4.1 rank (structured cells) |
|---|---:|---:|---:|---|
| game-of-life | 7.0 | 7.4 | 8.6 | 1 of 3 (within 1 σ) |
| claim-office | 11.6 | 8.4 | **5.8** 🏆 | 3 of 3 |

On `cognitive_avg` the picture is sharper: v4.1 leads game-of-life (3.23 vs. 4.37 / 6.20) and
trails on claim-office (3.70 vs. 3.58 / 2.65). `refactorings_applied` shows the same split —
v4.1 leads game-of-life (10.2 vs. 5.2 / 4.4) and trails claim-office (10.2 vs. 19.6 / 15.0).

Rationale: on the small, training-known kata the isolated-subagent architecture costs nothing —
each phase has little context to lose. On the large kata with a multi-part spec, the same
isolation removes exactly what is needed. This is not a Sol-specific artefact: it reproduces
the Opus pattern, which raises confidence that the inversion is a property of the architecture,
not of one model.

The baselines qualify the rank statement: v4.1's "rank 1 on game-of-life" holds only among the
structured cells. Against the full field it is rank 3 of 5 — v1 (4.2) and v3 (4.0) are lower
still, and their spread is far tighter (σ 1.10 / 0.71 against v4.1's 4.58).

---

## F-1.4 — v5.1 is the efficiency optimum, v6.1 the complexity optimum

Both reach 100 % Correctness (external) on both katas, so the choice between them is not a
correctness question.

| Metric (claim-office) | v5.1 | v6.1 | Factor |
|---|---:|---:|---:|
| `duration_seconds` | **255** 🏆 | 1185 | 4.6× |
| `total_tokens` | **821 k** 🏆 | 4.99 M | 6.1× |
| `cost_usd` | **$1.72** 🏆 | $9.52 | 5.5× |
| `cognitive_max` | 8.4 | **5.8** 🏆 | 1.4× |
| `mccabe_max` | 8.2 | **6.0** 🏆 | 1.4× |
| Code Mass (APP) | 524.6 | **446.4** 🏆 | 1.2× |
| Smell Total | **12.4** 🏆 | 15.2 | 1.2× |

Rationale: v5.1 runs everything in one shared context and pays for it once; v6.1 isolates the
refactor phase, which costs a separate context per refactoring but buys measurably lower
complexity. The efficiency gap (4.6–6.1×) is an order of magnitude larger than the complexity
gap (1.2–1.4×), so the trade is not symmetric.

Caveat on the σ: v5.1 carries the widest spread in the RQ on claim-office — `cycle_count` 6–39
(σ 13.4), `refactorings_applied` 2–40 (σ 17.4), `cost_usd` $0.57–$4.12. One run completed in 6
cycles with 2 refactorings and still passed the acceptance suite. The mean is stable, the
per-run behaviour is not; v6.1 is the tighter of the two (`refactorings_applied` σ 2.35 vs.
17.4).

---

## F-1.5 — Sol's complexity level is not systematically higher than Opus on this axis

The RQ's reading rule assumed absolute values would not be comparable across models, citing
`cognitive_max` ~3× on comparable cells (F-1.3 of RQ-cost-sol-pi-vs-opus-cc). On this axis the
gap does not appear — Sol is at or below the Opus reference in most cells.

| Cell | Sol `cognitive_max` | opus-4-7 reference | Direction |
|---|---:|---:|---|
| claim-office / v4.1 | 11.6 | 26.8 (σ 24.1, max 68) | Sol lower |
| claim-office / v5.1 | 8.4 | 14.8 | Sol lower |
| claim-office / v6.1 | 5.8 | 4.3 | Sol slightly higher |
| game-of-life / v4.1 | 7.0 | 6.4 | comparable |
| game-of-life / v5.1 | 7.4 | 17.6 | Sol lower |
| game-of-life / v6.1 | 8.6 | 6.5 | Sol slightly higher |

Rationale: the ranking comparison this RQ was designed for holds regardless — that was the
point of restricting the reading rule to ranks. But the premise behind the restriction does not
generalise to this axis. Where Opus produced extreme outliers (claim-office/v4.1 at max 68), Sol
stays bounded (max 15). The Sol-carries-higher-complexity claim should be treated as cell-
specific, not as a model property.

Caveat: the opus-4-7 reference cells run at n=3–10 (v6.1/claim-office at n=3), so the
comparison inherits that uncertainty. This finding is a caution against over-generalising the
earlier claim, not a refutation of it.

---

## F-1.6 — On game-of-life the entire architecture axis is a net negative

All five cells reach Correctness (external) 100 %. Every structured workflow is nonetheless
worse than doing nothing in particular — on every quality metric, not only on cost.

| Metric | v1 | v3 | best structured | Direction |
|---|---:|---:|---:|---|
| `cognitive_max` | 4.2 | **4.0** 🏆 | 7.0 (v4.1) | kleiner = besser |
| `cognitive_avg` | 2.41 | **2.35** 🏆 | 3.23 (v4.1) | kleiner = besser |
| `mccabe_max` | 4.8 | **4.6** 🏆 | 6.0 (v4.1) | kleiner = besser |
| Smell Total | **0.0** 🏆 | **0.0** 🏆 | 2.4 (v5.1) | kleiner = besser |
| Complexity Peak `cc_longest_function` | **13.2** 🏆 | 15.6 | 20.6 (v5.1) | kleiner = besser |
| `cc_avg_loc_per_function` | **6.80** 🏆 | 8.66 | 12.83 (v4.1) | kleiner = besser |
| `cost_usd` | **$0.35** 🏆 | $0.57 | $1.58 (v5.1) | kleiner = besser |

Code Mass (APP) runs the other way — v6.1 produces the lowest value (125.8 against v1's
188.0) — but on this kata that ranking is an artefact of the metric, not a counter-result:
v6.1 also has the *worst* decomposition in the field (`cc_avg_loc_per_function` 15.90, and
1.6 functions per run on average). It scores low on APP because it writes one long function,
not because it writes compact code. See F-1.9.

Rationale: game-of-life is small and training-known. The spec fits in one context, so there is
nothing for a TDD architecture to protect against — and the machinery it adds (phase splits,
refactor passes, subagent hand-offs) shows up as complexity in the artefact. v3's σ is also the
tightest in the field (`cognitive_max` σ 0.71 against v6.1's 5.73): the unstructured cells are
not just better on the mean, they are more predictable.

This is the counter-case named in H4 and it holds for this kata. It does not generalise to
claim-office — see F-1.7.

---

## F-1.7 — Structure pays only where the spec exceeds one context

The two katas invert. On claim-office the baselines lose the property they won on
game-of-life: v1 drops to 80 % Correctness (external) and carries the highest Code Mass (APP)
in the field.

| Metric (claim-office) | v1 | v3 | v5.1 | v6.1 |
|---|---:|---:|---:|---:|
| Correctness (external) | 80 % | **100 %** 🏆 | **100 %** 🏆 | **100 %** 🏆 |
| `cognitive_max` | 7.8 | 9.2 | 8.4 | **5.8** 🏆 |
| `cc_avg_loc_per_function` | 6.74 | **8.01** 🏆 | 10.48 | 10.72 |
| Code Mass (APP) | 874.6 | 678.8 | 524.6 | 446.4 |
| `cost_usd` | $0.74 | **$1.18** 🏆 | $1.72 | $9.52 |

v1's single failure is the slowest run of its cell (214 s against 134–176 s) — the same
"more work, worse result" signature as v4.1 in F-1.2, and the mechanism differs: that run fails
its own tests (`tests_passing` false), where v4.1's failures pass theirs. Without a test-first
discipline the model has no way to notice it has misread the spec.

**v3 is the practical finding here.** It reaches the same 100 % Correctness (external) as v5.1
and v6.1, at $1.18 against v6.1's $9.52 — an 8× cost difference for identical external
correctness — and it does so with a ~15-line prompt carrying no agents, no skills and no phase
structure. It also decomposes better than either structured cell
(`cc_avg_loc_per_function` 8.01 against 10.48 / 10.72). What it gives up is the complexity
peak: `cognitive_max` 9.2, the second-highest in the field, against v6.1's 5.8.

Rationale: the correctness gap between v1 (80 %) and v3 (100 %) is what TDD itself buys on a
spec that does not fit one pass. What *architecture* buys on top is narrower than the earlier
reading of this data suggested — on `cognitive_max` v6.1 leads clearly, but on decomposition it
trails, and the Code Mass (APP) advantage it appeared to hold does not survive F-1.9. The
defensible claim is "v6.1 produces the flattest single functions", not "v6.1 produces the
better-structured code".

Caveat: at n=5 the v1/v3 correctness difference (4/5 against 5/5) rests on a single run.
The direction is consistent with the mechanism above, but the effect size is not established.

---

## F-1.8 — Marker discipline is a property of the architecture

`predictions_total` should be ≈ 2 × `cycle_count`. Across the three structured cells the
observed quota varies more than any code-quality metric in this RQ.

| Workflow | `predictions_correct_rate` | Quota spread across runs |
|---|---:|---|
| v4.1 | 79.0 % / 84.4 % | consistent, lowest accuracy |
| v5.1 | 98.4 % / 95.9 % | 6 %–100 % — one run: 4 predictions across 36 cycles |
| v6.1 | **98.6 %** 🏆 / **100 %** 🏆 | consistently near-complete |

Verified not to be a parser artefact: the 6 % run emitted `## Red` and `## Refactor` 36 times
each, but the `Red Phase Complete:` block only twice.

Rationale: `predictions_correct_rate` stays valid as a ratio, but `predictions_total` and — for
v5.1 — `refactorings_applied` partly measure marker compliance rather than TDD work. This
explains v5.1's σ 17.4 on `refactorings_applied` (range 2–40 at near-identical cycle counts)
without invoking a workflow effect. v6.1 holds the model on-format most reliably; v5.1 least.

Consequence for RQ-B: any TDD-discipline metric compared across architectures carries this
confound. Correctness and code-quality metrics are unaffected — they are measured externally
from the source tree.

---

## F-1.9 — The architecture axis trades decomposition for flatness, and the standard metrics hide it

The more architecture a workflow carries, the longer its average function. The effect is
monotonic on both katas and is the exact opposite of what Code Mass (APP) reports.

| Kata | v1 | v3 | v4.1 | v5.1 | v6.1 | Direction |
|---|---:|---:|---:|---:|---:|---|
| `cc_avg_loc_per_function` — claim-office | **6.74** | **8.01** 🏆 | 6.96 | 10.48 | 10.72 | kleiner = besser |
| `cc_avg_loc_per_function` — game-of-life | **6.80** 🏆 | 8.66 | 12.83 | 13.07 | 15.90 | kleiner = besser |
| Code Mass (APP) — claim-office | 874.6 | 678.8 | 646.8 | 524.6 | 446.4 | kleiner = besser |
| Code Mass (APP) — game-of-life | 188.0 | 174.8 | 146.8 | 141.0 | 125.8 | kleiner = besser |

The two rows per kata rank the cells in reverse. v6.1 has the lowest Code Mass (APP) on both
katas and the worst decomposition on both. On game-of-life it averages 1.6 functions per run —
the implementation is essentially one function.

**Three metrics fail to detect this, for two distinct reasons.** Established by construction on
a minimal pair (same logic, nested control flow vs. `reduce` callbacks):

| Metric | nested `for`/`if` | callback chain |
|---|---:|---:|
| Cognitive Complexity | 10 | **1** |
| McCabe | 5 | **2** |
| Code Mass (APP) | 43 | **43** |

Cognitive Complexity resets its nesting counter at every function boundary, and an arrow
function is one — `for` inside `for` counts as nesting, `reduce` inside `reduce` does not.
`cognitive_max` compounds this by taking a maximum *per function*, so logic spread across
callbacks reports the maximum of one callback. APP fails differently: it has no notion of
nesting at all, only of how many constructs occur.

Rationale: this is why `cognitive_max` reads v6.1 as the cleanest cell on claim-office (5.8)
while `cc_avg_loc_per_function` reads it as among the worst (10.72). Both are correct about
what they measure. A single long function built from callback chains genuinely has a low
cognitive peak — and genuinely lacks abstraction. Spot-checking one Sol/v6.1/claim-office run
against an opus-4-7 implementation of the same kata makes the gap concrete: 3 functions against
28, `cognitive_max` 4 against 6, Smell Total 14 against 1. The metric that tracked the readable
difference was Smell Total; the metric that inverted it was `cognitive_max`.

Consequence: `cc_avg_loc_per_function` is a required outcome for any RQ comparing architectures,
and Code Mass (APP) should not be read as a quality metric. Both limits are recorded in the RQ
README under "Metric blind spot". The finding is about the metrics, not about Sol — nothing here
suggests the effect is model-specific, and the same blind spot applies to every RQ in the repo
that ranks cells by Code Mass (APP) or `cognitive_max` alone.

Caveat: `cc_avg_loc_per_function` measures decomposition, not naming. A function split into
`step1`…`step10` would score well. It is also gameable once a workflow prompt names it — no
workflow in this RQ does, so the comparison holds here.
