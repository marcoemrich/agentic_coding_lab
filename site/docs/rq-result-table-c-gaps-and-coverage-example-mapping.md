# Example Mapping: RQ result table — Gaps and coverage

Part of the RQ result table, split from one Example Mapping session
(overview: [rq-result-table-example-mapping.md](rq-result-table-example-mapping.md)).
Rule numbers are shared across the four stories. Examples use real cells from
RQ-tdd-workflow-comparison-opus55 (4.13), RQ-external-tdd-workflows-opus5 (4.7) and
RQ-architecture-axis-opus5.

## Story (yellow)

As a reader, I want missing and incomplete data marked in the table (never run, not collected, partially collected, under-replicated, not completed), so that I don't mistake absent data for a result.

## Rules (blue)

### Rule 11: A declared cell without runs is a greyed row reading "Not run"
### Rule 12: A metric that no run of the cell carries is shown as "n/c"
Italic, with a tooltip: not collected — not measured at the time.

### Rule 13: A metric that only some runs carry shows its own n
The value is computed over the runs that carry it; below it `n=<carrying>/<cell n>`.

### Rule 14: A cell below `min_replicates` is marked at its label
"n = 3 of 5", highlighted. Values and trophies stay as usual.

### Rule 15: Runs that did not complete count, with their reason named
Runs with exit reason timeout, rate-limited, transient-api-error, quota-exhausted or
pi-retries-exhausted stay in the values. The label names each reason with its count.

## Examples (green)

### For rule 11
- 4.7, external-kesseler-2026-09-30-cc (declared, 0 runs) -> greyed row, "0 runs",
  "Not run" across all value columns

### For rule 12
- 4.7, external-superpowers-2026-09-04-cc × `predictions_correct_rate` -> "n/c"
- 4.7, external-pocock-2026-09-04-cc × `predictions_correct_rate` -> "n/c"

### For rule 13
- 5 runs, 3 carry the metric with mean 0.82, sd 0.05 -> `82% ± 5`, below it `n=3/5`

### For rule 14
- `min_replicates: 5`, cell with 3 runs -> label "n = 3 of 5", highlighted

### For rule 15
- 5 runs, one timed out -> "n = 5 (1 timeout)"
- 5 runs, one timeout and one rate-limited -> "n = 5 (1 timeout, 1 rate-limited)"

## Questions (red)

No open questions — all unclear points were resolved.

## New Stories (sliced out)

None beyond those recorded in the overview.
