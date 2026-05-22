# Analysis Report: 2026-05-21_19-46-51_claim-office-lite-prose_v3-basic-tdd_opus-4-7-portkey-no-thinking

Generated: 2026-05-21T19:49:58+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-lite-prose |
| Workflow | v3-basic-tdd |
| Model | opus-4-7-portkey-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 185s |
| Started | 2026-05-21T19:46:51+00:00 |
| Ended | 2026-05-21T19:49:58+00:00 |

## Code Metrics

- **Implementation files**: claim.ts, cli.ts, quote.ts, scenario.ts
- **Implementation LOC** (total): 192
- **Test file**: claim.spec.ts
- **Test file LOC**: 70
- **Active tests**: 6
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (26 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-21_19-46-51_claim-office-lite-prose_v3-basic-tdd_opus-4-7-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-21_19-46-51_claim-office-lite-prose_v3-basic-tdd_opus-4-7-portkey-no-thinking

 ✓ src/quote.spec.ts  (16 tests) 3ms
 ✓ src/claim.spec.ts  (6 tests) 2ms
 ✓ src/scenario.spec.ts  (4 tests) 4ms

 Test Files  3 passed (3)
      Tests  26 passed (26)
   Start at  19:49:59
   Duration  489ms (transform 44ms, setup 0ms, collect 55ms, tests 9ms, environment 0ms, prepare 159ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 89% |
| Branches | 88% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 70 | ×1 | 70 |
| Invocations | 62 | ×2 | 124 |
| Conditionals | 14 | ×4 | 56 |
| Loops | 8 | ×5 | 40 |
| Assignments | 51 | ×6 | 306 |
| **Total Mass** | | | **596** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 153 |
| Functions | 9 |
| Longest Function | 23 lines |
| Avg LOC/Function | 9.44 |
| Median LOC/Function | 6.00 |
| Imports | 4 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 10 |
| Code Quality | 0 |
| **Total** | **10** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 5 | 2.43 | 0 |
| Cognitive (SonarJS) | 6 | 3.29 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 2454377 |
| Context Utilization | 6% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 3 |
| Avg Cycle Time | 17.65s |
| Avg Red Phase | 2.67s |
| Avg Green Phase | 2.14s |
| Avg Refactor Phase | 12.84s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 0 |
| Predictions Total | 0 |
| Accuracy | N/A |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 2 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


