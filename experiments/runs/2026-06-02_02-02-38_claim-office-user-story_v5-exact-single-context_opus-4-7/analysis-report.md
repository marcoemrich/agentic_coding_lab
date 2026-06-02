# Analysis Report: 2026-06-02_02-02-38_claim-office-user-story_v5-exact-single-context_opus-4-7

Generated: 2026-06-02T08:15:49+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-user-story |
| Workflow | v5-exact-single-context |
| Model | opus-4-7 |
| Model Version(s) | claude-opus-4-7 |
| Thinking | true |
| Duration | 1494s |
| Started | 2026-06-02T02:02:38+00:00 |
| Ended | 2026-06-02T02:27:33+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 239
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 230
- **Active tests**: 14
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (17 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-06-02_02-02-38_claim-office-user-story_v5-exact-single-context_opus-4-7
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-06-02_02-02-38_claim-office-user-story_v5-exact-single-context_opus-4-7

 ✓ src/cli.spec.ts  (3 tests) 3ms
 ✓ src/claim-office.spec.ts  (14 tests) 3ms

 Test Files  2 passed (2)
      Tests  17 passed (17)
   Start at  08:15:50
   Duration  362ms (transform 53ms, setup 0ms, collect 62ms, tests 6ms, environment 0ms, prepare 190ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 94% |
| Branches | 88% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 66 | ×1 | 66 |
| Invocations | 55 | ×2 | 110 |
| Conditionals | 13 | ×4 | 52 |
| Loops | 5 | ×5 | 25 |
| Assignments | 70 | ×6 | 420 |
| **Total Mass** | | | **673** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 186 |
| Functions | 18 |
| Longest Function | 18 lines |
| Avg LOC/Function | 5.44 |
| Median LOC/Function | 4.00 |
| Imports | 2 |

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
| McCabe (Cyclomatic) | 5 | 1.64 | 0 |
| Cognitive (SonarJS) | 6 | 2.38 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 45617597 |
| Context Utilization | 25% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 15 |
| Avg Cycle Time | 93.95s |
| Avg Red Phase | 34.14s |
| Avg Green Phase | 29.8s |
| Avg Refactor Phase | 30.01s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 30 |
| Predictions Total | 30 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 15 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


