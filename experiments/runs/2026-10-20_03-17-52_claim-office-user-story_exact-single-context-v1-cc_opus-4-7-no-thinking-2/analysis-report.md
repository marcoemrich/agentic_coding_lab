# Analysis Report: 2026-10-20_03-17-52_claim-office-user-story_exact-single-context-v1-cc_opus-4-7-no-thinking-2

Generated: 2026-10-20T03:26:43+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-user-story |
| Workflow | exact-single-context-v1-cc |
| Model | opus-4-7-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 528s |
| Started | 2026-10-20T03:17:53+00:00 |
| Ended | 2026-10-20T03:26:43+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 142
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 167
- **Active tests**: 13
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (13 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-10-20_03-17-52_claim-office-user-story_exact-single-context-v1-cc_opus-4-7-no-thinking-2
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-10-20_03-17-52_claim-office-user-story_exact-single-context-v1-cc_opus-4-7-no-thinking-2

 ✓ src/claim-office.spec.ts  (13 tests) 4ms

 Test Files  1 passed (1)
      Tests  13 passed (13)
   Start at  03:26:44
   Duration  164ms (transform 35ms, setup 0ms, collect 26ms, tests 4ms, environment 0ms, prepare 46ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 84% |
| Branches | 86% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 68 | ×1 | 68 |
| Invocations | 43 | ×2 | 86 |
| Conditionals | 8 | ×4 | 32 |
| Loops | 6 | ×5 | 30 |
| Assignments | 71 | ×6 | 426 |
| **Total Mass** | | | **642** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 127 |
| Functions | 8 |
| Longest Function | 24 lines |
| Avg LOC/Function | 8.75 |
| Median LOC/Function | 6.00 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 1 |
| Duplication | 0 |
| Magic Numbers | 5 |
| Code Quality | 0 |
| **Total** | **6** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 6 | 2.00 | 0 |
| Cognitive (SonarJS) | 5 | 2.83 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 22371417 |
| Context Utilization | 18% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 13 |
| Avg Cycle Time | 39.89s |
| Avg Red Phase | 15.87s |
| Avg Green Phase | 17.53s |
| Avg Refactor Phase | 6.49s |

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
| Refactorings Applied | 13 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 1 |


