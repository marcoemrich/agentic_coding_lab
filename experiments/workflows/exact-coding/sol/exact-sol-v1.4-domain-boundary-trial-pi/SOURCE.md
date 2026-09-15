# Variant Provenance

- Parent lab workflow: `exact-sol-v1.3.2-local-git-control-pi`
- Parent method: SOL Predictive TDD with complete stack-profile extraction
- Variant change: adds the same domain-responsibility, change-counterfactual, mandatory boundary-trial, and semantic before/after mechanism tested in `exact-tcr-v1.3-domain-boundary-trial-pi`
- TDD-specific adaptation: trials use Predictive TDD's predict/check/undo loop and create no TCR method commits
- Stack boundary: TypeScript/Vitest and Java/JUnit/Maven profiles are inherited byte-identically
- Harness condition: runs use the same isolated local Git setup as the TCR comparison, but Git does not enforce Predictive TDD phases
