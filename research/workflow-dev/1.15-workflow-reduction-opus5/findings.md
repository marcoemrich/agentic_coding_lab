# RQ-workflow-reduction-opus5 — Findings

_How much of the v6.6 architecture can be removed on opus-5 before code quality degrades — and how much of its result comes from the APP subordination patch (v6.7) rather than from the end-refactor phase (v6.8) or the isolated refactor subagent (v5.2)?_

## Übersicht

**The reduction chain in order** — each step removes exactly one component from the one above
it. `cc_avg_loc_per_function` is the primary decomposition metric (mean function length,
kleiner = besser); n=5 per cell, n=6 for v6.6.

| Chain position | Workflow | sphinx `cc_avg` | game-of-life `cc_avg` |
|---|---|---:|---:|
| upper bound | v6.6-lab-split-cc | 3.54 | **3.46** 🏆 |
| + APP patch | v6.7-app-subordinate-cc | 2.96 ⚠ | 3.83 |
| − end-refactor | v6.8-no-end-refactor-cc | 3.24 | 4.67 |
| − isolated subagent | v5.2-no-subagent-cc | **3.16** 🏆 | 4.04 |
| _anchor (confounded)_ | v6.1-hybrid-testlist-scope-fix | 3.68 | 4.54 |
| _anchor (confounded)_ | v5.1-testlist-scope-fix | 6.16 | 4.12 |

⚠ v6.7's 2.96 is the best raw value on sphinx but carries the field's only correctness loss —
see the gating caveat below and F-1.2.

All outcomes per cell (sphinx-score / game-of-life):

| Outcome | v5.1 | v5.2 | v6.1 | v6.6 | v6.7 | v6.8 |
|---|---:|---:|---:|---:|---:|---:|
| `verification_pct` (höher = besser) | **1.00 / 1.00** 🏆 | **1.00 / 1.00** 🏆 | **1.00 / 1.00** 🏆 | **1.00 / 1.00** 🏆 | 0.92 / 1.00 | **1.00 / 1.00** 🏆 |
| `cc_avg_loc_per_function` (kleiner = besser) | 6.16 / 4.12 | **3.16** 🏆 / 4.04 | 3.68 / 4.54 | 3.54 / **3.46** 🏆 | 2.96 / 3.83 | 3.24 / 4.67 |
| `cc_longest_function` (kleiner = besser) | 8.6 / 8.0 | 7.2 / 8.8 | 6.8 / 10.8 | **5.83** 🏆 / 7.5 | 5.8 / **7.2** 🏆 | 7.0 / 11.8 |
| `total_tokens` (kleiner = besser) | 16.6 M / 11.8 M | 18.8 M / 21.1 M | **10.6 M** 🏆 / **8.0 M** 🏆 | 19.1 M / 15.0 M | 14.7 M / 15.1 M | 12.3 M / 12.2 M |
| `duration_seconds` (kleiner = besser) | **609 s** 🏆 / **431 s** 🏆 | 745 s / 743 s | 786 s / 621 s | 1475 s / 1145 s | 1264 s / 1183 s | 986 s / 1097 s |
| `cognitive_max` (kleiner = besser) | 1.4 / 1.8 | 1.4 / 3.2 | **1.0** 🏆 / 1.8 | **1.0** 🏆 / **1.17** 🏆 | 1.0 / 1.4 | 1.4 / 2.8 |
| `smell_total` (kleiner = besser) | 0.6 / **0.0** 🏆 | 0.4 / **0.0** 🏆 | 0.2 / 1.2 | **0.0** 🏆 / **0.0** 🏆 | 0.0 / 0.6 | 0.0 / 1.6 |
| `refactorings_applied` (höher = besser) | 5.8 / 4.4 | 9.0 / **9.2** 🏆 | 6.0 / 4.4 | **11.67** 🏆 / 8.83 | 10.4 / 9.0 | 7.8 / **9.2** 🏆 |

**Caveats binding for both tables:**

