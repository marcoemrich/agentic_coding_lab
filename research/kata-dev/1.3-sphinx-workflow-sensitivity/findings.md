# RQ-kata-1.3 — Findings: Does sphinx-score resolve a workflow difference?

n=6 per cell, `opus-5-no-thinking`, prompt `example-mapping`. All 36 runs
`exit_reason=ok`, `tests_passing=100%`, `completed_within_budget=100%`.

`game-of-life` is the reference kata: it sits at practically the same Code Mass
(APP) as `sphinx-score` (196.8 vs. 182.8) and is the lab's established
code-quality kata. It separates size from kata design — anything sphinx-score
fails to resolve that game-of-life resolves at the same size is a property of
the kata, not of its scale.

## Overview

Workflow comparison **within** each kata. `baseline-inline-tdd-v1-cc` is the minimal
workflow (plain red-green-refactor), `exact-hybrid-v6-lab-split-cc` the elaborate one
(refactor subagent, test-list phase, audit bundle).

### sphinx-score (~183 Code Mass (APP))

| Metric | Direction | baseline-inline-tdd-v1-cc | exact-hybrid-v6-lab-split-cc | Factor |
|---|---|---:|---:|---:|
| `cc_longest_function` (Complexity Peak) | lower = better | 11.00 | **5.83** 🏆 | 1.9× |
| `cc_avg_loc_per_function` | lower = better | 8.38 | **3.54** 🏆 | 2.4× |
| `cognitive_max` | lower = better | 1.50 | **1.00** 🏆 | 1.5× |
| `mccabe_max` | lower = better | 2.33 | **2.00** 🏆 | 1.2× |
| `cc_functions` | — (decomposition degree) | 3.50 | 6.50 | 1.9× |
| Production LoC | — | 77.5 | 57.5 | 0.74× |
| `refactorings_applied` | higher = better | 2.67 | **11.67** 🏆 | 4.4× |
| `cycle_count` | — | 1.50 | 11.67 | 7.8× |
| Correctness (external) | higher = better | 0.97 | **1.00** 🏆 | — |
| `duration_seconds` | lower = better | **251** 🏆 | 1475 | 5.9× |
| `cost_usd` | lower = better | **$2.64** 🏆 | $12.86 | 4.9× |

### game-of-life (~196 Code Mass (APP))

| Metric | Direction | baseline-inline-tdd-v1-cc | exact-hybrid-v6-lab-split-cc | Factor |
|---|---|---:|---:|---:|
| `cc_longest_function` (Complexity Peak) | lower = better | 14.50 | **7.50** 🏆 | 1.9× |
| `cc_avg_loc_per_function` | lower = better | 6.48 | **3.46** 🏆 | 1.9× |
| `cognitive_max` | lower = better | 7.17 | **1.17** 🏆 | 6.1× |
| `mccabe_max` | lower = better | 5.67 | **2.50** 🏆 | 2.3× |
| `cc_functions` | — (decomposition degree) | 4.83 | 8.50 | 1.8× |
| Production LoC | — | 55.0 | 53.5 | 0.97× |
| `refactorings_applied` | higher = better | 0.33 | **8.83** 🏆 | 27× |
| `cycle_count` | — | 3.67 | 10.33 | 2.8× |
| Correctness (external) | higher = better | **1.00** 🏆 | **1.00** 🏆 | — |
| `duration_seconds` | lower = better | **167** 🏆 | 1145 | 6.9× |
| `cost_usd` | lower = better | **$1.72** 🏆 | $10.82 | 6.3× |

### claim-office (758–997 Code Mass (APP))

| Metric | Direction | baseline-inline-tdd-v1-cc | exact-hybrid-v6-lab-split-cc | Factor |
|---|---|---:|---:|---:|
| `cc_longest_function` (Complexity Peak) | lower = better | 24.33 | **13.83** 🏆 | 1.8× |
| `cc_avg_loc_per_function` | lower = better | 8.90 | **3.19** 🏆 | 2.8× |
| `cognitive_max` | lower = better | 5.33 | **2.00** 🏆 | 2.7× |
| `mccabe_max` | lower = better | 5.33 | **2.83** 🏆 | 1.9× |
| `cc_functions` | — (decomposition degree) | 14.50 | 38.00 | 2.6× |
| Production LoC | — | 314.7 | 523.0 | 1.7× |
| `refactorings_applied` | higher = better | 2.00 | **44.50** 🏆 | 22× |
| `cycle_count` | — | 5.17 | 45.83 | 8.9× |
| Correctness (external) | higher = better | **1.00** 🏆 | 0.94 | — |
| `duration_seconds` | lower = better | **330** 🏆 | 5514 | 17× |
| `cost_usd` | lower = better | **$3.89** 🏆 | $78.98 | 20× |

