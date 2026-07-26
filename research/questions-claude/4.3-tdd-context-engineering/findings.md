# RQ-context Findings

Kata: `claim-office-example-mapping` (novel). Model: `opus-4-7-no-thinking` (Portkey OR direct, OR-match). 4 context architectures with the same test-list discipline: v4.1 (all 4 phases as isolated subagents), v5.1 (all 4 phases as skills in the shared context), v6.1 (red/green skill, refactor isolated), v7.1 (test list/red skill, green and refactor isolated). n=17 runs.

## Overview — Code Quality, Correctness, Cost

🏆 = best value per column. Directions: `cognitive_max`/`mccabe_max`/`cc_longest_function`/`smell_total`/`code_mass`/`cc_loc`/`duration_seconds`/`total_tokens` lower = better; `verification_pct` higher = better. Where spreads are smaller than 1 σ, 🏆 is distributed across all nearby values.

| Workflow | n | `cognitive_max` | `mccabe_max` | `cc_longest_function` | `smell_total` | `code_mass` | `cc_loc` | `verification_pct` | `duration_seconds` | `total_tokens` |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| v4.1 (all isolated) | 5 | 26.8 ± 24.1 | 16.0 ± 9.0 | 40.8 ± 27.1 | 13.2 ± 7.5 | **621.6 ± 65.6** 🏆 | **156.8 ± 38.0** 🏆 | 0.96 ± 0.09 | 3 229 ± 920 | **14.10 M ± 2.99** 🏆 |
| v5.1 (all shared) | 6 | 14.8 ± 4.2 | 10.2 ± 2.6 | 32.7 ± 10.2 | 6.8 ± 7.6 | 692.7 ± 78.8 | 167.2 ± 27.9 | **1.00 ± 0** 🏆 | **641 ± 122** 🏆 | 18.73 M ± 5.35 |
| v6.1 (refactor isolated) | 3 | **4.3 ± 1.5** 🏆 | **5.0 ± 1.7** 🏆 | **16.7 ± 6.7** 🏆 | **1.3 ± 1.2** 🏆 | 920.7 ± 55.2 | 184.3 ± 4.9 | **1.00 ± 0** 🏆 | 1 424 ± 781 | 30.16 M ± 18.56 |
| v7.1 (green + refactor isolated) | 3 | **5.0 ± 1.0** 🏆 | **4.67 ± 0.58** 🏆 | **19.3 ± 2.5** 🏆 | **2.3 ± 2.3** 🏆 | 801 ± 3.6 | 187.3 ± 29.2 | 0.98 ± 0.04 | 1 970 ± 715 | 26.11 M ± 6.20 |

`tests_passing` and `completed_within_budget` are 100 % in all four cells. `mutation_score` was not collected for this RQ.

## F-context.1 — The Refactor Subagent Delivers the Complexity Advantage; Additional Green Isolation Does Not Change the Picture

v6.1 and v7.1 — both with an isolated refactor subagent, v7.1 additionally with an isolated green subagent — reach practically identical complexity peaks: `cognitive_max` 4.3 / 5.0, `mccabe_max` 5.0 / 4.67, `cc_longest_function` 16.7 / 19.3, `smell_total` 1.3 / 2.3. All pairwise differences lie within their σ. v5.1 (all phases shared) is clearly above (cognitive_max 14.8, mccabe_max 10.2), v4.1 (all isolated) is the worst and has the largest spread (σ cognitive_max=24.1).

The plausible reading is sharpened by v7.1: the architecture advantage arises exclusively from the **isolated refactor subagent**, the shared element of v6.1 and v7.1. Additionally isolating the green phase (v7.1) brings no further complexity lift. When all four phases run isolated (v4.1), this hurts on claim-office — the isolated subagents have to reconstruct the overall architecture again and again without context and accumulate structural complexity over the 44.6 cycles (F-context.4) that no single phase sees as a whole.

**H1 confirmed** in the hybrid reading (refactor isolation lowers complexity), but **the pairwise hypothesis "v4.1 < v5.1 on complexity" is falsified** — on claim-office, v4.1 is even worse than v5.1 in all four peak metrics.

**H4 (stability)**: v7.1 is the most stable cell (σ code_mass=3.6, σ mccabe_max=0.58, σ cognitive_max=1.0). v6.1 is the second most stable on the complexity peaks, v4.1 by far the least stable. The original expectation (v4.1 most stable) is clearly **falsified**.

## F-context.2 — The Refactor Subagent Distributes Functionality Across More Building Blocks; Green Isolation Slows the More-Code Effect

v4.1 writes the least code (621.6 LOC), v6.1 the most (920.7 LOC, +48 % compared to v4.1). At 801 LOC, v7.1 lies between v5.1 (692.7) and v6.1 — the isolated green subagent keeps the code volume lower than v6.1, presumably because it lacks the accumulated test-list discussion that in v6.1 motivates additional helper structures.

Despite the differences in code quantity, v6.1 and v7.1 have similarly few smells (1.3 / 2.3) — the structural cleanliness comes from the refactor subagent, not from the code volume. v4.1 with 13.2 smells in 621.6 LOC is dense and heavily structured; v6.1 with 1.3 smells in 920.7 LOC is distributed and clean.

