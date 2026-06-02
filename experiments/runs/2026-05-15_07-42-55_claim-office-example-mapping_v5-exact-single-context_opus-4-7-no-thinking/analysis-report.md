# Analysis Report: 2026-05-15_07-42-55_claim-office-example-mapping_v5-exact-single-context_opus-4-7-no-thinking

Generated: 2026-06-02T08:15:18+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v5-exact-single-context |
| Model | opus-4-7-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 688s |
| Started | 2026-05-15T07:42:55+00:00 |
| Ended | 2026-05-15T07:54:24+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 149
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 352
- **Active tests**: 32
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (32 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-15_07-42-55_claim-office-example-mapping_v5-exact-single-context_opus-4-7-no-thinking
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-15_07-42-55_claim-office-example-mapping_v5-exact-single-context_opus-4-7-no-thinking

 ✓ src/claim-office.spec.ts  (32 tests) 7ms

 Test Files  1 passed (1)
      Tests  32 passed (32)
   Start at  08:15:18
   Duration  340ms (transform 40ms, setup 0ms, collect 36ms, tests 7ms, environment 0ms, prepare 96ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 81% |
| Branches | 94% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 62 | ×1 | 62 |
| Invocations | 56 | ×2 | 112 |
| Conditionals | 16 | ×4 | 64 |
| Loops | 8 | ×5 | 40 |
| Assignments | 71 | ×6 | 426 |
| **Total Mass** | | | **704** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 133 |
| Functions | 11 |
| Longest Function | 43 lines |
| Avg LOC/Function | 9.55 |
| Median LOC/Function | 4.00 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 4 |
| Duplication | 0 |
| Magic Numbers | 13 |
| Code Quality | 0 |
| **Total** | **17** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 11 | 2.44 | 1 |
| Cognitive (SonarJS) | 17 | 6.67 | 2 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 15714006 |
| Context Utilization | 12% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 4 |
| Avg Cycle Time | 171.77s |
| Avg Red Phase | 140.51s |
| Avg Green Phase | 18.35s |
| Avg Refactor Phase | 12.91s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 4 |
| Predictions Total | 4 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 2 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 1 |


