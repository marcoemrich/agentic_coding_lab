# Usable-run replicates

Status: open
Source: [site data export mapping](2026-10-11_05_site-data-export.md), 2026-10-12.
Blocks: [site data export](2026-10-11_05_site-data-export.md).

## Story

Timeouts are no longer findings. `min_replicates` counts only usable runs, and timeouts are refilled like infrastructure aborts. Change the fill logic (`batch-plan-from-rq.py`, `rq_facts.py` / `rq-status.py`) accordingly and remove the old rule ("Timeouts are findings") from `CLAUDE.md`, the README and the `/run-rq` skill.

## Example Mapping

Pending interview with the domain expert. Rules, concrete input/output examples, boundary cases and open questions have not yet been mapped.
