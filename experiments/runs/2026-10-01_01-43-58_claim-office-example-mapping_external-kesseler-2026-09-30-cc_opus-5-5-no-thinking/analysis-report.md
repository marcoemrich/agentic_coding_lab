# Analysis Report: 2026-10-01_01-43-58_claim-office-example-mapping_external-kesseler-2026-09-30-cc_opus-5-5-no-thinking

Generated: 2026-10-01T01:54:39+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | external-kesseler-2026-09-30-cc |
| Model | opus-5-5-no-thinking |
| Model Version(s) | claude-opus-5-5 |
| Thinking | unknown |
| Duration | 638s |
| Started | 2026-10-01T01:43:58+00:00 |
| Ended | 2026-10-01T01:54:39+00:00 |

## Code Metrics

- **Implementation files**: catalog.ts, cli.ts, percent.ts, policy.ts, premium.ts, scenario.ts
- **Implementation LOC** (total): 208
- **Test files**: cli.spec.ts, policy.spec.ts, premium.spec.ts, scenario.spec.ts
- **Test LOC** (total): 465
- **Active tests**: 43
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (55 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-10-01_01-43-58_claim-office-example-mapping_external-kesseler-2026-09-30-cc_opus-5-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-10-01_01-43-58_claim-office-example-mapping_external-kesseler-2026-09-30-cc_opus-5-5-no-thinking

 ✓ src/policy.spec.ts  (22 tests) 6ms
 ✓ src/premium.spec.ts  (25 tests) 7ms
 ✓ src/cli.spec.ts  (5 tests) 783ms
 ✓ src/scenario.spec.ts  (3 tests) 3ms

 Test Files  4 passed (4)
      Tests  55 passed (55)
   Start at  01:54:40
   Duration  1.65s (transform 83ms, setup 0ms, collect 112ms, tests 799ms, environment 1ms, prepare 264ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 92% |
| Branches | 97% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 59 | ×1 | 59 |
| Invocations | 68 | ×2 | 136 |
| Conditionals | 14 | ×4 | 56 |
| Loops | 6 | ×5 | 30 |
| Assignments | 48 | ×6 | 288 |
| **Total Mass** | | | **569** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 183 |
| Functions | 10 |
| Longest Function | 16 lines |
| Avg LOC/Function | 8.40 |
| Median LOC/Function | 8.00 |
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
| McCabe (Cyclomatic) | 6 | 1.95 | 0 |
| Cognitive (SonarJS) | 6 | 2.11 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 14605015 |
| Context Utilization | 50% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 81 |
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


