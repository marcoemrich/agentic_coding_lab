# Analysis Report: 2026-09-23_06-45-49_claim-office-example-mapping_exact-ptdd-v1-cc_opus-5-5-no-thinking

Generated: 2026-09-23T07:01:13+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-ptdd-v1-cc |
| Model | opus-5-5-no-thinking |
| Model Version(s) | claude-opus-5-5 |
| Thinking | unknown |
| Duration | 921s |
| Started | 2026-09-23T06:45:49+00:00 |
| Ended | 2026-09-23T07:01:13+00:00 |

## Code Metrics

- **Implementation files**: catalogue.ts, claim.ts, claimOffice.ts, cli.ts, percent.ts, policyBasePremium.ts, premium.ts, riskSurcharges.ts
- **Implementation LOC** (total): 259
- **Test files**: claimOffice.spec.ts
- **Test LOC** (total): 299
- **Active tests**: 49
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (49 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-23_06-45-49_claim-office-example-mapping_exact-ptdd-v1-cc_opus-5-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-23_06-45-49_claim-office-example-mapping_exact-ptdd-v1-cc_opus-5-5-no-thinking

 ✓ src/claimOffice.spec.ts  (49 tests) 989ms

 Test Files  1 passed (1)
      Tests  49 passed (49)
   Start at  07:01:14
   Duration  1.30s (transform 93ms, setup 0ms, collect 98ms, tests 989ms, environment 0ms, prepare 80ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 90% |
| Branches | 90% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 66 | ×1 | 66 |
| Invocations | 109 | ×2 | 218 |
| Conditionals | 15 | ×4 | 60 |
| Loops | 7 | ×5 | 35 |
| Assignments | 48 | ×6 | 288 |
| **Total Mass** | | | **667** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 216 |
| Functions | 25 |
| Longest Function | 14 lines |
| Avg LOC/Function | 4.80 |
| Median LOC/Function | 3.00 |
| Imports | 13 |

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
| McCabe (Cyclomatic) | 3 | 1.40 | 0 |
| Cognitive (SonarJS) | 2 | 1.33 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 26188223 |
| Context Utilization | 70% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 1 |
| Avg Cycle Time | 15.14s |
| Avg Red Phase | 13.43s |
| Avg Green Phase | 1.71s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 2 |
| Predictions Total | 2 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 1 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


