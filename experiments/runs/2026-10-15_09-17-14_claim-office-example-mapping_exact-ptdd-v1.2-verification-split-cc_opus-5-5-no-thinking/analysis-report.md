# Analysis Report: 2026-10-15_09-17-14_claim-office-example-mapping_exact-ptdd-v1.2-verification-split-cc_opus-5-5-no-thinking

Generated: 2026-10-15T09:33:54+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-ptdd-v1.2-verification-split-cc |
| Model | opus-5-5-no-thinking |
| Model Version(s) | claude-opus-5-5 |
| Thinking | unknown |
| Duration | 997s |
| Started | 2026-10-15T09:17:14+00:00 |
| Ended | 2026-10-15T09:33:54+00:00 |

## Code Metrics

- **Implementation files**: claimOffice.ts, cli.ts, customer.ts, item.ts, payout.ts, premium.ts, priceList.ts
- **Implementation LOC** (total): 234
- **Test files**: claimOffice.spec.ts
- **Test LOC** (total): 246
- **Active tests**: 45
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (45 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-10-15_09-17-14_claim-office-example-mapping_exact-ptdd-v1.2-verification-split-cc_opus-5-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-10-15_09-17-14_claim-office-example-mapping_exact-ptdd-v1.2-verification-split-cc_opus-5-5-no-thinking

 ✓ src/claimOffice.spec.ts  (45 tests) 3167ms

 Test Files  1 passed (1)
      Tests  45 passed (45)
   Start at  09:33:55
   Duration  3.52s (transform 92ms, setup 1ms, collect 96ms, tests 3.17s, environment 0ms, prepare 89ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 91% |
| Branches | 90% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 71 | ×1 | 71 |
| Invocations | 81 | ×2 | 162 |
| Conditionals | 18 | ×4 | 72 |
| Loops | 8 | ×5 | 40 |
| Assignments | 41 | ×6 | 246 |
| **Total Mass** | | | **591** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 192 |
| Functions | 22 |
| Longest Function | 18 lines |
| Avg LOC/Function | 4.55 |
| Median LOC/Function | 3.00 |
| Imports | 11 |

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
| McCabe (Cyclomatic) | 4 | 1.45 | 0 |
| Cognitive (SonarJS) | 3 | 1.75 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 27925425 |
| Context Utilization | 69% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 1 |
| Avg Cycle Time | 0.29s |
| Avg Red Phase | 0.29s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

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
| Refactorings Applied | 0 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 1 |


