# Analysis Report: 2026-05-19_06-49-46_claim-office-example-mapping_v6-hybrid_opus-4-6-portkey-no-thinking-2

Generated: 2026-05-19T07:53:42+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6-hybrid |
| Model | opus-4-6-portkey-no-thinking |
| Model Version(s) | claude-opus-4-6 |
| Thinking | unknown |
| Duration | 3834s |
| Started | 2026-05-19T06:49:46+00:00 |
| Ended | 2026-05-19T07:53:42+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 183
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 501
- **Active tests**: 25
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (25 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-19_06-49-46_claim-office-example-mapping_v6-hybrid_opus-4-6-portkey-no-thinking-2
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-19_06-49-46_claim-office-example-mapping_v6-hybrid_opus-4-6-portkey-no-thinking-2

 ✓ src/claim-office.spec.ts  (25 tests) 6ms

 Test Files  1 passed (1)
      Tests  25 passed (25)
   Start at  07:53:43
   Duration  190ms (transform 42ms, setup 0ms, collect 42ms, tests 6ms, environment 0ms, prepare 46ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 94% |
| Branches | 98% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 64 | ×1 | 64 |
| Invocations | 54 | ×2 | 108 |
| Conditionals | 10 | ×4 | 40 |
| Loops | 8 | ×5 | 40 |
| Assignments | 68 | ×6 | 408 |
| **Total Mass** | | | **660** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 152 |
| Functions | 19 |
| Longest Function | 19 lines |
| Avg LOC/Function | 4.21 |
| Median LOC/Function | 2.00 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 1 |
| Code Quality | 0 |
| **Total** | **1** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 4 | 1.57 | 0 |
| Cognitive (SonarJS) | 4 | 1.64 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 430167 |
| Context Utilization | 21% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 0 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 0 |
| Predictions Total | 0 |
| Accuracy | N/A |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 0 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


