# Analysis Report: 2026-05-26_10-47-28_claim-office-example-mapping_v6.2.1-refactor-vocab_opus-4-7-portkey-no-thinking

Generated: 2026-05-26T10:57:58+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.2.1-refactor-vocab |
| Model | opus-4-7-portkey-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 629s |
| Started | 2026-05-26T10:47:28+00:00 |
| Ended | 2026-05-26T10:57:58+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 62
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 126
- **Active tests**: 7
- **Remaining todos**: 31

## Test Results

**Status**: ✅ All tests passing (7 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-26_10-47-28_claim-office-example-mapping_v6.2.1-refactor-vocab_opus-4-7-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-26_10-47-28_claim-office-example-mapping_v6.2.1-refactor-vocab_opus-4-7-portkey-no-thinking

 ✓ src/claim-office.spec.ts  (38 tests | 31 skipped) 2ms

 Test Files  1 passed (1)
      Tests  7 passed | 31 todo (38)
   Start at  10:57:59
   Duration  151ms (transform 26ms, setup 0ms, collect 25ms, tests 2ms, environment 0ms, prepare 41ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 59% |
| Branches | 85% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 14 | ×1 | 14 |
| Invocations | 22 | ×2 | 44 |
| Conditionals | 1 | ×4 | 4 |
| Loops | 3 | ×5 | 15 |
| Assignments | 22 | ×6 | 132 |
| **Total Mass** | | | **209** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 53 |
| Functions | 6 |
| Longest Function | 13 lines |
| Avg LOC/Function | 5.83 |
| Median LOC/Function | 5.50 |
| Imports | 1 |

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
| McCabe (Cyclomatic) | 3 | 1.38 | 0 |
| Cognitive (SonarJS) | 3 | 2.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 7852607 |
| Context Utilization | 11% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 7 |
| Avg Cycle Time | 80.81s |
| Avg Red Phase | 17.29s |
| Avg Green Phase | 13.9s |
| Avg Refactor Phase | 49.62s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 14 |
| Predictions Total | 14 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 7 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


