# Analysis Report: 2026-09-04_07-27-10_claim-office-example-mapping_v11-superpowers-tdd_opus-5-no-thinking

Generated: 2026-09-04T07:35:43+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v11-superpowers-tdd |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 510s |
| Started | 2026-09-04T07:27:10+00:00 |
| Ended | 2026-09-04T07:35:42+00:00 |

## Code Metrics

- **Implementation files**: claim.ts, cli.ts, premium.ts, scenario.ts
- **Implementation LOC** (total): 259
- **Test files**: claim.spec.ts, cli.spec.ts, premium.spec.ts, scenario.spec.ts
- **Test LOC** (total): 449
- **Active tests**: 49
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (49 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-04_07-27-10_claim-office-example-mapping_v11-superpowers-tdd_opus-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-04_07-27-10_claim-office-example-mapping_v11-superpowers-tdd_opus-5-no-thinking

 ✓ src/claim.spec.ts  (18 tests) 5ms
 ✓ src/premium.spec.ts  (23 tests) 5ms
 ✓ src/cli.spec.ts  (4 tests) 1935ms
 ✓ src/scenario.spec.ts  (4 tests) 3ms

 Test Files  4 passed (4)
      Tests  49 passed (49)
   Start at  07:35:43
   Duration  2.81s (transform 81ms, setup 0ms, collect 113ms, tests 1.95s, environment 1ms, prepare 267ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 91% |
| Branches | 96% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 58 | ×1 | 58 |
| Invocations | 83 | ×2 | 166 |
| Conditionals | 16 | ×4 | 64 |
| Loops | 9 | ×5 | 45 |
| Assignments | 54 | ×6 | 324 |
| **Total Mass** | | | **657** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 208 |
| Functions | 17 |
| Longest Function | 24 lines |
| Avg LOC/Function | 7.06 |
| Median LOC/Function | 5.00 |
| Imports | 4 |

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
| McCabe (Cyclomatic) | 6 | 2.09 | 0 |
| Cognitive (SonarJS) | 8 | 2.82 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 12058621 |
| Context Utilization | 52% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 11 |
| Avg Cycle Time | 13.61s |
| Avg Red Phase | 5.61s |
| Avg Green Phase | 4.58s |
| Avg Refactor Phase | 3.42s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | N/A |
| Predictions Total | N/A |
| Accuracy | N/A |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 4 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 1 |


