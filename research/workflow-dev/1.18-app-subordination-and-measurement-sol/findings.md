# Findings — RQ-app-subordination-measurement-sol

## Overview

Claim Office, example-mapping, Sol on the OpenAI subscription route. Five runs
per cell, 25 total. Basis = `exact-sol-v1-pi`; A = `exact-sol-v1.2-app-pi`;
B1/B2/B3 = the measured-model/measured-eslint/measured-tool descendants.

| Outcome | Basis | A | B1 | B2 | B3 |
|---|---:|---:|---:|---:|---:|
| Correctness (external) | 100% | 100% | 100% | 100% | 100% |
| Correctness (internal) | 100% | 100% | 100% | 100% | 100% |
| Completed within budget | 100% | 100% | 100% | 100% | 100% |
| `cc_avg_loc_per_function` | 7.42 | 6.72 | 7.12 | 7.88 | 7.11 |
| `cc_median_loc_per_function` | 4.50 | 5.80 | 5.30 | 6.40 | 6.00 |
| Complexity Peak | 20.8 | 15.8 | 18.0 | 18.2 | 16.2 |
| `cognitive_max` | 4.8 | 5.4 | 3.4 | 3.8 | 4.6 |
| `cognitive_avg` | 2.10 | 2.11 | 2.02 | 2.25 | 2.16 |
| `mccabe_max` | 5.6 | 5.6 | 4.2 | 4.8 | 4.4 |
| Smell Total | 0 | 0 | 0 | 0 | 0 |
| Production LoC | 117.6 | 148.8 | 141.2 | 141.2 | 130.4 |
| `cc_functions` | 8.4 | 11.0 | 10.2 | 9.2 | 8.6 |
| Code Mass (APP) | 562.6 | 590.6 | 534.8 | 581.2 | 534.4 |
| `cycle_count` | 33.4 | 30.6 | 31.6 | 32.4 | 34.8 |
| `refactorings_applied`, markers | 33.2 | 30.6 | 31.6 | 32.6 | 34.8 |
| Prediction accuracy, pooled | 99.3% | 97.1% | 98.6% | 98.7% | 99.0% |
| Duration, seconds | 1083.8 | 1226.2 | 1011.4 | 1142.8 | 1181.4 |
| `total_tokens` | 4.869 M | 4.493 M | 5.758 M | 6.635 M | 8.221 M |
| `cost_usd` | $3.66 | $3.58 | $4.55 | $5.03 | $5.96 |

All values are means except pooled rates. Full SDs and ranges:
[summary.md](summary.md). All cells meet the 0.90 correctness gate. Lower is
preferable for length, complexity, smells and cost at equal correctness, but
no overall trophies are assigned: the reference is a different cohort, and
within A/B the leading quality/cost values overlap broad replicate variation.
Code Mass is the mechanism witness, not a quality rank; function and marker
counts have no simple better direction.

**Cohort limitation:** Basis contains September 13 runs with pi 0.81.1 and the
development dependency environment. A and B1–B3 are historical. Date and
execution environment confound reference contrasts. A/B comparisons retain their
shared historical cohort. This update reaggregates existing metrics and restores
list-price costs; it does not rerun experiments or their analysis pipelines.

## F-1.18.1 — Subordination has mixed decomposition results against the reference

| Metric | Basis, mean ± SD | A, mean ± SD | A minus Basis |
|---|---:|---:|---:|
| `cc_avg_loc_per_function` | 7.42 ± 1.04 | 6.72 ± 0.34 | −0.70 |
| `cc_median_loc_per_function` | 4.50 ± 0.87 | 5.80 ± 0.84 | +1.30 |
| Complexity Peak | 20.8 ± 2.39 | 15.8 ± 2.39 | −5.0 |
| `cognitive_max` | 4.8 ± 2.39 | 5.4 ± 2.88 | +0.6 |
| Code Mass (APP) | 562.6 ± 48.81 | 590.6 ± 66.06 | +28.0 |

