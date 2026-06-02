# Analysis Report: 2026-05-12_23-59-38_claim-office-user-story_v5-exact-single-context_opus-4-7

Generated: 2026-06-02T08:13:44+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-user-story |
| Workflow | v5-exact-single-context |
| Model | opus-4-7 |
| Model Version(s) | claude-opus-4-7 |
| Thinking | true |
| Duration | 503s |
| Started | 2026-05-12T23:59:38+00:00 |
| Ended | 2026-05-13T00:08:02+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 127
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 376
- **Active tests**: 20
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (20 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-12_23-59-38_claim-office-user-story_v5-exact-single-context_opus-4-7
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-12_23-59-38_claim-office-user-story_v5-exact-single-context_opus-4-7

 ✓ src/claim-office.spec.ts  (20 tests) 5ms

 Test Files  1 passed (1)
      Tests  20 passed (20)
   Start at  08:13:45
   Duration  348ms (transform 35ms, setup 0ms, collect 30ms, tests 5ms, environment 0ms, prepare 101ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 83% |
| Branches | 93% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 47 | ×1 | 47 |
| Invocations | 42 | ×2 | 84 |
| Conditionals | 9 | ×4 | 36 |
| Loops | 7 | ×5 | 35 |
| Assignments | 59 | ×6 | 354 |
| **Total Mass** | | | **556** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 110 |
| Functions | 7 |
| Longest Function | 37 lines |
| Avg LOC/Function | 11.29 |
| Median LOC/Function | 6.00 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 2 |
| Duplication | 0 |
| Magic Numbers | 20 |
| Code Quality | 0 |
| **Total** | **22** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 9 | 2.14 | 0 |
| Cognitive (SonarJS) | 12 | 4.00 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 14260628 |
| Context Utilization | 13% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 4 |
| Avg Cycle Time | 121.64s |
| Avg Red Phase | 91.12s |
| Avg Green Phase | 19.1s |
| Avg Refactor Phase | 11.42s |

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
| Tests Passed Immediately | 1 |


