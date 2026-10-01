# Archived runs

Underscore-prefixed directories under `experiments/runs/` are skipped by both
`aggregate-by-query.py` and `batch-plan-from-rq.py`, so a run moved here leaves
the query pool without being deleted.

Move a run here only when it would otherwise be counted toward a cell it cannot
serve. Never move a run that another RQ reads — aggregation is query-based, so
the only way to find out is to check which RQs match its selector first.

| Run | Why |
|---|---|
| `2026-09-30_00-09-58_claim-office-example-mapping_external-kesseler-2026-09-30-cc_opus-5-5-no-thinking` | Vendoring smoke test, taken before the vitest TDD reporter landed, so it carries no `tdd-events.jsonl` and no discipline column. It matches RQ-tdd-workflow-comparison-opus55's selector and would have counted as one of that cell's five replicates while contributing nothing to the RQ's primary axis. No other RQ reads it. |
| `2026-09-30_00-12-44_…_exact-hybrid-v2-testlist-fix-cc_opus-5-5-no-thinking` (5 runs, suffixes bare and `-2`…`-5`) | Same reason, and taken deliberately rather than as a side effect. They predate the reporter, so they carry no discipline column, and `batch-plan-from-rq.py` counts runs rather than event streams — left in the pool they reported RQ-tdd-workflow-comparison-opus55's hybrid-v2 cell as full and the primary axis of that cell would have stayed empty. **RQ-old-vs-new-exact-line-opus55 also read these five**, and its token, cost and subagent tables rest on them; the refill that replaces them lands on identical cell coordinates, so that RQ regains the cell with reporter data and its findings are re-derived against the new runs. |
