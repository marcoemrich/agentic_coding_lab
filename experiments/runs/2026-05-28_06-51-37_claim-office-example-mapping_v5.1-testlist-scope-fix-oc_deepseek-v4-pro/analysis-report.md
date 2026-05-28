# Analysis Report: 2026-05-28_06-51-37_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_deepseek-v4-pro

Generated: 2026-05-28T07:15:30+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v5.1-testlist-scope-fix-oc |
| Model | deepseek-v4-pro |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 1431s |
| Started | 2026-05-28T06:51:37+00:00 |
| Ended | 2026-05-28T07:15:30+00:00 |

## Code Metrics

- **Implementation files**: cli.ts, process-scenario.ts
- **Implementation LOC** (total): 189
- **Test file**: process-scenario.spec.ts
- **Test file LOC**: 380
- **Active tests**: 40
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (40 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-28_06-51-37_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_deepseek-v4-pro
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-28_06-51-37_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_deepseek-v4-pro

 ✓ src/process-scenario.spec.ts  (40 tests) 6ms

 Test Files  1 passed (1)
      Tests  40 passed (40)
   Start at  07:15:30
   Duration  218ms (transform 68ms, setup 0ms, collect 69ms, tests 6ms, environment 0ms, prepare 47ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 85% |
| Branches | 91% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 69 | ×1 | 69 |
| Invocations | 70 | ×2 | 140 |
| Conditionals | 18 | ×4 | 72 |
| Loops | 12 | ×5 | 60 |
| Assignments | 51 | ×6 | 306 |
| **Total Mass** | | | **647** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 155 |
| Functions | 8 |
| Longest Function | 47 lines |
| Avg LOC/Function | 19.00 |
| Median LOC/Function | 19.00 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 4 |
| Duplication | 0 |
| Magic Numbers | 19 |
| Code Quality | 0 |
| **Total** | **23** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 15 | 5.00 | 1 |
| Cognitive (SonarJS) | 16 | 8.33 | 3 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 4659874 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 3 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 4 |
| Predictions Total | 4 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 1 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


