# Broken-run cleanup

Status: open
Source: [site data export mapping](../done/2026-10-11_05_site-data-export.md), 2026-10-12.

## Story

Broken runs are deleted regularly so a re-run of the RQ refills them. A script removes runs with an excluding exit reason (timeout, infrastructure abort, provider refusal) from `experiments/runs/` and re-aggregates the affected RQs. It runs on the user's call, never automatically; the runs stay recoverable from git history. Five such runs were removed by hand on 2026-10-12.

## Example Mapping

Pending interview with the domain expert. Rules, concrete input/output examples, boundary cases and open questions have not yet been mapped.
