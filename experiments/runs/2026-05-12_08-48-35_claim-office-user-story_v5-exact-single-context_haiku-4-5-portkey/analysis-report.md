# Analysis Report: 2026-05-12_08-48-35_claim-office-user-story_v5-exact-single-context_haiku-4-5-portkey

Generated: 2026-06-02T08:09:54+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-user-story |
| Workflow | v5-exact-single-context |
| Model | haiku-4-5-portkey |
| Model Version(s) | claude-haiku-4-5-20251001 |
| Thinking | true |
| Duration | 686s |
| Started | 2026-05-12T08:48:35+00:00 |
| Ended | 2026-05-12T09:00:02+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts
- **Implementation LOC** (total): 72
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 80
- **Active tests**: 9
- **Remaining todos**: 5

## Test Results

**Status**: ✅ All tests passing (9 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-12_08-48-35_claim-office-user-story_v5-exact-single-context_haiku-4-5-portkey
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-12_08-48-35_claim-office-user-story_v5-exact-single-context_haiku-4-5-portkey

 ✓ src/claim-office.spec.ts  (14 tests | 5 skipped) 2ms

 Test Files  1 passed (1)
      Tests  9 passed | 5 todo (14)
   Start at  08:09:56
   Duration  372ms (transform 26ms, setup 0ms, collect 22ms, tests 2ms, environment 0ms, prepare 92ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 100% |
| Branches | 88% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 50 | ×1 | 50 |
| Invocations | 13 | ×2 | 26 |
| Conditionals | 4 | ×4 | 16 |
| Loops | 1 | ×5 | 5 |
| Assignments | 22 | ×6 | 132 |
| **Total Mass** | | | **229** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 60 |
| Functions | 5 |
| Longest Function | 30 lines |
| Avg LOC/Function | 8.40 |
| Median LOC/Function | 3.00 |
| Imports | 0 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 7 |
| Code Quality | 0 |
| **Total** | **7** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 6 | 2.33 | 0 |
| Cognitive (SonarJS) | 4 | 1.75 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 26806688 |
| Context Utilization | 71% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 9 |
| Avg Cycle Time | 75.86s |
| Avg Red Phase | 19.94s |
| Avg Green Phase | 25.89s |
| Avg Refactor Phase | 30.03s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 10 |
| Predictions Total | 10 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 8 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


