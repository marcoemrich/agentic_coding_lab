# RQ-stability Findings

Persistent collection of the insights on the question:
**How stable is code quality per workflow across replicates, and under
which conditions is n=3 a sufficient replicate count?**

Data basis: 60 runs (6 cells × n=10), as of 2026-05-15. Model
`opus-4-7-no-thinking`, kata `game-of-life` (library form) with an explicit
API contract. Stability analysis via subsampling
(`research/questions/5.1-workflow-stability/subsample-analysis.py`).

---

## Overview: Code Quality by Workflow (n=10)

| Workflow | `code_mass` | `smell_total` | `mccabe_max` | `cognitive_max` | `cc_longest_function` | n |
|---|---:|---:|---:|---:|---:|---:|
| v1-oneshot (prose) | 155.00 | 4.80 | 12.80 | 18.80 | 31.70 | 10 |
| v2-iterative (prose) | 157.80 | 4.10 | 11.60 | 16.20 | 32.10 | 10 |
| v3-basic-tdd (EM) | 165.60 | 6.00 | 13.70 | 21.80 | 32.50 | 10 |
| v4-exact-subagents (EM) | 166.60 | 2.60 | **4.50** | **4.40** | **8.10** | 10 |
| v5-exact-single-context (EM) | **152.60** | 4.10 | 8.90 | 14.50 | 17.40 | 10 |
| v6-hybrid (EM) | 158.60 | **2.20** | **4.50** | 5.20 | 13.10 | 10 |

Best value per column in bold. Lower = better.

---

## F-stability.1 — The Main RQ-tdd-quality Finding (v4 Dominates Code Complexity, v3 Is Last) Replicates at n=10 with the Same Sign ✅ stable

**Statement**: At n=10 the pattern observed in RQ-tdd-quality with n=3 is
fully confirmed:

| Metric | RQ-tdd-quality (n=3) | RQ-stability (n=10) | Ranking change? |
|---|---|---|---|
| `cognitive_max` v4 best | 2.83 | 4.40 | unchanged (v4 strongly ahead) |
| `cognitive_max` v3 worst | 23.33 | 21.80 | unchanged (v3 at the back) |
| `mccabe_max` v4 best | 4.00 | 4.50 | unchanged |
| `cc_longest_function` v4 best | 9.33 | 8.10 | unchanged |
| `smell_total` v4 best | 2.50 | 2.60 | unchanged |

v4 remains clearly first on all four complexity outcomes, v3 remains
last. **H4 (the RQ-tdd-quality finding holds at n=10) confirmed** — the central
statements from F-tdd-quality.1/F-tdd-quality.2 are not an n=3 artifact.

**Data basis**: 50 runs (10 per cell). Drift of the means compared to RQ-tdd-quality
(n=3) is typically < 15 % on the complexity outcomes.

**An important shift in the middle of the field**: The order between v1,
v2 and v5 on `cognitive_max` changes:

- RQ-tdd-quality (n=3): v2 (16.7) < v5 (18.3) < v1 (20.7)
- RQ-stability (n=10): v5 (14.5) < v2 (16.2) < v1 (18.8)

v5 slides from the middle of the field into the front section. The n=3 values
for v5 were dominated by a few high runs; at n=10 a
broader distribution with a lower mean emerges. This is the first concrete
indication that n=3 is ranking-unstable for workflows with a high spread (see F-stability.2).

---

## F-stability.2 — Workflow Stability Is Not Uniform; v4 Has a 10 % Outlier Rate Despite a Low Typical Value; v5 Is the Broadest Workflow ✅ stable

**Statement**: Stability indicators per cell (cognitive_max as the main example):

| Workflow | μ | σ | CV (σ/μ) | IQR | Outlier rate (>2σ) |
|---|---:|---:|---:|---:|---:|
| v3-basic-tdd | 21.80 | 3.43 | 0.157 | 5.50 | 0 % |
| v1-oneshot | 18.80 | 3.40 | 0.181 | 3.25 | 10 % |
| v2-iterative | 16.20 | 3.40 | 0.210 | 5.00 | 0 % |
| v5-exact-single-context | 14.50 | 4.59 | 0.316 | 7.75 | 10 % |
| v6-hybrid | 5.20 | **2.30** | 0.442 | ~3 | **0 %** |
| v4-exact-subagents | 4.40 | 4.25 | 0.965 | **1.25** | 10 % |

Three stability profiles:

- **v1/v2/v3** are "**band-shaped**": σ ~3.4 with a moderate IQR (3–6),
  values concentrated around the mean. These workflows consistently produce
  similar code quality — both the mean values and the
  individual runs are comparable.
