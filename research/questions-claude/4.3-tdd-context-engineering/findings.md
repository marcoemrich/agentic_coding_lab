# RQ-context Findings

Kata: `claim-office-example-mapping` (novel). Model: `opus-4-7-no-thinking` (Portkey OR direct, OR-match). 4 context architectures with the same test-list discipline: subagents-v2 (all 4 phases as isolated subagents), single-context-v2 (all 4 phases as skills in the shared context), hybrid-v2 (red/green skill, refactor isolated), green-refactor-v2 (test list/red skill, green and refactor isolated). n=21 runs.

## Overview — Code Quality, Correctness, Cost

🏆 = best value per column. Directions: `cognitive_max`/`mccabe_max`/`cc_longest_function`/`smell_total`/`code_mass`/`cc_loc`/`duration_seconds`/`total_tokens` lower = better; `verification_pct` higher = better. Where spreads are smaller than 1 σ, 🏆 is distributed across all nearby values.

| Workflow | n | `cognitive_max` | `mccabe_max` | `cc_longest_function` | `smell_total` | `code_mass` | `cc_loc` | `verification_pct` | `duration_seconds` | `total_tokens` |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| subagents-v2 (all isolated) | 5 | 26.8 ± 24.1 | 16.0 ± 9.0 | 40.8 ± 27.1 | 13.2 ± 7.5 | **621.6 ± 65.6** 🏆 | **156.8 ± 38.0** 🏆 | 0.96 ± 0.09 | 3 229 ± 920 | 34.87 M ± 6.07 |
| single-context-v2 (all shared) | 6 | 14.8 ± 4.2 | 10.2 ± 2.6 | 32.7 ± 10.2 | 6.8 ± 7.6 | 692.7 ± 78.8 | 167.2 ± 27.9 | **1.00 ± 0** 🏆 | **641 ± 122** 🏆 | **18.73 M ± 5.35** 🏆 |
| hybrid-v2 (refactor isolated) | 7 | **5.71 ± 2.87** 🏆 | **5.71 ± 2.36** 🏆 | **18.1 ± 5.1** 🏆 | **1.29 ± 1.50** 🏆 | 861.3 ± 74.5 | 191.1 ± 20.3 | **1.00 ± 0** 🏆 | 1 569 ± 519 | 37.88 M ± 13.45 |
| green-refactor-v2 (green + refactor isolated) | 3 | **5.00 ± 1.00** 🏆 | **4.67 ± 0.58** 🏆 | **19.3 ± 2.5** 🏆 | **2.33 ± 2.31** 🏆 | 801 ± 3.6 | 187.3 ± 29.2 | 0.98 ± 0.04 | 1 970 ± 715 | 35.74 M ± 10.51 |

`tests_passing` and `completed_within_budget` are 100 % in all four cells. `mutation_score` was not collected for this RQ.

Token figures count subagent consumption. Until 2026-09-30 they did not, and this RQ was the one most distorted by that: subagents-v2 isolates all four phases, so it was understated by 147 % and held the token trophy at 14.10 M while actually being the second most expensive arm. See
[RQ-old-vs-new-exact-line-opus55 F-4.12.5](../4.12-old-vs-new-exact-line-opus55/findings.md).

On `cc_longest_function` the subagents-v2 cell has a σ of 27.1, wide enough that its 40.8 would formally tie with hybrid-v2's 18.1 under the spread rule. It carries no trophy because that width is its own instability, not agreement with the hybrids — its five runs range from the field's best to far past its worst.

## F-context.1 — The Refactor Subagent Delivers the Complexity Advantage; Additional Green Isolation Does Not Change the Picture

hybrid-v2 and green-refactor-v2 — both with an isolated refactor subagent, green-refactor-v2 additionally with an isolated green subagent — reach practically identical complexity peaks: `cognitive_max` 5.71 / 5.00, `mccabe_max` 5.71 / 4.67, `cc_longest_function` 18.1 / 19.3, `smell_total` 1.29 / 2.33. All pairwise differences lie within their σ. single-context-v2 (all phases shared) is clearly above (cognitive_max 14.8, mccabe_max 10.2), subagents-v2 (all isolated) is the worst and has the largest spread (σ cognitive_max=24.1).

