# Findings — RQ-old-vs-new-exact-line-opus55

All figures: `claim-office-example-mapping` × `opus-5-5-no-thinking` (native
subscription route) × Claude Code 2.1.280, n=5 per cell. Token and price columns
include subagent consumption; `total_tokens` has meant the whole run since
2026-09-30, so the two isolated arms are no longer read short.

Two lines, each in a shared-context and an isolated-Refactor variant:

| | shared context | Refactor isolated in a subagent |
|---|---|---|
| **maintained** (SOL-derived Predictive TDD) | `exact-ptdd-v1-cc` | `exact-ptdd-v1.1-refactor-subagent-cc` |
| **retired** (Opus line) | `exact-single-context-v3-no-subagent-cc` | `exact-hybrid-v2-testlist-fix-cc` |

## Overview

Decomposition is the axis on which the two lines separated on Opus 5
(RQ-current-ptdd-vs-exact-opus-native F-4.9.1). On TypeScript `cc_longest_function`
and `unit_size_max` are the same measure, as are `cc_avg_loc_per_function` and
`unit_size_avg`; only one of each pair is tabled.

| Metric | `ptdd-v1` | `ptdd-v1.1` +Sub | `hybrid-v2` +Sub | `single-context-v3` |
|---|---:|---:|---:|---:|
| **Correctness (external)** — higher = better | **1.00 ± 0.00** 🏆 | 0.96 ± 0.09 | 0.96 ± 0.09 | **1.00 ± 0.00** 🏆 |
| perfect runs | **5/5** 🏆 | 4/5 | 4/5 | **5/5** 🏆 |
| Correctness (internal) | 5/5 | 5/5 | 5/5 | 5/5 |
| `completed_within_budget` | 5/5 | 5/5 | 5/5 | 5/5 |
| `cc_avg_loc_per_function` — lower = better | 4.81 ± 0.62 | 4.46 ± 0.40 | **2.92 ± 0.46** 🏆 | 3.74 ± 0.68 |
| `cc_median_loc_per_function` — lower = better | 3.80 ± 1.10 | 3.30 ± 0.67 | **2.00 ± 0.00** 🏆 | 2.40 ± 0.89 |
| `cc_longest_function` — lower = better | **13.00 ± 1.58** 🏆 | 14.20 ± 2.17 | **11.00 ± 4.36** 🏆 | **13.00 ± 2.45** 🏆 |
| `unit_count` — higher = better | 22.80 ± 2.77 | **34.40 ± 9.86** 🏆 | **26.80 ± 3.19** 🏆 | 24.60 ± 6.19 |
| `cognitive_max` — lower = better | **2.40 ± 0.55** 🏆 | **2.00 ± 0.00** 🏆 | **2.40 ± 0.89** 🏆 | 4.00 ± 2.83 |
| `cognitive_avg` — lower = better | 1.43 ± 0.21 | **1.23 ± 0.12** 🏆 | **1.25 ± 0.17** 🏆 | 1.62 ± 0.42 |
| `mccabe_max` — lower = better | **3.40 ± 0.55** 🏆 | **3.00 ± 0.00** 🏆 | **3.20 ± 0.45** 🏆 | 4.20 ± 1.79 |
| `mccabe_avg` — lower = better | 1.44 ± 0.05 | **1.39 ± 0.08** 🏆 | **1.37 ± 0.07** 🏆 | 1.46 ± 0.14 |
| **Smell Total** — lower = better | **0.00 ± 0.00** 🏆 | **0.00 ± 0.00** 🏆 | 0.80 ± 0.45 | 0.40 ± 0.55 |
| **Production LoC** | 222 ± 24 | 310 ± 61 | 223 ± 44 | 182 ± 25 |
| **Test LoC** | 277 ± 38 | 259 ± 29 | 313 ± 27 | 226 ± 19 |
| **Code Mass (APP)** — lower = better | **632 ± 36** 🏆 | **655 ± 57** 🏆 | 742 ± 62 | 714 ± 47 |
| **Mutation Score** — higher = better | 0.94 ± 0.05 | 0.95 ± 0.03 | **0.98 ± 0.02** 🏆 | **0.96 ± 0.02** 🏆 |
| `mutants_total` | 124.0 ± 4.9 | 135.2 ± 10.9 | 121.0 ± 3.7 | 121.4 ± 3.9 |
| `mutants_survived` — lower = better | 7.8 ± 6.3 | 6.4 ± 3.9 | **2.2 ± 2.2** 🏆 | **4.4 ± 2.9** 🏆 |
| `duration_seconds` — lower = better | **922 ± 80** 🏆 | 2664 ± 433 | 1117 ± 138 | **954 ± 173** 🏆 |
| `total_tokens` — lower = better | **24.4 M ± 1.8 M** 🏆 | 55.3 M ± 7.6 M | 51.0 M ± 5.2 M | 102.6 M ± 23.5 M |
| `cost_usd` — lower = better | **9.79 ± 0.49** 🏆 | 28.34 ± 3.30 | 18.35 ± 2.18 | 27.86 ± 5.94 |

