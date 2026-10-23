# Analysis Report: 2026-10-23_02-20-27_claim-office-example-mapping_exact-ptdd-v1-pi_gemini-4-argon-3

Generated: 2026-10-23T03:18:30+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-ptdd-v1-pi |
| Model | gemini-4-argon |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 3469s |
| Started | 2026-10-23T02:20:30+00:00 |
| Ended | 2026-10-23T03:18:30+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, claim.ts, cli.ts, price-list.ts, quote.ts
- **Implementation LOC** (total): 365
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 886
- **Active tests**: 46
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (46 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-10-23_02-20-27_claim-office-example-mapping_exact-ptdd-v1-pi_gemini-4-argon-3
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-10-23_02-20-27_claim-office-example-mapping_exact-ptdd-v1-pi_gemini-4-argon-3

 ✓ src/claim-office.spec.ts  (46 tests) 10ms

 Test Files  1 passed (1)
      Tests  46 passed (46)
   Start at  03:18:31
   Duration  332ms (transform 89ms, setup 0ms, collect 94ms, tests 10ms, environment 0ms, prepare 82ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 95% |
| Branches | 94% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 69 | ×1 | 69 |
| Invocations | 92 | ×2 | 184 |
| Conditionals | 11 | ×4 | 44 |
| Loops | 7 | ×5 | 35 |
| Assignments | 67 | ×6 | 402 |
| **Total Mass** | | | **734** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 327 |
| Functions | 21 |
| Longest Function | 24 lines |
| Avg LOC/Function | 5.48 |
| Median LOC/Function | 3.00 |
| Imports | 6 |

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
| McCabe (Cyclomatic) | 5 | 1.71 | 0 |
| Cognitive (SonarJS) | 5 | 1.83 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 14208275 |
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
| Predictions Correct | 92 |
| Predictions Total | 92 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 46 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


