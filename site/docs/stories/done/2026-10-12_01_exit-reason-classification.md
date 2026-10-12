# Exit reason classification

Status: done
Source: [site data export mapping](../open/2026-10-11_05_site-data-export.md), 2026-10-12.

## Story

`run-batch.sh` classifies a run that exited non-zero in `classify_failed_run`, from the messages in its `run.log`. Only `ok` is usable; every other exit reason leaves the statistics, an unrecognised `error-N` included. On top of the existing quota, rate-limit and transient signatures:

- **Transient API error** also covers `API Error: 500` and `API Error: Connection closed mid-response` (Claude Code); retried on the backoff ladder.
- **`provider-refusal`**: `safeguards flagged this message`. Retried twice at once, without backoff (`REFUSAL_RETRIES`, inside the same attempt budget), then recorded.
- **`setup-error`**: `Model not found:` (OpenCode), `There's an issue with the selected model` and `does not support this model; version … or newer is required` (Claude Code). Not retried; the run is kept and the shard stops.

Patterns come only from messages observed in real runs. OpenCode's bare `Unexpected server error` stays `error-N` because its cause is ambiguous. Built without the `exact-coding` skill (lab side); the classifier was checked against the observed messages and counter-examples. `rate_limit_attempts` is logged per run but not written to `metrics.json`. The five legacy `error-1` / `unknown` runs were deleted on 2026-10-12.

The exclusion lists in `batch-plan-from-rq.py` and `aggregate-by-query.py` do not know the two new reasons yet; [usable-run replicates](2026-10-12_05_usable-run-replicates.md) and the [site data export](../open/2026-10-11_05_site-data-export.md) replace them with "only `ok`".
