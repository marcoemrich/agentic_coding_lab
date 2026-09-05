# Analysis Report: 2026-09-04_13-54-07_claim-office-example-mapping_v6.1.4-continuation-guard-cc_opus-5-no-thinking

Generated: 2026-09-04T14:46:33+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.1.4-continuation-guard-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 3141s |
| Started | 2026-09-04T13:54:07+00:00 |
| Ended | 2026-09-04T14:46:33+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 452
- **Test files**: claim-office.spec.ts, cli.spec.ts
- **Test LOC** (total): 931
- **Active tests**: 51
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (51 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-04_13-54-07_claim-office-example-mapping_v6.1.4-continuation-guard-cc_opus-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-04_13-54-07_claim-office-example-mapping_v6.1.4-continuation-guard-cc_opus-5-no-thinking

 ✓ src/claim-office.spec.ts  (47 tests) 14ms
 ✓ src/cli.spec.ts  (4 tests) 2411ms

 Test Files  2 passed (2)
      Tests  51 passed (51)
   Start at  14:46:34
   Duration  3.07s (transform 109ms, setup 0ms, collect 122ms, tests 2.42s, environment 0ms, prepare 192ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 97% |
| Branches | 98% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 57 | ×1 | 57 |
| Invocations | 77 | ×2 | 154 |
| Conditionals | 8 | ×4 | 32 |
| Loops | 12 | ×5 | 60 |
| Assignments | 111 | ×6 | 666 |
| **Total Mass** | | | **969** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 320 |
| Functions | 30 |
| Longest Function | 15 lines |
| Avg LOC/Function | 3.60 |
| Median LOC/Function | 2.00 |
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
| McCabe (Cyclomatic) | 3 | 1.25 | 0 |
| Cognitive (SonarJS) | 2 | 1.10 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 113202525 |
| Context Utilization | 200% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 51 |
| Avg Cycle Time | 106.07s |
| Avg Red Phase | 23.26s |
| Avg Green Phase | 21.38s |
| Avg Refactor Phase | 61.43s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 101 |
| Predictions Total | 102 |
| Accuracy | 99% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 23 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 28 |


