# Analysis Report: 2026-09-23_15-21-56_claim-office-example-mapping_exact-ptdd-v1.1-refactor-subagent-cc_opus-5-5-no-thinking

Generated: 2026-09-23T16:10:05+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-ptdd-v1.1-refactor-subagent-cc |
| Model | opus-5-5-no-thinking |
| Model Version(s) | claude-opus-5-5 |
| Thinking | unknown |
| Duration | 2886s |
| Started | 2026-09-23T15:21:56+00:00 |
| Ended | 2026-09-23T16:10:05+00:00 |

## Code Metrics

- **Implementation files**: claimOffice.ts, claimSettlement.ts, cli.ts, damageReimbursement.ts, magicalItem.ts, mhpcoRounding.ts, policyCoverage.ts, premium.ts, priceList.ts
- **Implementation LOC** (total): 222
- **Test files**: claimOffice.spec.ts, cli.spec.ts
- **Test LOC** (total): 249
- **Active tests**: 47
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (47 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-23_15-21-56_claim-office-example-mapping_exact-ptdd-v1.1-refactor-subagent-cc_opus-5-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-23_15-21-56_claim-office-example-mapping_exact-ptdd-v1.1-refactor-subagent-cc_opus-5-5-no-thinking

 ✓ src/claimOffice.spec.ts  (44 tests) 12ms
 ✓ src/cli.spec.ts  (3 tests) 1652ms

 Test Files  2 passed (2)
      Tests  47 passed (47)
   Start at  16:10:07
   Duration  2.27s (transform 102ms, setup 0ms, collect 132ms, tests 1.66s, environment 0ms, prepare 182ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 94% |
| Branches | 98% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 67 | ×1 | 67 |
| Invocations | 91 | ×2 | 182 |
| Conditionals | 12 | ×4 | 48 |
| Loops | 7 | ×5 | 35 |
| Assignments | 52 | ×6 | 312 |
| **Total Mass** | | | **644** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 181 |
| Functions | 27 |
| Longest Function | 13 lines |
| Avg LOC/Function | 4.41 |
| Median LOC/Function | 3.00 |
| Imports | 17 |

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
| McCabe (Cyclomatic) | 3 | 1.33 | 0 |
| Cognitive (SonarJS) | 2 | 1.20 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 40746844 |
| Context Utilization | 95% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 41 |
| Avg Cycle Time | 40.46s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 40.46s |

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
| Refactorings Applied | 47 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


