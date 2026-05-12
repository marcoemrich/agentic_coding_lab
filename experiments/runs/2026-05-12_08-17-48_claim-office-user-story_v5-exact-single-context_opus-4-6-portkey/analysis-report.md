# Analysis Report: 2026-05-12_08-17-48_claim-office-user-story_v5-exact-single-context_opus-4-6-portkey

Generated: 2026-05-12T08:48:18+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-user-story |
| Workflow | v5-exact-single-context |
| Model | opus-4-6-portkey |
| Model Version(s) | claude-opus-4-6 |
| Thinking | true |
| Duration | 1828s |
| Started | 2026-05-12T08:17:48+00:00 |
| Ended | 2026-05-12T08:48:18+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 115
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 289
- **Active tests**: 19
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (19 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-12_08-17-48_claim-office-user-story_v5-exact-single-context_opus-4-6-portkey
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-12_08-17-48_claim-office-user-story_v5-exact-single-context_opus-4-6-portkey

 ✓ src/claim-office.spec.ts  (19 tests) 4ms

 Test Files  1 passed (1)
      Tests  19 passed (19)
   Start at  08:48:18
   Duration  185ms (transform 38ms, setup 0ms, collect 37ms, tests 4ms, environment 0ms, prepare 46ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 91% |
| Branches | 96% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 54 | ×1 | 54 |
| Invocations | 43 | ×2 | 86 |
| Conditionals | 7 | ×4 | 28 |
| Loops | 6 | ×5 | 30 |
| Assignments | 54 | ×6 | 324 |
| **Total Mass** | | | **522** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 102 |
| Functions | 5 |
| Longest Function | 29 lines |
| Avg LOC/Function | 16.40 |
| Median LOC/Function | 17.00 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 1 |
| Duplication | 0 |
| Magic Numbers | 7 |
| Code Quality | 0 |
| **Total** | **8** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 6 | 2.00 | 0 |
| Cognitive (SonarJS) | 11 | 4.50 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 38179924 |
| Context Utilization | 83% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 19 |
| Avg Cycle Time | 111.24s |
| Avg Red Phase | 30.66s |
| Avg Green Phase | 36.95s |
| Avg Refactor Phase | 43.63s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 38 |
| Predictions Total | 38 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 10 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 2 |


