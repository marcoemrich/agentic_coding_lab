# Analysis Report: 2026-10-23_01-19-48_claim-office-example-mapping_exact-ptdd-v1-pi_glm-5-3

Generated: 2026-10-23T01:28:43+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-ptdd-v1-pi |
| Model | glm-5-3 |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 526s |
| Started | 2026-10-23T01:19:50+00:00 |
| Ended | 2026-10-23T01:28:42+00:00 |

## Code Metrics

- **Implementation files**: cli.ts, scenario.ts, test-cli-helper.ts
- **Implementation LOC** (total): 299
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 461
- **Active tests**: 45
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (45 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-10-23_01-19-48_claim-office-example-mapping_exact-ptdd-v1-pi_glm-5-3
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-10-23_01-19-48_claim-office-example-mapping_exact-ptdd-v1-pi_glm-5-3

 ✓ src/claim-office.spec.ts  (45 tests) 810ms

 Test Files  1 passed (1)
      Tests  45 passed (45)
   Start at  01:28:44
   Duration  1.10s (transform 93ms, setup 0ms, collect 81ms, tests 810ms, environment 0ms, prepare 72ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 91% |
| Branches | 79% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 82 | ×1 | 82 |
| Invocations | 95 | ×2 | 190 |
| Conditionals | 11 | ×4 | 44 |
| Loops | 17 | ×5 | 85 |
| Assignments | 70 | ×6 | 420 |
| **Total Mass** | | | **821** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 236 |
| Functions | 12 |
| Longest Function | 25 lines |
| Avg LOC/Function | 12.58 |
| Median LOC/Function | 11.50 |
| Imports | 3 |

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
| McCabe (Cyclomatic) | 7 | 2.29 | 0 |
| Cognitive (SonarJS) | 8 | 3.09 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 7413985 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 45 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 88 |
| Predictions Total | 90 |
| Accuracy | 97% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 45 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


