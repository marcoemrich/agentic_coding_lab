# Analysis Report: 2026-07-27_15-46-00_claim-office-example-mapping_v6.6-lab-split-oc_opus-4-8-requesty-no-thinking

Generated: 2026-07-27T16:24:33+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.6-lab-split-oc |
| Model | opus-4-8-requesty-no-thinking |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 2312s |
| Started | 2026-07-27T15:46:00+00:00 |
| Ended | 2026-07-27T16:24:33+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 331
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 230
- **Active tests**: 40
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (40 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-07-27_15-46-00_claim-office-example-mapping_v6.6-lab-split-oc_opus-4-8-requesty-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-07-27_15-46-00_claim-office-example-mapping_v6.6-lab-split-oc_opus-4-8-requesty-no-thinking

 ✓ src/claim-office.spec.ts  (40 tests) 6ms

 Test Files  1 passed (1)
      Tests  40 passed (40)
   Start at  16:24:34
   Duration  171ms (transform 34ms, setup 0ms, collect 34ms, tests 6ms, environment 0ms, prepare 43ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 73% |
| Branches | 98% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 73 | ×1 | 73 |
| Invocations | 84 | ×2 | 168 |
| Conditionals | 14 | ×4 | 56 |
| Loops | 15 | ×5 | 75 |
| Assignments | 87 | ×6 | 522 |
| **Total Mass** | | | **894** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 248 |
| Functions | 30 |
| Longest Function | 34 lines |
| Avg LOC/Function | 5.03 |
| Median LOC/Function | 2.00 |
| Imports | 2 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 1 |
| Duplication | 0 |
| Magic Numbers | 0 |
| Code Quality | 0 |
| **Total** | **1** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 5 | 1.44 | 0 |
| Cognitive (SonarJS) | 8 | 2.45 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 35577384 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 40 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 80 |
| Predictions Total | 80 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 21 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


