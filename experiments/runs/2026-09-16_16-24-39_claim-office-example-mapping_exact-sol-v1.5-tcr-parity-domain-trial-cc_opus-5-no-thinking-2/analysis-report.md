# Analysis Report: 2026-09-16_16-24-39_claim-office-example-mapping_exact-sol-v1.5-tcr-parity-domain-trial-cc_opus-5-no-thinking-2

Generated: 2026-09-16T16:46:32+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-sol-v1.5-tcr-parity-domain-trial-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 1297s |
| Started | 2026-09-16T16:24:39+00:00 |
| Ended | 2026-09-16T16:46:32+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 342
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 592
- **Active tests**: 49
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (49 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-16_16-24-39_claim-office-example-mapping_exact-sol-v1.5-tcr-parity-domain-trial-cc_opus-5-no-thinking-2
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-16_16-24-39_claim-office-example-mapping_exact-sol-v1.5-tcr-parity-domain-trial-cc_opus-5-no-thinking-2

 ✓ src/claim-office.spec.ts  (49 tests) 1666ms

 Test Files  1 passed (1)
      Tests  49 passed (49)
   Start at  16:46:34
   Duration  2.46s (transform 277ms, setup 0ms, collect 259ms, tests 1.67s, environment 0ms, prepare 216ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 91% |
| Branches | 96% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 66 | ×1 | 66 |
| Invocations | 106 | ×2 | 212 |
| Conditionals | 13 | ×4 | 52 |
| Loops | 8 | ×5 | 40 |
| Assignments | 54 | ×6 | 324 |
| **Total Mass** | | | **694** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 274 |
| Functions | 28 |
| Longest Function | 26 lines |
| Avg LOC/Function | 6.14 |
| Median LOC/Function | 5.00 |
| Imports | 2 |

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
| McCabe (Cyclomatic) | 3 | 1.61 | 0 |
| Cognitive (SonarJS) | 3 | 1.38 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 17882434 |
| Context Utilization | 73% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 63 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 82 |
| Predictions Total | 83 |
| Accuracy | 98% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 41 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 22 |


