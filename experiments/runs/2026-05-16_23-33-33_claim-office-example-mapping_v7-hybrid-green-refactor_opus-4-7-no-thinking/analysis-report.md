# Analysis Report: 2026-05-16_23-33-33_claim-office-example-mapping_v7-hybrid-green-refactor_opus-4-7-no-thinking

Generated: 2026-05-17T00:11:23+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v7-hybrid-green-refactor |
| Model | opus-4-7-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 2269s |
| Started | 2026-05-16T23:33:33+00:00 |
| Ended | 2026-05-17T00:11:23+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 238
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 480
- **Active tests**: 28
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (28 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-16_23-33-33_claim-office-example-mapping_v7-hybrid-green-refactor_opus-4-7-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-16_23-33-33_claim-office-example-mapping_v7-hybrid-green-refactor_opus-4-7-no-thinking

 ✓ src/claim-office.spec.ts  (28 tests) 10ms

 Test Files  1 passed (1)
      Tests  28 passed (28)
   Start at  00:11:24
   Duration  182ms (transform 48ms, setup 0ms, collect 46ms, tests 10ms, environment 0ms, prepare 43ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 94% |
| Branches | 92% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 57 | ×1 | 57 |
| Invocations | 85 | ×2 | 170 |
| Conditionals | 18 | ×4 | 72 |
| Loops | 13 | ×5 | 65 |
| Assignments | 104 | ×6 | 624 |
| **Total Mass** | | | **988** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 207 |
| Functions | 26 |
| Longest Function | 14 lines |
| Avg LOC/Function | 4.92 |
| Median LOC/Function | 3.00 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 1 |
| Duplication | 0 |
| Magic Numbers | 0 |
| Code Quality | 0 |
| **Total** | **1** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 4 | 1.69 | 0 |
| Cognitive (SonarJS) | 4 | 1.93 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 24539960 |
| Context Utilization | 17% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 21 |
| Avg Cycle Time | 122.57s |
| Avg Red Phase | 33.78s |
| Avg Green Phase | 32.07s |
| Avg Refactor Phase | 56.72s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 42 |
| Predictions Total | 42 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 15 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 4 |


