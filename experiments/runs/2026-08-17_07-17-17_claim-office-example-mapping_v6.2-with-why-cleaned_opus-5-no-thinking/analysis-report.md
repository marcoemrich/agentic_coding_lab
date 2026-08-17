# Analysis Report: 2026-08-17_07-17-17_claim-office-example-mapping_v6.2-with-why-cleaned_opus-5-no-thinking

Generated: 2026-08-17T10:36:27+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.2-with-why-cleaned |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 2739s |
| Started | 2026-08-17T07:17:17+00:00 |
| Ended | 2026-08-17T08:02:58+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 362
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 629
- **Active tests**: 36
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (38 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab/experiments/runs/2026-08-17_07-17-17_claim-office-example-mapping_v6.2-with-why-cleaned_opus-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab/experiments/runs/2026-08-17_07-17-17_claim-office-example-mapping_v6.2-with-why-cleaned_opus-5-no-thinking

 ✓ src/claim-office.spec.ts  (36 tests) 7ms
 ✓ src/cli.spec.ts  (2 tests) 653ms

 Test Files  2 passed (2)
      Tests  38 passed (38)
   Start at  10:36:28
   Duration  1.02s (transform 55ms, setup 0ms, collect 75ms, tests 660ms, environment 0ms, prepare 157ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 93% |
| Branches | 98% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 71 | ×1 | 71 |
| Invocations | 83 | ×2 | 166 |
| Conditionals | 8 | ×4 | 32 |
| Loops | 15 | ×5 | 75 |
| Assignments | 91 | ×6 | 546 |
| **Total Mass** | | | **890** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 238 |
| Functions | 34 |
| Longest Function | 16 lines |
| Avg LOC/Function | 4.29 |
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
| McCabe (Cyclomatic) | 3 | 1.30 | 0 |
| Cognitive (SonarJS) | 4 | 1.50 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 71227970 |
| Context Utilization | 164% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 26 |
| Avg Cycle Time | 114.03s |
| Avg Red Phase | 24.45s |
| Avg Green Phase | 23.19s |
| Avg Refactor Phase | 66.39s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 52 |
| Predictions Total | 52 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 23 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 3 |


