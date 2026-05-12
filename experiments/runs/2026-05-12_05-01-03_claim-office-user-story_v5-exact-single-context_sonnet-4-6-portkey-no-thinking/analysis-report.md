# Analysis Report: 2026-05-12_05-01-03_claim-office-user-story_v5-exact-single-context_sonnet-4-6-portkey-no-thinking

Generated: 2026-05-12T05:29:31+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-user-story |
| Workflow | v5-exact-single-context |
| Model | sonnet-4-6-portkey-no-thinking |
| Model Version(s) | claude-sonnet-4-6 |
| Thinking | unknown |
| Duration | 1707s |
| Started | 2026-05-12T05:01:03+00:00 |
| Ended | 2026-05-12T05:29:31+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 83
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 272
- **Active tests**: 16
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (16 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-12_05-01-03_claim-office-user-story_v5-exact-single-context_sonnet-4-6-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-12_05-01-03_claim-office-user-story_v5-exact-single-context_sonnet-4-6-portkey-no-thinking

 ✓ src/claim-office.spec.ts  (16 tests) 3ms

 Test Files  1 passed (1)
      Tests  16 passed (16)
   Start at  05:29:32
   Duration  164ms (transform 33ms, setup 0ms, collect 31ms, tests 3ms, environment 0ms, prepare 45ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 86% |
| Branches | 83% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 55 | ×1 | 55 |
| Invocations | 20 | ×2 | 40 |
| Conditionals | 13 | ×4 | 52 |
| Loops | 1 | ×5 | 5 |
| Assignments | 45 | ×6 | 270 |
| **Total Mass** | | | **422** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 75 |
| Functions | 4 |
| Longest Function | 19 lines |
| Avg LOC/Function | 6.50 |
| Median LOC/Function | 2.50 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 1 |
| Duplication | 0 |
| Magic Numbers | 13 |
| Code Quality | 0 |
| **Total** | **14** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 12 | 4.50 | 2 |
| Cognitive (SonarJS) | 11 | 9.00 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 32839055 |
| Context Utilization | 17% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 16 |
| Avg Cycle Time | 104.89s |
| Avg Red Phase | 25.92s |
| Avg Green Phase | 26.73s |
| Avg Refactor Phase | 52.24s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 36 |
| Predictions Total | 37 |
| Accuracy | 97% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 16 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 2 |