The plausible reading is sharpened by green-refactor-v2: the architecture advantage arises exclusively from the **isolated refactor subagent**, the shared element of hybrid-v2 and green-refactor-v2. Additionally isolating the green phase (green-refactor-v2) brings no further complexity lift. When all four phases run isolated (subagents-v2), this hurts on claim-office — the isolated subagents have to reconstruct the overall architecture again and again without context and accumulate structural complexity over the 44.6 cycles (F-context.4) that no single phase sees as a whole.

**H1 confirmed** in the hybrid reading (refactor isolation lowers complexity), but **the pairwise hypothesis "subagents-v2 < single-context-v2 on complexity" is falsified** — on claim-office, subagents-v2 is even worse than single-context-v2 in all four peak metrics.

**H4 (stability)**: green-refactor-v2 is the most stable cell (σ code_mass=3.6, σ mccabe_max=0.58, σ cognitive_max=1.0). hybrid-v2 is the second most stable on the complexity peaks, subagents-v2 by far the least stable. The original expectation (subagents-v2 most stable) is clearly **falsified**.

## F-context.2 — The Refactor Subagent Distributes Functionality Across More Building Blocks; Green Isolation Slows the More-Code Effect

subagents-v2 writes the least code (Code Mass (APP) 621.6), hybrid-v2 the most (861.3, +39 % compared to subagents-v2). At 801, green-refactor-v2 lies between single-context-v2 (692.7) and hybrid-v2 — the isolated green subagent keeps the code volume lower than hybrid-v2, presumably because it lacks the accumulated test-list discussion that in hybrid-v2 motivates additional helper structures.

Despite the differences in code quantity, hybrid-v2 and green-refactor-v2 have similarly few smells (1.29 / 2.33) — the structural cleanliness comes from the refactor subagent, not from the code volume. subagents-v2 with 13.2 smells at Code Mass (APP) 621.6 is dense and heavily structured; hybrid-v2 with 1.29 smells at 861.3 is distributed and clean.

The finding is consistent with the refactor-subagent mechanic: a fresh refactor context that sees the accumulated implementation as a whole (the code state plus optionally the red/green history in hybrid-v2) can extract and split in a targeted way. subagents-v2's isolated refactor sees only the respective current code state without the context of how it came about and tends toward local cleanup instead of structural rebuilding.

## F-context.3 — Correctness Does Not Distinguish the Architectures

single-context-v2 and hybrid-v2 reach 1.00 verification_pct (15/15 in every run, σ=0). subagents-v2 reaches 0.96 with one outlier at 0.8 (12/15), green-refactor-v2 reaches 0.98 with one run at 14/15. All four architectures are highly correct; it is notable that the two architectures with green as an isolated step (subagents-v2, green-refactor-v2) each carry one outlier, while the two architectures with green in the shared context (single-context-v2, hybrid-v2) are perfect.

**H2 confirmed**: the context-architecture effect shows up in code quality and cost, not substantially in external correctness. The test-list-scope-fix dominates over the architecture.

## F-context.4 — Four Very Different Cost Profiles

| Metric (lower = better, except where marked) | subagents-v2 | single-context-v2 | hybrid-v2 | green-refactor-v2 |
|---|---:|---:|---:|---:|
| `duration_seconds` (mean) | 3 229 (~54 min) | **641 (~11 min)** 🏆 | 1 569 (~26 min) | 1 970 (~33 min) |
| `total_tokens` (mean)     | 34.87 M | **18.73 M** 🏆 | 37.88 M | 35.74 M |
| `cycle_count` (mean)      | 44.6 | 5.5 | 24.7 | 18.3 |
| `refactorings_applied`    | 6.8 | 2.2 | 10.7 | 14.0 |

single-context-v2 is 5× faster than subagents-v2 and 3× faster than green-refactor-v2 — the single context without subagent spawns dominates the wallclock rating. **It is also the cheapest arm on tokens by a wide margin**, at roughly half of every arm that isolates a phase: 18.73 M against 34.87–37.88 M, a gap larger than any of the three standard deviations involved.

