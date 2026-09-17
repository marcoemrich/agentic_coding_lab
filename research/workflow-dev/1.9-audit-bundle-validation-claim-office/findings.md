# RQ-audit-bundle-claim-office Findings

## Overview

Primary outcomes per cell (n=8 per workflow, opus-4-7-portkey-no-thinking, claim-office-example-mapping). 🏆 = best value per outcome; outcomes whose hybrid-v4.3 value is distorted by early run termination get no trophy.

| Outcome (direction)                                          | exact-hybrid-v4-cleaned-cc | exact-hybrid-v4.3-audit-bundle-cc              |
|-------------------------------------------------------------|-----------------------|--------------------------------|
| Correctness (external) (`verification_pct`, higher = better) | **0.96 ± 0.09** 🏆    | 0.35 ± 0.41 (bi-modal)         |
| `tests_passing` (sanity)                                    | 100 %                 | 100 %                          |
| `completed_within_budget` (sanity)                          | 100 %                 | 100 %                          |
| `cycle_count` (on claim-office, higher = more complete)     | **37.4 ± 1.6** 🏆     | 11.3 ± 6.1                     |
| `tests_passed_immediately` (lower = better)                 | 15.1 ± 5.84           | **0.6 ± 1.41** 🏆 (but see context) |
| `refactorings_applied` (context-dependent — tracks cycle_count) | 24.9 ± 6.90       | 12.0 ± 9.97                    |
| `predictions_correct_rate` (higher = better, pooled)        | 97.2 %                | 94.9 %                         |
| Code Mass (APP) (`code_mass`, misleading here)              | 878.5 ± 91.4          | 441.5 ± 335.6 (due to early stop) |
| Smell Total (`smell_total`, lower = better)                 | **0.38 ± 0.74**       | 0.50 ± 0.76                    |
| Complexity Peak (`cc_longest_function`)                     | 12.4 ± 1.41           | 13.1 ± 7.06                    |
| `total_tokens` (lower due to early stop, not a win)         | 44.4 M ± 3.4          | 16.7 M ± 15.0                  |
| `duration_seconds` (lower due to early stop, not a win)     | 2530 ± 401            | 1059 ± 943                     |

---

## F-1.9.1 — The audit bundle breaks correctness on claim-office from 96 % to 35 %

`verification_pct` falls from 0.96 ± 0.09 (all runs ≥ 0.73) to **0.35 ± 0.41** (bi-modal distribution, 6 of 8 runs below 0.30).

| workflow | mean | σ | min | max |
|---|---:|---:|---:|---:|
| exact-hybrid-v4-cleaned-cc | 0.96 | 0.09 | 0.73 | 1.00 |
| exact-hybrid-v4.3-audit-bundle-cc     | 0.35 | 0.41 | 0.00 | 1.00 |

The break is not of the "implementation is wrong" kind but "implementation is incomplete": internal `tests_passing` shows 100 %, the CLI builds (cli_built=true), but the agent declares itself done in the middle of the kata.

H5 (the falsifier from the RQ README) has therefore occurred: the audit bundle is not independently effective on claim-office. hybrid-v4.3 remains a GoL-specific code-quality champion without claim-office default-baseline status.

---

## F-1.9.2 — Bi-modal completeness: 6 of 8 runs stop prematurely

`cycle_count` falls from 37.4 ± 1.6 (claim-office has 41 test steps; hybrid-v4 completes all of them) to **11.3 ± 6.1** with extreme variance. `experiment-done.txt` is missing in 6 of 8 hybrid-v4.3 runs.

| outcome | hybrid-v4 | hybrid-v4.3 |
|---|---:|---:|
| cycle_count mean | 37.4 | 11.3 |
| cycle_count σ | 1.6 | 6.1 |
| duration_seconds mean | 2530 (~42 min) | 1059 (~18 min) |
| duration_seconds σ | 401 | 943 |
| `experiment-done.txt` present | 0/8 (hybrid-v4 convention) | 2/8 |

The two hybrid-v4.3 runs with `experiment-done.txt` reach `verification_pct = 1.0` (12 cycles in 13 min and 25 cycles in 56 min). The six without reach 0.00–0.27 with 7–14 cycles and 8–19 min wallclock — the agent gives up in the middle of the test list without an explicit done marker.

Pattern hypothesis: the audit bundle (mandatory-procedure preamble + refactor three-path bar + wrong-predictions block) creates more per-cycle effort on the multi-iteration kata, and the agent interprets the obligation to complete cycles with discipline as an implicit done signal after a few complete cycles. On the shorter GoL kata (9 tests) this does not surface.

---

## F-1.9.3 — The mandatory preamble eliminates premature greens, but the effect size is irrelevant given the early stop

`tests_passed_immediately` falls from 15.1 ± 5.84 to **0.6 ± 1.41**. The pattern is identical to the RQ-1.8 observation on GoL — the preamble works mechanically as expected.

But the effect size here is not a discipline gain: in 6 of 8 hybrid-v4.3 runs the agent gets through only 7–14 cycles. Premature greens would have had no opportunity to arise there — because the agent never gets that far. The metric measures the preamble's effect, not a discipline gain.

In the two hybrid-v4.3 runs that do complete (cycle_count 12 and 25, ver=1.0), `tests_passed_immediately` stands at 0 and 4 — so lower than the hybrid-v4 baseline there too.

---

## F-1.9.4 — Code quality metrics lower, but distorted by incompleteness

| outcome | hybrid-v4 | hybrid-v4.3 | interpretation |
|---|---:|---:|---|
| Code Mass (APP) (`code_mass`)           | 878.5 ± 91  | 441.5 ± 336 | hybrid-v4.3 has half as much code because only ~⅓ of the tests are implemented |
| `cognitive_max`                         | 5.0 ± 1.77  | 3.4 ± 2.07  | ditto — less complex functions because less logic |
| `mccabe_max`                            | 4.5 ± 0.76  | 3.75 ± 1.67 | ditto |
| Complexity Peak (`cc_longest_function`) | 12.4 ± 1.41 | 13.1 ± 7.06 | mean equal; σ five times larger (bi-modal) |
| Smell Total (`smell_total`)             | 0.38 ± 0.74 | 0.50 ± 0.76 | both near 0, indistinguishable |

The lower complexity values are not a code quality gain — they reflect the incomplete implementation. A fairer comparison base would be per-cycle complexity at an equal number of implemented tests; the pipeline does not measure that directly. Until then, all code quality outcomes on this kata are not meaningfully comparable between hybrid-v4 and hybrid-v4.3.

---

## F-1.9.5 — Recommendation: do not promote hybrid-v4.3 as the default baseline for claim-office

- exact-hybrid-v4-cleaned-cc remains the default baseline for correctness-critical work on claim-office × opus-4-7-portkey-no-thinking.
- exact-hybrid-v4.3-audit-bundle-cc is a clear discipline and code quality gain on GoL (RQ-1.8) but flips into a bi-modal completeness break on claim-office.
- Follow-up options should hybrid-v4.3 be made repairable:
  - **Isolated sub-RQs** for the two audit-bundle classes (class-2 rationales vs class-3 red hardening), to localize which class drives the stopping behavior.
  - **Tighten the done gate**: `tdd-experiment-mode.md` could require an explicit test-list-count vs active-tests check before `experiment-done.txt` (analogous to the archived audit finding 11d).
  - **Cross-kata RQ**: the same audit-bundle test on `mars-rover` (medium difficulty, novel) to triangulate whether the flip is claim-office-specific or novel-kata-specific.
