# Analysis Report: 2026-09-24_04-57-22_claim-office-example-mapping_exact-ptdd-v1.1-refactor-subagent-pi_gpt-6-sol-codex

Generated: 2026-09-24T06:21:05+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-ptdd-v1.1-refactor-subagent-pi |
| Model | gpt-6-sol-codex |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 5017s |
| Started | 2026-09-24T04:57:23+00:00 |
| Ended | 2026-09-24T06:21:04+00:00 |

## Code Metrics

- **Implementation files**: claim-cap.ts, claim-damage.ts, claim.ts, cli.ts, insurance-sum.ts, insurance-value.ts, quote-premium.ts, scenario-results.ts
- **Implementation LOC** (total): 204
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 135
- **Active tests**: 44
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (44 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-24_04-57-22_claim-office-example-mapping_exact-ptdd-v1.1-refactor-subagent-pi_gpt-6-sol-codex
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-24_04-57-22_claim-office-example-mapping_exact-ptdd-v1.1-refactor-subagent-pi_gpt-6-sol-codex

 ✓ src/claim-office.spec.ts  (44 tests) 4196ms

 Test Files  1 passed (1)
      Tests  44 passed (44)
   Start at  06:21:06
   Duration  4.43s (transform 41ms, setup 0ms, collect 41ms, tests 4.20s, environment 0ms, prepare 65ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 0% |
| Branches | 0% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 75 | ×1 | 75 |
| Invocations | 102 | ×2 | 204 |
| Conditionals | 26 | ×4 | 104 |
| Loops | 7 | ×5 | 35 |
| Assignments | 57 | ×6 | 342 |
| **Total Mass** | | | **760** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 168 |
| Functions | 28 |
| Longest Function | 18 lines |
| Avg LOC/Function | 4.39 |
| Median LOC/Function | 3.00 |
| Imports | 9 |

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
| McCabe (Cyclomatic) | 6 | 1.68 | 0 |
| Cognitive (SonarJS) | 5 | 1.85 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 16541980 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 44 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 88 |
| Predictions Total | 88 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 44 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


