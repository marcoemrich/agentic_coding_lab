# Analysis Report: 2026-10-23_02-20-27_claim-office-example-mapping_exact-ptdd-v1-pi_gemini-4-argon

Generated: 2026-10-23T03:30:40+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-ptdd-v1-pi |
| Model | gemini-4-argon |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 4200s |
| Started | 2026-10-23T02:20:30+00:00 |
| Ended | 2026-10-23T03:30:40+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts, node.d.ts
- **Implementation LOC** (total): 398
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 827
- **Active tests**: 46
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (46 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-10-23_02-20-27_claim-office-example-mapping_exact-ptdd-v1-pi_gemini-4-argon
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-10-23_02-20-27_claim-office-example-mapping_exact-ptdd-v1-pi_gemini-4-argon

 ✓ src/claim-office.spec.ts  (46 tests) 1910ms

 Test Files  1 passed (1)
      Tests  46 passed (46)
   Start at  03:30:41
   Duration  2.47s (transform 162ms, setup 0ms, collect 157ms, tests 1.91s, environment 0ms, prepare 177ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 98% |
| Branches | 95% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 70 | ×1 | 70 |
| Invocations | 102 | ×2 | 204 |
| Conditionals | 14 | ×4 | 56 |
| Loops | 7 | ×5 | 35 |
| Assignments | 76 | ×6 | 456 |
| **Total Mass** | | | **821** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 355 |
| Functions | 27 |
| Longest Function | 22 lines |
| Avg LOC/Function | 4.96 |
| Median LOC/Function | 3.00 |
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
| McCabe (Cyclomatic) | 6 | 1.68 | 0 |
| Cognitive (SonarJS) | 7 | 1.71 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 19710609 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 46 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 91 |
| Predictions Total | 93 |
| Accuracy | 97% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 46 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