> Every cell is at `verification_pct` ≥ 0.96 and within budget in 5/5 runs, so
> correctness-gating excludes nobody. Multiple trophies in a row mark values whose
> σ bands overlap, not a fabricated tie.
>
> **`Production LoC` and `Test LoC` carry no trophy** — less code is not better
> per se, and the row that matters for parsimony is Code Mass (APP).
>
> `cost_usd` is a list-price comparison value, not an invoice: these runs went
> over the native subscription route. Tariffs in `research/model-pricing.md`.

---

## F-4.12.1 — Finer decomposition is a property of the retired line, and it does not come from its subagent

The retired line decomposes more finely than the maintained one in both of its
variants, isolated and shared alike.

| | `cc_avg_loc_per_function` | `cc_median_loc_per_function` | line |
|---|---:|---:|---|
| `exact-hybrid-v2-testlist-fix-cc` | 2.92 ± 0.46 | 2.00 ± 0.00 | retired, isolated |
| `exact-single-context-v3-no-subagent-cc` | 3.74 ± 0.68 | 2.40 ± 0.89 | retired, shared |
| `exact-ptdd-v1.1-refactor-subagent-cc` | 4.46 ± 0.40 | 3.30 ± 0.67 | maintained, isolated |
| `exact-ptdd-v1-cc` | 4.81 ± 0.62 | 3.80 ± 1.10 | maintained, shared |

Both retired cells sit below both maintained cells on both measures, so the
property belongs to the line and not to the Refactor architecture. H1 confirmed
on Opus 5.5: the answer from Opus 5 carries over.

**It does not translate into a lower `cognitive_max` or `mccabe_max` on its own.**
`exact-single-context-v3-no-subagent-cc` holds the second-finest decomposition
and simultaneously the worst `cognitive_max` of the field at 4.00 ± 2.83 and the
worst `mccabe_max` at 4.20 ± 1.79 — the two widest σ values measured here. Fine
average decomposition and a controlled worst case are different properties, and
in the retired line only the isolated variant delivers both (2.92 and 2.40).

The suite follows the retired line too, which the decomposition rows do not
predict: `exact-hybrid-v2-testlist-fix-cc` has the strongest Mutation Score at
0.98 ± 0.02 and lets only 2.2 ± 2.2 mutants survive, against 7.8 and 6.4 in the
maintained cells. Read the pair, not the ratio — the mutant populations are
within 15 of each other (121.0 to 135.2), so the survivor counts compare
directly.

---

## F-4.12.2 — Isolating the Refactor step has opposite signs on cost and the same sign on quality

Holding the line constant and varying only the Refactor architecture:

| | shared → isolated | `total_tokens` | `cost_usd` | `duration_seconds` |
|---|---|---:|---:|---:|
| maintained PTDD line | `ptdd-v1` → `ptdd-v1.1` | 24.4 M → 55.3 M (**+127 %**) | 9.79 → 28.34 (**+189 %**) | 922 → 2664 (**+189 %**) |
| retired Opus line | `single-context-v3` → `hybrid-v2` | 102.6 M → 51.0 M (**−50 %**) | 27.86 → 18.35 (**−34 %**) | 954 → 1117 (+17 %) |

