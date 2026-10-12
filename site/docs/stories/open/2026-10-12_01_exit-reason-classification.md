# Exit reason classification

Status: open
Source: [site data export mapping](2026-10-11_05_site-data-export.md), 2026-10-12.
Blocks: [site data export](2026-10-11_05_site-data-export.md).

## Story

Every crash that matches no known signature currently ends as `error-<code>`. `run-batch.sh` classifies a non-zero exit by patterns in `run.log` (quota exhausted, rate limit, transient API error) and retries the transient ones on the staged backoff ladder, restarting from the kata baseline. Extend it with the causes found in the run pool: an API 500, a provider refusal (a safeguard flag mid-run) and a setup error (the agent never wrote a line). Not built with the `exact-coding` skill (lab side).

## Example Mapping

Mapped with the domain expert on 2026-10-12. Examples are the messages of real runs from the pool.

### R1 — Only `ok` is usable

Every other exit reason leaves the statistics, including an unrecognised `error-N`. This rule is shared with the [site data export](2026-10-11_05_site-data-export.md).

### R2 — An API 500 and a mid-response connection drop are transient API errors

Retried on the existing backoff ladder; still failing after the last attempt → `transient-api-error`.

- Attempt 1 logs `API Error: 500 Internal server error`, attempt 2 completes → `ok`, `rate_limit_attempts: 1`.
- Every attempt logs `API Error: 500 Internal server error` → `transient-api-error`.
- Claude Code logs `API Error: Connection closed mid-response` → retried like `API Error: terminated`.

### R3 — A provider refusal is retried at once, twice, then recorded

No backoff — waiting does not help a refusal. At most three attempts in total.

- Attempt 1 logs `API Error: Opus 5's safeguards flagged this message`, attempt 2 completes → `ok`.
- All three attempts are flagged → `provider-refusal`.

### R4 — A setup error is not retried and stops the shard

The run is kept in the pool with `setup-error`, so the failure stays visible; the remaining runs of that shard do not start. Cleanup is left to the [broken-run cleanup](2026-10-12_06_broken-run-cleanup.md).

- OpenCode logs `Model not found: portkey/@openrouter-eval/deepseek/deepseek-v4-pro` → `setup-error`, shard stops.
- Claude Code logs `There's an issue with the selected model (@vertex-ai/anthropic.claude-opus-4-6)` → `setup-error`.
- Claude Code logs `API Error: 400 Claude Code 2.1.267 does not support this model; version 2.1.280 or newer is required` → `setup-error`.

### R5 — Patterns come only from observed messages

New patterns are added when a new message appears in a run. An unrecognised message stays `error-N` and still leaves the statistics under R1.

- OpenCode logs only `Unexpected server error`, without `Model not found` → stays `error-1`; the cause is ambiguous.

### Decided along the way

- The five legacy `error-1` / `unknown` runs left in the pool were deleted on 2026-10-12 so their RQs refill them.
