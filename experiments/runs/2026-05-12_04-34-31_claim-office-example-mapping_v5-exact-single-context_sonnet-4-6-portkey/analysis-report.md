# Analysis Report: 2026-05-12_04-34-31_claim-office-example-mapping_v5-exact-single-context_sonnet-4-6-portkey

Generated: 2026-05-12T05:34:49+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v5-exact-single-context |
| Model | sonnet-4-6-portkey |
| Model Version(s) | claude-sonnet-4-6 |
| Thinking | true |
| Duration | 3617s |
| Started | 2026-05-12T04:34:31+00:00 |
| Ended | 2026-05-12T05:34:49+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts
- **Implementation LOC** (total): 65
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 132
- **Active tests**: 22
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (22 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-12_04-34-31_claim-office-example-mapping_v5-exact-single-context_sonnet-4-6-portkey
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-12_04-34-31_claim-office-example-mapping_v5-exact-single-context_sonnet-4-6-portkey

 ✓ src/claim-office.spec.ts  (22 tests) 4ms

 Test Files  1 passed (1)
      Tests  22 passed (22)
   Start at  05:34:50
   Duration  159ms (transform 31ms, setup 0ms, collect 28ms, tests 4ms, environment 0ms, prepare 42ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 100% |
| Branches | 91% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 35 | ×1 | 35 |
| Invocations | 8 | ×2 | 16 |
| Conditionals | 10 | ×4 | 40 |
| Loops | 2 | ×5 | 10 |
| Assignments | 36 | ×6 | 216 |
| **Total Mass** | | | **317** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 61 |
| Functions | 6 |
| Longest Function | 2 lines |
| Avg LOC/Function | 1.83 |
| Median LOC/Function | 2.00 |
| Imports | 0 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 1 |
| Code Quality | 0 |
| **Total** | **1** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 4 | 2.83 | 0 |
| Cognitive (SonarJS) | 3 | 1.83 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 48959198 |
| Context Utilization | 17% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 22 |
| Avg Cycle Time | 174.03s |
| Avg Red Phase | 48.4s |
| Avg Green Phase | 41.72s |
| Avg Refactor Phase | 83.91s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 43 |
| Predictions Total | 44 |
| Accuracy | 97% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 21 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 7 |


