# Source

Experimental branch of `exact-ptdd-v1-pi` for `RQ-ptdd-refactor-subagent-cross-model`.

The sole treatment is execution context for the per-cycle Refactor phase: Red and Green remain in the main Predictive-TDD context, while the unchanged Four Rules and domain-boundary contract is executed by an isolated `refactor` subagent. The pi subagent extension is copied from the previously validated delegated PTDD arm. Test-list dimensions, predictions, stack profiles, narrow undo, lab markers, and autonomy remain unchanged.

Validation status: unmeasured before the RQ smoke and fill runs.