Every one of those six movements except the retired line's wallclock increase
(954 ± 173 → 1117 ± 138) is larger than the standard deviations involved. H3
confirmed: the subagent decision cannot be stated as a workflow-independent rule.

The mechanism is visible in the token counts rather than in the quality columns.
A shared-context Refactor step re-reads the whole conversation on every cycle; an
isolated one starts from a fresh, small context and returns a diff. In the
retired line, whose shared-context variant burns 102.6 M tokens, that saves far
more than the isolation costs. In the maintained line, whose shared context is
already compact at 24.4 M, it does not.

**On quality the two lines move the same way.** Isolating the step lowers
`cognitive_max` in both: 2.40 → 2.00 in the maintained line and 4.00 → 2.40 in the retired one, and
`mccabe_max` likewise (3.40 → 3.00 and 4.20 → 3.20). The effect is far larger in
the retired line, and it is the only place where it clears the σ bands. So the
architecture is not quality-neutral — it is cost-ambiguous.

The practical consequence: in the retired line the isolated arm is the one to
take — it halves the tokens, cuts a third of the price and tightens the
complexity profile for a 17 % wallclock penalty. In the maintained line it buys
`cognitive_max` 2.00 ± 0.00 — deterministic across all five runs — for 2.9× the
price, and costs one of five perfect runs on top.

---

## F-4.12.3 — The retired line costs 1.9× the maintained line

Comparing each line's cheapest viable variant:

| | `cost_usd` | `total_tokens` | `duration_seconds` |
|---|---:|---:|---:|
| maintained, shared (`ptdd-v1`) | 9.79 ± 0.49 | 24.4 M ± 1.8 M | 922 ± 80 |
| retired, isolated (`hybrid-v2`) | 18.35 ± 2.18 | 51.0 M ± 5.2 M | 1117 ± 138 |
| factor | **1.9×** | **2.1×** | 1.2× |

The retired line's finer decomposition (F-4.12.1) costs roughly twice the price
and twice the tokens for a 21 % wallclock premium. Both cells are above the
correctness gate and neither has a budget problem.

The comparison is only fair in this pairing. Against the maintained line's
isolated arm the retired line is *cheaper* ($18.35 against $28.34), and against
the retired line's shared arm it is cheaper still ($18.35 against $27.86) — the
architecture choice moves price more than the line does. The headline factor
therefore belongs to the two cheapest-viable variants and should not be quoted as
"the retired line costs 2× more" without that qualifier.

---

## F-4.12.4 — The retired line without its subagent burns the most tokens and is the least stable cell measured

`exact-single-context-v3-no-subagent-cc` is the only cell in this RQ that is
worse than its sibling on every axis that separates at all.

| | value | rank in field |
|---|---:|---|
| `total_tokens` | 102.6 M ± 23.5 M | highest, 1.9× the next cell |
| `cost_usd` | 27.86 ± 5.94 | second highest |
| `cognitive_max` | 4.00 ± 2.83 | worst, and the widest σ in the field |
| `mccabe_max` | 4.20 ± 1.79 | worst, second-widest σ |
| `cognitive_avg` | 1.62 ± 0.42 | worst |
| `mccabe_avg` | 1.46 ± 0.14 | worst |
| `cc_avg_loc_per_function` | 3.74 ± 0.68 | second best |
| **Production LoC** | 182 ± 25 | lowest |

It writes the least production code of the field and still spends the most
tokens on it — 102.6 M against 24.4 M for the maintained shared-context arm,
which produces 222 lines. The shared Refactor step re-reading the full
conversation on every cycle is the mechanism F-4.12.2 identifies, and this cell
is where it costs most.

The instability is the part that matters for a recommendation. `cognitive_max`
σ 2.83 on a mean of 4.00 means individual runs land anywhere from a clean 2 to a
7; `exact-hybrid-v2-testlist-fix-cc`, the same line with the step isolated, holds
2.40 ± 0.89. A workflow whose worst-case complexity is a coin flip is not usable
as a default even where its average decomposition looks good.

Correctness is unaffected — 5/5 perfect, the joint best in the field with
`exact-ptdd-v1-cc` — so nothing here is a capability statement. It is a cost and
variance statement.
