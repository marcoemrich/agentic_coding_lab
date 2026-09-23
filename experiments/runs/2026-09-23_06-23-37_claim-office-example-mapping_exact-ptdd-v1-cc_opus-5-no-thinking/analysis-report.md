# Analysis Report: 2026-09-23_06-23-37_claim-office-example-mapping_exact-ptdd-v1-cc_opus-5-no-thinking

Generated: 2026-09-23T06:40:18+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-ptdd-v1-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 999s |
| Started | 2026-09-23T06:23:37+00:00 |
| Ended | 2026-09-23T06:40:18+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 301
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 688
- **Active tests**: 53
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (53 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-23_06-23-37_claim-office-example-mapping_exact-ptdd-v1-cc_opus-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-23_06-23-37_claim-office-example-mapping_exact-ptdd-v1-cc_opus-5-no-thinking

 ✓ src/claim-office.spec.ts  (53 tests) 3553ms

 Test Files  1 passed (1)
      Tests  53 passed (53)
   Start at  06:40:19
   Duration  3.89s (transform 107ms, setup 1ms, collect 100ms, tests 3.55s, environment 0ms, prepare 71ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 90% |
| Branches | 92% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 68 | ×1 | 68 |
| Invocations | 121 | ×2 | 242 |
| Conditionals | 17 | ×4 | 68 |
| Loops | 10 | ×5 | 50 |
| Assignments | 53 | ×6 | 318 |
| **Total Mass** | | | **746** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 243 |
| Functions | 30 |
| Longest Function | 15 lines |
| Avg LOC/Function | 5.63 |
| Median LOC/Function | 5.00 |
| Imports | 1 |

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
| McCabe (Cyclomatic) | 3 | 1.43 | 0 |
| Cognitive (SonarJS) | 2 | 1.19 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 17816439 |
| Context Utilization | 71% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 47 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 94 |
| Predictions Total | 94 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 47 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 1 |


