# Variant Provenance

- Parent workflow: `exact-sol-v1.6-test-list-dimensions-cc`
- Change under test: operationalize the existing inline Refactor phase without introducing an isolated subagent
- Added obligations: evaluate naming first; try and verify the strongest plausible behavior-preserving refactoring every cycle; treat helper extraction as an explicit option for naming distinct decisions, transformations, policies, predicates, or orchestration steps
- Retained guard: do not extract solely to shorten a function, move a metric, create symmetry, or satisfy the trial obligation; cohesive domain decisions remain together and unsuccessful trials are undone
- Retained unchanged: independent-dimensions test-list cross-check, one shared context, Predictive TDD mechanics, Four Rules order, domain-responsibility review, mandatory domain-boundary trial, stack profiles, native Claude Code harness, autonomy hardening, and parser-visible markers
- Cost boundary: no subagent is added; the treatment changes inline Refactor instructions only
- Validation status: unmeasured; driver RQ `RQ-inline-refactor-operationalization-opus-native`
