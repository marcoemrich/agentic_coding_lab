# Findings — RQ-architecture-axis-sol-pi

Does the TDD architecture axis (v4.1 isolated subagents / v5.1 single context / v6.1 hybrid)
rank the same way on gpt-5-6-sol as it does on opus-4-7 — and does any of it beat plain TDD
without an architecture?

Data base: 50 runs, 10 cells × n=5, all `exit_reason: ok`, `completed_within_budget` 100 %.
`v3-basic-tdd-pi` is the baseline: TDD with no phase structure, no agents, no skills.
`v6.6-lab-split-pi` is the current generation: v6.1 plus a dedicated end-refactor phase.

## Übersicht

**claim-office-example-mapping** (correctness kata)

| Metric | v3 | v4.1 | v5.1 | v6.1 | v6.6 | Direction |
|---|---:|---:|---:|---:|---:|---|
| Correctness (external) `verification_pct` | **100 %** 🏆 | 40 % | **100 %** 🏆 | **100 %** 🏆 | **100 %** 🏆 | höher = besser |
| Correctness (internal) `tests_passing` | 100 % | 100 % | 100 % | 100 % | 100 % | höher = besser |
| `cognitive_max` | 9.2 | 11.6 | 8.4 | 5.8 | **4.4** 🏆 | kleiner = besser |
| `cognitive_avg` | 3.65 | 3.70 | 3.58 | 2.65 | **2.45** 🏆 | kleiner = besser |
| `mccabe_max` | 8.2 | 13.6 | 8.2 | 6.0 | **5.8** 🏆 | kleiner = besser |
| Smell Total | 6.8 | 28.0 | 12.4 | 15.2 | **0.0** 🏆 | kleiner = besser |
| Complexity Peak `cc_longest_function` | 21.8 | 43.4 | 23.0 | 23.0 | **21.2** 🏆 | kleiner = besser |
| `cc_avg_loc_per_function` | **8.01** 🏆 | 6.96 | 10.48 | 10.72 | 11.05 | kleiner = besser |
| Code Mass (APP) | 678.8 | 646.8 | 524.6 | 446.4 | 466.8 | kleiner = besser (kein 🏆 — s. Caveat) |
| `cycle_count` | n/a | 87.4 | 29.6 | 34.2 | **27.8** 🏆 | — |
| `refactorings_applied` | n/a | 10.2 | **19.6** 🏆 | 15.0 | 15.4 | höher = besser |
| `predictions_correct_rate` | n/a | 79.0 % | 98.4 % | **98.6 %** 🏆 | 96.7 % | höher = besser |
| `duration_seconds` | **229** 🏆 | 4296 | 255 | 1185 | 1204 | kleiner = besser |
| `total_tokens` | **288 k** 🏆 | 14.06 M | 821 k | 4.99 M | 5.08 M | kleiner = besser |
| `cost_usd` | **$1.18** 🏆 | $38.22 | $1.72 | $9.52 | $7.25 | kleiner = besser |

**game-of-life-example-mapping** (code-quality kata)

| Metric | v3 | v4.1 | v5.1 | v6.1 | v6.6 | Direction |
|---|---:|---:|---:|---:|---:|---|
| Correctness (external) `verification_pct` | **100 %** 🏆 | **100 %** 🏆 | **100 %** 🏆 | **100 %** 🏆 | **100 %** 🏆 | höher = besser |
| `cognitive_max` | **4.0** 🏆 | 7.0 | 7.4 | 8.6 | 5.6 | kleiner = besser |
| `cognitive_avg` | **2.35** 🏆 | 3.23 | 4.37 | 6.20 | 5.05 | kleiner = besser |
| `mccabe_max` | **4.6** 🏆 | 6.0 | 6.2 | 6.6 | 5.8 | kleiner = besser |
| Smell Total | **0.0** 🏆 | 3.8 | 2.4 | 2.8 | **0.0** 🏆 | kleiner = besser |
| Complexity Peak `cc_longest_function` | **15.6** 🏆 | 22.0 | 20.6 | 20.8 | 19.8 | kleiner = besser |
| `cc_avg_loc_per_function` | **8.66** 🏆 | 12.83 | 13.07 | 15.90 | 10.80 | kleiner = besser |
| Code Mass (APP) | 174.8 | 146.8 | 141.0 | 125.8 | 135.8 | kleiner = besser (kein 🏆 — s. Caveat) |
| `cycle_count` | n/a | 22.0 | 9.4 | 9.0 | **8.8** 🏆 | — |
| `refactorings_applied` | n/a | **10.2** 🏆 | 5.2 | 4.4 | 4.6 | höher = besser |
| `predictions_correct_rate` | n/a | 84.4 % | 95.9 % | **100 %** 🏆 | 95.8 % | höher = besser |
| `duration_seconds` | **140** 🏆 | 899 | 198 | 343 | 450 | kleiner = besser |
| `total_tokens` | **134 k** 🏆 | 1.61 M | 701 k | 803 k | 1.15 M | kleiner = besser |
| `cost_usd` | **$0.57** 🏆 | $4.84 | $1.58 | $2.18 | $2.35 | kleiner = besser |

