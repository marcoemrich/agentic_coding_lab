# Analysis Report: 2026-05-11_23-09-36_claim-office-prose_v5-exact-single-context_opus-4-6-portkey

Generated: 2026-05-11T23:38:07+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-prose |
| Workflow | v5-exact-single-context |
| Model | opus-4-6-portkey |
| Model Version(s) | claude-opus-4-6 |
| Thinking | true |
| Duration | 1709s |
| Started | 2026-05-11T23:09:36+00:00 |
| Ended | 2026-05-11T23:38:07+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 116
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 307
- **Active tests**: 15
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (15 passed)

```
$ vitest run

 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-11_23-09-36_claim-office-prose_v5-exact-single-context_opus-4-6-portkey

 ✓ src/claim-office.spec.ts  (15 tests) 3ms

 Test Files  1 passed (1)
      Tests  15 passed (15)
   Start at  23:38:08
   Duration  166ms (transform 32ms, setup 0ms, collect 32ms, tests 3ms, environment 0ms, prepare 43ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 91% |
| Branches | 96% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 49 | ×1 | 49 |
| Invocations | 27 | ×2 | 54 |
| Conditionals | 10 | ×4 | 40 |
| Loops | 5 | ×5 | 25 |
| Assignments | 40 | ×6 | 240 |
| **Total Mass** | | | **408** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 104 |
| Functions | 4 |
| Longest Function | 24 lines |
| Avg LOC/Function | 13.50 |
| Median LOC/Function | 14.00 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 3 |
| Duplication | 0 |
| Magic Numbers | 12 |
| Code Quality | 0 |
| **Total** | **15** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 8 | 3.00 | 0 |
| Cognitive (SonarJS) | 12 | 8.33 | 2 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 35157278 |
| Context Utilization | 83% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 15 |
| Avg Cycle Time | 122.90s |
| Avg Red Phase | 34s |
| Avg Green Phase | 39.11s |
| Avg Refactor Phase | 49.79s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 30 |
| Predictions Total | 30 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 12 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 3 |


