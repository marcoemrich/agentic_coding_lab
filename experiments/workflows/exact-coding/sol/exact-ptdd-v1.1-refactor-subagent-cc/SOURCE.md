# Source

Claude Code port of `exact-ptdd-v1.1-refactor-subagent-pi`, branching from `exact-ptdd-v1-cc` for `RQ-ptdd-refactor-subagent-cross-model`.

The sole treatment is execution context for the per-cycle Refactor phase: Red and Green remain in the main Predictive-TDD context, while the unchanged Four Rules and domain-boundary contract is executed by an isolated `refactor` Task subagent. Test-list dimensions, predictions, stack profiles, narrow undo, lab markers, and autonomy remain unchanged.

Validation status: unmeasured before the RQ smoke and fill runs.
