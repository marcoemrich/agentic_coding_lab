# Stable aggregator output

Status: open
Source: [build command](2026-10-12_04_build-command.md), split off on 2026-10-12.

## Story

`aggregate-by-query.py` leaves no diff when an RQ has no new data, writes its rows in a stable order, refuses to run while a batch is running, and ignores runs that never finished. Every path benefits: `/run-rq`, `/reanalyze`, manual calls and the later build.

## Example Mapping

Mapped with the domain expert on 2026-10-13.

### R1 — Rewrite only on a real change

`runs.csv`, `summary.md` and `summary.json` are written only when their content changed, ignoring `summary.md`'s `Generated:` line.

- An RQ aggregated twice without new runs → the second call writes nothing; `git diff` stays empty.
- One new run in the RQ → all three files are rewritten, `summary.md` with a new `Generated:` time.
- Only the `Generated:` time would differ → `summary.md` stays untouched.

### R2 — Stable order

`runs.csv` rows and each cell's run list in `summary.json` are sorted by `run_id`.

- Runs found in the order `b`, `a` → rows `a`, `b`.

### R3 — Absolute batch lock

While a container of the `batch` or `batch-retry` service is running, the aggregator refuses: exit code ≠ 0, a message naming the running container, nothing written.

- A batch container is running, `aggregate-by-query.py <rq>` → abort, no file touched.
- Only the interactive `experiment` container is running → the aggregator runs normally.

### R4 — No Docker, no aggregation

The aggregator runs on the host and asks Docker whether a batch is running. When Docker cannot be reached, it aborts the same way: exit code ≠ 0, a message, nothing written.

### R5 — Unfinished runs are skipped

A run without an `exit_reason` (still running, or a stub left by an aborted batch) does not appear anywhere: not in `runs.csv`, not in a cell's counters or run list. The aggregator reports how many it skipped, as `batch-plan-from-rq.py` already does.

- A cell with 4 `ok` runs and 1 stub → `runs` 4, the stub in no list; a note "1 unfinished run skipped".

### Decided along the way

- The lock is absolute; an explicit override may come later.
- Running the aggregator inside a container was considered and not chosen; it stays on the host.
- Stubs are deleted by the [broken-run cleanup](2026-10-12_06_broken-run-cleanup.md), not by the aggregator.
