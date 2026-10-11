# Example Mapping: RQ result table — Table layout and interaction

Part of the RQ result table, split from one Example Mapping session
(overview: [rq-result-table-example-mapping.md](rq-result-table-example-mapping.md)).
Rule numbers are shared across the four stories. Examples use real cells from
RQ-tdd-workflow-comparison-opus55 (4.13), RQ-external-tdd-workflows-opus5 (4.7) and
RQ-architecture-axis-opus5.

## Story (yellow)

As a reader, I want each kata's results laid out as rows of compared arms and columns of declared outcomes, sortable and traceable to the underlying runs, so that I can scan a comparison and check where every number comes from.

## Rules (blue)

### Rule 1: One table per kata, always headed
Each kata of the RQ gets its own table, headed by the kata id — also when the RQ has only
one kata.

### Rule 2: Rows are labelled by the varying factors only, one column per factor
Factors that are constant across the RQ's cells are controls and do not appear in the rows.
A paired factor contributes one label column per member.

### Rule 3: Columns follow the frontmatter order of `outcomes:`
A group header (Correctness, TDD discipline, Code quality, Cost — from the metric
registry) spans each run of consecutive columns of the same group.

### Rule 4: `n` sits under the row label; `cost_usd` appears exactly once
If `cost_usd` is a declared outcome it stays at its declared position, otherwise it is
appended as the last column.

### Rule 20: Each row shows the time span of its runs
Earliest to latest `started_at` date of the cell's runs, under the row label next to `n`.

### Rule 21: A workflow label links to the workflow page and carries its TDD style
The tag reads "test list" for a workflow that writes a test list up front and "ad hoc"
otherwise.

### Rule 22: Clicking a column header sorts by that column
First click: best value first (by the metric's direction). Second click: reversed. Cells
without a value sort last. Before any click: declared cell order.

### Rule 23: The runs behind each row are listed, collapsed
A collapsed section under the table lists every row's run ids, each linking to
`experiments/runs/<id>/` on GitHub.

## Examples (green)

### For rule 1
- 4.13 (only claim-office-example-mapping) -> one table headed "claim-office-example-mapping"
- RQ-architecture-axis-opus5 (claim-office-example-mapping, game-of-life-example-mapping)
  -> two tables, each with its kata heading

### For rule 2
- 4.13 varies `workflow` only -> one label column `workflow`; model, kata and CLI version
  do not appear in the rows
- An RQ with factor `model_x_workflow` -> two label columns, `model` and `workflow`

### For rule 3
- 4.13 -> groups Correctness (3 columns), TDD discipline (19), Code quality (6), Cost (3),
  columns in the order of its `outcomes:` list

### For rule 4
- 4.13 declares `cost_usd` last -> `cost_usd` is the last column, once
- 4.7 does not declare `cost_usd` -> `cost_usd` appended after `total_tokens`
- 4.13, row exact-ptdd-v1-cc -> "n = 5" under the label

### For rule 20
- 4.13, all five runs on 2026-10-01 -> "2026-10-01"
- 4.13, external-kesseler-2026-09-30-cc, runs on 2026-09-30 and 2026-10-01
  -> "2026-09-30 → 10-01"

### For rule 21
- exact-ptdd-v1-cc -> link to the workflow page, tag "test list"
- external-pocock-2026-09-04-cc -> link to the workflow page, tag "ad hoc"

### For rule 22
- 4.13, click `verification_pct` (higher is better) -> 100 % rows first, 96 % rows after
- Click again -> 96 % rows first
- 4.7, click `predictions_correct_rate` -> superpowers and pocock (n/c) sort last

### For rule 23
- 4.13, row exact-ptdd-v1-cc -> five run ids, e.g.
  `2026-10-01_02-02-28_claim-office-example-mapping_exact-ptdd-v1-cc_opus-5-no-thinking`,
  each a GitHub link; the section starts collapsed

## Questions (red)

No open questions — all unclear points were resolved.

## New Stories (sliced out)

None beyond those recorded in the overview.
