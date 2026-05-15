# Analysis Report: 2026-05-15_10-11-23_claim-office-example-mapping_v6-hybrid_opus-4-7-no-thinking

Generated: 2026-05-15T10:41:53+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6-hybrid |
| Model | opus-4-7-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 1829s |
| Started | 2026-05-15T10:11:23+00:00 |
| Ended | 2026-05-15T10:41:53+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 219
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 447
- **Active tests**: 36
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (36 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-15_10-11-23_claim-office-example-mapping_v6-hybrid_opus-4-7-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-15_10-11-23_claim-office-example-mapping_v6-hybrid_opus-4-7-no-thinking

 ✓ src/claim-office.spec.ts  (36 tests) 7ms

 Test Files  1 passed (1)
      Tests  36 passed (36)
   Start at  10:41:53
   Duration  181ms (transform 40ms, setup 0ms, collect 50ms, tests 7ms, environment 0ms, prepare 41ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 89% |
| Branches | 95% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 57 | ×1 | 57 |
| Invocations | 78 | ×2 | 156 |
| Conditionals | 11 | ×4 | 44 |
| Loops | 12 | ×5 | 60 |
| Assignments | 87 | ×6 | 522 |
| **Total Mass** | | | **839** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 184 |
| Functions | 22 |
| Longest Function | 16 lines |
| Avg LOC/Function | 5.41 |
| Median LOC/Function | 3.00 |
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
| McCabe (Cyclomatic) | 4 | 1.73 | 0 |
| Cognitive (SonarJS) | 3 | 2.08 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 30336221 |
| Context Utilization | 17% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 23 |
| Avg Cycle Time | 125.07s |
| Avg Red Phase | 25.14s |
| Avg Green Phase | 19.47s |
| Avg Refactor Phase | 80.46s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 23 |
| Predictions Total | 23 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 12 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 11 |


