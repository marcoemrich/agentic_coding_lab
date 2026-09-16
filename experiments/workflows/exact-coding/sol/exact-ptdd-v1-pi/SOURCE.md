# Source

Canonical versioned Predictive-TDD workflow, promoted from `exact-sol-v1.6-test-list-dimensions-pi` after `RQ-test-list-dimensions-replication`.

## Product identity

- Product line: EXACT Coding Predictive TDD
- Version: v1
- Native harness port: pi
- Universal default: yes

The product name deliberately omits model and historical lineage. The same methodology is maintained for every supported harness; `-pi` identifies only this harness port.

## Validated behavior

The workflow combines the v1.5 Predictive-TDD, Four Rules, domain-boundary, stack-profile, and narrow-undo contracts with the independent-dimensions test-list cross-check introduced in v1.6.

At n=10 per cell on Claim Office, both v1.5 and this workflow achieve complete Correctness (external) on GPT-5.6 SOL/pi. On native Opus, the dimensions cross-check improves the observed correctness floor. The shared v1 workflow is selected as the universal maintained default to avoid divergent product lines.

Lab-only markers and autonomous execution remain research infrastructure and are removed or transformed by the consumer export.
