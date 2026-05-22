# Analysis Report: 2026-05-21_19-50-14_claim-office-lite-prose_v4.2-shared-context_opus-4-7-portkey-no-thinking

Generated: 2026-05-21T21:50:15+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-lite-prose |
| Workflow | v4.2-shared-context |
| Model | opus-4-7-portkey-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 7200s |
| Started | 2026-05-21T19:50:14+00:00 |
| Ended | 2026-05-21T21:50:15+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 164
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 691
- **Active tests**: 38
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (38 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-21_19-50-14_claim-office-lite-prose_v4.2-shared-context_opus-4-7-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-21_19-50-14_claim-office-lite-prose_v4.2-shared-context_opus-4-7-portkey-no-thinking

 ✓ src/claim-office.spec.ts  (38 tests) 1092ms

 Test Files  1 passed (1)
      Tests  38 passed (38)
   Start at  21:50:16
   Duration  1.28s (transform 44ms, setup 0ms, collect 52ms, tests 1.09s, environment 0ms, prepare 46ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 96% |
| Branches | 88% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 41 | ×1 | 41 |
| Invocations | 50 | ×2 | 100 |
| Conditionals | 16 | ×4 | 64 |
| Loops | 5 | ×5 | 25 |
| Assignments | 62 | ×6 | 372 |
| **Total Mass** | | | **602** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 136 |
| Functions | 19 |
| Longest Function | 9 lines |
| Avg LOC/Function | 3.47 |
| Median LOC/Function | 2.00 |
| Imports | 2 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 1 |
| Code Quality | 0 |
| **Total** | **1** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 4 | 1.68 | 0 |
| Cognitive (SonarJS) | 3 | 1.50 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 21781503 |
| Context Utilization | 16% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 38 |
| Avg Cycle Time | 193.03s |
| Avg Red Phase | 59.12s |
| Avg Green Phase | 43.43s |
| Avg Refactor Phase | 90.48s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 59 |
| Predictions Total | 62 |
| Accuracy | 95% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 38 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 17 |


