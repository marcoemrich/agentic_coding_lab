# Analysis Report: 2026-05-18_18-53-30_claim-office-example-mapping_v6.3-no-pep_opus-4-7-no-thinking

Generated: 2026-05-18T19:27:08+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.3-no-pep |
| Model | opus-4-7-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 2017s |
| Started | 2026-05-18T18:53:30+00:00 |
| Ended | 2026-05-18T19:27:08+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 254
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 579
- **Active tests**: 33
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (33 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-18_18-53-30_claim-office-example-mapping_v6.3-no-pep_opus-4-7-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-18_18-53-30_claim-office-example-mapping_v6.3-no-pep_opus-4-7-no-thinking

 ✓ src/claim-office.spec.ts  (33 tests) 6ms

 Test Files  1 passed (1)
      Tests  33 passed (33)
   Start at  19:27:08
   Duration  175ms (transform 38ms, setup 0ms, collect 40ms, tests 6ms, environment 0ms, prepare 43ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 90% |
| Branches | 92% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 52 | ×1 | 52 |
| Invocations | 66 | ×2 | 132 |
| Conditionals | 17 | ×4 | 68 |
| Loops | 6 | ×5 | 30 |
| Assignments | 80 | ×6 | 480 |
| **Total Mass** | | | **762** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 217 |
| Functions | 22 |
| Longest Function | 13 lines |
| Avg LOC/Function | 5.41 |
| Median LOC/Function | 5.00 |
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
| McCabe (Cyclomatic) | 4 | 1.56 | 0 |
| Cognitive (SonarJS) | 3 | 1.50 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 39990060 |
| Context Utilization | 17% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 33 |
| Avg Cycle Time | 107.27s |
| Avg Red Phase | 23.52s |
| Avg Green Phase | 30.44s |
| Avg Refactor Phase | 53.31s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 64 |
| Predictions Total | 65 |
| Accuracy | 98% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 11 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 13 |


