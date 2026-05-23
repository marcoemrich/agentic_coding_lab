# Analysis Report: 2026-05-23_09-38-19_claim-office-example-mapping_v8b-delayed-refactor-native_opus-4-7-portkey-no-thinking

Generated: 2026-05-23T12:01:38+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v8b-delayed-refactor-native |
| Model | opus-4-7-portkey-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 272s |
| Started | 2026-05-23T09:38:19+00:00 |
| Ended | 2026-05-23T09:42:52+00:00 |

## Code Metrics

- **Implementation files**: catalog.ts, claim.ts, cli.ts, engine.ts, quote.ts, types.ts
- **Implementation LOC** (total): 373
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 629
- **Active tests**: 44
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (44 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-23_09-38-19_claim-office-example-mapping_v8b-delayed-refactor-native_opus-4-7-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-23_09-38-19_claim-office-example-mapping_v8b-delayed-refactor-native_opus-4-7-portkey-no-thinking

 ✓ src/claim-office.spec.ts  (44 tests) 1924ms

 Test Files  1 passed (1)
      Tests  44 passed (44)
   Start at  12:01:39
   Duration  2.29s (transform 47ms, setup 0ms, collect 45ms, tests 1.92s, environment 0ms, prepare 64ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 87% |
| Branches | 86% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 69 | ×1 | 69 |
| Invocations | 122 | ×2 | 244 |
| Conditionals | 20 | ×4 | 80 |
| Loops | 18 | ×5 | 90 |
| Assignments | 67 | ×6 | 402 |
| **Total Mass** | | | **885** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 311 |
| Functions | 20 |
| Longest Function | 24 lines |
| Avg LOC/Function | 6.90 |
| Median LOC/Function | 4.00 |
| Imports | 10 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 1 |
| Duplication | 0 |
| Magic Numbers | 1 |
| Code Quality | 0 |
| **Total** | **2** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 7 | 2.46 | 0 |
| Cognitive (SonarJS) | 8 | 2.75 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 3401674 |
| Context Utilization | 8% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 1 |
| Avg Cycle Time | 47.55s |
| Avg Red Phase | 2.5s |
| Avg Green Phase | 41.33s |
| Avg Refactor Phase | 3.72s |

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
| Refactorings Applied | 3 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