- **v4 is "**concentrated with a tail**": IQR only 1.25 (8/10 runs in [2, 4]),
  but one outlier at 17 pulls σ and the mean up. Median = 3, compared to a
  mean of 4.4. The typical v4 performance is *considerably better* than the
  mean suggests — but 1 in 10 runs derails.
- **v5 is "**broad**": σ 4.59, IQR 7.75. v5 runs are generally
  unpredictable in complexity — the shared context lets
  very different implementations arise path-dependently.
- **v6 is "**compact without a tail**": σ 2.30, all 10 runs in [1, 7],
  0 % outlier rate. v6 reaches near-v4 median performance (5.2 vs 4.4)
  without v4's 1-in-10 refactor dropout. Plausible mechanic: the
  isolated refactor subagent is formally invoked in every TDD cycle
  (see F-stability.6, cycle σ=0.82) — the "refactor phase skipped"
  failure mode from v4 is structurally excluded by the hybrid construction.

The **CV is misleading as a stand-alone stability measure**: v4 has CV 0.965
(the highest relative spread) although 9/10 runs lie in an extremely narrow
range [2, 4] — this only arises because μ is small and one
outlier dominates the σ estimate. IQR and outlier rate tell the
correct story: v4 is *in the typical case* the most stable workflow,
with occasional refactor dropouts.

**Data basis**: 50 runs. The outlier rate column is very coarse at n=10 (a
single outlier = 10 %).

**Mechanic of the v4 outlier** (inspected manually): The one v4 run with
cognitive_max=17 contains the entire logic in a single 28-line
arrow function — the refactor phase did not split the code into smaller
functions. Correctness is nevertheless 100 %. This suggests
a rare failure mode in which v4 performs no structural improvement in the
refactor subagent phase.

---

## F-stability.3 — At n=3 the Full Workflow Ranking Is Correct in Only ~25–60 % of Cases; v4 as the "Best" Is More Robust ✅ stable

**Statement**: From 1000 random trials in which a three-element subsample
is drawn from each cell and the workflow ranking is computed from it,
the following hit rate against the n=10 ground-truth
ranking results:

| Metric | P(n=3 ranking = n=10 ranking) | n=10 ranking |
|---|---:|---|
| `code_mass` | 15.9 % | v5 < v1 < v2 < v3 < v4 |
| `smell_total` | 25.2 % | v4 < v2 ≈ v5 < v1 < v3 |
| `cc_longest_function` | 23.6 % | v4 < v5 < v1 < v2 < v3 |
| `mccabe_max` | 62.5 % | v4 < v5 < v2 < v1 < v3 |
| `cognitive_max` | 50.5 % | v4 < v5 < v2 < v1 < v3 |

For calibration: with 5! = 120 possible rankings, chance would be 0.83 %.
All values are therefore far above chance.

Nevertheless: **the full 5-workflow ordering cannot be reliably
reconstructed with n=3**, particularly in the middle of the field (v1, v2, v5
on cognitive_max). For `cc_longest_function` and `smell_total`,
n=3 suffices in only ~25 % of cases.

That does not mean, however, that all statements from n=3 are worthless:

- **Reproducibility score** (the share of three-element subsamples with a mean
  within ±20 % of the n=10 mean): ≥ 0.92 on all outcomes for v1, v2, v3.
  n=3 delivers robust estimates of the mean here.
- **v4 as the winner on cognitive_max** is reliably identifiable even with
  n=3 subsamples — v4 has a ~3× smaller typical value than
  every other workflow.
- **v3 as last on cognitive_max** is equally robust (v3 mean 21.8,
  σ 3.43; no other workflow reaches these values).

The weakness of n=3 lies in the **middle of the field** — v1 vs v2 vs v5
differ by ~2–5 points on cognitive_max at σ ~3.4, which is
not discriminable with n=3.

**Consequence for the lab methodology**:
- Statements such as "v4 is clearly better than everything else" or "v3 is
  worse than non-TDD": **n=3 suffices** (large effect size + low
  IQRs of the non-v4 workflows).
- Statements such as "workflow A is marginally better than workflow B" (e.g.
  v2 vs v5): **n=10+ required**, otherwise the ranking is unstable.

---

## F-stability.4 — Correctness Stays at 100 % Independently of Model/Workflow at n=10 ✅ stable

**Statement**: Across all 60 runs (including the 10 new v6-hybrid runs),
every workflow reaches `tests_passing = 100 %` and `verification_pct = 1.00`.
The correctness stability under the API contract documented in RQ-tdd-quality F-tdd-quality.4
is confirmed by the larger n: no hidden outlier failures that
would have remained undetected at n=3.

