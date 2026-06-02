# Analysis Report: 2026-05-08_15-54-26_claim-office-example-mapping_v5-exact-single-context_opus-4-7-no-thinking

Generated: 2026-06-02T07:53:31+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v5-exact-single-context |
| Model | opus-4-7-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 607s |
| Started | 2026-05-08T15:54:26+00:00 |
| Ended | 2026-05-08T16:04:35+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 220
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 431
- **Active tests**: 34
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (34 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-08_15-54-26_claim-office-example-mapping_v5-exact-single-context_opus-4-7-no-thinking
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-08_15-54-26_claim-office-example-mapping_v5-exact-single-context_opus-4-7-no-thinking

 ✓ src/claim-office.spec.ts  (34 tests) 6ms

 Test Files  1 passed (1)
      Tests  34 passed (34)
   Start at  07:53:31
   Duration  379ms (transform 37ms, setup 0ms, collect 34ms, tests 6ms, environment 0ms, prepare 72ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 87% |
| Branches | 93% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 66 | ×1 | 66 |
| Invocations | 71 | ×2 | 142 |
| Conditionals | 24 | ×4 | 96 |
| Loops | 7 | ×5 | 35 |
| Assignments | 70 | ×6 | 420 |
| **Total Mass** | | | **759** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 188 |
| Functions | 13 |
| Longest Function | 24 lines |
| Avg LOC/Function | 9.15 |
| Median LOC/Function | 7.00 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 11 |
| Code Quality | 0 |
| **Total** | **11** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 6 | 2.56 | 0 |
| Cognitive (SonarJS) | 8 | 4.33 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 12322036 |
| Context Utilization | 12% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 5 |
| Avg Cycle Time | 124.99s |
| Avg Red Phase | 84.02s |
| Avg Green Phase | 32.97s |
| Avg Refactor Phase | 8s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 8 |
| Predictions Total | 8 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 3 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 2 |


