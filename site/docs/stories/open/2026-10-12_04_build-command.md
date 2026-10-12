# Build command

Status: open
Source: [results-site decisions](../../open-questions.md#pipeline), split from the site data export on 2026-10-12.

## Story

A `build` command re-aggregates every RQ, runs the site data export and the Astro build, and prints the duration per step and a final `git diff --stat`. It aborts while a `batch` or `batch-retry` container is running. The aggregator rewrites `runs.csv` and `summary.md` only when their content apart from the `Generated:` line changed, so a build does not touch every RQ.

## Example Mapping

Pending interview with the domain expert. Rules, concrete input/output examples, boundary cases and open questions have not yet been mapped.
