# Analysis Report: 2026-05-18_17-48-07_claim-office-example-mapping_v6.1-no-app_opus-4-7-no-thinking

Generated: 2026-05-18T18:39:04+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.1-no-app |
| Model | opus-4-7-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 3056s |
| Started | 2026-05-18T17:48:07+00:00 |
| Ended | 2026-05-18T18:39:04+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 202
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 590
- **Active tests**: 32
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (32 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-18_17-48-07_claim-office-example-mapping_v6.1-no-app_opus-4-7-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-18_17-48-07_claim-office-example-mapping_v6.1-no-app_opus-4-7-no-thinking

 ✓ src/claim-office.spec.ts  (32 tests) 7ms

 Test Files  1 passed (1)
      Tests  32 passed (32)
   Start at  18:39:04
   Duration  208ms (transform 47ms, setup 0ms, collect 58ms, tests 7ms, environment 0ms, prepare 50ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 89% |
| Branches | 98% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 49 | ×1 | 49 |
| Invocations | 72 | ×2 | 144 |
| Conditionals | 7 | ×4 | 28 |
| Loops | 4 | ×5 | 20 |
| Assignments | 89 | ×6 | 534 |
| **Total Mass** | | | **775** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 163 |
| Functions | 33 |
| Longest Function | 15 lines |
| Avg LOC/Function | 3.21 |
| Median LOC/Function | 2.00 |
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
| McCabe (Cyclomatic) | 4 | 1.33 | 0 |
| Cognitive (SonarJS) | 4 | 1.50 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 41296962 |
| Context Utilization | 17% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 32 |
| Avg Cycle Time | 113.41s |
| Avg Red Phase | 28.43s |
| Avg Green Phase | 30.9s |
| Avg Refactor Phase | 54.08s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 62 |
| Predictions Total | 64 |
| Accuracy | 96% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 29 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 15 |


