# Variant Provenance

- Parent workflow: `exact-sol-v1.6-test-list-dimensions-pi`
- Port source: `exact-sol-v1.5-tcr-parity-domain-trial-cc`
- Harness port: Claude Code commands/rules preserving the pi variant's one shared context and Predictive TDD method
- Change: the test-list command now cross-checks independently specified dimensions, parallel catalogues, and operation-specific coverage before declaring the inactive list complete
- Failure that motivated the change: one native-Opus transfer run tested Staff and Potion premiums but omitted their independently specified insurance values, leaving four external scenarios uncovered while all internal tests passed
- Retained unchanged: Predictive TDD mechanics, Four Rules and domain-boundary review, stack profiles, autonomy hardening, and parser-visible markers
- Scope guard: representative tests remain valid where values cannot fail independently; the cross-check explicitly rejects a mechanical Cartesian product
- Validation status: unmeasured; requires marker smoke and a targeted Claim Office replication before recommendation