- **Correctness-gating.** `v6.7` is the only cell below `verification_pct` 1.00 (0.92 on sphinx-score). Per the gating rule, it receives no trophy for quality or efficiency metrics on that kata — including `cc_avg_loc_per_function` 2.96, which is the best raw value in the row. See F-1.2.
- **Trophies are per-kata, never across katas.** sphinx-score and game-of-life differ in task shape; a cross-kata comparison would measure the kata, not the workflow.
- Code Mass (APP) carries no trophy — per `RQ-architecture-axis-opus5` F-1.6 it ranks opposite to decomposition. It stays as context.
- σ ranges from 0.44 to 2.88 on the primary metric. Most adjacent chain steps overlap within 1 σ; the finding blocks name which differences survive.

---

## F-1.1 — The reduction chain does not order monotonically on either kata

Removing components from v6.6 does not produce a monotone decline in decomposition. The chain
v6.6 → v6.7 → v6.8 → v5.2 orders differently on the two katas, and on neither does it fall
step by step.

| Chain step | sphinx-score `cc_avg` | game-of-life `cc_avg` |
|---|---:|---:|
| v6.6 (upper bound) | 3.54 | 3.46 |
| v6.7 (+ APP patch) | 2.96 | 3.83 |
| v6.8 (− end-refactor) | 3.24 | 4.67 |
| v5.2 (− subagent) | 3.16 | 4.04 |

On sphinx-score the leanest cell (v5.2) is statistically indistinguishable from the fullest
(v6.6): 3.16 against 3.54 at σ 0.76 / 1.11. On game-of-life the ordering inverts in the middle
— v6.8 is the worst cell of the chain (4.67), while v5.2 below it recovers to 4.04.

**Rationale.** Both katas are small enough that the architecture has limited room to
differentiate: the v3 → v6.6 span on sphinx is a factor 2.4, and every chain cell sits in the
lower half of it. Once decomposition is good, further architecture adds variance rather than
gain. The inversion at v6.8/game-of-life is consistent with its `cc_longest_function` of 11.8
(σ 6.72, max 23) — a single long function drags the mean without the end-refactor phase to
catch it.

---

## F-1.2 — v6.7 buys its decomposition lead with the only correctness loss in the field

`v6.7-app-subordinate-cc` has the best raw `cc_avg_loc_per_function` on sphinx-score (2.96,
σ 0.68) and the lowest `cc_longest_function` (5.8). It is also the only cell in all twelve
that falls below `verification_pct` 1.00.

| Cell | n | `verification_pct` | per-run values |
|---|---:|---:|---|
| v6.7 / sphinx-score | 5 | 0.92 (σ 0.10) | 0.81, 0.81, 1.00, 1.00, 1.00 |
| all other 11 cells | 5–6 | 1.00 (σ 0) | — |

Two of five runs pass only 81 % of the external acceptance suite while their own vitest suite
is green (`tests_passing` 100 % across the cell).

