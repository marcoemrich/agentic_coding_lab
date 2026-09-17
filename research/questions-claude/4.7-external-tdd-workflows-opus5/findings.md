# Findings — RQ-4.7: Substituting the Inner TDD Loop (opus-5)

All figures: `claim-office-example-mapping` × `opus-5-no-thinking` (native
subscription route), n=5 per cell. Both external workflows are vendored
snapshots at the commits named in [README.md](README.md); every statement here
describes those snapshots, not the tools in general.

## Overview

Primary outcome is Correctness (external); the decomposition metrics follow the
binding quality metric from RQ-architecture-axis-opus5 F-1.6.

| Metric | `exact-hybrid-v2.4-lab-split-cc` (per-cycle, subagent) | `external-superpowers-2026-09-04-cc` (per-cycle, inline) | `external-pocock-2026-09-04-cc` (no refactor) |
|---|---:|---:|---:|
| **Correctness (external)** `verification_pct` — higher = better | 0.96 ± 0.04 | **1.00 ± 0.00** 🏆 | **1.00 ± 0.00** 🏆 |
| perfect runs | 2/5 | **5/5** 🏆 | **5/5** 🏆 |
| Correctness (internal) `tests_passing` | **100 %** 🏆 | **100 %** 🏆 | **100 %** 🏆 |
| `cc_avg_loc_per_function` — lower = better | 4.49 ± 0.54 | 7.90 ± 1.15 | 10.41 ± 1.45 |
| **Complexity Peak** `cc_longest_function` — lower = better | 17.60 ± 4.39 | 23.40 ± 3.13 | 26.60 ± 4.22 |
| `cognitive_max` — lower = better | 2.80 ± 0.84 | 6.20 ± 2.17 | 6.60 ± 2.41 |
| `mccabe_max` — lower = better | 3.40 ± 0.55 | 5.20 ± 1.10 | 5.40 ± 1.14 |
| **Smell Total** — lower = better | 0.00 ± 0.00 | **0.00 ± 0.00** 🏆 | 0.20 ± 0.45 |
| **Code Mass (APP)** — lower = better | 821 ± 111 | 666 ± 26 | **600 ± 60** 🏆 |
| `duration_seconds` — lower = better | 3841 ± 1523 | **548 ± 57** 🏆 | **582 ± 66** 🏆 |
| `total_tokens` — lower = better | 126.2 M ± 42 M | **12.2 M ± 1.3 M** 🏆 | **11.8 M ± 1.3 M** 🏆 |
| `refactorings_applied` — design characteristic | 33.00 ± 14.27 | 4.20 ± 3.42 | 0.00 ± 0.00 |
| `test_blocks` | 48.40 ± 2.07 | 13.40 ± 2.51 | 19.00 ± 2.74 |
| `test_cases_total` | 49.00 ± 2.00 | 45.00 ± 11.51 | 36.80 ± 5.26 |
| `test_cases_first_block` | 1.00 ± 0.00 | 1.00 ± 0.00 | 1.00 ± 0.00 |
| `red_unverified` — lower = stricter | 0.00 ± 0.00 | 1.00 ± 1.73 | 0.20 ± 0.45 |

> **Why the quality rows carry no trophy.** The gating rule awards quality and
> cost trophies only to cells at `verification_pct = 1.0`. `hybrid-v2.4` sits at
> 0.96 with only 2/5 perfect runs — that is not a rounding remainder but a real
> correctness shortfall in 3 of 5 runs. `hybrid-v2.4` is therefore not
> trophy-eligible, yet it holds the best absolute values on all four
> decomposition metrics. Awarding a trophy to the best *eligible* cell would put
> it on the worse value of the row, which the convention excludes — so these rows
> stay trophy-free. For cost, `Code Mass (APP)` and `Smell Total` the conflict
> does not arise: there the best cell is eligible anyway.

> `refactorings_applied` carries no trophy: the three values are the cells'
> design characteristic, not a result. 33 / 4.2 / 0 is the axis itself.

---

## F-4.7.1 — The inner loop is substitutable without losing correctness

Both external workflows reach `verification_pct` 1.00 in 5/5 runs. The internal baseline `hybrid-v2.4` sits below that at 0.96 (2/5 perfect).

| | perfect runs | `verification_pct` |
|---|---:|---:|
| `external-superpowers-2026-09-04-cc` | 5/5 | 1.00 ± 0.00 |
| `external-pocock-2026-09-04-cc` | 5/5 | 1.00 ± 0.00 |
| `exact-hybrid-v2.4-lab-split-cc` | 2/5 | 0.96 ± 0.04 |

Reading: the value EXACT Coding adds lies in the example mapping and the test list, not in its own red/green plumbing. An externally authored loop carries the method on this kata at least as reliably. H5 confirmed for all three cells.

The three `hybrid-v2.4` runs at 0.9333 fail on the same acceptance-scenario pattern as the case documented in RQ-4.5 F-1.4; the effect is therefore not new, but it hits `hybrid-v2.4` more often than the two external cells.

---

## F-4.7.2 — Refactor position determines decomposition monotonically

Across the three cells all four decomposition and complexity metrics fall monotonically with refactor frequency.

| | `refactorings_applied` | `cc_avg_loc_per_function` | Complexity Peak | `cognitive_max` | `mccabe_max` |
|---|---:|---:|---:|---:|---:|
| `hybrid-v2.4` per-cycle, subagent | 33.00 | 4.49 | 17.60 | 2.80 | 3.40 |
| `superpowers-2026-09-04` per-cycle, inline | 4.20 | 7.90 | 23.40 | 6.20 | 5.20 |
| `pocock-2026-09-04` no refactor | 0.00 | 10.41 | 26.60 | 6.60 | 5.40 |

