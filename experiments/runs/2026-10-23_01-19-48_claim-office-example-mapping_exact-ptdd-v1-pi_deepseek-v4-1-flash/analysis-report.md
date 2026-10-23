# Analysis Report: 2026-10-23_01-19-48_claim-office-example-mapping_exact-ptdd-v1-pi_deepseek-v4-1-flash

Generated: 2026-10-23T01:54:28+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-ptdd-v1-pi |
| Model | deepseek-v4-1-flash |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 2072s |
| Started | 2026-10-23T01:19:50+00:00 |
| Ended | 2026-10-23T01:54:28+00:00 |

## Code Metrics

- **Implementation files**: cli.ts, scenario.ts
- **Implementation LOC** (total): 234
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 362
- **Active tests**: 40
- **Remaining todos**: 4

## Test Results

**Status**: ✅ All tests passing (40 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-10-23_01-19-48_claim-office-example-mapping_exact-ptdd-v1-pi_deepseek-v4-1-flash
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-10-23_01-19-48_claim-office-example-mapping_exact-ptdd-v1-pi_deepseek-v4-1-flash

 ✓ src/claim-office.spec.ts  (44 tests | 4 skipped) 476ms

 Test Files  1 passed (1)
      Tests  40 passed | 4 todo (44)
   Start at  01:54:29
   Duration  762ms (transform 65ms, setup 0ms, collect 66ms, tests 476ms, environment 0ms, prepare 81ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 89% |
| Branches | 92% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 52 | ×1 | 52 |
| Invocations | 90 | ×2 | 180 |
| Conditionals | 12 | ×4 | 48 |
| Loops | 7 | ×5 | 35 |
| Assignments | 49 | ×6 | 294 |
| **Total Mass** | | | **609** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 196 |
| Functions | 22 |
| Longest Function | 15 lines |
| Avg LOC/Function | 5.18 |
| Median LOC/Function | 3.00 |
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
| McCabe (Cyclomatic) | 4 | 1.48 | 0 |
| Cognitive (SonarJS) | 3 | 1.50 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 11422757 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 41 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 80 |
| Predictions Total | 80 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 40 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


