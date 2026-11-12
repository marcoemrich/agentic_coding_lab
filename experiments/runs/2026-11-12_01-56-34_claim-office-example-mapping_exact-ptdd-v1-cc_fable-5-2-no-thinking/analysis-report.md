# Analysis Report: 2026-11-12_01-56-34_claim-office-example-mapping_exact-ptdd-v1-cc_fable-5-2-no-thinking

Generated: 2026-11-12T02:33:52+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-ptdd-v1-cc |
| Model | fable-5-2-no-thinking |
| Model Version(s) | claude-fable-5-2 |
| Thinking | unknown |
| Duration | 2234s |
| Started | 2026-11-12T01:56:34+00:00 |
| Ended | 2026-11-12T02:33:52+00:00 |

## Code Metrics

- **Implementation files**: amounts.ts, claim-office.ts, claim.ts, cli.ts, coverage.ts, policy.ts, premium.ts, price-list.ts, risk-surcharge.ts, rounding.ts
- **Implementation LOC** (total): 293
- **Test files**: claim-office.spec.ts, cli.spec.ts
- **Test LOC** (total): 468
- **Active tests**: 54
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (54 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-11-12_01-56-34_claim-office-example-mapping_exact-ptdd-v1-cc_fable-5-2-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-11-12_01-56-34_claim-office-example-mapping_exact-ptdd-v1-cc_fable-5-2-no-thinking

 ✓ src/claim-office.spec.ts  (51 tests) 12ms
 ✓ src/cli.spec.ts  (3 tests) 298ms

 Test Files  2 passed (2)
      Tests  54 passed (54)
   Start at  02:33:53
   Duration  823ms (transform 112ms, setup 0ms, collect 125ms, tests 310ms, environment 0ms, prepare 142ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 94% |
| Branches | 98% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 65 | ×1 | 65 |
| Invocations | 113 | ×2 | 226 |
| Conditionals | 15 | ×4 | 60 |
| Loops | 8 | ×5 | 40 |
| Assignments | 57 | ×6 | 342 |
| **Total Mass** | | | **733** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 239 |
| Functions | 35 |
| Longest Function | 11 lines |
| Avg LOC/Function | 4.37 |
| Median LOC/Function | 3.00 |
| Imports | 21 |

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
| McCabe (Cyclomatic) | 3 | 1.38 | 0 |
| Cognitive (SonarJS) | 2 | 1.14 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 70254257 |
| Context Utilization | 140% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 10 |
| Avg Cycle Time | 198.24s |
| Avg Red Phase | 6.7s |
| Avg Green Phase | 187.93s |
| Avg Refactor Phase | 3.61s |

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
| Refactorings Applied | 1 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 2 |


