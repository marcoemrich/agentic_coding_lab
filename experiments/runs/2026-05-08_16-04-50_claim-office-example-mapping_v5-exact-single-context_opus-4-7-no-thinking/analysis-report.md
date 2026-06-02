# Analysis Report: 2026-05-08_16-04-50_claim-office-example-mapping_v5-exact-single-context_opus-4-7-no-thinking

Generated: 2026-06-02T07:53:42+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v5-exact-single-context |
| Model | opus-4-7-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 822s |
| Started | 2026-05-08T16:04:50+00:00 |
| Ended | 2026-05-08T16:18:33+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 286
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 581
- **Active tests**: 39
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (39 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-08_16-04-50_claim-office-example-mapping_v5-exact-single-context_opus-4-7-no-thinking
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-08_16-04-50_claim-office-example-mapping_v5-exact-single-context_opus-4-7-no-thinking

 ✓ src/claim-office.spec.ts  (39 tests) 7ms

 Test Files  1 passed (1)
      Tests  39 passed (39)
   Start at  07:53:43
   Duration  372ms (transform 41ms, setup 0ms, collect 37ms, tests 7ms, environment 0ms, prepare 73ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 84% |
| Branches | 91% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 75 | ×1 | 75 |
| Invocations | 87 | ×2 | 174 |
| Conditionals | 18 | ×4 | 72 |
| Loops | 20 | ×5 | 100 |
| Assignments | 77 | ×6 | 462 |
| **Total Mass** | | | **883** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 246 |
| Functions | 13 |
| Longest Function | 39 lines |
| Avg LOC/Function | 11.77 |
| Median LOC/Function | 7.00 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 2 |
| Duplication | 0 |
| Magic Numbers | 2 |
| Code Quality | 0 |
| **Total** | **4** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 11 | 3.11 | 1 |
| Cognitive (SonarJS) | 12 | 3.92 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 21511782 |
| Context Utilization | 13% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 5 |
| Avg Cycle Time | 166.57s |
| Avg Red Phase | 135.93s |
| Avg Green Phase | 14.49s |
| Avg Refactor Phase | 16.15s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 6 |
| Predictions Total | 6 |
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


