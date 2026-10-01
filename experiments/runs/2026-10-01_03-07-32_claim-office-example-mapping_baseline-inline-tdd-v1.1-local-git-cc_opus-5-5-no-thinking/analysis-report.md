# Analysis Report: 2026-10-01_03-07-32_claim-office-example-mapping_baseline-inline-tdd-v1.1-local-git-cc_opus-5-5-no-thinking

Generated: 2026-10-01T03:09:47+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | baseline-inline-tdd-v1.1-local-git-cc |
| Model | opus-5-5-no-thinking |
| Model Version(s) | claude-opus-5-5 |
| Thinking | unknown |
| Duration | 132s |
| Started | 2026-10-01T03:07:32+00:00 |
| Ended | 2026-10-01T03:09:47+00:00 |

## Code Metrics

- **Implementation files**: claim.ts, cli.ts, items.ts, premium.ts, scenario.ts
- **Implementation LOC** (total): 205
- **Test files**: claim.spec.ts, cli.spec.ts, premium.spec.ts
- **Test LOC** (total): 267
- **Active tests**: 34
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (46 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-10-01_03-07-32_claim-office-example-mapping_baseline-inline-tdd-v1.1-local-git-cc_opus-5-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-10-01_03-07-32_claim-office-example-mapping_baseline-inline-tdd-v1.1-local-git-cc_opus-5-5-no-thinking

 ✓ src/claim.spec.ts  (14 tests) 6ms
 ✓ src/cli.spec.ts  (8 tests) 1540ms
 ✓ src/premium.spec.ts  (24 tests) 6ms

 Test Files  3 passed (3)
      Tests  46 passed (46)
   Start at  03:09:48
   Duration  2.44s (transform 108ms, setup 0ms, collect 149ms, tests 1.55s, environment 0ms, prepare 282ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 73% |
| Branches | 95% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 63 | ×1 | 63 |
| Invocations | 89 | ×2 | 178 |
| Conditionals | 20 | ×4 | 80 |
| Loops | 9 | ×5 | 45 |
| Assignments | 52 | ×6 | 312 |
| **Total Mass** | | | **678** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 173 |
| Functions | 11 |
| Longest Function | 24 lines |
| Avg LOC/Function | 7.09 |
| Median LOC/Function | 6.00 |
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
| McCabe (Cyclomatic) | 10 | 2.45 | 0 |
| Cognitive (SonarJS) | 8 | 2.90 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 1058949 |
| Context Utilization | 27% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 8 |
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


