# Site data export

Status: done
Source: [results-site decisions](../../open-questions.md#pipeline).
Depended on: [Python test infrastructure](2026-10-12_07_python-test-infrastructure.md),
[exit reason classification](2026-10-12_01_exit-reason-classification.md),
[drop completed_within_budget](2026-10-12_02_drop-completed-within-budget.md),
[usable-run replicates](2026-10-12_05_usable-run-replicates.md).

## Story

Extend `aggregate-by-query.py` to write `summary.json` alongside `summary.md` from the same pandas pivots: per cell and outcome `mean`, `sd`, `n` and null count, per cell its run counters and run list, and coverage including declared but unrun cells. `export-site-data.py` reads this, the RQ frontmatter, `LINEAGE.yaml` and the metric registry, and writes one JSON file per main RQ plus `workflows.json` under gitignored `site/src/data/`. Statistics belong to Python, presentation to TypeScript. The build command and its batch guard are a separate story ([build command](../open/2026-10-12_04_build-command.md)).

## Built

Implemented with the `exact-coding` skill; the tests in `experiments/tests/test_summary_json.py` and `experiments/tests/test_export_site_data.py` are the specification (40 tests). `aggregate-by-query.py` builds one per-cell summary (`summary_document`) and renders both `summary.json` and `summary.md` from it: only `ok` runs enter a statistic, a null leaves `n` and is counted, each cell carries its run counters and run list, every declared cell appears, and outcomes are keyed by their declared name also when a superseded one is read from its `legacy_` column. `summary.md`'s coverage now judges a cell by its `ok` runs. `export-site-data.py` writes one file per main RQ and `workflows.json`, no `meta.json`, and stops with exit 1 before writing anything when an outcome has no registry entry or a workflow no description.

Against the real data the export stops: 51 outcomes declared by 44 of the 46 main RQs have no registry entry ([complete the metric registry](2026-10-12_08_complete-metric-registry.md)). With placeholder entries it writes all 46 RQ files and 49 workflow descriptions, and its values match `runs.csv` and `summary.md`.
