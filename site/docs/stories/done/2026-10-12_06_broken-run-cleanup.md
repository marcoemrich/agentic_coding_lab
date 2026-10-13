# Broken-run cleanup

Status: done
Source: [site data export mapping](2026-10-11_05_site-data-export.md), 2026-10-12.

## Story

Broken runs are deleted regularly so a re-run of the RQ refills them. A script removes runs with an excluding exit reason (timeout, infrastructure abort, provider refusal) from `experiments/runs/` and re-aggregates the affected RQs. It runs on the user's call, never automatically; the runs stay recoverable from git history. Five such runs were removed by hand on 2026-10-12.

## Built

`experiments/clean-broken-runs.py` deletes every run that is not a replicate: any `exit_reason` other than `ok`, and stubs without one (`rq_facts.is_replicate`). The whole pool is in scope, whether an RQ selects the run or not and whether it is committed or not. A run directory without a readable `metrics.json` stays and is reported while git tracks something in it. One that git tracks nothing in is a leftover of an earlier `git rm` (ignored `node_modules/`, `run.log` stay behind) and is deleted outside the commit. `_`- and `.`-prefixed directories (`_archive/`, the `.pnpm-store/` mutation cache) are not runs and stay unreported.

It holds the aggregator's batch lock. Afterwards it re-aggregates every RQ whose selector matched a deleted run; an RQ naming an archived workflow is skipped with a note. It commits the tracked deleted run directories and the re-aggregated RQ files in one commit of exactly those paths, on the current branch, without pushing. Subject: the count ("Delete 18 broken runs"); body: each run id with its exit reason (`unfinished` for a stub) and the re-aggregated RQ ids. With nothing broken it says "no broken runs", commits nothing and exits 0. A failed re-aggregation, or an RQ whose README cannot be read, is named, the rest is committed, and the exit code is 1.

On the pool of 2026-10-13 a read-only preview found 18 broken runs (all committed), 16 leftovers and 10 affected RQs, none archived. Tests: `experiments/tests/test_clean_broken_runs.py` (27), against a throwaway git repository with re-aggregation injected.

Two rules were added after the mapping, when the preview hit the real pool: dot-prefixed directories are outside the pool, and untracked metrics-less directories are deleted as leftovers.

Decided along the way:

- A deleted timeout or abort leaves the site's per-cell counters; the site shows the current pool, the history lives in git.
- Recoverability from git applies to committed runs only; an uncommitted broken run is deleted anyway.
- The cleanup deletes right away; the call is the decision and git is the undo.
- It runs on the user's call, never automatically.
