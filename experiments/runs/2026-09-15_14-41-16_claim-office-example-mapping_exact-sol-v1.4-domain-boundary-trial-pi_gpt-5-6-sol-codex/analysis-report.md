# Analysis Report: 2026-09-15_14-41-16_claim-office-example-mapping_exact-sol-v1.4-domain-boundary-trial-pi_gpt-5-6-sol-codex

Generated: 2026-09-15T14:57:20+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-sol-v1.4-domain-boundary-trial-pi |
| Model | gpt-5-6-sol-codex |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 959s |
| Started | 2026-09-15T14:41:17+00:00 |
| Ended | 2026-09-15T14:57:20+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts, node-shim.d.ts
- **Implementation LOC** (total): 166
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 174
- **Active tests**: 32
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (32 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-15_14-41-16_claim-office-example-mapping_exact-sol-v1.4-domain-boundary-trial-pi_gpt-5-6-sol-codex
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-15_14-41-16_claim-office-example-mapping_exact-sol-v1.4-domain-boundary-trial-pi_gpt-5-6-sol-codex

 ✓ src/claim-office.spec.ts  (32 tests) 3162ms

 Test Files  1 passed (1)
      Tests  32 passed (32)
   Start at  14:57:21
   Duration  3.51s (transform 87ms, setup 0ms, collect 82ms, tests 3.16s, environment 0ms, prepare 90ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 92% |
| Branches | 90% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 68 | ×1 | 68 |
| Invocations | 56 | ×2 | 112 |
| Conditionals | 14 | ×4 | 56 |
| Loops | 7 | ×5 | 35 |
| Assignments | 44 | ×6 | 264 |
| **Total Mass** | | | **535** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 145 |
| Functions | 13 |
| Longest Function | 15 lines |
| Avg LOC/Function | 5.23 |
| Median LOC/Function | 5.00 |
| Imports | 2 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 0 |
| Code Quality | 0 |
| **Total** | **0** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 4 | 2.00 | 0 |
| Cognitive (SonarJS) | 3 | 2.12 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 3973663 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 32 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 24 |
| Predictions Total | 26 |
| Accuracy | 92% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 32 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