A has shorter longest functions, but longer median functions. The average-length
difference is below the Basis SD. This is neither uniform improvement nor an
established null effect. A's average length (6.72) also differs from the APP-heavy
hybrid's 9.52 in RQ-1.17, but that comparison changes architecture as well as the
brief. The prohibition against inlining merely to lower APP is a plausible
mechanism, not causally isolated by these data. H1's joint improvement of average
and median function length is not demonstrated.

## F-1.18.2 — Measured arms favour the measured complexity metrics in their means

| Metric | A | B1 | B2 | B3 |
|---|---:|---:|---:|---:|
| `cognitive_max` | 5.4 | 3.4 | 3.8 | 4.6 |
| `mccabe_max` | 5.6 | 4.2 | 4.8 | 4.4 |
| `cc_avg_loc_per_function` | 6.72 | 7.12 | 7.88 | 7.11 |
| Code Mass (APP) | 590.6 | 534.8 | 581.2 | 534.4 |

All B arms have lower mean cognitive/McCabe peaks but higher average function
length than A. This is consistent with attention to branching rather than
function decomposition. Broad variation (A cognitive SD 2.88) limits the claim:
measurement is not proven to improve a metric universally. The AST mass used
inside B3 is not the pipeline's grep-derived Code Mass (APP), and the two must
not be equated.

## F-1.18.3 — Deterministic measurement uses more tokens than hand measurement

| Outcome | B1 | B2 | B3 |
|---|---:|---:|---:|
| Tokens, mean ± SD | 5.758 M ± 0.957 M | 6.635 M ± 2.010 M | 8.221 M ± 0.768 M |
| List-price cost | $4.55 | $5.03 | $5.96 |
| Duration, seconds | 1011.4 | 1142.8 | 1181.4 |
| `cognitive_max` | 3.4 | 3.8 | 4.6 |

B3 consumes about 43% more tokens and 31% more list-price cost than B1, without
better mean complexity. The 2.463 M token gap exceeds both SDs; B1/B2 is less
clearly separated. Repeated tool output increasing later context traffic is a
plausible explanation. A causal claim that hand arithmetic itself produces
better judgment would require a targeted test, not these means alone.

## F-1.18.4 — Duration does not establish a reference-to-brief penalty

| Cell | Duration, mean ± SD (seconds) | Difference from Basis |
|---|---:|---:|
| Basis | 1083.8 ± 251.77 | — |
| A | 1226.2 ± 186.49 | +13.1% |
| B1 | 1011.4 ± 115.05 | −6.7% |
| B2 | 1142.8 ± 214.00 | +5.4% |
| B3 | 1181.4 ± 111.35 | +9.0% |

A is slowest in the means but has the fewest tokens (4.493 M). Its 142.4-second
reference gap is below the Basis SD and is cohort-confounded. The data do not
identify extra reasoning caused by brief length. Duration and token totals are
not interchangeable, but neither alone measures hidden deliberation time.

## F-1.18.5 — Measurement frequency varies despite the per-refactor mandate

The existing transcript inspection of the unchanged measured arms documents:

| Arm | Refactor markers | Measurement blocks | Tool calls |
|---|---:|---:|---|
| B1 | 30–34 | 1–46 | no measurement tool |
| B2 | 23–40 | 1–36 | 4–9 |
| B3 | 30–37 | 15–64 | 5–21 APP, 2–11 ESLint |

Instrument choice distinguishes the arms, but frequency is inconsistent with a
uniform measurement ritual. Marker counts include no-op reviews; they do not
prove a corresponding number of code changes. Partial compliance is a possible
source of variability, not evidence that measured effects are lower bounds:
stronger enforcement could improve, worsen or leave them unchanged.

## Scope

No clear overall winner follows. The reference-to-A contrast needs a fresh
same-image comparison; the A/B token result remains an observation within their
shared cohort. Further tests should separate Rule 2/3 elaboration from APP,
check other routes/models, and make measurement events auditable. Costs are
list-price equivalents, not subscription charges; all 25 costs are populated.
