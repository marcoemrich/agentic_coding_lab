# Broken-run cleanup

Status: open
Source: [site data export mapping](../done/2026-10-11_05_site-data-export.md), 2026-10-12.

## Story

Broken runs are deleted regularly so a re-run of the RQ refills them. A script removes runs with an excluding exit reason (timeout, infrastructure abort, provider refusal) from `experiments/runs/` and re-aggregates the affected RQs. It runs on the user's call, never automatically; the runs stay recoverable from git history. Five such runs were removed by hand on 2026-10-12.

## Example Mapping

Mapped with the domain expert on 2026-10-13. Examples use the pool of that day: 1,919 runs, 1,901 `ok`, 15 `timeout`, 2 `rate-limited`, 1 `quota-exhausted`, no stubs.

### R1 — What counts as broken

A run whose readable `metrics.json` has an `exit_reason` other than `ok`, or none at all (a stub), is broken. A run directory without `metrics.json` or with invalid JSON is not judged: it stays and is reported.

- The pool of 2026-10-13 → 18 broken runs (15 `timeout`, 2 `rate-limited`, 1 `quota-exhausted`); the 1,901 `ok` runs stay.
- A stub without `exit_reason` → broken.
- A run directory without `metrics.json` → stays, named in the report.

### R2 — Whole pool, deleted outright

Every broken run in `experiments/runs/` is removed from the working tree, whether an RQ selects it or not and whether it is committed or not. Underscore-prefixed directories such as `_archive/` are outside the pool and untouched.

- A broken run no RQ selects → deleted, triggers no re-aggregation.
- A broken run from a batch that is not committed yet → deleted.
- A broken run under `_archive/` → stays.

### R3 — Absolute batch lock

The same lock as the aggregator's: while a container of the `batch` or `batch-retry` service is running, or when Docker cannot be reached, the cleanup refuses: exit code ≠ 0, a message, nothing deleted. The interactive `experiment` container does not block.

### R4 — Re-aggregate the affected RQs

After deleting, every RQ whose selector matched at least one deleted run is re-aggregated. An affected RQ that names an archived workflow is skipped with a note.

- RQ 1.10 (archived workflow) is affected → not re-aggregated, named in the report.

### R5 — One commit of its own paths

The cleanup commits the deleted run directories and the re-aggregated RQ files in one commit on the current branch, and does not push. Other changes in the working tree stay uncommitted. The subject carries the count, the body lists every deleted run id with its exit reason and the ids of the re-aggregated RQs.

- 18 runs deleted → subject "Delete 18 broken runs".
- A modified file outside the run directories and the re-aggregated RQ files → stays uncommitted.

### R6 — Outcome of a call

- No broken run in the pool → message "no broken runs", no re-aggregation, no commit, exit 0.
- Re-aggregating one affected RQ fails → the deletions and the RQs that did aggregate are committed, the failed RQ is named, exit ≠ 0.

### Decided along the way

- A deleted timeout or abort leaves the site's per-cell counters; the site shows the current pool, the history lives in git.
- Recoverability from git applies to committed runs only; an uncommitted broken run is deleted anyway.
- The cleanup deletes right away; the call is the decision and git is the undo.
- It runs on the user's call, never automatically.
