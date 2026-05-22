# Analysis Report: 2026-05-21_22-58-45_claim-office-lite-example-mapping_v4.2-shared-context_opus-4-7-portkey-no-thinking

Generated: 2026-05-22T00:37:25+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-lite-example-mapping |
| Workflow | v4.2-shared-context |
| Model | opus-4-7-portkey-no-thinking |
| Model Version(s) | claude-opus-4-7, <synthetic> |
| Thinking | unknown |
| Duration | 5918s |
| Started | 2026-05-21T22:58:45+00:00 |
| Ended | 2026-05-22T00:37:25+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 130
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 542
- **Active tests**: 38
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (38 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-21_22-58-45_claim-office-lite-example-mapping_v4.2-shared-context_opus-4-7-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-21_22-58-45_claim-office-lite-example-mapping_v4.2-shared-context_opus-4-7-portkey-no-thinking

 ✓ src/claim-office.spec.ts  (38 tests) 2914ms

 Test Files  1 passed (1)
      Tests  38 passed (38)
   Start at  00:37:25
   Duration  3.09s (transform 43ms, setup 0ms, collect 44ms, tests 2.91s, environment 0ms, prepare 44ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 70% |
| Branches | 82% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 52 | ×1 | 52 |
| Invocations | 46 | ×2 | 92 |
| Conditionals | 16 | ×4 | 64 |
| Loops | 9 | ×5 | 45 |
| Assignments | 56 | ×6 | 336 |
| **Total Mass** | | | **589** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 123 |
| Functions | 4 |
| Longest Function | 34 lines |
| Avg LOC/Function | 16.00 |
| Median LOC/Function | 14.00 |
| Imports | 2 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 3 |
| Duplication | 0 |
| Magic Numbers | 0 |
| Code Quality | 0 |
| **Total** | **3** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 15 | 7.25 | 1 |
| Cognitive (SonarJS) | 19 | 10.00 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 16577325 |
| Context Utilization | 15% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 38 |
| Avg Cycle Time | 174.15s |
| Avg Red Phase | 59.81s |
| Avg Green Phase | 42.32s |
| Avg Refactor Phase | 72.02s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 52 |
| Predictions Total | 54 |
| Accuracy | 96% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 28 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 13 |


