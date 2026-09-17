# Findings — RQ-native-sol-workflows-sub

## Overview

45 runs, nine cells, n=5 each; Sol on the OpenAI subscription route with
example-mapping prompts. Floor = `baseline-inline-tdd-v1-pi`, Inline =
`exact-sol-v1-pi`, Isolated = `exact-sol-v1.1-subagent-pi`.
All cells have 100% internal test success and completion within budget.

### Claim Office

| Outcome | Floor | Inline | Isolated |
|---|---:|---:|---:|
| Correctness (external) | 100% | 100% | 93% |
| `cognitive_max` | 11.4 ± 10.01 | 4.8 ± 2.39 | 4.8 ± 2.39 |
| `cognitive_avg` | 3.40 | 2.10 | 2.33 |
| `mccabe_max` | 9.8 | 5.6 | 5.0 |
| Smell Total | 4.2 | 0 | 0 |
| Complexity Peak | 27.0 ± 11.34 | 20.8 ± 2.39 | 18.4 ± 3.65 |
| `cc_avg_loc_per_function` | 8.45 | 7.42 | 7.75 |
| Code Mass (APP) | 750.0 | 562.6 | 618.0 |
| `cycle_count` | n/a | 33.4 | 33.2 |
| Refactor markers | n/a | 33.2 | 32.2 |
| Prediction accuracy, pooled | n/a | 99.3% | 99.4% |
| Duration, seconds (lower is better) | **218.2** 🏆 | 1083.8 | 2397.2 |
| Tokens (lower is better) | **0.272 M** 🏆 | 4.869 M | 7.126 M |
| List-price cost (lower is better) | **$0.58** 🏆 | $3.66 | $7.40 |

### Game of Life

| Outcome | Floor | Inline | Isolated |
|---|---:|---:|---:|
| Correctness (external) | 100% | 100% | 100% |
| `cognitive_max` | 4.4 | 4.2 | 5.2 |
| `cognitive_avg` | 2.67 | 3.17 | 3.07 |
| `mccabe_max` | 4.0 | 4.4 | 4.6 |
| Smell Total | 0 | 0 | 0 |
| Complexity Peak | 11.2 | 14.0 | 12.8 |
| `cc_avg_loc_per_function` | 6.75 | 7.44 | 7.01 |
| Code Mass (APP) | 176.4 | 156.8 | 167.4 |
| `cycle_count` | n/a | 9.8 | 9.0 |
| Refactor markers | n/a | 9.8 | 9.8 |
| Prediction accuracy, pooled | n/a | 100% | 100% |
| Duration, seconds (lower is better) | **126.8** 🏆 | 400.2 | 687.6 |
| Tokens (lower is better) | **0.153 M** 🏆 | 0.933 M | 1.743 M |
| List-price cost (lower is better) | **$0.36** 🏆 | $1.03 | $2.31 |

### Sphinx Score

| Outcome | Floor | Inline | Isolated |
|---|---:|---:|---:|
| Correctness (external) | 100% | 99% | 96% |
| `cognitive_max` | 2.2 | 1.8 | 1.6 |
| `cognitive_avg` | 1.90 | 1.80 | 1.60 |
| `mccabe_max` | 3.2 | 2.8 | 2.6 |
| Smell Total | 0 | 0 | 0 |
| Complexity Peak | 15.4 | 13.2 | 16.2 |
| `cc_avg_loc_per_function` | 14.5 | 13.2 | 15.9 |
| Code Mass (APP) | 129.6 | 129.2 | 136.0 |
| `cycle_count` | n/a | 11.8 | 11.2 |
| Refactor markers | n/a | 12.0 | 11.6 |
| Prediction accuracy, pooled | n/a | 100% | 100% |
| Duration, seconds (lower is better) | **144.8** 🏆 | 440.2 | 945.8 |
| Tokens (lower is better) | **0.275 M** 🏆 | 1.572 M | 2.476 M |
| List-price cost (lower is better) | **$0.46** 🏆 | $1.65 | $3.18 |

Means, with sample SD where shown. All cells pass the standard 0.90 correctness
gate. Quality contrasts are not crowned where variation overlaps; Code Mass is
not ranked because it can reward missing abstraction. The floor's efficiency
advantage is clear within each kata; no cross-kata trophy is awarded. TDD markers
are n/a for the floor and are not independently verified improvements elsewhere.

**Cohort limitation:** Inline on Claim Office and Game of Life consists of
September 13 fresh-comparison runs (pi 0.81.1, development dependency environment).
The remaining cells are historical. Comparisons involving these references are
not contemporaneous and confound workflow with date/environment. The means below
are descriptive associations, not proof of a workflow mechanism.

## F-1.16.1 — Claim Office favours the native inline arm in observed quality means

| Outcome | Floor | Inline |
|---|---:|---:|
| Correctness (external) | 100% | 100% |
| `cognitive_max` | 11.4 ± 10.01 | 4.8 ± 2.39 |
| Complexity Peak | 27.0 ± 11.34 | 20.8 ± 2.39 |
| Average function length | 8.45 ± 2.41 | 7.42 ± 1.04 |
| Smell Total | 4.2 ± 9.39 | 0.0 ± 0.00 |

Inline has lower means and less spread, but these gaps are below the floor's
SD. The worst cognitive peak is 9 for Inline versus 29 for the floor. This
supports a provisional quality preference, not a decisive causal claim that
architecture clears the floor. The cohort limitation applies.

