# Stable aggregator output

Status: done
Source: [build command](../open/2026-10-12_04_build-command.md), split off on 2026-10-12.

## Story

`aggregate-by-query.py` leaves no diff when an RQ has no new data, writes its rows in a stable order, refuses to run while a batch is running, and ignores runs that never finished. Every path benefits: `/run-rq`, `/reanalyze`, manual calls and the later build.

## Built

`runs.csv`, `summary.json` and `summary.md` are written only when their content changed, ignoring `summary.md`'s `Generated:` line, and the aggregator reports each file as `wrote` or `unchanged`. Rows in `runs.csv` and each cell's run list in `summary.json` are sorted by `run_id`. `main()` asks Docker for running containers and refuses (exit 1, nothing written) while one of the compose services `batch` or `batch-retry` runs, naming the container, or when Docker cannot be reached; the interactive `experiment` service does not block. The check lives only in the command-line path, so `compute-mutation-score.py` still imports the aggregator inside a container without Docker. A matching run without an `exit_reason` is left out of every file and counter and reported as "N unfinished run(s) skipped" (`rq_facts.is_finished`).

Re-aggregating all 73 RQs produced no diff: the pool was already walked in directory order, which is `run_id` order, and it held no stubs. A second pass wrote none of the 219 files. Tests: `experiments/tests/test_stable_aggregator_output.py` (14). The Docker query is injected by replacing `running_containers()` or by a fake `docker` on the `PATH`.

Decided along the way: the lock is absolute (an override may come later); the aggregator stays on the host; stubs are deleted by the [broken-run cleanup](../open/2026-10-12_06_broken-run-cleanup.md), not by the aggregator.
