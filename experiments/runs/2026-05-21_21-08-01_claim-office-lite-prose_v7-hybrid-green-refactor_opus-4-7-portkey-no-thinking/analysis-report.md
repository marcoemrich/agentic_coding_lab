# Analysis Report: 2026-05-21_21-08-01_claim-office-lite-prose_v7-hybrid-green-refactor_opus-4-7-portkey-no-thinking

Generated: 2026-05-21T21:30:15+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-lite-prose |
| Workflow | v7-hybrid-green-refactor |
| Model | opus-4-7-portkey-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 1333s |
| Started | 2026-05-21T21:08:01+00:00 |
| Ended | 2026-05-21T21:30:15+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 150
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 226
- **Active tests**: 14
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (14 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-21_21-08-01_claim-office-lite-prose_v7-hybrid-green-refactor_opus-4-7-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-21_21-08-01_claim-office-lite-prose_v7-hybrid-green-refactor_opus-4-7-portkey-no-thinking

 ✓ src/claim-office.spec.ts  (14 tests) 5ms

 Test Files  1 passed (1)
      Tests  14 passed (14)
   Start at  21:30:15
   Duration  178ms (transform 35ms, setup 0ms, collect 34ms, tests 5ms, environment 0ms, prepare 47ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 86% |
| Branches | 92% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 44 | ×1 | 44 |
| Invocations | 47 | ×2 | 94 |
| Conditionals | 7 | ×4 | 28 |
| Loops | 4 | ×5 | 20 |
| Assignments | 69 | ×6 | 414 |
| **Total Mass** | | | **600** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 124 |
| Functions | 21 |
| Longest Function | 10 lines |
| Avg LOC/Function | 3.67 |
| Median LOC/Function | 2.00 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 6 |
| Code Quality | 0 |
| **Total** | **6** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 4 | 1.30 | 0 |
| Cognitive (SonarJS) | 3 | 1.33 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 14221481 |
| Context Utilization | 14% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 14 |
| Avg Cycle Time | 92.88s |
| Avg Red Phase | 22.91s |
| Avg Green Phase | 24.63s |
| Avg Refactor Phase | 45.34s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 28 |
| Predictions Total | 28 |
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