**Caveats for reading the tables:**
- Trophies are awarded **only within a kata**. A cross-kata comparison would be
  meaningless: `claim-office` would lose every cost, complexity and Code Mass row
  purely because of its task size — that measures the kata, not the workflow.
- Correctness gating is not restrictive here: all six cells sit at Correctness
  (external) ≥ 0.94 and `tests_passing` = 100 %, no cell wins a quality metric
  through a stub or an abort.
- `cc_functions`, `cycle_count` and Production LoC are ambivalent (more functions =
  finer decomposition, but also more code) and therefore carry no trophy.
- `smell_total` is 0 in all 36 runs and does not discriminate at this model level.

---

## F-1.1 — sphinx-score resolves the workflow difference in decomposition

`sphinx-score` separates the minimal from the elaborate workflow variant on all
four decomposition metrics, in the same direction as the two established katas.
H1 is confirmed; the metric-floor scenario from the README does not occur for
the length metrics.

| Metric | inline-tdd-v1 | hybrid-v6 | Factor | σ (inline-tdd-v1 / hybrid-v6) |
|---|---:|---:|---:|---|
| `cc_longest_function` | 11.00 | 5.83 | 1.9× | 1.90 / 1.94 |
| `cc_avg_loc_per_function` | 8.38 | 3.54 | 2.4× | 1.42 / 1.11 |
| `cc_functions` | 3.50 | 6.50 | 1.9× | 0.55 / 1.64 |

**Rationale:** the gap on `cc_longest_function` is 5.2 points at σ ≈ 1.9 — about
2.7 σ, well above the 1 σ threshold. `cc_avg_loc_per_function` separates even
more sharply at 4.8 points with σ ≈ 1.3 (≈ 3.8 σ). The value ranges do not
overlap: on `cc_longest_function` inline-tdd-v1 lies between 8 and 13, hybrid-v6
between 2 and 7. The concern from the README — both cells collapsing to
`cc_longest_function` ≈ 7 — does not materialise; the smoke run with 48 LoC and
peak 7 was a hybrid-v6 value, and inline-tdd-v1 lands systematically above it.

---

## F-1.2 — The size gap is not the reason: game-of-life resolves more at the same size

H2 (smaller gap because the kata is smaller) is **refuted**.
`game-of-life` has practically the same Code Mass (APP) as `sphinx-score`
(196.8 vs. 182.8) and still separates markedly more sharply on both complexity
metrics. The weak sphinx value is a property of the kata, not of its size.

| Metric | sphinx (183) | game-of-life (196) | claim-office (758–997) |
|---|---:|---:|---:|
| `cc_longest_function` | 1.9× | 1.9× | 1.8× |
| `cc_avg_loc_per_function` | 2.4× | 1.9× | 2.8× |
| `cognitive_max` | 1.5× | **6.1×** | 2.7× |
| `mccabe_max` | 1.2× | **2.3×** | 1.9× |

**Rationale:** on the length metrics all three katas deliver the same factor —
`cc_longest_function` sits at 1.8–1.9× everywhere, independent of a factor-5
size difference. On the complexity metrics sphinx is the only one that breaks
down. The reason is a floor on the sphinx-inline-tdd-v1 side: `cognitive_max`
sits at 1.50 there, while game-of-life-v3 sits at 7.17 — on sphinx the minimal
workflow does not even produce nested logic that a refactoring could act on. In
the sphinx-hybrid-v6 cell the floor is then absolute: `cognitive_max` exactly 1
in all six runs (σ = 0), `mccabe_max` exactly 2 (σ = 0). The sphinx task is
therefore not too small but **structurally too flat** — it contains no branching
depth that these metrics could reflect.

---

## F-1.3 — The refactoring mechanism separates on all three katas

