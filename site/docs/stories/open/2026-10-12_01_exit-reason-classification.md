# Exit reason classification

Status: open
Source: [site data export mapping](2026-10-11_05_site-data-export.md), 2026-10-12.
Blocks: [site data export](2026-10-11_05_site-data-export.md).

## Story

Every crash currently ends as `error-<code>`, whatever the cause. Give `analyze-run.sh` and `batch.sh` distinct exit reasons for the three causes found in the run pool: a setup error (model not found, CLI too old for the model, untrusted workspace — the agent never wrote a line), an API 500 mid-run, and a provider refusal (a safeguard flag mid-run). Retry an API 500 like a transient error. The site data export counts infrastructure aborts and provider refusals separately and needs this distinction.

## Example Mapping

Pending interview with the domain expert. Rules, concrete input/output examples, boundary cases and open questions have not yet been mapped.
