# Normalise the completed exit reason

Status: done
Source: [site data export mapping](../open/2026-10-11_05_site-data-export.md), 2026-10-12.

## Story

Five runs from 2026-05-12 (RQ-prompt-style-correctness) carried the legacy exit reason `completed`, which means `ok`. Their `metrics.json` now read `ok`, so the aggregator needs no special case. No script writes `completed` any more; the only other change in the re-aggregated `runs.csv` is that column.