## F-1.16.2 — Game of Life has no clear native quality advantage over the floor

| Outcome | Floor | Inline | Isolated |
|---|---:|---:|---:|
| `cognitive_max` | 4.4 | 4.2 | 5.2 |
| Complexity Peak | 11.2 | 14.0 | 12.8 |
| Average function length | 6.75 | 7.44 | 7.01 |
| Cost | $0.36 | $1.03 | $2.31 |

Ranks differ by metric and quality differences overlap variation. All cells have
perfect correctness and zero smells. The native Inline arm costs about 2.9× the
floor without a clear quality gain. Small task size and familiarity are plausible
explanations, not separately tested causes.

## F-1.16.3 — Isolation has no clear quality payoff and takes more time

| Kata | Inline seconds | Isolated seconds | Ratio |
|---|---:|---:|---:|
| Claim Office | 1083.8 | 2397.2 | 2.21× |
| Game of Life | 400.2 | 687.6 | 1.72× |
| Sphinx Score | 440.2 | 945.8 | 2.15× |

On Claim Office the cognitive means tie at 4.8; average function length is
7.42 versus 7.75, while Complexity Peak favours isolation (20.8 versus 18.4).
Game of Life similarly has mixed ranks. No consistent quality advantage offsets
the observed time increase. This does not prove isolation is universally useless,
particularly with date/environment confounded in two of the three comparisons.

## F-1.16.4 — One isolated Claim Office run fails five external scenarios

| Isolated Claim Office result | Value |
|---|---:|
| Runs with perfect external score | 4/5 |
| Lowest external score | 10/15 scenarios |
| Cell mean | 93% |

The documented inspection identifies late multi-step scenarios
`09-follow-up-customer`, `12-warrior-garras`, `13-magus-velorin`,
`14-family-steinheim`, and `15-unlucky-tordan`. The run exits normally, builds
its CLI and passes 36 internal tests. This is an observed completeness failure,
not an infrastructure exclusion. One failure is not a reliable population rate;
it is a reason to prefer the all-green arm provisionally, not proof that
isolation caused the failure. The RQ's stricter all-perfect recommendation rule
is separate from the skill's 0.90 quality-trophy gate.

## F-1.16.5 — Task size and familiarity remain confounded

| Task | Observed result |
|---|---|
| Claim Office | Native inline has lower quality means, higher cost |
| Game of Life | No clear quality gain over the cheap floor |
| Sphinx Score | Quality metrics have limited structural resolution |

The task split does not isolate size from novelty. Claim Office is larger and
lab-authored; Game of Life is smaller and canonical. A context-capacity mechanism
is not measured. Comparisons with the Opus-derived line on Requesty additionally
change route, so they cannot identify lineage alone. A novel task that actually
decomposes on Sol is needed to resolve the size/familiarity alternative.

## F-1.16.6 — Parsed prediction accuracy is high but does not establish compliance

| Native cell | Correct / parsed predictions |
|---|---:|
| Claim Office inline | 137/138 |
| Claim Office isolated | 175/176 |
| Game of Life inline | 48/48 |
| Game of Life isolated | 52/52 |
| Sphinx inline | 68/68 |
| Sphinx isolated | 76/76 |

Rates are 99.3–100%. Already-green cycles legitimately need fewer failure
predictions, while missing formatted blocks disappear from both numerator and
denominator. Thus high accuracy cannot establish that prose-only or missing
predictions are absent. Marker coverage requires transcript inspection;
`tests_passed_immediately` is hardcoded to zero in the pi parser.

## F-1.16.7 — Sphinx Score has insufficient decomposition resolution on Sol

The existing source inspection of the unchanged sphinx cells found one function
in 12/15 runs, with mean function counts 1.4 / 1.0 / 1.2 for Floor/Inline/Isolated.

| Sphinx metric | Floor | Inline | Isolated |
|---|---:|---:|---:|
| Average function length | 14.5 | 13.2 | 15.9 |
| Complexity Peak | 15.4 | 13.2 | 16.2 |
| `cognitive_max` | 2.2 | 1.8 | 1.6 |

When only one function is counted, average and maximum lengths coincide, so
neither resolves decomposition. Smells are zero throughout and complexity
contrasts overlap SDs. This does not establish that the workflows are equivalent;
it shows that this kata-model pairing cannot answer the intended novelty-control
question with these quality metrics.

## F-1.16.8 — External correctness is directionally lowest in the isolated arm

| Workflow | Claim Office | Sphinx Score |
|---|---:|---:|
| Floor | 100% | 100% |
| Inline | 100% | 99% |
| Isolated | 93% | 96% |

On sphinx the documented perfect-run counts are 5/5, 4/5 and 2/5; the misses are
one scenario rather than the five-scenario Claim Office failure. With n=5 and
small score differences, this is a directional observation, not a robust ranking.
It does not demonstrate that isolation lowers correctness.

## Recommendation and remaining questions

Use Inline provisionally for Claim Office-like structured work; prefer the cheap
floor when small-task quality is indistinguishable. Isolation has no demonstrated
payoff in this sample. Recheck these choices with contemporaneous arms before
turning them into general workflow rules. Open questions remain route transfer,
rare-failure frequency, size versus novelty, and separation of refactor brief from
architecture. Costs are list-price equivalents, not subscription invoices.

Sources: [summary.md](summary.md), [runs.csv](runs.csv). All 45 costs were
recomputed; this is an aggregation update, not a new analysis-pipeline run.