The finding is consistent with the refactor-subagent mechanic: a fresh refactor context that sees the accumulated implementation as a whole (the code state plus optionally the red/green history in v6.1) can extract and split in a targeted way. v4.1's isolated refactor sees only the respective current code state without the context of how it came about and tends toward local cleanup instead of structural rebuilding.

## F-context.3 — Correctness Does Not Distinguish the Architectures

v5.1 and v6.1 reach 1.00 verification_pct (15/15 in every run, σ=0). v4.1 reaches 0.96 with one outlier at 0.8 (12/15), v7.1 reaches 0.98 with one run at 14/15. All four architectures are highly correct; it is notable that the two architectures with green as an isolated step (v4.1, v7.1) each carry one outlier, while the two architectures with green in the shared context (v5.1, v6.1) are perfect.

**H2 confirmed**: the context-architecture effect shows up in code quality and cost, not substantially in external correctness. The test-list-scope-fix dominates over the architecture.

## F-context.4 — Four Very Different Cost Profiles

| Metric (lower = better, except where marked) | v4.1 | v5.1 | v6.1 | v7.1 |
|---|---:|---:|---:|---:|
| `duration_seconds` (mean) | 3 229 (~54 min) | **641 (~11 min)** 🏆 | 1 424 (~24 min) | 1 970 (~33 min) |
| `total_tokens` (mean)     | **14.10 M** 🏆 | 18.73 M | 30.16 M | 26.11 M |
| `cycle_count` (mean)      | 44.6 | 5.5 | 24.7 | 18.3 |
| `refactorings_applied`    | 6.8 | 2.2 | 10.7 | 14.0 |

v5.1 is 5× faster than v4.1 and 3× faster than v7.1 — the single context without subagent spawns dominates the wallclock rating. v4.1 consumes the fewest tokens — isolated subagent contexts grow linearly, the v5.1 single context accumulates, and v6.1 combines an accumulated single context with an additional refactor subagent → the highest token consumption. v7.1 (two subagent phases) is surprisingly **cheaper** than v6.1 (one subagent phase) — presumably because the green subagent, without an accumulated single context, works more briefly and in a more focused way than green-in-the-shared-context and thereby relieves the later refactor.

The `cycle_count` spread shows four qualitatively different working modes: v5.1 with only 5.5 cycles and 1.7 immediately green tests works in coarse steps; v4.1 with 44.6 cycles and 22.2 immediately green tests decomposes very finely and often produces pre-implementation in red; v6.1 (24.7 cycles) and v7.1 (18.3 cycles) lie in between, with the highest refactor rate of all workflows (v7.1 14.0/run, v6.1 10.7/run vs. v4.1 6.8 and v5.1 2.2) — the isolated refactor subagents visibly "work" more.

**H3 (v4.1 < v5.1 < v6.1 tokens) confirmed for the first three cells**, but **H3 falsified for v7.1**: v7.1 (26.1 M) lies below v6.1 (30.2 M), not above.

**H5 (wallclock ordering v5.1 < hybrids < v4.1) confirmed** — v7.1 (1 970s) between v6.1 (1 424s) and v4.1 (3 229s), closer to v6.1 than to v4.1.

## F-context.5 — Two Hybrid Positions with Similar Code Quality, Different Cost Profiles

On the code-quality dimension, v6.1 and v7.1 are practically level (all 4 peak metrics within 1 σ; 4 🏆 each in the overview). v6.1 is marginally cleaner on `smell_total` and `cognitive_max`; v7.1 in return has a **lower code volume** (801 vs. 921 LOC), **lower token consumption** (26 vs. 30 M) and the **smallest spread** across all metrics. Wallclock the other way around: v6.1 ~24 min, v7.1 ~33 min.

There is no Pareto winner: v4.1 dominates on code compactness and token efficiency, v5.1 on wallclock and (narrowly) correctness, v6.1/v7.1 on the code-quality peaks. For an application profile focused on structural code quality at moderate cost, v7.1 is the more efficient hybrid variant; v6.1 the marginally cleaner choice at higher tokens. Under this claim-office evidence, v4.1 has no clear use case — the lowest code volume, but the worst values on all quality peaks and the highest spread.

## Cross-RQ Reference

The findings of this RQ refine the context-engineering effect on claim-office relative to the finding on game-of-life in [RQ-tdd-quality F-tdd-quality.3](../4.1-tdd-effect-code-quality/findings.md):

- On game-of-life (RQ-tdd-quality, 2-point comparison): v4.1 had the lowest complexity peaks, v5.1 lost this advantage. v6.1 also had low peaks there (cognitive_max 7.7).
- On claim-office (this RQ, 4-point comparison): v6.1 and v7.1 dominate on a par, v5.1 second best, v4.1 loses clearly.

On the simpler, training-known kata, full phase isolation suffices; on the more complex, novel kata, phase isolation becomes counterproductive and only refactor isolation contributes to structural quality. Cross-kata replication on a third kata (e.g. mars-rover) remains open in order to separate the two readings ("kata complexity" vs. "kata familiarity").
