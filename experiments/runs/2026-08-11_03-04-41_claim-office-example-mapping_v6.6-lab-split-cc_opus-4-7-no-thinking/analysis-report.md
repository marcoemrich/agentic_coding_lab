# Analysis Report: 2026-08-11_03-04-41_claim-office-example-mapping_v6.6-lab-split-cc_opus-4-7-no-thinking

Generated: 2026-08-11T04:43:46+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.6-lab-split-cc |
| Model | opus-4-7-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 5944s |
| Started | 2026-08-11T03:04:41+00:00 |
| Ended | 2026-08-11T04:43:46+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 207
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 566
- **Active tests**: 39
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (39 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-11_03-04-41_claim-office-example-mapping_v6.6-lab-split-cc_opus-4-7-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-11_03-04-41_claim-office-example-mapping_v6.6-lab-split-cc_opus-4-7-no-thinking

 ✓ src/claim-office.spec.ts  (39 tests) 18ms

 Test Files  1 passed (1)
      Tests  39 passed (39)
   Start at  04:43:47
   Duration  196ms (transform 46ms, setup 0ms, collect 46ms, tests 18ms, environment 0ms, prepare 44ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 90% |
| Branches | 98% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 46 | ×1 | 46 |
| Invocations | 83 | ×2 | 166 |
| Conditionals | 8 | ×4 | 32 |
| Loops | 7 | ×5 | 35 |
| Assignments | 85 | ×6 | 510 |
| **Total Mass** | | | **789** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 157 |
| Functions | 31 |
| Longest Function | 9 lines |
| Avg LOC/Function | 3.39 |
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
| McCabe (Cyclomatic) | 4 | 1.43 | 0 |
| Cognitive (SonarJS) | 4 | 1.29 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 38510335 |
| Context Utilization | 24% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 18 |
| Avg Cycle Time | 141.97s |
| Avg Red Phase | 34.04s |
| Avg Green Phase | 14.45s |
| Avg Refactor Phase | 93.48s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 35 |
| Predictions Total | 36 |
| Accuracy | 97% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 18 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


