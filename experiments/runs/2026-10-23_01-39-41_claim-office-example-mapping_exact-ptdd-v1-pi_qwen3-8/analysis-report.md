# Analysis Report: 2026-10-23_01-39-41_claim-office-example-mapping_exact-ptdd-v1-pi_qwen3-8

Generated: 2026-10-23T02:09:07+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-ptdd-v1-pi |
| Model | qwen3-8 |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 1761s |
| Started | 2026-10-23T01:39:42+00:00 |
| Ended | 2026-10-23T02:09:07+00:00 |

## Code Metrics

- **Implementation files**: claimOffice.ts, cli.ts
- **Implementation LOC** (total): 315
- **Test files**: claimOffice.spec.ts, cli.spec.ts
- **Test LOC** (total): 420
- **Active tests**: 51
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (51 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-10-23_01-39-41_claim-office-example-mapping_exact-ptdd-v1-pi_qwen3-8
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-10-23_01-39-41_claim-office-example-mapping_exact-ptdd-v1-pi_qwen3-8

 ✓ src/claimOffice.spec.ts  (44 tests) 8ms
 ✓ src/cli.spec.ts  (7 tests) 160ms

 Test Files  2 passed (2)
      Tests  51 passed (51)
   Start at  02:09:08
   Duration  668ms (transform 82ms, setup 1ms, collect 91ms, tests 168ms, environment 0ms, prepare 139ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 93% |
| Branches | 94% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 69 | ×1 | 69 |
| Invocations | 93 | ×2 | 186 |
| Conditionals | 23 | ×4 | 92 |
| Loops | 13 | ×5 | 65 |
| Assignments | 69 | ×6 | 414 |
| **Total Mass** | | | **826** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 253 |
| Functions | 14 |
| Longest Function | 22 lines |
| Avg LOC/Function | 11.71 |
| Median LOC/Function | 11.50 |
| Imports | 3 |

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
| McCabe (Cyclomatic) | 9 | 2.68 | 0 |
| Cognitive (SonarJS) | 9 | 2.86 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 8746350 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 17 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 37 |
| Predictions Total | 38 |
| Accuracy | 97% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 17 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


