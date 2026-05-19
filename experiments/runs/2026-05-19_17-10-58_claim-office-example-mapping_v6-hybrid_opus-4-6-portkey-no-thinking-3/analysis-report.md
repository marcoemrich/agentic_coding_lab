# Analysis Report: 2026-05-19_17-10-58_claim-office-example-mapping_v6-hybrid_opus-4-6-portkey-no-thinking-3

Generated: 2026-05-19T18:05:58+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6-hybrid |
| Model | opus-4-6-portkey-no-thinking |
| Model Version(s) | claude-opus-4-6, <synthetic> |
| Thinking | unknown |
| Duration | 3298s |
| Started | 2026-05-19T17:10:58+00:00 |
| Ended | 2026-05-19T18:05:58+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 190
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 686
- **Active tests**: 37
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (37 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-19_17-10-58_claim-office-example-mapping_v6-hybrid_opus-4-6-portkey-no-thinking-3
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-19_17-10-58_claim-office-example-mapping_v6-hybrid_opus-4-6-portkey-no-thinking-3

 ✓ src/claim-office.spec.ts  (37 tests) 7ms

 Test Files  1 passed (1)
      Tests  37 passed (37)
   Start at  18:05:58
   Duration  186ms (transform 46ms, setup 0ms, collect 46ms, tests 7ms, environment 0ms, prepare 44ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 92% |
| Branches | 87% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 62 | ×1 | 62 |
| Invocations | 46 | ×2 | 92 |
| Conditionals | 16 | ×4 | 64 |
| Loops | 8 | ×5 | 40 |
| Assignments | 62 | ×6 | 372 |
| **Total Mass** | | | **630** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 171 |
| Functions | 10 |
| Longest Function | 21 lines |
| Avg LOC/Function | 9.40 |
| Median LOC/Function | 8.50 |
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
| McCabe (Cyclomatic) | 8 | 2.53 | 0 |
| Cognitive (SonarJS) | 10 | 3.75 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 603013 |
| Context Utilization | 23% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 0 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

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
| Refactorings Applied | 0 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