**Data basis**: 60 runs (6 workflows × n=10), 15 verification scenarios each.

---

## F-stability.5 — Token Consumption Shows an Extremely High Spread for v4 and v5 ⚠️ conditional

**Statement**: Token consumption (n=10):

| Workflow | μ | σ | CV |
|---|---:|---:|---:|
| v3-basic-tdd | 799 074 | 187 141 | 0.234 |
| v1-oneshot | 993 521 | 223 585 | 0.225 |
| v2-iterative | 966 999 | 175 027 | 0.181 |
| v4-exact-subagents | 2 561 890 | 382 603 | 0.149 |
| v5-exact-single-context | 8 355 280 | 2 889 180 | 0.346 |

**v5 is both the most expensive in absolute terms and the most unstable in relative terms**:
individual v5 runs fluctuate between 4.6 M and 11.7 M tokens. v4 has
relative stability (CV 0.15), but its **wallclock σ** is very
high at 984 s (max run = 3923 s ≈ 65 min vs. a typical ~14 min) — a single
v4 run took almost 5× as long as the median.

**Consequence for cost planning**: v5 token budgets must be laid out
generously (worst case ~12 M); v4 wallclock budgets likewise
generously (worst case ~65 min). For commercial use of both
workflows, these tails must be budgeted for.

**Condition**: ⚠️ conditional — n=10 is tight for tail characterization;
robust tail quantiles (P99, P95) would need n=30+.

---

## F-stability.6 — TDD Discipline Forms Workflow-Characteristic Bands ✅ stable

**Statement**: The four TDD discipline indicators (`cycle_count`,
`refactorings_applied`, `predictions_correct_rate`, `tests_passed_immediately`)
separate the six workflows into **four discipline classes**:

| Workflow | `cycle_count` μ±σ | `refactorings_applied` μ±σ | `predictions_correct_rate` | `tests_passed_immediately` μ±σ | Discipline class |
|---|---:|---:|---:|---:|---|
| v1-oneshot | 1.0 ± 0 | 0.0 ± 0 | — | 1.0 ± 0 | **structurally empty** |
| v2-iterative | 1.0 ± 0 | 0.0 ± 0 | — | 1.0 ± 0 | **structurally empty** |
| v3-basic-tdd | 1.5 ± 0.97 | 0.1 ± 0.32 | — | 0.5 ± 0.97 | **phantom TDD** |
| v5-exact-single-context | 6.7 ± **2.67** | 6.0 ± **3.09** | 100.0 % | 0.9 ± 1.66 | **broadband discipline** |
| v4-exact-subagents | 7.8 ± 0.92 | 5.9 ± 2.02 | 98.0 % | 3.3 ± 2.87 | **narrow bands, strict discipline** |
| v6-hybrid | **8.3 ± 0.82** | 4.0 ± 1.63 | 99.4 % | 3.3 ± 3.02 | **narrowest bands, strictest discipline** |

**Rationale**: The four classes are consistently defined across three
indicators:

- **v1/v2 (structurally empty)**: no cycles, no refactorings, no
  predictions — structurally without TDD discipline (by workflow definition).
  `tests_passed_immediately = 1` is an artifact of the metrics code:
  the tests written after the implementation all run green at once.

- **v3 (phantom TDD)**: despite the formal TDD instruction in the workflow, no
  real cycles (μ=1.5 — typically a single mega cycle),
  practically no refactorings (μ=0.1), no consistent prediction format
  (`predictions_total = 0` across all 10 runs, hence excluded from the rate
  column). Replicates the F-prompt-correctness.10 pattern from the archive (`rqs-v1`):
  v3 fulfills TDD only nominally.

- **v4 / v6 (narrow bands, strict discipline)**: cycle σ < 1.0,
  refactorings σ ≈ 1.6–2.0, predictions ≥ 98 %. v6 even has the narrowest
  cycle band of all (σ=0.82), enforced by the hybrid construction:
  each cycle must be formally concluded by the refactor subagent
  before the next red phase starts in the main context.

- **v5 (broadband discipline)**: means as high as v4 for
  cycles and refactorings, but a **3–4× broader spread**
  (refactorings σ=3.09 vs v4 σ=2.02). The shared single context allows
  different path realizations — one run can have 0 refactorings,
  another 8. On the long CLI kata claim-office, this spread collapses
  into a clear loss of discipline (RQ-workflow-tradeoff F-workflow-tradeoff.4):
  v5 falls to 3.4 cycles there, while v4 and v6 stay at 25–37.

