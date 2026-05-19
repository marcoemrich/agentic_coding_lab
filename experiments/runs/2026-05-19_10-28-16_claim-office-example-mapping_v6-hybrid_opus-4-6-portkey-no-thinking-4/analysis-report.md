# Analysis Report: 2026-05-19_10-28-16_claim-office-example-mapping_v6-hybrid_opus-4-6-portkey-no-thinking-4

Generated: 2026-05-19T11:34:08+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6-hybrid |
| Model | opus-4-6-portkey-no-thinking |
| Model Version(s) | claude-opus-4-6 |
| Thinking | unknown |
| Duration | 3950s |
| Started | 2026-05-19T10:28:16+00:00 |
| Ended | 2026-05-19T11:34:08+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 223
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 755
- **Active tests**: 37
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (37 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-19_10-28-16_claim-office-example-mapping_v6-hybrid_opus-4-6-portkey-no-thinking-4
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-19_10-28-16_claim-office-example-mapping_v6-hybrid_opus-4-6-portkey-no-thinking-4

 ✓ src/claim-office.spec.ts  (37 tests) 8ms

 Test Files  1 passed (1)
      Tests  37 passed (37)
   Start at  11:34:09
   Duration  212ms (transform 53ms, setup 0ms, collect 54ms, tests 8ms, environment 0ms, prepare 48ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 92% |
| Branches | 90% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 66 | ×1 | 66 |
| Invocations | 60 | ×2 | 120 |
| Conditionals | 11 | ×4 | 44 |
| Loops | 8 | ×5 | 40 |
| Assignments | 68 | ×6 | 408 |
| **Total Mass** | | | **678** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 195 |
| Functions | 10 |
| Longest Function | 23 lines |
| Avg LOC/Function | 6.60 |
| Median LOC/Function | 2.00 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 1 |
| Duplication | 0 |
| Magic Numbers | 1 |
| Code Quality | 0 |
| **Total** | **2** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 5 | 1.92 | 0 |
| Cognitive (SonarJS) | 4 | 2.40 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 54120426 |
| Context Utilization | 83% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 37 |
| Avg Cycle Time | 198.09s |
| Avg Red Phase | 34.25s |
| Avg Green Phase | 49.27s |
| Avg Refactor Phase | 114.57s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 73 |
| Predictions Total | 74 |
| Accuracy | 98% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 13 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 16 |


