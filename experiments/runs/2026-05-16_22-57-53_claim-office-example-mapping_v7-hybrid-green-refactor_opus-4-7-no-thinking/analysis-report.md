# Analysis Report: 2026-05-16_22-57-53_claim-office-example-mapping_v7-hybrid-green-refactor_opus-4-7-no-thinking

Generated: 2026-05-16T23:35:49+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v7-hybrid-green-refactor |
| Model | opus-4-7-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 2275s |
| Started | 2026-05-16T22:57:53+00:00 |
| Ended | 2026-05-16T23:35:49+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 261
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 530
- **Active tests**: 30
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (30 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-16_22-57-53_claim-office-example-mapping_v7-hybrid-green-refactor_opus-4-7-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-16_22-57-53_claim-office-example-mapping_v7-hybrid-green-refactor_opus-4-7-no-thinking

 ✓ src/claim-office.spec.ts  (30 tests) 6ms

 Test Files  1 passed (1)
      Tests  30 passed (30)
   Start at  23:35:49
   Duration  174ms (transform 43ms, setup 0ms, collect 42ms, tests 6ms, environment 0ms, prepare 42ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 90% |
| Branches | 86% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 55 | ×1 | 55 |
| Invocations | 64 | ×2 | 128 |
| Conditionals | 14 | ×4 | 56 |
| Loops | 8 | ×5 | 40 |
| Assignments | 88 | ×6 | 528 |
| **Total Mass** | | | **807** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 225 |
| Functions | 19 |
| Longest Function | 19 lines |
| Avg LOC/Function | 4.84 |
| Median LOC/Function | 2.00 |
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
| McCabe (Cyclomatic) | 6 | 2.24 | 0 |
| Cognitive (SonarJS) | 4 | 1.81 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 22705851 |
| Context Utilization | 17% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 30 |
| Avg Cycle Time | 128.53s |
| Avg Red Phase | 31.21s |
| Avg Green Phase | 33.56s |
| Avg Refactor Phase | 63.76s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 42 |
| Predictions Total | 42 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 9 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 9 |