`tests_passed_immediately` (an indicator of over-implementation): v4 and v6
have the highest mean (3.3). Plausibly: in both workflows the
test list is laid out completely in advance, after which the first
real test is made green — in the process several `it.todo` tests are also satisfied by the
minimal green implementation. This is not a discipline breach
in the narrower sense but a structural consequence of the test-first phase.

**Data basis**: 60 runs (6 workflows × n=10), `opus-4-7-no-thinking`,
`game-of-life-example-mapping` and `game-of-life-prose` (for v1/v2). For
v3, `predictions_correct_rate` drops out because v3 does not emit the prediction
format consistently.

**Consequence for workflow selection**: The discipline bands are
*orthogonal* to code quality — v5 reaches high discipline means with a
broad spread, v6 reaches similar means with the narrowest spread. If
*reproducibility of the discipline indicators* is itself a workflow goal
(e.g. for auditable development logs), v6 is the most robust choice.

---

## F-stability.7 — Test Strength (`mutation_score`) Has Its Own Stability Profile; v6-hybrid Is the Most Stable Workflow, v4 the Least Stable ✅ stable

**Statement**: The mutation score (the share of killed mutants, Stryker) shows a
**different** stability ranking than the code-complexity metrics from
F-stability.1/F-stability.2. On game-of-life (n=10 per workflow):

| Workflow | `mutation_score` mean | std | min | max |
|---|---:|---:|---:|---:|
| **v6-hybrid** | **0.953** | **0.005** | 0.940 | 0.957 |
| v2-iterative | 0.954 | 0.006 | 0.939 | 0.960 |
| v1-oneshot | 0.953 | 0.009 | 0.933 | 0.962 |
| v3-basic-tdd | 0.949 | 0.009 | 0.938 | 0.962 |
| v5-exact-single-context | 0.945 | 0.036 | 0.843 | 0.965 |
| **v4-exact-subagents** | 0.908 | **0.080** | **0.735** | 0.957 |

**Notable points:**

- **v6-hybrid** delivers the lowest spread (σ=0.005) AND at the same time the
  highest mean (level with v1/v2). On the complexity metrics v4 was
  dominant; on test strength v6 is dominant. The hybrid architecture
  (skill-based red/green + isolated refactor) appears to eliminate v4's
  test-strength spread without losing test strength itself.
- **v4** again shows the tail risk documented in F-stability.2: σ=0.080,
  min 0.735 — several v4 runs lie clearly below the typical
  v4 value. The isolated green phase appears to occasionally produce weak
  test generalization.
- **v5** likewise has an elevated spread (σ=0.036, min 0.843) — the single context
  is more robust than v4 on test strength, but not as smooth as v1/v2/v3/v6.
- v1/v2/v3 (non-TDD or minimal TDD) cluster at mean ≈0.95, σ≈0.008 —
  despite differing workflow philosophies they are indistinguishable in
  test strength on game-of-life.

**Consequence for H1 (the n=3 question)**: For `mutation_score`, n=3 would be
particularly unreliable for v4 — three draws from a distribution with σ=0.080
and min 0.735 can, depending on luck, deliver a completely different picture of v4.
For v6 and v1/v2/v3, n=3 would by contrast be sufficient (σ < 0.01). The
**outlier asymmetry from F-stability.2 repeats itself for test strength**: v4 has
a broad tail distribution, other workflows do not.

**Data basis**: 60 game-of-life runs, opus-4-7-no-thinking, EM for
v3/v4/v5/v6 and prose for v1/v2. Stryker 8.6.0.

---

## Caveats

- **Single model**: Only `opus-4-7-no-thinking`. A model change could shift the
  stability picture — RQ-model-quality suggests a higher Sonnet spread,
  but only at n=3.
- **Single kata**: Only Game of Life (library form). Other katas
  (claim-office, mars-rover) could show different stability profiles,
  particularly if the problem has a more variable solution space.
- **Tail estimation**: n=10 gives rough σ estimates with wide
  confidence intervals. Outlier rates of 10 % each correspond to a
  single run — the true rate can lie between 0 and 30 %.
- **Subsampling as a validity measure**: The `P(n=3 ranking = n=10 ranking)`
  numbers are themselves derived from 50 runs — a hypothetical n=20
  could show finer conditions for n=3 reliability.
- **v4 refactor dropout**: The 1-in-10 run with cognitive=17 is a
  concrete occasion for improving the v4 workflow (the refactor phase must
  be triggered more reliably). This is not part of this RQ, but is
  documented for future workflow iterations.
