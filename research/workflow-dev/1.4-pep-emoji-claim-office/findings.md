# RQ-pep-emoji-claim-office — Findings

_Does the interaction finding from RQ-pep-emoji-v6.1 also hold on claim-office?_

## Overview (primary outcome **Correctness (external)** — higher = better)

| Workflow | n | `verification_pct` mean | min | std | `tests_passing` |
|---|---:|---:|---:|---:|---:|
| v6.1-hybrid (pep+emoji) | 5 | **1.00** 🏆 | 1.00 | 0.00 | **100%** 🏆 |
| exact-hybrid-v2.1-no-pep-cc | 5 | 0.97 | 0.87 | 0.06 | **100%** 🏆 |
| exact-hybrid-v2.2-no-emoji-cc | 5 | 0.80 | 0.00 | 0.45 | 80% |
| exact-hybrid-v2.3-no-pep-no-emoji-cc | 5 | 0.95 | 0.73 | 0.12 | **100%** 🏆 |

Only v6.1-hybrid delivers perfect correctness (5/5 × 100%, std=0). All reductions lose — moderately (no-pep -3pp, combined -5pp) to catastrophically (no-emoji -20pp because of one complete failure).

---

## F-1.1 — Pep and emoji reduction break the correctness guarantee on claim-office

**Statement:** On the `claim-office` kata (complex, genuine ambiguities in the HPSMV rule set), **v6.1-hybrid is the only workflow with reproducibly perfect correctness**. All three reductions show correctness losses, with different failure modes:

| Workflow | `verification_pct` mean | Pattern |
|---|---:|---|
| v6.1-hybrid | **1.00** 🏆 (std 0.00) | consistently perfect |
| exact-hybrid-v2.1-no-pep-cc | 0.97 (std 0.06) | consistent slight drift (87%–100%) |
| exact-hybrid-v2.2-no-emoji-cc | 0.80 (std 0.45) | 4/5 perfect + **1 complete failure** (0/15, agent stopped after the test list) |
| exact-hybrid-v2.3-no-pep-no-emoji-cc | 0.95 (std 0.12) | wider spread (73%–100%) |

**Rationale:** the single 0/15 run in exact-hybrid-v2.2-no-emoji-cc is not a random outlier but a qualitative failure: the agent created the 92-line `claim-office.spec.ts` and ended the run without starting the Red phase — `experiment-done.txt` missing, no implementation file. A plausible reading: on a complex multi-section spec, the ✅/❌/🚨 markers in the skill templates serve as "look at me, that's the next step" anchors. Without them the agent occasionally loses the connection between the test list and Red phase. On the training-known game-of-life kata this failure mode did not occur — the agent knows the pattern without markers.

exact-hybrid-v2.1-no-pep-cc loses more mildly and continuously; exact-hybrid-v2.3-no-pep-no-emoji-cc sits in between. Hypothesis H1 (correctness invariant) is thus **clearly refuted**.

---

## F-1.2 — Discipline interaction inverts vs. game-of-life

**Statement:** The discipline pattern observed on game-of-life ([RQ-pep-emoji-v6.1](../1.3-pep-emoji-combined-v6.1/findings.md) F-1.1: no-pep refactors more than hybrid, combined refactors below the baseline) **inverts completely on claim-office**. On the complex kata v6.1-hybrid refactors the most, and all reductions cut the iterations short.

| Metric | game-of-life (RQ-1.3) | claim-office (here) |
|---|---|---|
| `refactorings_applied` winner | no-pep (7.0) > hybrid (4.1) | **hybrid (11.6)** 🏆 > no-pep (6.6) |
| `refactorings_applied` (combined) | 3.8 (below baseline) | 9.8 (between the reductions) |
| `tests_passed_immediately` winner | **no-pep (1.2)** 🏆 | **no-pep (8.2)** 🏆 |
| `tests_passed_immediately` (combined) | 1.2 (= no-pep, saturated) | 13.8 (higher than baseline 13.4) |

**Rationale:** the game-of-life reading "less scaffolding → stricter process" is kata-specific. On claim-office with genuine ambiguities the inverse pattern is active: the pep talks and emoji markers supply re-orientation anchors that the agent needs for the longer iteration sequence (claim-office: cycle_count median 22-30 vs game-of-life 9). Without them the agent cuts the refactor phases short, which shows up in the correctness regression from F-1.1. Hypothesis H3 (stable pattern) **refuted**, H4 (kata-specific) **confirmed**.

---

## F-1.3 — Recipe recommendation for complex katas: keep v6.1-hybrid

**Statement:** The game-of-life-based recommendation "exact-hybrid-v2.1-no-pep-cc best choice for code quality research" or "exact-hybrid-v2.3-no-pep-no-emoji-cc for speed" does **not hold for complex katas with genuine ambiguities**. On claim-office **v6.1-hybrid (with pep+emoji) is the only correctness-safe choice**.

| Use case | Recommendation | Rationale |
|---|---|---|
| game-of-life / training-known katas | exact-hybrid-v2.1-no-pep-cc | code quality slightly better, more refactor activity, correctness invariant |
| claim-office / complex katas with ambiguities | **v6.1-hybrid** | only variant with 100/100 correctness; reductions lose systematically |
| speed-critical (accepts -5pp correctness) | exact-hybrid-v2.3-no-pep-no-emoji-cc | only if the correctness drift is known and accepted |

**Rationale:** this is the central consequence of F-1.1 and F-1.2. Decoration markers and pep talks are redundant on training-known code, but functionally necessary on new complex code. The reduction recipe ([`v6-reduction-recipe.md`](../v6-reduction-recipe.md)) has to be extended by this kata complexity dimension before reductions are adopted as a general recommendation.

---

## Hypothesis status

| Hypothesis | Status | Evidence |
|---|---|---|
| **H1** Correctness invariant | refuted | hybrid 1.00 vs no-emoji 0.80 (-20pp), no-pep 0.97 (-3pp), combined 0.95 (-5pp) |
| **H2** no-pep-no-emoji regression ≥10pp | not confirmed | combined only -5pp; but no-emoji alone -20pp |
| **H3** Discipline pattern stable across katas | refuted | the `refactorings_applied` winner flips from no-pep (GoL) to hybrid (claim-office) |
| **H4** Discipline pattern kata-specific | confirmed | see F-1.2 |
| **H5** Code quality indistinguishable | confirmed | large spreads, no consistent trends; no-pep-no-emoji best on smell_total (0.6) |

**Caveat on n=5:** the catastrophic 0/15 failure in exact-hybrid-v2.2-no-emoji-cc dominates the statistics. At n=10+ it would become clear whether this is a 20% failure rate pattern or a 5% outlier. For the recipe recommendation in F-1.3, though, the **existence** of the failure mode is decisive, not its exact frequency — a reduction that sometimes aborts completely is not acceptable as a default workflow.
