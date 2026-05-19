# Analysis Report: 2026-05-19_06-49-45_claim-office-example-mapping_v6-hybrid_opus-4-6-portkey-no-thinking-3

Generated: 2026-05-19T07:38:19+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6-hybrid |
| Model | opus-4-6-portkey-no-thinking |
| Model Version(s) | claude-opus-4-6 |
| Thinking | unknown |
| Duration | 2911s |
| Started | 2026-05-19T06:49:45+00:00 |
| Ended | 2026-05-19T07:38:19+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 138
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 594
- **Active tests**: 34
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (34 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-19_06-49-45_claim-office-example-mapping_v6-hybrid_opus-4-6-portkey-no-thinking-3
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-19_06-49-45_claim-office-example-mapping_v6-hybrid_opus-4-6-portkey-no-thinking-3

 ✓ src/claim-office.spec.ts  (34 tests) 8ms

 Test Files  1 passed (1)
      Tests  34 passed (34)
   Start at  07:38:20
   Duration  241ms (transform 57ms, setup 0ms, collect 59ms, tests 8ms, environment 0ms, prepare 61ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 92% |
| Branches | 95% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 56 | ×1 | 56 |
| Invocations | 45 | ×2 | 90 |
| Conditionals | 13 | ×4 | 52 |
| Loops | 8 | ×5 | 40 |
| Assignments | 68 | ×6 | 408 |
| **Total Mass** | | | **646** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 123 |
| Functions | 9 |
| Longest Function | 28 lines |
| Avg LOC/Function | 9.56 |
| Median LOC/Function | 6.00 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 1 |
| Duplication | 0 |
| Magic Numbers | 1 |
| Code Quality | 0 |
| **Total** | **2** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 10 | 2.40 | 0 |
| Cognitive (SonarJS) | 13 | 4.14 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 447509 |
| Context Utilization | 22% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 0 |
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


