# Analysis Report: 2026-09-04_07-16-22_claim-office-example-mapping_v10-pocock-tdd_opus-5-no-thinking

Generated: 2026-09-04T07:26:45+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v10-pocock-tdd |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 621s |
| Started | 2026-09-04T07:16:22+00:00 |
| Ended | 2026-09-04T07:26:45+00:00 |

## Code Metrics

- **Implementation files**: cli.ts, scenario.ts
- **Implementation LOC** (total): 286
- **Test files**: cli.spec.ts, scenario.spec.ts
- **Test LOC** (total): 571
- **Active tests**: 35
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (38 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-04_07-16-22_claim-office-example-mapping_v10-pocock-tdd_opus-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-04_07-16-22_claim-office-example-mapping_v10-pocock-tdd_opus-5-no-thinking

 ✓ src/scenario.spec.ts  (36 tests) 12ms
 ✓ src/cli.spec.ts  (2 tests) 1019ms

 Test Files  2 passed (2)
      Tests  38 passed (38)
   Start at  07:26:46
   Duration  1.56s (transform 99ms, setup 0ms, collect 117ms, tests 1.03s, environment 0ms, prepare 139ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 89% |
| Branches | 97% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 58 | ×1 | 58 |
| Invocations | 82 | ×2 | 164 |
| Conditionals | 16 | ×4 | 64 |
| Loops | 14 | ×5 | 70 |
| Assignments | 56 | ×6 | 336 |
| **Total Mass** | | | **692** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 236 |
| Functions | 14 |
| Longest Function | 25 lines |
| Avg LOC/Function | 9.71 |
| Median LOC/Function | 7.50 |
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
| McCabe (Cyclomatic) | 4 | 1.96 | 0 |
| Cognitive (SonarJS) | 4 | 2.08 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 13121755 |
| Context Utilization | 54% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 39 |
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


