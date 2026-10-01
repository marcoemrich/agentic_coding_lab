# Analysis Report: 2026-10-01_01-43-07_claim-office-example-mapping_external-kesseler-2026-09-30-cc_opus-5-5-no-thinking

Generated: 2026-10-01T01:51:55+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | external-kesseler-2026-09-30-cc |
| Model | opus-5-5-no-thinking |
| Model Version(s) | claude-opus-5-5 |
| Thinking | unknown |
| Duration | 525s |
| Started | 2026-10-01T01:43:07+00:00 |
| Ended | 2026-10-01T01:51:55+00:00 |

## Code Metrics

- **Implementation files**: claim.ts, cli.ts, premium.ts, scenario.ts
- **Implementation LOC** (total): 206
- **Test files**: cli.spec.ts, scenario.spec.ts
- **Test LOC** (total): 378
- **Active tests**: 33
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (47 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-10-01_01-43-07_claim-office-example-mapping_external-kesseler-2026-09-30-cc_opus-5-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-10-01_01-43-07_claim-office-example-mapping_external-kesseler-2026-09-30-cc_opus-5-5-no-thinking

 ✓ src/scenario.spec.ts  (44 tests) 10ms
 ✓ src/cli.spec.ts  (3 tests) 442ms

 Test Files  2 passed (2)
      Tests  47 passed (47)
   Start at  01:51:56
   Duration  939ms (transform 84ms, setup 0ms, collect 87ms, tests 452ms, environment 0ms, prepare 138ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 95% |
| Branches | 98% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 56 | ×1 | 56 |
| Invocations | 72 | ×2 | 144 |
| Conditionals | 15 | ×4 | 60 |
| Loops | 9 | ×5 | 45 |
| Assignments | 44 | ×6 | 264 |
| **Total Mass** | | | **569** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 174 |
| Functions | 16 |
| Longest Function | 17 lines |
| Avg LOC/Function | 5.12 |
| Median LOC/Function | 3.00 |
| Imports | 5 |

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
| McCabe (Cyclomatic) | 4 | 1.58 | 0 |
| Cognitive (SonarJS) | 3 | 1.67 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 13802295 |
| Context Utilization | 50% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 71 |
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


