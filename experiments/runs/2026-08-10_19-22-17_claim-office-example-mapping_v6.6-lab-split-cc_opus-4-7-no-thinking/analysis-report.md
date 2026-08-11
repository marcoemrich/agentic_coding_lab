# Analysis Report: 2026-08-10_19-22-17_claim-office-example-mapping_v6.6-lab-split-cc_opus-4-7-no-thinking

Generated: 2026-08-10T20:07:48+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.6-lab-split-cc |
| Model | opus-4-7-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 2730s |
| Started | 2026-08-10T19:22:17+00:00 |
| Ended | 2026-08-10T20:07:48+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 185
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 424
- **Active tests**: 43
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (43 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-10_19-22-17_claim-office-example-mapping_v6.6-lab-split-cc_opus-4-7-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-10_19-22-17_claim-office-example-mapping_v6.6-lab-split-cc_opus-4-7-no-thinking

 ✓ src/claim-office.spec.ts  (43 tests) 6ms

 Test Files  1 passed (1)
      Tests  43 passed (43)
   Start at  20:07:48
   Duration  201ms (transform 66ms, setup 0ms, collect 67ms, tests 6ms, environment 0ms, prepare 45ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 88% |
| Branches | 98% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 56 | ×1 | 56 |
| Invocations | 66 | ×2 | 132 |
| Conditionals | 10 | ×4 | 40 |
| Loops | 8 | ×5 | 40 |
| Assignments | 79 | ×6 | 474 |
| **Total Mass** | | | **742** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 155 |
| Functions | 25 |
| Longest Function | 17 lines |
| Avg LOC/Function | 4.52 |
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
| McCabe (Cyclomatic) | 3 | 1.82 | 0 |
| Cognitive (SonarJS) | 4 | 1.69 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 46142910 |
| Context Utilization | 25% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 28 |
| Avg Cycle Time | 132.10s |
| Avg Red Phase | 30.94s |
| Avg Green Phase | 30.68s |
| Avg Refactor Phase | 70.48s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 52 |
| Predictions Total | 53 |
| Accuracy | 98% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 13 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 15 |