**Rationale.** The APP subordination patch removes the brake on extraction: refactor agents are
told that rising mass is normal and must not revert an extraction for it. On sphinx-score the
result is the field's finest-grained decomposition — and, in two runs, a structure whose
self-written tests no longer catch what the external suite checks. This is the failure mode
caveat 3 of the RQ README anticipated for `cc_avg_loc_per_function`: the metric rewards
splitting without judging whether the split is appropriate. The same patch on game-of-life
produces no correctness loss (1.00 across five runs) and no decomposition lead (3.83 against
v6.6's 3.46), so the effect is not a property of the patch alone but of patch × kata.

---

## F-1.3 — The end-refactor phase costs 20 % of tokens without buying decomposition

v6.7 and v6.8 differ in exactly one component — the end-refactor phase — and both carry the
APP patch. The phase costs measurably and returns nothing on the primary metric.

| Cell | `total_tokens` | `duration_seconds` | `cc_avg` sphinx | `cc_avg` game-of-life |
|---|---:|---:|---:|---:|
| v6.7 (with end-refactor) | 14.7 M / 15.1 M | 1264 s / 1183 s | 2.96 | 3.83 |
| v6.8 (without) | 12.3 M / 12.2 M | 986 s / 1097 s | 3.24 | 4.67 |
| Δ | −16 % / −19 % | −22 % / −7 % | +0.28 | +0.84 |

On sphinx-score the decomposition difference (0.28) sits well inside σ (0.68 / 0.44) — the
phase buys nothing measurable there. On game-of-life the difference is larger (0.84) but still
inside v6.8's σ of 1.81, and it appears in the peak rather than the mean: `cc_longest_function`
7.2 with the phase against 11.8 without.

**Rationale.** The end phase is a safety net for outliers, not a driver of average quality. Where
the per-cycle refactor agent already decomposes well, it finds nothing to do and costs its
tokens anyway. Its value shows only where a single function escaped the per-cycle pass — which
happens on game-of-life, not on sphinx-score.

---

## F-1.4 — The isolated refactor subagent is not load-bearing on these katas

v6.8 and v5.2 differ only in whether refactoring runs in a fresh context (subagent) or the
shared one (skill). Removing the isolated context does not degrade decomposition on either kata.

| Cell | sphinx `cc_avg` | gol `cc_avg` | sphinx `cognitive_max` | gol `cognitive_max` | `refactorings_applied` |
|---|---:|---:|---:|---:|---:|
| v6.8 (subagent) | 3.24 | 4.67 | 1.4 | 2.8 | 7.8 / 9.2 |
| v5.2 (shared ctx) | 3.16 | 4.04 | 1.0 | 3.2 | 9.0 / 9.2 |

v5.2 is at least as good as v6.8 on the primary metric on both katas, applies more refactorings
on sphinx-score (9.0 against 7.8), and matches it on TDD discipline (`cycle_count` 10.2 both
katas, `predictions_correct_rate` 100 %).

**Rationale.** H3 predicted a marked degradation from removing the isolated context; the data
does not show it. The shared-context variant carries the same rule files and the same APP patch,
and on katas of this size the refactor step apparently does not need a clean context to do its
work. The caveat from the RQ README stands: v5.2 → v5.1 is not a clean comparison (three
differences), so this finding speaks only to the v6.8 → v5.2 step.

---

## F-1.5 — v5.2 does not inherit v5.1's early-termination mode on these katas

H4 predicted that `v5.2-no-subagent-cc` would show the failure documented for v5.1 on
claim-office — runs stopping after 2 cycles with a partially implemented rule set. It does not
occur.

| Cell | n | `verification_pct` | `cycle_count` | `completed_within_budget` |
|---|---:|---:|---:|---:|
| v5.2 / sphinx-score | 5 | 1.00 (σ 0) | 10.2 (σ 0.45) | 100 % |
| v5.2 / game-of-life | 5 | 1.00 (σ 0) | 10.2 (σ 1.79) | 100 % |

**Rationale.** The hypothesis is not confirmed, but it is also not refuted — it is untestable in
this RQ, exactly as caveat 7 of the README anticipated. Eleven of twelve cells saturate at
`verification_pct` 1.00, so no cell *can* fail on correctness here; the metric carries no
signal on these two katas. The mode was observed on claim-office, which this RQ drops for cost
reasons. Deciding H4 requires a follow-up RQ on claim-office at that kata's price.

---

## F-1.6 — Code Mass (APP) does not rank opposite to decomposition on these katas

`RQ-architecture-axis-opus5` F-1.6 found Code Mass (APP) ranking the cells opposite to
decomposition, which motivated the APP subordination patch. On sphinx-score and game-of-life
that inversion does not reproduce.

| Cell | sphinx APP | sphinx `cc_avg` | gol APP | gol `cc_avg` |
|---|---:|---:|---:|---:|
| v5.1 | 159.8 | 6.16 | 176.2 | 4.12 |
| v5.2 | 194.6 | 3.16 | 199.2 | 4.04 |
| v6.1 | 169.8 | 3.68 | 181.8 | 4.54 |
| v6.6 | 182.8 | 3.54 | 195.8 | 3.46 |
| v6.7 | 178.0 | 2.96 | 184.4 | 3.83 |
| v6.8 | 198.4 | 3.24 | 184.4 | 4.67 |

On sphinx-score the worst-decomposing cell (v5.1, 6.16) also has the *lowest* mass (159.8),
which is the inversion — but the best-decomposing cell (v6.7, 2.96) sits mid-field at 178.0
rather than at the top, and the highest mass belongs to v6.8 (198.4), a mid-field decomposer.
On game-of-life the spread is 176–199 across all six cells, against a `cc_avg` spread of
3.46–4.67; mass barely moves and its top value (v5.2, 199.2) belongs to a mid-field cell.

**Rationale.** The inversion was measured on claim-office, where the architecture has room to
produce genuinely different structures (APP 569–1003). On katas this small the total mass is
dominated by the problem, not by the workflow — a 20 % band across six architectures is not a
ranking. The patch's arithmetic reasoning remains sound; this RQ simply cannot test it, and no
conclusion about the patch's mass behaviour should be drawn from these numbers.

---

## F-1.7 — Cost tracks refactoring volume, and the APP patch is not what drives it

`v6.1-hybrid-testlist-scope-fix` runs markedly faster and cheaper than
`v6.8-no-end-refactor-cc` although both use the same architecture — a refactor subagent per
cycle, no end-refactor phase. The gap is not a per-unit slowdown; v6.8 simply does more
refactoring.

| Kata | `cycle_count` | `refactorings_applied` | `duration_seconds` | `total_tokens` |
|---|---:|---:|---:|---:|
| game-of-life v6.1 → v6.8 | 10.4 → 10.6 | 4.4 → 9.2 (2.09×) | 621 → 1097 s (1.77×) | 8.0 → 12.2 M (1.53×) |
| sphinx-score v6.1 → v6.8 | 10.4 → 10.2 | 6.0 → 7.8 (1.30×) | 786 → 986 s (1.25×) | 10.6 → 12.3 M (1.16×) |

`cycle_count` is unchanged, so the entire difference arises *inside* the refactor phase, and
the refactoring factor predicts the duration factor closely on both katas.

**The cause is the lab-split, not the APP patch.** v6.1 → v6.8 differs in two components, as
caveat 1 of the RQ README states: the patch *and* the lab-split rule files
(`subagent-prompts.md`, `lab-only.md`). The clean isolation of the patch is v6.6 → v6.7, which
holds architecture constant — and there the effect runs the other way:

| Kata | `refactorings_applied` v6.6 → v6.7 | `duration_seconds` | `total_tokens` |
|---|---:|---:|---:|
| sphinx-score | 11.67 → 10.4 | 1475 → 1264 s | 19.1 → 14.7 M |
| game-of-life | 8.83 → 9.0 | 1145 → 1183 s | 15.0 → 15.1 M |

Adding the patch to an otherwise identical workflow lowers refactoring volume on sphinx-score
and leaves it flat on game-of-life. It does not buy its decomposition behaviour with extra
refactoring passes.

**Rationale.** Refactoring volume is the cost driver in this workflow family — cost scales with
what the refactor phase does, not with how the phase is invoked. Which component raises that
volume is a separate question this RQ cannot answer: the lab-split was never varied in
isolation. Any recommendation to adopt or drop the lab-split needs a single-factor cell that
does not exist here.

---

## Data quality

Four v5.2 runs from the first batch were discarded and re-run: they hit the API rate limit and
their `duration_seconds` absorbed ~96 minutes of backoff wait (60 s + 300 s + 1800 s + 3600 s
retries). The same interruption caused the transcript parser to undercount `cycle_count` and
`refactorings_applied` in those runs (values of 1 and 5 against a cell norm of 10). The
replacements completed without rate-limit hits. All 62 runs in this aggregation carry
`exit_reason: ok`, `tests_passing: true` and `cli_built: true`.
