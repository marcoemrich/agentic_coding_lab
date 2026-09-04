# Analysis Report: 2026-09-03_23-16-50_claim-office-example-mapping_v10-pocock-tdd_opus-5-no-thinking

Generated: 2026-09-03T23:59:01+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v10-pocock-tdd |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 681s |
| Started | 2026-09-03T23:16:50+00:00 |
| Ended | 2026-09-03T23:28:16+00:00 |

## Code Metrics

- **Implementation files**: cli.ts, node-globals.d.ts, scenario.ts
- **Implementation LOC** (total): 300
- **Test files**: cli.spec.ts, scenario.spec.ts
- **Test LOC** (total): 673
- **Active tests**: 37
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (37 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-03_23-16-50_claim-office-example-mapping_v10-pocock-tdd_opus-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-03_23-16-50_claim-office-example-mapping_v10-pocock-tdd_opus-5-no-thinking

 ✓ src/scenario.spec.ts  (34 tests) 10ms
 ✓ src/cli.spec.ts  (3 tests) 2061ms

 Test Files  2 passed (2)
      Tests  37 passed (37)
   Start at  23:59:02
   Duration  2.54s (transform 161ms, setup 0ms, collect 188ms, tests 2.07s, environment 0ms, prepare 287ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 89% |
| Branches | 97% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 60 | ×1 | 60 |
| Invocations | 67 | ×2 | 134 |
| Conditionals | 16 | ×4 | 64 |
| Loops | 10 | ×5 | 50 |
| Assignments | 51 | ×6 | 306 |
| **Total Mass** | | | **614** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 246 |
| Functions | 10 |
| Longest Function | 30 lines |
| Avg LOC/Function | 12.20 |
| Median LOC/Function | 9.50 |
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
| McCabe (Cyclomatic) | 7 | 2.36 | 0 |
| Cognitive (SonarJS) | 10 | 3.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 13356675 |
| Context Utilization | 55% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 34 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | N/A |
| Predictions Total | N/A |
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


