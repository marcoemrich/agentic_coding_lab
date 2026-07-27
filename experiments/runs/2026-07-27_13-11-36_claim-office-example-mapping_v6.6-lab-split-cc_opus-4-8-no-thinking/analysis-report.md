# Analysis Report: 2026-07-27_13-11-36_claim-office-example-mapping_v6.6-lab-split-cc_opus-4-8-no-thinking

Generated: 2026-07-27T14:10:14+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.6-lab-split-cc |
| Model | opus-4-8-no-thinking |
| Model Version(s) | claude-opus-4-8 |
| Thinking | unknown |
| Duration | 3517s |
| Started | 2026-07-27T13:11:36+00:00 |
| Ended | 2026-07-27T14:10:14+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts, scenario.ts
- **Implementation LOC** (total): 306
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 295
- **Active tests**: 47
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (51 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-07-27_13-11-36_claim-office-example-mapping_v6.6-lab-split-cc_opus-4-8-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-07-27_13-11-36_claim-office-example-mapping_v6.6-lab-split-cc_opus-4-8-no-thinking

 ✓ src/claim-office.spec.ts  (47 tests) 7ms
 ✓ src/scenario.spec.ts  (4 tests) 3ms

 Test Files  2 passed (2)
      Tests  51 passed (51)
   Start at  14:10:14
   Duration  328ms (transform 44ms, setup 0ms, collect 50ms, tests 10ms, environment 0ms, prepare 93ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 87% |
| Branches | 95% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 59 | ×1 | 59 |
| Invocations | 92 | ×2 | 184 |
| Conditionals | 11 | ×4 | 44 |
| Loops | 7 | ×5 | 35 |
| Assignments | 93 | ×6 | 558 |
| **Total Mass** | | | **880** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 248 |
| Functions | 34 |
| Longest Function | 21 lines |
| Avg LOC/Function | 4.06 |
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
| McCabe (Cyclomatic) | 5 | 1.59 | 0 |
| Cognitive (SonarJS) | 5 | 2.15 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 101769903 |
| Context Utilization | 171% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 51 |
| Avg Cycle Time | 113.27s |
| Avg Red Phase | 25.71s |
| Avg Green Phase | 30.8s |
| Avg Refactor Phase | 56.76s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 102 |
| Predictions Total | 104 |
| Accuracy | 98% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 22 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 28 |


