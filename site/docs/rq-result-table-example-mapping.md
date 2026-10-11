# Example Mapping: RQ result table

Source material: the approved prototype
(<https://claude.ai/artifact/97iGMHZ2vrDKjEhdgLVquf>) and the design decisions in
`todos_and_ideas/2-ACTIVE/results-site/open-questions.md`. Examples use real cells from
RQ-tdd-workflow-comparison-opus55 (4.13), RQ-external-tdd-workflows-opus5 (4.7) and
RQ-architecture-axis-opus5.

The session started as one story and was split into four, because it produced 23 rules.
Each split story has its own file and gets its own test list.

## Story (yellow)

As a reader of the results site (a talk audience member, a workflow developer, or the lab
owner instead of `summary.md`)
I want each research question's results shown as one consistently formatted table per kata
so that I can see at a glance which arm wins on which outcome, how certain that is, and
where data is missing or not comparable.

## Split stories

### A. Table layout and interaction

As a reader, I want each kata's results laid out as rows of compared arms and columns of declared outcomes, sortable and traceable to the underlying runs, so that I can scan a comparison and check where every number comes from.

Rules R1–R4, R20–R23: [rq-result-table-a-table-layout-example-mapping.md](rq-result-table-a-table-layout-example-mapping.md)

### B. Value formatting

As a reader, I want every value shown in one consistent format (mean ± sd at a precision that fits its size, percentages for 0–1 metrics, readable units for tokens, time and cost), so that I can compare cells without decoding raw numbers.

Rules R5–R10: [rq-result-table-b-value-formatting-example-mapping.md](rq-result-table-b-value-formatting-example-mapping.md)

### C. Gaps and coverage

As a reader, I want missing and incomplete data marked in the table (never run, not collected, partially collected, under-replicated, not completed), so that I don't mistake absent data for a result.

Rules R11–R15: [rq-result-table-c-gaps-and-coverage-example-mapping.md](rq-result-table-c-gaps-and-coverage-example-mapping.md)

### D. Trophies and comparability

As a reader, I want the winning cells per outcome marked, but only where the comparison is meaningful, so that I see who wins without being misled by noise, incorrect solutions or incomparable metrics.

Rules R16–R19: [rq-result-table-d-trophies-and-comparability-example-mapping.md](rq-result-table-d-trophies-and-comparability-example-mapping.md)

## Questions (red)

No open questions — all unclear points were resolved.

## New Stories (sliced out)

- RQ page header: question, varied and fixed factors, run span, source link, closed banner
- Findings section: collapsed `findings.md` under an "AI-generated" warning
- RQ index grouped by harness subtree
- Workflow page with profiles from `LINEAGE.yaml`
- Site data export: `summary.json` from the aggregator and `export-site-data.py`
