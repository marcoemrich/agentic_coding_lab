# Analysis Report: 2026-09-24_04-57-33_claim-office-example-mapping_exact-ptdd-v1.1-refactor-subagent-pi_gpt-6-sol-codex

Generated: 2026-09-24T05:20:23+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-ptdd-v1.1-refactor-subagent-pi |
| Model | gpt-6-sol-codex |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 1366s |
| Started | 2026-09-24T04:57:34+00:00 |
| Ended | 2026-09-24T05:20:23+00:00 |

## Code Metrics

- **Implementation files**: claims.ts, cli.ts, coverage.ts, item-prices.ts, premiums.ts, scenario.ts
- **Implementation LOC** (total): 133
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 81
- **Active tests**: 49
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (49 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-24_04-57-33_claim-office-example-mapping_exact-ptdd-v1.1-refactor-subagent-pi_gpt-6-sol-codex
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-24_04-57-33_claim-office-example-mapping_exact-ptdd-v1.1-refactor-subagent-pi_gpt-6-sol-codex

 ✓ src/claim-office.spec.ts  (49 tests) 5245ms

 Test Files  1 passed (1)
      Tests  49 passed (49)
   Start at  05:20:24
   Duration  5.52s (transform 46ms, setup 0ms, collect 41ms, tests 5.25s, environment 0ms, prepare 74ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 0% |
| Branches | 0% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 69 | ×1 | 69 |
| Invocations | 56 | ×2 | 112 |
| Conditionals | 12 | ×4 | 48 |
| Loops | 5 | ×5 | 25 |
| Assignments | 49 | ×6 | 294 |
| **Total Mass** | | | **548** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 114 |
| Functions | 13 |
| Longest Function | 18 lines |
| Avg LOC/Function | 5.00 |
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
| McCabe (Cyclomatic) | 4 | 1.63 | 0 |
| Cognitive (SonarJS) | 3 | 2.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 3824180 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 9 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 18 |
| Predictions Total | 18 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 9 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


