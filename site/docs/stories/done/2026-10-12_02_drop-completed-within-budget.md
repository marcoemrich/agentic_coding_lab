# Drop completed_within_budget

Status: done
Source: [site data export mapping](2026-10-11_05_site-data-export.md), 2026-10-12.

## Story

Only `ok` runs enter a statistic, so `completed_within_budget` would always read 100 %. It is gone from the `outcomes:` of all 72 RQs that declared it (main, workflow-dev and kata-dev), from `aggregate-by-query.py` (no longer derived, no `runs.csv` column) and from the metric registry. All 72 RQs were re-aggregated: their `runs.csv` lose only that column and their `summary.md` only its pivot section. Two site tests used RQ 4.13's outcome list as fixture data; the fixture now matches the list (Correctness spans two columns). Per cell, the timeout and infra counters of the [site data export](2026-10-11_05_site-data-export.md) take the metric's place; until then `summary.md` shows `n` against `n_ok`.

Left as they are: 25 `findings.md` and a few RQ README paragraphs still cite the metric. Findings are rewritten on the next `/reanalyze` of their RQ. `site/prototype/extract.py` keeps it as part of the frozen prototype.
