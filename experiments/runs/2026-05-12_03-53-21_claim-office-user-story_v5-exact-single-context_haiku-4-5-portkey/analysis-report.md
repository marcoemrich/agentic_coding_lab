# Analysis Report: 2026-05-12_03-53-21_claim-office-user-story_v5-exact-single-context_haiku-4-5-portkey

Generated: 2026-06-02T07:57:52+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-user-story |
| Workflow | v5-exact-single-context |
| Model | haiku-4-5-portkey |
| Model Version(s) | claude-haiku-4-5-20251001 |
| Thinking | true |
| Duration | 802s |
| Started | 2026-05-12T03:53:21+00:00 |
| Ended | 2026-05-12T04:06:45+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 166
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 300
- **Active tests**: 15
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (15 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-12_03-53-21_claim-office-user-story_v5-exact-single-context_haiku-4-5-portkey
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-12_03-53-21_claim-office-user-story_v5-exact-single-context_haiku-4-5-portkey

 ✓ src/claim-office.spec.ts  (15 tests) 3ms

 Test Files  1 passed (1)
      Tests  15 passed (15)
   Start at  07:57:54
   Duration  346ms (transform 27ms, setup 0ms, collect 27ms, tests 3ms, environment 0ms, prepare 70ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 84% |
| Branches | 88% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 62 | ×1 | 62 |
| Invocations | 40 | ×2 | 80 |
| Conditionals | 15 | ×4 | 60 |
| Loops | 12 | ×5 | 60 |
| Assignments | 48 | ×6 | 288 |
| **Total Mass** | | | **550** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 121 |
| Functions | 4 |
| Longest Function | 36 lines |
| Avg LOC/Function | 25.50 |
| Median LOC/Function | 28.50 |
| Imports | 2 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 8 |
| Code Quality | 0 |
| **Total** | **8** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 8 | 2.90 | 0 |
| Cognitive (SonarJS) | 8 | 4.20 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 34194423 |
| Context Utilization | 74% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 8 |
| Avg Cycle Time | 96.09s |
| Avg Red Phase | 25.88s |
| Avg Green Phase | 22.41s |
| Avg Refactor Phase | 47.8s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 16 |
| Predictions Total | 16 |
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


