# Analysis Report: 2026-10-01_01-34-46_claim-office-example-mapping_external-superpowers-2026-09-04-cc_opus-5-5-no-thinking

Generated: 2026-10-01T01:40:32+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | external-superpowers-2026-09-04-cc |
| Model | opus-5-5-no-thinking |
| Model Version(s) | claude-opus-5-5 |
| Thinking | unknown |
| Duration | 343s |
| Started | 2026-10-01T01:34:46+00:00 |
| Ended | 2026-10-01T01:40:32+00:00 |

## Code Metrics

- **Implementation files**: catalog.ts, cli.ts, policy.ts, quote.ts, scenario.ts
- **Implementation LOC** (total): 209
- **Test files**: cli.spec.ts, policy.spec.ts, quote.spec.ts, scenario.spec.ts
- **Test LOC** (total): 281
- **Active tests**: 30
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (47 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-10-01_01-34-46_claim-office-example-mapping_external-superpowers-2026-09-04-cc_opus-5-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-10-01_01-34-46_claim-office-example-mapping_external-superpowers-2026-09-04-cc_opus-5-5-no-thinking

 ✓ src/policy.spec.ts  (20 tests) 6ms
 ✓ src/quote.spec.ts  (21 tests) 6ms
 ✓ src/scenario.spec.ts  (3 tests) 4ms
 ✓ src/cli.spec.ts  (3 tests) 494ms

 Test Files  4 passed (4)
      Tests  47 passed (47)
   Start at  01:40:33
   Duration  1.59s (transform 150ms, setup 0ms, collect 154ms, tests 510ms, environment 1ms, prepare 316ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 92% |
| Branches | 98% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 55 | ×1 | 55 |
| Invocations | 92 | ×2 | 184 |
| Conditionals | 17 | ×4 | 68 |
| Loops | 12 | ×5 | 60 |
| Assignments | 51 | ×6 | 306 |
| **Total Mass** | | | **673** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 169 |
| Functions | 15 |
| Longest Function | 14 lines |
| Avg LOC/Function | 5.20 |
| Median LOC/Function | 3.00 |
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
| McCabe (Cyclomatic) | 4 | 1.64 | 0 |
| Cognitive (SonarJS) | 3 | 1.64 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 6587136 |
| Context Utilization | 41% |

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


