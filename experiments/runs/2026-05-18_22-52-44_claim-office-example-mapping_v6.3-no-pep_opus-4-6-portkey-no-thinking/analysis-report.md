# Analysis Report: 2026-05-18_22-52-44_claim-office-example-mapping_v6.3-no-pep_opus-4-6-portkey-no-thinking

Generated: 2026-05-18T23:43:13+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.3-no-pep |
| Model | opus-4-6-portkey-no-thinking |
| Model Version(s) | claude-opus-4-6 |
| Thinking | unknown |
| Duration | 3028s |
| Started | 2026-05-18T22:52:44+00:00 |
| Ended | 2026-05-18T23:43:13+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 199
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 664
- **Active tests**: 38
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (38 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-18_22-52-44_claim-office-example-mapping_v6.3-no-pep_opus-4-6-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-18_22-52-44_claim-office-example-mapping_v6.3-no-pep_opus-4-6-portkey-no-thinking

 ✓ src/claim-office.spec.ts  (38 tests) 7ms

 Test Files  1 passed (1)
      Tests  38 passed (38)
   Start at  23:43:13
   Duration  214ms (transform 61ms, setup 0ms, collect 60ms, tests 7ms, environment 0ms, prepare 50ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 89% |
| Branches | 96% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 56 | ×1 | 56 |
| Invocations | 75 | ×2 | 150 |
| Conditionals | 12 | ×4 | 48 |
| Loops | 8 | ×5 | 40 |
| Assignments | 66 | ×6 | 396 |
| **Total Mass** | | | **690** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 172 |
| Functions | 11 |
| Longest Function | 17 lines |
| Avg LOC/Function | 8.45 |
| Median LOC/Function | 10.00 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 1 |
| Duplication | 0 |
| Magic Numbers | 1 |
| Code Quality | 0 |
| **Total** | **2** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 5 | 2.44 | 0 |
| Cognitive (SonarJS) | 5 | 3.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 46689935 |
| Context Utilization | 83% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 32 |
| Avg Cycle Time | 165.06s |
| Avg Red Phase | 31.07s |
| Avg Green Phase | 34.31s |
| Avg Refactor Phase | 99.68s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 64 |
| Predictions Total | 64 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 13 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 13 |


