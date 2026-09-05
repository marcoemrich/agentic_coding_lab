# Analysis Report: 2026-09-05_09-40-45_claim-office-example-mapping_v6.1.5-pure-split-cc_opus-5-no-thinking

Generated: 2026-09-05T10:52:39+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.1.5-pure-split-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 4311s |
| Started | 2026-09-05T09:40:45+00:00 |
| Ended | 2026-09-05T10:52:39+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 558
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 962
- **Active tests**: 51
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (51 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-05_09-40-45_claim-office-example-mapping_v6.1.5-pure-split-cc_opus-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-05_09-40-45_claim-office-example-mapping_v6.1.5-pure-split-cc_opus-5-no-thinking

 ✓ src/claim-office.spec.ts  (51 tests) 950ms

 Test Files  1 passed (1)
      Tests  51 passed (51)
   Start at  10:52:40
   Duration  1.25s (transform 82ms, setup 0ms, collect 93ms, tests 950ms, environment 0ms, prepare 69ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 93% |
| Branches | 92% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 62 | ×1 | 62 |
| Invocations | 109 | ×2 | 218 |
| Conditionals | 15 | ×4 | 60 |
| Loops | 19 | ×5 | 95 |
| Assignments | 128 | ×6 | 768 |
| **Total Mass** | | | **1203** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 344 |
| Functions | 43 |
| Longest Function | 15 lines |
| Avg LOC/Function | 3.33 |
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
| McCabe (Cyclomatic) | 4 | 1.40 | 0 |
| Cognitive (SonarJS) | 3 | 1.36 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 150370457 |
| Context Utilization | 238% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 49 |
| Avg Cycle Time | 119.58s |
| Avg Red Phase | 27.29s |
| Avg Green Phase | 30.65s |
| Avg Refactor Phase | 61.64s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 97 |
| Predictions Total | 98 |
| Accuracy | 98% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 36 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 26 |


