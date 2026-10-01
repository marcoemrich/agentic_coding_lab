# Analysis Report: 2026-09-23_07-04-54_claim-office-example-mapping_exact-ptdd-v1-cc_opus-5-5-no-thinking

Generated: 2026-09-23T07:19:56+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-ptdd-v1-cc |
| Model | opus-5-5-no-thinking |
| Model Version(s) | claude-opus-5-5 |
| Thinking | unknown |
| Duration | 900s |
| Started | 2026-09-23T07:04:54+00:00 |
| Ended | 2026-09-23T07:19:56+00:00 |

## Code Metrics

- **Implementation files**: claimOffice.ts, claimSettlement.ts, cli.ts, node-shims.d.ts, premium.ts, priceList.ts, types.ts
- **Implementation LOC** (total): 216
- **Test files**: claimOffice.spec.ts, cli.spec.ts
- **Test LOC** (total): 241
- **Active tests**: 41
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (41 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-23_07-04-54_claim-office-example-mapping_exact-ptdd-v1-cc_opus-5-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-23_07-04-54_claim-office-example-mapping_exact-ptdd-v1-cc_opus-5-5-no-thinking

 ✓ src/claimOffice.spec.ts  (35 tests) 8ms
 ✓ src/cli.spec.ts  (6 tests) 915ms

 Test Files  2 passed (2)
      Tests  41 passed (41)
   Start at  07:19:57
   Duration  1.44s (transform 72ms, setup 0ms, collect 88ms, tests 923ms, environment 0ms, prepare 145ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 93% |
| Branches | 92% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 67 | ×1 | 67 |
| Invocations | 85 | ×2 | 170 |
| Conditionals | 14 | ×4 | 56 |
| Loops | 9 | ×5 | 45 |
| Assignments | 65 | ×6 | 390 |
| **Total Mass** | | | **728** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 174 |
| Functions | 26 |
| Longest Function | 16 lines |
| Avg LOC/Function | 4.08 |
| Median LOC/Function | 3.50 |
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
| McCabe (Cyclomatic) | 3 | 1.45 | 0 |
| Cognitive (SonarJS) | 2 | 1.36 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 25692947 |
| Context Utilization | 72% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 1 |
| Avg Cycle Time | 12.69s |
| Avg Red Phase | 12.69s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 8 |
| Predictions Total | 8 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 1 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 1 |


