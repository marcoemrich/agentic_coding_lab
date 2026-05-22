# Analysis Report: 2026-05-21_22-58-58_claim-office-lite-example-mapping_v5-exact-single-context_opus-4-7-portkey-no-thinking

Generated: 2026-05-21T23:03:38+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-lite-example-mapping |
| Workflow | v5-exact-single-context |
| Model | opus-4-7-portkey-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 279s |
| Started | 2026-05-21T22:58:58+00:00 |
| Ended | 2026-05-21T23:03:38+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 153
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 353
- **Active tests**: 35
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (35 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-21_22-58-58_claim-office-lite-example-mapping_v5-exact-single-context_opus-4-7-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-21_22-58-58_claim-office-lite-example-mapping_v5-exact-single-context_opus-4-7-portkey-no-thinking

 ✓ src/claim-office.spec.ts  (35 tests) 6ms

 Test Files  1 passed (1)
      Tests  35 passed (35)
   Start at  23:03:38
   Duration  182ms (transform 38ms, setup 0ms, collect 40ms, tests 6ms, environment 0ms, prepare 50ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 83% |
| Branches | 94% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 54 | ×1 | 54 |
| Invocations | 64 | ×2 | 128 |
| Conditionals | 18 | ×4 | 72 |
| Loops | 9 | ×5 | 45 |
| Assignments | 63 | ×6 | 378 |
| **Total Mass** | | | **677** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 138 |
| Functions | 11 |
| Longest Function | 23 lines |
| Avg LOC/Function | 9.27 |
| Median LOC/Function | 7.00 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 1 |
| Duplication | 0 |
| Magic Numbers | 11 |
| Code Quality | 0 |
| **Total** | **12** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 8 | 2.93 | 0 |
| Cognitive (SonarJS) | 12 | 3.40 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 4808814 |
| Context Utilization | 8% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 1 |
| Avg Cycle Time | 246.64s |
| Avg Red Phase | 30.71s |
| Avg Green Phase | 9.92s |
| Avg Refactor Phase | 206.01s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 2 |
| Predictions Total | 2 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 1 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