The clean test of position is `superpowers-2026-09-04 ↔ pocock-2026-09-04` — same architecture (one inline skill), only the position varies. `cc_avg_loc_per_function` 7.90 against 10.41 is the most robust single result of this pair (gap 2.51 at σ ≈ 1.3). Complexity Peak, `cognitive_max` and `mccabe_max` point the same way but sit within 1 σ.

H1 confirmed: a refactor stage has an effect. H2 confirmed: `pocock-2026-09-04` is the field's quality minimum on all four metrics. The design doctrine in the prompt ("deep modules", "small interfaces") does not replace the stage.

---

## F-4.7.3 — The isolated subagent architecture buys decomposition, and it is expensive

`hybrid-v2.4 ↔ superpowers-2026-09-04` varies architecture and mechanism at constant position (both refactor per cycle). The difference is large in both directions.

| | `cc_avg_loc_per_function` | `duration_seconds` | `total_tokens` | `refactorings_applied` |
|---|---:|---:|---:|---:|
| `hybrid-v2.4` phase commands + subagent | 4.49 ± 0.54 | 3841 ± 1523 | 126.2 M ± 42 M | 33.00 ± 14.27 |
| `superpowers-2026-09-04` one inline skill | 7.90 ± 1.15 | 548 ± 57 | 12.2 M ± 1.3 M | 4.20 ± 3.42 |
| Factor | 0.57× | **7.0×** | **10.3×** | 7.9× |

The answer to the RQ's guiding question is therefore twofold: the subagent apparatus **does buy** measurably better decomposition (4.49 against 7.90, ≈ 3 σ) — but at the price of 7× wallclock and 10× tokens, with worse Correctness (external) at the same time. H3 in the variant "per-cycle refactoring alone suffices" is refuted: `superpowers-2026-09-04` refactors per cycle and still lands clearly outside the `hybrid-v2.4` level. H4 confirmed (`superpowers-2026-09-04` markedly cheaper than `hybrid-v2.4`).

The σ values are part of the result: relative to its mean, `hybrid-v2.4` spreads three to four times wider on duration (± 1523 s) and tokens (± 42 M) than `superpowers-2026-09-04`. The apparatus is not only more expensive, its cost is also less predictable.

---

## F-4.7.4 — The review stage costs more than the missing refactor saves

`pocock-2026-09-04` has no refactor stage, but two review subagents at the end. It is still not the cheapest cell.

| | `duration_seconds` | `total_tokens` |
|---|---:|---:|
| `superpowers-2026-09-04` per-cycle refactor, no review | **548 ± 57** | **12.2 M ± 1.3 M** |
| `pocock-2026-09-04` no refactor, two review subagents | 582 ± 66 | 11.8 M ± 1.3 M |

H8 (`pocock-2026-09-04` is the cheapest cell) is **not confirmed**: `pocock-2026-09-04` sits above `superpowers-2026-09-04` on wallclock and just below it on tokens, both gaps within 1 σ. Reading: the two review subagents cost about as much as the saved per-cycle refactoring yields — and deliver no code, because by construction they only report. Dropping the review stage would give the cheapest variant of the field; with it, `pocock-2026-09-04` is cost-neutral against `superpowers-2026-09-04` and worse on every quality metric.

---

## F-4.7.5 — Superpowers keeps cycle discipline but does not write tests in one block

The manual n=1 observation that Superpowers writes all tests at once does not reproduce.

| | `test_blocks` | `test_cases_total` | `test_cases_first_block` | cases per block |
|---|---:|---:|---:|---:|
| `hybrid-v2.4` | 48.40 ± 2.07 | 49.00 ± 2.00 | 1.00 ± 0.00 | 1.01 |
| `superpowers-2026-09-04` | 13.40 ± 2.51 | 45.00 ± 11.51 | 1.00 ± 0.00 | 3.36 |
| `pocock-2026-09-04` | 19.00 ± 2.74 | 36.80 ± 5.26 | 1.00 ± 0.00 | 1.94 |

`test_cases_first_block` is exactly 1 in 15/15 runs: no workflow starts with a test block. H6 is therefore **refuted** — the falsifier (`test_blocks = 1` or first block ≈ total count) occurs in no run.

The step size nevertheless differs clearly: `hybrid-v2.4` stays at one case per block, `superpowers-2026-09-04` writes 3.36 on average. The skill's script demands "one behavior" per test; `superpowers-2026-09-04` reads that noticeably more broadly than the phase commands, without skipping the red phase.

`red_unverified` stays low but not at zero: `hybrid-v2.4` 0.00, `pocock-2026-09-04` 0.20 ± 0.45, `superpowers-2026-09-04` 1.00 ± 1.73. The spread at `superpowers-2026-09-04` comes from a single run; H7 holds for `hybrid-v2.4` and `pocock-2026-09-04` and is only weakly supported for `superpowers-2026-09-04`.

---

## F-4.7.6 — Little code is not a quality signal here

The Code Mass ordering runs opposite to the complexity ordering.

| | Code Mass (APP) | `cc_avg_loc_per_function` |
|---|---:|---:|
| `hybrid-v2.4` | 821 ± 111 | 4.49 |
| `superpowers-2026-09-04` | 666 ± 26 | 7.90 |
| `pocock-2026-09-04` | 600 ± 60 | 10.41 |

`pocock-2026-09-04` writes the least and packs it into the longest, most complex functions; `hybrid-v2.4` writes the most and distributes it most finely. Consequence for the analysis: on this kata Code Mass (APP) alone does not separate "parsimonious" from "compacted". Without the decomposition metrics next to it, `pocock-2026-09-04` would read as the leaner result — it is the unstructured one.
