# Build command

Status: open
Source: [results-site decisions](../../open-questions.md#pipeline), split from the site data export on 2026-10-12.
Depends on: [RQ page header](2026-10-11_06_rq-page-header.md) (the first page, which sets up Astro), [stable aggregator output](2026-10-12_09_stable-aggregator-output.md).

## Story

`experiments/build-site.py` re-aggregates all RQs, runs the site data export and the Astro build, and prints the duration per step and a final `git diff --stat`. It waits for story 06: until Astro produces output, it would do little beyond looping over the aggregator. No-noise writing and stable sorting moved to the aggregator itself.

## Decided so far

- A Python script, `experiments/build-site.py`, built with `exact-coding`.
- Aggregates all RQs, not only the main ones.
- The batch lock lives in the aggregator ([stable aggregator output](2026-10-12_09_stable-aggregator-output.md)), so the build inherits it.
- Stops at the first failing step with a non-zero exit code.
- `git diff --stat` covers only `research/`, the only tracked files the build writes; the whole repository would mix in unrelated uncommitted edits.

## Example Mapping

Pending, once story 06 has set up Astro.
