# Analysis Report: 2026-10-01_07-23-14_claim-office-example-mapping_baseline-inline-tdd-v1.1-local-git-cc_opus-5-5-no-thinking

Generated: 2026-10-01T07:25:18+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | baseline-inline-tdd-v1.1-local-git-cc |
| Model | opus-5-5-no-thinking |
| Model Version(s) | claude-opus-5-5 |
| Thinking | unknown |
| Duration | 119s |
| Started | 2026-10-01T07:23:14+00:00 |
| Ended | 2026-10-01T07:25:18+00:00 |

## Code Metrics

- **Implementation files**: catalog.ts, claim.ts, cli.ts, premium.ts, scenario.ts
- **Implementation LOC** (total): 220
- **Test files**: claim.spec.ts, cli.spec.ts, premium.spec.ts
- **Test LOC** (total): 252
- **Active tests**: 30
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (36 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-10-01_07-23-14_claim-office-example-mapping_baseline-inline-tdd-v1.1-local-git-cc_opus-5-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-10-01_07-23-14_claim-office-example-mapping_baseline-inline-tdd-v1.1-local-git-cc_opus-5-5-no-thinking

 ✓ src/claim.spec.ts  (16 tests) 5ms
 ✓ src/cli.spec.ts  (6 tests) 2060ms
 ✓ src/premium.spec.ts  (14 tests) 5ms

 Test Files  3 passed (3)
      Tests  36 passed (36)
   Start at  07:25:19
   Duration  2.85s (transform 131ms, setup 0ms, collect 136ms, tests 2.07s, environment 0ms, prepare 236ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 91% |
| Branches | 90% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 68 | ×1 | 68 |
| Invocations | 90 | ×2 | 180 |
| Conditionals | 21 | ×4 | 84 |
| Loops | 12 | ×5 | 60 |
| Assignments | 54 | ×6 | 324 |
| **Total Mass** | | | **716** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 187 |
| Functions | 12 |
| Longest Function | 28 lines |
| Avg LOC/Function | 7.33 |
| Median LOC/Function | 4.50 |
| Imports | 6 |

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
| McCabe (Cyclomatic) | 8 | 2.48 | 0 |
| Cognitive (SonarJS) | 9 | 2.92 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 1176639 |
| Context Utilization | 29% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 7 |
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
| Tests Passed Immediately | 0 |


