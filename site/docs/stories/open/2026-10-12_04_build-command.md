# Build command

Status: open
Source: [results-site decisions](../../open-questions.md#pipeline), split from the site data export on 2026-10-12.
Depends on: [RQ page header](../done/2026-10-11_06_rq-page-header.md) (the first page, which sets up Astro), [stable aggregator output](../done/2026-10-12_09_stable-aggregator-output.md).

## Story

`experiments/build-site.py` re-aggregates all RQs, runs the site data export and the Astro build, and prints the duration per step and a final `git diff --stat`. It waits for story 06: until Astro produces output, it would do little beyond looping over the aggregator. No-noise writing and stable sorting moved to the aggregator itself.

## Decided so far

- A Python script, `experiments/build-site.py`, built with `exact-coding`.
- Aggregates all RQs, not only the main ones.
- The batch lock lives in the aggregator ([stable aggregator output](../done/2026-10-12_09_stable-aggregator-output.md)), so the build inherits it.
- Stops at the first failing step with a non-zero exit code.
- `git diff --stat` covers only `research/`, the only tracked files the build writes; the whole repository would mix in unrelated uncommitted edits.

## Example Mapping

Mapped with the domain expert on 2026-10-14. Examples use the lab of that day: 72 RQs (`research/*/*/README.md`), 46 of them main RQs with a page; aggregating all main RQs took about 16 s and changed nothing.

### R1 — Aggregate every RQ, one line each

All RQs are aggregated in directory-path order. One line per RQ, named by its `id`, says what happened to its files.

- RQ-stability, nothing changed → `RQ-stability  unchanged`.
- RQ-model-quality-pi after a run's start time was backfilled → `RQ-model-quality-pi  wrote runs.csv, summary.json`.

### R2 — Archived workflow: skip with a note

An RQ whose selector names an archived workflow is not aggregated; its line says so and the build continues. A skip alone leaves the exit code at 0.

- An RQ naming a workflow under `experiments/workflows/_archive/` → `<id>  skipped — names an archived workflow`; every other step succeeds → exit 0.

### R3 — An aggregation failure stops the build before the export

The aggregate step still runs over all RQs and lists every failure with the aggregator's first error line, then the build stops without exporting, exit ≠ 0.

- One RQ crashes → `<id>  FAILED — <first error line>`, the remaining RQs are aggregated, no export, exit ≠ 0.

### R4 — Batch lock

While a container of the `batch` or `batch-retry` service runs, or when Docker cannot be reached, the build stops before the first RQ with one message and exit ≠ 0; no per-RQ lines.

- A batch is running → `build-site: a batch is running — nothing aggregated`.
- Docker unreachable → `build-site: cannot reach Docker — nothing aggregated`.

### R5 — Export and Astro build

After aggregation the build runs the site data export, then the Astro build. Each tool's own output is shown in full, Astro's included. A failing step stops the build, exit ≠ 0.

- The export stops on an RQ without factors → `export-site-data: RQ-x: no factors` is shown, no Astro build, exit ≠ 0.

### R6 — Duration after every step

Each step prints its duration as soon as it finishes.

- `aggregate 16.1 s`, then `export 0.4 s`, then `astro build 3.2 s`.

### R7 — Closing

`git diff --stat` over `research/` is always printed, after a failure too; without changes it prints `no changes`. A successful build ends with the page count and total time, a stopped one with the step and exit code.

- Success → `built 46 pages in 21.4 s`.
- Stopped in the aggregate step → diff stat, then `build stopped after aggregate (exit 1)`.
- Nothing changed under `research/` → `no changes`.

### Decided along the way

- "Stops at the first failing step" holds per step; within the aggregate step all RQs run before the stop, so every failure is listed at once.
- Exit 0 means "everything as intended"; a skip is intended and visible in its line.
- RQ-refactor-vocab-v62, the only RQ naming an archived workflow, was deleted on 2026-10-14 on the user's call (`4cae8f3ff`); the skip rule stays for the next one.
