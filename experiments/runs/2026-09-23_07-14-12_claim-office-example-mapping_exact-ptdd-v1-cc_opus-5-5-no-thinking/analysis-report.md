# Analysis Report: 2026-09-23_07-14-12_claim-office-example-mapping_exact-ptdd-v1-cc_opus-5-5-no-thinking

Generated: 2026-09-23T07:28:24+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-ptdd-v1-cc |
| Model | opus-5-5-no-thinking |
| Model Version(s) | claude-opus-5-5 |
| Thinking | unknown |
| Duration | 849s |
| Started | 2026-09-23T07:14:12+00:00 |
| Ended | 2026-09-23T07:28:24+00:00 |

## Code Metrics

- **Implementation files**: claim.ts, claimOffice.ts, cli.ts, premium.ts, priceList.ts
- **Implementation LOC** (total): 225
- **Test files**: claimOffice.spec.ts, cli.spec.ts
- **Test LOC** (total): 277
- **Active tests**: 46
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (46 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-23_07-14-12_claim-office-example-mapping_exact-ptdd-v1-cc_opus-5-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-23_07-14-12_claim-office-example-mapping_exact-ptdd-v1-cc_opus-5-5-no-thinking

 ✓ src/claimOffice.spec.ts  (40 tests) 8ms
 ✓ src/cli.spec.ts  (6 tests) 2956ms

 Test Files  2 passed (2)
      Tests  46 passed (46)
   Start at  07:28:25
   Duration  3.42s (transform 70ms, setup 0ms, collect 85ms, tests 2.96s, environment 0ms, prepare 134ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 95% |
| Branches | 92% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 57 | ×1 | 57 |
| Invocations | 86 | ×2 | 172 |
| Conditionals | 15 | ×4 | 60 |
| Loops | 7 | ×5 | 35 |
| Assignments | 45 | ×6 | 270 |
| **Total Mass** | | | **594** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 186 |
| Functions | 22 |
| Longest Function | 14 lines |
| Avg LOC/Function | 4.64 |
| Median LOC/Function | 4.00 |
| Imports | 7 |

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
| McCabe (Cyclomatic) | 3 | 1.63 | 0 |
| Cognitive (SonarJS) | 2 | 1.42 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 24783994 |
| Context Utilization | 67% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 2 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
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
| Tests Passed Immediately | 2 |


