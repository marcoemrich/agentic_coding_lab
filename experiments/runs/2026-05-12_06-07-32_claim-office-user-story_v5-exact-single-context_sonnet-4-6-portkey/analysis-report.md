# Analysis Report: 2026-05-12_06-07-32_claim-office-user-story_v5-exact-single-context_sonnet-4-6-portkey

Generated: 2026-05-12T06:37:04+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-user-story |
| Workflow | v5-exact-single-context |
| Model | sonnet-4-6-portkey |
| Model Version(s) | claude-sonnet-4-6 |
| Thinking | true |
| Duration | 1771s |
| Started | 2026-05-12T06:07:32+00:00 |
| Ended | 2026-05-12T06:37:04+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 166
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 95
- **Active tests**: 14
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (14 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-12_06-07-32_claim-office-user-story_v5-exact-single-context_sonnet-4-6-portkey
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-12_06-07-32_claim-office-user-story_v5-exact-single-context_sonnet-4-6-portkey

 ✓ src/claim-office.spec.ts  (14 tests) 3ms

 Test Files  1 passed (1)
      Tests  14 passed (14)
   Start at  06:37:04
   Duration  159ms (transform 31ms, setup 0ms, collect 29ms, tests 3ms, environment 0ms, prepare 42ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 53% |
| Branches | 92% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 62 | ×1 | 62 |
| Invocations | 27 | ×2 | 54 |
| Conditionals | 6 | ×4 | 24 |
| Loops | 3 | ×5 | 15 |
| Assignments | 53 | ×6 | 318 |
| **Total Mass** | | | **473** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 145 |
| Functions | 3 |
| Longest Function | 38 lines |
| Avg LOC/Function | 14.00 |
| Median LOC/Function | 2.00 |
| Imports | 3 |

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
| McCabe (Cyclomatic) | 9 | 4.00 | 0 |
| Cognitive (SonarJS) | 8 | 3.80 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 30769382 |
| Context Utilization | 17% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 14 |
| Avg Cycle Time | 129.92s |
| Avg Red Phase | 39.81s |
| Avg Green Phase | 31.97s |
| Avg Refactor Phase | 58.14s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 25 |
| Predictions Total | 28 |
| Accuracy | 89% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 13 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 2 |


