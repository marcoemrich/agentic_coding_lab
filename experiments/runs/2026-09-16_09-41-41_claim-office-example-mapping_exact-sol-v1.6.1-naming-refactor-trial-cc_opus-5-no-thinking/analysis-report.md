# Analysis Report: 2026-09-16_09-41-41_claim-office-example-mapping_exact-sol-v1.6.1-naming-refactor-trial-cc_opus-5-no-thinking

Generated: 2026-09-16T09:59:16+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-sol-v1.6.1-naming-refactor-trial-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 1053s |
| Started | 2026-09-16T09:41:41+00:00 |
| Ended | 2026-09-16T09:59:16+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts, scenario.ts
- **Implementation LOC** (total): 277
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 397
- **Active tests**: 51
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (51 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-16_09-41-41_claim-office-example-mapping_exact-sol-v1.6.1-naming-refactor-trial-cc_opus-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-16_09-41-41_claim-office-example-mapping_exact-sol-v1.6.1-naming-refactor-trial-cc_opus-5-no-thinking

 ✓ src/claim-office.spec.ts  (51 tests) 3561ms

 Test Files  1 passed (1)
      Tests  51 passed (51)
   Start at  09:59:17
   Duration  3.85s (transform 76ms, setup 0ms, collect 81ms, tests 3.56s, environment 0ms, prepare 67ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 72% |
| Branches | 88% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 62 | ×1 | 62 |
| Invocations | 94 | ×2 | 188 |
| Conditionals | 15 | ×4 | 60 |
| Loops | 9 | ×5 | 45 |
| Assignments | 55 | ×6 | 330 |
| **Total Mass** | | | **685** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 233 |
| Functions | 23 |
| Longest Function | 22 lines |
| Avg LOC/Function | 6.39 |
| Median LOC/Function | 6.00 |
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
| McCabe (Cyclomatic) | 4 | 1.52 | 0 |
| Cognitive (SonarJS) | 3 | 1.55 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 16002057 |
| Context Utilization | 70% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 1 |
| Avg Cycle Time | 2.72s |
| Avg Red Phase | 2.72s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 55 |
| Predictions Total | 58 |
| Accuracy | 94% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 30 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 1 |


