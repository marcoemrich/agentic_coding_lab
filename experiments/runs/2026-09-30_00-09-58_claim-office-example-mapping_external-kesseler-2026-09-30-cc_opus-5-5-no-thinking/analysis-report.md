# Analysis Report: 2026-09-30_00-09-58_claim-office-example-mapping_external-kesseler-2026-09-30-cc_opus-5-5-no-thinking

Generated: 2026-09-30T00:25:21+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | external-kesseler-2026-09-30-cc |
| Model | opus-5-5-no-thinking |
| Model Version(s) | claude-opus-5-5 |
| Thinking | unknown |
| Duration | 920s |
| Started | 2026-09-30T00:09:58+00:00 |
| Ended | 2026-09-30T00:25:21+00:00 |

## Code Metrics

- **Implementation files**: catalog.ts, claim-office.ts, cli.ts, policy.ts, premium.ts, scenario.ts
- **Implementation LOC** (total): 208
- **Test files**: cli.spec.ts, policy.spec.ts, premium.spec.ts, scenario.spec.ts
- **Test LOC** (total): 485
- **Active tests**: 49
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (59 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-30_00-09-58_claim-office-example-mapping_external-kesseler-2026-09-30-cc_opus-5-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-30_00-09-58_claim-office-example-mapping_external-kesseler-2026-09-30-cc_opus-5-5-no-thinking

 ✓ src/premium.spec.ts  (24 tests) 5ms
 ✓ src/policy.spec.ts  (24 tests) 7ms
 ✓ src/cli.spec.ts  (5 tests) 315ms
 ✓ src/scenario.spec.ts  (6 tests) 4ms

 Test Files  4 passed (4)
      Tests  59 passed (59)
   Start at  00:25:22
   Duration  1.23s (transform 108ms, setup 0ms, collect 133ms, tests 331ms, environment 1ms, prepare 268ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 96% |
| Branches | 98% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 62 | ×1 | 62 |
| Invocations | 70 | ×2 | 140 |
| Conditionals | 14 | ×4 | 56 |
| Loops | 6 | ×5 | 30 |
| Assignments | 42 | ×6 | 252 |
| **Total Mass** | | | **540** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 174 |
| Functions | 12 |
| Longest Function | 7 lines |
| Avg LOC/Function | 4.17 |
| Median LOC/Function | 4.00 |
| Imports | 8 |

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
| McCabe (Cyclomatic) | 4 | 1.56 | 0 |
| Cognitive (SonarJS) | 3 | 1.67 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 17308696 |
| Context Utilization | 56% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 84 |
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


