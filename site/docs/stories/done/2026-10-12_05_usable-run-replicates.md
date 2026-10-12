# Usable-run replicates

Status: done
Source: [site data export mapping](../open/2026-10-11_05_site-data-export.md), 2026-10-12.

## Story

Timeouts are no longer findings. Only `ok` runs count toward `min_replicates`: `is_replicate()` in `experiments/rq_facts.py` is the rule, used by `batch-plan-from-rq.py` and `rq-status.py`. A timeout, an infrastructure abort, a provider refusal or an unrecognised `error-N` is not a replicate, so the next fill run plans a replacement, and a cell with such runs shows as short. Nothing refills automatically and there is no cap: whether to start another fill run for a cell that keeps timing out is the user's call. A timeout is not retried inside the batch. The old rule was replaced in `CLAUDE.md`, the README, the `/run-rq` skill and eleven RQ READMEs. Built without the `exact-coding` skill (lab side).

The findings of RQ-ptdd-refactor-subagent-cross-model, RQ-exact-coding-rust and RQ-opus55-current-workflow treat timeouts as findings; they are rewritten with `/reanalyze` once their cells are refilled.
