# Analysis Report: 2026-10-23_01-19-48_claim-office-example-mapping_exact-ptdd-v1-cc_sonnet-5-5-no-thinking

Generated: 2026-10-23T01:39:14+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-ptdd-v1-cc |
| Model | sonnet-5-5-no-thinking |
| Model Version(s) | claude-sonnet-5-5 |
| Thinking | unknown |
| Duration | 1159s |
| Started | 2026-10-23T01:19:48+00:00 |
| Ended | 2026-10-23T01:39:14+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, claim.ts, cli.ts, price-list.ts, quote.ts
- **Implementation LOC** (total): 196
- **Test files**: claim-office.spec.ts, cli.spec.ts
- **Test LOC** (total): 278
- **Active tests**: 54
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (54 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-10-23_01-19-48_claim-office-example-mapping_exact-ptdd-v1-cc_sonnet-5-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-10-23_01-19-48_claim-office-example-mapping_exact-ptdd-v1-cc_sonnet-5-5-no-thinking

 ✓ src/claim-office.spec.ts  (51 tests) 11ms
 ✓ src/cli.spec.ts  (3 tests) 514ms

 Test Files  2 passed (2)
      Tests  54 passed (54)
   Start at  01:39:15
   Duration  1.12s (transform 109ms, setup 0ms, collect 115ms, tests 525ms, environment 0ms, prepare 166ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 92% |
| Branches | 98% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 59 | ×1 | 59 |
| Invocations | 79 | ×2 | 158 |
| Conditionals | 11 | ×4 | 44 |
| Loops | 6 | ×5 | 30 |
| Assignments | 51 | ×6 | 306 |
| **Total Mass** | | | **597** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 164 |
| Functions | 22 |
| Longest Function | 14 lines |
| Avg LOC/Function | 4.55 |
| Median LOC/Function | 3.00 |
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
| McCabe (Cyclomatic) | 4 | 1.37 | 0 |
| Cognitive (SonarJS) | 3 | 1.38 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 36016561 |
| Context Utilization | 92% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 1 |
| Avg Cycle Time | 22.18s |
| Avg Red Phase | 13.13s |
| Avg Green Phase | 8.4s |
| Avg Refactor Phase | 0.65s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 1 |
| Predictions Total | 2 |
| Accuracy | 50% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 1 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


