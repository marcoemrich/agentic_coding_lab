## 2026-09-14T18:35:33Z — [RED] reverted
- Attempted: test that blocks form per component type, not across types (2 runes + 1 moonstone; 3 runes + 3 moonstones)
- Expected: RED — test should fail
- Actual: exit 0 — passed unexpectedly; per-type counting was already implemented by the previous block-discount step
## 2026-09-14T18:37:30Z — [RED] reverted
- Attempted: dragon-material full reimbursement, and high-enchantment winning over dragon material
- Expected: RED — test should fail
- Actual: exit 0 — passed unexpectedly; default reimbursement is already full, so dragon material has no observable effect yet
## 2026-09-14T18:39:47Z — [RED] reverted
- Attempted: follow-up contract discount applied from the second quote step onwards
- Expected: RED — test should fail
- Actual: exit 0 — passed unexpectedly; the contract index increment was already present from the scenario-runner GREEN step
## 2026-09-14T18:40:42Z — [RED] reverted
- Attempted: CLI exits non-zero, writes the error to stderr and nothing to stdout on an unknown item type
- Expected: RED — test should fail
- Actual: exit 0 — passed unexpectedly; the error handler was already written as part of the CLI entry point GREEN step
