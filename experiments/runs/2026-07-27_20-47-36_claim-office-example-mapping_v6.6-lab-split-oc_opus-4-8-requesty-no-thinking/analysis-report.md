# Analysis Report: 2026-07-27_20-47-36_claim-office-example-mapping_v6.6-lab-split-oc_opus-4-8-requesty-no-thinking

Generated: 2026-07-27T22:47:39+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.6-lab-split-oc |
| Model | opus-4-8-requesty-no-thinking |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 7201s |
| Started | 2026-07-27T20:47:36+00:00 |
| Ended | 2026-07-27T22:47:39+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 320
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 614
- **Active tests**: 36
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (36 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-07-27_20-47-36_claim-office-example-mapping_v6.6-lab-split-oc_opus-4-8-requesty-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-07-27_20-47-36_claim-office-example-mapping_v6.6-lab-split-oc_opus-4-8-requesty-no-thinking

 ✓ src/claim-office.spec.ts  (36 tests) 6ms

 Test Files  1 passed (1)
      Tests  36 passed (36)
   Start at  22:47:40
   Duration  182ms (transform 40ms, setup 0ms, collect 39ms, tests 6ms, environment 0ms, prepare 43ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 89% |
| Branches | 95% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 61 | ×1 | 61 |
| Invocations | 86 | ×2 | 172 |
| Conditionals | 9 | ×4 | 36 |
| Loops | 12 | ×5 | 60 |
| Assignments | 87 | ×6 | 522 |
| **Total Mass** | | | **851** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 256 |
| Functions | 28 |
| Longest Function | 12 lines |
| Avg LOC/Function | 4.14 |
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
| McCabe (Cyclomatic) | 4 | 1.65 | 0 |
| Cognitive (SonarJS) | 4 | 1.87 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 34014546 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 36 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 71 |
| Predictions Total | 71 |
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


