# Analysis Report: 2026-07-27_15-05-24_claim-office-example-mapping_v6.6-lab-split-pi_opus-4-8

Generated: 2026-07-27T15:45:43+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.6-lab-split-pi |
| Model | opus-4-8 |
| Model Version(s) | N/A |
| Thinking | true |
| Duration | 2418s |
| Started | 2026-07-27T15:05:24+00:00 |
| Ended | 2026-07-27T15:45:43+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 265
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 523
- **Active tests**: 40
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (40 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-07-27_15-05-24_claim-office-example-mapping_v6.6-lab-split-pi_opus-4-8
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-07-27_15-05-24_claim-office-example-mapping_v6.6-lab-split-pi_opus-4-8

 ✓ src/claim-office.spec.ts  (40 tests) 290ms

 Test Files  1 passed (1)
      Tests  40 passed (40)
   Start at  15:45:44
   Duration  467ms (transform 45ms, setup 0ms, collect 46ms, tests 290ms, environment 0ms, prepare 49ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 89% |
| Branches | 97% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 56 | ×1 | 56 |
| Invocations | 87 | ×2 | 174 |
| Conditionals | 14 | ×4 | 56 |
| Loops | 14 | ×5 | 70 |
| Assignments | 96 | ×6 | 576 |
| **Total Mass** | | | **932** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 221 |
| Functions | 29 |
| Longest Function | 17 lines |
| Avg LOC/Function | 4.93 |
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
| McCabe (Cyclomatic) | 4 | 1.59 | 0 |
| Cognitive (SonarJS) | 4 | 1.65 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 17416865 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 41 |
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
| Refactorings Applied | 24 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


