# Analysis Report: 2026-10-23_02-20-28_claim-office-example-mapping_exact-ptdd-v1-pi_gemini-4-argon

Generated: 2026-10-23T03:17:01+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-ptdd-v1-pi |
| Model | gemini-4-argon |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 3380s |
| Started | 2026-10-23T02:20:30+00:00 |
| Ended | 2026-10-23T03:17:01+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts, node-env.d.ts
- **Implementation LOC** (total): 364
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 806
- **Active tests**: 32
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (32 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-10-23_02-20-28_claim-office-example-mapping_exact-ptdd-v1-pi_gemini-4-argon
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-10-23_02-20-28_claim-office-example-mapping_exact-ptdd-v1-pi_gemini-4-argon

 ✓ src/claim-office.spec.ts  (32 tests) 196ms

 Test Files  1 passed (1)
      Tests  32 passed (32)
   Start at  03:17:02
   Duration  571ms (transform 107ms, setup 0ms, collect 94ms, tests 196ms, environment 0ms, prepare 82ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 99% |
| Branches | 96% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 64 | ×1 | 64 |
| Invocations | 75 | ×2 | 150 |
| Conditionals | 14 | ×4 | 56 |
| Loops | 6 | ×5 | 30 |
| Assignments | 67 | ×6 | 402 |
| **Total Mass** | | | **702** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 325 |
| Functions | 16 |
| Longest Function | 23 lines |
| Avg LOC/Function | 7.00 |
| Median LOC/Function | 3.00 |
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
| McCabe (Cyclomatic) | 5 | 1.90 | 0 |
| Cognitive (SonarJS) | 6 | 2.44 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 7656154 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 32 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 64 |
| Predictions Total | 64 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 32 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


