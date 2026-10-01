# Analysis Report: 2026-10-01_08-59-02_claim-office-example-mapping_exact-ptdd-v1-cc_opus-5-5-no-thinking

Generated: 2026-10-01T09:13:03+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-ptdd-v1-cc |
| Model | opus-5-5-no-thinking |
| Model Version(s) | claude-opus-5-5 |
| Thinking | unknown |
| Duration | 838s |
| Started | 2026-10-01T08:59:02+00:00 |
| Ended | 2026-10-01T09:13:03+00:00 |

## Code Metrics

- **Implementation files**: claim.ts, claimOffice.ts, cli.ts, premium.ts, priceList.ts
- **Implementation LOC** (total): 184
- **Test files**: claimOffice.spec.ts, cli.spec.ts
- **Test LOC** (total): 224
- **Active tests**: 45
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (45 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-10-01_08-59-02_claim-office-example-mapping_exact-ptdd-v1-cc_opus-5-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-10-01_08-59-02_claim-office-example-mapping_exact-ptdd-v1-cc_opus-5-5-no-thinking

 ✓ src/claimOffice.spec.ts  (39 tests) 8ms
 ✓ src/cli.spec.ts  (6 tests) 940ms

 Test Files  2 passed (2)
      Tests  45 passed (45)
   Start at  09:13:05
   Duration  1.51s (transform 93ms, setup 0ms, collect 95ms, tests 948ms, environment 0ms, prepare 179ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 90% |
| Branches | 90% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 62 | ×1 | 62 |
| Invocations | 76 | ×2 | 152 |
| Conditionals | 13 | ×4 | 52 |
| Loops | 7 | ×5 | 35 |
| Assignments | 55 | ×6 | 330 |
| **Total Mass** | | | **631** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 156 |
| Functions | 20 |
| Longest Function | 14 lines |
| Avg LOC/Function | 5.20 |
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
| McCabe (Cyclomatic) | 3 | 1.50 | 0 |
| Cognitive (SonarJS) | 2 | 1.50 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 22675592 |
| Context Utilization | 65% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 1 |
| Avg Cycle Time | 746.11s |
| Avg Red Phase | 10.4s |
| Avg Green Phase | 735.71s |
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
| Tests Passed Immediately | 0 |


