# Analysis Report: 2026-05-21_19-46-52_claim-office-lite-prose_v4.2-shared-context_opus-4-7-portkey-no-thinking

Generated: 2026-05-21T21:07:46+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-lite-prose |
| Workflow | v4.2-shared-context |
| Model | opus-4-7-portkey-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 4852s |
| Started | 2026-05-21T19:46:52+00:00 |
| Ended | 2026-05-21T21:07:46+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 131
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 447
- **Active tests**: 24
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (24 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-21_19-46-52_claim-office-lite-prose_v4.2-shared-context_opus-4-7-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-21_19-46-52_claim-office-lite-prose_v4.2-shared-context_opus-4-7-portkey-no-thinking

 ✓ src/claim-office.spec.ts  (24 tests) 391ms

 Test Files  1 passed (1)
      Tests  24 passed (24)
   Start at  21:07:46
   Duration  567ms (transform 41ms, setup 0ms, collect 37ms, tests 391ms, environment 0ms, prepare 49ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 94% |
| Branches | 96% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 60 | ×1 | 60 |
| Invocations | 44 | ×2 | 88 |
| Conditionals | 10 | ×4 | 40 |
| Loops | 7 | ×5 | 35 |
| Assignments | 34 | ×6 | 204 |
| **Total Mass** | | | **427** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 101 |
| Functions | 6 |
| Longest Function | 17 lines |
| Avg LOC/Function | 9.67 |
| Median LOC/Function | 8.00 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 3 |
| Code Quality | 0 |
| **Total** | **3** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 6 | 2.67 | 0 |
| Cognitive (SonarJS) | 6 | 3.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 12781527 |
| Context Utilization | 13% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 24 |
| Avg Cycle Time | 179.69s |
| Avg Red Phase | 58.17s |
| Avg Green Phase | 41.72s |
| Avg Refactor Phase | 79.8s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 35 |
| Predictions Total | 35 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 24 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


