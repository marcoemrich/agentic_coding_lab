# Analysis Report: 2026-05-30_07-28-07_claim-office-example-mapping_v6.5-end-refactor_opus-4-8-no-thinking

Generated: 2026-05-30T08:19:00+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.5-end-refactor |
| Model | opus-4-8-no-thinking |
| Model Version(s) | claude-opus-4-8 |
| Thinking | unknown |
| Duration | 3052s |
| Started | 2026-05-30T07:28:07+00:00 |
| Ended | 2026-05-30T08:19:00+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 417
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 391
- **Active tests**: 36
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (36 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-30_07-28-07_claim-office-example-mapping_v6.5-end-refactor_opus-4-8-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-30_07-28-07_claim-office-example-mapping_v6.5-end-refactor_opus-4-8-no-thinking

 ✓ src/claim-office.spec.ts  (36 tests) 6ms

 Test Files  1 passed (1)
      Tests  36 passed (36)
   Start at  08:19:01
   Duration  191ms (transform 42ms, setup 0ms, collect 42ms, tests 6ms, environment 0ms, prepare 51ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 71% |
| Branches | 96% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 84 | ×1 | 84 |
| Invocations | 99 | ×2 | 198 |
| Conditionals | 10 | ×4 | 40 |
| Loops | 13 | ×5 | 65 |
| Assignments | 101 | ×6 | 606 |
| **Total Mass** | | | **993** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 290 |
| Functions | 29 |
| Longest Function | 21 lines |
| Avg LOC/Function | 4.28 |
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
| McCabe (Cyclomatic) | 3 | 1.43 | 0 |
| Cognitive (SonarJS) | 3 | 1.18 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 73892681 |
| Context Utilization | 171% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 36 |
| Avg Cycle Time | 116.72s |
| Avg Red Phase | 23.39s |
| Avg Green Phase | 29.11s |
| Avg Refactor Phase | 64.22s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 71 |
| Predictions Total | 72 |
| Accuracy | 98% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 23 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 18 |


