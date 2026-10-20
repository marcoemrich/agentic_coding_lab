# Analysis Report: 2026-10-20_03-17-52_claim-office-user-story_exact-single-context-v1-cc_opus-4-7-no-thinking

Generated: 2026-10-20T03:23:34+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-user-story |
| Workflow | exact-single-context-v1-cc |
| Model | opus-4-7-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 339s |
| Started | 2026-10-20T03:17:53+00:00 |
| Ended | 2026-10-20T03:23:34+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 165
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 266
- **Active tests**: 22
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (22 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-10-20_03-17-52_claim-office-user-story_exact-single-context-v1-cc_opus-4-7-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-10-20_03-17-52_claim-office-user-story_exact-single-context-v1-cc_opus-4-7-no-thinking

 ✓ src/claim-office.spec.ts  (22 tests) 6ms

 Test Files  1 passed (1)
      Tests  22 passed (22)
   Start at  03:23:34
   Duration  170ms (transform 38ms, setup 0ms, collect 31ms, tests 6ms, environment 0ms, prepare 46ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 87% |
| Branches | 80% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 61 | ×1 | 61 |
| Invocations | 43 | ×2 | 86 |
| Conditionals | 13 | ×4 | 52 |
| Loops | 8 | ×5 | 40 |
| Assignments | 55 | ×6 | 330 |
| **Total Mass** | | | **569** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 141 |
| Functions | 8 |
| Longest Function | 28 lines |
| Avg LOC/Function | 8.75 |
| Median LOC/Function | 6.00 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 3 |
| Duplication | 0 |
| Magic Numbers | 18 |
| Code Quality | 0 |
| **Total** | **21** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 12 | 3.30 | 1 |
| Cognitive (SonarJS) | 14 | 5.80 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 8539961 |
| Context Utilization | 10% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 2 |
| Avg Cycle Time | 155.24s |
| Avg Red Phase | 140.79s |
| Avg Green Phase | 10.46s |
| Avg Refactor Phase | 3.99s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 2 |
| Predictions Total | 2 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 1 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 1 |


