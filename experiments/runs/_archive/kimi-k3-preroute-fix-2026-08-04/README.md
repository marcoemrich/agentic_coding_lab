# kimi-K3 runs before the Requesty route fix (archived 2026-08-04)

Metrics-only archive of the 18 kimi-K3 runs produced on 2026-07-28/29, before
Requesty reported the provider-stream issue fixed. Heavy artifacts
(`transcript.jsonl`, `src/`, `node_modules/`, `run.log`, `coverage/`) were
dropped; kept are `metrics.json`, `analysis-report.md`, `verification.log`,
`transcript-metrics.json`, `tdd-journal.md`, `prompt.md` and
`experiment-done.txt`.

## Why these runs were discarded

Both Requesty routes to kimi-k3 were unreliable during that window, so it is
not clear which of the measured values reflect the model and which reflect the
provider:

- **`sference/kimi-k3`** — died mid-run with Requesty 502 "problem with the
  provider stream" (2/2 smoke runs on 2026-07-28). The `kimi-k3-nebius` id was
  added as a fallback because of this.
- **`nebius/kimi-k3`** — its own instability: 6 of 15 runs non-`ok`
  (4 `timeout`, 2 `pi-retries-exhausted`), concentrated on claim-office.

Exit-reason breakdown of the archived runs:

| route | runs | `ok` | `timeout` | `pi-retries-exhausted` |
|---|---|---|---|---|
| `kimi-k3` (sference) | 3 | 2 | 0 | 1 |
| `kimi-k3-nebius` | 15 | 9 | 4 | 2 |

Since a provider-specific artifact cannot be ruled out for the `ok` runs
either, the whole set was retired rather than partially reused.

## What replaced them

Requesty reported the stream issue fixed on 2026-08-04. sference became the
preferred route again — it offers prompt caching and double the max output of
nebius. The RQ cells were refilled under the new lab id **`kimi-k3-sference`**
(plus its `-no-thinking` arm), so the old nebius data stays separable from the
new data instead of being smeared into one cell.

Affected RQs: `RQ-model-quality-pi`, `RQ-model-novel-pi`.

These runs are kept for one purpose only: a later routing comparison
(sference vs. nebius). They must not be aggregated into current findings.
