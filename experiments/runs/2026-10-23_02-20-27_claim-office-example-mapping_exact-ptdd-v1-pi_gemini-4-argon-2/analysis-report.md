# Analysis Report: 2026-10-23_02-20-27_claim-office-example-mapping_exact-ptdd-v1-pi_gemini-4-argon-2

Generated: 2026-10-23T03:26:40+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-ptdd-v1-pi |
| Model | gemini-4-argon |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 3959s |
| Started | 2026-10-23T02:20:30+00:00 |
| Ended | 2026-10-23T03:26:40+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, claim.ts, cli.ts, node-env.d.ts, price-list.ts, quote.ts
- **Implementation LOC** (total): 384
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 752
- **Active tests**: 43
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (43 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-10-23_02-20-27_claim-office-example-mapping_exact-ptdd-v1-pi_gemini-4-argon-2
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-10-23_02-20-27_claim-office-example-mapping_exact-ptdd-v1-pi_gemini-4-argon-2

 ✓ src/claim-office.spec.ts  (43 tests) 215ms

 Test Files  1 passed (1)
      Tests  43 passed (43)
   Start at  03:26:41
   Duration  567ms (transform 113ms, setup 0ms, collect 104ms, tests 215ms, environment 0ms, prepare 82ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 94% |
| Branches | 96% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 69 | ×1 | 69 |
| Invocations | 86 | ×2 | 172 |
| Conditionals | 11 | ×4 | 44 |
| Loops | 5 | ×5 | 25 |
| Assignments | 66 | ×6 | 396 |
| **Total Mass** | | | **706** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 340 |
| Functions | 24 |
| Longest Function | 22 lines |
| Avg LOC/Function | 5.25 |
| Median LOC/Function | 3.00 |
| Imports | 9 |

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
| McCabe (Cyclomatic) | 3 | 1.47 | 0 |
| Cognitive (SonarJS) | 3 | 1.50 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 15769236 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 43 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 86 |
| Predictions Total | 86 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 44 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


