# Analysis Report: 2026-05-12_00-06-47_claim-office-user-story_v5-exact-single-context_opus-4-6-portkey

Generated: 2026-05-12T00:33:24+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-user-story |
| Workflow | v5-exact-single-context |
| Model | opus-4-6-portkey |
| Model Version(s) | claude-opus-4-6 |
| Thinking | true |
| Duration | 1596s |
| Started | 2026-05-12T00:06:47+00:00 |
| Ended | 2026-05-12T00:33:24+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 108
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 118
- **Active tests**: 16
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (16 passed)

```
$ vitest run

 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-12_00-06-47_claim-office-user-story_v5-exact-single-context_opus-4-6-portkey

 ✓ src/claim-office.spec.ts  (16 tests) 4ms

 Test Files  1 passed (1)
      Tests  16 passed (16)
   Start at  00:33:25
   Duration  163ms (transform 28ms, setup 0ms, collect 27ms, tests 4ms, environment 0ms, prepare 43ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 90% |
| Branches | 89% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 49 | ×1 | 49 |
| Invocations | 50 | ×2 | 100 |
| Conditionals | 9 | ×4 | 36 |
| Loops | 5 | ×5 | 25 |
| Assignments | 39 | ×6 | 234 |
| **Total Mass** | | | **444** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 99 |
| Functions | 6 |
| Longest Function | 33 lines |
| Avg LOC/Function | 13.67 |
| Median LOC/Function | 12.50 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 2 |
| Duplication | 0 |
| Magic Numbers | 18 |
| Code Quality | 0 |
| **Total** | **20** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 11 | 3.33 | 1 |
| Cognitive (SonarJS) | 15 | 7.25 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 37953430 |
| Context Utilization | 84% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 17 |
| Avg Cycle Time | 106.49s |
| Avg Red Phase | 30.92s |
| Avg Green Phase | 28.39s |
| Avg Refactor Phase | 47.18s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 34 |
| Predictions Total | 34 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 13 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 4 |


