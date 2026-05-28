# Analysis Report: 2026-05-27_22-25-22_claim-office-example-mapping_v6.5-end-refactor_opus-4-7-portkey-no-thinking

Generated: 2026-05-27T23:25:06+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.5-end-refactor |
| Model | opus-4-7-portkey-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 3583s |
| Started | 2026-05-27T22:25:22+00:00 |
| Ended | 2026-05-27T23:25:06+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 197
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 640
- **Active tests**: 38
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (38 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-27_22-25-22_claim-office-example-mapping_v6.5-end-refactor_opus-4-7-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-27_22-25-22_claim-office-example-mapping_v6.5-end-refactor_opus-4-7-portkey-no-thinking

 ✓ src/claim-office.spec.ts  (38 tests) 7ms

 Test Files  1 passed (1)
      Tests  38 passed (38)
   Start at  23:25:06
   Duration  191ms (transform 40ms, setup 0ms, collect 52ms, tests 7ms, environment 0ms, prepare 44ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 89% |
| Branches | 97% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 45 | ×1 | 45 |
| Invocations | 66 | ×2 | 132 |
| Conditionals | 8 | ×4 | 32 |
| Loops | 4 | ×5 | 20 |
| Assignments | 78 | ×6 | 468 |
| **Total Mass** | | | **697** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 160 |
| Functions | 23 |
| Longest Function | 11 lines |
| Avg LOC/Function | 4.09 |
| Median LOC/Function | 4.00 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 0 |
| Code Quality | 0 |
| **Total** | **0** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 3 | 1.31 | 0 |
| Cognitive (SonarJS) | 2 | 1.10 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 47098024 |
| Context Utilization | 17% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 39 |
| Avg Cycle Time | 102.23s |
| Avg Red Phase | 19.9s |
| Avg Green Phase | 19.62s |
| Avg Refactor Phase | 62.71s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 78 |
| Predictions Total | 78 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 35 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 18 |


