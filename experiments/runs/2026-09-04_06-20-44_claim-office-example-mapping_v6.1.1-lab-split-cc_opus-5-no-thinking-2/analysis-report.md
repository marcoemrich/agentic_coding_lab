# Analysis Report: 2026-09-04_06-20-44_claim-office-example-mapping_v6.1.1-lab-split-cc_opus-5-no-thinking-2

Generated: 2026-09-04T07:59:31+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.1.1-lab-split-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 5923s |
| Started | 2026-09-04T06:20:44+00:00 |
| Ended | 2026-09-04T07:59:30+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 401
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 945
- **Active tests**: 47
- **Remaining todos**: 4

## Test Results

**Status**: ✅ All tests passing (47 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-04_06-20-44_claim-office-example-mapping_v6.1.1-lab-split-cc_opus-5-no-thinking-2
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-04_06-20-44_claim-office-example-mapping_v6.1.1-lab-split-cc_opus-5-no-thinking-2

 ✓ src/claim-office.spec.ts  (51 tests | 4 skipped) 1456ms

 Test Files  1 passed (1)
      Tests  47 passed | 4 todo (51)
   Start at  07:59:32
   Duration  1.77s (transform 97ms, setup 0ms, collect 87ms, tests 1.46s, environment 0ms, prepare 83ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 94% |
| Branches | 96% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 64 | ×1 | 64 |
| Invocations | 64 | ×2 | 128 |
| Conditionals | 15 | ×4 | 60 |
| Loops | 7 | ×5 | 35 |
| Assignments | 81 | ×6 | 486 |
| **Total Mass** | | | **773** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 258 |
| Functions | 27 |
| Longest Function | 15 lines |
| Avg LOC/Function | 4.26 |
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
| McCabe (Cyclomatic) | 3 | 1.55 | 0 |
| Cognitive (SonarJS) | 2 | 1.21 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 174612025 |
| Context Utilization | 274% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 47 |
| Avg Cycle Time | 124.66s |
| Avg Red Phase | 28.99s |
| Avg Green Phase | 30.7s |
| Avg Refactor Phase | 64.97s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 94 |
| Predictions Total | 94 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 47 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