H3 is confirmed. `refactorings_applied` separates the workflows everywhere, but
the amplitude does not follow kata size.

| Kata | inline-tdd-v1 | hybrid-v6 | Factor |
|---|---:|---:|---:|
| sphinx-score | 2.67 | 11.67 | 4.4× |
| game-of-life | 0.33 | 8.83 | 27× |
| claim-office | 2.00 | 44.50 | 22× |

**Rationale:** the factor says less here than the absolute values, because it is
dominated by the inline-tdd-v1 denominator: game-of-life reaches the highest
factor (27×) at the *lowest* hybrid-v6 number (8.83) — simply because the minimal
workflow almost never refactors there (0.33). On the hybrid-v6 side the number
scales cleanly with task size (8.83 / 11.67 / 44.50), and per kata it largely
matches `cycle_count` (10.33 / 11.67 / 45.83): the elaborate workflow performs
roughly one refactoring per cycle. For a workflow comparison the metric is usable
on all three katas, for a kata comparison it is not.

---

## F-1.4 — sphinx-score has no cost advantage over game-of-life

As a pre-screen for workflow effects, `sphinx-score` costs about a sixth of
`claim-office` — but `game-of-life` is slightly cheaper still at the same size
and separates better.

| Kata | Workflow | `duration_seconds` | `cost_usd` | `total_tokens` |
|---|---|---:|---:|---:|
| sphinx-score | baseline-inline-tdd-v1-cc | 251 | $2.64 | 2.9 M |
| sphinx-score | exact-hybrid-v6-lab-split-cc | 1475 | $12.86 | 19.1 M |
| game-of-life | baseline-inline-tdd-v1-cc | 167 | $1.72 | 2.1 M |
| game-of-life | exact-hybrid-v6-lab-split-cc | 1145 | $10.82 | 15.0 M |
| claim-office | baseline-inline-tdd-v1-cc | 330 | $3.89 | 4.5 M |
| claim-office | exact-hybrid-v6-lab-split-cc | 5514 | $78.98 | 136.1 M |

**Rationale:** a full 2×6 workflow comparison costs about $75 on game-of-life,
$93 on sphinx and $497 on claim-office. The expensive cell (elaborate workflow)
runs 25 min on sphinx and 19 min on game-of-life, against 92 min on claim-office.
The cost advantage over claim-office is therefore real, but it is no argument
*for sphinx* — game-of-life delivers it too and separates more sharply (F-1.2).

---

## F-1.5 — Correctness stays saturated and does not separate the workflows

On none of the three katas is Correctness (external) usable as a separating
metric for this workflow comparison.

| Kata | inline-tdd-v1 | hybrid-v6 |
|---|---:|---:|
| sphinx-score | 0.97 (σ 0.08) | 1.00 (σ 0) |
| game-of-life | 1.00 (σ 0) | 1.00 (σ 0) |
| claim-office | 1.00 (σ 0) | 0.94 (σ 0.03) |

**Rationale:** five of the six cells sit at ≥ 0.97, `tests_passing` is 100 %
everywhere. game-of-life is exactly saturated in both cells. On sphinx the only
outlier is at inline-tdd-v1 (one run at 0.81), on claim-office hybrid-v6
systematically loses 0.06 — the direction therefore flips by kata and is in both
cases smaller than the measurement range a workflow comparison would need. This
confirms the assumption in the RQ README: the decomposition effect is to be
measured on the quality axis, not on the Correctness (external) axis.

---

## Verdict for the kata assessment

By the assessment grid in the README, row 2 applies: **gap present, but smaller
than on the reference** — not because of kata size, but because the sphinx task
is structurally flat (F-1.2).

`sphinx-score` is usable for workflow RQs, with two restrictions:

- **Usable metrics:** `cc_longest_function`, `cc_avg_loc_per_function`,
  `cc_functions`, `refactorings_applied`. Not usable: `cognitive_max` and
  `mccabe_max` (floor at σ = 0 in the hybrid-v6 cell), `smell_total` (0 everywhere).
- **Role:** for workflow RQs targeting complexity metrics, `game-of-life` is the
  better choice — same size, same cost, markedly more resolution. `sphinx-score`
  stays in use for correctness and prompt RQs (RQ-1.1, RQ-1.2), where its
  unambiguity is an advantage.
