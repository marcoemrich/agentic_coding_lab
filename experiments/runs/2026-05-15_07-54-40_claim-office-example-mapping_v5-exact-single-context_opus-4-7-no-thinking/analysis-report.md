# Analysis Report: 2026-05-15_07-54-40_claim-office-example-mapping_v5-exact-single-context_opus-4-7-no-thinking

Generated: 2026-06-02T08:15:28+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v5-exact-single-context |
| Model | opus-4-7-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 728s |
| Started | 2026-05-15T07:54:40+00:00 |
| Ended | 2026-05-15T08:06:49+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 257
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 396
- **Active tests**: 36
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (36 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-15_07-54-40_claim-office-example-mapping_v5-exact-single-context_opus-4-7-no-thinking
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-15_07-54-40_claim-office-example-mapping_v5-exact-single-context_opus-4-7-no-thinking

 ✓ src/claim-office.spec.ts  (36 tests) 7ms

 Test Files  1 passed (1)
      Tests  36 passed (36)
   Start at  08:15:29
   Duration  354ms (transform 50ms, setup 0ms, collect 40ms, tests 7ms, environment 0ms, prepare 148ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 89% |
| Branches | 93% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 61 | ×1 | 61 |
| Invocations | 82 | ×2 | 164 |
| Conditionals | 21 | ×4 | 84 |
| Loops | 12 | ×5 | 60 |
| Assignments | 74 | ×6 | 444 |
| **Total Mass** | | | **813** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 219 |
| Functions | 17 |
| Longest Function | 38 lines |
| Avg LOC/Function | 7.65 |
| Median LOC/Function | 2.00 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 1 |
| Duplication | 0 |
| Magic Numbers | 19 |
| Code Quality | 0 |
| **Total** | **20** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 9 | 2.74 | 0 |
| Cognitive (SonarJS) | 10 | 3.64 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 13891241 |
| Context Utilization | 12% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 5 |
| Avg Cycle Time | 154.71s |
| Avg Red Phase | 126.28s |
| Avg Green Phase | 17.47s |
| Avg Refactor Phase | 10.96s |

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
| Refactorings Applied | 1 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 3 |


