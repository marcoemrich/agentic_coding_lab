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
| `2026-09-23_*_exact-ptdd-v1-cc_opus-5-5-no-thinking` and `…_exact-ptdd-v1.1-refactor-subagent-cc_opus-5-5-no-thinking` (10 runs) | Pre-reporter, archived when the two maintained-line Predictive-TDD cells were added to RQ-tdd-workflow-comparison-opus55. Read by RQ-opus55-current-workflow and RQ-old-vs-new-exact-line-opus55; the refill lands on identical cell coordinates for both. |
| `2026-09-23_*_{baseline-inline-tdd-v1.1-local-git-cc,exact-ptdd-v1-cc,exact-ptdd-v1.1-refactor-subagent-cc}_{opus-5,opus-5-5}-no-thinking` (30 runs, the 10 above included) | RQ-opus55-current-workflow's complete run set. It is being refilled in full rather than reanalysed: the RQ swapped its three retired suite-shape outcomes for the phase chain, and the event stream the chain reads cannot be reconstructed after a run. Both model arms are replaced together — re-measuring only one would confound the model factor with the measurement change. RQ-1.7 and RQ-1.10 read 10 and 15 of these but pin no `harness_version` and pool across batches, so no cell of theirs drops below `min_replicates`. |
