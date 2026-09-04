# Analysis Report: 2026-09-04_06-20-44_claim-office-example-mapping_v6.1.1-lab-split-cc_opus-5-no-thinking

Generated: 2026-09-04T07:07:23+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.1.1-lab-split-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 2796s |
| Started | 2026-09-04T06:20:44+00:00 |
| Ended | 2026-09-04T07:07:23+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 383
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 842
- **Active tests**: 45
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (44 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-04_06-20-44_claim-office-example-mapping_v6.1.1-lab-split-cc_opus-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-04_06-20-44_claim-office-example-mapping_v6.1.1-lab-split-cc_opus-5-no-thinking

 ✓ src/claim-office.spec.ts  (44 tests) 1069ms

 Test Files  1 passed (1)
      Tests  44 passed (44)
   Start at  07:07:24
   Duration  1.38s (transform 99ms, setup 0ms, collect 96ms, tests 1.07s, environment 0ms, prepare 72ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 94% |
| Branches | 98% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 64 | ×1 | 64 |
| Invocations | 87 | ×2 | 174 |
| Conditionals | 16 | ×4 | 64 |
| Loops | 17 | ×5 | 85 |
| Assignments | 96 | ×6 | 576 |
| **Total Mass** | | | **963** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 243 |
| Functions | 35 |
| Longest Function | 25 lines |
| Avg LOC/Function | 3.97 |
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
| McCabe (Cyclomatic) | 4 | 1.51 | 0 |
| Cognitive (SonarJS) | 3 | 1.92 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 96282703 |
| Context Utilization | 182% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 44 |
| Avg Cycle Time | 104.34s |
| Avg Red Phase | 19.43s |
| Avg Green Phase | 24.47s |
| Avg Refactor Phase | 60.44s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 86 |
| Predictions Total | 88 |
| Accuracy | 97% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 22 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 21 |


