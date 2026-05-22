# Analysis Report: 2026-05-21_19-04-43_claim-office-lite-prose_v5-exact-single-context_opus-4-7-portkey-no-thinking

Generated: 2026-05-21T19:15:07+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-lite-prose |
| Workflow | v5-exact-single-context |
| Model | opus-4-7-portkey-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 623s |
| Started | 2026-05-21T19:04:43+00:00 |
| Ended | 2026-05-21T19:15:07+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 179
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 150
- **Active tests**: 15
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (15 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-21_19-04-43_claim-office-lite-prose_v5-exact-single-context_opus-4-7-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-21_19-04-43_claim-office-lite-prose_v5-exact-single-context_opus-4-7-portkey-no-thinking

 ✓ src/claim-office.spec.ts  (15 tests) 4ms

 Test Files  1 passed (1)
      Tests  15 passed (15)
   Start at  19:15:08
   Duration  156ms (transform 31ms, setup 0ms, collect 29ms, tests 4ms, environment 0ms, prepare 41ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 86% |
| Branches | 90% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 54 | ×1 | 54 |
| Invocations | 50 | ×2 | 100 |
| Conditionals | 11 | ×4 | 44 |
| Loops | 7 | ×5 | 35 |
| Assignments | 61 | ×6 | 366 |
| **Total Mass** | | | **599** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 155 |
| Functions | 10 |
| Longest Function | 28 lines |
| Avg LOC/Function | 9.80 |
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
| McCabe (Cyclomatic) | 8 | 2.12 | 0 |
| Cognitive (SonarJS) | 9 | 3.17 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 22184655 |
| Context Utilization | 16% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 15 |
| Avg Cycle Time | 47.07s |
| Avg Red Phase | 18.68s |
| Avg Green Phase | 18.59s |
| Avg Refactor Phase | 9.8s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 22 |
| Predictions Total | 22 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 11 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 4 |


