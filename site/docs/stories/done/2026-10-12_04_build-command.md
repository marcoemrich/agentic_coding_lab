# Build command

Status: done
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

## Built

Implemented with the `exact-coding` skill; 23 tests in `experiments/tests/test_build_site.py` are the specification. The build aggregates every RQ (`research/*/*/README.md`) in directory-path order with one line per RQ (`<id>  unchanged`, `<id>  wrote runs.csv, summary.json`, `<id>  skipped — names an archived workflow`, `<id>  FAILED — <first error line>`), then runs `export-site-data.py` and `pnpm build` in `site/` with their output shown in full. Each step prints its duration when it finishes, failed steps included. The diff stat over `research/` (or `no changes`) always follows, then `built N pages in T s` (N counts `site/dist/rq/*/index.html`) or `build stopped after <step> (exit N)`. A failing export or Astro build returns that tool's own exit code; a failure in the aggregate step returns 1.

Reading adopted for the aggregator's three `return 1` cases: the build loads `aggregate-by-query.py` in-process. The batch lock is asked once up front through the aggregator's own `running_batch_containers()`, with `DockerUnreachable` as "cannot reach Docker", so the service list and the Docker query stay in the aggregator. Each RQ then goes through the aggregator's `main()` with stderr captured. Exit 0 is read from the `wrote`/`unchanged` lines. Exit 1 with a report starting `ERROR: selector names` is the archived-workflow skip. Any other non-zero exit, or a raised exception (the aggregator's own `SystemExit("cell missing …")` included), is a failure whose first error line is the first captured stderr line or the exception's message. The per-RQ lock check inside `main()` still runs, so a batch that starts mid-build fails the affected RQs instead of slipping through.

Decided along the way, on the user's call on 2026-10-14: a failing step prints its duration too; a failing tool's own exit code is the build's; the batch-lock message is followed by the closing (diff stat, then `build stopped after aggregate (exit 1)`). Deviations: one test beyond the map (`test_an_rq_the_aggregator_refuses_is_failed_with_its_first_error_line`) pins the reading that a non-skip refusal counts as a failure. The aggregator's own notes on stderr, such as skipped unfinished runs, are not shown, because R1 gives each RQ one line.

Against the lab on 2026-10-14: 72 RQs unchanged, `aggregate 7.0 s`, `export 0.3 s`, `astro build 1.6 s`, `no changes`, `built 46 pages in 8.9 s`.
