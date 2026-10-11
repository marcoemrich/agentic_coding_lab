# Example Mapping: RQ result table — Trophies and comparability

Part of the RQ result table, split from one Example Mapping session
(overview: [rq-result-table-example-mapping.md](rq-result-table-example-mapping.md)).
Rule numbers are shared across the four stories. Examples use real cells from
RQ-tdd-workflow-comparison-opus55 (4.13), RQ-external-tdd-workflows-opus5 (4.7) and
RQ-architecture-axis-opus5.

## Story (yellow)

As a reader, I want the winning cells per outcome marked, but only where the comparison is meaningful, so that I see who wins without being misled by noise, incorrect solutions or incomparable metrics.

## Rules (blue)

### Rule 16: Every column header shows the metric's direction
↑ higher is better, ↓ lower is better, ○ informative. A legend above the table explains
the marks.

### Rule 17: Trophies go to every cell within one sd of the best
The best mean follows the metric's direction. A cell gets 🏆 and a highlighted background
when |mean − best| ≤ max(sd of the best cell, sd of this cell); a missing sd counts as 0.
Informative metrics get no trophy. When every cell has the same value, the column gets no
trophy.

### Rule 18: Code-quality and cost trophies need external correctness
In the Code quality and Cost groups, only cells with mean `verification_pct` ≥ 90 % can
win. A gated cell shows its value normally, with the reason in a tooltip. RQs without
`verification_pct` are not gated.

### Rule 19: Columns not comparable across the test-list boundary carry ⚠
The registry flags them (`tdd_discipline`, `tdd_discipline_test_first`,
`tdd_discipline_closure`, `test_first_rate`, `skip_events`, `cycles_total`,
`chain_deviations`). The header shows ⚠ with an explanation. When the RQ's workflows are on
both sides of the boundary, a banner says so and these columns get no trophy.

## Examples (green)

### For rule 16
- `verification_pct` -> ↑, `cognitive_max` -> ↓, `refactor_events` -> ○

### For rule 17
- best `100% ± 0`, other cell `96% ± 5` -> 4 ≤ max(0, 5) -> both get 🏆
- best `100% ± 0`, other cell `90% ± 5` -> 10 > 5 -> only the best gets 🏆
- 4.13, `tests_passing` 100 % in every row -> no trophy
- `refactor_events` (informative) -> no trophy

### For rule 18
- Cell with `verification_pct` 85 % and the lowest `cognitive_max` -> no trophy, tooltip
  "below 90 % external correctness"; the trophy goes to the best cell at ≥ 90 %
- A game-of-life RQ without `verification_pct` -> no gating

### For rule 19
- 4.13 (exact-ptdd-v1-cc "test list" next to external-pocock "ad hoc") -> banner;
  `tdd_discipline` has ⚠ and no trophy
- `tdd_discipline_step` is not flagged -> no ⚠, trophies as usual

## Questions (red)

No open questions — all unclear points were resolved.

## New Stories (sliced out)

None beyond those recorded in the overview.
