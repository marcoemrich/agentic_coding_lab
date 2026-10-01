# Analysis Report: 2026-09-23_16-45-13_claim-office-example-mapping_exact-ptdd-v1.1-refactor-subagent-cc_opus-5-5-no-thinking

Generated: 2026-09-23T17:35:16+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-ptdd-v1.1-refactor-subagent-cc |
| Model | opus-5-5-no-thinking |
| Model Version(s) | claude-opus-5-5 |
| Thinking | unknown |
| Duration | 3000s |
| Started | 2026-09-23T16:45:13+00:00 |
| Ended | 2026-09-23T17:35:16+00:00 |

## Code Metrics

- **Implementation files**: claimOffice.ts, cli.ts, coverage.ts, damageReport.ts, policy.ts, premium.ts, priceList.ts, reimbursement.ts, rejection.ts, rounding.ts
- **Implementation LOC** (total): 337
- **Test files**: claimOffice.spec.ts
- **Test LOC** (total): 281
- **Active tests**: 45
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (45 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-23_16-45-13_claim-office-example-mapping_exact-ptdd-v1.1-refactor-subagent-cc_opus-5-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-23_16-45-13_claim-office-example-mapping_exact-ptdd-v1.1-refactor-subagent-cc_opus-5-5-no-thinking

 ✓ src/claimOffice.spec.ts  (45 tests) 1066ms

 Test Files  1 passed (1)
      Tests  45 passed (45)
   Start at  17:35:17
   Duration  1.47s (transform 109ms, setup 0ms, collect 120ms, tests 1.07s, environment 0ms, prepare 98ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 94% |
| Branches | 93% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 77 | ×1 | 77 |
| Invocations | 114 | ×2 | 228 |
| Conditionals | 11 | ×4 | 44 |
| Loops | 10 | ×5 | 50 |
| Assignments | 49 | ×6 | 294 |
| **Total Mass** | | | **693** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 278 |
| Functions | 33 |
| Longest Function | 12 lines |
| Avg LOC/Function | 4.30 |
| Median LOC/Function | 3.00 |
| Imports | 20 |

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
| McCabe (Cyclomatic) | 3 | 1.30 | 0 |
| Cognitive (SonarJS) | 2 | 1.08 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 37593894 |
| Context Utilization | 105% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 14 |
| Avg Cycle Time | 46.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 46s |

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
| Refactorings Applied | 45 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


