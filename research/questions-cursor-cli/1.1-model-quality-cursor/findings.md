# RQ-model-quality-cursor — Findings

**No findings. All data invalidated 2026-07-28; re-run pending.**

All 15 runs of this RQ were deleted. They ran on
`v6.2.1-phase-continuation-cursor`, a workflow built on the false premise that
cursor-agent has no subagent mechanism, so its refactor phase executed inline
in the main context.

Cursor has had subagents since v2.4 (`Task` tool, `.cursor/agents/*.md`) —
verified against the pinned `cursor-agent 2026.07.23-e383d2b` in the same
headless mode the lab uses. No deleted run contained a single `taskToolCall`
event, so the isolated-context refactor architecture was never active in any
data point of this RQ.

Two measurement paths were affected, which is why the runs were discarded
rather than re-caveated:

- `refactorings_applied` counted inline `## Refactor` headings, not delegated
  refactor phases.
- The marker mechanics that carried the `predictions_total` result were part of
  the same inline-phase contract.

The RQ question and hypotheses in `README.md` remain valid — only the data is
gone. Findings will be written fresh from re-run data via `/run-rq`. Deleted
runs stay recoverable in git history.
