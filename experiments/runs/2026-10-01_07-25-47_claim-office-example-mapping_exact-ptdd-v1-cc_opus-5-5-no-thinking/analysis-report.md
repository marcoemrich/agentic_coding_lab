# Analysis Report: 2026-10-01_07-25-47_claim-office-example-mapping_exact-ptdd-v1-cc_opus-5-5-no-thinking

Generated: 2026-10-01T07:40:38+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-ptdd-v1-cc |
| Model | opus-5-5-no-thinking |
| Model Version(s) | claude-opus-5-5 |
| Thinking | unknown |
| Duration | 887s |
| Started | 2026-10-01T07:25:47+00:00 |
| Ended | 2026-10-01T07:40:38+00:00 |

## Code Metrics

- **Implementation files**: catalogue.ts, claimOffice.ts, claims.ts, cli.ts, premium.ts
- **Implementation LOC** (total): 251
- **Test files**: claimOffice.spec.ts, cli.spec.ts
- **Test LOC** (total): 293
- **Active tests**: 48
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (48 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-10-01_07-25-47_claim-office-example-mapping_exact-ptdd-v1-cc_opus-5-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-10-01_07-25-47_claim-office-example-mapping_exact-ptdd-v1-cc_opus-5-5-no-thinking

 ✓ src/claimOffice.spec.ts  (43 tests) 8ms
 ✓ src/cli.spec.ts  (5 tests) 797ms

 Test Files  2 passed (2)
      Tests  48 passed (48)
   Start at  07:40:39
   Duration  1.42s (transform 90ms, setup 0ms, collect 98ms, tests 805ms, environment 0ms, prepare 179ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 95% |
| Branches | 98% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 59 | ×1 | 59 |
| Invocations | 92 | ×2 | 184 |
| Conditionals | 14 | ×4 | 56 |
| Loops | 7 | ×5 | 35 |
| Assignments | 46 | ×6 | 276 |
| **Total Mass** | | | **610** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 210 |
| Functions | 25 |
| Longest Function | 12 lines |
| Avg LOC/Function | 4.84 |
| Median LOC/Function | 5.00 |
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
| McCabe (Cyclomatic) | 3 | 1.37 | 0 |
| Cognitive (SonarJS) | 2 | 1.27 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 23855294 |
| Context Utilization | 68% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 2 |
| Avg Cycle Time | 6.57s |
| Avg Red Phase | 6.57s |
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


