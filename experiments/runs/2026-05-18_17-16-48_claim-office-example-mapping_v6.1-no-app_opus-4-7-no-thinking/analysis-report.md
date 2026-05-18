# Analysis Report: 2026-05-18_17-16-48_claim-office-example-mapping_v6.1-no-app_opus-4-7-no-thinking

Generated: 2026-05-18T17:47:50+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.1-no-app |
| Model | opus-4-7-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 1861s |
| Started | 2026-05-18T17:16:48+00:00 |
| Ended | 2026-05-18T17:47:50+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 252
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 503
- **Active tests**: 35
- **Remaining todos**: 1

## Test Results

**Status**: ✅ All tests passing (35 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-18_17-16-48_claim-office-example-mapping_v6.1-no-app_opus-4-7-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-18_17-16-48_claim-office-example-mapping_v6.1-no-app_opus-4-7-no-thinking

 ✓ src/claim-office.spec.ts  (36 tests | 1 skipped) 6ms

 Test Files  1 passed (1)
      Tests  35 passed | 1 todo (36)
   Start at  17:47:51
   Duration  186ms (transform 49ms, setup 0ms, collect 49ms, tests 6ms, environment 0ms, prepare 47ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 88% |
| Branches | 97% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 61 | ×1 | 61 |
| Invocations | 82 | ×2 | 164 |
| Conditionals | 15 | ×4 | 60 |
| Loops | 9 | ×5 | 45 |
| Assignments | 108 | ×6 | 648 |
| **Total Mass** | | | **978** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 213 |
| Functions | 28 |
| Longest Function | 14 lines |
| Avg LOC/Function | 5.04 |
| Median LOC/Function | 4.00 |
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
| McCabe (Cyclomatic) | 4 | 1.57 | 0 |
| Cognitive (SonarJS) | 5 | 2.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 31318713 |
| Context Utilization | 16% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 20 |
| Avg Cycle Time | 119.01s |
| Avg Red Phase | 42.2s |
| Avg Green Phase | 21.34s |
| Avg Refactor Phase | 55.47s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 35 |
| Predictions Total | 35 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 12 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 6 |


