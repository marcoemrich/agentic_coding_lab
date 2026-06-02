# Analysis Report: 2026-05-12_08-29-17_claim-office-user-story_v5-exact-single-context_sonnet-4-6-portkey

Generated: 2026-06-02T08:09:08+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-user-story |
| Workflow | v5-exact-single-context |
| Model | sonnet-4-6-portkey |
| Model Version(s) | claude-sonnet-4-6 |
| Thinking | true |
| Duration | 1634s |
| Started | 2026-05-12T08:29:17+00:00 |
| Ended | 2026-05-12T08:56:33+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 65
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 177
- **Active tests**: 10
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (10 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-12_08-29-17_claim-office-user-story_v5-exact-single-context_sonnet-4-6-portkey
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-12_08-29-17_claim-office-user-story_v5-exact-single-context_sonnet-4-6-portkey

 ✓ src/claim-office.spec.ts  (10 tests) 3ms

 Test Files  1 passed (1)
      Tests  10 passed (10)
   Start at  08:09:10
   Duration  384ms (transform 32ms, setup 0ms, collect 32ms, tests 3ms, environment 0ms, prepare 72ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 86% |
| Branches | 93% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 56 | ×1 | 56 |
| Invocations | 18 | ×2 | 36 |
| Conditionals | 7 | ×4 | 28 |
| Loops | 3 | ×5 | 15 |
| Assignments | 36 | ×6 | 216 |
| **Total Mass** | | | **351** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 60 |
| Functions | 1 |
| Longest Function | 29 lines |
| Avg LOC/Function | 29.00 |
| Median LOC/Function | 29.00 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 1 |
| Duplication | 0 |
| Magic Numbers | 11 |
| Code Quality | 0 |
| **Total** | **12** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 8 | 2.40 | 0 |
| Cognitive (SonarJS) | 12 | 12.00 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 27018331 |
| Context Utilization | 17% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 10 |
| Avg Cycle Time | 153.63s |
| Avg Red Phase | 39.65s |
| Avg Green Phase | 45.06s |
| Avg Refactor Phase | 68.92s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 20 |
| Predictions Total | 20 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 10 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


