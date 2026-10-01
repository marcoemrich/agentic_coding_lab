# Analysis Report: 2026-10-01_02-02-43_claim-office-example-mapping_exact-ptdd-v1-cc_opus-5-no-thinking

Generated: 2026-10-01T02:27:49+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-ptdd-v1-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 1502s |
| Started | 2026-10-01T02:02:43+00:00 |
| Ended | 2026-10-01T02:27:49+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 353
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 903
- **Active tests**: 69
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (69 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-10-01_02-02-43_claim-office-example-mapping_exact-ptdd-v1-cc_opus-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-10-01_02-02-43_claim-office-example-mapping_exact-ptdd-v1-cc_opus-5-no-thinking

 ✓ src/claim-office.spec.ts  (69 tests) 1563ms

 Test Files  1 passed (1)
      Tests  69 passed (69)
   Start at  02:27:50
   Duration  1.90s (transform 117ms, setup 0ms, collect 90ms, tests 1.56s, environment 0ms, prepare 76ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 92% |
| Branches | 98% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 67 | ×1 | 67 |
| Invocations | 114 | ×2 | 228 |
| Conditionals | 15 | ×4 | 60 |
| Loops | 10 | ×5 | 50 |
| Assignments | 55 | ×6 | 330 |
| **Total Mass** | | | **735** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 277 |
| Functions | 32 |
| Longest Function | 14 lines |
| Avg LOC/Function | 5.56 |
| Median LOC/Function | 5.50 |
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
| McCabe (Cyclomatic) | 3 | 1.48 | 0 |
| Cognitive (SonarJS) | 3 | 1.50 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 28208559 |
| Context Utilization | 85% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 114 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 138 |
| Predictions Total | 138 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 69 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 46 |


