# Site data export

Status: open
Source: [results-site decisions](../../open-questions.md#pipeline).
Depends on: [Python test infrastructure](2026-10-12_07_python-test-infrastructure.md),
[exit reason classification](../done/2026-10-12_01_exit-reason-classification.md),
[drop completed_within_budget](../done/2026-10-12_02_drop-completed-within-budget.md),
[usable-run replicates](../done/2026-10-12_05_usable-run-replicates.md).

## Story

Extend `aggregate-by-query.py` to write `summary.json` alongside `summary.md` from the same pandas pivots: per cell and outcome `mean`, `sd`, `n` and null count, per cell its run counters and run list, and coverage including declared but unrun cells. `export-site-data.py` reads this, the RQ frontmatter, `LINEAGE.yaml` and the metric registry, and writes one JSON file per main RQ plus `workflows.json` under gitignored `site/src/data/`. Statistics belong to Python, presentation to TypeScript. The build command and its batch guard are a separate story ([build command](2026-10-12_04_build-command.md)).

## Example Mapping

Mapped with the domain expert on 2026-10-12.

### R1 — Only `ok` runs enter a statistic

A run whose exit reason is anything but `ok` — a timeout, an infrastructure abort (setup error, API 500, rate limit, quota or retries exhausted), a provider refusal or an unrecognised `error-N` — does not enter `mean`, `sd`, `n`, rates or `cost_usd`. This holds for `summary.md` and `summary.json` alike — one statistics implementation. Classification: [exit reason classification](../done/2026-10-12_01_exit-reason-classification.md).

- A cell has 5 runs: 4 × `ok` with `mccabe_max` 4, 5, 6, 5 and 1 × `timeout` with 12 → `n = 4`, `mean = 5.0`.
- A cell has 3 runs, all `timeout` → no mean; the cell has runs but none usable, and its coverage reads "below `min_replicates`".

### R2 — Each cell counts its runs and why runs were excluded

Counters per cell: `runs` (all), `timeouts`, `infra`, `provider_refusals`. `infra` covers every other exit reason that is not `ok`, an unrecognised `error-N` included.

- 6 runs: 4 × `ok`, 1 × `timeout`, 1 × API 500 → `runs 6, timeouts 1, infra 1, provider_refusals 0`.

### R3 — A null leaves `n` and is counted

A `null` value is excluded from `n` and reported as `null_count`, for numeric, boolean and pooled outcomes alike, in `summary.md` too. For a pooled rate (`*_correct_rate`) a run whose denominator is `null` or `0` counts as null.

- `tests_passing` = true, true, null, false → `k = 2`, `n = 3`, `null_count = 1` (the old `summary.md` showed 2/4).
- `mutation_score` = 0.8, null, 0.9 → `n = 2`, `mean = 0.85`, `null_count = 1`.

### R4 — An outcome null in every run is still present

- `mutation_score` null in all 5 runs of a cell → `n = 0`, `null_count = 5`, no `mean`, no `sd`. The site derives "not collected" from this.

### R5 — Declared cells without runs are present

- A declared cell that matches no run appears in `summary.json` with `runs: 0`.

### R6 — Each cell lists its runs, excluded ones included

Run list entries carry `id`, `started_at` and `exit_reason`, so the reason for an exclusion stays visible.

### R7 — The export writes one file per main RQ and `workflows.json`

Every RQ under `research/questions-*/` gets a file, also one without runs (the index lists it as "no data yet"). There is no `meta.json`.

### R8 — The export stops at the first missing metadata and writes nothing

- An RQ declares `foo_score` in `outcomes:`, the registry has no entry → exit code ≠ 0, the message names the RQ id and the metric.
- A workflow referenced by a main RQ has no `description:` in `LINEAGE.yaml` → exit code ≠ 0, the message names the workflow.

### Decided along the way

- Timeouts are no longer findings: they are excluded and refilled like infrastructure aborts ([usable-run replicates](../done/2026-10-12_05_usable-run-replicates.md)).
- `completed_within_budget` is dropped; a cell shows its timeout and infra counters instead ([drop completed_within_budget](../done/2026-10-12_02_drop-completed-within-budget.md)).
- Broken runs are deleted regularly so a re-run of the RQ refills them ([broken-run cleanup](2026-10-12_06_broken-run-cleanup.md)).
