# Analysis Report: 2026-10-01_07-23-14_claim-office-example-mapping_exact-ptdd-v1.1-refactor-subagent-cc_opus-5-no-thinking

Generated: 2026-10-01T09:23:21+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-ptdd-v1.1-refactor-subagent-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 7201s |
| Started | 2026-10-01T07:23:14+00:00 |
| Ended | 2026-10-01T09:23:21+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts
- **Implementation LOC** (total): 227
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 229
- **Active tests**: 28
- **Remaining todos**: 32

## Test Results

**Status**: ✅ All tests passing (28 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-10-01_07-23-14_claim-office-example-mapping_exact-ptdd-v1.1-refactor-subagent-cc_opus-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-10-01_07-23-14_claim-office-example-mapping_exact-ptdd-v1.1-refactor-subagent-cc_opus-5-no-thinking

 ✓ src/claim-office.spec.ts  (60 tests | 32 skipped) 6ms

 Test Files  1 passed (1)
      Tests  28 passed | 32 todo (60)
   Start at  09:23:22
   Duration  326ms (transform 79ms, setup 0ms, collect 64ms, tests 6ms, environment 0ms, prepare 80ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 100% |
| Branches | 100% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 59 | ×1 | 59 |
| Invocations | 53 | ×2 | 106 |
| Conditionals | 7 | ×4 | 28 |
| Loops | 13 | ×5 | 65 |
| Assignments | 37 | ×6 | 222 |
| **Total Mass** | | | **480** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 117 |
| Functions | 15 |
| Longest Function | 10 lines |
| Avg LOC/Function | 4.73 |
| Median LOC/Function | 3.00 |
| Imports | 0 |

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
| McCabe (Cyclomatic) | 3 | 1.73 | 0 |
| Cognitive (SonarJS) | 2 | 1.38 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 36922729 |
| Context Utilization | 98% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 42 |
| Avg Cycle Time | 169.43s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 169.43s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 58 |
| Predictions Total | 59 |
| Accuracy | 98% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 28 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


