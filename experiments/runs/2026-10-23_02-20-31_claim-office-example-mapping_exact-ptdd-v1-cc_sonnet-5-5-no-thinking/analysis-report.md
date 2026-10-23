# Analysis Report: 2026-10-23_02-20-31_claim-office-example-mapping_exact-ptdd-v1-cc_sonnet-5-5-no-thinking

Generated: 2026-10-23T02:39:47+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-ptdd-v1-cc |
| Model | sonnet-5-5-no-thinking |
| Model Version(s) | claude-sonnet-5-5 |
| Thinking | unknown |
| Duration | 1145s |
| Started | 2026-10-23T02:20:32+00:00 |
| Ended | 2026-10-23T02:39:47+00:00 |

## Code Metrics

- **Implementation files**: claim.ts, cli.ts, premium.ts, price-list.ts, reimbursement.ts, scenario.ts
- **Implementation LOC** (total): 239
- **Test files**: claim-office.spec.ts, cli.spec.ts
- **Test LOC** (total): 376
- **Active tests**: 52
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (52 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-10-23_02-20-31_claim-office-example-mapping_exact-ptdd-v1-cc_sonnet-5-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-10-23_02-20-31_claim-office-example-mapping_exact-ptdd-v1-cc_sonnet-5-5-no-thinking

 ✓ src/claim-office.spec.ts  (49 tests) 10ms
 ✓ src/cli.spec.ts  (3 tests) 1659ms

 Test Files  2 passed (2)
      Tests  52 passed (52)
   Start at  02:39:48
   Duration  2.16s (transform 89ms, setup 0ms, collect 91ms, tests 1.67s, environment 0ms, prepare 137ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 97% |
| Branches | 98% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 61 | ×1 | 61 |
| Invocations | 87 | ×2 | 174 |
| Conditionals | 13 | ×4 | 52 |
| Loops | 8 | ×5 | 40 |
| Assignments | 36 | ×6 | 216 |
| **Total Mass** | | | **543** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 197 |
| Functions | 25 |
| Longest Function | 12 lines |
| Avg LOC/Function | 4.72 |
| Median LOC/Function | 3.00 |
| Imports | 10 |

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
| McCabe (Cyclomatic) | 3 | 1.55 | 0 |
| Cognitive (SonarJS) | 3 | 1.29 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 57012534 |
| Context Utilization | 105% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 53 |
| Avg Cycle Time | 5.49s |
| Avg Red Phase | 1.32s |
| Avg Green Phase | 2.07s |
| Avg Refactor Phase | 2.1s |

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
| Refactorings Applied | 18 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 25 |


