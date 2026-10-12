# Stable aggregator output

Status: open
Source: [build command](2026-10-12_04_build-command.md), split off on 2026-10-12.

## Story

`aggregate-by-query.py` rewrites `runs.csv`, `summary.md` and `summary.json` only when their content changed apart from the `Generated:` line, and writes `runs.csv` in a stable row order (by `run_id`), so re-aggregating an RQ without new data leaves no diff. Every path benefits: `/run-rq`, `/reanalyze`, manual calls and the later build. Possibly also: the aggregator refuses to run while a `batch` or `batch-retry` container is running, and aborts when Docker cannot be reached.

## Example Mapping

Pending interview with the domain expert. Rules, concrete input/output examples, boundary cases and open questions have not yet been mapped. Open: whether the batch lock belongs in the aggregator.
