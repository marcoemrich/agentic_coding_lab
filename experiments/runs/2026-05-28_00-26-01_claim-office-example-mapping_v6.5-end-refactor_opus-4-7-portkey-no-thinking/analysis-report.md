# Analysis Report: 2026-05-28_00-26-01_claim-office-example-mapping_v6.5-end-refactor_opus-4-7-portkey-no-thinking

Generated: 2026-05-28T01:04:39+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.5-end-refactor |
| Model | opus-4-7-portkey-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 2317s |
| Started | 2026-05-28T00:26:01+00:00 |
| Ended | 2026-05-28T01:04:39+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 231
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 496
- **Active tests**: 42
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (42 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-28_00-26-01_claim-office-example-mapping_v6.5-end-refactor_opus-4-7-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-28_00-26-01_claim-office-example-mapping_v6.5-end-refactor_opus-4-7-portkey-no-thinking

 ✓ src/claim-office.spec.ts  (42 tests) 6ms

 Test Files  1 passed (1)
      Tests  42 passed (42)
   Start at  01:04:40
   Duration  186ms (transform 40ms, setup 1ms, collect 44ms, tests 6ms, environment 0ms, prepare 47ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 90% |
| Branches | 98% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 63 | ×1 | 63 |
| Invocations | 76 | ×2 | 152 |
| Conditionals | 8 | ×4 | 32 |
| Loops | 9 | ×5 | 45 |
| Assignments | 95 | ×6 | 570 |
| **Total Mass** | | | **862** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 194 |
| Functions | 29 |
| Longest Function | 12 lines |
| Avg LOC/Function | 3.48 |
| Median LOC/Function | 2.00 |
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
| McCabe (Cyclomatic) | 4 | 1.49 | 0 |
| Cognitive (SonarJS) | 3 | 1.69 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 47043103 |
| Context Utilization | 17% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 42 |
| Avg Cycle Time | 89.00s |
| Avg Red Phase | 19.67s |
| Avg Green Phase | 19.35s |
| Avg Refactor Phase | 49.98s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 76 |
| Predictions Total | 84 |
| Accuracy | 90% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 19 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 23 |