Caveats for reading the tables:

- **Correctness gating**: on claim-office, trophies for quality/efficiency metrics go only to
  cells at `verification_pct` 100 % — v3, v5.1, v6.1. v4.1 (40 %) produces partly wrong
  implementations; its complexity and cost figures do not describe parsimony.
- On game-of-life all five variants reach `verification_pct` 100 %, so no gating applies there.
- **`cycle_count`, `refactorings_applied` and `predictions_correct_rate` are n/a for v3**, not
  zero. v3 prescribes no phase markers, so the parser has nothing to count — a 0 would read as
  "did not refactor" when the truth is "not instrumented". See MARKERS.md, "Baseline workflows
  satisfy marker 4 only".
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
- **`Smell Total` 0.0 does not mean "no quality problems".** Three of the ten cells score zero,
  including cells whose code manual inspection rates as poor (F-1.11). The ESLint configuration
  scores duplication, magic numbers and complexity thresholds; imperative-instead-of-declarative
  style and nesting spread across function boundaries are outside what it checks. Read a zero as
  "none of the configured rules fired", not as an endorsement.

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
structured cells. Against the full field it is rank 2 of 4 — v3 (4.0) is lower still, and its
spread is far tighter (σ 0.71 against v4.1's 4.58).

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
| Smell Total | **12.4** 🏆 | 15.2 | 1.2× |
| `cc_avg_loc_per_function` | **10.48** 🏆 | 10.72 | 1.0× |
| Code Mass (APP) | 524.6 | 446.4 | 1.2× |

Rationale: v5.1 runs everything in one shared context and pays for it once; v6.1 isolates the
refactor phase, which costs a separate context per refactoring but buys a lower complexity
peak. The efficiency gap (4.6–6.1×) is an order of magnitude larger than the complexity gap
(1.2–1.4×), so the trade is not symmetric.

What v6.1 does **not** buy is better structure. On decomposition the two are
indistinguishable (10.48 vs. 10.72, well inside σ 2.87 / 2.37), and v5.1 carries fewer smells
(12.4 vs. 15.2). The header's "complexity optimum" therefore means the flattest individual
functions, not the better-organised code — see F-1.9 for why those come apart. Code Mass (APP)
carries no trophy here for the same reason.

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

## F-1.6 — On game-of-life the architecture axis is a net negative against plain TDD

All five cells reach Correctness (external) 100 %. Every architecture is nonetheless worse
than structureless TDD on every quality metric except one, and on cost.

| Metric | v3 (baseline) | best structured | Faktor | Direction |
|---|---:|---:|---:|---|
| `cognitive_max` | **4.0** 🏆 | 5.6 (v6.6) | 1.40× | kleiner = besser |
| `cognitive_avg` | **2.35** 🏆 | 3.23 (v4.1) | 1.37× | kleiner = besser |
| `mccabe_max` | **4.6** 🏆 | 5.8 (v6.6) | 1.26× | kleiner = besser |
| Smell Total | **0.0** 🏆 | **0.0** 🏆 (v6.6) | 1.00× | kleiner = besser |
| Complexity Peak `cc_longest_function` | **15.6** 🏆 | 19.8 (v6.6) | 1.27× | kleiner = besser |
| `cc_avg_loc_per_function` | **8.66** 🏆 | 10.80 (v6.6) | 1.25× | kleiner = besser |
| `cost_usd` | **$0.57** 🏆 | $1.58 (v5.1) | 2.77× | kleiner = besser |

v6.6 is the closest any architecture comes to the baseline on this kata — it ties on Smell
Total and narrows every other gap that v6.1 opened — but it does not overtake the baseline on
any metric, and costs 4.1× as much ($2.35 against $0.57).

Against v6.1 — the previous default — the baseline gaps are wider: `cognitive_max` 2.15×,
`cognitive_avg` 2.64×, decomposition 1.84×, cost 3.82×.

Code Mass (APP) runs the other way: v6.1 produces the lowest value (125.8 against v3's
174.8). On this kata that ranking is an artefact of the metric, not a counter-result — v6.1
also has the *worst* decomposition in the field (`cc_avg_loc_per_function` 15.90, averaging
1.6 functions per run). It scores low on APP because it writes one long function, not because
it writes compact code. See F-1.9.

Rationale: game-of-life is small and training-known. The spec fits in one context, so there is
nothing for a TDD architecture to protect against — and the machinery it adds (phase splits,
refactor passes, subagent hand-offs) shows up as complexity in the artefact. v3's σ is also the
tightest in the field (`cognitive_max` σ 0.71 against v6.1's 5.73): the baseline is not just
better on the mean, it is more predictable.

Worth naming because it runs against the architecture's stated purpose: v6.1 is the cell with
the **isolated refactor subagent**, whose job is exactly the extraction that would lower these
numbers. On this kata it does not perform it — inspected runs leave a triply-nested loop and
the survival rule inlined as a filter expression, where the baseline names both. On opus-4-7
the same subagent does extract (F-1.10), so this is a model-architecture interaction, not a
property of v6.1.

This is the counter-case named in H4 and it holds for this kata. It does not generalise to
claim-office — see F-1.7.

---

## F-1.7 — On claim-office architecture buys flatness and smell-freedom, not decomposition

The katas differ. Where game-of-life shows the baseline ahead across the board (F-1.6),
claim-office splits: v6.6 wins the complexity peaks and the smell count decisively, v3 wins
decomposition and cost.

| Metric (claim-office) | v3 (baseline) | v5.1 | v6.1 | v6.6 | Faktor v6.6/v3 |
|---|---:|---:|---:|---:|---:|
| Correctness (external) | **100 %** 🏆 | **100 %** 🏆 | **100 %** 🏆 | **100 %** 🏆 | 1.00× |
| `cognitive_max` | 9.2 | 8.4 | 5.8 | **4.4** 🏆 | **0.48×** |
| `mccabe_max` | 8.2 | 8.2 | 6.0 | **5.8** 🏆 | **0.71×** |
| Smell Total | 6.8 | 12.4 | 15.2 | **0.0** 🏆 | **0.00×** |
| `cc_avg_loc_per_function` | **8.01** 🏆 | 10.48 | 10.72 | 11.05 | 1.38× |
| Complexity Peak `cc_longest_function` | 21.8 | 23.0 | 23.0 | **21.2** 🏆 | 0.97× |
| Code Mass (APP) | 678.8 | 524.6 | 446.4 | 466.8 | 0.69× |
| `cost_usd` | **$1.18** 🏆 | $1.72 | $9.52 | $7.25 | 6.14× |

**v6.6 is the quality optimum on this kata**, and by a wider margin than v6.1 was: it takes
`cognitive_max`, `mccabe_max`, `cc_longest_function` and Smell Total, the last one at 0.0
against v6.1's 15.2. The end-refactor phase is what separates it from v6.1, and on the
metrics the pipeline scores it works.

**v3 remains the practical finding.** It reaches the same 100 % Correctness (external) at
$1.18 against v6.6's $7.25 — a 6× cost difference for identical external correctness — with a
~15-line prompt carrying no agents, no skills and no phase structure, and it still leads on
decomposition (8.01 against 11.05).

What the architecture buys is the complexity peak and the smell count. That is real and it is
the largest quality effect in the RQ — bought at 6× the cost, while decomposition moves the
other way.

Rationale: the two metric groups disagree because they measure different things (F-1.9). The
refactor phases flatten individual functions and clear rule-based smells, which `cognitive_max`,
`mccabe_max` and Smell Total reward; they do not extract named concepts, which is what
decomposition tracks. The defensible claim is "v6.6 produces the flattest, smell-free
functions", not "v6.6 produces the better-structured code" — and manual inspection of the
median run supports exactly that distinction (F-1.11).

Caveat: this RQ has no no-TDD cell, so it cannot say what TDD itself buys — only what
*architecture on top of TDD* buys. See the RQ README, "Why there is no no-TDD baseline".

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

Decomposition and Code Mass (APP) rank the cells in opposite directions.

| Kata | v3 | v4.1 | v5.1 | v6.1 | v6.6 | Direction |
|---|---:|---:|---:|---:|---:|---|
| `cc_avg_loc_per_function` — claim-office | **8.01** 🏆 | 6.96 | 10.48 | 10.72 | 11.05 | kleiner = besser |
| `cc_avg_loc_per_function` — game-of-life | **8.66** 🏆 | 12.83 | 13.07 | 15.90 | 10.80 | kleiner = besser |
| Code Mass (APP) — claim-office | 678.8 | 646.8 | 524.6 | 446.4 | 466.8 | kleiner = besser |
| Code Mass (APP) — game-of-life | 174.8 | 146.8 | 141.0 | 125.8 | 135.8 | kleiner = besser |

On game-of-life the decomposition ordering is monotonic in architecture weight up to v6.1
(v3 → v4.1 → v5.1 → v6.1), and v6.6 breaks the trend — its end-refactor phase recovers
decomposition to 10.80, the best of the structured cells there. On claim-office v4.1 breaks the
ordering the other way, scoring best on this metric while being worst on `cognitive_max` and
`cc_longest_function`; v6.6 is last.

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

---

## F-1.10 — Architecture helps the model that does not iterate on its own, and hurts the one that does

The v3 → v6.1 step moves the two models in opposite directions on game-of-life. All four cells
reach Correctness (external) 100 %.

| Cell | n | `cognitive_max` | Smell Total | `cc_avg_loc_per_function` | Funktionen |
|---|---:|---:|---:|---:|---:|
| Sol v3 | 5 | **4.0** 🏆 | **0.0** 🏆 | 8.66 | 3.4 |
| Sol v6.1 | 5 | 8.6 | 2.8 | 15.90 | 1.6 |
| Opus v3 | 10 | 21.8 | 6.0 | 16.52 | 2.3 |
| Opus v6.1 | 10 | 6.5 | 2.4 | **6.56** 🏆 | 4.2 |

For Opus the architecture is a large gain (`cognitive_max` 21.8 → 6.5, a 3.4× improvement);
for Sol it is a loss (4.0 → 8.6, 2.2× worse). The best cell in the field is Sol *without* an
architecture; the worst is Opus without one.

**The mechanism is visible in the transcripts.** Reconstructing the tool-call order shows the
two models read the same v3 prompt ("complete the exercise autonomously using TDD")
differently:

| | Sol v3 | Opus v3 |
|---|---|---|
| Steps to solution | 19 | 4–12 (median 5) |
| Tests in the first spec write | 1 | 10–14 |
| Red-green cycles | 6 | 1 |
| Refactoring step | yes — Extract Method | none observed |

Every one of the 10 Opus v3 runs writes its entire test suite in one go, runs it once, writes
the entire implementation, runs it again. That is test-first, but it is not a TDD cycle. Sol
writes one test, watches it fail, returns `[]` as a first implementation, and iterates — and
after a green test extracts the triply-nested neighbour loop into a named `neighbors()`
function.

Rationale: v6.1's value is that it *imposes* the cycle — test list, red, green, isolated
refactor. Opus does not produce that rhythm on its own, so imposing it is worth 3.4× on the
complexity peak. Sol already produces it, so the same machinery adds phase overhead without
adding discipline — and the isolated refactor subagent, which on Opus performs the extraction,
does not perform it on Sol (F-1.6).

This reframes the architecture question: the axis does not measure "how good is this workflow"
but "how much of the cycle does the model supply by itself". A model that iterates unprompted
needs less scaffolding than the workflow line was designed around.

Caveats, both load-bearing:

- The Opus cells run on Claude Code, the Sol cells on pi. Harness and model are confounded
  here; this finding cannot separate them.
- The transcript reconstruction covers all 10 Opus v3 runs but only 1 of the 5 Sol v3 runs in
  full. Sol's cell-level consistency (`cognitive_max` σ 0.71, Smell Total 0 in all five) makes
  the pattern plausible for the rest, but it is not verified run by run.
- The Opus cells come from other RQs (`RQ-tdd-quality`, `RQ-context`) and were not produced
  under this RQ's controls.

---

## F-1.11 — None of the declared outcomes separates readable code from unreadable code

Manual inspection of four median runs (chosen by proximity to their cell mean on
`cc_avg_loc_per_function`) produced two judgements the metrics only partly reproduce.

| Judgement | Metric agreement |
|---|---|
| v3 is cut into better domain concepts than v6.6 — clearly on claim-office, marginally on game-of-life | partial: `cc_avg_loc_per_function` 8.01 vs. 11.05 (claim-office) and 8.66 vs. 10.80 (game-of-life) |
| All four implementations are poor code: deep nesting, `for` loops where higher-order functions belong | **none**: three of the four cells score `Smell Total` 0.0 and `cognitive_max` 4.4–5.6 |

The second row is the finding. Code that reads as poor scores as clean.

**Why the metrics miss it.** A representative fragment from a Sol/v6.6 run — nesting depth 3,
counting the optional chain and the nullish coalescing:

```ts
for (const [x, y] of currentLiveCells) {
  for (const [dx, dy] of NEIGHBOR_OFFSETS) {
    const entry = neighborCounts.get(cellKey([x + dx, y + dy]));
    neighborCounts.set(key, { cell, count: (entry?.count ?? 0) + 1 });
```

McCabe counts all four constructs (+4) but is blind to their arrangement — two sequential loops
score the same as two nested ones. Cognitive Complexity weights the nested loop (+2) but ignores
`?.` and `??` entirely, and resets at every function boundary. Neither penalises the imperative
form; `Smell Total` has no rule for it. The declared outcomes contain no metric that rises when
nesting deepens across a file.

**A contrast case shows what is missing.** `2026-05-30_22-05-46_game-of-life-example-mapping_v6.5-end-refactor_opus-4-8-no-thinking`
solves the same kata with `survives()`, `birthCandidates()`, `samePosition()`,
`countLiveNeighbors()` — 14 functions, three named constants, one loop against seven array
methods.

| | Sol v3 | Sol v6.6 | Opus v6.5 |
|---|---:|---:|---:|
| Production LoC | 34 | 32 | 53 |
| Functions | 9 | 3 | 14 |
| `cc_avg_loc_per_function` | 7.25 | 11.00 | **4.89** 🏆 |
| `cognitive_max` | 4 | 4 | **1** 🏆 |
| `mccabe_max` | 4 | 5 | **2** 🏆 |
| Smell Total | **0** 🏆 | **0** 🏆 | **0** 🏆 |
| `for` loops : array methods | 2 : 7 | 2 : 3 | **1 : 7** 🏆 |

Its nesting is barely flatter — `unique()` still holds a loop — but naming and cut are in a
different class. The metrics that track it are `cc_avg_loc_per_function` and `cognitive_max`;
`Smell Total` reports zero for all three and separates nothing.

Rationale: the readable difference decomposes into three properties with very different
measurability. **Cut** is covered by `cc_avg_loc_per_function` (F-1.9). **Declarative style** is
measurable but unmeasured — the loop-to-array-method ratio in the last row is computed by hand
here, not by the pipeline. **Naming** has no proxy at all: identifier length rewards
`processDataHelper2`, prompt-vocabulary overlap rewards copying, and `cc_avg_loc_per_function`
scores a function sawn into `step1`…`step10` well (its stated limit in the RQ README).

Consequence: this RQ's quality rankings hold only inside what the metrics see. "v6.6 has zero
smells and the lowest `cognitive_max` on claim-office" is true and does not establish that its
code is good. A rank claim about *readability* would need either a style metric added to the
pipeline or a rubric-based judgement — recorded as an open question in `todos_and_ideas.txt`,
deliberately not decided inside this RQ.

Caveats:

- Four inspected runs, one per cell of the two compared workflows. The judgement is a spot check
  on the median run, not a survey.
- The contrast run is **v6.5 on opus-4-8-no-thinking under Claude Code** — a different workflow,
  model and harness than any cell in this RQ, and not produced under its controls. It serves as
  an existence proof that the kata admits a well-cut solution, and supports no claim that v6.5
  beats v6.6.
- The loop-to-array-method ratio is a hand count over one file per cell, not a pipeline metric.