The three isolating arms are a token tie among themselves (34.87 / 35.74 / 37.88 M, every pairwise gap inside its σ), so the axis that separates is *whether* a phase is isolated, not *which* one or how many. Isolation costs roughly 16–19 M tokens on this kata regardless of where it is applied.

This replaces the earlier reading, which had subagents-v2 as the cheapest arm and explained it by isolated contexts growing linearly against an accumulating shared one. That ordering was an artefact of subagent tokens being absent from the figure; the arm that isolates all four phases was the one it understated most. The accumulating shared context is in fact the cheaper mechanism here — it re-reads a growing history, but a cache read is an order of magnitude cheaper than building a fresh context per phase.

The `cycle_count` spread shows four qualitatively different working modes: single-context-v2 with only 5.5 cycles and 1.7 immediately green tests works in coarse steps; subagents-v2 with 44.6 cycles and 22.2 immediately green tests decomposes very finely and often produces pre-implementation in red; hybrid-v2 (24.7 cycles) and green-refactor-v2 (18.3 cycles) lie in between, with the highest refactor rate of all workflows (green-refactor-v2 14.0/run, hybrid-v2 10.7/run vs. subagents-v2 6.8 and single-context-v2 2.2) — the isolated refactor subagents visibly "work" more.

**H3 (subagents-v2 < single-context-v2 < hybrid-v2 tokens) is falsified.** The measured ordering is single-context-v2 (18.73 M) < subagents-v2 (34.87 M) ≈ green-refactor-v2 (35.74 M) ≈ hybrid-v2 (37.88 M), with the last three indistinguishable. The hypothesis had the shared-context arm in the middle and the fully isolated one cheapest; both halves are wrong.

**H5 (wallclock ordering single-context-v2 < hybrids < subagents-v2) confirmed** — green-refactor-v2 (1 970s) between hybrid-v2 (1 569s) and subagents-v2 (3 229s), closer to hybrid-v2 than to subagents-v2.

## F-context.5 — Two Hybrid Positions with Similar Code Quality, Different Cost Profiles

On the code-quality dimension, hybrid-v2 and green-refactor-v2 are practically level (all 4 peak metrics within 1 σ; 4 🏆 each in the overview). hybrid-v2 is marginally cleaner on `smell_total`; green-refactor-v2 in return has a **lower Code Mass (APP)** (801 vs. 861) and the **smallest spread** across all metrics. Tokens no longer separate the two (35.74 vs. 37.88 M, inside σ), and wallclock runs the other way: hybrid-v2 ~26 min, green-refactor-v2 ~33 min.

There is no Pareto winner: subagents-v2 dominates on code compactness, single-context-v2 on wallclock, tokens and (narrowly) correctness, hybrid-v2/green-refactor-v2 on the code-quality peaks. For an application profile focused on structural code quality, either hybrid is the choice, and they are close enough on every axis but wallclock that the pick is between ~26 and ~33 minutes rather than between two profiles.

Under this claim-office evidence, **subagents-v2 has no use case at all**: the lowest Code Mass (APP), but the worst values on every quality peak, the highest spread, the slowest wallclock, and no token advantage to set against any of it. The token advantage was the one argument in its favour and it does not exist.

## Cross-RQ Reference

The findings of this RQ refine the context-engineering effect on claim-office relative to the finding on game-of-life in [RQ-tdd-quality F-tdd-quality.3](../4.1-tdd-effect-code-quality/findings.md):

- On game-of-life (RQ-tdd-quality, 2-point comparison): subagents-v2 had the lowest complexity peaks, single-context-v2 lost this advantage. hybrid-v2 also had low peaks there (cognitive_max 7.7).
- On claim-office (this RQ, 4-point comparison): hybrid-v2 and green-refactor-v2 dominate on a par, single-context-v2 second best, subagents-v2 loses clearly.

On the simpler, training-known kata, full phase isolation suffices; on the more complex, novel kata, phase isolation becomes counterproductive and only refactor isolation contributes to structural quality. Cross-kata replication on a third kata (e.g. mars-rover) remains open in order to separate the two readings ("kata complexity" vs. "kata familiarity").
