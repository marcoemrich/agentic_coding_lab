# Analysis Report: 2026-05-15_10-42-09_claim-office-example-mapping_v6-hybrid_opus-4-7-no-thinking

Generated: 2026-05-15T11:25:53+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6-hybrid |
| Model | opus-4-7-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 2623s |
| Started | 2026-05-15T10:42:09+00:00 |
| Ended | 2026-05-15T11:25:53+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 252
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 391
- **Active tests**: 37
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (37 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-15_10-42-09_claim-office-example-mapping_v6-hybrid_opus-4-7-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-15_10-42-09_claim-office-example-mapping_v6-hybrid_opus-4-7-no-thinking

 ✓ src/claim-office.spec.ts  (37 tests) 5ms

 Test Files  1 passed (1)
      Tests  37 passed (37)
   Start at  11:25:53
   Duration  187ms (transform 38ms, setup 0ms, collect 38ms, tests 5ms, environment 0ms, prepare 50ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 72% |
| Branches | 93% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 64 | ×1 | 64 |
| Invocations | 87 | ×2 | 174 |
| Conditionals | 17 | ×4 | 68 |
| Loops | 11 | ×5 | 55 |
| Assignments | 93 | ×6 | 558 |
| **Total Mass** | | | **919** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 214 |
| Functions | 24 |
| Longest Function | 29 lines |
| Avg LOC/Function | 5.08 |
| Median LOC/Function | 2.00 |
| Imports | 2 |

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
| McCabe (Cyclomatic) | 5 | 1.70 | 0 |
| Cognitive (SonarJS) | 5 | 1.87 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 37191950 |
| Context Utilization | 17% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 33 |
| Avg Cycle Time | 145.30s |
| Avg Red Phase | 27.41s |
| Avg Green Phase | 36.45s |
| Avg Refactor Phase | 81.44s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 50 |
| Predictions Total | 50 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 10 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 10 |


