# Analysis Report: 2026-06-02_02-27-50_claim-office-user-story_v5-exact-single-context_opus-4-7-no-thinking

Generated: 2026-06-02T08:15:59+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-user-story |
| Workflow | v5-exact-single-context |
| Model | opus-4-7-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 1081s |
| Started | 2026-06-02T02:27:50+00:00 |
| Ended | 2026-06-02T02:45:52+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 207
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 107
- **Active tests**: 14
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (14 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-06-02_02-27-50_claim-office-user-story_v5-exact-single-context_opus-4-7-no-thinking
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-06-02_02-27-50_claim-office-user-story_v5-exact-single-context_opus-4-7-no-thinking

 ✓ src/claim-office.spec.ts  (14 tests) 4ms

 Test Files  1 passed (1)
      Tests  14 passed (14)
   Start at  08:16:00
   Duration  342ms (transform 33ms, setup 0ms, collect 26ms, tests 4ms, environment 0ms, prepare 71ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 88% |
| Branches | 89% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 59 | ×1 | 59 |
| Invocations | 55 | ×2 | 110 |
| Conditionals | 11 | ×4 | 44 |
| Loops | 6 | ×5 | 30 |
| Assignments | 84 | ×6 | 504 |
| **Total Mass** | | | **747** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 178 |
| Functions | 16 |
| Longest Function | 15 lines |
| Avg LOC/Function | 6.44 |
| Median LOC/Function | 6.00 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 0 |
| Code Quality | 0 |
| **Total** | **0** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 5 | 1.56 | 0 |
| Cognitive (SonarJS) | 4 | 1.62 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 33500863 |
| Context Utilization | 21% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 14 |
| Avg Cycle Time | 73.22s |
| Avg Red Phase | 22.57s |
| Avg Green Phase | 27.14s |
| Avg Refactor Phase | 23.51s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 26 |
| Predictions Total | 26 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 14 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


