# Example Mapping: RQ result table — Value formatting

Part of the RQ result table, split from one Example Mapping session
(overview: [rq-result-table-example-mapping.md](rq-result-table-example-mapping.md)).
Rule numbers are shared across the four stories. Examples use real cells from
RQ-tdd-workflow-comparison-opus55 (4.13), RQ-external-tdd-workflows-opus5 (4.7) and
RQ-architecture-axis-opus5.

## Story (yellow)

As a reader, I want every value shown in one consistent format (mean ± sd at a precision that fits its size, percentages for 0–1 metrics, readable units for tokens, time and cost), so that I can compare cells without decoding raw numbers.

## Rules (blue)

### Rule 5: Metrics on a 0–1 scale are shown as percent
Applies to every 0–1 metric: `verification_pct`, the `tdd_discipline*` scores,
`test_first_rate`, `mutation_score`. The sd is shown in percentage points without a unit,
rounded half up to whole points.

### Rule 6: Precision is graded by magnitude, mean and sd each by their own
A value ≥ 100 gets 0 decimals, ≥ 10 gets 1, below 10 gets 2.

### Rule 7: A single run shows the value only
With n = 1 there is no sd, so no `±`.

### Rule 8: Boolean outcomes show the share as percent with the count below
### Rule 9: Pooled `*_correct_rate` outcomes show percent with correct/total below

### Rule 10: Units
Tokens compact (`M` from one million, `k` below). Duration in minutes with one decimal.
Cost in dollars with two decimals.

## Examples (green)

### For rule 5
- `verification_pct` mean 0.96, sd 0.055 -> `96% ± 6`
- `verification_pct` mean 1.0, sd 0 -> `100% ± 0`
- `tdd_discipline` mean 0.63 -> `63% ± …` (sd in whole points)

### For rule 6
- mean 7.4321, sd 1.2345 -> `7.43 ± 1.23`
- mean 123.4, sd 5.67 -> `123 ± 5.67`
- mean 14.2, sd 3.1 -> `14.2 ± 3.10`

### For rule 7
- n = 1, mean 12 -> `12`

### For rule 8
- `tests_passing`, 4 of 5 runs true -> `80%`, below it `4/5`
- `tests_passing`, 5 of 5 -> `100%`, below it `5/5`

### For rule 9
- 4.7, exact-hybrid-v2.4-lab-split-cc, `predictions_correct_rate` pooled over its runs
  -> `100%`, below it `<correct>/<total>`

### For rule 10
- `total_tokens` mean 47,687,463, sd 6,120,333 -> `47.7M ± 6.1M`
- `total_tokens` mean 820,000 -> `820k`
- `duration_seconds` mean 1234, sd 310 -> `20.6 ± 5.2 min`
- `cost_usd` mean 38.4934 -> `$38.49`

## Questions (red)

No open questions — all unclear points were resolved.

## New Stories (sliced out)

None beyond those recorded in the overview.
