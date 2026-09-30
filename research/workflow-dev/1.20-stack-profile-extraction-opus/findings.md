# Opus/Hybrid stack-profile extraction — findings

## Overview

Baseline: `exact-hybrid-v2-testlist-fix-cc`. Extracted: `exact-hybrid-v2.9-stack-profile-cc`.
Model: `opus-5-no-thinking`, Claude Code, example-mapping. Values are cell means
from `summary.md`; the two katas are reported separately and never pooled.

**Exploratory status.** Three candidate Claim Office runs of the original batch
were deleted and refilled after a dependency-install fix (see README, "Execution
provenance"). Keeping the successful runs while replacing the failures is
outcome-dependent selection, so the candidate Claim Office cell overstates the
candidate's success rate. The baseline cell pools runs from 2026-08-10 to
2026-09-10; only its five 2026-09-10 runs share the candidate's harness version
(Claude Code 2.1.267).

### Claim Office

| Outcome | Baseline (n=18) | Extracted (n=5) |
|---|---:|---:|
| Correctness (external), mean, higher = better | **0.96** 🏆 | 0.77 |
| Correctness (internal), success rate, higher = better | **100%** 🏆 | 80% |
| Completed within budget | 100% | 100% |
| `cycle_count` | 45.89 | 40.40 |
| `refactorings_applied` | 21.28 | 16.00 |
| Prediction accuracy (pooled) | 99.6% (1608/1614) | 99.8% (401/402) |
| `tests_passed_immediately` | 24.28 | 23.60 |
| `cc_avg_loc_per_function` | 3.81 | 4.45 |
| `cc_longest_function` | 16.22 | 19.60 |
| `cognitive_max` | 2.78 | 3.20 |
| `mccabe_max` | 3.39 | 3.60 |
| Smell Total | 0.00 | 0.60 |
| Code Mass (APP) | 859.5 | 706.0 |
| Duration (seconds), lower = better | **2650.1** 🏆 | 4514.2 |
| `total_tokens`, lower = better | **94.2 M** 🏆 | 202.2 M |
| `cost_usd`, lower = better | **$61.94** 🏆 | $135.33 |

### Game of Life

| Outcome | Baseline (n=6) | Extracted (n=5) |
|---|---:|---:|
| Correctness (external), mean | 1.00 | 1.00 |
| Correctness (internal), success rate | 100% | 100% |
| Completed within budget | 100% | 100% |
| `cycle_count` | 10.33 | 8.80 |
| `refactorings_applied` | 4.33 | 6.40 |
| Prediction accuracy (pooled) | 100% (124/124) | 100% (84/84) |
| `tests_passed_immediately` | 7.33 | 4.60 |
| `cc_avg_loc_per_function` | 4.23 | 4.13 |
| `cc_longest_function` | 10.17 | 7.40 |
| `cognitive_max` | 1.83 | 3.00 |
| `mccabe_max` | 3.17 | 3.60 |
| Smell Total | 1.00 | 1.20 |
| Code Mass (APP) | 179.0 | 178.0 |
| Duration (seconds) | 580.2 | 1055.8 |
| `total_tokens` | 9.24 M | 16.88 M |
| `cost_usd` | $6.81 | $15.28 |

Correctness and prediction accuracy are higher-is-better; complexity, smells,
duration and tokens are lower-is-better. Trophies are assigned only where the
cell ranges separate or a failure mode explains the gap: Claim Office
correctness (one candidate run at 0), duration, tokens and cost (the completed
candidate runs lie entirely above the baseline range). All Game of Life
differences stay within the larger cell's standard deviation, so no trophy is
assigned there. `cost_usd` is a list-price equivalent computed from token counts.

---

## F-1.20.1 — On Claim Office the extracted workflow ends its turn at the Test-List → Red handoff

One of the five retained candidate runs (`2026-09-13_10-54-15`) stops after 77
seconds with `cycle_count` 1, no predictions, `verification_pct` 0 and a failing
internal suite. The transcript ends on the Test-List summary and the announcement
that the Red phase comes next; `/red` is never invoked. `exit_reason` is `ok`,
so the run counts as completed within budget.

This run was produced after the dependency-install fix. The two early stops of
the original candidate batch (101 s and 123 s, deleted and refilled) ended at the
same point. Counting every candidate Claim Office attempt, four of eight produced
no usable result: three stops at the handoff and one 7200-second timeout. The
baseline shows no such stop in 18 runs, five of them on the same harness version.

The dependency fault of the original batch is not established as the cause of
its two stops, and the post-fix stop rules it out as the only cause. The failure
does not appear on Game of Life, where all five candidate runs complete.

## F-1.20.2 — Completed extracted Claim Office runs are correct but cost about three times as much

The four candidate runs that pass the handoff reach Correctness (external) 0.97
(0.93–1.00), against 0.96 (0.93–1.00) for the baseline, with `refactorings_applied`
20.0 against 21.28 and `cycle_count` 50.25 against 45.89. Their cost does not
overlap with the baseline:

| Claim Office | Baseline, all (n=18) | Baseline, same harness (n=5) | Extracted, completed (n=4) |
|---|---:|---:|---:|
| Duration (seconds) | 2650.1 (1946–3685) | 2552.4 (2188–3471) | 5623.5 (4303–6573) |
| `total_tokens` | 94.2 M (63.3–136.0 M) | 84.5 M (63.3–101.2 M) | 252.6 M (149.6–409.1 M) |
| `cost_usd` | $61.94 ($45.86–86.35) | $58.86 ($46.35–74.32) | $168.84 ($103.20–268.49) |

The fastest completed candidate run is slower than the slowest baseline run, and
the cheapest one uses more tokens and costs more than the most expensive baseline run. The same
harness subset shows the gap is not a harness-version artefact. Code quality of
the completed runs sits in the baseline's range: Code Mass (APP) 882.5,
`cognitive_max` 4.0, `cc_longest_function` 24.5, Smell Total 0.75.

## F-1.20.3 — On Game of Life extraction is neutral for correctness and quality, with a noisier runtime

Both arms reach full external and internal correctness, full prediction accuracy
and equal Code Mass (APP) (178.0 vs 179.0). Smell Total (1.20 vs 1.00),
`cognitive_max` (3.00 vs 1.83) and `cc_longest_function` (7.40 vs 10.17) move in
opposite directions and stay within replicate variation.

Runtime spreads out rather than shifting uniformly: candidate duration ranges
from 411 to 1785 seconds (baseline 378–722) and `total_tokens` from 5.9 M to
36.7 M (baseline 6.0–12.8 M). The two slowest candidate runs are also the two
with 12 refactorings, against 4–5 in every baseline run; two other candidate runs
finish in 5 cycles. The extraction thus redistributes effort across the Refactor
phase instead of removing a marker, as H3 predicted.

## F-1.20.4 — Complete stack-profile extraction is not behaviour-neutral on the Opus/Hybrid line

- **H1 (behavioural neutrality)** does not hold on Claim Office: the candidate
  introduces a turn-end at the Test-List → Red handoff (F-1.20.1). It holds on
  Game of Life for correctness, TDD markers and predictions.
- **H2 (no quality loss)** holds for the runs that complete, on both katas.
- **H3 (attention redistribution)** is supported: the first witnesses are duration,
  tokens and refactoring dispersion (F-1.20.2, F-1.20.3), while all four parser
  markers stay intact.
- **H4 (novel-kata guard)** is confirmed: the completeness loss is visible only on
  Claim Office, while Game of Life correctness is saturated in both arms.

Given the refill caveat, the candidate's real Claim Office failure rate is at
least the observed one-in-five and plausibly higher. `exact-hybrid-v2.9-stack-profile-cc`
is not a drop-in replacement for the baseline. The comparable extraction on the
Sol line (RQ-stack-profile-extraction-sol) was neutral, so the handoff failure is
specific to this workflow line or harness and not a general cost of moving stack
details into a profile. A clean estimate needs a fresh, unselected batch of both
arms on the same image.
