# Result table labels

Status: done
Source: split from [result table look](2026-10-14_02_result-table-look.md) on 2026-10-14, agreed with the user.

## Story

The result table renders the row data `buildResultTables` already provides, the way the approved prototype does: every varying factor in the row label, the run dates under the run count, the workflow's test-list or ad-hoc tag, a dimmed standard deviation, and the metric group header row. Before, a model-varying RQ showed `model` in the header but no model per row, so its rows could not be told apart.

## Built

Implemented with the `exact-coding` skill; five tests in `src/ResultTable.spec.tsx` ("Result table labels") are the specification, 118 Vitest tests in all. A row label lists the varying factors in factor order (model, workflow, prompt), joined by ` · `: the workflow as a link with its `test list`/`ad hoc` tag (`TddStyleTag`, the prototype's tooltip), any other factor as `model: opus-4-8` (`FactorLabels`, `FactorLabel`). The line beneath reads `n = 5, 2026-09-30 → 10-01`; the dates come last, after a replicate shortfall or incomplete-run note (`runCountLine`). The deviation sits in a dimmed `.sd` span; the cell still reads `82% ± 5`, and `format-value.ts` now exports the `DEVIATION_SEPARATOR` both sides use. The table head has two rows (`TableHead`): group names spanning their columns, the metric headers beneath, and a label header spanning both, subtitled "n, run dates". A rule separates the groups (`gstart`), as in the prototype.

Test changes: the run-count test from [result table look](2026-10-14_02_result-table-look.md) now states its claim for a two-row head (the label header spans every header row, and label header plus metric headers match a data row's cells). Twenty-one row queries in three spec files read `tbody` rows through a local `bodyRows()` instead of "row 1 is the first data row". Five `getByText("82% ± 5")` queries check the cell's or row's text instead, because the value is now two text nodes. No expectation changed.

Left open: group headers followed the RQ's outcome order, so a group could appear twice (RQ-model-quality: Code quality, Size, Code quality); fixed in [group order and header terms](2026-10-14_04_group-order-and-header-terms.md). Readable metric names instead of ids are not in the metric registry yet.
